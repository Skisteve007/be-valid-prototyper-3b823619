import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PrintButton, LastUpdated, PrintableHeading, PrintableBulletList, PrintableCard, QualityGateChecklist } from "../PrintStyles";

const slides = [
  {
    number: 1,
    title: "SYNTH™",
    subtitle: "Verified AI Decisions + Audit Trails for High-Stakes Environments",
    bullets: [
      "VALID™ / GHOST™ Pass: Real-world verification rail"
    ]
  },
  {
    number: 2,
    title: "The Problem (\"Agent Problem\")",
    bullets: [
      "AI is powerful, but in production it creates risk",
      "Confident wrong answers (hallucinations)",
      "No clear accountability",
      "Hard to prove what happened later",
      "Unsafe actions when agents are connected to tools and systems"
    ]
  },
  {
    number: 3,
    title: "The Cost of Getting It Wrong",
    bullets: [
      "In regulated or mission-critical settings, failures create:",
      "Liability, fraud, compliance exposure",
      "Security incidents",
      "Bad decisions at scale",
      "Loss of trust + stalled AI adoption"
    ]
  },
  {
    number: 4,
    title: "The Solution",
    subtitle: "SYNTH is a governance layer for AI/agents",
    bullets: [
      "Independent reviewers → governed consensus",
      "Policy controls → safe behavior boundaries",
      "Verification gates → higher factual reliability",
      "Audit records → defensible outcomes"
    ]
  },
  {
    number: 5,
    title: "How SYNTH Works (High-Level)",
    bullets: [
      "Takes an input or agent action proposal",
      "Runs multiple independent AI reviewers in parallel",
      "Produces a single result + reasons + risk flags",
      "Escalates edge cases for stricter review",
      "Creates tamper-evident audit logs for compliance"
    ]
  },
  {
    number: 6,
    title: "Security + Control (Enterprise-Ready)",
    bullets: [
      "Role-based permissions (who can run/approve/change policy)",
      "Anomaly detection for suspicious sessions",
      "Fail-safe modes when dependencies degrade",
      "Budget controls (latency/cost/timeouts)"
    ]
  },
  {
    number: 7,
    title: "Proof / What's Built",
    bullets: [
      "Multi-reviewer governance pipeline",
      "Structured decision records",
      "Tamper-evident audit trail",
      "Admin + calibration controls",
      "Production deployment foundation (web + backend)"
    ]
  },
  {
    number: 8,
    title: "VALID™ / GHOST™ Pass (Real-World Trust)",
    subtitle: "High-volume verification for venues/enterprise",
    bullets: [
      "Encrypted, time-limited tokens",
      "Door scan / kiosk mode",
      "Wallet funding + transaction support",
      "Privacy-first: verification signals, not raw data"
    ]
  },
  {
    number: 9,
    title: "Who We Sell To (Target Markets)",
    bullets: [
      "Enterprises deploying AI agents in regulated workflows",
      "Security / compliance-heavy industries",
      "High-volume venues and access control operators",
      "Transportation, workforce compliance, identity/access"
    ]
  },
  {
    number: 10,
    title: "Why Now / Ask",
    bullets: [
      "AI is moving from chat to action",
      "We make it governed, auditable, and deployable",
      "ASK: Partnerships, pilots, and platform alignment"
    ]
  }
];

export const CanonicalPitchDeckInvestor = () => {
  const [copied, setCopied] = useState(false);

  const fullText = slides.map(slide => 
    `SLIDE ${slide.number}: ${slide.title}\n${slide.subtitle ? slide.subtitle + '\n' : ''}\n${slide.bullets.map(b => `• ${b}`).join('\n')}`
  ).join('\n\n---\n\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <PrintableHeading level={1}>Pitch Deck — Investor (Canonical)</PrintableHeading>
          <LastUpdated />
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            Copy All
          </Button>
          <PrintButton />
        </div>
      </div>

      <div className="grid gap-4">
        {slides.map((slide) => (
          <PrintableCard key={slide.number}>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary font-bold rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                {slide.number}
              </div>
              <div className="flex-1">
                <PrintableHeading level={3}>{slide.title}</PrintableHeading>
                {slide.subtitle && (
                  <p className="text-muted-foreground mb-3 italic print:text-gray-600">{slide.subtitle}</p>
                )}
                <PrintableBulletList items={slide.bullets} />
              </div>
            </div>
          </PrintableCard>
        ))}
      </div>

      <QualityGateChecklist />
    </div>
  );
};
