// *****************************************************************************
// FILE: IncognitoQRCodeGenerator.tsx
// PURPOSE: THE UNIFIED MASTER COMPONENT
// FEATURES: Single QR, Venue Select, Tiered Access, Payment Methods, Real-time Ledger
// *****************************************************************************

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface UserData {
  userId?: string;
  photoUrl?: string;
}

interface Venue {
  id: string;
  name: string;
  city: string;
}

interface PassOption {
  id: string;
  duration_hrs: number;
  price: number;
  label: string;
}

// --- CONFIGURATION: TIERS ---
const VENUE_PASS_OPTIONS: PassOption[] = [
  { id: '1_day', duration_hrs: 24, price: 10.00, label: "1-Day Access" },
  { id: '3_day', duration_hrs: 72, price: 20.00, label: "3-Day Festival" },
  { id: '7_day', duration_hrs: 168, price: 50.00, label: "7-Day Week" },
];

interface IncognitoQRCodeGeneratorProps {
  userData?: UserData;
}

const IncognitoQRCodeGenerator: React.FC<IncognitoQRCodeGeneratorProps> = ({ userData }) => {

  // --- STATE MANAGEMENT ---

  // Venues from database
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);

  // 1. Selection States
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedPass, setSelectedPass] = useState<PassOption>(VENUE_PASS_OPTIONS[0]);

  // 2. Financial States
  const [refillAmount, setRefillAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<number>(0.00);

  // 3. Master Mode State (Standard vs. Incognito)
  const [isSupercharged, setIsSupercharged] = useState<boolean>(false);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);

  // --- FETCH VENUES FROM DATABASE ---
  useEffect(() => {
    const fetchVenues = async () => {
      setIsLoadingVenues(true);
      const { data, error } = await supabase
        .from('partner_venues')
        .select('id, venue_name, city')
        .order('venue_name', { ascending: true });

      if (error) {
        console.error('Error fetching venues:', error);
      } else if (data) {
        setVenues(data.map(v => ({
          id: v.id,
          name: v.venue_name,
          city: v.city
        })));
      }
      setIsLoadingVenues(false);
    };

    fetchVenues();
  }, []);

  // --- LOGIC: FUNDING THE WALLET ---
  const handleAddFunds = () => {
    if (!selectedVenue) {
      alert("Please Select a Venue First (Step 1).");
      return;
    }
    const amount = parseFloat(refillAmount);
    if (!refillAmount || amount < 50) {
      alert("Minimum funding amount is $50.");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a Payment Method (Step 3).");
      return;
    }

    setWalletBalance(prev => prev + amount);
    setRefillAmount("");
    alert(`SUCCESS: Added $${amount} via ${paymentMethod}`);
  };

  // --- LOGIC: ACTIVATING THE PASS ---
  const handleActivate = () => {
    if (!selectedVenue) {
      alert("Select a Venue.");
      return;
    }
    if (walletBalance < selectedPass.price) {
      alert(`Insufficient Funds. You have $${walletBalance.toFixed(2)}, but the pass costs $${selectedPass.price.toFixed(2)}.`);
      return;
    }

    setWalletBalance(prev => prev - selectedPass.price);
    setExpirationDate(new Date(Date.now() + selectedPass.duration_hrs * 60 * 60 * 1000));
    setIsSupercharged(true);
  };

  // --- LOGIC: GENERATING THE QR PAYLOAD ---
  const generatePayload = (): string => {
    const baseData = {
      uid: userData?.userId || "USER_123",
      photo: userData?.photoUrl || "img_url",
      verified: true
    };

    if (isSupercharged && selectedVenue && expirationDate) {
      return JSON.stringify({
        ...baseData,
        type: "ACCESS_TOKEN",
        venue_id: selectedVenue.id,
        tier: selectedPass.label,
        expires: expirationDate.toISOString(),
        current_balance: walletBalance.toFixed(2)
      });
    } else {
      return JSON.stringify({
        ...baseData,
        type: "STANDARD_ID_ONLY",
        status: "IDLE"
      });
    }
  };

  // --- UI RENDER ---
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-foreground">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h2
            className={`text-2xl font-bold ${isSupercharged ? "text-green-400" : "text-slate-300"}`}
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            {isSupercharged ? "ACCESS GRANTED" : "STANDARD ID"}
          </h2>
          <p className="text-sm text-slate-500">
            {isSupercharged ? "Secure Venue Token Active" : "Select Venue, Pass & Funds to Upgrade this QR"}
          </p>
        </div>
        {isSupercharged && (
          <div className="px-4 py-1 bg-green-400 text-black font-bold rounded-full animate-pulse shadow-[0_0_15px_rgba(74,222,128,0.6)]">
            LIVE
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT COLUMN: THE CONTROLS (Inputs) */}
        <div className="space-y-5 order-2 lg:order-1">

          {/* STEP 1: VENUE */}
          <div className="bg-slate-800 p-4 rounded border-l-4 border-blue-500">
            <label className="text-blue-400 font-bold text-xs uppercase block mb-1">1. Destination</label>
            {isLoadingVenues ? (
              <div className="flex items-center justify-center p-3 text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading venues...
              </div>
            ) : (
              <select
                className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 focus:border-blue-500 outline-none min-h-[48px]"
                onChange={(e) => {
                  const venue = venues.find(v => v.id === e.target.value) || null;
                  setSelectedVenue(venue);
                  setIsSupercharged(false);
                }}
                value={selectedVenue?.id || ""}
                disabled={isSupercharged}
              >
                <option value="">-- Select Venue --</option>
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.city})</option>
                ))}
              </select>
            )}
          </div>

          {/* STEP 2: TIER SELECTION */}
          <div className="bg-slate-800 p-4 rounded border-l-4 border-amber-500">
            <label className="text-amber-500 font-bold text-xs uppercase block mb-2">2. Select Access Duration</label>
            <div className="flex flex-col sm:flex-row gap-2">
              {VENUE_PASS_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedPass(opt)}
                  disabled={isSupercharged}
                  className={`flex-1 py-2 px-2 rounded border text-sm font-bold transition-all min-h-[48px] touch-manipulation ${
                    selectedPass.id === opt.id
                      ? 'bg-amber-500 text-black border-amber-500'
                      : 'bg-slate-900 text-slate-400 border-slate-600 hover:border-amber-500/50'
                  }`}
                >
                  {opt.label} (${opt.price})
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: FUNDING & PAYMENT METHODS */}
          <div className="bg-slate-800 p-4 rounded border-l-4 border-green-400">
            <label className="text-green-400 font-bold text-xs uppercase block mb-2">3. Fund Your Wallet</label>

            {/* Funding Controls */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 font-bold">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Amount (Min $50)"
                  value={refillAmount}
                  onChange={e => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setRefillAmount(value);
                  }}
                  className="w-full bg-slate-900 text-white p-2 rounded border border-slate-600 min-h-[48px] focus:border-green-400 outline-none"
                />
              </div>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-600 min-h-[48px] focus:border-green-400 outline-none"
              >
                <option value="">-- Select Payment Method --</option>
                <option value="Apple Pay">Apple Pay</option>
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Venmo">Venmo</option>
                <option value="Zelle">Zelle</option>
                <option value="CashApp">CashApp</option>
              </select>

              <button
                onClick={handleAddFunds}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded min-h-[48px] transition-all touch-manipulation"
              >
                Load Funds
              </button>
            </div>

            {/* PRE-ACTIVATION BALANCE DISPLAY */}
            <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between items-center">
              <span className="text-slate-400 text-sm">Funds Ready:</span>
              <span className="text-xl font-mono text-white">${walletBalance.toFixed(2)}</span>
            </div>
          </div>

          {/* ACTIVATE BUTTON */}
          <button
            onClick={handleActivate}
            disabled={!selectedVenue || isSupercharged}
            className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all min-h-[56px] touch-manipulation ${
              isSupercharged
                ? 'bg-slate-800 text-slate-500 border border-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isSupercharged ? "TOKEN ACTIVE" : `ACTIVATE & UPGRADE QR (-$${selectedPass.price})`}
          </button>
        </div>

        {/* RIGHT COLUMN: THE MASTER QR CODE + LEDGER */}
        <div className="flex flex-col items-center justify-center bg-black rounded-xl p-6 border-2 border-slate-700 shadow-[0_0_20px_rgba(0,0,0,0.5)] order-1 lg:order-2">

          {/* THE ONE DYNAMIC QR */}
          <div className={`p-4 rounded-xl bg-white transition-all duration-500 ${isSupercharged ? 'shadow-[0_0_40px_rgba(74,222,128,0.8)] ring-4 ring-green-400' : 'opacity-80'}`}>
            <QRCodeSVG value={generatePayload()} size={220} level="H" />
          </div>

          {/* THE STATUS & LEDGER DISPLAY */}
          <div className="mt-8 w-full text-center space-y-3">
            {isSupercharged ? (
              <div className="animate-fade-in w-full">
                <h3 className="text-green-400 font-bold text-xl tracking-widest mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {selectedVenue?.name}
                </h3>

                {/* THE LEDGER: Showing the Math */}
                <div className="bg-slate-900 p-4 rounded-lg text-left space-y-2 border border-green-400/30 shadow-lg">
                  <div className="flex justify-between text-xs text-slate-400 uppercase tracking-wide border-b border-slate-700 pb-1 mb-2">
                    <span>Wallet Ledger</span>
                    <span>Live</span>
                  </div>

                  {/* Cost Line */}
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Access Tier:</span>
                    <span className="font-bold">{selectedPass.label}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Cost Deducted:</span>
                    <span className="text-red-400 font-mono">-${selectedPass.price.toFixed(2)}</span>
                  </div>

                  {/* Balance Line */}
                  <div className="flex justify-between text-xl text-white font-bold border-t border-slate-700 pt-2 mt-1">
                    <span>REMAINING:</span>
                    <span className="text-green-400 font-mono text-2xl">${walletBalance.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Scan at bar to spend remaining balance.</p>
              </div>
            ) : (
              <div className="opacity-70">
                <h3 className="text-slate-400 font-bold text-xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>STANDARD ID</h3>
                <p className="text-xs text-slate-500 mt-1">Verify Identity Only</p>
                <p className="text-xs text-amber-500 mt-4 animate-pulse">Select Venue to Upgrade this QR</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default IncognitoQRCodeGenerator;
