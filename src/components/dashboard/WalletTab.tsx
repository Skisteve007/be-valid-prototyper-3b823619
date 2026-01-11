import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Wallet, RefreshCw, Zap, QrCode, ArrowUp, Lock, Unlock, Ghost, CreditCard, DollarSign } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WalletTabProps {
  userId: string;
  onOpenGhostPass?: () => void;
}

const MIN_BALANCE_THRESHOLD = 5.00;

export const WalletTab = ({ userId, onOpenGhostPass }: WalletTabProps) => {
  const [balance, setBalance] = useState(0);
  const [displayedBalance, setDisplayedBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [venueSpend, setVenueSpend] = useState(0);
  const [displayedSpent, setDisplayedSpent] = useState(0);
  
  // QR Code state
  const [qrKey, setQrKey] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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

  // Set up initial data fetch and Supabase Realtime subscription
  useEffect(() => {
    if (!userId) return;

    fetchBalance();
    fetchVenueSpend();

    // Subscribe to wallet_transactions for real-time updates
    const walletChannel = supabase
      .channel(`wallet-tab-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'wallet_transactions',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newTransaction = payload.new as {
            balance_after: number;
            transaction_type: string;
            amount: number;
          };
          
          setBalance(newTransaction.balance_after);
          
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

    return () => {
      supabase.removeChannel(walletChannel);
    };
  }, [userId, fetchBalance, fetchVenueSpend]);

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

  // QR refresh
  const refreshQR = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setQrKey(Date.now());
      setTimeLeft(30);
      setIsRefreshing(false);
    }, 500);
  }, []);

  // Countdown timer for QR
  useEffect(() => {
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
  }, [refreshQR]);

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

  const hasSufficientFunds = balance >= MIN_BALANCE_THRESHOLD;

  // Generate QR data
  const generateQRData = () => {
    return JSON.stringify({
      id: qrKey,
      userId,
      type: 'WALLET_TOKEN',
      balance: balance.toFixed(2),
      expires: Date.now() + 30000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Wallet className="w-6 h-6 text-amber-400" />
          Ghost Wallet™
        </h2>
        <p className="text-[#E0E0E0]/60 text-sm mt-1">Your secure payment & access wallet</p>
      </div>

      {/* Balance Card */}
      <Card className="backdrop-blur-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border-amber-500/30 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {hasSufficientFunds ? (
                <Unlock className="w-5 h-5 text-green-400" />
              ) : (
                <Lock className="w-5 h-5 text-red-400" />
              )}
              <span className={`text-sm font-medium ${hasSufficientFunds ? 'text-green-400' : 'text-red-400'}`}>
                {hasSufficientFunds ? 'Wallet Active' : 'Low Balance'}
              </span>
            </div>
            <Button
              onClick={handleQuickReload}
              disabled={isReloading}
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold"
            >
              {isReloading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-1" />
                  Add Funds
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Balance */}
            <div className="bg-black/30 rounded-xl p-4 border border-amber-500/20">
              <div className="text-xs text-[#E0E0E0]/60 mb-1">Available Balance</div>
              <div className="text-2xl font-bold text-amber-400">
                ${isLoadingBalance ? '---' : displayedBalance.toFixed(2)}
              </div>
            </div>

            {/* Today's Spend */}
            <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20">
              <div className="text-xs text-[#E0E0E0]/60 mb-1">Today's Spend</div>
              <div className="text-2xl font-bold text-cyan-400">
                ${displayedSpent.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Section */}
      <Card className="backdrop-blur-xl bg-black/40 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-400" />
            Wallet QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className={`relative ${isRefreshing ? 'animate-pulse' : ''}`}>
            {/* QR Container */}
            <div className={`p-4 rounded-2xl ${hasSufficientFunds ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border-2 border-amber-500/40' : 'bg-red-500/10 border-2 border-red-500/40'}`}>
              <QRCodeSVG
                value={generateQRData()}
                size={180}
                bgColor="transparent"
                fgColor={hasSufficientFunds ? "#FCD34D" : "#EF4444"}
                level="H"
                includeMargin={false}
              />
            </div>
            
            {/* Timer */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-black/80 px-3 py-1 rounded-full border border-amber-500/40 flex items-center gap-1">
              <RefreshCw className={`w-3 h-3 ${timeLeft <= 5 ? 'text-red-400 animate-spin' : 'text-amber-400'}`} />
              <span className={`text-xs font-mono ${timeLeft <= 5 ? 'text-red-400' : 'text-amber-400'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>

          <p className="text-xs text-[#E0E0E0]/50 mt-6 text-center">
            Show this QR code for payments & venue access
          </p>

          <Button
            onClick={refreshQR}
            variant="outline"
            size="sm"
            className="mt-3 border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Code
          </Button>
        </CardContent>
      </Card>

      {/* Ghost Pass Integration */}
      <Card className="backdrop-blur-xl bg-black/40 border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Ghost className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-[#E0E0E0]">Ghost Pass™</h3>
                <p className="text-xs text-[#E0E0E0]/60">Full access management & permissions</p>
              </div>
            </div>
            <Button
              onClick={onOpenGhostPass}
              className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30"
            >
              <Ghost className="w-4 h-4 mr-2" />
              Open Pass
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="backdrop-blur-xl bg-black/40 border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer">
          <CardContent className="p-4 flex flex-col items-center">
            <CreditCard className="w-8 h-8 text-cyan-400 mb-2" />
            <span className="text-sm text-[#E0E0E0]/80">Payment Methods</span>
            <span className="text-xs text-[#E0E0E0]/40 mt-1">Coming Soon</span>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-black/40 border-white/10 hover:border-green-500/40 transition-all cursor-pointer">
          <CardContent className="p-4 flex flex-col items-center">
            <DollarSign className="w-8 h-8 text-green-400 mb-2" />
            <span className="text-sm text-[#E0E0E0]/80">Transaction History</span>
            <span className="text-xs text-[#E0E0E0]/40 mt-1">Coming Soon</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletTab;
