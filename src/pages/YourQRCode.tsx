// *****************************************************************************
// FILE: src/pages/YourQRCode.tsx
// PURPOSE: NUCLEAR OPTION - All logic in one file. No imports needed.
// *****************************************************************************

import React, { useState } from 'react';
// Note: Navbar component does not exist in this project
// import Navbar from '../components/Navbar'; 
import { QRCodeSVG } from 'qrcode.react';

// --- 1. THE LOGIC (Directly Embedded) ---
const AVAILABLE_VENUES = [
    { id: 'v_101', name: 'Club Space (Miami)' },
    { id: 'v_102', name: 'E11EVEN (Miami)' },
    { id: 'v_103', name: 'Hertz Rentals (MIA)' },
    { id: 'v_104', name: 'Tootsies (Miami)' }
];

const VENUE_PASS_OPTIONS = [
    { id: '1_day', duration_hrs: 24, price: 10.00, label: "1-Day Access" }, 
    { id: '3_day', duration_hrs: 72, price: 20.00, label: "3-Day Festival" }, 
    { id: '7_day', duration_hrs: 168, price: 50.00, label: "7-Day Week" }, 
];

interface Venue {
    id: string;
    name: string;
}

interface PassOption {
    id: string;
    duration_hrs: number;
    price: number;
    label: string;
}

const YourQRCode = () => {
    // --- STATE ---
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null); 
    const [selectedPass, setSelectedPass] = useState<PassOption>(VENUE_PASS_OPTIONS[0]); 
    const [refillAmount, setRefillAmount] = useState("");    
    const [paymentMethod, setPaymentMethod] = useState("");  
    const [walletBalance, setWalletBalance] = useState(0.00); 
    const [isSupercharged, setIsSupercharged] = useState(false);
    const [expirationDate, setExpirationDate] = useState<Date | null>(null);

    // --- HANDLERS ---
    const handleAddFunds = () => {
        if (!selectedVenue) { alert("Step 1: Select a Destination first."); return; }
        if (!refillAmount || parseFloat(refillAmount) < 50) { alert("Minimum load is $50."); return; }
        if (!paymentMethod) { alert("Select Payment Method."); return; }
        setWalletBalance(prev => prev + parseFloat(refillAmount));
        setRefillAmount(""); 
        alert(`SUCCESS: Added funds via ${paymentMethod}`);
    };

    const handleActivate = () => {
        if (!selectedVenue) { alert("Select a Venue."); return; }
        if (walletBalance < selectedPass.price) { alert("Insufficient Funds."); return; }
        setWalletBalance(prev => prev - selectedPass.price);
        setExpirationDate(new Date(Date.now() + selectedPass.duration_hrs * 60 * 60 * 1000));
        setIsSupercharged(true);
    };

    const generatePayload = () => {
        // Simple JSON payload
        if (isSupercharged && selectedVenue) {
            return JSON.stringify({ type: "ACCESS", venue: selectedVenue.id, bal: walletBalance });
        }
        return JSON.stringify({ type: "ID_ONLY", status: "IDLE" });
    };

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* <Navbar /> */}
            <main className="container mx-auto px-4 py-8">
                {/* HEADER */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        YOUR VALID ACCESS
                    </h1>
                </div>

                {/* THE DASHBOARD */}
                <div className="w-full max-w-6xl mx-auto p-4 md:p-8 bg-card border border-border rounded-xl shadow-2xl">
                    <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                        <h2 className={`text-2xl font-bold ${isSupercharged ? "text-green-400" : "text-muted-foreground"}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                            {isSupercharged ? "ACCESS GRANTED" : "STANDARD ID"}
                        </h2>
                        {isSupercharged && <div className="px-4 py-1 bg-green-400 text-black font-bold rounded-full animate-pulse">LIVE</div>}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-5 order-2 lg:order-1">
                            {/* 1. VENUE */}
                            <div className="bg-muted p-4 rounded border-l-4 border-blue-500">
                                <label className="text-blue-400 font-bold text-xs uppercase block mb-1">1. Destination</label>
                                <select className="w-full bg-background text-foreground p-3 rounded border border-border" onChange={(e) => { setSelectedVenue(AVAILABLE_VENUES.find(v => v.id === e.target.value) || null); setIsSupercharged(false); }}>
                                    <option value="">-- Select Venue --</option>
                                    {AVAILABLE_VENUES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            </div>

                            {/* 2. DURATION */}
                            <div className="bg-muted p-4 rounded border-l-4 border-amber-500">
                                <label className="text-amber-500 font-bold text-xs uppercase block mb-2">2. Access Duration</label>
                                <div className="flex space-x-2">
                                    {VENUE_PASS_OPTIONS.map(opt => (
                                        <button key={opt.id} onClick={() => setSelectedPass(opt)} className={`flex-1 py-2 px-1 rounded border text-sm font-bold ${selectedPass.id === opt.id ? 'bg-amber-500 text-black' : 'bg-background text-muted-foreground'}`}>
                                            {opt.label} (${opt.price})
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 3. FUNDS */}
                            <div className="bg-muted p-4 rounded border-l-4 border-green-400">
                                <label className="text-green-400 font-bold text-xs uppercase block mb-2">3. Fund Wallet</label>
                                <div className="space-y-3">
                                    <input type="number" placeholder="Amount (Min $50)" value={refillAmount} onChange={e => setRefillAmount(e.target.value)} className="w-full bg-background text-foreground p-2 rounded border border-border" />
                                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-background text-foreground p-2 rounded border border-border">
                                        <option value="">-- Payment Method --</option>
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="Apple Pay">Apple Pay</option>
                                    </select>
                                    <button onClick={handleAddFunds} className="w-full bg-muted hover:bg-muted/80 text-foreground font-bold py-2 rounded">Load Funds</button>
                                </div>
                                <div className="mt-3 pt-3 border-t border-border text-right"><span className="text-xl font-mono text-foreground">${walletBalance.toFixed(2)}</span></div>
                            </div>

                            <button onClick={handleActivate} className="w-full py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                                {isSupercharged ? "TOKEN ACTIVE" : "ACTIVATE"}
                            </button>
                        </div>

                        {/* QR CODE */}
                        <div className="flex flex-col items-center justify-center bg-black rounded-xl p-6 border-2 border-border shadow-xl order-1 lg:order-2">
                             <div className={`p-4 rounded-xl bg-white ${isSupercharged ? 'shadow-[0_0_40px_#39FF14]' : ''}`}>
                                <QRCodeSVG value={generatePayload()} size={220} level="H" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default YourQRCode;
