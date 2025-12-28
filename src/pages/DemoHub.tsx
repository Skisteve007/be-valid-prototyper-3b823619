import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MessageSquare, BarChart3, Shield, FileCheck, ArrowRight, Sparkles, Building2, Code2, ClipboardCheck, HeartPulse, Phone, ChevronDown, AlertTriangle, AlertCircle, Upload, Gauge, Castle, Layers, QrCode, Bot, FileUp, Scale, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DemoBanner from "@/components/demos/DemoBanner";
import DemoCard from "@/components/demos/DemoCard";
import FlowDiagram from "@/components/demos/FlowDiagram";
import DemoShareButton from "@/components/demos/DemoShareButton";
import SideBySideSection from "@/components/demos/SideBySideSection";
import DemoEnvironmentNotice from "@/components/demos/DemoEnvironmentNotice";
import GhostEcosystemModule from "@/components/demos/GhostEcosystemModule";
import { useState } from "react";

const DemoHub = () => {
  const [openExplainer, setOpenExplainer] = useState<string | null>(null);
  const [showLegalCases, setShowLegalCases] = useState(false);
  const [showSideBySide, setShowSideBySide] = useState(false);
  const [showVerticals, setShowVerticals] = useState(false);

  const demos = [
    {
      title: "Demo A — Governance Q&A",
      subtitle: "Ask a Question",
      icon: MessageSquare,
      bullets: [
        "A single request processed through a governed multi-model pipeline",
        "High-level governance status and decision trace (demo-safe)",
        "Final response delivered with a verifiable proof record",
      ],
      whoFor: "Anyone evaluating multi-model governance",
      path: "/demos/senate-qa",
    },
    {
      title: "Demo B — Monitoring & Reliability",
      subtitle: "Live Metrics",
      icon: BarChart3,
      bullets: [
        "System health and latency overview",
        "Reliability trends over time",
        "Trace viewing and audit access (demo-safe)",
      ],
      whoFor: "Investors, compliance leaders, partners",
      path: "/demos/monitoring",
    },
    {
      title: "Demo C — Enterprise Sandbox",
      subtitle: "Data Stays With You",
      icon: Shield,
      bullets: [
        "Simulated verification without uploading source data",
        "Conduit architecture at a high level",
        "Preview integration flow for enterprise systems",
      ],
      whoFor: "Enterprise buyers, security teams",
      path: "/demos/enterprise-sandbox",
    },
    {
      title: "Demo D — Proof Record Verifier",
      subtitle: "Verify Integrity",
      icon: FileCheck,
      bullets: [
        "Verify a proof record is valid",
        "Confirm the record has not been modified",
        "Check issuance / expiry status",
      ],
      whoFor: "Security auditors, compliance teams",
      path: "/demos/audit-verifier",
    },
    {
      title: "Demo E — Upload & Verdict",
      subtitle: "Drop a PDF. Get a governed verdict.",
      icon: Upload,
      bullets: [
        "Upload a document (demo-safe)",
        "System runs governance pipeline",
        "Returns verdict + proof record + share token",
      ],
      whoFor: "Smaller buyers, fast pilots, legal/compliance",
      path: "/demos/upload-verdict",
    },
    {
      title: "Demo F — Enterprise Scale Conduit",
      subtitle: "High-volume events in, governed decisions out.",
      icon: Gauge,
      bullets: [
        "Simulated event stream / batch processing",
        "Queue + throughput + latency metrics",
        "Rolling decisions with proof records",
      ],
      whoFor: "Banks, universities, big enterprise security",
      path: "/demos/scale-conduit",
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
          <div className="container mx-auto px-4 py-3 md:py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 border border-primary/30 shrink-0">
                  <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">Demo Hub</h1>
                  <p className="text-sm md:text-base text-muted-foreground hidden sm:block">Experience Valid / SYNTH in action</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                <DemoShareButton />
                <Button variant="outline" size="sm" asChild className="text-xs md:text-sm px-2 md:px-3">
                  <Link to="/">← Home</Link>
                </Button>
              </div>
            </div>
          </div>
          {/* Sticky Subnav */}
          <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
            <nav className="container mx-auto px-4 py-2.5 flex gap-2 overflow-x-auto scrollbar-hide">
              <a href="#overview" className="px-4 py-2 text-sm font-medium text-foreground bg-muted/40 hover:bg-muted/60 rounded-full whitespace-nowrap transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-border/50">Overview</a>
              <a href="#demos" className="px-4 py-2 text-sm font-medium text-foreground bg-muted/40 hover:bg-muted/60 rounded-full whitespace-nowrap transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-border/50">Demos</a>
              <a href="#proof" className="px-4 py-2 text-sm font-medium text-foreground bg-muted/40 hover:bg-muted/60 rounded-full whitespace-nowrap transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-border/50">Proof</a>
              <a href="#ghost" className="px-4 py-2 text-sm font-medium text-foreground bg-muted/40 hover:bg-muted/60 rounded-full whitespace-nowrap transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-border/50">Ghost</a>
              <a href="#risks" className="px-4 py-2 text-sm font-medium text-foreground bg-muted/40 hover:bg-muted/60 rounded-full whitespace-nowrap transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-border/50">Risks</a>
              <a href="#integration" className="px-4 py-2 text-sm font-medium text-foreground bg-muted/40 hover:bg-muted/60 rounded-full whitespace-nowrap transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-border/50">Integration</a>
              <a href="#loi" className="px-4 py-2 text-sm font-medium text-foreground bg-muted/40 hover:bg-muted/60 rounded-full whitespace-nowrap transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-border/50">LOI</a>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Demo Environment Notice Banner */}
          <DemoEnvironmentNotice variant="banner" />

          {/* Architecture Overview - Valid vs SYNTH */}
          <div id="overview" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 scroll-mt-32">
            {/* Valid - The Castle */}
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 shrink-0">
                    <Castle className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">Valid™ — The Castle</h2>
                    <p className="text-sm text-emerald-400 font-medium mb-3">Application Layer</p>
                    <p className="text-muted-foreground text-base mb-4">
                      The fortress that houses your identity and trust infrastructure. Valid contains the 
                      <span className="text-foreground font-medium"> Ghost QR Pass</span> — a privacy-preserving 
                      wallet for sharing verified credentials without exposing underlying data.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <QrCode className="h-4 w-4 text-emerald-400" />
                      <span>Ghost demos coming soon</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SYNTH - The Moat */}
            <Card className="border-cyan-500/30 bg-cyan-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30 shrink-0">
                    <Layers className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">SYNTH™ — The Moat</h2>
                    <p className="text-sm text-cyan-400 font-medium mb-3">Adversarial Consensus Engine</p>
                    <p className="text-muted-foreground text-base mb-4">
                      SYNTH is an adversarial consensus moat—<span className="text-foreground font-medium">multiple independent verifiers</span> cross-examine 
                      every output before it's allowed through. Bad actors, weak logic, and terminated content are stopped at the gate.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Bot className="h-4 w-4 text-cyan-400" />
                      <span>Multi-model governance + proof records</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ghost Ecosystem Module */}
          <div id="ghost" className="scroll-mt-32">
            <GhostEcosystemModule />
          </div>

          {/* Intro Card */}
          <Card id="proof" className="mb-8 border-primary/20 bg-primary/5 scroll-mt-32">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Sparkles className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Governance Conduit, Not Data Warehouse</h2>
                  <p className="text-muted-foreground text-base mb-4">
                    Your systems remain the system of record. SYNTH orchestrates verification and governance 
                    across models and services, then returns results with a verifiable proof record. Valid 
                    provides the application layer where users interact with Ghost passes and verified credentials.
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <FlowDiagram variant="senate" />
            <FlowDiagram variant="conduit" />
          </div>

          {/* Two Ways to Use Explainer */}
          <Card className="mb-8 border-border/50 bg-card/50">
            <CardContent className="pt-6">
              <h3 className="text-base font-semibold text-muted-foreground mb-4 text-center">
                Two Ways to Use the Same Governance Pipeline
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lane A */}
                <div className="p-5 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <FileUp className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-foreground text-base">Lane A — Upload & Verdict (Simple)</h4>
                  </div>
                  <div className="space-y-4 text-base">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">Who it's for:</p>
                      <p className="text-foreground">Small teams and Main Street operators (clubs/venues, clinics, salons, offices), pilots, and compliance reviews.</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">What you input:</p>
                      <ul className="text-foreground space-y-1 list-disc list-inside">
                        <li><span className="font-medium">Single items:</span> a PDF/report (10–20+ pages), a transcript, a policy, or a contract.</li>
                        <li><span className="font-medium">Ongoing workflow:</span> daily documents and client/staff entries from a small operation (typically 5–20 employees) — uploaded as batches or one-by-one.</li>
                      </ul>
                      <p className="text-sm text-muted-foreground mt-2 italic">Start small (one doc), then scale to routine daily verification without changing tools.</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">What you get back:</p>
                      <ul className="text-foreground space-y-1 list-disc list-inside">
                        <li>A governed verdict (CERTIFIED / MISTRIAL) with key reasons and recommended next steps</li>
                        <li>A proof record you can verify and share (optional time-limited share token)</li>
                        <li>Batch-friendly results: one verdict per item plus an overall summary for the set</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Lane B */}
                <div className="p-5 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="h-5 w-5 text-cyan-400" />
                    <h4 className="font-semibold text-foreground text-base">Lane B — Enterprise Conduit (At Scale)</h4>
                  </div>
                  <div className="space-y-4 text-base">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">Who it's for:</p>
                      <p className="text-foreground">Universities, banks, large enterprises with existing systems</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">What you input:</p>
                      <p className="text-foreground">High-volume events or documents from your existing system (logs, transcripts, claims, tickets, records)</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">How it works (side-by-side):</p>
                      <p className="text-foreground">Your system remains the system of record. Valid/SYNTH receives a copy of the needed payload (or runs in your cloud), applies governance + verification, routes checks to approved services as needed, and returns results to your system.</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">What you get back:</p>
                      <p className="text-foreground">Decisions at throughput (allow/block/flag + reasons) plus proof records for auditability</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center text-base font-semibold text-foreground mt-6 pt-4 border-t border-border/30">
                "We don't ask you to hand over your databases — we sit beside your stack and return governed decisions."
              </p>
            </CardContent>
          </Card>

          {/* Demo Cards */}
          <div id="demos" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-32">
            {demos.map((demo) => (
              <DemoCard key={demo.path} {...demo} />
            ))}
          </div>

          {/* Deep Dive Section Header with Expand/Collapse All */}
          <div className="mt-12 mb-4 flex items-center justify-between">
            <h3 className="text-base font-medium text-muted-foreground">Deep Dive</h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm h-8"
                onClick={() => {
                  setShowVerticals(true);
                  setShowLegalCases(true);
                  setShowSideBySide(true);
                }}
              >
                Expand All Details
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm h-8"
                onClick={() => {
                  setShowVerticals(false);
                  setShowLegalCases(false);
                  setShowSideBySide(false);
                }}
              >
                Collapse Details
              </Button>
            </div>
          </div>

          {/* Explainer Menu - Collapsible */}
          <Collapsible open={showVerticals} onOpenChange={setShowVerticals}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer p-5 rounded-lg border border-border/50 hover:border-primary/30 bg-card/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <Phone className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Vertical Interests</h2>
                    <p className="text-base text-muted-foreground">Tailored messages for your interested persona</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{showVerticals ? 'Hide' : 'Show more'}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showVerticals ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                                <h3 className="font-semibold text-foreground text-base">{exp.title}</h3>
                                <p className="text-sm text-muted-foreground">{exp.subtitle}</p>
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
                              <p className="text-base text-muted-foreground leading-relaxed italic">
                                {exp.voiceover}
                              </p>
                              <p className="text-base text-foreground mt-3">
                                I'm Steve Grillo. Get to know us at bevalid.app. Click the button if you'd like to speak to Steve directly—or call <span className="text-primary font-medium">512-781-0973</span>. We're excited to welcome you to our sandbox.
                              </p>
                            </div>
                            <div className="flex gap-4 pt-2 border-t border-border/20">
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground">Hook</p>
                                <p className="text-base font-medium text-foreground">{exp.hook}</p>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground">Differentiator</p>
                                <p className="text-base font-medium text-foreground">{exp.differentiator}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Legal Case Studies - Collapsible */}
          <Collapsible id="risks" open={showLegalCases} onOpenChange={setShowLegalCases} className="mt-8 scroll-mt-32">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer p-5 rounded-lg border border-destructive/30 hover:border-destructive/50 bg-destructive/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/30">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Legal Precedents — Why Governance Matters</h2>
                    <p className="text-base text-muted-foreground">Real cases demonstrating the risks of unverified AI outputs</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{showLegalCases ? 'Hide cases' : 'Show cases'}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showLegalCases ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                {/* Group 1: AI Hallucinations */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                      <AlertTriangle className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">Risks of AI Hallucinations</h3>
                      <p className="text-sm text-orange-400">(Bad Output)</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Card className="border-orange-500/20 bg-orange-500/5">
                      <CardContent className="pt-4 pb-4">
                        <h4 className="font-semibold text-foreground text-base mb-1">Moffatt v. Air Canada (2024)</h4>
                        <p className="text-sm text-muted-foreground">Company liable for chatbot promising a refund that didn't exist.</p>
                      </CardContent>
                    </Card>
                    <Card className="border-orange-500/20 bg-orange-500/5">
                      <CardContent className="pt-4 pb-4">
                        <h4 className="font-semibold text-foreground text-base mb-1">Mata v. Avianca (2023)</h4>
                        <p className="text-sm text-muted-foreground">Lawyers sanctioned for using ChatGPT to cite fake court cases.</p>
                      </CardContent>
                    </Card>
                    <Card className="border-orange-500/20 bg-orange-500/5">
                      <CardContent className="pt-4 pb-4">
                        <h4 className="font-semibold text-foreground text-base mb-1">Walters v. OpenAI (2023)</h4>
                        <p className="text-sm text-muted-foreground">AI sued for defamation after falsely accusing a man of embezzlement.</p>
                      </CardContent>
                    </Card>
                    <Card className="border-orange-500/20 bg-orange-500/5">
                      <CardContent className="pt-4 pb-4">
                        <h4 className="font-semibold text-foreground text-base mb-1">Hood v. OpenAI</h4>
                        <p className="text-sm text-muted-foreground">Mayor threatened to sue after AI falsely claimed he was a criminal.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Group 2: Bad User Data */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">Risks of Bad User Data</h3>
                      <p className="text-sm text-red-400">(Garbage Input)</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Card className="border-red-500/20 bg-red-500/5">
                      <CardContent className="pt-4 pb-4">
                        <h4 className="font-semibold text-foreground text-base mb-1">JPMorgan v. Frank (2023)</h4>
                        <p className="text-sm text-muted-foreground">Bank lost $175M acquiring a startup that had 4 million fake users.</p>
                      </CardContent>
                    </Card>
                    <Card className="border-red-500/20 bg-red-500/5">
                      <CardContent className="pt-4 pb-4">
                        <h4 className="font-semibold text-foreground text-base mb-1">Rideshare Class Actions</h4>
                        <p className="text-sm text-muted-foreground">Companies sued when drivers used stolen IDs to bypass checks.</p>
                      </CardContent>
                    </Card>
                    <Card className="border-red-500/20 bg-red-500/5">
                      <CardContent className="pt-4 pb-4">
                        <h4 className="font-semibold text-foreground text-base mb-1">Williams v. City of Detroit (2024)</h4>
                        <p className="text-sm text-muted-foreground">City paid $300k settlement after bad photo input led to a wrongful AI arrest.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Side-by-Side Competition Section - Collapsible */}
          <Collapsible id="integration" open={showSideBySide} onOpenChange={setShowSideBySide} className="mt-8 scroll-mt-32">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer p-5 rounded-lg border border-border/50 hover:border-primary/30 bg-card/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Side-by-Side With Your Current Stack</h2>
                    <p className="text-base text-muted-foreground">See how Valid/SYNTH compares to existing solutions</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{showSideBySide ? 'Hide comparison' : 'Show comparison'}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showSideBySide ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4">
                <SideBySideSection />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* CTA for Sales */}
          <Card id="loi" className="mt-8 border-cyan-500/30 bg-cyan-500/5 scroll-mt-32">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <Handshake className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-lg">Ready to Move Forward?</p>
                    <p className="text-base text-muted-foreground">Use our Demo Router to send the right demo to the right audience, or start a 45-day proof.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                    <Link to="/demos/router">Open Demo Router</Link>
                  </Button>
                  <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    <Link to="/demos/enterprise-agreement">Sign LOI</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Notice */}
          <div className="text-center mt-8">
            <DemoEnvironmentNotice variant="footer" />
          </div>
        </main>
      </div>
    </>
  );
};

export default DemoHub;
