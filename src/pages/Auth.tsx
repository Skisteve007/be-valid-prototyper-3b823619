import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Mail, Loader2 } from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";
import { useLongPressHome } from "@/hooks/useLongPressHome";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const longPressHandlers = useLongPressHome();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode") || "signup";
  const discountCode = searchParams.get("discount") || localStorage.getItem('discountCode') || "";
  const [loading, setLoading] = useState(false);
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState(location.state?.email || "");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showNdaModal, setShowNdaModal] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [resendingEmail, setResendingEmail] = useState(false);
  const [verificationUserId, setVerificationUserId] = useState("");

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
        // Check if user's email is verified via our custom system
        const { data: profile } = await supabase
          .from("profiles")
          .select("email_verified")
          .eq("user_id", session.user.id)
          .single();
        
        if (profile?.email_verified) {
          navigate("/investor-dashboard");
        } else {
          // User is logged in but email not verified - sign them out
          await supabase.auth.signOut();
          setVerificationUserId(session.user.id);
          setVerificationEmail(session.user.email || "");
          setShowEmailVerification(true);
        }
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
    
    if (loading) return;
    
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        setLoading(false);
        toast.error(error.message || "Login failed");
        return;
      }

      // Check if email is verified via our custom system
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email_verified, full_name")
          .eq("user_id", data.user.id)
          .single();
        
        if (!profile?.email_verified) {
          // Sign out the user - they can't access the app until verified
          await supabase.auth.signOut();
          setVerificationUserId(data.user.id);
          setLoading(false);
          setVerificationEmail(data.user.email || loginEmail);
          setShowEmailVerification(true);
          
          // Auto-send a fresh verification email
          const firstName = profile?.full_name?.split(' ')[0] || "User";
          try {
            await supabase.functions.invoke("send-auth-email", {
              body: {
                email: data.user.email || loginEmail,
                userId: data.user.id,
                firstName: firstName,
              },
            });
            toast.info("Verification email sent! Please check your inbox and spam folder.");
          } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            toast.error("Please verify your email. Click 'Resend' if you didn't receive it.");
          }
          return;
        }
      }

      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message || "Login failed");
    }
  };


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fullName = `${signupFirstName} ${signupLastName}`.trim();
      const { data, error} = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Check if user needs to confirm email (identities array is empty until confirmed)
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        // User already exists
        toast.error("An account with this email already exists. Please log in.");
        return;
      }

      // Save discount code to localStorage for later use after email confirmation
      const usedDiscountCode = discountCode || localStorage.getItem('discountCode');
      if (usedDiscountCode) {
        localStorage.setItem('pendingDiscountCode', usedDiscountCode.toUpperCase());
      }

      // Send branded verification email
      if (data.user) {
        setVerificationUserId(data.user.id);
        
        const { error: emailError, data: emailData } = await supabase.functions.invoke("send-auth-email", {
          body: {
            email: signupEmail,
            userId: data.user.id,
            firstName: signupFirstName,
          },
        });

        if (emailError) {
          console.error("Error sending verification email:", emailError);
          toast.error("Account created but failed to send verification email. Please use the resend button.");
        } else {
          toast.success("Verification email sent! Please check your inbox.");
        }
      }

      // Show email verification message
      setVerificationEmail(signupEmail);
      setShowEmailVerification(true);
      
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!verificationEmail || !verificationUserId) {
      toast.error("Missing user information. Please try signing up again.");
      return;
    }

    setResendingEmail(true);
    try {
      const { error } = await supabase.functions.invoke("send-auth-email", {
        body: {
          email: verificationEmail,
          userId: verificationUserId,
          firstName: signupFirstName || "User",
        },
      });

      if (error) {
        throw error;
      }
      toast.success("Verification email sent! Please check your inbox and spam folder.");
    } catch (error: any) {
      console.error("Resend error:", error);
      toast.error("Failed to resend email. Please try again.");
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden w-full max-w-full bg-background font-sans">
      {/* Ambient Background Effects - matching homepage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Header - Clean minimal design */}
      <header className="relative border-b border-primary/20 bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-center">
            {/* Centered logo */}
            <div 
              className="relative flex-shrink-0 cursor-pointer"
              {...longPressHandlers}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
              <img src={logo} alt="VALID" className="relative w-auto h-16 md:h-20 lg:h-24 select-none" draggable={false} />
            </div>
          </div>
        </div>
      </header>

      <main className="relative min-h-[calc(100vh-200px)] flex items-start md:items-center justify-center py-6 md:py-12 px-4 z-10">
        <div className="container mx-auto w-[95vw] max-w-lg mt-4 md:mt-0">
          {/* Email Verification Message */}
          {showEmailVerification ? (
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-lg"></div>
              <Card className="relative bg-card/50 backdrop-blur-sm border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.4)]">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl bg-gradient-to-r from-primary via-accent to-foreground bg-clip-text text-transparent font-bold">
                    Verification Link Sent
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">
                    Please check your email to unlock access.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8 text-center space-y-6">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <p className="text-sm text-muted-foreground mb-2">Security Check: A verification link has been sent to:</p>
                    <p className="font-semibold text-foreground break-all">{verificationEmail}</p>
                  </div>
                  
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>Please click the link in your email to unlock the Investor Dashboard.</p>
                    <p className="text-xs">This ensures every user is a real person.</p>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button 
                      onClick={handleResendVerification}
                      disabled={resendingEmail}
                      className="w-full min-h-[48px] rounded-full bg-primary text-primary-foreground font-semibold shadow-[0_0_20px_hsl(var(--primary)/0.6)]"
                    >
                      {resendingEmail ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Resend Verification Email"
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowEmailVerification(false);
                        setSignupEmail("");
                        setSignupPassword("");
                        setSignupFirstName("");
                        setSignupLastName("");
                        setTermsAccepted(false);
                      }}
                      className="w-full min-h-[48px] rounded-full border border-muted-foreground/30 bg-muted/20 hover:bg-muted/40 text-muted-foreground font-semibold"
                    >
                      ← Back to Sign Up
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate("/auth?mode=login")}
                      className="w-full min-h-[48px] rounded-full border border-accent/50 bg-accent/10 hover:bg-accent/20 text-foreground font-semibold"
                    >
                      Already verified? Log In
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : mode === "login" ? (
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

                    <div className="text-center pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate("/access-portal")}
                        className="w-full min-h-[48px] rounded-full border border-accent/50 bg-accent/10 hover:bg-accent/20 text-foreground font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis px-4"
                      >
                        New member? Sign up
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              {/* Back Home button - centered below card */}
              <div className="flex justify-center mt-6">
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => navigate("/")}
                  className="px-8 py-2 text-muted-foreground hover:text-foreground font-medium"
                >
                  ← Back to Home
                </Button>
              </div>
            </div>
          ) : (
            /* Signup Form */
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 blur-2xl rounded-lg"></div>
              <Card className="relative bg-card/50 backdrop-blur-sm border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl md:text-3xl text-center font-orbitron font-bold tracking-wide text-foreground">
                    One Key. Verify. Pay. Vibe.
                  </CardTitle>
                  <CardDescription className="text-center text-lg font-semibold text-primary tracking-wider mt-2">
                    Your identity, controlled.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-first-name">First Name *</Label>
                        <Input 
                          id="signup-first-name"
                          placeholder="First name"
                          value={signupFirstName}
                          onChange={(e) => setSignupFirstName(e.target.value)}
                          required
                          className="h-14"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-last-name">Last Name *</Label>
                        <Input 
                          id="signup-last-name"
                          placeholder="Last name"
                          value={signupLastName}
                          onChange={(e) => setSignupLastName(e.target.value)}
                          required
                          className="h-14"
                        />
                      </div>
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

                    {/* Mandatory Age + Terms/NDA Checkbox */}
                    <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30 border border-primary/20">
                      <Checkbox 
                        id="terms-checkbox"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                        className="mt-1"
                      />
                      <label 
                        htmlFor="terms-checkbox" 
                        className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
                      >
                        I confirm I am 18+ years of age, and I agree to the{" "}
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowNdaModal(true);
                          }}
                          className="text-primary hover:underline"
                        >
                          NDA
                        </button>{" "}
                        and{" "}
                        <a href="/terms" target="_blank" className="text-primary hover:underline">
                          Terms of Service
                        </a>.
                      </label>
                    </div>

                    {/* NDA Modal */}
                    <Dialog open={showNdaModal} onOpenChange={setShowNdaModal}>
                      <DialogContent className="max-w-lg bg-card border-primary/30">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            VALID™ BETA USER AGREEMENT
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 text-sm text-muted-foreground">
                          <p>
                            Welcome to the Valid™ ecosystem. As a Beta user, you are granted early access to our proprietary technologies, including the Ghost™ privacy architecture.
                          </p>
                          <p className="font-medium text-foreground">By creating an account, you agree:</p>
                          <ol className="list-decimal list-inside space-y-2 pl-2">
                            <li>To keep all upcoming features and interface designs confidential.</li>
                            <li>That Valid™ and Ghost™ are trademarks of the Company.</li>
                            <li>That this access is for personal use and testing purposes only.</li>
                          </ol>
                          <p className="pt-2 text-center italic text-primary/80">
                            Thank you for helping us build the future.
                          </p>
                        </div>
                        <Button 
                          onClick={() => setShowNdaModal(false)}
                          className="w-full mt-4"
                        >
                          I Understand
                        </Button>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="lg" 
                      className="w-full min-h-[48px] relative shadow-[0_0_20px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.8)] border border-primary/60 bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
                      type="submit"
                      disabled={loading || !termsAccepted}
                    >
                      <div className="absolute inset-0 bg-primary/30 blur-xl rounded-md -z-10"></div>
                      {loading ? "Creating Account..." : "Create Account"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="text-center pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate("/auth?mode=login")}
                        className="w-full min-h-[48px] rounded-full border border-accent/50 bg-accent/10 hover:bg-accent/20 text-foreground font-semibold"
                      >
                        Already a member? Log in
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              {/* Back Home button - centered below card */}
              <div className="flex justify-center mt-6">
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => navigate("/")}
                  className="px-8 py-2 text-muted-foreground hover:text-foreground font-medium"
                >
                  ← Back to Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Auth;
