import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AccessApproved = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status") === "success" ? "success" : "error";
  const type = searchParams.get("type") === "partner" ? "partner" : "investor";
  const email = searchParams.get("email") || "";
  const reason = searchParams.get("reason") || "";

  const accessLabel = useMemo(() => {
    return type === "investor" ? "Investor Deck" : "Partner Solutions";
  }, [type]);

  const title = status === "success" ? "Access Approved" : "Approval Link Error";
  const description =
    status === "success"
      ? `${accessLabel} access has been approved${email ? ` for ${email}` : ""}.`
      : "This approval link is invalid, expired, or could not be processed.";

  const metaDescription =
    status === "success"
      ? `Access approved for ${accessLabel}.`
      : "Approval link error. Please try again or contact support.";

  return (
    <>
      <Helmet>
        <title>{`${title} | VALID`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={`${window.location.origin}/access-approved`} />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-10">
          <section className="max-w-xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {status === "success" ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : (
                    <XCircle className="h-6 w-6 text-destructive" />
                  )}
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Access type</p>
                  <p className="font-medium">{accessLabel}</p>

                  {email ? (
                    <>
                      <p className="mt-4 text-sm text-muted-foreground">User</p>
                      <p className="font-medium break-all">{email}</p>
                    </>
                  ) : null}

                  {status !== "success" && reason ? (
                    <>
                      <p className="mt-4 text-sm text-muted-foreground">Reason</p>
                      <p className="font-medium">{reason}</p>
                    </>
                  ) : null}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => navigate("/admin")} className="w-full sm:w-auto">
                    Go to Admin
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/")}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
};

export default AccessApproved;
