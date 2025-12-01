import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";
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

  const generateSafetyOrder = async () => {
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

      toast.success("At-Home Safety Kit order generated!");
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
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Order your at-home safety kit and register it using the barcode on your sample cup.
          </p>
          <Button
            onClick={generateSafetyOrder}
            disabled={loading}
            size="lg"
            className="w-full md:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Order At-Home Safety Kit
              </>
            )}
          </Button>
        </CardContent>
      </Card>

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