// *****************************************************************************
// FILE: src/components/Hero.tsx
// PURPOSE: RESTORED Hero (Visible Video, Partner Button, Synthesized AI)
// *****************************************************************************

import React, { useState, useEffect } from 'react';
import { ArrowRight, Plane, Ticket, Ghost } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface ModeBtnProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  mode: 'travel' | 'access' | 'ghost';
}

const ModeBtn = ({ active, onClick, icon, label, mode }: ModeBtnProps) => {
  const getColors = () => {
    if (mode === 'ghost') {
      return active 
        ? 'bg-yellow-500/10 border-yellow-400 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]'
        : 'border-white/10 text-gray-500 hover:border-yellow-400/30 hover:text-yellow-400';
    }
    return active 
      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]' 
      : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white';
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 text-xs font-bold tracking-wider ${getColors()}`}
    >
      {icon} {label}
    </button>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'travel' | 'access' | 'ghost'>('access');
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'POWERED BY SYNTHESIZED AI';
  
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);
    
    return () => clearInterval(typingInterval);
  }, []);
  
  return (
    <div className="relative min-h-[85vh] bg-[#050505] text-white overflow-hidden flex flex-col items-center selection:bg-cyan-500 selection:text-black">
      
      {/* 1. NAVBAR (RESTORED Partner Button) */}
      <nav className="w-full px-4 md:px-6 py-4 md:py-6 flex justify-between items-center z-50">
        {/* THE LOGO */}
        <div className="text-2xl md:text-4xl font-black font-orbitron tracking-[0.1em] md:tracking-[0.2em] text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] cursor-pointer shrink-0">
          VALID<sup className="text-xs md:text-sm text-cyan-400">™</sup>
        </div>
        
        {/* Navigation Actions */}
        <div className="flex gap-2 md:gap-4 items-center shrink-0">
          {/* For Partners Link - visible on all screens */}
          <Link to="/partners" className="text-[10px] md:text-xs font-bold text-cyan-400/80 hover:text-cyan-300 transition-colors uppercase tracking-widest border border-cyan-900/50 px-2 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-cyan-900/20">
            Partners
          </Link>
          <button 
            onClick={() => navigate('/auth')}
            className="px-3 md:px-5 py-1.5 md:py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] uppercase tracking-wider text-[10px] md:text-xs whitespace-nowrap"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-6 z-10 gap-8 md:gap-16 mt-4">
        
        {/* LEFT: THE PITCH */}
        <div className="flex-1 text-center md:text-left order-2 md:order-1">
          
          {/* TAG: SYNTHESIZED AI with typing effect */}
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-cyan-500/30 bg-cyan-900/10 rounded text-[10px] font-mono tracking-widest text-cyan-400">
            <span className="min-w-[200px]">
              {displayedText}
              <span className="animate-pulse">|</span>
            </span>
            {/* Glowing pulsating blue circle */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8),0_0_20px_rgba(59,130,246,0.5)]"></span>
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.15] md:leading-[0.9] text-white">
            ONE KEY.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500 drop-shadow-[0_0_25px_rgba(0,240,255,0.5)]">
              Verify. Pay. Vibe.
            </span>
          </h1>
          
          {/* SUB-HEADLINE: Adaptive Profile */}
          <p className="text-lg text-gray-400 mb-8 font-light max-w-md mx-auto md:mx-0 leading-relaxed">
            Your <span className="text-white font-bold">adaptive AI profile</span> for the real world. 
            Switch instantly between <span className="text-cyan-400">Access</span>, <span className="text-purple-400">Travel</span>, and <span className="text-yellow-400">Ghost<sup className="text-[10px]">™</sup></span>.
          </p>
          
          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={() => navigate('/auth')}
              className="px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-cyan-50 text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 min-h-[52px]"
            >
              CLAIM YOUR ID <ArrowRight size={18} />
            </button>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="mt-10 flex justify-center md:justify-start gap-3 flex-wrap">
             <ModeBtn mode="access" active={activeMode === 'access'} onClick={() => setActiveMode('access')} icon={<Ticket size={18}/>} label="ACCESS" />
             <ModeBtn mode="travel" active={activeMode === 'travel'} onClick={() => setActiveMode('travel')} icon={<Plane size={18}/>} label="TRAVEL" />
             <ModeBtn mode="ghost" active={activeMode === 'ghost'} onClick={() => setActiveMode('ghost')} icon={<Ghost size={18}/>} label="GHOST™" />
          </div>
          
          {/* Dynamic Description Text */}
          <div className="mt-4 h-8 flex items-center justify-center md:justify-start">
            <p 
              key={activeMode}
              className="text-sm text-gray-400 animate-fade-in"
            >
              {activeMode === 'access' && "Instant entry. Verify identity and pay with one tap."}
              {activeMode === 'travel' && "Global movement. Seamless check-ins for transit, hotels, and flights."}
              {activeMode === 'ghost' && "Ghost™ Protocol active. Tokenized identity & payments. Mask your data."}
            </p>
          </div>
        </div>

        {/* RIGHT: THE PORTAL VIDEO (Fixed Visibility) */}
        <div className="flex-1 flex justify-center order-1 md:order-2">
          <div className="relative group w-[300px] md:w-[380px] aspect-[4/5]">
            
            {/* The Glow Behind */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-1000"></div>
            
            {/* The Video Container */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
              {/* VIDEO LOOP - No Blurs, No overlays */}
              <video 
                src="/valid_portal.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover transform scale-105"
              />
              
              {/* Overlay Gradient (Bottom only) */}
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              
            </div>
          </div>
        </div>

      </div>

      {/* 3. BACKGROUND ATMOSPHERE */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

    </div>
  );
};

export default Hero;