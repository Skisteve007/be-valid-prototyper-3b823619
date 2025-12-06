import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  Globe, 
  TrendingUp, 
  Clock, 
  Lock, 
  QrCode,
  Building2,
  DollarSign,
  Target,
  Zap,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";

const PitchDeck = () => {
  const navigate = useNavigate();

  const metrics = [
    { label: "Partner Venues", value: "28+", icon: Building2, color: "text-blue-500" },
    { label: "Countries", value: "11", icon: Globe, color: "text-green-500" },
    { label: "Verification Speed", value: "3 sec", icon: Clock, color: "text-purple-500" },
    { label: "Member Growth", value: "15%", subtext: "MoM", icon: TrendingUp, color: "text-orange-500" },
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

  const competitiveAdvantages = [
    "Only dual-verification platform (STD + Toxicology)",
    "Privacy-first architecture with no PHI exposure",
    "Real-time QR badge vs. point-in-time results",
    "Pre-built venue network with switching costs",
    "Subscription economics vs. transactional",
  ];

  const useOfFunds = [
    { category: "Sales & Marketing", percent: 40, color: "bg-blue-500" },
    { category: "Product Development", percent: 30, color: "bg-purple-500" },
    { category: "Operations", percent: 20, color: "bg-green-500" },
    { category: "Reserve", percent: 10, color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button 
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
            onClick={() => window.open("mailto:investors@bevalid.app", "_blank")}
          >
            Contact Us
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-16">
        {/* Hero Slide */}
        <section className="text-center py-16">
          <img src={logo} alt="VALID" className="h-32 md:h-40 mx-auto mb-6 rounded-xl" />
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
            Seed Round Open
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            VALID
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-4">
            Privacy-First Health Verification Platform
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            One Scan. Zero Doubt. The trust infrastructure for health-conscious communities.
          </p>
        </section>

        {/* Key Metrics */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">Key Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.label} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <metric.icon className={`h-8 w-8 mx-auto mb-3 ${metric.color}`} />
                  <div className="text-3xl font-bold text-white">{metric.value}</div>
                  {metric.subtext && <span className="text-sm text-slate-400">{metric.subtext}</span>}
                  <div className="text-sm text-slate-400 mt-1">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Problem */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge variant="destructive" className="mb-4">The Problem</Badge>
            <h2 className="text-3xl font-bold mb-6">Trust Without Proof</h2>
            <ul className="space-y-4">
              {problemPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-400 text-sm">✕</span>
                  </div>
                  <span className="text-slate-300">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-800/50">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">😰</div>
              <p className="text-xl text-slate-300">
                "How do I know they're really clean?"
              </p>
              <p className="text-sm text-slate-500 mt-2">
                — Every health-conscious person ever
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Solution */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <Card className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border-green-800/50 order-2 md:order-1">
            <CardContent className="p-8 text-center">
              <QrCode className="h-24 w-24 mx-auto mb-4 text-green-400" />
              <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-semibold">Verified</span>
              </div>
            </CardContent>
          </Card>
          <div className="order-1 md:order-2">
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">The Solution</Badge>
            <h2 className="text-3xl font-bold mb-6">VALID</h2>
            <div className="grid grid-cols-2 gap-4">
              {solutionPoints.map((point) => (
                <div key={point.title} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="font-semibold text-white mb-1">{point.title}</h3>
                  <p className="text-sm text-slate-400">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-2">Market Opportunity</h2>
          <p className="text-slate-400 text-center mb-8">$5.7B+ Total Addressable Market</p>
          <div className="grid md:grid-cols-3 gap-4">
            {marketData.map((market) => (
              <Card key={market.segment} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <Target className="h-6 w-6 text-primary mb-3" />
                  <div className="text-2xl font-bold text-white">{market.size}</div>
                  <div className="text-slate-300">{market.segment}</div>
                  <Badge variant="secondary" className="mt-2">{market.growth}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Business Model */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">Business Model</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {revenueStreams.map((stream) => (
              <Card key={stream.name} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-3 text-green-400" />
                  <div className="font-semibold text-white">{stream.name}</div>
                  <div className="text-xl font-bold text-green-400 my-2">{stream.price}</div>
                  <Badge variant="outline" className="text-slate-400 border-slate-600">
                    {stream.type}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Competitive Advantages */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">Why We Win</Badge>
            <h2 className="text-3xl font-bold mb-6">Competitive Moat</h2>
            <ul className="space-y-3">
              {competitiveAdvantages.map((adv, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">{adv}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <h3 className="font-semibold text-white mb-4">Feature Comparison</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">QR Verification</span>
                  <span className="text-green-400">✓ Only Us</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Privacy Firewall</span>
                  <span className="text-green-400">✓ Only Us</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Venue Network</span>
                  <span className="text-green-400">✓ Only Us</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dual Verification</span>
                  <span className="text-green-400">✓ Only Us</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Use of Funds */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">Use of Funds</h2>
          <Card className="bg-slate-800/50 border-slate-700 max-w-2xl mx-auto">
            <CardContent className="p-6">
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
                    <span className="text-slate-300">{item.category}</span>
                    <span className="text-white font-semibold ml-auto">{item.percent}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <Card className="bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 border-primary/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Join the Round</h2>
              <p className="text-slate-400 mb-6">
                We are building the trust infrastructure for health-conscious communities worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => window.open("mailto:investors@bevalid.app?subject=Investment Inquiry", "_blank")}
                >
                  Request Deck
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  onClick={() => navigate("/competitive-scorecard")}
                >
                  View Competitive Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <section className="text-center text-slate-500 text-sm pb-8">
          <p>VALID™ — The Safety Shield™</p>
          <p className="mt-1">Confidential — For Investor Use Only</p>
        </section>
      </main>
    </div>
  );
};

export default PitchDeck;
