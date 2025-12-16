import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GlobalStats {
  total_fans_protected: number;
  total_venues_verified: number;
  total_threats_blocked: number;
  avg_scan_time_ms: number;
  data_retention_time_ms: number;
}

export const usePrivacyStats = () => {
  const [stats, setStats] = useState<GlobalStats>({
    total_fans_protected: 500000,
    total_venues_verified: 12,
    total_threats_blocked: 847,
    avg_scan_time_ms: 230,
    data_retention_time_ms: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('global_stats')
          .select('stat_key, stat_value');

        if (error) throw error;

        if (data) {
          const statsMap: GlobalStats = {
            total_fans_protected: 500000,
            total_venues_verified: 12,
            total_threats_blocked: 847,
            avg_scan_time_ms: 230,
            data_retention_time_ms: 0,
          };

          data.forEach((row) => {
            if (row.stat_key in statsMap) {
              (statsMap as any)[row.stat_key] = Number(row.stat_value);
            }
          });

          setStats(statsMap);
        }
      } catch (error) {
        console.error('Error fetching privacy stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
};
