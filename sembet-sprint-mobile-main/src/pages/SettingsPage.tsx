import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Shield, 
  Bell, 
  Moon, 
  Lock, 
  Download, 
  Trash2, 
  HelpCircle,
  ExternalLink 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    strictMode: true,
    darkMode: false,
    autoBlock: true,
    blockAttemptNotifications: true,
    passwordProtection: false,
  });

  const { toast } = useToast();

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Configuração atualizada",
      description: "Suas preferências foram salvas.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Dados exportados",
      description: "Suas estatísticas foram baixadas com sucesso.",
    });
  };

  const handleClearData = () => {
    toast({
      title: "Dados limpos",
      description: "Histórico de bloqueios foi removido.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex-1 p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Personalize sua experiência</p>
        </div>
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
          <Settings className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Proteção */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Proteção
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Modo Estrito</Label>
              <p className="text-sm text-muted-foreground">
                Bloqueia variações e subdomínios dos sites
              </p>
            </div>
            <Switch
              checked={settings.strictMode}
              onCheckedChange={(value) => updateSetting('strictMode', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Bloqueio Automático</Label>
              <p className="text-sm text-muted-foreground">
                Adiciona novos sites de apostas automaticamente
              </p>
            </div>
            <Switch
              checked={settings.autoBlock}
              onCheckedChange={(value) => updateSetting('autoBlock', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Proteção por Senha</Label>
              <p className="text-sm text-muted-foreground">
                Requer senha para alterar configurações
              </p>
            </div>
            <Switch
              checked={settings.passwordProtection}
              onCheckedChange={(value) => updateSetting('passwordProtection', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Notificações Gerais</Label>
              <p className="text-sm text-muted-foreground">
                Receba atualizações sobre o app
              </p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(value) => updateSetting('notifications', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Tentativas de Acesso</Label>
              <p className="text-sm text-muted-foreground">
                Notifica quando sites são bloqueados
              </p>
            </div>
            <Switch
              checked={settings.blockAttemptNotifications}
              onCheckedChange={(value) => updateSetting('blockAttemptNotifications', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Aparência */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Aparência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Modo Escuro</Label>
              <p className="text-sm text-muted-foreground">
                Interface com tema escuro
              </p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(value) => updateSetting('darkMode', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dados */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Dados e Privacidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4" />
            Exportar Dados
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
            onClick={handleClearData}
          >
            <Trash2 className="h-4 w-4" />
            Limpar Histórico
          </Button>
        </CardContent>
      </Card>

      {/* Ajuda */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Suporte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start gap-2">
            <HelpCircle className="h-4 w-4" />
            Central de Ajuda
          </Button>

          <Button variant="outline" className="w-full justify-start gap-2">
            <ExternalLink className="h-4 w-4" />
            Contatar Suporte
          </Button>
        </CardContent>
      </Card>

      {/* Versão */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>SemBet v1.0.0</p>
            <p>Desenvolvido com ❤️ para sua proteção</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};