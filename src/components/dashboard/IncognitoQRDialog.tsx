import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  EyeOff, 
  CreditCard, 
  AlertCircle, 
  Clock, 
  DollarSign,
  CheckCircle2,
  Loader2,
  QrCode,
  Shield
} from "lucide-react";
import { toast } from "sonner";

interface IncognitoQRDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (qrCodeUrl: string, token: string, expiresAt: string) => void;
  userId: string;
  venueId?: string;
  promoterId?: string;
}

type Step = 'intro' | 'payment-check' | 'confirm' | 'processing' | 'success';

export const IncognitoQRDialog = ({ 
  open, 
  onClose,
  onSuccess,
  userId,
  venueId,
  promoterId 
}: IncognitoQRDialogProps) => {
  const [step, setStep] = useState<Step>('intro');
  const [hasPaymentMethod, setHasPaymentMethod] = useState<boolean | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [incognitoToken, setIncognitoToken] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (open) {
      setStep('intro');
      checkPaymentMethod();
    }
  }, [open, userId]);

  const checkPaymentMethod = async () => {
    try {
      const { data, error } = await supabase
        .from('user_payment_methods')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single();

      if (error || !data) {
        setHasPaymentMethod(false);
        setPaymentMethod(null);
      } else {
        setHasPaymentMethod(true);
        setPaymentMethod(data);
      }
    } catch (err) {
      setHasPaymentMethod(false);
    }
  };

  const handleProceed = () => {
    if (hasPaymentMethod) {
      setStep('confirm');
    } else {
      setStep('payment-check');
    }
  };

  const handleConfirmPayment = async () => {
    setStep('processing');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('generate-incognito-token', {
        body: { 
          user_id: userId,
          venue_id: venueId,
          promoter_id: promoterId
        }
      });

      if (error || !data?.success) {
        console.error('Incognito token error:', error || data?.error);
        
        if (data?.error === 'NO_PAYMENT_METHOD') {
          setHasPaymentMethod(false);
          setStep('payment-check');
          return;
        }
        
        toast.error(data?.message || 'Failed to generate Incognito QR');
        setStep('intro');
        return;
      }

      // Generate QR code URL
      const profileUrl = `${window.location.origin}/view-profile?token=${data.token}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}&color=6B7280`;
      
      setIncognitoToken(data.token);
      setExpiresAt(data.expires_at);
      setQrCodeUrl(qrUrl);
      setStep('success');
      
      // Notify parent component of successful generation
      if (onSuccess) {
        onSuccess(qrUrl, data.token, data.expires_at);
      }
      
      toast.success('Incognito QR Code generated!');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to process payment');
      setStep('intro');
    }
  };

  const formatExpiryTime = () => {
    if (!expiresAt) return '';
    const expiry = new Date(expiresAt);
    return expiry.toLocaleString();
  };

  const getPaymentMethodDisplay = () => {
    if (!paymentMethod) return 'None';
    switch (paymentMethod.payment_type) {
      case 'paypal':
        return `PayPal (${paymentMethod.payment_identifier})`;
      case 'card':
        return `Card ending in ${paymentMethod.payment_identifier}`;
      case 'zelle':
        return `Zelle (${paymentMethod.payment_identifier})`;
      default:
        return paymentMethod.payment_type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <EyeOff className="h-5 w-5 text-gray-500" />
            Incognito Mode
          </DialogTitle>
          <DialogDescription>
            Generate a private QR code for anonymous venue entry
          </DialogDescription>
        </DialogHeader>

        {/* Step: Intro */}
        {step === 'intro' && (
          <div className="space-y-4">
            <Card className="border-gray-500/30 bg-gray-500/5">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-500/20 rounded-full">
                    <Shield className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Privacy Protected</p>
                    <p className="text-sm text-muted-foreground">
                      Your identity stays private at the door
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-500/20 rounded-full">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">24-Hour Valid</p>
                    <p className="text-sm text-muted-foreground">
                      Token expires automatically after 24 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-500/20 rounded-full">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">$5.00 Fee</p>
                    <p className="text-sm text-muted-foreground">
                      Charged to your payment method on file
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleProceed} 
              className="w-full bg-gray-600 hover:bg-gray-700"
            >
              <EyeOff className="h-4 w-4 mr-2" />
              Continue to Incognito
            </Button>
          </div>
        )}

        {/* Step: No Payment Method */}
        {step === 'payment-check' && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="mx-auto w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg">Payment Method Required</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Add a payment method to use Incognito mode
              </p>
            </div>

            <Card className="border-amber-500/30 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Incognito mode requires a payment method on file. 
                    The $5 fee will be automatically charged when you generate the QR code.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => {
                // Navigate to payment settings - could be a dedicated page
                toast.info('Payment method setup coming soon');
                onClose();
              }}
              className="w-full"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              Cancel
            </Button>
          </div>
        )}

        {/* Step: Confirm Payment */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <Card className="border-green-500/30 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <Badge variant="outline" className="bg-green-500/10 border-green-500/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {getPaymentMethodDisplay()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-bold text-lg">$5.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">QR Validity</span>
                  <span className="font-medium">24 Hours</span>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-center text-muted-foreground">
              By proceeding, you authorize the $5.00 charge to your payment method.
            </p>

            <Button 
              onClick={handleConfirmPayment} 
              className="w-full bg-gray-600 hover:bg-gray-700"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Pay $5.00 & Generate QR
            </Button>
            <Button variant="outline" onClick={() => setStep('intro')} className="w-full">
              Back
            </Button>
          </div>
        )}

        {/* Step: Processing */}
        {step === 'processing' && (
          <div className="py-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-500" />
            <div>
              <p className="font-medium">Processing Payment...</p>
              <p className="text-sm text-muted-foreground">
                Generating your Incognito QR code
              </p>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="space-y-4">
            <div className="text-center">
              <Badge className="bg-gray-600 text-white mb-4">
                <EyeOff className="h-3 w-3 mr-1" />
                INCOGNITO MODE ACTIVE
              </Badge>
            </div>

            {/* Gray QR Code */}
            <div className="flex justify-center">
              <div className="p-4 bg-white border-4 border-gray-500 rounded-2xl shadow-[0_0_20px_6px_rgba(107,114,128,0.3)]">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Incognito QR Code"
                    className="w-48 h-48 grayscale"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-gray-100">
                    <QrCode className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <Card className="bg-gray-100 dark:bg-gray-800/50">
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Expires</span>
                  <span className="font-medium">{formatExpiryTime()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="bg-gray-500/20 border-gray-500/30">
                    Privacy Protected
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-center text-muted-foreground">
              Present this QR code at the venue for anonymous entry.
              The venue will verify your compliance status without seeing your identity.
            </p>

            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
