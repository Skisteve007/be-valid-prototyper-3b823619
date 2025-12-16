import { Shield, CheckCircle } from 'lucide-react';

interface PrivacyBadgeProps {
  type?: 'gdpr' | 'ccpa' | 'soc2' | 'hipaa' | 'general';
  size?: 'sm' | 'md' | 'lg';
}

const badgeConfig = {
  gdpr: { label: 'GDPR', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  ccpa: { label: 'CCPA', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  soc2: { label: 'SOC 2', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  hipaa: { label: 'HIPAA', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  general: { label: 'VERIFIED', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
};

const sizeConfig = {
  sm: { container: 'px-2 py-1 gap-1', icon: 'w-3 h-3', text: 'text-[10px]' },
  md: { container: 'px-3 py-1.5 gap-1.5', icon: 'w-4 h-4', text: 'text-xs' },
  lg: { container: 'px-4 py-2 gap-2', icon: 'w-5 h-5', text: 'text-sm' },
};

const PrivacyBadge = ({ type = 'general', size = 'md' }: PrivacyBadgeProps) => {
  const badge = badgeConfig[type];
  const sizes = sizeConfig[size];

  return (
    <div
      className={`inline-flex items-center rounded-full border ${badge.bg} ${badge.border} ${sizes.container}`}
    >
      <CheckCircle className={`${sizes.icon} ${badge.color}`} />
      <span className={`font-bold ${badge.color} ${sizes.text} tracking-wide`}>
        {badge.label}
      </span>
    </div>
  );
};

export default PrivacyBadge;
