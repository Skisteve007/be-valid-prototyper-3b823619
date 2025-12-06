import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; 

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

interface UserData {
    userId?: string;
}

interface IncognitoQRCodeGeneratorProps {
    userData?: UserData;
}

const IncognitoQRCodeGenerator: React.FC<IncognitoQRCodeGeneratorProps> = ({ userData }) => {
    const [selectedVenue, setSelectedVenue] = useState<typeof AVAILABLE_VENUES[0] | null>(null); 
    const [selectedPass, setSelectedPass] = useState(VENUE_PASS_OPTIONS[0]); 
    const [refillAmount, setRefillAmount] = useState("");    
    const [paymentMethod, setPaymentMethod] = useState("");  
    const [walletBalance, setWalletBalance] = useState(0.00); 
    
    // Master Mode State
    const [isSupercharged, setIsSupercharged] = useState(false);
    const [expirationDate, setExpirationDate] = useState<Date | null>(null);

    const handleAddFunds = () => {
        if (!selectedVenue) { alert("Step 1: Select a Destination first."); return; }
        if (!refillAmount || parseFloat(refillAmount) < 50) { alert("Minimum load is $50."); return; }
        if (!paymentMethod) { alert("Select Payment Method."); return; }
        
        const amount = parseFloat(refillAmount);
        setWalletBalance(prev => prev + amount);
        setRefillAmount(""); 
        alert(`SUCCESS: Added $${amount} via ${paymentMethod}`);
    };

    const handleActivate = () => {
        if (!selectedVenue) { alert("Select a Venue."); return; }
        if (walletBalance < selectedPass.price) { alert(`Insufficient Funds. Pass costs $${selectedPass.price}.`); return; }

        setWalletBalance(prev => prev - selectedPass.price);
        setExpirationDate(new Date(Date.now() + selectedPass.duration_hrs * 60 * 60 * 1000));
        setIsSupercharged(true);
    };

    const generatePayload = () => {
        const baseData = { uid: userData?.userId || "USER_123", verified: true };
        if (isSupercharged && expirationDate) {
            return JSON.stringify({
                ...baseData,
                type: "ACCESS_TOKEN",
                venue_id: selectedVenue?.id,
                tier: selectedPass.label,
                expires: expirationDate.toISOString(),
                balance: walletBalance.toFixed(2)
            });
        } else {
            return JSON.stringify({ ...baseData, type: "STANDARD_ID_ONLY", status: "IDLE" });
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl text-white">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <div>
                    <h2 className={`text-2xl font-bold ${isSupercharged ? "text-green-400" : "text-gray-300"}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        {isSupercharged ? "ACCESS GRANTED" : "STANDARD ID"}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {isSupercharged ? "Secure Venue Token Active" : "Use Dashboard Controls to Upgrade QR"}
                    </p>
                </div>
                {isSupercharged && <div className="px-4 py-1 bg-green-400 text-black font-bold rounded-full animate-pulse shadow-[0_0_15px_rgba(74,222,128,0.8)]">LIVE</div>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-5 order-2 lg:order-1">
                    <div className="bg-gray-800 p-4 rounded border-l-4 border-blue-500">
                        <label className="text-blue-400 font-bold text-xs uppercase block mb-1">1. Destination</label>
                        <select 
                            className="w-full bg-gray-900 text-white p-3 rounded border border-gray-600 focus:border-blue-500 outline-none"
                            onChange={(e) => {
                                setSelectedVenue(AVAILABLE_VENUES.find(v => v.id === e.target.value) || null);
                                setIsSupercharged(false); 
                            }}
                            disabled={isSupercharged}
                        >
                            <option value="">-- Select Venue --</option>
                            {AVAILABLE_VENUES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </div>

                    <div className="bg-gray-800 p-4 rounded border-l-4 border-amber-500">
                        <label className="text-amber-500 font-bold text-xs uppercase block mb-2">2. Access Duration</label>
                        <div className="flex space-x-2">
                            {VENUE_PASS_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setSelectedPass(opt)}
                                    disabled={isSupercharged}
                                    className={`flex-1 py-2 px-1 rounded border text-sm font-bold transition-all ${selectedPass.id === opt.id ? 'bg-amber-500 text-black border-amber-500' : 'bg-gray-900 text-gray-400 border-gray-600'}`}
                                >
                                    {opt.label} (${opt.price})
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded border-l-4 border-green-400">
                        <label className="text-green-400 font-bold text-xs uppercase block mb-2">3. Fund Wallet</label>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-400 font-bold">$</span>
                                <input 
                                    type="number" 
                                    placeholder="Amount (Min $50)"
                                    value={refillAmount} 
                                    onChange={e => setRefillAmount(e.target.value)}
                                    className="w-full bg-gray-900 text-white p-2 rounded border border-gray-600"
                                />
                            </div>
                            <select 
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full bg-gray-900 text-white p-2 rounded border border-gray-600"
                            >
                                <option value="">-- Payment Method --</option>
                                <option value="Apple Pay">Apple Pay</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="PayPal">PayPal</option>
                                <option value="Venmo">Venmo</option>
                                <option value="Zelle">Zelle</option>
                            </select>
                            <button onClick={handleAddFunds} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded">
                                Load Funds
                            </button>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Funds Ready:</span>
                            <span className="text-xl font-mono text-white">${walletBalance.toFixed(2)}</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleActivate}
                        disabled={!selectedVenue || isSupercharged}
                        className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all ${isSupercharged ? 'bg-gray-800 text-gray-500 border border-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105'}`}
                    >
                        {isSupercharged ? "TOKEN ACTIVE" : `ACTIVATE & UPGRADE QR (-$${selectedPass.price})`}
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center bg-black rounded-xl p-6 border-2 border-gray-700 shadow-[0_0_20px_rgba(0,0,0,0.5)] order-1 lg:order-2">
                    <div className={`p-4 rounded-xl bg-white transition-all duration-500 ${isSupercharged ? 'shadow-[0_0_40px_rgba(74,222,128,0.8)] ring-4 ring-green-400' : 'opacity-80'}`}>
                        <QRCodeSVG value={generatePayload()} size={250} level="H" />
                    </div>
                    <div className="mt-8 w-full text-center space-y-3">
                        {isSupercharged ? (
                            <div className="animate-fade-in w-full">
                                <h3 className="text-green-400 font-bold text-xl tracking-widest mb-4">{selectedVenue?.name}</h3>
                                <div className="bg-gray-900 p-4 rounded-lg text-left space-y-2 border border-green-400/30 shadow-lg">
                                    <div className="flex justify-between text-xs text-gray-400 uppercase tracking-wide border-b border-gray-700 pb-1 mb-2">
                                        <span>Wallet Ledger</span>
                                        <span>Live</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-300">
                                        <span>Cost Deducted:</span>
                                        <span className="text-red-400 font-mono">-${selectedPass.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl text-white font-bold border-t border-gray-700 pt-2 mt-1">
                                        <span>REMAINING:</span>
                                        <span className="text-green-400 font-mono text-2xl">${walletBalance.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="opacity-70">
                                <h3 className="text-gray-400 font-bold text-xl">STANDARD ID</h3>
                                <p className="text-xs text-gray-600 mt-1">Verify Identity Only</p>
                                <p className="text-xs text-amber-500 mt-4 animate-pulse">
                                    Use Dashboard Controls to Upgrade
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncognitoQRCodeGenerator;
