import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, TrendingUp, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Sites Bloqueados",
      value: "47",
      change: "+3 hoje",
      icon: Shield,
      color: "text-primary"
    },
    {
      title: "Tempo Protegido",
      value: "18h 32m",
      change: "hoje",
      icon: Clock,
      color: "text-success"
    },
    {
      title: "Tentativas Bloqueadas",
      value: "12",
      change: "esta semana",
      icon: AlertTriangle,
      color: "text-warning"
    },
    {
      title: "Dias Consecutivos",
      value: "15",
      change: "recorde pessoal",
      icon: TrendingUp,
      color: "text-info"
    }
  ];

  const recentBlocks = [
    { site: "bet365.com", time: "há 2 minutos", blocked: true },
    { site: "sportingbet.com", time: "há 15 minutos", blocked: true },
    { site: "betfair.com", time: "há 1 hora", blocked: true },
  ];

  return (
    <div className="flex-1 p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Olá, {user?.name}! 👋</h1>
          <p className="text-muted-foreground">Você está protegido contra apostas</p>
        </div>
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
          <Shield className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Status Card */}
      <Card className="bg-gradient-secondary border-0 shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="font-semibold text-success">Proteção Ativa</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Todos os sites de apostas estão sendo bloqueados
              </p>
            </div>
            <Badge variant="outline" className="bg-success/10 border-success/20 text-success">
              ATIVO
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Atividade Recente */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          {recentBlocks.map((block, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-sm">{block.site}</p>
                  <p className="text-xs text-muted-foreground">{block.time}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-destructive/10 border-destructive/20 text-destructive">
                BLOQUEADO
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-12">
          Ver Relatório
        </Button>
        <Button className="h-12 bg-gradient-primary">
          Ajustar Filtros
        </Button>
      </div>
    </div>
  );
};