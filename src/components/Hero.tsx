// *****************************************************************************
// FILE: src/components/Hero.tsx
// PURPOSE: RESTORED Hero (Visible Video, Partner Button, Synthesized AI)
// *****************************************************************************

import React, { useState, useEffect } from 'react';
import { ArrowRight, Plane, Ticket, Ghost, Users, Activity, Zap, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

interface ModeBtnProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  mode: 'travel' | 'access' | 'ghost';
}

const ModeBtn = ({ active, onClick, icon, label, mode }: ModeBtnProps) => {
  const getColors = () => {
    if (mode === 'ghost') {
      return active 
        ? 'bg-yellow-500/10 border-yellow-400 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]'
        : 'border-white/10 text-gray-500 hover:border-yellow-400/30 hover:text-yellow-400';
    }
    return active 
      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]' 
      : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white';
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 text-xs font-bold tracking-wider ${getColors()}`}
    >
      {icon} {label}
    </button>
  );
};

type SignalMode = 'social' | 'pulse' | 'thrill' | 'afterdark';

const getSignalModes = (t: (key: string) => string) => ({
  social: { icon: Users, label: t('signals.social.name'), color: 'cyan', description: t('signals.social.description') },
  pulse: { icon: Activity, label: t('signals.pulse.name'), color: 'green', description: t('signals.pulse.description') },
  thrill: { icon: Zap, label: t('signals.thrill.name'), color: 'orange', description: t('signals.thrill.description') },
  afterdark: { icon: Moon, label: t('signals.afterdark.name'), color: 'purple', description: t('signals.afterdark.description') },
});

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<'travel' | 'access' | 'ghost'>('access');
  const [activeSignal, setActiveSignal] = useState<SignalMode>('social');
  const [displayedText, setDisplayedText] = useState('');
  const fullText = t('hero.poweredBy');
  
  // Smart navigation - checks auth and routes appropriately
  const handleAccessClick = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user.email_confirmed_at) {
        // Already logged in with confirmed email - go to dashboard
        navigate('/dashboard');
      } else {
        // Not logged in or email not confirmed - go to auth
        navigate('/access-portal');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/access-portal');
    }
  };
  
  const signalModes = getSignalModes(t);
  
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);
    
    return () => clearInterval(typingInterval);
  }, [fullText]);
  
  return (
    <div className="relative min-h-[85vh] bg-[#050505] text-white overflow-hidden flex flex-col items-center selection:bg-cyan-500 selection:text-black">
      
      {/* 1. NAVBAR - Fixed mobile visibility with proper vertical centering */}
      <nav className="w-full px-[15px] md:px-6 pt-14 pb-5 md:pt-16 md:pb-6 z-50 relative">
        {/* Mobile: Single row with logo centered, actions on right */}
        <div className="flex items-center justify-between md:justify-between gap-2 min-h-[48px]">
          {/* Spacer for mobile to center logo */}
          <div className="w-[80px] md:hidden" />
          
          {/* THE LOGO - Centered on mobile via flex, vertically centered */}
          <div className="text-xl md:text-4xl font-black font-orbitron tracking-[0.1em] md:tracking-[0.2em] text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] cursor-pointer flex-shrink-0 flex items-center">
            VALID<sup className="text-[8px] md:text-sm text-cyan-400">™</sup>
          </div>
          
          {/* Navigation Actions - Always visible on right */}
          <div className="flex gap-1.5 md:gap-4 items-center justify-end flex-shrink-0">
            <LanguageSelector />
            {/* For Partners Link - hidden on very small screens */}
            <Link to="/partners" className="hidden sm:block text-[10px] md:text-xs font-bold text-cyan-400/80 hover:text-cyan-300 transition-colors uppercase tracking-widest border border-cyan-900/50 px-2 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-cyan-900/20">
              {t('nav.partners')}
            </Link>
            <button 
              onClick={handleAccessClick}
              className="px-2.5 md:px-5 py-1.5 md:py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] uppercase tracking-wider text-[9px] md:text-xs whitespace-nowrap relative z-50"
            >
              {t('nav.memberLogin')}
            </button>
          </div>
        </div>
      </nav>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-center w-full max-w-7xl px-[15px] md:px-6 z-10 gap-8 md:gap-16 mt-4">
        
        {/* LEFT: THE PITCH */}
        <div className="flex-1 text-center md:text-left order-2 md:order-1">
          
          {/* TAG: SYNTHESIZED AI with typing effect */}
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 border border-cyan-500/30 bg-cyan-900/10 rounded-lg text-xs font-mono tracking-widest text-cyan-400">
            <span>
              {displayedText}
            </span>
            {/* Glowing pulsating teal circle */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_10px_rgba(0,240,255,0.8),0_0_20px_rgba(0,240,255,0.5)]"></span>
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.15] md:leading-[0.9] text-white">
            {t('hero.headline')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500 drop-shadow-[0_0_25px_rgba(0,240,255,0.5)]" style={{ letterSpacing: '-0.08em' }}>
              {t('hero.subheadline')}
            </span>
          </h1>
          
          {/* SUB-HEADLINE: Adaptive Profile */}
          <p className="text-lg text-gray-400 mb-8 font-light max-w-md mx-auto md:mx-0 leading-relaxed">
            {t('hero.adaptiveProfile')} <span className="text-white font-bold">{t('hero.adaptiveAI')}</span> {t('hero.forNewWorld')} 
            <span className="text-cyan-400"> {t('hero.signalFlow')}</span> {t('hero.switchIdentity')}
          </p>
          
          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start relative z-50">
            <button 
              onClick={handleAccessClick}
              className="px-6 py-2.5 bg-white text-black font-bold text-sm rounded-full hover:bg-cyan-50 text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 min-h-[40px] relative z-50"
            >
              {t('hero.claimId')} <ArrowRight size={16} />
            </button>
          </div>

          {/* Select Your Signal - Mode Buttons */}
          <div className="mt-8">
            <p className="text-xs font-mono tracking-widest text-cyan-400 mb-3 text-center md:text-left uppercase animate-pulse">
              {t('hero.selectSignal')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl mx-auto md:mx-0">
              {(Object.keys(signalModes) as SignalMode[]).map((mode) => {
                const { icon: Icon, label, color } = signalModes[mode];
                const isActive = activeSignal === mode;
                const colorClasses = {
                  cyan: isActive ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/10',
                  green: isActive ? 'bg-green-500/20 border-green-400 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'border-green-400/50 text-green-400 hover:bg-green-500/10',
                  orange: isActive ? 'bg-orange-500/20 border-orange-400 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'border-orange-400/50 text-orange-400 hover:bg-orange-500/10',
                  purple: isActive ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'border-purple-400/50 text-purple-400 hover:bg-purple-500/10',
                };
                return (
                  <button
                    key={mode}
                    onClick={() => setActiveSignal(mode)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 text-xs font-bold tracking-wider ${colorClasses[color as keyof typeof colorClasses]}`}
                  >
                    <Icon size={14} /> {label}
                  </button>
                );
              })}
            </div>
            {/* Dynamic Description */}
            <p className="text-sm text-gray-400 mt-3 text-center md:text-left max-w-md transition-all duration-300">
              {signalModes[activeSignal].description}
            </p>
          </div>


          {/* The Power Behind The Signal - Feature Cards */}
          <div className="mt-12 w-full">
            <p className="text-xs font-mono tracking-widest text-cyan-400 mb-4 text-center md:text-left uppercase">{t('hero.powerBehind')}</p>
          </div>
        </div>

        {/* RIGHT: THE PORTAL VIDEO (Fixed Visibility & Centering) */}
        <div className="flex-1 flex justify-center order-1 md:order-2 md:-mt-96 w-full">
          <div className="relative group w-[280px] md:w-[380px] aspect-[4/5] mx-auto">
            
            {/* The Glow Behind */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-1000"></div>
            
            {/* The Video Container */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
              {/* VIDEO LOOP - No Blurs, No overlays */}
              <video 
                src="/valid_portal.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover transform scale-105"
              />
              
              {/* Overlay Gradient (Bottom only) */}
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              
            </div>
          </div>
        </div>

      </div>

      {/* Power Behind Signal Cards - Full Width Section */}
      <div className="w-full max-w-7xl px-[15px] md:px-6 z-10 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {/* Card 1: Verified Access */}
          <div className="p-5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm hover:border-cyan-400/50 transition-all">
            <h3 className="text-base font-bold text-cyan-400 mb-2">{t('hero.instantEntry')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('hero.instantEntryDesc')}</p>
          </div>
          {/* Card 2: Instant Funds Flow */}
          <div className="p-5 rounded-xl border border-green-500/30 bg-green-500/5 backdrop-blur-sm hover:border-green-400/50 transition-all">
            <h3 className="text-base font-bold text-green-400 mb-2">{t('hero.secureFunds')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('hero.secureFundsDesc')}</p>
          </div>
          {/* Card 3: Absolute Privacy */}
          <div className="p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 backdrop-blur-sm hover:border-purple-400/50 transition-all">
            <h3 className="text-base font-bold text-purple-400 mb-2">{t('hero.dataLock')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('hero.dataLockDesc')}</p>
          </div>
        </div>
      </div>

      {/* 3. BACKGROUND ATMOSPHERE */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

    </div>
  );
};

export default Hero;