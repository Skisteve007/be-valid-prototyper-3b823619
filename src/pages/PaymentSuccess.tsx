import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock, Fingerprint, CheckCircle2 } from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";
import { processReferralOnPayment } from "@/hooks/useReferralTracking";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'processing' | 'password' | 'biometric' | 'complete'>('processing');
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    processPayment();
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    // Check if WebAuthn is supported
    if (window.PublicKeyCredential) {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      setBiometricSupported(available);
    }
  };

  const processPayment = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Authentication required");
        navigate("/auth");
        return;
      }

      // Get payment details from URL params
      const paymentAmount = searchParams.get('amount') || '29';
      const paymentType = searchParams.get('type') || 'Single Member';

      // Process affiliate referral if exists
      const numericAmount = parseFloat(paymentAmount);
      if (!isNaN(numericAmount)) {
        const referralProcessed = await processReferralOnPayment(user.id, numericAmount);
        if (referralProcessed) {
          console.log("Referral commission recorded");
        }
      }

      // Call edge function to process payment success
      const { data, error } = await supabase.functions.invoke('process-payment-success', {
        body: {
          userId: user.id,
          paymentAmount,
          paymentType
        }
      });

      if (error) {
        console.error('Payment processing error:', error);
        toast.error("Failed to process payment. Please contact support.");
        return;
      }

      console.log('Payment processed successfully:', data);
      toast.success("Payment confirmed! Let's secure your account.");
      setStep('password');
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast.error("An error occurred. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success("Password set successfully!");
      
      // Move to biometric setup if supported, otherwise complete
      if (biometricSupported) {
        setStep('biometric');
      } else {
        setStep('complete');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to set password");
    } finally {
      setProcessing(false);
    }
  };

  const handleBiometricSetup = async () => {
    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Create WebAuthn credential
      const publicKeyOptions: PublicKeyCredentialCreationOptions = {
        challenge: new Uint8Array(32),
        rp: {
          name: "Clean Check",
          id: window.location.hostname
        },
        user: {
          id: new TextEncoder().encode(user.id),
          name: user.email || 'user',
          displayName: user.email || 'Clean Check User'
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },
          { alg: -257, type: "public-key" }
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "none"
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions
      });

      if (credential) {
        toast.success("Biometric login enabled!");
        setStep('complete');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (error: any) {
      console.error("Biometric setup error:", error);
      toast.error("Could not enable biometric login. You can set this up later.");
      setStep('complete');
      setTimeout(() => navigate('/dashboard'), 2000);
    } finally {
      setProcessing(false);
    }
  };

  const skipBiometric = () => {
    setStep('complete');
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <img src={logo} alt="Clean Check" className="h-24 w-auto mx-auto mb-4 animate-pulse" />
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 via-pink-500/60 to-blue-500/60 blur-3xl rounded-full scale-150"></div>
            <img src={logo} alt="Clean Check" className="relative h-20 w-auto mx-auto" />
          </div>
        </div>

        {step === 'password' && (
          <Card className="shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Lock className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <CardTitle className="text-center">
                <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Secure Your Account
                </span>
              </CardTitle>
              <CardDescription className="text-center">
                Set a permanent password for your Clean Check account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSetup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground">At least 8 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    minLength={8}
                  />
                </div>
                <Button type="submit" disabled={processing} className="w-full">
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    "Set Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'biometric' && (
          <Card className="shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Fingerprint className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-center">
                <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Enable Fast Login
                </span>
              </CardTitle>
              <CardDescription className="text-center">
                Use FaceID or Fingerprint for quick and secure access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-6">
                With biometric login enabled, you can access your account with just one touch, bypassing the password screen.
              </div>
              <Button 
                onClick={handleBiometricSetup} 
                disabled={processing} 
                className="w-full"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Fingerprint className="mr-2 h-4 w-4" />
                    Enable Biometric Login
                  </>
                )}
              </Button>
              <Button 
                onClick={skipBiometric} 
                variant="outline" 
                className="w-full"
              >
                Skip for Now
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'complete' && (
          <Card className="shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-center">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  All Set!
                </span>
              </CardTitle>
              <CardDescription className="text-center">
                Your account is ready. Redirecting to your dashboard...
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
