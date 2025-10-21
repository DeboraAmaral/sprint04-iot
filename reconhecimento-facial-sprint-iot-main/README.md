# 🧑‍💻 Face Recognition Project

Este projeto demonstra um sistema de reconhecimento facial em tempo real utilizando Python e OpenCV.
O objetivo é treinar um modelo de IA capaz de identificar rostos conhecidos a partir de imagens coletadas pela câmera.  

---

## 👩‍💻 Equipe

- Debora da Silva Amaral - RM550412
- Eduardo Pielich Sanchez - RM99767
- Livia Namba Seraphim - RM97819

---

## 📌 Objetivos

- Implementar uma solução simples de detecção e reconhecimento facial.
- Demonstrar como parâmetros ajustáveis (ex.: escala, vizinhos, threshold) impactam os resultados.
- Exibir a detecção em tela (retângulos e identificação).
- Criar um código executável e reprodutível com instruções claras.

---

## 🛠️ Tecnologias Utilizadas  

- Python 3.8+
- OpenCV (opencv-contrib-python)
- Haar Cascade Classifier (haarcascade_frontalface_default.xml)
- Algoritmo LBPH (Local Binary Patterns Histograms) 

---

## ⚙️ Instalação

- git clone https://github.com/DeboraAmaral/reconhecimento-facial-sprint-iot.git
- cd face-recognition-project
- python -m venv venv
- venv\Scripts\activate   # Windows
- source venv/bin/activate # Linux/Mac
- pip install -r requirements.txt
- https://github.com/opencv/opencv/blob/master/data/haarcascades/haarcascade_frontalface_default.xml #Baixe o Haar Cascade XML

---

## 🚀 Como Usar

- python src/collect_faces.py --name "NomeUsuario"
- python src/train_lbph.py --data data/raw --model models/lbph_model.yml --labels models/labels.json
- python src/recognize.py --model models/lbph_model.yml --labels models/labels.json --cascade haarcascade_frontalface_default.xml --scaleFactor 1.1 --minNeighbors 5 --minSize 60 --threshold 60

---

## 🔧 Parâmetros Relevantes

- --scaleFactor → controla a redução da imagem em cada escala (ex.: 1.1, 1.3).
- --minNeighbors → define quantos vizinhos são necessários para validar uma detecção.
- --minSize → tamanho mínimo da janela do rosto detectado.
- --threshold → nível de confiança para classificar um rosto como conhecido.

➡️ Alterar esses valores impacta diretamente a precisão da detecção e a quantidade de falsos positivos/negativos.

---

## 🎥 Demonstração em Vídeo

https://drive.google.com/file/d/1u12PcijBcgGN479_TAFE7KxNEOt6fd0J/view?usp=sharing

---

## ⚠️ Limitações

- Funciona melhor com boa iluminação.
- Pode falhar com ângulos extremos ou expressões faciais diferentes.
- Reconhecimento limitado a pessoas previamente cadastradas.

---

## 🔮 Próximos Passos

- Testar algoritmos mais avançados (Eigenfaces, Fisherfaces, CNNs).
- Melhorar a precisão do modelo com mais dados.
- Implementar integração com sistemas de autenticação.

---

## 🧑‍⚖️ Nota Ética

Este projeto é educacional. O uso de reconhecimento facial levanta questões éticas e de privacidade.
Antes de aplicar em qualquer cenário real, é essencial considerar:

- Consentimento dos usuários.
- Armazenamento seguro dos dados coletados.
- Possíveis vieses algorítmicos que podem gerar discriminação.

---

