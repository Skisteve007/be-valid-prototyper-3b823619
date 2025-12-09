import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useReferralTracking } from "@/hooks/useReferralTracking";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

const Index = () => {
  const navigate = useNavigate();
  useReferralTracking();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      
      {/* 1. HERO SECTION (Neon Green Holographic Card) */}
      <Hero />

      {/* 2. VALUE PROP */}
      <section className="py-12 bg-gray-900/50 text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-orbitron">The VALID Ecosystem</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Share your verified status with peers and authorized venues using a single tap. 
          You are always in control of what data is shared.
        </p>
      </section>

      {/* 3. STEP 1: MEMBERSHIP */}
      <section className="py-16 md:py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 font-orbitron text-blue-500">STEP 1: ACTIVATE MEMBERSHIP</h2>
          <p className="text-gray-400">Required for App Access & Profile Creation.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PricingCard title="Single Member" price="$19.50" period="Per 60 Days" originalPrice="$39" tag="50% OFF" isBeta={true} />
          <PricingCard title="Joint/Couple" price="$34.50" period="Per 60 Days" originalPrice="$69" tag="50% OFF" isBeta={true} />
          <PricingCard title="Single One Year" price="$64.50" period="One-time payment" originalPrice="$129" tag="BEST VALUE" isBeta={true} isGold={true} />
          <PricingCard title="Couple One Year" price="$109.50" period="One-time payment" originalPrice="$219" tag="BEST VALUE" isBeta={true} isGold={true} />
        </div>
      </section>

      {/* 4. STEP 2: VERIFICATION */}
      <section className="py-16 md:py-20 px-4 bg-gray-900/30 border-t border-gray-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 font-orbitron text-green-500">STEP 2: GET VERIFIED (OPTIONAL)</h2>
          <p className="text-gray-400">Upgrade to Lab-Certified Status. Shipped to your door.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* TOX KIT */}
          <div className="bg-black p-6 md:p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-3 py-1">LAB-CERTIFIED</div>
            <h3 className="text-xl font-bold mb-2">10-Panel Toxicology</h3>
            <div className="text-3xl md:text-4xl font-bold text-white mb-4">$129.00</div>
            <ul className="text-sm text-gray-400 space-y-2 mb-6">
              <li className="flex gap-2"><Check size={16} className="text-blue-500"/> Verified Drug Screen</li>
              <li className="flex gap-2"><Check size={16} className="text-blue-500"/> Digital Badge Update</li>
            </ul>
            <Button onClick={() => navigate("/toxicology-kit-order")} className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold text-white">
              ORDER TOX KIT
            </Button>
          </div>

          {/* HEALTH KIT */}
          <div className="bg-black p-6 md:p-8 rounded-xl border border-yellow-500/50 hover:border-yellow-500 transition relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1">PLATINUM</div>
            <h3 className="text-xl font-bold mb-2 text-yellow-400">13-Panel Sexual Health</h3>
            <div className="text-3xl md:text-4xl font-bold text-white mb-4">$249.00</div>
            <ul className="text-sm text-gray-400 space-y-2 mb-6">
              <li className="flex gap-2"><Check size={16} className="text-yellow-500"/> Full STD Panel</li>
              <li className="flex gap-2"><Check size={16} className="text-yellow-500"/> Certified Health Badge</li>
            </ul>
            <Button onClick={() => navigate("/health-panel-order")} className="w-full py-3 bg-gradient-to-r from-yellow-600 to-yellow-400 hover:scale-105 transition font-bold text-black">
              ORDER HEALTH KIT
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- PRICING CARD COMPONENT ---
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
  <div className={`bg-black p-6 rounded-xl border relative transition-all duration-300 hover:scale-105
    ${isGold ? 'border-yellow-600/50 hover:border-yellow-500' : 'border-gray-800 hover:border-gray-600'}`}>
    
    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-widest whitespace-nowrap
      ${isBeta ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
      {tag}
    </div>

    {isBeta && <div className="text-red-500 text-xs font-bold tracking-widest text-center mt-2 mb-4">⚡ BETA PRICING ⚡</div>}

    <h3 className="text-base md:text-lg font-bold text-gray-300 mb-2 text-center">{title}</h3>
    
    <div className="flex items-end justify-center gap-2 mb-1">
      <span className="text-gray-500 line-through text-base md:text-lg">{originalPrice}</span>
      <span className="text-3xl md:text-4xl font-bold text-white">{price}</span>
    </div>
    <div className="text-sm text-gray-500 mb-6 text-center">{period}</div>

    <button className={`w-full py-3 rounded font-bold transition min-h-[48px] touch-manipulation
      ${isGold ? 'bg-yellow-600 text-black hover:bg-yellow-500' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
      SELECT
    </button>

    {isBeta && <div className="text-red-500 text-xs font-bold text-center mt-3">🔥 Limited Time!</div>}
  </div>
);

export default Index;
