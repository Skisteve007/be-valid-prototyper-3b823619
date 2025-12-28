import React, { useState, useEffect, useCallback } from 'react';
import { Fingerprint, Wallet, HeartPulse, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [token, setToken] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

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

  // CONDUIT PATTERN: Generate server-side token (no PHI in QR)
  const generateToken = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setToken(null);
        return;
      }

      // Get profile ID if not cached
      if (!profileId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (profile) setProfileId(profile.id);
      }

      if (!profileId) return;

      // Generate server-side token with permissions encoded server-side
      const { data, error } = await supabase.functions.invoke('generate-qr-token', {
        body: { 
          profileId,
          permissions: toggles // Permissions stored server-side, not in QR
        }
      });

      if (error) throw error;
      setToken(data.token);
      setTimeLeft(30);
    } catch (error) {
      console.error('Token generation error:', error);
      toast.error('Failed to generate code');
    } finally {
      setIsRefreshing(false);
    }
  }, [profileId, toggles]);

  // Initial token generation
  useEffect(() => {
    generateToken();
  }, [generateToken]);

  // Countdown timer - regenerate on expiry
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateToken();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [generateToken]);

  // CONDUIT PATTERN: QR contains only pointer URL (no PHI)
  const getQRValue = useCallback(() => {
    if (!token) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/scan?t=${token}`;
  }, [token]);

  // Progress ring calculation
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const progress = ((30 - timeLeft) / 30) * circumference;

  return (
    <div className="w-full max-w-xs mx-auto">
      {/* Card Container */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 relative overflow-hidden">
        
        {/* Background glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${glowBgStyles[glowColor]} opacity-50 pointer-events-none transition-all duration-500`}></div>
        
        {/* Header */}
        <div className="relative z-10 text-center mb-4">
          <h2 className="text-lg font-bold font-orbitron tracking-wider text-white mb-0.5">MY GHOST<sup className="text-[10px] text-amber-400">™</sup> PASS</h2>
          <p className="text-[10px] text-gray-400 tracking-widest uppercase">Tap to customize your signal</p>
        </div>

        {/* Permission Toggles - The Mixing Board */}
        <div className="relative z-10 flex justify-center gap-2 mb-4">
          {/* Identity Toggle */}
          <button
            onClick={() => setToggles(prev => ({ ...prev, identity: !prev.identity }))}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-300 min-w-[70px] ${
              toggles.identity
                ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                : 'bg-gray-800/50 border-gray-700 opacity-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              toggles.identity ? 'bg-blue-500/30' : 'bg-gray-700/50'
            }`}>
              <Fingerprint size={20} className={toggles.identity ? 'text-blue-400' : 'text-gray-500'} />
            </div>
            <span className={`text-[8px] font-bold tracking-wider ${toggles.identity ? 'text-blue-400' : 'text-gray-500'}`}>
              VERIFY ID
            </span>
          </button>

          {/* Payment Toggle */}
          <button
            onClick={() => setToggles(prev => ({ ...prev, payment: !prev.payment }))}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-300 min-w-[70px] ${
              toggles.payment
                ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-gray-800/50 border-gray-700 opacity-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              toggles.payment ? 'bg-amber-500/30' : 'bg-gray-700/50'
            }`}>
              <Wallet size={20} className={toggles.payment ? 'text-amber-400' : 'text-gray-500'} />
            </div>
            <span className={`text-[8px] font-bold tracking-wider ${toggles.payment ? 'text-amber-400' : 'text-gray-500'}`}>
              WALLET
            </span>
          </button>

          {/* Health Toggle */}
          <button
            onClick={() => setToggles(prev => ({ ...prev, health: !prev.health }))}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-300 min-w-[70px] ${
              toggles.health
                ? 'bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                : 'bg-gray-800/50 border-gray-700 opacity-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              toggles.health ? 'bg-green-500/30' : 'bg-gray-700/50'
            }`}>
              <HeartPulse size={20} className={toggles.health ? 'text-green-400' : 'text-gray-500'} />
            </div>
            <span className={`text-[8px] font-bold tracking-wider ${toggles.health ? 'text-green-400' : 'text-gray-500'}`}>
              BIO-STATUS
            </span>
          </button>
        </div>

        {/* QR Code Container with Progress Ring */}
        <div className="relative z-10 flex justify-center mb-4">
          <div className="relative">
            {/* Progress Ring */}
            <svg className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90">
              {/* Background ring */}
              <circle
                cx="50%"
                cy="50%"
                r={45}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="3"
              />
              {/* Progress ring */}
              <circle
                cx="50%"
                cy="50%"
                r={45}
                fill="none"
                stroke={glowColor === 'green' ? '#22c55e' : glowColor === 'blue' ? '#3b82f6' : glowColor === 'gold' ? '#eab308' : '#00f0ff'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={(2 * Math.PI * 45) - ((30 - timeLeft) / 30) * (2 * Math.PI * 45)}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Glassmorphism QR Container */}
            <div className={`relative w-24 h-24 rounded-xl border-2 ${glowStyles[glowColor]} transition-all duration-500 overflow-hidden`}>
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

              {/* QR Code - CONDUIT PATTERN: Token-only pointer */}
              <div className={`relative z-10 w-full h-full flex items-center justify-center p-1.5 transition-all duration-300 ${isRefreshing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                {token ? (
                  <QRCodeSVG
                    key={token}
                    value={getQRValue()}
                    size={84}
                    level="H"
                    bgColor="transparent"
                    fgColor={glowColor === 'green' ? '#22c55e' : glowColor === 'blue' ? '#3b82f6' : glowColor === 'gold' ? '#eab308' : '#00f0ff'}
                  />
                ) : (
                  <div className="text-[10px] text-gray-500 text-center">Loading...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="relative z-10 text-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10">
            <div className={`w-1.5 h-1.5 rounded-full ${timeLeft <= 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-xs font-mono text-gray-300">
              Refreshes in <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
            </span>
          </div>
        </div>

        {/* Active Permissions Summary */}
        <div className="relative z-10 flex justify-center gap-1.5 mb-3">
          {toggles.identity && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-[9px] text-blue-400 font-bold">ID</span>
          )}
          {toggles.payment && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[9px] text-amber-400 font-bold">FUNDS</span>
          )}
          {toggles.health && (
            <span className="px-1.5 py-0.5 rounded-full bg-green-500/20 border border-green-500/40 text-[9px] text-green-400 font-bold">BIO</span>
          )}
          {!toggles.identity && !toggles.payment && !toggles.health && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-[9px] text-red-400 font-bold">NO SIGNAL</span>
          )}
        </div>

        {/* Privacy Note */}
        <div className="relative z-10 text-center">
          <p className="text-[10px] text-gray-500 leading-relaxed px-1">
            Code encrypts for <span className="text-white font-semibold">30s</span>. No raw data shared.
          </p>
        </div>

        {/* Manual Refresh Button */}
        <div className="relative z-10 mt-3 text-center">
          <button
            onClick={generateToken}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-[10px] text-gray-400 hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
};

export default GhostWalletPass;
