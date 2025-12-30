import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, AlertTriangle, AlertCircle, Scale } from "lucide-react";
import { toast } from "sonner";

export const LegalPrecedents = () => {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const handleCopy = async (content: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedBlock(blockId);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedBlock(null), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const talkTrack = `LEGAL PRECEDENTS TALK TRACK — WHY GOVERNANCE MATTERS

Use this when prospects ask "Why do we need governance?" or "What's the risk?"

HEADLINE STAT:
"Companies have paid over $25 BILLION in fines and settlements due to AI/data governance failures in the last 5 years alone."

BAD OUTPUT EXAMPLES (AI makes wrong decisions):

1. Meta — $1.4 BILLION (2024, Texas)
   • Largest U.S. privacy settlement ever
   • Unlawful biometric data collection via facial recognition
   • KEY POINT: Automated system made decisions without proper governance

2. Amazon — $887 MILLION (2021, Luxembourg)
   • GDPR fine for behavioral ad targeting
   • Processing personal data without consent
   • KEY POINT: Algorithmic profiling without proper controls

3. Epic Games — $520 MILLION (2022, FTC)
   • COPPA violations + dark patterns
   • Automated purchase systems exploited users
   • KEY POINT: Automated decision tools without guardrails

4. Bank of America — $16.65 BILLION (2014, DOJ)
   • Largest civil settlement with single entity
   • Mortgage fraud + automated risk failures
   • KEY POINT: Automated financial systems without proper oversight

GARBAGE INPUT EXAMPLES (Bad data in = bad decisions out):

1. Meta — $1.3 BILLION (2023, Ireland DPC)
   • GDPR violation for EU-US data transfers
   • Data flowing without adequate safeguards
   • KEY POINT: Data governance failure at scale

2. Equifax — $700 MILLION (2019, FTC)
   • 150 million people affected
   • Unpatched vulnerabilities in identity systems
   • KEY POINT: Identity governance failure

3. Didi Global — $1.19 BILLION (2022, China)
   • Network security + data security violations
   • Personal information protection failures
   • KEY POINT: Data governance across borders

4. Meta — $5 BILLION (2019, FTC)
   • Cambridge Analytica scandal
   • Privacy order breach
   • KEY POINT: When governance fails repeatedly, penalties compound

THE SYNTH™ ANSWER:
"These companies all lacked what we provide:
• Pre-execution policy gating (catch problems BEFORE they happen)
• Verifiable proof records (audit trail for regulators)
• Enforcement layer (not just monitoring—actual control)

Would you rather pay for governance now, or pay regulators later?"

CLOSING LINE:
"The question isn't whether you'll face an AI governance audit. It's whether you'll be ready when it happens."`;

  const quickStats = `QUICK STATS FOR SALES CONVERSATIONS

Total documented governance failures: $25B+ in fines/settlements

TOP 5 BY AMOUNT:
1. Bank of America — $16.65B (mortgage fraud, automated systems)
2. Meta — $5B (Cambridge Analytica, privacy breach)
3. Meta — $1.4B (biometric data, facial recognition)
4. Meta — $1.3B (GDPR, EU data transfers)
5. Didi Global — $1.19B (data security, China)

GDPR FINES TOTAL: ~€5.88B (~$6.5B) globally by early 2025

TREND: Fines are INCREASING year over year as regulators get aggressive

WHAT THEY ALL HAVE IN COMMON:
• Automated decision systems without enforcement
• No verifiable audit trail
• Monitoring only (no prevention)
• Reactive instead of proactive

WHAT SYNTH™ PROVIDES:
• Pre-execution enforcement (prevention)
• Verifiable proof records (audit-ready)
• Court-admissible decision trail
• Proactive governance layer`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-destructive" />
            <CardTitle>Legal Precedents — Why Governance Matters</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            High-impact case studies showing the cost of AI/data governance failures. Use in sales conversations.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Talk Track */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                  Sales Talk Track — Legal Precedents
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Use when prospects ask "Why governance?" or "What's the risk?"
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(talkTrack, "talk-track")}
              >
                {copiedBlock === "talk-track" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg print:bg-white print:text-black font-mono">
                {talkTrack}
              </pre>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  Quick Stats — One-Pager
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Fast reference for sales calls and presentations
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(quickStats, "quick-stats")}
              >
                {copiedBlock === "quick-stats" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg print:bg-white print:text-black font-mono">
                {quickStats}
              </pre>
            </CardContent>
          </Card>

          {/* Visual Case Cards */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Visual Reference Cards</h3>
            
            {/* Bad Output */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-500/10">Bad Output</Badge>
                <span className="text-xs text-muted-foreground">AI/algorithmic decision failures</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="border-orange-500/20 bg-orange-500/5">
                  <CardContent className="pt-4 pb-4">
                    <h4 className="font-semibold text-foreground text-base mb-1">Meta — $1.4B (2024, Texas)</h4>
                    <p className="text-sm text-muted-foreground">Largest U.S. privacy settlement. Biometric data collection via facial recognition.</p>
                  </CardContent>
                </Card>
                <Card className="border-orange-500/20 bg-orange-500/5">
                  <CardContent className="pt-4 pb-4">
                    <h4 className="font-semibold text-foreground text-base mb-1">Amazon — $887M (2021)</h4>
                    <p className="text-sm text-muted-foreground">Luxembourg GDPR fine for behavioral ad targeting without consent.</p>
                  </CardContent>
                </Card>
                <Card className="border-orange-500/20 bg-orange-500/5">
                  <CardContent className="pt-4 pb-4">
                    <h4 className="font-semibold text-foreground text-base mb-1">Epic Games — $520M (2022)</h4>
                    <p className="text-sm text-muted-foreground">FTC fine for COPPA violations and dark patterns in automated purchases.</p>
                  </CardContent>
                </Card>
                <Card className="border-orange-500/20 bg-orange-500/5">
                  <CardContent className="pt-4 pb-4">
                    <h4 className="font-semibold text-foreground text-base mb-1">Bank of America — $16.65B (2014)</h4>
                    <p className="text-sm text-muted-foreground">Largest DOJ civil settlement. Mortgage fraud + automated system failures.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Garbage Input */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10">Garbage Input</Badge>
                <span className="text-xs text-muted-foreground">Data governance failures</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="border-red-500/20 bg-red-500/5">
                  <CardContent className="pt-4 pb-4">
                    <h4 className="font-semibold text-foreground text-base mb-1">Meta — $1.3B (2023, Ireland)</h4>
                    <p className="text-sm text-muted-foreground">GDPR violation for EU-US data transfers without safeguards.</p>
                  </CardContent>
                </Card>
                <Card className="border-red-500/20 bg-red-500/5">
                  <CardContent className="pt-4 pb-4">
                    <h4 className="font-semibold text-foreground text-base mb-1">Equifax — $700M (2019)</h4>
                    <p className="text-sm text-muted-foreground">FTC settlement. 150M people affected by identity governance failure.</p>
                  </CardContent>
                </Card>
                <Card className="border-red-500/20 bg-red-500/5">
                  <CardContent className="pt-4 pb-4">
                    <h4 className="font-semibold text-foreground text-base mb-1">Didi Global — $1.19B (2022)</h4>
                    <p className="text-sm text-muted-foreground">China CAC fine for data security + personal information violations.</p>
                  </CardContent>
                </Card>
                <Card className="border-red-500/20 bg-red-500/5">
                  <CardContent className="pt-4 pb-4">
                    <h4 className="font-semibold text-foreground text-base mb-1">Meta — $5B (2019, FTC)</h4>
                    <p className="text-sm text-muted-foreground">Cambridge Analytica scandal. Repeated governance failures = compounded penalties.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
