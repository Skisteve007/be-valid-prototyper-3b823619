import { Shield, Lock, Eye, Zap, Clock } from 'lucide-react';
import { usePrivacyStats } from '@/hooks/usePrivacyStats';

interface PrivacyShieldProps {
  variant?: 'compact' | 'full';
  showStats?: boolean;
}

const PrivacyShield = ({ variant = 'compact', showStats = true }: PrivacyShieldProps) => {
  const { stats, isLoading } = usePrivacyStats();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
        <Shield className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-semibold text-emerald-400 tracking-wide">
          ZERO DATA STORED
        </span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/50 to-background p-6">
      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-500/20">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Privacy Defense™</h3>
            <p className="text-xs text-muted-foreground">Zero-Knowledge Architecture</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-muted-foreground">End-to-End Encrypted</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-muted-foreground">No PII Stored</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-muted-foreground">Instant Purge</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-muted-foreground">0ms Retention</span>
          </div>
        </div>

        {showStats && !isLoading && (
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-400">
                {formatNumber(stats.total_fans_protected)}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Fans Protected
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-cyan-400">
                {stats.total_venues_verified}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Venues Verified
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-400">
                {formatNumber(stats.total_threats_blocked)}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Threats Blocked
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyShield;
