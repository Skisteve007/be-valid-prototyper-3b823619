import React, { useState, useEffect } from 'react';
import { QrCode, ShieldCheck, Plane, Ghost, Sun, Moon, Copy, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MyAccess = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [isDark, setIsDark] = useState(true);
  const [activeMode, setActiveMode] = useState<'travel' | 'access' | 'incognito'>('access');
  const [copied, setCopied] = useState(false);

  // --- THEME ENGINE (Persist Logic) ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (!newTheme) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // --- MOCK DATA ---
  const user = {
    name: "STEVEN GRILLO",
    id: "VALID-8829-X",
    status: "VERIFIED",
    exp: "12/26"
  };

  // --- MODE CONFIG ---
  const modes = {
    travel: { color: 'cyan', icon: <Plane size={16}/>, label: 'TRAVEL MODE', border: 'border-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-500' },
    access: { color: 'purple', icon: <ShieldCheck size={16}/>, label: 'ACCESS MODE', border: 'border-purple-500', text: 'text-purple-400', bg: 'bg-purple-500' },
    incognito: { color: 'gray', icon: <Ghost size={16}/>, label: 'GHOST MODE', border: 'border-white', text: 'text-gray-300', bg: 'bg-gray-500' },
  };
  const current = modes[activeMode];

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + '/view-profile?id=' + user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out font-sans selection:bg-cyan-500 selection:text-white
      ${isDark ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* BACKGROUND TEXTURE */}
      <div className={`fixed inset-0 pointer-events-none z-0 opacity-[0.03]
        ${isDark ? 'bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)]' : 'bg-[linear-gradient(black_1px,transparent_1px),linear-gradient(90deg,black_1px,transparent_1px)]'}
        bg-[size:50px_50px]`}>
      </div>

      {/* NAVBAR */}
      <nav className="w-full max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex justify-between items-center z-50 relative">
        <Link to="/" className="text-3xl md:text-4xl font-black font-orbitron tracking-[0.2em] text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">
          VALID
        </Link>
        
        <div className="flex gap-2 md:gap-4 items-center">
          <button 
            onClick={() => navigate('/')}
            className="text-xs font-bold text-cyan-400/80 hover:text-cyan-300 transition-colors uppercase tracking-widest border border-cyan-900/50 px-4 py-2 rounded-full hover:bg-cyan-900/20"
          >
            Home
          </button>
        </div>
      </nav>

      {/* FLOATING THEME TOGGLE */}
      <button 
        onClick={toggleTheme}
        className={`fixed bottom-8 right-8 z-[100] p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border
          ${isDark 
            ? 'bg-gray-800 text-cyan-400 border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.3)]' 
            : 'bg-white text-orange-500 border-orange-200 shadow-lg'}`}
      >
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* MAIN CONTENT */}
      <div className="relative z-10 pt-8 pb-20 px-4 flex flex-col items-center">
        
        {/* PROFILE HEADER */}
        <div className="text-center mb-8 animate-fade-in">
          <div className={`inline-block p-1 rounded-full border-2 mb-4 ${current.border} shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden relative">
               <div className={`absolute inset-0 opacity-20 ${current.bg}`}></div>
               <span className="text-2xl font-bold font-orbitron">{user.name.charAt(0)}</span>
            </div>
          </div>
          <h1 className={`text-2xl font-black font-orbitron tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {user.name}
          </h1>
          <div className={`text-xs font-mono tracking-[0.2em] mt-1 ${current.text}`}>
            ID: {user.id} • {user.status}
          </div>
        </div>

        {/* MODE TABS */}
        <div className="flex gap-2 mb-8 bg-black/20 p-1 rounded-full backdrop-blur-md border border-white/5">
          {(Object.keys(modes) as Array<keyof typeof modes>).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMode(m)}
              className={`px-4 md:px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2
                ${activeMode === m 
                  ? `${modes[m].bg} text-white shadow-lg` 
                  : 'text-gray-500 hover:text-white'}`}
            >
              {modes[m].icon} <span className="hidden sm:inline">{modes[m].label}</span>
            </button>
          ))}
        </div>

        {/* THE HOLOGRAPHIC ID CARD */}
        <div className={`relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden border transition-all duration-500 group
           ${isDark ? 'bg-black/40 backdrop-blur-xl border-white/10' : 'bg-white/80 border-slate-200 shadow-2xl'}
           ${activeMode === 'travel' && isDark && 'shadow-[0_0_50px_rgba(6,182,212,0.15)] border-cyan-500/30'}
           ${activeMode === 'access' && isDark && 'shadow-[0_0_50px_rgba(168,85,247,0.15)] border-purple-500/30'}
           ${activeMode === 'incognito' && isDark && 'shadow-[0_0_50px_rgba(255,255,255,0.05)]'}
        `}>
          
          {/* Card Glow Effect */}
          <div className={`absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b opacity-20 pointer-events-none
            ${activeMode === 'travel' && 'from-cyan-500 to-transparent'}
            ${activeMode === 'access' && 'from-purple-500 to-transparent'}
            ${activeMode === 'incognito' && 'from-white to-transparent'}
          `}></div>

          {/* Card Content */}
          <div className="relative h-full flex flex-col items-center justify-center p-8">
            
            {/* Dynamic Status Badge */}
            <div className={`mb-8 px-4 py-1 rounded-full border text-[10px] font-mono tracking-widest uppercase
              ${activeMode === 'travel' && 'border-cyan-500 text-cyan-500'}
              ${activeMode === 'access' && 'border-purple-500 text-purple-500'}
              ${activeMode === 'incognito' && 'border-gray-500 text-gray-500'}
            `}>
              {activeMode === 'travel' && 'TSA PRECHECK • ACTIVE'}
              {activeMode === 'access' && 'VIP ENTRY • GRANTED'}
              {activeMode === 'incognito' && 'DATA MASKED • PRIVATE'}
            </div>

            {/* THE QR CODE */}
            <div className="p-4 bg-white rounded-xl shadow-2xl mb-8 relative group cursor-pointer transition-transform hover:scale-105">
               <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition"></div>
               <QrCode size={180} className="text-black relative z-10" />
               
               {/* Scan Line Animation */}
               <div className={`absolute top-4 left-4 right-4 h-1 rounded z-20 animate-[scan_2s_ease-in-out_infinite] pointer-events-none
                 ${activeMode === 'travel' && 'bg-cyan-500/70'}
                 ${activeMode === 'access' && 'bg-purple-500/70'}
                 ${activeMode === 'incognito' && 'hidden'}
               `}></div>
            </div>

            <div className="text-center w-full">
               <p className={`text-xs font-mono mb-2 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>TAP TO SHARE</p>
               <button onClick={handleCopy} className={`flex items-center justify-center gap-2 w-full py-3 rounded border text-xs font-bold transition-all
                 ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}
               `}>
                 {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>}
                 {copied ? 'LINK COPIED' : 'COPY PROFILE LINK'}
               </button>
            </div>

          </div>

          {/* Bottom Branding */}
          <div className="absolute bottom-4 left-0 w-full text-center">
            <span className="text-[10px] font-black font-orbitron text-gray-600 tracking-[0.3em]">VALID OS</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MyAccess;