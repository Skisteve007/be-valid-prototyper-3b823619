import React, { useState, useEffect } from 'react';
import { QrCode, ShieldCheck, Plane, Ghost, Copy, Check, User, MapPin, Calendar, Smartphone, Mail, Lock } from 'lucide-react';

const MyAccess = () => {
  // --- STATE ---
  const [activeMode, setActiveMode] = useState<'travel' | 'access' | 'incognito'>('access');
  const [copied, setCopied] = useState(false);

  // --- FORCE DARK MODE ON MOUNT ---
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // --- MOCK USER DATA ---
  const user = {
    name: "STEVEN GRILLO",
    id: "VALID-8829-X",
    status: "VERIFIED",
    location: "Boca Raton, FL",
    joined: "Member since 2025",
    email: "steven@example.com",
    phone: "+1 (555) 000-0000"
  };

  // --- MODE STYLING CONFIG ---
  const modes = {
    travel: { color: 'cyan', icon: <Plane/>, label: 'TRAVEL', border: 'border-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-500/10', glow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]' },
    access: { color: 'purple', icon: <ShieldCheck/>, label: 'ACCESS', border: 'border-purple-500', text: 'text-purple-400', bg: 'bg-purple-500/10', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]' },
    incognito: { color: 'gray', icon: <Ghost/>, label: 'GHOST', border: 'border-white', text: 'text-gray-300', bg: 'bg-white/10', glow: 'shadow-[0_0_30px_rgba(255,255,255,0.1)]' },
  };
  const current = modes[activeMode];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // MASTER CONTAINER: FORCED BLACK BACKGROUND
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* BACKGROUND GRID TEXTURE */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.05] bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 pt-28 pb-20 px-4 max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* LEFT COLUMN: THE ID CARD (Quick Share) */}
        <div className="flex-1 flex flex-col items-center">
          
          {/* USER AVATAR */}
          <div className="text-center mb-8">
            <div className={`inline-block p-1 rounded-full border-2 mb-4 ${current.border} ${current.glow} transition-all duration-500`}>
              <div className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden border border-white/10">
                 <User size={40} className="text-gray-500" />
              </div>
            </div>
            <h1 className="text-2xl font-black font-orbitron tracking-widest text-white">{user.name}</h1>
            <div className={`text-xs font-mono tracking-[0.2em] mt-1 ${current.text}`}>
              {user.status} • {user.id}
            </div>
          </div>

          {/* MODE SWITCHER */}
          <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-full backdrop-blur-md border border-white/10">
            {(Object.keys(modes) as Array<keyof typeof modes>).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMode(m)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all duration-300 flex items-center gap-2 tracking-wider
                  ${activeMode === m 
                    ? `${modes[m].bg} ${modes[m].text} border ${modes[m].border} shadow-lg` 
                    : 'text-gray-500 hover:text-white'}`}
              >
                {modes[m].icon} <span className="hidden sm:inline">{modes[m].label}</span>
              </button>
            ))}
          </div>

          {/* HOLOGRAPHIC QR CARD */}
          <div className={`relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden border transition-all duration-500 bg-black/40 backdrop-blur-xl group
             ${current.border} ${current.glow}
          `}>
            {/* Inner Glow */}
            <div className={`absolute top-0 left-0 w-full h-2/3 pointer-events-none
              ${activeMode === 'travel' && 'bg-gradient-to-b from-cyan-500/20 to-transparent'}
              ${activeMode === 'access' && 'bg-gradient-to-b from-purple-500/20 to-transparent'}
              ${activeMode === 'incognito' && 'bg-gradient-to-b from-white/10 to-transparent'}
            `}></div>

            <div className="relative h-full flex flex-col items-center justify-center p-8">
              <div className={`mb-8 px-4 py-1 rounded-full border text-[10px] font-mono tracking-widest uppercase bg-black/50 ${current.text} ${current.border}`}>
                {current.label} ACTIVE
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-xl shadow-2xl mb-8 relative">
                 <QrCode size={160} className="text-black" />
                 {/* Scan Line */}
                 {activeMode !== 'incognito' && (
                   <div className={`absolute top-0 left-0 w-full h-1 z-20 animate-[scan_2s_ease-in-out_infinite]
                     ${activeMode === 'travel' && 'bg-cyan-500/50'}
                     ${activeMode === 'access' && 'bg-purple-500/50'}
                   `}></div>
                 )}
              </div>

              <div className="text-center w-full">
                 <p className="text-xs font-mono mb-2 text-gray-500 uppercase">Scan to Verify</p>
                 <button onClick={handleCopy} className="flex items-center justify-center gap-2 w-full py-3 rounded border border-white/10 hover:bg-white/5 text-xs font-bold transition-all text-white">
                   {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>}
                   {copied ? 'LINK COPIED' : 'COPY LINK'}
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE DASHBOARD DETAILS (Personal Front) */}
        <div className="flex-1">
          <h2 className="text-xl font-bold font-orbitron mb-6 text-white border-l-4 border-cyan-500 pl-4">
            MEMBER DETAILS
          </h2>

          <div className="space-y-4">
            {/* DETAIL CARD 1 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition duration-300">
              <div className="flex items-center gap-3 mb-2 text-gray-400">
                <MapPin size={16} /> <span className="text-xs font-mono uppercase">Primary Location</span>
              </div>
              <div className="text-lg font-bold text-white">{user.location}</div>
            </div>

            {/* DETAIL CARD 2 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition duration-300">
              <div className="flex items-center gap-3 mb-2 text-gray-400">
                <Calendar size={16} /> <span className="text-xs font-mono uppercase">Membership Tier</span>
              </div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                Platinum Access <span className="text-[10px] bg-cyan-900 text-cyan-400 px-2 py-0.5 rounded border border-cyan-700">ACTIVE</span>
              </div>
            </div>

            {/* DETAIL CARD 3 (Private Info - Blurry in Ghost Mode) */}
            <div className={`bg-white/5 border border-white/10 rounded-xl p-6 transition duration-300 relative
              ${activeMode === 'incognito' ? 'opacity-50 blur-[2px]' : 'hover:border-cyan-500/50'}`}>
              <div className="flex items-center gap-3 mb-4 text-gray-400 border-b border-white/5 pb-2">
                <Lock size={16} /> <span className="text-xs font-mono uppercase">Private Contact</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail size={16} /> {user.email}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Smartphone size={16} /> {user.phone}
                  </div>
                </div>
              </div>
              
              {activeMode === 'incognito' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-black/80 px-4 py-2 rounded border border-white/20 text-xs font-bold text-white">HIDDEN IN GHOST MODE</span>
                </div>
              )}
            </div>

            {/* LAB RESULTS SECTION */}
            <div className="mt-8">
               <h3 className="text-sm font-bold font-orbitron mb-4 text-gray-400">VERIFIED HEALTH STATUS</h3>
               <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <ShieldCheck size={24} className="text-green-400" />
                   <div>
                     <div className="text-white font-bold text-sm">Toxicology Screen</div>
                     <div className="text-green-400 text-xs">Verified Clean • 12/01/2025</div>
                   </div>
                 </div>
                 <button className="text-xs bg-green-500 text-black px-3 py-1.5 rounded font-bold hover:bg-green-400">VIEW</button>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default MyAccess;
