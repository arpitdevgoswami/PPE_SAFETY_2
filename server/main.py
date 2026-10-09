"""
SmartPPE Backend — FastAPI server for real-time PPE & fire/smoke detection.

Provides video streaming, detection results, camera management, and
system metrics to the React frontend.
"""

from __future__ import annotations

import logging
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone

import cv2
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse

from server.config import (
    CORS_ORIGINS,
    JPEG_QUALITY,
    STREAM_FPS,
    LAPTOP_CAMERA_INDEX,
    PHONE_CAMERA_URL,
)
from server.models import model_manager
from server.camera import camera_manager
from server.detection import DetectionWorker
from server.schemas import (
    CameraStatus,
    DetectionResult,
    SystemMetrics,
    StatusResponse,
    ErrorResponse,
)

# ── Logging ────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(name)-22s │ %(levelname)-7s │ %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("smartppe.server")

# ── Detection workers (created at startup) ─────────────────────
detection_workers: dict[str, DetectionWorker] = {}


# ── App lifecycle ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: load models. Shutdown: release everything."""
    logger.info("╔══════════════════════════════════════════╗")
    logger.info("║   SmartPPE Backend — Starting Up         ║")
    logger.info("╚══════════════════════════════════════════╝")

    # Load YOLO models
    model_manager.load()

    # Create detection workers for each camera
    for cam in camera_manager.all_cameras:
        worker = DetectionWorker(cam)
        detection_workers[cam.camera_id] = worker
        worker.start()

    logger.info("Server ready — detection workers running")
    yield

    # Shutdown
    logger.info("Shutting down…")
    for worker in detection_workers.values():
        worker.stop()
    camera_manager.disconnect_all()
    model_manager.unload()
    logger.info("Shutdown complete")


# ── FastAPI app ────────────────────────────────────────────────
app = FastAPI(
    title="SmartPPE Backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ═══════════════════════════════════════════════════════════════
# ENDPOINTS
# ═══════════════════════════════════════════════════════════════


@app.get("/api/status", response_model=StatusResponse)
async def get_status():
    """Overall system health: models loaded, camera states."""
    cameras = []
    for cam in camera_manager.all_cameras:
        cameras.append(CameraStatus(
            camera_id=cam.camera_id,
            label=cam.label,
            connected=cam.connected,
            source=cam.source_label,
            frame_width=cam.frame_width,
            frame_height=cam.frame_height,
            last_frame_time=cam.last_frame_time.isoformat() if cam.last_frame_time else None,
            error=cam.error,
        ))

    both_ok = model_manager.ppe_loaded and model_manager.fire_loaded
    status = "ok" if both_ok else ("degraded" if model_manager.ppe_loaded or model_manager.fire_loaded else "error")

    return StatusResponse(
        status=status,
        ppe_model_loaded=model_manager.ppe_loaded,
        fire_model_loaded=model_manager.fire_loaded,
        ppe_model_classes=model_manager.ppe_classes,
        fire_model_classes=model_manager.fire_classes,
        cameras=cameras,
    )


# ── Camera management ─────────────────────────────────────────

@app.get("/api/cameras", response_model=list[CameraStatus])
async def list_cameras():
    """List all camera sources and their current state."""
    result = []
    for cam in camera_manager.all_cameras:
        result.append(CameraStatus(
            camera_id=cam.camera_id,
            label=cam.label,
            connected=cam.connected,
            source=cam.source_label,
            frame_width=cam.frame_width,
            frame_height=cam.frame_height,
            last_frame_time=cam.last_frame_time.isoformat() if cam.last_frame_time else None,
            error=cam.error,
        ))
    return result


@app.post("/api/cameras/{camera_id}/connect")
async def connect_camera(
    camera_id: str,
    url: str = Query(default=None, description="Stream URL for phone camera"),
    index: int = Query(default=None, description="Device index for webcam"),
):
    """Connect a camera source."""
    cam = camera_manager.get(camera_id)
    if cam is None:
        raise HTTPException(404, f"Unknown camera: {camera_id}")

    if cam.connected:
        return {"message": f"{camera_id} is already connected"}

    if camera_id == "laptop":
        idx = index if index is not None else LAPTOP_CAMERA_INDEX
        success = camera_manager.connect_laptop(idx)
    elif camera_id == "phone":
        if not url and not PHONE_CAMERA_URL:
            raise HTTPException(400, "Phone camera URL is required. Pass ?url=<stream_url>")
        success = camera_manager.connect_phone(url)
    else:
        raise HTTPException(400, f"Cannot connect unknown camera: {camera_id}")

    if success:
        return {"message": f"{camera_id} connected successfully"}
    else:
        raise HTTPException(500, detail=cam.error or "Connection failed")


@app.post("/api/cameras/{camera_id}/disconnect")
async def disconnect_camera(camera_id: str):
    """Disconnect a camera source."""
    cam = camera_manager.get(camera_id)
    if cam is None:
        raise HTTPException(404, f"Unknown camera: {camera_id}")
    cam.disconnect()
    return {"message": f"{camera_id} disconnected"}


# ── Video streaming ────────────────────────────────────────────

def _mjpeg_generator(camera_id: str):
    """Generate MJPEG frames for streaming."""
    cam = camera_manager.get(camera_id)
    if cam is None:
        return

    frame_delay = 1.0 / STREAM_FPS

    while True:
        if not cam.connected:
            time.sleep(0.5)
            continue

        frame, _ = cam.get_frame()
        if frame is None:
            time.sleep(0.1)
            continue

        # Draw detection overlays on the frame
        frame_with_overlay = _draw_detections(frame, camera_id)

        ret, jpeg = cv2.imencode(
            ".jpg", frame_with_overlay,
            [cv2.IMWRITE_JPEG_QUALITY, JPEG_QUALITY],
        )
        if not ret:
            continue

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + jpeg.tobytes()
            + b"\r\n"
        )
        time.sleep(frame_delay)


def _draw_detections(frame, camera_id: str):
    """Draw bounding boxes and labels on a frame copy."""
    import numpy as np
    output = frame.copy()

    worker = detection_workers.get(camera_id)
    if worker is None or worker.latest is None:
        return output

    result = worker.latest

    # PPE colors (BGR)
    COLORS = {
        "person":    (0, 255, 255),
        "helmet":    (0, 255, 0),
        "no_helmet": (0, 0, 255),
        "vest":      (0, 165, 255),
        "boots":     (255, 0, 255),
        "no_boots":  (0, 0, 255),
        "fire":      (0, 0, 255),
        "smoke":     (128, 128, 128),
    }

    # Draw PPE detections
    for det in result.ppe_detections:
        color = COLORS.get(det.class_name, (255, 255, 255))
        cv2.rectangle(output, (det.x1, det.y1), (det.x2, det.y2), color, 2)
        label = f"{det.class_name.upper()} {det.confidence:.2f}"
        (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
        cv2.rectangle(output, (det.x1, det.y1 - th - 6), (det.x1 + tw + 4, det.y1), (20, 20, 20), -1)
        cv2.putText(output, label, (det.x1 + 2, det.y1 - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)

    # Draw fire/smoke detections
    for det in result.fire_smoke_detections:
        color = COLORS.get(det.class_name.lower(), (0, 128, 255))
        cv2.rectangle(output, (det.x1, det.y1), (det.x2, det.y2), color, 3)
        label = f"{det.class_name.upper()} {det.confidence:.2f}"
        (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 2)
        cv2.rectangle(output, (det.x1, det.y1 - th - 6), (det.x1 + tw + 4, det.y1), (20, 20, 20), -1)
        cv2.putText(output, label, (det.x1 + 2, det.y1 - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2)

    # Status bar
    h, w = output.shape[:2]
    cv2.rectangle(output, (0, h - 28), (w, h), (20, 20, 20), -1)
    status_text = f"{result.safety_status} | Persons: {result.persons_count} | {result.inference_ms:.0f}ms"
    status_color = (0, 255, 0) if result.safety_status == "SAFE" else (0, 0, 255)
    cv2.putText(output, status_text, (8, h - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.45, status_color, 1)

    return output


@app.get("/api/cameras/{camera_id}/stream")
async def camera_stream(camera_id: str):
    """MJPEG live video stream with detection overlays."""
    cam = camera_manager.get(camera_id)
    if cam is None:
        raise HTTPException(404, f"Unknown camera: {camera_id}")

    return StreamingResponse(
        _mjpeg_generator(camera_id),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


# ── Detection results ──────────────────────────────────────────

@app.get("/api/detections", response_model=list[DetectionResult])
async def get_all_detections():
    """Latest detection results from all connected cameras."""
    results = []
    for worker in detection_workers.values():
        if worker.latest is not None:
            results.append(worker.latest)
    return results


@app.get("/api/detections/{camera_id}", response_model=DetectionResult | None)
async def get_camera_detections(camera_id: str):
    """Latest detection result for a specific camera."""
    worker = detection_workers.get(camera_id)
    if worker is None:
        raise HTTPException(404, f"Unknown camera: {camera_id}")
    if worker.latest is None:
        return JSONResponse(
            status_code=200,
            content={"camera_id": camera_id, "message": "No detections yet"},
        )
    return worker.latest


# ── Metrics ────────────────────────────────────────────────────

@app.get("/api/metrics", response_model=SystemMetrics)
async def get_metrics():
    """Aggregate metrics across all cameras for dashboard display."""
    metrics = SystemMetrics(
        cameras_online=camera_manager.online_count,
        total_cameras=len(camera_manager.all_cameras),
        ppe_model_loaded=model_manager.ppe_loaded,
        fire_model_loaded=model_manager.fire_loaded,
    )

    for worker in detection_workers.values():
        if worker.latest is not None:
            r = worker.latest
            metrics.total_persons += r.persons_count
            metrics.total_helmets += r.helmets_count
            metrics.total_no_helmets += r.no_helmets_count
            metrics.total_vests += r.vests_count
            metrics.total_no_vests += r.no_vests_count
            metrics.total_boots += r.boots_count
            metrics.total_no_boots += r.no_boots_count
            if r.fire_detected:
                metrics.fire_detected = True
            if r.smoke_detected:
                metrics.smoke_detected = True
            if r.inference_ms > 0:
                metrics.inference_fps = round(1000.0 / r.inference_ms, 1)

    # Overall safety
    if metrics.fire_detected:
        metrics.overall_safety_status = "DANGER"
    elif metrics.smoke_detected:
        metrics.overall_safety_status = "WARNING"
    elif metrics.total_no_helmets > 0 or metrics.total_no_vests > 0 or metrics.total_no_boots > 0:
        metrics.overall_safety_status = "WARNING"
    elif metrics.total_persons > 0:
        metrics.overall_safety_status = "SAFE"
    else:
        metrics.overall_safety_status = "IDLE"

    return metrics
