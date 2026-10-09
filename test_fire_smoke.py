from ultralytics import YOLO

model = YOLO(r"C:\Users\arpit\OneDrive\Desktop\PRO_file\Training\best.pt")

# Test on your current video
video_path = r"C:\Users\arpit\OneDrive\Desktop\PRO_file\Training\workers.mp4"

model.predict(
    source=video_path,
    conf=0.25,
    imgsz=640,
    save=True,
    show=True
)

print("===================================")
print("FIRE / SMOKE TEST COMPLETED")
print("===================================")