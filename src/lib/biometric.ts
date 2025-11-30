import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';
import { Capacitor } from '@capacitor/core';

export interface BiometricCredentials {
  email: string;
  password: string;
}

const CREDENTIALS_KEY = 'biometric_credentials';

export const isBiometricAvailable = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  try {
    const result = await BiometricAuth.checkBiometry();
    return result.isAvailable;
  } catch (error) {
    console.error('Biometric check failed:', error);
    return false;
  }
};

export const authenticateWithBiometric = async (): Promise<boolean> => {
  try {
    await BiometricAuth.authenticate({
      reason: 'Authenticate to login to Clean Check',
      cancelTitle: 'Cancel',
      allowDeviceCredential: true,
      iosFallbackTitle: 'Use Passcode',
      androidTitle: 'Biometric Login',
      androidSubtitle: 'Log in using your biometric credential',
      androidConfirmationRequired: false,
    });
    return true;
  } catch (error) {
    console.error('Biometric authentication failed:', error);
    return false;
  }
};

export const saveCredentialsSecurely = async (credentials: BiometricCredentials): Promise<void> => {
  // SECURITY: We no longer store passwords client-side
  // Biometric authentication now relies on Supabase session persistence
  // This function is kept for backward compatibility but does nothing
  console.log('Biometric login enabled - relying on session persistence');
};

export const getStoredCredentials = async (): Promise<BiometricCredentials | null> => {
  // SECURITY: We no longer retrieve stored passwords
  // Biometric authentication now uses Supabase session tokens
  return null;
};

export const clearStoredCredentials = async (): Promise<void> => {
  // Clean up any legacy stored credentials
  try {
    localStorage.removeItem(CREDENTIALS_KEY);
  } catch (error) {
    console.error('Failed to clear credentials:', error);
  }
};

export const setupBiometricLogin = async (email: string, password: string): Promise<boolean> => {
  const available = await isBiometricAvailable();
  if (!available) {
    throw new Error('Biometric authentication is not available on this device');
  }

  const authenticated = await authenticateWithBiometric();
  if (!authenticated) {
    throw new Error('Biometric authentication failed');
  }

  // SECURITY: No longer storing credentials
  // Biometric setup now just verifies capability
  // Actual authentication uses Supabase session persistence
  console.log('Biometric authentication enabled');
  return true;
};
