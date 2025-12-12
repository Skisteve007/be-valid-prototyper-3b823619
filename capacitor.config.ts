import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.16cc72454b534d559023a9d1ac8edb5b',
  appName: 'VALID',
  webDir: 'dist',
  server: {
    url: 'https://16cc7245-4b53-4d55-9023-a9d1ac8edb5b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    BiometricAuth: {
      androidTitle: 'VALID Login',
      androidSubtitle: 'Use your fingerprint to login',
      androidConfirmationRequired: false,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0a0a',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0a0a0a',
    }
  }
};

export default config;
