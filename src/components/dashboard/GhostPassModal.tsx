import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Ghost, Check, X, Fingerprint, Wallet, HeartPulse, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface GhostPassModalProps {
  userId: string;
  balance?: number;
  spentAtVenue?: number;
  onScanSuccess?: () => void;
}

interface ToggleState {
  identity: boolean;
  payment: boolean;
  health: boolean;
}

const GhostPassModal = ({ 
  userId, 
  balance = 150.00, 
  spentAtVenue = 0,
  onScanSuccess 
}: GhostPassModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toggles, setToggles] = useState<ToggleState>({
    identity: true,
    payment: true,
    health: false,
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [qrKey, setQrKey] = useState(Date.now());
  const [showSuccess, setShowSuccess] = useState(false);
  const [displayedBalance, setDisplayedBalance] = useState(balance);
  const [displayedSpent, setDisplayedSpent] = useState(spentAtVenue);
  const prevBalanceRef = useRef(balance);
  const prevSpentRef = useRef(spentAtVenue);

  // Animate balance changes
  useEffect(() => {
    if (balance !== prevBalanceRef.current) {
      const diff = prevBalanceRef.current - balance;
      const steps = 20;
      const stepValue = diff / steps;
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        setDisplayedBalance(prev => Math.max(0, prev - stepValue));
        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayedBalance(balance);
        }
      }, 30);
      
      prevBalanceRef.current = balance;
      return () => clearInterval(interval);
    }
  }, [balance]);

  // Animate spent changes
  useEffect(() => {
    if (spentAtVenue !== prevSpentRef.current) {
      const diff = spentAtVenue - prevSpentRef.current;
      const steps = 20;
      const stepValue = diff / steps;
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        setDisplayedSpent(prev => prev + stepValue);
        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayedSpent(spentAtVenue);
        }
      }, 30);
      
      prevSpentRef.current = spentAtVenue;
      return () => clearInterval(interval);
    }
  }, [spentAtVenue]);

  // Determine if wallet has funds
  const hasFunds = balance > 0;

  // Refresh QR code
  const refreshQR = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setQrKey(Date.now());
      setTimeLeft(30);
      setIsRefreshing(false);
    }, 500);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          refreshQR();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshQR, isOpen]);

  // Generate QR data
  const generateQRData = () => {
    const data = {
      id: qrKey,
      userId,
      permissions: {
        identity: toggles.identity,
        payment: toggles.payment,
        health: toggles.health,
      },
      balance: toggles.payment ? balance : null,
      expires: Date.now() + 30000,
      type: 'GHOST_TOKEN',
    };
    return JSON.stringify(data);
  };

  // Simulate scan success (for demo)
  const handleScanSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onScanSuccess?.();
    }, 1500);
  };

  // Progress ring calculation
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = ((30 - timeLeft) / 30) * circumference;

  return (
    <>
      {/* Floating Ghost Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-16 h-16 rounded-full flex items-center justify-center transition-transform active:scale-95"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.95) 100%)',
          boxShadow: '0 0 0 2px rgba(255,215,0,0.4), 0 0 30px rgba(255,215,0,0.4), 0 0 60px rgba(34,197,94,0.3)',
          animation: 'ghostBreathing 3s ease-in-out infinite',
        }}
      >
        <Ghost className="w-8 h-8 text-amber-400" />
      </button>

      {/* Ghost QR Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="max-w-sm w-[95vw] p-0 border-0 bg-transparent shadow-none [&>button]:hidden"
          style={{
            animation: 'slideUpEnergize 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Modal Container with Dark Blur */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            
            {/* Content */}
            <div className="relative z-10 p-6">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>

              {/* Header */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 mb-2">
                  <Ghost className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold tracking-wider text-white">GHOST<sup className="text-xs text-amber-400">™</sup> PASS</h2>
                </div>
              </div>

              {/* Live Wallet Display (HUD) */}
              <div className="mb-6 text-center">
                <div className="text-3xl font-bold text-white tracking-tight">
                  ${displayedBalance.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Available Balance
                </div>
                {displayedSpent > 0 && (
                  <div className="text-sm text-gray-500 mt-2">
                    Spent at this Venue: <span className="text-amber-400">${displayedSpent.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Permission Toggles */}
              <div className="flex justify-center gap-3 mb-6">
                {/* Identity Toggle */}
                <button
                  onClick={() => setToggles(prev => ({ ...prev, identity: !prev.identity }))}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300 ${
                    toggles.identity
                      ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                      : 'bg-white/5 border-white/10 opacity-50'
                  }`}
                >
                  <Fingerprint size={22} className={toggles.identity ? 'text-blue-400' : 'text-gray-500'} />
                  <span className={`text-[9px] font-bold ${toggles.identity ? 'text-blue-400' : 'text-gray-500'}`}>
                    ID
                  </span>
                </button>

                {/* Payment Toggle */}
                <button
                  onClick={() => setToggles(prev => ({ ...prev, payment: !prev.payment }))}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300 ${
                    toggles.payment
                      ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-white/5 border-white/10 opacity-50'
                  }`}
                >
                  <Wallet size={22} className={toggles.payment ? 'text-amber-400' : 'text-gray-500'} />
                  <span className={`text-[9px] font-bold ${toggles.payment ? 'text-amber-400' : 'text-gray-500'}`}>
                    FUNDS
                  </span>
                </button>

                {/* Health Toggle */}
                <button
                  onClick={() => setToggles(prev => ({ ...prev, health: !prev.health }))}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300 ${
                    toggles.health
                      ? 'bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                      : 'bg-white/5 border-white/10 opacity-50'
                  }`}
                >
                  <HeartPulse size={22} className={toggles.health ? 'text-green-400' : 'text-gray-500'} />
                  <span className={`text-[9px] font-bold ${toggles.health ? 'text-green-400' : 'text-gray-500'}`}>
                    BIO
                  </span>
                </button>
              </div>

              {/* QR Code Container with Progress Ring */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  {/* Progress Ring */}
                  <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r={radius}
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="3"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r={radius}
                      fill="none"
                      stroke={hasFunds ? '#22c55e' : '#ef4444'}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - progress}
                      className="transition-all duration-1000 ease-linear"
                      style={{
                        filter: hasFunds ? 'drop-shadow(0 0 8px rgba(34,197,94,0.6))' : 'drop-shadow(0 0 8px rgba(239,68,68,0.6))',
                      }}
                    />
                  </svg>

                  {/* White QR Container for Scanner Visibility */}
                  <div 
                    className="relative w-44 h-44 rounded-2xl overflow-hidden"
                    style={{
                      background: 'white',
                      boxShadow: hasFunds 
                        ? '0 0 0 3px rgba(34,197,94,0.8), 0 0 40px rgba(34,197,94,0.5), 0 0 80px rgba(34,197,94,0.3)'
                        : '0 0 0 3px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.5)',
                      animation: hasFunds ? 'neonPulseGreen 2s ease-in-out infinite' : 'none',
                    }}
                  >
                    {/* Refresh Animation */}
                    {isRefreshing && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
                        <div className="flex flex-col items-center gap-2">
                          <RefreshCw size={28} className="text-gray-400 animate-spin" />
                          <span className="text-[10px] text-gray-500 font-mono">ENCRYPTING...</span>
                        </div>
                      </div>
                    )}

                    {/* Success Overlay */}
                    {showSuccess && (
                      <div className="absolute inset-0 z-30 flex items-center justify-center bg-green-500"
                        style={{ animation: 'successFlash 1.5s ease-out' }}
                      >
                        <Check className="w-20 h-20 text-white" strokeWidth={3} />
                      </div>
                    )}

                    {/* QR Code */}
                    <div className={`w-full h-full flex items-center justify-center p-4 transition-all duration-300 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>
                      <QRCodeSVG
                        key={qrKey}
                        value={generateQRData()}
                        size={160}
                        level="H"
                        bgColor="white"
                        fgColor="black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div className={`w-2 h-2 rounded-full ${timeLeft <= 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                  <span className="text-xs text-gray-400">
                    Refreshes in <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
                  </span>
                </div>
              </div>

              {/* Privacy Note */}
              <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                This code encrypts your selected data for 30 seconds.
                <br />No raw data is shared with the venue.
              </p>

              {/* Demo: Simulate Scan Success */}
              <div className="mt-4 text-center">
                <button
                  onClick={handleScanSuccess}
                  className="text-[10px] text-gray-600 hover:text-gray-400 underline transition-colors"
                >
                  [Demo: Simulate Scan]
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CSS Animations */}
      <style>{`
        @keyframes ghostBreathing {
          0%, 100% {
            box-shadow: 0 0 0 2px rgba(255,215,0,0.4), 0 0 30px rgba(255,215,0,0.4), 0 0 60px rgba(34,197,94,0.3);
          }
          50% {
            box-shadow: 0 0 0 3px rgba(255,215,0,0.6), 0 0 50px rgba(255,215,0,0.6), 0 0 80px rgba(34,197,94,0.5);
          }
        }

        @keyframes slideUpEnergize {
          0% {
            opacity: 0;
            transform: translateY(100px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes neonPulseGreen {
          0%, 100% {
            box-shadow: 0 0 0 3px rgba(34,197,94,0.8), 0 0 40px rgba(34,197,94,0.5), 0 0 80px rgba(34,197,94,0.3);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(34,197,94,1), 0 0 60px rgba(34,197,94,0.7), 0 0 100px rgba(34,197,94,0.5);
          }
        }

        @keyframes successFlash {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          20% {
            opacity: 1;
            transform: scale(1.05);
          }
          40% {
            transform: scale(1);
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default GhostPassModal;
