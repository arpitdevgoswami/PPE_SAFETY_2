from ultralytics import YOLO
import cv2

# Load model
model = YOLO(
    r"C:\Users\arpit\runs\detect\runs\detect\final_ppe_yolo11n\weights\best.pt"
)

video_path = r"C:\Users\arpit\OneDrive\Desktop\PRO_file\Training\workers.mp4"

# Open video
cap = cv2.VideoCapture(video_path)

# Class colors in BGR format
colors = {
    0: (255, 0, 0),       # Person - Blue
    1: (0, 255, 0),       # Helmet - Green
    2: (0, 0, 255),       # No Helmet - Red
    3: (0, 255, 255),     # Vest - Yellow
    4: (255, 255, 0),     # Boots - Cyan
    5: (0, 165, 255)      # No Boots - Orange
}

while True:

    ret, frame = cap.read()

    if not ret:
        break

    # Run detection
    results = model(frame, conf=0.35, imgsz=640, verbose=False)

    for result in results:

        boxes = result.boxes

        for box in boxes:

            # Coordinates
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            # Class
            class_id = int(box.cls[0])

            # Confidence
            confidence = float(box.conf[0])

            # Class name
            class_name = model.names[class_id]

            # Get color
            color = colors.get(class_id, (255, 255, 255))

            # Draw box
            cv2.rectangle(
                frame,
                (x1, y1),
                (x2, y2),
                color,
                3
            )

            # Label
            label = f"{class_name} {confidence:.2f}"

            # Text background
            (tw, th), _ = cv2.getTextSize(
                label,
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                2
            )

            cv2.rectangle(
                frame,
                (x1, y1 - th - 10),
                (x1 + tw, y1),
                color,
                -1
            )

            # Text
            cv2.putText(
                frame,
                label,
                (x1, y1 - 5),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 0, 0),
                2
            )

    cv2.imshow("PPE Safety Detection", frame)

    # Press Q to quit
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()