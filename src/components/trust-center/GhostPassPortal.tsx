import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Ghost, 
  Shield, 
  RefreshCw, 
  Wifi,
  WifiOff,
  Terminal
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import BackButton from '@/components/BackButton';

interface GhostPassPortalProps {
  userId: string;
}

const GhostPassPortal: React.FC<GhostPassPortalProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [syncStatus, setSyncStatus] = useState<'connected' | 'syncing' | 'offline'>('connected');
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Real-time subscription for sync status
  useEffect(() => {
    const channel = supabase
      .channel('ghost-portal-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ghost_tokens',
          filter: `user_id=eq.${userId}`
        },
        () => {
          setSyncStatus('syncing');
          setLastSyncTime(new Date());
          setTimeout(() => setSyncStatus('connected'), 1000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const SyncIndicator = () => (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
      {syncStatus === 'connected' && (
        <>
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">PWA Synced</span>
        </>
      )}
      {syncStatus === 'syncing' && (
        <>
          <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span className="text-xs text-amber-400 font-medium">Syncing...</span>
        </>
      )}
      {syncStatus === 'offline' && (
        <>
          <WifiOff className="w-3.5 h-3.5 text-destructive" />
          <span className="text-xs text-destructive font-medium">Offline</span>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 pt-24 md:pt-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <BackButton fallbackPath="/trust-center" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center border border-purple-500/50">
              <Ghost className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">Ghost Pass Command Center</h1>
              <p className="text-xs text-muted-foreground">Operations & audit hub</p>
            </div>
          </div>
        </div>
        <SyncIndicator />
      </div>

      {/* Command Center Placeholder */}
      <Card className="mb-6 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">
                The Ghost Pass Command Center provides operational control over tokens, scan audit trails, and sharing permissions.
                Real-time sync with the GhostPass PWA is active.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                Last sync: {lastSyncTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ready for Integration */}
      <Card className="border-dashed border-2 border-purple-500/30 bg-purple-500/5">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <Terminal className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Command Center Ready</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            This module is staged and ready for the full command center build-out. 
            Token management, scan logs, and share settings will be integrated here.
          </p>
          <div className="flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-card border border-border">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground font-mono">AWAITING BUILD</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GhostPassPortal;
