// WebAuthn/Passkey helper for web biometric authentication

export const isWebAuthnAvailable = async (): Promise<boolean> => {
  if (!window.PublicKeyCredential) return false;
  
  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch {
    return false;
  }
};

// Generate a random challenge for WebAuthn
const generateChallenge = (): Uint8Array => {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  return challenge;
};

// Convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Convert Base64 to ArrayBuffer
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

export interface StoredCredential {
  credentialId: string;
  email: string;
  userId: string;
  createdAt: string;
}

const WEBAUTHN_CREDENTIALS_KEY = 'valid_webauthn_credentials';

// Get stored WebAuthn credentials from localStorage
export const getStoredWebAuthnCredential = (): StoredCredential | null => {
  try {
    const stored = localStorage.getItem(WEBAUTHN_CREDENTIALS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to get stored WebAuthn credential:', e);
  }
  return null;
};

// Save WebAuthn credential to localStorage
const saveWebAuthnCredential = (credential: StoredCredential): void => {
  try {
    localStorage.setItem(WEBAUTHN_CREDENTIALS_KEY, JSON.stringify(credential));
  } catch (e) {
    console.error('Failed to save WebAuthn credential:', e);
  }
};

// Clear stored WebAuthn credentials
export const clearWebAuthnCredential = (): void => {
  try {
    localStorage.removeItem(WEBAUTHN_CREDENTIALS_KEY);
  } catch (e) {
    console.error('Failed to clear WebAuthn credential:', e);
  }
};

// Register a new WebAuthn credential (call after successful login)
export const registerWebAuthnCredential = async (
  userId: string,
  email: string,
  displayName: string
): Promise<boolean> => {
  try {
    const challenge = generateChallenge();
    const userIdBuffer = new TextEncoder().encode(userId);
    
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: challenge as BufferSource,
        rp: {
          name: "VALID™",
          id: window.location.hostname
        },
        user: {
          id: userIdBuffer as BufferSource,
          name: email,
          displayName: displayName || email
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },   // ES256
          { type: "public-key", alg: -257 }  // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred"
        },
        timeout: 60000
      }
    }) as PublicKeyCredential;

    if (credential) {
      // Store credential info locally (not the actual credential - that stays in the authenticator)
      const storedCred: StoredCredential = {
        credentialId: arrayBufferToBase64(credential.rawId),
        email: email,
        userId: userId,
        createdAt: new Date().toISOString()
      };
      saveWebAuthnCredential(storedCred);
      return true;
    }
    return false;
  } catch (error) {
    console.error('WebAuthn registration failed:', error);
    return false;
  }
};

// Authenticate with WebAuthn (returns true if successful)
export const authenticateWithWebAuthn = async (): Promise<{ success: boolean; email?: string; userId?: string }> => {
  try {
    const storedCred = getStoredWebAuthnCredential();
    if (!storedCred) {
      return { success: false };
    }

    const challenge = generateChallenge();
    const credentialIdBuffer = base64ToArrayBuffer(storedCred.credentialId);
    
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: challenge as BufferSource,
        rpId: window.location.hostname,
        userVerification: "required",
        timeout: 60000,
        allowCredentials: [{
          type: "public-key",
          id: credentialIdBuffer as BufferSource
        }]
      }
    }) as PublicKeyCredential;

    if (assertion) {
      return {
        success: true,
        email: storedCred.email,
        userId: storedCred.userId
      };
    }
    return { success: false };
  } catch (error) {
    console.error('WebAuthn authentication failed:', error);
    return { success: false };
  }
};

// Check if user has registered WebAuthn
export const hasWebAuthnCredential = (): boolean => {
  return getStoredWebAuthnCredential() !== null;
};
