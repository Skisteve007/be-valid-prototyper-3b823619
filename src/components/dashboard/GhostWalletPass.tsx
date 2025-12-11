import React, { useState, useEffect, useCallback } from 'react';
import { Fingerprint, Wallet, HeartPulse, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ToggleState {
  identity: boolean;
  payment: boolean;
  health: boolean;
}

const GhostWalletPass = () => {
  const [toggles, setToggles] = useState<ToggleState>({
    identity: true,
    payment: true,
    health: false,
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [qrKey, setQrKey] = useState(Date.now());

  // Determine glow color based on active toggles
  const getGlowColor = useCallback(() => {
    const { identity, payment, health } = toggles;
    if (identity && payment && health) return 'green';
    if (identity && payment) return 'green';
    if (identity && !payment && !health) return 'blue';
    if (payment && !identity && !health) return 'gold';
    if (health && identity) return 'green';
    if (health && payment) return 'green';
    return 'cyan';
  }, [toggles]);

  const glowColor = getGlowColor();

  const glowStyles: Record<string, string> = {
    green: 'shadow-[0_0_40px_rgba(34,197,94,0.6),0_0_80px_rgba(34,197,94,0.3)] border-green-500',
    blue: 'shadow-[0_0_40px_rgba(59,130,246,0.6),0_0_80px_rgba(59,130,246,0.3)] border-blue-500',
    gold: 'shadow-[0_0_40px_rgba(234,179,8,0.6),0_0_80px_rgba(234,179,8,0.3)] border-amber-500',
    cyan: 'shadow-[0_0_40px_rgba(0,240,255,0.6),0_0_80px_rgba(0,240,255,0.3)] border-cyan-500',
  };

  const glowBgStyles: Record<string, string> = {
    green: 'from-green-500/20 to-green-500/5',
    blue: 'from-blue-500/20 to-blue-500/5',
    gold: 'from-amber-500/20 to-amber-500/5',
    cyan: 'from-cyan-500/20 to-cyan-500/5',
  };

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
  }, [refreshQR]);

  // Generate QR data based on active toggles
  const generateQRData = () => {
    const data = {
      id: qrKey,
      permissions: {
        identity: toggles.identity,
        payment: toggles.payment,
        health: toggles.health,
      },
      expires: Date.now() + 30000,
      type: 'GHOST_TOKEN',
    };
    return JSON.stringify(data);
  };

  // Progress ring calculation
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const progress = ((30 - timeLeft) / 30) * circumference;

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Card Container */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden">
        
        {/* Background glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${glowBgStyles[glowColor]} opacity-50 pointer-events-none transition-all duration-500`}></div>
        
        {/* Header */}
        <div className="relative z-10 text-center mb-6">
          <h2 className="text-xl font-bold font-orbitron tracking-wider text-white mb-1">MY GHOST<sup className="text-xs text-amber-400">™</sup> PASS</h2>
          <p className="text-xs text-gray-400 tracking-widest uppercase">Tap to customize your signal</p>
        </div>

        {/* Permission Toggles - The Mixing Board */}
        <div className="relative z-10 flex justify-center gap-4 mb-8">
          {/* Identity Toggle */}
          <button
            onClick={() => setToggles(prev => ({ ...prev, identity: !prev.identity }))}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 min-w-[90px] ${
              toggles.identity
                ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                : 'bg-gray-800/50 border-gray-700 opacity-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              toggles.identity ? 'bg-blue-500/30' : 'bg-gray-700/50'
            }`}>
              <Fingerprint size={28} className={toggles.identity ? 'text-blue-400' : 'text-gray-500'} />
            </div>
            <span className={`text-[10px] font-bold tracking-wider ${toggles.identity ? 'text-blue-400' : 'text-gray-500'}`}>
              VERIFY ID
            </span>
          </button>

          {/* Payment Toggle */}
          <button
            onClick={() => setToggles(prev => ({ ...prev, payment: !prev.payment }))}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 min-w-[90px] ${
              toggles.payment
                ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'bg-gray-800/50 border-gray-700 opacity-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              toggles.payment ? 'bg-amber-500/30' : 'bg-gray-700/50'
            }`}>
              <Wallet size={28} className={toggles.payment ? 'text-amber-400' : 'text-gray-500'} />
            </div>
            <span className={`text-[10px] font-bold tracking-wider ${toggles.payment ? 'text-amber-400' : 'text-gray-500'}`}>
              WALLET
            </span>
          </button>

          {/* Health Toggle */}
          <button
            onClick={() => setToggles(prev => ({ ...prev, health: !prev.health }))}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 min-w-[90px] ${
              toggles.health
                ? 'bg-green-500/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                : 'bg-gray-800/50 border-gray-700 opacity-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              toggles.health ? 'bg-green-500/30' : 'bg-gray-700/50'
            }`}>
              <HeartPulse size={28} className={toggles.health ? 'text-green-400' : 'text-gray-500'} />
            </div>
            <span className={`text-[10px] font-bold tracking-wider ${toggles.health ? 'text-green-400' : 'text-gray-500'}`}>
              BIO-STATUS
            </span>
          </button>
        </div>

        {/* QR Code Container with Progress Ring */}
        <div className="relative z-10 flex justify-center mb-6">
          <div className="relative">
            {/* Progress Ring */}
            <svg className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] -rotate-90">
              {/* Background ring */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
              />
              {/* Progress ring */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                fill="none"
                stroke={glowColor === 'green' ? '#22c55e' : glowColor === 'blue' ? '#3b82f6' : glowColor === 'gold' ? '#eab308' : '#00f0ff'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Glassmorphism QR Container */}
            <div className={`relative w-32 h-32 rounded-2xl border-2 ${glowStyles[glowColor]} transition-all duration-500 overflow-hidden`}>
              {/* Glass effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm"></div>
              
              {/* Animated scan line */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div 
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-scan"
                  style={{ animationDuration: '2s' }}
                ></div>
              </div>

              {/* Refresh/Glitch animation overlay */}
              {isRefreshing && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw size={24} className="text-cyan-400 animate-spin" />
                    <span className="text-[10px] text-cyan-400 font-mono">ENCRYPTING...</span>
                  </div>
                </div>
              )}

              {/* QR Code */}
              <div className={`relative z-10 w-full h-full flex items-center justify-center p-2 transition-all duration-300 ${isRefreshing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <QRCodeSVG
                  key={qrKey}
                  value={generateQRData()}
                  size={112}
                  level="H"
                  bgColor="transparent"
                  fgColor={glowColor === 'green' ? '#22c55e' : glowColor === 'blue' ? '#3b82f6' : glowColor === 'gold' ? '#eab308' : '#00f0ff'}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="relative z-10 text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10">
            <div className={`w-2 h-2 rounded-full ${timeLeft <= 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-sm font-mono text-gray-300">
              Refreshes in <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
            </span>
          </div>
        </div>

        {/* Active Permissions Summary */}
        <div className="relative z-10 flex justify-center gap-2 mb-4">
          {toggles.identity && (
            <span className="px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-[10px] text-blue-400 font-bold">ID</span>
          )}
          {toggles.payment && (
            <span className="px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] text-amber-400 font-bold">FUNDS</span>
          )}
          {toggles.health && (
            <span className="px-2 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-[10px] text-green-400 font-bold">BIO</span>
          )}
          {!toggles.identity && !toggles.payment && !toggles.health && (
            <span className="px-2 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-[10px] text-red-400 font-bold">NO SIGNAL</span>
          )}
        </div>

        {/* Privacy Note */}
        <div className="relative z-10 text-center">
          <p className="text-[11px] text-gray-500 leading-relaxed px-2">
            This code encrypts your selected data for <span className="text-white font-semibold">30 seconds</span>. 
            <br />No raw data is shared with the venue.
          </p>
        </div>

        {/* Manual Refresh Button */}
        <div className="relative z-10 mt-4 text-center">
          <button
            onClick={refreshQR}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-xs text-gray-400 hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            Regenerate Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GhostWalletPass;
