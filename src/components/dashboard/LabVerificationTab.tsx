import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FlaskConical, Loader2, ShieldCheck } from "lucide-react";
import Barcode from "react-barcode";

interface LabOrder {
  id: string;
  barcode_value: string;
  order_status: string;
  result_status: string | null;
  created_at: string;
}

interface LabVerificationTabProps {
  userId: string;
}

export const LabVerificationTab = ({ userId }: LabVerificationTabProps) => {
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
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching lab orders:", error);
      toast.error("Failed to load lab orders");
    } finally {
      setFetchingOrders(false);
    }
  };

  const generateLabOrder = async () => {
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
      });

      if (error) throw error;

      toast.success("Lab order generated successfully!");
      await fetchOrders();
    } catch (error: any) {
      console.error("Error generating lab order:", error);
      toast.error(error.message || "Failed to generate lab order");
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

  if (fetchingOrders) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="shadow-lg border-border/20 bg-card">
        <CardHeader className="space-y-4 pb-6">
          <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-pink-500 via-primary to-blue-500 bg-clip-text text-transparent">
            <FlaskConical className="h-6 w-6 text-primary" />
            Get Clinically Verified
          </CardTitle>
          
          <div className="bg-muted/30 border border-border/40 rounded-lg p-4 space-y-3">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Sexual Health Verification for High-Frequency Dating Communities.
            </h3>
            
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Medical Grade Security</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The industry standard for privacy and precision. We bridge the gap between your lifestyle freedom and clinical accuracy.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Generate a lab order and show the barcode to the lab technician to
            link your results automatically.
          </p>
          <Button
            onClick={generateLabOrder}
            disabled={loading}
            size="lg"
            className="w-full md:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Lab Order"
            )}
          </Button>
        </CardContent>
      </Card>

      {orders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-pink-500 via-primary to-blue-500 bg-clip-text text-transparent">
            Your Lab Orders
          </h3>
          {orders.map((order) => (
            <Card key={order.id} className="shadow-md">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
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
                <p className="text-xs text-muted-foreground italic border-l-2 border-primary pl-3">
                  💡 Show this barcode to the lab technician to link your
                  results automatically.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
