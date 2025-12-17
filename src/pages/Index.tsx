// Pipeline Test v2: Fresh deployment - Dec 14, 2024 @ 15:42 UTC
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Globe, Ghost, Shield, Lock } from 'lucide-react';
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
      ${isDark ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
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
      
      {/* EXTENDED EARTH BACKGROUND - Continues from Hero */}
      {isDark && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Earth image extending down */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/landing-hero-earth.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
              opacity: 0.45,
            }}
          />
          {/* Gradient fade - stronger at bottom to blend to dark */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(5,5,5,0.85) 80%, rgba(5,5,5,1) 100%)',
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

      {/* BETA BANNER - Below Hero */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        <BetaBanner />
      </div>


      {/* 3. THE TRUST BRIDGE (Explaining the Value) */}
      <section className={`pt-20 pb-10 px-4 relative z-10 border-b transition-colors duration-500
        ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 font-orbitron tracking-wide
              ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('standard.title')} <span className="text-cyan-400">{t('standard.titleHighlight')}</span>
            </h2>
            <p className={`max-w-2xl mx-auto leading-relaxed mb-6
              ${isDark ? 'text-gray-200' : 'text-slate-600'}`}>
              {t('standard.subtitle')}
            </p>
            
            {/* Compliance Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${isDark ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-cyan-100 text-cyan-700'}`}>
                SOC 2
              </span>
              <span className={`${isDark ? 'text-gray-500' : 'text-slate-400'}`}>•</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${isDark ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-green-100 text-green-700'}`}>
                GDPR
              </span>
              <span className={`${isDark ? 'text-gray-500' : 'text-slate-400'}`}>•</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${isDark ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-amber-100 text-amber-700'}`}>
                CCPA
              </span>
            </div>
          </div>

          {/* The 4 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              isDark={isDark}
              icon={<Shield size={32}/>}
              title={t('standard.militaryFortress')}
              desc={t('standard.militaryFortressDesc')}
              color="cyan"
              backgroundImage={militaryFortressImg}
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

      {/* CONDUIT, NOT WAREHOUSE - Trust Enhancer */}
      <section className={`py-16 px-4 relative z-10 border-b transition-colors duration-500
        ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 font-orbitron
            ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Conduit, <span className="text-cyan-400">not warehouse.</span>
          </h2>
          <p className={`text-lg leading-relaxed
            ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
            We verify what matters, then drop it. We don't stockpile your personal data.
          </p>
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
            className={`px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 uppercase tracking-widest
              ${isDark 
                ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)]' 
                : 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg'}`}
          >
            {t('cta.loginButton')}
          </button>
          
          {/* PRICING CARDS - Directly below Login button */}
          <div className="mt-12 w-full max-w-5xl mx-auto">
            <PricingSection />
          </div>
        </div>
      </section>
    </div>
  );
};

// --- FEATURE CARD COMPONENT ---
interface FeatureCardProps {
  isDark: boolean;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: 'blue' | 'cyan' | 'purple';
  backgroundImage?: string;
}

const FeatureCard = ({ isDark, icon, title, desc, color, backgroundImage }: FeatureCardProps) => (
  <div className={`p-8 rounded-2xl border-2 transition-all duration-500 group relative overflow-hidden
    ${isDark 
      ? 'bg-black border-cyan-500/60' 
      : 'bg-white border-slate-200'}`}>
    
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
    
    {/* Subtle gradient overlay - only at bottom for text readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
    
    {/* Content overlay */}
    <div className="relative z-10">
      <h3 className={`text-2xl md:text-3xl font-bold mb-4 font-orbitron ${isDark ? 'text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]' : 'text-slate-900'}`}>
        {title}
      </h3>
      <p className={`leading-relaxed text-base md:text-lg ${isDark ? 'text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]' : 'text-slate-600'}`}>
        {desc}
      </p>
    </div>
  </div>
);

export default Index;
