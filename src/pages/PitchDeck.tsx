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
  Share2,
  Network,
  Crown,
  Sparkles,
  XCircle,
  CheckCircle2,
  Users,
  Plane,
  Car,
  Briefcase,
  Heart,
  Rocket,
  Ghost
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

  const unicornPillars = [
    {
      icon: Ghost,
      color: "amber",
      title: "GHOST TOKEN ECONOMICS",
      subtitle: "Pure Software Margin",
      description: "The Ghost Token is pure software economics applied to physical access. Each $10-$50 token injects directly into the member's dynamic QR code—unlimited inventory, no fulfillment, no COGS. At scale, every Ghost Token generates $4+ pure margin. The token self-destructs after use, eliminating replay attacks. This isn't a product sale—it's a toll booth on trust.",
      metric: "$4.00+",
      metricLabel: "Pure Margin Per Token",
      layer: "LAYER 1"
    },
    {
      icon: Lock,
      color: "purple",
      title: "REGULATORY MOAT",
      subtitle: "Complexity as Competitive Advantage",
      description: "Integrating HIPAA-compliant health data with payment rails and physical access requires 18+ months of compliance engineering. No competitor can replicate overnight.",
      metric: "18+",
      metricLabel: "Months to Replicate",
      layer: "LAYER 2"
    },
    {
      icon: Network,
      color: "green",
      title: "VIRAL NETWORK EFFECTS",
      subtitle: "The Vibe-ID Ecosystem",
      description: "The Vibe-ID Ecosystem lets members broadcast verified compatibility signals across four distinct modes—Social, Pulse, Thrill, and After Dark—while instantly connecting their social graphs (Instagram, TikTok). Every QR share is organic marketing. Every mode switch deepens engagement. We don't just verify identity—we verify vibe.",
      metric: "3.2x",
      metricLabel: "Organic Referral Rate",
      layer: "LAYER 3"
    },
    {
      icon: ShieldCheck,
      color: "blue",
      title: "LIABILITY TRANSFER",
      subtitle: "Essential Infrastructure",
      description: "Venues and employers face existential legal risk without verification. VALID absorbs that liability. We're not a nice-to-have—we're the insurance policy they can't operate without.",
      metric: "$0",
      metricLabel: "Venue Liability Exposure",
      layer: "LAYER 4"
    },
    {
      icon: Zap,
      color: "cyan",
      title: "INSTANT FBO SETTLEMENT",
      subtitle: "Zero Payment Delay",
      description: "Pre-funded wallets mean funds are already in the system. Venues get paid instantly via FBO—no 3-day holds, no batch processing. Cash flow, solved.",
      metric: "0 sec",
      metricLabel: "Settlement Time",
      layer: "LAYER 5"
    },
    {
      icon: Lock,
      color: "red",
      title: "ZERO-TRUST FORTRESS",
      subtitle: "Cryptographic Immunity",
      description: "We never store raw PII—only encrypted tokens. Venues receive VERIFIED or NOT VERIFIED signals, never data. No data to breach = no liability to inherit.",
      metric: "0",
      metricLabel: "Raw PII Stored",
      layer: "LAYER 6"
    }
  ];

  const thesisStatements = [
    {
      number: "01",
      title: "We Own the Trust Layer",
      content: "Every high-stakes interaction—entering a venue, starting a rideshare shift, meeting someone new—requires trust verification. VALID is the protocol that makes trust portable, instant, and monetizable."
    },
    {
      number: "02", 
      title: "Platform, Not Product",
      content: "We're not selling test kits. We're not selling identity checks. We're selling access to a verified network. The kits and checks are on-ramps. The network is the moat."
    },
    {
      number: "03",
      title: "Revenue Compounds, Not Adds",
      content: "Every new venue creates demand for members. Every new member creates demand for venues. Every transaction creates demand for wallet refills. This is a flywheel, not a funnel."
    },
    {
      number: "04",
      title: "Regulation is Our Friend",
      content: "As liability laws tighten and insurance premiums rise, verification becomes mandatory. We're positioned as the compliant solution when compliance becomes law."
    }
  ];

  const competitorFailures = [
    { name: "CLEAR", valuation: "$4.3B", limitation: "Identity only. No health. No payments. No network effects.", verdict: "SINGLE-PURPOSE" },
    { name: "ID.me", valuation: "$1.5B", limitation: "Government identity. Zero commercial integration. No revenue share.", verdict: "WRONG MARKET" },
    { name: "Sterling", valuation: "$5.3B", limitation: "Background checks only. 72-hour turnaround. No real-time.", verdict: "LEGACY SLOW" },
    { name: "STDCheck", valuation: "Private", limitation: "Results only. No verification layer. No B2B. No ecosystem.", verdict: "POINT SOLUTION" }
  ];

  const marketVerticals = [
    { icon: Building2, name: "Nightlife & Events", tam: "$890M", growth: "14% CAGR", status: "LIVE" },
    { icon: Heart, name: "Lifestyle & Dating", tam: "$450M", growth: "22% CAGR", status: "LIVE" },
    { icon: Car, name: "Transportation & Fleet", tam: "$1.2B", growth: "8% CAGR", status: "LAUNCHING" },
    { icon: Briefcase, name: "Workforce Compliance", tam: "$3.2B", growth: "6% CAGR", status: "LAUNCHING" },
    { icon: Plane, name: "Travel & Hospitality", tam: "$780M", growth: "12% CAGR", status: "ROADMAP" },
    { icon: Users, name: "Creator & Talent", tam: "$340M", growth: "28% CAGR", status: "LIVE" }
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
    { feature: "Zero-Trust Backend Security", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, highlight: true },
    { feature: "Automated Revenue Share ($10 Transaction)", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, highlight: true },
    { feature: "Peer-to-Peer Network Trust", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, highlight: true },
    { feature: "Frictionless Staff Workflow & B2B Portal", valid: true, clear: true, idme: false, ticketmaster: true, sterling: false, stdcheck: false, eventbrite: true, highlight: false },
    { feature: "Rolling Compliance & Screening", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: true, eventbrite: false, highlight: false },
    { feature: "In-App Wallet Payments", valid: true, clear: false, idme: false, ticketmaster: true, sterling: false, stdcheck: false, eventbrite: true, highlight: false },
    { feature: "Digital Identity Verification", valid: true, clear: true, idme: true, ticketmaster: true, sterling: true, stdcheck: false, eventbrite: true, highlight: false },
  ];

  const validScore = scorecardData.filter(r => r.valid).length;

  const renderCheck = (value: boolean, isValid?: boolean) => {
    if (value) {
      return <Check className={`h-5 w-5 mx-auto ${isValid ? 'text-cyan-400' : 'text-green-500'}`} />;
    }
    return <X className="h-5 w-5 mx-auto text-red-500" />;
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      amber: "text-amber-400 border-amber-500/50 bg-amber-500/10",
      purple: "text-purple-400 border-purple-500/50 bg-purple-500/10",
      green: "text-green-400 border-green-500/50 bg-green-500/10",
      blue: "text-blue-400 border-blue-500/50 bg-blue-500/10",
      cyan: "text-cyan-400 border-cyan-500/50 bg-cyan-500/10",
      red: "text-red-400 border-red-500/50 bg-red-500/10",
    };
    return colors[color] || colors.cyan;
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
            onClick={() => navigate('/partners')}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Partner Solutions
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

      <main className="container mx-auto px-4 py-8 space-y-20 relative z-10">
        
        {/* ===== HERO SECTION ===== */}
        <section className="text-center py-6">
          <img src={logo} alt="VALID" className="h-40 md:h-52 mx-auto mb-8 rounded-xl shadow-[0_0_40px_rgba(0,240,255,0.2)]" />
          
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30 px-4 py-1">
            CONFIDENTIAL — INVESTOR ONLY
          </Badge>
          
          {/* Powered by Synthesized AI */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-cyan-500/30 bg-cyan-900/10 rounded text-sm font-mono tracking-[0.15em] text-cyan-400 uppercase">
            <span className="min-w-[220px]">
              {displayedText}
              <span className="animate-pulse">|</span>
            </span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-orbitron">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500 drop-shadow-[0_0_25px_rgba(0,240,255,0.5)]">
              INVESTOR DECK
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 font-orbitron mb-8">
            Zero-Trust Identity & Payment Infrastructure
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="text-gray-400">TAM:</span>
              <span className="text-white font-bold ml-2">$5.7B+</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="text-gray-400">Seed Ask:</span>
              <span className="text-cyan-400 font-bold ml-2">$750K</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="text-gray-400">Stage:</span>
              <span className="text-green-400 font-bold ml-2">Revenue Generating</span>
            </div>
          </div>
        </section>

        {/* ===== CORE INSIGHT ===== */}
        <section>
          <div className="bg-gradient-to-br from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,240,255,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="h-8 w-8 text-cyan-400" />
              <h2 className="text-2xl md:text-3xl font-bold font-orbitron text-white">The Core Insight</h2>
            </div>
            
            <blockquote className="text-xl md:text-2xl text-gray-300 italic border-l-4 border-cyan-500 pl-6 mb-8">
              "In a world where identity fraud is up 3,000% and trust is the scarcest resource, the company that owns the verification layer owns the transaction."
            </blockquote>
            
            <p className="text-gray-400 text-lg leading-relaxed">
              VALID isn't a health app. It's not an identity company. It's not a payment processor. 
              <span className="text-white font-semibold"> It's the Ghost Token protocol—a self-destructing, encrypted trust packet injected into every QR code.</span> When you enter a venue, the Ghost Token proves you're verified, processes payment, and vaporizes—zero data left behind. We don't store trust. We transmit it.
            </p>
          </div>
        </section>

        {/* ===== KEY METRICS ===== */}
        <section>
          <h2 className="text-2xl font-bold text-center text-white mb-8 font-orbitron">Current Traction</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric, idx) => (
              <Card key={idx} className="bg-black/40 backdrop-blur-sm border-white/10 hover:border-cyan-500/50 transition-all">
                <CardContent className="p-6 text-center">
                  <metric.icon className={`h-8 w-8 mx-auto mb-3 ${metric.color}`} />
                  <div className="text-3xl font-bold text-white">{metric.value}</div>
                  {metric.subtext && <div className="text-xs text-gray-500">{metric.subtext}</div>}
                  <div className="text-sm text-gray-400 mt-1">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ===== SIX UNICORN PILLARS ===== */}
        <section>
          <div className="text-center mb-16">
            <Badge className="bg-white/10 text-white border-white/20 mb-6 text-lg px-6 py-2 tracking-wider">VALUE DRIVERS</Badge>
            <div className="relative inline-block">
              {/* Blue glow effect behind title */}
              <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-600/40 via-cyan-500/50 to-blue-600/40 scale-150"></div>
              <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-bold font-orbitron tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                The Six Unicorn Pillars
              </h2>
            </div>
            <p className="text-gray-400 mt-6 max-w-3xl mx-auto text-lg tracking-wide leading-relaxed">Why VALID will become the trust infrastructure layer for every high-stakes human interaction</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unicornPillars.map((pillar, index) => {
              const isGhostToken = index === 0;
              return (
                <div 
                  key={index}
                  className={`bg-black/40 backdrop-blur-xl border rounded-xl p-8 hover:scale-[1.02] transition-all duration-300 ${getColorClasses(pillar.color)} ${isGhostToken ? 'shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_50px_rgba(251,191,36,0.5)]' : ''}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`relative h-14 w-14 rounded-xl ${getColorClasses(pillar.color)} flex items-center justify-center ${isGhostToken ? 'overflow-visible' : ''}`}>
                      {isGhostToken && (
                        <>
                          {/* Pulsing ring animation */}
                          <div className="absolute inset-0 rounded-xl bg-amber-500/30 animate-ping" style={{ animationDuration: '2s' }}></div>
                          <div className="absolute -inset-2 rounded-xl border-2 border-amber-400/50 animate-pulse"></div>
                          {/* Outer glow ring */}
                          <div className="absolute -inset-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 blur-md animate-pulse" style={{ animationDuration: '3s' }}></div>
                        </>
                      )}
                      <pillar.icon className={`h-7 w-7 relative z-10 ${isGhostToken ? 'animate-pulse' : ''}`} />
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold tracking-wide ${pillar.color === 'amber' ? 'text-amber-400' : pillar.color === 'purple' ? 'text-purple-400' : pillar.color === 'green' ? 'text-green-400' : pillar.color === 'blue' ? 'text-blue-400' : pillar.color === 'red' ? 'text-red-400' : 'text-cyan-400'}`}>{pillar.metric}</div>
                      <div className="text-xs text-gray-500 tracking-wider">{pillar.metricLabel}</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-gray-500 mb-3 tracking-[0.2em]">{pillar.layer}</div>
                  <h3 className={`text-xl font-bold text-white mb-2 font-orbitron tracking-wide ${isGhostToken ? 'drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' : ''}`}>{pillar.title}</h3>
                  <p className={`text-sm mb-4 tracking-wide ${pillar.color === 'amber' ? 'text-amber-400' : pillar.color === 'purple' ? 'text-purple-400' : pillar.color === 'green' ? 'text-green-400' : pillar.color === 'blue' ? 'text-blue-400' : pillar.color === 'red' ? 'text-red-400' : 'text-cyan-400'}`}>{pillar.subtitle}</p>
                  <p className="text-gray-400 text-sm leading-relaxed tracking-wide">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== THE THESIS ===== */}
        <section>
          <div className="text-center mb-12">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 mb-4 text-lg px-6 py-2">THE THESIS</Badge>
            <h2 className="text-4xl md:text-6xl font-bold font-orbitron">Four Truths That Make VALID Inevitable</h2>
          </div>

          <div className="space-y-6">
            {thesisStatements.map((statement, index) => (
              <div 
                key={index}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 md:p-8 hover:border-cyan-500/30 transition-all group"
              >
                <div className="flex items-start gap-6">
                  <div className="text-4xl font-bold text-cyan-500/30 font-orbitron group-hover:text-cyan-500/50 transition-colors">
                    {statement.number}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 font-orbitron">{statement.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{statement.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== COMPETITIVE MOAT ===== */}
        <section>
          <div className="text-center mb-12">
            <Badge className="bg-red-600/30 text-red-500 border-red-600/50 mb-4 text-lg px-6 py-2">COMPETITIVE MOAT</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron">Why Competitors Can't Win</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Billion-dollar companies have pieces of the puzzle. None have assembled it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {competitorFailures.map((comp, index) => (
              <div 
                key={index}
                className="bg-black/40 backdrop-blur-xl border border-red-900/30 rounded-xl p-6 hover:border-red-600/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{comp.name}</h3>
                    <span className="text-gray-500 text-sm">{comp.valuation} valuation</span>
                  </div>
                  <Badge className="bg-red-950/50 text-red-400 border-red-800/50 text-xs">
                    {comp.verdict}
                  </Badge>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-400">{comp.limitation}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-cyan-950/40 to-green-950/40 border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">VALID: The Complete Stack</h3>
            </div>
            <p className="text-gray-300">
              <span className="text-cyan-400 font-semibold">8/8 integration score.</span> Identity + Health + Payments + Access + Network + Compliance + Revenue Share + Real-time Sync. 
              No competitor scores above 3/8.
            </p>
          </div>
        </section>

        {/* ===== COMPETITIVE SCORECARD ===== */}
        <section>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-orbitron">
            Feature Comparison Scorecard
          </h2>
          
          <div className="overflow-x-auto bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="bg-white/5 text-white">
                  <th className="p-2 text-left font-bold uppercase" style={{ width: '30%' }}>Feature</th>
                  <th className="p-2 text-center font-extrabold text-cyan-400" style={{ width: '10%' }}>VALID</th>
                  <th className="p-2 text-center text-gray-500" style={{ width: '10%' }}>CLEAR</th>
                  <th className="p-2 text-center text-gray-500" style={{ width: '10%' }}>ID.me</th>
                  <th className="p-2 text-center text-gray-500" style={{ width: '10%' }}>TICKETMASTER</th>
                  <th className="p-2 text-center text-gray-500" style={{ width: '10%' }}>STERLING</th>
                  <th className="p-2 text-center text-gray-500" style={{ width: '10%' }}>STDCHECK</th>
                  <th className="p-2 text-center text-gray-500" style={{ width: '10%' }}>EVENTBRITE</th>
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
                <tr className="bg-white/5 font-bold">
                  <td className="p-2 text-left text-white">TOTAL SCORE</td>
                  <td className="p-2 text-center text-cyan-400">{validScore}/8</td>
                  <td className="p-2 text-center text-gray-500">2/8</td>
                  <td className="p-2 text-center text-gray-500">1/8</td>
                  <td className="p-2 text-center text-gray-500">3/8</td>
                  <td className="p-2 text-center text-gray-500">1/8</td>
                  <td className="p-2 text-center text-gray-500">2/8</td>
                  <td className="p-2 text-center text-gray-500">3/8</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== MARKET EXPANSION ===== */}
        <section>
          <div className="text-center mb-12">
            <Badge className="bg-green-600/30 text-green-400 border-green-600/50 mb-4 text-lg px-6 py-2">EXPANSION PATH</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron">Six Verticals, One Protocol</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketVerticals.map((vertical, index) => (
              <div 
                key={index}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <vertical.icon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <Badge className={`text-xs ${
                    vertical.status === 'LIVE' ? 'bg-green-600/30 text-green-400 border-green-600/50' :
                    vertical.status === 'LAUNCHING' ? 'bg-yellow-600/30 text-yellow-400 border-yellow-600/50' :
                    'bg-gray-600/30 text-gray-400 border-gray-600/50'
                  }`}>
                    {vertical.status}
                  </Badge>
                </div>
                <h3 className="font-bold text-white mb-2">{vertical.name}</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">TAM: <span className="text-white">{vertical.tam}</span></span>
                  <span className="text-cyan-400">{vertical.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== USE OF FUNDS ===== */}
        <section>
          <h2 className="text-2xl font-bold text-center text-white mb-8 font-orbitron">
            Use of Funds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {useOfFunds.map((item, idx) => (
              <Card key={idx} className="bg-black/40 border-white/10">
                <CardContent className="p-6 text-center">
                  <div className={`h-4 w-4 ${item.color} rounded-full mx-auto mb-3`}></div>
                  <div className="text-3xl font-bold text-white">{item.percent}%</div>
                  <div className="text-sm text-gray-400">{item.category}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ===== THE ASK ===== */}
        <section className="text-center py-12">
          <div className="bg-gradient-to-r from-cyan-950/50 to-blue-950/50 border border-cyan-500/30 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,240,255,0.15)]">
            <Rocket className="h-12 w-12 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron text-white mb-6">The Ask</h2>
            <div className="text-5xl md:text-6xl font-bold text-cyan-400 mb-4">$750,000</div>
            <p className="text-xl text-gray-400 mb-8">Seed Round</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
              <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                <div className="text-cyan-400 font-bold mb-2">12-Month Runway</div>
                <p className="text-sm text-gray-400">Full team execution on product, sales, and market expansion</p>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                <div className="text-cyan-400 font-bold mb-2">100+ Venues</div>
                <p className="text-sm text-gray-400">Target venue network by end of funding period</p>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                <div className="text-cyan-400 font-bold mb-2">Series A Ready</div>
                <p className="text-sm text-gray-400">Position for $3-5M Series A within 18 months</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="text-center py-8">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-lg px-8 py-6 hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,240,255,0.5)]"
            onClick={() => window.open("mailto:invest@bevalid.app", "_blank")}
          >
            Schedule Investor Call
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>

      </main>
    </div>
  );
};

export default PitchDeck;
