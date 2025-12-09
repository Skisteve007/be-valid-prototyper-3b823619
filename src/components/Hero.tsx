import React, { useState } from 'react';
import { Smartphone, Shield, Plane, MapPin, UserX } from 'lucide-react';

const BeValidHero = () => {
  const [activeMode, setActiveMode] = useState<'travel' | 'access' | 'incognito'>('access');

  const modes = [
    { id: 'travel', label: 'Travel', icon: Plane, color: 'text-blue-400' },
    { id: 'access', label: 'Access', icon: MapPin, color: 'text-green-400' },
    { id: 'incognito', label: 'Incognito', icon: UserX, color: 'text-purple-400' },
  ] as const;

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left: Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-mono tracking-widest">
            POWERED BY SYNTHESIZED AI
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-orbitron tracking-tight">
            Be <span className="text-green-400">Valid</span>.
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-lg">
            Your secure ecosystem for total access. Frictionless entry via QR code & instant transactions.
          </p>

          {/* Mode Switcher */}
          <div className="flex gap-2 justify-center lg:justify-start mb-8">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                  activeMode === mode.id
                    ? 'bg-white/10 border-white/30 text-white'
                    : 'border-gray-700 text-gray-500 hover:border-gray-500'
                }`}
              >
                <mode.icon size={16} className={activeMode === mode.id ? mode.color : ''} />
                <span className="text-sm font-medium">{mode.label}</span>
              </button>
            ))}
          </div>

          <button className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-full font-bold text-white text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
            Get Started Free
          </button>
        </div>

        {/* Right: Phone Mockup */}
        <div className="flex-1 flex justify-center">
          <div className="relative">
            {/* Phone Frame */}
            <div className="w-64 h-[500px] bg-gray-900 rounded-[3rem] border-4 border-gray-700 shadow-2xl overflow-hidden relative">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
              
              {/* Phone Screen */}
              <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 p-6 pt-10 flex flex-col items-center">
                <Shield className="w-16 h-16 text-green-400 mb-4" />
                
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-white font-orbitron">VALID</div>
                  <div className="text-xs text-gray-400 tracking-widest">VERIFIED</div>
                </div>

                {/* QR Code Placeholder */}
                <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-400 rounded grid grid-cols-5 grid-rows-5 gap-1 p-2">
                    {[...Array(25)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Mode Badge */}
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  activeMode === 'travel' ? 'bg-blue-500/20 text-blue-400' :
                  activeMode === 'access' ? 'bg-green-500/20 text-green-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {activeMode.toUpperCase()} MODE
                </div>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeValidHero;
