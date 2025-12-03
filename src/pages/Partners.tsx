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
import logo from "@/assets/clean-check-logo.png";
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Clean Check" className="h-12 w-auto" />
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={scrollToContact}
              className="bg-blue-900 hover:bg-blue-800 text-white"
            >
              Request Integration
            </Button>
            <Button 
              onClick={() => navigate("/compliance")}
              className="bg-blue-900 hover:bg-blue-800 text-white"
            >
              ← Back to Partner Solutions
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(100,116,139,0.08),transparent_50%)]"></div>
        
        {/* Animated Radar Scan Line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan opacity-40 shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
        </div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-slate-800 bg-clip-text text-transparent mb-6 leading-tight">
            Integrated Health Compliance for<br />Affiliate Social Ecosystems
          </h1>
          <p className="text-xl text-slate-700 mb-10 max-w-3xl mx-auto font-medium">
            Automate high-volume results delivery and secure access to exclusive member testing networks via our compliant, API-driven diagnostic pipeline.
          </p>
          <Button 
            size="lg"
            onClick={scrollToContact}
            className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-10 py-7 text-lg shadow-[0_8px_30px_rgb(30,58,138,0.3)] hover:shadow-[0_12px_40px_rgb(30,58,138,0.4)] transform hover:scale-105 transition-all duration-300"
          >
            Request Integration Specs
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-24 px-4 pb-12 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Recurring Volume */}
            <Card className="relative bg-white border-0 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative z-10">
                <div className="h-14 w-14 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-900/30 group-hover:scale-110 transition-transform">
                  <Activity className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 font-bold">Recurring Volume</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-700 leading-relaxed">
                  Our user base requires testing every 90 days. We drive consistent, high-LTV test volume to your lab infrastructure.
                </p>
              </CardContent>
            </Card>

            {/* Card 2: Zero-Friction Support */}
            <Card className="relative bg-white border-0 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative z-10">
                <div className="h-14 w-14 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-900/30 group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 font-bold">Zero-Friction Support</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-700 leading-relaxed">
                  Our 'Glass Box' API Console handles sample exceptions and re-orders automatically. We reduce your support burden to near zero.
                </p>
              </CardContent>
            </Card>

            {/* Card 3: Compliance Ready */}
            <Card className="relative bg-white border-0 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative z-10">
                <div className="h-14 w-14 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-900/30 group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 font-bold">Compliance Ready</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-700 leading-relaxed">
                  Built with FHIR-compatible schemas, 2257 identity verification, and HIPAA-compliant data handling.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Showcase Section */}
      <section className="pt-12 pb-24 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-slate-800 bg-clip-text text-transparent mb-4">
              Built for Modern API Integration
            </h2>
            <p className="text-xl text-slate-700 font-medium italic">
              Enterprise-grade infrastructure designed for seamless lab partner integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <Card className="border-0 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Code className="h-6 w-6 text-blue-900" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900 font-bold">Real-time Webhook Event Inspector</CardTitle>
                    <CardDescription className="mt-2 text-gray-600 leading-relaxed">
                      Live logging of every API interaction with detailed payload inspection and replay capabilities for debugging
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Zap className="h-6 w-6 text-blue-900" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900 font-bold">Automated Sample Exception Engine</CardTitle>
                    <CardDescription className="mt-2 text-gray-600 leading-relaxed">
                      Intelligent handling of sample issues and inconclusive results with automatic user notifications
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Database className="h-6 w-6 text-blue-900" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900 font-bold">Universal Lab Requisition Standard</CardTitle>
                    <CardDescription className="mt-2 text-gray-600 leading-relaxed">
                      FHIR-compatible data schemas ensuring seamless integration with existing lab management systems
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="border-0 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <FileText className="h-6 w-6 text-blue-900" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900 font-bold">Comprehensive API Documentation</CardTitle>
                    <CardDescription className="mt-2 text-gray-600 leading-relaxed">
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

      {/* Contact Form Section */}
      <section id="contact-form" className="py-24 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-slate-800 bg-clip-text text-transparent mb-4">
              Partner with Clean Check
            </h2>
            <p className="text-xl text-slate-700 font-medium">
              Let's discuss how we can integrate your lab services into our platform
            </p>
          </div>

          <Card className="border-0 shadow-[0_10px_40px_rgba(0,0,0,0.1)] bg-white">
            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Smith"
                    required
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Company *</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Vital, Ash Wellness, Labcorp"
                    required
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    required
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">API Documentation Link</label>
                  <Input
                    type="url"
                    value={formData.apiDocLink}
                    onChange={(e) => setFormData({ ...formData, apiDocLink: e.target.value })}
                    placeholder="https://docs.yourlab.com/api"
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your lab services and integration requirements..."
                    rows={4}
                    className="border-gray-300"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white py-6 text-lg"
                >
                  {submitting ? "Sending..." : "Send Inquiry"}
                </Button>

                <p className="text-sm text-gray-600 text-center">
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
        className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.7)] hover:shadow-[0_0_40px_rgba(59,130,246,0.9)] bg-primary hover:bg-primary/90 text-white z-50 flex items-center justify-center"
        size="icon"
      >
        <Home className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Partners;