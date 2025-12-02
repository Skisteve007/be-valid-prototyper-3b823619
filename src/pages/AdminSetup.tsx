import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/clean-check-logo.png";

const ADMIN_EMAILS = [
  "sgrillocce@gmail.com",
  "office@bigtexasroof.com"
];

const AdminSetup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkExistingAdmin();
  }, []);

  const checkExistingAdmin = async () => {
    try {
      // Check if any admin exists
      const { data, error } = await supabase
        .from("user_roles")
        .select("id")
        .eq("role", "administrator")
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        // Admin exists, redirect to login
        navigate("/admin/login");
      }
    } catch (err) {
      console.error("Error checking admin:", err);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
      setError("This email is not authorized for admin access.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Call the edge function to create first admin
      const { data: createData, error: createError } = await supabase.functions.invoke(
        "create-first-admin",
        {
          body: {
            email: email.trim(),
            password,
          },
        }
      );

      // Handle the case where admin already exists (400 response)
      if (createError || (createData && !createData.success)) {
        const errorMessage = createData?.error || createError?.message || "Unknown error";
        
        if (errorMessage.toLowerCase().includes("administrator already exists")) {
          toast.info("Admin account already exists. Redirecting to login...");
          setTimeout(() => navigate("/admin/login"), 1000);
          return;
        }
        
        throw new Error(errorMessage);
      }

      toast.success("Admin account created successfully!");
      
      // Sign in the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        toast.error("Account created but login failed. Please try logging in manually.");
        setTimeout(() => navigate("/admin/login"), 2000);
        return;
      }

      // Redirect to admin panel
      navigate("/admin");
    } catch (err: any) {
      console.error("Admin setup error:", err);
      
      // Double-check if this is the "admin exists" error
      if (err.message && err.message.toLowerCase().includes("administrator already exists")) {
        toast.info("Admin account already exists. Redirecting to login...");
        setTimeout(() => navigate("/admin/login"), 1000);
        return;
      }
      
      setError(err.message || "Failed to create admin account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-purple-400 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Checking admin status...</p>
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
              Create First Admin
            </CardTitle>
            <CardDescription className="text-base">
              Set up your administrator account
            </CardDescription>
          </CardHeader>

          <CardContent className="relative">
            <form onSubmit={handleSetup} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm space-y-1">
                    <p className="font-medium text-foreground">Authorized emails:</p>
                    {ADMIN_EMAILS.map((adminEmail) => (
                      <p key={adminEmail} className="text-muted-foreground">{adminEmail}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter authorized email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Choose a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-background/50"
                  autoComplete="new-password"
                />
                <p className="text-xs text-muted-foreground">At least 6 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-background/50"
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full relative shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:shadow-[0_0_40px_rgba(168,85,247,0.9)] border-2 border-purple-500/60 bg-purple-600/20 text-purple-300 font-bold text-base mt-6"
                disabled={loading}
              >
                <div className="absolute inset-0 bg-purple-500/25 blur-lg rounded-md -z-10"></div>
                {loading ? "Creating Admin..." : "Create Admin Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminSetup;
