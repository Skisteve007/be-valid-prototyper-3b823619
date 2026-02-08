import React, { useState, useEffect } from 'react';
import { 
  Settings2, 
  Shield, 
  Fingerprint,
  Wallet,
  Heart,
  FlaskConical,
  User,
  RefreshCw,
  Save,
  History
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface SharePolicy {
  id: string;
  active_profile: 'public' | 'minimal' | 'custom' | 'nothing';
  custom_locks: {
    id?: boolean;
    funds?: boolean;
    bio?: boolean;
    tox?: boolean;
    profile?: boolean;
  } | null;
  updated_at: string;
}

interface ProfileShares {
  share_id_enabled: boolean;
  share_funds_enabled: boolean;
  share_bio_enabled: boolean;
  share_tox_enabled: boolean;
  share_profile_enabled: boolean;
}

interface GhostShareSettingsProps {
  userId: string;
  onSettingsChange?: () => void;
}

const SHARE_OPTIONS = [
  { key: 'share_id_enabled', label: 'Identity', icon: Fingerprint, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
  { key: 'share_funds_enabled', label: 'Funds', icon: Wallet, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  { key: 'share_bio_enabled', label: 'Bio Health', icon: Heart, color: 'text-destructive', bgColor: 'bg-destructive/20' },
  { key: 'share_tox_enabled', label: 'Toxicology', icon: FlaskConical, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  { key: 'share_profile_enabled', label: 'Profile', icon: User, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
] as const;

export const GhostShareSettings: React.FC<GhostShareSettingsProps> = ({ userId, onSettingsChange }) => {
  const [shares, setShares] = useState<ProfileShares>({
    share_id_enabled: false,
    share_funds_enabled: false,
    share_bio_enabled: false,
    share_tox_enabled: false,
    share_profile_enabled: false,
  });
  const [policy, setPolicy] = useState<SharePolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalShares, setOriginalShares] = useState<ProfileShares | null>(null);

  useEffect(() => {
    fetchSettings();
  }, [userId]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Fetch profile share settings
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('share_id_enabled, share_funds_enabled, share_bio_enabled, share_tox_enabled, share_profile_enabled')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) throw profileError;
      
      const profileShares: ProfileShares = {
        share_id_enabled: profile?.share_id_enabled ?? false,
        share_funds_enabled: profile?.share_funds_enabled ?? false,
        share_bio_enabled: profile?.share_bio_enabled ?? false,
        share_tox_enabled: profile?.share_tox_enabled ?? false,
        share_profile_enabled: profile?.share_profile_enabled ?? false,
      };
      
      setShares(profileShares);
      setOriginalShares(profileShares);

      // Fetch share policy
      const { data: policyData, error: policyError } = await supabase
        .from('user_share_policies')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (policyError && policyError.code !== 'PGRST116') throw policyError;
      setPolicy(policyData as SharePolicy | null);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load share settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof ProfileShares) => {
    setShares(prev => {
      const newShares = { ...prev, [key]: !prev[key] };
      // Check if there are changes from original
      if (originalShares) {
        const changed = Object.keys(newShares).some(
          k => newShares[k as keyof ProfileShares] !== originalShares[k as keyof ProfileShares]
        );
        setHasChanges(changed);
      }
      return newShares;
    });
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Update profile share settings
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          share_id_enabled: shares.share_id_enabled,
          share_funds_enabled: shares.share_funds_enabled,
          share_bio_enabled: shares.share_bio_enabled,
          share_tox_enabled: shares.share_tox_enabled,
          share_profile_enabled: shares.share_profile_enabled,
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Update or create share policy
      const customLocks = {
        id: shares.share_id_enabled,
        funds: shares.share_funds_enabled,
        bio: shares.share_bio_enabled,
        tox: shares.share_tox_enabled,
        profile: shares.share_profile_enabled,
      };

      const { error: policyError } = await supabase
        .from('user_share_policies')
        .upsert({
          user_id: userId,
          active_profile: 'custom' as const,
          custom_locks: customLocks,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (policyError) throw policyError;

      setOriginalShares(shares);
      setHasChanges(false);
      
      toast.success('Settings saved', {
        description: 'Your sharing preferences have been updated and synced.'
      });
      
      onSettingsChange?.();
      fetchSettings(); // Refresh to get updated policy
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
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
              <Settings2 className="w-4 h-4 text-amber-400" />
              Share Settings
            </CardTitle>
            <CardDescription>
              Control what data is included in your GhostPass
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchSettings}
            className="text-muted-foreground"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Current Policy Status */}
        {policy && (
          <div className="mb-6 p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium">Active Profile:</span>
                <Badge variant="outline" className="capitalize">
                  {policy.active_profile}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <History className="w-3 h-3" />
                {format(new Date(policy.updated_at), 'MMM d, h:mm a')}
              </span>
            </div>
          </div>
        )}

        {/* Share Toggles */}
        <div className="space-y-4">
          {SHARE_OPTIONS.map(({ key, label, icon: Icon, color, bgColor }) => (
            <div 
              key={key}
              className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="font-medium text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">
                    {shares[key] ? 'Shared with scanners' : 'Hidden from scanners'}
                  </p>
                </div>
              </div>
              <Switch
                checked={shares[key]}
                onCheckedChange={() => handleToggle(key)}
              />
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {hasChanges 
              ? 'You have unsaved changes' 
              : 'Settings synced with PWA'}
          </p>
          <Button
            onClick={saveSettings}
            disabled={!hasChanges || saving}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save & Sync
          </Button>
        </div>

        {/* PWA Sync Note */}
        <div className="mt-4 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
          <p className="text-xs text-muted-foreground">
            <span className="text-purple-400 font-medium">PWA Sync:</span> Changes here are automatically 
            reflected in your GhostPass mobile app. The same database powers both interfaces for 
            seamless, frictionless synchronization.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
