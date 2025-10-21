import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Verificar se já está autenticado via reconhecimento facial
  useEffect(() => {
    const checkFacialLogin = () => {
      const facialUser = localStorage.getItem('facial_login_user');
      const isFacialAuthenticated = localStorage.getItem('isAuthenticated');
      
      if (facialUser && isFacialAuthenticated === 'true') {
        console.log('🔐 Login facial detectado, redirecionando...');
        navigate('/');
      }
    };

    checkFacialLogin();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao SemBet.",
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Credenciais inválidas.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Título */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SemBet</h1>
          <p className="text-white/80">Proteja-se das apostas online</p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-card border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Faça login</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-12"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-primary hover:scale-105 transition-transform"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>

              {/* Divisor */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou use reconhecimento facial
                  </span>
                </div>
              </div>

              {/* Botões para o sistema facial ao vivo */}
              <div className="space-y-3">
                <Button 
                  type="button"
                  className="w-full h-12 bg-green-600 hover:bg-green-700 hover:scale-105 transition-transform text-white"
                  onClick={() => navigate('/facial-register-live')}
                  disabled={isLoading}
                >
                  <span className="flex items-center justify-center">
                    <span className="text-lg mr-2">📸</span>
                    Cadastrar Meu Rosto
                  </span>
                </Button>
                
                <Button 
                  type="button"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-transform text-white"
                  onClick={() => navigate('/facial-login-live')}
                  disabled={isLoading}
                >
                  <span className="flex items-center justify-center">
                    <span className="text-lg mr-2">🔐</span>
                    Login com Reconhecimento Facial
                  </span>
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Primeira vez? Use qualquer email e senha para entrar.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Sistema de reconhecimento facial integrado
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status da API */}
        <div className="text-center">
          <button 
            onClick={async () => {
              try {
                const response = await fetch('http://localhost:5000/health');
                const data = await response.json();
                toast({
                  title: "✅ API Conectada",
                  description: `Status: ${data.status}`,
                });
              } catch (error) {
                toast({
                  title: "❌ API Offline",
                  description: "Verifique se a API está rodando",
                  variant: "destructive",
                });
              }
            }}
            className="text-xs text-white/60 hover:text-white/80 transition-colors"
          >
            Verificar status da API facial
          </button>
        </div>
      </div>
    </div>
  );
};