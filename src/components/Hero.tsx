// ============================================================================
// HERO COMPONENT - REBUILT FROM SCRATCH
// Simple two-column flexbox layout with guaranteed left alignment
// ============================================================================

import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, Activity, Zap, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

type SignalMode = 'social' | 'pulse' | 'thrill' | 'afterdark';

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeSignal, setActiveSignal] = useState<SignalMode>('social');
  const [displayedText, setDisplayedText] = useState('');
  const fullText = t('hero.poweredBy');

  const signalModes = {
    social: { icon: Users, label: t('signals.social.name'), color: 'cyan', description: t('signals.social.description') },
    pulse: { icon: Activity, label: t('signals.pulse.name'), color: 'green', description: t('signals.pulse.description') },
    thrill: { icon: Zap, label: t('signals.thrill.name'), color: 'orange', description: t('signals.thrill.description') },
    afterdark: { icon: Moon, label: t('signals.afterdark.name'), color: 'purple', description: t('signals.afterdark.description') },
  };

  const handleAccessClick = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check our custom email_verified field
        const { data: profile } = await supabase
          .from("profiles")
          .select("email_verified")
          .eq("user_id", session.user.id)
          .single();
        
        if (profile?.email_verified) {
          navigate('/dashboard');
        } else {
          navigate('/auth?mode=login');
        }
      } else {
        navigate('/auth?mode=login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth?mode=login');
    }
  };

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

  const colorClasses: Record<string, { active: string; inactive: string }> = {
    cyan: {
      active: 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]',
      inactive: 'border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/10'
    },
    green: {
      active: 'bg-green-500/20 border-green-400 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]',
      inactive: 'border-green-400/50 text-green-400 hover:bg-green-500/10'
    },
    orange: {
      active: 'bg-orange-500/20 border-orange-400 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.3)]',
      inactive: 'border-orange-400/50 text-orange-400 hover:bg-orange-500/10'
    },
    purple: {
      active: 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
      inactive: 'border-purple-400/50 text-purple-400 hover:bg-purple-500/10'
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      
      {/* ===== NAVBAR ===== */}
      <nav className="w-full px-4 md:px-8 pt-12 pb-6">
        <div className="flex items-center justify-between">
          {/* Removed spacer - align logo to left */}
          
          {/* Logo */}
          <div className="text-2xl md:text-4xl font-black font-orbitron tracking-widest text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">
            VALID<sup className="text-xs md:text-sm text-cyan-400">™</sup>
          </div>
          
          {/* Nav Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSelector />
            <Link 
              to="/partners" 
              className="hidden sm:block text-xs font-bold text-cyan-400/80 hover:text-cyan-300 uppercase tracking-widest border border-cyan-900/50 px-3 py-2 rounded-full hover:bg-cyan-900/20 transition-colors"
            >
              {t('nav.partners')}
            </Link>
            <button 
              onClick={handleAccessClick}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded text-xs uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              {t('nav.memberLogin')}
            </button>
          </div>
        </div>
      </nav>

      {/* ===== MAIN HERO: TWO-COLUMN FLEXBOX ===== */}
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-start">
          
          {/* ----- LEFT COLUMN: TEXT (HARD LEFT ALIGNED) ----- */}
          <div className="flex-1 w-full lg:w-1/2 text-left order-2 lg:order-1 pl-0">
            
            {/* Synthesized AI Tag */}
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 border border-cyan-500/30 bg-cyan-900/10 rounded-lg text-xs font-mono tracking-widest text-cyan-400">
              <span>{displayedText}</span>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_10px_rgba(0,240,255,0.8)]"></span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-6 leading-tight text-left">
              {t('hero.headline')}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500 drop-shadow-[0_0_25px_rgba(0,240,255,0.5)]">
                {t('hero.subheadline')}
              </span>
            </h1>

            {/* Description */}
            <p className="text-base text-gray-300 mb-8 mt-8 max-w-lg leading-relaxed text-left">
              {t('hero.adaptiveProfile')} <span className="text-white font-bold">{t('hero.adaptiveAI')}</span> {t('hero.forNewWorld')} 
              <span className="text-cyan-400"> {t('hero.signalFlow')}</span> {t('hero.switchIdentity')}
            </p>

            {/* CTA Button + Beta Pill */}
            <div className="flex items-center gap-3 mb-8">
              <button 
                onClick={handleAccessClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold text-xs rounded-full hover:bg-cyan-50 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
              >
                {t('hero.claimId')} <ArrowRight size={14} />
              </button>
              <span className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-full border border-cyan-400/60 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)] animate-pulse">
                Beta
              </span>
            </div>

            {/* Signal Mode Selection */}
            <div className="mb-8">
              <p className="text-xs font-mono tracking-widest text-cyan-400 mb-3 uppercase animate-pulse text-left">
                {t('hero.selectSignal')}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl">
                {(Object.keys(signalModes) as SignalMode[]).map((mode) => {
                  const { icon: Icon, label, color } = signalModes[mode];
                  const isActive = activeSignal === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => setActiveSignal(mode)}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 text-xs font-bold tracking-wider ${
                        isActive ? colorClasses[color].active : colorClasses[color].inactive
                      }`}
                    >
                      <Icon size={14} /> {label}
                    </button>
                  );
                })}
              </div>
              <p className="text-sm font-bold text-[#39ff14] mt-3 max-w-md text-left drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]">
                {signalModes[activeSignal].description}
              </p>
              
              {/* Identity Control Messaging */}
              <p className="text-base text-white mt-8 max-w-lg leading-relaxed text-left">
                Static profiles are ancient. Now you choose what you share. Points of entry are fluid. You lock down your Vitals for Invisibility, or open your profile for that Connection. Your identity is now adaptable, secure, and entirely under your control.
              </p>
            </div>

            {/* Valid Network Title */}
            <div className="mb-6 mt-10">
              <div className="inline-block px-4 py-1.5 border border-cyan-500/30 rounded-full text-xs font-mono tracking-widest uppercase text-cyan-400 bg-cyan-500/10 mb-4">
                {t('network.title')}
              </div>
              <h2 className="text-2xl md:text-4xl font-black font-orbitron text-white text-left whitespace-nowrap">
                {t('network.headline')} <span className="text-cyan-400 inline">{t('network.zero')}</span> <span className="text-cyan-400 inline">{t('network.limits')}</span>
              </h2>
            </div>
          </div>

          {/* ----- RIGHT COLUMN: MOTION LOGO (SIZED UP 40%) ----- */}
          <div className="flex-1 w-full lg:w-1/2 flex justify-center items-start order-1 lg:order-2 pt-4 lg:pt-8">
            <div className="relative w-full max-w-[380px] sm:max-w-[450px] lg:max-w-[550px] xl:max-w-[620px]">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-2xl opacity-40"></div>
              
              {/* Video Container */}
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_50px_rgba(0,240,255,0.25)] bg-black">
                <video 
                  src="/valid_portal.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black to-transparent"></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ===== FEATURE CARDS SECTION ===== */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-12">
        <p className="text-xs font-mono tracking-widest text-cyan-400 mb-6 uppercase text-left">{t('hero.powerBehind')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="p-5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm hover:border-cyan-400/50 transition-all">
            <h3 className="text-base font-bold text-cyan-400 mb-2">{t('hero.instantEntry')}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{t('hero.instantEntryDesc')}</p>
          </div>
          <div className="p-5 rounded-xl border border-green-500/30 bg-green-500/5 backdrop-blur-sm hover:border-green-400/50 transition-all">
            <h3 className="text-base font-bold text-green-400 mb-2">{t('hero.secureFunds')}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{t('hero.secureFundsDesc')}</p>
          </div>
          <div className="p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 backdrop-blur-sm hover:border-purple-400/50 transition-all">
            <h3 className="text-base font-bold text-purple-400 mb-2">{t('hero.dataLock')}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{t('hero.dataLockDesc')}</p>
          </div>
        </div>
      </div>

      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

    </div>
  );
};

export default Hero;
