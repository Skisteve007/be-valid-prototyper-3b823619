import { useState, useEffect, useRef } from 'react';
import { Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ValidAccessCardProps {
  userName: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  currentSignal: 'social' | 'pulse' | 'thrill' | 'afterdark' | null;
  qrCodeUrl?: string;
  memberId?: string;
}

const getSignalTheme = (signal: string | null) => {
  switch (signal) {
    case 'social':
    case 'pulse':
      return { bg: 'from-cyan-500/20 to-cyan-900/40', border: 'border-cyan-500', glow: 'shadow-[0_0_30px_rgba(0,240,255,0.4)]', label: 'CHILL' };
    case 'thrill':
      return { bg: 'from-orange-500/20 to-orange-900/40', border: 'border-orange-500', glow: 'shadow-[0_0_30px_rgba(255,165,0,0.4)]', label: 'THRILL' };
    case 'afterdark':
      return { bg: 'from-purple-500/20 to-purple-900/40', border: 'border-purple-500', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.4)]', label: 'OPEN' };
    default:
      return { bg: 'from-emerald-500/20 to-emerald-900/40', border: 'border-emerald-500', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.4)]', label: 'VERIFIED' };
  }
};

export const ValidAccessCard = ({
  userName,
  verificationStatus,
  currentSignal,
  qrCodeUrl,
  memberId
}: ValidAccessCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const theme = getSignalTheme(currentSignal);

  useEffect(() => {
    const hasTappedBefore = localStorage.getItem('validAccessCardTapped');
    if (hasTappedBefore) {
      setShouldPulse(false);
    }
  }, []);

  const handleFlip = () => {
    setIsFlipped(true);
    if (shouldPulse) {
      setShouldPulse(false);
      localStorage.setItem('validAccessCardTapped', 'true');
    }
  };

  const handleClose = () => {
    setIsFlipped(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userName} - VALID™ ID`,
          text: `Check out my VALID™ Access Card! Signal: ${theme.label}`,
          url: window.location.origin
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${userName} - VALID™ Verified | Signal: ${theme.label} | ${window.location.origin}`);
    }
  };

  return (
    <>
      {/* Flip trigger button */}
      <button
        onClick={handleFlip}
        className={`absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all z-10 ${
          shouldPulse ? 'animate-[cardPulse_0.8s_ease-in-out_2]' : ''
        }`}
        title="View Shareable Card"
      >
        <Share2 className="w-4 h-4 text-cyan-400" />
      </button>

      <style>{`
        @keyframes cardPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes cardFlipIn {
          0% { transform: perspective(1000px) rotateY(90deg); opacity: 0; }
          100% { transform: perspective(1000px) rotateY(0deg); opacity: 1; }
        }
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      {/* Full-screen shareable card overlay */}
      {isFlipped && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4" onClick={handleClose}>
          <div 
            ref={cardRef}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-sm bg-gradient-to-br ${theme.bg} border-2 ${theme.border} ${theme.glow} rounded-2xl overflow-hidden`}
            style={{ animation: 'cardFlipIn 0.5s ease-out' }}
          >
            {/* Scanline effect */}
            <div 
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 pointer-events-none"
              style={{ animation: 'scanline 3s linear infinite' }}
            />

            {/* Close button */}
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Card content */}
            <div className="p-6 flex flex-col items-center">
              {/* VALID branding */}
              <div className="text-xs tracking-[0.3em] text-white/40 mb-2">VALID™ ACCESS CARD</div>
              
              {/* Signal badge */}
              <div className={`px-4 py-1 rounded-full ${theme.border} border bg-black/50 mb-4`}>
                <span className="text-sm font-bold tracking-wider text-white">{theme.label}</span>
              </div>

              {/* QR Code area */}
              <div className={`w-48 h-48 bg-black/60 rounded-xl border ${theme.border} flex items-center justify-center mb-4 relative overflow-hidden`}>
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40 object-contain" />
                ) : (
                  <div className="w-40 h-40 bg-white/10 rounded-lg flex items-center justify-center">
                    <span className="text-white/40 text-xs">QR CODE</span>
                  </div>
                )}
                {/* Glow effect behind QR */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${theme.bg} blur-xl pointer-events-none`}
                  style={{ animation: 'glowPulse 2s ease-in-out infinite' }}
                />
              </div>

              {/* User name */}
              <h2 className="text-2xl font-black text-white tracking-wide mb-1" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {userName || 'MEMBER'}
              </h2>

              {/* Member ID */}
              {memberId && (
                <div className="text-xs text-white/40 tracking-widest mb-4">
                  ID: {memberId}
                </div>
              )}

              {/* Verification status */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2 h-2 rounded-full ${verificationStatus === 'verified' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                <span className="text-xs text-white/60 uppercase tracking-wider">
                  {verificationStatus === 'verified' ? 'Identity Verified' : 'Pending Verification'}
                </span>
              </div>

              {/* Share button */}
              <Button
                onClick={handleShare}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold hover:scale-105 transition-transform"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share to Stories
              </Button>

              {/* Privacy Trust Mark */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 opacity-70">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#00FFFF">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
                <span className="text-muted-foreground text-[9px] tracking-wider">ZERO DATA STORED</span>
              </div>

              {/* Footer branding */}
              <div className="mt-4 text-[10px] text-white/20 tracking-widest">
                bevalid.app
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ValidAccessCard;
