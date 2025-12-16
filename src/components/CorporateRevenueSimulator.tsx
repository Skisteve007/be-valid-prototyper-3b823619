import React from 'react';
import { Shield, ShieldCheck, Trophy, TrendingUp } from 'lucide-react';

const CorporateRevenueSimulator = () => {
  return (
    <section className="w-full bg-black py-20 px-4 md:px-8 lg:px-12">
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
            The "Invisible Fee" Model: Zero cost to venue. Liability mitigation + operational control.
          </p>
        </div>

        {/* Pricing Tier Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
          
          {/* LEFT CARD — Tier 1: Verified Access */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 transition-all">
            {/* Top Badge */}
            <span className="inline-block bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 text-xs px-3 py-1 rounded-full mb-4">
              NIGHTLIFE & BARS
            </span>
            
            {/* Icon */}
            <Shield className="h-12 w-12 text-cyan-400 mb-4" />
            
            {/* Title & Subtitle */}
            <h3 className="text-2xl font-bold text-white font-orbitron">
              Tier 1: Verified Access
            </h3>
            <p className="text-gray-400 mt-2">
              Forensic ID Scanning + Age Verification
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Guest Verification Fee</p>
                <p className="text-3xl font-bold text-white">$1.50</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Typical Vendor Cost</p>
                <p className="text-2xl font-bold text-gray-400">$0.50–$0.75</p>
              </div>
            </div>

            {/* Profit Box */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mt-6">
              <p className="text-xs text-cyan-400 uppercase tracking-wider">NET PROFIT PER GUEST</p>
              <p className="text-4xl font-bold text-cyan-400">$0.75–$1.00</p>
            </div>

            {/* Example Calculation */}
            <p className="text-sm text-gray-500 mt-3">
              <span className="text-gray-400">Illustrative example:</span> 2,000 guests/night → $1,500–$2,000 net profit
            </p>
          </div>

          {/* RIGHT CARD — Tier 2: Fortress Protocol (FEATURED) */}
          <div className="relative bg-gradient-to-br from-emerald-950/50 to-green-950/30 border-2 border-emerald-500/60 rounded-2xl p-8 overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.25)] animate-pulse-border">
            
            {/* FLAGSHIP Ribbon */}
            <div className="absolute top-6 -right-8 rotate-45 bg-emerald-500 text-black font-bold text-xs px-10 py-1.5 shadow-lg">
              FLAGSHIP
            </div>

            {/* Top Badge */}
            <span className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 text-xs px-3 py-1 rounded-full mb-4">
              STADIUMS & ARENAS
            </span>
            
            {/* Icon with pulse */}
            <ShieldCheck className="h-12 w-12 text-emerald-400 mb-4 animate-pulse" />
            
            {/* Title & Subtitle */}
            <h3 className="text-2xl font-bold text-white font-orbitron">
              Tier 2: Fortress Protocol
            </h3>
            <p className="text-gray-300 mt-2">
              ID Verification (IDV) + Watchlist Screening (e.g., sanctions/PEP and venue deny-lists; optional expanded checks)
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Safety Surcharge</p>
                <p className="text-3xl font-bold text-white">$3.00</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Typical Vendor Cost</p>
                <p className="text-2xl font-bold text-gray-400">$1.25–$1.75</p>
              </div>
            </div>

            {/* Profit Box (EMPHASIZED) */}
            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-4 mt-6 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <p className="text-xs text-emerald-400 uppercase tracking-wider font-bold">NET PROFIT PER GUEST</p>
              <p className="text-4xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">$1.25–$1.75</p>
            </div>

            {/* Example Calculation */}
            <p className="text-sm text-emerald-300 mt-3 font-semibold">
              <span className="text-emerald-200">Illustrative example:</span> 50,000 guests/game → $62,500–$87,500 net profit
            </p>
            
            {/* Alternative deployment example */}
            <p className="text-xs text-emerald-400/70 mt-2">
              Most common deployment (restricted access / pre-clear): 10,000 pre-cleared fans/staff → $12,500–$17,500 net per enrollment cycle
            </p>
          </div>
        </div>

        {/* VISUAL COMPONENT 2: THE SCALE CALCULATOR ("Money Shot") */}
        <div className="bg-gradient-to-r from-black/80 via-emerald-950/30 to-black/80 border border-emerald-500/30 rounded-2xl p-8 md:p-12 text-center shadow-[0_0_50px_rgba(16,185,129,0.15)] mt-16">
          
          {/* Header */}
          <Trophy className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white font-orbitron tracking-wider">
            NFL SUNDAY: THE MATH
          </h3>

          {/* Calculation Display */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mt-8">
            
            {/* Box 1: Attendees */}
            <div className="bg-black/60 border border-white/20 rounded-xl px-8 py-6">
              <p className="text-4xl md:text-5xl font-bold text-white font-orbitron">50,000</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-2">ATTENDEES</p>
            </div>

            {/* Operator × */}
            <span className="text-3xl text-emerald-400 font-bold">×</span>

            {/* Box 2: Net Profit */}
            <div className="bg-black/60 border border-white/20 rounded-xl px-8 py-6">
              <p className="text-3xl md:text-4xl font-bold text-emerald-400 font-orbitron">$1.25–$1.75</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-2">NET PROFIT</p>
            </div>

            {/* Operator = */}
            <span className="text-3xl text-emerald-400 font-bold">=</span>

            {/* Box 3: Total (HERO NUMBER) */}
            <div className="bg-emerald-500/20 border-2 border-emerald-500/60 rounded-xl px-8 py-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <p className="text-3xl md:text-4xl font-bold text-emerald-400 font-orbitron drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">
                $62,500–$87,500
              </p>
              <p className="text-xs text-emerald-300 uppercase tracking-wider mt-2 font-semibold">PER GAME</p>
            </div>
          </div>

          {/* Season Projection */}
          <div className="mt-10 pt-8 border-t border-emerald-500/20">
            <p className="text-gray-400 text-lg">
              <span className="text-white font-semibold">10 Home Games</span> = 
              <span className="text-emerald-400 font-bold text-2xl ml-2">$625,000–$875,000</span>
              <span className="text-gray-500 ml-2">per season</span>
            </p>
          </div>
          
          {/* Footnote */}
          <p className="text-xs text-gray-500/70 mt-8 max-w-4xl mx-auto leading-relaxed">
            Illustrative economics shown. Vendor costs vary by verification depth (document + biometric vs document-only), watchlist scope, throughput requirements, and volume-based contract pricing.
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
