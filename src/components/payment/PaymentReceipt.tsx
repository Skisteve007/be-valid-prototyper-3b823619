import React from 'react';
import { CheckCircle2, Ghost, CreditCard, Fuel, Percent, Copy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface TransactionResult {
  transaction: {
    id: string;
    gross_amount: number;
    gas_fee_applied: number;
    transaction_fee_applied: number;
    venue_net: number;
    valid_net: number;
    payment_model: string;
    ghost_pass_tier?: string;
    direct_payment_type?: string;
    created_at: string;
  };
  breakdown: {
    grossAmount: number;
    gasFee: number;
    transactionFee: number;
    venueNet: number;
    validNet: number;
    venueShare?: number;
    promoterShare?: number;
    poolShare?: number;
    validShare?: number;
  };
}

interface PaymentReceiptProps {
  result: TransactionResult;
  memberName: string;
  onNewTransaction: () => void;
  onDone: () => void;
}

const DIRECT_TYPE_LABELS: Record<string, string> = {
  cover: 'Cover Charge',
  bar_tab: 'Bar Tab',
  food_beverage: 'Food & Beverage',
  bottle_service: 'Bottle Service',
  merch: 'Merchandise',
  event_ticket: 'Event Ticket',
  vip_upgrade: 'VIP Upgrade',
  other: 'Other',
};

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  result,
  memberName,
  onNewTransaction,
  onDone,
}) => {
  const { toast } = useToast();
  const { transaction, breakdown } = result;
  const isGhostPass = transaction.payment_model === 'ghost_pass';

  const copyTransactionId = () => {
    navigator.clipboard.writeText(transaction.id);
    toast({
      title: "Copied",
      description: "Transaction ID copied to clipboard",
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center py-6">
        <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-emerald-500">Payment Complete!</h2>
        <p className="text-muted-foreground">Transaction processed successfully</p>
      </div>

      {/* Receipt Card */}
      <Card>
        <CardHeader className="pb-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                isGhostPass 
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-600'
              }`}>
                {isGhostPass ? <Ghost className="h-5 w-5 text-white" /> : <CreditCard className="h-5 w-5 text-white" />}
              </div>
              <div>
                <CardTitle className="text-base">
                  {isGhostPass 
                    ? `GHOST™ PASS ${transaction.ghost_pass_tier?.toUpperCase()}`
                    : DIRECT_TYPE_LABELS[transaction.direct_payment_type || 'other']
                  }
                </CardTitle>
                <p className="text-xs text-muted-foreground">{memberName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${breakdown.grossAmount.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Gross</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {/* Transaction ID */}
          <div className="flex items-center justify-between bg-muted/50 rounded-lg p-2">
            <div>
              <p className="text-xs text-muted-foreground">Transaction ID</p>
              <p className="font-mono text-sm">{transaction.id.slice(0, 12)}...</p>
            </div>
            <Button variant="ghost" size="icon" onClick={copyTransactionId}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          {/* Split Details (Ghost Pass only) */}
          {isGhostPass && breakdown.venueShare !== undefined && (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Split Breakdown</p>
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <span>Venue Share</span>
                    <span className="text-emerald-500">${breakdown.venueShare.toFixed(2)}</span>
                  </div>
                  {breakdown.promoterShare !== undefined && breakdown.promoterShare > 0 && (
                    <div className="flex justify-between">
                      <span>Promoter Share</span>
                      <span className="text-blue-500">${breakdown.promoterShare.toFixed(2)}</span>
                    </div>
                  )}
                  {breakdown.poolShare !== undefined && (
                    <div className="flex justify-between">
                      <span>Community Pool</span>
                      <span className="text-purple-500">${breakdown.poolShare.toFixed(2)}</span>
                    </div>
                  )}
                  {breakdown.validShare !== undefined && (
                    <div className="flex justify-between">
                      <span>VALID™ Share</span>
                      <span className="text-cyan-500">${breakdown.validShare.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Fees */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Fuel className="h-4 w-4" /> Fees Applied
            </p>
            <div className="grid gap-1 text-sm">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Percent className="h-3 w-3" /> Transaction Fee (1.5%)
                </span>
                <span className="text-red-400">-${breakdown.transactionFee.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Fuel className="h-3 w-3" /> Gas Fee
                </span>
                <span className="text-red-400">-${breakdown.gasFee.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Net Amounts */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Venue Net</span>
              <span className="text-emerald-500">${breakdown.venueNet.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>VALID™ Net</span>
              <span>${breakdown.validNet.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* Timestamp */}
          <div className="text-center text-xs text-muted-foreground">
            {formatDate(transaction.created_at)}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={onNewTransaction}>
          <Plus className="mr-2 h-4 w-4" />
          New Charge
        </Button>
        <Button onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  );
};

export default PaymentReceipt;
