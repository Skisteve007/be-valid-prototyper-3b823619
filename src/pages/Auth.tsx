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
import { ArrowRight, Eye, EyeOff, Mail, Loader2, Fingerprint } from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";
import { useLongPressHome } from "@/hooks/useLongPressHome";
import { BetaBanner } from "@/components/BetaBanner";
import { 
  isWebAuthnAvailable, 
  hasWebAuthnCredential, 
  authenticateWithWebAuthn, 
  registerWebAuthnCredential,
  getStoredWebAuthnCredential
} from "@/lib/webauthn";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const longPressHandlers = useLongPressHome();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode") || "signup";
  const redirectTo = searchParams.get("redirect") || "/dashboard";
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
  
  // Returning user state
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [savedUserName, setSavedUserName] = useState("");
  const [preferredAuthMethod, setPreferredAuthMethod] = useState<string | null>(null);
  
  // Biometric state
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [hasBiometricCredential, setHasBiometricCredential] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [pendingBiometricSetup, setPendingBiometricSetup] = useState<{ userId: string; email: string; name: string } | null>(null);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Save discount code to localStorage if present in URL
    const urlDiscount = searchParams.get("discount");
    if (urlDiscount) {
      localStorage.setItem('discountCode', urlDiscount);
    }
    
    // Check for returning user
    const savedEmail = localStorage.getItem('valid_user_email');
    const savedName = localStorage.getItem('valid_user_name');
    const savedPreferredAuth = localStorage.getItem('valid_preferred_auth');
    
    if (savedEmail) {
      setLoginEmail(savedEmail);
      setIsReturningUser(true);
      if (savedName) {
        setSavedUserName(savedName);
      }
      if (savedPreferredAuth) {
        setPreferredAuthMethod(savedPreferredAuth);
      }
    }
    
    // Check biometric availability
    const checkBiometric = async () => {
      const available = await isWebAuthnAvailable();
      setBiometricAvailable(available);
      if (available) {
        setHasBiometricCredential(hasWebAuthnCredential());
      }
    };
    checkBiometric();
    
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user is an admin (admins bypass email verification)
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "administrator")
          .maybeSingle();
        
        if (roleData) {
          // Admin - let them in regardless of email verification
          navigate(redirectTo);
          return;
        }
        
        // Check if user's email is verified via our custom system
        const { data: profile } = await supabase
          .from("profiles")
          .select("email_verified")
          .eq("user_id", session.user.id)
          .single();
        
        if (profile?.email_verified) {
          // Redirect to saved destination or member dashboard
          navigate(redirectTo);
        } else if (profile) {
          // User is logged in but email not verified - sign them out
          await supabase.auth.signOut();
          setVerificationUserId(session.user.id);
          setVerificationEmail(session.user.email || "");
          setShowEmailVerification(true);
        }
        // If profile doesn't exist, let user stay on auth page
      }
    };
    checkUser();
  }, [navigate]);

  // Save user data on successful login
  const saveUserDataLocally = (email: string, name: string, authMethod: string) => {
    localStorage.setItem('valid_user_email', email);
    localStorage.setItem('valid_user_name', name);
    localStorage.setItem('valid_preferred_auth', authMethod);
  };

  // Clear saved user data
  const clearSavedUserData = () => {
    localStorage.removeItem('valid_user_email');
    localStorage.removeItem('valid_user_name');
    localStorage.removeItem('valid_preferred_auth');
    setIsReturningUser(false);
    setSavedUserName("");
    setLoginEmail("");
    setPreferredAuthMethod(null);
  };

  // Handle biometric login
  const handleBiometricLogin = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const result = await authenticateWithWebAuthn();
      
      if (result.success && result.email) {
        // Get session from Supabase - user should already be logged in if they have a valid session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Check if email is verified
          const { data: profile } = await supabase
            .from("profiles")
            .select("email_verified, full_name")
            .eq("user_id", session.user.id)
            .single();
          
          if (profile?.email_verified) {
            saveUserDataLocally(session.user.email || result.email, profile.full_name || "", "biometric");
            toast.success("Welcome back!");
            navigate(redirectTo);
            return;
          }
        }
        
        // No active session - need to login with password
        toast.error("Session expired. Please enter your password.");
        setLoginEmail(result.email);
      } else {
        toast.error("Biometric authentication failed");
      }
    } catch (error: any) {
      toast.error("Biometric authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth - disabled by default until configured in Supabase
  const GOOGLE_ENABLED = false;

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    if (loading || !GOOGLE_ENABLED) return;
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });
      
      if (error) {
        // Handle unsupported provider error gracefully
        if (error.message?.includes('unsupported provider') || error.message?.includes('not enabled')) {
          toast.error("Google sign-in is not available. Please use email/password.");
        } else {
          throw error;
        }
        return;
      }
      
      // OAuth redirects - save preferred method
      localStorage.setItem('valid_preferred_auth', 'google');
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  // Prompt to enable biometric after successful login
  const promptBiometricSetup = async (userId: string, email: string, name: string) => {
    if (biometricAvailable && !hasWebAuthnCredential()) {
      setPendingBiometricSetup({ userId, email, name });
      setShowBiometricPrompt(true);
    }
  };

  // Setup biometric credential
  const handleBiometricSetup = async () => {
    if (!pendingBiometricSetup) return;
    
    try {
      const success = await registerWebAuthnCredential(
        pendingBiometricSetup.userId,
        pendingBiometricSetup.email,
        pendingBiometricSetup.name
      );
      
      if (success) {
        setHasBiometricCredential(true);
        toast.success("Biometric login enabled!");
      } else {
        toast.error("Failed to enable biometric login");
      }
    } catch (error) {
      toast.error("Failed to enable biometric login");
    }
    
    setShowBiometricPrompt(false);
    setPendingBiometricSetup(null);
    navigate(redirectTo);
  };

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
        // Check if user is admin (bypass email verification for admins)
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "administrator")
          .maybeSingle();
        
        if (roleData) {
          // Admin - let them in regardless of email verification
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", data.user.id)
            .single();
          
          saveUserDataLocally(data.user.email || loginEmail, profile?.full_name || "", "email");
          toast.success("Welcome back, Admin!");
          navigate(redirectTo);
          return;
        }
        
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

        // Save user data locally for returning user experience
        saveUserDataLocally(data.user.email || loginEmail, profile?.full_name || "", "email");
        
        // Prompt biometric setup if available
        if (biometricAvailable && !hasWebAuthnCredential()) {
          setPendingBiometricSetup({
            userId: data.user.id,
            email: data.user.email || loginEmail,
            name: profile?.full_name || ""
          });
          setShowBiometricPrompt(true);
          setLoading(false);
          return;
        }
      }

      toast.success("Welcome back!");
      navigate(redirectTo);
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
          emailRedirectTo: `${window.location.origin}/`,
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

        // Send admin alert for new signup (fire and forget - don't block user flow)
        supabase.functions.invoke("notify-signup-alert", {
          body: {
            userId: data.user.id,
            email: signupEmail,
            fullName: fullName,
            createdAt: new Date().toISOString(),
            source: document.referrer || 'direct',
          },
        }).catch(err => console.error("Failed to send signup alert:", err));
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

  // Google Sign-In Button Component - only render if enabled
  const GoogleSignInButton = () => {
    if (!GOOGLE_ENABLED) return null;
    
    return (
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full py-4 bg-white dark:bg-white border border-border rounded-xl flex items-center justify-center gap-3 text-gray-800 font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>Continue with Google</span>
      </button>
    );
  };

  // Biometric Sign-In Button Component
  const BiometricSignInButton = () => {
    if (!biometricAvailable || !hasBiometricCredential) return null;
    
    const storedCred = getStoredWebAuthnCredential();
    
    return (
      <button
        type="button"
        onClick={handleBiometricLogin}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center gap-3 text-foreground font-semibold hover:from-purple-500/30 hover:to-pink-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Fingerprint className="w-6 h-6" />
        <span>Sign in with Face ID / Touch ID</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden w-full max-w-full bg-slate-950 font-sans">
      {/* Ambient Background Effects - matching homepage cyan theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      {/* Header - Clean minimal design */}
      <header className="relative border-b border-cyan-400/20 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-center">
            {/* Centered logo */}
            <div 
              className="relative flex-shrink-0 cursor-pointer"
              {...longPressHandlers}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-blue-400/40 to-cyan-400/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
              <img src={logo} alt="VALID" className="relative w-auto h-16 md:h-20 lg:h-24 select-none" draggable={false} />
            </div>
          </div>
        </div>
      </header>

      <main className="relative min-h-[calc(100vh-200px)] flex items-start md:items-center justify-center py-6 md:py-12 px-4 z-10">
        <div className="container mx-auto w-[95vw] max-w-lg mt-4 md:mt-0">
          {/* Beta Banner - Above Forms */}
          <div className="mb-6">
            <BetaBanner variant="compact" />
          </div>
          
          {/* Biometric Setup Prompt Modal */}
          <Dialog open={showBiometricPrompt} onOpenChange={setShowBiometricPrompt}>
            <DialogContent className="max-w-md bg-card border-primary/30">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center">
                  <Fingerprint className="w-12 h-12 mx-auto mb-3 text-primary" />
                  Enable Quick Login?
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-center">
                <p className="text-muted-foreground">
                  Use Face ID / Touch ID to sign in instantly next time — no password needed.
                </p>
                <div className="space-y-3 pt-4">
                  <Button 
                    onClick={handleBiometricSetup}
                    className="w-full min-h-[48px] bg-primary text-primary-foreground"
                  >
                    ✅ Enable Biometric Login
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      setShowBiometricPrompt(false);
                      setPendingBiometricSetup(null);
                      navigate(redirectTo);
                    }}
                    className="w-full text-muted-foreground"
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Email Verification Message */}
          {showEmailVerification ? (
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-lg"></div>
              <Card className="relative bg-slate-900/50 backdrop-blur-sm border-cyan-400/30 shadow-[0_0_30px_rgba(0,240,255,0.3)]">
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
                      onClick={async () => {
                        // Check if user has an active session and is verified
                        const { data: { session } } = await supabase.auth.getSession();
                        if (session) {
                          // Check if admin or email verified
                          const { data: roleData } = await supabase
                            .from("user_roles")
                            .select("role")
                            .eq("user_id", session.user.id)
                            .eq("role", "administrator")
                            .maybeSingle();
                          
                          if (roleData) {
                            // Admin - let them in
                            navigate(redirectTo);
                            return;
                          }
                          
                          const { data: profile } = await supabase
                            .from("profiles")
                            .select("email_verified")
                            .eq("user_id", session.user.id)
                            .single();
                          
                          if (profile?.email_verified) {
                            navigate(redirectTo);
                            return;
                          }
                        }
                        // No session or not verified - go to login
                        navigate("/auth?mode=login");
                      }}
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
              <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-lg"></div>
              <Card className="relative bg-slate-900/50 backdrop-blur-sm border-cyan-400/30 shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                <CardHeader>
                  <CardTitle className="text-3xl text-center bg-gradient-to-r from-cyan-400 via-white to-blue-400 bg-clip-text text-transparent font-bold">
                    {isReturningUser ? (
                      <>Welcome back{savedUserName ? `, ${savedUserName.split(' ')[0]}` : ''}! 👋</>
                    ) : (
                      'Member Login'
                    )}
                  </CardTitle>
                  <CardDescription className="text-center text-muted-foreground">
                    {isReturningUser 
                      ? "Sign in to access your profile and QR code" 
                      : "Welcome back! Access your profile and QR code"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {/* Biometric & Social Login Options */}
                  <div className="space-y-3">
                    <BiometricSignInButton />
                    <GoogleSignInButton />
                  </div>
                  
                  {/* Divider - Click focuses email field */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-cyan-400/30" />
                    </div>
                    <div className="relative flex justify-center">
                      <button
                        type="button"
                        onClick={() => document.getElementById('login-email')?.focus()}
                        className="px-6 py-2 text-xs font-bold tracking-wider uppercase rounded-full border border-cyan-400/60 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all cursor-pointer"
                      >
                        Sign In With Email
                      </button>
                    </div>
                  </div>
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email Address</Label>
                      <div className="relative">
                        <Input 
                          id="login-email"
                          type="email"
                          name="email"
                          autoComplete="email"
                          placeholder="your.email@example.com"
                          value={loginEmail}
                          onChange={(e) => {
                            setLoginEmail(e.target.value);
                          }}
                          required
                          className="h-14"
                        />
                        {isReturningUser && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary">
                            ✓ remembered
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input 
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          name="password"
                          autoComplete="current-password"
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
                      {loading ? "Logging in..." : "🔓 Sign In"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    {/* Switch account for returning users */}
                    {isReturningUser && (
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={clearSavedUserData}
                          className="text-sm text-muted-foreground hover:text-primary transition"
                        >
                          Not {savedUserName || loginEmail}? Switch account
                        </button>
                      </div>
                    )}

                    <div className="text-center pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate(`/auth${redirectTo !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`)}
                        className="w-full min-h-[48px] rounded-full border border-accent/50 bg-accent/10 hover:bg-accent/20 text-foreground font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis px-4"
                      >
                        New member? Sign up
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Signup Form */
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-cyan-500/20 blur-2xl rounded-lg"></div>
              <Card className="relative bg-slate-900/50 backdrop-blur-sm border-cyan-400/30 shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl md:text-3xl text-center font-bold tracking-wide bg-gradient-to-r from-cyan-400 via-white to-blue-400 bg-clip-text text-transparent">
                    One Key. Verify. Pay. Vibe.
                  </CardTitle>
                  <CardDescription className="text-center text-lg font-semibold text-cyan-400 tracking-wider mt-2">
                    Your identity, controlled.
                  </CardDescription>
                  <div className="text-center pt-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate(`/auth?mode=login${redirectTo !== '/dashboard' ? `&redirect=${encodeURIComponent(redirectTo)}` : ''}`)}
                      className="min-h-[48px] px-6 rounded-full border border-cyan-400/60 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-semibold text-sm whitespace-nowrap"
                    >
                      Already a member? Log in
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-4 space-y-4">
                  {/* Social Sign Up Options */}
                  <div className="space-y-3">
                    <GoogleSignInButton />
                  </div>
                  
                  {/* Divider - Click focuses email field */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-cyan-400/30" />
                    </div>
                    <div className="relative flex justify-center">
                      <button
                        type="button"
                        onClick={() => document.getElementById('signup-first-name')?.focus()}
                        className="px-6 py-2 text-xs font-bold tracking-wider uppercase rounded-full border border-cyan-400/60 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all cursor-pointer"
                      >
                        Sign Up With Email
                      </button>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-first-name">First Name *</Label>
                        <Input 
                          id="signup-first-name"
                          name="given-name"
                          autoComplete="given-name"
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
                          name="family-name"
                          autoComplete="family-name"
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
                        name="email"
                        autoComplete="email"
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
                          name="new-password"
                          autoComplete="new-password"
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
