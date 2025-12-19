import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, DollarSign, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

// Fee calculation matching backend
const FEE_TIERS = [
  { min: 0, max: 50, feePercent: 3 },
  { min: 50, max: 100, feePercent: 2.5 },
  { min: 100, max: 250, feePercent: 2 },
  { min: 250, max: 500, feePercent: 1.5 },
  { min: 500, max: Infinity, feePercent: 1 },
];

const getConvenienceFee = (amount: number): number => {
  const tier = FEE_TIERS.find(t => amount >= t.min && amount < t.max);
  const feePercent = tier?.feePercent || 3;
  return amount * (feePercent / 100);
};

interface PaymentFormProps {
  clientSecret: string;
  amountCents: number;
  convenienceFeeCents: number;
  totalChargeCents: number;
  onSuccess: () => void;
  onCancel: () => void;
}

function PaymentForm({ 
  clientSecret, 
  amountCents, 
  convenienceFeeCents, 
  totalChargeCents,
  onSuccess, 
  onCancel 
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
    } else if (paymentIntent?.status === "succeeded") {
      setPaymentComplete(true);
      toast.success("Wallet topped up successfully!");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setIsProcessing(false);
    }
  };

  if (paymentComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        <p className="text-lg font-medium text-foreground">Payment Successful!</p>
        <p className="text-sm text-muted-foreground">
          ${(amountCents / 100).toFixed(2)} has been added to your wallet
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Top-up amount</span>
          <span className="font-medium">${(amountCents / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Convenience fee</span>
          <span className="font-medium">${(convenienceFeeCents / 100).toFixed(2)}</span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between">
          <span className="font-medium">Total</span>
          <span className="font-bold text-primary">${(totalChargeCents / 100).toFixed(2)}</span>
        </div>
      </div>

      <PaymentElement />

      <div className="flex gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay ${(totalChargeCents / 100).toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

interface StripeTopUpFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function StripeTopUpForm({ onSuccess, onCancel }: StripeTopUpFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<{
    amountCents: number;
    convenienceFeeCents: number;
    totalChargeCents: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numericAmount = parseFloat(amount) || 0;
  const convenienceFee = getConvenienceFee(numericAmount);
  const totalCharge = numericAmount + convenienceFee;

  const presetAmounts = [25, 50, 100, 250];

  const handleCreatePaymentIntent = async () => {
    if (numericAmount < 5) {
      setError("Minimum top-up amount is $5.00");
      return;
    }
    if (numericAmount > 5000) {
      setError("Maximum top-up amount is $5,000.00");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "create-topup-payment-intent",
        {
          body: {
            amountCents: Math.round(numericAmount * 100),
            currency: "usd",
          },
        }
      );

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setClientSecret(data.clientSecret);
      setPaymentDetails({
        amountCents: data.amountCents,
        convenienceFeeCents: data.convenienceFeeCents,
        totalChargeCents: data.totalChargeCents,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create payment";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setClientSecret(null);
    setPaymentDetails(null);
    setAmount("");
    setError(null);
  };

  if (clientSecret && paymentDetails) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#22c55e",
                },
              },
            }}
          >
            <PaymentForm
              clientSecret={clientSecret}
              amountCents={paymentDetails.amountCents}
              convenienceFeeCents={paymentDetails.convenienceFeeCents}
              totalChargeCents={paymentDetails.totalChargeCents}
              onSuccess={onSuccess}
              onCancel={handleReset}
            />
          </Elements>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Top Up Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select Amount</Label>
          <div className="grid grid-cols-4 gap-2">
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant={numericAmount === preset ? "default" : "outline"}
                onClick={() => setAmount(preset.toString())}
                className="w-full"
              >
                ${preset}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-amount">Or Enter Custom Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="custom-amount"
              type="number"
              min="5"
              max="5000"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-9"
            />
          </div>
          <p className="text-xs text-muted-foreground">Min: $5.00 • Max: $5,000.00</p>
        </div>

        {numericAmount >= 5 && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Top-up amount</span>
              <span className="font-medium">${numericAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Convenience fee ({FEE_TIERS.find(t => numericAmount >= t.min && numericAmount < t.max)?.feePercent || 3}%)
              </span>
              <span className="font-medium">${convenienceFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-medium">You pay</span>
              <span className="font-bold text-primary">${totalCharge.toFixed(2)}</span>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreatePaymentIntent}
            disabled={numericAmount < 5 || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Continue to Payment"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
