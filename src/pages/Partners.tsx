// *****************************************************************************
// FILE: src/pages/Partners.tsx
// PURPOSE: RESTORED "Unicorn Thesis" Enterprise Page (Fixed Layout & Content)
// *****************************************************************************

import React from 'react';
import { ShieldCheck, DollarSign, Lock, Zap, Share2, CheckCircle2, TrendingUp, ArrowRight, User, FlaskConical, Fingerprint, ArrowDown, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import VibeIdEcosystem from "@/components/VibeIdEcosystem";

interface ThesisCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
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
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-[10px] font-mono tracking-[0.2em]">
          <span>POWERED BY SYNTHESIZED AI</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8),0_0_20px_rgba(59,130,246,0.5)]"></span>
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white font-orbitron drop-shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          PARTNER SOLUTIONS
        </h1>
        
        {/* The Quote */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm relative">
          <div className="text-4xl text-cyan-500 absolute top-4 left-4 font-serif">"</div>
          <p className="text-lg md:text-xl text-gray-300 italic leading-relaxed mb-6 px-4">
            Your operation faces two constant threats: <strong className="text-white">liability exposure</strong> and <strong className="text-white">entry friction</strong>. VALID eliminates both—instantly. 
            Every Ghost Token scan delivers verified access in under 3 seconds, earns you <span className="text-cyan-400">40% revenue share</span>, and shields you from every compliance risk. 
            <span className="text-cyan-400">Zero credit card fees. Zero chargebacks. Zero liability.</span>
          </p>
          <div className="text-xs font-bold text-cyan-500 uppercase tracking-widest">— What VALID Means for Your Operation</div>
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
            desc="Our zero-trust fortress evolves—synthesised AI at the helm, now weaving in next-gen QR codes far beyond 2020 basics. Think dynamic, AI-updated holograms: health records, payments, and physical access keys pulsing in real-time, self-erasing after use to eliminate replay attacks. Competitors are still fumbling with static barcodes while we embed these living codes into encrypted neural flows—raising the barrier to entry into the stratosphere. Risk-free boarding—liability sits with the users, the Labs and signatories who always held it. All they get is the key, none of the fallout. Unbreachable now, infinite later."
          />
          <ThesisCard 
            icon={<Share2 size={24} className="text-green-400"/>}
            title="Viral Network Integration"
            desc="The Vibe-ID Ecosystem transforms every member into a distribution channel. Four contextual modes—Social, Pulse, Thrill, and After Dark—adapt identity to every situation. When members share their QR at networking events, dating apps, or nightlife venues, they're marketing VALID. Each verified connection expands the social graph exponentially. Instagram, TikTok, and peer referrals become organic growth engines. We're not building users—we're embedding into the fabric of human connection itself."
          />
          <ThesisCard 
            icon={<Lock size={24} className="text-blue-400"/>}
            title="Zero-Liability Architecture"
            desc="VALID is a delivery mechanism, not a data warehouse. We hold encrypted tokens—never raw PII. Liability flows to its source: self-reported data stays with the member; lab results stay with HIPAA-certified laboratories; identity verification stays with licensed IDV providers. Your operation? Completely shielded. This isn't risk mitigation—it's risk elimination."
          />
        </div>
      </section>

      {/* THE VIBE-ID ECOSYSTEM */}
      <VibeIdEcosystem isDark={true} variant="b2b" />

      {/* LIABILITY FLOW ARCHITECTURE */}
      <section className="py-24 relative z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/5">
              <Shield size={16} className="text-blue-400" />
              <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">Zero-Liability Architecture</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4">THE LIABILITY <span className="text-blue-400">FIREWALL</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">VALID is a Portal, not a Vault. We transmit encrypted tokens—we never store raw PII. Liability stays where it belongs.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <User size={20} className="text-amber-400" />
                </div>
                <h4 className="font-bold text-white">Member Attestation</h4>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Self-reported health status, preferences, and profile data remain the <strong className="text-amber-400">legal responsibility of the member</strong>. They attest to accuracy. You simply verify the token.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <FlaskConical size={20} className="text-purple-400" />
                </div>
                <h4 className="font-bold text-white">Lab Certification</h4>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Lab results are issued by <strong className="text-purple-400">HIPAA-certified laboratories</strong>. They carry malpractice insurance. They hold the liability for result accuracy—not you.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Fingerprint size={20} className="text-green-400" />
                </div>
                <h4 className="font-bold text-white">Identity Verification</h4>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Document authentication is performed by <strong className="text-green-400">licensed IDV providers</strong> (Veriff, Onfido). They bear liability for identity fraud—not you.
              </p>
            </div>
          </div>

          {/* Bottom Summary */}
          <div className="mt-12 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-cyan-900/20 border border-cyan-500/30 p-8 rounded-2xl text-center">
            <h3 className="text-xl font-bold font-orbitron text-white mb-3">The Bottom Line</h3>
            <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
              VALID operates as a <strong className="text-cyan-400">cryptographic relay</strong>. We deliver encrypted verification tokens—never raw data. When a patron scans at your door, you receive a simple <span className="text-green-400 font-bold">VERIFIED</span> or <span className="text-red-400 font-bold">NOT VERIFIED</span> signal. No PII touches your systems. No data to breach. No compliance burden. <strong className="text-white">This is not risk mitigation—it is risk elimination.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* 4. QUAD-LAYER REVENUE STACK */}
      <section className="py-24 bg-white/5 border-y border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
           <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-orbitron mb-4">THE REVENUE <span className="text-cyan-400">STACK</span></h2>
              <p className="text-gray-400">Revolutionized By Monetizing Every Friction Point VALID Has Removed.</p>
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
              
              {/* Row 2 - Access Monetization */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4 relative z-10">
                 <StackItem 
                   title="2. Access Monetization" 
                   desc="High-velocity $10-$50 Ghost Tokens at the entry point."
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
                    desc="Entry used to cost operations money—staff, bottlenecks, lost time. Now every Ghost Token scan earns 40% instantly. Faster flow, zero friction, pure profit on every person through the door."
                    color="cyan"
                  />
                  <div className="bg-black border border-cyan-500/50 p-6 rounded-xl text-center shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col justify-center">
                     <div className="text-xs text-cyan-500 tracking-widest mb-1">LAYER 5</div>
                     <div className="font-bold text-xl">OPERATION 40% SHARE</div>
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
              Our <strong className="text-white">Pre-Funded Wallet Architecture</strong> eliminates merchant fees entirely. But here's the real game-changer: <strong className="text-green-400">every time a patron scans their Ghost Token at your entry point, your operation earns 40% of the charge</strong>. Verification isn't a cost—it's a <strong className="text-cyan-400">new revenue stream</strong>.
            </p>
          </div>
          <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)]">
             <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-white font-medium">0% Credit Card Fees for Operation</span>
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
                 <span className="text-amber-400 font-bold">40% Revenue Share Per Ghost Token Scan</span>
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

      <footer className="py-12 text-center text-xs text-gray-600 border-t border-white/10 bg-black relative z-10">
        <p>© 2025 VALID. Infrastructure for the Real World.</p>
      </footer>

    </div>
  );
};

export default Partners;
