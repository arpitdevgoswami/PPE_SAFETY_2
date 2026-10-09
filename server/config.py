"""
Configuration module — all settings read from environment variables
with sensible defaults. Load a .env file in the project root or
server/ directory before importing this module.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from server/ directory first, then project root
_server_dir = Path(__file__).resolve().parent
_project_root = _server_dir.parent

load_dotenv(_server_dir / ".env", override=False)
load_dotenv(_project_root / ".env", override=False)


# ── Model paths ────────────────────────────────────────────────
PPE_MODEL_PATH: str = os.getenv(
    "PPE_MODEL_PATH",
    r"C:\Users\arpit\runs\detect\runs\detect\final_ppe_yolo11n\weights\best.pt",
)

FIRE_SMOKE_MODEL_PATH: str = os.getenv(
    "FIRE_SMOKE_MODEL_PATH",
    r"C:\Users\arpit\OneDrive\Desktop\PRO_file\Training\best.pt",
)

# ── Inference settings ─────────────────────────────────────────
PPE_CONFIDENCE: float = float(os.getenv("PPE_CONFIDENCE", "0.30"))
FIRE_CONFIDENCE: float = float(os.getenv("FIRE_CONFIDENCE", "0.55"))
INFERENCE_IMG_SIZE: int = int(os.getenv("INFERENCE_IMG_SIZE", "640"))
INFERENCE_INTERVAL_MS: int = int(os.getenv("INFERENCE_INTERVAL_MS", "200"))

# ── Camera settings ────────────────────────────────────────────
LAPTOP_CAMERA_INDEX: int = int(os.getenv("LAPTOP_CAMERA_INDEX", "0"))
PHONE_CAMERA_URL: str = os.getenv("PHONE_CAMERA_URL", "")

# ── Server settings ────────────────────────────────────────────
SERVER_HOST: str = os.getenv("SERVER_HOST", "127.0.0.1")
SERVER_PORT: int = int(os.getenv("SERVER_PORT", "8000"))
CORS_ORIGINS: list[str] = os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

# ── Frame capture ──────────────────────────────────────────────
FRAME_WIDTH: int = int(os.getenv("FRAME_WIDTH", "640"))
FRAME_HEIGHT: int = int(os.getenv("FRAME_HEIGHT", "480"))
JPEG_QUALITY: int = int(os.getenv("JPEG_QUALITY", "70"))
STREAM_FPS: int = int(os.getenv("STREAM_FPS", "15"))
