import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const STEVE_EMAILS = ['steve@bevalid.app', 'sgrillocce@gmail.com'];

export const useIsSteveOwner = () => {
  const [isSteveOwner, setIsSteveOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSteveStatus = async () => {
      try {
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
