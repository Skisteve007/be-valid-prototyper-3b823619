// FORCED BETA MODE - Do not change until Jan 16, 2025
import { useState, useEffect } from 'react';
import { X, Rocket } from 'lucide-react';
import { BETA_CONFIG, getBetaTimeRemaining } from '@/config/betaConfig';

interface BetaBannerProps {
  variant?: 'full' | 'compact';
}

export const BetaBanner = ({ variant = 'full' }: BetaBannerProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(getBetaTimeRemaining());

  useEffect(() => {
    const dismissed = localStorage.getItem('betaBannerDismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    const interval = setInterval(() => {
      setTimeRemaining(getBetaTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('betaBannerDismissed', 'true');
  };

  // DISABLED: Beta ended message - DO NOT SHOW until Jan 16, 2025
  // if (!isBeta && timeRemaining.expired) { ... }

  if (isDismissed) {
    return null;
  }

  const countdownText = `${timeRemaining.days}d ${timeRemaining.hours}h ${timeRemaining.minutes}m ${timeRemaining.seconds}s`;

  // FORCE: Always show FREE BETA celebration banner
  return (
    <div className="relative overflow-hidden rounded-lg md:rounded-xl border border-green-400/60 md:border-2 backdrop-blur-sm animate-[glowPulse_2s_ease-in-out_infinite]"
      style={{
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(250, 204, 21, 0.2) 50%, rgba(34, 197, 94, 0.25) 100%)',
      }}
    >
      <style>{`
        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.3), 0 0 20px rgba(250, 204, 21, 0.15);
          }
          50% {
            box-shadow: 0 0 15px rgba(34, 197, 94, 0.5), 0 0 35px rgba(250, 204, 21, 0.3);
          }
        }
        @keyframes rocketBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
      
      <button
        onClick={handleDismiss}
        className="absolute top-1 right-1 md:top-2 md:right-2 p-0.5 md:p-1 rounded-full hover:bg-white/10 transition-colors z-10"
        aria-label="Dismiss banner"
      >
        <X className="w-3 h-3 md:w-4 md:h-4 text-white/60 hover:text-white" />
      </button>

      <div className={`${variant === 'compact' ? 'px-2 py-1.5 md:px-3 md:py-2' : 'px-2 py-1.5 md:px-4 md:py-3'}`}>
        <div className="flex flex-wrap items-center justify-center gap-x-1.5 md:gap-x-3 gap-y-0.5 md:gap-y-1">
          {/* Rocket + Main headline */}
          <div className="flex items-center gap-1 md:gap-1.5">
            <Rocket 
              className="w-3 h-3 md:w-5 md:h-5 text-yellow-400 shrink-0" 
              style={{ animation: 'rocketBounce 1s ease-in-out infinite' }}
            />
            <span className="text-[10px] md:text-base font-black text-transparent bg-clip-text whitespace-nowrap"
              style={{
                backgroundImage: 'linear-gradient(90deg, #22c55e, #facc15, #22c55e)',
              }}
            >
              FREE BETA: First {BETA_CONFIG.maxBetaMembers} free!
            </span>
          </div>
          
          {/* Countdown + Price inline */}
          <span className="text-[9px] md:text-sm font-bold text-white whitespace-nowrap">
            <span className="text-yellow-400 tabular-nums">{countdownText}</span>
            <span className="mx-1 md:mx-1.5 text-white/40">•</span>
            <span className="text-green-400 font-bold">$0</span>
          </span>

          {/* Post-beta pricing - hidden on mobile */}
          <span className="hidden md:inline text-[10px] md:text-xs text-white/50 whitespace-nowrap">
            After: {BETA_CONFIG.regularPrice} | <span className="line-through">{BETA_CONFIG.standardPrice}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default BetaBanner;
