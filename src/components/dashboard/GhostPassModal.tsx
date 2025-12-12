import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Ghost, Check, X, Fingerprint, Wallet, HeartPulse, RefreshCw, Lock, Zap, MapPin } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GhostPassModalProps {
  userId: string;
  onScanSuccess?: () => void;
}

interface ToggleState {
  identity: boolean;
  payment: boolean;
  health: boolean;
}

interface ActiveVenue {
  id: string;
  venue_name: string;
  city: string;
}

interface POSTransaction {
  id: string;
  base_amount: number;
  transaction_type: string;
  status: string;
}

const MIN_BALANCE_THRESHOLD = 5.00;

const GhostPassModal = ({ 
  userId, 
  onScanSuccess 
}: GhostPassModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toggles, setToggles] = useState<ToggleState>({
    identity: true,
    payment: true,
    health: false,
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [qrKey, setQrKey] = useState(Date.now());
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Financial state
  const [balance, setBalance] = useState(0);
  const [venueSpend, setVenueSpend] = useState(0);
  const [displayedBalance, setDisplayedBalance] = useState(0);
  const [displayedSpent, setDisplayedSpent] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  
  // Active venue state
  const [activeVenue, setActiveVenue] = useState<ActiveVenue | null>(null);
  
  // POS Transaction state
  const [pendingPOSTransaction, setPendingPOSTransaction] = useState<POSTransaction | null>(null);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [showTippingModal, setShowTippingModal] = useState(false);
  const [isConfirmingTransaction, setIsConfirmingTransaction] = useState(false);
  
  const prevBalanceRef = useRef(balance);
  const prevSpentRef = useRef(venueSpend);

  // Fetch initial balance
  const fetchBalance = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('balance_after, transaction_type, amount, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setBalance(data[0].balance_after);
        setDisplayedBalance(data[0].balance_after);
      } else {
        setBalance(0);
        setDisplayedBalance(0);
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [userId]);

  // Fetch venue spend for today's session
  const fetchVenueSpend = useCallback(async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('amount')
        .eq('user_id', userId)
        .in('transaction_type', ['bar_charge', 'vip_charge', 'venue_charge'])
        .gte('created_at', today.toISOString());

      if (error) throw error;

      const totalSpend = data?.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0;
      setVenueSpend(totalSpend);
      setDisplayedSpent(totalSpend);
    } catch (err) {
      console.error('Error fetching venue spend:', err);
    }
  }, [userId]);

  // Fetch active venue session
  const fetchActiveVenue = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('member_active_sessions')
        .select(`
          venue_id,
          partner_venues (
            id,
            venue_name,
            city
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('check_in_time', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0 && data[0].partner_venues) {
        const venueData = data[0].partner_venues as unknown as ActiveVenue;
        setActiveVenue(venueData);
      }
    } catch (err) {
      console.error('Error fetching active venue:', err);
    }
  }, [userId]);

  // Set up Supabase Realtime subscription
  useEffect(() => {
    if (!userId) return;

    fetchBalance();
    fetchVenueSpend();
    fetchActiveVenue();

    // Subscribe to wallet_transactions for real-time updates
    const walletChannel = supabase
      .channel(`wallet-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'wallet_transactions',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Wallet transaction received:', payload);
          const newTransaction = payload.new as {
            balance_after: number;
            transaction_type: string;
            amount: number;
          };
          
          // Update balance with animation
          setBalance(newTransaction.balance_after);
          
          // If it's a venue charge, update spend
          if (['bar_charge', 'vip_charge', 'venue_charge'].includes(newTransaction.transaction_type)) {
            setVenueSpend(prev => prev + Math.abs(newTransaction.amount));
            toast.info(`$${Math.abs(newTransaction.amount).toFixed(2)} charged`, {
              description: 'Transaction processed'
            });
          } else if (newTransaction.transaction_type === 'refill') {
            toast.success('Wallet refilled!', {
              description: `New balance: $${newTransaction.balance_after.toFixed(2)}`
            });
          }
        }
      )
      .subscribe();

    // Subscribe to POS transactions for tipping prompts
    const posChannel = supabase
      .channel(`pos-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pos_transactions',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('POS transaction received:', payload);
          const transaction = payload.new as POSTransaction;
          if (transaction.status === 'pending') {
            setPendingPOSTransaction(transaction);
            setShowTippingModal(true);
          }
        }
      )
      .subscribe();

    // Subscribe to active sessions
    const sessionChannel = supabase
      .channel(`session-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'member_active_sessions',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchActiveVenue();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(walletChannel);
      supabase.removeChannel(posChannel);
      supabase.removeChannel(sessionChannel);
    };
  }, [userId, fetchBalance, fetchVenueSpend, fetchActiveVenue]);

  // Animate balance changes
  useEffect(() => {
    if (balance !== prevBalanceRef.current) {
      const diff = prevBalanceRef.current - balance;
      const steps = 20;
      const stepValue = diff / steps;
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        setDisplayedBalance(prev => Math.max(0, prev - stepValue));
        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayedBalance(balance);
        }
      }, 30);
      
      prevBalanceRef.current = balance;
      return () => clearInterval(interval);
    }
  }, [balance]);

  // Animate spent changes
  useEffect(() => {
    if (venueSpend !== prevSpentRef.current) {
      const diff = venueSpend - prevSpentRef.current;
      const steps = 20;
      const stepValue = diff / steps;
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        setDisplayedSpent(prev => prev + stepValue);
        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayedSpent(venueSpend);
        }
      }, 30);
      
      prevSpentRef.current = venueSpend;
      return () => clearInterval(interval);
    }
  }, [venueSpend]);

  // Check if wallet has sufficient funds
  const hasSufficientFunds = balance >= MIN_BALANCE_THRESHOLD;
  const isLocked = balance < MIN_BALANCE_THRESHOLD;

  // Refresh QR code
  const refreshQR = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setQrKey(Date.now());
      setTimeLeft(30);
      setIsRefreshing(false);
    }, 500);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          refreshQR();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshQR, isOpen]);

  // Generate QR data with venue context
  const generateQRData = () => {
    if (isLocked) {
      return JSON.stringify({ type: 'LOCKED', userId });
    }
    
    const data = {
      id: qrKey,
      userId,
      venueId: activeVenue?.id || null,
      permissions: {
        identity: toggles.identity,
        payment: toggles.payment,
        health: toggles.health,
      },
      balance: toggles.payment ? balance : null,
      expires: Date.now() + 30000,
      type: 'GHOST_TOKEN',
    };
    return JSON.stringify(data);
  };

  // Handle wallet refill via Stripe
  const handleQuickReload = async () => {
    setIsReloading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error('Please log in to reload your wallet');
        return;
      }

      const { data, error } = await supabase.functions.invoke('refill-ghost-wallet', {
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Error initiating wallet refill:', err);
      toast.error('Failed to initiate payment');
    } finally {
      setIsReloading(false);
    }
  };

  // Handle tip selection and transaction confirmation
  const handleConfirmTransaction = async () => {
    if (!pendingPOSTransaction || selectedTip === null) return;
    
    setIsConfirmingTransaction(true);
    
    try {
      const tipAmount = (pendingPOSTransaction.base_amount * selectedTip) / 100;
      const totalAmount = pendingPOSTransaction.base_amount + tipAmount;
      
      // Update POS transaction with tip and confirm
      const { error } = await supabase
        .from('pos_transactions')
        .update({
          tip_percentage: selectedTip,
          tip_amount: tipAmount,
          total_amount: totalAmount,
          status: 'member_confirmed',
          member_confirmed_at: new Date().toISOString()
        })
        .eq('id', pendingPOSTransaction.id);

      if (error) throw error;

      toast.success('Transaction Confirmed!', {
        description: `Total: $${totalAmount.toFixed(2)} (incl. ${selectedTip}% tip)`
      });
      
      setShowTippingModal(false);
      setPendingPOSTransaction(null);
      setSelectedTip(null);
    } catch (err) {
      console.error('Error confirming transaction:', err);
      toast.error('Failed to confirm transaction');
    } finally {
      setIsConfirmingTransaction(false);
    }
  };

  // Simulate scan success (for demo)
  const handleScanSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onScanSuccess?.();
    }, 1500);
  };

  // Progress ring calculation
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = ((30 - timeLeft) / 30) * circumference;

  return (
    <>
      {/* Floating Ghost Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] w-16 h-16 rounded-full flex items-center justify-center transition-transform active:scale-95"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.95) 100%)',
          boxShadow: hasSufficientFunds 
            ? '0 0 0 2px rgba(255,215,0,0.4), 0 0 30px rgba(255,215,0,0.4), 0 0 60px rgba(34,197,94,0.3)'
            : '0 0 0 2px rgba(239,68,68,0.4), 0 0 30px rgba(239,68,68,0.4)',
          animation: hasSufficientFunds ? 'ghostBreathing 3s ease-in-out infinite' : 'none',
        }}
      >
        {isLocked ? (
          <Lock className="w-7 h-7 text-red-400" />
        ) : (
          <Ghost className="w-8 h-8 text-amber-400" />
        )}
      </button>

      {/* Ghost QR Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="max-w-sm w-[95vw] p-0 border-0 bg-transparent shadow-none [&>button]:hidden top-[20%] translate-y-[-20%]"
          style={{
            animation: 'slideUpEnergize 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Modal Container with Dark Blur */}
          <div 
            className="relative rounded-3xl overflow-hidden"
            style={{
              border: '2px solid rgba(255, 215, 0, 0.6)',
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.15)',
              animation: 'yellowGlowPulse 2.5s ease-in-out infinite',
            }}
          >
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            
            {/* Content */}
            <div className="relative z-10 p-6">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>

              {/* Header */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 mb-2">
                  <Ghost className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold tracking-wider text-white">GHOST<sup className="text-xs text-amber-400">™</sup> PASS</h2>
                </div>
                
                {/* Active Venue Display */}
                {activeVenue && (
                  <div className="flex items-center justify-center gap-1.5 mt-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/40">
                    <MapPin className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">
                      Active at: {activeVenue.venue_name}
                    </span>
                  </div>
                )}
              </div>

              {/* Live Wallet Display (HUD) */}
              <div className="mb-6 text-center">
                {isLoadingBalance ? (
                  <div className="text-2xl font-bold text-white/50 animate-pulse">Loading...</div>
                ) : (
                  <>
                    <div className={`text-3xl font-bold tracking-tight transition-colors ${isLocked ? 'text-red-400' : 'text-white'}`}>
                      ${displayedBalance.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Running Total Balance
                    </div>
                    {displayedSpent > 0 && (
                      <div className="text-sm text-gray-500 mt-2">
                        You've spent <span className="text-amber-400">${displayedSpent.toFixed(2)}</span> here tonight
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Low Balance Warning */}
              {isLocked && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-center">
                  <p className="text-sm text-red-400 font-medium">
                    Insufficient Funds. Re-up to continue.
                  </p>
                </div>
              )}

              {/* Permission Toggles - Only show if not locked */}
              {!isLocked && (
                <div className="flex justify-center gap-3 mb-6">
                  {/* Identity Toggle */}
                  <button
                    onClick={() => setToggles(prev => ({ ...prev, identity: !prev.identity }))}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300 ${
                      toggles.identity
                        ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                        : 'bg-white/5 border-white/10 opacity-50'
                    }`}
                  >
                    <Fingerprint size={22} className={toggles.identity ? 'text-blue-400' : 'text-gray-500'} />
                    <span className={`text-[9px] font-bold ${toggles.identity ? 'text-blue-400' : 'text-gray-500'}`}>
                      ID
                    </span>
                  </button>

                  {/* Payment Toggle */}
                  <button
                    onClick={() => setToggles(prev => ({ ...prev, payment: !prev.payment }))}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300 ${
                      toggles.payment
                        ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                        : 'bg-white/5 border-white/10 opacity-50'
                    }`}
                  >
                    <Wallet size={22} className={toggles.payment ? 'text-amber-400' : 'text-gray-500'} />
                    <span className={`text-[9px] font-bold ${toggles.payment ? 'text-amber-400' : 'text-gray-500'}`}>
                      FUNDS
                    </span>
                  </button>

                  {/* Health Toggle */}
                  <button
                    onClick={() => setToggles(prev => ({ ...prev, health: !prev.health }))}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300 ${
                      toggles.health
                        ? 'bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                        : 'bg-white/5 border-white/10 opacity-50'
                    }`}
                  >
                    <HeartPulse size={22} className={toggles.health ? 'text-green-400' : 'text-gray-500'} />
                    <span className={`text-[9px] font-bold ${toggles.health ? 'text-green-400' : 'text-gray-500'}`}>
                      BIO
                    </span>
                  </button>
                </div>
              )}

              {/* QR Code Container with Progress Ring */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  {/* Progress Ring - Only show if not locked */}
                  {!isLocked && (
                    <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="none"
                        stroke={hasSufficientFunds ? '#22c55e' : '#ef4444'}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - progress}
                        className="transition-all duration-1000 ease-linear"
                        style={{
                          filter: hasSufficientFunds ? 'drop-shadow(0 0 8px rgba(34,197,94,0.6))' : 'drop-shadow(0 0 8px rgba(239,68,68,0.6))',
                        }}
                      />
                    </svg>
                  )}

                  {/* Pure White QR Container for Scanner Visibility */}
                  <div 
                    className={`relative w-44 h-44 rounded-2xl overflow-hidden transition-all duration-300 ${isLocked ? 'opacity-30 blur-sm' : ''}`}
                    style={{
                      background: '#FFFFFF',
                      boxShadow: hasSufficientFunds 
                        ? '0 0 0 3px rgba(34,197,94,0.8), 0 0 40px rgba(34,197,94,0.5), 0 0 80px rgba(34,197,94,0.3)'
                        : '0 0 0 3px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.5)',
                      animation: hasSufficientFunds ? 'neonPulseGreen 2s ease-in-out infinite' : 'none',
                    }}
                  >
                    {/* Refresh Animation */}
                    {isRefreshing && !isLocked && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
                        <div className="flex flex-col items-center gap-2">
                          <RefreshCw size={28} className="text-gray-400 animate-spin" />
                          <span className="text-[10px] text-gray-500 font-mono">ENCRYPTING...</span>
                        </div>
                      </div>
                    )}

                    {/* Success Overlay */}
                    {showSuccess && (
                      <div className="absolute inset-0 z-30 flex items-center justify-center bg-green-500"
                        style={{ animation: 'successFlash 1.5s ease-out' }}
                      >
                        <Check className="w-20 h-20 text-white" strokeWidth={3} />
                      </div>
                    )}

                    {/* QR Code - Pure Black on Pure White for maximum contrast */}
                    <div className={`w-full h-full flex items-center justify-center p-4 transition-all duration-300 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>
                      <QRCodeSVG
                        key={qrKey}
                        value={generateQRData()}
                        size={160}
                        level="H"
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                      />
                    </div>
                  </div>

                  {/* Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-red-500/90 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.6)]">
                        <Lock className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Reload Button - Show if locked or low balance */}
              {isLocked && (
                <div className="mb-4">
                  <button
                    onClick={handleQuickReload}
                    disabled={isReloading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold flex items-center justify-center gap-2 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
                  >
                    {isReloading ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <Zap size={18} />
                    )}
                    Add Funds to Ghost Pass
                  </button>
                </div>
              )}

              {/* Timer - Only show if not locked */}
              {!isLocked && (
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <div className={`w-2 h-2 rounded-full ${timeLeft <= 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                    <span className="text-xs text-gray-400">
                      Refreshes in <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Privacy Note */}
              <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                {isLocked 
                  ? 'Add funds to activate your Ghost™ Pass'
                  : 'This code encrypts your selected data for 30 seconds. No raw data is shared with the venue.'
                }
              </p>

              {/* Demo: Simulate Scan Success */}
              {!isLocked && (
                <div className="mt-4 text-center">
                  <button
                    onClick={handleScanSuccess}
                    className="text-[10px] text-gray-600 hover:text-gray-400 underline transition-colors"
                  >
                    [Demo: Simulate Scan]
                  </button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* POS Tipping Modal */}
      <Dialog open={showTippingModal} onOpenChange={setShowTippingModal}>
        <DialogContent className="max-w-sm w-[95vw] p-0 border-0 bg-transparent shadow-none [&>button]:hidden">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            
            <div className="relative z-10 p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white mb-2">Transaction Details</h2>
                {activeVenue && (
                  <p className="text-sm text-gray-400">{activeVenue.venue_name}</p>
                )}
              </div>

              {pendingPOSTransaction && (
                <>
                  {/* Transaction Amount */}
                  <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Item Total</span>
                      <span className="text-white font-bold text-lg">${pendingPOSTransaction.base_amount.toFixed(2)}</span>
                    </div>
                    {selectedTip !== null && (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400 text-sm">Tip ({selectedTip}%)</span>
                          <span className="text-amber-400 font-medium">
                            ${((pendingPOSTransaction.base_amount * selectedTip) / 100).toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t border-white/10 pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-medium">Total</span>
                            <span className="text-green-400 font-bold text-xl">
                              ${(pendingPOSTransaction.base_amount + (pendingPOSTransaction.base_amount * selectedTip) / 100).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10">
                      <span className="text-gray-500 text-xs">New Balance After</span>
                      <span className="text-gray-300 text-sm">
                        ${(balance - pendingPOSTransaction.base_amount - (selectedTip ? (pendingPOSTransaction.base_amount * selectedTip) / 100 : 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Tip Selection */}
                  <div className="mb-6">
                    <p className="text-center text-gray-400 text-sm mb-3">Select Tip Amount</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[18, 25, 33].map((tipPercent) => (
                        <button
                          key={tipPercent}
                          onClick={() => setSelectedTip(tipPercent)}
                          className={`py-4 px-3 rounded-xl font-bold text-lg transition-all ${
                            selectedTip === tipPercent
                              ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                              : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                          }`}
                        >
                          {tipPercent}%
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedTip(0)}
                      className={`w-full mt-3 py-2 rounded-lg text-sm transition-all ${
                        selectedTip === 0
                          ? 'bg-gray-600 text-white'
                          : 'bg-transparent text-gray-500 hover:text-gray-400'
                      }`}
                    >
                      No Tip
                    </button>
                  </div>

                  {/* Confirm Button */}
                  <button
                    onClick={handleConfirmTransaction}
                    disabled={selectedTip === null || isConfirmingTransaction}
                    className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:from-green-400 hover:to-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isConfirmingTransaction ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : (
                      <Check size={20} />
                    )}
                    AGREE & PAY
                  </button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CSS Animations */}
      <style>{`
        @keyframes ghostBreathing {
          0%, 100% {
            box-shadow: 0 0 0 2px rgba(255,215,0,0.4), 0 0 30px rgba(255,215,0,0.4), 0 0 60px rgba(34,197,94,0.3);
          }
          50% {
            box-shadow: 0 0 0 3px rgba(255,215,0,0.6), 0 0 50px rgba(255,215,0,0.6), 0 0 80px rgba(34,197,94,0.5);
          }
        }

        @keyframes slideUpEnergize {
          0% {
            opacity: 0;
            transform: translateY(100px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes neonPulseGreen {
          0%, 100% {
            box-shadow: 0 0 0 3px rgba(34,197,94,0.8), 0 0 40px rgba(34,197,94,0.5), 0 0 80px rgba(34,197,94,0.3);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(34,197,94,1), 0 0 60px rgba(34,197,94,0.7), 0 0 100px rgba(34,197,94,0.5);
          }
        }

        @keyframes successFlash {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          20% {
            opacity: 1;
            transform: scale(1.05);
          }
          40% {
            transform: scale(1);
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes yellowGlowPulse {
          0%, 100% {
            border-color: rgba(255, 215, 0, 0.5);
            box-shadow: 0 0 12px rgba(255, 215, 0, 0.25), 0 0 25px rgba(255, 215, 0, 0.1);
          }
          50% {
            border-color: rgba(255, 215, 0, 0.8);
            box-shadow: 0 0 18px rgba(255, 215, 0, 0.4), 0 0 35px rgba(255, 215, 0, 0.2);
          }
        }
      `}</style>
    </>
  );
};

export default GhostPassModal;