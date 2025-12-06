// *****************************************************************************
// FILE: IncognitoQRCodeGenerator.tsx
// PURPOSE: The "Money Engine" - Venue Tie-In, Wallet, & Tiered Access
// *****************************************************************************

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface UserData {
  userId?: string;
}

interface Venue {
  id: string;
  name: string;
  city: string;
  category: string;
}

interface PassOption {
  id: string;
  duration_hrs: number;
  price: number;
  label: string;
  description: string;
}

const VENUE_PASS_OPTIONS: PassOption[] = [
  { id: '1_day', duration_hrs: 24, price: 10.00, label: "1-Day Access", description: "24h Entry Pass" },
  { id: '3_day', duration_hrs: 72, price: 20.00, label: "3-Day Festival Pass", description: "72h Weekend Pass" },
  { id: '7_day', duration_hrs: 168, price: 50.00, label: "One-Week Access", description: "7-Day Resort/Cruise" },
];

interface IncognitoQRCodeGeneratorProps {
  userData?: UserData;
}

const IncognitoQRCodeGenerator: React.FC<IncognitoQRCodeGeneratorProps> = ({ userData }) => {

  // --- STATE MANAGEMENT ---
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedPass, setSelectedPass] = useState<PassOption>(VENUE_PASS_OPTIONS[0]);

  // Wallet States
  const [walletBalance, setWalletBalance] = useState<number>(0.00);
  const [refillAmount, setRefillAmount] = useState<number>(100);
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  // Activation States
  const [isIncognitoActive, setIsIncognitoActive] = useState<boolean>(false);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);

  // --- FETCH VENUES FROM DATABASE ---
  useEffect(() => {
    const fetchVenues = async () => {
      setIsLoadingVenues(true);
      const { data, error } = await supabase
        .from('partner_venues')
        .select('id, venue_name, city, category')
        .order('venue_name', { ascending: true });

      if (error) {
        console.error('Error fetching venues:', error);
      } else if (data) {
        setVenues(data.map(v => ({
          id: v.id,
          name: v.venue_name,
          city: v.city,
          category: v.category
        })));
      }
      setIsLoadingVenues(false);
    };

    fetchVenues();
  }, []);

  // --- 1. WALLET LOGIC (Refilling Funds) ---
  const handleRefillWallet = () => {
    if (!selectedVenue) {
      alert("⚠️ Please SELECT A VENUE first so we know where to send these funds.");
      return;
    }
    if (refillAmount < 50) {
      alert("Minimum refill amount is $50.00");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    // SIMULATION: User pays -> VALID holds funds tagged for Venue
    const newBalance = walletBalance + refillAmount;
    setWalletBalance(newBalance);
    alert(`SUCCESS: Added $${refillAmount} for use at ${selectedVenue.name}.`);
    setRefillAmount(100);
  };

  // --- 2. ACTIVATION LOGIC (Purchasing Access) ---
  const handleActivatePass = () => {
    if (!selectedVenue) {
      alert("Please select a venue.");
      return;
    }
    if (walletBalance < selectedPass.price) {
      alert(`INSUFFICIENT FUNDS: You need $${selectedPass.price}. Please refill wallet.`);
      return;
    }

    setWalletBalance(prev => prev - selectedPass.price);
    const newExpiration = new Date(Date.now() + selectedPass.duration_hrs * 60 * 60 * 1000);
    setExpirationDate(newExpiration);
    setIsIncognitoActive(true);
  };

  // --- 3. QR PAYLOAD GENERATOR (The Data Scanner Reads) ---
  const generateQRPayload = (): string => {
    if (!isIncognitoActive || !selectedVenue || !expirationDate) return "";

    const payload = {
      type: "INCOGNITO_ACCESS_TOKEN",
      uid: userData?.userId || "USER_123",
      venue_id: selectedVenue.id,
      venue_name: selectedVenue.name,
      venue_city: selectedVenue.city,
      status: "ACTIVE",
      tier: selectedPass.label,
      expires_at: expirationDate.toISOString(),
      current_wallet_balance: walletBalance.toFixed(2),
      id_verified: true,
    };
    return JSON.stringify(payload);
  };

  // --- RENDER ---
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-secondary border border-border rounded-xl shadow-2xl text-foreground">

      <div className="mb-6 border-b border-border pb-4">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          INCOGNITO COMMAND CENTER
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Select your destination, fund your wallet, and generate your access token.
        </p>
      </div>

      {/* --- STEP 1: SELECT VENUE (THE MISSING LINK) --- */}
      <div className="mb-6 md:mb-8 p-4 bg-card border-l-4 border-accent rounded-lg shadow-lg">
        <label className="block text-accent font-bold mb-2 uppercase tracking-wider text-sm">Step 1: Select Venue / Event</label>
        {isLoadingVenues ? (
          <div className="flex items-center justify-center p-4 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading venues...
          </div>
        ) : (
          <select
            className="w-full p-3 md:p-4 bg-secondary border border-border rounded-lg text-foreground font-bold text-base md:text-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all min-h-[48px]"
            onChange={(e) => {
              const venue = venues.find(v => v.id === e.target.value) || null;
              setSelectedVenue(venue);
              setIsIncognitoActive(false);
              setWalletBalance(0);
            }}
            value={selectedVenue?.id || ""}
          >
            <option value="">-- Choose Where You Are Going --</option>
            {venues.map(v => (
              <option key={v.id} value={v.id}>{v.name} ({v.city})</option>
            ))}
          </select>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          *Funds loaded will be securely tied to this venue&apos;s ledger for instant use.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

        {/* LEFT COLUMN: WALLET & SELECTION */}
        <div className={`space-y-6 transition-opacity ${!selectedVenue ? 'opacity-50 pointer-events-none' : ''}`}>

          {/* A. SPENDING MONITOR */}
          <div className="bg-card p-4 md:p-5 rounded-lg border border-primary/30 shadow-md">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-2">💰 Spending Wallet</h3>
            <div className="text-3xl md:text-4xl font-mono font-bold text-foreground mb-4">
              ${walletBalance.toFixed(2)}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-muted-foreground uppercase mb-1">Refill Amount ($)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={refillAmount === 0 ? '' : refillAmount.toString()}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setRefillAmount(value === '' ? 0 : parseInt(value, 10));
                  }}
                  placeholder="Enter amount"
                  className="w-full bg-secondary border border-border rounded-lg p-3 text-foreground min-h-[48px] text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground uppercase mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg p-3 text-foreground min-h-[48px] text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                >
                  <option value="">-- Select Method --</option>
                  <option value="Apple Pay">Apple Pay</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                </select>
              </div>
              <Button
                onClick={handleRefillWallet}
                className="w-full py-4 md:py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold min-h-[52px] text-base active:scale-[0.98] transition-transform touch-manipulation"
              >
                LOAD FUNDS TO {selectedVenue?.name || "VENUE"}
              </Button>
            </div>
          </div>

          {/* B. DURATION */}
          <div className="bg-card p-4 md:p-5 rounded-lg border border-amber-500/30 shadow-md">
            <h3 className="text-lg md:text-xl font-bold text-amber-500 mb-4">⏱️ Select Access Tier</h3>
            <div className="space-y-3">
              {VENUE_PASS_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedPass(option)}
                  className={`p-4 rounded-lg cursor-pointer border-2 flex justify-between items-center transition-all min-h-[56px] active:scale-[0.98] touch-manipulation ${selectedPass.id === option.id ? 'border-accent bg-accent/10 shadow-md' : 'border-border hover:border-muted-foreground'}`}
                >
                  <div className="font-bold text-foreground text-base">{option.label}</div>
                  <div className="text-accent font-bold text-lg">${option.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVATION */}
        <div className="flex flex-col items-center justify-center bg-background/40 rounded-lg p-4 md:p-6 border border-border min-h-[300px]">
          {!isIncognitoActive ? (
            <div className="text-center space-y-4 w-full">
              <p className="text-muted-foreground text-sm md:text-base">Target Venue: <span className="text-foreground font-bold">{selectedVenue?.name || "None Selected"}</span></p>
              <Button
                onClick={handleActivatePass}
                disabled={!selectedVenue}
                className="w-full md:w-auto px-8 py-5 md:py-4 bg-gradient-to-r from-amber-500 to-destructive text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] touch-manipulation"
              >
                ACTIVATE TOKEN
              </Button>
            </div>
          ) : (
            <div className="text-center w-full animate-fade-in">
              <h3 className="text-accent font-bold text-xl md:text-2xl mb-2">ACCESS GRANTED</h3>
              <div className="bg-white p-3 md:p-4 rounded-lg inline-block shadow-2xl mb-4 md:mb-6">
                <QRCodeSVG value={generateQRPayload()} size={200} level="H" className="md:w-[250px] md:h-[250px]" />
              </div>
              <div className="bg-card p-4 rounded-lg text-left w-full border border-border">
                <p className="text-xs text-muted-foreground uppercase">Venue</p>
                <p className="text-base md:text-lg text-foreground font-bold mb-2">{selectedVenue?.name}</p>
                <p className="text-xs text-muted-foreground uppercase">Location</p>
                <p className="text-sm text-muted-foreground mb-2">{selectedVenue?.city}</p>
                <p className="text-xs text-muted-foreground uppercase">Wallet Balance</p>
                <p className="text-lg md:text-xl text-foreground font-mono">${walletBalance.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncognitoQRCodeGenerator;
