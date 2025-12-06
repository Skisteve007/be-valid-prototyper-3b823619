// *****************************************************************************
// FILE: IncognitoQRCodeGenerator.tsx
// PURPOSE: The "Money Engine" - Tiered Access, Pre-Funded Wallet, and Dynamic QR
// *****************************************************************************

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';

// --- 1. TIERED PRICING CONFIGURATION (The Menu) ---
interface PassOption {
  id: string;
  duration_hrs: number;
  price: number;
  label: string;
  description: string;
}

const VENUE_PASS_OPTIONS: PassOption[] = [
  { 
    id: '1_day', 
    duration_hrs: 24, 
    price: 10.00, 
    label: "1-Day Access", 
    description: "Perfect for single events. Expires in 24h." 
  }, 
  { 
    id: '3_day', 
    duration_hrs: 72, 
    price: 20.00, 
    label: "3-Day Festival Pass", 
    description: "Ideal for weekends. Expires in 72h." 
  }, 
  { 
    id: '7_day', 
    duration_hrs: 168, 
    price: 50.00, 
    label: "One-Week Access", 
    description: "Best for cruises & resorts. Expires in 7 days." 
  }, 
];

interface IncognitoQRCodeGeneratorProps {
  userData: { userId: string };
  currentVenueId?: string;
}

const IncognitoQRCodeGenerator: React.FC<IncognitoQRCodeGeneratorProps> = ({ userData, currentVenueId }) => {
    
  // --- STATE MANAGEMENT ---
  const [selectedPass, setSelectedPass] = useState<PassOption>(VENUE_PASS_OPTIONS[0]);
  
  // Wallet States
  const [walletBalance, setWalletBalance] = useState<number>(0.00);
  const [refillAmount, setRefillAmount] = useState<number>(100);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  
  // Activation States
  const [isIncognitoActive, setIsIncognitoActive] = useState<boolean>(false);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);

  // --- 2. WALLET LOGIC (Refilling Funds) ---
  const handleRefillWallet = () => {
    if (refillAmount < 50) {
      alert("Minimum refill amount is $50.00");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method (Card, PayPal, or Zelle).");
      return;
    }

    // SIMULATION: In production, this hits the Payment Gateway API
    const newBalance = walletBalance + refillAmount;
    setWalletBalance(newBalance);
    alert(`SUCCESS: Added $${refillAmount} via ${paymentMethod}. New Balance: $${newBalance.toFixed(2)}`);
    setRefillAmount(100);
  };

  // --- 3. ACTIVATION LOGIC (Purchasing Access) ---
  const handleActivatePass = () => {
    if (walletBalance < selectedPass.price) {
      alert(`INSUFFICIENT FUNDS: You need $${selectedPass.price} for this pass. Please refill your wallet.`);
      return;
    }

    // Deduct cost
    setWalletBalance(prev => prev - selectedPass.price);
    
    // Set Expiration
    const newExpiration = new Date(Date.now() + selectedPass.duration_hrs * 60 * 60 * 1000);
    setExpirationDate(newExpiration);
    
    setIsIncognitoActive(true);
  };

  // --- 4. QR PAYLOAD GENERATOR (The Data Scanner Reads) ---
  const generateQRPayload = (): string => {
    if (!isIncognitoActive || !expirationDate) return "";

    const payload = {
      type: "INCOGNITO_ACCESS_TOKEN",
      uid: userData?.userId || "USER_123",
      venue_id: currentVenueId || "GLOBAL",
      status: "ACTIVE",
      tier: selectedPass.label,
      expires_at: expirationDate.toISOString(),
      current_wallet_balance: walletBalance.toFixed(2),
      id_verified: true,
      third_party_auth: "ONFIDO_VERIFIED_TOKEN_XYZ"
    };
    return JSON.stringify(payload);
  };

  // --- RENDER ---
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-card border border-border rounded-xl shadow-2xl text-foreground">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-border pb-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 font-orbitron">
          INCOGNITO COMMAND CENTER
        </h2>
        <p className="text-muted-foreground mt-2">
          Manage your funds, choose your duration, and generate your secure access token.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: WALLET & SELECTION */}
        <div className="space-y-6">
          
          {/* A. SPENDING MONITOR / WALLET */}
          <div className="bg-muted p-5 rounded-lg border border-blue-500/30 shadow-inner">
            <h3 className="text-xl font-bold text-blue-400 mb-2">💰 Spending Wallet</h3>
            <div className="text-4xl font-mono font-bold text-foreground mb-4">
              ${walletBalance.toFixed(2)}
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground uppercase">Refill Amount ($)</label>
                <input 
                  type="number" 
                  value={refillAmount}
                  onChange={(e) => setRefillAmount(Number(e.target.value) || 0)}
                  className="w-full bg-background border border-border rounded p-2 text-foreground"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase">Payment Method</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-background border border-border rounded p-2 text-foreground"
                >
                  <option value="">-- Select Method --</option>
                  <option value="Credit Card">Credit Card (Instant)</option>
                  <option value="Apple Pay">Apple Pay</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Zelle">Zelle / Crypto</option>
                </select>
              </div>
              <Button 
                onClick={handleRefillWallet}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold"
              >
                LOAD FUNDS
              </Button>
            </div>
          </div>

          {/* B. PASS SELECTION */}
          <div className="bg-muted p-5 rounded-lg border border-amber-500/30">
            <h3 className="text-xl font-bold text-amber-500 mb-4">⏱️ Select Access Duration</h3>
            <div className="space-y-3">
              {VENUE_PASS_OPTIONS.map((option) => (
                <div 
                  key={option.id}
                  onClick={() => setSelectedPass(option)}
                  className={`p-3 rounded cursor-pointer border-2 transition-all flex justify-between items-center ${
                    selectedPass.id === option.id 
                      ? 'border-green-400 bg-muted-foreground/10' 
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div>
                    <div className="font-bold text-foreground">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                  <div className="text-green-400 font-bold text-xl">
                    ${option.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVATION & QR */}
        <div className="flex flex-col items-center justify-center bg-background/40 rounded-lg p-6 border border-border">
          
          {!isIncognitoActive ? (
            <div className="text-center space-y-4">
              <div className="text-muted-foreground">
                Pass Selected: <span className="text-foreground font-bold">{selectedPass.label}</span>
              </div>
              <div className="text-muted-foreground">
                Cost: <span className="text-red-400 font-bold">-${selectedPass.price.toFixed(2)}</span>
              </div>
              <Button 
                onClick={handleActivatePass}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                ACTIVATE INCOGNITO MODE
              </Button>
              <p className="text-xs text-muted-foreground">
                Clicking activate deducts funds and generates your unique QR token.
              </p>
            </div>
          ) : (
            <div className="text-center w-full animate-fade-in">
              <h3 className="text-green-400 font-bold text-2xl mb-2 tracking-widest">ACCESS GRANTED</h3>
              <p className="text-amber-500 text-sm mb-6">
                Expires: {expirationDate?.toLocaleString()}
              </p>

              <div className="bg-white p-4 rounded-lg inline-block shadow-2xl mb-6">
                <QRCodeSVG 
                  value={generateQRPayload()} 
                  size={250} 
                  level="H"
                  includeMargin={true}
                  fgColor="#000000"
                />
              </div>

              <div className="bg-muted p-4 rounded text-left w-full border border-border">
                <p className="text-xs text-muted-foreground uppercase">Live Wallet Balance</p>
                <p className="text-xl text-foreground font-mono">${walletBalance.toFixed(2)}</p>
                
                <div className="mt-2 pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground uppercase">Status</p>
                  <p className="text-sm text-green-400 font-bold flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    ACTIVE & VERIFIED (3rd Party)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncognitoQRCodeGenerator;
