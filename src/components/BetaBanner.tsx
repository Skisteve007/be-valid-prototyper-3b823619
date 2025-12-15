import { useState, useEffect } from 'react';
import { X, Rocket } from 'lucide-react';
import { BETA_CONFIG, getBetaTimeRemaining, isBetaPeriodActive } from '@/config/betaConfig';

interface BetaBannerProps {
  variant?: 'full' | 'compact';
}

export const BetaBanner = ({ variant = 'full' }: BetaBannerProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(getBetaTimeRemaining());

  useEffect(() => {
    // Check localStorage for dismissal
    const dismissed = localStorage.getItem('betaBannerDismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    // Update countdown every second
    const interval = setInterval(() => {
      setTimeRemaining(getBetaTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('betaBannerDismissed', 'true');
  };

  if (isDismissed || !isBetaPeriodActive()) {
    if (timeRemaining.expired && !isDismissed) {
      return (
        <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 backdrop-blur-sm">
          <p className="text-center text-amber-400 font-semibold">
            Beta period has ended. Standard pricing now applies.
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/50 bg-gradient-to-r from-cyan-500/20 via-purple-500/10 to-cyan-500/20 backdrop-blur-sm animate-[glowPulse_3s_ease-in-out_infinite]">
      <style>{`
        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 15px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.05);
          }
          50% {
            box-shadow: 0 0 25px rgba(0, 240, 255, 0.5), inset 0 0 30px rgba(0, 240, 255, 0.1);
          }
        }
        @keyframes rocketPulse {
          0%, 100% { transform: translateY(0) rotate(-15deg); }
          50% { transform: translateY(-3px) rotate(-15deg); }
        }
      `}</style>
      
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors z-10"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4 text-white/60 hover:text-white" />
      </button>

      <div className={`${variant === 'compact' ? 'p-3' : 'p-4 md:p-6'}`}>
        <div className="flex flex-col items-center text-center gap-3">
          {/* Main content */}
          <div className="flex items-center gap-2">
            <Rocket 
              className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" 
              style={{ animation: 'rocketPulse 1.5s ease-in-out infinite' }}
            />
            <span className="text-lg md:text-xl font-bold text-white">
              🚀 BETA ACCESS — FREE FOR 30 DAYS
            </span>
          </div>
          
          <p className="text-sm md:text-base text-cyan-300/90">
            Be one of the first {BETA_CONFIG.maxBetaMembers} members. Full access. Zero cost.
          </p>

          {/* Countdown timer */}
          <div className="flex gap-2 md:gap-4 mt-2">
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                {String(timeRemaining.days).padStart(2, '0')}
              </span>
              <span className="text-xs text-cyan-400/80 uppercase tracking-wider">Days</span>
            </div>
            <span className="text-2xl md:text-3xl font-bold text-cyan-400/60">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                {String(timeRemaining.hours).padStart(2, '0')}
              </span>
              <span className="text-xs text-cyan-400/80 uppercase tracking-wider">Hours</span>
            </div>
            <span className="text-2xl md:text-3xl font-bold text-cyan-400/60">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                {String(timeRemaining.minutes).padStart(2, '0')}
              </span>
              <span className="text-xs text-cyan-400/80 uppercase tracking-wider">Min</span>
            </div>
            <span className="text-2xl md:text-3xl font-bold text-cyan-400/60">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                {String(timeRemaining.seconds).padStart(2, '0')}
              </span>
              <span className="text-xs text-cyan-400/80 uppercase tracking-wider">Sec</span>
            </div>
          </div>

          {/* Post-beta pricing */}
          <p className="text-xs text-white/50 mt-1">
            After beta: {BETA_CONFIG.regularPrice} | Standard: {BETA_CONFIG.standardPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BetaBanner;
