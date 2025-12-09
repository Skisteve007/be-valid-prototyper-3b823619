import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Globe, 
  TrendingUp, 
  Clock, 
  QrCode,
  Building2,
  DollarSign,
  Target,
  Zap,
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  Lock,
  Share2
} from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";

const PitchDeck = () => {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'POWERED BY SYNTHESIZED AI';
  
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);
    
    return () => clearInterval(typingInterval);
  }, []);

  const metrics = [
    { label: "Partner Venues", value: "28+", icon: Building2, color: "text-cyan-400" },
    { label: "Countries", value: "11", icon: Globe, color: "text-green-400" },
    { label: "Verification Speed", value: "3 sec", icon: Clock, color: "text-purple-400" },
    { label: "Member Growth", value: "15%", subtext: "MoM", icon: TrendingUp, color: "text-orange-400" },
  ];

  const problemPoints = [
    "No way to verify health status without sharing medical records",
    "Awkward conversations that kill trust and momentum",
    "Venues face liability with no standardized verification",
    "Existing solutions are slow, manual, or non-existent",
  ];

  const solutionPoints = [
    { title: "QR Verification", desc: "Instant status check in 3 seconds" },
    { title: "Privacy Firewall", desc: "Share status, never medical records" },
    { title: "Lab Certified", desc: "Trusted results from certified partners" },
    { title: "Venue Network", desc: "Growing acceptance worldwide" },
  ];

  const marketData = [
    { segment: "Health Verification", size: "$2.1B", growth: "12% CAGR" },
    { segment: "Lifestyle Safety", size: "$450M", growth: "18% CAGR" },
    { segment: "Workplace Testing", size: "$3.2B", growth: "6% CAGR" },
  ];

  const revenueStreams = [
    { name: "B2C Memberships", price: "$39-129", type: "Subscription" },
    { name: "B2B Venue Partners", price: "$299-499/mo", type: "SaaS" },
    { name: "Lab Kit Sales", price: "$89-149", type: "Product" },
    { name: "Enterprise/Fleet", price: "Custom", type: "Contract" },
  ];

  const useOfFunds = [
    { category: "Sales & Marketing", percent: 40, color: "bg-cyan-500" },
    { category: "Product Development", percent: 30, color: "bg-purple-500" },
    { category: "Operations", percent: 20, color: "bg-green-500" },
    { category: "Reserve", percent: 10, color: "bg-orange-500" },
  ];

  const scorecardData = [
    { feature: "Integrated Health/Tox Status (HIPAA)", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: true, eventbrite: false, highlight: true },
    { feature: "Zero-Trust Backend Security & Architecture", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, highlight: true },
    { feature: "Automated Revenue Share ($10 Transaction)", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, highlight: true },
    { feature: "PEER-TO-PEER NETWORK TRUST", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, highlight: true },
    { feature: "Frictionless Staff Workflow & B2B Portal", valid: true, clear: true, idme: false, ticketmaster: true, sterling: false, stdcheck: false, eventbrite: true, highlight: true },
    { feature: "Rolling (Continuous) Compliance & Screening", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: true, eventbrite: false, highlight: false },
    { feature: "Managed Transactional Payments (In-App Wallet)", valid: true, clear: false, idme: false, ticketmaster: true, sterling: false, stdcheck: false, eventbrite: true, highlight: false },
    { feature: "Digital Identity Verification (Standard)", valid: true, clear: true, idme: true, ticketmaster: true, sterling: true, stdcheck: false, eventbrite: true, highlight: false },
  ];

  const validScore = scorecardData.filter(r => r.valid).length;
  const clearScore = scorecardData.filter(r => r.clear).length;
  const idmeScore = scorecardData.filter(r => r.idme).length;
  const ticketmasterScore = scorecardData.filter(r => r.ticketmaster).length;
  const sterlingScore = scorecardData.filter(r => r.sterling).length;
  const stdcheckScore = scorecardData.filter(r => r.stdcheck).length;
  const eventbriteScore = scorecardData.filter(r => r.eventbrite).length;

  const renderCheck = (value: boolean, isValid?: boolean) => {
    if (value) {
      return <Check className={`h-5 w-5 mx-auto ${isValid ? 'text-cyan-400' : 'text-green-500'}`} />;
    }
    return <X className="h-5 w-5 mx-auto text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500 selection:text-black relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
      
      {/* Background Atmosphere */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold font-orbitron tracking-[0.2em] text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">
              VALID
            </span>
            <Button 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              onClick={() => window.open("mailto:invest@bevalid.app", "_blank")}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-16 relative z-10">
        {/* Hero Slide */}
        <section className="text-center py-16">
          <img src={logo} alt="VALID" className="h-32 md:h-40 mx-auto mb-6 rounded-xl" />
          <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse">
            Seed Round Open
          </Badge>
          {/* Powered by Synthesized AI - Typing Animation */}
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 border border-cyan-500/30 bg-cyan-900/10 rounded text-[10px] font-mono tracking-widest text-cyan-400">
            <span className="min-w-[200px]">
              {displayedText}
              <span className="animate-pulse">|</span>
            </span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8),0_0_20px_rgba(59,130,246,0.5)]"></span>
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-orbitron">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500 drop-shadow-[0_0_25px_rgba(0,240,255,0.5)]">
              VALID: Integrated Identity & Payment Ecosystem
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-orbitron">
            Pitch Deck Summary - Zero-Trust Compliance & Revenue Generation
          </p>
        </section>

        {/* Investment Thesis Section - Unicorn Thesis */}
        <section className="mb-8">
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <h3 className="text-xl font-bold text-cyan-400 mb-6 font-orbitron flex items-center gap-2">
              <Zap size={24} className="text-cyan-400" />
              Unicorn Thesis: The VALID Value Drivers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/40 p-6 rounded-xl border border-white/10 hover:border-cyan-500/50 transition">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={20} className="text-cyan-400" />
                  <h4 className="font-bold text-white">HIGH-MARGIN TRANSACTIONAL POWER</h4>
                </div>
                <p className="text-gray-400 text-sm">The core revenue is the $10 Ghost Access Token, which operates at near-zero marginal cost, creating massive profitability as your organization scales up.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={20} className="text-purple-400" />
                  <h4 className="font-bold text-white">ZERO-TRUST ARCHITECTURAL MOAT</h4>
                </div>
                <p className="text-gray-400 text-sm">The complexity of linking health data (HIPAA/GDPR) with payment systems and physical access is a massive barrier to entry. No competitor can copy this integrated model quickly.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-xl border border-white/10 hover:border-green-500/50 transition">
                <div className="flex items-center gap-2 mb-2">
                  <Share2 size={20} className="text-green-400" />
                  <h4 className="font-bold text-white">VIRAL NETWORK INTEGRATION</h4>
                </div>
                <p className="text-gray-400 text-sm">VALID drives exponential growth by enabling members to instantly connect their entire social graphs (Instagram, TikTok, etc.), creating a massive, verified peer-to-peer network for partner exposure.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={20} className="text-blue-400" />
                  <h4 className="font-bold text-white">REGULATORY TAILWINDS & LIABILITY SHIFT</h4>
                </div>
                <p className="text-gray-400 text-sm">We legally shield venues and employers from compliance risk, making us an essential, non-optional service provider.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Competitive Scorecard Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-cyan-400 mb-4 font-orbitron">
            Direct Competitive Scorecard: Why VALID Wins
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            VALID is the only platform integrating the <strong className="text-white">eight key functions</strong> needed to de-risk and monetize high-liability businesses.
          </p>
          
          <div className="overflow-x-auto bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="bg-white/5 text-white">
                  <th className="p-2 text-left font-bold uppercase" style={{ width: '25%' }}>VALID FEATURE</th>
                  <th colSpan={7} className="p-2 text-center font-bold uppercase border-l border-white/10">COMPETITORS</th>
                </tr>
                <tr className="bg-white/5 text-white">
                  <th className="p-1" style={{ width: '25%' }}></th>
                  <th className="p-1 text-center font-extrabold text-cyan-400" style={{ width: '10%' }}>VALID</th>
                  <th className="p-1 text-center text-gray-500" style={{ width: '9%' }}>CLEAR</th>
                  <th className="p-1 text-center text-gray-500" style={{ width: '9%' }}>ID.me</th>
                  <th className="p-1 text-center text-gray-500" style={{ width: '9%' }}>TICKETMASTER</th>
                  <th className="p-1 text-center text-gray-500" style={{ width: '9%' }}>STERLING</th>
                  <th className="p-1 text-center text-gray-500" style={{ width: '9%' }}>STDCHECK</th>
                  <th className="p-1 text-center text-gray-500" style={{ width: '10%' }}>EVENTBRITE</th>
                </tr>
              </thead>
              <tbody>
                {scorecardData.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className={`p-2 text-left text-gray-300 ${row.highlight ? 'font-semibold' : ''}`}>
                      {row.feature}
                    </td>
                    <td className="p-1 text-center">{renderCheck(row.valid, true)}</td>
                    <td className="p-1 text-center">{renderCheck(row.clear)}</td>
                    <td className="p-1 text-center">{renderCheck(row.idme)}</td>
                    <td className="p-1 text-center">{renderCheck(row.ticketmaster)}</td>
                    <td className="p-1 text-center">{renderCheck(row.sterling)}</td>
                    <td className="p-1 text-center">{renderCheck(row.stdcheck)}</td>
                    <td className="p-1 text-center">{renderCheck(row.eventbrite)}</td>
                  </tr>
                ))}
                {/* Total Score Row */}
                <tr className="bg-cyan-900/30 border-t-2 border-cyan-500/50">
                  <td className="p-2 text-left text-cyan-400 font-extrabold font-orbitron">
                    TOTAL INTEGRATION SCORE (8 Max)
                  </td>
                  <td className="p-1 text-center text-lg font-extrabold text-cyan-400">{validScore}/8</td>
                  <td className="p-1 text-center text-lg text-gray-500 font-extrabold">{clearScore}/8</td>
                  <td className="p-1 text-center text-lg text-gray-500 font-extrabold">{idmeScore}/8</td>
                  <td className="p-1 text-center text-lg text-gray-500 font-extrabold">{ticketmasterScore}/8</td>
                  <td className="p-1 text-center text-lg text-gray-500 font-extrabold">{sterlingScore}/8</td>
                  <td className="p-1 text-center text-lg text-gray-500 font-extrabold">{stdcheckScore}/8</td>
                  <td className="p-1 text-center text-lg text-gray-500 font-extrabold">{eventbriteScore}/8</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-black/40 p-6 rounded-xl border border-cyan-500/30">
            <h3 className="text-lg font-bold text-cyan-400 font-orbitron">
              🔑 Key Differentiation: Zero-Trust Security
            </h3>
            <p className="text-gray-400 text-sm mt-2">
              Competitor security models (FCRA compliance, SSO identity) are <strong className="text-white">static and siloed</strong>. VALID's <strong className="text-cyan-400">Zero-Trust Architecture</strong> requires continuous verification and integrates dynamic, real-time health/tox data, making it the only truly risk-based access system. This level of comprehensive, dynamic security is unmatched and crucial for high-liability venues.
            </p>
          </div>
        </section>

        {/* Key Metrics */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8 font-orbitron text-white">Key Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/10 text-center hover:border-cyan-500/50 transition hover:-translate-y-1">
                <metric.icon className={`h-8 w-8 mx-auto mb-3 ${metric.color}`} />
                <div className="text-3xl font-bold text-white">{metric.value}</div>
                {metric.subtext && <span className="text-sm text-gray-500">{metric.subtext}</span>}
                <div className="text-sm text-gray-400 mt-1">{metric.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Problem */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge variant="destructive" className="mb-4 bg-red-600/30 text-red-500 border-red-600/50">The Problem</Badge>
            <h2 className="text-3xl font-bold mb-6 text-white font-orbitron">Trust Without Proof</h2>
            <ul className="space-y-4">
              {problemPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-red-600/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-500 text-sm">✕</span>
                  </div>
                  <span className="text-gray-400">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-red-950/60 to-red-900/40 border border-red-600/50 p-8 rounded-xl text-center shadow-[0_0_30px_rgba(220,38,38,0.15)]">
            <div className="text-6xl mb-4">👽</div>
            <p className="text-xl text-white">
              "How do I know they're really safe?"
            </p>
            <p className="text-sm text-gray-400 mt-2">
              — Every health-conscious person ever
            </p>
          </div>
        </section>

        {/* Solution */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/50 p-8 rounded-xl text-center order-2 md:order-1 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <QrCode className="h-24 w-24 mx-auto mb-4 text-cyan-400" />
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 px-4 py-2 rounded-full">
              <div className="h-3 w-3 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-cyan-400 font-semibold">Verified</span>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">The Solution</Badge>
            <h2 className="text-3xl font-bold mb-6 text-white font-orbitron">VALID</h2>
            <div className="grid grid-cols-2 gap-4">
              {solutionPoints.map((point) => (
                <div key={point.title} className="bg-black/40 p-4 rounded-lg border border-white/10 hover:border-cyan-500/50 transition">
                  <h3 className="font-semibold text-white mb-1">{point.title}</h3>
                  <p className="text-sm text-gray-400">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-2 text-white font-orbitron">Market Opportunity</h2>
          <p className="text-gray-400 text-center mb-8">$5.7B+ Total Addressable Market</p>
          <div className="grid md:grid-cols-3 gap-4">
            {marketData.map((market) => (
              <div key={market.segment} className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-cyan-500/50 transition hover:-translate-y-1">
                <Target className="h-6 w-6 text-cyan-400 mb-3" />
                <div className="text-2xl font-bold text-white">{market.size}</div>
                <div className="text-white">{market.segment}</div>
                <Badge className="mt-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">{market.growth}</Badge>
              </div>
            ))}
          </div>
        </section>

        {/* Business Model */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8 text-white font-orbitron">Business Model</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {revenueStreams.map((stream) => (
              <div key={stream.name} className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/10 text-center hover:border-green-500/50 transition hover:-translate-y-1">
                <DollarSign className="h-8 w-8 mx-auto mb-3 text-green-400" />
                <div className="font-semibold text-white">{stream.name}</div>
                <div className="text-xl font-bold text-green-400 my-2">{stream.price}</div>
                <Badge className="bg-white/10 text-gray-400 border-white/10">
                  {stream.type}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* Use of Funds */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8 text-white font-orbitron">Use of Funds</h2>
          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/10 max-w-2xl mx-auto">
            <div className="flex h-8 rounded-full overflow-hidden mb-6">
              {useOfFunds.map((item) => (
                <div 
                  key={item.category} 
                  className={`${item.color}`} 
                  style={{ width: `${item.percent}%` }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {useOfFunds.map((item) => (
                <div key={item.category} className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <span className="text-gray-400">{item.category}</span>
                  <span className="text-white font-semibold ml-auto">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Ask Section */}
        <section>
          <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border-l-4 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <h3 className="text-xl font-bold text-white mb-2 font-orbitron">
              Our Ask: $750,000 Seed Round
            </h3>
            <p className="text-gray-400 text-sm">
              Funding is dedicated to <strong className="text-white">accelerating DevSecOps implementation</strong> and securing the <strong className="text-white">Lab Network Acquisition</strong> to capture a dominant market share.
            </p>
            <a 
              href="mailto:invest@bevalid.app" 
              className="mt-4 inline-block font-bold text-cyan-400 hover:text-cyan-300 transition-colors font-orbitron"
            >
              Contact Investor Relations: invest@bevalid.app
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <div className="bg-gradient-to-r from-cyan-900/30 via-purple-900/30 to-blue-900/30 border border-cyan-500/30 p-8 rounded-2xl max-w-2xl mx-auto shadow-[0_0_50px_rgba(6,182,212,0.15)]">
            <Zap className="h-12 w-12 mx-auto mb-4 text-cyan-400" />
            <h2 className="text-2xl font-bold mb-2 text-white font-orbitron">Join the Round</h2>
            <p className="text-gray-400 mb-6">
              We are building the trust infrastructure for health-conscious communities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                onClick={() => window.open("mailto:invest@bevalid.app?subject=Investment Inquiry", "_blank")}
              >
                Request Deck
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => navigate("/competitive-scorecard")}
              >
                View Competitive Analysis
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="text-center text-gray-500 text-sm pb-8">
          <p>VALID™ — The Safety Shield™</p>
          <p className="mt-1">Confidential — For Investor Use Only</p>
        </section>
      </main>
    </div>
  );
};

export default PitchDeck;