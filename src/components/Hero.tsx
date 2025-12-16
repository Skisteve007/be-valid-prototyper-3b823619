// ============================================================================
// HERO COMPONENT - MATCHING REFERENCE IMAGE5
// ============================================================================

import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, Activity, Zap, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import ResponsiveHeader from './ResponsiveHeader';
import ComplianceBadges from './ComplianceBadges';
import SynthButton from './SynthButton';
import { usePageViewTracking } from '@/hooks/usePageViewTracking';

type SignalMode = 'social' | 'pulse' | 'thrill' | 'afterdark';

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeSignal, setActiveSignal] = useState<SignalMode>('social');
  
  usePageViewTracking('/');

  const signalModes = {
    social: { icon: Users, label: 'SOCIAL', color: 'cyan' },
    pulse: { icon: Activity, label: 'PULSE', color: 'green' },
    thrill: { icon: Zap, label: 'THRILL', color: 'orange' },
    afterdark: { icon: Moon, label: 'AFTER DARK', color: 'purple' },
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
            backgroundPosition: 'center',
            opacity: 0.4,
          }}
        />
        <div className="absolute inset-0 z-0 bg-black/60" />
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(circle at 50% 30%, rgba(34,211,238,0.15), transparent 60%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
          
          {/* Hero Image Container with Glow Frame */}
          <div className="relative mb-8 w-full max-w-md">
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

          {/* Powered By Line */}
          <p className="text-xs font-mono tracking-[0.3em] text-cyan-400/80 uppercase mb-8">
            POWERED BY SYNTHESIZED AI
          </p>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight mb-4">
            <span className="text-white">ONE KEY.</span>
          </h1>
          
          {/* Colored Tagline */}
          <p className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400">
              Verify. Pay. Vibe.
            </span>
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            {/* Primary CTA */}
            <button 
              onClick={handleAccessClick}
              className="inline-flex items-center gap-3 px-8 py-4 bg-black border-2 border-cyan-400/60 text-white font-bold text-lg rounded-full hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all hover:scale-105"
            >
              CLAIM YOUR VALID
              <ArrowRight size={20} />
            </button>
            
            {/* Beta Version Pill */}
            <span className="px-6 py-3 text-sm font-bold tracking-widest uppercase rounded-full border border-emerald-400/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              BETA VERSION
            </span>
          </div>

          {/* Signal Selection */}
          <div className="w-full max-w-xl">
            <p className="text-xs font-mono tracking-[0.25em] text-cyan-400/70 uppercase mb-4">
              SELECT YOUR SIGNAL
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {(Object.keys(signalModes) as SignalMode[]).map((mode) => {
                const { icon: Icon, label, color } = signalModes[mode];
                const isActive = activeSignal === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setActiveSignal(mode)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 text-sm font-bold tracking-wider ${
                      isActive ? colorClasses[color].active : colorClasses[color].inactive
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                );
              })}
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
