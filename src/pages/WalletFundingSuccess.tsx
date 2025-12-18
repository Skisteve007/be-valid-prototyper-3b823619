import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function WalletFundingSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      const transactionId = searchParams.get("transaction_id");

      if (!sessionId || !transactionId) {
        setStatus("error");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("verify-wallet-funding", {
          body: { sessionId, transactionId }
        });

        if (error || data?.error) throw new Error(data?.error || error.message);
        setResult(data);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          {status === "loading" && <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />}
          {status === "success" && <CheckCircle className="h-12 w-12 mx-auto text-green-500" />}
          {status === "error" && <XCircle className="h-12 w-12 mx-auto text-destructive" />}
          <CardTitle className="mt-4">
            {status === "loading" && "Processing Payment..."}
            {status === "success" && "Wallet Funded!"}
            {status === "error" && "Payment Issue"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === "success" && result && (
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-600">+${result.amount?.toFixed(2)}</p>
              <p className="text-muted-foreground text-sm">
                Fee: ${result.convenienceFee?.toFixed(2)} • Total: ${result.totalCharged?.toFixed(2)}
              </p>
            </div>
          )}
          {status === "error" && (
            <p className="text-muted-foreground">Please contact support if you were charged.</p>
          )}
          <Button onClick={() => navigate("/dashboard?tab=wallet")} className="w-full">
            <Wallet className="h-4 w-4 mr-2" /> Go to Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
