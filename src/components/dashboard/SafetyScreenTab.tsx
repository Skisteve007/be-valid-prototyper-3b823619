import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShieldCheck, Loader2, AlertCircle, CreditCard, Package, Plane, CheckCircle, ArrowRight, Heart, Droplet } from "lucide-react";
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
  const navigate = useNavigate();
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
      console.error("Error fetching toxicology lab orders:", error);
      toast.error("Failed to load toxicology lab orders");
    } finally {
      setFetchingOrders(false);
    }
  };

  const handleProductSelect = () => {
    navigate("/toxicology-kit-order");
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

      const { error } = await supabase.from("lab_orders").insert({
        user_id: authData.user.id,
        barcode_value: barcodeValue,
        order_status: "pending",
        test_type: "TOX_10_PANEL",
      });

      if (error) throw error;

      toast.success("Toxicology Lab Certified kit ordered successfully! Check your email for shipping details.");
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
      {/* Hero Section */}
      <Card className="shadow-lg border-green-500/30 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardHeader className="space-y-4 pb-6">
          <CardTitle className="flex items-center gap-2 text-3xl md:text-4xl bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
            <ShieldCheck className="h-8 w-8 text-green-600" />
            Lab-Certified 10-Panel Toxicology Verification
          </CardTitle>
          
          <p className="text-lg text-muted-foreground">
            Go beyond instant cups. Get a GC/MS Lab-Confirmed report directly in your app.
          </p>
        </CardHeader>
      </Card>

      {/* Timeline Visual - The Speed Selling Point */}
      <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Fast-Track Processing Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/30 blur-xl rounded-full"></div>
                <div className="relative p-4 bg-green-600 rounded-full">
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-green-700 dark:text-green-400">Priority Dispatch</h3>
                <p className="text-sm text-muted-foreground">Kit ships same-day in discreet packaging.</p>
              </div>
            </div>

            {/* Arrow for desktop */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-green-600/50" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full"></div>
                <div className="relative p-4 bg-blue-600 rounded-full">
                  <Plane className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-400">Overnight Return</h3>
                <p className="text-sm text-muted-foreground">Includes pre-paid priority return label for fastest lab arrival.</p>
              </div>
            </div>

            {/* Arrow for desktop */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-green-600/50" />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-full"></div>
                <div className="relative p-4 bg-emerald-600 rounded-full">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-emerald-700 dark:text-emerald-400">24-Hour Lab Processing</h3>
                <p className="text-sm text-muted-foreground">Results certified within 24 hours of lab receipt.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specs - What It Screens */}
      <Card className="border-2 border-green-500/30 bg-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Technical Specs - What It Screens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-medium text-foreground">10-Panel Comprehensive Screening:</p>
          <div className="grid md:grid-cols-2 gap-2">
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Amphetamines (AMP)</li>
              <li>Cannabinoids / THC (THC)</li>
              <li>Cocaine (COC)</li>
              <li>Opiates (OPI)</li>
              <li>Phencyclidine / PCP (PCP)</li>
            </ul>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Benzodiazepines (BZO)</li>
              <li>Barbiturates (BAR)</li>
              <li>Methadone (MTD)</li>
              <li>Methamphetamine (mAMP)</li>
              <li>Ecstasy / MDMA (MDMA)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Call To Action - Toxicology */}
      <Card className="border-2 border-green-500/40 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-950/40 dark:to-emerald-950/40 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-4xl font-bold text-green-700 dark:text-green-400 mb-1">$129</p>
              <p className="text-sm text-muted-foreground">One-time payment</p>
              <p className="text-xs text-muted-foreground mt-1">Includes Kit + Lab Processing Fee</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={handleProductSelect}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:shadow-[0_0_40px_rgba(34,197,94,0.7)] text-lg px-8 py-6 min-h-[56px] touch-manipulation"
              >
                <ShieldCheck className="mr-2 h-5 w-5" />
                Order Toxicology Kit - $129
              </Button>
              <div className="flex items-center gap-2 bg-green-600/10 px-4 py-2 rounded-full border border-green-500/30">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  Results valid for Clean Check Verification
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Divider */}
      <div className="relative py-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-muted-foreground/30"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-sm font-medium text-muted-foreground">
            Additional Verification Options
          </span>
        </div>
      </div>

      {/* Comprehensive Sexual Health Panel Section */}
      <Card className="shadow-lg border-pink-500/30 bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/20">
        <CardHeader className="space-y-4 pb-6">
          <CardTitle className="flex items-center gap-2 text-3xl md:text-4xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 bg-clip-text text-transparent">
            <Heart className="h-8 w-8 text-pink-600" />
            Gold-Standard Sexual Health Panel (10-Panel)
          </CardTitle>
          
          <p className="text-lg text-muted-foreground">
            The clinical accuracy of a doctor's visit, with the privacy of your own home.
          </p>
        </CardHeader>
      </Card>

      {/* Peace of Mind Timeline */}
      <Card className="border-2 border-pink-500/30 bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Your Peace of Mind Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-pink-500/30 blur-xl rounded-full"></div>
                <div className="relative p-4 bg-pink-600 rounded-full">
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-pink-700 dark:text-pink-400">Total Privacy</h3>
                <p className="text-sm text-muted-foreground">Arrives in unmarked packaging. No insurance record. No awkward conversations.</p>
              </div>
            </div>

            {/* Arrow for desktop */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-pink-600/50" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-rose-500/30 blur-xl rounded-full"></div>
                <div className="relative p-4 bg-rose-600 rounded-full">
                  <Droplet className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-rose-700 dark:text-rose-400">Simple Collection</h3>
                <p className="text-sm text-muted-foreground">Easy-to-follow instructions for urine/swab collection at home.</p>
              </div>
            </div>

            {/* Arrow for desktop */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-pink-600/50" />
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

      {/* What It Covers Accordion */}
      <Card className="border-2 border-pink-500/30 bg-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            What's Included
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="panel" className="border-pink-500/30">
              <AccordionTrigger className="text-lg font-semibold hover:text-pink-600">
                Comprehensive 10-Panel Screen
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2 pt-2">
                <p className="font-medium">Full lab-certified screening for:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>HIV I/II Antibody Testing</li>
                  <li>Herpes Simplex Virus I & II (HSV-1, HSV-2)</li>
                  <li>Syphilis (RPR with Reflex to TP-PA)</li>
                  <li>Chlamydia Trachomatis</li>
                  <li>Neisseria Gonorrhoeae (Gonorrhea)</li>
                  <li>Hepatitis B Surface Antigen</li>
                  <li>Hepatitis C Antibody</li>
                  <li>Trichomonas Vaginalis</li>
                  <li>Mycoplasma Genitalium</li>
                  <li>Ureaplasma Species</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Call To Action - Health Panel */}
      <Card className="border-2 border-pink-500/40 bg-gradient-to-br from-pink-50/80 to-rose-50/80 dark:from-pink-950/40 dark:to-rose-950/40 shadow-[0_0_40px_rgba(236,72,153,0.3)]">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-4xl font-bold text-pink-700 dark:text-pink-400 mb-1">$149</p>
              <p className="text-sm text-muted-foreground">One-time payment</p>
              <p className="text-xs text-muted-foreground mt-1">Includes Kit + Lab Processing Fee</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={handleHealthPanelSelect}
                size="lg"
                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:shadow-[0_0_40px_rgba(236,72,153,0.7)] text-lg px-8 py-6 min-h-[56px] touch-manipulation"
              >
                <Heart className="mr-2 h-5 w-5" />
                Order Health Panel - $149
              </Button>
              <div className="flex items-center gap-2 bg-pink-600/10 px-4 py-2 rounded-full border border-pink-500/30 animate-pulse">
                <Heart className="h-4 w-4 text-pink-600" />
                <span className="text-sm font-medium text-pink-700 dark:text-pink-400">
                  ❤️ The 'Responsible Fun' Standard. Order Monday, Verified Friday.
                </span>
              </div>
            </div>
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
                <span className="font-medium">Toxicology Lab Certified</span>
                <span className="font-bold text-lg">$129.00</span>
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
                    Confirm Order - $129
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
            Your Toxicology Lab Certified Orders
          </h3>
          {orders.map((order) => (
            <Card key={order.id} className="shadow-md border-green-500/20 relative overflow-hidden">
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
                <div className="bg-muted/30 rounded-lg p-3 space-y-2 border border-green-500/20">
                  <p className="text-xs text-muted-foreground flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="font-medium">This barcode communicates directly with our lab partners. Only the lab can scan and process this barcode to link your test results.</span>
                  </p>
                  <p className="text-xs text-muted-foreground pl-5">
                    Once results are verified, they automatically appear in your shareable QR code, giving you instant proof of your toxicology status.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};