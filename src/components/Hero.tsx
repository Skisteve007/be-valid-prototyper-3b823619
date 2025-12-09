import React, { useState, useEffect } from 'react';
import { ArrowRight, Plane, Ticket, Ghost, MousePointerClick } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

interface ModeBtnProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color: 'cyan' | 'purple' | 'gray';
}

const ModeBtn = ({ active, onClick, icon, label, color }: ModeBtnProps) => {
  const colorClasses = {
    cyan: {
      active: 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    },
    purple: {
      active: 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    },
    gray: {
      active: 'bg-gray-500/20 border-gray-400 text-gray-400 shadow-[0_0_15px_rgba(255,255,255,0.1)]',
    },
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 text-[10px] font-bold tracking-widest touch-manipulation
        ${active 
          ? `${colorClasses[color].active} scale-105` 
          : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
        }`}
    >
      {icon} {label}
    </button>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'travel' | 'access' | 'incognito'>('access');
  const [isDark, setIsDark] = useState(true);

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Get dynamic classes based on active mode
  const getGlowClass = () => {
    switch (activeMode) {
      case 'travel': return 'bg-cyan-500';
      case 'access': return 'bg-purple-600';
      case 'incognito': return 'bg-gray-500 opacity-20';
    }
  };

  const getBorderClass = () => {
    switch (activeMode) {
      case 'travel': return 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)]';
      case 'access': return 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]';
      case 'incognito': return 'border-white/20 shadow-none grayscale';
    }
  };

  const getStatusColor = () => {
    switch (activeMode) {
      case 'travel': return 'text-cyan-400';
      case 'access': return 'text-purple-400';
      case 'incognito': return 'text-gray-400';
    }
  };

  const getBackgroundGlow = () => {
    if (!isDark) {
      switch (activeMode) {
        case 'travel': return 'bg-cyan-200/30';
        case 'access': return 'bg-purple-200/30';
        case 'incognito': return 'bg-gray-200/20';
      }
    }
    switch (activeMode) {
      case 'travel': return 'bg-cyan-500/10';
      case 'access': return 'bg-purple-600/10';
      case 'incognito': return 'bg-white/5';
    }
  };
  
  return (
    <div className={`relative min-h-[90vh] overflow-hidden flex flex-col items-center selection:bg-cyan-500 selection:text-black transition-colors duration-500
      ${isDark ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 1. NAVBAR */}
      <nav className="w-full max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex justify-between items-center z-50">
        <div className={`text-3xl md:text-4xl font-black font-orbitron tracking-[0.2em] drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] cursor-pointer
          ${isDark ? 'text-white' : 'text-slate-900'}`}>
          VALID
        </div>
        
        <div className="flex gap-2 md:gap-4 items-center">
          <Link 
            to="/partners" 
            className={`hidden md:block text-xs font-bold transition-colors uppercase tracking-widest border px-4 py-2 rounded-full
              ${isDark 
                ? 'text-cyan-400/80 hover:text-cyan-300 border-cyan-900/50 hover:bg-cyan-900/20' 
                : 'text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50'}`}
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
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-4 md:px-6 z-10 gap-8 md:gap-16 mt-4 py-8">
        
        {/* LEFT: THE PITCH */}
        <div className="flex-1 text-center md:text-left order-2 md:order-1">
          
          <div className={`inline-block mb-4 px-3 py-1 border rounded text-[10px] font-mono tracking-widest animate-pulse
            ${isDark ? 'border-cyan-500/30 bg-cyan-900/10 text-cyan-400' : 'border-blue-300 bg-blue-50 text-blue-600'}`}>
            POWERED BY SYNTHESIZED AI
          </div>
          
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-[0.9]
            ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ONE KEY.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500 drop-shadow-[0_0_25px_rgba(0,240,255,0.5)]">
              ANY REALM.
            </span>
          </h1>
          
          <p className={`text-base md:text-lg mb-8 font-light max-w-md mx-auto md:mx-0 leading-relaxed
            ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
            Your <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Adaptive AI Profile</span> for the real world. 
            Switch instantly between <span className="text-cyan-500">Travel</span>, <span className="text-purple-500">Access</span>, and <span className={isDark ? 'text-gray-400' : 'text-slate-600'}>Privacy</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={() => navigate('/auth')}
              className={`px-6 md:px-8 py-3 font-bold text-sm md:text-lg rounded transition-all flex items-center justify-center gap-2 min-h-[48px] touch-manipulation hover:scale-105
                ${isDark 
                  ? 'bg-white text-black hover:bg-cyan-50 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg'}`}
            >
              CLAIM YOUR ID <ArrowRight size={18} />
            </button>
          </div>

          {/* INTERACTIVE DEMO CONTROLS */}
          <div className="mt-10 md:mt-12 flex flex-col items-center md:items-start gap-3">
             <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-cyan-400">
               <MousePointerClick size={12} className="animate-bounce" /> Try The Modes (Interactive Demo)
             </div>
             
             <div className="flex gap-2 md:gap-3 flex-wrap justify-center md:justify-start">
                <ModeBtn 
                  active={activeMode === 'travel'} 
                  onClick={() => setActiveMode('travel')} 
                  icon={<Plane size={16}/>} 
                  label="TRAVEL" 
                  color="cyan"
                />
                <ModeBtn 
                  active={activeMode === 'access'} 
                  onClick={() => setActiveMode('access')} 
                  icon={<Ticket size={16}/>} 
                  label="ACCESS" 
                  color="purple"
                />
                <ModeBtn 
                  active={activeMode === 'incognito'} 
                  onClick={() => setActiveMode('incognito')} 
                  icon={<Ghost size={16}/>} 
                  label="GHOST" 
                  color="gray"
                />
             </div>
          </div>
        </div>

        {/* RIGHT: THE HOLOGRAPHIC CARD (Visual Feedback) */}
        <div className="flex-1 flex justify-center order-1 md:order-2">
          <div className="relative group w-[280px] md:w-[360px] lg:w-[380px] aspect-[4/5]">
            
            {/* Dynamic Glow Behind */}
            <div className={`absolute -inset-1 rounded-2xl blur opacity-40 transition-all duration-700 ${getGlowClass()}`}></div>
            
            {/* The Video Container */}
            <div className={`relative w-full h-full rounded-2xl overflow-hidden border transition-all duration-500 shadow-2xl bg-black ${getBorderClass()}`}>
              
              {/* VIDEO LOOP - Blurs in Ghost Mode */}
              <video 
                src="/valid_portal.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className={`w-full h-full object-cover transform scale-105 transition-all duration-700
                  ${activeMode === 'incognito' ? 'blur-md opacity-50 scale-100' : 'blur-0 opacity-100'}
                `}
              />
              
              {/* Overlay Gradient */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              
              {/* Dynamic Status Text */}
              <div className="absolute bottom-6 md:bottom-8 left-0 w-full text-center px-4">
                 <div className={`text-xs font-mono tracking-[0.2em] mb-2 font-bold transition-colors duration-300 ${getStatusColor()}`}>
                   {activeMode === 'travel' && 'TSA PRECHECK • ACTIVE'}
                   {activeMode === 'access' && 'VIP GATEWAY • OPEN'}
                   {activeMode === 'incognito' && 'DATA MASKED • PRIVATE'}
                 </div>

                 {/* Extra context based on mode */}
                 <div className="text-[10px] text-gray-400 font-sans opacity-80">
                    {activeMode === 'travel' && 'Boarding Pass & ID Verified'}
                    {activeMode === 'access' && 'Payment & Age Verified'}
                    {activeMode === 'incognito' && 'No Personal Data Shared'}
                 </div>
              </div>

              {/* Ghost Mode Lock Icon */}
              {activeMode === 'incognito' && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-black/50 p-4 rounded-full border border-white/20 backdrop-blur-md animate-pulse">
                      <Ghost size={32} className="text-white" />
                   </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* 3. BACKGROUND ATMOSPHERE */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className={`absolute top-[-20%] right-[-10%] w-[600px] md:w-[800px] h-[600px] md:h-[800px] rounded-full blur-[120px] transition-colors duration-1000 ${getBackgroundGlow()}`}></div>
      </div>

    </div>
  );
};

export default Hero;