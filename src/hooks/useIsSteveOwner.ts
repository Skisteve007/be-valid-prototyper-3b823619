import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const STEVE_EMAILS = ['steve@bevalid.app', 'sgrillocce@gmail.com'];

// Development mode bypass - set to false for production
const DEV_MODE = import.meta.env.DEV;

export const useIsSteveOwner = () => {
  const [isSteveOwner, setIsSteveOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSteveStatus = async () => {
      try {
        // In development mode, bypass authorization
        if (DEV_MODE) {
          console.log('[DEV MODE] Tier-0 authorization bypassed for development');
          setIsSteveOwner(true);
          setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.email) {
          const isSteve = STEVE_EMAILS.includes(session.user.email.toLowerCase());
          setIsSteveOwner(isSteve);
        } else {
          setIsSteveOwner(false);
        }
      } catch (error) {
        console.error('Error checking Steve owner status:', error);
        setIsSteveOwner(false);
      } finally {
        setLoading(false);
      }
    };

    checkSteveStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSteveStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isSteveOwner, loading };
};
