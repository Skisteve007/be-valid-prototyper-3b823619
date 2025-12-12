import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Ghost, Check, X, Fingerprint, Wallet, HeartPulse, RefreshCw, Lock, Unlock, Zap, MapPin, ChevronDown, Clock, ArrowUp, FlaskConical } from 'lucide-react';
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
  tox: boolean;
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

interface Venue {
  id: string;
  venue_name: string;
  city: string;
}

const ACCESS_PASS_OPTIONS = [
  { id: '1_day', duration_hrs: 24, price: 10.00, label: "1-Day" },
  { id: '3_day', duration_hrs: 72, price: 20.00, label: "3-Day" },
  { id: '7_day', duration_hrs: 168, price: 50.00, label: "7-Day" },
];

const PAYMENT_METHODS = [
  { id: 'apple_pay', label: 'Apple Pay' },
  { id: 'google_pay', label: 'Google Pay' },
  { id: 'credit_card', label: 'Credit Card' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'venmo', label: 'Venmo' },
  { id: 'cash_app', label: 'Cash App' },
  { id: 'coinbase', label: 'Coinbase' },
  { id: 'zelle', label: 'Zelle' },
];

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
    tox: false,
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [qrKey, setQrKey] = useState(Date.now());
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Draggable button state (desktop only)
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Financial state
  const [balance, setBalance] = useState(0);
  const [venueSpend, setVenueSpend] = useState(0);
  const [displayedBalance, setDisplayedBalance] = useState(0);
  const [displayedSpent, setDisplayedSpent] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  
  // Venue & Access Pass State
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedPass, setSelectedPass] = useState(ACCESS_PASS_OPTIONS[0]);
  const [isActivated, setIsActivated] = useState(false);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  
  // Fund Wallet State
  const [fundAmount, setFundAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isLoadingFunds, setIsLoadingFunds] = useState(false);
  
  // Active venue state (from session)
  const [activeVenue, setActiveVenue] = useState<ActiveVenue | null>(null);
  
  // POS Transaction state
  const [pendingPOSTransaction, setPendingPOSTransaction] = useState<POSTransaction | null>(null);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [showTippingModal, setShowTippingModal] = useState(false);
  const [isConfirmingTransaction, setIsConfirmingTransaction] = useState(false);
  
  // UI State
  const [activeSection, setActiveSection] = useState<'destination' | 'duration' | 'wallet' | null>(null);
  
  const prevBalanceRef = useRef(balance);
  const prevSpentRef = useRef(venueSpend);

  // Fetch venues
  const fetchVenues = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_public_venues');
      if (error) throw error;
      setVenues(data || []);
    } catch (err) {
      console.error('Error fetching venues:', err);
    }
  }, []);

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

  // Set up initial data fetch and Supabase Realtime subscription
  useEffect(() => {
    if (!userId) return;

    fetchBalance();
    fetchVenueSpend();
    fetchActiveVenue();
    fetchVenues();

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
  }, [userId, fetchBalance, fetchVenueSpend, fetchActiveVenue, fetchVenues]);

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
  const isLocked = balance < MIN_BALANCE_THRESHOLD && !isActivated;
  const canActivate = selectedVenue && balance >= selectedPass.price && !isActivated;

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
    
    if (isActivated && selectedVenue && expirationDate) {
      return JSON.stringify({
        id: qrKey,
        userId,
        type: 'ACCESS_TOKEN',
        venueId: selectedVenue.id,
        venueName: selectedVenue.venue_name,
        tier: selectedPass.label,
        expires: expirationDate.toISOString(),
        balance: balance.toFixed(2),
        permissions: {
          identity: toggles.identity,
          payment: toggles.payment,
          health: toggles.health,
          tox: toggles.tox,
        },
      });
    }
    
    const data = {
      id: qrKey,
      userId,
      venueId: activeVenue?.id || selectedVenue?.id || null,
      permissions: {
        identity: toggles.identity,
        payment: toggles.payment,
        health: toggles.health,
        tox: toggles.tox,
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

  // Handle loading funds
  const handleLoadFunds = async () => {
    if (!fundAmount || parseFloat(fundAmount) < 50) {
      toast.error('Minimum load is $50');
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error('Select a payment method');
      return;
    }

    setIsLoadingFunds(true);
    
    // For demo, simulate adding funds
    const amount = parseFloat(fundAmount);
    setTimeout(() => {
      setBalance(prev => prev + amount);
      setDisplayedBalance(prev => prev + amount);
      setFundAmount('');
      toast.success(`Added $${amount.toFixed(2)} to wallet`);
      setIsLoadingFunds(false);
      setActiveSection(null);
    }, 1000);
  };

  // Handle pass activation
  const handleActivate = () => {
    if (!selectedVenue) {
      toast.error('Select a destination first');
      return;
    }
    if (balance < selectedPass.price) {
      toast.error(`Insufficient funds. Need $${selectedPass.price.toFixed(2)}`);
      return;
    }

    // Deduct and activate
    setBalance(prev => prev - selectedPass.price);
    setDisplayedBalance(prev => prev - selectedPass.price);
    setExpirationDate(new Date(Date.now() + selectedPass.duration_hrs * 60 * 60 * 1000));
    setIsActivated(true);
    toast.success(`${selectedPass.label} Access Activated!`);
  };

  // Handle upgrade
  const handleUpgrade = (newPass: typeof ACCESS_PASS_OPTIONS[0]) => {
    const currentIndex = ACCESS_PASS_OPTIONS.findIndex(p => p.id === selectedPass.id);
    const newIndex = ACCESS_PASS_OPTIONS.findIndex(p => p.id === newPass.id);
    
    if (newIndex <= currentIndex) {
      toast.error('Can only upgrade to a higher tier');
      return;
    }
    
    const upgradeCost = newPass.price - selectedPass.price;
    if (balance < upgradeCost) {
      toast.error(`Insufficient funds. Need $${upgradeCost.toFixed(2)} to upgrade`);
      return;
    }

    setBalance(prev => prev - upgradeCost);
    setDisplayedBalance(prev => prev - upgradeCost);
    setSelectedPass(newPass);
    setExpirationDate(new Date(Date.now() + newPass.duration_hrs * 60 * 60 * 1000));
    toast.success(`Upgraded to ${newPass.label} Access!`);
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

  // Desktop drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    e.preventDefault();
    setIsDragging(true);
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isMobile) return;
    const newX = window.innerWidth - e.clientX - (64 - dragOffset.x);
    const newY = window.innerHeight - e.clientY - (64 - dragOffset.y);
    // Keep within bounds
    setButtonPosition({
      x: Math.max(0, Math.min(window.innerWidth - 80, newX)),
      y: Math.max(0, Math.min(window.innerHeight - 80, newY)),
    });
  }, [isDragging, isMobile, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <>
      {/* Floating Ghost Button - Hidden when modal is open */}
      {!isOpen && (
        <button
          ref={buttonRef}
          onClick={() => !isDragging && setIsOpen(true)}
          onMouseDown={handleMouseDown}
          className={`fixed z-[9999] w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
            isDragging ? 'cursor-grabbing scale-110' : 'cursor-pointer active:scale-95'
          } ${!isMobile ? 'hover:scale-105' : ''}`}
          style={{
            right: isMobile ? '16px' : `${16 + buttonPosition.x}px`,
            bottom: isMobile ? '80px' : `${80 + buttonPosition.y}px`,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.95) 100%)',
            boxShadow: isActivated 
              ? '0 0 0 2px rgba(34,197,94,0.6), 0 0 30px rgba(34,197,94,0.5), 0 0 60px rgba(34,197,94,0.3)'
              : hasSufficientFunds 
                ? '0 0 0 2px rgba(255,215,0,0.4), 0 0 30px rgba(255,215,0,0.4), 0 0 60px rgba(34,197,94,0.3)'
                : '0 0 0 2px rgba(239,68,68,0.4), 0 0 30px rgba(239,68,68,0.4)',
            animation: (hasSufficientFunds || isActivated) && !isDragging ? 'ghostBreathing 3s ease-in-out infinite' : 'none',
          }}
        >
          {isLocked ? (
            <Lock className="w-6 h-6 md:w-7 md:h-7 text-red-400" />
          ) : (
            <Ghost className={`w-7 h-7 md:w-8 md:h-8 ${isActivated ? 'text-green-400' : 'text-amber-400'}`} />
          )}
        </button>
      )}

      {/* Ghost QR Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="max-w-md w-[95vw] p-0 border-0 bg-transparent shadow-none [&>button]:hidden top-[10%] translate-y-[-10%] max-h-[85vh] overflow-y-auto"
          style={{
            animation: 'slideUpEnergize 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Modal Container with Dark Blur */}
          <div 
            className="relative rounded-3xl overflow-hidden"
            style={{
              border: isActivated ? '2px solid rgba(34, 197, 94, 0.6)' : '2px solid rgba(255, 215, 0, 0.6)',
              boxShadow: isActivated 
                ? '0 0 15px rgba(34, 197, 94, 0.3), 0 0 30px rgba(34, 197, 94, 0.15)'
                : '0 0 15px rgba(255, 215, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.15)',
              animation: 'yellowGlowPulse 2.5s ease-in-out infinite',
            }}
          >
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            
            {/* Content */}
            <div className="relative z-10 p-5">
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
                  <Ghost className={`w-5 h-5 ${isActivated ? 'text-green-400' : 'text-amber-400'}`} />
                  <h2 className="text-lg font-bold tracking-wider text-white">
                    GHOST<sup className="text-xs text-amber-400">™</sup> PASS
                  </h2>
                  {isActivated && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-green-500 text-black rounded-full animate-pulse">
                      LIVE
                    </span>
                  )}
                </div>
              </div>

              {/* QR Code Container with Progress Ring - MOVED ABOVE PILLS */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  {/* Progress Ring */}
                  <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r={90}
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r={90}
                      fill="none"
                      stroke={isActivated ? '#22c55e' : '#fbbf24'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 90}
                      strokeDashoffset={(2 * Math.PI * 90) - ((30 - timeLeft) / 30) * (2 * Math.PI * 90)}
                      className="transition-all duration-1000 ease-linear"
                      style={{
                        filter: isActivated ? 'drop-shadow(0 0 6px rgba(34,197,94,0.6))' : 'drop-shadow(0 0 6px rgba(251,191,36,0.6))',
                      }}
                    />
                  </svg>

                  {/* Pure White QR Container - BIGGER */}
                  <div 
                    className="relative w-44 h-44 rounded-xl overflow-hidden transition-all duration-300"
                    style={{
                      background: '#FFFFFF',
                      boxShadow: isActivated 
                        ? '0 0 0 2px rgba(34,197,94,0.8), 0 0 30px rgba(34,197,94,0.4)'
                        : '0 0 0 2px rgba(251,191,36,0.8), 0 0 30px rgba(251,191,36,0.4)',
                    }}
                  >
                    {/* Refresh Animation */}
                    {isRefreshing && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
                        <RefreshCw size={24} className="text-gray-400 animate-spin" />
                      </div>
                    )}

                    {/* Success Overlay */}
                    {showSuccess && (
                      <div className="absolute inset-0 z-30 flex items-center justify-center bg-green-500">
                        <Check className="w-16 h-16 text-white" strokeWidth={3} />
                      </div>
                    )}

                    {/* QR Code - BIGGER */}
                    <div className={`w-full h-full flex items-center justify-center p-3 transition-all duration-300 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>
                      <QRCodeSVG
                        key={qrKey}
                        value={generateQRData()}
                        size={156}
                        level="H"
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Timer - MOVED BELOW QR */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <div className={`w-1.5 h-1.5 rounded-full ${timeLeft <= 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                  <span className="text-[10px] text-gray-400">
                    Refreshes in <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
                  </span>
                </div>
              </div>

              {/* ===== CONTROL PILLS ===== */}
              <div className="space-y-2 mb-4">
                {/* Pill 1: Destination */}
                <div 
                  className={`rounded-xl border transition-all cursor-pointer ${
                    activeSection === 'destination' 
                      ? 'bg-blue-500/20 border-blue-500' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setActiveSection(activeSection === 'destination' ? null : 'destination')}
                >
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-4 h-4 ${selectedVenue ? 'text-blue-400' : 'text-gray-500'}`} />
                      <span className="text-xs font-bold text-blue-400 uppercase">Destination</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white">
                        {selectedVenue ? selectedVenue.venue_name : 'Select Venue'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${activeSection === 'destination' ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  {activeSection === 'destination' && (
                    <div className="px-3 pb-3">
                      <select
                        className="w-full bg-black/50 text-white p-2 rounded-lg border border-white/20 text-sm focus:border-blue-500 outline-none"
                        value={selectedVenue?.id || ''}
                        onChange={(e) => {
                          const venue = venues.find(v => v.id === e.target.value);
                          setSelectedVenue(venue || null);
                          if (isActivated) setIsActivated(false);
                          setActiveSection(null);
                        }}
                        disabled={isActivated}
                      >
                        <option value="">-- Select Venue --</option>
                        {venues.map(v => (
                          <option key={v.id} value={v.id}>{v.venue_name} ({v.city})</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Pill 2: Access Duration */}
                <div 
                  className={`rounded-xl border transition-all cursor-pointer ${
                    activeSection === 'duration' 
                      ? 'bg-amber-500/20 border-amber-500' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setActiveSection(activeSection === 'duration' ? null : 'duration')}
                >
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${selectedPass ? 'text-amber-400' : 'text-gray-500'}`} />
                      <span className="text-xs font-bold text-amber-400 uppercase">Access Duration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white">{selectedPass.label} - ${selectedPass.price}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${activeSection === 'duration' ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  {activeSection === 'duration' && (
                    <div className="px-3 pb-3">
                      <div className="grid grid-cols-3 gap-2">
                        {ACCESS_PASS_OPTIONS.map(opt => {
                          const isCurrentOrLower = isActivated && ACCESS_PASS_OPTIONS.findIndex(p => p.id === opt.id) <= ACCESS_PASS_OPTIONS.findIndex(p => p.id === selectedPass.id);
                          return (
                            <button
                              key={opt.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isActivated) {
                                  handleUpgrade(opt);
                                } else {
                                  setSelectedPass(opt);
                                }
                                setActiveSection(null);
                              }}
                              disabled={isCurrentOrLower}
                              className={`py-2 px-2 rounded-lg border text-xs font-bold transition-all ${
                                selectedPass.id === opt.id 
                                  ? 'bg-amber-500 text-black border-amber-500' 
                                  : isCurrentOrLower
                                    ? 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed'
                                    : 'bg-black/50 text-gray-300 border-white/20 hover:border-amber-500/50'
                              }`}
                            >
                              <div>{opt.label}</div>
                              <div className="text-[10px] opacity-75">${opt.price}</div>
                            </button>
                          );
                        })}
                      </div>
                      {isActivated && (
                        <p className="text-[10px] text-amber-400/70 text-center mt-2">
                          <ArrowUp className="w-3 h-3 inline mr-1" />
                          Select a higher tier to upgrade
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Pill 3: Fund Wallet */}
                <div 
                  className={`rounded-xl border transition-all cursor-pointer ${
                    activeSection === 'wallet' 
                      ? 'bg-green-500/20 border-green-500' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setActiveSection(activeSection === 'wallet' ? null : 'wallet')}
                >
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-bold text-green-400 uppercase">Fund Wallet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${balance >= selectedPass.price ? 'text-green-400' : 'text-red-400'}`}>
                        ${displayedBalance.toFixed(2)}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${activeSection === 'wallet' ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  {activeSection === 'wallet' && (
                    <div className="px-3 pb-3 space-y-2" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-bold">$</span>
                        <input 
                          type="number" 
                          placeholder="Amount (Min $50)"
                          value={fundAmount} 
                          onChange={e => setFundAmount(e.target.value)}
                          className="flex-1 bg-black/50 text-white p-2 rounded-lg border border-white/20 text-sm focus:border-green-500 outline-none"
                        />
                      </div>
                      <select 
                        value={selectedPaymentMethod}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="w-full bg-black/50 text-white p-2 rounded-lg border border-white/20 text-sm focus:border-green-500 outline-none"
                      >
                        <option value="">-- Payment Method --</option>
                        {PAYMENT_METHODS.map(pm => (
                          <option key={pm.id} value={pm.id}>{pm.label}</option>
                        ))}
                      </select>
                      <button 
                        onClick={handleLoadFunds}
                        disabled={isLoadingFunds}
                        className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500 text-green-400 font-bold py-2 rounded-lg text-sm transition-all disabled:opacity-50"
                      >
                        {isLoadingFunds ? 'Loading...' : 'Load Funds'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Activate / Upgrade Button */}
              {!isActivated ? (
              <button 
                  onClick={handleActivate}
                  disabled={!canActivate}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all mb-4 ${
                    canActivate 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                      : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                  }`}
                >
                  {balance < selectedPass.price 
                    ? `Need $${(selectedPass.price - balance).toFixed(2)} More`
                    : `ACTIVATE ${selectedPass.label.toUpperCase()} (-$${selectedPass.price})`
                  }
                </button>
              ) : (
                <div className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/40 text-center">
                  <p className="text-sm text-green-400 font-bold">
                    {selectedPass.label} Access Active at {selectedVenue?.venue_name}
                  </p>
                  {expirationDate && (
                    <p className="text-[10px] text-green-400/70 mt-1">
                      Expires: {expirationDate.toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Share Control Header */}
              <p className="text-center text-white font-bold text-sm uppercase tracking-widest mb-3">CHOOSE YOUR SHARE</p>

              {/* Permission Toggles - User-controlled sharing */}
              <div className="flex justify-center gap-3 mb-4">
                {/* ID Toggle - Kill Blue/Cyan */}
                <button
                  onClick={() => setToggles(prev => ({ ...prev, identity: !prev.identity }))}
                  className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-300 ${
                    toggles.identity
                      ? 'bg-cyan-500/30 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.5)]'
                      : 'bg-cyan-500/10 border-cyan-400/30'
                  }`}
                >
                  <div className="absolute -top-2 -right-2 bg-black rounded-full p-0.5">
                    {toggles.identity ? (
                      <Unlock size={16} className="text-cyan-400" strokeWidth={3} />
                    ) : (
                      <Lock size={16} className="text-cyan-400/50" strokeWidth={3} />
                    )}
                  </div>
                  <Fingerprint size={24} className={toggles.identity ? 'text-cyan-400' : 'text-cyan-400/50'} />
                  <span className={`text-[9px] font-bold ${toggles.identity ? 'text-cyan-400' : 'text-cyan-400/50'}`}>ID</span>
                </button>

                {/* FUNDS Toggle - Green */}
                <button
                  onClick={() => setToggles(prev => ({ ...prev, payment: !prev.payment }))}
                  className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-300 ${
                    toggles.payment
                      ? 'bg-green-500/30 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                      : 'bg-green-500/10 border-green-400/30'
                  }`}
                >
                  <div className="absolute -top-2 -right-2 bg-black rounded-full p-0.5">
                    {toggles.payment ? (
                      <Unlock size={16} className="text-green-400" strokeWidth={3} />
                    ) : (
                      <Lock size={16} className="text-green-400/50" strokeWidth={3} />
                    )}
                  </div>
                  <Wallet size={24} className={toggles.payment ? 'text-green-400' : 'text-green-400/50'} />
                  <span className={`text-[9px] font-bold ${toggles.payment ? 'text-green-400' : 'text-green-400/50'}`}>FUNDS</span>
                </button>

                {/* BIO Toggle - Light Red (like header buttons) */}
                <button
                  onClick={() => setToggles(prev => ({ ...prev, health: !prev.health }))}
                  className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-300 ${
                    toggles.health
                      ? 'bg-rose-500/30 border-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.5)]'
                      : 'bg-rose-500/10 border-rose-400/30'
                  }`}
                >
                  <div className="absolute -top-2 -right-2 bg-black rounded-full p-0.5">
                    {toggles.health ? (
                      <Unlock size={16} className="text-rose-400" strokeWidth={3} />
                    ) : (
                      <Lock size={16} className="text-rose-400/50" strokeWidth={3} />
                    )}
                  </div>
                  <HeartPulse size={24} className={toggles.health ? 'text-rose-400' : 'text-rose-400/50'} />
                  <span className={`text-[9px] font-bold ${toggles.health ? 'text-rose-400' : 'text-rose-400/50'}`}>BIO</span>
                </button>

                {/* TOX Toggle - Yellow */}
                <button
                  onClick={() => setToggles(prev => ({ ...prev, tox: !prev.tox }))}
                  className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-300 ${
                    toggles.tox
                      ? 'bg-yellow-500/30 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)]'
                      : 'bg-yellow-500/10 border-yellow-400/30'
                  }`}
                >
                  <div className="absolute -top-2 -right-2 bg-black rounded-full p-0.5">
                    {toggles.tox ? (
                      <Unlock size={16} className="text-yellow-400" strokeWidth={3} />
                    ) : (
                      <Lock size={16} className="text-yellow-400/50" strokeWidth={3} />
                    )}
                  </div>
                  <FlaskConical size={24} className={toggles.tox ? 'text-yellow-400' : 'text-yellow-400/50'} />
                  <span className={`text-[9px] font-bold ${toggles.tox ? 'text-yellow-400' : 'text-yellow-400/50'}`}>TOX</span>
                </button>
              </div>


              {/* Privacy Note */}
              <p className="text-xs text-white text-center leading-relaxed font-bold uppercase tracking-wide">
                THIS CODE ENCRYPTS YOUR SELECTED DATA FOR 30 SECONDS. NO RAW DATA IS SHARED WITH THE VENUE.
              </p>
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
            box-shadow: 0 0 0 3px rgba(255,215,0,0.6), 0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(34,197,94,0.4);
          }
        }
        
        @keyframes yellowGlowPulse {
          0%, 100% {
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.15);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2);
          }
        }
        
        @keyframes slideUpEnergize {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
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
            box-shadow: 0 0 0 4px rgba(34,197,94,0.9), 0 0 50px rgba(34,197,94,0.6), 0 0 100px rgba(34,197,94,0.4);
          }
        }
        
        @keyframes successFlash {
          0% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0; transform: scale(1); }
        }
      `}</style>
    </>
  );
};

export default GhostPassModal;
