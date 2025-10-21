import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FacialLoginScreen.css';

const FacialLoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file: File) => {
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target?.result as string;
        await verifyFace(base64);
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
        alert('Erro: Não foi possível processar a imagem');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const verifyFace = async (base64Image: string) => {
    try {
      const response = await fetch('http://192.168.10.7:5000/verify-face', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      });

      const result = await response.json();

      if (result.success && result.authenticated) {
        alert(`Sucesso! Bem-vindo de volta, ${result.user_id}!`);
        navigate('/'); // Redireciona para a página inicial
      } else {
        alert('Face não reconhecida. Tente novamente ou use login tradicional.');
      }
    } catch (error) {
      console.error('Erro na verificação facial:', error);
      alert('Erro de conexão. Verifique se a API está rodando.');
    }
  };

  return (
    <div className="facial-login-container">
      <h1 className="facial-login-title">Login Facial</h1>
      <p className="facial-login-subtitle">
        Faça upload de uma foto do seu rosto para fazer login
      </p>

      <div className="upload-section">
        <label htmlFor="file-upload" className="upload-button">
          {isLoading ? 'Processando...' : 'Selecionar Foto'}
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isLoading}
          className="file-input"
        />
      </div>

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Verificando seu rosto...</p>
        </div>
      )}

      <button
        className="back-button"
        onClick={() => navigate('/')}
      >
        Voltar ao Login Tradicional
      </button>
    </div>
  );
};

export default FacialLoginScreen;