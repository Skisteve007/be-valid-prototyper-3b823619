import React, { useState } from 'react';
import { Users, Plane, Moon, Smartphone, Shield, Wifi, Battery } from 'lucide-react';

type VibeMode = 'access' | 'travel' | 'ghost';

interface VibeModeConfig {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  borderColor: string;
  glowColor: string;
  tagline: string;
  statusText: string;
  features: string[];
}

const vibeModes: Record<VibeMode, VibeModeConfig> = {
  access: {
    name: 'ACCESS',
    icon: <Users size={24} />,
    color: 'text-blue-400',
    bgGradient: 'from-blue-600/20 to-cyan-600/20',
    borderColor: 'border-blue-500/50',
    glowColor: 'shadow-[0_0_40px_rgba(59,130,246,0.4)]',
    tagline: 'Instant Entry',
    statusText: 'ACCESS ACTIVE',
    features: ['Instant entry. Verify identity, share socials, pay with one tap.'],
  },
  travel: {
    name: 'TRAVEL',
    icon: <Plane size={24} />,
    color: 'text-orange-400',
    bgGradient: 'from-orange-600/20 to-amber-600/20',
    borderColor: 'border-orange-500/50',
    glowColor: 'shadow-[0_0_40px_rgba(249,115,22,0.4)]',
    tagline: 'Global Movement',
    statusText: 'TRAVEL ACTIVE',
    features: ['Global movement. Seamless check-ins for transit, hotels, and flights.'],
  },
  ghost: {
    name: 'GHOST',
    icon: <Moon size={24} />,
    color: 'text-purple-400',
    bgGradient: 'from-purple-600/20 to-violet-600/20',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-[0_0_40px_rgba(168,85,247,0.4)]',
    tagline: 'Stealth Mode',
    statusText: 'GHOST PROTOCOL',
    features: ['Stealth active. Tokenized identity. Mask your data.'],
  },
};

interface VibeIdEcosystemProps {
  isDark?: boolean;
  variant?: 'b2c' | 'b2b';
}

const VibeIdEcosystem = ({ isDark = true, variant = 'b2c' }: VibeIdEcosystemProps) => {
  const [activeMode, setActiveMode] = useState<VibeMode>('access');
  const currentMode = vibeModes[activeMode];

  const headline = variant === 'b2c' 
    ? 'ONE IDENTITY. ZERO LIMITS.'
    : 'ONE PLATFORM. EVERY CONTEXT.';
  
  const description = variant === 'b2c'
    ? 'Static profiles are dead. Professional at the entry. Invisibility is an option. Open for connection. Adapt your vibe instantly to match your mood.'
    : 'Members toggle between modes based on context—each mode reveals only what\'s relevant. Operations see the right verification signal without accessing private data.';

  return (
    <section className={`py-24 px-4 relative z-10 transition-colors duration-500 overflow-hidden
      ${isDark ? 'bg-[#0a0a0a]' : 'bg-slate-100'}`}>
      
      {/* Background glow effect */}
      <div 
        className={`absolute inset-0 opacity-30 transition-all duration-700 ${currentMode.bgGradient}`}
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${activeMode === 'access' ? 'rgba(59,130,246,0.15)' : activeMode === 'travel' ? 'rgba(245,158,11,0.15)' : 'rgba(168,85,247,0.15)'} 0%, transparent 70%)`
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
            <div className={`text-xs font-mono tracking-[0.3em] uppercase mb-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              SELECT YOUR SIGNAL
            </div>

            {/* Mode Pill Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {(Object.keys(vibeModes) as VibeMode[]).map((mode) => {
                const config = vibeModes[mode];
                const isActive = activeMode === mode;
                
                return (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all duration-300 border
                      ${isActive 
                        ? `${config.color} ${config.borderColor} bg-white/5 ${config.glowColor}` 
                        : `${isDark ? 'text-gray-400 border-white/10 hover:border-white/30' : 'text-slate-500 border-slate-200 hover:border-slate-400'}`
                      }`}
                  >
                    {config.icon}
                    <span className="tracking-wider">{config.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Mode Features */}
            <div className={`p-6 rounded-2xl border transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
              <div className={`text-xs font-mono tracking-widest uppercase mb-4 ${currentMode.color}`}>
                {currentMode.tagline}
              </div>
              <ul className="space-y-3">
                <li className={`flex items-start gap-3 text-sm tracking-wide ${isDark ? 'text-cyan-400' : 'text-slate-700'}`}>
                  <span className={`w-2.5 h-2.5 min-w-[10px] min-h-[10px] rounded-full flex-shrink-0 mt-1 ${currentMode.color.replace('text-', 'bg-')}`} />
                  <span>{currentMode.features[0]}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT: 3D Phone Card */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div 
              className={`relative transition-all duration-700 transform hover:scale-105`}
              style={{ perspective: '1000px' }}
            >
              {/* Phone Frame */}
              <div 
                className={`relative w-[280px] h-[560px] rounded-[40px] border-[8px] transition-all duration-500 overflow-hidden
                  ${isDark ? 'bg-[#111] border-gray-800' : 'bg-gray-100 border-gray-300'}
                  ${currentMode.glowColor}`}
                style={{
                  transform: 'rotateY(-5deg) rotateX(2deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Dynamic Background Gradient */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-b transition-all duration-700 ${currentMode.bgGradient}`}
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
                    <h3 className={`text-2xl font-black font-orbitron tracking-wider ${currentMode.color}`}>
                      VALID
                    </h3>
                    <div className={`text-[10px] font-mono tracking-[0.3em] ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                      VALID-ID
                    </div>
                  </div>

                  {/* Profile Card */}
                  <div className={`flex-1 rounded-3xl border p-5 transition-all duration-500 backdrop-blur-sm
                    ${isDark ? 'bg-black/40' : 'bg-white/60'} ${currentMode.borderColor}`}>
                    
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-500
                        ${currentMode.borderColor} ${currentMode.bgGradient}`}>
                        <Smartphone size={32} className={currentMode.color} />
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`text-center mb-4`}>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold tracking-widest
                        ${currentMode.borderColor} border ${currentMode.color}`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${currentMode.color.replace('text-', 'bg-')}`} />
                        {currentMode.statusText}
                      </div>
                    </div>

                    {/* Mode Icon */}
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 rounded-2xl transition-all duration-500 ${currentMode.borderColor} border`}>
                        <div className={`${currentMode.color}`}>
                          {React.cloneElement(currentMode.icon as React.ReactElement, { size: 40 })}
                        </div>
                      </div>
                    </div>

                    {/* Verified Shield */}
                    <div className="flex justify-center">
                      <div className={`flex items-center gap-2 text-xs font-mono ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        <Shield size={14} className="text-green-400" />
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
                className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-[200px] h-[20px] rounded-full blur-xl opacity-50 transition-all duration-500
                  ${activeMode === 'access' ? 'bg-blue-500' : activeMode === 'travel' ? 'bg-amber-500' : 'bg-purple-500'}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VibeIdEcosystem;
