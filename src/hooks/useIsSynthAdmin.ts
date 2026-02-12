import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Strict admin allowlist for internal SYNTH docs
const SYNTH_ADMIN_ALLOWLIST = [
  'steve@bevalid.app',
  'sgrillocce@gmail.com'
];

// Development mode bypass
const DEV_MODE = import.meta.env.DEV;

export function useIsSynthAdmin() {
  const [isSynthAdmin, setIsSynthAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // In development mode, bypass authorization
        if (DEV_MODE) {
          console.log('[DEV MODE] SYNTH admin authorization bypassed for development');
          setUserEmail('dev@localhost');
          setIsSynthAdmin(true);
          setIsLoading(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        const email = user?.email?.toLowerCase() || null;
        setUserEmail(email);
        setIsSynthAdmin(email ? SYNTH_ADMIN_ALLOWLIST.includes(email) : false);
      } catch (error) {
        console.error('Error checking SYNTH admin status:', error);
        setIsSynthAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (DEV_MODE) {
        setUserEmail('dev@localhost');
        setIsSynthAdmin(true);
        return;
      }

      const email = session?.user?.email?.toLowerCase() || null;
      setUserEmail(email);
      setIsSynthAdmin(email ? SYNTH_ADMIN_ALLOWLIST.includes(email) : false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isSynthAdmin, isLoading, userEmail };
}
