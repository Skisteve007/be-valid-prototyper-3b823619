import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Hook for real-time active visitors using Supabase Presence
export const useActiveVisitors = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const channel = supabase.channel('landing-page-visitors', {
      config: { presence: { key: crypto.randomUUID() } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return count;
};

// Hook for total registered users with real-time updates
export const useTotalUsers = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Initial fetch
    const fetchCount = async () => {
      const { count: totalCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      setCount(totalCount || 0);
    };

    fetchCount();

    // Subscribe to realtime inserts
    const channel = supabase
      .channel('user-count-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'profiles' },
        () => {
          setCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return count;
};
