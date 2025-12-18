// *****************************************************************************
// FILE: src/pages/Partners.tsx
// PURPOSE: RESTORED "Unicorn Thesis" Enterprise Page (Fixed Layout & Content)
// *****************************************************************************

import React from 'react';
import { ShieldCheck, DollarSign, Lock, Zap, Share2, CheckCircle2, TrendingUp, ArrowRight, User, FlaskConical, Fingerprint, ArrowDown, Shield, Eye, Home, QrCode, Building2, Banknote, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import VibeIdEcosystem from "@/components/VibeIdEcosystem";
import CorporateRevenueSimulator from "@/components/CorporateRevenueSimulator";

interface ThesisCardProps {
  icon: React.ReactNode;
  title: string;
  desc: React.ReactNode;
}

interface StackItemProps {
  title: string;
  desc: string;
  color: 'cyan' | 'purple' | 'green' | 'amber';
}

interface RoadmapItemProps {
  phase: string;
  title: string;
  status: string;
  desc: string;
  color: 'cyan' | 'purple' | 'gray';
}

const ThesisCard = ({ icon, title, desc }: ThesisCardProps) => (
  <div className="bg-white/5 backdrop-blur-sm p-10 rounded-xl border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition duration-300">
    <div className="mb-6">{icon}</div>
    <h3 className="text-2xl font-bold font-orbitron mb-4 text-white tracking-wide">{title}</h3>
    <p className="text-lg text-cyan-400 leading-relaxed tracking-[0.05em]">{desc}</p>
  </div>
);

const StackItem = ({ title, desc, color }: StackItemProps) => {
  const colorClasses = {
    cyan: 'border-cyan-900/50 bg-cyan-900/10 text-cyan-400',
    purple: 'border-purple-900/50 bg-purple-900/10 text-purple-400',
    green: 'border-green-900/50 bg-green-900/10 text-green-400',
    amber: 'border-amber-900/50 bg-amber-900/10 text-amber-400',
  };
  const textClasses = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    amber: 'text-amber-400',
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]} h-full flex flex-col justify-center`}>
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
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl font-bold font-orbitron tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">VALID<sup className="text-xs text-cyan-400">™</sup></span>
            <Link 
              to="/pitch-deck" 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-full transition-all uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
            >
              <Eye className="h-3.5 w-3.5 animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              Investors
            </Link>
          </div>
          
          {/* Catchy tagline - centered */}
          <div className="hidden lg:flex items-center gap-3 text-sm font-mono tracking-wider absolute left-1/2 -translate-x-1/2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 font-bold tracking-[0.15em] text-base">IDENTITY • ACCESS</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 font-bold tracking-[0.15em] text-base">PAYMENTS • TRUST</span>
            </div>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500/50"></div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              to="/vendor-pricing" 
              className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/80 to-cyan-600/80 border border-purple-500/40 hover:border-cyan-400/60 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              <span className="text-xs font-bold text-white uppercase tracking-wider">Vendor Pricing</span>
            </Link>
            <Link 
              to="/" 
              className="group flex items-center gap-2 px-4 py-2 bg-black/60 border border-white/20 hover:border-cyan-400/60 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></div>
              <span className="text-xs font-bold text-white/80 group-hover:text-white uppercase tracking-wider">Live App</span>
              <ArrowRight className="h-3 w-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. THE BUILDER'S VISION (Hero) */}
      <header className="relative py-28 px-6 text-center z-10 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-lg border border-cyan-500/30 bg-cyan-900/10 text-cyan-400 text-xs font-mono tracking-widest">
          <span>POWERED BY SYNTHESIZED AI</span>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_10px_rgba(0,240,255,0.8),0_0_20px_rgba(0,240,255,0.5)]"></span>
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight font-orbitron drop-shadow-[0_0_30px_rgba(100,180,255,0.3)]" style={{
          background: 'linear-gradient(135deg, #E8E8E8 0%, #A0C4E8 25%, #F0F0F0 50%, #8AB4D8 75%, #D0D0D0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          PARTNER SOLUTIONS
        </h1>

        {/* Enterprise Trust Banner - Prominent */}
        <div className="bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-amber-500/10 border border-cyan-500/30 rounded-xl p-6 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 rounded-full">
              <span>🛡️</span>
              <span className="text-cyan-400 text-sm font-bold">SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-full">
              <span>🔒</span>
              <span className="text-green-400 text-sm font-bold">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-full">
              <span>🔒</span>
              <span className="text-amber-400 text-sm font-bold">CCPA Compliant</span>
            </div>
          </div>
          <p className="text-center text-lg text-white font-semibold">
            Enterprise Trust: Built for SOC 2 & GDPR compliance to win government & healthcare contracts.
          </p>
          <p className="text-center text-sm text-gray-400 mt-2">
            We check. We don't collect.
          </p>
        </div>
        
        {/* Intro Description - Updated for Conduit Messaging */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm relative">
          <div className="text-4xl text-cyan-500 absolute top-4 left-4 font-serif">"</div>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6 px-4">
            Bring privacy-first identity verification to your venues, events, and platforms. We're the <span className="text-cyan-400 font-bold">conduit</span> that keeps your customers safe — without storing their data.
            <br /><br />
            <strong className="text-white">Enterprise-Grade Security:</strong> SOC 2 Type II & GDPR compliant. Built for stadiums, healthcare systems, and government contracts.
            <br /><br />
            <strong className="text-white">Monetize Every Scan (The Streaming Model):</strong> Instead of relying solely on your own ticket sales, you earn a <span className="text-cyan-400">Royalty Payout</span> every time a VALID™ user scans into your venue. Just like a streaming service pays an artist for every play, VALID™ pays you for every entry—drawing from the global pool of active Ghost™ Pass™ holders.
            <br /><br />
            <strong className="text-white">The Result:</strong> You generate passive revenue from users who bought their pass elsewhere but chose your venue tonight. This revenue, paired with verified access in under 3 seconds, shields you from compliance risk while boosting your bottom line.
            <br /><br />
            <span className="text-cyan-400">Zero credit card fees. Zero chargebacks. Zero funding headaches.</span>
          </p>
          <div className="text-xs font-bold text-cyan-500 uppercase tracking-widest">— Partner With VALID™</div>
        </div>
      </header>

      {/* GHOST TOKEN VISUAL - 3-Layer Stack */}
      <section className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/5">
            <QrCode size={16} className="text-amber-400" />
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">How The Ghost™ Token Works</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4">NOT A TICKET. <span className="text-amber-400">A DYNAMIC INJECTION.</span></h2>
        </div>

        {/* 3-Layer Visual Stack */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4">
          
          {/* Layer 1: Payment */}
          <div className="relative group">
            <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-2xl group-hover:bg-green-500/30 transition-all"></div>
            <div className="relative bg-gradient-to-br from-green-900/40 to-green-900/20 border-2 border-green-500/50 p-6 rounded-2xl w-56 text-center transform lg:-rotate-6 lg:translate-x-8 hover:scale-105 transition-all">
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                <DollarSign size={28} className="text-green-400" />
              </div>
              <div className="text-xs font-mono text-green-400 tracking-widest mb-1">LAYER 1</div>
              <h4 className="font-bold text-white mb-1">Financial Authorization</h4>
              <p className="text-xs text-gray-400">The Payment</p>
            </div>
          </div>

          {/* Layer 2: Identity */}
          <div className="relative group z-10">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-2xl group-hover:bg-blue-500/30 transition-all"></div>
            <div className="relative bg-gradient-to-br from-blue-900/40 to-blue-900/20 border-2 border-blue-500/50 p-6 rounded-2xl w-56 text-center transform lg:-translate-y-4 hover:scale-105 transition-all">
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center">
                <Fingerprint size={28} className="text-blue-400" />
              </div>
              <div className="text-xs font-mono text-blue-400 tracking-widest mb-1">LAYER 2</div>
              <h4 className="font-bold text-white mb-1">Identity Verification</h4>
              <p className="text-xs text-gray-400">The Driver's License / Passport</p>
            </div>
          </div>

          {/* Layer 3: Health/Clearance */}
          <div className="relative group">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-2xl group-hover:bg-purple-500/30 transition-all"></div>
            <div className="relative bg-gradient-to-br from-purple-900/40 to-purple-900/20 border-2 border-purple-500/50 p-6 rounded-2xl w-56 text-center transform lg:rotate-6 lg:-translate-x-8 hover:scale-105 transition-all">
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                <ShieldCheck size={28} className="text-purple-400" />
              </div>
              <div className="text-xs font-mono text-purple-400 tracking-widest mb-1">LAYER 3</div>
              <h4 className="font-bold text-white mb-1">Health/Status Validation</h4>
              <p className="text-xs text-gray-400">The Toxicology / Clearance</p>
            </div>
          </div>

          {/* Arrow pointing to merged QR */}
          <div className="hidden lg:flex items-center px-4">
            <ArrowRight size={32} className="text-amber-400 animate-pulse" />
          </div>
          <div className="lg:hidden py-2">
            <ArrowDown size={32} className="text-amber-400 animate-bounce" />
          </div>

          {/* Merged QR Output */}
          <div className="relative group">
            <div className="absolute inset-0 bg-amber-500/30 blur-2xl rounded-3xl animate-pulse" style={{ animationDuration: '3s' }}></div>
            <div className="relative bg-gradient-to-br from-amber-900/60 to-amber-900/30 border-2 border-amber-500 p-8 rounded-3xl w-64 text-center shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:scale-105 transition-all">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-black border-2 border-amber-500/80 flex items-center justify-center relative overflow-hidden">
                {/* Layered QR visual */}
                <div className="absolute inset-0 flex flex-col">
                  <div className="h-1/3 bg-green-500/20 border-b border-green-500/30"></div>
                  <div className="h-1/3 bg-blue-500/20 border-b border-blue-500/30"></div>
                  <div className="h-1/3 bg-purple-500/20"></div>
                </div>
                <QrCode size={40} className="text-amber-400 relative z-10" />
              </div>
              <div className="text-xs font-mono text-amber-400 tracking-widest mb-2">GHOST™ TOKEN</div>
              <h4 className="font-bold text-white text-lg mb-2">3-in-1 Injection</h4>
              <p className="text-xs text-gray-300 leading-relaxed">One scan. All three signals delivered. You are <span className="text-amber-400 font-bold">Ghosted in.</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* THE CONDUIT ARCHITECTURE - How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5">
            <ShieldCheck size={16} className="text-cyan-400" />
            <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase">Privacy By Design</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4">THE CONDUIT <span className="text-cyan-400">ARCHITECTURE</span></h2>
          <p className="text-white max-w-2xl mx-auto">Unlike legacy systems that warehouse personal data for years, VALID™ operates as a secure conduit:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-b from-cyan-900/20 to-transparent border border-cyan-500/30 p-6 rounded-xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center">
              <span className="text-2xl font-bold text-cyan-400">1</span>
            </div>
            <h4 className="font-bold text-cyan-400 mb-2 font-orbitron">SCAN</h4>
            <p className="text-sm text-gray-400">User presents QR code or ID</p>
          </div>
          <div className="bg-gradient-to-b from-green-900/20 to-transparent border border-green-500/30 p-6 rounded-xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center">
              <span className="text-2xl font-bold text-green-400">2</span>
            </div>
            <h4 className="font-bold text-green-400 mb-2 font-orbitron">VERIFY</h4>
            <p className="text-sm text-gray-400">Real-time check against federal databases</p>
          </div>
          <div className="bg-gradient-to-b from-amber-900/20 to-transparent border border-amber-500/30 p-6 rounded-xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-400">3</span>
            </div>
            <h4 className="font-bold text-amber-400 mb-2 font-orbitron">CLEAR</h4>
            <p className="text-sm text-gray-400">Access granted in under 3 seconds</p>
          </div>
          <div className="bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/30 p-6 rounded-xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-400">4</span>
            </div>
            <h4 className="font-bold text-purple-400 mb-2 font-orbitron">PURGE</h4>
            <p className="text-sm text-gray-400">Data deleted immediately. Nothing stored. Ever.</p>
          </div>
        </div>

        <div className="text-center bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 border border-cyan-500/20 rounded-xl p-8">
          <p className="text-lg text-white font-semibold mb-2">This is privacy by design, not privacy by promise.</p>
          <p className="text-gray-400">We Check. We Don't Collect.</p>
        </div>
      </section>

      {/* 3. THE UNICORN THESIS (4-Card Grid) */}
      <section className="max-w-[1600px] mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-16 relative">
          {/* Slow pulsing glow effect */}
          <div className="absolute inset-0 -top-12 -bottom-12 blur-3xl bg-gradient-to-r from-purple-600/30 via-cyan-500/40 to-blue-600/30 animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute inset-0 -top-16 -bottom-16 blur-[100px] bg-gradient-to-r from-blue-500/20 via-purple-500/30 to-cyan-500/20 animate-pulse" style={{ animationDuration: '6s' }}></div>
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold font-orbitron mb-6 tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-400 drop-shadow-[0_0_40px_rgba(139,92,246,0.7)]">THE UNICORN THESIS</h2>
            <p className="text-2xl md:text-3xl text-gray-200 tracking-[0.1em] font-semibold uppercase">Why VALID is a <span className="text-cyan-400">Billion-Dollar</span> Platform</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ThesisCard 
            icon={<Zap size={32} className="text-cyan-400"/>}
            title="Not a Ticket. A Dynamic Injection."
            desc="The Ghost™ Token is not a static file. It is a secure, encrypted container that simultaneously represents three data points: Financial Authorization (The Payment), Identity Verification (The Driver's License/Passport), and Health/Status Validation (The Toxicology/Clearance). When scanned, the Token injects these three validated signals into the venue's system instantly. The venue gets the green light, the funds, and the liability shield—without ever storing your personal raw data. You are Ghosted in."
          />
          <ThesisCard
            icon={<ShieldCheck size={32} className="text-purple-400"/>}
            title="Zero-Trust Architectural Moat"
            desc="Our zero-trust fortress evolves—synthesised AI at the helm, now weaving in next-gen QR codes far beyond 2020 basics. Think dynamic, AI-updated holograms: health records, payments, and physical access keys pulsing in real-time, self-erasing after use to eliminate replay attacks. Competitors are still fumbling with static barcodes while we embed these living codes into encrypted neural flows—raising the barrier to entry into the stratosphere. Risk-free boarding—liability sits with the users, the Labs and identity authorities who always held it. All they get is the key, none of the fallout. Unbreachable now, infinite later."
          />
          <ThesisCard 
            icon={<Share2 size={32} className="text-green-400"/>}
            title="Viral Network Integration"
            desc={<>The Vibe-ID Ecosystem transforms every member into a distribution channel. Four contextual modes—<span className="text-blue-400 font-semibold">Social</span>, <span className="text-green-400 font-semibold">Pulse</span>, <span className="text-orange-400 font-semibold">Thrill</span>, and <span className="text-purple-400 font-semibold">After Dark</span>—adapt identity to every situation. When members share their QR at networking events, dating apps, or nightlife venues, they're marketing VALID. Each verified connection expands the social graph exponentially. Instagram, TikTok, and peer referrals become organic growth engines. We're not building users—we're embedding into the fabric of human connection itself.</>}
          />
          <ThesisCard 
            icon={<Lock size={32} className="text-blue-400"/>}
            title="Zero-Liability Architecture"
            desc="VALID is a delivery mechanism, not a data warehouse. We hold encrypted tokens—never raw PII. Liability flows to its source: self-reported data stays with the member; lab results stay with HIPAA-certified laboratories; identity verification stays with licensed IDV providers. Your operation? Completely shielded. This isn't risk mitigation—it's risk elimination."
          />
        </div>
      </section>

      {/* THE VIBE-ID ECOSYSTEM */}
      <VibeIdEcosystem isDark={true} variant="b2b" />

      {/* CORPORATE REVENUE SIMULATOR */}
      <CorporateRevenueSimulator />

      {/* LIABILITY FLOW ARCHITECTURE */}
      <section className="py-24 relative z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/5">
              <Shield size={16} className="text-blue-400" />
              <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">Zero-Liability Architecture</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4">THE LIABILITY <span className="text-blue-400">FIREWALL</span></h2>
            <p className="text-white max-w-2xl mx-auto">VALID is a Portal, not a Vault. We transmit encrypted tokens—we never store raw PII. Liability stays where it belongs.</p>
          </div>

          {/* Visual Flow Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center mb-16">
            {/* Source 1: Member */}
            <div className="bg-gradient-to-b from-amber-900/20 to-transparent border border-amber-500/30 p-6 rounded-xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center">
                <User size={28} className="text-amber-400" />
              </div>
              <h4 className="font-bold text-amber-400 mb-2">MEMBER</h4>
              <p className="text-xs text-gray-400">Self-reported data</p>
              <div className="mt-3 py-1 px-2 bg-amber-500/10 rounded text-[10px] text-amber-400 font-mono">
                LIABILITY: MEMBER
              </div>
            </div>

            {/* Source 2: Labs */}
            <div className="bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/30 p-6 rounded-xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center">
                <FlaskConical size={28} className="text-purple-400" />
              </div>
              <h4 className="font-bold text-purple-400 mb-2">LABS</h4>
              <p className="text-xs text-gray-400">HIPAA-certified results</p>
              <div className="mt-3 py-1 px-2 bg-purple-500/10 rounded text-[10px] text-purple-400 font-mono">
                LIABILITY: LAB PARTNER
              </div>
            </div>

            {/* Source 3: IDV Providers */}
            <div className="bg-gradient-to-b from-green-900/20 to-transparent border border-green-500/30 p-6 rounded-xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center">
                <Fingerprint size={28} className="text-green-400" />
              </div>
              <h4 className="font-bold text-green-400 mb-2">IDV PROVIDERS</h4>
              <p className="text-xs text-gray-400">Licensed identity verification</p>
              <div className="mt-3 py-1 px-2 bg-green-500/10 rounded text-[10px] text-green-400 font-mono">
                LIABILITY: IDV PARTNER
              </div>
            </div>

            {/* Arrow/VALID Token */}
            <div className="flex flex-col items-center justify-center py-8">
              <div className="hidden lg:block w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-cyan-500 relative">
                <ArrowRight className="absolute -right-1 -top-2 text-cyan-500" size={20} />
              </div>
              <div className="lg:hidden">
                <ArrowDown className="text-cyan-500 animate-bounce" size={24} />
              </div>
              <div className="mt-4 lg:mt-6 bg-black border-2 border-cyan-500 px-4 py-3 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                <div className="text-[10px] text-cyan-400 tracking-widest mb-1 text-center">VALID</div>
                <div className="font-bold text-white text-sm text-center">TOKEN ONLY</div>
              </div>
              <p className="mt-3 text-[10px] text-gray-500 text-center max-w-[120px]">Encrypted pass-through. No raw data stored.</p>
            </div>

            {/* Destination: Shielded Operation */}
            <div className="bg-gradient-to-b from-cyan-900/30 to-transparent border-2 border-cyan-500/50 p-6 rounded-xl text-center shadow-[0_0_40px_rgba(6,182,212,0.15)]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 border-2 border-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <ShieldCheck size={28} className="text-cyan-400" />
              </div>
              <h4 className="font-bold text-cyan-400 mb-2">YOUR OPERATION</h4>
              <p className="text-xs text-gray-400">Receives verified token only</p>
              <div className="mt-3 py-1 px-2 bg-cyan-500/20 rounded text-[10px] text-cyan-400 font-mono font-bold">
                LIABILITY: ZERO
              </div>
            </div>
          </div>

          {/* Expanded Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <User size={28} className="text-amber-400" />
                </div>
                <h4 className="font-bold text-xl text-white tracking-wide">Member Attestation</h4>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed tracking-[0.04em]">
                Self-reported health status, preferences, and profile data remain the <strong className="text-amber-400">legal responsibility of the member</strong>. They attest to accuracy. You simply verify the token.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <FlaskConical size={28} className="text-purple-400" />
                </div>
                <h4 className="font-bold text-xl text-white tracking-wide">Lab Certification</h4>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed tracking-[0.04em]">
                Lab results are issued by <strong className="text-purple-400">HIPAA-certified laboratories</strong>. They carry malpractice insurance. They hold the liability for result accuracy—not you.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Fingerprint size={28} className="text-green-400" />
                </div>
                <h4 className="font-bold text-xl text-white tracking-wide">Identity Verification</h4>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed tracking-[0.04em]">
                Document authentication is performed by <strong className="text-green-400">licensed IDV providers</strong> (Veriff, Onfido). They bear liability for identity fraud—not you.
              </p>
            </div>
          </div>

          {/* Bottom Summary - INVESTOR HARD-HITTING */}
          <div className="mt-16 relative overflow-hidden">
            {/* Dramatic glow background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-20 blur-xl animate-pulse" style={{ animationDuration: '3s' }}></div>
            
            <div className="relative bg-black/80 backdrop-blur-xl border-2 border-cyan-500/50 p-12 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.3)]">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-cyan-400 rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-purple-400 rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-purple-400 rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-cyan-400 rounded-br-3xl"></div>
              
              <div className="text-center">
                <div className="inline-flex items-center gap-3 mb-6 px-6 py-2 rounded-full border border-amber-500/50 bg-amber-500/10">
                  <ShieldCheck size={24} className="text-amber-400" />
                  <span className="text-amber-400 text-lg font-bold tracking-[0.2em] uppercase">The Bottom Line</span>
                </div>
                
                <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-8 tracking-[0.04em]">
                  VALID™ operates as a <strong className="text-cyan-400">cryptographic relay</strong>. We deliver encrypted verification tokens—never raw data. When a patron scans at your entry, you receive a simple <span className="text-green-400 font-bold text-3xl">VERIFIED</span> or <span className="text-red-400 font-bold text-3xl">NOT VERIFIED</span> signal.
                </p>
                
                <p className="text-xl text-gray-300 mb-8 tracking-wide">
                  No PII touches your systems. No data to breach. No compliance burden.
                </p>
                
                <div className="py-6 px-8 bg-gradient-to-r from-cyan-900/40 via-purple-900/40 to-cyan-900/40 rounded-2xl border border-white/20 mb-8 inline-block">
                  <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400 tracking-[0.06em] uppercase">
                    This is not risk mitigation—it is risk elimination.
                  </p>
                </div>
                
                <div className="pt-8 border-t border-white/10">
                  <p className="text-lg md:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed tracking-[0.04em]">
                    <strong className="text-amber-400 text-2xl">VALUE ADDITION:</strong> While PII and health data are tokenized and remain off your systems, Valid™ ensures complete loyalty program utility. Every scan still securely transfers the patron's <span className="text-white font-bold">Name</span>, <span className="text-white font-bold">Email Address</span>, and <span className="text-white font-bold">Unique Valid Member ID</span> to your CRM, guaranteeing <strong className="text-green-400 text-2xl">100% accurate customer capture</strong> for your marketing and rewards campaigns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUAD-LAYER REVENUE STACK */}
      <section className="py-24 bg-white/5 border-y border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
           <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-orbitron mb-4">THE REVENUE <span className="text-cyan-400">STACK</span></h2>
              <p className="text-gray-400">Revolutionized By Monetizing Every Friction Point VALID™ Has Removed.</p>
           </div>
           
           <div className="relative">
              {/* Background glow */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none"></div>
              
              {/* Row 1 - Member Subscriptions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4 relative z-10">
                 <StackItem 
                   title="1. Member Subscriptions" 
                   desc="Recurring revenue from peer network memberships—billed every 60 days or annually for platform access."
                   color="amber"
                 />
                 <div className="bg-black border border-amber-500/50 p-6 rounded-xl text-center shadow-[0_0_30px_rgba(245,158,11,0.2)] flex flex-col justify-center">
                    <div className="text-xs text-amber-500 tracking-widest mb-1">LAYER 1</div>
                    <div className="font-bold text-xl">MEMBER DUES</div>
                 </div>
              </div>
              
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4 relative z-10">
                 <StackItem 
                   title="2. Access Monetization" 
                   desc="High-velocity $10-$50 Ghost™ Tokens at the entry point."
                   color="cyan"
                 />
                 <div className="bg-black border border-cyan-500/50 p-6 rounded-xl text-center shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col justify-center">
                    <div className="text-xs text-cyan-500 tracking-widest mb-1">LAYER 2</div>
                    <div className="font-bold text-xl">ACCESS TOKENS</div>
                 </div>
              </div>
              
              {/* Row 3 - Health Margin */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4 relative z-10">
                 <StackItem 
                   title="3. Health Reseller Margin" 
                   desc="We capture the 40-60% spread between wholesale lab costs and retail pricing. We don't just refer tests; we sell them."
                   color="purple"
                 />
                 <div className="bg-black border border-purple-500/50 p-6 rounded-xl text-center shadow-[0_0_30px_rgba(168,85,247,0.2)] flex flex-col justify-center">
                    <div className="text-xs text-purple-500 tracking-widest mb-1">LAYER 3</div>
                    <div className="font-bold text-xl">HEALTH MARGIN (60%)</div>
                 </div>
              </div>
              
               {/* Row 4 - SaaS Subscriptions */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4 relative z-10">
                  <StackItem 
                    title="4. SaaS Subscriptions" 
                    desc="Recurring monthly revenue from Operation and Corporate Partners for the compliance dashboard."
                    color="green"
                  />
                  <div className="bg-black border border-green-500/50 p-6 rounded-xl text-center shadow-[0_0_30px_rgba(16,185,129,0.2)] flex flex-col justify-center">
                     <div className="text-xs text-green-500 tracking-widest mb-1">LAYER 4</div>
                     <div className="font-bold text-xl">SaaS RECURRING</div>
                 </div>
              </div>
              
               {/* Row 5 - Operation Profit Share */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                   <StackItem 
                     title="5. Operation Profit Share" 
                     desc="Entry used to cost operations money—staff, bottlenecks, lost time. Now every Ghost™ Token scan earns 30% instantly. Faster flow, zero friction, pure profit on every person through the door."
                     color="cyan"
                   />
                   <div className="bg-black border border-cyan-500/50 p-6 rounded-xl text-center shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col justify-center">
                      <div className="text-xs text-cyan-500 tracking-widest mb-1">LAYER 5</div>
                      <div className="font-bold text-xl">OPERATION 30% SHARE</div>
                      <div className="text-xs text-gray-400 mt-1">Cost Center → Profit Center</div>
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
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-cyan-500/20 p-2 rounded text-cyan-400"><DollarSign size={20}/></div>
              <span className="text-cyan-400 font-bold tracking-[0.2em] text-sm">CFO ALERT</span>
            </div>
            <p className="text-amber-400 font-bold text-sm tracking-wide mb-4 uppercase">From Cost Center to Profit Center</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron">Stop Losing Money. Start Making It.</h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
               The <strong className="text-white">Pre-Funded Wallet Architecture</strong> eliminates merchant fees entirely. But here's the real game-changer: <strong className="text-green-400">Every time a patron purchases a Ghost™ QR Code Pass, your operation earns 30% of the entire pass pool</strong>—not a fraction of a transaction fee, but <strong className="text-cyan-400">30% of the full token value deposited into the pool</strong>. Verification isn't a cost—it's a <strong className="text-amber-400">new, massive revenue stream</strong>.
            </p>
          </div>
          <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)]">
             <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                     <CheckCircle2 className="h-4 w-4 text-green-400" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-white font-medium">0% Credit Card Fees for Operation</span>
                     <span className="text-xs text-gray-400">Currently paying 1.9–4% on every swipe? That ends here.</span>
                   </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-white font-medium">100% Chargeback Immunity</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-white font-medium">Instant Funds Verification</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-amber-400 font-bold">30% Revenue Share Per Ghost™ Pass Purchase</span>
                    <span className="text-xs text-gray-400">Your cut from the global pass pool—every patron who scans in generates revenue.</span>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-cyan-400 font-bold">Verification = New Profit Center</span>
               </div>
              </div>
             <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm tracking-widest rounded transition uppercase flex items-center justify-center gap-2">
               Request Wallet Integration Demo
               <ArrowRight className="h-4 w-4" />
             </button>
          </div>
        </div>
      </section>

      {/* SMART-SPLIT REVENUE ENGINE */}
      <section className="py-24 relative z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/5">
              <DollarSign size={16} className="text-amber-400" />
              <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">Automated Revenue</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4">TURN PROMOTERS INTO <span className="text-amber-400">REVENUE PARTNERS</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">Automated Attribution. Instant Payouts. Zero Leakage.</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm mb-12">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Stop calculating promoter commissions on spreadsheets at 4 AM. VALID's <strong className="text-amber-400">"Smart-Split" Engine</strong> handles the entire flow automatically.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Door Revenue */}
              <div className="bg-gradient-to-b from-cyan-900/20 to-transparent border border-cyan-500/30 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center">
                    <QrCode size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-cyan-400 text-lg">Door Revenue (Access)</h4>
                    <span className="text-xs text-gray-400">Ghost Pass™ Sales</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Promoters earn a fixed <strong className="text-cyan-400">10% on every Ghost Pass™ they sell</strong>. You get verified foot traffic without paying a cent out of pocket.
                </p>
                <div className="mt-4 py-2 px-3 bg-cyan-500/10 rounded text-sm text-cyan-400 font-mono">
                  10% OFF TOP → PROMOTER WALLET
                </div>
              </div>

              {/* Bar Revenue */}
              <div className="bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/30 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center">
                    <TrendingUp size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-400 text-lg">Bar Revenue (Spend)</h4>
                    <span className="text-xs text-gray-400">POS Commissions</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Want to attract top-tier hosts? Toggle on <strong className="text-purple-400">"Spend Commission"</strong> in your dashboard. If their VIP spends $5,000, the system automatically routes their cut instantly.
                </p>
                <div className="mt-4 py-2 px-3 bg-purple-500/10 rounded text-sm text-purple-400 font-mono">
                  0-20% CONFIGURABLE → INSTANT PAYOUT
                </div>
              </div>
            </div>
          </div>

          {/* Zero Fraud Callout */}
          <div className="bg-black border-2 border-amber-500/50 p-6 rounded-xl text-center shadow-[0_0_30px_rgba(251,191,36,0.15)]">
            <div className="flex items-center justify-center gap-3 mb-3">
              <ShieldCheck size={24} className="text-amber-400" />
              <h4 className="font-bold text-white text-xl">Zero Fraud</h4>
            </div>
            <p className="text-gray-300 max-w-xl mx-auto">
              Attribution is <strong className="text-amber-400">hard-coded to the user's Vibe-ID</strong>. No fake lists, no arguments. The blockchain of nightlife commissions.
            </p>
          </div>
        </div>
      </section>

      {/* THE COST OF ZERO RISK: YOUR INVESTMENT IS $0 */}
      <section className="py-24 relative z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4 text-white">
              THE COST OF ZERO RISK: <span className="text-emerald-400">Your Investment is $0</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              VALID™ users arrive fully verified, screened, and ready to spend. We eliminate your #1 cost: customer identity verification.
            </p>
          </div>

          {/* Zero Cost Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* $0 Identity Cost */}
            <div className="p-8 bg-white/5 rounded-xl border border-emerald-400/50 hover:border-emerald-400 transition-colors">
              <h3 className="text-5xl font-extrabold text-emerald-400 mb-4">$0.00</h3>
              <p className="text-lg font-bold text-white mb-3">Identity Verification Cost</p>
              <p className="text-sm text-gray-400">The user pays VALID™ directly for their High-Assurance Status. Your liability is instantly eliminated for free.</p>
            </div>

            {/* 100% Compliance Transfer */}
            <div className="p-8 bg-white/5 rounded-xl border border-white/20 hover:border-white/40 transition-colors">
              <h3 className="text-5xl font-extrabold text-white mb-4">100%</h3>
              <p className="text-lg font-bold text-white mb-3">Compliance & Liability Transfer</p>
              <p className="text-sm text-gray-400">We manage the full Passport/AML screening via Tier 1 vendors. You focus on serving the customer.</p>
            </div>

            {/* Ghost Token Revenue */}
            <div className="p-8 bg-white/5 rounded-xl border border-white/20 hover:border-cyan-400/50 transition-colors">
              <h3 className="text-2xl font-extrabold text-cyan-400 mb-4">Ghost™ Token™ Revenue</h3>
              <p className="text-lg font-bold text-white mb-3">The True Profit Engine</p>
              <p className="text-sm text-gray-400">You earn a commission on every $10-$50 Ghost™ Token™ purchased by this verified user inside your operation.</p>
            </div>
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
              desc="Scale to 1,000+ partner operations. Launch promoter network for viral distribution."
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

      {/* ===== BEYOND THE QR: SENSING ROADMAP ===== */}
      <section className="py-20 border-t border-white/10 bg-gradient-to-b from-transparent via-purple-950/5 to-black/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block bg-purple-600/30 text-purple-400 border border-purple-600/50 text-sm px-5 py-1.5 rounded-full tracking-widest mb-4">POST-OPTICAL ERA</span>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Beyond The QR: The Sensing Roadmap
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
              QR codes are <span className="text-white font-bold">optical</span>—they require a camera, light, and aiming. 
              The future is <span className="text-cyan-400 font-bold">spatial</span> and <span className="text-purple-400 font-bold">ambient</span>—technology that <em>senses</em> you.
            </p>
          </div>

          {/* Three Technologies Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            
            {/* UWB - The Spatial Key */}
            <div className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border border-cyan-500/40 rounded-xl p-6 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:border-cyan-400/60 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <Zap className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-orbitron">UWB</h3>
                  <p className="text-xs text-cyan-400/80 font-semibold">Ultra-Wideband</p>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">AKA "The Spatial Key"</p>
              <p className="text-sm text-gray-300 mb-4">Phone stays in pocket. Walk through the Portal. Venue sensor handshakes instantly—knows you're exactly 3 inches from the door.</p>
              
              <div className="bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-1.5 inline-block">
                <span className="text-sm font-bold text-cyan-400 tracking-wider">ZERO-CLICK ACCESS</span>
              </div>
            </div>

            {/* NFC Type-F - The Millisecond Tap */}
            <div className="bg-gradient-to-br from-purple-950/50 to-pink-950/50 border border-purple-500/40 rounded-xl p-6 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:border-purple-400/60 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <QrCode className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-orbitron">NFC TYPE-F</h3>
                  <p className="text-xs text-purple-400/80 font-semibold">FeliCa Protocol</p>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">AKA "The Millisecond Tap"</p>
              <p className="text-sm text-gray-300 mb-4">0.1 second tap. Works offline. Tokyo subway speed for festivals and stadiums—synapse firing on contact.</p>
              
              <div className="bg-purple-500/20 border border-purple-500/40 rounded-full px-4 py-1.5 inline-block">
                <span className="text-sm font-bold text-purple-400 tracking-wider">HARD-LINK VERIFICATION</span>
              </div>
            </div>

            {/* Biometric Hashing - You Are The Wallet */}
            <div className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 border border-green-500/40 rounded-xl p-6 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:border-green-400/60 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <Fingerprint className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-orbitron">BIO-HASH</h3>
                  <p className="text-xs text-green-400/80 font-semibold">Tokenized Biology</p>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">AKA "You Are The Wallet"</p>
              <p className="text-sm text-gray-300 mb-4">Face/palm scanned locally, converted to encrypted hash. Look at kiosk, door opens. No phone required.</p>
              
              <div className="bg-green-500/20 border border-green-500/40 rounded-full px-4 py-1.5 inline-block">
                <span className="text-sm font-bold text-green-400 tracking-wider">TOKENIZED BIOLOGY</span>
              </div>
            </div>
          </div>

          {/* Timeline: Today → Tomorrow */}
          <div className="bg-gradient-to-r from-black/60 via-black/40 to-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.9)] animate-pulse"></div>
                <p className="text-base text-cyan-400 font-bold tracking-widest">TODAY</p>
                <p className="text-2xl md:text-3xl font-bold text-white font-orbitron">You scan to enter</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden md:block h-1 w-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
                <ArrowRight className="h-10 w-10 text-gray-400" />
                <div className="hidden md:block h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>
              <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full md:hidden"></div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.9)] animate-pulse"></div>
                <p className="text-base text-purple-400 font-bold tracking-widest">TOMORROW</p>
                <p className="text-2xl md:text-3xl font-bold text-white font-orbitron">You simply walk through</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                VALID™ is not just a QR app—we are the <span className="text-cyan-400 font-bold">universal operating system for spatial identity</span>.
              </p>
            </div>
          </div>

          {/* View Full Roadmap Link */}
          <div className="text-center">
            <Link 
              to="/pitch-deck" 
              className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors group bg-cyan-500/10 border border-cyan-500/30 rounded-full px-6 py-3 hover:bg-cyan-500/20"
            >
              <span>View Full Technical Roadmap</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FINANCIAL ARCHITECTURE - Where Is The Money Sitting? */}
      <section className="py-24 relative z-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/5">
              <Banknote size={16} className="text-green-400" />
              <span className="text-green-400 text-xs font-bold tracking-widest uppercase">Financial Trust & Payouts</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4">WHERE IS THE <span className="text-green-400">MONEY</span> SITTING?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Your revenue is secure. All Ghost™ Token funds are held in a regulated FBO (For Benefit Of) Custodial Account at a Tier-1 US Bank.</p>
          </div>

          {/* Flow Diagram: User → Bank → Venue */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-4 mb-12">
            
            {/* Step 1: User Purchase */}
            <div className="relative group">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-2xl group-hover:bg-cyan-500/30 transition-all"></div>
              <div className="relative bg-gradient-to-br from-cyan-900/40 to-cyan-900/20 border-2 border-cyan-500/50 p-6 rounded-2xl w-56 text-center hover:scale-105 transition-all">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
                  <User size={28} className="text-cyan-400" />
                </div>
                <div className="text-xs font-mono text-cyan-400 tracking-widest mb-1">STEP 1</div>
                <h4 className="font-bold text-white mb-1">Ghost™ Token Purchase</h4>
                <p className="text-xs text-gray-400">Member buys access pass</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center px-2">
              <ArrowRight size={28} className="text-green-400 animate-pulse" />
            </div>
            <div className="lg:hidden py-2">
              <ArrowDown size={28} className="text-green-400 animate-bounce" />
            </div>

            {/* Step 2: The Bank Vault */}
            <div className="relative group z-10">
              <div className="absolute inset-0 bg-green-500/30 blur-2xl rounded-3xl animate-pulse" style={{ animationDuration: '3s' }}></div>
              <div className="relative bg-gradient-to-br from-green-900/60 to-green-900/30 border-2 border-green-500 p-8 rounded-3xl w-64 text-center shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:scale-105 transition-all">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/20 border-2 border-green-500/80 flex items-center justify-center">
                  <Building2 size={36} className="text-green-400" />
                </div>
                <div className="text-xs font-mono text-green-400 tracking-widest mb-2">STEP 2</div>
                <h4 className="font-bold text-white text-lg mb-2">Segregated FBO Vault</h4>
                <p className="text-xs text-gray-300 leading-relaxed">Funds legally segregated from VALID™ operational capital</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center px-2">
              <ArrowRight size={28} className="text-green-400 animate-pulse" />
            </div>
            <div className="lg:hidden py-2">
              <ArrowDown size={28} className="text-green-400 animate-bounce" />
            </div>

            {/* Step 3: Venue Payout */}
            <div className="relative group">
              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-2xl group-hover:bg-amber-500/30 transition-all"></div>
              <div className="relative bg-gradient-to-br from-amber-900/40 to-amber-900/20 border-2 border-amber-500/50 p-6 rounded-2xl w-56 text-center hover:scale-105 transition-all">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
                  <Banknote size={28} className="text-amber-400" />
                </div>
                <div className="text-xs font-mono text-amber-400 tracking-widest mb-1">STEP 3</div>
                <h4 className="font-bold text-white mb-1">Instant Payout via RTP</h4>
                <p className="text-xs text-gray-400">Real-Time Payment to your account</p>
              </div>
            </div>
          </div>

          {/* Explanation Card */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm mb-6">
            <p className="text-gray-300 leading-relaxed">
              <span className="text-green-400 font-bold">Your revenue is secure.</span> All Ghost™ Token funds are held in a regulated <span className="text-white font-semibold">FBO (For Benefit Of) Custodial Account</span> at a Tier-1 US Bank. These funds are legally segregated from VALID™ operational capital. When you see your balance, the money is already in the vault, ready for instant <span className="text-cyan-400 font-semibold">Real-Time Payment (RTP)</span> transfer to your corporate account.
            </p>
          </div>

          {/* POS Note */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <CreditCard size={20} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200/90">
              <span className="font-bold text-amber-400">Bar & Concessions:</span> Point-of-Sale transactions (Drinks/VIP) settle instantly to your dedicated wallet, bypassing the weekly entry pool.
            </p>
          </div>
        </div>
      </section>

      {/* Schedule a Call CTA */}
      <section className="py-16 relative z-10 bg-gradient-to-b from-transparent to-cyan-950/20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4 text-white">Ready to Partner?</h2>
          <p className="text-gray-400 mb-8 text-lg">Schedule a 30-minute call with our team to discuss how VALID™ can transform your operation.</p>
          <button
            onClick={() => window.open('https://calendly.com/steve-bevalid/30min', '_blank')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] text-lg tracking-wider"
          >
            Book a Call
          </button>
        </div>
      </section>

      <footer className="py-8 text-center text-xs text-gray-600 border-t border-white/10 bg-black relative z-10">
        <p>© 2025 VALID™. Infrastructure for the Real World.</p>
      </footer>

    </div>
  );
};

export default Partners;
