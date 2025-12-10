import React, { useState } from 'react';
import { Users, Activity, Zap, Moon, Smartphone, Shield, Wifi, Battery } from 'lucide-react';

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

const signalModes: Record<SignalMode, SignalModeConfig> = {
  social: {
    name: 'SOCIAL',
    icon: <Users size={20} />,
    color: 'text-blue-400',
    bgGradient: 'from-blue-600/20 to-cyan-600/20',
    borderColor: 'border-blue-500/50',
    glowColor: 'shadow-[0_0_40px_rgba(59,130,246,0.4)]',
    tagline: 'Open Connection',
    statusText: 'SOCIAL ACTIVE',
    description: 'Open to connect. Share contacts and socials with one scan.',
  },
  pulse: {
    name: 'PULSE',
    icon: <Activity size={20} />,
    color: 'text-green-400',
    bgGradient: 'from-green-600/20 to-emerald-600/20',
    borderColor: 'border-green-500/50',
    glowColor: 'shadow-[0_0_40px_rgba(34,197,94,0.4)]',
    tagline: 'High Energy',
    statusText: 'PULSE ACTIVE',
    description: 'High energy. Broadcast your preferences, relationship status, and health verified badge.',
  },
  thrill: {
    name: 'THRILL',
    icon: <Zap size={20} />,
    color: 'text-orange-400',
    bgGradient: 'from-orange-600/20 to-amber-600/20',
    borderColor: 'border-orange-500/50',
    glowColor: 'shadow-[0_0_40px_rgba(249,115,22,0.4)]',
    tagline: 'Adventure Ready',
    statusText: 'THRILL ACTIVE',
    description: 'Adventure ready. Payments pre-loaded, fast-track travel docs, and identity verification.',
  },
  afterdark: {
    name: 'AFTER DARK',
    icon: <Moon size={20} />,
    color: 'text-purple-400',
    bgGradient: 'from-purple-600/20 to-violet-600/20',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-[0_0_40px_rgba(168,85,247,0.4)]',
    tagline: 'Stealth Mode',
    statusText: 'GHOST PROTOCOL',
    description: 'Entertainment access. Zero data exposed. Flow through entry.',
  },
};

interface VibeIdEcosystemProps {
  isDark?: boolean;
  variant?: 'b2c' | 'b2b';
}

const VibeIdEcosystem = ({ isDark = true, variant = 'b2c' }: VibeIdEcosystemProps) => {
  const [activeMode, setActiveMode] = useState<SignalMode>('social');
  const currentMode = signalModes[activeMode];

  const headline = variant === 'b2c' 
    ? 'ONE IDENTITY. ZERO LIMITS.'
    : 'ONE PLATFORM. EVERY CONTEXT.';
  
  const description = variant === 'b2c'
    ? 'Static profiles are dead. Professional at the entry. Invisibility is an option. Open for connection. Adapt your vibe instantly to match your mood.'
    : 'Members toggle between modes based on context—each mode reveals only what\'s relevant. Operations see the right verification signal without accessing private data.';

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
        <div className="text-center mb-16 pt-8">
          <div className={`inline-block px-6 py-2 mb-6 border rounded-full text-sm font-mono tracking-[0.2em] uppercase
            ${isDark ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' : 'border-blue-600/30 text-blue-600 bg-blue-50'}`}>
            THE VALID NETWORK
          </div>
          <h2 className={`text-3xl md:text-5xl font-black mb-4 font-orbitron
            ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {headline}
          </h2>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Text & Mode Buttons */}
          <div className="order-2 lg:order-1">
            <p className={`text-lg md:text-xl leading-relaxed mb-10 max-w-xl tracking-wide
              ${isDark ? 'text-cyan-400' : 'text-slate-600'}`}>
              {description}
            </p>

            {/* Signal Select Header */}
            <div className={`text-xs font-mono tracking-[0.3em] uppercase mb-4 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
              SELECT YOUR SIGNAL
            </div>

            {/* 2x2 Pill Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6 max-w-sm">
              {(Object.keys(signalModes) as SignalMode[]).map((mode) => {
                const config = signalModes[mode];
                const isActive = activeMode === mode;
                
                return (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full font-semibold text-sm transition-all duration-300 border
                      ${isActive 
                        ? `${config.color} ${config.borderColor} bg-white/5 ${config.glowColor}` 
                        : `${isDark ? 'text-gray-400 border-white/10 hover:border-white/30' : 'text-slate-500 border-slate-200 hover:border-slate-400'}`
                      }`}
                  >
                    {config.icon}
                    <span className="tracking-wider text-xs">{config.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Description Display */}
            <div className={`p-6 rounded-2xl border transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
              <div className={`text-xs font-mono tracking-widest uppercase mb-3 ${currentMode.color}`}>
                {currentMode.tagline}
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                {currentMode.description}
              </p>
            </div>
          </div>

          {/* RIGHT: 3D Phone Card */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div 
              className={`relative transition-all duration-700 transform hover:scale-105 group`}
              style={{ perspective: '1000px' }}
            >
              {/* Animated Orbital Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div 
                  className={`absolute w-[320px] h-[320px] rounded-full border opacity-20 transition-all duration-500
                    ${currentMode.borderColor}`}
                  style={{ animation: 'spin 20s linear infinite' }}
                />
                <div 
                  className={`absolute w-[380px] h-[380px] rounded-full border opacity-10 transition-all duration-500
                    ${currentMode.borderColor}`}
                  style={{ animation: 'spin 30s linear infinite reverse' }}
                />
                <div 
                  className={`absolute w-[440px] h-[440px] rounded-full border opacity-5 transition-all duration-500
                    ${currentMode.borderColor}`}
                  style={{ animation: 'spin 40s linear infinite' }}
                />
              </div>

              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1.5 h-1.5 rounded-full ${currentMode.color.replace('text-', 'bg-')} opacity-60`}
                    style={{
                      left: `${20 + (i * 12)}%`,
                      animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                ))}
              </div>

              {/* Pulsing Glow Background */}
              <div 
                className={`absolute inset-0 rounded-[50px] blur-3xl opacity-30 transition-all duration-500 -z-10
                  ${activeMode === 'social' ? 'bg-blue-500' : activeMode === 'pulse' ? 'bg-green-500' : activeMode === 'thrill' ? 'bg-orange-500' : 'bg-purple-500'}`}
                style={{ animation: 'pulse 3s ease-in-out infinite' }}
              />

              {/* Phone Frame */}
              <div 
                className={`relative w-[280px] h-[560px] rounded-[40px] border-[8px] transition-all duration-500 overflow-hidden
                  ${isDark ? 'bg-[#111] border-gray-800' : 'bg-gray-100 border-gray-300'}
                  ${currentMode.glowColor}`}
                style={{
                  transform: 'rotateY(-5deg) rotateX(2deg)',
                  transformStyle: 'preserve-3d',
                  animation: 'float 6s ease-in-out infinite',
                }}
              >
                {/* Scanning Beam Effect */}
                <div 
                  className={`absolute inset-x-0 h-[2px] opacity-60 z-20 transition-all duration-500
                    ${activeMode === 'social' ? 'bg-blue-400' : activeMode === 'pulse' ? 'bg-green-400' : activeMode === 'thrill' ? 'bg-orange-400' : 'bg-purple-400'}`}
                  style={{
                    animation: 'scan 2.5s ease-in-out infinite',
                    boxShadow: `0 0 20px 5px ${activeMode === 'social' ? 'rgba(59,130,246,0.5)' : activeMode === 'pulse' ? 'rgba(34,197,94,0.5)' : activeMode === 'thrill' ? 'rgba(249,115,22,0.5)' : 'rgba(168,85,247,0.5)'}`
                  }}
                />

                {/* Dynamic Background Gradient */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-b transition-all duration-700 ${currentMode.bgGradient}`}
                />

                {/* Holographic Shimmer */}
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.1) 50%, transparent 55%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s infinite',
                  }}
                />
                
                {/* Phone Screen Content */}
                <div className="relative h-full p-6 flex flex-col">
                  
                  {/* Status Bar */}
                  <div className={`flex justify-between items-center mb-6 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    <span className="text-xs font-mono">9:41</span>
                    <div className="flex items-center gap-2">
                      <Wifi size={14} />
                      <Battery size={14} />
                    </div>
                  </div>

                  {/* VALID Logo */}
                  <div className="text-center mb-6">
                    <h3 className={`text-2xl font-black font-orbitron tracking-wider ${currentMode.color}`}
                      style={{ textShadow: `0 0 20px ${activeMode === 'social' ? 'rgba(59,130,246,0.5)' : activeMode === 'pulse' ? 'rgba(34,197,94,0.5)' : activeMode === 'thrill' ? 'rgba(249,115,22,0.5)' : 'rgba(168,85,247,0.5)'}` }}>
                      VALID™
                    </h3>
                    <div className={`text-[10px] font-mono tracking-[0.3em] ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                      VALID-ID
                    </div>
                  </div>

                  {/* Profile Card */}
                  <div className={`flex-1 rounded-3xl border p-5 transition-all duration-500 backdrop-blur-sm
                    ${isDark ? 'bg-black/40' : 'bg-white/60'} ${currentMode.borderColor}`}>
                    
                    {/* Avatar with Pulse Ring */}
                    <div className="flex justify-center mb-4 relative">
                      <div className={`absolute w-24 h-24 rounded-full border-2 opacity-50 ${currentMode.borderColor}`}
                        style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                      <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-500 relative z-10
                        ${currentMode.borderColor} ${currentMode.bgGradient}`}>
                        <Smartphone size={32} className={currentMode.color} />
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`text-center mb-4`}>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold tracking-widest
                        ${currentMode.borderColor} border ${currentMode.color}`}
                        style={{ boxShadow: `0 0 15px ${activeMode === 'social' ? 'rgba(59,130,246,0.3)' : activeMode === 'pulse' ? 'rgba(34,197,94,0.3)' : activeMode === 'thrill' ? 'rgba(249,115,22,0.3)' : 'rgba(168,85,247,0.3)'}` }}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${currentMode.color.replace('text-', 'bg-')}`} />
                        {currentMode.statusText}
                      </div>
                    </div>

                    {/* Mode Icon */}
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 rounded-2xl transition-all duration-500 ${currentMode.borderColor} border`}
                        style={{ boxShadow: `inset 0 0 20px ${activeMode === 'social' ? 'rgba(59,130,246,0.2)' : activeMode === 'pulse' ? 'rgba(34,197,94,0.2)' : activeMode === 'thrill' ? 'rgba(249,115,22,0.2)' : 'rgba(168,85,247,0.2)'}` }}>
                        <div className={`${currentMode.color}`}>
                          {React.cloneElement(currentMode.icon as React.ReactElement, { size: 40 })}
                        </div>
                      </div>
                    </div>

                    {/* Verified Shield */}
                    <div className="flex justify-center">
                      <div className={`flex items-center gap-2 text-xs font-mono ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        <Shield size={14} className="text-green-400" style={{ filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.6))' }} />
                        VERIFIED
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className={`mt-4 h-1 w-1/3 mx-auto rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
                </div>
              </div>

              {/* Reflection/Shadow */}
              <div 
                className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-[240px] h-[40px] rounded-full blur-2xl opacity-40 transition-all duration-500
                  ${activeMode === 'social' ? 'bg-blue-500' : activeMode === 'pulse' ? 'bg-green-500' : activeMode === 'thrill' ? 'bg-orange-500' : 'bg-purple-500'}`}
                style={{ animation: 'pulse 3s ease-in-out infinite' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VibeIdEcosystem;
