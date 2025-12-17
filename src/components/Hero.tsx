// ============================================================================
// HERO COMPONENT - MATCHING REFERENCE IMAGE5
// ============================================================================

import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, Activity, Zap, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import ResponsiveHeader from './ResponsiveHeader';

import SynthButton from './SynthButton';
import { usePageViewTracking } from '@/hooks/usePageViewTracking';

type SignalMode = 'social' | 'pulse' | 'thrill' | 'afterdark';

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeSignal, setActiveSignal] = useState<SignalMode>('social');
  
  usePageViewTracking('/');

  const signalModes = {
    social: { icon: Users, label: 'SOCIAL', color: 'cyan', description: 'Open to connect. Share contacts and socials with one scan.' },
    pulse: { icon: Activity, label: 'PULSE', color: 'green', description: 'Broadcasting your energy. Let others find your vibe.' },
    thrill: { icon: Zap, label: 'THRILL', color: 'orange', description: 'Adventure mode activated. Ready for spontaneous connections.' },
    afterdark: { icon: Moon, label: 'AFTER DARK', color: 'purple', description: 'Ghost Protocol engaged. Selective visibility only.' },
  };

  const handleAccessClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email_confirmed_at) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const colorClasses: Record<string, { active: string; inactive: string }> = {
    cyan: {
      active: 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]',
      inactive: 'border-cyan-400/40 text-cyan-400/70 hover:bg-cyan-500/10 hover:text-cyan-400'
    },
    green: {
      active: 'bg-green-500/20 border-green-400 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]',
      inactive: 'border-green-400/40 text-green-400/70 hover:bg-green-500/10 hover:text-green-400'
    },
    orange: {
      active: 'bg-orange-500/20 border-orange-400 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]',
      inactive: 'border-orange-400/40 text-orange-400/70 hover:bg-orange-500/10 hover:text-orange-400'
    },
    purple: {
      active: 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]',
      inactive: 'border-purple-400/40 text-purple-400/70 hover:bg-purple-500/10 hover:text-purple-400'
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* ===== HEADER ===== */}
      <ResponsiveHeader />

      {/* ===== HERO SECTION ===== */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
        {/* Background Layers */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/landing-hero-earth.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            opacity: 0.65,
          }}
        />
        {/* Reduced dark overlay */}
        <div className="absolute inset-0 z-0 bg-black/45" />
        {/* Horizon-lift gradient: dark space at top, subtle haze revealing Earth below */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, rgba(30,40,60,0.2) 70%, rgba(40,50,70,0.15) 100%)',
          }}
        />
        {/* Cyan glow accent */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(circle at 50% 30%, rgba(34,211,238,0.15), transparent 60%)',
          }}
        />

        {/* Content - Desktop two-column, mobile stacked */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Two-column grid for desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* LEFT COLUMN: Headlines + CTA */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              
              {/* Powered By Line */}
              <p className="text-xs font-mono tracking-[0.3em] text-cyan-400/80 uppercase mb-6">
                POWERED BY SYNTHESIZED AI
              </p>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-display tracking-tight mb-2">
                <span 
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #a0a0a0 0%, #e0e0e0 25%, #808080 50%, #d0d0d0 75%, #909090 100%)',
                  }}
                >
                  ONE KEY.
                </span>
              </h1>
              
              {/* Colored Tagline - Stacked with teal/gray metallic effect */}
              <div className="mb-6 relative inline-block lg:block">
                <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <span 
                    className="text-transparent bg-clip-text block"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #2dd4bf 0%, #99f6e4 30%, #5eead4 50%, #14b8a6 70%, #0d9488 100%)',
                    }}
                  >
                    Verify.
                  </span>
                  <span 
                    className="text-transparent bg-clip-text block"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #6b7280 0%, #d1d5db 30%, #9ca3af 50%, #e5e7eb 70%, #6b7280 100%)',
                    }}
                  >
                    Pay.
                  </span>
                  <span 
                    className="text-transparent bg-clip-text block"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #14b8a6 0%, #5eead4 30%, #2dd4bf 50%, #99f6e4 70%, #0d9488 100%)',
                    }}
                  >
                    Vibe.
                  </span>
                </p>
                {/* Sun Icon - positioned differently on desktop */}
                <div className="hidden lg:block absolute -right-16 top-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 rounded-full border border-amber-400/60 flex items-center justify-center text-amber-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4"/>
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Your <span className="text-white font-semibold">Adaptive AI Profile</span> For The New Real World. <span className="text-cyan-400 underline">Signal Your Flow</span>. Instantly Switch Your Identity To Control Your Social Presence, Payments, And Total Invisibility.
              </p>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
                {/* Primary CTA */}
                <button 
                  onClick={handleAccessClick}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black/60 border border-cyan-400/40 text-white font-bold text-sm rounded-full hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
                >
                  CLAIM YOUR ID
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                
                {/* Beta Version Pill */}
                <span className="px-5 py-3 text-sm font-bold tracking-widest uppercase rounded-full border border-emerald-400/50 bg-emerald-500/10 text-emerald-400">
                  BETA VERSION
                </span>
              </div>

              {/* Signal Selection */}
              <div className="text-center lg:text-left">
                <p className="text-xs font-mono tracking-[0.2em] text-muted-foreground uppercase mb-3">
                  SELECT YOUR SIGNAL
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                  {(Object.keys(signalModes) as SignalMode[]).map((mode) => {
                    const { icon: Icon, label, color } = signalModes[mode];
                    const isActive = activeSignal === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => setActiveSignal(mode)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 text-sm font-bold tracking-wide ${
                          isActive ? colorClasses[color].active : colorClasses[color].inactive
                        }`}
                      >
                        <Icon size={14} />
                        {label}
                      </button>
                    );
                  })}
                </div>
                {/* Chip Description - Dynamic based on active signal */}
                <p className={`text-sm transition-colors duration-300 ${
                  activeSignal === 'social' ? 'text-cyan-400' :
                  activeSignal === 'pulse' ? 'text-green-400' :
                  activeSignal === 'thrill' ? 'text-orange-400' :
                  'text-purple-400'
                }`}>
                  {signalModes[activeSignal].description}
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Video/Image */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              {/* Hero Image Container with Glow Frame */}
              <div className="relative w-full max-w-sm lg:max-w-md">
                {/* Outer Glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-cyan-500/30 rounded-2xl blur-xl"></div>
                
                {/* Frame Container */}
                <div className="relative rounded-xl overflow-hidden border border-cyan-400/30 bg-black/50 shadow-[0_0_40px_rgba(0,240,255,0.2)]">
                  <video 
                    src="/valid_portal.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full aspect-[4/5] object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Below the fold content - full width */}
          <div className="mt-16 lg:mt-24 max-w-3xl mx-auto lg:mx-0">
            {/* Static Profiles Description */}
            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed text-center lg:text-left mb-12">
              Static profiles are ancient. Now you choose what you share. Points of entry are fluid. You lock down your Vitals for invisibility, or open your profile for that Connection. Your identity is now adaptable, secure, and entirely under your control.
            </p>

            {/* THE VALID™ NETWORK Section */}
            <div className="text-center lg:text-left">
              <div className="inline-block px-3 py-1 border border-cyan-500/40 rounded-full text-xs font-mono tracking-widest uppercase text-cyan-400 bg-cyan-500/10 mb-4">
                THE VALID™ NETWORK
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                <span className="text-white">ONE IDENTITY.</span>{' '}
                <span className="text-cyan-400">ZERO LIMITS.</span>
              </h2>
              {/* Counter Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-cyan-500/40 rounded-full bg-cyan-500/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-sm font-mono text-cyan-400">528</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ===== THE POWER BEHIND THE SIGNAL ===== */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
        <p className="text-xs font-mono tracking-widest text-cyan-400 mb-6 uppercase text-left">{t('hero.powerBehind')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {/* Card 1 - Scan */}
          <div className="group relative p-6 lg:p-8 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/30 via-cyan-500/10 to-blue-600/20 backdrop-blur-md" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Glowing border */}
            <div className="absolute inset-0 rounded-2xl border border-cyan-400/50 group-hover:border-cyan-400 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-500" />
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-400/30 to-transparent rounded-bl-full" />
            {/* Content */}
            <div className="relative z-10">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-cyan-500/30 text-cyan-300 rounded-full mb-3 border border-cyan-400/40">SOC 2</span>
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">Scan. You're in.</h3>
              <p className="text-sm lg:text-base text-cyan-100/80 leading-relaxed">Instant entry at VALID™ venues—zero friction, total security.</p>
            </div>
          </div>
          
          {/* Card 2 - Pay */}
          <div className="group relative p-6 lg:p-8 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 via-green-500/10 to-teal-600/20 backdrop-blur-md" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Glowing border */}
            <div className="absolute inset-0 rounded-2xl border border-emerald-400/50 group-hover:border-emerald-400 group-hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] transition-all duration-500" />
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-400/30 to-transparent rounded-bl-full" />
            {/* Content */}
            <div className="relative z-10">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-emerald-500/30 text-emerald-300 rounded-full mb-3 border border-emerald-400/40">GDPR</span>
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">Pay in a tap.</h3>
              <p className="text-sm lg:text-base text-emerald-100/80 leading-relaxed">Lightning-fast checkout when every second counts.</p>
            </div>
          </div>
          
          {/* Card 3 - Share */}
          <div className="group relative p-6 lg:p-8 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-violet-500/10 to-fuchsia-600/20 backdrop-blur-md" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Glowing border */}
            <div className="absolute inset-0 rounded-2xl border border-purple-400/50 group-hover:border-purple-400 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-500" />
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-400/30 to-transparent rounded-bl-full" />
            {/* Content */}
            <div className="relative z-10">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-purple-500/30 text-purple-300 rounded-full mb-3 border border-purple-400/40">CCPA</span>
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">Share on your terms.</h3>
              <p className="text-sm lg:text-base text-purple-100/80 leading-relaxed">Reveal only what's needed, when you choose.</p>
            </div>
          </div>
        </div>
      </div>


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
