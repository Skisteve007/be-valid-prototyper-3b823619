import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollText, Scale } from 'lucide-react';

const GovernanceStandardPill: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/governance-constitution')}
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-full
        border transition-all duration-300 touch-manipulation
        bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 
        border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.5)] 
        hover:shadow-[0_0_35px_rgba(245,158,11,0.7)]
      `}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Animated glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 animate-pulse" />
      <div className="absolute -inset-1 rounded-full bg-amber-500/10 blur-md animate-pulse" style={{ animationDuration: '2s' }} />

      {/* Icon */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/30 border border-amber-400/50">
        <ScrollText className="w-4 h-4 text-amber-400" />
        <Scale className="absolute -top-1 -right-1 w-3 h-3 text-orange-400 animate-pulse" />
      </div>

      {/* Label */}
      <div className="relative flex flex-col items-start">
        <span className="font-bold text-sm tracking-wide text-amber-400">
          Grillo AI Governance Standard
        </span>
        <span className="text-[10px] text-amber-300/80">
          The Constitution
        </span>
      </div>
    </button>
  );
};

export default GovernanceStandardPill;
