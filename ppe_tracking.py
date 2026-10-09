from ultralytics import YOLO
import cv2

# ==========================================
# MODELS
# ==========================================

# Pretrained YOLO → PERSON
person_model = YOLO("yolo11n.pt")

# Custom PPE model → HELMET
helmet_model = YOLO(
    r"C:\Users\arpit\runs\detect\ppe_training\ppe_yolo11n\weights\best.pt"
)

video_path = "workers.mp4"

cap = cv2.VideoCapture(video_path)


# ==========================================
# VIDEO LOOP
# ==========================================

while True:

    ret, frame = cap.read()

    if not ret:
        break

    # ======================================
    # PERSON TRACKING
    # ======================================

    person_results = person_model.track(
        frame,
        persist=True,
        classes=[0],
        conf=0.60,
        verbose=False
    )

    # ======================================
    # HELMET DETECTION
    # ======================================

    helmet_results = helmet_model(
        frame,
        conf=0.50,
        verbose=False
    )

    helmets = []

    for box in helmet_results[0].boxes:

        cls = int(box.cls[0])

        # Class 1 = helmet
        if cls == 1:

            x1, y1, x2, y2 = map(
                int,
                box.xyxy[0]
            )

            helmets.append(
                (x1, y1, x2, y2)
            )

            # ------------------------------
            # HELMET BOX
            # Yellow
            # ------------------------------

            cv2.rectangle(
                frame,
                (x1, y1),
                (x2, y2),
                (0, 255, 255),
                2
            )

            cv2.putText(
                frame,
                "HELMET",
                (x1, max(y1 - 8, 20)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 255, 255),
                2
            )


    # ======================================
    # PERSON DETECTION
    # ======================================

    if person_results[0].boxes.id is not None:

        boxes = person_results[0].boxes.xyxy.cpu().numpy()

        ids = person_results[0].boxes.id.cpu().numpy()

        for person_box, track_id in zip(boxes, ids):

            px1, py1, px2, py2 = map(
                int,
                person_box
            )

            person_width = px2 - px1
            person_height = py2 - py1

            upper_y = py1 + person_height * 0.45

            has_helmet = False

            # ==================================
            # MATCH HELMET TO PERSON
            # ==================================

            for helmet in helmets:

                hx1, hy1, hx2, hy2 = helmet

                hx = (hx1 + hx2) / 2
                hy = (hy1 + hy2) / 2

                inside_x = (
                    px1 - person_width * 0.15
                    <= hx
                    <= px2 + person_width * 0.15
                )

                inside_y = (
                    py1 - person_height * 0.10
                    <= hy
                    <= upper_y
                )

                if inside_x and inside_y:

                    has_helmet = True
                    break


            # ==================================
            # PERSON STATUS
            # ==================================

            if has_helmet:

                status = "HELMET OK"

                # Green
                status_color = (0, 255, 0)

            else:

                status = "NO HELMET"

                # Red
                status_color = (0, 0, 255)


            # ==================================
            # PERSON BOX
            # Blue
            # ==================================

            person_color = (255, 0, 0)

            cv2.rectangle(
                frame,
                (px1, py1),
                (px2, py2),
                person_color,
                2
            )

            # ==================================
            # PERSON LABEL
            # ==================================

            cv2.putText(
                frame,
                "PERSON",
                (px1, max(py1 - 10, 20)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                person_color,
                2
            )

            # ==================================
            # STATUS LABEL
            # ==================================

            cv2.putText(
                frame,
                status,
                (px1, min(py2 + 25, frame.shape[0] - 10)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                status_color,
                2
            )


    # ======================================
    # SHOW
    # ======================================

    cv2.imshow(
        "PPE Safety Monitoring",
        frame
    )

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break


cap.release()
cv2.destroyAllWindows()