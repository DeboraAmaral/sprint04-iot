# src/collect_images.py
import cv2
import os
import argparse
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--name', required=True, help='Nome da pessoa (pasta será criada em data/raw/<name>)')
parser.add_argument('--count', type=int, default=50, help='Número de imagens a capturar')
parser.add_argument('--skip', type=int, default=5, help='Capturar 1 a cada <skip> frames')
parser.add_argument('--width', type=int, default=640)
parser.add_argument('--height', type=int, default=480)
args = parser.parse_args()

save_dir = Path('data/raw') / args.name
save_dir.mkdir(parents=True, exist_ok=True)

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, args.width)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, args.height)

print(f"[INFO] Pressione 'q' para sair. Salvando em: {save_dir}")
count = 0
frame_idx = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break
    frame_idx += 1
    display = frame.copy()
    cv2.putText(display, f"Capturadas: {count}/{args.count}", (10,30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2)
    cv2.imshow("Coleta de Imagens - Pressione 's' para salvar manualmente", display)

    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        break
    # auto save every `skip` frames (if count not reached)
    if frame_idx % args.skip == 0 and count < args.count:
        img_path = save_dir / f"{args.name}_{count:03d}.jpg"
        cv2.imwrite(str(img_path), frame)
        print(f"Salvo: {img_path}")
        count += 1
    # manual save
    if key == ord('s') and count < args.count:
        img_path = save_dir / f"{args.name}_{count:03d}.jpg"
        cv2.imwrite(str(img_path), frame)
        print(f"Salvo manual: {img_path}")
        count += 1
    if count >= args.count:
        print("[INFO] Captura concluída.")
        break

cap.release()
cv2.destroyAllWindows()
