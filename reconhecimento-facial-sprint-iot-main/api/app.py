from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import os
import json
import io
import numpy as np
from datetime import datetime
from PIL import Image
import cv2

app = Flask(__name__)
CORS(app)

# Configurações
USERS_FILE = "users.json"
FACES_DIR = "faces"

# Criar diretórios se não existirem
for directory in [FACES_DIR]:
    if not os.path.exists(directory):
        os.makedirs(directory)

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def base64_to_image(base64_string):
    try:
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        return np.array(image)
    except Exception as e:
        print(f"Erro ao converter base64: {e}")
        return None

def detect_faces_opencv(image_array):
    """Detecta faces usando OpenCV Haar Cascades"""
    try:
        # Converter para escala de cinza
        gray = cv2.cvtColor(image_array, cv2.COLOR_RGB2GRAY)
        
        # Carregar classificador de faces
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # Detectar faces
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(100, 100),  # Tamanho mínimo maior para evitar falsos positivos
            flags=cv2.CASCADE_SCALE_IMAGE
        )
        
        return len(faces) > 0, len(faces), faces
    except Exception as e:
        print(f"Erro na detecção de faces: {e}")
        return False, 0, []

def calculate_face_features(face_coords, image_shape):
    """Calcula características simples da face para comparação básica"""
    x, y, w, h = face_coords
    center_x = x + w/2
    center_y = y + h/2
    aspect_ratio = w/h
    
    # Normalizar pelas dimensões da imagem
    normalized_x = center_x / image_shape[1]
    normalized_y = center_y / image_shape[0]
    normalized_size = (w * h) / (image_shape[0] * image_shape[1])
    
    return [normalized_x, normalized_y, normalized_size, aspect_ratio]

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "✅ API de Reconhecimento Facial funcionando", 
        "version": "3.0",
        "mode": "OPENCV_HAAR",
        "features": "Detecção facial real + comparação básica + modo ao vivo"
    })

@app.route('/register-face', methods=['POST'])
def register_face():
    try:
        data = request.json
        user_id = data.get('user_id')
        image_data = data.get('image')
        
        print(f"📸 Tentando cadastrar face REAL para: {user_id}")
        
        if not user_id or not image_data:
            return jsonify({"success": False, "error": "user_id e image são obrigatórios"})
        
        # Converter base64 para imagem
        image_array = base64_to_image(image_data)
        if image_array is None:
            return jsonify({"success": False, "error": "Imagem inválida"})
        
        # Verificar se há rostos na imagem (DETECÇÃO REAL)
        has_faces, num_faces, faces = detect_faces_opencv(image_array)
        
        if not has_faces:
            return jsonify({
                "success": False, 
                "error": "❌ Nenhum rosto detectado! Posicione seu rosto melhor na imagem."
            })
        
        if num_faces > 1:
            return jsonify({
                "success": False, 
                "error": f"❌ Múltiplos rostos detectados ({num_faces}). Envie uma foto com apenas uma pessoa."
            })
        
        # Calcar características da face detectada
        face_features = calculate_face_features(faces[0], image_array.shape)
        
        # Salvar imagem da face
        face_filename = f"{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        face_path = os.path.join(FACES_DIR, face_filename)
        
        # Desenhar retângulo na face detectada (para debug)
        debug_image = image_array.copy()
        x, y, w, h = faces[0]
        cv2.rectangle(debug_image, (x, y), (x+w, y+h), (0, 255, 0), 3)
        cv2.putText(debug_image, "ROSTO DETECTADO", (x, y-10), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
        
        Image.fromarray(debug_image).save(face_path, 'JPEG')
        
        # Salvar dados do usuário
        users = load_users()
        users[user_id] = {
            "registered_at": datetime.now().isoformat(),
            "face_image": face_filename,
            "face_features": face_features,
            "face_detected": True,
            "num_faces": num_faces,
            "image_shape": image_array.shape,
            "last_login": None,
            "login_count": 0
        }
        save_users(users)
        
        print(f"✅ Usuário {user_id} cadastrado com DETECÇÃO REAL! Rostos: {num_faces}")
        
        return jsonify({
            "success": True, 
            "message": f"✅ Face cadastrada com sucesso! Sistema detectou {num_faces} rosto(s).",
            "user_id": user_id,
            "faces_detected": num_faces,
            "mode": "REAL_DETECTION"
        })
        
    except Exception as e:
        print(f"❌ Erro no cadastro: {e}")
        return jsonify({"success": False, "error": str(e)})

@app.route('/verify-face', methods=['POST'])
def verify_face():
    try:
        data = request.json
        image_data = data.get('image')
        
        print("🔍 Verificando face com DETECÇÃO REAL...")
        
        if not image_data:
            return jsonify({"success": False, "error": "image é obrigatório"})
        
        # Converter base64 para imagem
        image_array = base64_to_image(image_data)
        if image_array is None:
            return jsonify({"success": False, "error": "Imagem inválida"})
        
        # Verificar se há rostos na imagem (DETECÇÃO REAL)
        has_faces, num_faces, faces = detect_faces_opencv(image_array)
        
        if not has_faces:
            return jsonify({
                "success": True,
                "authenticated": False,
                "message": "❌ Nenhum rosto detectado! Posicione seu rosto melhor.",
                "mode": "REAL_DETECTION"
            })
        
        if num_faces > 1:
            return jsonify({
                "success": True,
                "authenticated": False,
                "message": f"❌ Múltiplos rostos detectados ({num_faces}). Mostre apenas seu rosto.",
                "mode": "REAL_DETECTION"
            })
        
        users = load_users()
        
        if not users:
            return jsonify({
                "success": True,
                "authenticated": False,
                "message": "❌ Nenhum usuário cadastrado no sistema",
                "mode": "REAL_DETECTION"
            })
        
        # Calcular características da face atual
        current_features = calculate_face_features(faces[0], image_array.shape)
        
        # Comparar com usuários cadastrados (VERIFICAÇÃO BÁSICA)
        best_match = None
        best_similarity = 0
        
        for user_id, user_data in users.items():
            if "face_features" in user_data:
                saved_features = user_data["face_features"]
                
                # Calcular similaridade simples baseada na posição/tamanho
                similarity = 1.0 - np.sqrt(
                    sum((a - b) ** 2 for a, b in zip(current_features, saved_features))
                )
                
                print(f"🔍 Comparando com {user_id}: Similaridade = {similarity:.2f}")
                
                if similarity > best_similarity:
                    best_similarity = similarity
                    best_match = user_id
        
        # Se similaridade > 40% (threshold baixo para demonstração)
        if best_match and best_similarity > 0.4:
            # Atualizar dados do usuário
            users[best_match]["last_login"] = datetime.now().isoformat()
            users[best_match]["login_count"] = users[best_match].get("login_count", 0) + 1
            save_users(users)
            
            print(f"✅ Login facial REAL realizado para: {best_match} (similaridade: {best_similarity:.2f})")
            
            return jsonify({
                "success": True,
                "authenticated": True,
                "user_id": best_match,
                "confidence": float(best_similarity),
                "message": "✅ Login facial realizado com sucesso!",
                "login_count": users[best_match]["login_count"],
                "mode": "REAL_DETECTION",
                "faces_detected": num_faces
            })
        else:
            return jsonify({
                "success": True,
                "authenticated": False,
                "message": "❌ Rosto não reconhecido. Cadastre-se primeiro.",
                "similarity": float(best_similarity) if best_match else 0,
                "mode": "REAL_DETECTION"
            })
            
    except Exception as e:
        print(f"❌ Erro na verificação: {e}")
        return jsonify({"success": False, "error": str(e)})

@app.route('/verify-live-face', methods=['POST'])
def verify_live_face():
    """Endpoint específico para verificação ao vivo"""
    try:
        data = request.json
        image_data = data.get('image')
        
        print("🎥 Verificação FACIAL AO VIVO...")
        
        if not image_data:
            return jsonify({"success": False, "error": "image é obrigatório"})
        
        # Converter base64 para imagem
        image_array = base64_to_image(image_data)
        if image_array is None:
            return jsonify({"success": False, "error": "Imagem inválida"})
        
        # Verificar se há rostos na imagem
        has_faces, num_faces, faces = detect_faces_opencv(image_array)
        
        if not has_faces:
            return jsonify({
                "success": True,
                "authenticated": False,
                "message": "Nenhum rosto detectado. Posicione-se melhor.",
                "face_detected": False,
                "mode": "LIVE_RECOGNITION"
            })
        
        if num_faces > 1:
            return jsonify({
                "success": True,
                "authenticated": False,
                "message": f"Múltiplos rostos detectados ({num_faces}).",
                "face_detected": True,
                "multiple_faces": True,
                "mode": "LIVE_RECOGNITION"
            })
        
        users = load_users()
        
        if not users:
            return jsonify({
                "success": True,
                "authenticated": False,
                "message": "Nenhum usuário cadastrado",
                "face_detected": True,
                "mode": "LIVE_RECOGNITION"
            })
        
        # Calcular características da face atual
        current_features = calculate_face_features(faces[0], image_array.shape)
        
        # Buscar melhor match
        best_match = None
        best_similarity = 0
        
        for user_id, user_data in users.items():
            if "face_features" in user_data:
                saved_features = user_data["face_features"]
                
                similarity = 1.0 - np.sqrt(
                    sum((a - b) ** 2 for a, b in zip(current_features, saved_features))
                )
                
                print(f"🔍 Live: {user_id} - Similaridade: {similarity:.2f}")
                
                if similarity > best_similarity:
                    best_similarity = similarity
                    best_match = user_id
        
        # Threshold para reconhecimento
        recognition_threshold = 0.4
        
        if best_match and best_similarity > recognition_threshold:
            users[best_match]["last_login"] = datetime.now().isoformat()
            users[best_match]["login_count"] = users[best_match].get("login_count", 0) + 1
            save_users(users)
            
            print(f"✅ LOGIN AO VIVO: {best_match} (confiança: {best_similarity:.2f})")
            
            return jsonify({
                "success": True,
                "authenticated": True,
                "user_id": best_match,
                "confidence": float(best_similarity),
                "message": "Reconhecimento facial confirmado!",
                "login_count": users[best_match]["login_count"],
                "face_detected": True,
                "mode": "LIVE_RECOGNITION"
            })
        else:
            return jsonify({
                "success": True,
                "authenticated": False,
                "message": "Rosto não reconhecido",
                "face_detected": True,
                "similarity": float(best_similarity) if best_match else 0,
                "mode": "LIVE_RECOGNITION"
            })
            
    except Exception as e:
        print(f"❌ Erro na verificação ao vivo: {e}")
        return jsonify({"success": False, "error": str(e)})

@app.route('/users', methods=['GET'])
def list_users():
    """Endpoint para listar usuários cadastrados"""
    users = load_users()
    return jsonify({
        "total_users": len(users),
        "users": users,
        "mode": "REAL_DETECTION"
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 INICIANDO API DE RECONHECIMENTO FACIAL - MODO REAL")
    print("="*60)
    print("🔧 Tecnologia: OpenCV Haar Cascades")
    print("✅ Funcionalidades: Detecção facial real + verificação básica + modo ao vivo")
    print("📝 Endpoints disponíveis:")
    print("   GET  http://localhost:5000/health")
    print("   GET  http://localhost:5000/users")
    print("   POST http://localhost:5000/register-face")
    print("   POST http://localhost:5000/verify-face")
    print("   POST http://localhost:5000/verify-live-face")
    print("="*60)
    print("⚡ Servidor rodando em: http://localhost:5000")
    print("⏹️  Pressione CTRL+C para parar")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)