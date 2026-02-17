// Create User API Endpoint
// Handles user creation in be-valid and syncs to ghost-pass

import { supabase } from '../../src/integrations/supabase/client';
import { syncUserToGhostPass } from './user-sync-service';

export interface CreateUserRequest {
  email: string;
  password: string;
  full_name: string;
  role?: string;
  venue_id?: string;
  event_id?: string;
}

export interface CreateUserResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    synced: boolean;
  };
  error?: string;
}

/**
 * Create a new user in be-valid and sync to ghost-pass
 */
export const createUser = async (
  userData: CreateUserRequest
): Promise<CreateUserResponse> => {
  try {
    // Validate input
    if (!userData.email || !userData.password || !userData.full_name) {
      return {
        success: false,
        error: 'Email, password, and full name are required',
      };
    }

    // Create auth user in Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name,
        },
      },
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || 'Failed to create user',
      };
    }

    const userId = authData.user.id;

    // Create profile in be-valid database
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role || 'USER',
        venue_id: userData.venue_id,
        event_id: userData.event_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return {
        success: false,
        error: 'Failed to create user profile',
      };
    }

    // Sync user to ghost-pass database
    const syncResult = await syncUserToGhostPass(userId, {
      email: userData.email,
      full_name: userData.full_name,
      role: userData.role || 'USER',
      venue_id: userData.venue_id,
      event_id: userData.event_id,
      created_at: new Date().toISOString(),
    });

    return {
      success: true,
      user: {
        id: userId,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role || 'USER',
        synced: !!syncResult,
      },
    };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: error.message || 'Failed to create user',
    };
  }
};
