# SmartPPE — Industrial Safety Digital Twin & PPE Monitoring System

A production-quality PPE (Personal Protective Equipment) and fire/smoke safety monitoring system combining:
- **React frontend** with 3D factory digital twin, live camera feeds, and real-time detection dashboards
- **FastAPI backend** with dual YOLO model inference (PPE + fire/smoke detection)
- **Dual camera support** — laptop webcam + phone camera via network stream

---

## Table of Contents

1. [Architecture](#architecture)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Camera Setup](#camera-setup)
7. [API Endpoints](#api-endpoints)
8. [Existing Desktop Application](#existing-desktop-application)
9. [Troubleshooting](#troubleshooting)
10. [Limitations](#limitations)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  React Frontend (Vite)  — localhost:5173            │
│  ├── 3D Factory Digital Twin (Three.js)             │
│  ├── Live Monitoring Page (real MJPEG streams)      │
│  ├── Dashboard (real-time metrics from backend)     │
│  └── 8 pages: Overview, Monitoring, Workers, ...    │
└──────────────┬──────────────────────────────────────┘
               │  HTTP / MJPEG
┌──────────────┴──────────────────────────────────────┐
│  FastAPI Backend  — localhost:8000                   │
│  ├── YOLO PPE Model (person, helmet, vest, boots)   │
│  ├── YOLO Fire/Smoke Model (fire, smoke)            │
│  ├── Camera Manager (laptop + phone, independent)   │
│  ├── Detection Workers (per-camera inference)       │
│  └── MJPEG Streaming with detection overlays        │
└─────────────────────────────────────────────────────┘
```

---

## Prerequisites

- **Python** 3.10+ with pip
- **Node.js** 18+ with npm
- **Trained YOLO model files** (`.pt`) — not included in the repo (see Configuration)
- A laptop with a webcam (optional: a phone with IP Webcam app)

---

## Installation

### 1. Clone and enter the project
```bash
cd PPE-Safety-Monitoring-System-main
```

### 2. Install Python backend dependencies
```bash
pip install -r server/requirements.txt
```

### 3. Install frontend dependencies
```bash
npm install
```

### 4. Create your environment file
```bash
copy .env.example .env
```
Edit `.env` and set your model paths (see Configuration below).

---

## Configuration

All settings are read from a `.env` file in the project root. Copy `.env.example` to `.env` and configure:

### Model Paths (required)
```env
PPE_MODEL_PATH=C:\path\to\ppe_model\best.pt
FIRE_SMOKE_MODEL_PATH=C:\path\to\fire_smoke_model\best.pt
```

### Inference Settings
```env
PPE_CONFIDENCE=0.30          # Min confidence for PPE detections
FIRE_CONFIDENCE=0.55         # Min confidence for fire/smoke
INFERENCE_IMG_SIZE=640        # YOLO input resolution
INFERENCE_INTERVAL_MS=200     # Time between inference runs (ms)
```

### Camera Settings
```env
LAPTOP_CAMERA_INDEX=0         # Webcam device index
PHONE_CAMERA_URL=             # Leave empty; enter via UI or set here
```

### Server Settings
```env
SERVER_HOST=127.0.0.1         # Bind to localhost only (secure default)
SERVER_PORT=8000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend Settings
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## Running the Application

### Start the backend (Terminal 1)
```bash
python server/run.py
```
The backend loads both YOLO models at startup and begins listening on `http://127.0.0.1:8000`.

### Start the frontend (Terminal 2)
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Quick Verification
```bash
# Check backend is running
curl http://127.0.0.1:8000/api/status

# Connect laptop camera
curl -X POST http://127.0.0.1:8000/api/cameras/laptop/connect

# View live stream in browser
# Open: http://127.0.0.1:8000/api/cameras/laptop/stream
```

---

## Camera Setup

### Laptop Webcam
The laptop camera uses device index 0 by default. Click **CONNECT** in the Live Monitoring page or:
```bash
curl -X POST http://127.0.0.1:8000/api/cameras/laptop/connect
```

### Phone Camera (IP Webcam)

To use your phone as a second camera:

1. **Install an IP camera app** on your phone:
   - Android: [IP Webcam](https://play.google.com/store/apps/details?id=com.pas.webcam) (free)
   - iOS: [IPCamera](https://apps.apple.com/app/id990605467) or similar

2. **Connect phone and laptop to the same WiFi network**

3. **Start the IP camera app** on your phone — it will show a URL like:
   ```
   http://192.168.1.100:8080
   ```

4. **Get the video stream URL** — typically:
   - IP Webcam (Android): `http://192.168.1.100:8080/video`
   - RTSP stream: `rtsp://192.168.1.100:8554/stream`

5. **Enter the URL** in the phone camera input field on the Live Monitoring page, then click **CONNECT**

   Or via API:
   ```bash
   curl -X POST "http://127.0.0.1:8000/api/cameras/phone/connect?url=http://192.168.1.100:8080/video"
   ```

> **Note**: The phone and laptop must be on the same local network. The stream URL varies by app — check your app's documentation.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/status` | System health: model status, camera states |
| GET | `/api/cameras` | List all camera sources |
| POST | `/api/cameras/{id}/connect` | Connect a camera (query: `?url=` or `?index=`) |
| POST | `/api/cameras/{id}/disconnect` | Disconnect a camera |
| GET | `/api/cameras/{id}/stream` | MJPEG live video with detection overlays |
| GET | `/api/detections` | Latest detection results from all cameras |
| GET | `/api/detections/{id}` | Latest detections for one camera |
| GET | `/api/metrics` | Aggregated system metrics |

Camera IDs: `laptop`, `phone`

---

## Existing Desktop Application

The original standalone desktop application (`main.py`) is **preserved and unchanged**. It runs independently using OpenCV windows:

```bash
python main.py
```
Choose option 1 for live webcam or 2 for video file. This is completely separate from the web-based server.

Other standalone scripts are also preserved:
- `ppe_matching.py` — Helmet-to-person matching demo
- `ppe_worker_status.py` — Per-person PPE status overlay
- `test_webcam.py` — Simple webcam test

---

## Troubleshooting

### Backend won't start
- Check that `PPE_MODEL_PATH` and `FIRE_SMOKE_MODEL_PATH` in `.env` point to existing `.pt` files
- Ensure `ultralytics` is installed: `pip install ultralytics`
- Check the console for model loading errors

### Camera won't connect
- For laptop: Ensure no other application (e.g., Zoom, Teams) is using the webcam
- For phone: Verify the phone and laptop are on the same WiFi network
- Test the phone URL directly in a browser first

### No detections showing
- Verify models loaded successfully (check `/api/status`)
- Lower confidence thresholds in `.env` if needed
- Ensure the camera is actually capturing frames

### Frontend shows "Backend Offline"
- Start the backend server first: `python server/run.py`
- Check CORS settings match your frontend URL
- Verify `VITE_API_BASE_URL` in `.env` matches the backend address

### High CPU usage
- Increase `INFERENCE_INTERVAL_MS` (e.g., 500 or 1000)
- Reduce `INFERENCE_IMG_SIZE` to 416 or 320
- Reduce `STREAM_FPS` to 10

---

## Limitations

- **CPU-only inference**: Running on a laptop without GPU will be slower (~200-500ms per frame). Adjust `INFERENCE_INTERVAL_MS` accordingly.
- **No persistent storage**: Detection history is not saved to disk. Detections are real-time only.
- **Two cameras maximum**: The system supports laptop + phone. Additional cameras would require code changes.
- **No authentication**: The backend API has no auth. Do not expose it on a public network.
- **Demo data**: The overview dashboard, 3D factory twin, workforce directory, and other pages still use demo data. Only the Live Monitoring page and the metrics strip show real backend data.

---

## Security Considerations

- The server binds to `127.0.0.1` by default (localhost only)
- To access from other devices on your network, change `SERVER_HOST=0.0.0.0` — but this exposes the API and camera feeds to your local network
- Never expose this server to the public internet without adding authentication
- Model weight files and `.env` are excluded from git via `.gitignore`

---

## AI Models

### PPE Detection Model
- **Architecture**: YOLO11n (fine-tuned)
- **Classes**: `person`, `helmet`, `no_helmet`, `vest`, `boots`, `no_boots`
- **Default confidence**: 0.30

### Fire & Smoke Detection Model
- **Architecture**: YOLO (fine-tuned)
- **Classes**: `smoke`, `fire`
- **Default confidence**: 0.55

Both models are loaded once at server startup and shared across all inference workers.
