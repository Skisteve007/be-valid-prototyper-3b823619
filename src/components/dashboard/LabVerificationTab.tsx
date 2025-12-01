import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FlaskConical, Loader2, ShieldCheck, Heart, CreditCard, Package, Droplet, CheckCircle, ArrowRight, AlertCircle } from "lucide-react";
import Barcode from "react-barcode";
import { LabSponsorLogos } from "./LabSponsorLogos";
import { ProductCard } from "./ProductCard";

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
  const navigate = useNavigate();
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

  const handleHealthPanelSelect = () => {
    navigate("/health-panel-order");
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
      {/* Hero Section */}
      <Card className="shadow-lg border-primary/30 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        <CardHeader className="space-y-4 pb-6">
          <CardTitle className="flex items-center gap-2 text-3xl md:text-4xl bg-gradient-to-r from-blue-600 via-purple-500 to-pink-600 bg-clip-text text-transparent">
            <Heart className="h-8 w-8 text-purple-600" />
            Platinum 13-Panel Sexual Health Screen
          </CardTitle>
          
          <p className="text-lg text-muted-foreground">
            The most comprehensive at-home verification available. Covers 30% more than standard clinic tests.
          </p>
        </CardHeader>
      </Card>

      {/* Lab Sponsor Logos */}
      <LabSponsorLogos category="lab_certified" />

      {/* Peace of Mind Timeline */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Peace of Mind Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full"></div>
                <div className="relative p-4 bg-blue-600 rounded-full">
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-400">Total Privacy</h3>
                <p className="text-sm text-muted-foreground">Arrives in unmarked packaging. No insurance record. No awkward conversations.</p>
              </div>
            </div>

            {/* Arrow for desktop */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-purple-600/50" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full"></div>
                <div className="relative p-4 bg-purple-600 rounded-full">
                  <Droplet className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-purple-700 dark:text-purple-400">Simple Collection</h3>
                <p className="text-sm text-muted-foreground">Easy-to-follow instructions for urine/swab collection at home.</p>
              </div>
            </div>

            {/* Arrow for desktop */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-purple-600/50" />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/30 blur-xl rounded-full"></div>
                <div className="relative p-4 bg-green-600 rounded-full">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-green-700 dark:text-green-400">72-Hour Verification</h3>
                <p className="text-sm text-muted-foreground">Results verified and Status updated to 'Green' within 2-3 days of lab receipt.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What It Covers - Exposed List */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 dark:from-blue-950/10 dark:via-purple-950/10 dark:to-pink-950/10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            13-Point Verification Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">HIV-1 (Early Detection)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">HIV-2 (Antibody)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Herpes Simplex 1 (HSV-1)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Herpes Simplex 2 (HSV-2)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Hepatitis B</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Hepatitis C</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Syphilis</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Chlamydia</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Gonorrhea</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Trichomoniasis</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Mycoplasma Genitalium</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Ureaplasma Urealyticum</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Gardnerella (BV)</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic pt-2 border-t border-border/40">
            Includes the 3 "Hidden" Infections standard clinics often miss (Trich, Mycoplasma, Ureaplasma).
          </p>
        </CardContent>
      </Card>

      {/* Product Card - Sexual Health */}
      <ProductCard
        type="sexual_health"
        title="Platinum 13-Panel Sexual Health Screen"
        price="$249.00"
        icon={Heart}
        onOrderClick={handleHealthPanelSelect}
      />

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
                  <span className="font-medium">Platinum 13-Panel Sexual Health Screen</span>
                  <span className="font-bold text-lg">$249.00</span>
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

      {/* Sample Order Card - Always Visible */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-600 bg-clip-text text-transparent">
          Your Sexual Health Panel Orders
        </h3>
        <Card className="shadow-md border-primary/20 relative overflow-hidden">
          {/* Sample Only Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="text-6xl md:text-8xl font-bold text-muted-foreground/10 rotate-[-30deg] select-none">
              SAMPLE ONLY
            </div>
          </div>
          
          <CardContent className="p-6 space-y-4 relative z-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-purple-600" />
                  <p className="text-sm font-semibold">Platinum 13-Panel Sexual Health Screen</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Order ID: SAMPLE123...
                </p>
                <p className="text-sm">
                  Status:{" "}
                  <span className="text-yellow-500">
                    PENDING
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Sample Kit Preview
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <Barcode
                  value="SAMPLESTD123"
                  height={80}
                  displayValue={true}
                  fontSize={14}
                />
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 space-y-2 border border-primary/20">
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-purple-600" />
                <span className="font-medium">This barcode communicates directly with our lab partners. Only the lab can scan and process this barcode to link your test results.</span>
              </p>
              <p className="text-xs text-muted-foreground pl-5">
                Once results are verified, they automatically appear in your shareable QR code, giving you instant proof of your sexual health status.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actual Orders */}
        {orders.length > 0 && orders.map((order) => (
          <Card key={order.id} className="shadow-md border-primary/20 relative overflow-hidden">
            {/* Sample Only Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-6xl md:text-8xl font-bold text-muted-foreground/10 rotate-[-30deg] select-none">
                SAMPLE ONLY
              </div>
            </div>
            
            <CardContent className="p-6 space-y-4 relative z-0">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-semibold">Platinum 13-Panel Sexual Health Screen</p>
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
              <div className="bg-muted/30 rounded-lg p-3 space-y-2 border border-primary/20">
                <p className="text-xs text-muted-foreground flex items-start gap-2">
                  <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-purple-600" />
                  <span className="font-medium">This barcode communicates directly with our lab partners. Only the lab can scan and process this barcode to link your test results.</span>
                </p>
                <p className="text-xs text-muted-foreground pl-5">
                  Once results are verified, they automatically appear in your shareable QR code, giving you instant proof of your sexual health status.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
