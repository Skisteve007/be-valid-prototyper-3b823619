import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("No verification token provided");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("verify-email", {
          body: { token },
        });

        if (error || data?.error) {
          setStatus("error");
          setMessage(data?.error || error?.message || "Verification failed");
        } else {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "An unexpected error occurred");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E1A] via-[#0d1221] to-[#120a21] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-background/20 backdrop-blur-xl border border-primary/30 rounded-2xl p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Verifying Your Email</h1>
            <p className="text-muted-foreground">Please wait...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Email Verified!</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button 
              onClick={() => navigate("/auth")}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Continue to Login
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Verification Failed</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button 
              onClick={() => navigate("/auth")}
              variant="outline"
              className="w-full"
            >
              Back to Login
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
