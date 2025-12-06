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
  ArrowRight,
  Check,
  X
} from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";
import { ThemeToggle } from "@/components/ThemeToggle";

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

  const useOfFunds = [
    { category: "Sales & Marketing", percent: 40, color: "bg-blue-500" },
    { category: "Product Development", percent: 30, color: "bg-purple-500" },
    { category: "Operations", percent: 20, color: "bg-green-500" },
    { category: "Reserve", percent: 10, color: "bg-orange-500" },
  ];

  const scorecardData = [
    {
      feature: "Integrated Health/Tox Status (HIPAA)",
      valid: true,
      clear: false,
      idme: false,
      ticketmaster: false,
      sterling: false,
      stdcheck: true,
      highlight: true,
    },
    {
      feature: "PEER-TO-PEER NETWORK TRUST",
      valid: true,
      clear: false,
      idme: false,
      ticketmaster: false,
      sterling: false,
      stdcheck: false,
      highlight: true,
    },
    {
      feature: "Automated Revenue Share ($10 Transaction Model)",
      valid: true,
      clear: false,
      idme: false,
      ticketmaster: false,
      sterling: false,
      stdcheck: false,
      highlight: true,
    },
    {
      feature: "Zero-Trust Backend Security & Architecture",
      valid: true,
      clear: false,
      idme: false,
      ticketmaster: false,
      sterling: false,
      stdcheck: false,
      highlight: true,
    },
    {
      feature: "Frictionless Staff Workflow & Dedicated B2B Portal",
      valid: true,
      clear: true,
      idme: false,
      ticketmaster: true,
      sterling: false,
      stdcheck: false,
      highlight: true,
    },
    {
      feature: "Rolling (Continuous) Compliance & Screening",
      valid: true,
      clear: false,
      idme: false,
      ticketmaster: false,
      sterling: true,
      stdcheck: false,
      highlight: false,
    },
  ];

  const renderCheck = (value: boolean, isValid?: boolean) => {
    if (value) {
      return <Check className={`h-5 w-5 mx-auto ${isValid ? 'text-[#2ecc71]' : 'text-green-500'}`} />;
    }
    return <X className="h-5 w-5 mx-auto text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="outline" 
              className="border-border text-muted-foreground hover:bg-muted"
              onClick={() => window.open("mailto:invest@bevalid.app", "_blank")}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-16">
        {/* Hero Slide */}
        <section className="text-center py-16">
          <img src={logo} alt="VALID" className="h-32 md:h-40 mx-auto mb-6 rounded-xl" />
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
            Seed Round Open
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Orbitron, sans-serif', color: '#2ecc71', textShadow: '0 0 5px rgba(46, 204, 113, 0.7)' }}>
            VALID: Integrated Identity & Payment Ecosystem
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Pitch Deck Summary - Zero-Trust Compliance & Revenue Generation
          </p>
        </section>

        {/* Investment Thesis Section */}
        <section className="mb-8">
          <Card className="bg-card border-l-4 border-amber-500">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-amber-500 mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Investment Thesis: Unmatched Risk Transfer & Profit
              </h2>
              <ul className="text-foreground space-y-3 text-sm list-disc list-inside">
                <li><strong>INDUSTRY-LEADING RISK TRANSFER:</strong> Our Zero-Trust architecture legally shifts liability away from partners (venues/employers) and onto the VALID platform.</li>
                <li><strong>HIGH-MARGIN DUAL REVENUE:</strong> Monetization via user subscriptions + instant <strong>$10 transactional fees</strong> (Incognito Token).</li>
                <li><strong>DATA MOAT:</strong> We build the core Identity/Health/Payment layer for high-liability social and asset management economies.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Competitive Scorecard Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-amber-500 mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Direct Competitive Scorecard: Why VALID Wins
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            VALID is the only platform that integrates the six key functions essential for de-risking and <strong>monetizing</strong> high-liability businesses.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border border-border">
              <thead>
                <tr className="bg-muted text-foreground">
                  <th className="p-2 text-left font-bold uppercase" style={{ width: '30%' }}>VALID FEATURE</th>
                  <th colSpan={6} className="p-2 text-center font-bold uppercase border-l border-border">COMPETITORS</th>
                </tr>
                <tr className="bg-muted text-foreground">
                  <th className="p-2" style={{ width: '30%' }}></th>
                  <th className="p-2 text-center font-extrabold" style={{ width: '12%', color: '#2ecc71' }}>VALID</th>
                  <th className="p-2 text-center" style={{ width: '12%' }}>CLEAR</th>
                  <th className="p-2 text-center" style={{ width: '12%' }}>ID.me</th>
                  <th className="p-2 text-center" style={{ width: '12%' }}>TICKETMASTER</th>
                  <th className="p-2 text-center" style={{ width: '12%' }}>STERLING</th>
                  <th className="p-2 text-center" style={{ width: '12%' }}>STDCHECK</th>
                </tr>
              </thead>
              <tbody className="bg-card">
                {scorecardData.map((row, idx) => (
                  <tr key={idx} className="border-b border-border">
                    <td className={`p-2 text-left text-foreground ${row.highlight ? 'font-semibold' : ''}`}>
                      {row.feature}
                    </td>
                    <td className="p-2 text-center">{renderCheck(row.valid, true)}</td>
                    <td className="p-2 text-center">{renderCheck(row.clear)}</td>
                    <td className="p-2 text-center">{renderCheck(row.idme)}</td>
                    <td className="p-2 text-center">{renderCheck(row.ticketmaster)}</td>
                    <td className="p-2 text-center">{renderCheck(row.sterling)}</td>
                    <td className="p-2 text-center">{renderCheck(row.stdcheck)}</td>
                  </tr>
                ))}
                {/* Total Score Row */}
                <tr className="bg-amber-900/50 border-t-2 border-amber-600">
                  <td className="p-2 text-left text-amber-300 font-extrabold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    TOTAL INTEGRATION SCORE (6 Max)
                  </td>
                  <td className="p-2 text-center text-lg font-extrabold" style={{ color: '#f39c12' }}>6/6</td>
                  <td className="p-2 text-center text-lg text-muted-foreground font-extrabold">1/6</td>
                  <td className="p-2 text-center text-lg text-muted-foreground font-extrabold">0/6</td>
                  <td className="p-2 text-center text-lg text-muted-foreground font-extrabold">2/6</td>
                  <td className="p-2 text-center text-lg text-muted-foreground font-extrabold">1/6</td>
                  <td className="p-2 text-center text-lg text-muted-foreground font-extrabold">1/6</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-bold text-amber-500 mt-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            🔑 Key Differentiation: Zero-Trust Security
          </h3>
          <p className="text-muted-foreground text-sm mt-2">
            Competitor security models (FCRA compliance, SSO identity) are <strong>static and siloed</strong>. VALID's <strong>Zero-Trust Architecture</strong> requires continuous verification and integrates dynamic, real-time health/tox data, making it the only truly risk-based access system. This level of comprehensive, dynamic security is unmatched and crucial for high-liability venues.
          </p>
        </section>

        {/* Key Metrics */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">Key Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.label} className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <metric.icon className={`h-8 w-8 mx-auto mb-3 ${metric.color}`} />
                  <div className="text-3xl font-bold text-foreground">{metric.value}</div>
                  {metric.subtext && <span className="text-sm text-muted-foreground">{metric.subtext}</span>}
                  <div className="text-sm text-muted-foreground mt-1">{metric.label}</div>
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
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-800/50">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">👽</div>
              <p className="text-xl text-foreground">
                "How do I know they're really safe?"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
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
                <div key={point.title} className="bg-card p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-1">{point.title}</h3>
                  <p className="text-sm text-muted-foreground">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-2">Market Opportunity</h2>
          <p className="text-muted-foreground text-center mb-8">$5.7B+ Total Addressable Market</p>
          <div className="grid md:grid-cols-3 gap-4">
            {marketData.map((market) => (
              <Card key={market.segment} className="bg-card border-border">
                <CardContent className="p-6">
                  <Target className="h-6 w-6 text-primary mb-3" />
                  <div className="text-2xl font-bold text-foreground">{market.size}</div>
                  <div className="text-foreground">{market.segment}</div>
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
              <Card key={stream.name} className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-3 text-green-400" />
                  <div className="font-semibold text-foreground">{stream.name}</div>
                  <div className="text-xl font-bold text-green-400 my-2">{stream.price}</div>
                  <Badge variant="outline" className="text-muted-foreground border-border">
                    {stream.type}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Use of Funds */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">Use of Funds</h2>
          <Card className="bg-card border-border max-w-2xl mx-auto">
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
                    <span className="text-muted-foreground">{item.category}</span>
                    <span className="text-foreground font-semibold ml-auto">{item.percent}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* The Ask Section */}
        <section>
          <Card className="bg-card/70 border-l-4" style={{ borderColor: '#2ecc71' }}>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Our Ask: $750,000 Seed Round
              </h3>
              <p className="text-muted-foreground text-sm">
                Funding is dedicated to <strong>accelerating DevSecOps implementation</strong> and securing the <strong>Lab Network Acquisition</strong> to capture a dominant market share.
              </p>
              <a 
                href="mailto:invest@bevalid.app" 
                className="mt-4 inline-block font-bold hover:text-foreground transition-colors"
                style={{ fontFamily: 'Orbitron, sans-serif', color: '#f39c12' }}
              >
                Contact Investor Relations: invest@bevalid.app
              </a>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <Card className="bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 border-primary/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Join the Round</h2>
              <p className="text-muted-foreground mb-6">
                We are building the trust infrastructure for health-conscious communities worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => window.open("mailto:invest@bevalid.app?subject=Investment Inquiry", "_blank")}
                >
                  Request Deck
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-border text-muted-foreground hover:bg-muted"
                  onClick={() => navigate("/competitive-scorecard")}
                >
                  View Competitive Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <section className="text-center text-muted-foreground text-sm pb-8">
          <p>VALID™ — The Safety Shield™</p>
          <p className="mt-1">Confidential — For Investor Use Only</p>
        </section>
      </main>
    </div>
  );
};

export default PitchDeck;