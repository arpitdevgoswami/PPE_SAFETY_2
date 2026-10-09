"""
YOLO model loader — loads PPE and fire/smoke models once at startup.
Thread-safe singleton pattern to prevent duplicate loading.
"""

from __future__ import annotations

import logging
import threading
from pathlib import Path

from server.config import PPE_MODEL_PATH, FIRE_SMOKE_MODEL_PATH

logger = logging.getLogger("smartppe.models")

_lock = threading.Lock()


class ModelManager:
    """Manages the lifecycle of YOLO detection models."""

    def __init__(self) -> None:
        self.ppe_model = None
        self.fire_model = None
        self.ppe_classes: list[str] = []
        self.fire_classes: list[str] = []
        self._loaded = False

    # ── Public API ─────────────────────────────────────────────

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    @property
    def ppe_loaded(self) -> bool:
        return self.ppe_model is not None

    @property
    def fire_loaded(self) -> bool:
        return self.fire_model is not None

    def load(self) -> None:
        """Load both models. Safe to call multiple times."""
        with _lock:
            if self._loaded:
                return
            self._load_ppe()
            self._load_fire()
            self._loaded = True

    def unload(self) -> None:
        """Release model references."""
        with _lock:
            self.ppe_model = None
            self.fire_model = None
            self.ppe_classes = []
            self.fire_classes = []
            self._loaded = False
            logger.info("Models unloaded")

    # ── Internal ───────────────────────────────────────────────

    def _load_ppe(self) -> None:
        path = Path(PPE_MODEL_PATH)
        if not path.exists():
            logger.error("PPE model not found at %s", path)
            return
        try:
            from ultralytics import YOLO
            logger.info("Loading PPE model from %s …", path)
            self.ppe_model = YOLO(str(path))
            self.ppe_classes = list(self.ppe_model.names.values())
            logger.info("PPE model loaded — classes: %s", self.ppe_classes)
        except Exception:
            logger.exception("Failed to load PPE model")

    def _load_fire(self) -> None:
        path = Path(FIRE_SMOKE_MODEL_PATH)
        if not path.exists():
            logger.error("Fire/Smoke model not found at %s", path)
            return
        try:
            from ultralytics import YOLO
            logger.info("Loading Fire/Smoke model from %s …", path)
            self.fire_model = YOLO(str(path))
            self.fire_classes = list(self.fire_model.names.values())
            logger.info("Fire/Smoke model loaded — classes: %s", self.fire_classes)
        except Exception:
            logger.exception("Failed to load Fire/Smoke model")


# Singleton instance used across the application
model_manager = ModelManager()
