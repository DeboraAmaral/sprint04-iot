import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Shield, Globe, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlockedSite {
  id: string;
  url: string;
  category: string;
  addedDate: string;
  isActive: boolean;
}

export const BlockingPage: React.FC = () => {
  const [newSite, setNewSite] = useState('');
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([
    { id: '1', url: 'bet365.com', category: 'Apostas Esportivas', addedDate: '2024-01-15', isActive: true },
    { id: '2', url: 'sportingbet.com', category: 'Apostas Esportivas', addedDate: '2024-01-15', isActive: true },
    { id: '3', url: 'betfair.com', category: 'Casa de Apostas', addedDate: '2024-01-16', isActive: true },
    { id: '4', url: 'pokerstars.com', category: 'Poker Online', addedDate: '2024-01-17', isActive: false },
    { id: '5', url: 'casino.com', category: 'Casino Online', addedDate: '2024-01-18', isActive: true },
  ]);
  
  const { toast } = useToast();

  const handleAddSite = () => {
    if (!newSite.trim()) {
      toast({
        title: "URL inválida",
        description: "Por favor, digite uma URL válida.",
        variant: "destructive",
      });
      return;
    }

    const newBlockedSite: BlockedSite = {
      id: Date.now().toString(),
      url: newSite,
      category: 'Personalizado',
      addedDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };

    setBlockedSites([...blockedSites, newBlockedSite]);
    setNewSite('');
    
    toast({
      title: "Site adicionado!",
      description: `${newSite} foi bloqueado com sucesso.`,
    });
  };

  const toggleSite = (id: string) => {
    setBlockedSites(sites => 
      sites.map(site => 
        site.id === id ? { ...site, isActive: !site.isActive } : site
      )
    );
  };

  const removeSite = (id: string) => {
    const site = blockedSites.find(s => s.id === id);
    setBlockedSites(sites => sites.filter(site => site.id !== id));
    
    toast({
      title: "Site removido",
      description: `${site?.url} foi removido da lista de bloqueios.`,
    });
  };

  const activeSites = blockedSites.filter(site => site.isActive).length;

  return (
    <div className="flex-1 p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Bloqueios</h1>
          <p className="text-muted-foreground">{activeSites} sites bloqueados ativamente</p>
        </div>
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
          <Shield className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Status Geral */}
      <Card className="bg-gradient-secondary border-0 shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Proteção Ativa</h3>
                <p className="text-sm text-muted-foreground">
                  {activeSites} de {blockedSites.length} sites bloqueados
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-success/10 border-success/20 text-success">
              ATIVO
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Adicionar Novo Site */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Bloquear Novo Site
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="ex: bet365.com"
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSite()}
              className="flex-1"
            />
            <Button onClick={handleAddSite} className="bg-gradient-primary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            Digite apenas o domínio do site (sem http:// ou www)
          </div>
        </CardContent>
      </Card>

      {/* Lista de Sites Bloqueados */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Sites Bloqueados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {blockedSites.map((site) => (
            <div key={site.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  site.isActive ? 'bg-destructive/10' : 'bg-muted'
                }`}>
                  <Shield className={`h-4 w-4 ${
                    site.isActive ? 'text-destructive' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{site.url}</p>
                  <p className="text-xs text-muted-foreground">{site.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={site.isActive}
                    onCheckedChange={() => toggleSite(site.id)}
                  />
                  <Label className="text-xs">
                    {site.isActive ? 'Ativo' : 'Inativo'}
                  </Label>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSite(site.id)}
                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};