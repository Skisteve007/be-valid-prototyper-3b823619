import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowRight, Fingerprint, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";
import { useLongPressHome } from "@/hooks/useLongPressHome";
import { 
  isBiometricAvailable, 
  authenticateWithBiometric, 
  getStoredCredentials
} from "@/lib/biometric";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const longPressHandlers = useLongPressHome();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode") || "signup";
  const discountCode = searchParams.get("discount") || localStorage.getItem('discountCode') || "";
  const [loading, setLoading] = useState(false);
  const [signupFullName, setSignupFullName] = useState(location.state?.fullName || "");
  const [signupEmail, setSignupEmail] = useState(location.state?.email || "");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Save discount code to localStorage if present in URL
    const urlDiscount = searchParams.get("discount");
    if (urlDiscount) {
      localStorage.setItem('discountCode', urlDiscount);
    }
    
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();

    // Load saved email from localStorage
    const savedEmail = localStorage.getItem('loginEmail');
    if (savedEmail) {
      setLoginEmail(savedEmail);
    }
  }, [navigate, mode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      // SECURITY: Biometric login no longer stores passwords
      // Users should use WebAuthn/Passkeys instead
      toast.error("Please use WebAuthn/Passkeys for biometric login. This legacy method has been disabled for security.");
    } catch (error: any) {
      toast.error(error.message || "Biometric login failed");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error} = await supabase.auth.signUp({
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

        // Save email and discount code to profile for marketing
        const usedDiscountCode = discountCode || localStorage.getItem('discountCode');
        const updateData: Record<string, string> = { email: signupEmail };
        
        if (usedDiscountCode) {
          updateData.signup_discount_code = usedDiscountCode.toUpperCase();
        }

        // Update profile with email and optional discount code
        await supabase
          .from("profiles")
          .update(updateData)
          .eq("user_id", data.user.id);

        if (usedDiscountCode) {
          // Increment discount code usage
          await supabase.rpc('increment_discount_usage', { _code: usedDiscountCode });
          localStorage.removeItem('discountCode');
          console.log('Discount code tracked:', usedDiscountCode);
        }
        
        console.log('New member email captured:', signupEmail);

        if (profile?.member_id) {
          // Send welcome email - now authenticated via JWT
          try {
            await supabase.functions.invoke("send-welcome-email", {
              body: {},
            });
          } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
          }

          toast.success(`Account created! Your Member ID: ${profile.member_id}`, {
            duration: 6000,
          });
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
    <div className="min-h-screen text-foreground overflow-x-hidden w-full max-w-full bg-background font-sans">
      {/* Ambient Background Effects - matching homepage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Header - matching homepage style */}
      <header className="relative border-b border-primary/20 bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-3">
            {/* Single centered logo on mobile, left logo on desktop */}
            <div 
              className="relative flex-shrink-0 cursor-pointer"
              {...longPressHandlers}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
              <img src={logo} alt="VALID" className="relative w-auto h-16 md:h-20 lg:h-24 select-none" draggable={false} />
            </div>

            {/* Tagline - visible on tablet and up */}
            <div className="hidden md:flex flex-1 justify-center px-4 lg:px-8">
              <div className="relative px-6 py-2 lg:px-8 lg:py-3 rounded-full bg-gradient-to-r from-primary/30 via-accent/25 to-primary/30 border border-primary/50 shadow-[0_0_25px_hsl(var(--secondary)/0.5)]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-accent/30 to-primary/40 blur-xl rounded-full animate-pulse"></div>
                <p className="relative text-xs lg:text-base font-bold text-center whitespace-nowrap text-primary-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  Confidently Share Peer-To-Peer Record Status For Mutual Safety
                </p>
              </div>
            </div>

            {/* Right logo - only visible on desktop */}
            <div className="hidden lg:block relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
              <img src={logo} alt="VALID" className="relative w-auto h-24" />
            </div>
          </div>
        </div>
      </header>

      <main className="relative min-h-[calc(100vh-200px)] flex items-start md:items-center justify-center py-6 md:py-12 px-4 z-10">
        <div className="container mx-auto w-[95vw] max-w-lg mt-4 md:mt-0">
          {/* Login Form */}
          {mode === "login" ? (
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-lg"></div>
              <Card className="relative bg-card/50 backdrop-blur-sm border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.4)]">
                <CardHeader>
                  <CardTitle className="text-3xl text-center bg-gradient-to-r from-primary via-accent to-foreground bg-clip-text text-transparent font-bold">
                    Member Login
                  </CardTitle>
                  <CardDescription className="text-center text-muted-foreground">Welcome back! Access your profile and QR code</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email Address</Label>
                      <Input 
                        id="login-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          localStorage.setItem('loginEmail', e.target.value);
                        }}
                        required
                        className="h-14"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input 
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          className="pr-10 h-14"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="w-full min-h-[48px] relative shadow-[0_0_20px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.8)] border border-primary/60 bg-primary text-primary-foreground font-semibold" 
                      type="submit"
                      disabled={loading}
                    >
                      <div className="absolute inset-0 bg-primary/30 blur-xl rounded-md -z-10"></div>
                      {loading ? "Logging in..." : "Log In"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="text-center pt-4 space-y-3">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate("/")}
                        className="w-full min-h-[48px] rounded-full border border-accent/50 bg-accent/10 hover:bg-accent/20 text-foreground font-semibold"
                      >
                        New member? Sign up here
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate("/")}
                        className="w-full min-h-[48px] rounded-full border border-muted-foreground/30 bg-muted/20 hover:bg-muted/40 text-muted-foreground font-semibold"
                      >
                        ← Back to Home
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Signup Form */
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 blur-2xl rounded-lg"></div>
              <Card className="relative bg-card/50 backdrop-blur-sm border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
                <CardHeader>
                  <CardTitle className="text-3xl text-center bg-gradient-to-r from-primary via-accent to-foreground bg-clip-text text-transparent font-bold">
                    Complete Your Membership
                  </CardTitle>
                  <CardDescription className="text-center text-muted-foreground">Create your account to get started</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name *</Label>
                      <Input 
                        id="signup-name"
                        placeholder="Enter your full name"
                        value={signupFullName}
                        onChange={(e) => setSignupFullName(e.target.value)}
                        required
                        className="h-14"
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
                        className="h-14"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password *</Label>
                      <div className="relative">
                        <Input 
                          id="signup-password"
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="Create a secure password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                          minLength={6}
                          className="pr-10 h-14"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                        >
                          {showSignupPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="w-full min-h-[48px] relative shadow-[0_0_20px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.8)] border border-primary/60 bg-primary text-primary-foreground font-semibold" 
                      type="submit"
                      disabled={loading}
                    >
                      <div className="absolute inset-0 bg-primary/30 blur-xl rounded-md -z-10"></div>
                      {loading ? "Creating Account..." : "Create Account"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="text-center pt-4 space-y-3">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate("/auth?mode=login")}
                        className="w-full min-h-[48px] rounded-full border border-accent/50 bg-accent/10 hover:bg-accent/20 text-foreground font-semibold"
                      >
                        Already a member? Log in
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate("/")}
                        className="w-full min-h-[48px] rounded-full border border-muted-foreground/30 bg-muted/20 hover:bg-muted/40 text-muted-foreground font-semibold"
                      >
                        ← Back to Home
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Auth;
