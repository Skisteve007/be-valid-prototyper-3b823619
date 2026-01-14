import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText, Shield } from "lucide-react";
import { useState } from "react";
import { BADGE_CONFIG, getBadgeDisplayName } from "@/config/badgeConfig";

interface OrderFormData {
  tierLabel: string;
  includedQueries: number;
  includedGhostPassScans: number;
  ghostPassRate: number;
  includedPorts: number;
  portOverageRate: number;
  verificationEnabled: boolean;
  anchor: number;
  queryOverage: number;
  ghostPassOverage: number;
  verificationCost: number;
  portOverage: number;
  riskMultiplier: number;
  totalMonthly: number;
}

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: OrderFormData;
}

export function OrderFormDialog({ open, onOpenChange, data }: OrderFormDialogProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${Math.round(amount).toLocaleString()}`;
  };

  const orderFormText = `
ORDER FORM — GIANT VENTURES LLC 7-SEAT SENATE (MONTHLY)
Generated: ${new Date().toLocaleDateString()}

═══════════════════════════════════════════════════════
CUSTOMER
═══════════════════════════════════════════════════════
Legal name: ${customerName || '__________________________'}
Address: ${customerAddress || '_____________________________'}
Primary contact (name/email): ${customerContact || '__________________________'}

═══════════════════════════════════════════════════════
SERVICES
═══════════════════════════════════════════════════════
Tier: ${data.tierLabel}
Included per month:
  • Queries: ${data.includedQueries === -1 ? '∞' : data.includedQueries.toLocaleString()}
  • Ghost Pass scans: ${data.includedGhostPassScans === -1 ? '∞' : data.includedGhostPassScans.toLocaleString()}
  • Ports: ${data.includedPorts === -1 ? '∞' : data.includedPorts}

Overage rates:
  • Query overage: $0.080 per query (above included)
  • Ghost Pass scan overage: $${data.ghostPassRate.toFixed(2)}/scan (above included)
  • Ports overage: $${data.portOverageRate} per port (above included)

Badge rights: Included — ${getBadgeDisplayName()} display authorization (subject to ${BADGE_CONFIG.issuer} badge guidelines and active, compliant use).

Verification add-on (optional; per-check pricing if enabled):
  • Basic: $1.80/check • Standard: $2.60/check • Deep: $3.60/check

═══════════════════════════════════════════════════════
COMMERCIALS
═══════════════════════════════════════════════════════
Monthly anchor: ${formatCurrency(data.anchor)}
Estimated overages (non-binding):
  • Queries: ${formatCurrency(data.queryOverage)}
  • Ghost Pass scans: ${formatCurrency(data.ghostPassOverage)}
  • Verification: ${formatCurrency(data.verificationCost)}
  • Ports: ${formatCurrency(data.portOverage)}
Risk multiplier: ×${data.riskMultiplier.toFixed(2)}
─────────────────────────────────────────────────────
TOTAL MONTHLY ESTIMATE: ${formatCurrency(data.totalMonthly)}
Billing: Monthly in arrears for overages. Invoices due Net 30.

═══════════════════════════════════════════════════════
TERM & START
═══════════════════════════════════════════════════════
Start date: ${startDate}
Term: Month-to-month (cancel anytime; renews monthly)

═══════════════════════════════════════════════════════
ORDER DOCUMENTS
═══════════════════════════════════════════════════════
This Order Form incorporates the Giant Ventures LLC MSA.
In case of conflict, the Order Form prevails for commercial terms.

═══════════════════════════════════════════════════════
SIGNATURES
═══════════════════════════════════════════════════════

Customer signature: ____________________  Date: ________
Name / Title: __________________________


Giant Ventures LLC signature: ____________________  Date: ________
Name / Title: __________________________


Reference: MSA available at https://bevalid.app/legal/msa
`.trim();

  const handleDownload = () => {
    const blob = new Blob([orderFormText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `giant-ventures-order-form-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Order Form — 7-Seat Senate
            <Badge className="bg-primary/20 text-primary">Monthly</Badge>
          </DialogTitle>
          <DialogDescription>
            Complete customer details and download the order form
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Customer</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="customer-name" className="text-sm">Legal Name</Label>
                <Input 
                  id="customer-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer legal name..."
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customer-address" className="text-sm">Address</Label>
                <Input 
                  id="customer-address"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Enter customer address..."
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customer-contact" className="text-sm">Primary Contact (Name/Email)</Label>
                <Input 
                  id="customer-contact"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  placeholder="e.g., John Doe / john@company.com"
                  className="bg-muted/50"
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Services</h3>
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
                <span className="text-muted-foreground">Included ports:</span>
                <span>{data.includedPorts === -1 ? '∞' : data.includedPorts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Query overage:</span>
                <span>$0.080 per query</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ghost Pass overage:</span>
                <span>${data.ghostPassRate.toFixed(2)}/scan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ports overage:</span>
                <span>${data.portOverageRate}/port</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground p-2 bg-cyan-500/5 border border-cyan-500/20 rounded">
              <span className="font-medium text-cyan-400">Verification add-on</span> (optional): Basic $1.80 • Standard $2.60 • Deep $3.60 per check
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-primary/5 border border-primary/20 rounded mt-2">
              <Shield className="h-4 w-4 text-primary shrink-0" />
              <span><span className="font-medium text-primary">{getBadgeDisplayName()}</span> — display authorization included (subject to badge guidelines)</span>
            </div>
          </div>

          {/* Commercials */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Commercials</h3>
            <div className="text-sm p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly anchor:</span>
                <span className="font-medium">{formatCurrency(data.anchor)}</span>
              </div>
              <div className="text-xs text-muted-foreground">Estimated overages (non-binding):</div>
              <div className="flex justify-between pl-4">
                <span className="text-muted-foreground">Queries:</span>
                <span>{formatCurrency(data.queryOverage)}</span>
              </div>
              <div className="flex justify-between pl-4">
                <span className="text-muted-foreground">Ghost Pass scans:</span>
                <span className="text-violet-400">{formatCurrency(data.ghostPassOverage)}</span>
              </div>
              {data.verificationEnabled && (
                <div className="flex justify-between pl-4">
                  <span className="text-muted-foreground">Verification:</span>
                  <span className="text-cyan-400">{formatCurrency(data.verificationCost)}</span>
                </div>
              )}
              <div className="flex justify-between pl-4">
                <span className="text-muted-foreground">Ports:</span>
                <span>{formatCurrency(data.portOverage)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk multiplier:</span>
                <span>×{data.riskMultiplier.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-primary/20 pt-2 font-bold">
                <span>Total Monthly Estimate:</span>
                <span className="text-primary">{formatCurrency(data.totalMonthly)}</span>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                Billing: Monthly in arrears for overages. Invoices due Net 30.
              </p>
            </div>
          </div>

          {/* Term & Start */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Term & Start</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="start-date" className="text-sm">Start Date</Label>
                <Input 
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Term</Label>
                <div className="text-sm p-2 rounded bg-muted/50 border border-border">
                  Month-to-month
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Cancel anytime; renews monthly. This Order Form incorporates the Giant Ventures LLC MSA.
            </p>
          </div>

          {/* Signatures Preview */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Signatures</h3>
            <div className="text-sm p-4 rounded-lg bg-muted/30 border border-dashed border-muted-foreground/30 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-muted-foreground mb-1">Customer signature:</p>
                  <div className="border-b border-muted-foreground/50 w-48 h-6"></div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Date:</p>
                  <div className="border-b border-muted-foreground/50 w-24 h-6"></div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-muted-foreground mb-1">Giant Ventures LLC signature:</p>
                  <div className="border-b border-muted-foreground/50 w-48 h-6"></div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Date:</p>
                  <div className="border-b border-muted-foreground/50 w-24 h-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDownload} className="flex-1 bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Download Order Form
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
