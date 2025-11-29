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
  // In a real app, use Capacitor's SecureStorage or Keychain plugin
  // For now, we'll use localStorage (Note: This is not secure for production!)
  // TODO: Implement secure storage using @capacitor/preferences with encryption
  try {
    const credentialsString = JSON.stringify(credentials);
    localStorage.setItem(CREDENTIALS_KEY, btoa(credentialsString));
  } catch (error) {
    console.error('Failed to save credentials:', error);
    throw error;
  }
};

export const getStoredCredentials = async (): Promise<BiometricCredentials | null> => {
  try {
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    if (!stored) return null;
    
    const decoded = atob(stored);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to retrieve credentials:', error);
    return null;
  }
};

export const clearStoredCredentials = async (): Promise<void> => {
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

  await saveCredentialsSecurely({ email, password });
  return true;
};
