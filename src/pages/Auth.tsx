import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle, Lock, Zap, Star, Globe, ArrowRight, Fingerprint } from "lucide-react";
import logo from "@/assets/clean-check-logo.png";
import { 
  isBiometricAvailable, 
  authenticateWithBiometric, 
  getStoredCredentials,
  setupBiometricLogin 
} from "@/lib/biometric";
import Footer from "@/components/Footer";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"single" | "couple">(
    location.state?.selectedPlan || "single"
  );
  const [signupFullName, setSignupFullName] = useState(location.state?.fullName || "");
  const [signupEmail, setSignupEmail] = useState(location.state?.email || "");
  const [signupPassword, setSignupPassword] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [enableBiometric, setEnableBiometric] = useState(false);
  const [sponsors, setSponsors] = useState<Array<{ id: string; name: string; logo_url: string | null; website_url: string | null }>>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();
    
    // Check if biometric is available
    isBiometricAvailable().then(setBiometricAvailable);

    // Fetch sponsors
    const fetchSponsors = async () => {
      const { data, error } = await supabase
        .from("sponsors")
        .select("id, name, logo_url, website_url")
        .eq("active", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setSponsors(data);
      }
    };
    fetchSponsors();
  }, [navigate]);


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: signupFullName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      // Get the member ID from the profile
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("member_id")
          .eq("user_id", data.user.id)
          .single();

        if (profile?.member_id) {
          // Send welcome email with member ID
          try {
            await supabase.functions.invoke("send-welcome-email", {
              body: {
                email: signupEmail,
                fullName: signupFullName,
                memberId: profile.member_id,
              },
            });
          } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
          }

          toast.success(`Account created! Your Member ID: ${profile.member_id}`, {
            duration: 6000,
          });

          // Set up biometric if enabled and available
          if (enableBiometric && biometricAvailable) {
            try {
              await setupBiometricLogin(signupEmail, signupPassword);
              toast.success("Biometric login enabled!");
            } catch (bioError: any) {
              console.error("Biometric setup failed:", bioError);
              toast.error("Biometric setup failed, but you can enable it later");
            }
          }
        }
      }

      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6 relative">
          <div className="flex justify-center items-center">
            <img src={logo} alt="Clean Check" className="h-28 w-auto" />
          </div>
          <Button variant="ghost" onClick={() => navigate("/")} className="absolute right-4 top-1/2 -translate-y-1/2">
            Back to Home
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-12 px-4 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Complete Your Membership
            </h1>
            <p className="text-lg text-muted-foreground">
              Confidently share verified health status information for mutual safety and informed intimacy.
            </p>
          </div>
        </section>

        {/* Sponsors Section */}
        {sponsors.length > 0 && (
          <section className="py-12 px-4 bg-muted/30 border-y">
            <div className="container mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Lock className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Trusted By Community Sponsors</h3>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-8 mb-4">
                {sponsors.map((sponsor) => (
                  <div key={sponsor.id} className="flex items-center justify-center">
                    {sponsor.logo_url ? (
                      sponsor.website_url ? (
                        <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer">
                          <img 
                            src={sponsor.logo_url} 
                            alt={sponsor.name} 
                            className="h-12 w-auto grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
                          />
                        </a>
                      ) : (
                        <img 
                          src={sponsor.logo_url} 
                          alt={sponsor.name} 
                          className="h-12 w-auto opacity-70"
                        />
                      )
                    ) : (
                      <div className="px-6 py-3 bg-card border rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">{sponsor.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Supporting community health and transparency</p>
            </div>
          </section>
        )}

        {/* Membership Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                <Zap className="h-4 w-4" />
                <span className="font-semibold">🚀 Complete Your Membership</span>
              </div>
              <p className="text-lg mb-2">Automatic Approval! Your account will be activated instantly after payment.</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                YOUR unique QR Code will be generated after membership payment, after documents uploaded onto your member profile page
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center mb-6">💳 Membership Pricing - Click to Select</h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <Card 
                  className={`cursor-pointer transition-all ${selectedPlan === "single" ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"}`}
                  onClick={() => setSelectedPlan("single")}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-3xl mb-2">$29</CardTitle>
                        <CardDescription className="text-base">Single Member</CardDescription>
                      </div>
                      {selectedPlan === "single" && (
                        <div className="flex items-center gap-1 text-primary text-sm font-medium">
                          <CheckCircle className="h-4 w-4" />
                          Selected
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Per month</p>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${selectedPlan === "couple" ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"}`}
                  onClick={() => setSelectedPlan("couple")}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-3xl mb-2">$49</CardTitle>
                        <CardDescription className="text-base">Joint/Couple</CardDescription>
                      </div>
                      {selectedPlan === "couple" && (
                        <div className="flex items-center gap-1 text-primary text-sm font-medium">
                          <CheckCircle className="h-4 w-4" />
                          Selected
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Per month</p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-center mt-6 text-muted-foreground flex items-center justify-center gap-2">
                <Star className="h-4 w-4 text-secondary" />
                ✨ Universal membership - works on all sites employing Clean Check services
              </p>
            </div>

            {/* Sign Up Form */}
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Get Started</CardTitle>
                <CardDescription>Both fields are required to proceed</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name *</Label>
                    <Input 
                      id="signup-name"
                      placeholder="Enter your full name"
                      value={signupFullName}
                      onChange={(e) => setSignupFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address *</Label>
                    <Input 
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password *</Label>
                    <Input 
                      id="signup-password"
                      type="password"
                      placeholder="Create a secure password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  {biometricAvailable && (
                    <div className="flex items-center space-x-2 rounded-lg border p-3 bg-muted/50">
                      <input
                        type="checkbox"
                        id="enable-biometric"
                        checked={enableBiometric}
                        onChange={(e) => setEnableBiometric(e.target.checked)}
                        className="rounded border-primary"
                      />
                      <Label htmlFor="enable-biometric" className="text-sm cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Fingerprint className="h-4 w-4 text-primary" />
                          <span>Enable biometric login (fingerprint/Face ID)</span>
                        </div>
                      </Label>
                    </div>
                  )}
                  
                  <Button 
                    size="lg" 
                    className="w-full" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Continue to Payment"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h3 className="text-3xl font-bold text-center mb-12">Why Join Clean Check?</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>✅ Verified Health Status</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Share your clean status with confidence</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>🔒 Private & Secure</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Your data encrypted and protected</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>⚡ Instant Activation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Account active immediately after payment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>🌟 Premium Features</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">QR codes, galleries, Member Profile secrets 😈</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>🌐 Universal Membership</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Works on all other sites that employ Clean Check services</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>⚡ Instant - No Awkward Conversations</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Quick reveal through your unique QR code</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Payment Information */}
        <section className="py-16 px-4 bg-destructive/10 border-y border-destructive/20">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-2xl font-bold mb-6 text-destructive">⚠️ Important Payment Information:</h3>
            <ul className="space-y-4 text-foreground">
              <li className="flex gap-3">
                <span className="font-bold shrink-0">•</span>
                <p><strong>RECURRING CHARGES:</strong> This is a subscription that automatically charges every 30 days from your initial payment date. Your membership will renew monthly unless you cancel.</p>
              </li>
              <li className="flex gap-3">
                <span className="font-bold shrink-0">•</span>
                <p><strong>How to Cancel:</strong> You must cancel through PayPal by going to your PayPal account → Settings → Payments → Manage automatic payments → Cancel Clean Check subscription.</p>
              </li>
              <li className="flex gap-3">
                <span className="font-bold shrink-0">•</span>
                <p><strong>Non-Refundable:</strong> All membership contributions are non-refundable and final once processed.</p>
              </li>
              <li className="flex gap-3">
                <span className="font-bold shrink-0">•</span>
                <p><strong>Instant Activation:</strong> Your account activates immediately upon first payment.</p>
              </li>
              <li className="flex gap-3">
                <span className="font-bold shrink-0">•</span>
                <p><strong>Venmo option available on mobile devices</strong></p>
              </li>
            </ul>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <section className="py-16 px-4 bg-muted">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-2xl font-bold mb-6">⚖️ LEGAL DISCLAIMER</h3>
            <p className="mb-6 text-foreground">By using Clean Check, you acknowledge and agree that:</p>
            
            <div className="space-y-6 text-sm text-muted-foreground">
              <div>
                <h4 className="font-bold text-foreground mb-2">Service Nature:</h4>
                <p>Clean Check is a peer-to-peer data sharing tool and not a medical or financial service provider. The donor releases Clean Check from all liability for any health, financial, or informational consequences resulting from the use or alteration of this service. All membership contributions are non-refundable and final.</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-2">Platform Sponsors and Partners:</h4>
                <p>All sponsors, advertisers, and supporting partners of Clean Check (collectively "Sponsors") are held with NO LIABILITY for any health, financial, informational, or other consequences resulting from your use of this service.</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-2">Health Decisions:</h4>
                <p>Neither Clean Check nor Sponsors are responsible for any health-related outcomes, medical conditions, infections, or diseases that may result from interactions facilitated through this platform.</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-2">Financial Matters:</h4>
                <p>Neither Clean Check nor Sponsors bear responsibility for membership fees, payment processing issues, refund disputes, or any financial losses incurred.</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-2">Information Accuracy:</h4>
                <p>Neither Clean Check nor Sponsors are liable for the accuracy, completeness, or reliability of information shared by users, including health status, test results, or personal data.</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-2">Independent Service:</h4>
                <p>Sponsors provide advertising or financial support only and are completely separate from the operation, management, and content of Clean Check. Their participation does not constitute endorsement of user behavior or platform practices.</p>
              </div>

              <p className="pt-4 font-semibold text-foreground">
                You agree to hold harmless and indemnify Clean Check, its operators, and all Sponsors from any claims, damages, or liabilities arising from your use of this service. Use at your own risk.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;