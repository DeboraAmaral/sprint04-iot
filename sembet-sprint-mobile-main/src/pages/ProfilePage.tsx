import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Calendar, 
  Shield, 
  TrendingUp, 
  Award, 
  LogOut, 
  Edit,
  Crown,
  Target,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const userStats = [
    { label: "Dias Protegido", value: "15", icon: Calendar, color: "text-primary" },
    { label: "Sites Bloqueados", value: "47", icon: Shield, color: "text-success" },
    { label: "Horas Economizadas", value: "42", icon: Clock, color: "text-info" },
    { label: "Sequência Atual", value: "15", icon: TrendingUp, color: "text-warning" },
  ];

  const achievements = [
    { name: "Primeira Semana", icon: Target, earned: true },
    { name: "Bloqueador Bronze", icon: Award, earned: true },
    { name: "Disciplinado", icon: Crown, earned: false },
    { name: "Mestre do Autocontrole", icon: Shield, earned: false },
  ];

  const memberSince = new Date(user?.joinDate || '').toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex-1 p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie sua conta</p>
        </div>
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
          <User className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Perfil Principal */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-success/10 border-success/20 text-success">
                  Proteção Ativa
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Membro desde {memberSince}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Suas Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {userStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Conquistas */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Conquistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border transition-all ${
                    achievement.earned 
                      ? 'bg-gradient-secondary border-primary/20' 
                      : 'bg-muted/30 border-muted'
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      achievement.earned ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        achievement.earned ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {achievement.name}
                    </span>
                    {achievement.earned && (
                      <Badge variant="outline" className="bg-success/10 border-success/20 text-success">
                        Desbloqueado
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ações da Conta */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Edit className="h-4 w-4" />
            Editar Perfil
          </Button>
          
          <Button variant="outline" className="w-full justify-start gap-2">
            <Shield className="h-4 w-4" />
            Privacidade e Segurança
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair da Conta
          </Button>
        </CardContent>
      </Card>

      {/* Motivação */}
      <Card className="bg-gradient-secondary border-0 shadow-card">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Crown className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Continue assim!</h3>
          <p className="text-sm text-muted-foreground">
            Você está no caminho certo para vencer o vício em apostas. 
            Cada dia protegido é uma vitória!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};