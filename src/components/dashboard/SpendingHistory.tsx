import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Receipt, Clock, TrendingUp, AlertTriangle, Bell } from "lucide-react";
import { toast } from "sonner";

interface BarTabCharge {
  id: string;
  amount: number;
  description: string | null;
  created_at: string;
  pos_reference: string | null;
}

interface SpendingHistoryProps {
  transactionId: string;
  spendingLimit: number;
  currentSpend: number;
}

export const SpendingHistory = ({ transactionId, spendingLimit, currentSpend }: SpendingHistoryProps) => {
  const [charges, setCharges] = useState<BarTabCharge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!transactionId) return;

    // Load existing charges
    loadCharges();

    // Set up real-time subscription for new charges
    const channel = supabase
      .channel(`charges-${transactionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bar_tab_charges',
          filter: `transaction_id=eq.${transactionId}`
        },
        (payload) => {
          console.log("New charge received:", payload);
          const newCharge = payload.new as BarTabCharge;
          
          // Add to charges list
          setCharges(prev => [newCharge, ...prev]);
          
          // Calculate new total for notifications
          const newTotal = currentSpend + newCharge.amount;
          
          // Show notification for new charge
          toast.info(
            `New charge: $${newCharge.amount.toFixed(2)}${newCharge.description ? ` - ${newCharge.description}` : ''}`,
            { 
              duration: 4000,
              icon: <Receipt className="h-4 w-4" />
            }
          );
          
          // Spending limit notifications
          if (newTotal >= spendingLimit) {
            toast.error("🚨 Spending limit reached! Bar tab closed.", { 
              duration: 10000,
              icon: <AlertTriangle className="h-5 w-5" />
            });
          } else if (newTotal >= spendingLimit * 0.9) {
            toast.warning("⚠️ 90% of spending limit reached!", { 
              duration: 6000,
              icon: <Bell className="h-4 w-4" />
            });
          } else if (newTotal >= spendingLimit * 0.75) {
            toast.warning("75% of spending limit used", { 
              duration: 4000 
            });
          } else if (newTotal >= spendingLimit * 0.5) {
            toast(
              `50% of limit used ($${newTotal.toFixed(2)} / $${spendingLimit})`,
              { duration: 3000 }
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [transactionId, spendingLimit, currentSpend]);

  const loadCharges = async () => {
    try {
      const { data, error } = await supabase
        .from("bar_tab_charges")
        .select("*")
        .eq("transaction_id", transactionId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCharges(data || []);
    } catch (error) {
      console.error("Failed to load charges:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) return "Today";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (charges.length === 0 && !loading) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No charges yet</p>
        <p className="text-xs">Charges will appear here in real-time</p>
      </div>
    );
  }

  return (
    <Card className="border-gray-300 dark:border-gray-600">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm flex items-center gap-2">
          <History className="h-4 w-4" />
          Spending History
          {charges.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {charges.length} {charges.length === 1 ? 'charge' : 'charges'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <ScrollArea className="h-[200px]">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-4 w-16 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {charges.map((charge, index) => (
                <div 
                  key={charge.id} 
                  className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                    index === 0 ? 'bg-primary/10 border border-primary/20 animate-pulse-once' : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {charge.description || "Bar Tab Charge"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(charge.created_at)} at {formatTime(charge.created_at)}
                      </span>
                      {charge.pos_reference && (
                        <span className="text-xs text-muted-foreground">
                          #{charge.pos_reference}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="font-mono font-bold text-sm">
                      ${charge.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {charges.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Total Spent
            </div>
            <div className="font-mono font-bold">
              ${currentSpend.toFixed(2)}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                / ${spendingLimit.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingHistory;
