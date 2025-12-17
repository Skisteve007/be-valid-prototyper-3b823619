// Pipeline Test v2: Fresh deployment - Dec 14, 2024 @ 15:42 UTC
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Globe, Ghost, Shield, Lock, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useReferralTracking } from "@/hooks/useReferralTracking";
import Hero from "@/components/Hero";
import { PricingSection } from "@/components/PricingSection";
import { BetaBanner } from "@/components/BetaBanner";

// Background images for feature cards
import militaryFortressImg from "@/assets/military-fortress-card.jpg";
import acceptedAnywhereImg from "@/assets/accepted-anywhere-card.jpg";
import yourDataRulesImg from "@/assets/your-data-your-rules-card.jpg";
import instantFinancialImg from "@/assets/instant-financial-card.jpg";
import vplBgImg from "@/assets/vpl-bg.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  useReferralTracking();

  // --- THEME ENGINE - Sync with global dark class ---
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });
  const [ripple, setRipple] = useState({ active: false, x: 0, y: 0 });

  // Sync theme state with document class on mount and changes
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : true;
    setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Listen for theme changes from other components (like ResponsiveHeader)
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const hasDark = document.documentElement.classList.contains('dark');
          setIsDark(hasDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out font-sans selection:bg-cyan-500 selection:text-white
      ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      
      {/* RIPPLE TRANSITION EFFECT */}
      {ripple.active && (
        <div 
          className="fixed pointer-events-none z-[99]"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div 
            className={`rounded-full animate-[ripple_0.7s_ease-out_forwards] ${isDark ? 'bg-slate-50' : 'bg-[#050505]'}`}
            style={{
              width: '10px',
              height: '10px',
            }}
          />
        </div>
      )}
      
      {/* EXTENDED EARTH BACKGROUND (dark mode only) */}
      {isDark && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Earth image extending down (keep the globe visible) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/landing-hero-earth.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
              opacity: 0.55,
              filter: 'saturate(1.15) contrast(1.05) brightness(1.05)',
            }}
          />
          {/* Dark-mode veil only (kept light so the Earth remains visible) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.22) 45%, rgba(0,0,0,0.30) 75%, rgba(0,0,0,0.38) 100%)',
            }}
          />
          {/* Subtle atmospheric glow near the horizon */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 88%, hsl(var(--primary) / 0.16) 0%, transparent 62%)',
            }}
          />
        </div>
      )}

      
      {/* BACKGROUND TEXTURE */}
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700
        ${isDark ? 'opacity-[0.03]' : 'opacity-[0.02]'}
        ${isDark ? 'bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)]' : 'bg-[linear-gradient(black_1px,transparent_1px),linear-gradient(90deg,black_1px,transparent_1px)]'}
        bg-[size:50px_50px]`}>
      </div>

      {/* 1. HERO SECTION */}
      <div className="relative z-10">
        <Hero />
      </div>



      {/* PIPELINE, NOT VAULT - Trust Enhancer with Image Background */}
      <section className="relative z-10 overflow-hidden">
        <div 
          className="relative w-full"
          style={{
            backgroundImage: `url(${vplBgImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Top content */}
          <div className="px-4 pt-12 pb-8 text-center bg-gradient-to-b from-black/70 via-black/30 to-transparent">
            
            <h2 className="mb-4 font-orbitron drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              <span className="text-2xl font-normal text-white">THE </span>
              <span className="text-5xl font-bold" style={{ color: '#00F5D4' }}>VALID<sup className="text-[0.4em]">™</sup></span>
              <span className="text-5xl font-bold text-white"> STANDARD</span>
            </h2>
            <p className="max-w-2xl mx-auto leading-relaxed text-lg text-gray-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              {t('standard.subtitle')}
            </p>
          </div>

          {/* Spacer for middle of photo */}
          <div className="min-h-[200px] md:min-h-[300px]"></div>

          {/* Bottom content - Pipeline Not Vault */}
          <div className="px-4 pb-12 pt-16 text-center bg-gradient-to-t from-black/70 via-black/30 to-transparent">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-orbitron tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              PIPELINE, <span className="text-cyan-400">NOT VAULT.</span>
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              We Verify In The Moment, Then Release — We Don't Warehouse Your Personal Data.
            </p>
          </div>
        </div>
        
        {/* The 4 Pillars - Moved under Pipeline section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              isDark={isDark}
              icon={<Shield size={32}/>}
              title={t('standard.militaryFortress')}
              desc={t('standard.militaryFortressDesc')}
              color="cyan"
              backgroundImage={militaryFortressImg}
              colorDampen="green"
            />
            <FeatureCard 
              isDark={isDark}
              icon={<Globe size={32}/>}
              title={t('standard.acceptedAnywhere')}
              desc={t('standard.acceptedAnywhereDesc')}
              color="cyan"
              backgroundImage={acceptedAnywhereImg}
            />
            <FeatureCard 
              isDark={isDark}
              icon={<Lock size={32}/>}
              title={t('standard.yourData')}
              desc={t('standard.yourDataDesc')}
              color="cyan"
              backgroundImage={yourDataRulesImg}
              colorDampen="purple"
            />
            <FeatureCard 
              isDark={isDark}
              icon={<Ghost size={32}/>}
              title={t('standard.instantFinancial')}
              desc={t('standard.instantFinancialDesc')}
              color="cyan"
              backgroundImage={instantFinancialImg}
            />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="pt-10 pb-24 px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 font-orbitron
            ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('cta.ready')} <span className="text-cyan-400">VALID™</span>?
          </h2>
          <p className={`mb-10 text-lg ${isDark ? 'text-gray-200' : 'text-slate-600'}`}>
            {t('cta.accessPlatform')}
          </p>
          <button
            onClick={() => navigate('/access-portal')}
            className={`px-10 py-4 rounded-full font-bold text-lg transition-all duration-200 uppercase tracking-widest hover:scale-[1.02]
              ${isDark 
                ? 'bg-cyan-500 text-black hover:shadow-[0_0_25px_rgba(0,245,212,0.4)]' 
                : 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg'}`}
            style={{ backgroundColor: '#00F5D4' }}
          >
            {t('cta.loginButton')}
          </button>
          
          {/* BETA BANNER - Below Login button, shrunk */}
          <div className="mt-4 max-w-xs mx-auto scale-90">
            <BetaBanner />
          </div>
          
          {/* PRICING CARDS - Directly below Login button */}
          <div className="mt-8 w-full max-w-5xl mx-auto">
            <PricingSection />
          </div>
        </div>
      </section>
    </div>
  );
};

// --- FEATURE CARD COMPONENT (Collapsible) ---
interface FeatureCardProps {
  isDark: boolean;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: 'blue' | 'cyan' | 'purple';
  backgroundImage?: string;
  colorDampen?: 'purple' | 'green';
}

const FeatureCard = ({ isDark, icon, title, desc, color, backgroundImage, colorDampen }: FeatureCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`rounded-lg transition-all duration-500 group relative overflow-hidden cursor-pointer
        ${isDark 
          ? 'bg-[rgba(0,245,212,0.05)] hover:bg-[rgba(0,245,212,0.08)]' 
          : 'bg-white border-slate-200 hover:border-slate-300'}`}
      style={{
        borderLeft: '3px solid #00F5D4',
        paddingLeft: '16px',
      }}
    >
      {/* Background Image - Much higher opacity */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 opacity-70 transition-opacity duration-500"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      
      {/* Color dampening overlay for overly bright images */}
      {colorDampen === 'purple' && (
        <div className="absolute inset-0 bg-black/30" style={{ mixBlendMode: 'saturation' }} />
      )}
      {colorDampen === 'green' && (
        <div className="absolute inset-0 bg-black/25" style={{ mixBlendMode: 'saturation' }} />
      )}
      
      {/* Subtle gradient overlay - only at bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      
      {/* Content overlay */}
      <div className="relative z-10 p-6">
        {/* Header - Always visible */}
        <div className="flex items-center justify-between">
          <h3 className={`text-xl md:text-2xl font-bold font-orbitron ${isDark ? 'text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]' : 'text-slate-900'}`}>
            {title}
          </h3>
          <ChevronDown 
            className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${isDark ? 'text-cyan-400' : 'text-slate-600'}`}
          />
        </div>
        
        {/* Description - Collapsible */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isExpanded ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <p className={`leading-relaxed text-base md:text-lg ${isDark ? 'text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]' : 'text-slate-600'}`}>
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
