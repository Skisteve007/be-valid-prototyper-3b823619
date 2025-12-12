import React, { useState } from 'react';
import { Users, Activity, Zap, Moon, Shield, CreditCard, Eye, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import validPhoneCard from '@/assets/valid-phone-card-visual.png';

type SignalMode = 'social' | 'pulse' | 'thrill' | 'afterdark';

interface SignalModeConfig {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  borderColor: string;
  glowColor: string;
  tagline: string;
  statusText: string;
  description: string;
}

const getSignalModes = (t: (key: string) => string): Record<SignalMode, SignalModeConfig> => ({
  social: {
    name: t('signals.social.name'),
    icon: <Users size={20} />,
    color: 'text-blue-400',
    bgGradient: 'from-blue-600/20 to-cyan-600/20',
    borderColor: 'border-blue-500/50',
    glowColor: 'shadow-[0_0_40px_rgba(59,130,246,0.4)]',
    tagline: t('signals.social.tagline'),
    statusText: t('signals.social.name') + ' ACTIVE',
    description: t('signals.social.description'),
  },
  pulse: {
    name: t('signals.pulse.name'),
    icon: <Activity size={20} />,
    color: 'text-green-400',
    bgGradient: 'from-green-600/20 to-emerald-600/20',
    borderColor: 'border-green-500/50',
    glowColor: 'shadow-[0_0_40px_rgba(34,197,94,0.4)]',
    tagline: t('signals.pulse.tagline'),
    statusText: t('signals.pulse.name') + ' ACTIVE',
    description: t('signals.pulse.description'),
  },
  thrill: {
    name: t('signals.thrill.name'),
    icon: <Zap size={20} />,
    color: 'text-orange-400',
    bgGradient: 'from-orange-600/20 to-amber-600/20',
    borderColor: 'border-orange-500/50',
    glowColor: 'shadow-[0_0_40px_rgba(249,115,22,0.4)]',
    tagline: t('signals.thrill.tagline'),
    statusText: t('signals.thrill.name') + ' ACTIVE',
    description: t('signals.thrill.description'),
  },
  afterdark: {
    name: t('signals.afterdark.name'),
    icon: <Moon size={20} />,
    color: 'text-purple-400',
    bgGradient: 'from-purple-600/20 to-violet-600/20',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-[0_0_40px_rgba(168,85,247,0.4)]',
    tagline: t('signals.afterdark.tagline'),
    statusText: 'GHOST™ PROTOCOL',
    description: t('signals.afterdark.description'),
  },
});

interface VibeIdEcosystemProps {
  isDark?: boolean;
  variant?: 'b2c' | 'b2b';
}

const VibeIdEcosystem = ({ isDark = true, variant = 'b2c' }: VibeIdEcosystemProps) => {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<SignalMode>('social');
  const signalModes = getSignalModes(t);
  const currentMode = signalModes[activeMode];

  const headline = t('network.headline');
  const description = variant === 'b2c'
    ? t('network.description')
    : t('network.descriptionB2b');

  return (
    <section className={`py-8 px-4 relative z-10 transition-colors duration-500 overflow-hidden
      ${isDark ? 'bg-[#0a0a0a]' : 'bg-slate-100'}`}>
      
      {/* Animation Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: rotateY(-5deg) rotateX(2deg) translateY(0px); }
          50% { transform: rotateY(-5deg) rotateX(2deg) translateY(-15px); }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Background glow effect */}
      <div 
        className={`absolute inset-0 opacity-30 transition-all duration-700 ${currentMode.bgGradient}`}
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${activeMode === 'social' ? 'rgba(59,130,246,0.15)' : activeMode === 'pulse' ? 'rgba(34,197,94,0.15)' : activeMode === 'thrill' ? 'rgba(249,115,22,0.15)' : 'rgba(168,85,247,0.15)'} 0%, transparent 70%)`
        }}
      />
      
      <div className="max-w-7xl mx-auto relative">
        
        {/* Section Header */}
        <div className="text-center mb-4">
          <div className={`inline-block px-6 py-2 mb-2 border rounded-full text-sm font-mono tracking-[0.2em] uppercase
            ${isDark ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' : 'border-blue-600/30 text-blue-600 bg-blue-50'}`}>
            {t('network.title')}
          </div>
          <h2 className={`text-3xl md:text-5xl font-black mb-0 font-orbitron
            ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {headline}
          </h2>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
          
          {/* LEFT: Text & Mode Buttons */}
          <div className="order-2 lg:order-1">
            <p className={`text-base md:text-lg leading-relaxed mb-4 max-w-xl tracking-wide
              ${isDark ? 'text-cyan-400' : 'text-slate-600'}`}>
              {description}
            </p>
            
            {/* Adaptive Profile Sub-headline */}
            <p className={`text-base leading-relaxed max-w-xl
              ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              {t('hero.adaptiveProfile')} <span className={isDark ? 'text-white font-bold' : 'text-slate-900 font-bold'}>{t('hero.adaptiveAI')}</span> {t('hero.forNewWorld')} 
              <span className="text-cyan-400"> {t('hero.signalFlow')}</span> {t('hero.switchIdentity')}
            </p>
          </div>

          {/* RIGHT: Holographic Display */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div 
              className="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px]"
              style={{ perspective: '1000px' }}
            >
              {/* Stylized Phone/Card Visual */}
              <img 
                src={validPhoneCard}
                alt="VALID Phone Interface"
                className="w-full h-full object-contain transition-all duration-500"
                style={{ 
                  animation: 'float 4s ease-in-out infinite',
                  filter: `drop-shadow(0 0 40px rgba(0,240,255,0.6))`
                }}
              />
              
              {/* Bottom Reflection */}
              <div 
                className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-[200px] h-[40px] rounded-full blur-2xl opacity-30 transition-all duration-500
                  ${activeMode === 'social' ? 'bg-blue-500' : activeMode === 'pulse' ? 'bg-green-500' : activeMode === 'thrill' ? 'bg-orange-500' : 'bg-purple-500'}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VibeIdEcosystem;
