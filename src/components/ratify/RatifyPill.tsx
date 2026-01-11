import React from 'react';
import { Scale, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { RatifyCorrection } from '@/hooks/useRatify';

interface RatifyPillProps {
  pendingCount: number;
  hasCorrections: boolean;
  onClick: () => void;
  latestCorrection?: RatifyCorrection | null;
}

const RatifyPill: React.FC<RatifyPillProps> = ({
  pendingCount,
  hasCorrections,
  onClick,
  latestCorrection,
}) => {
  const isGlowing = pendingCount > 0;

  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-full
        border transition-all duration-300 touch-manipulation
        ${isGlowing 
          ? 'bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)]' 
          : 'bg-card/50 border-border/50 hover:border-border shadow-sm hover:shadow-md'
        }
      `}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Animated glow effect when corrections are pending */}
      {isGlowing && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 animate-pulse" />
          <div className="absolute -inset-1 rounded-full bg-emerald-500/10 blur-md animate-pulse" style={{ animationDuration: '2s' }} />
        </>
      )}

      {/* Icon */}
      <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${
        isGlowing 
          ? 'bg-emerald-500/30 border border-emerald-400/50' 
          : 'bg-muted/50 border border-border/50'
      }`}>
        <Scale className={`w-4 h-4 ${isGlowing ? 'text-emerald-400' : 'text-muted-foreground'}`} />
        {isGlowing && (
          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-400 animate-pulse" />
        )}
      </div>

      {/* Label */}
      <div className="relative flex flex-col items-start">
        <span className={`font-bold text-sm tracking-wide ${isGlowing ? 'text-emerald-400' : 'text-foreground'}`}>
          Ratify™
        </span>
        <span className={`text-[10px] ${isGlowing ? 'text-emerald-300/80' : 'text-muted-foreground'}`}>
          {pendingCount > 0 
            ? `${pendingCount} fix${pendingCount > 1 ? 'es' : ''} ready`
            : hasCorrections 
              ? 'All verified'
              : 'No issues'
          }
        </span>
      </div>

      {/* Badge count */}
      {pendingCount > 0 && (
        <div className="relative flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-emerald-500 text-black text-xs font-bold animate-bounce" style={{ animationDuration: '2s' }}>
          {pendingCount}
        </div>
      )}

      {/* Status indicator dot */}
      {hasCorrections && pendingCount === 0 && (
        <CheckCircle className="w-4 h-4 text-emerald-400" />
      )}
    </button>
  );
};

export default RatifyPill;
