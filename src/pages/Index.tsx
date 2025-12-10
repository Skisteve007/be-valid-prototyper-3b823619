import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sun, Moon, ShieldCheck, Globe, EyeOff } from 'lucide-react';
import { useReferralTracking } from "@/hooks/useReferralTracking";
import Hero from "@/components/Hero";
import VibeIdEcosystem from "@/components/VibeIdEcosystem";
import { Fingerprint } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  useReferralTracking();

  // --- THEME ENGINE ---
  const [isDark, setIsDark] = useState(true);
  const [ripple, setRipple] = useState({ active: false, x: 0, y: 0 });

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ 
      active: true, 
      x: rect.left + rect.width / 2, 
      y: rect.top + rect.height / 2 
    });
    
    setTimeout(() => {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      if (newIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    }, 150);
    
    setTimeout(() => setRipple({ active: false, x: 0, y: 0 }), 700);
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out font-sans selection:bg-cyan-500 selection:text-white
      ${isDark ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* RIPPLE TRANSITION EFFECT */}
      {ripple.active && (
        <div 
          className="fixed pointer-events-none z-[99]"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div 
            className={`rounded-full animate-[ripple_0.7s_ease-out_forwards] ${isDark ? 'bg-slate-50' : 'bg-[#050505]'}`}
            style={{
              width: '10px',
              height: '10px',
            }}
          />
        </div>
      )}
      
      {/* BACKGROUND TEXTURE */}
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700
        ${isDark ? 'opacity-[0.03]' : 'opacity-[0.02]'}
        ${isDark ? 'bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)]' : 'bg-[linear-gradient(black_1px,transparent_1px),linear-gradient(90deg,black_1px,transparent_1px)]'}
        bg-[size:50px_50px]`}>
      </div>

      {/* FLOATING THEME TOGGLE */}
      <button 
        onClick={toggleTheme}
        className={`fixed bottom-8 right-8 z-[100] p-4 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 border hover:rotate-180
          ${isDark 
            ? 'bg-gray-800 text-cyan-400 border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.3)]' 
            : 'bg-white text-orange-500 border-orange-200 shadow-lg'}`}
      >
        {isDark ? <Sun size={24} className="transition-transform duration-500" /> : <Moon size={24} className="transition-transform duration-500" />}
      </button>

      {/* 1. HERO SECTION */}
      <div className="relative z-10">
        <Hero />
      </div>

      {/* 2. THE VIBE-ID ECOSYSTEM */}
      <VibeIdEcosystem isDark={isDark} variant="b2c" />

      {/* 3. THE TRUST BRIDGE (Explaining the Value) */}
      <section className={`py-20 px-4 relative z-10 border-b transition-colors duration-500
        ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 font-orbitron tracking-wide
              ${isDark ? 'text-white' : 'text-slate-900'}`}>
              THE VALID <span className="text-cyan-400">STANDARD</span>
            </h2>
            <p className={`max-w-2xl mx-auto leading-relaxed
              ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              Designed for humans, not data points.
            </p>
          </div>

          {/* The 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              isDark={isDark}
              icon={<ShieldCheck size={32}/>}
              title="Military-Grade Fortress"
              desc="Digital Fortress enabled. Unbreachable zero-trust encryption. Impossible to fake, impossible to steal. Your identity is locked."
              color="blue"
            />
            <FeatureCard 
              isDark={isDark}
              icon={<Globe size={32}/>}
              title="Accepted Anywhere"
              desc="One Key. Universal Acceptance. Skip the manual check. Valid at airports, entertainment venues, and corporate zones worldwide."
              color="cyan"
            />
            <FeatureCard 
              isDark={isDark}
              icon={<EyeOff size={32}/>}
              title="Your Data. Your Rules."
              desc="Ghost Protocol Enabled. Context-aware sharing: Reveal only what's required (age, health, or clearance) while keeping your choice records invisible."
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* 3. STEP 1: MEMBERSHIP */}
      <section className="py-24 px-4 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className={`inline-block px-3 py-1 mb-4 border rounded-full text-[10px] font-mono tracking-widest uppercase
            ${isDark ? 'border-cyan-500/30 text-cyan-400' : 'border-blue-600/30 text-blue-600'}`}>
            Phase 1
          </div>
          <h2 className={`text-4xl md:text-5xl font-black mb-2 font-orbitron
            ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ACTIVATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">MEMBERSHIP</span>
          </h2>
          <p className={isDark ? 'text-gray-400' : 'text-slate-500'}>Required for App Access & Profile Creation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PricingCard isDark={isDark} title="Single Member" price="$19.50" period="Per 60 Days" originalPrice="$39" tag="50% OFF" isBeta={true} />
          <PricingCard isDark={isDark} title="Joint/Couple" price="$34.50" period="Per 60 Days" originalPrice="$69" tag="50% OFF" isBeta={true} />
          <PricingCard isDark={isDark} title="Single One Year" price="$64.50" period="One-time" originalPrice="$129" tag="BEST VALUE" isBeta={true} isGold={true} />
          <PricingCard isDark={isDark} title="Couple One Year" price="$109.50" period="One-time" originalPrice="$219" tag="BEST VALUE" isBeta={true} isGold={true} />
        </div>
      </section>

      {/* 4. STEP 2: VERIFICATION */}
      <section className={`py-24 px-4 border-t transition-colors duration-500
        ${isDark ? 'bg-gradient-to-b from-black to-gray-900 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
        
        <div className="text-center mb-16">
          <div className={`inline-block px-3 py-1 mb-4 border rounded-full text-[10px] font-mono tracking-widest uppercase
            ${isDark ? 'border-purple-500/30 text-purple-400' : 'border-purple-600/30 text-purple-600'}`}>
            Phase 2 (Optional)
          </div>
          <h2 className={`text-4xl md:text-5xl font-black mb-2 font-orbitron
            ${isDark ? 'text-white' : 'text-slate-900'}`}>
            GET <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">VERIFIED</span>
          </h2>
          <p className={isDark ? 'text-gray-400' : 'text-slate-500'}>Upgrade to Lab-Certified Status.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Identity Verification Card */}
          <div className={`p-8 rounded-2xl border transition-all duration-500 relative overflow-hidden group backdrop-blur-sm
            ${isDark 
              ? 'bg-white/5 border-white/10 hover:border-emerald-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]' 
              : 'bg-white border-slate-200 shadow-lg hover:border-emerald-500 hover:shadow-emerald-100'}`}>
            
            <div className="absolute top-0 right-0 text-xs font-bold px-4 py-2 text-white bg-emerald-600">TIER 1 IDV</div>
            
            <div className={`mb-4 p-3 rounded-full inline-block ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
              <Fingerprint size={28} className="text-emerald-400" />
            </div>
            
            <h3 className={`text-2xl font-bold mb-2 font-orbitron ${isDark ? 'text-white' : 'text-slate-900'}`}>Identity Verification</h3>
            <div className={`text-5xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>$80.00</div>
            <div className={`text-xs mb-6 font-bold tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>24-HOUR TURNAROUND</div>
            
            <ul className={`text-sm space-y-3 mb-8 font-mono ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              <li className="flex gap-3 items-center">
                <Check size={16} className="text-emerald-400"/> State ID (Driver's License)
              </li>
              <li className="flex gap-3 items-center">
                <Check size={16} className="text-emerald-400"/> International (Passport)
              </li>
              <li className="flex gap-3 items-center">
                <Check size={16} className="text-emerald-400"/> Biometric Liveness Check
              </li>
            </ul>
            
            <button 
              className="w-full py-4 bg-transparent border rounded font-bold transition-all duration-300 uppercase tracking-widest border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              VERIFY IDENTITY
            </button>
          </div>

          <LabCard 
            isDark={isDark}
            title="10-Panel Toxicology" 
            price="$129.00" 
            badge="LAB-CERTIFIED" 
            badgeColor="bg-cyan-600"
            btnColor="cyan"
            checks={['Verified Drug Screen', 'Digital Badge Update']}
            onOrder={() => navigate("/toxicology-kit-order")}
          />
          
          <LabCard 
            isDark={isDark}
            title="13-Panel Sexual Health" 
            price="$249.00" 
            badge="PLATINUM" 
            badgeColor="bg-purple-600"
            btnColor="purple"
            checks={['Full STD Panel', 'Certified Health Badge']}
            onOrder={() => navigate("/health-panel-order")}
          />
        </div>
      </section>
    </div>
  );
};

// --- FEATURE CARD COMPONENT ---
interface FeatureCardProps {
  isDark: boolean;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: 'blue' | 'cyan' | 'purple';
}

const FeatureCard = ({ isDark, icon, title, desc, color }: FeatureCardProps) => (
  <div className={`p-8 rounded-2xl border transition-all duration-500 group relative overflow-hidden backdrop-blur-sm
    ${isDark 
      ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]' 
      : 'bg-white border-slate-200 hover:shadow-xl hover:border-cyan-300'}`}>
    
    <div className={`mb-6 p-4 rounded-full inline-block transition-colors duration-300
      ${isDark ? 'bg-black text-white' : 'bg-slate-100 text-slate-800'}
      ${color === 'cyan' && 'group-hover:text-cyan-400'}
      ${color === 'purple' && 'group-hover:text-purple-400'}
      ${color === 'blue' && 'group-hover:text-blue-400'}`}>
      {icon}
    </div>
    
    <h3 className={`text-xl font-bold mb-3 font-orbitron ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {title}
    </h3>
    <p className={`leading-relaxed text-sm ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
      {desc}
    </p>
  </div>
);

// --- ADAPTIVE PRICING CARD ---
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

const PricingCard = ({ isDark, title, price, period, originalPrice, tag, isBeta, isGold }: PricingCardProps) => (
  <div className={`p-8 rounded-2xl border relative transition-all duration-300 hover:-translate-y-2 group backdrop-blur-xl
    ${isDark 
      ? (isGold ? 'bg-black/40 border-cyan-500/50 shadow-[0_0_30px_rgba(0,240,255,0.1)] hover:shadow-[0_0_50px_rgba(0,240,255,0.25)]' : 'bg-black/40 border-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]') 
      : (isGold ? 'bg-white border-cyan-400 shadow-xl shadow-cyan-100' : 'bg-white border-slate-200 shadow-sm hover:shadow-lg')
    }`}>
    
    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase
      ${isGold ? 'bg-cyan-500 text-black' : 'bg-cyan-600 text-white'}`}>
      {tag}
    </div>

    {isBeta && <div className={`text-[10px] font-bold tracking-[0.2em] text-center mt-2 mb-4 animate-pulse ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>⚡ BETA PRICING ⚡</div>}

    <h3 className={`text-lg font-bold mb-2 font-orbitron ${isDark ? 'text-gray-300 group-hover:text-white' : 'text-slate-700'} transition-colors`}>{title}</h3>
    
    <div className="flex items-end justify-center gap-2 mb-1">
      <span className="text-gray-400 line-through text-lg">{originalPrice}</span>
      <span className={`text-4xl font-bold ${isDark ? 'text-white group-hover:text-cyan-400' : 'text-slate-900'} transition-colors`}>{price}</span>
    </div>
    <div className={`text-xs mb-8 uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{period}</div>

    <button className={`w-full py-3 rounded font-bold transition-all duration-300 uppercase tracking-widest text-xs
      ${isGold 
        ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-lg hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]' 
        : (isDark ? 'bg-transparent border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]' : 'bg-slate-100 text-slate-900 hover:bg-cyan-500 hover:text-white')}`}>
      SELECT PLAN
    </button>

    {isBeta && <div className={`text-[10px] font-bold text-center mt-4 ${isDark ? 'text-cyan-500' : 'text-cyan-600'}`}>🔥 Limited Time!</div>}
  </div>
);

// --- ADAPTIVE LAB CARD ---
interface LabCardProps {
  isDark: boolean;
  title: string;
  price: string;
  badge: string;
  badgeColor: string;
  btnColor: 'cyan' | 'purple';
  checks: string[];
  onOrder: () => void;
}

const LabCard = ({ isDark, title, price, badge, badgeColor, btnColor, checks, onOrder }: LabCardProps) => (
  <div className={`p-8 rounded-2xl border transition-all duration-500 relative overflow-hidden group backdrop-blur-sm
    ${isDark 
      ? 'bg-white/5 border-white/10 hover:border-cyan-500 hover:shadow-[0_0_40px_rgba(0,240,255,0.15)]' 
      : 'bg-white border-slate-200 shadow-lg hover:border-cyan-500 hover:shadow-cyan-100'}`}>
    
    <div className={`absolute top-0 right-0 text-xs font-bold px-4 py-2 text-white ${badgeColor}`}>{badge}</div>
    
    <h3 className={`text-2xl font-bold mb-2 font-orbitron ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
    <div className={`text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{price}</div>
    
    <ul className={`text-sm space-y-3 mb-8 font-mono ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
      {checks.map((check, i) => (
        <li key={i} className="flex gap-3 items-center">
          <Check size={16} className={btnColor === 'cyan' ? 'text-cyan-400' : 'text-purple-400'}/> {check}
        </li>
      ))}
    </ul>
    
    <button 
      onClick={onOrder}
      className={`w-full py-4 bg-transparent border rounded font-bold transition-all duration-300 uppercase tracking-widest
      ${btnColor === 'cyan' 
        ? 'border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]' 
        : 'border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]'}`}>
      ORDER KIT
    </button>
  </div>
);

export default Index;