from ultralytics import YOLO
import cv2
import math

# -----------------------------
# LOAD MODELS
# -----------------------------

# Pretrained model → PERSON
person_model = YOLO("yolo11n.pt")

# Custom model → HELMET
helmet_model = YOLO(
    r"C:\Users\arpit\runs\detect\ppe_training\ppe_yolo11n\weights\best.pt"
)

video_path = "workingcctv.mp4"

cap = cv2.VideoCapture(video_path)


# -----------------------------
# HELMET-PERSON MATCHING
# -----------------------------

def helmet_belongs_to_person(person_box, helmet_box):

    px1, py1, px2, py2 = person_box
    hx1, hy1, hx2, hy2 = helmet_box

    # Helmet center
    hx = (hx1 + hx2) / 2
    hy = (hy1 + hy2) / 2

    # Person dimensions
    person_width = px2 - px1
    person_height = py2 - py1

    # Upper region of the person
    upper_y = py1 + person_height * 0.45

    # Check whether helmet center is inside
    # the upper region of the person
    inside_x = px1 - person_width * 0.15 <= hx <= px2 + person_width * 0.15
    inside_y = py1 - person_height * 0.10 <= hy <= upper_y

    return inside_x and inside_y


# -----------------------------
# VIDEO LOOP
# -----------------------------

while True:

    ret, frame = cap.read()

    if not ret:
        break

    # PERSON DETECTION
    person_results = person_model(
        frame,
        conf=0.30,
        classes=[0],
        verbose=False
    )

    # HELMET DETECTION
    helmet_results = helmet_model(
        frame,
        conf=0.30,
        verbose=False
    )

    # Store person boxes
    persons = []

    for box in person_results[0].boxes:

        x1, y1, x2, y2 = map(int, box.xyxy[0])

        persons.append((x1, y1, x2, y2))


    # Store helmet boxes
    helmets = []

    for box in helmet_results[0].boxes:

        cls = int(box.cls[0])

        # Class 1 = helmet
        if cls == 1:

            x1, y1, x2, y2 = map(int, box.xyxy[0])

            helmets.append((x1, y1, x2, y2))


    # -----------------------------
    # MATCH EACH PERSON
    # -----------------------------

    safe_count = 0
    violation_count = 0

    for person_box in persons:

        px1, py1, px2, py2 = person_box

        has_helmet = False

        for helmet_box in helmets:

            if helmet_belongs_to_person(
                person_box,
                helmet_box
            ):

                has_helmet = True
                break


        # -------------------------
        # DRAW RESULT
        # -------------------------

        if has_helmet:

            safe_count += 1

            label = "HELMET OK"

            # Green
            color = (0, 255, 0)

        else:

            violation_count += 1

            label = "NO HELMET"

            # Red
            color = (0, 0, 255)


        cv2.rectangle(
            frame,
            (px1, py1),
            (px2, py2),
            color,
            2
        )

        cv2.putText(
            frame,
            label,
            (px1, max(py1 - 10, 20)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            color,
            2
        )


    # -----------------------------
    # DISPLAY COUNTERS
    # -----------------------------

    cv2.putText(
        frame,
        f"SAFE: {safe_count}",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (0, 255, 0),
        2
    )

    cv2.putText(
        frame,
        f"VIOLATIONS: {violation_count}",
        (20, 75),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (0, 0, 255),
        2
    )


    cv2.imshow(
        "PPE Safety Monitoring",
        frame
    )


    # Press Q to stop
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break


cap.release()
cv2.destroyAllWindows()