import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Rocket, 
  Target, 
  TrendingUp, 
  Shield, 
  Globe,
  Zap,
  Users,
  DollarSign,
  Lock,
  CheckCircle2
} from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";
import { ThemeToggle } from "@/components/ThemeToggle";

const BuildersVision = () => {
  const navigate = useNavigate();

  const unicornFactors = [
    {
      icon: Shield,
      title: "Zero-Trust Risk Transfer",
      description: "Industry-first architecture that legally shifts liability from partners to the VALID platform, creating unprecedented value for high-liability businesses.",
      highlight: true
    },
    {
      icon: DollarSign,
      title: "Dual Revenue Engine",
      description: "Subscription model + transactional $10 fees on every Incognito Token scan. Multiple monetization streams from day one.",
      highlight: true
    },
    {
      icon: Globe,
      title: "Network Effect Moat",
      description: "Every new user, venue, and employer strengthens the network. Peer-to-peer trust creates exponential value growth.",
      highlight: true
    },
    {
      icon: Lock,
      title: "Data Sovereignty Layer",
      description: "We own the identity/health/payment layer for social economies. This is infrastructure, not just an app.",
      highlight: false
    },
    {
      icon: Zap,
      title: "3-Second Verification",
      description: "Instant QR scan replaces awkward conversations, paperwork, and delays. Frictionless user experience drives adoption.",
      highlight: false
    },
    {
      icon: Users,
      title: "Multi-Vertical Expansion",
      description: "Nightlife → Adult Entertainment → Workforce → Transportation → Rentals. Each vertical multiplies the TAM.",
      highlight: false
    }
  ];

  const visionStatements = [
    {
      phase: "Phase 1: Foundation",
      status: "Active",
      description: "Build the core verification and payment infrastructure. Establish venue partnerships and prove unit economics."
    },
    {
      phase: "Phase 2: Network Growth",
      status: "Next",
      description: "Scale to 1,000+ partner venues. Launch promoter network for viral distribution. Achieve liquidity in key markets."
    },
    {
      phase: "Phase 3: Platform Dominance",
      status: "Future",
      description: "Become the default trust layer for high-liability social and commercial interactions worldwide."
    }
  ];

  const whyUnicorn = [
    "First-mover in integrated health + payment + identity verification",
    "Platform business with near-zero marginal cost per transaction",
    "Regulatory tailwinds as venues seek liability protection",
    "Network effects create winner-take-most dynamics",
    "B2B2C model with multiple stakeholder buy-in"
  ];

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
              className="border-amber-600 text-amber-500 hover:bg-amber-500/10"
              onClick={() => navigate('/pitch-deck')}
            >
              View Investor Deck
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-16">
        {/* Hero Section */}
        <section className="text-center py-12">
          <img src={logo} alt="VALID" className="h-24 md:h-32 mx-auto mb-6 rounded-xl" />
          
          {/* Powered by Synthetic AI */}
          <p className="text-sm md:text-base font-mono tracking-[0.15em] text-muted-foreground uppercase mb-4">
            Powered By Synthetic AI*
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-4xl">👽</span>
            <h1 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              THE BUILDER'S VISION
            </h1>
            <span className="text-4xl">💎</span>
          </div>
          
          <Badge className="mb-6 bg-amber-500/20 text-amber-400 border-amber-500/30 text-lg px-4 py-1">
            Why It's a Unicorn
          </Badge>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            The strategic thesis behind building the world's first integrated trust, identity, and payment layer for high-liability economies.
          </p>
        </section>

        {/* Why Unicorn Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-400" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              🦄 The Unicorn Thesis
            </h2>
            <p className="text-muted-foreground mt-2">Why VALID will become a billion-dollar platform</p>
          </div>
          
          <div className="p-5 bg-card/70 border-l-4 border-[#2ecc71] rounded-lg max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-amber-500 mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Unicorn Thesis: The VALID Value Drivers
            </h3>
            <ul className="text-muted-foreground list-disc list-inside space-y-3 text-sm">
              <li className="font-bold text-foreground">
                HIGH-MARGIN TRANSACTIONAL POWER:
                <p className="text-muted-foreground font-normal mt-0.5 ml-5">The core revenue is the $10 Incognito Access Token, which operates at near-zero marginal cost, creating massive profitability as your organization scales up.</p>
              </li>
              <li className="font-bold text-foreground">
                ZERO-TRUST ARCHITECTURAL MOAT:
                <p className="text-muted-foreground font-normal mt-0.5 ml-5">The complexity of linking health data (HIPAA/GDPR) with payment systems and physical access is a massive barrier to entry. No competitor can copy this integrated model quickly.</p>
              </li>
              <li className="font-bold text-foreground">
                VIRAL NETWORK INTEGRATION:
                <p className="text-muted-foreground font-normal mt-0.5 ml-5">VALID drives exponential growth by enabling members to instantly connect their entire social graphs (Instagram, TikTok, etc.), creating a massive, verified <strong>peer-to-peer network</strong> for partner exposure.</p>
              </li>
              <li className="font-bold text-foreground">
                REGULATORY TAILWINDS & LIABILITY SHIFT:
                <p className="text-muted-foreground font-normal mt-0.5 ml-5">We legally shield venues and employers from compliance risk, making us an essential, non-optional service provider.</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Core Unicorn Factors */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            💎 Core Value Drivers
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unicornFactors.map((factor) => (
              <Card 
                key={factor.title} 
                className={`bg-card border-border ${factor.highlight ? 'ring-2 ring-amber-500/50' : ''}`}
              >
                <CardContent className="p-6">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${factor.highlight ? 'bg-amber-500/20' : 'bg-muted'}`}>
                    <factor.icon className={`h-6 w-6 ${factor.highlight ? 'text-amber-400' : 'text-muted-foreground'}`} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    {factor.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{factor.description}</p>
                  {factor.highlight && (
                    <Badge className="mt-3 bg-amber-500/20 text-amber-400 border-amber-500/30">
                      Key Differentiator
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Vision Roadmap */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            🚀 The Vision Roadmap
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {visionStatements.map((vision, i) => (
              <Card key={vision.phase} className="bg-card border-border">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4 md:w-1/3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                      vision.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                      vision.status === 'Next' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{vision.phase}</h3>
                      <Badge variant="outline" className={`text-xs ${
                        vision.status === 'Active' ? 'border-green-500 text-green-400' :
                        vision.status === 'Next' ? 'border-amber-500 text-amber-400' :
                        'border-border text-muted-foreground'
                      }`}>
                        {vision.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground md:w-2/3">{vision.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Builder's Message */}
        <section className="py-12">
          <Card className="bg-gradient-to-br from-secondary/50 to-muted/50 border-amber-600/30 max-w-3xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">👽</div>
              <h2 className="text-2xl font-bold text-amber-400 mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                From the Builder
              </h2>
              <blockquote className="text-lg text-foreground italic mb-4">
                "We're not building another app. We're building the trust infrastructure for a world that's moving too fast for traditional verification. 
                VALID is the answer to a question every business will ask: How do I know they're safe?"
              </blockquote>
              <p className="text-muted-foreground text-sm">
                — The Vision Behind VALID
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Ready to Build the Future?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join us in creating the world's most trusted verification ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/pitch-deck')}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Investor Deck
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/partners')}
              className="border-border text-foreground hover:bg-muted"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Partner With Us
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} VALID • BeValid.app • The Trust Layer for High-Liability Economies</p>
      </footer>
    </div>
  );
};

export default BuildersVision;
