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
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
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
      // Store partner inquiry (you can create a partner_inquiries table if needed)
      console.log("Partner inquiry submitted:", formData);
      
      toast.success("Thank you! We'll be in touch within 24 hours.");
      setFormData({ name: "", company: "", email: "", apiDocLink: "", message: "" });
    } catch (error: any) {
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
          <Button 
            onClick={scrollToContact}
            className="bg-blue-900 hover:bg-blue-800 text-white"
          >
            Request Integration
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-50 py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Sexual Health Verification for<br />High-Frequency Dating Communities
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            The compliant, high-volume bridge between lifestyle communities and diagnostic precision.
          </p>
          <Button 
            size="lg"
            onClick={scrollToContact}
            className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-6 text-lg"
          >
            Request Integration Specs
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Recurring Volume */}
            <Card className="border-2 border-gray-200 hover:border-blue-900 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Recurring Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Our user base requires testing every 90 days. We drive consistent, high-LTV test volume to your lab infrastructure.
                </p>
              </CardContent>
            </Card>

            {/* Card 2: Zero-Friction Support */}
            <Card className="border-2 border-gray-200 hover:border-blue-900 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Zero-Friction Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Our 'Glass Box' API Console handles sample exceptions and re-orders automatically. We reduce your support burden to near zero.
                </p>
              </CardContent>
            </Card>

            {/* Card 3: Compliance Ready */}
            <Card className="border-2 border-gray-200 hover:border-blue-900 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Compliance Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Built with FHIR-compatible schemas, 2257 identity verification, and HIPAA-compliant data handling.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Showcase Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Modern API Integration
            </h2>
            <p className="text-xl text-gray-700">
              Enterprise-grade infrastructure designed for seamless lab partner integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <Card className="border-2 border-gray-200 bg-white">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Code className="h-5 w-5 text-blue-900" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">Real-time Webhook Event Inspector</CardTitle>
                    <CardDescription className="mt-2 text-gray-600">
                      Live logging of every API interaction with detailed payload inspection and replay capabilities for debugging
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 border-gray-200 bg-white">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-blue-900" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">Automated Sample Exception Engine</CardTitle>
                    <CardDescription className="mt-2 text-gray-600">
                      Intelligent handling of sample issues and inconclusive results with automatic user notifications
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 border-gray-200 bg-white">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="h-5 w-5 text-blue-900" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">Universal Lab Requisition Standard</CardTitle>
                    <CardDescription className="mt-2 text-gray-600">
                      FHIR-compatible data schemas ensuring seamless integration with existing lab management systems
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="border-2 border-gray-200 bg-white">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-blue-900" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">Comprehensive API Documentation</CardTitle>
                    <CardDescription className="mt-2 text-gray-600">
                      Complete REST API documentation with authentication standards and webhook payload specifications
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Compliance Badges */}
          <div className="mt-12 p-8 bg-white rounded-lg border-2 border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-blue-900" />
                <span className="font-semibold text-gray-900">FHIR R4 Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-blue-900" />
                <span className="font-semibold text-gray-900">HIPAA-Ready Infrastructure</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-blue-900" />
                <span className="font-semibold text-gray-900">2257 Compliance</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-blue-900" />
                <span className="font-semibold text-gray-900">REST API + Webhooks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Partner with Clean Check
            </h2>
            <p className="text-xl text-gray-700">
              Let's discuss how we can integrate your lab services into our platform
            </p>
          </div>

          <Card className="border-2 border-gray-200">
            <CardContent className="p-8">
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

      <Footer />
    </div>
  );
};

export default Partners;