import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PrintButton, LastUpdated, PrintableHeading, PrintableParagraph, PrintableBulletList, PrintableCard, QualityGateChecklist } from "../PrintStyles";

export const CanonicalExecutiveSummaryInvestor = () => {
  const [copied, setCopied] = useState(false);

  const fullText = `EXECUTIVE SUMMARY — INVESTOR (CANONICAL)

OVERVIEW

SYNTH is a governance layer for AI systems. It helps organizations trust AI output when the cost of being wrong is high—security, compliance, finance, healthcare, and critical operations.

VALID / GHOST Pass extends the same trust approach to the real world: fast, privacy-first verification for identity, access, compliance, and payments using encrypted, time-limited tokens without storing personal data.

PROBLEMS SOLVED

• AI systems produce confident wrong answers (hallucinations) with no accountability
• No audit trail to prove what happened after the fact
• Unsafe actions when AI agents are connected to tools and systems
• Liability, fraud, and compliance exposure from unverified outputs
• Loss of trust stalls AI adoption in regulated environments
• Identity verification systems store too much personal data
• Access control lacks speed and privacy in high-volume settings

WHAT WE BUILT (CAPABILITIES)

• Governed verification: Multiple independent AI reviewers produce consensus decisions
• Policy controls: Configurable rules that define what the system is allowed to do
• Verification gates: Checks against approved sources when required
• Tamper-evident audit trail: Logs protected against silent changes
• Fail-safe operations: Handles model outages and can "fail closed" when needed
• Privacy-first identity verification: Encrypted tokens without storing personal data
• High-volume access control: Fast door scan and kiosk modes for venues

WHY NOW

• AI is moving from chat to action—agents are being connected to real tools
• Enterprises need explainable, auditable decisions—not "best-effort" answers
• Regulatory pressure is increasing for AI accountability and identity privacy

WHY US (DIFFERENTIATORS)

• Enforcement, not just monitoring—we can block, not just log
• Proof records are independently auditable—trust through verification
• Enterprise deployment options—runtime can run inside customer boundary

BUSINESS MODEL

Platform licensing plus usage-based verification fees. Venues pay per scan; enterprises pay per decision. See Pricing/Menu in Admin for details.`;

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
          <PrintableHeading level={1}>Executive Summary — Investor (Canonical)</PrintableHeading>
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

      <PrintableCard>
        <PrintableHeading level={2}>Overview</PrintableHeading>
        <PrintableParagraph>
          SYNTH is a governance layer for AI systems. It helps organizations trust AI output when the cost of being wrong is high—security, compliance, finance, healthcare, and critical operations.
        </PrintableParagraph>
        <PrintableParagraph>
          VALID / GHOST Pass extends the same trust approach to the real world: fast, privacy-first verification for identity, access, compliance, and payments using encrypted, time-limited tokens without storing personal data.
        </PrintableParagraph>
      </PrintableCard>

      <PrintableCard>
        <PrintableHeading level={2}>Problems Solved</PrintableHeading>
        <PrintableBulletList items={[
          "AI systems produce confident wrong answers (hallucinations) with no accountability",
          "No audit trail to prove what happened after the fact",
          "Unsafe actions when AI agents are connected to tools and systems",
          "Liability, fraud, and compliance exposure from unverified outputs",
          "Loss of trust stalls AI adoption in regulated environments",
          "Identity verification systems store too much personal data",
          "Access control lacks speed and privacy in high-volume settings"
        ]} />
      </PrintableCard>

      <PrintableCard>
        <PrintableHeading level={2}>What We Built (Capabilities)</PrintableHeading>
        <PrintableBulletList items={[
          "Governed verification: Multiple independent AI reviewers produce consensus decisions",
          "Policy controls: Configurable rules that define what the system is allowed to do",
          "Verification gates: Checks against approved sources when required",
          "Tamper-evident audit trail: Logs protected against silent changes",
          "Fail-safe operations: Handles model outages and can \"fail closed\" when needed",
          "Privacy-first identity verification: Encrypted tokens without storing personal data",
          "High-volume access control: Fast door scan and kiosk modes for venues"
        ]} />
      </PrintableCard>

      <PrintableCard>
        <PrintableHeading level={2}>Why Now</PrintableHeading>
        <PrintableBulletList items={[
          "AI is moving from chat to action—agents are being connected to real tools",
          "Enterprises need explainable, auditable decisions—not \"best-effort\" answers",
          "Regulatory pressure is increasing for AI accountability and identity privacy"
        ]} />
      </PrintableCard>

      <PrintableCard>
        <PrintableHeading level={2}>Why Us (Differentiators)</PrintableHeading>
        <PrintableBulletList items={[
          "Enforcement, not just monitoring—we can block, not just log",
          "Proof records are independently auditable—trust through verification",
          "Enterprise deployment options—runtime can run inside customer boundary"
        ]} />
      </PrintableCard>

      <PrintableCard>
        <PrintableHeading level={2}>Business Model</PrintableHeading>
        <PrintableParagraph>
          Platform licensing plus usage-based verification fees. Venues pay per scan; enterprises pay per decision.
        </PrintableParagraph>
        <PrintableParagraph className="text-primary">
          → See Pricing tab in Admin for detailed menu and packages.
        </PrintableParagraph>
      </PrintableCard>

      <QualityGateChecklist />
    </div>
  );
};
