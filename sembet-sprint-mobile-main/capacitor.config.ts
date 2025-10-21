import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.sembet.7e695cd39cca4e3f900dcd8377a20fb0',
  appName: 'SemBet - Bloqueador de Apostas',
  webDir: 'dist',
  server: {
    url: 'https://7e695cd3-9cca-4e3f-900d-cd8377a20fb0.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#6366f1',
      showSpinner: false
    }
  }
};

export default config;