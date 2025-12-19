import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';

interface SynthButtonProps {
  variant?: 'fab' | 'pill' | 'menu-item' | 'header' | 'hidden-trigger';
}

const SynthButton: React.FC<SynthButtonProps> = ({ variant = 'fab' }) => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useIsAdmin();
  const [pulseCount, setPulseCount] = useState(0);

  const handleSynthClick = () => {
    navigate('/synth');
  };

  // Hidden trigger - requires 3 rapid taps to activate (for non-admins to discover)
  const handleHiddenTrigger = () => {
    setPulseCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        navigate('/synth');
        return 0;
      }
      // Reset after 1.5 seconds of no taps
      setTimeout(() => setPulseCount(0), 1500);
      return newCount;
    });
  };

  // HIDDEN TRIGGER VARIANT - Mysterious glowing element anyone can see
  if (variant === 'hidden-trigger') {
    return (
      <button
        onClick={handleHiddenTrigger}
        className="group relative p-2 rounded-full transition-all duration-500 hover:scale-110"
        style={{ 
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-label="Discover"
      >
        {/* Mysterious pulsing glow */}
        <div 
          className="absolute inset-0 rounded-full opacity-60 blur-sm animate-pulse"
          style={{
            background: `radial-gradient(circle, rgba(168, 85, 247, ${0.2 + pulseCount * 0.15}) 0%, transparent 70%)`,
          }}
        />
        <Sparkles 
          className="w-4 h-4 transition-all duration-300 group-hover:text-purple-400"
          style={{
            color: pulseCount > 0 ? '#a855f7' : 'rgba(168, 85, 247, 0.5)',
            filter: pulseCount > 0 ? 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.6))' : 'none',
          }}
        />
        {/* Hint dots showing progress */}
        {pulseCount > 0 && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="w-1 h-1 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: i < pulseCount ? '#a855f7' : 'rgba(168, 85, 247, 0.3)',
                  boxShadow: i < pulseCount ? '0 0 4px #a855f7' : 'none',
                }}
              />
            ))}
          </div>
        )}
      </button>
    );
  }

  // FAB VARIANT - Admin only floating button
  if (variant === 'fab') {
    // Only show FAB to admins
    if (loading || !isAdmin) return null;
    
    return (
      <button
        onClick={handleSynthClick}
        className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-40 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform touch-manipulation"
        style={{ 
          WebkitTapHighlightColor: 'transparent',
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.4), 0 4px 20px rgba(0,0,0,0.3)',
        }}
        aria-label="Open Synth"
      >
        <Brain className="w-7 h-7 text-white" />
        <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-30" />
      </button>
    );
  }

  // PILL VARIANT - Admin only dashboard pill
  if (variant === 'pill') {
    if (loading || !isAdmin) return null;
    
    return (
      <button
        onClick={handleSynthClick}
        className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-4 flex items-center justify-between hover:from-purple-500/30 hover:to-pink-500/30 active:from-purple-500/40 active:to-pink-500/40 transition touch-manipulation"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="text-foreground font-semibold text-base">Synth</div>
            <div className="text-purple-300/70 text-xs">Idea Branch • AI Lab</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400 text-xs font-medium bg-purple-500/20 px-2 py-1 rounded-full">
            ADMIN
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-purple-400">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </div>
      </button>
    );
  }

  // MENU-ITEM VARIANT - Admin only mobile menu
  if (variant === 'menu-item') {
    if (loading || !isAdmin) return null;
    
    return (
      <button
        onClick={handleSynthClick}
        className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:from-purple-500/20 hover:to-pink-500/20 transition touch-manipulation"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-left">
          <span className="text-foreground font-medium">Synth</span>
          <span className="text-purple-300/60 text-xs block">Idea Branch</span>
        </div>
        <span className="text-purple-400 text-xs font-medium">ADMIN</span>
      </button>
    );
  }

  // HEADER VARIANT - Admin only compact header button
  if (variant === 'header') {
    if (loading || !isAdmin) return null;
    
    return (
      <button
        onClick={handleSynthClick}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition touch-manipulation"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <Brain className="w-4 h-4 text-purple-400" />
        <span className="text-purple-300 text-sm font-medium hidden sm:inline">Synth</span>
      </button>
    );
  }

  return null;
};

export default SynthButton;
