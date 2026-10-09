"""
Detection engine — runs YOLO inference on camera frames.

Uses the same IOU / body-region matching logic from the original main.py
to correctly associate PPE items with detected persons.
"""

from __future__ import annotations

import logging
import threading
import time
from datetime import datetime, timezone

from server.config import (
    PPE_CONFIDENCE,
    FIRE_CONFIDENCE,
    INFERENCE_IMG_SIZE,
    INFERENCE_INTERVAL_MS,
)
from server.models import model_manager
from server.camera import CameraSource
from server.schemas import DetectionBox, DetectionResult

logger = logging.getLogger("smartppe.detection")


def _calculate_iou(box1: tuple, box2: tuple) -> float:
    """Calculate Intersection over Union between two boxes (x1,y1,x2,y2)."""
    x1, y1, x2, y2 = box1
    a1, b1, a2, b2 = box2

    ix1 = max(x1, a1)
    iy1 = max(y1, b1)
    ix2 = min(x2, a2)
    iy2 = min(y2, b2)

    iw = max(0, ix2 - ix1)
    ih = max(0, iy2 - iy1)
    intersection = iw * ih

    area1 = max(1, (x2 - x1) * (y2 - y1))
    area2 = max(1, (a2 - a1) * (b2 - b1))
    union = area1 + area2 - intersection

    return intersection / union if union > 0 else 0.0


def run_inference(camera: CameraSource) -> DetectionResult | None:
    """
    Run PPE + fire/smoke inference on the latest frame from a camera.

    Returns None if the camera has no frame or models aren't loaded.
    Uses the same body-region matching logic as the original main.py.
    """
    frame, frame_time = camera.get_frame()
    if frame is None or frame_time is None:
        return None

    result = DetectionResult(
        camera_id=camera.camera_id,
        timestamp=frame_time.isoformat(),
    )

    t0 = time.perf_counter()

    # ── PPE detection ──────────────────────────────────────────
    if model_manager.ppe_model is not None:
        try:
            ppe_results = model_manager.ppe_model.predict(
                source=frame,
                conf=PPE_CONFIDENCE,
                imgsz=INFERENCE_IMG_SIZE,
                iou=0.45,
                verbose=False,
            )

            detections = []
            for res in ppe_results:
                for box in res.boxes:
                    cls = int(box.cls[0])
                    conf = float(box.conf[0])
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    label = model_manager.ppe_model.names[cls]
                    detections.append({
                        "label": label, "conf": conf,
                        "box": (x1, y1, x2, y2),
                    })
                    result.ppe_detections.append(DetectionBox(
                        class_name=label, confidence=round(conf, 4),
                        x1=x1, y1=y1, x2=x2, y2=y2,
                    ))

            # Separate by class
            persons = [d for d in detections if d["label"] == "person"]
            helmets = [d for d in detections if d["label"] == "helmet"]
            no_helmets = [d for d in detections if d["label"] == "no_helmet"]
            vests = [d for d in detections if d["label"] == "vest"]
            boots_list = [d for d in detections if d["label"] == "boots"]

            # Clean overlapping helmet / no_helmet (keep highest confidence)
            head_detections = helmets + no_helmets
            head_detections.sort(key=lambda d: d["conf"], reverse=True)
            cleaned_head = []
            for det in head_detections:
                if not any(_calculate_iou(det["box"], ex["box"]) > 0.30 for ex in cleaned_head):
                    cleaned_head.append(det)

            # Count by class
            result.persons_count = len(persons)
            result.helmets_count = sum(1 for d in cleaned_head if d["label"] == "helmet")
            result.no_helmets_count = sum(1 for d in cleaned_head if d["label"] == "no_helmet")

            # Match vests and boots to persons (body-region logic from main.py)
            vest_count = 0
            no_vest_count = 0
            boot_count = 0
            no_boot_count = 0

            for person in persons:
                px1, py1, px2, py2 = person["box"]
                person_height = py2 - py1

                # Upper body region for vest
                upper_y1 = py1 + int(person_height * 0.20)
                upper_y2 = py1 + int(person_height * 0.65)

                # Lower body region for boots
                lower_y1 = py1 + int(person_height * 0.45)

                vest_found = False
                for vest in vests:
                    vx1, vy1, vx2, vy2 = vest["box"]
                    vcx = (vx1 + vx2) / 2
                    vcy = (vy1 + vy2) / 2
                    if px1 <= vcx <= px2 and upper_y1 <= vcy <= upper_y2:
                        vest_found = True
                        break

                if vest_found:
                    vest_count += 1
                else:
                    no_vest_count += 1

                boot_found = False
                for boot in boots_list:
                    bx1, by1, bx2, by2 = boot["box"]
                    bcx = (bx1 + bx2) / 2
                    bcy = (by1 + by2) / 2
                    if px1 <= bcx <= px2 and lower_y1 <= bcy <= py2:
                        boot_found = True
                        break

                if boot_found:
                    boot_count += 1
                elif person_height > 180:
                    no_boot_count += 1

            result.vests_count = vest_count
            result.no_vests_count = no_vest_count
            result.boots_count = boot_count
            result.no_boots_count = no_boot_count

        except Exception:
            logger.exception("[%s] PPE inference failed", camera.camera_id)

    # ── Fire / Smoke detection ─────────────────────────────────
    if model_manager.fire_model is not None:
        try:
            fire_results = model_manager.fire_model.predict(
                source=frame,
                conf=FIRE_CONFIDENCE,
                imgsz=INFERENCE_IMG_SIZE,
                verbose=False,
            )

            for res in fire_results:
                for box in res.boxes:
                    cls = int(box.cls[0])
                    conf = float(box.conf[0])
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    label = model_manager.fire_model.names[cls]
                    result.fire_smoke_detections.append(DetectionBox(
                        class_name=label, confidence=round(conf, 4),
                        x1=x1, y1=y1, x2=x2, y2=y2,
                    ))

                    if "fire" in label.lower():
                        result.fire_detected = True
                    elif "smoke" in label.lower():
                        result.smoke_detected = True

        except Exception:
            logger.exception("[%s] Fire/Smoke inference failed", camera.camera_id)

    # ── Safety status ──────────────────────────────────────────
    if result.fire_detected:
        result.safety_status = "DANGER: FIRE DETECTED"
    elif result.smoke_detected:
        result.safety_status = "WARNING: SMOKE DETECTED"
    elif result.no_helmets_count > 0:
        result.safety_status = "WARNING: PPE VIOLATION — NO HELMET"
    elif result.no_vests_count > 0:
        result.safety_status = "WARNING: PPE VIOLATION — NO VEST"
    elif result.no_boots_count > 0:
        result.safety_status = "WARNING: PPE VIOLATION — NO BOOTS"
    elif result.persons_count > 0:
        result.safety_status = "SAFE"
    else:
        result.safety_status = "NO PERSONS DETECTED"

    elapsed_ms = (time.perf_counter() - t0) * 1000
    result.inference_ms = round(elapsed_ms, 1)

    return result


class DetectionWorker:
    """
    Background worker that periodically runs inference on a camera.
    Stores the latest detection result in a thread-safe manner.
    """

    def __init__(self, camera: CameraSource) -> None:
        self.camera = camera
        self._latest: DetectionResult | None = None
        self._lock = threading.Lock()
        self._stop_event = threading.Event()
        self._thread: threading.Thread | None = None

    @property
    def latest(self) -> DetectionResult | None:
        with self._lock:
            return self._latest

    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return
        self._stop_event.clear()
        self._thread = threading.Thread(
            target=self._loop,
            name=f"det-{self.camera.camera_id}",
            daemon=True,
        )
        self._thread.start()
        logger.info("[%s] Detection worker started", self.camera.camera_id)

    def stop(self) -> None:
        self._stop_event.set()
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=3.0)
        logger.info("[%s] Detection worker stopped", self.camera.camera_id)

    def _loop(self) -> None:
        interval = INFERENCE_INTERVAL_MS / 1000.0
        while not self._stop_event.is_set():
            if self.camera.connected:
                result = run_inference(self.camera)
                if result is not None:
                    with self._lock:
                        self._latest = result
            time.sleep(interval)
