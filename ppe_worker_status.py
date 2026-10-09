from ultralytics import YOLO
import cv2

# ==============================
# MODEL
# ==============================

model = YOLO(
    r"C:\Users\arpit\runs\detect\runs\detect\final_ppe_yolo11n\weights\best.pt"
)

# ==============================
# VIDEO
# ==============================

video_path = r"C:\Users\arpit\OneDrive\Desktop\PRO_file\Training\workers.mp4"

cap = cv2.VideoCapture(video_path)

# ==============================
# COLORS - BGR
# ==============================

colors = {
    0: (255, 0, 0),       # Person - Blue
    1: (0, 255, 0),       # Helmet - Green
    2: (0, 0, 255),       # No Helmet - Red
    3: (0, 255, 255),     # Vest - Yellow
    4: (255, 255, 0),     # Boots - Cyan
    5: (0, 165, 255)      # No Boots - Orange
}

# ==============================
# CLASS NAMES
# ==============================

names = {
    0: "PERSON",
    1: "HELMET",
    2: "NO HELMET",
    3: "VEST",
    4: "BOOTS",
    5: "NO BOOTS"
}

while True:

    ret, frame = cap.read()

    if not ret:
        break

    results = model(
        frame,
        conf=0.20,
        imgsz=960,
        verbose=False
    )

    persons = []
    ppe_items = []

    # ==============================
    # COLLECT DETECTIONS
    # ==============================

    for result in results:

        for box in result.boxes:

            x1, y1, x2, y2 = map(
                int,
                box.xyxy[0]
            )

            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            center_x = (x1 + x2) // 2
            center_y = (y1 + y2) // 2

            detection = {
                "class_id": class_id,
                "x1": x1,
                "y1": y1,
                "x2": x2,
                "y2": y2,
                "cx": center_x,
                "cy": center_y,
                "confidence": confidence
            }

            if class_id == 0:
                persons.append(detection)
            else:
                ppe_items.append(detection)

    # ==============================
    # DRAW PERSONS + PPE STATUS
    # ==============================

    for person in persons:

        px1 = person["x1"]
        py1 = person["y1"]
        px2 = person["x2"]
        py2 = person["y2"]

        status = {
            "helmet": False,
            "no_helmet": False,
            "vest": False,
            "boots": False,
            "no_boots": False
        }

        # ------------------------------
        # Find PPE inside this person
        # ------------------------------

        for item in ppe_items:

            cx = item["cx"]
            cy = item["cy"]

            if (
                px1 <= cx <= px2
                and py1 <= cy <= py2
            ):

                class_id = item["class_id"]

                if class_id == 1:
                    status["helmet"] = True

                elif class_id == 2:
                    status["no_helmet"] = True

                elif class_id == 3:
                    status["vest"] = True

                elif class_id == 4:
                    status["boots"] = True

                elif class_id == 5:
                    status["no_boots"] = True

        # ==============================
        # SAFETY STATUS
        # ==============================

        unsafe = (
            status["no_helmet"]
            or status["no_boots"]
            or not status["helmet"]
            or not status["vest"]
            or not status["boots"]
        )

        if unsafe:
            safety_text = "PPE: UNSAFE"
            safety_color = (0, 0, 255)
        else:
            safety_text = "PPE: SAFE"
            safety_color = (0, 255, 0)

        # ==============================
        # PERSON BOX
        # ==============================

        cv2.rectangle(
            frame,
            (px1, py1),
            (px2, py2),
            colors[0],
            3
        )

        cv2.putText(
            frame,
            "PERSON",
            (px1, max(25, py1 - 10)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            colors[0],
            2
        )

        # ==============================
        # STATUS PANEL
        # ==============================

        panel_x = px1
        panel_y = py2 + 5

        if panel_y + 145 > frame.shape[0]:
            panel_y = py1

        lines = [
            f"Helmet: {'OK' if status['helmet'] else 'NO'}",
            f"Vest: {'OK' if status['vest'] else 'NO'}",
            f"Boots: {'OK' if status['boots'] else 'NO'}",
            safety_text
        ]

        for i, text in enumerate(lines):

            color = safety_color if i == 3 else (255, 255, 255)

            cv2.putText(
                frame,
                text,
                (panel_x, panel_y + 25 + i * 25),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                color,
                2
            )

    # ==============================
    # DISPLAY
    # ==============================

    cv2.imshow(
        "PPE SAFETY SYSTEM",
        frame
    )

    # Press Q to quit
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()