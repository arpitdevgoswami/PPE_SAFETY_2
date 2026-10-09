from ultralytics import YOLO

model = YOLO("yolo11n.pt")

model.train(
    data="PPE_Tiny_3Class/data.yaml",
    epochs=30,
    imgsz=640,
    batch=4,
    device="cpu",
    project="ppe_training",
    name="ppe_yolo11n"
)