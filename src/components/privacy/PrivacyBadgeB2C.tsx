// ============================================
// VALID™ PRIVACY BADGE - FAN FACING (B2C)
// Used in: App, Marketing, Social Sharing
// ============================================

import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { privacyService, GlobalStats } from '@/services/privacyService';

interface PrivacyBadgeB2CProps {
  variant?: 'compact' | 'full' | 'shareable';
  signalColor?: 'cyan' | 'emerald' | 'purple' | 'orange';
}

const PrivacyBadgeB2C: React.FC<PrivacyBadgeB2CProps> = ({ 
  variant = 'compact',
  signalColor = 'cyan'
}) => {
  const [stats, setStats] = useState<GlobalStats | null>(null);

  useEffect(() => {
    privacyService.getGlobalStats().then(setStats);
  }, []);

  const colorMap = {
    cyan: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      glow: 'shadow-[0_0_30px_rgba(0,255,255,0.25)]',
      fill: '#00FFFF'
    },
    emerald: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_30px_rgba(0,255,136,0.25)]',
      fill: '#00FF88'
    },
    purple: {
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.25)]',
      fill: '#A855F7'
    },
    orange: {
      text: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      glow: 'shadow-[0_0_30px_rgba(251,146,60,0.25)]',
      fill: '#FB923C'
    }
  };

  const colors = colorMap[signalColor];

  // ============================================
  // COMPACT VARIANT - For App Headers/Footers
  // ============================================
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 ${colors.bg} rounded-full border ${colors.border}`}>
        <Shield className={`w-4 h-4 ${colors.text}`} />
        <span className={`text-xs font-semibold tracking-wider text-foreground`}>
          VALID™ Protected
        </span>
      </div>
    );
  }

  // ============================================
  // FULL VARIANT - For Profile/Dashboard
  // ============================================
  if (variant === 'full') {
    return (
      <div className={`bg-gradient-to-br from-background to-card rounded-2xl border ${colors.border} p-5 max-w-[340px]`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
            <Shield className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div>
            <h3 className="text-foreground text-base font-semibold m-0">
              We Check. We Don't Collect.
            </h3>
            <p className="text-muted-foreground text-xs mt-1">
              Your privacy is protected
            </p>
          </div>
        </div>

        {/* Privacy Promise */}
        <div className={`${colors.bg} rounded-xl p-4 mb-4`}>
          <p className="text-muted-foreground text-sm leading-relaxed m-0">
            VALID™ checks IDs to keep your family safe,{' '}
            <strong className={colors.text}>without ever saving your data</strong>. 
            No tracking. No profiles. Just a safer crowd.
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="flex justify-between text-center">
            <div>
              <div className={`${colors.text} text-xl font-bold`}>
                {privacyService.formatNumber(stats.totalFansProtected)}
              </div>
              <div className="text-muted-foreground text-[10px] uppercase tracking-wide">
                Fans Protected
              </div>
            </div>
            <div>
              <div className={`${colors.text} text-xl font-bold`}>
                {stats.dataRetentionTimeMs}ms
              </div>
              <div className="text-muted-foreground text-[10px] uppercase tracking-wide">
                Data Retention
              </div>
            </div>
            <div>
              <div className={`${colors.text} text-xl font-bold`}>
                {stats.totalThreatsBlocked}
              </div>
              <div className="text-muted-foreground text-[10px] uppercase tracking-wide">
                Threats Blocked
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================
  // SHAREABLE VARIANT - For Social Media/Stories
  // ============================================
  if (variant === 'shareable') {
    return (
      <div 
        className={`w-[350px] h-[200px] bg-gradient-to-br from-[#050505] to-[#0a0a0a] rounded-2xl border-2 ${colors.border} ${colors.glow} p-6 flex flex-col justify-between relative overflow-hidden`}
      >
        {/* Glow Effect */}
        <div 
          className={`absolute -top-1/2 -right-1/2 w-[200px] h-[200px] ${colors.bg} rounded-full blur-3xl opacity-30`}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className={`${colors.text} text-xs tracking-[3px] mb-2`}>
            VALID™ VERIFIED
          </div>
          <h2 
            className="text-foreground text-[22px] font-bold m-0"
            style={{ 
              fontFamily: "'Orbitron', sans-serif",
              textShadow: `0 0 20px ${colors.fill}`
            }}
          >
            Protected. Not Profiled.
          </h2>
        </div>

        {/* Footer Stats */}
        <div className="flex justify-between relative z-10">
          <div>
            <div className="text-foreground text-lg font-bold">
              {stats ? privacyService.formatNumber(stats.totalFansProtected) : '500K+'}
            </div>
            <div className="text-muted-foreground text-[10px] uppercase">Fans Trust Us</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-[10px]">ZERO DATA STORED</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#00FF00]" />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PrivacyBadgeB2C;
