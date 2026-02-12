import { useState, useEffect } from 'react';
import { ghostPassSupabase } from '@/integrations/supabase/ghostpass-client';

// Development mode bypass
const DEV_MODE = import.meta.env.DEV;

export const useIsVenueOperator = () => {
  const [isVenueOperator, setIsVenueOperator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkVenueOperatorStatus = async () => {
      try {
        // In development mode, bypass authorization
        if (DEV_MODE) {
          console.log('[DEV MODE] Venue operator authorization bypassed for development');
          setIsVenueOperator(true);
          setUserEmail('dev@localhost');
          setLoading(false);
          return;
        }

        const { data: { user } } = await ghostPassSupabase.auth.getUser();
        
        if (!user) {
          setIsVenueOperator(false);
          setUserEmail(null);
          setLoading(false);
          return;
        }

        setUserEmail(user.email || null);

        // Check if user has venue_operator role
        const { data: roleData, error } = await ghostPassSupabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['venue_operator', 'administrator', 'owner'])
          .maybeSingle();

        if (error) {
          console.error('Error checking venue operator status:', error);
          setIsVenueOperator(false);
        } else {
          setIsVenueOperator(!!roleData);
        }
      } catch (error) {
        console.error('Error checking venue operator status:', error);
        setIsVenueOperator(false);
      } finally {
        setLoading(false);
      }
    };

    checkVenueOperatorStatus();

    const { data: { subscription } } = ghostPassSupabase.auth.onAuthStateChange(() => {
      checkVenueOperatorStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isVenueOperator, loading, userEmail };
};
