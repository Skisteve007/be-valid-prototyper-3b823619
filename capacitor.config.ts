import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.3ed86c89d0124ddbae081cef2104dd1c',
  appName: 'Clean Check',
  webDir: 'dist',
  server: {
    url: 'https://3ed86c89-d012-4ddb-ae08-1cef2104dd1c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    BiometricAuth: {
      androidTitle: 'Clean Check Login',
      androidSubtitle: 'Use your fingerprint to login',
      androidConfirmationRequired: false,
    }
  }
};

export default config;
