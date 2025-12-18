import React from 'react';
import { ArrowLeft, Ghost, CreditCard, Loader2, Fuel, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PaymentData {
  paymentModel: 'ghost_pass' | 'direct_payment';
  ghostPassTier?: 'bronze' | 'silver' | 'gold';
  directPaymentType?: string;
  amount?: number;
  promoterCode?: string;
}

interface PaymentConfirmationProps {
  paymentData: PaymentData;
  memberName: string;
  onConfirm: () => void;
  onBack: () => void;
  isProcessing: boolean;
}

const GHOST_PASS_PRICES = {
  bronze: 10,
  silver: 20,
  gold: 50,
};

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

// Estimated fees (actual calculated server-side)
const TRANSACTION_FEE_RATE = 0.015;
const ESTIMATED_GAS_FEE = 0.25; // Mid-tier estimate

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  paymentData,
  memberName,
  onConfirm,
  onBack,
  isProcessing,
}) => {
  const isGhostPass = paymentData.paymentModel === 'ghost_pass';
  
  const grossAmount = isGhostPass 
    ? GHOST_PASS_PRICES[paymentData.ghostPassTier!]
    : paymentData.amount || 0;

  // Calculate estimated splits and fees
  let venueShare: number;
  let promoterShare: number;
  let poolShare: number;
  let validShare: number;
  let transactionFee: number;
  let gasFee: number;
  let venueNet: number;

  if (isGhostPass) {
    venueShare = grossAmount * 0.30;
    promoterShare = paymentData.promoterCode ? grossAmount * 0.30 : 0;
    poolShare = grossAmount * 0.10;
    validShare = grossAmount * 0.30 + (paymentData.promoterCode ? 0 : grossAmount * 0.30);
    transactionFee = venueShare * TRANSACTION_FEE_RATE;
    gasFee = ESTIMATED_GAS_FEE;
    venueNet = venueShare - transactionFee - gasFee;
  } else {
    venueShare = grossAmount;
    promoterShare = 0;
    poolShare = 0;
    validShare = 0;
    transactionFee = grossAmount * TRANSACTION_FEE_RATE;
    gasFee = ESTIMATED_GAS_FEE;
    venueNet = grossAmount - transactionFee - gasFee;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} disabled={isProcessing}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">Confirm Payment</h2>
          <p className="text-sm text-muted-foreground">Review details before charging</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              isGhostPass 
                ? 'bg-gradient-to-br from-cyan-500 to-blue-600' 
                : 'bg-gradient-to-br from-purple-500 to-pink-600'
            }`}>
              {isGhostPass ? <Ghost className="h-6 w-6 text-white" /> : <CreditCard className="h-6 w-6 text-white" />}
            </div>
            <div>
              <CardTitle className="text-lg">
                {isGhostPass 
                  ? `GHOST™ PASS ${paymentData.ghostPassTier?.toUpperCase()}`
                  : DIRECT_TYPE_LABELS[paymentData.directPaymentType || 'other']
                }
              </CardTitle>
              <p className="text-sm text-muted-foreground">for {memberName}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center text-lg">
            <span>Gross Amount</span>
            <span className="font-bold">${grossAmount.toFixed(2)}</span>
          </div>

          <Separator />

          {isGhostPass && (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Split Breakdown (30/30/10/30)</p>
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <span>Venue Share (30%)</span>
                    <span className="text-emerald-500">${venueShare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Promoter Share (30%)</span>
                    <span className={promoterShare > 0 ? 'text-blue-500' : 'text-muted-foreground'}>
                      {promoterShare > 0 ? `$${promoterShare.toFixed(2)}` : 'No Code'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Pool (10%)</span>
                    <span className="text-purple-500">${poolShare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VALID™ Share (30%{!paymentData.promoterCode && ' +30%'})</span>
                    <span className="text-cyan-500">${validShare.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Fuel className="h-4 w-4" /> Fees (Deducted from Venue)
            </p>
            <div className="grid gap-1 text-sm">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Percent className="h-3 w-3" /> Transaction Fee (1.5%)
                </span>
                <span className="text-red-400">-${transactionFee.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Fuel className="h-3 w-3" /> Gas Fee (Per Scan)
                </span>
                <span className="text-red-400">-${gasFee.toFixed(4)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              * Gas fee is tiered by monthly scan volume. Shown fee is an estimate.
            </p>
          </div>

          <Separator />

          <div className="flex justify-between items-center text-lg font-bold">
            <span>Venue Net</span>
            <span className="text-emerald-500">${venueNet.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {paymentData.promoterCode && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
          <p className="text-sm">
            <span className="font-medium text-blue-500">Promoter Code:</span> {paymentData.promoterCode}
          </p>
        </div>
      )}

      <Button 
        className="w-full" 
        size="lg"
        onClick={onConfirm}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Confirm & Charge ${grossAmount.toFixed(2)}
          </>
        )}
      </Button>
    </div>
  );
};

export default PaymentConfirmation;
