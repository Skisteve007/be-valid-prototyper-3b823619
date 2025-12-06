// *****************************************************************************
// FILE: IncognitoQRCodeGenerator.tsx
// PURPOSE: THE MASTER CODE - One QR to Rule Them All (Identity + Money + Venue)
// *****************************************************************************

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

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

const VENUE_PASS_OPTIONS: PassOption[] = [
  { id: '1_day', duration_hrs: 24, price: 10.00, label: "1-Day Access" },
  { id: '3_day', duration_hrs: 72, price: 20.00, label: "3-Day Festival" },
  { id: '7_day', duration_hrs: 168, price: 50.00, label: "One-Week Access" },
];

interface IncognitoQRCodeGeneratorProps {
  userData?: UserData;
}

const IncognitoQRCodeGenerator: React.FC<IncognitoQRCodeGeneratorProps> = ({ userData }) => {

  // --- STATE ---
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedPass, setSelectedPass] = useState<PassOption>(VENUE_PASS_OPTIONS[0]);

  // Wallet
  const [walletBalance, setWalletBalance] = useState<number>(0.00);
  const [refillAmount, setRefillAmount] = useState<number>(100);

  // Master State: Is this a basic ID or a Supercharged Token?
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

  // --- LOGIC ---
  const handleRefill = () => {
    if (!selectedVenue) {
      alert("Pick a venue first!");
      return;
    }
    if (refillAmount < 50) {
      alert("Minimum refill is $50");
      return;
    }
    setWalletBalance(prev => prev + refillAmount);
    alert(`$${refillAmount} Added!`);
  };

  const handleActivate = () => {
    if (!selectedVenue) {
      alert("Select a Venue.");
      return;
    }
    if (walletBalance < selectedPass.price) {
      alert("Insufficient Funds.");
      return;
    }

    setWalletBalance(prev => prev - selectedPass.price);
    setExpirationDate(new Date(Date.now() + selectedPass.duration_hrs * 60 * 60 * 1000));

    // This FLIPS the switch to "Access Granted" mode
    setIsSupercharged(true);
  };

  // --- DYNAMIC PAYLOAD (The Secret Sauce) ---
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
        venue_name: selectedVenue.name,
        tier: selectedPass.label,
        expires: expirationDate.toISOString(),
        balance: walletBalance.toFixed(2),
      });
    } else {
      return JSON.stringify({
        ...baseData,
        type: "STANDARD_ID_ONLY",
        status: "UNFUNDED"
      });
    }
  };

  // Calculate hours remaining for display
  const getHoursRemaining = (): string => {
    if (!expirationDate) return "0H";
    const hoursLeft = Math.max(0, Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60)));
    return `${hoursLeft}H`;
  };

  // --- RENDER ---
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-white">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h2
            className={`text-2xl md:text-3xl font-bold ${isSupercharged ? "text-green-400" : "text-slate-400"}`}
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            {isSupercharged ? "ACCESS GRANTED" : "STANDARD ID"}
          </h2>
          <p className="text-sm text-slate-500">
            {isSupercharged ? "Secure Venue Token Active" : "Select Venue & Fund to Upgrade"}
          </p>
        </div>
        {isSupercharged && (
          <div className="mt-2 md:mt-0 px-4 py-1 bg-green-400 text-black font-bold rounded-full animate-pulse">
            LIVE TOKEN
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT: THE CONTROLS */}
        <div className="space-y-6 order-2 lg:order-1">

          {/* VENUE SELECT */}
          <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500">
            <label className="text-blue-400 font-bold text-xs uppercase">1. Destination</label>
            {isLoadingVenues ? (
              <div className="flex items-center justify-center p-3 text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading venues...
              </div>
            ) : (
              <select
                className="w-full mt-1 bg-slate-900 text-white p-3 rounded-lg border border-slate-600 min-h-[48px] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                onChange={(e) => {
                  const venue = venues.find(v => v.id === e.target.value) || null;
                  setSelectedVenue(venue);
                  setIsSupercharged(false);
                }}
                value={selectedVenue?.id || ""}
              >
                <option value="">-- Select Venue --</option>
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.city})</option>
                ))}
              </select>
            )}
          </div>

          {/* WALLET */}
          <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-green-400">
            <label className="text-green-400 font-bold text-xs uppercase">2. Wallet Fund ($)</label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={refillAmount === 0 ? '' : refillAmount.toString()}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setRefillAmount(value === '' ? 0 : parseInt(value, 10));
                }}
                placeholder="100"
                className="w-1/2 bg-slate-900 text-white p-3 rounded-lg border border-slate-600 min-h-[48px] focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all"
              />
              <button
                onClick={handleRefill}
                className="w-1/2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg min-h-[48px] transition-all active:scale-[0.98] touch-manipulation"
              >
                Add Funds
              </button>
            </div>
            <div className="mt-2 text-right text-xl font-mono">${walletBalance.toFixed(2)}</div>
          </div>

          {/* ACTIVATE */}
          <button
            onClick={handleActivate}
            disabled={!selectedVenue || isSupercharged}
            className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all min-h-[56px] touch-manipulation ${
              isSupercharged
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isSupercharged ? "TOKEN ACTIVE" : "ACTIVATE & UPGRADE QR"}
          </button>
        </div>

        {/* RIGHT: THE SINGLE MASTER QR CODE */}
        <div className="flex flex-col items-center justify-center bg-black rounded-xl p-6 border-2 border-slate-700 shadow-[0_0_20px_rgba(0,0,0,0.5)] order-1 lg:order-2">

          {/* THE ONE CODE */}
          <div className={`p-4 rounded-xl bg-white transition-all duration-500 ${isSupercharged ? 'shadow-[0_0_30px_#39FF14]' : ''}`}>
            <QRCodeSVG value={generatePayload()} size={220} level="H" />
          </div>

          {/* DYNAMIC STATUS DISPLAY */}
          <div className="mt-6 w-full text-center space-y-2">
            {isSupercharged ? (
              <>
                <h3 className="text-green-400 font-bold text-xl tracking-widest" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {selectedVenue?.name}
                </h3>
                <p className="text-slate-500 text-sm">{selectedVenue?.city}</p>
                <div className="flex justify-center space-x-4 text-sm text-slate-300">
                  <div className="bg-slate-800 px-3 py-2 rounded-lg">
                    <span className="text-slate-500 text-xs block">BALANCE</span>
                    <span className="text-white font-mono font-bold">${walletBalance.toFixed(2)}</span>
                  </div>
                  <div className="bg-slate-800 px-3 py-2 rounded-lg">
                    <span className="text-slate-500 text-xs block">EXPIRES</span>
                    <span className="text-white font-bold">{getHoursRemaining()}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-slate-500 font-bold text-xl">ID VERIFIED</h3>
                <p className="text-xs text-slate-600">Scan to verify identity only.</p>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default IncognitoQRCodeGenerator;
