// SSO Authentication Service
// This service handles SSO token validation using ghost-pass Supabase

import { ghostPassSupabase } from '../../src/integrations/supabase/ghostpass-client';

export interface SSOAuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    venue_id?: string;
    event_id?: string;
    created_at: string;
  };
  message: string;
}

export const authenticateSSO = async (
  ssoToken: string,
  deviceFingerprint: string
): Promise<SSOAuthResponse> => {
  try {
    // Fetch the SSO token from ghost-pass database
    const { data: tokenRecord, error: fetchError } = await ghostPassSupabase
      .from('sso_tokens')
      .select('*')
      .eq('token', ssoToken)
      .single();

    if (fetchError || !tokenRecord) {
      throw new Error('SSO token not found or invalid');
    }

    // Check if token has expired
    if (new Date(tokenRecord.expires_at) < new Date()) {
      throw new Error('This SSO token has expired. Please generate a new one.');
    }

    // Check if token has already been used
    if (tokenRecord.used) {
      throw new Error('This SSO token has already been used');
    }

    // Verify device fingerprint matches
    if (tokenRecord.device_fingerprint !== deviceFingerprint) {
      throw new Error('This token was generated for a different device');
    }

    // Mark token as used
    const { error: updateError } = await ghostPassSupabase
      .from('sso_tokens')
      .update({ 
        used: true, 
        used_at: new Date().toISOString() 
      })
      .eq('token', ssoToken);

    if (updateError) {
      throw new Error('Failed to mark token as used');
    }

    // Get user data from ghost-pass database
    const { data: userData, error: userError } = await ghostPassSupabase
      .from('users')
      .select('id, email, role, venue_id, event_id, created_at')
      .eq('id', tokenRecord.user_id)
      .single();

    if (userError || !userData) {
      throw new Error('Associated user account not found');
    }

    // Create a session token for beVALID
    const sessionToken = crypto.randomUUID();
    
    // Store session data that will be used by beVALID
    const sessionData = {
      user: userData,
      token: sessionToken,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    // Store session in localStorage for beVALID to use
    localStorage.setItem('sso_session', JSON.stringify(sessionData));

    // Log the SSO authentication in ghost-pass audit logs
    await ghostPassSupabase.from('audit_logs').insert({
      admin_user_id: userData.id,
      admin_email: userData.email,
      action: 'SSO_AUTHENTICATION',
      resource_type: 'sso_token',
      resource_id: tokenRecord.id,
      metadata: {
        device_fingerprint: deviceFingerprint.substring(0, 8) + '...',
        authenticated_at: new Date().toISOString(),
        authenticated_from: 'beVALID'
      }
    });

    return {
      access_token: sessionToken,
      user: userData,
      message: 'Authentication successful'
    };

  } catch (error: any) {
    console.error('SSO authentication error:', error);
    throw error;
  }
};
