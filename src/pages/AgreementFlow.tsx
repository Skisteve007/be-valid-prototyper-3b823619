import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, FileText, Shield, DollarSign, CheckCircle2 } from "lucide-react";
import { AGREEMENT_TIERS } from "@/config/agreementTiers";
import { supabase } from "@/integrations/supabase/client";

const AgreementFlow = () => {
  const navigate = useNavigate();
  const { tierId } = useParams<{ tierId: string }>();
  const tier = AGREEMENT_TIERS.find(t => t.id === tierId);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: "",
    sector: "",
    signerName: "",
    signerEmail: "",
    signerTitle: "",
    acknowledgeTerms: false,
    acknowledgePayment: false,
    acknowledgeTimeline: false,
  });

  if (!tier) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Agreement tier not found.</p>
            <Button onClick={() => navigate("/operation-sf")}>Back to Operation SF</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleProceedToPayment = async () => {
    if (!formData.acknowledgeTerms || !formData.acknowledgePayment || !formData.acknowledgeTimeline) {
      toast.error("Please acknowledge all terms before proceeding");
      return;
    }

    if (!formData.signerName || !formData.signerEmail) {
      toast.error("Please provide signer name and email");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-agreement-checkout", {
        body: {
          tierId: tier.id,
          tierName: tier.name,
          priceId: tier.stripePriceId,
          organizationName: formData.organizationName,
          sector: formData.sector,
          signerName: formData.signerName,
          signerEmail: formData.signerEmail,
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("No checkout URL received");

      // Open Stripe checkout in new tab
      window.open(data.url, "_blank");
      toast.success("Checkout opened in new tab. Complete payment to begin deployment.");
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to create checkout session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/operation-sf")} className="text-lg">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Operation SF
          </Button>
          <Badge variant="outline" className="border-primary/50 text-primary font-mono text-base px-4 py-1">
            AGREEMENT — {tier.name}
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg
                ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {s}
              </div>
              <span className={`text-lg ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s === 1 ? "Details" : s === 2 ? "Review" : "Sign & Pay"}
              </span>
              {s < 3 && <ArrowRight className="h-5 w-5 text-muted-foreground mx-2" />}
            </div>
          ))}
        </div>

        {/* Step 1: Organization Details */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Organization Details
              </CardTitle>
              <CardDescription className="text-lg">
                Confirm your organization information for the {tier.name} agreement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="orgName" className="text-base">Organization Name *</Label>
                  <Input
                    id="orgName"
                    placeholder="Acme Corporation"
                    className="text-lg h-12"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  />
                </div>
                {tier.id === "sector-sovereign" && (
                  <div className="space-y-2">
                    <Label htmlFor="sector" className="text-base">Sector (for exclusivity) *</Label>
                    <Input
                      id="sector"
                      placeholder="Healthcare, Finance, etc."
                      className="text-lg h-12"
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-border/50 pt-6">
                <h3 className="text-xl font-semibold mb-4">Authorized Signer</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="signerName" className="text-base">Full Name *</Label>
                    <Input
                      id="signerName"
                      placeholder="John Smith"
                      className="text-lg h-12"
                      value={formData.signerName}
                      onChange={(e) => setFormData({ ...formData, signerName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signerTitle" className="text-base">Title</Label>
                    <Input
                      id="signerTitle"
                      placeholder="CEO, CTO, etc."
                      className="text-lg h-12"
                      value={formData.signerTitle}
                      onChange={(e) => setFormData({ ...formData, signerTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="signerEmail" className="text-base">Email *</Label>
                    <Input
                      id="signerEmail"
                      type="email"
                      placeholder="john@acme.com"
                      className="text-lg h-12"
                      value={formData.signerEmail}
                      onChange={(e) => setFormData({ ...formData, signerEmail: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8"
                  onClick={() => setStep(2)}
                  disabled={!formData.organizationName || !formData.signerName || !formData.signerEmail}
                >
                  Continue to Review <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Review Agreement */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                Review Agreement Terms
              </CardTitle>
              <CardDescription className="text-lg">
                Review the {tier.name} agreement terms before signing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Agreement Summary */}
              <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-muted-foreground">Agreement Type</span>
                  <span className="text-lg font-semibold">{tier.name} — {tier.subtitle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-muted-foreground">Organization</span>
                  <span className="text-lg font-semibold">{formData.organizationName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-muted-foreground">Total Value</span>
                  <span className="text-lg font-semibold">{tier.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-muted-foreground">Term</span>
                  <span className="text-lg font-semibold">{tier.term}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-muted-foreground">Timeline</span>
                  <span className="text-lg font-semibold">{tier.timeline}</span>
                </div>
              </div>

              {/* Payment Schedule */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Payment Schedule
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {tier.paymentSchedule.map((payment, idx) => (
                    <div key={idx} className={`rounded-lg p-4 border ${idx === 0 ? 'bg-green-500/10 border-green-500/50' : 'bg-muted/30 border-border/50'}`}>
                      <p className="text-sm text-muted-foreground mb-1">Day {payment.day}</p>
                      <p className="text-xl font-bold">
                        ${payment.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">{payment.label}</p>
                      {idx === 0 && <Badge className="mt-2 bg-green-500/20 text-green-400">Due Today</Badge>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Includes */}
              <div>
                <h3 className="text-xl font-semibold mb-4">What's Included</h3>
                <ul className="space-y-2">
                  {tier.includes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-base text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button size="lg" className="text-lg px-8" onClick={() => setStep(3)}>
                  Continue to Sign <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Sign & Pay */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-400" />
                E-Sign & Proceed to Payment
              </CardTitle>
              <CardDescription className="text-lg">
                Acknowledge the terms below, then proceed to secure payment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Acknowledgements */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-muted/20">
                  <Checkbox
                    id="ackTerms"
                    checked={formData.acknowledgeTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, acknowledgeTerms: !!checked })}
                  />
                  <Label htmlFor="ackTerms" className="text-base leading-relaxed cursor-pointer">
                    I have read and agree to the {tier.name} agreement terms, including the scope of work, 
                    deliverables, and client requirements outlined above.
                  </Label>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-muted/20">
                  <Checkbox
                    id="ackPayment"
                    checked={formData.acknowledgePayment}
                    onCheckedChange={(checked) => setFormData({ ...formData, acknowledgePayment: !!checked })}
                  />
                  <Label htmlFor="ackPayment" className="text-base leading-relaxed cursor-pointer">
                    I understand the payment schedule (33/33/34 split) and that work begins after Payment 1 
                    (${tier.paymentSchedule[0].amount.toLocaleString()}) clears. Missed payments trigger Stop Work.
                  </Label>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-muted/20">
                  <Checkbox
                    id="ackTimeline"
                    checked={formData.acknowledgeTimeline}
                    onCheckedChange={(checked) => setFormData({ ...formData, acknowledgeTimeline: !!checked })}
                  />
                  <Label htmlFor="ackTimeline" className="text-base leading-relaxed cursor-pointer">
                    I understand that the deployment clock starts only after all client requirements are received, 
                    and the {tier.timeline.split(" ")[0]}-day timeline is contingent on timely deliverables from both parties.
                  </Label>
                </div>
              </div>

              {/* E-Signature */}
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Electronic Signature</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-base text-muted-foreground mb-2">Signed by:</p>
                    <p className="text-2xl font-semibold italic">{formData.signerName}</p>
                    <p className="text-base text-muted-foreground">{formData.signerTitle && `${formData.signerTitle}, `}{formData.organizationName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base text-muted-foreground mb-2">Date:</p>
                    <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Payment Notice */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-green-400 mb-2">Ready to Begin</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Click below to proceed to secure payment. Payment 1 of ${tier.paymentSchedule[0].amount.toLocaleString()} will be collected via Stripe.
                </p>
                <p className="text-sm text-muted-foreground">
                  Payments 2 and 3 will be invoiced on their scheduled dates.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button 
                  size="lg" 
                  className="text-xl px-10 py-6 h-auto bg-green-600 hover:bg-green-700"
                  onClick={handleProceedToPayment}
                  disabled={loading || !formData.acknowledgeTerms || !formData.acknowledgePayment || !formData.acknowledgeTimeline}
                >
                  {loading ? "Creating Checkout..." : `Pay $${tier.paymentSchedule[0].amount.toLocaleString()} & Start Deployment`}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AgreementFlow;
