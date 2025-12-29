import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Maximize2, Copy, Check, ExternalLink, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/valid-logo.jpeg";
import Evolution2026Carousel from "@/components/pitch/Evolution2026Carousel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Evolution2026PitchDeck = () => {
  const navigate = useNavigate();
  const [deckOpenRequest, setDeckOpenRequest] = useState(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = async (content: string, sectionId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedSection(sectionId);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const executiveSummary = `SYNTH™ is a governance layer for AI systems. It helps organizations trust AI output when the cost of being wrong is high (security, compliance, finance, healthcare, critical operations).

Instead of relying on one model, SYNTH runs a panel of independent AI reviewers and produces a single governed result that is:

• Verified against rules and approved sources (when required)
• Controlled by policy (what the system is allowed to do)
• Auditable (who/what decided, why, and when)
• Tamper-evident (logs are protected against silent changes)
• Fail-safe (handles model outages/timeouts and can "fail closed")

SYNTH is designed for enterprises that need explainable decisions, safety controls, and compliance-ready records, not just "best-effort" AI answers.

VALID™ / GHOST™ Pass applies the same trust approach to the real world: fast, privacy-first verification for identity/access/compliance/payment using encrypted, time-limited QR tokens, without storing personal data.`;

  const emailBlurb = `SYNTH is a governance layer for AI agents that improves safety and accountability in high-stakes environments. It uses independent reviewers, policy constraints, verification gates, and tamper-evident audit trails to produce decisions that are explainable and defensible. It is designed to run in enterprise settings (including private deployments) and supports fail-safe behavior under outages and budget constraints. VALID/GHOST™ Pass extends the same trust model to real-world identity/access/compliance using encrypted, time-limited QR verification without storing personal data.`;

  const elevatorPitch = `"SYNTH makes AI safer to use at work. It checks AI answers using multiple reviewers, enforces rules, and keeps audit logs so you can prove what happened. VALID/GHOST™ Pass does the same kind of trust and verification for people at the door using private QR codes."`;

  return (
    <div 
      className="min-h-screen text-white"
      style={{
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1117 50%, #0a0a0f 100%)'
      }}
    >
      {/* Deprecation Banner */}
      <Alert variant="destructive" className="mx-4 mt-4 bg-yellow-500/20 border-yellow-500/50">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Deprecated</AlertTitle>
        <AlertDescription>
          This page has been archived. Please use the <strong>Canonical Pitch & Positioning</strong> section in Admin → CEO Playbook for the current materials.
        </AlertDescription>
      </Alert>

      {/* Navigation */}
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <img src={logo} alt="VALID" className="h-8 w-8 rounded-lg" />
            <div>
              <h1 className="text-lg font-bold text-white">2026 Evolution</h1>
              <p className="text-xs text-cyan-400">VALID™ • SYNTH™ • GHOST™</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeckOpenRequest(prev => prev + 1)}
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 
              className="text-3xl sm:text-5xl font-bold mb-4"
              style={{
                background: 'linear-gradient(180deg, #A0A0A0 0%, #D0D0D0 40%, #F0F0F0 70%, #FFFFFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              2026 Evolution Pitch Deck
            </h1>
            <p className="text-lg text-cyan-400">
              SYNTH™ — Verified AI Decisions + Audit Trails for High-Stakes Environments
            </p>
          </div>

          {/* Slide Carousel */}
          <div className="rounded-lg overflow-hidden border border-white/10 shadow-2xl shadow-cyan-500/10">
            <Evolution2026Carousel openFullscreenRequest={deckOpenRequest} />
          </div>
        </div>
      </section>

      {/* Copy-Ready Sections */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* Executive Summary */}
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-cyan-400">Executive Summary</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(executiveSummary, 'exec')}
                  className="border-white/20 hover:bg-white/10"
                >
                  {copiedSection === 'exec' ? (
                    <><Check className="h-4 w-4 mr-2 text-green-400" /> Copied</>
                  ) : (
                    <><Copy className="h-4 w-4 mr-2" /> Copy</>
                  )}
                </Button>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-white/80 font-mono bg-black/30 p-4 rounded-lg border border-white/10">
                {executiveSummary}
              </pre>
            </CardContent>
          </Card>

          {/* Email-Safe Blurb */}
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-cyan-400">Email-Safe Blurb</h3>
                  <p className="text-xs text-white/50">For NVIDIA / NASA / Elite Reviewers</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(emailBlurb, 'email')}
                  className="border-white/20 hover:bg-white/10"
                >
                  {copiedSection === 'email' ? (
                    <><Check className="h-4 w-4 mr-2 text-green-400" /> Copied</>
                  ) : (
                    <><Copy className="h-4 w-4 mr-2" /> Copy</>
                  )}
                </Button>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-white/80 font-mono bg-black/30 p-4 rounded-lg border border-white/10">
                {emailBlurb}
              </pre>
            </CardContent>
          </Card>

          {/* Elevator Pitch */}
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-cyan-400">15-Second Elevator Pitch</h3>
                  <p className="text-xs text-white/50">High School Level</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(elevatorPitch, 'elevator')}
                  className="border-white/20 hover:bg-white/10"
                >
                  {copiedSection === 'elevator' ? (
                    <><Check className="h-4 w-4 mr-2 text-green-400" /> Copied</>
                  ) : (
                    <><Copy className="h-4 w-4 mr-2" /> Copy</>
                  )}
                </Button>
              </div>
              <div 
                className="text-lg text-white/90 italic bg-black/30 p-4 rounded-lg border border-cyan-500/20"
                style={{ textShadow: '0 0 20px rgba(0, 229, 229, 0.2)' }}
              >
                {elevatorPitch}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center pt-8">
            <Button
              size="lg"
              onClick={() => window.open('https://calendly.com/steve-bevalid/30min', '_blank')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold px-8"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Evolution2026PitchDeck;
