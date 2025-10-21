import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from './LoginPage';
import { HomePage } from './HomePage';
import { BlockingPage } from './BlockingPage';
import { StatsPage } from './StatsPage';
import { SettingsPage } from './SettingsPage';
import { ProfilePage } from './ProfilePage';
import { TabNavigation } from '@/components/TabNavigation';

const Index = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-primary">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando SemBet...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'blocking':
        return <BlockingPage />;
      case 'stats':
        return <StatsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="flex flex-col min-h-screen">
        {renderPage()}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </main>
    </div>
  );
};

export default Index;
