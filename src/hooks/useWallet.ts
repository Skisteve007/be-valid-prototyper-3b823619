import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  daily_funded_amount: number;
  monthly_funded_amount: number;
}

interface WalletTransaction {
  id: string;
  amount: number;
  convenience_fee: number;
  total_charged: number;
  payment_method: string;
  status: string;
  created_at: string;
  credited_at: string | null;
}

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Get or create wallet
      const { data: walletData, error: walletError } = await supabase
        .rpc('get_or_create_wallet', { p_user_id: user.id });

      if (walletError) throw walletError;
      setWallet(walletData);

      // Get recent transactions
      const { data: txData, error: txError } = await supabase
        .from('wallet_funding_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (txError) throw txError;
      setTransactions(txData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const refetch = () => {
    setLoading(true);
    fetchWallet();
  };

  return { wallet, transactions, loading, error, refetch };
}
