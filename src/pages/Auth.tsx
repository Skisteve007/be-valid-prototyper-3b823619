import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowRight, Fingerprint } from "lucide-react";
import logo from "@/assets/clean-check-logo.png";
import { 
  isBiometricAvailable, 
  authenticateWithBiometric, 
  getStoredCredentials
} from "@/lib/biometric";
import Footer from "@/components/Footer";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode") || "signup";
  const [loading, setLoading] = useState(false);
  const [signupFullName, setSignupFullName] = useState(location.state?.fullName || "");
  const [signupEmail, setSignupEmail] = useState(location.state?.email || "");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
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
  }, [navigate]);

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo on the left */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 via-pink-500/60 to-blue-500/60 blur-3xl rounded-full scale-150"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-pink-400/40 to-blue-400/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
              <img src={logo} alt="Clean Check" className="relative w-auto" style={{ height: '84px' }} />
            </div>

            {/* Tagline in the middle */}
            <div className="hidden lg:flex flex-1 justify-center px-8">
              <div className="bg-muted/50 px-6 py-3 rounded-full border-2 border-border">
                <p className="text-base font-bold text-center whitespace-nowrap bg-gradient-to-r from-blue-600 via-pink-600 to-blue-700 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  Confidently Share Peer-To-Peer Record Status For Mutual Safety And Informed Intimacy
                </p>
              </div>
            </div>

            {/* Logo on the right */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 via-pink-500/60 to-blue-500/60 blur-3xl rounded-full scale-150"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-pink-400/40 to-blue-400/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
              <img src={logo} alt="Clean Check" className="relative w-auto" style={{ height: '84px' }} />
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="container mx-auto max-w-md">
          {/* Login Form */}
          {mode === "login" ? (
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-lg"></div>
              <Card className="relative border-2 border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                <CardHeader>
                  <CardTitle className="text-3xl text-center bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                    Member Login
                  </CardTitle>
                  <CardDescription className="text-center">Welcome back! Access your profile and QR code</CardDescription>
                </CardHeader>
                <CardContent>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input 
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="w-full" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Log In"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="text-center pt-4 space-y-2">
                      <div>
                        <Button 
                          type="button" 
                          variant="link" 
                          onClick={() => navigate("/")}
                        >
                          New member? Sign up here
                        </Button>
                      </div>
                      <div>
                        <Button 
                          type="button" 
                          variant="link" 
                          onClick={() => navigate("/")}
                        >
                          ← Back to Home
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Signup Form */
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-pink-500/30 to-blue-500/30 blur-2xl rounded-lg"></div>
              <Card className="relative border-2 border-primary/40 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                <CardHeader>
                  <CardTitle className="text-3xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Complete Your Membership
                  </CardTitle>
                  <CardDescription className="text-center">Create your account to get started</CardDescription>
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
                    
                    <Button 
                      size="lg" 
                      className="w-full" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Create Account"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="text-center pt-4 space-y-2">
                      <div>
                        <Button 
                          type="button" 
                          variant="link" 
                          onClick={() => navigate("/auth?mode=login")}
                        >
                          Already a member? Log in
                        </Button>
                      </div>
                      <div>
                        <Button 
                          type="button" 
                          variant="link" 
                          onClick={() => navigate("/")}
                        >
                          ← Back to Home
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
