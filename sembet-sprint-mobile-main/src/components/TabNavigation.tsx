import React from 'react';
import { Home, Shield, BarChart3, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'blocking', label: 'Bloqueio', icon: Shield },
  { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
  { id: 'settings', label: 'Ajustes', icon: Settings },
  { id: 'profile', label: 'Perfil', icon: User },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border">
      <div className="flex justify-around items-center h-16 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-200",
                isActive ? "bg-primary/10 scale-110" : "scale-100"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};