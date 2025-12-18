import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, Plus, History, RefreshCw, Info } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { FundWalletDialog } from "./FundWalletDialog";
import { FeeScheduleModal } from "./FeeScheduleModal";
import { format } from "date-fns";

export function WalletHome() {
  const { wallet, transactions, loading, refetch } = useWallet();
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [feeModalOpen, setFeeModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              GHOST™ Wallet
            </div>
            <Button variant="ghost" size="icon" onClick={refetch}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary mb-4">
            ${(wallet?.balance || 0).toFixed(2)}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setFundDialogOpen(true)} className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
            <Button variant="outline" size="icon" onClick={() => setFeeModalOpen(true)}>
              <Info className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Limits Display */}
          <div className="mt-4 pt-4 border-t border-border/50 space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Daily added:</span>
              <span>${(wallet?.daily_funded_amount || 0).toFixed(2)} / $5,000</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly added:</span>
              <span>${(wallet?.monthly_funded_amount || 0).toFixed(2)} / $10,000</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5" />
            Recent Funding Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No funding transactions yet
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <div className="font-medium">
                      +${tx.amount.toFixed(2)} credited
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(tx.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Fee: ${tx.convenience_fee.toFixed(2)} • Total: ${tx.total_charged.toFixed(2)}
                    </div>
                  </div>
                  <Badge
                    variant={tx.status === "completed" ? "default" : "secondary"}
                    className={tx.status === "completed" ? "bg-green-500/20 text-green-600" : ""}
                  >
                    {tx.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <FundWalletDialog 
        open={fundDialogOpen} 
        onOpenChange={setFundDialogOpen}
        wallet={wallet}
        onSuccess={refetch}
      />
      
      <FeeScheduleModal 
        open={feeModalOpen} 
        onOpenChange={setFeeModalOpen} 
      />
    </div>
  );
}
