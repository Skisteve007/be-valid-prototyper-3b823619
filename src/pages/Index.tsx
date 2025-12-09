import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero'; 
import Footer from '../components/Footer'; 
import { Check, Sun, Moon, ShieldCheck, Globe, EyeOff } from 'lucide-react';

interface FeatureCardProps {
  isDark: boolean;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: 'blue' | 'cyan' | 'purple';
}

interface PricingCardProps {
  isDark: boolean;
  title: string;
  price: string;
  period: string;
  originalPrice: string;
  tag: string;
  isBeta?: boolean;
  isGold?: boolean;
}

const FeatureCard = ({ isDark, icon, title, desc, color }: FeatureCardProps) => (
  <div className={`p-6 rounded-xl border transition-all duration-500 group backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-500/50' : 'bg-white border-slate-200 hover:shadow-xl hover:border-cyan-300'}`}>
    <div className={`mb-4 p-3 rounded-full inline-block transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-slate-100 text-slate-800'} ${color === 'cyan' && 'group-hover:text-cyan-400'} ${color === 'purple' && 'group-hover:text-purple-400'} ${color === 'blue' && 'group-hover:text-blue-400'}`}>{icon}</div>
    <h3 className={`text-lg font-bold mb-2 font-orbitron ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
    <p className={`leading-relaxed text-sm ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{desc}</p>
  </div>
);

const PricingCard = ({ isDark, title, price, period, originalPrice, tag, isBeta, isGold }: PricingCardProps) => (
  <div className={`p-5 rounded-xl border relative transition-all duration-300 hover:-translate-y-1 group backdrop-blur-xl ${isDark ? (isGold ? 'bg-black/40 border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.1)]' : 'bg-black/40 border-white/10') : (isGold ? 'bg-white border-cyan-400 shadow-lg shadow-cyan-100' : 'bg-white border-slate-200 shadow-sm')}`}>
    <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase ${isBeta ? 'bg-red-600 text-white' : 'bg-cyan-600 text-black'}`}>{tag}</div>
    {isBeta && <div className="text-red-500 text-[9px] font-bold tracking-[0.15em] text-center mt-1 mb-2 animate-pulse">⚡ BETA ⚡</div>}
    <h3 className={`text-sm font-bold mb-1 font-orbitron ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{title}</h3>
    <div className="flex items-end justify-center gap-1.5 mb-1">
      <span className="text-gray-400 line-through text-sm decoration-red-500/50">{originalPrice}</span>
      <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{price}</span>
    </div>
    <div className={`text-[10px] mb-4 uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{period}</div>
    <button className={`w-full py-2 rounded font-bold transition uppercase tracking-widest text-[10px] ${isGold ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-lg' : (isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-900 hover:bg-slate-200')}`}>SELECT</button>
    {isBeta && <div className="text-red-500 text-[9px] font-bold text-center mt-2">🔥 Limited!</div>}
  </div>
);

const Index = () => {
  const [isDark, setIsDark] = useState(true); 
  const toggleTheme = () => { setIsDark(!isDark); if (!isDark) { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); } };
  useEffect(() => { document.documentElement.classList.add('dark'); }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out font-sans selection:bg-cyan-500 selection:text-white ${isDark ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className={`fixed inset-0 pointer-events-none z-0 opacity-[0.03] ${isDark ? 'bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)]' : 'bg-[linear-gradient(black_1px,transparent_1px),linear-gradient(90deg,black_1px,transparent_1px)]'} bg-[size:50px_50px]`}></div>
      <button onClick={toggleTheme} className={`fixed bottom-8 right-8 z-[100] p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border ${isDark ? 'bg-gray-800 text-cyan-400 border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.3)]' : 'bg-white text-orange-500 border-orange-200 shadow-lg'}`}>{isDark ? <Sun size={24} /> : <Moon size={24} />}</button>

      <div className="relative z-10"><Hero /></div>

      {/* TRUST BRIDGE - 3 cards side by side */}
      <section className={`py-16 px-4 relative z-10 border-b border-white/5`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 font-orbitron tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>THE VALID <span className="text-cyan-400">STANDARD</span></h2>
            <p className={`max-w-2xl mx-auto leading-relaxed text-sm ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>The ecosystem designed for humans, not data points.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FeatureCard isDark={isDark} icon={<ShieldCheck size={28}/>} title="Military-Grade Fortress" desc="Your identity is locked behind Zero-Trust encryption. Impossible to fake." color="blue" />
            <FeatureCard isDark={isDark} icon={<Globe size={28}/>} title="Accepted Everywhere" desc="One key for the world. Skip the manual ID check at airports and venues." color="cyan" />
            <FeatureCard isDark={isDark} icon={<EyeOff size={28}/>} title="Your Data. Your Rules." desc="Ghost Protocol enabled. Context-aware sharing means you reveal only what's required." color="purple" />
          </div>
        </div>
      </section>

      {/* MEMBERSHIP - 4 cards side by side */}
      <section className="py-16 px-4 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className={`inline-block px-3 py-1 mb-3 border rounded-full text-[10px] font-mono tracking-widest uppercase ${isDark ? 'border-cyan-500/30 text-cyan-400' : 'border-blue-600/30 text-blue-600'}`}>Phase 1</div>
          <h2 className={`text-2xl md:text-3xl font-black mb-2 font-orbitron ${isDark ? 'text-white' : 'text-slate-900'}`}>ACTIVATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">MEMBERSHIP</span></h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Required for App Access & Profile Creation.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <PricingCard isDark={isDark} title="Single" price="$19.50" period="Per 60 Days" originalPrice="$39" tag="50% OFF" isBeta={true} />
          <PricingCard isDark={isDark} title="Couple" price="$34.50" period="Per 60 Days" originalPrice="$69" tag="50% OFF" isBeta={true} />
          <PricingCard isDark={isDark} title="Single Year" price="$64.50" period="One-time" originalPrice="$129" tag="BEST VALUE" isBeta={true} isGold={true} />
          <PricingCard isDark={isDark} title="Couple Year" price="$109.50" period="One-time" originalPrice="$219" tag="BEST VALUE" isBeta={true} isGold={true} />
        </div>
      </section>

      <Footer /> 
    </div>
  );
};

export default Index;
