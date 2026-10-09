import cv2

print("Testing webcam with Windows Media Foundation...")

cap = cv2.VideoCapture(0, cv2.CAP_MSMF)

if not cap.isOpened():
    print("ERROR: Webcam could not be opened.")
    exit()

print("Webcam opened successfully.")

print("Reading camera frame...")

ret, frame = cap.read()

print("ret =", ret)

if frame is not None:
    print("Frame received!")
    print("Frame size:", frame.shape)

    cv2.imshow("Webcam Test", frame)
    cv2.waitKey(0)

else:
    print("NO FRAME RECEIVED.")

cap.release()
cv2.destroyAllWindows()

print("Test finished.")