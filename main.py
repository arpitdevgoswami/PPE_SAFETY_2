import cv2
import time
from ultralytics import YOLO


# ============================================================
# MODEL PATHS
# ============================================================

PPE_MODEL_PATH = r"C:\Users\arpit\runs\detect\runs\detect\final_ppe_yolo11n\weights\best.pt"

FIRE_SMOKE_MODEL_PATH = r"C:\Users\arpit\OneDrive\Desktop\PRO_file\Training\best.pt"


# ============================================================
# LOAD MODELS
# ============================================================

print("Loading PPE model...")
ppe_model = YOLO(PPE_MODEL_PATH)

print("Loading Fire/Smoke model...")
fire_smoke_model = YOLO(FIRE_SMOKE_MODEL_PATH)

print("PPE classes:", ppe_model.names)
print("Fire/Smoke classes:", fire_smoke_model.names)


# ============================================================
# SELECT INPUT MODE
# ============================================================

print("\n==========================================")
print("   AI PPE & FIRE/SMOKE SAFETY SYSTEM")
print("==========================================")
print("1. Live Webcam")
print("2. Video File")
print("==========================================")

choice = input("Enter choice (1/2): ").strip()


# ============================================================
# OPEN INPUT
# ============================================================

if choice == "1":

    print("\nOpening webcam...")

    cap = cv2.VideoCapture(0, cv2.CAP_MSMF)

    mode_name = "LIVE WEBCAM"

    if not cap.isOpened():
        print("ERROR: Could not open webcam.")
        exit()

    time.sleep(2)

    print("Webcam opened successfully.")


elif choice == "2":

    video_path = input(
        "\nEnter full video path (.mp4): "
    ).strip().strip('"')

    print("\nOpening video...")
    print(video_path)

    cap = cv2.VideoCapture(video_path)

    mode_name = "VIDEO FILE"

    if not cap.isOpened():
        print("\nERROR: Could not open video.")
        print("Check the file path and try again.")
        exit()

    print("Video opened successfully.")


else:

    print("\nInvalid choice.")
    print("Please run the program again and select 1 or 2.")
    exit()


print("\nStarting Safety Detection...")
print("Q = Quit")
print("P = Pause / Resume\n")


# ============================================================
# VIDEO INFORMATION
# ============================================================

if choice == "2":

    total_frames = int(
        cap.get(cv2.CAP_PROP_FRAME_COUNT)
    )

    video_fps = cap.get(
        cv2.CAP_PROP_FPS
    )

    if video_fps <= 0:
        video_fps = 30

    print(f"Video FPS: {video_fps:.2f}")
    print(f"Total frames: {total_frames}")


# ============================================================
# COLORS
# ============================================================

PPE_COLORS = {
    "person": (255, 255, 0),
    "helmet": (0, 255, 0),
    "no_helmet": (0, 0, 255),
    "vest": (255, 165, 0),
    "boots": (255, 0, 255),
    "no_vest": (0, 0, 255),
    "no_boots": (0, 0, 255)
}


# ============================================================
# LABEL FUNCTION
# ============================================================

def draw_label(frame, text, x, y, color):

    font = cv2.FONT_HERSHEY_SIMPLEX
    scale = 0.55
    thickness = 2

    (w, h), baseline = cv2.getTextSize(
        text,
        font,
        scale,
        thickness
    )

    x = max(2, x)
    y = max(h + 5, y)

    cv2.rectangle(
        frame,
        (x, y - h - baseline - 4),
        (x + w + 6, y + 3),
        (20, 20, 20),
        -1
    )

    cv2.putText(
        frame,
        text,
        (x + 3, y),
        font,
        scale,
        color,
        thickness
    )


# ============================================================
# IOU FUNCTION
# ============================================================

def calculate_iou(box1, box2):

    x1, y1, x2, y2 = box1
    a1, b1, a2, b2 = box2

    ix1 = max(x1, a1)
    iy1 = max(y1, b1)
    ix2 = min(x2, a2)
    iy2 = min(y2, b2)

    iw = max(0, ix2 - ix1)
    ih = max(0, iy2 - iy1)

    intersection = iw * ih

    area1 = max(
        1,
        (x2 - x1) * (y2 - y1)
    )

    area2 = max(
        1,
        (a2 - a1) * (b2 - b1)
    )

    union = area1 + area2 - intersection

    return (
        intersection / union
        if union > 0
        else 0
    )


# ============================================================
# MAIN LOOP
# ============================================================

paused = False

display_fps = 0
fps_counter = 0
fps_start = time.time()

while True:

    # ========================================================
    # PAUSE MODE
    # ========================================================

    if paused:

        key = cv2.waitKey(50) & 0xFF

        if key == ord("p"):
            paused = False

        elif key == ord("q"):
            break

        continue


    # ========================================================
    # READ FRAME
    # ========================================================

    ret, frame = cap.read()

    if not ret or frame is None or frame.size == 0:

        if choice == "2":
            print("\nVideo finished.")

        else:
            print("WARNING: Empty camera frame.")

        break


    # ========================================================
    # PPE MODEL
    # ========================================================

    ppe_results = ppe_model.predict(
        source=frame,
        conf=0.30,
        imgsz=640,
        iou=0.45,
        verbose=False
    )


    # ========================================================
    # GET PPE DETECTIONS
    # ========================================================

    detections = []

    for result in ppe_results:

        for box in result.boxes:

            cls = int(box.cls[0])
            conf = float(box.conf[0])

            x1, y1, x2, y2 = map(
                int,
                box.xyxy[0]
            )

            label = ppe_model.names[cls]

            detections.append({
                "label": label,
                "conf": conf,
                "box": (x1, y1, x2, y2)
            })


    # ========================================================
    # SEPARATE DETECTIONS
    # ========================================================

    persons = [
        d for d in detections
        if d["label"] == "person"
    ]

    helmets = [
        d for d in detections
        if d["label"] == "helmet"
    ]

    no_helmets = [
        d for d in detections
        if d["label"] == "no_helmet"
    ]

    vests = [
        d for d in detections
        if d["label"] == "vest"
    ]

    boots = [
        d for d in detections
        if d["label"] == "boots"
    ]


    # ========================================================
    # CLEAN HELMET / NO HELMET
    # ========================================================

    head_detections = helmets + no_helmets

    head_detections.sort(
        key=lambda d: d["conf"],
        reverse=True
    )

    cleaned_head = []

    for detection in head_detections:

        overlap_found = False

        for existing in cleaned_head:

            if calculate_iou(
                detection["box"],
                existing["box"]
            ) > 0.30:

                overlap_found = True
                break

        if not overlap_found:
            cleaned_head.append(detection)


    # ========================================================
    # COUNTERS
    # ========================================================

    total_persons = len(persons)

    no_vest_count = 0
    no_boots_count = 0
    no_helmet_count = 0


    # ========================================================
    # DRAW PERSON + PPE STATUS
    # ========================================================

    for person in persons:

        person_box = person["box"]

        px1, py1, px2, py2 = person_box

        person_height = py2 - py1


        # ----------------------------------------------------
        # PERSON
        # ----------------------------------------------------

        cv2.rectangle(
            frame,
            (px1, py1),
            (px2, py2),
            PPE_COLORS["person"],
            2
        )

        draw_label(
            frame,
            "PERSON",
            px1,
            py1 - 5,
            PPE_COLORS["person"]
        )


        # ----------------------------------------------------
        # BODY REGIONS
        # ----------------------------------------------------

        upper_body_y1 = py1 + int(
            person_height * 0.20
        )

        upper_body_y2 = py1 + int(
            person_height * 0.65
        )

        lower_body_y1 = py1 + int(
            person_height * 0.45
        )

        lower_body_y2 = py2


        # ----------------------------------------------------
        # VEST CHECK
        # ----------------------------------------------------

        vest_found = False

        for vest in vests:

            vx1, vy1, vx2, vy2 = vest["box"]

            vest_center_x = (
                vx1 + vx2
            ) / 2

            vest_center_y = (
                vy1 + vy2
            ) / 2

            if (
                px1 <= vest_center_x <= px2
                and
                upper_body_y1
                <= vest_center_y
                <= upper_body_y2
            ):

                vest_found = True

                cv2.rectangle(
                    frame,
                    (vx1, vy1),
                    (vx2, vy2),
                    PPE_COLORS["vest"],
                    2
                )

                draw_label(
                    frame,
                    f"VEST {vest['conf']:.2f}",
                    vx1,
                    vy1 - 5,
                    PPE_COLORS["vest"]
                )

                break


        # ----------------------------------------------------
        # NO VEST
        # ----------------------------------------------------

        if not vest_found:

            no_vest_count += 1

            draw_label(
                frame,
                "NO VEST",
                px1,
                py2 + 20,
                PPE_COLORS["no_vest"]
            )


        # ----------------------------------------------------
        # BOOTS CHECK
        # ----------------------------------------------------

        boot_found = False

        for boot in boots:

            bx1, by1, bx2, by2 = boot["box"]

            boot_center_x = (
                bx1 + bx2
            ) / 2

            boot_center_y = (
                by1 + by2
            ) / 2

            if (
                px1 <= boot_center_x <= px2
                and
                lower_body_y1
                <= boot_center_y
                <= lower_body_y2
            ):

                boot_found = True

                cv2.rectangle(
                    frame,
                    (bx1, by1),
                    (bx2, by2),
                    PPE_COLORS["boots"],
                    2
                )

                draw_label(
                    frame,
                    f"BOOTS {boot['conf']:.2f}",
                    bx1,
                    by1 - 5,
                    PPE_COLORS["boots"]
                )


        # ----------------------------------------------------
        # NO BOOTS
        # ----------------------------------------------------

        if (
            person_height > 180
            and
            not boot_found
        ):

            no_boots_count += 1

            draw_label(
                frame,
                "NO BOOTS",
                px1,
                py2 + 45,
                PPE_COLORS["no_boots"]
            )


    # ========================================================
    # DRAW HELMET / NO HELMET
    # ========================================================

    for detection in cleaned_head:

        label = detection["label"]
        conf = detection["conf"]

        x1, y1, x2, y2 = detection["box"]

        color = PPE_COLORS.get(
            label,
            (255, 255, 255)
        )

        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            color,
            2
        )

        draw_label(
            frame,
            f"{label.upper()} {conf:.2f}",
            x1,
            y1 - 5,
            color
        )

        if label == "no_helmet":
            no_helmet_count += 1


    # ========================================================
    # FIRE / SMOKE MODEL
    # ========================================================

    fire_results = fire_smoke_model.predict(
        source=frame,
        conf=0.55,
        imgsz=640,
        verbose=False
    )

    fire_detected = False
    smoke_detected = False


    for result in fire_results:

        for box in result.boxes:

            cls = int(box.cls[0])
            conf = float(box.conf[0])

            x1, y1, x2, y2 = map(
                int,
                box.xyxy[0]
            )

            label = fire_smoke_model.names[cls]

            label_lower = label.lower()


            if "fire" in label_lower:

                fire_detected = True
                color = (0, 0, 255)


            elif "smoke" in label_lower:

                smoke_detected = True
                color = (128, 128, 128)


            else:

                continue


            cv2.rectangle(
                frame,
                (x1, y1),
                (x2, y2),
                color,
                3
            )

            draw_label(
                frame,
                f"{label.upper()} {conf:.2f}",
                x1,
                y1 - 5,
                color
            )


    # ========================================================
    # SAFETY STATUS
    # ========================================================

    if fire_detected:

        status = "DANGER: FIRE DETECTED"
        status_color = (0, 0, 255)

    elif smoke_detected:

        status = "WARNING: SMOKE DETECTED"
        status_color = (128, 128, 128)

    elif no_helmet_count > 0:

        status = "WARNING: PPE VIOLATION"
        status_color = (0, 0, 255)

    elif no_vest_count > 0:

        status = "WARNING: NO VEST DETECTED"
        status_color = (0, 0, 255)

    elif no_boots_count > 0:

        status = "WARNING: NO BOOTS DETECTED"
        status_color = (0, 0, 255)

    else:

        status = "SYSTEM STATUS: SAFE"
        status_color = (0, 255, 0)


    # ========================================================
    # FPS
    # ========================================================

    fps_counter += 1

    elapsed = time.time() - fps_start

    if elapsed >= 1.0:

        display_fps = fps_counter / elapsed

        fps_counter = 0
        fps_start = time.time()


    # ========================================================
    # STATUS PANEL
    # ========================================================

    cv2.rectangle(
        frame,
        (10, 10),
        (650, 145),
        (20, 20, 20),
        -1
    )

    cv2.putText(
        frame,
        status,
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.62,
        status_color,
        2
    )

    cv2.putText(
        frame,
        f"MODE: {mode_name}",
        (20, 68),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.48,
        (255, 255, 255),
        1
    )

    cv2.putText(
        frame,
        f"PERSONS: {total_persons} | NO VEST: {no_vest_count}",
        (20, 92),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.48,
        (255, 255, 255),
        1
    )

    cv2.putText(
        frame,
        f"NO BOOTS: {no_boots_count} | NO HELMET: {no_helmet_count}",
        (20, 116),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.48,
        (255, 255, 255),
        1
    )

    cv2.putText(
        frame,
        f"FPS: {display_fps:.1f}",
        (500, 68),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.48,
        (255, 255, 255),
        1
    )


    # ========================================================
    # VIDEO FRAME COUNTER
    # ========================================================

    if choice == "2":

        current_frame = int(
            cap.get(cv2.CAP_PROP_POS_FRAMES)
        )

        cv2.putText(
            frame,
            f"FRAME: {current_frame}/{total_frames}",
            (500, 92),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.45,
            (255, 255, 255),
            1
        )


    # ========================================================
    # DISPLAY
    # ========================================================

    cv2.imshow(
        "AI PPE & Fire Smoke Safety System",
        frame
    )


    # ========================================================
    # KEYBOARD
    # ========================================================

    key = cv2.waitKey(1) & 0xFF

    if key == ord("q"):
        break

    elif key == ord("p"):
        paused = True

        print("PAUSED — press P to resume.")


# ============================================================
# CLEANUP
# ============================================================

cap.release()
cv2.destroyAllWindows()

print("\n====================================")
print("SAFETY SYSTEM TEST COMPLETED")
print("====================================")