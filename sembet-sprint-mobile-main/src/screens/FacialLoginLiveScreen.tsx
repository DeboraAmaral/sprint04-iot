import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import './FacialLiveScreen.css';

const FacialLoginLiveScreen: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isRecognized, setIsRecognized] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // ← Usar o login do AuthContext
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      setMessage('🎥 Iniciando reconhecimento...');
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setMessage('✅ Câmera ativa! Reconhecendo...');
        startRecognition();
      }
    } catch (error) {
      setMessage('❌ Erro: ' + error.toString());
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setMessage('');
    setIsRecognized(false);
  };

  const startRecognition = () => {
    intervalRef.current = setInterval(captureAndVerify, 3000);
  };

  const handleSuccessfulLogin = async (user_id: string) => {
    console.log('✅ Login facial bem-sucedido para:', user_id);
    
    setMessage(`✅ Olá ${user_id}! Autenticando...`);
    setIsRecognized(true);
    
    if (intervalRef.current) clearInterval(intervalRef.current);

    try {
      // 🔑 INTEGRAÇÃO COM O AUTHCONTEXT EXISTENTE
      // Criar credenciais baseadas no reconhecimento facial
      const facialEmail = `${user_id}@facial.com`;
      const facialPassword = 'facial_auth_' + user_id;
      
      // Usar a função login do AuthContext
      const success = await login(facialEmail, facialPassword);
      
      if (success) {
        setMessage(`✅ Autenticado como ${user_id}!`);
        
        toast({
          title: "Login Facial Realizado!",
          description: `Bem-vindo de volta, ${user_id}!`,
        });

        // O AuthContext já deve redirecionar automaticamente
        // Se não redirecionar, forçar após 2 segundos
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        // Se o login não funcionar, tentar cadastro automático
        await handleFirstTimeFacialUser(user_id, facialEmail, facialPassword);
      }
      
    } catch (error) {
      console.error('Erro no login facial:', error);
      setMessage('❌ Erro na autenticação');
    }
  };

  const handleFirstTimeFacialUser = async (user_id: string, email: string, password: string) => {
    try {
      setMessage('👤 Primeiro acesso, criando conta...');
      
      // Simular criação de conta para usuário facial
      // Em um sistema real, isso criaria o usuário no backend
      localStorage.setItem('facial_user_' + user_id, JSON.stringify({
        email: email,
        password: password,
        created_at: new Date().toISOString()
      }));

      // Tentar login novamente com as credenciais "cadastradas"
      const success = await login(email, password);
      
      if (success) {
        setMessage(`✅ Nova conta criada para ${user_id}!`);
        
        toast({
          title: "Conta Facial Criada!",
          description: `Bem-vindo ao SemBet, ${user_id}!`,
        });

        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage('❌ Erro ao criar conta facial');
      }
    } catch (error) {
      console.error('Erro ao criar usuário facial:', error);
      setMessage('❌ Erro no sistema');
    }
  };

  const captureAndVerify = async () => {
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) return;

      context.drawImage(video, 0, 0);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);

      const response = await fetch('http://localhost:5000/verify-live-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      const result = await response.json();
      
      if (result.success && result.authenticated) {
        handleSuccessfulLogin(result.user_id);
      } else if (result.face_detected) {
        setMessage('🔍 Rosto detectado... verificando');
      } else {
        setMessage('👤 Posicione seu rosto no quadro');
      }
    } catch (error) {
      console.error('Erro verificação:', error);
      setMessage('❌ Erro de conexão com a API');
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="facial-live-container">
      <h1 className="facial-live-title">Login Facial - SemBet</h1>
      <p className="facial-live-subtitle">Posicione seu rosto para reconhecimento automático</p>

      <div className="camera-section">
        <div className="video-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video"
          />
          <div className="face-frame"></div>
          {isRecognized && <div className="success-overlay">✅ RECONHECIDO!</div>}
        </div>
        
        <div className="camera-controls">
          {!videoRef.current?.srcObject ? (
            <button onClick={startCamera} className="camera-button">
              🎥 Iniciar Reconhecimento Facial
            </button>
          ) : (
            <button onClick={stopCamera} className="stop-button">
              ⏹️ Parar Reconhecimento
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`message-box ${isRecognized ? 'success' : ''}`}>
          {message}
        </div>
      )}

      {!videoRef.current?.srcObject && (
        <button className="back-button" onClick={() => navigate('/')}>
          ← Voltar ao Login Tradicional
        </button>
      )}

      {isRecognized && (
        <div className="redirect-message">
          🚀 Conectando ao SemBet...
        </div>
      )}

      <div className="login-info">
        <p>⚡ Reconhecimento automático a cada 3 segundos</p>
        <p>🔑 Sistema integrado com autenticação do SemBet</p>
      </div>
    </div>
  );
};

export default FacialLoginLiveScreen;