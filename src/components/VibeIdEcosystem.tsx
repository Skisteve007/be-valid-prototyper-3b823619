import React, { useState } from 'react';
import { Users, Activity, Zap, Moon, Shield, CreditCard, Eye, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    <section className={`py-24 px-4 relative z-10 transition-colors duration-500 overflow-hidden
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
        <div className="text-center mb-6">
          <div className={`inline-block px-6 py-2 mb-4 border rounded-full text-sm font-mono tracking-[0.2em] uppercase
            ${isDark ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' : 'border-blue-600/30 text-blue-600 bg-blue-50'}`}>
            {t('network.title')}
          </div>
          <h2 className={`text-3xl md:text-5xl font-black mb-2 font-orbitron
            ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {headline}
          </h2>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Text & Mode Buttons */}
          <div className="order-2 lg:order-1">
            <p className={`text-base md:text-lg leading-relaxed mb-4 max-w-xl tracking-wide
              ${isDark ? 'text-cyan-400' : 'text-slate-600'}`}>
              {description}
            </p>
          </div>

          {/* RIGHT: Holographic Display */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div 
              className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px]"
              style={{ perspective: '1000px' }}
            >
              {/* Hexagonal Grid Background */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  <defs>
                    <pattern id="hexGrid" width="30" height="52" patternUnits="userSpaceOnUse">
                      <polygon points="15,0 30,13 30,39 15,52 0,39 0,13" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500/30" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#hexGrid)" />
                </svg>
              </div>

              {/* Outer Orbital Ring */}
              <div 
                className="absolute inset-0 rounded-full border border-cyan-500/20"
                style={{ animation: 'spin 30s linear infinite' }}
              />
              
              {/* Middle Orbital Ring */}
              <div 
                className="absolute inset-6 rounded-full border border-cyan-500/30"
                style={{ animation: 'spin 20s linear infinite reverse' }}
              />

              {/* Inner Glow Circle */}
              <div 
                className={`absolute inset-12 rounded-full transition-all duration-500
                  ${activeMode === 'social' ? 'bg-blue-500/10' : activeMode === 'pulse' ? 'bg-green-500/10' : activeMode === 'thrill' ? 'bg-orange-500/10' : 'bg-purple-500/10'}`}
                style={{ 
                  boxShadow: `inset 0 0 60px ${activeMode === 'social' ? 'rgba(59,130,246,0.3)' : activeMode === 'pulse' ? 'rgba(34,197,94,0.3)' : activeMode === 'thrill' ? 'rgba(249,115,22,0.3)' : 'rgba(168,85,247,0.3)'}` 
                }}
              />

              {/* Central Valid ID Token */}
              <div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32"
                style={{ animation: 'float 4s ease-in-out infinite' }}
              >
                <div 
                  className={`w-full h-full rounded-2xl border-2 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-500
                    ${isDark ? 'bg-black/60' : 'bg-white/60'}
                    ${currentMode.borderColor}
                    ${currentMode.glowColor}`}
                >
                  <Shield size={28} className={`${currentMode.color} mb-1`} style={{ filter: `drop-shadow(0 0 10px ${activeMode === 'social' ? 'rgba(59,130,246,0.8)' : activeMode === 'pulse' ? 'rgba(34,197,94,0.8)' : activeMode === 'thrill' ? 'rgba(249,115,22,0.8)' : 'rgba(168,85,247,0.8)'})` }} />
                  <span className={`text-xs md:text-sm font-black font-orbitron tracking-wider ${currentMode.color}`}>VALID™</span>
                  <span className={`text-[8px] md:text-[10px] font-mono ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>GHOST TOKEN</span>
                </div>
              </div>

              {/* Security/Access Zone - Top */}
              <div 
                className="absolute top-4 left-1/2 -translate-x-1/2"
                style={{ animation: 'float 5s ease-in-out infinite', animationDelay: '0.5s' }}
              >
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-sm transition-all duration-500
                  ${isDark ? 'bg-cyan-950/50' : 'bg-cyan-100/50'}
                  border-cyan-500/50`}
                  style={{ boxShadow: '0 0 20px rgba(0,240,255,0.3)' }}
                >
                  <Lock size={16} className="text-cyan-400" />
                  <span className="text-[10px] md:text-xs font-mono text-cyan-400 font-semibold">{t('network.security')}</span>
                </div>
              </div>

              {/* Payments Zone - Bottom Left */}
              <div 
                className="absolute bottom-8 left-4 md:left-8"
                style={{ animation: 'float 5s ease-in-out infinite', animationDelay: '1s' }}
              >
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-sm transition-all duration-500
                  ${isDark ? 'bg-green-950/50' : 'bg-green-100/50'}
                  border-green-500/50`}
                  style={{ boxShadow: '0 0 20px rgba(34,197,94,0.3)' }}
                >
                  <CreditCard size={16} className="text-green-400" />
                  <span className="text-[10px] md:text-xs font-mono text-green-400 font-semibold">{t('network.payments')}</span>
                </div>
              </div>

              {/* Privacy/Invisibility Zone - Bottom Right */}
              <div 
                className="absolute bottom-8 right-4 md:right-8"
                style={{ animation: 'float 5s ease-in-out infinite', animationDelay: '1.5s' }}
              >
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-sm transition-all duration-500
                  ${isDark ? 'bg-purple-950/50' : 'bg-purple-100/50'}
                  border-purple-500/50`}
                  style={{ boxShadow: '0 0 20px rgba(168,85,247,0.3)' }}
                >
                  <Eye size={16} className="text-purple-400" />
                  <span className="text-[10px] md:text-xs font-mono text-purple-400 font-semibold">{t('network.privacy')}</span>
                </div>
              </div>

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                {/* Line to Security */}
                <line x1="200" y1="140" x2="200" y2="60" stroke="rgba(0,240,255,0.4)" strokeWidth="1" strokeDasharray="4 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                </line>
                {/* Line to Payments */}
                <line x1="160" y1="220" x2="80" y2="300" stroke="rgba(34,197,94,0.4)" strokeWidth="1" strokeDasharray="4 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                </line>
                {/* Line to Privacy */}
                <line x1="240" y1="220" x2="320" y2="300" stroke="rgba(168,85,247,0.4)" strokeWidth="1" strokeDasharray="4 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                </line>
              </svg>

              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full ${currentMode.color.replace('text-', 'bg-')} opacity-60`}
                    style={{
                      left: `${15 + (i * 10)}%`,
                      top: `${20 + (i * 8)}%`,
                      animation: `float ${3 + i * 0.4}s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>

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
