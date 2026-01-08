import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MessageSquare, BarChart3, Shield, FileCheck, ArrowRight, Sparkles, Building2, Code2, ClipboardCheck, HeartPulse, Phone, ChevronDown, AlertTriangle, AlertCircle, Upload, Gauge, Castle, Layers, QrCode, Bot, FileUp, Scale, Handshake, UserCheck, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DemoBanner from "@/components/demos/DemoBanner";
import DemoCard from "@/components/demos/DemoCard";
import FlowDiagram from "@/components/demos/FlowDiagram";
import DemoShareButton from "@/components/demos/DemoShareButton";
import SideBySideSection from "@/components/demos/SideBySideSection";
import DemoEnvironmentNotice from "@/components/demos/DemoEnvironmentNotice";
import GhostEcosystemModule from "@/components/demos/GhostEcosystemModule";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Target } from "lucide-react";

const DemoHub = () => {
  const [openExplainer, setOpenExplainer] = useState<string | null>(null);
  const [showLegalCases, setShowLegalCases] = useState(false);
  const [showSideBySide, setShowSideBySide] = useState(false);
  const [showVerticals, setShowVerticals] = useState(false);
  const [showTargetIntel, setShowTargetIntel] = useState(false);

  const targetIntel = [
    {
      id: "openevidence",
      name: "OpenEvidence",
      tagline: "The Whale",
      snapshot: "AI-powered medical search / evidence synthesis for clinicians. Publicly announced a $210M round at a $3.5B valuation (Jul 2025).",
      exposure: "Clinical decision support → hallucination risk = malpractice/liability risk. Needs \"release/veto\" enforcement + audit trail for every high-stakes answer.",
      stackCategories: [
        "Model monitoring / evaluation dashboards (observability)",
        "Content safety / policy filters (moderation)",
        "Security + compliance controls for clinical workflows (PHI handling)",
        "Internal QA / clinical review processes (human-in-the-loop)",
      ],
      wedgeLine: "You're becoming clinical infrastructure. Infrastructure needs a liability shield: CERTIFIED vs MISTRIAL + court-ready proof records.",
      cta: "Offer: 45-day side-by-side proof in shadow mode → active veto.",
    },
    {
      id: "abridge",
      name: "Abridge",
      tagline: "The Shield",
      snapshot: "AI clinical documentation: transcribes and structures patient-provider conversations into notes.",
      exposure: "Medical records are legal documents; transcription errors create care + legal risk. Heavy PHI surface area (privacy + retention + auditability).",
      stackCategories: [
        "Clinical documentation workflow + EHR integration layer",
        "PHI security controls (access, retention, audit)",
        "Transcription accuracy QA + clinician review loops",
        "Vendor compliance contracts (BAA/DPAs)",
      ],
      wedgeLine: "You're writing the medical record. We certify every transcript output and attach a proof record.",
      cta: "Offer: transcript governance pack + proof record verifier for auditors.",
    },
    {
      id: "hippocratic",
      name: "Hippocratic AI",
      tagline: "The Safety Play",
      snapshot: "Healthcare-focused AI models positioning around safety.",
      exposure: "Their brand promise is \"safe.\" Safety must be provable, not claimed. Buyers will ask: 'show me enforcement + audit trail.'",
      stackCategories: [
        "Safety benchmarking + model evaluation harnesses",
        "Guardrails / policy enforcement filters (pre/post processing)",
        "Incident review + audit processes for safety claims",
        "Enterprise security + compliance programs for healthcare AI",
      ],
      wedgeLine: "Don't market 'safe'—ship provable safety. We run continuous audits and produce verifiable proof records.",
      cta: "Offer: paid 'Safety Audit' package (fixed price) + renewal.",
    },
    {
      id: "formation",
      name: "Formation Bio",
      tagline: "The Pharma Play",
      snapshot: "Uses AI/data to accelerate drug development and trials.",
      exposure: "Regulated domain (GxP mindset): traceability, validation, and audit trails matter. Data integrity errors can sink trials and timelines.",
      stackCategories: [
        "Data pipelines + lineage tooling (traceability)",
        "Validation / QA processes (regulated workflow mindset)",
        "Access control + audit logging for sensitive research data",
        "Model evaluation for R&D outputs (quality + reproducibility)",
      ],
      wedgeLine: "FDA-grade work requires traceable decisions. We provide proof records and governance gates.",
      cta: "Offer: governance on trial-facing outputs + audit-ready proof artifacts.",
    },
    {
      id: "ambience",
      name: "Ambience Healthcare",
      tagline: "The OS Play",
      snapshot: "Ambient AI clinical scribing / workflow automation in provider settings.",
      exposure: "Real-time capture + summarization: errors propagate fast. PHI exposure + operational risk at scale.",
      stackCategories: [
        "Real-time capture + summarization pipeline (high throughput)",
        "PHI security + retention policies (medical record implications)",
        "Monitoring for drift/quality (observability)",
        "Manual review + escalation workflows for edge cases",
      ],
      wedgeLine: "You're the clinical OS. We are the safety kernel: certify notes before they enter the record.",
      cta: "Offer: batch + streaming governance for notes with proof records.",
    },
    {
      id: "tennr",
      name: "Tennr",
      tagline: "The Automation Play",
      snapshot: "Automates healthcare fax/referral workflows into structured data.",
      exposure: "Misread/referral errors = care delays + compliance risk. Garbage-in → patient harm/outcomes risk.",
      stackCategories: [
        "Document ingestion / extraction pipeline (OCR/ML)",
        "Workflow automation + routing (referrals/tickets)",
        "QA sampling + exception handling queues",
        "Compliance controls for PHI moving through ops workflows",
      ],
      wedgeLine: "Every referral becomes a liability object. We certify each extraction and produce a proof record.",
      cta: "Offer: 'clean-before-model' governance gate + proof record for every referral.",
    },
  ];

  const demos = [
    // VENDOR DEPOT — Primary CTA
    {
      title: "Vendor Depot",
      subtitle: "Upload documents for AI-governed validation",
      icon: Upload,
      bullets: [
        "Attorneys, doctors, enterprise vendors submit documents",
        "Multi-model validation through 7-seat AI Senate",
        "Proof record + scores returned within 20 minutes",
      ],
      whoFor: "Legal, medical, and enterprise professionals needing governed document validation",
      path: "/vendor-depot",
      pulsate: true,
    },
    // TOP 3 — Reordered per restructure pack
    {
      title: "Demo A — Operator Certification (Workforce)",
      subtitle: "Numerically score how people use AI—over time (0–100).",
      icon: UserCheck,
      bullets: [
        "Category sub-scores (0–100): Verification Discipline, Risk Handling, Reasoning Quality, Policy Compliance",
        "Trendlines + drift detection over 7 / 30 / 60 / 90 day windows",
        "LLM/interface traceability and proof record IDs",
      ],
      whoFor: "Regulated employers, universities, critical infrastructure, aerospace/defense, and high-trust operations",
      path: "/demos/operator-certification",
    },
    {
      title: "Demo B — Platform Monitoring & Audit",
      subtitle: "Health, latency, and audit visibility across many decisions.",
      icon: BarChart3,
      bullets: [
        "System health, throughput, and latency overview",
        "Reliability trends over time (demo-safe)",
        "Trace viewing and audit access patterns (demo-safe)",
      ],
      whoFor: "Investors, compliance leaders, security teams",
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
    // Remaining demos
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
    {
      title: "Senate QA — AI Review Panel",
      subtitle: "One request → enforced verdict + proof record.",
      icon: MessageSquare,
      bullets: [
        "A single prompt processed through the governed pipeline (demo-safe)",
        "Decision trace (checks → arbitration if needed → release/veto)",
        "Final output with a verifiable proof record",
      ],
      whoFor: "Teams evaluating decision enforcement on individual requests",
      path: "/demos/senate-qa",
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
          <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm overflow-hidden">
            <nav className="container mx-auto px-4 py-2.5 flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide">
              <a href="#overview" className="flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-foreground bg-muted/40 hover:bg-muted/60 rounded-full whitespace-nowrap transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-border/50">Overview</a>
              <a href="#demos" className="flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-foreground bg-muted/40 hover:bg-muted/60 rounded-full whitespace-nowrap transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-border/50">Demos</a>
              <a href="#proof" className="flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-foreground bg-muted/40 hover:bg-muted/60 rounded-full whitespace-nowrap transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-border/50">Proof</a>
              <a href="#ghost" className="flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-foreground bg-muted/40 hover:bg-muted/60 rounded-full whitespace-nowrap transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-border/50">Ghost</a>
              <a href="#risks" className="flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-foreground bg-muted/40 hover:bg-muted/60 rounded-full whitespace-nowrap transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-border/50">Risks</a>
              <a href="#integration" className="flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-foreground bg-muted/40 hover:bg-muted/60 rounded-full whitespace-nowrap transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-border/50">Integration</a>
              <a href="#loi" className="flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-foreground bg-muted/40 hover:bg-muted/60 rounded-full whitespace-nowrap transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-border/50">LOI</a>
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
          <Card id="proof" className="mb-4 border-primary/20 bg-primary/5 scroll-mt-32">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Sparkles className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Governance Conduit, Not Data Warehouse</h2>
                  <p className="text-muted-foreground text-base mb-4">
                    Your systems remain the system of record. SYNTH orchestrates verification and governance 
                    across models and services, then returns results with a verifiable proof record. Valid 
                    provides the application layer where users interact with Ghost passes and verified credentials.
                    Enterprise deployments can run inside your environment so raw payloads stay within your boundary; for fast pilots, we can run a hosted sandbox with minimized inputs—then move in‑VPC for production.
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

          {/* Pipeline, Not Vault Block */}
          <Card className="mb-8 border-amber-500/20 bg-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-amber-400 shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Pipeline, Not Vault</h2>
                  <p className="text-muted-foreground text-base mb-3">
                    Your systems remain the system of record. Valid/SYNTH returns signed decision signals plus a verifiable proof record (integrity artifacts). Source records (PII/PHI, lab results, ID scans) stay with you and your verification providers—never inside Valid.
                  </p>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="link" size="sm" className="p-0 h-auto text-amber-400 hover:text-amber-300">
                        What's a proof record?
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-3 p-4 rounded-lg bg-muted/30 border border-border/30 text-sm text-muted-foreground space-y-2">
                        <p className="font-medium text-foreground">A proof record contains:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>proof_id — unique identifier</li>
                          <li>input_hash — hash of the input (not raw content)</li>
                          <li>issued_at / expires_at — timestamps</li>
                          <li>policy_pack_version — which rules were applied</li>
                          <li>verdict + reason codes</li>
                          <li>vendor_reference_ids — pointers to source systems</li>
                        </ul>
                        <p className="pt-2 text-xs italic">Source records (raw PII/PHI, lab files, ID images) are NOT stored—only minimal integrity artifacts needed for auditability.</p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
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
                      <p className="text-sm text-primary mt-2">
                        Best fit pricing:{" "}
                        <a href="#loi" className="underline hover:text-primary/80 transition-colors">Main Street (Tier 3)</a>
                        {" → "}
                        <a href="#loi" className="underline hover:text-primary/80 transition-colors">Pilot (Tier 2)</a>
                      </p>
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
                      <p className="text-foreground">Universities, banks, large enterprises with existing systems.</p>
                      <p className="text-sm text-cyan-400 mt-2">
                        Best fit pricing:{" "}
                        <a href="#loi" className="underline hover:text-cyan-300 transition-colors">Enterprise (Tier 1)</a>
                        {" → "}
                        <a href="#loi" className="underline hover:text-cyan-300 transition-colors">Sector / Exclusivity (Tier 0)</a>
                      </p>
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

          {/* Target Intel Cascade */}
          <Collapsible open={showTargetIntel} onOpenChange={setShowTargetIntel} className="mt-8">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer p-5 rounded-lg border border-purple-500/30 hover:border-purple-500/50 bg-purple-500/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <Target className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Target Intel (Click to Expand)</h2>
                    <p className="text-base text-muted-foreground">YOUR HIT LIST SUMMARY — Facts + Why They're Exposed + Wedge</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{showTargetIntel ? 'Hide intel' : 'Show intel'}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showTargetIntel ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Accordion type="single" collapsible className="mt-4 space-y-3">
                {targetIntel.map((target) => (
                  <AccordionItem key={target.id} value={target.id} className="border border-purple-500/20 bg-purple-500/5 rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3 text-left">
                        <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                          <Target className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">{target.name}</span>
                          <span className="text-purple-400 ml-2">— {target.tagline}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4 pl-11">
                        <div>
                          <p className="text-sm font-medium text-purple-400 mb-1">Snapshot (public):</p>
                          <p className="text-foreground">{target.snapshot}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-400 mb-1">Why they're exposed:</p>
                          <p className="text-foreground">{target.exposure}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Where this sits in your current stack (safe categories):</p>
                          <ul className="text-foreground space-y-1 list-disc list-inside text-sm">
                            {target.stackCategories.map((category, idx) => (
                              <li key={idx}>{category}</li>
                            ))}
                          </ul>
                          <p className="text-xs text-muted-foreground italic mt-2">Most stacks can observe and log. Few can enforce a release/veto decision with a proof record.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                          <p className="text-sm font-medium text-cyan-400 mb-1">Your wedge line:</p>
                          <p className="text-foreground italic">"{target.wedgeLine}"</p>
                        </div>
                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                          <p className="text-sm font-medium text-primary mb-1">CTA:</p>
                          <p className="text-foreground font-medium">{target.cta}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <p className="text-xs text-muted-foreground italic text-center mt-4 pt-3 border-t border-border/30">
                Numbers shown are based on public announcements where available. Any internal estimates must be labeled as such.
              </p>
            </CollapsibleContent>
          </Collapsible>

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
                    <p className="text-base text-muted-foreground">Major fines, settlements, and losses from AI/data governance failures</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{showLegalCases ? 'Hide cases' : 'Show cases'}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showLegalCases ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-8 mt-6">
                {/* Bad Output Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                      <AlertTriangle className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">Bad Output</h3>
                      <p className="text-sm text-orange-400">AI hallucinations, algorithmic failures, and automated decision errors</p>
                    </div>
                  </div>
                  
                  {/* AI Hallucinations */}
                  <div className="mb-6">
                    <Badge variant="outline" className="mb-3 border-orange-500/50 text-orange-400 bg-orange-500/10">AI Hallucinations</Badge>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

                  {/* Algorithmic Ad Targeting & Profiling */}
                  <div className="mb-6">
                    <Badge variant="outline" className="mb-3 border-orange-500/50 text-orange-400 bg-orange-500/10">Algorithmic Ad Targeting & Profiling</Badge>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Card className="border-orange-500/20 bg-orange-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">Amazon — $887M (2021)</h4>
                          <p className="text-sm text-muted-foreground">Luxembourg GDPR fine (€746M) for behavioral ad targeting and processing data without proper consent.</p>
                        </CardContent>
                      </Card>
                      <Card className="border-orange-500/20 bg-orange-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">Google — $170M (2019, FTC)</h4>
                          <p className="text-sm text-muted-foreground">FTC settlement for COPPA violations tied to YouTube's algorithms collecting children's data without consent.</p>
                        </CardContent>
                      </Card>
                      <Card className="border-orange-500/20 bg-orange-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">Epic Games — $520M</h4>
                          <p className="text-sm text-muted-foreground">FTC fine for COPPA violations and deceptive patterns exploiting automated decision tools for in-game purchases.</p>
                        </CardContent>
                      </Card>
                      <Card className="border-orange-500/20 bg-orange-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">LinkedIn — $336M (2024)</h4>
                          <p className="text-sm text-muted-foreground">Irish DPC fine for failures in user data protection involving profiling and inadequate privacy controls.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Facial Recognition Failures */}
                  <div className="mb-6">
                    <Badge variant="outline" className="mb-3 border-orange-500/50 text-orange-400 bg-orange-500/10">Biometric & Facial Recognition</Badge>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Card className="border-orange-500/20 bg-orange-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">Meta — $1.4B (2024, Texas)</h4>
                          <p className="text-sm text-muted-foreground">Largest-ever U.S. privacy settlement for unlawful biometric data collection (facial recognition) under Texas law.</p>
                        </CardContent>
                      </Card>
                      <Card className="border-orange-500/20 bg-orange-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">Williams v. Detroit (2024)</h4>
                          <p className="text-sm text-muted-foreground">City paid $300K settlement after bad photo input led to wrongful AI-driven arrest.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Financial Algorithmic Trading */}
                  <div>
                    <Badge variant="outline" className="mb-3 border-orange-500/50 text-orange-400 bg-orange-500/10">Algorithmic Trading & Financial Systems</Badge>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Card className="border-orange-500/20 bg-orange-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">Bank of America — $16.65B (2014)</h4>
                          <p className="text-sm text-muted-foreground">Historic DOJ settlement for mortgage-related fraud—largest civil settlement ever with a single entity.</p>
                        </CardContent>
                      </Card>
                      <Card className="border-orange-500/20 bg-orange-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">JPMorgan — $13B (2013)</h4>
                          <p className="text-sm text-muted-foreground">DOJ settlement for mortgage fraud and poor automated risk controls in financial systems.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Garbage Input Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">Garbage Input</h3>
                      <p className="text-sm text-red-400">Data breaches, identity verification failures, and bad data governance</p>
                    </div>
                  </div>

                  {/* Data Breaches & Governance */}
                  <div className="mb-6">
                    <Badge variant="outline" className="mb-3 border-red-500/50 text-red-400 bg-red-500/10">Data Breaches & Governance</Badge>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Card className="border-red-500/20 bg-red-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">Equifax — $700M (2019)</h4>
                          <p className="text-sm text-muted-foreground">FTC settlement after data breach affected 150M people due to unpatched vulnerabilities in identity governance systems.</p>
                        </CardContent>
                      </Card>
                      <Card className="border-red-500/20 bg-red-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">T-Mobile — $500M+</h4>
                          <p className="text-sm text-muted-foreground">Data breach settlement plus $15.75M FCC fine for poor data governance in security incidents.</p>
                        </CardContent>
                      </Card>
                      <Card className="border-red-500/20 bg-red-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">British Airways — £20M (~$24M)</h4>
                          <p className="text-sm text-muted-foreground">UK ICO GDPR fine after malware compromised 400K customers' data due to lax automated system protection.</p>
                        </CardContent>
                      </Card>
                      <Card className="border-red-500/20 bg-red-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">Capital One — $80M</h4>
                          <p className="text-sm text-muted-foreground">OCC fine for cloud configuration errors—automated systems lacking suitable security checks.</p>
                        </CardContent>
                      </Card>
                      <Card className="border-red-500/20 bg-red-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">Anthem — $115M (HIPAA)</h4>
                          <p className="text-sm text-muted-foreground">Settlement after breach exposed 80M people's health/identity data due to deficient automated access controls.</p>
                        </CardContent>
                      </Card>
                      <Card className="border-red-500/20 bg-red-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">Didi Global — $1.19B (2022)</h4>
                          <p className="text-sm text-muted-foreground">China CAC fine for violating network security, data security, and personal information protection laws.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* International Data Transfers */}
                  <div className="mb-6">
                    <Badge variant="outline" className="mb-3 border-red-500/50 text-red-400 bg-red-500/10">International Data Transfers</Badge>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Card className="border-red-500/20 bg-red-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">Meta — $1.3B (2023, Ireland DPC)</h4>
                          <p className="text-sm text-muted-foreground">Fined for unlawfully transferring EU personal data to the U.S. without adequate safeguards, violating GDPR Article 46(1).</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Identity Verification Failures */}
                  <div className="mb-6">
                    <Badge variant="outline" className="mb-3 border-red-500/50 text-red-400 bg-red-500/10">Identity Verification Failures</Badge>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Card className="border-red-500/20 bg-red-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">JPMorgan v. Frank (2023)</h4>
                          <p className="text-sm text-muted-foreground">Bank lost $175M acquiring a startup that had 4 million fake users—zero identity verification.</p>
                        </CardContent>
                      </Card>
                      <Card className="border-red-500/20 bg-red-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">Rideshare Class Actions</h4>
                          <p className="text-sm text-muted-foreground">Companies sued when drivers used stolen IDs to bypass background checks.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Privacy Violations */}
                  <div>
                    <Badge variant="outline" className="mb-3 border-red-500/50 text-red-400 bg-red-500/10">Privacy Violations</Badge>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Card className="border-red-500/20 bg-red-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">Meta — $5B (2019, FTC)</h4>
                          <p className="text-sm text-muted-foreground">Huge penalty for breaching earlier privacy order (Cambridge Analytica scandal).</p>
                        </CardContent>
                      </Card>
                      <Card className="border-red-500/20 bg-red-500/5">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="font-semibold text-foreground text-base mb-1">Meta — $725M (FTC)</h4>
                          <p className="text-sm text-muted-foreground">Settlement for data misuse related to Cambridge Analytica and user privacy violations.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Industry Context */}
                <div className="p-4 rounded-lg border border-muted bg-muted/30">
                  <h4 className="font-semibold text-foreground mb-2">Industry Context</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• GDPR fines have compounded to ~€5.88B (~$6.5B) globally by early 2025</li>
                    <li>• U.S. corporate misconduct fines reach $50B/year with recidivism in automated systems</li>
                    <li>• Largest penalties stem from data governance, AI profiling, facial recognition, and identity verification failures</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    Sources: CSO Online, Data Privacy + Cybersecurity Insider, Infosecurity Magazine, GetAstra, GDPR Local, Statista, NexaCollect, Data Privacy Manager, Enzuzo, Good Jobs First
                  </p>
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

          {/* Investor Pitch Deck Section */}
          <Card className="mt-8 border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-transparent">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 rounded-xl bg-cyan-500/20 border border-cyan-500/30 shrink-0">
                  <Presentation className="h-8 w-8 text-cyan-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">Investor Pitch Deck</h3>
                  <p className="text-muted-foreground">
                    View the full cinematic presentation covering the VALID™ vision, market opportunity, and investment terms.
                  </p>
                </div>
                <Button asChild size="lg" className="gap-2 shrink-0">
                  <Link to="/pitch">
                    <Presentation className="h-5 w-5" />
                    View Deck
                  </Link>
                </Button>
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
