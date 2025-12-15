import { useState, useEffect } from 'react';
import { Target, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SignalType = 'social' | 'thrill' | 'afterdark';

interface BountyMissionProps {
  onBountyComplete?: () => void;
}

const SIGNAL_LABELS: Record<SignalType, string> = {
  social: 'Chills',
  thrill: 'Thrills',
  afterdark: 'Opens'
};

const SIGNAL_COLORS: Record<SignalType, string> = {
  social: 'from-cyan-500 to-cyan-600',
  thrill: 'from-orange-500 to-orange-600',
  afterdark: 'from-purple-500 to-purple-600'
};

const getDailyBountyTarget = (): SignalType => {
  // Seed based on date at 6PM local
  const now = new Date();
  const hour = now.getHours();
  const dateKey = hour >= 18 
    ? now.toDateString() 
    : new Date(now.getTime() - 86400000).toDateString();
  
  // Simple hash to pick signal
  const hash = dateKey.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const signals: SignalType[] = ['social', 'thrill', 'afterdark'];
  return signals[hash % 3];
};

const getBountyResetTime = (): Date => {
  const now = new Date();
  const reset = new Date(now);
  reset.setHours(18, 0, 0, 0);
  if (now.getHours() >= 18) {
    reset.setDate(reset.getDate() + 1);
  }
  return reset;
};

export const BountyMission = ({ onBountyComplete }: BountyMissionProps) => {
  const [progress, setProgress] = useState(0);
  const [target] = useState<SignalType>(getDailyBountyTarget());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasShimmered, setHasShimmered] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [streak, setStreak] = useState(0);
  
  const targetCount = 3;
  const isComplete = progress >= targetCount;

  useEffect(() => {
    // Load progress from localStorage
    const stored = localStorage.getItem('bountyProgress');
    const storedDate = localStorage.getItem('bountyDate');
    const resetTime = getBountyResetTime();
    const lastResetKey = new Date(resetTime.getTime() - 86400000).toDateString();
    
    if (storedDate === lastResetKey && stored) {
      setProgress(parseInt(stored, 10));
    } else if (storedDate !== lastResetKey) {
      // Reset for new day
      localStorage.setItem('bountyProgress', '0');
      localStorage.setItem('bountyDate', lastResetKey);
    }

    // Load streak
    const storedStreak = localStorage.getItem('bountyStreak');
    if (storedStreak) {
      setStreak(parseInt(storedStreak, 10));
    }

    // Check if already shimmered
    const shimmered = localStorage.getItem('bountyShimmered');
    if (shimmered) {
      setHasShimmered(true);
    }
  }, []);

  const handlePillClick = () => {
    setIsModalOpen(true);
    if (!hasShimmered) {
      setHasShimmered(true);
      localStorage.setItem('bountyShimmered', 'true');
    }
  };

  // Public method to increment progress (call when scanning matching signal)
  const incrementProgress = () => {
    if (progress < targetCount) {
      const newProgress = progress + 1;
      setProgress(newProgress);
      localStorage.setItem('bountyProgress', String(newProgress));
      
      if (newProgress >= targetCount) {
        // Complete!
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('bountyStreak', String(newStreak));
        setShowReward(true);
        onBountyComplete?.();
      }
    }
  };

  // Expose increment method globally for scan integration
  useEffect(() => {
    (window as any).incrementBountyProgress = incrementProgress;
    return () => {
      delete (window as any).incrementBountyProgress;
    };
  }, [progress]);

  const getRewardText = () => {
    if (streak >= 7) return '🏆 7-Day Legend! Permanent Flair Unlocked';
    if (streak >= 3) return '💎 3-Day Streak! Platinum Border (48h)';
    return '✨ Gold Border Unlocked (24h)';
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-30px); }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Mission Pill */}
      <button
        onClick={handlePillClick}
        className={`relative w-full px-4 py-2.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-sm overflow-hidden transition-all hover:border-white/40 ${
          !hasShimmered ? 'animate-shimmer' : ''
        }`}
        style={!hasShimmered ? {
          background: 'linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.4) 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s linear infinite'
        } : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className={`w-4 h-4 ${isComplete ? 'text-yellow-400' : 'text-cyan-400'}`} />
            <span className="text-sm font-medium text-white">
              Find 3 {SIGNAL_LABELS[target]}.
            </span>
          </div>
          <span className="text-xs text-white/60">{progress}/{targetCount}</span>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div 
            className={`h-full bg-gradient-to-r ${SIGNAL_COLORS[target]} transition-all duration-500`}
            style={{ width: `${(progress / targetCount) * 100}%` }}
          />
        </div>
      </button>

      {/* Mission Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-white">Tonight's Mission</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded">
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            <div className={`p-4 rounded-xl bg-gradient-to-r ${SIGNAL_COLORS[target]} bg-opacity-20 border border-white/10 mb-4`}>
              <div className="text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-white" />
                <p className="text-xl font-bold text-white mb-1">
                  Scan 3 "{SIGNAL_LABELS[target]}" Users
                </p>
                <p className="text-sm text-white/70">
                  Find members broadcasting the {SIGNAL_LABELS[target]} signal
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Progress</span>
                <span className="text-white font-bold">{progress} / {targetCount}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${SIGNAL_COLORS[target]} transition-all`}
                  style={{ width: `${(progress / targetCount) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Current Streak</span>
                <span className="text-yellow-400 font-bold">{streak} days 🔥</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3 mb-4">
              <p className="text-xs text-white/60 mb-2">REWARDS</p>
              <div className="space-y-1 text-sm text-white/80">
                <p>✨ Complete: Gold Border (24h)</p>
                <p>💎 3-Day Streak: Platinum Border</p>
                <p>🏆 7-Day Streak: Permanent Flair</p>
              </div>
            </div>

            <p className="text-xs text-white/40 text-center">
              Resets daily at 6:00 PM
            </p>
          </div>
        </div>
      )}

      {/* Reward Celebration Modal */}
      {showReward && (
        <div className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4">
          {/* Confetti */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                backgroundColor: ['#FFD700', '#00F0FF', '#FF6B00', '#A855F7'][i % 4],
                animation: `confetti ${2 + Math.random() * 2}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
          
          <div className="text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-yellow-400 animate-pulse" />
            <h2 className="text-3xl font-black text-white mb-2">MISSION COMPLETE!</h2>
            <p className="text-xl text-yellow-400 mb-6">{getRewardText()}</p>
            <Button 
              onClick={() => setShowReward(false)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold"
            >
              Claim Reward
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default BountyMission;
