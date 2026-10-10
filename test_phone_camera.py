"""
Standalone Phone Camera Stream Tester.

Run this script to verify your phone camera connection before starting the full detection system.
Usage:
    python test_phone_camera.py
"""

import cv2
import time
from urllib.parse import urlparse

print("=" * 50)
print("     PHONE CAMERA STREAM TESTER")
print("=" * 50)
print("Supported Apps:")
print(" • IP Webcam (Android): http://<phone-ip>:8080/video")
print(" • DroidCam:            http://<phone-ip>:4747/video")
print(" • RTSP Cameras:        rtsp://<phone-ip>:554/live")
print("=" * 50)

raw_url = input("\nEnter phone IP or URL (e.g. 192.168.1.5:8080): ").strip().strip('"').strip("'")
if not raw_url:
    print("Error: No URL provided.")
    exit(1)

# Generate candidates
if raw_url.startswith("rtsp://") or raw_url.startswith("rtsps://"):
    candidates = [raw_url]
else:
    norm = raw_url if raw_url.startswith("http://") or raw_url.startswith("https://") else f"http://{raw_url}"
    p = urlparse(norm)
    base = f"{p.scheme}://{p.netloc}"
    if p.path and p.path not in ("", "/"):
        candidates = [norm]
    elif p.port == 8080:
        candidates = [f"{base}/video", f"{base}/video/mjpg.cgi", f"{base}/mjpegfeed", f"{base}/"]
    elif p.port == 4747:
        candidates = [f"{base}/video", f"{base}/mjpegfeed", f"{base}/"]
    else:
        candidates = [f"{base}/video", f"{base}/mjpegfeed", f"{base}/video/mjpg.cgi", f"{base}/"]

print("\nConnecting...")
cap = None
working_url = None

for cand in candidates:
    print(f"Testing URL: {cand}")
    temp_cap = cv2.VideoCapture(cand)
    try:
        temp_cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    except Exception:
        pass

    if temp_cap.isOpened():
        ret, frame = temp_cap.read()
        if ret and frame is not None and frame.size > 0:
            cap = temp_cap
            working_url = cand
            print(f"Connected successfully to: {working_url}")
            break
        else:
            temp_cap.release()
    else:
        temp_cap.release()

if cap is None or not cap.isOpened():
    print("\n[FAILED] Could not connect to phone camera stream.")
    print("Troubleshooting checklist:")
    print(" 1. Ensure phone and computer are on the SAME Wi-Fi network.")
    print(" 2. Verify IP Webcam / DroidCam app is running and stream has started.")
    print(" 3. Check Windows Firewall is not blocking incoming Python network access.")
    exit(1)

width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
print(f"Stream resolution: {width} x {height}")
print("\nOpening video window... Press 'q' on the video window to exit.")

fps_count = 0
fps_start = time.time()
current_fps = 0.0

while True:
    ret, frame = cap.read()
    if not ret or frame is None:
        print("Warning: Frame drop / stream interrupted.")
        time.sleep(0.05)
        continue

    fps_count += 1
    if time.time() - fps_start >= 1.0:
        current_fps = fps_count / (time.time() - fps_start)
        fps_count = 0
        fps_start = time.time()

    # Draw debug info
    cv2.putText(
        frame,
        f"Phone Stream: {working_url}",
        (10, 25),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (0, 255, 0),
        2,
    )
    cv2.putText(
        frame,
        f"Resolution: {frame.shape[1]}x{frame.shape[0]} | FPS: {current_fps:.1f}",
        (10, 55),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (0, 255, 255),
        2,
    )

    cv2.imshow("Phone Camera Stream Test (Press Q to quit)", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
print("Phone camera stream test completed.")
