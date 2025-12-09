import React, { useState } from 'react';
import { ArrowRight, Plane, Ticket, Ghost } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'travel' | 'access' | 'incognito'>('access'); 
  
  return (
    <div className="relative min-h-[85vh] bg-[#050505] text-white overflow-hidden flex flex-col items-center selection:bg-cyan-500 selection:text-black">
      
      {/* 1. NAVBAR */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-50">
        <div className="text-4xl font-black font-orbitron tracking-[0.2em] text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] cursor-pointer">
          VALID
        </div>
        
        <div className="flex gap-4 items-center">
          <Link to="/partners" className="hidden md:block text-xs font-bold text-cyan-400/80 hover:text-cyan-300 transition-colors uppercase tracking-widest border border-cyan-900/50 px-4 py-2 rounded-full hover:bg-cyan-900/20">
            For Partners
          </Link>
          <button 
            onClick={() => navigate('/auth')}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] uppercase tracking-wider text-sm"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-6 z-10 gap-8 md:gap-16 mt-4">
        
        {/* LEFT: TEXT */}
        <div className="flex-1 text-center md:text-left order-2 md:order-1">
          <div className="inline-block mb-4 px-3 py-1 border border-cyan-500/30 bg-cyan-900/10 rounded text-[10px] font-mono tracking-widest text-cyan-400 animate-pulse">
            POWERED BY SYNTHESIZED AI
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9] text-white">
            ONE KEY.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500 drop-shadow-[0_0_25px_rgba(0,240,255,0.5)]">
              ANY REALM.
            </span>
          </h1>
          
          <p className="text-lg text-gray-400 mb-8 font-light max-w-md mx-auto md:mx-0 leading-relaxed">
            Your <span className="text-white font-bold">Adaptive AI Profile</span> for the real world. 
            Switch instantly between <span className="text-cyan-400">Travel</span>, <span className="text-purple-400">Access</span>, and <span className="text-gray-400">Privacy</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={() => navigate('/auth')}
              className="px-8 py-3 bg-white text-black font-bold text-lg rounded hover:bg-cyan-50 text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
            >
              CLAIM YOUR ID <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* RIGHT: PORTAL VIDEO */}
        <div className="flex-1 flex justify-center order-1 md:order-2">
          <div className="relative group w-[300px] md:w-[380px] aspect-[4/5]">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-1000"></div>
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
              <video 
                src="/valid_portal.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover transform scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-0 w-full text-center">
                 <div className="text-cyan-400 text-xs font-mono tracking-widest mb-1 drop-shadow-md">
                   VALID OS • ONLINE
                 </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. ATMOSPHERE */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

    </div>
  );
};

export default Hero;
