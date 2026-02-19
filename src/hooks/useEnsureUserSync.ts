import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ghostPassSupabase } from '@/integrations/supabase/ghostpass-client';

/**
 * Hook to ensure current user is synced to ghost-pass database
 * This is critical for features that rely on ghost-pass data (audit trail, command center, etc.)
 * 
 * Uses Supabase Edge Function to handle user creation with admin privileges
 */
export const useEnsureUserSync = () => {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent double execution in React strict mode
    if (hasRun.current) return;
    hasRun.current = true;

    const syncCurrentUser = async () => {
      try {
        setSyncing(true);
        setError(null);

        // Get current user from be-valid
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('[useEnsureUserSync] No session found');
          setSyncing(false);
          return;
        }

        const userId = session.user.id;
        const userEmail = session.user.email;

        console.log('[useEnsureUserSync] Checking sync for user:', userId);

        // Check if user exists in ghost-pass public.users table
        const { data: ghostPassUser, error: checkError } = await ghostPassSupabase
          .from('users')
          .select('id, email, role')
          .eq('id', userId)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
          // PGRST116 is "not found" which is expected
          console.error('[useEnsureUserSync] Error checking ghost-pass user:', checkError);
          throw checkError;
        }

        if (ghostPassUser) {
          console.log('[useEnsureUserSync] User already exists in ghost-pass:', ghostPassUser);
          setSynced(true);
          setSyncing(false);
          return;
        }

        // User doesn't exist in ghost-pass, sync them via Edge Function
        console.log('[useEnsureUserSync] User not found in ghost-pass, syncing via Edge Function...');

        // Get user role from be-valid (if exists)
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .maybeSingle();

        // Map be-valid roles to ghost-pass roles
        let ghostPassRole: 'USER' | 'VENDOR' | 'ADMIN' | 'VENUE_ADMIN' = 'USER';
        if (roleData) {
          if (roleData.role === 'administrator') {
            ghostPassRole = 'ADMIN';
          } else if ((roleData.role as string) === 'venue_operator') {
            ghostPassRole = 'VENUE_ADMIN';
          }
        }

        // Call Supabase Edge Function to sync user (uses service role key)
        const { data, error: functionError } = await ghostPassSupabase.functions.invoke('sync-user', {
          body: {
            userId,
            email: userEmail,
            role: ghostPassRole,
          },
        });

        if (functionError) {
          console.error('[useEnsureUserSync] Edge Function error:', functionError);
          
          // Try to get more details from the response
          if (data) {
            console.error('[useEnsureUserSync] Edge Function response:', data);
          }
          
          throw new Error(functionError.message || 'Failed to sync user via Edge Function');
        }

        if (!data?.success) {
          console.error('[useEnsureUserSync] Edge Function returned error:', data);
          throw new Error(data?.error || data?.details || 'Unknown error syncing user');
        }

        console.log('[useEnsureUserSync] User successfully synced:', data);
        setSynced(true);
        setSyncing(false);
        
      } catch (err: any) {
        console.error('[useEnsureUserSync] Sync failed:', err);
        setError(err.message || 'Failed to sync user');
        setSyncing(false);
      }
    };

    syncCurrentUser();
  }, []);

  return { syncing, synced, error };
};
