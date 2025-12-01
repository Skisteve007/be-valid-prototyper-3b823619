import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShieldCheck, Loader2, AlertCircle, CreditCard } from "lucide-react";
import Barcode from "react-barcode";
import { SafetyQRCode } from "./SafetyQRCode";

interface LabOrder {
  id: string;
  barcode_value: string;
  order_status: string;
  result_status: string | null;
  test_type: string;
  created_at: string;
}

interface SafetyScreenTabProps {
  userId: string;
}

export const SafetyScreenTab = ({ userId }: SafetyScreenTabProps) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("lab_orders")
        .select("*")
        .eq("user_id", userId)
        .eq("test_type", "TOX_10_PANEL")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching safety screen orders:", error);
      toast.error("Failed to load safety screen orders");
    } finally {
      setFetchingOrders(false);
    }
  };

  const handleProductSelect = () => {
    setPaymentModalOpen(true);
  };

  const handlePaymentComplete = async () => {
    setLoading(true);
    try {
      // Generate unique 12-digit alphanumeric code
      const barcodeValue = Array.from({ length: 12 }, () =>
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]
      ).join("");

      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("lab_orders").insert({
        user_id: authData.user.id,
        barcode_value: barcodeValue,
        order_status: "pending",
        test_type: "TOX_10_PANEL",
      });

      if (error) throw error;

      toast.success("Safety Shield kit ordered successfully! Check your email for shipping details.");
      setPaymentModalOpen(false);
      await fetchOrders();
    } catch (error: any) {
      console.error("Error generating safety order:", error);
      toast.error(error.message || "Failed to generate safety order");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "sample_collected":
        return "text-blue-500";
      case "result_received":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getResultColor = (result: string | null) => {
    switch (result) {
      case "negative":
        return "text-green-600 font-bold";
      case "positive":
        return "text-red-600 font-bold";
      case "inconclusive":
        return "text-yellow-600 font-bold";
      default:
        return "text-muted-foreground";
    }
  };

  // Check if user has a verified negative result
  const hasVerifiedResult = orders.some(
    (order) => order.result_status === "negative" && order.order_status === "result_received"
  );

  if (fetchingOrders) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="shadow-lg border-green-500/30 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardHeader className="space-y-4 pb-6">
          <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
            <ShieldCheck className="h-6 w-6 text-green-600" />
            Safety Screen
          </CardTitle>
          
          <div className="bg-green-50/50 dark:bg-green-950/30 border border-green-500/40 rounded-lg p-4 space-y-3">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Verify your status from home. 10-Panel Screening. 100% Private.
            </h3>
            
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">At-Home Privacy</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Complete your 10-panel toxicology screening in the privacy of your home. Results verified by our lab partners for complete peace of mind.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Safety Shield Product Card */}
          <div className="max-w-2xl mx-auto">
            <Card className="relative overflow-hidden border-green-500/40 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-xl transition-shadow">
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-600 text-white">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Safety
                </Badge>
              </div>
              <CardHeader className="space-y-3 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-600 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">The Safety Shield</h3>
                    <p className="text-sm text-muted-foreground">10-Panel Tox Screen</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  10-Panel Toxicology Verification. Required for high-liability venues.
                </p>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border-2 border-green-500/30">
                  <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                    $89.00
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Includes Kit + Lab Fee
                  </p>
                </div>
                <Button
                  onClick={handleProductSelect}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  size="lg"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Order Safety Kit
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Gold Status Note */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-sm text-center text-muted-foreground">
              ✨ <strong className="text-yellow-700 dark:text-yellow-400">Certified Lab Results unlock the 'Gold Border' on your entry pass for 90 days.</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Complete Your Order
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">The Safety Shield</span>
                <span className="font-bold text-lg">$89.00</span>
              </div>
              <p className="text-xs text-muted-foreground">
                One-time payment • Includes kit delivery and lab processing
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Payment integration coming soon. For now, clicking "Confirm Order" will generate your kit tracking information.
              </p>
              <Button
                onClick={handlePaymentComplete}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Confirm Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Show Safety QR Code if verified */}
      {hasVerifiedResult && (
        <SafetyQRCode userId={userId} />
      )}

      {orders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
            Your Safety Screen Orders
          </h3>
          {orders.map((order) => (
            <Card key={order.id} className="shadow-md border-green-500/20">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      <p className="text-sm font-semibold">10-Panel Toxicology Screen</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Order ID: {order.id.slice(0, 8)}...
                    </p>
                    <p className="text-sm">
                      Status:{" "}
                      <span className={getStatusColor(order.order_status)}>
                        {order.order_status.replace("_", " ").toUpperCase()}
                      </span>
                    </p>
                    {order.result_status && (
                      <p className="text-sm">
                        Result:{" "}
                        <span className={getResultColor(order.result_status)}>
                          {order.result_status.toUpperCase()}
                        </span>
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <Barcode
                      value={order.barcode_value}
                      height={80}
                      displayValue={true}
                      fontSize={14}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic border-l-2 border-green-500 pl-3 flex items-start gap-2">
                  <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>Register your kit by scanning this barcode on your sample cup to link results automatically.</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};