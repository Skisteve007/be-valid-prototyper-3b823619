import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2, Home, AlertCircle } from "lucide-react";
import logo from "@/assets/clean-check-logo.png";

interface CertificateData {
  member_id: string;
  full_name: string;
  profile_image_url: string | null;
  test_type: string;
  result: string;
  verified_date: string;
  expires_at: string;
}

const SafetyCertificate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCertificate();
  }, []);

  const loadCertificate = async () => {
    try {
      const token = searchParams.get("token");
      if (!token) {
        setError("Invalid certificate link");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke(
        "view-safety-certificate",
        {
          body: { token },
        }
      );

      if (error) throw error;
      setCertificate(data);
    } catch (err: any) {
      console.error("Error loading certificate:", err);
      setError(err.message || "Failed to load certificate");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4">
        <Card className="max-w-md w-full border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              Certificate Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {error || "This certificate link is invalid or has expired."}
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center">
            <img src={logo} alt="Clean Check" className="h-16 w-auto" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="shadow-2xl border-green-500/40 bg-gradient-to-br from-white to-green-50/50 dark:from-gray-900 dark:to-green-950/30">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/30 blur-2xl rounded-full"></div>
                  <ShieldCheck className="relative h-16 w-16 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-3xl bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                Toxicology Lab Certified Certificate
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4 p-4 bg-green-50/50 dark:bg-green-950/20 rounded-lg border border-green-500/30">
                {certificate.profile_image_url && (
                  <img
                    src={certificate.profile_image_url}
                    alt={certificate.full_name}
                    className="h-16 w-16 rounded-full object-cover border-2 border-green-500"
                  />
                )}
                <div>
                  <h3 className="font-bold text-lg">{certificate.full_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Member ID: {certificate.member_id}
                  </p>
                </div>
              </div>

              {/* Test Result */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border-4 border-green-500 shadow-lg">
                <div className="text-center space-y-3">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {certificate.test_type}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <ShieldCheck className="h-8 w-8 text-green-600" />
                    <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                      {certificate.result}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Verified: {certificate.verified_date}
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-green-50/50 dark:bg-green-950/20 border border-green-500/30 rounded-lg p-4 space-y-2">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-green-700 dark:text-green-400">
                    Certificate Verification
                  </strong>
                </p>
                <p className="text-xs text-muted-foreground">
                  This certificate verifies that {certificate.full_name} completed
                  a 10-panel toxicology screening with negative results on{" "}
                  {certificate.verified_date}. Results were verified by our
                  certified lab partners.
                </p>
                <p className="text-xs text-muted-foreground italic mt-2">
                  Certificate expires:{" "}
                  {new Date(certificate.expires_at).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4">
                <Button
                  onClick={() => navigate("/")}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  size="lg"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Visit Clean Check
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              🔒 Powered by Clean Check - Elevating Intimacy through Verified
              Transparency
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SafetyCertificate;