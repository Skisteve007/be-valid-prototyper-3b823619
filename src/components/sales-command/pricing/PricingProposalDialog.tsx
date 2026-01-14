import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ProposalData {
  usersGoverned: number;
  queriesPerDay: number;
  msq: number;
  ghostPassScans: number;
  ghostPassOverage: number;
  verificationEnabled: boolean;
  checksBasic: number;
  checksStandard: number;
  checksDeep: number;
  basicChecksCost: number;
  standardChecksCost: number;
  deepChecksCost: number;
  totalVerificationCost: number;
  portsConnected: number;
  riskLevel: string;
  riskMultiplier: number;
  selectedTier: string;
  tierLabel: string;
  includedQueries: number;
  includedGhostPassScans: number;
  ghostPassRate: number;
  includedPorts: number;
  anchor: number;
  queryOverage: number;
  portOverage: number;
  totalMonthly: number;
  rangeLow: number;
  rangeHigh: number;
  agentforceBaseline: number;
  savingsPercent: number;
}

interface PricingProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ProposalData;
}

export function PricingProposalDialog({ open, onOpenChange, data }: PricingProposalDialogProps) {
  const [copied, setCopied] = useState(false);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${Math.round(amount).toLocaleString()}`;
  };

  const proposalText = `
PROPOSAL — 7-SEAT SENATE GOVERNANCE (MONTHLY)
Generated: ${new Date().toLocaleDateString()}

═══════════════════════════════════════════════════════
CLIENT INPUTS
═══════════════════════════════════════════════════════
• Users governed: ${data.usersGoverned.toLocaleString()}
• Queries per user per day: ${data.queriesPerDay}
• Monthly Senate queries (22 days): ${data.msq.toLocaleString()}
• Ghost Pass — QR scans (fast gate validation): ${data.ghostPassScans.toLocaleString()} per month
• Verification add-on: ${data.verificationEnabled ? 'Enabled' : 'Disabled'}${data.verificationEnabled ? `
  - Basic: ${data.checksBasic.toLocaleString()} × $1.80 = ${formatCurrency(data.basicChecksCost)}
  - Standard: ${data.checksStandard.toLocaleString()} × $2.60 = ${formatCurrency(data.standardChecksCost)}
  - Deep: ${data.checksDeep.toLocaleString()} × $3.60 = ${formatCurrency(data.deepChecksCost)}` : ''}
• Ports connected: ${data.portsConnected}
• High-liability industry: ${data.riskLevel === 'low' ? 'Off' : data.riskLevel === 'medium' ? 'Medium' : 'On'}

═══════════════════════════════════════════════════════
TIER & ALLOCATION
═══════════════════════════════════════════════════════
• Tier: ${data.tierLabel}
• Included queries: ${data.includedQueries === -1 ? '∞' : data.includedQueries.toLocaleString()}
• Included Ghost Pass scans: ${data.includedGhostPassScans === -1 ? '∞' : data.includedGhostPassScans.toLocaleString()}
• Included ports: ${data.includedPorts === -1 ? '∞' : data.includedPorts}
• Overage rates:
  - Queries: $0.080/query
  - Ghost Pass scans: $${data.ghostPassRate.toFixed(2)}/scan (above included)
  - Ports: per tier rate

═══════════════════════════════════════════════════════
COMMERCIALS
═══════════════════════════════════════════════════════
• Anchor: ${formatCurrency(data.anchor)}/mo (range ${formatCurrency(data.rangeLow)}–${formatCurrency(data.rangeHigh)})
• Query overage: ${formatCurrency(data.queryOverage)}
• Ghost Pass overage: ${formatCurrency(data.ghostPassOverage)}${data.verificationEnabled ? `
• Verification add-on: ${formatCurrency(data.totalVerificationCost)}` : ''}
• Port overage: ${formatCurrency(data.portOverage)}
• Risk multiplier: ×${data.riskMultiplier.toFixed(2)}
─────────────────────────────────────────────────────
• TOTAL MONTHLY: ${formatCurrency(data.totalMonthly)}/mo

═══════════════════════════════════════════════════════
OPTIONAL COMPETITOR PARITY
═══════════════════════════════════════════════════════
• Competitor baseline (@$0.10/action): ~${formatCurrency(data.agentforceBaseline)}/mo
• QR/event parity: present only if client provides comparable vendor rate
• Estimated savings vs competitor: ~${data.savingsPercent}%

═══════════════════════════════════════════════════════
NOTES
═══════════════════════════════════════════════════════
✓ Full 7-Seat Senate included (model-agnostic seats; best model earns a seat)
✓ Immutable audit trails, approvals, drift/hallucination checks
✓ Ghost Pass is rapid QR validation; identity verification is separate add-on

Click "Create Order Form" to finalize
`.trim();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(proposalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([proposalText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `giant-ventures-proposal-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Proposal — 7-Seat Senate Governance
            <Badge className="bg-primary/20 text-primary">Monthly</Badge>
          </DialogTitle>
          <DialogDescription>
            Review and share this proposal with your client
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Client Inputs */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Client Inputs</h3>
            <div className="grid grid-cols-2 gap-2 text-sm p-3 rounded-lg bg-muted/50">
              <div><span className="text-muted-foreground">Users governed:</span> {data.usersGoverned.toLocaleString()}</div>
              <div><span className="text-muted-foreground">Queries/day:</span> {data.queriesPerDay}</div>
              <div><span className="text-muted-foreground">MSQ:</span> {data.msq.toLocaleString()}</div>
              <div><span className="text-muted-foreground">Ghost Pass scans:</span> {data.ghostPassScans.toLocaleString()}</div>
              <div><span className="text-muted-foreground">Ports:</span> {data.portsConnected}</div>
              <div><span className="text-muted-foreground">Risk level:</span> {data.riskLevel === 'low' ? 'Off' : data.riskLevel}</div>
              <div className="col-span-2"><span className="text-muted-foreground">Verification:</span> {data.verificationEnabled ? 'Enabled' : 'Disabled'}</div>
            </div>
          </div>

          {/* Verification Breakdown */}
          {data.verificationEnabled && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Verification Add-on</h3>
              <div className="text-sm p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 space-y-1">
                <div className="flex justify-between">
                  <span>Basic: {data.checksBasic.toLocaleString()} × $1.80</span>
                  <span className="text-cyan-400">{formatCurrency(data.basicChecksCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard: {data.checksStandard.toLocaleString()} × $2.60</span>
                  <span className="text-cyan-400">{formatCurrency(data.standardChecksCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deep: {data.checksDeep.toLocaleString()} × $3.60</span>
                  <span className="text-cyan-400">{formatCurrency(data.deepChecksCost)}</span>
                </div>
                <div className="flex justify-between border-t border-cyan-500/20 pt-1 mt-1 font-medium">
                  <span>Total Verification:</span>
                  <span className="text-cyan-400">{formatCurrency(data.totalVerificationCost)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tier & Allocation */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Tier & Allocation</h3>
            <div className="text-sm p-3 rounded-lg bg-muted/50 space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tier:</span>
                <Badge variant="outline">{data.tierLabel}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Included queries:</span>
                <span>{data.includedQueries === -1 ? '∞' : data.includedQueries.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Included Ghost Pass scans:</span>
                <span>{data.includedGhostPassScans === -1 ? '∞' : data.includedGhostPassScans.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ghost Pass overage rate:</span>
                <span>${data.ghostPassRate.toFixed(2)}/scan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Included ports:</span>
                <span>{data.includedPorts === -1 ? '∞' : data.includedPorts}</span>
              </div>
            </div>
          </div>

          {/* Commercials */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Commercials</h3>
            <div className="text-sm p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Anchor:</span>
                <span>{formatCurrency(data.anchor)}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Range:</span>
                <span>{formatCurrency(data.rangeLow)} – {formatCurrency(data.rangeHigh)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Query overage:</span>
                <span>+{formatCurrency(data.queryOverage)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ghost Pass overage:</span>
                <span className="text-violet-400">+{formatCurrency(data.ghostPassOverage)}</span>
              </div>
              {data.verificationEnabled && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verification:</span>
                  <span className="text-cyan-400">+{formatCurrency(data.totalVerificationCost)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Port overage:</span>
                <span>+{formatCurrency(data.portOverage)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk multiplier:</span>
                <span>×{data.riskMultiplier.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-primary/20 pt-2 text-lg font-bold">
                <span>Total Monthly:</span>
                <span className="text-primary">{formatCurrency(data.totalMonthly)}/mo</span>
              </div>
            </div>
          </div>

          {/* Competitor Parity */}
          {data.savingsPercent > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Competitor Parity</h3>
              <div className="text-sm p-3 rounded-lg bg-green-500/10 border border-green-500/20 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Competitor baseline (@$0.10/action):</span>
                  <span className="text-red-400">~{formatCurrency(data.agentforceBaseline)}/mo</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Estimated savings:</span>
                  <span className="text-green-400">~{data.savingsPercent}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Notes</h3>
            <ul className="text-sm space-y-1 p-3 rounded-lg bg-muted/50">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                Full 7-Seat Senate included (model-agnostic seats)
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                Immutable audit trails, approvals, drift/hallucination checks
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                Ghost Pass is rapid QR validation; identity verification is separate add-on
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button onClick={handleCopy} variant="outline" className="flex-1">
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </Button>
          <Button onClick={handleDownload} className="flex-1 bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Download Proposal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
