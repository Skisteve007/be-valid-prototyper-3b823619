import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";
import { CONVENIENCE_FEE_TIERS, WALLET_LIMITS } from "@/config/walletConfig";

interface FeeScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeeScheduleModal({ open, onOpenChange }: FeeScheduleModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Fee Schedule & Limits
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* Convenience Fee Table */}
            <div>
              <h3 className="font-semibold mb-2">Convenience Fees</h3>
              <p className="text-sm text-muted-foreground mb-3">
                A small fee is applied to cover instant processing costs.
              </p>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left py-2 px-3">Amount Range</th>
                      <th className="text-right py-2 px-3">Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONVENIENCE_FEE_TIERS.map((tier, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-2 px-3">
                          ${tier.min} – ${tier.max}
                        </td>
                        <td className="text-right py-2 px-3 font-medium">
                          ${tier.fee.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Limits */}
            <div>
              <h3 className="font-semibold mb-2">Funding Limits</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span>Minimum Deposit</span>
                  <span className="font-medium">${WALLET_LIMITS.MIN_DEPOSIT}</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span>Maximum Deposit</span>
                  <span className="font-medium">${WALLET_LIMITS.MAX_DEPOSIT.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span>Daily Limit</span>
                  <span className="font-medium">${WALLET_LIMITS.DAILY_LIMIT.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span>Monthly Limit</span>
                  <span className="font-medium">${WALLET_LIMITS.MONTHLY_LIMIT.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Funds are credited instantly after successful payment</p>
              <p>• All transactions are secured via Stripe</p>
              <p>• Fees support instant processing and fraud protection</p>
            </div>
          </div>
        </ScrollArea>

        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
