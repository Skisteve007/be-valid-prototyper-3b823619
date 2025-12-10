import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Shield, 
  Zap, 
  Globe, 
  DollarSign, 
  Network, 
  Lock, 
  TrendingUp,
  Users,
  Building2,
  Plane,
  Car,
  Briefcase,
  Heart,
  CheckCircle2,
  XCircle,
  Target,
  Rocket,
  Crown,
  Sparkles
} from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";

const BuildersVision = () => {
  const navigate = useNavigate();

  const unicornPillars = [
    {
      icon: DollarSign,
      title: "NEAR-ZERO MARGINAL COST",
      subtitle: "The $10 Token Economics",
      description: "Every Incognito Access Token generates $4 pure margin at scale. No inventory, no COGS, no fulfillment. This is software economics applied to physical access—the same model that made Uber worth $150B.",
      metric: "$4.00",
      metricLabel: "Pure Margin Per Transaction"
    },
    {
      icon: Lock,
      title: "REGULATORY MOAT",
      subtitle: "Complexity as Competitive Advantage",
      description: "Integrating HIPAA-compliant health data with payment rails and physical access requires 18+ months of compliance engineering. No competitor can replicate this overnight. We've already done it.",
      metric: "18+",
      metricLabel: "Months to Replicate"
    },
    {
      icon: Network,
      title: "VIRAL NETWORK EFFECTS",
      subtitle: "Members Recruit Members",
      description: "Every verified member becomes a distribution channel. When they share their QR, they're marketing VALID. Instagram, TikTok, dating apps—we're embedded in the social graph.",
      metric: "3.2x",
      metricLabel: "Organic Referral Rate"
    },
    {
      icon: Shield,
      title: "LIABILITY TRANSFER",
      subtitle: "We Become Essential Infrastructure",
      description: "Venues and employers face existential legal risk without verification. VALID absorbs that liability. We're not a nice-to-have—we're the insurance policy they can't operate without.",
      metric: "$0",
      metricLabel: "Venue Liability Exposure"
    }
  ];

  const marketVerticals = [
    { icon: Building2, name: "Nightlife & Events", tam: "$890M", growth: "14% CAGR", status: "LIVE" },
    { icon: Heart, name: "Lifestyle & Dating", tam: "$450M", growth: "22% CAGR", status: "LIVE" },
    { icon: Car, name: "Transportation & Fleet", tam: "$1.2B", growth: "8% CAGR", status: "LAUNCHING" },
    { icon: Briefcase, name: "Workforce Compliance", tam: "$3.2B", growth: "6% CAGR", status: "LAUNCHING" },
    { icon: Plane, name: "Travel & Hospitality", tam: "$780M", growth: "12% CAGR", status: "ROADMAP" },
    { icon: Users, name: "Creator & Talent", tam: "$340M", growth: "28% CAGR", status: "LIVE" }
  ];

  const competitorFailures = [
    {
      name: "CLEAR",
      valuation: "$4.3B",
      limitation: "Identity only. No health. No payments. No network effects.",
      verdict: "SINGLE-PURPOSE"
    },
    {
      name: "ID.me",
      valuation: "$1.5B",
      limitation: "Government identity. Zero commercial integration. No revenue share.",
      verdict: "WRONG MARKET"
    },
    {
      name: "Sterling",
      valuation: "$5.3B",
      limitation: "Background checks only. 72-hour turnaround. No real-time.",
      verdict: "LEGACY SLOW"
    },
    {
      name: "STDCheck",
      valuation: "Private",
      limitation: "Results only. No verification layer. No B2B. No ecosystem.",
      verdict: "POINT SOLUTION"
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

  const whyNow = [
    "Post-pandemic health consciousness is permanent—not temporary",
    "Gig economy growth demands portable verification (85M workers)",
    "Venue insurance costs up 340% since 2019—they need liability transfer",
    "Dating app revenue hit $5.3B—trust is the missing feature",
    "AI-generated identity fraud up 3,000%—verification is existential"
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Background Effects - Matching Homepage */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/partners')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 px-4 py-1">
            CONFIDENTIAL — INVESTOR ONLY
          </Badge>
        </div>

        {/* Hero */}
        <div className="text-center mb-20">
          <img src={logo} alt="VALID" className="h-20 md:h-24 mx-auto mb-6 rounded-xl" />
          
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-cyan-500/30 bg-cyan-900/10 rounded text-sm font-mono tracking-[0.15em] text-cyan-400 uppercase">
            <span>Powered By Synthesized AI</span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8),0_0_20px_rgba(59,130,246,0.5)]"></span>
            </span>
          </div>
          
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_20px_rgba(0,240,255,0.8)]" />
            <span className="text-cyan-400 text-sm tracking-[0.3em] font-medium">BUILDER'S THESIS</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-orbitron">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              THE UNICORN CASE
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8">
            Why VALID will become the trust infrastructure layer for every high-stakes human interaction
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
        </div>

        {/* The Core Insight */}
        <section className="mb-20">
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
              <span className="text-white font-semibold"> It's the protocol that makes high-stakes interactions possible.</span> When you get into an Uber, you trust the driver is verified. When you enter a venue, they trust you're safe. When you meet someone new, you both need proof. VALID is that proof—instant, portable, and monetizable at every touchpoint.
            </p>
          </div>
        </section>

        {/* The Four Pillars */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="bg-white/10 text-white border-white/20 mb-4">VALUE DRIVERS</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron">The Four Unicorn Pillars</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {unicornPillars.map((pillar, index) => (
              <div 
                key={index}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                    <pillar.icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">{pillar.metric}</div>
                    <div className="text-xs text-gray-500">{pillar.metricLabel}</div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 font-orbitron">{pillar.title}</h3>
                <p className="text-cyan-400 text-sm mb-3">{pillar.subtitle}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Competitors Can't Win */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="bg-red-600/30 text-red-500 border-red-600/50 mb-4">COMPETITIVE MOAT</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron">Why Competitors Can't Win</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Billion-dollar companies have pieces of the puzzle. None have assembled it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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

          <div className="mt-8 bg-gradient-to-r from-cyan-950/40 to-green-950/40 border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">VALID: The Complete Stack</h3>
            </div>
            <p className="text-gray-300">
              <span className="text-cyan-400 font-semibold">8/8 integration score.</span> Identity + Health + Payments + Access + Network + Compliance + Revenue Share + Real-time Sync. 
              No competitor scores above 3/8. This isn't an incremental advantage—it's a categorical difference.
            </p>
          </div>
        </section>

        {/* The Thesis */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 mb-4">THE THESIS</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron">Four Truths That Make VALID Inevitable</h2>
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

        {/* Market Expansion */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="bg-green-600/30 text-green-400 border-green-600/50 mb-4">EXPANSION PATH</Badge>
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

        {/* Why Now */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-white/5 to-cyan-950/20 border border-white/10 rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <Rocket className="h-8 w-8 text-cyan-400" />
              <h2 className="text-2xl md:text-3xl font-bold font-orbitron text-white">Why Now?</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {whyNow.map((reason, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="h-3 w-3 text-cyan-400" />
                  </div>
                  <span className="text-gray-300">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Ask */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border border-cyan-500/40 rounded-2xl p-8 md:p-12 text-center shadow-[0_0_60px_rgba(0,240,255,0.15)]">
            <Target className="h-12 w-12 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron text-white mb-4">The Ask</h2>
            <div className="text-5xl md:text-6xl font-bold text-cyan-400 mb-4 font-orbitron">$750,000</div>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Seed round to accelerate DevSecOps, secure lab network partnerships, and capture dominant market share before incumbents can react.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = 'mailto:invest@bevalid.app'}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-6 text-lg"
              >
                Contact Investor Relations
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/pitch-deck')}
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 px-8 py-6 text-lg"
              >
                View Full Deck
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pb-8">
          <p className="mb-2">VALID™ — The Safety Shield™</p>
          <p>Confidential — For Qualified Investor Use Only</p>
        </div>
      </div>
    </div>
  );
};

export default BuildersVision;
