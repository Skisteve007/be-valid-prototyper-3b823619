import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Globe, Ghost, Shield, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useReferralTracking } from "@/hooks/useReferralTracking";
import Hero from "@/components/Hero";


const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  useReferralTracking();

  // --- THEME ENGINE ---
  const [isDark, setIsDark] = useState(true);
  const [ripple, setRipple] = useState({ active: false, x: 0, y: 0 });

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ 
      active: true, 
      x: rect.left + rect.width / 2, 
      y: rect.top + rect.height / 2 
    });
    
    setTimeout(() => {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      if (newIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    }, 150);
    
    setTimeout(() => setRipple({ active: false, x: 0, y: 0 }), 700);
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
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
      
      {/* BACKGROUND TEXTURE */}
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700
        ${isDark ? 'opacity-[0.03]' : 'opacity-[0.02]'}
        ${isDark ? 'bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)]' : 'bg-[linear-gradient(black_1px,transparent_1px),linear-gradient(90deg,black_1px,transparent_1px)]'}
        bg-[size:50px_50px]`}>
      </div>

      {/* FLOATING THEME TOGGLE */}
      <button 
        onClick={toggleTheme}
        className={`fixed bottom-8 right-8 z-[100] p-4 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 border hover:rotate-180
          ${isDark 
            ? 'bg-gray-800 text-cyan-400 border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.3)]' 
            : 'bg-white text-orange-500 border-orange-200 shadow-lg'}`}
      >
        {isDark ? <Sun size={24} className="transition-transform duration-500" /> : <Moon size={24} className="transition-transform duration-500" />}
      </button>

      {/* 1. HERO SECTION */}
      <div className="relative z-10">
        <Hero />
      </div>


      {/* 3. THE TRUST BRIDGE (Explaining the Value) */}
      <section className={`py-20 px-4 relative z-10 border-b transition-colors duration-500
        ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 font-orbitron tracking-wide
              ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('standard.title')} <span className="text-cyan-400">{t('standard.titleHighlight')}</span>
            </h2>
            <p className={`max-w-2xl mx-auto leading-relaxed
              ${isDark ? 'text-gray-200' : 'text-slate-600'}`}>
              {t('standard.subtitle')}
            </p>
          </div>

          {/* The 4 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              isDark={isDark}
              icon={<Shield size={32}/>}
              title={t('standard.militaryFortress')}
              desc={t('standard.militaryFortressDesc')}
              color="cyan"
            />
            <FeatureCard 
              isDark={isDark}
              icon={<Globe size={32}/>}
              title={t('standard.acceptedAnywhere')}
              desc={t('standard.acceptedAnywhereDesc')}
              color="cyan"
            />
            <FeatureCard 
              isDark={isDark}
              icon={<Lock size={32}/>}
              title={t('standard.yourData')}
              desc={t('standard.yourDataDesc')}
              color="cyan"
            />
            <FeatureCard 
              isDark={isDark}
              icon={<Ghost size={32}/>}
              title={t('standard.instantFinancial')}
              desc={t('standard.instantFinancialDesc')}
              color="cyan"
            />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-4 relative z-10">
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
}

const FeatureCard = ({ isDark, icon, title, desc, color }: FeatureCardProps) => (
  <div className={`p-8 rounded-2xl border transition-all duration-500 group relative overflow-hidden backdrop-blur-sm
    ${isDark 
      ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]' 
      : 'bg-white border-slate-200 hover:shadow-xl hover:border-cyan-300'}`}>
    
    <div className={`mb-6 p-4 rounded-full inline-block transition-colors duration-300
      ${isDark ? 'bg-black text-white' : 'bg-slate-100 text-slate-800'}
      ${color === 'cyan' && 'group-hover:text-cyan-400'}
      ${color === 'purple' && 'group-hover:text-purple-400'}
      ${color === 'blue' && 'group-hover:text-blue-400'}`}>
      {icon}
    </div>
    
    <h3 className={`text-xl font-bold mb-3 font-orbitron ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {title}
    </h3>
    <p className={`leading-relaxed text-sm ${isDark ? 'text-gray-200' : 'text-slate-600'}`}>
      {desc}
    </p>
  </div>
);

export default Index;