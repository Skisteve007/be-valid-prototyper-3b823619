import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Ghost, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GhostPassSelector from '@/components/payment/GhostPassSelector';
import DirectChargeForm from '@/components/payment/DirectChargeForm';
import PaymentConfirmation from '@/components/payment/PaymentConfirmation';
import PaymentReceipt from '@/components/payment/PaymentReceipt';

type PaymentStep = 'select' | 'ghost_pass' | 'direct_charge' | 'confirm' | 'receipt';

interface PaymentData {
  paymentModel: 'ghost_pass' | 'direct_payment';
  ghostPassTier?: 'bronze' | 'silver' | 'gold';
  directPaymentType?: string;
  amount?: number;
  promoterCode?: string;
}

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

const StaffPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const userId = searchParams.get('userId') || '';
  const venueId = searchParams.get('venueId') || '';
  const memberName = searchParams.get('name') || 'Guest';
  
  const [step, setStep] = useState<PaymentStep>('select');
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);

  const handleSelectGhostPass = () => setStep('ghost_pass');
  const handleSelectDirectCharge = () => setStep('direct_charge');

  const handleGhostPassSelect = (tier: 'bronze' | 'silver' | 'gold', promoterCode?: string) => {
    setPaymentData({
      paymentModel: 'ghost_pass',
      ghostPassTier: tier,
      promoterCode,
    });
    setStep('confirm');
  };

  const handleDirectChargeSubmit = (type: string, amount: number) => {
    setPaymentData({
      paymentModel: 'direct_payment',
      directPaymentType: type,
      amount,
    });
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!paymentData || !userId || !venueId) return;

    setIsProcessing(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('process-valid-payment', {
        body: {
          venueId,
          userId,
          staffUserId: session?.session?.user?.id,
          paymentModel: paymentData.paymentModel,
          ghostPassTier: paymentData.ghostPassTier,
          promoterCode: paymentData.promoterCode,
          directPaymentType: paymentData.directPaymentType,
          amount: paymentData.amount,
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      setTransactionResult(data);
      setStep('receipt');
      toast({
        title: "Payment Successful",
        description: `Transaction ${data.transaction.id.slice(0, 8)} completed`,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Payment failed';
      toast({
        title: "Payment Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewTransaction = () => {
    setStep('select');
    setPaymentData(null);
    setTransactionResult(null);
  };

  if (!userId || !venueId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Missing Information</h2>
            <p className="text-muted-foreground mb-4">
              User ID and Venue ID are required to process payments.
            </p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => step === 'select' ? navigate(-1) : setStep('select')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-bold text-lg">Charge Member</h1>
            <p className="text-sm text-muted-foreground">{memberName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Step: Select Payment Type */}
        {step === 'select' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-3" />
              <h2 className="text-2xl font-bold">Member Verified</h2>
              <p className="text-muted-foreground">Select a charge type</p>
            </div>

            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={handleSelectGhostPass}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Ghost className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">GHOST™ PASS</h3>
                  <p className="text-sm text-muted-foreground">Bronze $10 • Silver $20 • Gold $50</p>
                  <p className="text-xs text-cyan-500 mt-1">30/30/10/30 Split Model</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={handleSelectDirectCharge}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <CreditCard className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">DIRECT CHARGE</h3>
                  <p className="text-sm text-muted-foreground">Cover, Bar Tab, F&B, Bottle Service, etc.</p>
                  <p className="text-xs text-purple-500 mt-1">Venue keeps majority (less 1.5% + gas)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step: Ghost Pass Selection */}
        {step === 'ghost_pass' && (
          <GhostPassSelector 
            onSelect={handleGhostPassSelect}
            onBack={() => setStep('select')}
          />
        )}

        {/* Step: Direct Charge Form */}
        {step === 'direct_charge' && (
          <DirectChargeForm
            onSubmit={handleDirectChargeSubmit}
            onBack={() => setStep('select')}
          />
        )}

        {/* Step: Confirmation */}
        {step === 'confirm' && paymentData && (
          <PaymentConfirmation
            paymentData={paymentData}
            memberName={memberName}
            onConfirm={handleConfirm}
            onBack={() => setStep(paymentData.paymentModel === 'ghost_pass' ? 'ghost_pass' : 'direct_charge')}
            isProcessing={isProcessing}
          />
        )}

        {/* Step: Receipt */}
        {step === 'receipt' && transactionResult && (
          <PaymentReceipt
            result={transactionResult}
            memberName={memberName}
            onNewTransaction={handleNewTransaction}
            onDone={() => navigate(-1)}
          />
        )}
      </div>
    </div>
  );
};

export default StaffPayment;
