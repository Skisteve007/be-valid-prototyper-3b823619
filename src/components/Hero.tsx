// ============================================================================
// HERO COMPONENT - MATCHING REFERENCE IMAGE5
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [counter, setCounter] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const signalOrder: SignalMode[] = ['social', 'pulse', 'thrill', 'afterdark'];
  
  usePageViewTracking('/');

  // Fetch real visitor count and animate to it
  useEffect(() => {
    const fetchAndAnimateCounter = async () => {
      try {
        // Fetch current visitor count from global_stats
        const { data, error } = await supabase
          .from('global_stats')
          .select('stat_value')
          .eq('stat_key', 'total_visitors')
          .single();
        
        const target = error || !data ? 1144 : (data.stat_value || 1144);
        
        // Animate counter to target
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCounter(target);
            clearInterval(timer);
          } else {
            setCounter(Math.floor(current));
          }
        }, duration / steps);
        
        return () => clearInterval(timer);
      } catch (err) {
        console.error('Error fetching visitor count:', err);
        setCounter(1144);
      }
    };

    fetchAndAnimateCounter();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('visitor-counter')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'global_stats', filter: 'stat_key=eq.total_visitors' },
        (payload) => {
          if (payload.new && typeof payload.new.stat_value === 'number') {
            setCounter(payload.new.stat_value);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-rotate signals every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const rotationInterval = setInterval(() => {
      setActiveSignal((current) => {
        const currentIndex = signalOrder.indexOf(current);
        const nextIndex = (currentIndex + 1) % signalOrder.length;
        return signalOrder[nextIndex];
      });
    }, 4000);
    
    return () => clearInterval(rotationInterval);
  }, [isPaused]);

  // Handle manual signal selection with pause
  const handleSignalClick = useCallback((mode: SignalMode) => {
    setActiveSignal(mode);
    setIsPaused(true);
    
    // Clear any existing pause timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    // Resume auto-rotation after 12 seconds
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 12000);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  const signalModes = {
    social: { icon: Users, label: 'SOCIAL', micro: 'Connect & Collaborate', color: 'cyan', description: 'Friends, Founders, And Familiar Faces. Say Hi, Swap Contacts, Talk Collabs—Then Slide Back Into The Night.' },
    pulse: { icon: Activity, label: 'PULSE', micro: 'On The Move', color: 'green', description: 'Fast Hellos, Quick Plans, Instant Pivots. Perfect When You\'re Bouncing Rooms And Moving With Momentum.' },
    thrill: { icon: Zap, label: 'THRILL', micro: 'Adventure Mode', color: 'orange', description: 'High-Energy, High-Curiosity. Meet Bold People, Follow The Vibe, And Let The Night Get Interesting.' },
    afterdark: { icon: Moon, label: 'AFTER DARK', micro: 'Private Mode', color: 'purple', description: 'Selective, Boundaries-On. You Choose What\'s Shown, To Who, And For How Long—Always On Your Terms.' },
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
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      
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
            opacity: 0.85,
          }}
        />
        {/* Reduced dark overlay - much lighter */}
        <div className="absolute inset-0 z-0 bg-slate-900/20" />
        {/* Horizon-lift gradient: very light */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(15,23,42,0.4) 0%, rgba(15,23,42,0.1) 40%, transparent 70%, transparent 100%)',
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
              <p className="text-xs font-mono tracking-[0.3em] text-cyan-400/80 uppercase mb-2">
                POWERED BY SYNTHESIZED AI
              </p>
              
              {/* Universal Lifestyle Key - Script Style */}
              <p 
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl italic font-light mb-6 text-white/90"
                style={{
                  fontStyle: 'italic',
                  textShadow: '0 0 20px rgba(255,255,255,0.2)',
                }}
              >
                Universal Lifestyle Key
              </p>
              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-display tracking-tight mb-4">
                <span 
                  className="inline-block text-transparent bg-clip-text drop-shadow-[0_4px_12px_rgba(168,85,247,0.2)]"
                  style={{
                    backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 30%, #e0e0e0 50%, #c4b5fd 80%, #a78bfa 100%)',
                    textShadow: '0 0 30px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  ONE KEY.
                </span>{' '}
                <span 
                  className="inline-block text-transparent bg-clip-text drop-shadow-[0_2px_4px_rgba(103,232,249,0.3)]"
                  style={{
                    backgroundImage: 'linear-gradient(180deg, #e0e7ff 0%, #a5f3fc 25%, #67e8f9 50%, #22d3ee 75%, #c4b5fd 100%)',
                    textShadow: '0 0 15px rgba(103,232,249,0.3), 0 0 25px rgba(168,85,247,0.15)',
                  }}
                >
                  VERIFY. PAY. VIBE.
                </span>
              </h1>
              
              {/* Subhead */}
              <p className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-snug mb-4 max-w-2xl mx-auto lg:mx-0">
                <span className="text-white">Verified. Protected.</span>
                <span className="text-cyan-400"> Connected.</span>
              </p>

              {/* Support Line */}
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Join the network where your privacy is protected and your identity is always under your control.
              </p>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
                {/* Primary CTA */}
                <button 
                  onClick={handleAccessClick}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold text-sm rounded-full border border-white/80 hover:bg-gray-100 transition-all animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.5),0_0_40px_rgba(0,240,255,0.3)]"
                >
                  CLAIM YOUR ID
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                {/* Secondary CTA */}
                <a 
                  href="#chameleon"
                  className="inline-flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-full border border-cyan-400/60 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
                >
                  TRY THE SIGNALS
                </a>
              </div>

              {/* Signal Selection */}
              <div id="signals" className="text-center lg:text-left mt-6 p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm">
                <p className="text-base font-mono tracking-[0.25em] text-cyan-400 uppercase mb-2 font-bold">
                  ✦ SELECT YOUR SIGNAL ✦
                </p>
                <p className="text-base text-white/80 mb-4">
                  Pick A Signal. Your Whole Presence Updates Instantly.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                  {(Object.keys(signalModes) as SignalMode[]).map((mode) => {
                    const { icon: Icon, label, color } = signalModes[mode];
                    const isActive = activeSignal === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => handleSignalClick(mode)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 text-base font-bold tracking-wide ${
                          isActive ? colorClasses[color].active : colorClasses[color].inactive
                        }`}
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    );
                  })}
                </div>
                {/* Chip Description - Dynamic based on active signal - fixed height to prevent jumping */}
                <div className="min-h-[3.5rem] flex items-center justify-center lg:justify-start">
                  <p className={`text-lg lg:text-xl font-medium transition-colors duration-300 ${
                    activeSignal === 'social' ? 'text-cyan-400' :
                    activeSignal === 'pulse' ? 'text-green-400' :
                    activeSignal === 'thrill' ? 'text-orange-400' :
                    'text-purple-400'
                  }`}>
                    {signalModes[activeSignal].description}
                  </p>
                </div>
                {/* Proof Line */}
                <p className="text-sm text-white/50 mt-2 italic">
                  This Is The Chameleon Layer — No Other Network Does This.
                </p>
              </div>

              {/* ===== THE SOCIAL CHAMELEON SECTION ===== */}
              <div id="chameleon" className="mt-6 p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm">
                <p className="text-base font-mono tracking-[0.25em] text-cyan-400 uppercase mb-2 font-bold">
                  ✦ THE SOCIAL CHAMELEON ✦
                </p>
                <p className="text-base text-white/80 mb-2">
                  Instantly Switch Your Signal To Match The Moment — Social, Pulse, Thrill, Or After Dark.
                </p>
                <p className="text-sm text-white/50 italic">
                  Other Networks Lock You Into One Profile. <span className="text-cyan-400 font-semibold">VALID™</span> Lets You Adapt In Real Time.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Video/Image */}
            <div className="order-1 lg:order-2 flex flex-col items-center lg:items-end">
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
              
              {/* Counter Pill - Below Video */}
              <div className="mt-4 inline-flex items-center gap-3 px-5 py-2.5 border border-red-600/70 rounded-full bg-red-900/40 shadow-[0_0_25px_rgba(220,38,38,0.5),0_0_50px_rgba(220,38,38,0.3)]">
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.9),0_0_30px_rgba(239,68,68,0.6)]"></span>
                <span className="text-sm font-mono text-red-300 drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]">
                  {String(counter).padStart(9, '0').replace(/(\d{3})(\d{3})(\d{3})/, '$1,$2,$3')}
                </span>
              </div>
            </div>
          </div>

          {/* Below the fold content - full width */}
          <div className="mt-8 lg:mt-12 max-w-3xl mx-auto lg:mx-0">
            {/* Static Profiles Description */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed text-center lg:text-left mb-12 font-medium italic">
              Static Profiles Are <span className="text-white font-bold">Ancient</span>. Now You Choose What You Share. Points Of Entry Are <span className="text-cyan-400">Fluid</span>. You Lock Down Your Vitals For <span className="text-purple-400">Invisibility</span>, Or Open Your Profile For That <span className="text-emerald-400">Connection</span>. Your Identity Is Now Adaptable, Secure, And Entirely Under <span className="text-white font-bold">Your Control</span>.
            </p>

            {/* THE VALID™ NETWORK Section */}
            <div className="text-center lg:text-left">
              <div className="inline-block px-3 py-1 border border-cyan-500/40 rounded-full text-xs font-mono tracking-widest uppercase text-cyan-400 bg-cyan-500/10 mb-4">
                THE VALID™ NETWORK
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 tracking-tight">
                <span 
                  className="inline-block text-transparent bg-clip-text drop-shadow-[0_4px_8px_rgba(255,255,255,0.3)]"
                  style={{
                    backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 30%, #e0e0e0 60%, #d0d0d0 100%)',
                    textShadow: '0 2px 4px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.3)',
                  }}
                >
                  ONE IDENTITY.
                </span>{' '}
                <span 
                  className="inline-block text-transparent bg-clip-text drop-shadow-[0_2px_4px_rgba(34,211,238,0.4)]"
                  style={{
                    backgroundImage: 'linear-gradient(180deg, #a5f3fc 0%, #67e8f9 30%, #22d3ee 60%, #67e8f9 100%)',
                    textShadow: '0 0 20px rgba(34,211,238,0.5), 0 0 40px rgba(34,211,238,0.3)',
                  }}
                >
                  ZERO LIMITS.
                </span>
              </h2>
            </div>
          </div>

        </div>
      </div>

      {/* ===== THE POWER BEHIND THE SIGNAL ===== */}
      <div className="relative w-full py-12">
        {/* Extended Earth Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/landing-hero-earth.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 60%',
            opacity: 0.7,
          }}
        />
        <div className="absolute inset-0 z-0 bg-slate-900/25" />
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0.2) 30%, rgba(15,23,42,0.3) 100%)',
          }}
        />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
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
