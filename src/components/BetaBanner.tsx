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
    <div className="relative overflow-hidden rounded-xl border-2 border-green-400/60 backdrop-blur-sm animate-[glowPulse_2s_ease-in-out_infinite]"
      style={{
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(250, 204, 21, 0.2) 50%, rgba(34, 197, 94, 0.25) 100%)',
      }}
    >
      <style>{`
        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 15px rgba(34, 197, 94, 0.4), 0 0 30px rgba(250, 204, 21, 0.2);
          }
          50% {
            box-shadow: 0 0 25px rgba(34, 197, 94, 0.6), 0 0 50px rgba(250, 204, 21, 0.4);
          }
        }
        @keyframes rocketBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
      
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors z-10"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4 text-white/60 hover:text-white" />
      </button>

      <div className={`${variant === 'compact' ? 'p-3' : 'p-4 md:p-5'}`}>
        <div className="flex flex-col items-center text-center gap-2">
          {/* Main headline */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Rocket 
              className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" 
              style={{ animation: 'rocketBounce 1s ease-in-out infinite' }}
            />
            <span className="text-lg md:text-xl font-black text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(90deg, #22c55e, #facc15, #22c55e)',
              }}
            >
              FREE BETA: No payment required for first {BETA_CONFIG.maxBetaMembers} users!
            </span>
          </div>
          
          {/* Countdown */}
          <p className="text-sm md:text-base font-bold text-white">
            Ends in <span className="text-yellow-400 tabular-nums">{countdownText}</span> • <span className="text-green-400 text-lg">$0.00 signup!</span>
          </p>

          {/* Post-beta pricing info */}
          <p className="text-xs text-white/50">
            After beta: {BETA_CONFIG.regularPrice} | <span className="line-through">{BETA_CONFIG.standardPrice}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BetaBanner;
