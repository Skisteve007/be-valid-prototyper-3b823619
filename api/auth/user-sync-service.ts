// User Sync Service
// Synchronizes users between be-valid-prototyper and ghost-pass Supabase databases

import { supabase } from '../../src/integrations/supabase/client';
import { ghostPassSupabase } from '../../src/integrations/supabase/ghostpass-client';

export interface SyncedUser {
  id: string;
  email: string;
  role: string;
  venue_id?: string;
  event_id?: string;
  created_at: string;
  synced_at: string;
}

/**
 * Sync user from ghost-pass to be-valid-prototyper database
 * Called when user authenticates via SSO from ghost-pass
 */
export const syncUserToBeValid = async (
  ghostPassUserId: string,
  userData: any
): Promise<SyncedUser> => {
  try {
    // Check if user already exists in be-valid database
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', ghostPassUserId)
      .single();

    if (!checkError && existingUser) {
      // User already exists, just update sync timestamp
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', ghostPassUserId);

      if (updateError) {
        console.error('Error updating user sync timestamp:', updateError);
      }

      return {
        id: ghostPassUserId,
        email: userData.email,
        role: userData.role,
        venue_id: userData.venue_id,
        event_id: userData.event_id,
        created_at: userData.created_at,
        synced_at: new Date().toISOString(),
      };
    }

    // Create new user profile in be-valid database
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        user_id: ghostPassUserId,
        email: userData.email,
        role: userData.role,
        venue_id: userData.venue_id,
        event_id: userData.event_id,
        created_at: userData.created_at,
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      throw new Error(`Failed to create user profile: ${insertError.message}`);
    }

    // Log the sync event
    await logUserSync(ghostPassUserId, 'GHOST_PASS_TO_BEVALID', userData.email);

    return {
      id: ghostPassUserId,
      email: userData.email,
      role: userData.role,
      venue_id: userData.venue_id,
      event_id: userData.event_id,
      created_at: userData.created_at,
      synced_at: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Error syncing user to be-valid:', error);
    throw error;
  }
};

/**
 * Sync user from be-valid to ghost-pass database
 * Called when user creates account on be-valid
 */
export const syncUserToGhostPass = async (
  beValidUserId: string,
  userData: any
): Promise<SyncedUser> => {
  try {
    // Check if user already exists in ghost-pass database
    const { data: existingUser, error: checkError } = await ghostPassSupabase
      .from('users')
      .select('*')
      .eq('id', beValidUserId)
      .single();

    if (!checkError && existingUser) {
      // User already exists, just update sync timestamp
      const { error: updateError } = await ghostPassSupabase
        .from('users')
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('id', beValidUserId);

      if (updateError) {
        console.error('Error updating user sync timestamp in ghost-pass:', updateError);
      }

      return {
        id: beValidUserId,
        email: userData.email,
        role: userData.role,
        venue_id: userData.venue_id,
        event_id: userData.event_id,
        created_at: userData.created_at,
        synced_at: new Date().toISOString(),
      };
    }

    // Create new user in ghost-pass database
    const { error: insertError } = await ghostPassSupabase
      .from('users')
      .insert({
        id: beValidUserId,
        email: userData.email,
        role: userData.role,
        venue_id: userData.venue_id,
        event_id: userData.event_id,
        created_at: userData.created_at,
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      throw new Error(`Failed to create user in ghost-pass: ${insertError.message}`);
    }

    // Log the sync event
    await logUserSync(beValidUserId, 'BEVALID_TO_GHOST_PASS', userData.email);

    return {
      id: beValidUserId,
      email: userData.email,
      role: userData.role,
      venue_id: userData.venue_id,
      event_id: userData.event_id,
      created_at: userData.created_at,
      synced_at: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Error syncing user to ghost-pass:', error);
    throw error;
  }
};

/**
 * Get user from ghost-pass database
 */
export const getGhostPassUser = async (userId: string) => {
  try {
    const { data, error } = await ghostPassSupabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching ghost-pass user:', error);
    return null;
  }
};

/**
 * Get user from be-valid database
 */
export const getBeValidUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching be-valid user:', error);
    return null;
  }
};

/**
 * Log user sync events for audit trail
 */
const logUserSync = async (
  userId: string,
  syncDirection: 'GHOST_PASS_TO_BEVALID' | 'BEVALID_TO_GHOST_PASS',
  email: string
) => {
  try {
    // Log in be-valid audit logs
    await supabase.from('audit_logs').insert({
      action_type: 'USER_SYNC',
      status: 'success',
      metadata: {
        user_id: userId,
        email: email,
        sync_direction: syncDirection,
        synced_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error logging user sync:', error);
  }
};

/**
 * Verify user exists in both databases
 */
export const verifyUserSync = async (userId: string): Promise<{
  inBeValid: boolean;
  inGhostPass: boolean;
  synced: boolean;
}> => {
  const beValidUser = await getBeValidUser(userId);
  const ghostPassUser = await getGhostPassUser(userId);

  return {
    inBeValid: !!beValidUser,
    inGhostPass: !!ghostPassUser,
    synced: !!(beValidUser && ghostPassUser),
  };
};
