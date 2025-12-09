import React from 'react';
import { ShieldCheck, Activity, Users, Truck, Lock, Code, Zap, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Partners = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* 1. B2B HEADER */}
      <nav className="border-b border-gray-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold font-orbitron tracking-widest text-white">VALID</span>
            <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">PARTNER SOLUTIONS</span>
          </div>
          <div className="flex gap-4">
            <button className="text-sm text-gray-400 hover:text-white">Investor Relations</button>
            <Link to="/" className="px-4 py-2 bg-white text-black text-sm font-bold rounded hover:bg-gray-200 transition">
              Back to App
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. VISION HERO */}
      <header className="py-20 px-6 text-center">
        <div className="inline-block mb-4 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-mono tracking-widest">
          POWERED BY SYNTHESIZED AI
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          The Builder's Vision.
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
          Automated Compliance and Risk Management for High-Liability Sectors.
          <br />Shield your organization from health, security, and compliance liability.
        </p>
      </header>

      {/* 3. THE CFO SECTION (Money & Savings) */}
      <section className="bg-gray-900/30 border-y border-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="text-green-400" />
              <span className="text-green-400 font-bold tracking-widest">CFO ALERT</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Eliminate Merchant Fees.</h2>
            <p className="text-gray-400 mb-6">
              Stop losing 4% on every swipe. Our Pre-Funded Wallet Architecture creates a 
              <strong> Zero-Fee Ledger Transfer</strong> at your door.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-500"/> 0% Credit Card Fees</div>
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-500"/> No Chargebacks</div>
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-500"/> Instant Verification</div>
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-500"/> +4% Margin Boost</div>
            </div>
          </div>
          {/* ROI Calculator Card */}
          <div className="bg-black border border-green-500/30 p-8 rounded-xl shadow-[0_0_30px_rgba(0,255,0,0.1)] text-center">
            <h3 className="text-gray-500 text-xs uppercase mb-2">Annual Savings Calculator</h3>
            <div className="text-4xl font-bold text-white mb-1">$100,000+</div>
            <div className="text-xs text-green-400 mb-6">SAVED PER $2.5M REVENUE</div>
            <button className="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold text-sm">
              View ROI Details
            </button>
          </div>
        </div>
      </section>

      {/* 4. INDUSTRY CARDS (The Grid) */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Choose Your Industry</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* CARD 1: FINTECH & INTEGRATION (The Tech) */}
          <div className="bg-gray-900 p-6 rounded-xl border border-blue-500/30 hover:border-blue-500 transition group flex flex-col">
            <div className="mb-4 bg-black w-12 h-12 rounded-lg flex items-center justify-center text-blue-400"><Code /></div>
            <h3 className="text-xl font-bold mb-1 text-blue-400">Fintech & Integration</h3>
            <p className="text-sm text-gray-400 italic mb-4">"Plug into our ecosystem. Get paid instantly."</p>
            <ul className="text-sm space-y-2 mb-6 text-gray-300 flex-1">
              <li>• Bank-Grade Security (SOC 2, PCI DSS)</li>
              <li>• Zero-Friction REST API</li>
              <li>• Instant Payment Settlement (RTP)</li>
            </ul>
            <div className="space-y-2">
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold text-xs">REQUEST INTEGRATION SPECS</button>
              <button className="w-full py-2 border border-gray-600 hover:bg-gray-800 rounded text-gray-300 font-bold text-xs">VIEW API DOCUMENTATION</button>
            </div>
          </div>

          {/* CARD 2: LAB ACCESS PORTAL (The Health) */}
          <div className="bg-gray-900 p-6 rounded-xl border border-teal-500/30 hover:border-teal-500 transition group flex flex-col">
            <div className="mb-4 bg-black w-12 h-12 rounded-lg flex items-center justify-center text-teal-400"><Activity /></div>
            <h3 className="text-xl font-bold mb-1 text-teal-400">Lab Access Portal</h3>
            <p className="text-sm text-gray-400 italic mb-4">"Integrated Health Compliance."</p>
            <ul className="text-sm space-y-2 mb-6 text-gray-300 flex-1">
              <li>• Access Exclusive Affiliate Communities</li>
              <li>• FHIR-Compatible Integration</li>
              <li>• Auto-Compliance (HIPAA/GDPR)</li>
            </ul>
            <Link to="/lab-portal" className="w-full py-2 bg-teal-600 hover:bg-teal-500 rounded text-white font-bold text-xs mt-auto block text-center">ACCESS LAB PORTAL →</Link>
          </div>

          {/* CARD 3: NIGHTLIFE & EVENTS */}
          <div className="bg-gray-900 p-6 rounded-xl border border-purple-500/30 hover:border-purple-500 transition group flex flex-col">
            <div className="mb-4 bg-black w-12 h-12 rounded-lg flex items-center justify-center text-purple-400"><Zap /></div>
            <h3 className="text-xl font-bold mb-1 text-purple-400">Nightlife & Events</h3>
            <p className="text-sm text-gray-400 italic mb-4">"Monetize the Door. Verify the Vibe."</p>
            <div className="mb-4 space-y-2 flex-1">
               <div className="text-xs text-gray-400">Promoter Tier: <span className="text-white">$299/mo</span></div>
               <div className="text-xs text-gray-400">Club Tier: <span className="text-white">$999/mo</span></div>
            </div>
            <div className="space-y-2">
              <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded text-white font-bold text-xs">ACTIVATE TIER 1</button>
              <button className="w-full py-2 border border-gray-600 hover:bg-gray-800 rounded text-gray-300 font-bold text-xs">REQUEST MEGA-CLUB CONTRACT</button>
            </div>
          </div>

          {/* CARD 4: TRANSPORTATION & FLEETS */}
          <div className="bg-gray-900 p-6 rounded-xl border border-orange-500/30 hover:border-orange-500 transition group flex flex-col">
            <div className="mb-4 bg-black w-12 h-12 rounded-lg flex items-center justify-center text-orange-400"><Truck /></div>
            <h3 className="text-xl font-bold mb-1 text-orange-400">Transportation & Fleets</h3>
            <p className="text-sm text-gray-400 italic mb-4">"Protect the asset. Continuous screening."</p>
            <div className="mb-4 space-y-2 flex-1">
               <div className="text-xs text-gray-400">Fleet License: <span className="text-white">$299/mo</span></div>
               <div className="text-xs text-gray-400">Driver Pass: <span className="text-white">$119 One-Time</span></div>
            </div>
            <div className="space-y-2">
              <button className="w-full py-2 bg-orange-600 hover:bg-orange-500 rounded text-white font-bold text-xs">ACTIVATE FLEET TIER 1</button>
              <button className="w-full py-2 border border-gray-600 hover:bg-gray-800 rounded text-gray-300 font-bold text-xs">BUY DRIVER PASS ($119)</button>
            </div>
          </div>

          {/* CARD 5: WORKFORCE MANAGEMENT */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-500/30 hover:border-gray-500 transition group flex flex-col">
            <div className="mb-4 bg-black w-12 h-12 rounded-lg flex items-center justify-center text-gray-400"><Users /></div>
            <h3 className="text-xl font-bold mb-1 text-gray-300">Workforce Management</h3>
            <p className="text-sm text-gray-400 italic mb-4">"Connect your team. Monitor the data."</p>
            <div className="mb-4 space-y-2 flex-1">
               <div className="text-xs text-gray-400">Small (1-50): <span className="text-white">$399/mo</span></div>
               <div className="text-xs text-gray-400">Enterprise: <span className="text-white">$1,299/mo</span></div>
            </div>
            <div className="space-y-2">
              <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-bold text-xs">ACTIVATE TIER 1</button>
              <button className="w-full py-2 border border-gray-600 hover:bg-gray-800 rounded text-gray-300 font-bold text-xs">ORDER 10-PACK ($890)</button>
            </div>
          </div>

           {/* CARD 6: TALENT & CONTENT */}
           <div className="bg-gray-900 p-6 rounded-xl border border-pink-500/30 hover:border-pink-500 transition group flex flex-col">
            <div className="mb-4 bg-black w-12 h-12 rounded-lg flex items-center justify-center text-pink-400"><Lock /></div>
            <h3 className="text-xl font-bold mb-1 text-pink-400">Talent & Content</h3>
            <p className="text-sm text-gray-400 italic mb-4">"The Industry Standard for Talent."</p>
            <ul className="text-sm space-y-2 mb-6 text-gray-300 flex-1">
              <li>• Verified Safety for Bookings</li>
              <li>• Digital Handshake</li>
              <li>• Auto-Renewal (60 Days)</li>
            </ul>
            <button className="w-full py-2 bg-pink-600 hover:bg-pink-500 rounded text-white font-bold text-xs mt-auto">ACTIVATE TALENT PASS ($39)</button>
          </div>

        </div>
      </section>

      {/* 5. STRATEGIC PARTNER (Footer) */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 text-center">
        <h2 className="text-3xl font-bold mb-6">Strategic Partner Program</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Connect venues, refer members, and transform your influence into income via our <span className="text-white font-bold">Dual Revenue Model</span>.
        </p>
        <button className="px-10 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-200">
          APPLY FOR PARTNERSHIP
        </button>
      </section>

    </div>
  );
};

export default Partners;
