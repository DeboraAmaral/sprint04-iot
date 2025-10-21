# src/train_lbph.py
import cv2
import os
import numpy as np
from pathlib import Path
import argparse
import json

parser = argparse.ArgumentParser()
parser.add_argument('--data', default='data/raw', help='Pasta com subpastas por pessoa')
parser.add_argument('--model', default='models/lbph_model.yml', help='Arquivo de saída do modelo')
parser.add_argument('--labels', default='models/labels.json', help='Mapeamento id->nome')
# LBPH params
parser.add_argument('--radius', type=int, default=1)
parser.add_argument('--neighbors', type=int, default=8)
parser.add_argument('--grid_x', type=int, default=8)
parser.add_argument('--grid_y', type=int, default=8)
args = parser.parse_args()

# cria recognizer
recognizer = cv2.face.LBPHFaceRecognizer_create(
    radius=args.radius,
    neighbors=args.neighbors,
    grid_x=args.grid_x,
    grid_y=args.grid_y
)

faces = []
labels = []
label_map = {}
current_label = 0

for person_dir in sorted(Path(args.data).iterdir()):
    if not person_dir.is_dir(): continue
    name = person_dir.name
    if name not in label_map:
        label_map[name] = current_label
        current_label += 1
    label_id = label_map[name]
    for img_path in person_dir.glob("*.jpg"):
        img = cv2.imread(str(img_path), cv2.IMREAD_GRAYSCALE)
        if img is None: continue
        # optional resize
        face = cv2.resize(img, (200,200))
        faces.append(face)
        labels.append(label_id)

if len(faces) == 0:
    raise SystemExit("Nenhuma imagem encontrada. Rode collect_images.py primeiro.")

recognizer.train(faces, np.array(labels))
Path(args.model).parent.mkdir(parents=True, exist_ok=True)
recognizer.write(str(args.model))
Path(args.labels).parent.mkdir(parents=True, exist_ok=True)
with open(args.labels, 'w', encoding='utf-8') as f:
    json.dump(label_map, f, ensure_ascii=False, indent=2)

print(f"[OK] Modelo salvo em {args.model}")
print(f"[OK] Labels salvo em {args.labels}")