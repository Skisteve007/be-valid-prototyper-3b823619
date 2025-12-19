import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Loader2, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Banknote,
  RefreshCw
} from "lucide-react";

interface VenuePayoutManagerProps {
  venueId: string;
  venueName: string;
}

interface ConnectStatus {
  hasAccount: boolean;
  accountId: string | null;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  onboardingComplete: boolean;
  requirements: string[];
  message: string;
}

export const VenuePayoutManager = ({ venueId, venueName }: VenuePayoutManagerProps) => {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [connectStatus, setConnectStatus] = useState<ConnectStatus | null>(null);
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  useEffect(() => {
    loadStatus();
  }, [venueId]);

  const loadStatus = async () => {
    setLoading(true);
    try {
      // Get connect status
      const { data, error } = await supabase.functions.invoke("get-venue-connect-status", {
        body: { venueId },
      });

      if (error) throw error;
      setConnectStatus(data);

      // Get available balance from venue
      const { data: venue } = await supabase
        .from("partner_venues")
        .select("pending_earnings")
        .eq("id", venueId)
        .single();

      setAvailableBalance(Number(venue?.pending_earnings || 0));
    } catch (error: any) {
      console.error("Failed to load status:", error);
      setConnectStatus({
        hasAccount: false,
        accountId: null,
        chargesEnabled: false,
        payoutsEnabled: false,
        onboardingComplete: false,
        requirements: [],
        message: "Failed to load status",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    setActionLoading("create");
    try {
      const { data, error } = await supabase.functions.invoke("create-venue-connect-account", {
        body: { venueId },
      });

      if (error) throw error;

      toast.success("Stripe account created! Continue with onboarding.");
      loadStatus();
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartOnboarding = async () => {
    setActionLoading("onboarding");
    try {
      const { data, error } = await supabase.functions.invoke("create-venue-onboarding-link", {
        body: { venueId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        toast.success("Onboarding opened in new tab");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create onboarding link");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCashOut = async () => {
    if (availableBalance <= 0) {
      toast.error("No available balance to cash out");
      return;
    }

    setActionLoading("cashout");
    try {
      const { data, error } = await supabase.functions.invoke("venue-cash-out", {
        body: { venueId },
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(data.message);
        setAvailableBalance(0);
        loadStatus();
      } else {
        toast.error(data?.error || "Cash out failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process cash out");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payouts
            </CardTitle>
            <CardDescription>
              Manage Stripe Connect for {venueName}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={loadStatus}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Display */}
        <div className="flex items-center gap-2">
          {connectStatus?.payoutsEnabled ? (
            <Badge className="bg-green-500 gap-1">
              <CheckCircle className="h-3 w-3" />
              Payouts Enabled
            </Badge>
          ) : connectStatus?.hasAccount ? (
            <Badge variant="secondary" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Onboarding Incomplete
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Not Connected
            </Badge>
          )}
        </div>

        {/* Requirements */}
        {connectStatus?.requirements && connectStatus.requirements.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Requirements to complete:</p>
            <ul className="list-disc list-inside space-y-1">
              {connectStatus.requirements.slice(0, 3).map((req, i) => (
                <li key={i}>{req.replace(/_/g, " ")}</li>
              ))}
              {connectStatus.requirements.length > 3 && (
                <li>...and {connectStatus.requirements.length - 3} more</li>
              )}
            </ul>
          </div>
        )}

        {/* Available Balance */}
        {connectStatus?.payoutsEnabled && (
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-bold">${availableBalance.toFixed(2)}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {!connectStatus?.hasAccount && (
            <Button 
              onClick={handleCreateAccount} 
              disabled={actionLoading === "create"}
            >
              {actionLoading === "create" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CreditCard className="h-4 w-4 mr-2" />
              )}
              Enable Payouts
            </Button>
          )}

          {connectStatus?.hasAccount && !connectStatus?.payoutsEnabled && (
            <Button 
              onClick={handleStartOnboarding}
              disabled={actionLoading === "onboarding"}
            >
              {actionLoading === "onboarding" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ExternalLink className="h-4 w-4 mr-2" />
              )}
              Complete Onboarding
            </Button>
          )}

          {connectStatus?.payoutsEnabled && (
            <Button 
              onClick={handleCashOut}
              disabled={actionLoading === "cashout" || availableBalance <= 0}
              variant={availableBalance > 0 ? "default" : "secondary"}
            >
              {actionLoading === "cashout" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Banknote className="h-4 w-4 mr-2" />
              )}
              Cash Out ${availableBalance.toFixed(2)}
            </Button>
          )}
        </div>

        {/* Message */}
        {connectStatus?.message && (
          <p className="text-sm text-muted-foreground">{connectStatus.message}</p>
        )}
      </CardContent>
    </Card>
  );
};
