// *****************************************************************************
// FILE: src/pages/Partners.tsx
// PURPOSE: RESTORED "Unicorn Thesis" Enterprise Page (Fixed Layout & Content)
// *****************************************************************************

import React from 'react';
import { ShieldCheck, DollarSign, Lock, Zap, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ThesisCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface StackItemProps {
  title: string;
  desc: string;
  color: 'cyan' | 'purple' | 'green';
}

interface RoadmapItemProps {
  phase: string;
  title: string;
  status: string;
  desc: string;
  color: 'cyan' | 'purple' | 'gray';
}

const ThesisCard = ({ icon, title, desc }: ThesisCardProps) => (
  <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition duration-300">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-bold font-orbitron mb-2 text-white">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

const StackItem = ({ title, desc, color }: StackItemProps) => {
  const colorClasses = {
    cyan: 'border-cyan-900/50 bg-cyan-900/10 text-cyan-400',
    purple: 'border-purple-900/50 bg-purple-900/10 text-purple-400',
    green: 'border-green-900/50 bg-green-900/10 text-green-400',
  };
  const textClasses = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]}`}>
      <h4 className={`text-lg font-bold ${textClasses[color]} mb-1`}>{title}</h4>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
};

const RoadmapItem = ({ phase, title, status, desc, color }: RoadmapItemProps) => {
  const colorClasses = {
    cyan: 'border-cyan-500 text-cyan-500',
    purple: 'border-purple-500 text-purple-500',
    gray: 'border-gray-500 text-gray-500',
  };

  return (
    <div className="bg-black p-6 rounded-xl border border-white/10 hover:-translate-y-2 transition duration-300">
      <div className={`w-24 h-24 mx-auto rounded-full bg-black border-4 ${colorClasses[color]} flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
         <div className="font-bold text-xs">{status}</div>
      </div>
      <div className="text-xs font-mono text-gray-500 mb-2">{phase}</div>
      <h3 className="text-xl font-bold font-orbitron mb-2 text-white">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
};

const Partners = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500 selection:text-black relative overflow-hidden">
      
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      {/* 1. NAVIGATION */}
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold font-orbitron tracking-[0.2em] text-white">VALID</span>
            <span className="text-[10px] bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded border border-cyan-500/30 tracking-widest uppercase">
              Partner Solutions
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <Link 
              to="/pitch-deck" 
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-full transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
            >
              🚀 Pitch Deck
            </Link>
            <Link to="/" className="px-5 py-2 border border-white/20 hover:bg-white hover:text-black text-xs font-bold rounded-full transition-all uppercase tracking-widest">
              Consumer App
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. THE BUILDER'S VISION (Hero) */}
      <header className="relative py-28 px-6 text-center z-10 max-w-5xl mx-auto">
        <div className="inline-block mb-6 px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-[10px] font-mono tracking-[0.2em] animate-pulse">
          POWERED BY SYNTHETIC AI
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white font-orbitron drop-shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          THE BUILDER'S VISION
        </h1>
        
        {/* The Quote */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm relative">
          <div className="text-4xl text-cyan-500 absolute top-4 left-4 font-serif">"</div>
          <p className="text-lg md:text-xl text-gray-300 italic leading-relaxed mb-6 px-4">
            We are not building another app; we are architecting the foundational <strong className="text-white">Zero-Trust infrastructure</strong> for the next economy. 
            VALID is the definitive answer to the two questions every executive must ask: 
            <span className="text-cyan-400"> How do I eliminate operational liability, and how do I monetize access?</span>
          </p>
          <div className="text-xs font-bold text-cyan-500 uppercase tracking-widest">— The Vision Behind VALID</div>
        </div>
      </header>

      {/* 3. THE UNICORN THESIS (4-Card Grid) */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-bold font-orbitron mb-2">THE UNICORN THESIS</h2>
           <p className="text-gray-400">Why VALID is a billion-dollar platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ThesisCard 
            icon={<Zap size={24} className="text-cyan-400"/>}
            title="High-Margin Transactional Power"
            desc="The core revenue is the $10-$50 Incognito Access Token. It operates at near-zero marginal cost, creating massive profitability as your organization scales up."
          />
          <ThesisCard 
            icon={<ShieldCheck size={24} className="text-purple-400"/>}
            title="Zero-Trust Architectural Moat"
            desc="The complexity of linking health data (HIPAA) with payment systems and physical access is a massive barrier to entry. No competitor can copy this integrated model."
          />
          <ThesisCard 
            icon={<Share2 size={24} className="text-green-400"/>}
            title="Viral Network Integration"
            desc="VALID drives exponential growth by enabling members to instantly connect their entire social graphs (Instagram, TikTok), creating a verified peer-to-peer network."
          />
          <ThesisCard 
            icon={<Lock size={24} className="text-blue-400"/>}
            title="Regulatory Liability Shift"
            desc="We legally shield venues and employers from compliance risk, making us an essential, non-optional service provider."
          />
        </div>
      </section>

      {/* 4. TRI-LAYER REVENUE STACK */}
      <section className="py-24 bg-white/5 border-y border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div>
              <h2 className="text-3xl font-bold font-orbitron mb-6">THE REVENUE <span className="text-cyan-400">STACK</span></h2>
              <p className="text-gray-400 mb-8">We capture value at every layer of the interaction.</p>
              
              <div className="space-y-4">
                 <StackItem 
                   title="1. Access Monetization" 
                   desc="High-velocity $10-$50 Incognito Tokens at the door."
                   color="cyan"
                 />
                 <StackItem 
                   title="2. Health Reseller Margin" 
                   desc="We capture the 40-60% spread between wholesale lab costs and retail pricing. We don't just refer tests; we sell them."
                   color="purple"
                 />
                 <StackItem 
                   title="3. SaaS Subscriptions" 
                   desc="Recurring monthly revenue from Venue and Corporate Partners for the compliance dashboard."
                   color="green"
                 />
              </div>
           </div>
           
           {/* Visual Stack Graphic */}
           <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-[80px] rounded-full"></div>
              <div className="relative z-10 space-y-4">
                 <div className="bg-black border border-green-500/50 p-6 rounded-xl text-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <div className="text-xs text-green-500 tracking-widest mb-1">LAYER 3</div>
                    <div className="font-bold text-xl">SaaS RECURRING</div>
                 </div>
                 <div className="bg-black border border-purple-500/50 p-6 rounded-xl text-center shadow-[0_0_30px_rgba(168,85,247,0.2)] translate-x-4">
                    <div className="text-xs text-purple-500 tracking-widest mb-1">LAYER 2</div>
                    <div className="font-bold text-xl">HEALTH MARGIN (60%)</div>
                 </div>
                 <div className="bg-black border border-cyan-500/50 p-6 rounded-xl text-center shadow-[0_0_30px_rgba(6,182,212,0.2)] translate-x-8">
                    <div className="text-xs text-cyan-500 tracking-widest mb-1">LAYER 1</div>
                    <div className="font-bold text-xl">ACCESS TOKENS</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 5. THE CFO ALERT (Money Section) */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-900/5 -skew-y-3 transform origin-left"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-cyan-500/20 p-2 rounded text-cyan-400"><DollarSign size={20}/></div>
              <span className="text-cyan-400 font-bold tracking-[0.2em] text-sm">CFO ALERT</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron">Stop Losing 1.9% to 4.5%.</h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Our <strong>Pre-Funded Wallet</strong> means users load cash <em>before</em> they arrive. When they scan at your bar, it is an instant <strong>Zero-Fee Ledger Transfer</strong>.
            </p>
          </div>
          <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/50 p-10 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] text-center">
             <h3 className="text-gray-500 text-xs uppercase mb-6 tracking-widest">Projected Annual Savings</h3>
             <div className="text-6xl md:text-7xl font-bold text-cyan-400 mb-2 font-orbitron tracking-tighter">
               $100k
             </div>
             <div className="text-xs text-cyan-500 mb-8 font-mono tracking-widest">PER $2.5M REVENUE</div>
             <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm tracking-widest rounded transition uppercase">
               Calculate Your ROI
             </button>
          </div>
        </div>
      </section>

      {/* 6. VISION ROADMAP */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
        <h2 className="text-3xl font-bold mb-12 text-center font-orbitron tracking-wide">THE VISION ROADMAP</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
           <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-gray-700 -z-10"></div>
           
           <RoadmapItem 
             phase="PHASE 1" 
             title="Foundation" 
             status="ACTIVE" 
             desc="Build core verification & payment infrastructure. Prove unit economics."
             color="cyan"
           />
           <RoadmapItem 
             phase="PHASE 2" 
             title="Network Growth" 
             status="NEXT" 
             desc="Scale to 1,000+ partner venues. Launch promoter network for viral distribution."
             color="purple"
           />
           <RoadmapItem 
             phase="PHASE 3" 
             title="Dominance" 
             status="FUTURE" 
             desc="Become the default trust layer for high-liability social and commercial interactions worldwide."
             color="gray"
           />
        </div>
      </section>

      <footer className="py-12 text-center text-xs text-gray-600 border-t border-white/10 bg-black relative z-10">
        <p>© 2025 VALID. Infrastructure for the Real World.</p>
      </footer>

    </div>
  );
};

export default Partners;
