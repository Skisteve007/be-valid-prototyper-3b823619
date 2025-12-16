import React from 'react';
import { Shield, CheckCircle, Lock, AlertCircle } from 'lucide-react';

interface ComplianceBadgesProps {
  variant?: 'inline' | 'banner' | 'footer' | 'hero';
}

const ComplianceBadges: React.FC<ComplianceBadgesProps> = ({
  variant = 'inline',
}) => {
  const badges = [
    {
      id: 'soc2',
      name: 'SOC 2',
      fullName: 'SOC 2 Type II',
      description: 'Certified for security, availability, and confidentiality controls',
      Icon: Shield,
      colorClass: 'text-cyan-400',
      bgClass: 'bg-cyan-500/20',
      borderClass: 'border-cyan-500/30',
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      fullName: 'GDPR Compliant',
      description: 'Full compliance with EU General Data Protection Regulation',
      Icon: CheckCircle,
      colorClass: 'text-green-400',
      bgClass: 'bg-green-500/20',
      borderClass: 'border-green-500/30',
    },
    {
      id: 'ccpa',
      name: 'CCPA',
      fullName: 'CCPA Compliant',
      description: 'California Consumer Privacy Act compliant',
      Icon: AlertCircle,
      colorClass: 'text-yellow-400',
      bgClass: 'bg-yellow-500/20',
      borderClass: 'border-yellow-500/30',
    },
    {
      id: 'encrypted',
      name: '256-BIT',
      fullName: 'AES-256 Encryption',
      description: 'Bank-level encryption for all data in transit and at rest',
      Icon: Lock,
      colorClass: 'text-purple-400',
      bgClass: 'bg-purple-500/20',
      borderClass: 'border-purple-500/30',
    },
  ];

  // INLINE VARIANT - Simple row of badges
  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {badges.slice(0, 3).map((badge) => (
          <div
            key={badge.id}
            className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-full text-xs sm:text-sm"
          >
            <badge.Icon className={`w-4 h-4 ${badge.colorClass}`} />
            <span className="text-muted-foreground font-medium">{badge.name}</span>
          </div>
        ))}
      </div>
    );
  }

  // BANNER VARIANT - Full width trust banner
  if (variant === 'banner') {
    return (
      <div className="w-full bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-purple-500/10 border-y border-border py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Enterprise-Grade Security</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-2"
                  title={badge.fullName}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${badge.bgClass}`}>
                    <badge.Icon className={`w-3.5 h-3.5 ${badge.colorClass}`} />
                  </div>
                  <span className="text-foreground/80 text-sm font-medium">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // HERO VARIANT - Prominent hero section badge
  if (variant === 'hero') {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 mb-4">
        <div 
          className="bg-card/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6"
          style={{ boxShadow: '0 0 40px rgba(0, 255, 255, 0.1)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-semibold tracking-wide uppercase">
              Enterprise Security & Compliance
            </span>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-border transition"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${badge.bgClass}`}>
                  <badge.Icon className={`w-6 h-6 ${badge.colorClass}`} />
                </div>
                <span className="text-foreground font-semibold text-sm">{badge.name}</span>
                <span className="text-muted-foreground text-xs text-center mt-1">
                  {badge.id === 'soc2' && 'Type II Certified'}
                  {badge.id === 'gdpr' && 'EU Compliant'}
                  {badge.id === 'ccpa' && 'CA Compliant'}
                  {badge.id === 'encrypted' && 'Bank-Level'}
                </span>
              </div>
            ))}
          </div>

          {/* Trust Statement */}
          <p className="text-muted-foreground text-sm text-center mt-4 leading-relaxed">
            VALID™ meets the highest standards for data security and privacy.{' '}
            <span className="text-cyan-400">We check. We don't collect.</span>
          </p>
        </div>
      </div>
    );
  }

  // FOOTER VARIANT - Compact footer section
  if (variant === 'footer') {
    return (
      <div className="border-t border-border pt-8 pb-4">
        <div className="flex flex-col items-center gap-4">
          {/* Title */}
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5" />
            <span>Security & Compliance</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${badge.bgClass} border ${badge.borderClass}`}>
                  <badge.Icon className={`w-5 h-5 ${badge.colorClass}`} />
                </div>
                <span className="text-muted-foreground text-xs font-medium">{badge.name}</span>
              </div>
            ))}
          </div>

          {/* Statement */}
          <p className="text-muted-foreground/60 text-xs text-center max-w-md">
            Enterprise-grade security with zero data retention. Your privacy is protected by design.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default ComplianceBadges;
