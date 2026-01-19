import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ArrowLeft, 
  Shield, 
  Wallet, 
  QrCode, 
  Lock, 
  Zap, 
  Eye, 
  Network, 
  CheckCircle2, 
  ArrowRight,
  Fingerprint,
  Globe,
  Database,
  Presentation,
  Target,
  ChevronDown
} from "lucide-react";
import TheAskSection from "@/components/operation-sf/TheAskSection";
import CampaignScheduleSection from "@/components/operation-sf/CampaignScheduleSection";
import TargetIntelSection from "@/components/operation-sf/TargetIntelSection";
import { UniversalPaymentTerms } from "@/components/shared/UniversalPaymentTerms";

const OperationSF = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground text-lg">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </Button>
          <Badge variant="outline" className="border-primary/50 text-primary font-mono text-base px-4 py-1">
            OPERATION MIDWEST INTEL
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-pink-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/50 text-lg px-6 py-2">
              CLASSIFIED ASSET BRIEFING
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">
                VALID™
              </span>
            </h1>
            <p className="text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Universal Lifestyle Wallet
            </p>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A signal conduit ecosystem that empowers users to control what they share, 
              while enabling trusted verification without exposing underlying data.
            </p>
          </div>
        </div>
      </section>

      {/* THE ASK - Tiered Agreements - PROMINENT with glow - RIGHT AFTER HERO */}
      <section className="relative py-8">
        {/* Glow effect background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        </div>
        <div className="relative z-10">
          {/* Universal Payment Terms - Canonical Block (Top-of-section) */}
          <div className="container mx-auto px-4 mb-8">
            <UniversalPaymentTerms />
          </div>
          <TheAskSection />
        </div>
      </section>

      {/* The Asset: Three Pillars */}
      <section className="py-20 border-t border-border/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">THE ASSET</h2>
            <p className="text-xl md:text-2xl text-muted-foreground">Three interconnected systems powering the VALID™ ecosystem</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Pillar 1: Universal Lifestyle Wallet */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/50 transition-all">
              <CardHeader className="pb-6">
                <div className="h-20 w-20 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                  <Wallet className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl md:text-3xl">Universal Lifestyle Wallet</CardTitle>
                <CardDescription className="text-lg mt-2">
                  One wallet for identity, funds, and lifestyle verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-400 mt-0.5 shrink-0" />
                  <span className="text-lg text-muted-foreground">Pre-funded spending with instant load</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-400 mt-0.5 shrink-0" />
                  <span className="text-lg text-muted-foreground">ID verification tiers (Basic → Premium)</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-400 mt-0.5 shrink-0" />
                  <span className="text-lg text-muted-foreground">Bio signals & lifestyle tags</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-400 mt-0.5 shrink-0" />
                  <span className="text-lg text-muted-foreground">Toxicology compliance status</span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 2: Ghost Ecosystem */}
            <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-transparent hover:border-cyan-500/50 transition-all">
              <CardHeader className="pb-6">
                <div className="h-20 w-20 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-6">
                  <Shield className="h-10 w-10 text-cyan-400" />
                </div>
                <CardTitle className="text-2xl md:text-3xl">Ghost Ecosystem</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Privacy-first sharing with granular user control
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Lock className="h-6 w-6 text-cyan-400 mt-0.5 shrink-0" />
                  <span className="text-lg text-muted-foreground">Tab-level lock/unlock controls</span>
                </div>
                <div className="flex items-start gap-4">
                  <Eye className="h-6 w-6 text-cyan-400 mt-0.5 shrink-0" />
                  <span className="text-lg text-muted-foreground">Share profiles: Public, Minimal, Custom, Nothing</span>
                </div>
                <div className="flex items-start gap-4">
                  <Fingerprint className="h-6 w-6 text-cyan-400 mt-0.5 shrink-0" />
                  <span className="text-lg text-muted-foreground">Opaque ghost_ref tokens (no PII in QR)</span>
                </div>
                <div className="flex items-start gap-4">
                  <Zap className="h-6 w-6 text-cyan-400 mt-0.5 shrink-0" />
                  <span className="text-lg text-muted-foreground">Short-lived, revocable credentials</span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 3: QR Code Conduit */}
            <Card className="border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-transparent hover:border-pink-500/50 transition-all">
              <CardHeader className="pb-6">
                <div className="h-20 w-20 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6">
                  <QrCode className="h-10 w-10 text-pink-400" />
                </div>
                <CardTitle className="text-2xl md:text-3xl">QR Code Conduit</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Single QR hub for all verification scenarios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Globe className="h-6 w-6 text-pink-400 mt-0.5 shrink-0" />
                  <span className="text-lg text-muted-foreground">Profile share (person-to-person)</span>
                </div>
                <div className="flex items-start gap-4">
                  <Network className="h-6 w-6 text-pink-400 mt-0.5 shrink-0" />
                  <span className="text-lg text-muted-foreground">Venue admission (partner scan → API)</span>
                </div>
                <div className="flex items-start gap-4">
                  <Database className="h-6 w-6 text-pink-400 mt-0.5 shrink-0" />
                  <span className="text-lg text-muted-foreground">Signal Pack returns (grade + message)</span>
                </div>
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-pink-400 mt-0.5 shrink-0" />
                  <span className="text-lg text-muted-foreground">No claims in QR — server-side resolution</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Signal Conduit Architecture */}
      <section className="py-20 bg-muted/30 border-y border-border/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-6 border-primary/50 text-primary text-lg px-6 py-2">
                ARCHITECTURE
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Signal Conduit Model</h2>
              <p className="text-xl md:text-2xl text-muted-foreground">
                VALID™ is a conduit — we relay signals, never store underlying PII
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-center">
              {/* Originators */}
              <Card className="bg-card/50 border-border/50">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                    <Database className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Originators</h3>
                  <p className="text-base text-muted-foreground">
                    IDV providers, labs, payment processors hold source data
                  </p>
                </CardContent>
              </Card>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <ArrowRight className="h-8 w-8" />
                  <span className="text-lg font-mono font-bold">SIGNALS</span>
                  <ArrowRight className="h-8 w-8" />
                </div>
              </div>

              {/* VALID Conduit */}
              <Card className="bg-gradient-to-br from-primary/10 to-cyan-500/10 border-primary/30">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">VALID™ Conduit</h3>
                  <p className="text-base text-muted-foreground">
                    Aggregates & relays generalized signals only
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Flow continues */}
            <div className="flex justify-center my-6">
              <ArrowRight className="h-8 w-8 text-muted-foreground rotate-90" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* User */}
              <Card className="bg-card/50 border-green-500/30">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">User Controls</h3>
                  <p className="text-base text-muted-foreground">
                    Chooses share profile, locks/unlocks signal categories
                  </p>
                </CardContent>
              </Card>

              {/* Partner */}
              <Card className="bg-card/50 border-orange-500/30">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                    <Network className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Partner/Venue</h3>
                  <p className="text-base text-muted-foreground">
                    Scans QR, calls resolve endpoint, gets Signal Pack
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Signal Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Signal Categories</h2>
            <p className="text-xl md:text-2xl text-muted-foreground">Generalized outputs only — never raw PII</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* PROFILE */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-mono text-primary">PROFILE</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base text-muted-foreground">
                <p>• profile_present (bool)</p>
                <p>• basic_profile_level (empty|basic|complete)</p>
                <p>• vibe_tags (capped taxonomy)</p>
              </CardContent>
            </Card>

            {/* ID */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-mono text-cyan-400">ID</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base text-muted-foreground">
                <p>• age_verified (bool)</p>
                <p>• id_verified (bool)</p>
                <p>• idv_tier (none|basic|plus)</p>
                <p>• member_since_band (new|established|veteran)</p>
              </CardContent>
            </Card>

            {/* FUNDS */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-mono text-green-400">FUNDS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base text-muted-foreground">
                <p>• wallet_tier (none|funded|supercharged)</p>
                <p>• balance_band (0|1-50|50-200|200+)</p>
                <p>• pass_eligible / pass_valid (bool)</p>
              </CardContent>
            </Card>

            {/* BIO */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-mono text-pink-400">BIO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base text-muted-foreground">
                <p>• bio_present (bool)</p>
                <p>• interest_tags (fixed taxonomy)</p>
                <p>• role_category (fixed set)</p>
              </CardContent>
            </Card>

            {/* TOX */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-mono text-yellow-400">TOX</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base text-muted-foreground">
                <p>• tox_status (clear|unknown|restricted)</p>
                <p>• tox_recency (never|recent|stale)</p>
                <p>• tox_note_present (bool)</p>
              </CardContent>
            </Card>

            {/* HEALTH */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-mono text-red-400">HEALTH</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base text-muted-foreground">
                <p>• allergy_flag (bool)</p>
                <p>• allergy_severity_max (mild|moderate|severe)</p>
                <p className="italic">Locked by default</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Grade System */}
      <section className="py-20 bg-muted/30 border-t border-border/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Signal Pack Output</h2>
            <p className="text-xl md:text-2xl text-muted-foreground">Simple for humans, structured for systems</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-green-500/50 bg-green-500/5">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-green-400" />
                </div>
                <h3 className="font-bold text-green-400 text-3xl mb-3">GREEN</h3>
                <p className="text-lg text-muted-foreground">"Verified. Admit."</p>
                <p className="text-base text-muted-foreground mt-3">All required signals positive</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/50 bg-yellow-500/5">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="h-20 w-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-10 w-10 text-yellow-400" />
                </div>
                <h3 className="font-bold text-yellow-400 text-3xl mb-3">YELLOW</h3>
                <p className="text-lg text-muted-foreground">"Limited verification. Check ID."</p>
                <p className="text-base text-muted-foreground mt-3">User locked required tab</p>
              </CardContent>
            </Card>

            <Card className="border-red-500/50 bg-red-500/5">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-red-400" />
                </div>
                <h3 className="font-bold text-red-400 text-3xl mb-3">RED</h3>
                <p className="text-lg text-muted-foreground">"Not verified. Do not admit."</p>
                <p className="text-base text-muted-foreground mt-3">Required negative or revoked</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Target Intel Section */}
      <TargetIntelSection />

      {/* Campaign Schedule */}
      <CampaignScheduleSection />

      {/* CTA Section */}
      <section className="py-20 border-t border-border/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Deploy</h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            The VALID™ ecosystem is battle-ready for J.P. Morgan Healthcare Conference and beyond.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Button onClick={() => navigate("/deal-room")} size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 h-auto">
              Enter Deal Room <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button onClick={() => navigate("/pitch-deck")} variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
              View Pitch Deck
            </Button>
          </div>
        </div>
      </section>

      {/* Investor Pitch Deck Section */}
      <section className="py-16 border-t border-border/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
              INVESTOR MATERIALS
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">View Investor Pitch Deck</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Full cinematic presentation covering the VALID™ vision, market opportunity, and investment terms.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/pitch">
                <Presentation className="h-5 w-5" />
                Open Investor Pitch Deck
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border/30 text-center">
        <p className="text-base text-muted-foreground font-mono">
          OPERATION SF INTEL — CLASSIFIED — VALID™ © 2025
        </p>
      </footer>
    </div>
  );
};

export default OperationSF;
