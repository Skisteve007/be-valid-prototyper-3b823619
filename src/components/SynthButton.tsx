import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';

interface SynthButtonProps {
  variant?: 'fab' | 'pill' | 'menu-item' | 'header';
}

const SynthButton: React.FC<SynthButtonProps> = ({ variant = 'fab' }) => {
  const navigate = useNavigate();

  const handleSynthClick = () => {
    navigate('/synth');
  };

  // FAB VARIANT - Floating Action Button
  if (variant === 'fab') {
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
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-30" />
      </button>
    );
  }

  // PILL VARIANT - Dashboard pill button
  if (variant === 'pill') {
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
            NEW
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-purple-400">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </div>
      </button>
    );
  }

  // MENU-ITEM VARIANT - For mobile menu
  if (variant === 'menu-item') {
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
        <span className="text-purple-400 text-xs font-medium">NEW</span>
      </button>
    );
  }

  // HEADER VARIANT - Compact header button
  if (variant === 'header') {
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
