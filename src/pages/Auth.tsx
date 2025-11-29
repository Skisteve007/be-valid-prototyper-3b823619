import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Fingerprint } from "lucide-react";
import logo from "@/assets/clean-check-logo.png";
import { 
  isBiometricAvailable, 
  authenticateWithBiometric, 
  getStoredCredentials,
  setupBiometricLogin 
} from "@/lib/biometric";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFullName, setSignupFullName] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [enableBiometric, setEnableBiometric] = useState(false);

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
  }, [navigate]);

  const handleBiometricLogin = async () => {
    setLoading(true);
    try {
      const authenticated = await authenticateWithBiometric();
      if (!authenticated) {
        throw new Error("Biometric authentication failed");
      }

      const credentials = await getStoredCredentials();
      if (!credentials) {
        throw new Error("No stored credentials found");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      toast.success("Logged in with biometrics");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Biometric login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Clean Check" className="h-24 w-auto" />
          </div>
          <CardDescription>Elevating Intimacy through QR Code Speed with Verified Transparency & Mutual Trust.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
                
                {biometricAvailable && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleBiometricLogin}
                      disabled={loading}
                    >
                      <Fingerprint className="mr-2 h-4 w-4" />
                      Login with Biometrics
                    </Button>
                  </>
                )}
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
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
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;