import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Shield, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ADMIN_EMAILS = [
  "sgrillocce@gmail.com",
  "aeidigitalsolutions@gmail.com"
];

interface AdminLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminLoginDialog = ({ open, onOpenChange }: AdminLoginDialogProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCreateMode, setIsCreateMode] = useState(false);

  const isValidAdminEmail = (email: string) => {
    return ADMIN_EMAILS.includes(email.toLowerCase().trim());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      onOpenChange(false);
      navigate("/admin");
    } catch (err) {
      console.error("Admin login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidAdminEmail(email)) {
      setError("This email is not authorized for admin access.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // First try to sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("This email is already registered. Please use Sign In instead.");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (!signUpData.user) {
        setError("Failed to create account. Please try again.");
        return;
      }

      // Call edge function to set admin role (since RLS prevents direct insert)
      const { error: roleError } = await supabase.functions.invoke('create-first-admin', {
        body: { user_id: signUpData.user.id, email: email.trim() }
      });

      if (roleError) {
        console.error("Error setting admin role:", roleError);
        // Continue anyway - the edge function may have succeeded
      }

      toast.success("Admin account created! You can now sign in.");
      setIsCreateMode(false);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Admin creation error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-amber-500/30 top-[10%] translate-y-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-green-500/5 to-amber-500/10 blur-3xl rounded-lg -z-10"></div>
        
        <DialogHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-gradient-to-br from-amber-500/20 to-green-500/20 border-2 border-amber-500/40">
              {isCreateMode ? (
                <UserPlus className="h-8 w-8 text-amber-400" />
              ) : (
                <Shield className="h-8 w-8 text-amber-400" />
              )}
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-green-400 to-amber-500 bg-clip-text text-transparent" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            {isCreateMode ? "Create Admin Access" : "Administrator Access"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isCreateMode ? "Set up a new admin account" : "Authorized personnel only"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={isCreateMode ? handleCreateAdmin : handleLogin} className="space-y-4 mt-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50 border-amber-500/30 focus:border-amber-500/60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder={isCreateMode ? "Create a password" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50 pr-10 border-amber-500/30 focus:border-amber-500/60"
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

          {isCreateMode && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-background/50 border-amber-500/30 focus:border-amber-500/60"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full relative shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:shadow-[0_0_30px_rgba(245,158,11,0.7)] border-2 border-amber-500/60 bg-amber-600/20 text-amber-300 font-bold"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
            disabled={loading}
          >
            {loading 
              ? (isCreateMode ? "Creating..." : "Authenticating...") 
              : (isCreateMode ? "Create Admin Account" : "Sign In as Admin")
            }
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              className="text-amber-400 hover:text-amber-300"
              onClick={() => {
                setIsCreateMode(!isCreateMode);
                resetForm();
              }}
            >
              {isCreateMode 
                ? "Already have an account? Sign In" 
                : "First time? Create Admin Access"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
