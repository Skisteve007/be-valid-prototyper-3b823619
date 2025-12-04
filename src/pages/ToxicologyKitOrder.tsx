import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ShieldCheck, Home, Package, MapPin, Truck } from "lucide-react";
import logo from "@/assets/clean-check-logo.png";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const ToxicologyKitOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDriverPass = searchParams.get("type") === "driver";
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [showPayPal, setShowPayPal] = useState(false);
  const [paymentType, setPaymentType] = useState<"onetime" | "subscription" | "driver">(isDriverPass ? "driver" : "subscription");

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
            <Card className="border-green-500/40 bg-gradient-to-r from-green-50/50 via-emerald-50/50 to-green-50/50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-green-950/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-600 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Lab-Certified 10-Panel Toxicology</CardTitle>
                    <CardDescription>10-Panel Tox Screen - Professional Lab Verification</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-green-500/30 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Add to your peer-to-peer QR code with lab-verified toxicology results for enhanced trust and safety verification.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-400">$129.00</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>✓ At-home kit delivery</p>
                      <p>✓ Certified lab processing</p>
                      <p>✓ Digital results</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-50/50 dark:bg-red-950/20 border border-red-500/30 rounded-lg">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">HIPAA Disclaimer:</strong> Clean Check is a technology platform connecting users to independent third-party labs. Third-party labs are solely responsible for HIPAA compliance. Clean Check assumes no liability for partner labs' HIPAA violations.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address Form */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <CardTitle>Delivery Information</CardTitle>
                </div>
                <CardDescription>Where should we send your testing kit?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    Street Address *
                  </Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Los Angeles"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="CA"
                      maxLength={2}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="90210"
                      maxLength={5}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Back Button */}
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            {/* Payment Section */}
            {!showPayPal ? (
              <Button
                onClick={handleContinueToPayment}
                disabled={!isFormValid}
                className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                size="lg"
              >
                Continue to Payment
              </Button>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    Complete Your Order
                  </CardTitle>
                  <CardDescription>Pay securely with PayPal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Type Selector */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Choose Your Payment Option</Label>
                    <RadioGroup value={paymentType} onValueChange={(value) => setPaymentType(value as "onetime" | "subscription" | "driver")}>
                      <div className="flex flex-col gap-3">
                        {/* Driver Pass Option */}
                        <div className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                          paymentType === "driver" ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20" : "border-border hover:border-amber-300"
                        }`}>
                          <RadioGroupItem value="driver" id="driver" />
                          <Label htmlFor="driver" className="flex-1 cursor-pointer">
                            <div className="font-semibold text-lg flex items-center gap-2">
                              <Truck className="h-5 w-5 text-amber-600" />
                              Individual Driver Pass
                              <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">TRANSPORTATION & FLEET</span>
                            </div>
                            <div className="text-sm text-amber-600 dark:text-amber-400 font-semibold">$119.00 One-Time</div>
                            <div className="text-xs text-muted-foreground mt-1">Includes: Membership + 14-Day QR Code + 1 Drug Test Kit</div>
                          </Label>
                        </div>

                        <div className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                          paymentType === "onetime" ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20" : "border-border hover:border-blue-300"
                        }`}>
                          <RadioGroupItem value="onetime" id="onetime" />
                          <Label htmlFor="onetime" className="flex-1 cursor-pointer">
                            <div className="font-semibold text-lg">One-Time Order</div>
                            <div className="text-sm text-muted-foreground">Standard Price - $129.00</div>
                          </Label>
                        </div>
                        
                        <div className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                          paymentType === "subscription" ? "border-green-600 bg-green-50/50 dark:bg-green-950/20" : "border-border hover:border-green-300"
                        }`}>
                          <RadioGroupItem value="subscription" id="subscription" />
                          <Label htmlFor="subscription" className="flex-1 cursor-pointer">
                            <div className="font-semibold text-lg flex items-center gap-2">
                              Subscribe & Save 10%
                              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">BEST VALUE</span>
                            </div>
                            <div className="text-sm text-green-600 dark:text-green-400 font-semibold">$116.10 per quarter</div>
                            <div className="text-xs text-muted-foreground mt-1">Billed quarterly • Kit ships automatically every 90 days • Cancel anytime</div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* PayPal Payment Forms */}
                  {paymentType === "driver" ? (
                    <div className="space-y-3">
                      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="w-full">
                        <input type="hidden" name="cmd" value="_xclick" />
                        <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                        <input type="hidden" name="item_name" value="Clean Check - Driver Verification Pass (14-Day)" />
                        <input type="hidden" name="amount" value="119.00" />
                        <input type="hidden" name="no_shipping" value="2" />
                        <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?type=driver-14day" />
                        <button type="submit" style={{ width: '100%', padding: '15px', background: '#f59e0b', color: 'black', fontWeight: 'bold', cursor: 'pointer', zIndex: 10000, position: 'relative', border: 'none', borderRadius: '6px', fontSize: '16px' }}>
                          BUY DRIVER PASS ($119)
                        </button>
                      </form>
                      <p className="text-xs text-center text-muted-foreground">
                        🚗 For Transportation & Fleet Drivers • QR Code valid for 14 days
                      </p>
                    </div>
                  ) : paymentType === "onetime" ? (
                    <div className="space-y-3">
                      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="w-full">
                        <input type="hidden" name="cmd" value="_xclick" />
                        <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                        <input type="hidden" name="item_name" value="Verification Kit - Toxicology (10-Panel)" />
                        <input type="hidden" name="amount" value="129.00" />
                        <input type="hidden" name="no_shipping" value="2" />
                        <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                        <button type="submit" style={{ width: '100%', padding: '15px', background: '#000', color: 'white', fontWeight: 'bold', cursor: 'pointer', zIndex: 10000, position: 'relative', border: 'none', borderRadius: '6px', fontSize: '16px' }}>
                          ORDER TOX KIT ($129)
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="w-full">
                        <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                        <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                        <input type="hidden" name="item_name" value="Safety Tox Kit - Auto-Ship (Quarterly)" />
                        <input type="hidden" name="no_shipping" value="2" />
                        <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                        <input type="hidden" name="a3" value="116.10" />
                        <input type="hidden" name="p3" value="3" />
                        <input type="hidden" name="t3" value="M" />
                        <input type="hidden" name="src" value="1" />
                        <button type="submit" style={{ width: '100%', padding: '15px', background: '#16a34a', color: 'white', fontWeight: 'bold', cursor: 'pointer', zIndex: 10000, position: 'relative', border: 'none', borderRadius: '6px', fontSize: '16px' }}>
                          Subscribe: $116.10 / Quarter
                        </button>
                      </form>
                      <p className="text-xs text-center text-muted-foreground">
                        🔄 Automatic quarterly billing and shipping • Cancel anytime via PayPal
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </PayPalScriptProvider>
  );
};

export default ToxicologyKitOrder;
