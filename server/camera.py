"""
Camera manager — independent capture workers for laptop and phone cameras.

Each camera runs in its own daemon thread. Failures on one camera do not
affect the other. Frame buffers are thread-safe via threading.Lock.
"""

from __future__ import annotations

import logging
import threading
import time
from datetime import datetime, timezone
from urllib.parse import urlparse

import cv2
import numpy as np

from server.config import (
    LAPTOP_CAMERA_INDEX,
    PHONE_CAMERA_URL,
    FRAME_WIDTH,
    FRAME_HEIGHT,
)

logger = logging.getLogger("smartppe.camera")


def get_candidate_stream_urls(url: str) -> list[str]:
    """
    Generate candidate URLs for IP/phone cameras based on common streaming apps.
    Supports IP Webcam (Android), DroidCam, RTSP streams, and standard HTTP/HTTPS MJPEG.
    """
    cleaned = url.strip().strip('"').strip("'")
    if not cleaned:
        return []

    # If already RTSP or HTTPS or custom scheme
    if cleaned.startswith("rtsp://") or cleaned.startswith("rtsps://"):
        return [cleaned]

    # Prepend http:// if missing
    if not cleaned.startswith("http://") and not cleaned.startswith("https://"):
        cleaned = f"http://{cleaned}"

    parsed = urlparse(cleaned)
    path = parsed.path.rstrip("/")

    candidates = []
    if path and path not in ("", "/"):
        candidates.append(cleaned)
        return candidates

    # Path is empty or root — generate smart fallbacks based on common ports & apps
    base = f"{parsed.scheme}://{parsed.netloc}"
    port = parsed.port

    if port == 8080:  # IP Webcam (Pavel Khlebovich / Android standard)
        candidates.extend([
            f"{base}/video",
            f"{base}/video/mjpg.cgi",
            f"{base}/mjpegfeed",
            f"{base}/",
        ])
    elif port == 4747:  # DroidCam
        candidates.extend([
            f"{base}/video",
            f"{base}/mjpegfeed",
            f"{base}/",
        ])
    else:
        candidates.extend([
            f"{base}/video",
            f"{base}/mjpegfeed",
            f"{base}/video/mjpg.cgi",
            f"{base}/",
        ])

    return candidates


class CameraSource:
    """Manages a single video capture source."""

    def __init__(self, camera_id: str, label: str) -> None:
        self.camera_id = camera_id
        self.label = label

        # State
        self._cap: cv2.VideoCapture | None = None
        self._source: str | int = ""
        self._connected = False
        self._error: str | None = None
        self._frame: np.ndarray | None = None
        self._frame_time: datetime | None = None
        self._frame_width: int | None = None
        self._frame_height: int | None = None

        # Threading
        self._lock = threading.Lock()
        self._stop_event = threading.Event()
        self._thread: threading.Thread | None = None

    # ── Properties ─────────────────────────────────────────────

    @property
    def connected(self) -> bool:
        return self._connected

    @property
    def error(self) -> str | None:
        return self._error

    @property
    def source_label(self) -> str:
        return str(self._source)

    @property
    def frame_width(self) -> int | None:
        return self._frame_width

    @property
    def frame_height(self) -> int | None:
        return self._frame_height

    @property
    def last_frame_time(self) -> datetime | None:
        return self._frame_time

    # ── Frame access ───────────────────────────────────────────

    def get_frame(self) -> tuple[np.ndarray | None, datetime | None]:
        """Return the latest frame and its timestamp (thread-safe)."""
        with self._lock:
            if self._frame is not None:
                return self._frame.copy(), self._frame_time
            return None, None

    # ── Connect / Disconnect ───────────────────────────────────

    def connect(self, source: int | str) -> bool:
        """Open the camera and start the capture thread."""
        if self._connected:
            logger.warning("[%s] Already connected", self.camera_id)
            return True

        self._source = source
        self._error = None
        self._stop_event.clear()

        try:
            cap = None
            working_source = source

            if isinstance(source, int):
                cap = cv2.VideoCapture(source, cv2.CAP_MSMF)
                if not cap.isOpened():
                    cap.release()
                    cap = cv2.VideoCapture(source)
            else:
                # String source (IP / Phone / RTSP URL)
                candidates = get_candidate_stream_urls(str(source))
                logger.info("[%s] Testing candidate stream URLs: %s", self.camera_id, candidates)

                for cand in candidates:
                    logger.info("[%s] Attempting connection to %s", self.camera_id, cand)
                    temp_cap = cv2.VideoCapture(cand)
                    try:
                        temp_cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
                    except Exception:
                        pass

                    if temp_cap.isOpened():
                        # Verify we can actually read a valid frame
                        ret, test_frame = temp_cap.read()
                        if ret and test_frame is not None and test_frame.size > 0:
                            cap = temp_cap
                            working_source = cand
                            logger.info("[%s] Successfully verified stream at %s", self.camera_id, cand)
                            with self._lock:
                                self._frame = test_frame
                                self._frame_time = datetime.now(timezone.utc)
                            break
                        else:
                            temp_cap.release()
                    else:
                        temp_cap.release()

            if cap is None or not cap.isOpened():
                self._error = f"Cannot open camera source: {source}. Ensure phone/webcam is streaming on the same network."
                logger.error("[%s] %s", self.camera_id, self._error)
                return False

            # Set resolution / buffer optimizations
            try:
                cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            except Exception:
                pass
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_WIDTH)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_HEIGHT)

            self._cap = cap
            self._source = working_source
            w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            self._frame_width = w if w > 0 else (self._frame.shape[1] if self._frame is not None else 640)
            self._frame_height = h if h > 0 else (self._frame.shape[0] if self._frame is not None else 480)
            self._connected = True

            logger.info(
                "[%s] Connected to %s (%dx%d)",
                self.camera_id, working_source, self._frame_width, self._frame_height,
            )

            # Start capture thread
            self._thread = threading.Thread(
                target=self._capture_loop,
                name=f"cam-{self.camera_id}",
                daemon=True,
            )
            self._thread.start()
            return True

        except Exception as exc:
            self._error = str(exc)
            logger.exception("[%s] Connect failed", self.camera_id)
            return False

    def disconnect(self) -> None:
        """Stop capture and release the camera."""
        self._stop_event.set()
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=3.0)

        if self._cap is not None:
            try:
                self._cap.release()
            except Exception:
                pass
            self._cap = None

        with self._lock:
            self._frame = None
            self._frame_time = None

        self._connected = False
        self._frame_width = None
        self._frame_height = None
        logger.info("[%s] Disconnected", self.camera_id)

    # ── Capture loop ───────────────────────────────────────────

    def _capture_loop(self) -> None:
        """Continuously capture frames until stopped."""
        consecutive_failures = 0
        max_failures = 45

        while not self._stop_event.is_set():
            if self._cap is None or not self._cap.isOpened():
                self._error = "Camera device lost"
                self._connected = False
                logger.error("[%s] Device lost", self.camera_id)
                break

            ret, frame = self._cap.read()

            if not ret or frame is None or frame.size == 0:
                consecutive_failures += 1
                if consecutive_failures >= max_failures:
                    self._error = f"Camera connection timed out ({max_failures} missed frames)"
                    self._connected = False
                    logger.error("[%s] %s", self.camera_id, self._error)
                    break
                time.sleep(0.04)
                continue

            consecutive_failures = 0
            now = datetime.now(timezone.utc)

            with self._lock:
                self._frame = frame
                self._frame_time = now
                self._error = None

            # Small sleep to maintain reasonable frame rate without starving CPU
            time.sleep(0.02)

        logger.info("[%s] Capture loop ended", self.camera_id)


class CameraManager:
    """Manages the laptop and phone camera sources."""

    def __init__(self) -> None:
        self.laptop = CameraSource("laptop", "Laptop Webcam")
        self.phone = CameraSource("phone", "Phone Camera")
        self._cameras: dict[str, CameraSource] = {
            "laptop": self.laptop,
            "phone": self.phone,
        }

    def get(self, camera_id: str) -> CameraSource | None:
        return self._cameras.get(camera_id)

    @property
    def all_cameras(self) -> list[CameraSource]:
        return list(self._cameras.values())

    @property
    def online_count(self) -> int:
        return sum(1 for c in self._cameras.values() if c.connected)

    def connect_laptop(self, index: int | None = None) -> bool:
        idx = index if index is not None else LAPTOP_CAMERA_INDEX
        return self.laptop.connect(idx)

    def connect_phone(self, url: str | None = None) -> bool:
        stream_url = url or PHONE_CAMERA_URL
        if not stream_url:
            self.phone._error = "No phone camera URL configured. Please enter IP Webcam or RTSP URL."
            logger.warning("[phone] No URL provided")
            return False
        return self.phone.connect(stream_url)

    def disconnect_all(self) -> None:
        for cam in self._cameras.values():
            if cam.connected:
                cam.disconnect()
        logger.info("All cameras disconnected")


# Singleton instance
camera_manager = CameraManager()
