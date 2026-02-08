import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Clock, 
  XCircle, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Shield,
  Trash2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { format, formatDistanceToNow, isPast } from 'date-fns';

interface GhostToken {
  id: string;
  jti: string;
  audience: string;
  share_profile: string;
  allowed_claims: string[];
  issued_at: string;
  expires_at: string;
  revoked_at: string | null;
  revocation_reason: string | null;
}

interface GhostTokenHistoryProps {
  userId: string;
}

export const GhostTokenHistory: React.FC<GhostTokenHistoryProps> = ({ userId }) => {
  const [tokens, setTokens] = useState<GhostToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    fetchTokens();
  }, [userId]);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ghost_tokens')
        .select('*')
        .eq('user_id', userId)
        .order('issued_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTokens((data as GhostToken[]) || []);
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
      toast.error('Failed to load token history');
    } finally {
      setLoading(false);
    }
  };

  const revokeToken = async (jti: string) => {
    setRevoking(jti);
    try {
      const { error } = await supabase
        .from('ghost_tokens')
        .update({ 
          revoked_at: new Date().toISOString(),
          revocation_reason: 'manual_revocation'
        })
        .eq('jti', jti)
        .eq('user_id', userId);

      if (error) throw error;
      
      toast.success('Token revoked', {
        description: 'This token can no longer be used for verification.'
      });
      fetchTokens();
    } catch (error) {
      console.error('Failed to revoke token:', error);
      toast.error('Failed to revoke token');
    } finally {
      setRevoking(null);
    }
  };

  const getTokenStatus = (token: GhostToken): { status: 'active' | 'expired' | 'revoked'; color: string } => {
    if (token.revoked_at) {
      return { status: 'revoked', color: 'text-destructive' };
    }
    if (isPast(new Date(token.expires_at))) {
      return { status: 'expired', color: 'text-muted-foreground' };
    }
    return { status: 'active', color: 'text-emerald-400' };
  };

  const getAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'profile_share': return 'Profile Share';
      case 'venue_admission': return 'Venue Entry';
      case 'venue_pass': return 'Venue Pass';
      default: return audience;
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
              <Key className="w-4 h-4 text-purple-400" />
              Token History
            </CardTitle>
            <CardDescription>
              All Ghost tokens minted from your account
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchTokens}
            className="text-muted-foreground"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {tokens.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No tokens minted yet</p>
            <p className="text-muted-foreground/70 text-xs mt-1">
              Tokens are created when you generate a GhostPass QR
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {tokens.map((token) => {
                const { status, color } = getTokenStatus(token);
                return (
                  <div 
                    key={token.id}
                    className="p-4 rounded-xl bg-muted/30 border border-border"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              status === 'active' ? 'border-emerald-500/50 text-emerald-400' :
                              status === 'revoked' ? 'border-destructive/50 text-destructive' :
                              'border-muted-foreground/50 text-muted-foreground'
                            }`}
                          >
                            {status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {status === 'revoked' && <XCircle className="w-3 h-3 mr-1" />}
                            {status === 'expired' && <Clock className="w-3 h-3 mr-1" />}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {getAudienceLabel(token.audience)}
                          </Badge>
                        </div>
                        
                        <p className="text-xs font-mono text-muted-foreground truncate mb-2">
                          JTI: {token.jti.substring(0, 16)}...
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {token.allowed_claims?.slice(0, 3).map((claim) => (
                            <span 
                              key={claim}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400"
                            >
                              {claim}
                            </span>
                          ))}
                          {(token.allowed_claims?.length || 0) > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              +{(token.allowed_claims?.length || 0) - 3} more
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>
                            Issued: {format(new Date(token.issued_at), 'MMM d, h:mm a')}
                          </span>
                          <span>•</span>
                          <span className={color}>
                            {status === 'active' 
                              ? `Expires ${formatDistanceToNow(new Date(token.expires_at), { addSuffix: true })}`
                              : status === 'revoked'
                              ? `Revoked ${formatDistanceToNow(new Date(token.revoked_at!), { addSuffix: true })}`
                              : `Expired ${formatDistanceToNow(new Date(token.expires_at), { addSuffix: true })}`
                            }
                          </span>
                        </div>
                      </div>
                      
                      {status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => revokeToken(token.jti)}
                          disabled={revoking === token.jti}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {revoking === token.jti ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
