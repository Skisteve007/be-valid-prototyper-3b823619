import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Code, Key, Webhook, Lock, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const ApiDocs = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const webhookEndpoint = "https://csfwfxkuyapfakrmhgjh.supabase.co/functions/v1/receive-lab-result";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code className="h-8 w-8 text-sky-400" />
            <div>
              <span className="text-xl font-bold">Clean Check API</span>
              <span className="text-xs text-slate-400 block">Developer Documentation</span>
            </div>
          </div>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800" asChild>
            <Link to="/compliance">← Back to Partner Solutions</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            Enterprise Integration API
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Connect your systems to Clean Check with our secure, RESTful API. FHIR R4 compatible, HIPAA compliant.
          </p>
        </div>

        {/* Security Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {[
            { icon: Shield, label: "SOC 2 Type II", color: "text-emerald-400" },
            { icon: Lock, label: "AES-256 Encryption", color: "text-violet-400" },
            { icon: CheckCircle2, label: "HIPAA Compliant", color: "text-sky-400" },
            { icon: Key, label: "API Key Auth", color: "text-amber-400" },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-slate-700">
              <badge.icon className={`h-4 w-4 ${badge.color}`} />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Authentication */}
        <Card className="bg-slate-900 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Key className="h-5 w-5 text-amber-400" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              All API requests require authentication via API key in the header:
            </p>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-sm">
              <div className="flex justify-between items-center">
                <code className="text-sky-400">
                  Authorization: Bearer YOUR_API_KEY
                </code>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard("Authorization: Bearer YOUR_API_KEY")}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              API keys are issued upon partnership approval. Contact us at{" "}
              <a href="mailto:Steve@bigtexasroof.com" className="text-sky-400 hover:underline">
                Steve@bigtexasroof.com
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Webhook Endpoint */}
        <Card className="bg-slate-900 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Webhook className="h-5 w-5 text-violet-400" />
              Lab Results Webhook
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              Submit lab results via POST request to update member status:
            </p>
            
            {/* Endpoint */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-500 uppercase tracking-wide">Endpoint</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(webhookEndpoint)}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <code className="text-emerald-400 text-sm break-all">
                POST {webhookEndpoint}
              </code>
            </div>

            {/* Request Body */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-500 uppercase tracking-wide">Request Body (JSON)</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify({
                    barcode_value: "CC-12345678",
                    result_status: "negative",
                    test_type: "STD_PANEL",
                    lab_requisition_id: "LAB-REQ-001"
                  }, null, 2))}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <pre className="text-sm text-slate-300 overflow-x-auto">
{`{
  "barcode_value": "CC-12345678",
  "result_status": "negative",  // "negative" | "positive" | "inconclusive"
  "test_type": "STD_PANEL",     // "STD_PANEL" | "TOX_10_PANEL"
  "lab_requisition_id": "LAB-REQ-001"  // Your internal reference
}`}
              </pre>
            </div>

            {/* Response */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-500 uppercase tracking-wide block mb-2">Success Response (200)</span>
              <pre className="text-sm text-emerald-400">
{`{
  "success": true,
  "message": "Lab result processed successfully",
  "order_id": "uuid-here"
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Data Models */}
        <Card className="bg-slate-900 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Code className="h-5 w-5 text-pink-400" />
              Data Models
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Test Types */}
            <div>
              <h4 className="font-semibold text-white mb-2">Test Types (Enum)</h4>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <code className="text-sm text-slate-300">
                  <span className="text-violet-400">"STD_PANEL"</span> | <span className="text-violet-400">"TOX_10_PANEL"</span>
                </code>
              </div>
            </div>

            {/* Result Status */}
            <div>
              <h4 className="font-semibold text-white mb-2">Result Status (Enum)</h4>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <code className="text-sm text-slate-300">
                  <span className="text-emerald-400">"negative"</span> | <span className="text-red-400">"positive"</span> | <span className="text-amber-400">"inconclusive"</span>
                </code>
              </div>
            </div>

            {/* Order Status */}
            <div>
              <h4 className="font-semibold text-white mb-2">Order Status Flow</h4>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">pending</span>
                  <span className="text-slate-500">→</span>
                  <span className="px-2 py-1 bg-slate-800 rounded text-amber-400">sample_collected</span>
                  <span className="text-slate-500">→</span>
                  <span className="px-2 py-1 bg-slate-800 rounded text-sky-400">result_received</span>
                  <span className="text-slate-500">→</span>
                  <span className="px-2 py-1 bg-slate-800 rounded text-emerald-400">verified_active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <Card className="bg-slate-900 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-emerald-400" />
              Rate Limits & Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Rate Limit:</strong> 1,000 requests/hour per API key</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Payload Size:</strong> Maximum 1MB per request</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>TLS:</strong> All traffic encrypted with TLS 1.3</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>IP Allowlisting:</strong> Available for Enterprise partners</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Webhook Validation:</strong> HMAC signature verification available</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Ready to Integrate?</h2>
          <p className="text-slate-400 mb-6">Contact our integration team to get your API credentials</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-sky-500 hover:bg-sky-600">
              <a href="mailto:Steve@bigtexasroof.com?subject=API%20Integration%20Request">
                Request API Access
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="border-slate-600" asChild>
              <Link to="/compliance">View Partner Solutions</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApiDocs;
