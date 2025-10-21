import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Clock, Shield, Calendar, Target } from 'lucide-react';

export const StatsPage: React.FC = () => {
  const weeklyData = [
    { day: 'Seg', blocks: 12, time: 180 },
    { day: 'Ter', blocks: 8, time: 240 },
    { day: 'Qua', blocks: 15, time: 320 },
    { day: 'Qui', blocks: 6, time: 150 },
    { day: 'Sex', blocks: 20, time: 400 },
    { day: 'Sáb', blocks: 25, time: 480 },
    { day: 'Dom', blocks: 18, time: 360 },
  ];

  const achievements = [
    { title: "Primeira Semana", description: "7 dias consecutivos protegido", completed: true },
    { title: "Bloqueador Bronze", description: "100 tentativas bloqueadas", completed: true },
    { title: "Tempo Protegido", description: "50 horas de proteção", completed: false },
    { title: "Mestre do Controle", description: "30 dias consecutivos", completed: false },
  ];

  const maxBlocks = Math.max(...weeklyData.map(d => d.blocks));

  return (
    <div className="flex-1 p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Estatísticas</h1>
          <p className="text-muted-foreground">Acompanhe seu progresso</p>
        </div>
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Total Bloqueado</span>
            </div>
            <p className="text-2xl font-bold">104</p>
            <p className="text-xs text-success">+12 esta semana</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-info" />
              <span className="text-sm font-medium">Tempo Salvo</span>
            </div>
            <p className="text-2xl font-bold">42h</p>
            <p className="text-xs text-success">+8h esta semana</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <span className="text-sm font-medium">Sequência</span>
            </div>
            <p className="text-2xl font-bold">15</p>
            <p className="text-xs text-muted-foreground">dias consecutivos</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-warning" />
              <span className="text-sm font-medium">Meta Mensal</span>
            </div>
            <p className="text-2xl font-bold">67%</p>
            <p className="text-xs text-warning">20/30 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Semanal */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Últimos 7 Dias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {weeklyData.map((data, index) => (
              <div key={index} className="text-center">
                <div className="h-20 bg-muted/50 rounded-lg p-2 flex flex-col justify-end relative">
                  <div 
                    className="bg-gradient-primary rounded-sm transition-all duration-300"
                    style={{ 
                      height: `${(data.blocks / maxBlocks) * 60}px`,
                      minHeight: '8px'
                    }}
                  />
                  <span className="text-xs font-medium mt-1">{data.blocks}</span>
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">{data.day}</span>
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Tentativas bloqueadas por dia
          </div>
        </CardContent>
      </Card>

      {/* Conquistas */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Conquistas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  achievement.completed ? 'bg-success/10' : 'bg-muted'
                }`}>
                  <Target className={`h-4 w-4 ${
                    achievement.completed ? 'text-success' : 'text-muted-foreground'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
              <Badge variant={achievement.completed ? "default" : "outline"}>
                {achievement.completed ? "Desbloqueado" : "Bloqueado"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-12">
          Exportar Dados
        </Button>
        <Button className="h-12 bg-gradient-primary">
          Definir Meta
        </Button>
      </div>
    </div>
  );
};