import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './FacialLiveScreen.css';

const FacialRegisterLiveScreen: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      setMessage('🎥 Iniciando câmera...');
      
      // Parar stream anterior se existir
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setMessage('✅ Câmera ativa! Posicione seu rosto no quadro.');
      }
    } catch (error) {
      console.error('Erro câmera:', error);
      setMessage('❌ Erro ao acessar câmera: ' + error.toString());
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setMessage('');
  };

  const captureAndRegister = async () => {
    if (!videoRef.current || !userId) {
      setMessage('❌ Digite um ID de usuário primeiro!');
      return;
    }

    setIsLoading(true);
    setMessage('📸 Capturando e processando...');

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Erro no canvas');

      context.drawImage(video, 0, 0);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);

      // Enviar para cadastro
      const response = await fetch('http://localhost:5000/register-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, image: base64Image }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`✅ ${result.message}`);
        setTimeout(() => navigate('/facial-login-live'), 2000);
      } else {
        setMessage(`❌ ${result.error}`);
      }
    } catch (error) {
      setMessage('❌ Erro: ' + error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  // Limpar ao sair
  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="facial-live-container">
      <h1 className="facial-live-title">Cadastro Facial</h1>
      <p className="facial-live-subtitle">Cadastre seu rosto para login facial</p>

      <div className="input-section">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Digite seu ID (ex: usuario123)"
          className="text-input"
        />
      </div>

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
        </div>
        
        <div className="camera-controls">
          <button onClick={startCamera} className="camera-button">
            🎥 Ligar Câmera
          </button>
          <button 
            onClick={captureAndRegister} 
            disabled={isLoading}
            className="capture-button"
          >
            {isLoading ? '🔄 Processando...' : '📸 Cadastrar Rosto'}
          </button>
          <button onClick={stopCamera} className="stop-button">
            ⏹️ Parar Câmera
          </button>
        </div>
      </div>

      {message && (
        <div className="message-box">
          {message}
        </div>
      )}

      <button className="back-button" onClick={() => navigate('/')}>
        ← Voltar ao Login
      </button>
    </div>
  );
};

export default FacialRegisterLiveScreen;