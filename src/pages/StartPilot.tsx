import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { 
  Rocket, ArrowRight, Check, Calendar, Building2, User, Mail, 
  Briefcase, Shield, FileText, Loader2, Copy, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const StartPilot = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "checkout" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    useCase: "",
    desiredStartDate: "",
    complianceNeeds: [] as string[],
    additionalNotes: "",
  });

  const complianceOptions = [
    { id: "soc2", label: "SOC2" },
    { id: "hipaa", label: "HIPAA" },
    { id: "gdpr", label: "GDPR" },
    { id: "ccpa", label: "CCPA" },
    { id: "other", label: "Other" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplianceToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      complianceNeeds: prev.complianceNeeds.includes(id)
        ? prev.complianceNeeds.filter(c => c !== id)
        : [...prev.complianceNeeds, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.contactName || !formData.email || !formData.useCase) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save lead to database
      const { error: leadError } = await supabase.from("marketing_leads").insert({
        company_name: formData.companyName,
        contact_email: formData.email,
        category: "pilot",
        notes: JSON.stringify({
          contactName: formData.contactName,
          useCase: formData.useCase,
          desiredStartDate: formData.desiredStartDate,
          complianceNeeds: formData.complianceNeeds,
          additionalNotes: formData.additionalNotes,
        }),
        status: "pending",
      });

      if (leadError) throw leadError;

      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke("create-pilot-checkout", {
        body: {
          companyName: formData.companyName,
          email: formData.email,
          contactName: formData.contactName,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        setStep("checkout");
      }
    } catch (error) {
      console.error("Pilot submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pilotBenefits = [
    "Full platform access for 30 days",
    "Dedicated onboarding session",
    "Up to 10,000 governed decisions",
    "Proof records + audit trails",
    "Direct Slack/email support",
  ];

  if (step === "checkout") {
    return (
      <>
        <Helmet>
          <title>Complete Payment | Valid™ Pilot</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Complete Your Payment</h2>
              <p className="text-muted-foreground mb-6">
                A Stripe checkout window should have opened. Complete your payment there to start your pilot.
              </p>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setStep("success")}
                >
                  I've Completed Payment
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setStep("form")}
                >
                  ← Back to Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (step === "success") {
    return (
      <>
        <Helmet>
          <title>Pilot Started | Valid™</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <Card className="max-w-lg w-full border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to Your Pilot!</h2>
              <p className="text-muted-foreground mb-6">
                Your pilot has been activated. Check your email for confirmation and next steps.
              </p>
              
              <div className="text-left bg-background/50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-foreground mb-3">Onboarding Checklist</h3>
                <ul className="space-y-2">
                  {[
                    "Check email for welcome + credentials",
                    "Schedule onboarding call",
                    "Review API documentation",
                    "Configure first policy pack",
                    "Run your first governed decision",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-xs">
                        {i + 1}
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  onClick={() => window.open("https://calendly.com/steve-bevalid/30min", "_blank")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Call
                </Button>
                <Button onClick={() => navigate("/")}>
                  Back to Hub
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Start Pilot | Valid™ SYNTH</title>
        <meta name="description" content="Start your paid pilot with Valid SYNTH. Full platform access, onboarding, and support." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Start Pilot</h1>
                  <p className="text-xs text-muted-foreground">Valid™ SYNTH</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/">← Back to Hub</Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Start Your Pilot</CardTitle>
                  <CardDescription>Fill out the form below to begin</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="companyName"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange("companyName", e.target.value)}
                            placeholder="Acme Corp"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Your Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="contactName"
                            value={formData.contactName}
                            onChange={(e) => handleInputChange("contactName", e.target.value)}
                            placeholder="Jane Doe"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="jane@acme.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="useCase">Use Case *</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="useCase"
                          value={formData.useCase}
                          onChange={(e) => handleInputChange("useCase", e.target.value)}
                          placeholder="Describe your AI governance needs..."
                          className="pl-10 min-h-[100px]"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="desiredStartDate">Desired Start Date</Label>
                      <Input
                        id="desiredStartDate"
                        type="date"
                        value={formData.desiredStartDate}
                        onChange={(e) => handleInputChange("desiredStartDate", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Compliance Requirements</Label>
                      <div className="flex flex-wrap gap-3">
                        {complianceOptions.map((option) => (
                          <label
                            key={option.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                              formData.complianceNeeds.includes(option.id)
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <Checkbox
                              checked={formData.complianceNeeds.includes(option.id)}
                              onCheckedChange={() => handleComplianceToggle(option.id)}
                            />
                            <span className="text-sm">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalNotes">Additional Notes</Label>
                      <Textarea
                        id="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                        placeholder="Any other details..."
                        className="min-h-[80px]"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-cyan-500" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Processing...</>
                      ) : (
                        <>Proceed to Payment <ArrowRight className="h-5 w-5 ml-2" /></>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Pilot — Month 1
                  </CardTitle>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">$2,500</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pilotBenefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium text-foreground mb-3">Questions?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Schedule a call to discuss your requirements before starting.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open("https://calendly.com/steve-bevalid/30min", "_blank")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book a Call First
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default StartPilot;
