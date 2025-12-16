import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
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
  ArrowLeftRight,
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
  Ghost,
  Fingerprint,
  Radio,
  Lightbulb,
  Star,
  Phone,
  AlertTriangle
} from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";

const PitchDeck = () => {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState('');
  const [futureReadyText, setFutureReadyText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'POWERED BY SYNTHESIZED AI';
  const futureText = '2027 FUTURE READY';
  
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

  // Typing animation for 2027 FUTURE READY
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= futureText.length) {
        setFutureReadyText(futureText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150); // Slower for dramatic effect
    
    return () => clearInterval(typingInterval);
  }, []);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
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
      title: "GHOST™ TOKEN",
      subtitle: "Not a Ticket. A Dynamic Injection.",
      description: "The Ghost™ Token is not a static file. It is a secure, encrypted container that simultaneously represents three data points: Financial Authorization (Payment), Identity Verification (ID/Passport), and Health/Status Validation (Clearance). When scanned, the Token injects these three validated signals into the venue's system instantly. The venue gets the green light, the funds, and the liability shield—without ever storing raw data. You are Ghosted in.",
      metric: "3-in-1",
      metricLabel: "Layered Injection",
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
      description: "Venues and employers face existential legal risk without verification. VALID™ absorbs that liability. We're not a nice-to-have—we're the insurance policy they can't operate without.",
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
      content: "Every high-stakes interaction—entering a venue, starting a rideshare shift, meeting someone new—requires trust verification. VALID™ is the protocol that makes trust portable, instant, and monetizable."
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
    { feature: "Integrated Health/Tox Status (HIPAA)", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: true, eventbrite: false, dice: false, highlight: true },
    { feature: "Zero-Trust Backend Security", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, dice: false, highlight: true },
    { feature: "Automated Revenue Share ($10 Transaction)", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, dice: false, highlight: true },
    { feature: "Peer-to-Peer Network Trust", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, dice: false, highlight: true },
    { feature: "Frictionless Staff Workflow & B2B Portal", valid: true, clear: true, idme: false, ticketmaster: true, sterling: false, stdcheck: false, eventbrite: true, dice: true, highlight: false },
    { feature: "Rolling Compliance & Screening", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: true, eventbrite: false, dice: false, highlight: false },
    { feature: "In-App Wallet Payments", valid: true, clear: false, idme: false, ticketmaster: true, sterling: false, stdcheck: false, eventbrite: true, dice: true, highlight: false },
    { feature: "Digital Identity Verification", valid: true, clear: true, idme: true, ticketmaster: true, sterling: true, stdcheck: false, eventbrite: true, dice: true, highlight: false },
    { feature: "FBO Instant Payout (Pre-Funded Wallet)", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, dice: false, highlight: true },
    { feature: "Viral Chameleon Identity & Beacon Broadcasting", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, dice: false, highlight: true },
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
              VALID<sup className="text-xs text-cyan-400">™</sup>
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
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 border border-cyan-500/30 bg-cyan-900/10 rounded-lg text-xs font-mono tracking-widest text-cyan-400">
            <span>POWERED BY SYNTHESIZED AI</span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_10px_rgba(0,240,255,0.8),0_0_20px_rgba(0,240,255,0.5)]"></span>
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
              <span className="text-gray-400">SAFE Round:</span>
              <span className="text-cyan-400 font-bold ml-2">$1.5M</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="text-gray-400">Stage:</span>
              <span className="text-green-400 font-bold ml-2">Revenue Generating</span>
            </div>
          </div>

          {/* Enterprise Trust - Investor Differentiator */}
          <div className="mt-8 bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-amber-500/10 border border-cyan-500/30 rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/40 rounded-full">
                <span>🛡️</span>
                <span className="text-cyan-400 text-xs font-bold">SOC 2</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/40 rounded-full">
                <span>🔒</span>
                <span className="text-green-400 text-xs font-bold">GDPR</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 rounded-full">
                <span>🔒</span>
                <span className="text-amber-400 text-xs font-bold">CCPA</span>
              </div>
            </div>
            <p className="text-center text-white font-semibold">
              Enterprise Trust: Built for SOC 2 & GDPR compliance to win government & healthcare contracts.
            </p>
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
              VALID™ isn't a health app. It's not an identity company. It's not a payment processor. 
              <span className="text-white font-semibold"> It's the Ghost™ Token protocol—a self-destructing, encrypted trust packet injected into every QR code.</span> When you enter a venue, the Ghost™ Token proves you're verified, processes payment, and vaporizes—zero data left behind. We don't store trust. We transmit it.
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
            <div className="flex justify-center mb-6">
              <Badge className="bg-white/10 text-white border-white/20 text-lg px-6 py-2 tracking-wider">VALUE DRIVERS</Badge>
            </div>
            <div className="relative inline-block">
              {/* Blue glow effect behind title */}
              <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-600/40 via-cyan-500/50 to-blue-600/40 scale-150"></div>
              <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-bold font-orbitron tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                The Six Unicorn Pillars
              </h2>
            </div>
            <p className="text-gray-400 mt-6 max-w-3xl mx-auto text-lg tracking-wide leading-relaxed">Why VALID™ will become the trust infrastructure layer for every high-stakes human interaction</p>
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
          <div className="text-center mb-8">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 mb-3 text-sm px-4 py-1">THE THESIS</Badge>
            <h2 className="text-2xl md:text-3xl font-bold font-orbitron">Four Truths That Make VALID Inevitable</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {thesisStatements.map((statement, index) => (
              <div 
                key={index}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-5 hover:border-cyan-500/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl font-bold text-cyan-500/30 font-orbitron group-hover:text-cyan-500/50 transition-colors">
                    {statement.number}
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-white mb-2 font-orbitron">{statement.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{statement.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== THE VIRAL SALES FORCE (ZERO CAC) ===== */}
        <section>
          <div className="text-center mb-12">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 mb-4 text-lg px-6 py-2 tracking-widest">ZERO CAC</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4">
              THE VIRAL SALES FORCE
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Decentralized Growth Engine
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-950/40 to-orange-950/40 border border-amber-500/30 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(251,191,36,0.1)]">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              We do not pay for marketing. We empower a <strong className="text-amber-400">decentralized army of Account Managers & Promoters</strong> to sell for us.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {/* The Incentive */}
              <div className="bg-black/40 border border-amber-500/30 rounded-xl p-6">
                <h4 className="text-lg font-bold text-amber-400 mb-3 font-orbitron">The Incentive</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Promoters earn <strong className="text-white">10% of the Access Pass (Off Top)</strong> + Optional Spend Commissions (Paid by Venue).
                </p>
              </div>

              {/* The Tech */}
              <div className="bg-black/40 border border-cyan-500/30 rounded-xl p-6">
                <h4 className="text-lg font-bold text-cyan-400 mb-3 font-orbitron">The Tech</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Our <strong className="text-white">"Smart-Split" Architecture</strong> splits the funds at the point of transaction. Zero manual reconciliation.
                </p>
              </div>

              {/* The Result */}
              <div className="bg-black/40 border border-green-500/30 rounded-xl p-6">
                <h4 className="text-lg font-bold text-green-400 mb-3 font-orbitron">The Result</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  A global network of <strong className="text-white">incentivized sellers</strong> driving high-value users into the VALID ecosystem at <strong className="text-green-400">Zero Customer Acquisition Cost</strong>.
                </p>
              </div>

              {/* The Margin */}
              <div className="bg-black/40 border border-purple-500/30 rounded-xl p-6">
                <h4 className="text-lg font-bold text-purple-400 mb-3 font-orbitron">The Margin</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  VALID retains a guaranteed <strong className="text-purple-400">60% Gross Margin</strong> on Net Revenue after the promoter is paid.
                </p>
              </div>
            </div>

            {/* Two-Stage Financial Visualization */}
            <div className="bg-black/60 border border-white/10 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-6 font-orbitron text-center">
                Smart-Split Waterfall & Venue Pool Distribution
              </h4>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Stage 1: Revenue Waterfall */}
                <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">STAGE 1</Badge>
                    <h5 className="text-lg font-bold text-white font-orbitron">Revenue Waterfall</h5>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">Initial split from $100 gross sale</p>
                  
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Gross Sale', value: 100, start: 0 },
                          { name: 'Promoter', value: 10, start: 90 },
                          { name: 'VALID™ Fee', value: 60, start: 30 },
                          { name: 'Venue Pool', value: 30, start: 0 },
                        ]}
                        margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                      >
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#9ca3af', fontSize: 11 }}
                          axisLine={{ stroke: '#374151' }}
                          tickLine={{ stroke: '#374151' }}
                          angle={-15}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          domain={[0, 110]}
                          tick={{ fill: '#9ca3af', fontSize: 11 }}
                          axisLine={{ stroke: '#374151' }}
                          tickLine={{ stroke: '#374151' }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => {
                            if (name === 'start') return null;
                            return [`$${value}`, 'Amount'];
                          }}
                          contentStyle={{ 
                            backgroundColor: '#0a0a0a', 
                            border: '1px solid #22d3ee', 
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                        <Bar dataKey="start" stackId="a" fill="transparent" />
                        <Bar dataKey="value" stackId="a">
                          <Cell fill="#6b7280" />
                          <Cell fill="#f59e0b" />
                          <Cell fill="#22d3ee" />
                          <Cell fill="#22c55e" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-gray-500"></div>
                      <span className="text-gray-400">Gross Sale: $100</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-amber-500"></div>
                      <span className="text-gray-400">Promoter: -$10</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-cyan-400"></div>
                      <span className="text-gray-400">VALID™: -$60</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-500"></div>
                      <span className="text-gray-400">Venue Pool: $30</span>
                    </div>
                  </div>
                </div>

                {/* Stage 2: Venue Pool Distribution */}
                <div className="bg-black/40 border border-green-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">STAGE 2</Badge>
                    <h5 className="text-lg font-bold text-white font-orbitron">Venue Pool Distribution</h5>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">$30 pool split among participating venues</p>
                  <p className="text-xs text-green-400 font-semibold mb-4">Weekly Pro-Rata Split</p>
                  
                  <div className="h-[280px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Venue A', value: 7.5 },
                            { name: 'Venue B', value: 7.5 },
                            { name: 'Venue C', value: 7.5 },
                            { name: 'Venue D', value: 7.5 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                          labelLine={{ stroke: '#6b7280', strokeWidth: 1 }}
                        >
                          <Cell fill="#06b6d4" />
                          <Cell fill="#8b5cf6" />
                          <Cell fill="#f59e0b" />
                          <Cell fill="#ec4899" />
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`$${value.toFixed(2)} (25%)`, 'Share']}
                          contentStyle={{ 
                            backgroundColor: '#0a0a0a', 
                            border: '1px solid #22c55e', 
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center label overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">$30</div>
                        <div className="text-xs text-gray-400">POOL</div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2 text-xs mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-cyan-500"></div>
                      <span className="text-gray-400">Venue A: $7.50 (25%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-purple-500"></div>
                      <span className="text-gray-400">Venue B: $7.50 (25%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-amber-500"></div>
                      <span className="text-gray-400">Venue C: $7.50 (25%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-pink-500"></div>
                      <span className="text-gray-400">Venue D: $7.50 (25%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-gradient-to-r from-cyan-950/30 to-green-950/30 border border-white/10 rounded-lg">
                <p className="text-center text-gray-300 text-sm">
                  <span className="text-white font-bold">Every dollar tracked:</span> $100 Gross → $10 Promoter → $60 VALID™ → $30 Venue Pool → 
                  <span className="text-green-400 font-semibold"> Equal split among all participating venues</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== IDaaS: MARGIN DENSITY ===== */}
        <section>
          <div className="text-center mb-12">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 mb-4 text-lg px-6 py-2 tracking-widest">MARGIN DENSITY</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4">
              IDaaS: <span className="text-emerald-400">Identity as a Service</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              We eliminated Customer Acquisition Cost (CAC) by making identity verification a high-margin, user-paid revenue stream.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
            {/* The Model Explanation */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-white mb-4 font-orbitron flex items-center gap-3">
                <Fingerprint className="h-6 w-6 text-emerald-400" />
                The Model
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                The user pays for their <span className="text-white font-semibold">Verified Identity Key</span> once. VALID™ pays the Tier 1 vendor, and keeps the rest. 
                The revenue is <span className="text-emerald-400 font-semibold">instant</span>, <span className="text-emerald-400 font-semibold">high-value</span>, and <span className="text-emerald-400 font-semibold">recurring</span> with every new user.
              </p>
            </div>

            {/* Margin Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {/* Standard Check */}
              <div className="bg-black/40 border border-emerald-500/30 rounded-xl p-6 hover:border-emerald-400/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white font-orbitron">Standard Check</h4>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">60% MARGIN</Badge>
                </div>
                <p className="text-sm text-gray-400 mb-4">ID + Basic Criminal Background</p>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sale Price</div>
                    <div className="text-3xl font-extrabold text-emerald-400">$48.00</div>
                  </div>
                  <div className="text-2xl text-gray-600">→</div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Vendor Cost</div>
                    <div className="text-2xl font-bold text-gray-400">$30.00</div>
                  </div>
                  <div className="text-2xl text-gray-600">→</div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Profit</div>
                    <div className="text-2xl font-bold text-white">$18.00</div>
                  </div>
                </div>
              </div>

              {/* VIP Check */}
              <div className="bg-black/40 border border-fuchsia-500/30 rounded-xl p-6 hover:border-fuchsia-400/50 transition-all shadow-[0_0_20px_rgba(217,70,239,0.1)]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white font-orbitron">VIP Global Check</h4>
                  <Badge className="bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50">60% MARGIN</Badge>
                </div>
                <p className="text-sm text-gray-400 mb-4">Global AML/PEP + Comprehensive Background</p>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sale Price</div>
                    <div className="text-3xl font-extrabold text-fuchsia-400">$112.00</div>
                  </div>
                  <div className="text-2xl text-gray-600">→</div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Vendor Cost</div>
                    <div className="text-2xl font-bold text-gray-400">$70.00</div>
                  </div>
                  <div className="text-2xl text-gray-600">→</div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Profit</div>
                    <div className="text-2xl font-bold text-white">$42.00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Line */}
            <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border border-emerald-400/30 rounded-xl p-6 text-center">
              <p className="text-lg text-gray-300 leading-relaxed">
                This makes VALID™ a <span className="text-emerald-400 font-bold text-2xl">60% gross margin</span> business 
                <span className="text-white font-semibold"> before even considering Ghost™ Token commissions</span>. 
                The cost structure is clean, and the profit is immediate.
              </p>
            </div>
          </div>
        </section>


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

          <div className="bg-gradient-to-r from-cyan-950/40 to-green-950/40 border border-cyan-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">VALID: The Complete Stack</h3>
            </div>
            <p className="text-gray-300">
              <span className="text-cyan-400 font-semibold">10/10 integration score.</span> Identity + Health + Payments + Access + Network + Compliance + Revenue Share + Real-time Sync + FBO Instant Payout + Viral Chameleon Beacon. 
              No competitor scores above 4/10.
            </p>
          </div>

          {/* Enterprise CRM Category - Salesforce Spotlight */}
          <div className="bg-gradient-to-r from-purple-950/40 to-pink-950/40 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <Badge className="bg-purple-600/30 text-purple-400 border-purple-600/50 text-xs mb-3">
                  ENTERPRISE SOLUTION / CRM
                </Badge>
                <h3 className="text-xl font-bold text-white mb-2 font-orbitron">
                  Salesforce <span className="text-sm font-normal text-gray-400">(Enterprise CRM)</span>
                </h3>
                <p className="text-gray-300">
                  <span className="text-purple-400 font-semibold">Key Differentiator:</span> Valid™ transcends general CRM by providing <span className="text-white font-semibold">V-CRM (Verified CRM)</span>, tying secure identity and physical access directly to auditable revenue tracking and FBO settlement, which is not possible within a generalized CRM platform.
                </p>
              </div>
            </div>
          </div>

          {/* Social Media / Identity Platforms Category */}
          <div className="bg-gradient-to-r from-pink-950/40 to-orange-950/40 border border-pink-500/30 rounded-xl p-6 mt-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-pink-400" />
              </div>
              <div className="flex-1">
                <Badge className="bg-pink-600/30 text-pink-400 border-pink-600/50 text-xs mb-3">
                  SOCIAL MEDIA / IDENTITY PLATFORMS
                </Badge>
                <h3 className="text-xl font-bold text-white mb-2 font-orbitron">
                  Meta (Facebook), Instagram, TikTok, WhatsApp, LinkedIn <span className="text-sm font-normal text-gray-400">(Social Networks)</span>
                </h3>
                <p className="text-gray-300">
                  <span className="text-pink-400 font-semibold">Key Differentiator:</span> Valid™ functions as the <span className="text-white font-semibold">Social Chameleon</span>: it provides instant identity fluidity (My Signal), physical broadcasting (Beacon), and privacy control (Location Pulse), which is impossible within the static, digital-only framework of existing social networks.
                </p>
              </div>
            </div>
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
                  <th className="p-2 text-left font-bold uppercase" style={{ width: '25%' }}>Feature</th>
                  <th className="p-2 text-center font-extrabold text-cyan-400" style={{ width: '8%' }}>VALID</th>
                  <th className="p-2 text-center text-gray-500" style={{ width: '8%' }}>CLEAR</th>
                  <th className="p-2 text-center text-gray-500" style={{ width: '8%' }}>ID.me</th>
                  <th className="p-2 text-center text-gray-500" style={{ width: '8%' }}>TICKETMASTER</th>
                  <th className="p-2 text-center text-gray-500" style={{ width: '8%' }}>STERLING</th>
                  <th className="p-2 text-center text-gray-500" style={{ width: '8%' }}>STDCHECK</th>
                  <th className="p-2 text-center text-gray-500" style={{ width: '8%' }}>EVENTBRITE</th>
                  <th className="p-2 text-center text-gray-500" style={{ width: '8%' }}>DICE</th>
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
                    <td className="p-1 text-center">{renderCheck(row.dice)}</td>
                  </tr>
                ))}
                <tr className="bg-white/5 font-bold">
                  <td className="p-2 text-left text-white">TOTAL SCORE</td>
                  <td className="p-2 text-center text-cyan-400">{validScore}/10</td>
                  <td className="p-2 text-center text-gray-500">2/10</td>
                  <td className="p-2 text-center text-gray-500">1/10</td>
                  <td className="p-2 text-center text-gray-500">3/10</td>
                  <td className="p-2 text-center text-gray-500">1/10</td>
                  <td className="p-2 text-center text-gray-500">2/10</td>
                  <td className="p-2 text-center text-gray-500">4/10</td>
                  <td className="p-2 text-center text-gray-500">3/10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== 2027 FUTURE READY - ANIMATED BLOCK ===== */}
        <section className="relative py-16">
          <div className="text-center">
            {/* Animated Typing Block */}
            <div className="bg-black/80 backdrop-blur-xl border border-cyan-500/50 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto shadow-[0_0_80px_rgba(0,240,255,0.2)]">
              <div className="font-mono text-center space-y-6">
                {/* Line 1 - Typing Animation */}
                <div className="min-h-[60px] md:min-h-[80px] flex items-center justify-center">
                  <p className="text-4xl md:text-6xl font-bold text-cyan-400 tracking-wider">
                    <span className="text-cyan-500/70">&gt; </span>
                    {futureReadyText}
                    <span className={`inline-block w-[4px] h-[1em] bg-cyan-400 ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
                  </p>
                </div>
                
                {/* Line 2 - Static */}
                <div className="pt-4 border-t border-cyan-500/20">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-300 via-cyan-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(148,163,184,0.5)]">
                      VALID<sup className="text-cyan-400 text-lg ml-2">™</sup>
                    </span>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
                      <span className="text-lg md:text-xl font-light tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-white to-gray-400">
                        Your Spatial Verification Partner
                      </span>
                      <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                <Rocket className="h-6 w-6 text-cyan-400 animate-pulse" />
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== BEYOND THE QR: SENSING ROADMAP ===== */}
        <section className="relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-cyan-900/10 rounded-3xl -z-10"></div>
          
          {/* Header */}
          <div className="text-center mb-14">
            <Badge className="bg-purple-600/30 text-purple-400 border-purple-600/50 mb-5 text-lg px-6 py-2 tracking-widest">POST-OPTICAL ERA</Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-orbitron mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Beyond The QR: The Sensing Roadmap
            </h2>
            <p className="text-gray-300 max-w-4xl mx-auto text-lg md:text-xl leading-relaxed">
              QR codes are <span className="text-white font-bold">optical</span>—they require a camera, light, and aiming. 
              The future is <span className="text-cyan-400 font-bold">spatial</span> and <span className="text-purple-400 font-bold">ambient</span>—technology that <em>senses</em> you.
            </p>
          </div>

          {/* Integration Statement */}
          <div className="bg-gradient-to-r from-cyan-950/30 via-purple-950/30 to-pink-950/30 border border-white/10 rounded-2xl p-6 mb-12 text-center">
            <p className="text-base md:text-lg text-gray-300 max-w-4xl mx-auto">
              While VALID dominates the current optical standard (<span className="text-cyan-400 font-semibold">Dynamic QR</span>), our infrastructure is architected for the <span className="text-purple-400 font-semibold">Post-Optical Era</span>. 
              We are actively integrating <span className="text-white font-semibold">Ultra-Wideband (UWB)</span> and <span className="text-white font-semibold">NFC Type-F</span> protocols to transition from <em>"Scanning"</em> to <em>"Sensing."</em>
            </p>
          </div>

          {/* Three Technologies Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-14">
            
            {/* UWB - The Spatial Key */}
            <div className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border border-cyan-500/40 rounded-2xl p-8 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)] hover:border-cyan-400/60 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-5">
                <div className="h-14 w-14 rounded-xl bg-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                  <Zap className="h-7 w-7 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-orbitron">UWB</h3>
                  <p className="text-sm text-cyan-400/80 font-semibold">Ultra-Wideband</p>
                </div>
              </div>
              
              <div className="mb-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">AKA</p>
                <p className="text-lg text-white font-semibold">"The Spatial Key"</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">What It Is</p>
                  <p className="text-sm text-gray-300">The tech inside AirTags and modern digital car keys (BMW/Tesla).</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">How It Works</p>
                  <p className="text-sm text-gray-300">Unlike Bluetooth (which just knows you're "near"), UWB knows you're <span className="text-cyan-400 font-semibold">exactly 3 inches from the door handle</span>.</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">The VALID Upgrade</p>
                  <p className="text-sm text-gray-300">Phone stays in pocket. Walk through the Portal. Venue sensor handshakes instantly.</p>
                </div>
              </div>
              
              <div className="bg-cyan-500/20 border border-cyan-500/40 rounded-full px-5 py-2.5 inline-block">
                <span className="text-base font-bold text-cyan-400 tracking-wider">ZERO-CLICK ACCESS</span>
              </div>
            </div>

            {/* NFC Type-F - The Millisecond Tap */}
            <div className="bg-gradient-to-br from-purple-950/50 to-pink-950/50 border border-purple-500/40 rounded-2xl p-8 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] hover:border-purple-400/60 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-5">
                <div className="h-14 w-14 rounded-xl bg-purple-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                  <Radio className="h-7 w-7 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-orbitron">NFC TYPE-F</h3>
                  <p className="text-sm text-purple-400/80 font-semibold">FeliCa Protocol</p>
                </div>
              </div>
              
              <div className="mb-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">AKA</p>
                <p className="text-lg text-white font-semibold">"The Millisecond Tap"</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">What It Is</p>
                  <p className="text-sm text-gray-300">Standard NFC is slow. Type-F is what Tokyo subways use (Suica). Fires in <span className="text-purple-400 font-semibold">0.1 seconds</span>.</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">How It Works</p>
                  <p className="text-sm text-gray-300">Physical tap, but instant. Works <span className="text-purple-400 font-semibold">without network connectivity</span>.</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">The VALID Upgrade</p>
                  <p className="text-sm text-gray-300">For high-volume events (festivals, stadiums), we switch from "Scan" to "Tap." Synapse firing on contact.</p>
                </div>
              </div>
              
              <div className="bg-purple-500/20 border border-purple-500/40 rounded-full px-5 py-2.5 inline-block">
                <span className="text-base font-bold text-purple-400 tracking-wider">HARD-LINK VERIFICATION</span>
              </div>
            </div>

            {/* Biometric Hashing - You Are The Wallet */}
            <div className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 border border-green-500/40 rounded-2xl p-8 hover:shadow-[0_0_40px_rgba(34,197,94,0.2)] hover:border-green-400/60 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-5">
                <div className="h-14 w-14 rounded-xl bg-green-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  <Fingerprint className="h-7 w-7 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-orbitron">BIO-HASH</h3>
                  <p className="text-sm text-green-400/80 font-semibold">Tokenized Biology</p>
                </div>
              </div>
              
              <div className="mb-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">AKA</p>
                <p className="text-lg text-white font-semibold">"You Are The Wallet"</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">What It Is</p>
                  <p className="text-sm text-gray-300">Not facial recognition (which stores photos). This is <span className="text-green-400 font-semibold">hashing</span>—encrypted number strings only.</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">How It Works</p>
                  <p className="text-sm text-gray-300">Phone scans face/palm locally, converts to encrypted hash. Only the <span className="text-green-400 font-semibold">numbers</span> are sent.</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">The VALID™ Upgrade</p>
                  <p className="text-sm text-gray-300">Walk up to a kiosk, look at it, door opens. <span className="text-green-400 font-semibold">No phone required.</span></p>
                </div>
              </div>
              
              <div className="bg-green-500/20 border border-green-500/40 rounded-full px-5 py-2.5 inline-block">
                <span className="text-base font-bold text-green-400 tracking-wider">TOKENIZED BIOLOGY</span>
              </div>
            </div>
          </div>

          {/* Timeline: Today → Tomorrow */}
          <div className="bg-gradient-to-r from-black/60 via-black/40 to-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-14 mb-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.9)] animate-pulse"></div>
                <p className="text-lg text-cyan-400 font-bold tracking-widest">TODAY</p>
                <p className="text-3xl md:text-4xl font-bold text-white font-orbitron">You scan to enter</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:block h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
                <ArrowRight className="h-12 w-12 text-gray-400" />
                <div className="hidden md:block h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full md:hidden"></div>
              
              <div className="flex flex-col items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.9)] animate-pulse"></div>
                <p className="text-lg text-purple-400 font-bold tracking-widest">TOMORROW</p>
                <p className="text-3xl md:text-4xl font-bold text-white font-orbitron">You simply walk through</p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                VALID™ is not just a QR app—we are the <span className="text-cyan-400 font-bold">universal operating system for spatial identity</span>.
              </p>
            </div>
          </div>

          {/* Investor Takeaway */}
          <div className="bg-gradient-to-r from-amber-950/30 via-yellow-950/20 to-amber-950/30 border border-amber-500/30 rounded-xl p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Lightbulb className="h-6 w-6 text-amber-400" />
              <p className="text-sm text-amber-400 font-bold uppercase tracking-widest">Investor Insight</p>
            </div>
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto">
              We are making money on <span className="text-cyan-400 font-semibold">QRs today</span>, but we are building the <span className="text-amber-400 font-bold">"Digital Car Key for Life"</span> for tomorrow.
            </p>
          </div>
        </section>


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

        {/* ===== CURRENT ROUND STRUCTURE ===== */}
        <section className="text-center py-12">
          <div className="bg-gradient-to-r from-slate-950/80 to-slate-900/80 border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,240,255,0.1)]">
            <Rocket className="h-12 w-12 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron text-white mb-4">CURRENT ROUND STRUCTURE</h2>
            
            <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
              Strategic allocation across <span className="text-cyan-400 font-semibold">two tranches</span> for optimal investor positioning.
            </p>

            {/* Two Tranches - Pricing Table Style */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
              
              {/* TRANCHE 1 - ALPHA ROUND */}
              <div className="bg-gradient-to-br from-amber-950/50 to-amber-900/30 p-8 rounded-2xl border-2 border-amber-500/60 shadow-[0_0_40px_rgba(245,158,11,0.25)] relative overflow-hidden">
                {/* Best Value Ribbon */}
                <div className="absolute top-6 -right-8 bg-amber-500 text-black font-bold text-xs px-10 py-1.5 rotate-45 shadow-lg">
                  BEST VALUE
                </div>
                
                <div className="mb-6">
                  <Badge className="bg-green-500/20 text-green-400 border border-green-500/50 font-bold px-4 py-1.5 mb-4">
                    <span className="animate-pulse mr-2">●</span> ACTIVE — LIMITED AVAILABILITY
                  </Badge>
                </div>
                
                <h3 className="text-2xl font-bold text-amber-400 mb-1 font-orbitron">TRANCHE 1</h3>
                <p className="text-lg text-amber-300/80 mb-6">Alpha Round (Closing Imminently)</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-amber-500/20">
                    <span className="text-gray-400">Allocation</span>
                    <span className="text-2xl font-bold text-white">$100,000</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-amber-500/20">
                    <span className="text-gray-400">Minimum Check</span>
                    <span className="text-xl font-semibold text-white">$25,000</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-amber-500/20">
                    <span className="text-gray-400">Valuation Cap</span>
                    <span className="text-xl font-bold text-amber-400">$12,500,000</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-amber-500/20">
                    <span className="text-gray-400">Instrument</span>
                    <span className="text-lg font-semibold text-white">SAFE (20% Discount)</span>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-amber-400" />
                    <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">Alpha Investor Advantage</span>
                  </div>
                  <p className="text-sm text-gray-300">Lock in pricing <span className="text-amber-400 font-bold">37.5% lower</span> than the upcoming institutional round.</p>
                </div>
              </div>

              {/* TRANCHE 2 - INSTITUTIONAL ROUND */}
              <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 p-8 rounded-2xl border border-white/10 relative">
                <div className="mb-6">
                  <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold px-4 py-1.5">
                    OPENS UPON TRANCHE 1 CLOSE
                  </Badge>
                </div>
                
                <h3 className="text-2xl font-bold text-cyan-400 mb-1 font-orbitron">TRANCHE 2</h3>
                <p className="text-lg text-cyan-300/80 mb-6">Institutional Round (Follow-On)</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Target Raise</span>
                    <span className="text-2xl font-bold text-white">$1,400,000</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Valuation Cap</span>
                    <span className="text-xl font-bold text-cyan-400">$20,000,000</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Instrument</span>
                    <span className="text-lg font-semibold text-white">SAFE</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Status</span>
                    <span className="text-lg text-gray-400">Pending T1 Close</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                    <span className="text-cyan-400 font-bold text-sm uppercase tracking-wider">The Comparison</span>
                  </div>
                  <p className="text-sm text-gray-300">Tranche 1 investors secure equity at a <span className="text-cyan-400 font-bold">$7.5M lower cap</span> than this round.</p>
                </div>
              </div>
            </div>

            {/* LIQUIDITY & ROI STRATEGY */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-8 font-orbitron">LIQUIDITY & ROI STRATEGY</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {/* Exit Strategy */}
                <div className="bg-gradient-to-br from-green-950/40 to-emerald-950/30 border border-green-500/30 rounded-xl p-6 text-left hover:border-green-500/50 transition-all">
                  <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-bold text-green-400 mb-3 font-orbitron">THE EXIT STRATEGY</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Acquisition target for <span className="text-white font-semibold">Fintech (Block, Stripe)</span>, Insurance, or Hospitality groups. Projected <span className="text-green-400 font-bold">10x-20x multiple</span> within 3-5 years.
                  </p>
                </div>

                {/* Dividend Distributions */}
                <div className="bg-gradient-to-br from-purple-950/40 to-pink-950/30 border border-purple-500/30 rounded-xl p-6 text-left hover:border-purple-500/50 transition-all">
                  <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-bold text-purple-400 mb-3 font-orbitron">DIVIDEND DISTRIBUTIONS</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Unlike standard tech burns, VALID™ acts as a <span className="text-white font-semibold">transaction conduit</span>. We intend to distribute a <span className="text-purple-400 font-bold">% of Net Transaction Fees</span> back to equity holders once stabilized.
                  </p>
                </div>

                {/* Secondary Market */}
                <div className="bg-gradient-to-br from-cyan-950/40 to-blue-950/30 border border-cyan-500/30 rounded-xl p-6 text-left hover:border-cyan-500/50 transition-all">
                  <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
                    <ArrowLeftRight className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h4 className="text-lg font-bold text-cyan-400 mb-3 font-orbitron">SECONDARY MARKET</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Early Tranche 1 investors will have the option to <span className="text-white font-semibold">sell equity</span> to late-stage <span className="text-cyan-400 font-bold">Series A/B investors</span> for early liquidity.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-lg px-10 py-6 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all duration-300"
              onClick={() => navigate('/partner-application')}
            >
              <Rocket className="mr-2 h-5 w-5" />
              Secure Tranche 1 Allocation
            </Button>
          </div>

          {/* ===== RISK & LEGAL DISCLOSURE ===== */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-6">
              <Accordion type="single" collapsible defaultValue="risk-disclosure">
                <AccordionItem value="risk-disclosure" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <span className="text-lg font-bold text-amber-500 font-orbitron">Important Risk Disclosures</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
                      <h4 className="text-base font-bold text-white uppercase tracking-wider border-b border-gray-700 pb-2">
                        RISK FACTOR DISCLOSURE & LIMITATION OF LIABILITY
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-bold text-amber-400 mb-1">1. Speculative Investment</h5>
                          <p>Investment in Valid™ (via Giant Ventures, LLC) is highly speculative and involves a high degree of risk. This opportunity is suitable only for persons who can afford to lose their entire investment. There is no guarantee that the company will achieve its business objectives or that the valuation targets will be met.</p>
                        </div>
                        
                        <div>
                          <h5 className="font-bold text-amber-400 mb-1">2. Not a Loan</h5>
                          <p>The funds contributed via SAFE (Simple Agreement for Future Equity) are not a loan. There is no maturity date, no interest rate, and no requirement for repayment. If the company dissolves or ceases operations, investors may receive $0.</p>
                        </div>
                        
                        <div>
                          <h5 className="font-bold text-amber-400 mb-1">3. No Personal Guarantee</h5>
                          <p>The investment is made solely into the corporate entity. The Founder/CEO provides no personal guarantee or collateral. By proceeding, the investor acknowledges that recourse is limited strictly to the assets of the Company, not the personal assets of its officers or directors.</p>
                        </div>
                        
                        <div>
                          <h5 className="font-bold text-amber-400 mb-1">4. Indefinite Holding Period</h5>
                          <p>This is an illiquid investment. Investors may not be able to sell or transfer their equity for an indefinite period.</p>
                        </div>
                      </div>

                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* ===== SLIDE 12: THE FOUNDER ===== */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-cyan-950/40 border border-cyan-500/30 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,240,255,0.1)]">
              
              {/* Badge */}
              <div className="flex justify-center mb-6">
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 px-6 py-2 text-sm font-bold tracking-widest uppercase">
                  THE FOUNDER
                </Badge>
              </div>
              
              {/* Name & Title */}
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white font-orbitron mb-2 tracking-wider">
                  STEVEN GRILLO
                </h2>
                <p className="text-lg text-cyan-400 font-semibold tracking-widest uppercase">
                  Founder · Systems Architect
                </p>
              </div>
              
              {/* Three Pillars */}
              <div className="space-y-8 mb-10">
                
                {/* THE BACKGROUND */}
                <div className="border-l-4 border-cyan-500/50 pl-6">
                  <h3 className="text-xl font-bold text-cyan-400 font-orbitron mb-3 tracking-wide">THE BACKGROUND</h3>
                  <p className="text-gray-100 text-lg leading-relaxed">
                    53 years of life. 35 years of execution. Self-made, scaling multiple businesses from zero to exit. I bridged the gap between the hard realities of infrastructure and the precision of high-stakes regulation. A career built on tangible results, not theory.
                  </p>
                </div>
                
                {/* THE OPERATOR */}
                <div className="border-l-4 border-cyan-500/50 pl-6">
                  <h3 className="text-xl font-bold text-cyan-400 font-orbitron mb-3 tracking-wide">THE OPERATOR</h3>
                  <p className="text-gray-100 text-lg leading-relaxed">
                    A veteran of the real economy—not the sandbox. Deep mastery of Operations, Risk Management, and High-Liability sectors. I don't guess what venues, employers, and operators need. I know, because I've lived it. I translate complex market necessities into functional, revenue-generating systems.
                  </p>
                </div>
                
                {/* THE ARCHITECT */}
                <div className="border-l-4 border-cyan-500/50 pl-6">
                  <h3 className="text-xl font-bold text-cyan-400 font-orbitron mb-3 tracking-wide">THE ARCHITECT</h3>
                  <p className="text-gray-100 text-lg leading-relaxed">
                    Pioneer of Synthesized AI Methodology. I orchestrate the modern machinery of scale: GitHub for source, Vercel for velocity, Supabase for truth. I command a symphony of AI Agents—coordinating distinct models to build enterprise-grade infrastructure with zero latency. I turned the software development lifecycle into a one-man industrial operation, achieving in 300 hours what traditional teams fail to deliver in a year.
                  </p>
                </div>
                
              </div>
              
              {/* THE STANDARD Quote */}
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
                <h3 className="text-lg font-bold text-cyan-400 font-orbitron mb-3 tracking-widest">THE STANDARD</h3>
                <p className="text-2xl md:text-3xl text-white font-bold italic font-orbitron">
                  "Experience cannot be coded. It must be lived."
                </p>
              </div>
              
            </div>
          </div>
        </section>

        {/* ===== SCHEDULE A CALL ===== */}
        <section className="text-center py-8">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4 font-orbitron">Ready to Discuss?</h3>
            <p className="text-gray-300 mb-6">Schedule a direct call with our founding team.</p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              onClick={() => window.open('https://calendly.com/steve-bevalid/30min', '_blank')}
            >
              <Phone className="mr-2 h-5 w-5" />
              Schedule 30-Min Call
            </Button>
          </div>
        </section>

      </main>
    </div>
  );
};

export default PitchDeck;
