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
  Calendar
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

type Step = 'intro' | 'bundle-select' | 'payment-check' | 'confirm' | 'processing' | 'success';

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
  const [step, setStep] = useState<Step>('intro');
  const [hasPaymentMethod, setHasPaymentMethod] = useState<boolean | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [incognitoToken, setIncognitoToken] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [profileData, setProfileData] = useState<any>(null);
  const [spendingLimit, setSpendingLimit] = useState<string>('500');
  
  // Tiered pass selection
  const [availablePasses] = useState<PassOption[]>(DEFAULT_PASS_OPTIONS);
  const [selectedPass, setSelectedPass] = useState<PassOption>(DEFAULT_PASS_OPTIONS[0]);
  
  // Spending limit options
  const spendingLimitOptions = [
    { value: '50', label: '$50' },
    { value: '100', label: '$100' },
    { value: '150', label: '$150' },
    { value: '255', label: '$255' },
    { value: '500', label: '$500' },
    { value: '750', label: '$750' },
    { value: '1000', label: '$1,000' },
    { value: '1200', label: '$1,200' },
    { value: '5000', label: '$5,000' },
    { value: '10000', label: '$10,000' },
  ];
  
  // Bundle preferences - member chooses what to include
  const [bundlePrefs, setBundlePrefs] = useState<BundlePreferences>({
    includeId: false,
    includePayment: false
  });

  // Asset status tracking
  const [hasIdDocument, setHasIdDocument] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setStep('intro');
      setBundlePrefs({ includeId: false, includePayment: false });
      setSelectedPass(availablePasses[0]);
      checkPaymentMethod();
      loadUserAssets();
    }
  }, [open, userId]);

  const checkPaymentMethod = async () => {
    try {
      const { data, error } = await supabase
        .from('user_payment_methods')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .maybeSingle();

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

      // Check for ID documents (certifications with 'ID' or 'License' or 'Passport' in title)
      const { data: docs } = await supabase
        .from('certifications')
        .select('id, title')
        .eq('user_id', userId)
        .or('title.ilike.%ID%,title.ilike.%License%,title.ilike.%Passport%,title.ilike.%Driver%');
      
      setHasIdDocument(docs && docs.length > 0);
    } catch (error) {
      console.error('Error loading user assets:', error);
    }
  };

  const handleProceedToBundle = () => {
    setStep('bundle-select');
  };

  const handleProceedFromBundle = () => {
    if (hasPaymentMethod) {
      setStep('confirm');
    } else {
      setStep('payment-check');
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedPass) {
      toast.error("Please select an access pass.");
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
          spending_limit: parseInt(spendingLimit),
          access_duration_hrs: selectedPass.duration_hrs,
          access_price: selectedPass.price
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
        onSuccess(qrUrl, data.token, data.expires_at, data.transaction_id, parseInt(spendingLimit));
      }
      
      toast.success('Incognito Master Token generated!');
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <EyeOff className="h-5 w-5 text-gray-500" />
            Incognito Master Token
          </DialogTitle>
          <DialogDescription>
            Generate a unified access token for venue entry
          </DialogDescription>
        </DialogHeader>

        {/* Step: Intro - Pass Selection */}
        {step === 'intro' && (
          <div className="space-y-4">
            {/* Member Photo Preview */}
            {profileData?.profile_image_url && (
              <div className="flex justify-center">
                <Avatar className="h-20 w-20 border-4 border-gray-400">
                  <AvatarImage src={profileData.profile_image_url} alt={profileData.full_name} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* Pass Selection Options */}
            <Card className="border-amber-500/30 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200">Select Access Pass</h4>
                </div>
                
                {availablePasses.map((pass) => (
                  <label 
                    key={pass.duration_hrs} 
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                      selectedPass.duration_hrs === pass.duration_hrs 
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/30' 
                        : 'border-border hover:border-gray-400'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="incognitoPass" 
                      checked={selectedPass.duration_hrs === pass.duration_hrs}
                      onChange={() => setSelectedPass(pass)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{pass.label}</span>
                        <span className="font-bold text-green-600">${pass.price.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{pass.description}</p>
                    </div>
                  </label>
                ))}
              </CardContent>
            </Card>

            {/* Features Overview */}
            <Card className="border-gray-500/30 bg-gray-500/5">
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-500/20 rounded-full">
                    <Shield className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Master Access Token</p>
                    <p className="text-xs text-muted-foreground">
                      One QR for entry, payment, and tracking
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-500/20 rounded-full">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{getDurationLabel(selectedPass.duration_hrs)} Valid</p>
                    <p className="text-xs text-muted-foreground">
                      No viewing timer - full utility period
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleProceedToBundle} 
              className="w-full bg-gray-600 hover:bg-gray-700"
            >
              <EyeOff className="h-4 w-4 mr-2" />
              Configure Access Bundle
            </Button>
          </div>
        )}

        {/* Step: Bundle Selection */}
        {step === 'bundle-select' && (
          <div className="space-y-4">
            <div className="text-center pb-2">
              <h3 className="font-semibold text-lg">Access Bundle Preferences</h3>
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
                    disabled={!hasPaymentMethod}
                  />
                  <div className="p-2 bg-purple-500/20 rounded-full">
                    <Wallet className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="includePayment" className="font-medium cursor-pointer">
                      Bar Payment Authorization
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {hasPaymentMethod 
                        ? 'Allow bar tab draw-down from payment method'
                        : 'Add payment method first'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spending Limit Selector - Only shows when payment is included */}
            {bundlePrefs.includePayment && hasPaymentMethod && (
              <Card className="border-amber-500/30 bg-amber-50 dark:bg-amber-950/20">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-full">
                      <DollarSign className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="spendingLimit" className="font-medium">
                        Spending Limit
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Set your max bar tab for this session
                      </p>
                    </div>
                    <Select value={spendingLimit} onValueChange={setSpendingLimit}>
                      <SelectTrigger className="w-28 h-9 border-amber-500/30">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {spendingLimitOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary */}
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Your token will include:</p>
              <p className="font-semibold text-sm mt-1">
                {getSelectedBundleText()}
                {bundlePrefs.includePayment && ` (Limit: $${parseInt(spendingLimit).toLocaleString()})`}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('intro')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleProceedFromBundle} 
                className="flex-1 bg-gray-600 hover:bg-gray-700"
              >
                Continue
              </Button>
            </div>
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
                    The ${selectedPass.price.toFixed(2)} fee will be automatically charged when you generate the QR code.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => {
                toast.info('Navigate to Profile → Payment Methods to add one');
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
            {/* Photo for visual verification at door */}
            {profileData?.profile_image_url && (
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-gray-500">
                    <AvatarImage src={profileData.profile_image_url} alt={profileData.full_name} />
                    <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
                  </Avatar>
                  <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-xs">
                    Photo Verified
                  </Badge>
                </div>
              </div>
            )}

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
                  <span className="text-sm text-muted-foreground">Access Pass</span>
                  <span className="font-medium">{selectedPass.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-bold text-lg">${selectedPass.price.toFixed(2)}</span>
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
              By proceeding, you authorize the ${selectedPass.price.toFixed(2)} charge and data sharing per your bundle selection.
            </p>

            <Button 
              onClick={handleConfirmPayment} 
              className="w-full bg-gray-600 hover:bg-gray-700"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Pay ${selectedPass.price.toFixed(2)} & Generate Token
            </Button>
            <Button variant="outline" onClick={() => setStep('bundle-select')} className="w-full">
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
                Generating your {selectedPass.label}
              </p>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Spending Limit Dropdown - Top Left */}
              {bundlePrefs.includePayment && (
                <Select value={spendingLimit} onValueChange={setSpendingLimit}>
                  <SelectTrigger className="w-[140px] h-8 text-xs bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20">
                    <DollarSign className="h-3 w-3 mr-1 text-purple-600" />
                    <SelectValue placeholder="Spending Limit" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    {spendingLimitOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Badge - Right side */}
              <div className="flex gap-2 ml-auto">
                <Badge className="bg-amber-600 text-white">
                  <Calendar className="h-3 w-3 mr-1" />
                  {selectedPass.label}
                </Badge>
                <Badge className="bg-gray-600 text-white">
                  <EyeOff className="h-3 w-3 mr-1" />
                  ACTIVE
                </Badge>
              </div>
            </div>

            {/* Photo + Gray QR Code */}
            <div className="flex flex-col items-center gap-4">
              {profileData?.profile_image_url && (
                <Avatar className="h-16 w-16 border-4 border-gray-500">
                  <AvatarImage src={profileData.profile_image_url} alt={profileData.full_name} />
                  <AvatarFallback><User className="h-8 w-8" /></AvatarFallback>
                </Avatar>
              )}
              
              <div className="p-4 bg-white border-4 border-gray-500 rounded-2xl shadow-[0_0_20px_6px_rgba(107,114,128,0.3)]">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Master Access Token QR"
                    className="w-48 h-48"
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
                  <span className="text-muted-foreground">Access Type</span>
                  <span className="font-medium">{selectedPass.label}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Expires</span>
                  <span className="font-medium">{formatExpiryTime()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Bundle</span>
                  <Badge variant="outline" className="bg-gray-500/20 border-gray-500/30">
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
