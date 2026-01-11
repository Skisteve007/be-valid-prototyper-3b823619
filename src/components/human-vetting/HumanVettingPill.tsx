import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, Sparkles, Eye } from 'lucide-react';

interface HumanVettingPillProps {
  isActive: boolean;
  daysRemaining?: number;
  score?: number;
}

const HumanVettingPill: React.FC<HumanVettingPillProps> = ({
  isActive,
  daysRemaining,
  score,
}) => {
  const navigate = useNavigate();
  const hasActiveVetting = isActive && daysRemaining && daysRemaining > 0;

  return (
    <button
      onClick={() => navigate('/human-vetting')}
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-full
        border transition-all duration-300 touch-manipulation
        ${hasActiveVetting 
          ? 'bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-violet-500/20 border-violet-500/60 shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:shadow-[0_0_35px_rgba(139,92,246,0.7)]' 
          : 'bg-card/50 border-violet-500/40 hover:border-violet-500/60 shadow-sm hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]'
        }
      `}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Animated glow effect when vetting is active */}
      {hasActiveVetting && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 animate-pulse" />
          <div className="absolute -inset-1 rounded-full bg-violet-500/10 blur-md animate-pulse" style={{ animationDuration: '2s' }} />
        </>
      )}

      {/* Icon */}
      <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${
        hasActiveVetting 
          ? 'bg-violet-500/30 border border-violet-400/50' 
          : 'bg-violet-500/10 border border-violet-500/30'
      }`}>
        <Eye className={`w-4 h-4 ${hasActiveVetting ? 'text-violet-400' : 'text-violet-400'}`} />
        {hasActiveVetting && (
          <Activity className="absolute -top-1 -right-1 w-3 h-3 text-cyan-400 animate-pulse" />
        )}
      </div>

      {/* Label */}
      <div className="relative flex flex-col items-start">
        <span className={`font-bold text-sm tracking-wide ${hasActiveVetting ? 'text-violet-400' : 'text-violet-400'}`}>
          Human Vetting™
        </span>
        <span className={`text-[10px] ${hasActiveVetting ? 'text-violet-300/80' : 'text-muted-foreground'}`}>
          {hasActiveVetting 
            ? `${daysRemaining}d remaining`
            : 'Start evaluation'
          }
        </span>
      </div>

      {/* Score badge if active */}
      {hasActiveVetting && score !== undefined && (
        <div className="relative flex items-center justify-center min-w-[28px] h-5 px-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold">
          {score}
        </div>
      )}

      {/* Sparkle indicator for available feature */}
      {!hasActiveVetting && (
        <Sparkles className="w-4 h-4 text-violet-400/60" />
      )}
    </button>
  );
};

export default HumanVettingPill;
