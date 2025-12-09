import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useReferralTracking } from "@/hooks/useReferralTracking";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

const Index = () => {
  const navigate = useNavigate();
  useReferralTracking();

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* 1. HERO SECTION (The Portal Video) */}
      <Hero />

      {/* 2. THE ECOSYSTEM (Value Prop) - Updated to Cyan Theme */}
      <section className="py-16 bg-black text-center px-4 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-cyan-900/10 blur-[100px] -z-10"></div>
        
        <h2 className="text-3xl font-bold mb-4 font-orbitron tracking-wide text-white">
          THE VALID ECOSYSTEM
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Share your verified status with peers and authorized venues using a single tap. 
          You are always in control of what data is shared.
        </p>
      </section>

      {/* 3. STEP 1: MEMBERSHIP (Required) - Updated to Cyan/Blue */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 border border-cyan-500/30 text-cyan-400 rounded-full text-[10px] font-mono tracking-widest uppercase">
            Phase 1
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-2 font-orbitron text-white">
            ACTIVATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">MEMBERSHIP</span>
          </h2>
          <p className="text-gray-400">Required for App Access & Profile Creation.</p>
        </div>

        {/* PRICING GRID (Cyan/Holographic Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PricingCard 
            title="Single Member" 
            price="$19.50" 
            period="Per 60 Days" 
            originalPrice="$39"
            tag="50% OFF"
            isBeta={true}
          />
          <PricingCard 
            title="Joint/Couple" 
            price="$34.50" 
            period="Per 60 Days" 
            originalPrice="$69"
            tag="50% OFF"
            isBeta={true}
          />
          <PricingCard 
            title="Single One Year" 
            price="$64.50" 
            period="One-time payment" 
            originalPrice="$129"
            tag="BEST VALUE"
            isBeta={true}
            isGold={true}
          />
          <PricingCard 
            title="Couple One Year" 
            price="$109.50" 
            period="One-time payment" 
            originalPrice="$219"
            tag="BEST VALUE"
            isBeta={true}
            isGold={true}
          />
        </div>
      </section>

      {/* 4. STEP 2: VERIFICATION (Optional) - Updated to Purple/Cyan */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-gray-900 border-t border-white/5">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 border border-purple-500/30 text-purple-400 rounded-full text-[10px] font-mono tracking-widest uppercase">
            Phase 2 (Optional)
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-2 font-orbitron text-white">
            GET <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">VERIFIED</span>
          </h2>
          <p className="text-gray-400">Upgrade to Lab-Certified Status. Shipped to your door.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* LAB KIT 1: TOXICOLOGY */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-cyan-500 transition duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-cyan-600 text-xs font-bold px-4 py-2 text-black">LAB-CERTIFIED</div>
            <h3 className="text-2xl font-bold mb-2 font-orbitron text-white">10-Panel Toxicology</h3>
            <div className="text-5xl font-bold text-white mb-6">$129.00</div>
            <ul className="text-sm text-gray-400 space-y-3 mb-8 font-mono">
              <li className="flex gap-3 items-center"><Check size={16} className="text-cyan-400"/> Verified Drug Screen</li>
              <li className="flex gap-3 items-center"><Check size={16} className="text-cyan-400"/> Digital Badge Update</li>
            </ul>
            <button 
              onClick={() => navigate("/toxicology-kit-order")}
              className="w-full py-4 bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black rounded font-bold transition uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              ORDER TOX KIT
            </button>
          </div>

          {/* LAB KIT 2: HEALTH SCREEN */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-purple-500 transition duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-purple-600 text-xs font-bold px-4 py-2 text-white">PLATINUM</div>
            <h3 className="text-2xl font-bold mb-2 font-orbitron text-white">13-Panel Sexual Health</h3>
            <div className="text-5xl font-bold text-white mb-6">$249.00</div>
            <ul className="text-sm text-gray-400 space-y-3 mb-8 font-mono">
              <li className="flex gap-3 items-center"><Check size={16} className="text-purple-400"/> Full STD Panel</li>
              <li className="flex gap-3 items-center"><Check size={16} className="text-purple-400"/> Certified Health Badge</li>
            </ul>
            <button 
              onClick={() => navigate("/health-panel-order")}
              className="w-full py-4 bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded font-bold transition uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            >
              ORDER HEALTH KIT
            </button>
          </div>

        </div>
      </section>

      {/* 5. FOOTER (Single Instance) */}
      <Footer /> 
    </div>
  );
};

// --- HELPER COMPONENT FOR PRICING CARDS (Cyan Theme) ---
interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  originalPrice: string;
  tag: string;
  isBeta?: boolean;
  isGold?: boolean;
}

const PricingCard = ({ title, price, period, originalPrice, tag, isBeta, isGold }: PricingCardProps) => (
  <div className={`bg-black/40 backdrop-blur-xl p-8 rounded-2xl border relative transition-all duration-500 hover:-translate-y-2 group
    ${isGold 
      ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(0,240,255,0.15)] hover:border-cyan-400 hover:shadow-[0_0_50px_rgba(0,240,255,0.3)]' 
      : 'border-cyan-500/20 hover:border-cyan-400/60 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]'}`}>
    
    {/* Tag */}
    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg
      ${isGold ? 'bg-cyan-500 text-black' : 'bg-cyan-600/80 text-white'}`}>
      {tag}
    </div>

    {/* Beta Warning */}
    {isBeta && <div className="text-cyan-400 text-[10px] font-bold tracking-[0.2em] text-center mt-2 mb-4 animate-pulse">⚡ BETA PRICING ⚡</div>}

    <h3 className="text-lg font-bold text-gray-300 mb-2 font-orbitron group-hover:text-white transition-colors">{title}</h3>
    
    <div className="flex items-end justify-center gap-2 mb-1">
      <span className="text-gray-600 line-through text-lg">{originalPrice}</span>
      <span className="text-4xl font-bold text-white group-hover:text-cyan-400 transition-colors">{price}</span>
    </div>
    <div className="text-xs text-gray-500 mb-8 uppercase tracking-wider">{period}</div>

    <button className={`w-full py-3 rounded font-bold transition-all duration-300 uppercase tracking-widest text-xs
      ${isGold 
        ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]' 
        : 'bg-transparent border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]'}`}>
      SELECT PLAN
    </button>

    {isBeta && <div className="text-cyan-500 text-[10px] font-bold text-center mt-4">🔥 Limited Time!</div>}
  </div>
);

export default Index;
