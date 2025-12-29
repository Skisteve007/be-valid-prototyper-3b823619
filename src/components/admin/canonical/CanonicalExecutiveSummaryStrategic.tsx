import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PrintButton, LastUpdated, PrintableHeading, PrintableParagraph, PrintableBulletList, PrintableCard, QualityGateChecklist } from "../PrintStyles";

export const CanonicalExecutiveSummaryStrategic = () => {
  const [copied, setCopied] = useState(false);

  const fullText = `EXECUTIVE SUMMARY — STRATEGIC (NVIDIA / NASA / Elon) (CANONICAL)

OVERVIEW

SYNTH is a governance layer for AI agents operating in high-stakes environments. It enables governed autonomy—where AI systems can take actions, but only within verified, auditable, and policy-controlled boundaries.

VALID / GHOST Pass applies the same architecture to physical-world verification: identity, access, and compliance decisions delivered through encrypted, privacy-first tokens.

CORE CAPABILITIES

• Governed Consensus: Multiple independent AI reviewers evaluate decisions in parallel
• Policy Enforcement: Configurable rules define allowed behaviors and escalation triggers
• Verification Gates: Decisions can require evidence from approved sources
• Tamper-Evident Audit Trail: Every decision logged with cryptographic integrity
• Fail-Safe Operations: Graceful degradation when dependencies fail; can "fail closed"
• Enterprise Deployment: Runtime can deploy inside customer boundary (VPC/on-prem)

TECHNICAL CREDIBILITY (WITHOUT INTERNALS)

• Multi-model architecture with fault tolerance (timeouts, errors, rate limits handled)
• Structured decision records with configurable retention
• Role-based access control for policy management
• Anomaly detection for session integrity
• Privacy posture: process sensitive payloads ephemerally; retain only minimal artifacts

WHERE WE FIT

For organizations building autonomous systems—robotics, digital twins, agent-based workflows—SYNTH provides the governance layer that makes AI actions auditable and defensible.

• Planned: GPU acceleration for high-throughput decision pipelines
• Planned: Integration with agent and digital twin ecosystems (e.g., Omniverse-style workflows)

WHAT WE WANT

• Pilots with teams building governed AI agents
• Integration partnerships with autonomous systems platforms
• Technical feedback on deployment requirements for high-stakes environments`;

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
          <PrintableHeading level={1}>Executive Summary — Strategic (NVIDIA / NASA / Elon)</PrintableHeading>
          <p className="text-muted-foreground mb-2">Canonical Version</p>
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
          SYNTH is a governance layer for AI agents operating in high-stakes environments. It enables governed autonomy—where AI systems can take actions, but only within verified, auditable, and policy-controlled boundaries.
        </PrintableParagraph>
        <PrintableParagraph>
          VALID / GHOST Pass applies the same architecture to physical-world verification: identity, access, and compliance decisions delivered through encrypted, privacy-first tokens.
        </PrintableParagraph>
      </PrintableCard>

      <PrintableCard>
        <PrintableHeading level={2}>Core Capabilities</PrintableHeading>
        <PrintableBulletList items={[
          "Governed Consensus: Multiple independent AI reviewers evaluate decisions in parallel",
          "Policy Enforcement: Configurable rules define allowed behaviors and escalation triggers",
          "Verification Gates: Decisions can require evidence from approved sources",
          "Tamper-Evident Audit Trail: Every decision logged with cryptographic integrity",
          "Fail-Safe Operations: Graceful degradation when dependencies fail; can \"fail closed\"",
          "Enterprise Deployment: Runtime can deploy inside customer boundary (VPC/on-prem)"
        ]} />
      </PrintableCard>

      <PrintableCard>
        <PrintableHeading level={2}>Technical Credibility (Without Internals)</PrintableHeading>
        <PrintableBulletList items={[
          "Multi-model architecture with fault tolerance (timeouts, errors, rate limits handled)",
          "Structured decision records with configurable retention",
          "Role-based access control for policy management",
          "Anomaly detection for session integrity",
          "Privacy posture: process sensitive payloads ephemerally; retain only minimal artifacts"
        ]} />
      </PrintableCard>

      <PrintableCard>
        <PrintableHeading level={2}>Where We Fit</PrintableHeading>
        <PrintableParagraph>
          For organizations building autonomous systems—robotics, digital twins, agent-based workflows—SYNTH provides the governance layer that makes AI actions auditable and defensible.
        </PrintableParagraph>
        <PrintableBulletList items={[
          "Planned: GPU acceleration for high-throughput decision pipelines",
          "Planned: Integration with agent and digital twin ecosystems (e.g., Omniverse-style workflows)"
        ]} />
      </PrintableCard>

      <PrintableCard>
        <PrintableHeading level={2}>What We Want</PrintableHeading>
        <PrintableBulletList items={[
          "Pilots with teams building governed AI agents",
          "Integration partnerships with autonomous systems platforms",
          "Technical feedback on deployment requirements for high-stakes environments"
        ]} />
      </PrintableCard>

      <QualityGateChecklist />
    </div>
  );
};
