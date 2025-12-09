import React, { useState } from 'react';
import { ArrowRight, Plane, Ticket, Ghost } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

// Mode Button Component
const ModeBtn = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all touch-manipulation ${
      active 
        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]' 
        : 'text-gray-500 border border-gray-800 hover:border-gray-600 hover:text-gray-400'
    }`}
  >
    {icon}
    {label}
  </button>
);

const Hero = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'travel' | 'access' | 'incognito'>('access');
  
  return (
    <div className="relative min-h-[85vh] bg-[#050505] text-white overflow-hidden flex flex-col items-center selection:bg-cyan-500 selection:text-black">
      
      {/* 1. NAVBAR */}
      <nav className="w-full max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex justify-between items-center z-50">
        <div className="text-3xl md:text-4xl font-black font-orbitron tracking-[0.2em] text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">
          VALID
        </div>
        
        <div className="flex gap-2 md:gap-4 items-center">
          <Link 
            to="/partners" 
            className="hidden md:block text-xs font-bold text-cyan-400/80 hover:text-cyan-300 transition-colors uppercase tracking-widest border border-cyan-900/50 px-4 py-2 rounded-full hover:bg-cyan-900/20"
          >
            For Partners
          </Link>
          <button 
            onClick={() => navigate('/auth')}
            className="px-4 md:px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] uppercase tracking-wider text-sm"
          >
            Launch App
          </button>
          <ThemeToggle />
        </div>
      </nav>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-4 md:px-6 z-10 gap-8 md:gap-16 py-8">
        
        {/* LEFT: TEXT */}
        <div className="flex-1 text-center md:text-left order-2 md:order-1">
          <div className="inline-block mb-4 px-3 py-1 border border-cyan-500/30 bg-cyan-900/10 rounded text-[10px] font-mono tracking-widest text-cyan-400">
            SYNTHESIZED REALITY
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-[0.9] text-white">
            ONE KEY.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500 drop-shadow-[0_0_25px_rgba(0,240,255,0.5)]">
              ANY REALM.
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-400 mb-8 font-light max-w-md mx-auto md:mx-0 leading-relaxed">
            Switch instantly between <span className="text-cyan-400">Travel</span>, <span className="text-purple-400">Access</span>, and <span className="text-gray-300">Privacy</span> modes.
          </p>
          
          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={() => navigate('/auth')}
              className="px-8 py-4 bg-white text-black font-bold text-lg rounded hover:bg-cyan-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] min-h-[56px] touch-manipulation"
            >
              CLAIM YOUR ID <ArrowRight size={18} />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-3">
            <ModeBtn active={activeMode === 'travel'} onClick={() => setActiveMode('travel')} icon={<Plane size={16}/>} label="TRAVEL" />
            <ModeBtn active={activeMode === 'access'} onClick={() => setActiveMode('access')} icon={<Ticket size={16}/>} label="ACCESS" />
            <ModeBtn active={activeMode === 'incognito'} onClick={() => setActiveMode('incognito')} icon={<Ghost size={16}/>} label="GHOST" />
          </div>
        </div>

        {/* RIGHT: THE HERO IMAGE */}
        <div className="flex-1 flex justify-center order-1 md:order-2">
          <div className="relative group">
            {/* Glowing border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-1000 animate-pulse"></div>
            
            {/* Image container */}
            <div className="relative w-[280px] md:w-[360px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="/valid_hero.jpg" 
                alt="Valid Digital Avatar" 
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              {/* Bottom gradient overlay */}
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/90 to-transparent"></div>
              
              {/* Status badge on image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div>
                  <span className="text-xs font-mono text-cyan-400 tracking-wider">VERIFIED</span>
                </div>
                <span className="text-xs font-mono text-gray-500">v2.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};

export default Hero;
