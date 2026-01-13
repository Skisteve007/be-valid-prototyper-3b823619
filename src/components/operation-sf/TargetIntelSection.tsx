import { useState } from "react";
import { Target, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

const TargetIntelSection = () => {
  const [showTargetIntel, setShowTargetIntel] = useState(false);

  return (
    <section className="py-16 border-t border-border/30">
      <div className="container mx-auto px-4">
        <Collapsible open={showTargetIntel} onOpenChange={setShowTargetIntel}>
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
      </div>
    </section>
  );
};

export default TargetIntelSection;
