import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MessageSquare, BarChart3, Shield, FileCheck, ArrowRight, Sparkles, Building2, Code2, ClipboardCheck, HeartPulse, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DemoBanner from "@/components/demos/DemoBanner";
import DemoCard from "@/components/demos/DemoCard";
import FlowDiagram from "@/components/demos/FlowDiagram";
import DemoShareButton from "@/components/demos/DemoShareButton";
import { useState } from "react";

const DemoHub = () => {
  const [openExplainer, setOpenExplainer] = useState<string | null>(null);

  const demos = [
    {
      title: "Demo A — Senate Q&A",
      subtitle: "Ask a Question",
      icon: MessageSquare,
      bullets: [
        "Submit a prompt to multiple AI systems",
        "Watch step-by-step review process",
        "See final synthesis with integrity proof",
      ],
      whoFor: "Everyone — try multi-model consensus",
      path: "/demos/senate-qa",
    },
    {
      title: "Demo B — Monitoring & Reliability",
      subtitle: "Live Metrics",
      icon: BarChart3,
      bullets: [
        "System health and latency overview",
        "Historical reliability metrics",
        "Audit log access and trace viewing",
      ],
      whoFor: "Investors, compliance officers, partners",
      path: "/demos/monitoring",
    },
    {
      title: "Demo C — Enterprise Sandbox",
      subtitle: "Data Stays With You",
      icon: Shield,
      bullets: [
        "Simulate verification without uploading data",
        "See conduit architecture in action",
        "Preview integration flow for your systems",
      ],
      whoFor: "Enterprise buyers, security teams",
      path: "/demos/enterprise-sandbox",
    },
    {
      title: "Demo D — Audit Proof Verifier",
      subtitle: "Verify Integrity",
      icon: FileCheck,
      bullets: [
        "Verify a token's authenticity",
        "Check hash and timestamp integrity",
        "Detect any modifications",
      ],
      whoFor: "Security auditors, compliance teams",
      path: "/demos/audit-verifier",
    },
  ];

  const explainers = [
    {
      id: "enterprise",
      title: "Enterprise / Regulated",
      subtitle: "JP Morgan, Salesforce, Fortune 500",
      icon: Building2,
      voiceover: "Enterprises want AI, but liability, audit, and data risk stop deployment. Valid's SYNTH is a headless governance engine that sits between users and any model—running multi-model consensus, contradiction checks, policy enforcement, and validation against trusted sources. Every decision generates a tamper-evident audit record you can export to compliance and security systems. Deploy in cloud, VPC, or on-prem.",
      hook: "Liability stops deployment",
      differentiator: "Tamper-evident audit + on-prem",
    },
    {
      id: "platforms",
      title: "AI Platforms / Builders",
      subtitle: "LangChain, Agent Companies, Toolchains",
      icon: Code2,
      voiceover: "Everyone is building faster agents. The missing layer is governance—proof, safety, and control. Valid's SYNTH is a headless runtime that plugs into any AI stack to detect contradictions, enforce policies, and arbitrate outputs before they ship. It produces verifiable decision records, supports fail-safe modes, and manages cost and latency budgets so agents stay dependable at scale.",
      hook: "Missing governance layer",
      differentiator: "Headless runtime + cost/latency budgets",
    },
    {
      id: "compliance",
      title: "Compliance / Audit / Certification",
      subtitle: "Vanta, Drata, Secureframe",
      icon: ClipboardCheck,
      voiceover: "Compliance teams are about to be flooded with AI risk. Valid's SYNTH turns AI decisions into audit-ready evidence: input validation, output verification, policy rules, retention controls, and tamper-evident provenance—without storing sensitive payloads. It exports structured records to SIEM and compliance workflows so organizations can certify AI usage with confidence.",
      hook: "AI risk is coming",
      differentiator: "Audit-ready evidence without payloads",
    },
    {
      id: "healthcare",
      title: "Healthcare / High-Liability",
      subtitle: "Medical, Insurance, Claims",
      icon: HeartPulse,
      voiceover: "In high-liability environments, one hallucination can become malpractice. Valid's SYNTH adds a governed decision layer: multi-model consensus, contradiction detection, validation checkpoints, and an arbitration authority that can veto unsafe outputs before delivery. The result is safer guidance, stronger audit trails, and operational controls designed for regulated workflows.",
      hook: "One hallucination = malpractice",
      differentiator: "Veto authority + clinical controls",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Demo Hub — Live Demos | Valid™</title>
        <meta name="description" content="Explore live demos of Valid's multi-model AI governance system. See Senate Q&A, monitoring, enterprise sandbox, and audit verification." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <DemoBanner />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Demo Hub</h1>
                  <p className="text-sm text-muted-foreground">Experience Valid / SYNTH in action</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DemoShareButton />
                <Button variant="outline" size="sm" asChild>
                  <Link to="/">← Back to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Intro Card */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Sparkles className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">Valid/SYNTH: Governance Conduit, Not Data Warehouse</h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    Foundational sources (KYC vendors, hospitals, labs) house your raw data. We orchestrate verification, 
                    apply multi-model governance, and return results. We retain minimal artifacts (hashes/timestamps/votes) 
                    and issue a time-limited verification token — shareable via Ghost QR without exposing underlying records.
                  </p>
                  <Button asChild size="sm">
                    <Link to="/demos/router">
                      Choose Your Demo Path
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flow Diagrams */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <FlowDiagram variant="senate" />
            <FlowDiagram variant="conduit" />
          </div>

          {/* Demo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demos.map((demo) => (
              <DemoCard key={demo.path} {...demo} />
            ))}
          </div>

          {/* Explainer Menu */}
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <Phone className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">30-Second Pitch Scripts by Vertical</h2>
                <p className="text-sm text-muted-foreground">Tailored messaging for different buyer personas</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {explainers.map((exp) => (
                <Collapsible
                  key={exp.id}
                  open={openExplainer === exp.id}
                  onOpenChange={(isOpen) => setOpenExplainer(isOpen ? exp.id : null)}
                >
                  <Card className="border-border/50 hover:border-primary/30 transition-colors">
                    <CollapsibleTrigger asChild>
                      <CardContent className="pt-4 pb-4 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <exp.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-sm">{exp.title}</h3>
                              <p className="text-xs text-muted-foreground">{exp.subtitle}</p>
                            </div>
                          </div>
                          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openExplainer === exp.id ? 'rotate-180' : ''}`} />
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-6 pb-6 border-t border-border/30 pt-4">
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">30-Second Voiceover</p>
                            <p className="text-sm text-muted-foreground leading-relaxed italic">
                              "{exp.voiceover}"
                            </p>
                            <p className="text-sm text-foreground mt-3">
                              I'm Steve Grillo. Get to know us at bevalid.app. Click the button if you'd like to speak to Steve directly—or call <span className="text-primary font-medium">512-781-0973</span>. We're excited to welcome you to our sandbox.
                            </p>
                          </div>
                          <div className="flex gap-4 pt-2 border-t border-border/20">
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground">Hook</p>
                              <p className="text-sm font-medium text-foreground">{exp.hook}</p>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground">Differentiator</p>
                              <p className="text-sm font-medium text-foreground">{exp.differentiator}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </div>

          {/* CTA for Sales */}
          <Card className="mt-8 border-cyan-500/30 bg-cyan-500/5">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">Need a guided walkthrough?</p>
                  <p className="text-sm text-muted-foreground">Use our Demo Router to send the right demo to the right audience.</p>
                </div>
                <Button asChild variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                  <Link to="/demos/router">Open Demo Router</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default DemoHub;
