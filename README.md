# 🧠 SemBet - Sistema de Autenticação Facial

## 📋 Documentação Técnica

O **SemBet** é um sistema de autenticação facial integrado ao aplicativo principal, desenvolvido como parte da Sprint IoT.  
A solução combina **reconhecimento facial com OpenCV** no backend em **Python (Flask)** e uma **interface em React (Node.js)** para cadastro e login facial.  

---

## 🚀 Instruções Completas para Execução

### 🧩 Pré-requisitos

Antes de iniciar, verifique se possui:

- **Python 3.8+** instalado  
- **Node.js 16+** instalado  
- **Webcam funcional**  
- **Navegador moderno** (Chrome, Firefox ou Edge)

---

### ⚙️ Instalação e Configuração

#### 1️⃣ Configurar o Backend (API de Reconhecimento Facial)

```bash
# Navegar para a pasta da API
cd reconhecimento-facial-sprint-iot-main/api

# Instalar dependências Python
pip install flask flask-cors opencv-python numpy Pillow

# Executar a API
python app.py
```

A API será iniciada em:  
📡 **http://localhost:5000**

---

#### 2️⃣ Configurar o Frontend (SemBet)

```bash
# Navegar para a pasta do SemBet  
cd sembet-sprint-mobile-main

# Instalar dependências Node.js
npm install

# Executar a aplicação
npm run dev
```

A aplicação web estará disponível em:  
💻 **http://localhost:5173**

---

### 🌐 Acessar a Aplicação

- **Aplicação SemBet:** http://localhost:5173  
- **API Facial:** http://localhost:5000

---

## 🎮 Como Usar o Sistema

### 👤 Cadastro Facial

1. Acesse **http://localhost:5173**
2. Clique em **“Cadastrar Meu Rosto”**
3. Digite um **ID de usuário** (ex: `meu_usuario`)
4. Permita acesso à **câmera**
5. Posicione o rosto no quadro e clique em **“Capturar e Cadastrar”**

---

### 🔐 Login Facial

1. Na tela de login, clique em **“Login com Reconhecimento Facial”**
2. Permita acesso à câmera
3. Posicione o rosto — o reconhecimento será automático
4. Você será redirecionado automaticamente para o aplicativo

---

## 🔗 Como o Reconhecimento Facial Está Conectado com a Aplicação

### 🧱 Arquitetura de Integração

```
[Interface SemBet] ←→ [AuthContext] ←→ [API Facial] ←→ [OpenCV]
       ↓                    ↓               ↓            ↓
  [Componentes]      [Estado Auth]    [Processamento] [Detecção]
       ↓                    ↓               ↓            ↓
  [Navegação]        [LocalStorage]   [Banco Faces]  [Reconhecimento]
```

---

### 🔄 Fluxo de Integração Detalhado

#### 1️⃣ Captura e Envio da Imagem (Frontend - React)

```typescript
// Frontend (React) - Captura da imagem
const captureAndVerify = async () => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0);
  const base64Image = canvas.toDataURL('image/jpeg');
  
  // Envio para API
  const response = await fetch('http://localhost:5000/verify-live-face', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image })
  });
};
```

---

#### 2️⃣ Processamento no Backend (Flask + OpenCV)

```python
# API (Flask) - Detecção facial
def verify_live_face():
    image_array = base64_to_image(request.json['image'])
    has_faces, num_faces, faces = detect_faces_opencv(image_array)
    
    if has_faces and num_faces == 1:
        # Comparação com usuários cadastrados
        current_features = calculate_face_features(faces[0], image_array.shape)
        # ... lógica de reconhecimento
        return jsonify({"authenticated": True, "user_id": user_id})
```

---

#### 3️⃣ Integração com o AuthContext (SemBet)

```typescript
// Integração com sistema de autenticação existente
const handleSuccessfulLogin = async (user_id: string) => {
  const facialEmail = `${user_id}@facial.com`;
  const success = await login(facialEmail, 'facial_password');
  
  if (success) {
    navigate('/');
  }
};
```

---

## ⚙️ Pontos de Conexão com a Aplicação Principal

| Módulo | Função | Integração |
|--------|---------|------------|
| **AuthContext** | Autenticação e persistência | Gera credenciais faciais automaticamente |
| **Rotas** | Navegação e redirecionamento | `/facial-login-live` e `/facial-register-live` |
| **UI/UX** | Botões e feedback visual | Interface unificada com design do SemBet |
| **Estado Global** | Sessão e persistência | Mantém login via LocalStorage |

---

## 🧠 Endpoints da API de Integração

| Endpoint | Método | Função | Integração |
|-----------|---------|--------|-------------|
| `/register-face` | POST | Cadastrar rosto | → AuthContext |
| `/verify-live-face` | POST | Verificar identidade | → Sistema de login |
| `/health` | GET | Verificar status da API | → Monitoramento |

---

## 🔁 Fluxo de Dados entre Módulos

```
Usuário → Interface SemBet → Captura Câmera → API Facial 
    ↓
AuthContext ← Resposta Auth ← Processamento OpenCV
    ↓
Aplicação Principal ← Redirecionamento ← Autenticação
```

---

## ✅ Validação da Integração

- [x] Login facial redireciona corretamente  
- [x] Estado de autenticação persiste entre páginas  
- [x] Funcionalidades do SemBet acessíveis após login facial  
- [x] Compatibilidade com login tradicional  
- [x] Mensagens de erro integradas ao sistema de notificações  

---

## 🧩 Solução de Problemas de Integração

| Problema | Causa | Solução |
|-----------|--------|---------|
| Login facial não persiste | Falha no estado global | Verifique integração com `LocalStorage` e `AuthContext` |
| Redirecionamento incorreto | Hook de navegação não chamado | Garanta uso do `navigate('/')` após autenticação |
| Erros de CORS | Comunicação entre portas | Ative `flask-cors` no backend |

---

## 🟢 Status Final da Integração

| Componente | Status |
|-------------|---------|
| Captura facial | ✅ Funcionando |
| Processamento backend | ✅ Integrado |
| Sistema de autenticação | ✅ Conectado |
| Navegação | ✅ Funcionando |
| Interface visual | ✅ Unificada |
| Estado persistente | ✅ Entre sessões |

---

## 👨‍💻 Equipe & Créditos

**Debora Amaral - RM550412**
**Eduardo Pielich - RM99767**
**Livia Namba - RM97819**
