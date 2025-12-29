import { Button } from "@/components/ui/button";
import { Copy, Check, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PrintButton, LastUpdated, PrintableHeading, PrintableParagraph, PrintableCard } from "../PrintStyles";

const approvedPhrases = [
  { phrase: "Policy-governed decisions", context: "Describing how SYNTH works" },
  { phrase: "Verification gates", context: "Pre-execution checks" },
  { phrase: "Tamper-evident audit trail", context: "Logging and compliance" },
  { phrase: "Privacy-first verification signals", context: "VALID/GHOST Pass" },
  { phrase: "Enterprise deployment options", context: "VPC/on-prem capability" },
  { phrase: "Fail-safe modes", context: "Graceful degradation" },
  { phrase: "Multi-model consensus", context: "Architecture description" },
  { phrase: "Independent reviewers", context: "How decisions are made" },
  { phrase: "Structured decision records", context: "Audit capabilities" },
  { phrase: "Proof records", context: "Verifiable outputs" },
  { phrase: "Encrypted, time-limited tokens", context: "GHOST Pass tokens" },
  { phrase: "Role-based access control", context: "Security features" },
  { phrase: "Configurable policies", context: "Customization" },
  { phrase: "Planned GPU acceleration", context: "Future roadmap" },
  { phrase: "Planned integration with agent ecosystems", context: "Strategic direction" },
];

const forbiddenPhrases = [
  { phrase: "Guaranteed truth / perfect accuracy", reason: "Overpromises; creates liability" },
  { phrase: "Unhackable / unbreakable security", reason: "No system is unbreakable" },
  { phrase: "We use [specific model names]", reason: "Reveals implementation secrets" },
  { phrase: "[X] seats / [X] models / specific weights", reason: "Leaks architecture details" },
  { phrase: "Specific thresholds or TTL values", reason: "Anti-fraud implementation" },
  { phrase: "Database schemas / function names", reason: "Technical internals" },
  { phrase: "SOC2 / HIPAA compliant (unless certified)", reason: "False claims create legal risk" },
  { phrase: "Patented (unless granted)", reason: "Patent pending ≠ patented" },
  { phrase: "Impossible to tamper", reason: "Overpromise; use 'tamper-evident'" },
  { phrase: "100% uptime / never fails", reason: "All systems can fail" },
  { phrase: "We store nothing", reason: "We store minimal artifacts; be precise" },
  { phrase: "AI will always be right", reason: "AI can be wrong; that is why we exist" },
];

export const ApprovedVsForbiddenLanguage = () => {
  const [copied, setCopied] = useState(false);

  const fullText = `APPROVED VS FORBIDDEN LANGUAGE (EXECUTIVE)

WHY THIS MATTERS

Credibility is our moat. Every claim must be defensible. Overpromising creates legal liability and destroys trust. Leaking implementation details weakens our IP position.

RULE: If you cannot prove it with an artifact, do not claim it.

SAY THIS (APPROVED)
${approvedPhrases.map(p => `• "${p.phrase}" — ${p.context}`).join('\n')}

DO NOT SAY THIS (FORBIDDEN)
${forbiddenPhrases.map(p => `• "${p.phrase}" — ${p.reason}`).join('\n')}`;

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
          <PrintableHeading level={1}>Approved vs Forbidden Language (Executive)</PrintableHeading>
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
        <PrintableHeading level={2}>Why This Matters</PrintableHeading>
        <PrintableParagraph>
          Credibility is our moat. Every claim must be defensible. Overpromising creates legal liability and destroys trust. Leaking implementation details weakens our IP position.
        </PrintableParagraph>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <p className="font-semibold text-amber-400">
            RULE: If you cannot prove it with an artifact, do not claim it.
          </p>
        </div>
      </PrintableCard>

      <div className="grid md:grid-cols-2 gap-6">
        <PrintableCard className="border-green-500/30">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <PrintableHeading level={2} className="mb-0">Say This (Approved)</PrintableHeading>
          </div>
          <div className="space-y-3">
            {approvedPhrases.map((item, index) => (
              <div key={index} className="border-l-2 border-green-500/50 pl-3 py-1">
                <p className="font-medium text-green-400 print:text-green-700">"{item.phrase}"</p>
                <p className="text-sm text-muted-foreground print:text-gray-600">{item.context}</p>
              </div>
            ))}
          </div>
        </PrintableCard>

        <PrintableCard className="border-red-500/30">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <PrintableHeading level={2} className="mb-0">Do NOT Say This (Forbidden)</PrintableHeading>
          </div>
          <div className="space-y-3">
            {forbiddenPhrases.map((item, index) => (
              <div key={index} className="border-l-2 border-red-500/50 pl-3 py-1">
                <p className="font-medium text-red-400 print:text-red-700">"{item.phrase}"</p>
                <p className="text-sm text-muted-foreground print:text-gray-600">{item.reason}</p>
              </div>
            ))}
          </div>
        </PrintableCard>
      </div>
    </div>
  );
};
