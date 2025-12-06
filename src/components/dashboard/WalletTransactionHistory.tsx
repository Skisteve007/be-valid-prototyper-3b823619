import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Minus, 
  Calendar, 
  CreditCard, 
  Wallet, 
  Clock,
  RefreshCw,
  Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface WalletTransaction {
  id: string;
  transaction_type: 'refill' | 'pass_purchase' | 'bar_charge';
  amount: number;
  balance_after: number;
  payment_method: string | null;
  payment_reference: string | null;
  pass_label: string | null;
  pass_duration_hrs: number | null;
  description: string | null;
  status: string;
  created_at: string;
}

interface WalletTransactionHistoryProps {
  userId: string;
  onBalanceUpdate?: (balance: number) => void;
}

export const WalletTransactionHistory = ({ userId, onBalanceUpdate }: WalletTransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    loadTransactions();
  }, [userId]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading transactions:', error);
        return;
      }

      // Type assertion since we know the structure matches
      const typedData = (data || []) as unknown as WalletTransaction[];
      setTransactions(typedData);
      
      // Get current balance from most recent transaction
      if (typedData.length > 0) {
        const balance = typedData[0].balance_after;
        setCurrentBalance(balance);
        onBalanceUpdate?.(balance);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'refill':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'pass_purchase':
        return <Calendar className="h-4 w-4 text-amber-600" />;
      case 'bar_charge':
        return <Minus className="h-4 w-4 text-red-600" />;
      default:
        return <Receipt className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'refill':
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Refill</Badge>;
      case 'pass_purchase':
        return <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30">Pass</Badge>;
      case 'bar_charge':
        return <Badge className="bg-red-500/20 text-red-700 border-red-500/30">Charge</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const formatAmount = (type: string, amount: number) => {
    const isPositive = type === 'refill';
    return (
      <span className={isPositive ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
        {isPositive ? '+' : '-'}${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="h-5 w-5 text-blue-600" />
            Wallet History
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={loadTransactions} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {/* Current Balance */}
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 mt-2">
          <p className="text-xs text-muted-foreground">Current Balance</p>
          <p className="text-2xl font-bold text-green-600">
            ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs mt-1">Refill your wallet to get started</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-3">
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div 
                  key={tx.id} 
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-muted">
                    {getTransactionIcon(tx.transaction_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getTransactionBadge(tx.transaction_type)}
                        {tx.pass_label && (
                          <span className="text-xs text-muted-foreground">{tx.pass_label}</span>
                        )}
                      </div>
                      {formatAmount(tx.transaction_type, tx.amount)}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {tx.description || 'Transaction'}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(tx.created_at), 'MMM d, h:mm a')}
                      </span>
                      {tx.payment_method && (
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          {tx.payment_method}
                        </span>
                      )}
                      <span className="ml-auto">
                        Bal: ${tx.balance_after.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
