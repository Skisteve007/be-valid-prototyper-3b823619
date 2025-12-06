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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  EyeOff, 
  CreditCard, 
  AlertCircle, 
  Clock, 
  DollarSign,
  CheckCircle2,
  Loader2,
  QrCode,
  Shield,
  IdCard,
  Wallet,
  User,
  FileCheck,
  Calendar,
  Plus,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface IncognitoQRDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (qrCodeUrl: string, token: string, expiresAt: string, transactionId: string, spendingLimit: number) => void;
  userId: string;
  venueId?: string;
  promoterId?: string;
}

type Step = 'wallet' | 'pass-select' | 'bundle-select' | 'confirm' | 'processing' | 'success';

interface BundlePreferences {
  includeId: boolean;
  includePayment: boolean;
}

interface PassOption {
  duration_hrs: number;
  price: number;
  label: string;
  description: string;
}

// Default pass options - can be overridden by venue configuration
const DEFAULT_PASS_OPTIONS: PassOption[] = [
  { duration_hrs: 24, price: 10.00, label: "1-Day Access", description: "Perfect for single events or long nights." },
  { duration_hrs: 72, price: 20.00, label: "3-Day Festival Pass", description: "Ideal for weekend festivals or long event runs." },
  { duration_hrs: 168, price: 50.00, label: "One-Week Access", description: "Best for cruise ships, resorts, or week-long stays." },
];

export const IncognitoQRDialog = ({ 
  open, 
  onClose,
  onSuccess,
  userId,
  venueId,
  promoterId 
}: IncognitoQRDialogProps) => {
  const [step, setStep] = useState<Step>('wallet');
  const [incognitoToken, setIncognitoToken] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [profileData, setProfileData] = useState<any>(null);
  
  // Tiered pass selection
  const [availablePasses] = useState<PassOption[]>(DEFAULT_PASS_OPTIONS);
  const [selectedPass, setSelectedPass] = useState<PassOption>(DEFAULT_PASS_OPTIONS[0]);
  
  // PRE-FUNDED WALLET STATES
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [fundingAmount, setFundingAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isRefilling, setIsRefilling] = useState<boolean>(false);
  
  // Bundle preferences - member chooses what to include
  const [bundlePrefs, setBundlePrefs] = useState<BundlePreferences>({
    includeId: false,
    includePayment: true
  });

  // Asset status tracking
  const [hasIdDocument, setHasIdDocument] = useState<boolean>(false);
  const [hasPaymentMethod, setHasPaymentMethod] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setStep('wallet');
      setBundlePrefs({ includeId: false, includePayment: true });
      setSelectedPass(availablePasses[0]);
      loadUserAssets();
      loadWalletBalance();
    }
  }, [open, userId]);

  const loadWalletBalance = async () => {
    try {
      // Check for existing wallet balance from recent active transaction
      const { data: transactions } = await supabase
        .from('incognito_transactions')
        .select('spending_limit, current_spend, payment_status')
        .eq('user_id', userId)
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (transactions && transactions.length > 0) {
        const remainingBalance = (transactions[0].spending_limit || 0) - (transactions[0].current_spend || 0);
        setWalletBalance(Math.max(0, remainingBalance));
      }
    } catch (error) {
      console.error('Error loading wallet balance:', error);
    }
  };

  const loadUserAssets = async () => {
    try {
      // Load profile with image
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, member_id, profile_image_url, status_color')
        .eq('user_id', userId)
        .single();
      
      if (profile) {
        setProfileData(profile);
      }

      // Check for ID documents
      const { data: docs } = await supabase
        .from('certifications')
        .select('id, title')
        .eq('user_id', userId)
        .or('title.ilike.%ID%,title.ilike.%License%,title.ilike.%Passport%,title.ilike.%Driver%');
      
      setHasIdDocument(docs && docs.length > 0);

      // Check for payment methods
      const { data: paymentMethods } = await supabase
        .from('user_payment_methods')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      setHasPaymentMethod(paymentMethods && paymentMethods.length > 0);
    } catch (error) {
      console.error('Error loading user assets:', error);
    }
  };

  const handleRefillWallet = async () => {
    if (!fundingAmount || fundingAmount < 50 || !paymentMethod) {
      toast.error("Please select a valid funding amount (min $50) and payment method.");
      return;
    }

    setIsRefilling(true);

    try {
      // BACKEND ACTION: Process payment and add to wallet
      console.log(`Processing refill: $${fundingAmount} via ${paymentMethod}`);
      
      // Simulate payment processing - in production, this would call payment gateway
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newBalance = walletBalance + fundingAmount;
      setWalletBalance(newBalance);
      toast.success(`Wallet refilled! New balance: $${newBalance.toLocaleString()}`);
      setFundingAmount(500); // Reset
    } catch (error) {
      console.error('Refill error:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsRefilling(false);
    }
  };

  const handleActivatePass = async () => {
    if (walletBalance < selectedPass.price) {
      toast.error(`Insufficient balance. Please refill with at least $${selectedPass.price.toFixed(2)}.`);
      return;
    }

    setStep('processing');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('generate-incognito-token', {
        body: { 
          user_id: userId,
          venue_id: venueId,
          promoter_id: promoterId,
          bundle_preferences: bundlePrefs,
          spending_limit: walletBalance,
          access_duration_hrs: selectedPass.duration_hrs,
          access_price: selectedPass.price
        }
      });

      if (error || !data?.success) {
        console.error('Incognito token error:', error || data?.error);
        toast.error(data?.message || 'Failed to generate Incognito QR');
        setStep('wallet');
        return;
      }

      // Deduct pass cost from wallet balance
      const newBalance = walletBalance - selectedPass.price;
      setWalletBalance(newBalance);

      // Generate QR code URL
      const profileUrl = `${window.location.origin}/view-profile?token=${data.token}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}&color=6B7280`;
      
      setIncognitoToken(data.token);
      setExpiresAt(data.expires_at);
      setQrCodeUrl(qrUrl);
      setStep('success');
      
      // Notify parent component of successful generation
      if (onSuccess) {
        onSuccess(qrUrl, data.token, data.expires_at, data.transaction_id, walletBalance);
      }
      
      toast.success('Incognito Wallet Token activated!');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to activate pass');
      setStep('wallet');
    }
  };

  const formatExpiryTime = () => {
    if (!expiresAt) return '';
    const expiry = new Date(expiresAt);
    return expiry.toLocaleString();
  };

  const getSelectedBundleText = () => {
    const items = [];
    if (bundlePrefs.includeId) items.push('ID Verification');
    if (bundlePrefs.includePayment) items.push('Bar Payment');
    if (items.length === 0) return 'Status Only';
    return items.join(' + ');
  };

  const getDurationLabel = (hrs: number) => {
    if (hrs < 24) return `${hrs} Hours`;
    if (hrs === 24) return '24 Hours';
    if (hrs < 168) return `${Math.round(hrs / 24)} Days`;
    return `${Math.round(hrs / 168)} Week${hrs >= 336 ? 's' : ''}`;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <EyeOff className="h-5 w-5 text-muted-foreground" />
            Incognito Wallet Token Command Center
          </DialogTitle>
          <DialogDescription>
            Pre-fund your token and activate venue access passes
          </DialogDescription>
        </DialogHeader>

        {/* Step: Wallet Management */}
        {step === 'wallet' && (
          <div className="space-y-4">
            {/* Member Photo Preview */}
            {profileData?.profile_image_url && (
              <div className="flex justify-center">
                <Avatar className="h-16 w-16 border-4 border-muted">
                  <AvatarImage src={profileData.profile_image_url} alt={profileData.full_name} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* Wallet Balance Monitor */}
            <Card className="border-blue-500/30 bg-blue-50 dark:bg-blue-950/20">
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">Wallet Token Balance</h4>
                </div>
                
                {/* Current Balance Display */}
                <div className="text-center p-4 bg-background rounded-lg border">
                  <p className="text-3xl font-extrabold text-green-600">
                    ${walletBalance.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Current Balance</p>
                </div>

                {/* Refill Amount Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Refill Amount (Min $50 / Max $10,000)</Label>
                  <Input 
                    type="number" 
                    min={50}
                    max={10000}
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(Math.max(50, Math.min(10000, parseInt(e.target.value) || 50)))}
                    className="bg-background"
                  />
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="-- Choose Method --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CreditCard">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Credit Card
                        </div>
                      </SelectItem>
                      <SelectItem value="PayPal">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          PayPal
                        </div>
                      </SelectItem>
                      <SelectItem value="Zelle">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4" />
                          Zelle/Bank Transfer
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleRefillWallet} 
                  disabled={!paymentMethod || isRefilling}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isRefilling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add ${fundingAmount.toLocaleString()} To Token
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Button 
              onClick={() => setStep('pass-select')} 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={walletBalance < 10}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Select Access Pass
            </Button>

            {walletBalance < 10 && (
              <p className="text-xs text-center text-amber-600">
                Add funds to your wallet to activate access passes
              </p>
            )}
          </div>
        )}

        {/* Step: Pass Selection */}
        {step === 'pass-select' && (
          <div className="space-y-4">
            {/* Wallet Balance Summary */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Wallet Balance</span>
              </div>
              <Badge className="bg-green-500 text-white">${walletBalance.toLocaleString()}</Badge>
            </div>

            {/* Pass Selection Options */}
            <Card className="border-amber-500/30 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200">Select Access Pass (Venue Offers)</h4>
                </div>
                
                {availablePasses.map((pass) => {
                  const canAfford = walletBalance >= pass.price;
                  return (
                    <label 
                      key={pass.duration_hrs} 
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                        selectedPass.duration_hrs === pass.duration_hrs 
                          ? 'border-green-500 bg-green-50 dark:bg-green-950/30' 
                          : canAfford 
                            ? 'border-border hover:border-muted-foreground' 
                            : 'border-border opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="incognitoPass" 
                        checked={selectedPass.duration_hrs === pass.duration_hrs}
                        onChange={() => canAfford && setSelectedPass(pass)}
                        disabled={!canAfford}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{pass.label}</span>
                          <span className={`font-bold ${canAfford ? 'text-green-600' : 'text-muted-foreground'}`}>
                            ${pass.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{pass.description}</p>
                        {!canAfford && (
                          <p className="text-xs text-destructive mt-1">Insufficient balance</p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('wallet')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={() => setStep('bundle-select')} 
                className="flex-1"
                disabled={walletBalance < selectedPass.price}
              >
                Configure Bundle
              </Button>
            </div>
          </div>
        )}

        {/* Step: Bundle Selection */}
        {step === 'bundle-select' && (
          <div className="space-y-4">
            <div className="text-center pb-2">
              <h3 className="font-semibold text-lg">Data Bundle Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Choose what data to include in your Master Token
              </p>
            </div>

            {/* Selected Pass Summary */}
            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-sm">{selectedPass.label}</span>
              </div>
              <Badge className="bg-green-500 text-white">${selectedPass.price.toFixed(2)}</Badge>
            </div>

            {/* Always Included */}
            <Card className="border-green-500/30 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-full">
                    <FileCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-green-800 dark:text-green-200">Health Compliance Status</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Always included (Required)</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>

            {/* Optional: ID Verification */}
            <Card className={`border transition-all ${bundlePrefs.includeId ? 'border-blue-500/50 bg-blue-50 dark:bg-blue-950/20' : 'border-border'}`}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id="includeId"
                    checked={bundlePrefs.includeId}
                    onCheckedChange={(checked) => setBundlePrefs(prev => ({ ...prev, includeId: checked === true }))}
                    disabled={!hasIdDocument}
                  />
                  <div className="p-2 bg-blue-500/20 rounded-full">
                    <IdCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="includeId" className="font-medium cursor-pointer">
                      ID Verification
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {hasIdDocument 
                        ? 'Share DL/Passport for age verification'
                        : 'No ID document uploaded yet'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optional: Bar Payment Authorization */}
            <Card className={`border transition-all ${bundlePrefs.includePayment ? 'border-purple-500/50 bg-purple-50 dark:bg-purple-950/20' : 'border-border'}`}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id="includePayment"
                    checked={bundlePrefs.includePayment}
                    onCheckedChange={(checked) => setBundlePrefs(prev => ({ ...prev, includePayment: checked === true }))}
                  />
                  <div className="p-2 bg-purple-500/20 rounded-full">
                    <Wallet className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="includePayment" className="font-medium cursor-pointer">
                      Bar Payment Authorization
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow bar tab draw-down from wallet balance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Balance for Spending */}
            {bundlePrefs.includePayment && (
              <Card className="border-amber-500/30 bg-amber-50 dark:bg-amber-950/20">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-full">
                      <DollarSign className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Available Spending Balance</p>
                      <p className="text-sm text-muted-foreground">
                        After pass deduction: ${(walletBalance - selectedPass.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary */}
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Your token will include:</p>
              <p className="font-semibold text-sm mt-1">
                {getSelectedBundleText()}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('pass-select')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={() => setStep('confirm')} 
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step: Confirm & Activate */}
        {step === 'confirm' && (
          <div className="space-y-4">
            {/* Photo for visual verification at door */}
            {profileData?.profile_image_url && (
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-muted">
                    <AvatarImage src={profileData.profile_image_url} alt={profileData.full_name} />
                    <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
                  </Avatar>
                  <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-muted-foreground text-white text-xs">
                    Photo Verified
                  </Badge>
                </div>
              </div>
            )}

            <Card className="border-green-500/30 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Wallet Balance</span>
                  <span className="font-bold text-green-600">${walletBalance.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Access Pass</span>
                  <span className="font-medium">{selectedPass.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Deduction</span>
                  <span className="font-bold text-lg text-destructive">-${selectedPass.price.toFixed(2)}</span>
                </div>
                <hr className="border-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Remaining Balance</span>
                  <span className="font-bold text-lg">${(walletBalance - selectedPass.price).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">QR Validity</span>
                  <span className="font-medium">{getDurationLabel(selectedPass.duration_hrs)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bundle</span>
                  <Badge variant="secondary">{getSelectedBundleText()}</Badge>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-center text-muted-foreground">
              By proceeding, ${selectedPass.price.toFixed(2)} will be deducted from your wallet balance.
            </p>

            <Button 
              onClick={handleActivatePass} 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Activate Pass: Deduct ${selectedPass.price.toFixed(2)}
            </Button>
            <Button variant="outline" onClick={() => setStep('bundle-select')} className="w-full">
              Back
            </Button>
          </div>
        )}

        {/* Step: Processing */}
        {step === 'processing' && (
          <div className="py-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
            <div>
              <p className="font-medium">Activating {selectedPass.label}...</p>
              <p className="text-sm text-muted-foreground">
                Generating your Wallet Token
              </p>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Active Token Badge */}
              <Badge className="bg-green-600 text-white">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                TOKEN ACTIVE
              </Badge>

              {/* Pass Type Badge */}
              <Badge className="bg-amber-600 text-white">
                <Calendar className="h-3 w-3 mr-1" />
                {selectedPass.label}
              </Badge>
            </div>

            {/* Wallet Balance Display */}
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-xs text-muted-foreground">Current Wallet Balance</p>
              <p className="text-2xl font-extrabold text-green-600">
                ${walletBalance.toLocaleString()}
              </p>
            </div>

            {/* Photo + Gray QR Code */}
            <div className="flex flex-col items-center gap-4">
              {profileData?.profile_image_url && (
                <Avatar className="h-16 w-16 border-4 border-muted">
                  <AvatarImage src={profileData.profile_image_url} alt={profileData.full_name} />
                  <AvatarFallback><User className="h-8 w-8" /></AvatarFallback>
                </Avatar>
              )}
              
              <div className="p-4 bg-white border-4 border-muted rounded-2xl shadow-lg">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Wallet Token QR"
                    className="w-48 h-48"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-muted">
                    <QrCode className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Access Type</span>
                  <span className="font-medium">{selectedPass.label}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Expires</span>
                  <span className="font-medium">{formatExpiryTime()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Bundle</span>
                  <Badge variant="outline">
                    {getSelectedBundleText()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-700">
                    <Shield className="h-3 w-3 mr-1" />
                    Compliance Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-center text-muted-foreground">
              Present this single QR code for entry, ID verification, and bar payments.
              The venue scanner will process all authorized data streams.
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
