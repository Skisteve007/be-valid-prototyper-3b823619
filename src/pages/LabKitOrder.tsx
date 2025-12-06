import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FlaskConical, Home, Package, MapPin } from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const LabKitOrder = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [showPayPal, setShowPayPal] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const isFormValid = fullName && email && phone && address && city && state && zipCode;

  const handleContinueToPayment = () => {
    if (!isFormValid) {
      toast.error("Please fill in all delivery information");
      return;
    }
    setShowPayPal(true);
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
        vault: false,
        intent: "capture",
        currency: "USD",
        components: "buttons",
      }}
    >
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 via-pink-500/60 to-blue-500/60 blur-3xl rounded-full scale-150"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-pink-400/40 to-blue-400/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
                <img src={logo} alt="Clean Check" className="relative h-20 w-auto" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Product Summary */}
            <Card className="border-cyan-500/40 bg-gradient-to-r from-cyan-50/50 via-blue-50/50 to-cyan-50/50 dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-cyan-950/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-600 rounded-full">
                    <FlaskConical className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Lab Certified Testing Kit</CardTitle>
                    <CardDescription>Complete STD Panel - Professional Lab Verification</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-cyan-500/30 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Add to your peer-to-peer QR code with lab-verified results for enhanced trust and credibility.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-3xl font-bold text-cyan-700 dark:text-cyan-400">$149.00</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>✓ At-home kit delivery</p>
                      <p>✓ Certified lab processing</p>
                      <p>✓ Digital results</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address Form */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle>Delivery Information</CardTitle>
                </div>
                <CardDescription>Where should we ship your testing kit?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street, Apt 4B"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Austin"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="TX"
                      maxLength={2}
                      value={state}
                      onChange={(e) => setState(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      placeholder="78701"
                      maxLength={10}
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {!showPayPal && (
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                    onClick={handleContinueToPayment}
                    disabled={!isFormValid}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Continue to Payment
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* PayPal Payment Section */}
            {showPayPal && (
              <Card className="border-blue-500/40">
                <CardHeader>
                  <CardTitle>Complete Your Order</CardTitle>
                  <CardDescription>Secure payment powered by PayPal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span>Lab Certified Testing Kit</span>
                      <span className="font-bold">$149.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Shipping to: {city}, {state}</span>
                    </div>
                  </div>

                  <PayPalButtons
                    style={{ 
                      layout: "vertical", 
                      label: "pay",
                      shape: "rect",
                      height: 45
                    }}
                    fundingSource={undefined}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            amount: {
                              value: "149.00",
                              currency_code: "USD",
                            },
                            description: "Lab Certified Testing Kit - Complete STD Panel",
                            shipping: {
                              name: {
                                full_name: fullName,
                              },
                              address: {
                                address_line_1: address,
                                admin_area_2: city,
                                admin_area_1: state,
                                postal_code: zipCode,
                                country_code: "US",
                              },
                            },
                          },
                        ],
                        application_context: {
                          shipping_preference: "SET_PROVIDED_ADDRESS",
                        },
                      });
                    }}
                    onApprove={async (data, actions) => {
                      if (actions.order) {
                        const details = await actions.order.capture();
                        toast.success("Payment successful! Your kit will ship within 2-3 business days.");
                        console.log("Lab Kit Order completed:", details);
                        // Redirect to a success page or dashboard
                        setTimeout(() => {
                          navigate("/dashboard?tab=lab-verification");
                        }, 2000);
                      }
                    }}
                    onError={(err) => {
                      console.error("PayPal error:", err);
                      toast.error("Payment failed. Please try again.");
                    }}
                  />

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    🔒 Your payment is secure and encrypted. We never store your payment information.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* HIPAA Legal Disclaimer */}
          <Card className="border-muted-foreground/20 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Important Legal Notice - HIPAA Compliance</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                <strong>Clean Check is not a healthcare provider or medical laboratory.</strong> We are a technology platform that facilitates connections between members and independent third-party laboratory partners.
              </p>
              <p>
                By ordering this lab testing kit, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The laboratory processing your test is an independent third-party entity, not affiliated with or controlled by Clean Check.</li>
                <li>The laboratory partner is solely responsible for all HIPAA compliance, including the proper handling, storage, and protection of your Protected Health Information (PHI).</li>
                <li>Clean Check does not access, store, or process your laboratory test results or medical information beyond what is necessary to facilitate the connection between you and the laboratory.</li>
                <li>Any concerns regarding HIPAA compliance or the handling of your medical information should be directed to the laboratory partner processing your sample.</li>
                <li>Clean Check is not liable for any HIPAA violations, data breaches, or mishandling of Protected Health Information by third-party laboratory partners.</li>
              </ul>
              <p className="pt-2">
                For questions regarding how your health information is handled by our laboratory partners, please contact the lab directly or reach out to our support team at <strong>HelpDeskCCK@gmail.com</strong>.
              </p>
            </CardContent>
          </Card>
        </main>

        {/* Floating Home Button */}
        <Button
          onClick={() => navigate("/")}
          className="fixed bottom-4 left-4 md:bottom-8 md:left-8 h-10 w-10 md:h-11 md:w-11 rounded-full bg-gradient-to-br from-blue-400/60 to-cyan-400/60 hover:from-blue-500/70 hover:to-cyan-500/70 shadow-lg shadow-blue-400/20 hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 z-50 opacity-70 hover:opacity-90"
          title="Back to Home"
        >
          <Home className="h-4 w-4 md:h-5 md:w-5 text-white" />
        </Button>
      </div>
    </PayPalScriptProvider>
  );
};

export default LabKitOrder;