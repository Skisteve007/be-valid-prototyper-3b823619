import React, { useState, useEffect } from 'react';
import { 
  ScanLine, 
  CheckCircle, 
  XCircle, 
  MapPin,
  Clock,
  RefreshCw,
  Shield,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';

interface ScanLog {
  id: string;
  venue_id: string;
  scan_result: string;
  deny_reason: string | null;
  created_at: string;
  station_label: string | null;
  operator_label: string | null;
}

interface GhostTokenEvent {
  id: string;
  jti: string;
  event_type: string;
  actor_type: string | null;
  purpose: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface GhostScanLogsProps {
  userId: string;
}

export const GhostScanLogs: React.FC<GhostScanLogsProps> = ({ userId }) => {
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
  const [tokenEvents, setTokenEvents] = useState<GhostTokenEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'scans' | 'events'>('scans');

  useEffect(() => {
    fetchLogs();
  }, [userId]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Fetch door scan logs where this user was scanned
      const { data: scans, error: scansError } = await supabase
        .from('door_scan_log')
        .select('*')
        .eq('scanned_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (scansError) throw scansError;
      setScanLogs((scans as ScanLog[]) || []);

      // Fetch token events for tokens belonging to this user
      const { data: userTokens } = await supabase
        .from('ghost_tokens')
        .select('jti')
        .eq('user_id', userId);

      if (userTokens && userTokens.length > 0) {
        const jtis = userTokens.map(t => t.jti);
        const { data: events, error: eventsError } = await supabase
          .from('ghost_token_events')
          .select('*')
          .in('jti', jtis)
          .order('created_at', { ascending: false })
          .limit(50);

        if (eventsError) throw eventsError;
        setTokenEvents((events as GhostTokenEvent[]) || []);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      toast.error('Failed to load scan history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-cyan-400" />
              Scan & Event Logs
            </CardTitle>
            <CardDescription>
              Audit trail of all QR scans and token events
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setViewMode('scans')}
                className={`px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === 'scans' 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Scans
              </button>
              <button
                onClick={() => setViewMode('events')}
                className={`px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === 'events' 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Events
              </button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchLogs}
              className="text-muted-foreground"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'scans' ? (
          scanLogs.length === 0 ? (
            <div className="text-center py-8">
              <ScanLine className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No scan records yet</p>
              <p className="text-muted-foreground/70 text-xs mt-1">
                Scans appear when venues verify your GhostPass
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {scanLogs.map((log) => (
                  <div 
                    key={log.id}
                    className="p-4 rounded-xl bg-muted/30 border border-border"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          log.scan_result === 'admitted' || log.scan_result === 'pass'
                            ? 'bg-emerald-500/20' 
                            : 'bg-destructive/20'
                        }`}>
                          {log.scan_result === 'admitted' || log.scan_result === 'pass' ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-destructive" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                log.scan_result === 'admitted' || log.scan_result === 'pass'
                                  ? 'border-emerald-500/50 text-emerald-400' 
                                  : 'border-destructive/50 text-destructive'
                              }`}
                            >
                              {log.scan_result === 'admitted' || log.scan_result === 'pass' 
                                ? 'Admitted' 
                                : 'Denied'}
                            </Badge>
                            {log.station_label && (
                              <Badge variant="secondary" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {log.station_label}
                              </Badge>
                            )}
                          </div>
                          
                          {log.deny_reason && (
                            <p className="text-xs text-destructive mb-1">
                              Reason: {log.deny_reason}
                            </p>
                          )}
                          
                          {log.operator_label && (
                            <p className="text-xs text-muted-foreground mb-1">
                              <User className="w-3 h-3 inline mr-1" />
                              {log.operator_label}
                            </p>
                          )}
                          
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                            <span className="text-muted-foreground/60">
                              ({formatDistanceToNow(new Date(log.created_at), { addSuffix: true })})
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )
        ) : (
          tokenEvents.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No token events yet</p>
              <p className="text-muted-foreground/70 text-xs mt-1">
                Events are logged when tokens are minted, verified, or revoked
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {tokenEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="p-4 rounded-xl bg-muted/30 border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        event.event_type === 'minted' ? 'bg-purple-500/20' :
                        event.event_type === 'verified' ? 'bg-emerald-500/20' :
                        event.event_type === 'revoked' ? 'bg-destructive/20' :
                        'bg-muted'
                      }`}>
                        <Shield className={`w-5 h-5 ${
                          event.event_type === 'minted' ? 'text-purple-400' :
                          event.event_type === 'verified' ? 'text-emerald-400' :
                          event.event_type === 'revoked' ? 'text-destructive' :
                          'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant="outline" 
                            className="text-xs capitalize"
                          >
                            {event.event_type}
                          </Badge>
                          {event.purpose && (
                            <Badge variant="secondary" className="text-xs">
                              {event.purpose}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs font-mono text-muted-foreground truncate mb-1">
                          Token: {event.jti.substring(0, 16)}...
                        </p>
                        
                        {event.actor_type && (
                          <p className="text-xs text-muted-foreground mb-1">
                            Actor: {event.actor_type}
                          </p>
                        )}
                        
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(event.created_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )
        )}
      </CardContent>
    </Card>
  );
};
