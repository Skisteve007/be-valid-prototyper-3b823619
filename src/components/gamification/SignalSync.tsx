import { useState, useEffect, useCallback } from 'react';
import { Zap, Flame, Sparkles } from 'lucide-react';

type SignalType = 'social' | 'pulse' | 'thrill' | 'afterdark' | null;

interface SignalSyncProps {
  userSignal: SignalType;
  scannedSignal: SignalType;
  isVisible: boolean;
  onComplete: () => void;
}

type MatchType = 'vibe' | 'chaos' | 'open';

const getMatchType = (userSignal: SignalType, scannedSignal: SignalType): MatchType => {
  // Normalize signals
  const normalizeSignal = (s: SignalType): string => {
    if (s === 'social' || s === 'pulse') return 'chill';
    if (s === 'thrill') return 'thrill';
    if (s === 'afterdark') return 'open';
    return 'open';
  };

  const user = normalizeSignal(userSignal);
  const scanned = normalizeSignal(scannedSignal);

  // Both same = vibe match
  if (user === scanned) return 'vibe';
  
  // Opposites (chill vs thrill) = chaos match
  if ((user === 'chill' && scanned === 'thrill') || (user === 'thrill' && scanned === 'chill')) {
    return 'chaos';
  }

  // One is open = open vibes
  return 'open';
};

const matchConfigs = {
  vibe: {
    title: 'VIBE MATCH',
    emoji: '🔥',
    icon: Flame,
    gradient: 'from-emerald-500 via-cyan-500 to-emerald-500',
    particleColor: '#22c55e',
    duration: 3000,
    vibrationPattern: [100, 50, 100]
  },
  chaos: {
    title: 'CHAOS MATCH',
    emoji: '⚡',
    icon: Zap,
    gradient: 'from-orange-500 via-purple-500 to-orange-500',
    particleColor: '#f97316',
    duration: 3000,
    vibrationPattern: [50, 30, 50, 30, 100]
  },
  open: {
    title: 'OPEN VIBES',
    emoji: '✨',
    icon: Sparkles,
    gradient: 'from-purple-500 via-pink-500 to-purple-500',
    particleColor: '#a855f7',
    duration: 2000,
    vibrationPattern: [100]
  }
};

export const SignalSync = ({ userSignal, scannedSignal, isVisible, onComplete }: SignalSyncProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  
  const matchType = getMatchType(userSignal, scannedSignal);
  const config = matchConfigs[matchType];
  const Icon = config.icon;

  // Generate particles
  useEffect(() => {
    if (isVisible) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5
      }));
      setParticles(newParticles);

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(config.vibrationPattern);
      }

      // Auto-close
      const timer = setTimeout(() => {
        onComplete();
      }, config.duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, config.duration, config.vibrationPattern, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[10000] overflow-hidden">
      <style>{`
        @keyframes flashIn {
          0% { opacity: 0; transform: scale(1.5); }
          20% { opacity: 1; transform: scale(1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes textPop {
          0% { opacity: 0; transform: scale(0.5) translateY(20px); }
          50% { transform: scale(1.1) translateY(-5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes particleExplode {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes splitScreen {
          0% { clip-path: inset(0 50% 0 0); }
          50% { clip-path: inset(0 0 0 0); }
        }
        @keyframes electricPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.5); }
        }
      `}</style>

      {/* Background flash */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} animate-[flashIn_0.5s_ease-out]`}
        style={{ animation: matchType === 'chaos' ? 'flashIn 0.5s ease-out, electricPulse 0.2s ease-in-out infinite' : 'flashIn 0.5s ease-out' }}
      />

      {/* Chaos split effect */}
      {matchType === 'chaos' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-transparent" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
          <div className="absolute inset-0 bg-gradient-to-l from-purple-500 to-transparent" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }} />
        </>
      )}

      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-4 h-4 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            backgroundColor: config.particleColor,
            '--tx': `${(particle.x - 50) * 5}vw`,
            '--ty': `${(particle.y - 50) * 5}vh`,
            animation: `particleExplode 1s ease-out forwards`,
            animationDelay: `${particle.delay}s`,
            boxShadow: `0 0 20px ${config.particleColor}`
          } as React.CSSProperties}
        />
      ))}

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Icon */}
        <div 
          className="mb-4 animate-[pulse_0.5s_ease-in-out_infinite]"
          style={{ animation: 'textPop 0.6s ease-out' }}
        >
          <Icon className="w-24 h-24 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]" />
        </div>

        {/* Title */}
        <h1 
          className="text-5xl md:text-7xl font-black text-white text-center drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          style={{ 
            fontFamily: 'Orbitron, sans-serif',
            animation: 'textPop 0.6s ease-out 0.2s both'
          }}
        >
          {config.title} {config.emoji}
        </h1>

        {/* Subtitle based on match */}
        <p 
          className="mt-4 text-xl text-white/80"
          style={{ animation: 'textPop 0.6s ease-out 0.4s both' }}
        >
          {matchType === 'vibe' && 'Same wavelength detected!'}
          {matchType === 'chaos' && 'Opposites attract!'}
          {matchType === 'open' && 'Ready for anything!'}
        </p>
      </div>

      {/* Tap to continue hint */}
      <button 
        onClick={onComplete}
        className="absolute bottom-10 left-0 right-0 text-center text-white/60 text-sm animate-pulse"
      >
        Tap to continue
      </button>
    </div>
  );
};

// Hook for easy integration
export const useSignalSync = () => {
  const [syncState, setSyncState] = useState<{
    isVisible: boolean;
    userSignal: SignalType;
    scannedSignal: SignalType;
  }>({
    isVisible: false,
    userSignal: null,
    scannedSignal: null
  });

  const triggerSync = useCallback((userSignal: SignalType, scannedSignal: SignalType) => {
    setSyncState({
      isVisible: true,
      userSignal,
      scannedSignal
    });
  }, []);

  const closeSync = useCallback(() => {
    setSyncState(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    ...syncState,
    triggerSync,
    closeSync
  };
};

export default SignalSync;
