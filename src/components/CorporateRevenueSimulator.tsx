import React from 'react';
import { Shield, ShieldCheck, Trophy, TrendingUp, Building2, DollarSign, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

const CorporateRevenueSimulator = () => {
  return (
    <section className="w-full bg-[#1a1a1a] py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase">
            REVENUE ENGINE
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-white mt-6">
            Turn Security Into Revenue
          </h2>
          <p className="text-xl text-gray-400 mt-4 max-w-3xl mx-auto">
            Per-Scan Event pricing. No upfront cost. Pay only for successful authorizations.
          </p>
        </div>

        {/* SCAN EVENT DEFINITION CALLOUT */}
        <div className="bg-gradient-to-r from-cyan-900/30 via-purple-900/20 to-cyan-900/30 border border-cyan-500/40 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
              <Zap className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">What is a Scan Event?</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong className="text-cyan-400">1 Scan Event = 1 successful authorization</strong> — either a door entry authorization OR a purchase authorization. 
                Re-scans caused by connectivity issues, user error, or staff retrying the same transaction do NOT create additional Scan Events. 
                Built-in idempotency ensures you never pay twice for the same authorization.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Tier Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          
          {/* LEFT CARD — Nightlife & Events */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 transition-all">
            {/* Top Badge */}
            <span className="inline-block bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 text-xs px-3 py-1 rounded-full mb-4">
              NIGHTLIFE & EVENTS
            </span>
            
            {/* Icon */}
            <Shield className="h-12 w-12 text-cyan-400 mb-4" />
            
            {/* Title & Subtitle */}
            <h3 className="text-2xl font-bold text-white font-orbitron">
              Clubs, Bars & Festivals
            </h3>
            <p className="text-gray-400 mt-2">
              Ghost Pass™ revenue share + per-scan fees
            </p>

            {/* Per-Scan Pricing */}
            <div className="mt-6 space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">PER-SCAN EVENT FEES</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-cyan-400 font-semibold">Door Entry</p>
                    <p className="text-2xl font-bold text-white">$0.20</p>
                    <p className="text-xs text-gray-500">per authorization</p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-400 font-semibold">Purchase/POS</p>
                    <p className="text-2xl font-bold text-white">$0.15</p>
                    <p className="text-xs text-gray-500">per authorization</p>
                  </div>
                </div>
              </div>

              {/* Volume Discounts */}
              <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
                <p className="text-xs text-cyan-400 uppercase tracking-wider mb-2">VOLUME TIERS (Door Entry)</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">0–999 scans/mo</span>
                    <span className="text-white font-semibold">$0.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">1,000–9,999</span>
                    <span className="text-white font-semibold">$0.25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">10,000–99,999</span>
                    <span className="text-white font-semibold">$0.15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">100,000+</span>
                    <span className="text-cyan-400 font-bold">$0.10</span>
                  </div>
                </div>
              </div>

              {/* Ghost Pass Revenue */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <p className="text-xs text-emerald-400 font-bold uppercase">GHOST PASS™ REVENUE SHARE</p>
                </div>
                <p className="text-2xl font-bold text-emerald-400">30%</p>
                <p className="text-xs text-gray-400 mt-1">of every Ghost Pass™ purchased at your venue</p>
              </div>
            </div>

            {/* Example Calculation */}
            <div className="mt-6 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
              <p className="text-sm text-gray-400 mb-2">
                <span className="text-white font-semibold">Example:</span> 2,000 guests/night × 4 nights/week
              </p>
              <div className="flex flex-col gap-1 text-sm">
                <p className="text-gray-400">8,000 door scans × $0.25 = <span className="text-cyan-400 font-semibold">$2,000/mo scan fees</span></p>
                <p className="text-gray-400">+ Ghost Pass™ revenue share</p>
                <p className="text-emerald-400 font-semibold mt-2">Payout: Nightly or Weekly</p>
              </div>
            </div>
          </div>

          {/* RIGHT CARD — Stadiums & Arenas (Enterprise) */}
          <div className="relative bg-gradient-to-br from-emerald-950/50 to-green-950/30 border-2 border-emerald-500/60 rounded-2xl p-8 overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.25)] animate-pulse-border">
            
            {/* ENTERPRISE Ribbon */}
            <div className="absolute top-6 -right-8 rotate-45 bg-emerald-500 text-black font-bold text-xs px-10 py-1.5 shadow-lg">
              ENTERPRISE
            </div>

            {/* Top Badge */}
            <span className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 text-xs px-3 py-1 rounded-full mb-4">
              STADIUMS & ARENAS
            </span>
            
            {/* Icon with pulse */}
            <ShieldCheck className="h-12 w-12 text-emerald-400 mb-4 animate-pulse" />
            
            {/* Title & Subtitle */}
            <h3 className="text-2xl font-bold text-white font-orbitron">
              Enterprise SaaS Model
            </h3>
            <p className="text-gray-300 mt-2">
              10,000+ attendees — Monthly SaaS + tiered per-scan pricing
            </p>

            {/* Enterprise Pricing */}
            <div className="mt-6 space-y-4">
              {/* SaaS Fee */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <p className="text-xs text-emerald-400 uppercase tracking-wider mb-2">MONTHLY PLATFORM FEE</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">$2,500</p>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Includes dashboard, analytics, API access, support</p>
              </div>

              {/* Per-Scan Pricing */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">PER-SCAN EVENT FEES</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-emerald-400 font-semibold">Door Entry</p>
                    <p className="text-2xl font-bold text-white">$0.12</p>
                    <p className="text-xs text-gray-500">per authorization</p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-400 font-semibold">Purchase/POS</p>
                    <p className="text-2xl font-bold text-white">$0.08</p>
                    <p className="text-xs text-gray-500">per authorization</p>
                  </div>
                </div>
              </div>

              {/* Volume Tiers */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-xs text-emerald-400 uppercase tracking-wider mb-2">VOLUME TIERS (Door Entry)</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">0–49,999 scans/mo</span>
                    <span className="text-white font-semibold">$0.15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">50,000–99,999</span>
                    <span className="text-white font-semibold">$0.12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">100,000–499,999</span>
                    <span className="text-white font-semibold">$0.10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">500,000+</span>
                    <span className="text-emerald-400 font-bold">$0.08</span>
                  </div>
                </div>
              </div>

              {/* Optional Add-ons */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <p className="text-xs text-purple-400 uppercase tracking-wider mb-2">OPTIONAL VERIFICATION MODULES</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Standard IDV (document)</span>
                    <span className="text-white font-semibold">$2.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Premium IDV (doc + biometric)</span>
                    <span className="text-white font-semibold">$4.00</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Stadium pays for guest verifications (not guests)</p>
              </div>
            </div>

            {/* Example Calculation */}
            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <p className="text-sm text-emerald-200 mb-2">
                <span className="text-white font-semibold">NFL Sunday:</span> 50,000 fans × 10 home games
              </p>
              <div className="flex flex-col gap-1 text-sm">
                <p className="text-gray-300">500,000 annual scans × $0.10 = <span className="text-emerald-400 font-semibold">$50,000</span></p>
                <p className="text-gray-300">+ $2,500 × 12 months = <span className="text-emerald-400 font-semibold">$30,000</span></p>
                <p className="text-emerald-400 font-bold text-lg mt-2">Total: ~$80,000/year</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Row */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-semibold">Idempotent billing — no double charges</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-semibold">60-second grace window</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-semibold">Weekly statements</span>
          </div>
        </div>

        {/* VISUAL COMPONENT 2: THE SCALE CALCULATOR ("Money Shot") */}
        <div className="bg-gradient-to-r from-black/80 via-emerald-950/30 to-black/80 border border-emerald-500/30 rounded-2xl p-8 md:p-12 text-center shadow-[0_0_50px_rgba(16,185,129,0.15)] mt-16">
          
          {/* Header */}
          <Trophy className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white font-orbitron tracking-wider">
            ENTERPRISE ECONOMICS
          </h3>
          <p className="text-gray-400 mt-2 mb-8">Per-scan pricing scales with your volume</p>

          {/* Calculation Display */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            
            {/* Box 1: Attendees */}
            <div className="bg-black/60 border border-white/20 rounded-xl px-8 py-6">
              <p className="text-4xl md:text-5xl font-bold text-white font-orbitron">500K</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-2">ANNUAL SCANS</p>
            </div>

            {/* Operator × */}
            <span className="text-3xl text-emerald-400 font-bold">×</span>

            {/* Box 2: Per-Scan */}
            <div className="bg-black/60 border border-emerald-500/30 rounded-xl px-8 py-6">
              <p className="text-3xl md:text-4xl font-bold text-emerald-400 font-orbitron">$0.10</p>
              <p className="text-xs text-emerald-400 uppercase tracking-wider mt-2">PER SCAN</p>
            </div>

            {/* Operator + */}
            <span className="text-3xl text-emerald-400 font-bold">+</span>

            {/* Box 3: SaaS */}
            <div className="bg-black/60 border border-purple-500/30 rounded-xl px-8 py-6">
              <p className="text-3xl md:text-4xl font-bold text-purple-400 font-orbitron">$30K</p>
              <p className="text-xs text-purple-400 uppercase tracking-wider mt-2">ANNUAL SAAS</p>
            </div>

            {/* Operator = */}
            <span className="text-3xl text-emerald-400 font-bold">=</span>

            {/* Box 4: Total */}
            <div className="bg-emerald-500/20 border-2 border-emerald-500/60 rounded-xl px-8 py-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <p className="text-3xl md:text-4xl font-bold text-emerald-400 font-orbitron drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">
                $80K
              </p>
              <p className="text-xs text-emerald-300 uppercase tracking-wider mt-2 font-semibold">ANNUAL REVENUE</p>
            </div>
          </div>

          {/* Payout Info */}
          <div className="mt-10 pt-8 border-t border-emerald-500/20">
            <p className="text-gray-400 text-lg">
              <span className="text-white font-semibold">Payout Cadence:</span> 
              <span className="text-emerald-400 font-bold ml-2">Weekly (default)</span>
              <span className="text-gray-500 ml-2">or Nightly (configurable)</span>
            </p>
          </div>
          
          {/* Footnote */}
          <p className="text-xs text-gray-500/70 mt-8 max-w-4xl mx-auto leading-relaxed">
            Scan Event = 1 successful authorization. Re-scans and retries do not incur additional fees. 
            Volume tiers reset monthly. Enterprise contracts available for multi-venue deployments.
          </p>
        </div>

      </div>

      {/* Custom animation for pulsing border */}
      <style>{`
        @keyframes pulse-border {
          0%, 100% {
            border-color: rgba(16, 185, 129, 0.6);
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.25);
          }
          50% {
            border-color: rgba(16, 185, 129, 0.9);
            box-shadow: 0 0 60px rgba(16, 185, 129, 0.4);
          }
        }
        .animate-pulse-border {
          animation: pulse-border 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default CorporateRevenueSimulator;
