import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, DollarSign, Percent, Zap } from "lucide-react";

const GAS_FEE_TIERS = [
  { label: "Under 1,000 scans/month", min: 0.25, max: 0.50, midpoint: 0.375 },
  { label: "1,000–10,000 scans/month", min: 0.15, max: 0.25, midpoint: 0.20 },
  { label: "10,000–100,000 scans/month", min: 0.10, max: 0.15, midpoint: 0.125 },
  { label: "100,000+ scans/month", min: 0.05, max: 0.10, midpoint: 0.075 },
];

const GHOST_PASS_TIERS = [
  { name: "Bronze", amount: 10 },
  { name: "Silver", amount: 20 },
  { name: "Gold", amount: 50 },
];

export function PaymentCalculator() {
  const [directAmount, setDirectAmount] = useState<number>(100);
  const [gasTier, setGasTier] = useState<number>(0);
  const [ghostTier, setGhostTier] = useState<number>(0);

  const gasFee = GAS_FEE_TIERS[gasTier].midpoint;
  const transactionFeeRate = 0.015;

  // Direct Payment Calculations
  const directTransactionFee = directAmount * transactionFeeRate;
  const directVenueNet = directAmount - directTransactionFee - gasFee;
  const directValidNet = directTransactionFee + gasFee;

  // Ghost Pass Calculations
  const ghostAmount = GHOST_PASS_TIERS[ghostTier].amount;
  const ghostVenueShare = ghostAmount * 0.30;
  const ghostPromoterShare = ghostAmount * 0.30;
  const ghostPoolShare = ghostAmount * 0.10;
  const ghostValidShare = ghostAmount * 0.30;
  const ghostTransactionFee = ghostVenueShare * transactionFeeRate;
  const ghostVenueNet = ghostVenueShare - ghostTransactionFee - gasFee;
  const ghostValidNet = ghostValidShare + ghostTransactionFee + gasFee;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Interactive Payment Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="direct" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direct">Direct Payment</TabsTrigger>
            <TabsTrigger value="ghost">GHOST™ Pass</TabsTrigger>
          </TabsList>

          <div className="mt-4 mb-4">
            <Label>Your Monthly Scan Volume (Gas Fee Tier)</Label>
            <Select value={gasTier.toString()} onValueChange={(v) => setGasTier(parseInt(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GAS_FEE_TIERS.map((tier, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {tier.label} (${tier.midpoint.toFixed(3)}/scan)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="direct" className="space-y-4">
            <div>
              <Label>Payment Amount ($)</Label>
              <Input
                type="number"
                min="1"
                value={directAmount}
                onChange={(e) => setDirectAmount(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Breakdown
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Gross Amount:</span>
                <span className="font-medium">${directAmount.toFixed(2)}</span>
                
                <span className="text-muted-foreground flex items-center gap-1">
                  <Percent className="h-3 w-3" /> Transaction Fee (1.5%):
                </span>
                <span className="text-destructive">-${directTransactionFee.toFixed(2)}</span>
                
                <span className="text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Gas Fee:
                </span>
                <span className="text-destructive">-${gasFee.toFixed(2)}</span>
                
                <div className="col-span-2 border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-green-600">Venue Net:</span>
                    <span className="font-bold text-green-600">${directVenueNet.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-xs mt-1">
                    <span>VALID™ Receives:</span>
                    <span>${directValidNet.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ghost" className="space-y-4">
            <div>
              <Label>GHOST™ Pass Tier</Label>
              <Select value={ghostTier.toString()} onValueChange={(v) => setGhostTier(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GHOST_PASS_TIERS.map((tier, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {tier.name} (${tier.amount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">30/30/10/30 Split Breakdown</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Pass Amount:</span>
                <span className="font-medium">${ghostAmount.toFixed(2)}</span>
                
                <span className="text-muted-foreground">Venue Share (30%):</span>
                <span>${ghostVenueShare.toFixed(2)}</span>
                
                <span className="text-muted-foreground">Promoter Share (30%):</span>
                <span>${ghostPromoterShare.toFixed(2)}</span>
                
                <span className="text-muted-foreground">Community Pool (10%):</span>
                <span>${ghostPoolShare.toFixed(2)}</span>
                
                <span className="text-muted-foreground">VALID™ Share (30%):</span>
                <span>${ghostValidShare.toFixed(2)}</span>
              </div>

              <div className="border-t pt-3 mt-3">
                <h5 className="font-medium text-sm mb-2">Fees Deducted from Venue Share:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Transaction Fee (1.5%):</span>
                  <span className="text-destructive">-${ghostTransactionFee.toFixed(2)}</span>
                  
                  <span className="text-muted-foreground">Gas Fee:</span>
                  <span className="text-destructive">-${gasFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-green-600">Venue Net:</span>
                  <span className="font-bold text-green-600">${ghostVenueNet.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-xs mt-1">
                  <span>Promoter Receives:</span>
                  <span>${ghostPromoterShare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>Community Pool:</span>
                  <span>${ghostPoolShare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>VALID™ Total:</span>
                  <span>${ghostValidNet.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
