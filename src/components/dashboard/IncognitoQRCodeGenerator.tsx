// --- Incognito Master Access Generator (FINAL PRE-FUNDED WALLET TOKEN) ---

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface PassOption {
  duration_hrs: number;
  price: number;
  label: string;
  description: string;
}

interface UserData {
  userId: string;
}

interface BundleChoice {
  includeDl: boolean;
  includePassport: boolean;
  includePayment: boolean;
}

interface IncognitoQRCodeGeneratorProps {
  userData: UserData;
  currentVenueId?: string;
  currentPromoterId?: string;
  availablePasses?: PassOption[];
}

// CRITICAL: Pass pricing - $10 for 1-day (40/40/20 split)
const DEFAULT_PASS_OPTIONS: PassOption[] = [
  { duration_hrs: 24, price: 10.00, label: "1-Day Access", description: "24-hour venue access." },
  { duration_hrs: 72, price: 20.00, label: "3-Day Festival Pass", description: "Weekend event coverage." },
  { duration_hrs: 168, price: 50.00, label: "One-Week Access", description: "Cruise or resort stay access." },
];

const IncognitoQRCodeGenerator: React.FC<IncognitoQRCodeGeneratorProps> = ({
  userData,
  currentVenueId,
  currentPromoterId,
  availablePasses = DEFAULT_PASS_OPTIONS
}) => {

  // States for Pass Selection
  const [selectedPass, setSelectedPass] = useState<PassOption>(availablePasses[0]);
  const [bundleChoice, setBundleChoice] = useState<BundleChoice>({ includeDl: false, includePassport: false, includePayment: true });
  const [isIncognitoActive, setIsIncognitoActive] = useState(false);

  // --- PRE-FUNDED WALLET STATES ---
  const [fundingAmount, setFundingAmount] = useState(100);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current wallet balance on mount
  useEffect(() => {
    const fetchBalance = async () => {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('balance_after')
        .eq('user_id', userData.userId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (data && data.length > 0) {
        setCurrentBalance(Number(data[0].balance_after));
      }
    };
    fetchBalance();
  }, [userData.userId]);

  // --- STRIPE WALLET REFILL ---
  const handleRefillToken = async () => {
    if (!fundingAmount || fundingAmount < 50) {
      toast.error("Please enter a valid funding amount (min $50).");
      return;
    }

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in to refill your wallet.");
        return;
      }

      const { data, error } = await supabase.functions.invoke('refill-wallet', {
        body: { amount: fundingAmount, payment_method: 'stripe' },
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
        toast.success("Redirecting to Stripe checkout...");
      }
    } catch (error: any) {
      console.error('Refill error:', error);
      toast.error(error.message || "Failed to initiate payment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateIncognito = () => {
    if (currentBalance < selectedPass.price) {
      alert(`Error: Insufficient balance. Please refill token with at least $${selectedPass.price.toFixed(2)}.`);
      return;
    }

    const expirationTime = new Date(Date.now() + selectedPass.duration_hrs * 60 * 60 * 1000).toISOString();

    // CRITICAL BACKEND ACTION: Deduct pass cost from balance and process split
    // This initiates the 40/40/20 revenue split for the pass price ($10, $20, or $50)
    // CALL: processPassPurchaseAndSplit(userId, selectedPass.price, currentVenueId, currentPromoterId, selectedPass.duration_hrs);

    setCurrentBalance(prevBalance => prevBalance - selectedPass.price); // Deduct pass cost
    setIsIncognitoActive(true);
  };

  const generateIncognitoPayload = () => {
    const expirationTime = new Date(Date.now() + selectedPass.duration_hrs * 60 * 60 * 1000).toISOString();

    return JSON.stringify({
      access_type: "INCOGNITO_WALLET",
      user_id: userData.userId,
      token_balance: currentBalance, // CRITICAL: Current spending value
      promoter_id: currentPromoterId,
      access_duration_hrs: selectedPass.duration_hrs,
      token_expires_at: expirationTime,
    });
  };

  // --- UI RENDERING ---

  return (
    <div className="p-6 bg-card rounded-lg shadow-2xl">
      <h3 className="text-2xl font-bold text-foreground mb-4 font-orbitron">Incognito Wallet Token Command Center</h3>

      {/* 1. PRE-FUNDED WALLET MONITOR */}
      <div className="space-y-3 mb-6 p-4 border border-blue-500 rounded-lg bg-muted">
        <h4 className="text-lg font-semibold text-blue-400 mb-3">💰 Wallet Token Balance</h4>
        <div className="text-center p-3 mb-3 bg-background rounded">
          <p className="text-xl font-extrabold text-green-400">
            Current Balance: <span className="font-bold">${currentBalance.toLocaleString()}</span>
          </p>
        </div>

        <label className="block text-foreground font-medium mb-1 pt-2">Refill Amount (Min $50 / Max $10,000)</label>
        <input
          type="number"
          min="50"
          max="10000"
          value={fundingAmount}
          onChange={(e) => setFundingAmount(Math.max(50, Math.min(10000, parseInt(e.target.value) || 50)))}
          className="w-full p-2 bg-background border border-border rounded text-foreground"
        />


        <Button onClick={handleRefillToken} disabled={isLoading} className="w-full mt-3">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Add $${fundingAmount.toLocaleString()} via Stripe`
          )}
        </Button>
      </div>


      {/* 2. PASS SELECTION OPTIONS */}
      <div className="space-y-3 mb-6 p-4 border border-amber-600 rounded-lg bg-muted">
        <h4 className="text-lg font-semibold text-amber-500 mb-2">Select Access Pass (Venue Offers):</h4>
        {availablePasses.map(pass => (
          <label key={pass.duration_hrs} className="flex items-center text-muted-foreground">
            <input
              type="radio"
              name="incognitoPass"
              checked={selectedPass.duration_hrs === pass.duration_hrs}
              onChange={() => setSelectedPass(pass)}
              className="mr-3"
            />
            <span className="font-bold text-green-400">${pass.price.toFixed(2)}</span>
            <span className="ml-2"> for {pass.label}</span>
          </label>
        ))}
      </div>

      {/* 3. DATA SHARING BUNDLE */}
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Select Data Bundle:</h4>
        <label className="flex items-center text-muted-foreground">
          <input
            type="checkbox"
            checked={bundleChoice.includeDl}
            onChange={(e) => setBundleChoice(prev => ({ ...prev, includeDl: e.target.checked }))}
            className="mr-2"
          />
          Include Driver's License
        </label>
        <label className="flex items-center text-muted-foreground">
          <input
            type="checkbox"
            checked={bundleChoice.includePassport}
            onChange={(e) => setBundleChoice(prev => ({ ...prev, includePassport: e.target.checked }))}
            className="mr-2"
          />
          Include Passport
        </label>
        <label className="flex items-center text-muted-foreground">
          <input
            type="checkbox"
            checked={bundleChoice.includePayment}
            onChange={(e) => setBundleChoice(prev => ({ ...prev, includePayment: e.target.checked }))}
            className="mr-2"
          />
          Include Payment Method
        </label>
      </div>


      {/* 4. ACTIVATION & QR DISPLAY */}
      <div className="text-center mt-6">
        {!isIncognitoActive ? (
          <Button
            onClick={handleActivateIncognito}
            disabled={currentBalance < selectedPass.price}
            className="bg-orange-500 hover:bg-orange-600 text-foreground font-bold px-8 py-4 text-lg shadow-2xl"
          >
            Activate Pass: Deduct ${selectedPass ? selectedPass.price.toFixed(2) : '---'}
          </Button>
        ) : (
          <>
            {/* Active Token Display */}
            <h4 className="text-md text-green-400 mb-2">TOKEN ACTIVE: {selectedPass.label}</h4>
            <p className="text-sm text-amber-500 mb-3">Current Wallet Balance: <span className="font-bold">${currentBalance.toLocaleString()}</span></p>

            {/* QR Code and Photo Display */}
            <div className="flex justify-center">
              <QRCodeSVG value={generateIncognitoPayload()} size={256} fgColor="#808080" level="H" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IncognitoQRCodeGenerator;
