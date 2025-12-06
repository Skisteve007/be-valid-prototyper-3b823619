import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, 
  Shield, 
  Code, 
  Zap, 
  CheckCircle2,
  ArrowRight,
  Database,
  FileText,
  Home
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/valid-logo.jpeg";
import { useNavigate } from "react-router-dom";

const Partners = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    apiDocLink: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const scrollToContact = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-partner-inquiry", {
        body: formData,
      });

      if (error) throw error;
      
      toast.success("Thank you! We'll be in touch within 24 hours.");
      setFormData({ name: "", company: "", email: "", apiDocLink: "", message: "" });
    } catch (error: any) {
      console.error("Error submitting partner inquiry:", error);
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden w-full max-w-full bg-background">
      {/* Ambient Background Effects - matching homepage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Header - matching homepage style */}
      <header className="relative border-b border-primary/20 bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
              <img src={logo} alt="VALID" className="relative h-12 w-auto" />
            </div>
          </div>
          
          {/* Beta Pricing Badge */}
          <div className="hidden md:flex relative group">
            <div className="absolute inset-0 bg-accent/30 blur-xl rounded-lg animate-pulse"></div>
            <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-lg animate-[pulse_1.5s_ease-in-out_infinite]"></div>
            <div className="relative px-4 py-2 bg-secondary/80 border border-accent/50 rounded-full shadow-[0_0_20px_hsl(var(--accent)/0.5),inset_0_0_20px_hsl(var(--accent)/0.1)]">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 rounded-full"></div>
              <span className="relative font-mono text-xs font-bold tracking-wider text-accent uppercase" style={{ textShadow: '0 0 10px hsl(var(--accent)/0.8), 0 0 20px hsl(var(--accent)/0.5)' }}>
                ⚡ Beta Pricing • Limited Time ⚡
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={scrollToContact}
              className="relative shadow-[0_0_20px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.8)] border border-primary/60 bg-primary/15 text-foreground font-semibold text-xs md:text-sm"
            >
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-md -z-10"></div>
              Request Integration
            </Button>
            <Button 
              onClick={() => navigate("/compliance")}
              variant="outline"
              className="relative border border-accent/50 bg-accent/10 text-foreground hover:bg-accent/20 font-semibold text-xs md:text-sm"
            >
              ← Back to Partner Solutions
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - matching homepage style */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background"></div>
        
        {/* Animated Radar Scan Line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-scan opacity-40 shadow-[0_0_15px_hsl(var(--primary)/0.6)]"></div>
        </div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-primary via-accent to-foreground bg-clip-text text-transparent mb-6 leading-tight tracking-tight">
            Integrated Health Compliance for<br />Affiliate Social Ecosystems
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto font-medium italic">
            Automate high-volume results delivery and secure access to exclusive member testing networks via our compliant, API-driven diagnostic pipeline.
          </p>
          <Button 
            size="lg"
            onClick={scrollToContact}
            className="relative shadow-[0_0_25px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_35px_hsl(var(--primary)/0.8)] border border-primary/60 bg-primary text-primary-foreground px-10 py-7 text-lg transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-primary/30 blur-xl rounded-md -z-10"></div>
            Request Integration Specs
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Lab Workflow Section */}
      <section id="lab-workflow" className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-primary via-accent to-foreground bg-clip-text text-transparent mb-4">
              🔬 The Secure Diagnostic Workflow
            </h2>
            <p className="text-lg text-muted-foreground font-medium italic max-w-3xl mx-auto">
              Partnering for Precision
            </p>
          </div>

          <p className="text-lg text-muted-foreground mb-10 leading-relaxed text-center max-w-4xl mx-auto">
            Our platform creates a streamlined, compliant channel for integrating your testing services directly with exclusive member platforms. This flow minimizes administrative overhead for your lab while ensuring rapid status verification for users.
          </p>

          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Step-by-Step Lab Integration</h3>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4 items-start bg-card/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-primary/20 hover:border-primary/40 transition-all duration-300">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
                1
              </div>
              <div>
                <h4 className="font-bold text-foreground text-lg mb-2">Member Procurement (Client Initiation)</h4>
                <p className="text-muted-foreground leading-relaxed">
                  The platform member purchases the required <strong className="text-foreground">testing kit</strong> directly through their affiliated community or service provider.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 items-start bg-card/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-primary/20 hover:border-primary/40 transition-all duration-300">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
                2
              </div>
              <div>
                <h4 className="font-bold text-foreground text-lg mb-2">Kit Fulfillment (Lab Action)</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Your lab receives the order via our secured API endpoint. Your team <strong className="text-foreground">sends the testing kit</strong> to the member, including a pre-paid, barcoded <strong className="text-foreground">return envelope</strong> for easy sample return.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 items-start bg-card/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-primary/20 hover:border-primary/40 transition-all duration-300">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
                3
              </div>
              <div>
                <h4 className="font-bold text-foreground text-lg mb-2">Sample Processing & Scanning (Lab Action)</h4>
                <p className="text-muted-foreground leading-relaxed">
                  The lab receives the sample, conducts the <strong className="text-foreground">Sexual Health and/or Toxicology tests</strong>, and generates the results. Crucially, your technician <strong className="text-foreground">scans the unique testing barcode</strong> upon final result entry. This action securely <strong className="text-foreground">links the results data to the member's profile ID</strong> within our ecosystem.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4 items-start bg-card/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-primary/20 hover:border-primary/40 transition-all duration-300">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
                4
              </div>
              <div>
                <h4 className="font-bold text-foreground text-lg mb-2">Member Notification (System Action)</h4>
                <p className="text-muted-foreground leading-relaxed">
                  The official results are sent directly from your lab to the member for their confidential review, ensuring the lab maintains the primary client relationship.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4 items-start bg-card/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-primary/20 hover:border-primary/40 transition-all duration-300">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
                5
              </div>
              <div>
                <h4 className="font-bold text-foreground text-lg mb-2">Status Verification & Compliance Reporting (Member & Platform Action)</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Upon receiving the results, the member grants consent to update their private <strong className="text-foreground">VALID</strong> status. Our system instantly validates the data, updating the member's compliance status. The platform then securely and instantly shares the member's <strong className="text-foreground">compliance status</strong> (Clear/Not Clear) with the requiring <strong className="text-foreground">Affiliate Establishment</strong> (Venue, Employer, etc.), ensuring organizational requirements are met without ever revealing the member's raw diagnostic data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="relative py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Recurring Volume */}
            <Card className="relative bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative z-10">
                <div className="h-14 w-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_hsl(var(--primary)/0.5)] group-hover:scale-110 transition-transform">
                  <Activity className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl text-foreground font-bold">Recurring Volume</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed">
                  Our user base requires testing every 90 days. We drive consistent, high-LTV test volume to your lab infrastructure.
                </p>
              </CardContent>
            </Card>

            {/* Card 2: Zero-Friction Support */}
            <Card className="relative bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative z-10">
                <div className="h-14 w-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_hsl(var(--primary)/0.5)] group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl text-foreground font-bold">Zero-Friction Support</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed">
                  Our 'Glass Box' API Console handles sample exceptions and re-orders automatically. We reduce your support burden to near zero.
                </p>
              </CardContent>
            </Card>

            {/* Card 3: Compliance Ready */}
            <Card className="relative bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative z-10">
                <div className="h-14 w-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_hsl(var(--primary)/0.5)] group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl text-foreground font-bold">Compliance Ready</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed">
                  Built with FHIR-compatible schemas, 2257 identity verification, and HIPAA-compliant data handling.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Marketing Highlights Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary via-accent to-foreground bg-clip-text text-transparent mb-4">
              Why Labs Choose VALID
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Highlight 1 */}
            <div className="flex gap-4 p-6 bg-card/50 backdrop-blur-sm rounded-xl shadow-lg border border-primary/20 hover:border-primary/40 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)] transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/30">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-lg mb-2">High-Volume Client Access</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Instantly tap into exclusive affiliate communities, guaranteeing a <strong className="text-foreground">consistent, mandated volume</strong> for Sexual Health and Toxicology testing.
                </p>
              </div>
            </div>

            {/* Highlight 2 */}
            <div className="flex gap-4 p-6 bg-card/50 backdrop-blur-sm rounded-xl shadow-lg border border-primary/20 hover:border-primary/40 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)] transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/30">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-lg mb-2">Real-Time API Integration</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Utilize our <strong className="text-foreground">low-latency, FHIR-compatible API</strong> to securely and instantaneously power the member's <strong className="text-foreground">VALID Status</strong>.
                </p>
              </div>
            </div>

            {/* Highlight 3 */}
            <div className="flex gap-4 p-6 bg-card/50 backdrop-blur-sm rounded-xl shadow-lg border border-primary/20 hover:border-primary/40 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)] transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/30">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-lg mb-2">Automated Compliance Reporting</h4>
                <p className="text-muted-foreground leading-relaxed">
                  The system automatically manages secure result sharing with Establishments, <strong className="text-foreground">offloading complex HIPAA/GDPR compliance</strong> from your internal team.
                </p>
              </div>
            </div>

            {/* Highlight 4 */}
            <div className="flex gap-4 p-6 bg-card/50 backdrop-blur-sm rounded-xl shadow-lg border border-primary/20 hover:border-primary/40 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)] transition-all duration-300">
              <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/30">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-lg mb-2">Zero-Friction Efficiency</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Upload results using <strong className="text-foreground">batch processing</strong> and barcode scanning, minimizing manual entry and ensuring <strong className="text-foreground">zero delays</strong> in updating member status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Showcase Section */}
      <section className="pt-12 pb-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-foreground bg-clip-text text-transparent mb-4">
              Built for Modern API Integration
            </h2>
            <p className="text-xl text-muted-foreground font-medium italic">
              Enterprise-grade infrastructure designed for seamless lab partner integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <Card className="border-border bg-card shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground font-bold">Real-time Webhook Event Inspector</CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground leading-relaxed">
                      Live logging of every API interaction with detailed payload inspection and replay capabilities for debugging
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-border bg-card shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground font-bold">Automated Sample Exception Engine</CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground leading-relaxed">
                      Intelligent handling of sample issues and inconclusive results with automatic user notifications
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-border bg-card shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground font-bold">Universal Lab Requisition Standard</CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground leading-relaxed">
                      FHIR-compatible data schemas ensuring seamless integration with existing lab management systems
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="border-border bg-card shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground font-bold">Comprehensive API Documentation</CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground leading-relaxed">
                      Complete REST API documentation with authentication standards and webhook payload specifications
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Compliance Badges */}
          <div className="mt-16 p-10 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-200">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-full shadow-sm border border-blue-200/50">
                <CheckCircle2 className="h-5 w-5 text-blue-900" />
                <span className="font-bold text-gray-900">FHIR R4 Compliant</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-full shadow-sm border border-blue-200/50">
                <CheckCircle2 className="h-5 w-5 text-blue-900" />
                <span className="font-bold text-gray-900">HIPAA-Ready Infrastructure</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-full shadow-sm border border-blue-200/50">
                <CheckCircle2 className="h-5 w-5 text-blue-900" />
                <span className="font-bold text-gray-900">2257 Compliance</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-full shadow-sm border border-blue-200/50">
                <CheckCircle2 className="h-5 w-5 text-blue-900" />
                <span className="font-bold text-gray-900">REST API + Webhooks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Partner Portal CTA Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-border bg-primary shadow-lg overflow-hidden">
            <CardContent className="p-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Lab Partner Operations Console
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Already a partner? Access real-time data, manage compliance standards, and debug integrations through our enterprise-grade administrative suite.
              </p>
              <Button 
                size="lg"
                onClick={() => navigate("/lab/dashboard")}
                className="bg-background text-foreground hover:bg-background/90 px-10 py-6 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Access Partner Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-12 px-4 bg-background">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-foreground bg-clip-text text-transparent mb-4">
              Partner with VALID
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              Let's discuss how we can integrate your lab services into our platform
            </p>
          </div>

          <Card className="border-border shadow-lg bg-card">
            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Smith"
                    required
                    className="border-border"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Company *</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Vital, Ash Wellness, Labcorp"
                    required
                    className="border-border"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    required
                    className="border-border"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">API Documentation Link</label>
                  <Input
                    type="url"
                    value={formData.apiDocLink}
                    onChange={(e) => setFormData({ ...formData, apiDocLink: e.target.value })}
                    placeholder="https://docs.yourlab.com/api"
                    className="border-border"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your lab services and integration requirements..."
                    rows={4}
                    className="border-border"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                >
                  {submitting ? "Sending..." : "Send Inquiry"}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  We typically respond to partner inquiries within 24 hours
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Floating Home Button */}
      <Button
        onClick={() => navigate("/")}
        className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-[0_0_30px_hsl(var(--primary)/0.7)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.9)] bg-primary hover:bg-primary/90 text-primary-foreground z-50 flex items-center justify-center"
        size="icon"
      >
        <Home className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Partners;