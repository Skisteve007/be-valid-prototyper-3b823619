import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Lock, Unlock, User, CreditCard, FileText, Shield, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ShareProfile = 'public' | 'minimal' | 'custom' | 'nothing';
type ShareCategory = 'profile' | 'id' | 'funds' | 'bio' | 'tox';

interface CategoryLock {
  category: ShareCategory;
  is_locked: boolean;
}

const CATEGORY_CONFIG: Record<ShareCategory, { label: string; icon: typeof User; description: string }> = {
  profile: { label: 'Profile', icon: User, description: 'Basics, vibe tags, questions' },
  id: { label: 'ID', icon: Shield, description: 'Age verified, IDV tier, member since' },
  funds: { label: 'Funds', icon: CreditCard, description: 'Wallet tier, pass eligibility' },
  bio: { label: 'Bio', icon: FileText, description: 'Location, interests' },
  tox: { label: 'Tox', icon: Heart, description: 'Drug panel status' },
};

const PROFILE_CONFIG: Record<ShareProfile, { label: string; description: string }> = {
  public: { label: 'Public', description: 'Share all unlocked signals' },
  minimal: { label: 'Minimal', description: 'Age + ID verification only' },
  custom: { label: 'Custom', description: 'Choose what to share below' },
  nothing: { label: 'Share Nothing', description: 'Return restricted stub only' },
};

interface GhostShareSettingsProps {
  userId: string;
}

export function GhostShareSettings({ userId }: GhostShareSettingsProps) {
  const [activeProfile, setActiveProfile] = useState<ShareProfile>('nothing');
  const [locks, setLocks] = useState<CategoryLock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, [userId]);

  const loadSettings = async () => {
    try {
      // Load share policy
      const { data: policy } = await supabase
        .from('user_share_policies')
        .select('active_profile')
        .eq('user_id', userId)
        .single();

      if (policy) {
        setActiveProfile(policy.active_profile as ShareProfile);
      }

      // Load locks
      const { data: lockData } = await supabase
        .from('user_share_locks')
        .select('category, is_locked')
        .eq('user_id', userId);

      if (lockData) {
        setLocks(lockData as CategoryLock[]);
      }
    } catch (error) {
      console.error('Failed to load share settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profile: ShareProfile) => {
    setActiveProfile(profile);
    try {
      await supabase.from('user_share_policies').upsert({
        user_id: userId,
        active_profile: profile,
        updated_at: new Date().toISOString(),
      });
      toast.success('Share profile updated');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const toggleLock = async (category: ShareCategory) => {
    const current = locks.find(l => l.category === category);
    const newState = !current?.is_locked;
    
    setLocks(prev => {
      const existing = prev.find(l => l.category === category);
      if (existing) {
        return prev.map(l => l.category === category ? { ...l, is_locked: newState } : l);
      }
      return [...prev, { category, is_locked: newState }];
    });

    try {
      await supabase.from('user_share_locks').upsert({
        user_id: userId,
        category,
        is_locked: newState,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      toast.error('Failed to update lock');
    }
  };

  const isLocked = (category: ShareCategory) => {
    if (activeProfile === 'nothing') return true;
    if (activeProfile === 'minimal') return !['id'].includes(category);
    return locks.find(l => l.category === category)?.is_locked ?? false;
  };

  if (loading) return <div className="animate-pulse h-48 bg-muted rounded-lg" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Choose Your Share
        </CardTitle>
        <CardDescription>
          Control what signals are shared when your QR is scanned
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Selector */}
        <RadioGroup value={activeProfile} onValueChange={(v) => updateProfile(v as ShareProfile)}>
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(PROFILE_CONFIG) as [ShareProfile, typeof PROFILE_CONFIG[ShareProfile]][]).map(([key, config]) => (
              <Label
                key={key}
                htmlFor={key}
                className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-colors ${
                  activeProfile === key ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value={key} id={key} />
                  <span className="font-medium">{config.label}</span>
                </div>
                <span className="text-xs text-muted-foreground mt-1 ml-6">{config.description}</span>
              </Label>
            ))}
          </div>
        </RadioGroup>

        {/* Category Locks (only show for custom) */}
        {activeProfile === 'custom' && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium">Tab Locks</h4>
            {(Object.entries(CATEGORY_CONFIG) as [ShareCategory, typeof CATEGORY_CONFIG[ShareCategory]][]).map(([category, config]) => {
              const locked = isLocked(category);
              const Icon = config.icon;
              return (
                <div key={category} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{config.label}</p>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {locked ? <Lock className="h-4 w-4 text-destructive" /> : <Unlock className="h-4 w-4 text-green-500" />}
                    <Switch checked={!locked} onCheckedChange={() => toggleLock(category)} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
