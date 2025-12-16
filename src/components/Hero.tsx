// ============================================================================
// HERO COMPONENT - REBUILT FROM SCRATCH
// Simple two-column flexbox layout with guaranteed left alignment
// ============================================================================

import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, Users, Activity, Zap, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import ResponsiveHeader from './ResponsiveHeader';
import ComplianceBadges from './ComplianceBadges';
import SynthButton from './SynthButton';
import { usePageViewTracking } from '@/hooks/usePageViewTracking';
import LiveStats from './LiveStats';

type SignalMode = 'social' | 'pulse' | 'thrill' | 'afterdark';

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeSignal, setActiveSignal] = useState<SignalMode>('social');
  const [displayedText, setDisplayedText] = useState('');
  const [visitCount, setVisitCount] = useState(0);
  
  // Track this page view
  usePageViewTracking('/');
  
  const fullText = t('hero.poweredBy');

  const signalModes = {
    social: { icon: Users, label: t('signals.social.name'), color: 'cyan', description: t('signals.social.description') },
    pulse: { icon: Activity, label: t('signals.pulse.name'), color: 'green', description: t('signals.pulse.description') },
    thrill: { icon: Zap, label: t('signals.thrill.name'), color: 'orange', description: t('signals.thrill.description') },
    afterdark: { icon: Moon, label: t('signals.afterdark.name'), color: 'purple', description: t('signals.afterdark.description') },
  };

  const handleAccessClick = async () => {
    // Smart routing: check auth status first
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email_confirmed_at) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
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

  // Fetch real visit count and subscribe to realtime updates
  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });
      setVisitCount(58 + (count || 0));
    };

    fetchCount();

    // Subscribe to realtime updates for live counter
    const channel = supabase
      .channel('page_views_count')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'page_views' },
        () => {
          setVisitCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      
      {/* ===== NAVBAR ===== */}
      <ResponsiveHeader />

      {/* ===== MAIN HERO: CINEMATIC BACKGROUND ===== */}
      <div className="relative overflow-hidden">
        {/* Layer 1: Earth/Space Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/landing-hero-earth.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            opacity: 0.5,
          }}
        />
        
        {/* Layer 2: Dark Overlay */}
        <div className="absolute inset-0 z-0 bg-black/65" />
        
        {/* Layer 3: Brand Glow */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(circle at 20% 35%, rgba(34,211,238,0.22), transparent 55%)',
          }}
        />

        {/* Content Layer */}
        <div className="relative z-10 w-full px-4 md:px-8 lg:px-12 py-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-start">
            
            {/* ----- LEFT COLUMN: TEXT (HARD LEFT ALIGNED) ----- */}
            <div className="flex-1 w-full lg:w-1/2 text-left order-2 lg:order-1 pl-0">
              
              {/* Synthesized AI Tag + Beta Pill */}
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <div className="inline-flex items-center gap-3 px-4 py-2 border border-cyan-500/30 bg-cyan-900/10 rounded-lg text-xs font-mono tracking-widest text-cyan-400">
                  <span>{displayedText}</span>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_10px_rgba(0,240,255,0.8)]"></span>
                  </span>
                </div>
                {/* Beta Pill */}
                <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                  BETA
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-2 leading-[1.1] text-left font-display">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500 drop-shadow-[0_0_25px_rgba(0,240,255,0.5)]">
                  VALID<sup className="text-[0.5em] align-super">™</sup>
                </span>
              </h1>
              
              {/* Tagline */}
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 text-left font-display">
                The Universal Lifestyle Wallet
              </p>
              <p className="text-sm sm:text-base text-cyan-400 font-semibold tracking-widest mb-4 text-left">
                Identity. Payments. Safety. Social.
              </p>
              
              {/* Trust Line */}
              <p className="text-base sm:text-lg font-bold text-white mb-6 text-left">
                We Check. We Don't Collect.
              </p>

              {/* Description */}
              <p className="text-base text-gray-300 mb-8 max-w-lg leading-relaxed text-left">
                {t('hero.adaptiveProfile')} <span className="text-white font-bold">{t('hero.adaptiveAI')}</span> {t('hero.forNewWorld')} 
                <span className="text-cyan-400"> {t('hero.signalFlow')}</span> {t('hero.switchIdentity')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Primary CTA */}
                <button 
                  onClick={handleAccessClick}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black/80 border border-cyan-400/50 text-white font-bold text-base rounded-full hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
                >
                  Claim your VALID<sup className="text-[0.6em]">™</sup>
                  <ArrowDownLeft size={18} />
                </button>
                
                {/* Secondary CTA - Free Access */}
                <button
                  onClick={handleAccessClick}
                  className="inline-flex items-center justify-center px-6 py-4 text-sm font-bold tracking-wider uppercase rounded-full text-emerald-400 border border-emerald-400/50 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all hover:scale-105"
                >
                  Free During Beta
                </button>
              </div>
              
              {/* Live Stats Counter */}
              <LiveStats />

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
              <p className="text-base text-foreground mt-8 max-w-lg leading-relaxed text-left">
                Static profiles are ancient. Now you choose what you share. Points of entry are fluid. You lock down your Vitals for Invisibility, or open your profile for that Connection. Your identity is now adaptable, secure, and entirely under your control.
              </p>
            </div>

            {/* Valid Network Title */}
            <div className="mb-6 mt-10">
              <div className="inline-block px-4 py-1.5 border border-cyan-500/30 rounded-full text-xs font-mono tracking-widest uppercase text-cyan-400 bg-cyan-500/10 mb-4">
                {t('network.title')}
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <h2 className="text-xl md:text-4xl font-black font-orbitron text-foreground text-left">
                  {t('network.headline')} <span className="text-cyan-400">{t('network.zero')}</span> <span className="text-cyan-400">{t('network.limits')}</span>
                </h2>
                <span className="px-3 py-1.5 text-sm font-bold tracking-wider rounded-full border border-rose-400/60 bg-rose-500/10 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse flex items-center gap-2 w-fit">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8),0_0_24px_rgba(244,63,94,0.5)] animate-pulse"></span>
                  {visitCount.toString().padStart(8, '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </span>
              </div>
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
      </div>

      {/* ===== FEATURE CARDS SECTION ===== */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-12">
        <p className="text-xs font-mono tracking-widest text-cyan-400 mb-6 uppercase text-left">{t('hero.powerBehind')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="p-5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm hover:border-cyan-400/50 transition-all">
            <h3 className="text-base font-bold text-cyan-400 mb-2">{t('hero.instantEntry')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('hero.instantEntryDesc')}</p>
          </div>
          <div className="p-5 rounded-xl border border-green-500/30 bg-green-500/5 backdrop-blur-sm hover:border-green-400/50 transition-all">
            <h3 className="text-base font-bold text-green-400 mb-2">{t('hero.secureFunds')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('hero.secureFundsDesc')}</p>
          </div>
          <div className="p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 backdrop-blur-sm hover:border-purple-400/50 transition-all">
            <h3 className="text-base font-bold text-purple-400 mb-2">{t('hero.dataLock')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('hero.dataLockDesc')}</p>
          </div>
        </div>
      </div>

      {/* ===== CONDUIT, NOT WAREHOUSE SECTION ===== */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-16 border-t border-cyan-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 border border-cyan-500/30 rounded-full text-xs font-mono tracking-widest uppercase text-cyan-400 bg-cyan-500/10 mb-6">
            Why VALID<sup className="text-[0.5em]">™</sup> is Different
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Conduit, <span className="text-cyan-400">Not Warehouse</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
            Unlike legacy systems that store your personal data for years, VALID<sup className="text-[0.5em]">™</sup> operates as a secure conduit. 
            We verify your identity in real-time, grant access, then <span className="text-cyan-400 font-bold">purge immediately</span>. 
            Your data is never stored. Never sold. Never at risk.
          </p>
          <p className="text-base text-muted-foreground italic">
            This isn't just privacy by policy — it's <span className="text-foreground font-semibold">privacy by architecture</span>.
          </p>
        </div>
      </div>

      {/* ===== ENTERPRISE TRUST BANNER ===== */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-8 bg-gradient-to-r from-cyan-500/5 via-green-500/5 to-cyan-500/5 border-y border-cyan-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg font-semibold text-foreground mb-4">
            Enterprise Trust: Built for SOC 2 & GDPR compliance to win government & healthcare contracts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 rounded-full">
              <span>🛡️</span>
              <span className="text-cyan-400 text-sm font-bold">SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-full">
              <span>🔒</span>
              <span className="text-green-400 text-sm font-bold">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-full">
              <span>🔒</span>
              <span className="text-amber-400 text-sm font-bold">CCPA Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SECURITY & COMPLIANCE SECTION ===== */}
      <ComplianceBadges variant="hero" />

      {/* ===== SYNTH FAB ===== */}
      <SynthButton variant="fab" />

      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

    </div>
  );
};

export default Hero;
