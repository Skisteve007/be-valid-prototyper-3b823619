import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FlaskConical, Loader2, ShieldCheck, Heart, CreditCard } from "lucide-react";
import Barcode from "react-barcode";

interface LabOrder {
  id: string;
  barcode_value: string;
  order_status: string;
  result_status: string | null;
  test_type: string;
  created_at: string;
}

interface LabVerificationTabProps {
  userId: string;
}

type ProductType = 'safety_shield' | 'health_heart';

export const LabVerificationTab = ({ userId }: LabVerificationTabProps) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("lab_orders")
        .select("*")
        .eq("user_id", userId)
        .eq("test_type", "STD_PANEL")
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

  const handleProductSelect = (product: ProductType) => {
    setSelectedProduct(product);
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

      const testType = selectedProduct === 'safety_shield' ? 'TOX_10_PANEL' : 'STD_PANEL';

      const { error } = await supabase.from("lab_orders").insert({
        user_id: authData.user.id,
        barcode_value: barcodeValue,
        order_status: "pending",
        test_type: testType,
      });

      if (error) throw error;

      toast.success("Lab kit ordered successfully! Check your email for shipping details.");
      setPaymentModalOpen(false);
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
            Get Certified Status
          </CardTitle>
          
          <div className="bg-muted/30 border border-border/40 rounded-lg p-4 space-y-3">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Professional Verification for High-Trust Communities
            </h3>
            
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Choose Your Verification Level</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Select the certification that matches your needs. All tests include at-home kit delivery and certified lab processing.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* STD Panel Product Card */}
          <div className="max-w-2xl mx-auto">
            <Card className="relative overflow-hidden border-pink-500/40 bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/20 hover:shadow-xl transition-shadow">
              <div className="absolute top-4 right-4">
                <Badge className="bg-pink-600 text-white">
                  <Heart className="h-3 w-3 mr-1" />
                  Sexual Health
                </Badge>
              </div>
              <CardHeader className="space-y-3 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-pink-600 rounded-full">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Complete STD Panel</h3>
                    <p className="text-sm text-muted-foreground">Comprehensive Sexual Health Verification</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Full Clinical Verification (5-Panel Standard). Verified by certified lab partners for complete peace of mind.
                </p>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border-2 border-pink-500/30">
                  <p className="text-3xl font-bold text-pink-700 dark:text-pink-400">
                    $149.00
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Includes Kit + Lab Fee
                  </p>
                </div>
                <Button
                  onClick={() => handleProductSelect('health_heart')}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                  size="lg"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Order STD Panel Kit
                </Button>
              </CardContent>
            </Card>
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
            {selectedProduct && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Complete STD Panel</span>
                  <span className="font-bold text-lg">$149.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  One-time payment • Includes kit delivery and lab processing
                </p>
              </div>
            )}

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

      {orders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-pink-500 via-primary to-blue-500 bg-clip-text text-transparent">
            Your Health Kit Orders
          </h3>
          {orders.map((order) => (
            <Card key={order.id} className="shadow-md border-pink-500/20">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-pink-600" />
                      <p className="text-sm font-semibold">Health Heart - Comprehensive Panel</p>
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
                <p className="text-xs text-muted-foreground italic border-l-2 border-pink-500 pl-3">
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
