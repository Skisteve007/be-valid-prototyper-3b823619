import { Sparkles } from 'lucide-react';

interface BetaMemberBadgeProps {
  className?: string;
}

export const BetaMemberBadge = ({ className = '' }: BetaMemberBadgeProps) => {
  return (
    <span 
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold tracking-wider uppercase rounded-full border border-emerald-400/60 bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] ${className}`}
    >
      <Sparkles className="w-3 h-3" />
      Beta Member
    </span>
  );
};

export default BetaMemberBadge;
