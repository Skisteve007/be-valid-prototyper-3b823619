import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StatusUpdate {
  user_id: string;
  status_color: string;
  status_expiry: string | null;
  lab_certified: boolean;
  updated_at: string;
}

interface LabOrderUpdate {
  id: string;
  user_id: string;
  order_status: string;
  result_status: string | null;
  updated_at: string;
}

export const useRealtimeStatusSync = (userId?: string) => {
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [labOrderUpdates, setLabOrderUpdates] = useState<LabOrderUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    console.log('[Realtime] Setting up status sync channels for user:', userId);

    // Channel for profile status changes
    const profileChannel = supabase
      .channel('profile-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('[Realtime] Profile status update received:', payload);
          const newStatus = payload.new as StatusUpdate;
          setStatusUpdates(prev => [...prev, newStatus]);
          
          // Notify user of status change
          if (newStatus.status_color) {
            const statusMessage = newStatus.status_color === 'green' 
              ? 'Your status has been verified!' 
              : newStatus.status_color === 'grey' 
                ? 'Your status has expired' 
                : 'Your status has been updated';
            
            toast({
              title: 'Status Updated',
              description: statusMessage,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Profile channel status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Channel for lab order updates
    const labOrderChannel = supabase
      .channel('lab-order-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lab_orders',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('[Realtime] Lab order update received:', payload);
          const orderUpdate = payload.new as LabOrderUpdate;
          setLabOrderUpdates(prev => [...prev, orderUpdate]);
          
          // Notify user of lab result
          if (orderUpdate.order_status === 'result_received') {
            toast({
              title: 'Lab Results Available',
              description: 'Your lab results have arrived. Please review in your Private Inbox.',
              variant: 'default',
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Lab order channel status:', status);
      });

    // Cleanup on unmount
    return () => {
      console.log('[Realtime] Cleaning up channels');
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(labOrderChannel);
    };
  }, [userId, toast]);

  return {
    statusUpdates,
    labOrderUpdates,
    isConnected,
    latestStatus: statusUpdates[statusUpdates.length - 1] || null,
    latestLabOrder: labOrderUpdates[labOrderUpdates.length - 1] || null,
  };
};

// Hook for venue operators to monitor scans in real-time
export const useRealtimeVenueScans = (venueId?: string) => {
  const [scans, setScans] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!venueId) return;

    console.log('[Realtime] Setting up venue scan channel for venue:', venueId);

    const scanChannel = supabase
      .channel(`venue-scans-${venueId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'venue_qr_scans',
          filter: `venue_id=eq.${venueId}`
        },
        (payload) => {
          console.log('[Realtime] New venue scan:', payload);
          setScans(prev => [payload.new, ...prev]);
          
          toast({
            title: 'New QR Scan',
            description: `Member scanned at ${new Date().toLocaleTimeString()}`,
          });
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Venue scan channel status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(scanChannel);
    };
  }, [venueId, toast]);

  return { scans, isConnected };
};

// Admin hook for monitoring all status changes
export const useRealtimeAdminMonitor = () => {
  const [allUpdates, setAllUpdates] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('[Realtime] Setting up admin monitor channel');

    const adminChannel = supabase
      .channel('admin-status-monitor')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('[Realtime] Admin monitor - profile change:', payload);
          setAllUpdates(prev => [{
            type: 'profile',
            event: payload.eventType,
            data: payload.new,
            timestamp: new Date().toISOString()
          }, ...prev.slice(0, 99)]); // Keep last 100 updates
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lab_orders'
        },
        (payload) => {
          console.log('[Realtime] Admin monitor - lab order change:', payload);
          setAllUpdates(prev => [{
            type: 'lab_order',
            event: payload.eventType,
            data: payload.new,
            timestamp: new Date().toISOString()
          }, ...prev.slice(0, 99)]);
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Admin monitor channel status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(adminChannel);
    };
  }, []);

  return { allUpdates, isConnected };
};
