import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PrintButton, ExportPDFButton, LastUpdated, PrintableHeading, PrintableBulletList, PrintableCard, BrandedHeader, LegalFooter, SimpleFlowDiagram } from "../PrintStyles";

const slides = [
  {
    number: 1,
    title: "SYNTH™",
    subtitle: "Governed Autonomy for High-Stakes AI Systems",
    bullets: [
      "Verification + Control + Audit for AI Agents"
    ]
  },
  {
    number: 2,
    title: "The Agent Problem",
    bullets: [
      "AI agents are being connected to real tools and systems",
      "Actions have consequences—financial, legal, physical",
      "Current monitoring tools log but cannot enforce",
      "No proof of what happened when things go wrong"
    ]
  },
  {
    number: 3,
    title: "Safety + Control Requirements",
    bullets: [
      "Must verify before action, not just log after",
      "Must enforce policy boundaries in real-time",
      "Must provide auditable proof for compliance",
      "Must handle failures gracefully (fail-safe modes)"
    ]
  },
  {
    number: 4,
    title: "SYNTH: The Governance Layer",
    bullets: [
      "Multiple independent AI reviewers evaluate each decision",
      "Policy controls define allowed behaviors",
      "Verification gates check against approved sources",
      "Tamper-evident audit trail for every decision"
    ]
  },
  {
    number: 5,
    title: "Verification Gates",
    bullets: [
      "Pre-execution checks before AI takes action",
      "Evidence requirements configurable per policy",
      "Escalation triggers for edge cases",
      "Abstention when confidence is low"
    ]
  },
  {
    number: 6,
    title: "Audit Trails",
    bullets: [
      "Every decision logged with cryptographic integrity",
      "Proof records independently verifiable",
      "Configurable retention policies",
      "SIEM export and compliance reporting ready"
    ]
  },
  {
    number: 7,
    title: "Fail-Safe Operations",
    bullets: [
      "Graceful degradation when dependencies fail",
      "Can \"fail closed\" when required",
      "Budget controls (latency, cost, tokens)",
      "Anomaly detection for session integrity"
    ]
  },
  {
    number: 8,
    title: "Enterprise Deployment",
    bullets: [
      "Runtime can deploy inside customer boundary",
      "VPC and on-prem options available",
      "Raw payloads stay in customer environment",
      "Minimal artifacts retained by SYNTH"
    ]
  },
  {
    number: 9,
    title: "Where We Fit",
    bullets: [
      "Governance layer for autonomous systems",
      "Robotics, digital twins, agent-based workflows",
      "Planned: GPU acceleration for high-throughput",
      "Planned: Integration with Omniverse-style ecosystems"
    ]
  },
  {
    number: 10,
    title: "Ask: Partnership + Pilot",
    bullets: [
      "Pilots with teams building governed AI agents",
      "Integration partnerships with autonomous platforms",
      "Technical feedback on high-stakes deployment requirements"
    ]
  }
];

export const CanonicalPitchDeckStrategic = () => {
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
    <div className="space-y-6 print-content">
      <BrandedHeader title="Confidential Pitch Materials" variant="synth" />
      
      <div className="flex justify-between items-start">
        <div>
          <PrintableHeading level={1}>Pitch Deck — Strategic (NVIDIA / NASA / Elon)</PrintableHeading>
          <p className="text-muted-foreground mb-2 print:!text-gray-700">Canonical Version</p>
          <LastUpdated />
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            Copy All
          </Button>
          <PrintButton />
          <ExportPDFButton />
        </div>
      </div>

      <SimpleFlowDiagram />

      <div className="grid gap-4">
        {slides.map((slide) => (
          <PrintableCard key={slide.number}>
            <div className="flex items-start gap-4">
              <div className="bg-cyan-500/10 text-cyan-400 font-bold rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 print:!bg-cyan-100 print:!text-cyan-700 print:!border print:!border-cyan-400">
                {slide.number}
              </div>
              <div className="flex-1">
                <PrintableHeading level={3}>{slide.title}</PrintableHeading>
                {slide.subtitle && (
                  <p className="text-muted-foreground mb-3 italic print:!text-gray-600">{slide.subtitle}</p>
                )}
                <PrintableBulletList items={slide.bullets} />
              </div>
            </div>
          </PrintableCard>
        ))}
      </div>

      <LegalFooter />
    </div>
  );
};
