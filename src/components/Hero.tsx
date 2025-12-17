// ============================================================================
// HERO COMPONENT - MATCHING REFERENCE IMAGE5
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Users, Activity, Zap, Moon, Ghost } from 'lucide-react';
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
              
              {/* Universal Lifestyle Key - Large with gradient */}
              <h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-wide mb-3 text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #a5f3fc 30%, #22d3ee 50%, #c084fc 80%, #ffffff 100%)',
                  textShadow: '0 0 30px rgba(34,211,238,0.4), 0 0 60px rgba(192,132,252,0.3)',
                }}
              >
                Universal Lifestyle Key
              </h2>
              
              {/* VERIFY. PAY. VIBE. - Much smaller */}
              <p className="text-sm sm:text-base lg:text-lg font-semibold font-display tracking-widest mb-2 text-white">
                VERIFY. PAY. VIBE.
              </p>
              
              {/* Powered By Line */}
              <p className="text-xs font-mono tracking-[0.3em] text-cyan-400/80 uppercase mb-6">
                POWERED BY SYNTHESIZED AI
              </p>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-4">
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
                  BETA VERSION
                </a>
              </div>

              {/* Fluidity. Security. Frictionless. Connectivity. */}
              <p className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-snug mb-6 max-w-2xl mx-auto lg:mx-0">
                <span className="text-white">Fluidity. Security. Frictionless.</span>
                <span className="text-cyan-400"> Connectivity.</span>
              </p>

              {/* Ghost Protocols */}
              <div className="flex items-center gap-2 justify-center lg:justify-start mb-3 animate-pulse">
                <Ghost className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                <span className="text-sm sm:text-base font-mono tracking-widest text-yellow-400 uppercase drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">
                  Ghost™ Protocols
                </span>
              </div>
              
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 text-center lg:text-left">
                QR Code Encrypted. Ghost Tokens... Secure Your Payment Info, Your Health Records And Your Identification. We Make Your Life More Fluid, With You In Complete Control Of What You're Going To Choose To Share. Your Privacy And Control.
              </p>

              {/* Signal Share Label */}
              <p className="text-lg sm:text-xl font-mono tracking-widest text-cyan-400 uppercase mb-2 text-center lg:text-left">
                Signal Share
              </p>

              {/* Static Profiles Description */}
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed text-center lg:text-left mb-6 font-medium italic max-w-xl mx-auto lg:mx-0">
                Static Profiles Are <span className="text-white font-bold">Ancient</span>. Now You Choose What You Share. Points Of Entry Are <span className="text-cyan-400">Fluid</span>. You Lock Down Your Vitals For <span className="text-purple-400">Invisibility</span>, Or Open Your Profile For That <span className="text-emerald-400">Connection</span>. Your Identity Is Now Adaptable, Secure, And Entirely Under <span className="text-white font-bold">Your Control</span>.
              </p>

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
            {/* Signal Selection - Moved below Static Profiles */}
            <div id="signals" className="text-center lg:text-left p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm mb-12">
              <p className="text-base font-mono tracking-[0.25em] text-cyan-400 uppercase mb-2 font-bold">
                
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

            {/* ONE IDENTITY. ZERO LIMITS. Section */}
            <div className="text-center lg:text-left">
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


      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

    </div>
  );
};

export default Hero;
