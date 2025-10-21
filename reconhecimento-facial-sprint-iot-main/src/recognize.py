# src/recognize.py
import cv2
import json
from pathlib import Path
import argparse
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument('--model', default='models/lbph_model.yml')
parser.add_argument('--labels', default='models/labels.json')
parser.add_argument('--cascade', default='haarcascade_frontalface_default.xml')
parser.add_argument('--scaleFactor', type=float, default=1.1, help='Haar cascade scaleFactor')
parser.add_argument('--minNeighbors', type=int, default=5, help='Haar cascade minNeighbors')
parser.add_argument('--minSize', type=int, default=60, help='Haar cascade minSize (px)')
parser.add_argument('--threshold', type=float, default=60.0, help='max distance (score) para aceitar identificação (LBPH)')
args = parser.parse_args()

# Load cascade - use local OpenCV cascade (download if necessário)
cascade_path = args.cascade
if not Path(cascade_path).exists():
    # tenta localizar em pacote cv2
    import pkgutil, sys
    # fallback: pede para usuário baixar
    raise SystemExit(f"Cascade não encontrado em '{cascade_path}'. Baixe 'haarcascade_frontalface_default.xml' e coloque no projeto.")

face_cascade = cv2.CascadeClassifier(cascade_path)
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read(args.model)

with open(args.labels, 'r', encoding='utf-8') as f:
    label_map = json.load(f)
    inv_label_map = {int(v):k for k,v in label_map.items()}

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret: break
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray,
                                          scaleFactor=args.scaleFactor,
                                          minNeighbors=args.minNeighbors,
                                          minSize=(args.minSize, args.minSize))
    for (x,y,w,h) in faces:
        face_roi = gray[y:y+h, x:x+w]
        face_resized = cv2.resize(face_roi, (200,200))
        label, confidence = recognizer.predict(face_resized)  # lower confidence = better
        # LBPH returns "distance" like metric; aqui tratamos confidence como distância
        if confidence <= args.threshold:
            name = inv_label_map.get(label, "Desconhecido")
            text = f"{name} ({confidence:.1f})"
            color = (0,255,0)
        else:
            name = "Desconhecido"
            text = f"{name} ({confidence:.1f})"
            color = (0,0,255)
        cv2.rectangle(frame, (x,y), (x+w, y+h), color, 2)
        cv2.putText(frame, text, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

    cv2.imshow("Reconhecimento Facial (Press q para sair)", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()