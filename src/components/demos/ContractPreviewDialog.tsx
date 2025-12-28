import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ArrowRight, Mail, Check } from "lucide-react";
import { AGREEMENT_TIERS, TierConfig } from "@/config/agreementTiers";

interface ContractPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceedToSign: () => void;
}

const ContractPreviewDialog = ({ open, onOpenChange, onProceedToSign }: ContractPreviewDialogProps) => {
  const [selectedTierId, setSelectedTierId] = useState<string>("enterprise");

  const selectedTier = AGREEMENT_TIERS.find((t) => t.id === selectedTierId) || AGREEMENT_TIERS[1];

  const handleRequestChanges = () => {
    const subject = encodeURIComponent(`Redline Request: ${selectedTier.name} Agreement`);
    const body = encodeURIComponent(
      `Hello Valid Technologies Team,\n\nI am reviewing the ${selectedTier.name} agreement (${selectedTier.price}) and would like to discuss potential modifications to the following terms:\n\n[Please describe the specific clauses or terms you would like to discuss]\n\nBest regards`
    );
    window.open(`mailto:legal@validtechnologies.com?subject=${subject}&body=${body}`, "_blank");
  };

  const handleProceedToSign = () => {
    onOpenChange(false);
    onProceedToSign();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Contract Review — Redline Request
          </DialogTitle>
          <DialogDescription>
            Review the full agreement terms before signing or request modifications.
          </DialogDescription>
        </DialogHeader>

        {/* Tier Selector */}
        <div className="flex items-center gap-3 py-2">
          <span className="text-sm font-medium text-muted-foreground">Agreement Tier:</span>
          <Select value={selectedTierId} onValueChange={setSelectedTierId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AGREEMENT_TIERS.map((tier) => (
                <SelectItem key={tier.id} value={tier.id}>
                  {tier.name} — {tier.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Contract Content */}
        <ScrollArea className="flex-1 border rounded-lg bg-muted/30 p-4">
          <div className="space-y-6 text-sm">
            {/* Header */}
            <div className="text-center border-b border-border pb-4">
              <h3 className="text-lg font-bold text-foreground">SYNTH {selectedTier.name} DEPLOYMENT AGREEMENT</h3>
              <p className="text-muted-foreground text-xs mt-1">{selectedTier.subtitle}</p>
            </div>

            {/* Key Terms Summary */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-background rounded-lg border border-border">
              <div>
                <span className="text-muted-foreground text-xs">Total Value</span>
                <p className="font-semibold text-foreground">{selectedTier.price}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Timeline</span>
                <p className="font-semibold text-foreground">{selectedTier.timeline}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Term</span>
                <p className="font-semibold text-foreground">{selectedTier.term}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Outcome</span>
                <p className="font-semibold text-foreground text-xs">{selectedTier.outcome}</p>
              </div>
            </div>

            {/* Section 1: Parties */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">1. PARTIES</h4>
              <p className="text-muted-foreground">
                This Agreement is entered into by and between <strong>Valid Technologies LLC</strong> ("Valid", "Provider") 
                and the Client organization ("Client", "Customer") as identified in the executed signature block.
              </p>
            </div>

            {/* Section 2: Scope of Services */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">2. SCOPE OF SERVICES</h4>
              <p className="text-muted-foreground mb-2">Provider agrees to deliver the following services under this agreement:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {selectedTier.includes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3: Payment Schedule */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">3. PAYMENT SCHEDULE</h4>
              <p className="text-muted-foreground mb-2">Client agrees to the following payment milestones:</p>
              <div className="space-y-2">
                {selectedTier.paymentSchedule.map((payment, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-background rounded border border-border">
                    <span className="text-muted-foreground">
                      Day {payment.day}: {payment.label}
                    </span>
                    <span className="font-semibold text-foreground">
                      ${payment.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Deployment Roadmap */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">4. DEPLOYMENT ROADMAP</h4>
              <div className="space-y-2">
                {selectedTier.roadmap.map((phase, idx) => (
                  <div key={idx} className="flex gap-3 p-2 bg-background rounded border border-border">
                    <span className="text-primary font-medium shrink-0">Days {phase.days}:</span>
                    <span className="text-muted-foreground">{phase.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Client Requirements */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">5. CLIENT REQUIREMENTS</h4>
              <p className="text-muted-foreground mb-2">Client shall provide the following for successful deployment:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {selectedTier.clientRequirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Section 6: Confidentiality */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">6. CONFIDENTIALITY</h4>
              <p className="text-muted-foreground">
                Both parties agree to maintain strict confidentiality of all proprietary information, trade secrets, 
                and business processes disclosed during the engagement. This obligation survives termination of this Agreement 
                for a period of three (3) years.
              </p>
            </div>

            {/* Section 7: Limitation of Liability */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">7. LIMITATION OF LIABILITY</h4>
              <p className="text-muted-foreground">
                Provider's total liability under this Agreement shall not exceed the total fees paid by Client. 
                Neither party shall be liable for indirect, incidental, special, consequential, or punitive damages, 
                regardless of the cause of action or the nature of the claim.
              </p>
            </div>

            {/* Section 8: Termination */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">8. TERMINATION</h4>
              <p className="text-muted-foreground">
                Either party may terminate this Agreement upon thirty (30) days written notice for convenience, 
                or immediately upon material breach by the other party that remains uncured for fifteen (15) days 
                after written notice. Upon termination, Client shall pay for all services rendered through the termination date.
              </p>
            </div>

            {/* Section 9: Governing Law */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">9. GOVERNING LAW</h4>
              <p className="text-muted-foreground">
                This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, 
                without regard to its conflict of laws principles. Any disputes shall be resolved through binding arbitration 
                in Wilmington, Delaware.
              </p>
            </div>

            {/* Section 10: Entire Agreement */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">10. ENTIRE AGREEMENT</h4>
              <p className="text-muted-foreground">
                This Agreement constitutes the entire understanding between the parties and supersedes all prior 
                negotiations, representations, or agreements relating to the subject matter hereof. This Agreement 
                may only be amended in writing signed by both parties.
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleRequestChanges}>
              <Mail className="h-4 w-4 mr-2" />
              Request Changes
            </Button>
            <Button onClick={handleProceedToSign} className="bg-emerald-600 hover:bg-emerald-700">
              Proceed to Sign
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractPreviewDialog;
