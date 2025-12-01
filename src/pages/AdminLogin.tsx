import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/clean-check-logo-v2.png";

const ADMIN_EMAILS = [
  "sgrillocce@gmail.com",
  "office@bigtexasroof.com"
];

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkIfSetupNeeded();
  }, []);

  const checkIfSetupNeeded = async () => {
    try {
      // Check if any admin exists
      const { data, error } = await supabase
        .from("user_roles")
        .select("id")
        .eq("role", "administrator")
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0) {
        // No admin exists, redirect to setup
        navigate("/admin/setup");
      }
    } catch (err) {
      console.error("Error checking admin setup:", err);
    } finally {
      setCheckingSetup(false);
    }
  };

  const isValidAdminEmail = (email: string) => {
    return ADMIN_EMAILS.includes(email.toLowerCase().trim());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate admin email
    if (!isValidAdminEmail(email)) {
      setError("This email is not authorized for admin access.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError("Invalid email or password.");
        return;
      }

      if (!data.user) {
        setError("Authentication failed. Please try again.");
        return;
      }

      // Verify admin role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "administrator")
        .maybeSingle();

      if (roleError || !roleData) {
        await supabase.auth.signOut();
        setError("This account does not have administrator privileges.");
        return;
      }

      toast.success("Admin login successful!");
      navigate("/admin");
    } catch (err) {
      console.error("Admin login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-purple-400 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Checking admin setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/60 via-pink-500/60 to-purple-500/60 blur-3xl rounded-full scale-150"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/40 via-pink-400/40 to-purple-400/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
              <img src={logo} alt="Clean Check" className="relative w-auto" style={{ height: '84px' }} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-lg"></div>
          
          <CardHeader className="relative text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-purple-500/20 border-2 border-purple-500/40">
                <Shield className="h-12 w-12 text-purple-400" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              Administrator Access
            </CardTitle>
            <CardDescription className="text-base text-white/90">
              Authorized personnel only
            </CardDescription>
          </CardHeader>

          <CardContent className="relative">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
                <p className="text-xs text-white/70">
                  Only authorized admin emails can access this panel
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full relative shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:shadow-[0_0_40px_rgba(168,85,247,0.9)] border-2 border-purple-500/60 bg-purple-600/20 text-purple-300 font-bold text-base"
                disabled={loading}
              >
                <div className="absolute inset-0 bg-purple-500/25 blur-lg rounded-md -z-10"></div>
                {loading ? "Authenticating..." : "Sign In as Admin"}
              </Button>

              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/")}
                  className="text-sm text-white/70 hover:text-white"
                >
                  ← Back to Home
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminLogin;
