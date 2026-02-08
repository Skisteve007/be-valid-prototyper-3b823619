import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Ghost, 
  Key, 
  ScanLine, 
  Settings2, 
  RefreshCw, 
  Shield, 
  Clock, 
  XCircle,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Wifi,
  WifiOff
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import BackButton from '@/components/BackButton';
import { GhostTokenHistory } from './portal/GhostTokenHistory';
import { GhostScanLogs } from './portal/GhostScanLogs';
import { GhostShareSettings } from './portal/GhostShareSettings';

interface GhostPassPortalProps {
  userId: string;
}

const GhostPassPortal: React.FC<GhostPassPortalProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tokens');
  const [syncStatus, setSyncStatus] = useState<'connected' | 'syncing' | 'offline'>('connected');
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Real-time subscription for sync status
  useEffect(() => {
    // Subscribe to ghost_tokens changes for real-time sync
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
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_share_policies',
          filter: `user_id=eq.${userId}`
        },
        () => {
          setSyncStatus('syncing');
          setLastSyncTime(new Date());
          setTimeout(() => setSyncStatus('connected'), 1000);
          toast.success('Settings synced to PWA', {
            description: 'Your GhostPass app will reflect these changes.'
          });
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
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 pt-20 md:pt-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <BackButton fallbackPath="/trust-center" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center border border-purple-500/50">
              <Ghost className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">GhostPass Portal</h1>
              <p className="text-xs text-muted-foreground">Cold storage & audit center</p>
            </div>
          </div>
        </div>
        <SyncIndicator />
      </div>

      {/* Portal Description */}
      <Card className="mb-6 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">
                This portal provides audit access to your GhostPass tokens, scan history, and sharing permissions. 
                Changes here sync in real-time to your GhostPass PWA.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                Last sync: {lastSyncTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6 bg-card border border-border">
          <TabsTrigger 
            value="tokens" 
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
          >
            <Key className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Tokens</span>
          </TabsTrigger>
          <TabsTrigger 
            value="scans"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
          >
            <ScanLine className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Scans</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Share</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className="mt-0">
          <GhostTokenHistory userId={userId} />
        </TabsContent>

        <TabsContent value="scans" className="mt-0">
          <GhostScanLogs userId={userId} />
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <GhostShareSettings userId={userId} onSettingsChange={() => {
            setSyncStatus('syncing');
            setLastSyncTime(new Date());
            setTimeout(() => setSyncStatus('connected'), 1000);
          }} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GhostPassPortal;
