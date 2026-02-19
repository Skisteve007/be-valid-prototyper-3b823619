// Pipeline Test v2: Fresh deployment - Dec 14, 2024 @ 15:42 UTC
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon, Globe, Ghost, Shield, Lock, ChevronDown, Brain, FileText, UserCheck, ArrowRight, ClipboardList, ShieldAlert, Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useReferralTracking } from "@/hooks/useReferralTracking";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Hero from "@/components/Hero";
import AIGovernanceIntakeForm from "@/components/intake/AIGovernanceIntakeForm";
import RiskStabilizationModal from "@/components/intake/RiskStabilizationModal";
import { GhostPassEventIntakeForm } from "@/components/intake/GhostPassEventIntakeForm";

// Lazy load non-critical below-fold components
const JoinFreePills = lazy(() => import("@/components/JoinFreePills").then(m => ({ default: m.JoinFreePills })));

// Import background images (Vite will handle optimization)
import militaryFortressImg from "@/assets/military-fortress-card.jpg";
import acceptedAnywhereImg from "@/assets/accepted-anywhere-card.jpg";
import yourDataRulesImg from "@/assets/your-data-your-rules-card.jpg";
import instantFinancialImg from "@/assets/instant-financial-card.jpg";
import vplBgImg from "@/assets/vpl-bg.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  useReferralTracking();
  const [isIntakeFormOpen, setIsIntakeFormOpen] = useState(false);
  const [isRiskEngagementOpen, setIsRiskEngagementOpen] = useState(false);
  const [isGhostPassIntakeOpen, setIsGhostPassIntakeOpen] = useState(false);

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
    <div className={`min-h-screen overflow-x-hidden transition-all duration-700 ease-in-out font-sans selection:bg-cyan-500 selection:text-white
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

      {/* HUB-AND-SPOKE NAVIGATION */}
      <section className="relative z-10 py-16 px-4">
        {/* Platform Identity */}
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold font-orbitron mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span className="text-cyan-500">BeValid.app</span> Platform
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
            One platform, two powerful pillars: <strong>Governance</strong> for AI decision control, <strong>Physical Access</strong> for real-world verification.
          </p>
        </div>

        {/* Hub Navigation Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Governance Pillar - Senate */}
          <Card className={`border-cyan-500/40 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'} hover:border-cyan-400 transition-all duration-300 cursor-pointer group`} onClick={() => navigate('/demos')}>
            <CardContent className="pt-8 pb-8 px-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-cyan-100'}`}>
                  <Brain className="h-8 w-8 text-cyan-500" />
                </div>
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>Governance Layer</p>
                  <h3 className={`text-2xl font-bold font-orbitron ${isDark ? 'text-white' : 'text-slate-900'}`}>The Senate</h3>
                </div>
              </div>
              <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                Multi-model AI consensus engine. Policy enforcement, contradiction detection, and court-ready audit trails for every AI-assisted decision.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700'}`}>Operator Certification</span>
                <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700'}`}>Audit Logs</span>
                <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700'}`}>Policy Rules</span>
              </div>
              <div className={`flex items-center gap-2 font-semibold ${isDark ? 'text-cyan-400' : 'text-cyan-600'} group-hover:gap-3 transition-all`}>
                Explore Governance Demos <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          {/* Physical Access Pillar - Ghost Pass */}
          <Card className={`border-purple-500/40 ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'} hover:border-purple-400 transition-all duration-300 cursor-pointer group`} onClick={() => navigate('/demos/ghost')}>
            <CardContent className="pt-8 pb-8 px-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-purple-100'}`}>
                  <Ghost className="h-8 w-8 text-purple-500" />
                </div>
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Physical Access</p>
                  <h3 className={`text-2xl font-bold font-orbitron ${isDark ? 'text-white' : 'text-slate-900'}`}>Ghost Pass</h3>
                </div>
              </div>
              <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                Privacy-preserving identity verification for real-world venues. QR-based entry, age verification, and wallet flows—all triggered at physical points.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>Event Entry</span>
                <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>Age Verification</span>
                <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>Venue Access</span>
              </div>
              <div className={`flex items-center gap-2 font-semibold ${isDark ? 'text-purple-400' : 'text-purple-600'} group-hover:gap-3 transition-all`}>
                Explore Physical Access <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Pills - Moved under hub navigation */}
        <div className="max-w-5xl mx-auto">
          <p className={`text-center text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Quick Actions</p>
          <div className="flex flex-wrap justify-center gap-3">
            {/* Ghost Pass Event Intake Pill */}
            <button
              onClick={() => setIsGhostPassIntakeOpen(true)}
              className={`
                flex items-center gap-3 px-5 py-3 rounded-full
                border transition-all duration-300 cursor-pointer whitespace-nowrap
                ${isDark 
                  ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/15 to-cyan-500/20 border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]' 
                  : 'bg-gradient-to-r from-cyan-100 via-purple-50 to-cyan-100 border-cyan-300 hover:border-cyan-400 hover:shadow-lg'
                }
              `}
            >
              <Ticket className={`h-5 w-5 flex-shrink-0 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <span className={`text-sm font-semibold ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                Ghost Pass Event Intake
              </span>
            </button>

            {/* Risk Stabilization Pill */}
            <button
              onClick={() => setIsRiskEngagementOpen(true)}
              className={`
                flex items-center gap-3 px-5 py-3 rounded-full
                border transition-all duration-300 cursor-pointer whitespace-nowrap
                ${isDark 
                  ? 'bg-gradient-to-r from-red-500/20 via-orange-500/15 to-red-500/20 border-red-500/50 hover:border-red-400 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]' 
                  : 'bg-gradient-to-r from-red-100 via-orange-50 to-red-100 border-red-300 hover:border-red-400 hover:shadow-lg'
                }
              `}
            >
              <ShieldAlert className={`h-5 w-5 flex-shrink-0 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              <span className={`text-sm font-semibold ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                30-Day Risk Stabilization
              </span>
            </button>

            {/* AI Evaluation Intake Pill */}
            <button
              onClick={() => setIsIntakeFormOpen(true)}
              className={`
                flex items-center gap-3 px-5 py-3 rounded-full
                border transition-all duration-300 cursor-pointer whitespace-nowrap
                ${isDark 
                  ? 'bg-gradient-to-r from-purple-500/20 via-cyan-500/15 to-purple-500/20 border-purple-500/50 hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]' 
                  : 'bg-gradient-to-r from-purple-100 via-cyan-50 to-purple-100 border-purple-300 hover:border-purple-400 hover:shadow-lg'
                }
              `}
            >
              <ClipboardList className={`h-5 w-5 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-sm font-semibold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                AI Systems Evaluation & Governance
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Risk Stabilization Modal */}
      <RiskStabilizationModal 
        isOpen={isRiskEngagementOpen} 
        onClose={() => setIsRiskEngagementOpen(false)} 
      />

      {/* AI Governance Intake Form Modal */}
      <AIGovernanceIntakeForm 
        isOpen={isIntakeFormOpen} 
        onClose={() => setIsIntakeFormOpen(false)} 
      />

      {/* Ghost Pass Event Intake Form Modal */}
      <GhostPassEventIntakeForm 
        isOpen={isGhostPassIntakeOpen} 
        onClose={() => setIsGhostPassIntakeOpen(false)} 
      />
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
              <span className="text-5xl font-bold" style={{ color: '#00E5E5' }}>VALID<sup className="text-[0.4em]">™</sup></span>
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
                ? 'text-black hover:shadow-[0_0_25px_rgba(0,229,229,0.4)]' 
                : 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg'}`}
            style={{ backgroundColor: '#00E5E5' }}
          >
            {t('cta.loginButton')}
          </button>
          
          {/* JOIN FREE PILLS - Below Login button */}
          <div className="mt-8 w-full max-w-4xl mx-auto">
            <Suspense fallback={<div className="h-16" />}>
              <JoinFreePills />
            </Suspense>
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
          ? 'bg-[rgba(0,229,229,0.05)] hover:bg-[rgba(0,229,229,0.08)]' 
          : 'bg-white border-slate-200 hover:border-slate-300'}`}
      style={{
        borderLeft: '3px solid #00E5E5',
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
