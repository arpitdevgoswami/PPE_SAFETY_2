"""
Pydantic schemas for API responses.
"""

from __future__ import annotations

from pydantic import BaseModel


class DetectionBox(BaseModel):
    """A single object detection."""
    class_name: str
    confidence: float
    x1: int
    y1: int
    x2: int
    y2: int


class CameraStatus(BaseModel):
    """Status of a single camera source."""
    camera_id: str
    label: str
    connected: bool
    source: str  # "webcam", "phone", or the URL
    frame_width: int | None = None
    frame_height: int | None = None
    last_frame_time: str | None = None
    error: str | None = None


class DetectionResult(BaseModel):
    """Detection results for one camera frame."""
    camera_id: str
    timestamp: str
    ppe_detections: list[DetectionBox] = []
    fire_smoke_detections: list[DetectionBox] = []
    persons_count: int = 0
    helmets_count: int = 0
    no_helmets_count: int = 0
    vests_count: int = 0
    no_vests_count: int = 0
    boots_count: int = 0
    no_boots_count: int = 0
    fire_detected: bool = False
    smoke_detected: bool = False
    safety_status: str = "UNKNOWN"
    inference_ms: float = 0.0


class SystemMetrics(BaseModel):
    """Aggregate system metrics for the dashboard."""
    cameras_online: int = 0
    total_cameras: int = 2
    ppe_model_loaded: bool = False
    fire_model_loaded: bool = False
    total_persons: int = 0
    total_helmets: int = 0
    total_no_helmets: int = 0
    total_vests: int = 0
    total_no_vests: int = 0
    total_boots: int = 0
    total_no_boots: int = 0
    fire_detected: bool = False
    smoke_detected: bool = False
    overall_safety_status: str = "UNKNOWN"
    inference_fps: float = 0.0


class StatusResponse(BaseModel):
    """Overall system health response."""
    status: str  # "ok" | "degraded" | "error"
    ppe_model_loaded: bool
    fire_model_loaded: bool
    ppe_model_classes: list[str] = []
    fire_model_classes: list[str] = []
    cameras: list[CameraStatus] = []


class ErrorResponse(BaseModel):
    """Structured error response."""
    error: str
    detail: str | None = None
