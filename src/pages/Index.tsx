import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, Shield, Plane, MapPin, UserX, Menu, X, ScanLine, Users, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useLongPressHome } from "@/hooks/useLongPressHome";
import { useReferralTracking } from "@/hooks/useReferralTracking";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import logo from "@/assets/valid-logo.jpeg";

const Index = () => {
  const navigate = useNavigate();
  const longPressHandlers = useLongPressHome();
  useReferralTracking();
  const [session, setSession] = useState<Session | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<"travel" | "access" | "incognito">("access");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const modes = [
    { id: 'travel' as const, label: 'Travel', icon: Plane, colorClass: 'text-blue-400' },
    { id: 'access' as const, label: 'Access', icon: MapPin, colorClass: 'text-green-400' },
    { id: 'incognito' as const, label: 'Incognito', icon: UserX, colorClass: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      
      {/* NAVBAR */}
      <nav className="border-b border-gray-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2" {...longPressHandlers}>
            <img src={logo} alt="VALID" className="w-auto h-12 md:h-16" />
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/partners" className="text-sm text-gray-400 hover:text-white transition">
              Partner Solutions
            </Link>
            <Button 
              onClick={() => navigate("/auth?mode=login")}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-full transition"
            >
              Log In
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button 
              onClick={() => navigate("/auth?mode=login")}
              size="sm"
              className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold"
            >
              Log In
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-black/95 px-4 py-4 space-y-3">
            <Button onClick={() => { navigate("/partners"); setMobileMenuOpen(false); }} variant="ghost" className="w-full justify-start text-gray-300">
              🛸 Partner Solutions
            </Button>
            <Button onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }} variant="ghost" className="w-full justify-start text-gray-300">
              <ScanLine className="h-4 w-4 mr-2" /> QR Code
            </Button>
            <div className="flex items-center justify-between border-t border-gray-800 pt-3">
              <span className="text-sm text-gray-500">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        )}
      </nav>

      {/* 1. HERO SECTION (Be Valid Phone Mockup) */}
      <section className="relative py-16 md:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
        
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block mb-4 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-mono tracking-widest">
              POWERED BY SYNTHESIZED AI
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-orbitron tracking-tight">
              Be <span className="text-green-400">Valid</span>.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">
              Your secure ecosystem for total access. Frictionless entry via QR code & instant transactions.
            </p>

            {/* Mode Switcher */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                    activeMode === mode.id
                      ? 'bg-white/10 border-white/30 text-white'
                      : 'border-gray-700 text-gray-500 hover:border-gray-500'
                  }`}
                >
                  <mode.icon size={16} className={activeMode === mode.id ? mode.colorClass : ''} />
                  <span className="text-sm font-medium">{mode.label}</span>
                </button>
              ))}
            </div>

            <Button 
              onClick={() => navigate("/auth")}
              size="lg"
              className="px-8 py-6 bg-green-600 hover:bg-green-500 rounded-full font-bold text-white text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
            >
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Right: Phone Mockup */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-56 md:w-64 h-[440px] md:h-[500px] bg-gray-900 rounded-[3rem] border-4 border-gray-700 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
                
                <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 p-6 pt-10 flex flex-col items-center">
                  <Shield className="w-12 h-12 md:w-16 md:h-16 text-green-400 mb-4" />
                  
                  <div className="text-center mb-4">
                    <div className="text-xl md:text-2xl font-bold text-white font-orbitron">VALID</div>
                    <div className="text-xs text-gray-400 tracking-widest">VERIFIED</div>
                  </div>

                  <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-xl flex items-center justify-center mb-4">
                    <ScanLine className="w-16 h-16 md:w-20 md:h-20 text-gray-800" />
                  </div>

                  <div className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold ${
                    activeMode === 'travel' ? 'bg-blue-500/20 text-blue-400' :
                    activeMode === 'access' ? 'bg-green-500/20 text-green-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {activeMode.toUpperCase()} MODE
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 -z-10" />
            </div>
          </div>
        </div>
      </section>

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
