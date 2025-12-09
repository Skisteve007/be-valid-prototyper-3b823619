import React, { useState } from 'react';
import { ArrowRight, Plane, Ticket, Ghost, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'travel' | 'access' | 'incognito'>('access');

  const modes = {
    travel: {
      color: 'text-blue-400',
      border: 'border-blue-500',
      shadow: 'shadow-[0_0_30px_rgba(59,130,246,0.5)]',
      icon: <Plane className="w-8 h-8" />,
      label: 'TRAVEL MODE',
      status: 'TSA PRECHECK • ACTIVE'
    },
    access: {
      color: 'text-[#39ff14]',
      border: 'border-[#39ff14]',
      shadow: 'shadow-[0_0_30px_rgba(57,255,20,0.5)]',
      icon: <Ticket className="w-8 h-8" />,
      label: 'ACCESS MODE',
      status: 'VIP ENTRY • VERIFIED'
    },
    incognito: {
      color: 'text-gray-200',
      border: 'border-white',
      shadow: 'shadow-[0_0_30px_rgba(255,255,255,0.2)]',
      icon: <Ghost className="w-8 h-8" />,
      label: 'INCOGNITO',
      status: 'IDENTITY MASKED'
    }
  };

  const current = modes[activeMode];

  return (
    <div className="relative min-h-[90vh] bg-black text-white overflow-hidden flex flex-col items-center selection:bg-[#39ff14] selection:text-black">
      
      {/* NAVBAR */}
      <nav className="w-full max-w-7xl mx-auto p-4 md:p-6 flex justify-between items-center z-50">
        <div className="text-3xl md:text-4xl lg:text-5xl font-black font-orbitron tracking-widest text-[#39ff14] drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]">
          VALID
        </div>
        
        <div className="flex gap-2 md:gap-4 items-center">
          <Link to="/partners" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
            For Partners
          </Link>
          <button 
            onClick={() => navigate('/auth')}
            className="px-4 md:px-6 py-2 border border-[#39ff14] text-[#39ff14] font-bold rounded hover:bg-[#39ff14] hover:text-black transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] uppercase tracking-wider text-sm md:text-base"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* HERO CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-4 md:px-6 z-10 gap-8 md:gap-12 py-8">
        
        {/* LEFT: TEXT */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-4 leading-tight">
            BE <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] to-emerald-600 drop-shadow-[0_0_20px_rgba(57,255,20,0.4)]">
              VALID.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 font-light max-w-lg mx-auto md:mx-0">
            One Identity. Every Destination.<br/>
            <span className="text-[#39ff14]">Travel. Nightlife. Privacy.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={() => navigate('/auth')}
              className="px-8 py-4 bg-[#39ff14] text-black font-bold text-lg rounded hover:scale-105 transition-transform shadow-[0_0_20px_rgba(57,255,20,0.6)] flex items-center justify-center gap-2 min-h-[56px] touch-manipulation"
            >
              CLAIM YOUR ID <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* RIGHT: HOLOGRAPHIC CARD */}
        <div className="flex-1 flex justify-center">
          <div className={`relative w-72 md:w-80 h-[400px] md:h-[450px] bg-black/40 backdrop-blur-xl rounded-3xl border-2 ${current.border} ${current.shadow} transition-all duration-500 flex flex-col items-center justify-between p-6 md:p-8`}>
            
            {/* Top Badge */}
            <div className="w-full flex justify-between items-center text-white/50 border-b border-white/10 pb-4">
              <span className="text-xs font-mono tracking-[0.2em]">VALID OS</span>
              <ShieldCheck size={18} className={current.color} />
            </div>

            {/* Central Icon */}
            <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-2 ${current.border} flex items-center justify-center ${current.color} ${current.shadow} bg-black/50`}>
              {current.icon}
            </div>

            {/* Status Text */}
            <div className="text-center">
              <h3 className={`text-2xl md:text-3xl font-bold font-orbitron mb-2 ${current.color} drop-shadow-md`}>{current.label}</h3>
              <div className="inline-block px-3 py-1 bg-white/5 rounded border border-white/10 text-xs font-mono text-gray-300">
                {current.status}
              </div>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="w-full flex justify-between pt-6 border-t border-white/10">
              <button 
                onClick={() => setActiveMode('travel')} 
                className={`p-2 transition-all hover:scale-110 touch-manipulation ${activeMode === 'travel' ? 'text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]' : 'text-gray-600'}`}
              >
                <Plane />
              </button>
              <button 
                onClick={() => setActiveMode('access')} 
                className={`p-2 transition-all hover:scale-110 touch-manipulation ${activeMode === 'access' ? 'text-[#39ff14] drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]' : 'text-gray-600'}`}
              >
                <Ticket />
              </button>
              <button 
                onClick={() => setActiveMode('incognito')} 
                className={`p-2 transition-all hover:scale-110 touch-manipulation ${activeMode === 'incognito' ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'text-gray-600'}`}
              >
                <Ghost />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#39ff14]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};

export default Hero;
