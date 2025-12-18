import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Wallet, CreditCard, Building2, Apple, 
  Loader2, ArrowRight, Check, AlertCircle 
} from "lucide-react";
import { 
  PRESET_AMOUNTS, 
  WALLET_LIMITS, 
  getConvenienceFee, 
  isValidAmount 
} from "@/config/walletConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FundWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallet: { daily_funded_amount: number; monthly_funded_amount: number } | null;
  onSuccess: () => void;
}

type Step = "amount" | "method" | "confirm";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit/Debit Card", icon: CreditCard },
  { id: "bank", label: "Bank Account", icon: Building2, disabled: true },
  { id: "apple", label: "Apple Pay", icon: Apple, disabled: true },
];

export function FundWalletDialog({ 
  open, 
  onOpenChange, 
  wallet,
  onSuccess 
}: FundWalletDialogProps) {
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  const convenienceFee = getConvenienceFee(amount);
  const totalCharge = amount + convenienceFee;

  // Calculate remaining limits
  const dailyRemaining = WALLET_LIMITS.DAILY_LIMIT - (wallet?.daily_funded_amount || 0);
  const monthlyRemaining = WALLET_LIMITS.MONTHLY_LIMIT - (wallet?.monthly_funded_amount || 0);
  const maxAllowed = Math.min(dailyRemaining, monthlyRemaining, WALLET_LIMITS.MAX_DEPOSIT);

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setAmount(num);
    }
  };

  const handleProceedToPayment = async () => {
    if (!isValidAmount(amount)) {
      toast.error(`Amount must be between $${WALLET_LIMITS.MIN_DEPOSIT} and $${WALLET_LIMITS.MAX_DEPOSIT}`);
      return;
    }

    if (amount > maxAllowed) {
      toast.error(`You can only add up to $${maxAllowed.toFixed(2)} based on your limits`);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-wallet-checkout', {
        body: { amount, paymentMethod }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success("Redirecting to payment...");
        onOpenChange(false);
        resetForm();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create checkout");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep("amount");
    setAmount(50);
    setCustomAmount("");
    setPaymentMethod("card");
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  const amountValid = isValidAmount(amount) && amount <= maxAllowed;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Add Funds to Wallet
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 py-2">
          {["amount", "method", "confirm"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step === s ? "bg-primary text-primary-foreground" : 
                    ["amount", "method", "confirm"].indexOf(step) > i 
                      ? "bg-green-500 text-white" 
                      : "bg-muted text-muted-foreground"}`}
              >
                {["amount", "method", "confirm"].indexOf(step) > i ? (
                  <Check className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 2 && <div className="w-8 h-0.5 bg-muted" />}
            </div>
          ))}
        </div>

        {/* Step: Amount Selection */}
        {step === "amount" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <Button
                  key={preset}
                  variant={amount === preset && !customAmount ? "default" : "outline"}
                  onClick={() => handleAmountSelect(preset)}
                  disabled={preset > maxAllowed}
                >
                  ${preset}
                </Button>
              ))}
            </div>

            <div>
              <Label>Custom Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  min={WALLET_LIMITS.MIN_DEPOSIT}
                  max={Math.min(WALLET_LIMITS.MAX_DEPOSIT, maxAllowed)}
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="Enter amount"
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Min ${WALLET_LIMITS.MIN_DEPOSIT} • Max ${Math.min(WALLET_LIMITS.MAX_DEPOSIT, maxAllowed).toLocaleString()}
              </p>
            </div>

            {/* Fee Preview */}
            {amountValid && (
              <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Amount to credit:</span>
                  <span className="font-medium">${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Convenience fee:</span>
                  <span>+${convenienceFee.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total charge:</span>
                  <span>${totalCharge.toFixed(2)}</span>
                </div>
              </div>
            )}

            {!amountValid && amount > 0 && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                {amount > maxAllowed 
                  ? `Exceeds your available limit ($${maxAllowed.toFixed(2)})`
                  : `Amount must be between $${WALLET_LIMITS.MIN_DEPOSIT} and $${WALLET_LIMITS.MAX_DEPOSIT}`
                }
              </div>
            )}

            <Button 
              className="w-full" 
              onClick={() => setStep("method")}
              disabled={!amountValid}
            >
              Continue <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step: Payment Method */}
        {step === "method" && (
          <div className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer
                      ${paymentMethod === method.id ? "border-primary bg-primary/5" : "border-border"}
                      ${method.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !method.disabled && setPaymentMethod(method.id)}
                  >
                    <RadioGroupItem 
                      value={method.id} 
                      id={method.id} 
                      disabled={method.disabled}
                    />
                    <Icon className="h-5 w-5" />
                    <Label 
                      htmlFor={method.id} 
                      className="flex-1 cursor-pointer"
                    >
                      {method.label}
                    </Label>
                    {method.disabled && (
                      <Badge variant="secondary" className="text-xs">Soon</Badge>
                    )}
                  </div>
                );
              })}
            </RadioGroup>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("amount")} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep("confirm")} className="flex-1">
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Confirmation */}
        {step === "confirm" && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">Confirm Your Purchase</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wallet Credit:</span>
                  <span className="font-medium text-green-600">+${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Convenience Fee:</span>
                  <span>${convenienceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="capitalize">{paymentMethod}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${totalCharge.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              By clicking "Pay Now", you agree to our terms and authorize this charge.
            </p>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("method")} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleProceedToPayment} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Pay ${totalCharge.toFixed(2)}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
