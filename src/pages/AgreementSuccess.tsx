import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, Calendar, Mail } from "lucide-react";
import { AGREEMENT_TIERS } from "@/config/agreementTiers";

const AgreementSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tierId = searchParams.get("tier");
  const tier = AGREEMENT_TIERS.find(t => t.id === tierId);

  useEffect(() => {
    // You could verify the session here if needed
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className="border-green-500/50 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardHeader className="text-center pb-4">
            <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-400" />
            </div>
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/50 text-lg px-6 py-2 mx-auto">
              PAYMENT RECEIVED
            </Badge>
            <CardTitle className="text-3xl md:text-4xl">Agreement Activated</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 text-center">
            <p className="text-xl text-muted-foreground">
              Thank you! Your {tier?.name || "deployment"} agreement is now active. 
              The deployment clock has started.
            </p>

            {tier && (
              <div className="bg-muted/30 rounded-lg p-6 text-left space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-muted-foreground">Agreement</span>
                  <span className="text-lg font-semibold">{tier.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-muted-foreground">Payment 1</span>
                  <span className="text-lg font-semibold text-green-400">
                    ${tier.paymentSchedule[0].amount.toLocaleString()} ✓
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-muted-foreground">Next Payment</span>
                  <span className="text-lg font-semibold">
                    Day {tier.paymentSchedule[1].day}: ${tier.paymentSchedule[1].amount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                What Happens Next
              </h3>
              <ul className="text-left space-y-3 max-w-md mx-auto">
                <li className="flex items-start gap-3 text-lg text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 shrink-0" />
                  You'll receive a confirmation email with your agreement details
                </li>
                <li className="flex items-start gap-3 text-lg text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 shrink-0" />
                  Our team will reach out within 24 hours to begin onboarding
                </li>
                <li className="flex items-start gap-3 text-lg text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 shrink-0" />
                  Please prepare the client requirements for a smooth kickoff
                </li>
              </ul>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open('mailto:deploy@bevalid.app', '_blank')}
                className="text-lg"
              >
                <Mail className="mr-2 h-5 w-5" /> Contact Deployment Team
              </Button>
              <Button 
                size="lg" 
                className="text-lg"
                onClick={() => navigate("/operation-sf")}
              >
                Return to Operation SF <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgreementSuccess;
