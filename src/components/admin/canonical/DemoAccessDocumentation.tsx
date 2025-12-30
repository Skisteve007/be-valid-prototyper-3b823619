import { PrintButton, ExportPDFButton, LastUpdated, PrintableSection, PrintableHeading, BrandedHeader, LegalFooter } from "../PrintStyles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Shield, Mail, Lock, CheckCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const DEMO_ROUTES = [
  { path: "/demos", name: "Demo Hub", description: "Main demo landing page with all governance demos" },
  { path: "/demos/router", name: "Demo Router", description: "Choose-your-path demo selector for prospects" },
  { path: "/demos/senate-qa", name: "Demo A — AI Review Panel", description: "Multi-model consensus governance demo" },
  { path: "/demos/monitoring", name: "Demo B — Monitoring", description: "Real-time governance monitoring dashboard" },
  { path: "/demos/enterprise-sandbox", name: "Demo C — Enterprise Sandbox", description: "Data residency and enterprise controls demo" },
  { path: "/demos/audit-verifier", name: "Demo D — Proof Verifier", description: "Tamper-evident audit trail verification" },
  { path: "/demos/upload-verdict", name: "Demo E — Upload & Verdict", description: "Document upload with governance verdict" },
  { path: "/demos/scale-conduit", name: "Demo F — Scale Conduit", description: "High-volume enterprise integration demo" },
  { path: "/demos/operator-certification", name: "Demo G — Operator Certification", description: "Workforce AI discipline certification" },
  { path: "/demos/servicenow", name: "Demo H — ServiceNow Integration", description: "Enterprise ticketing integration demo" },
];

export const DemoAccessDocumentation = () => {
  return (
    <PrintableSection>
      <BrandedHeader title="Demo Access & Permissions" variant="both" />
      
      <div className="flex items-center justify-between mb-6">
        <PrintableHeading level={2}>Demo Access & Permissions</PrintableHeading>
        <div className="flex gap-2 print:hidden">
          <PrintButton />
          <ExportPDFButton />
        </div>
      </div>
      <LastUpdated />

      {/* Security Notice */}
      <Card className="border-amber-500/50 bg-amber-500/10 mb-6 print:border-black print:bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2 print:text-black">
            <AlertTriangle className="h-5 w-5 text-amber-500 print:text-black" />
            Sensitive Information Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm print:text-black">
            Demo pages contain proprietary governance logic, architecture diagrams, and competitive positioning. 
            Access is restricted to approved partners and investors via email permission gate.
          </p>
        </CardContent>
      </Card>

      {/* Access Control Documentation */}
      <Card className="mb-6 print:border-black print:bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2 print:text-black">
            <Shield className="h-5 w-5" />
            Access Control Flow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold print:border print:border-black">
                1
              </div>
              <div>
                <p className="font-semibold print:text-black">User Navigates to Demo Page</p>
                <p className="text-sm text-muted-foreground print:text-black">
                  User attempts to access any /demos/* route
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold print:border print:border-black">
                2
              </div>
              <div>
                <p className="font-semibold print:text-black">AccessGate Checks Partner Approval</p>
                <p className="text-sm text-muted-foreground print:text-black">
                  Same gate as /partners — checks <code className="bg-muted px-1 rounded print:bg-gray-200">partner_access_approved</code> in profiles table
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold print:border print:border-black">
                3
              </div>
              <div>
                <p className="font-semibold print:text-black">If Not Approved → Request Access</p>
                <p className="text-sm text-muted-foreground print:text-black">
                  User sees "Request Access" button. Email sent to steve@bevalid.app with approval link.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold print:border print:border-black">
                4
              </div>
              <div>
                <p className="font-semibold flex items-center gap-2 print:text-black">
                  <Mail className="h-4 w-4" />
                  Admin Approves via Email
                </p>
                <p className="text-sm text-muted-foreground print:text-black">
                  One-click approval in email. User receives confirmation and gains immediate access.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="mb-6 print:border-black print:bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold print:text-black">Demo Routes (Quick Links)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {DEMO_ROUTES.map((route) => (
              <div key={route.path} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 print:border-b print:border-gray-200">
                <div>
                  <p className="font-medium print:text-black">{route.name}</p>
                  <p className="text-xs text-muted-foreground print:text-black">{route.description}</p>
                </div>
                <div className="flex items-center gap-2 print:hidden">
                  <Badge variant="outline" className="text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Partner Gate
                  </Badge>
                  <Button asChild size="sm" variant="ghost">
                    <Link to={route.path}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <span className="hidden print:block text-xs text-gray-600">{route.path}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What's Protected */}
      <Card className="mb-6 print:border-black print:bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold print:text-black">Protected Information in Demos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 print:text-black" />
              <span className="print:text-black">Governance architecture and multi-model consensus flow</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 print:text-black" />
              <span className="print:text-black">Proof record verification mechanics</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 print:text-black" />
              <span className="print:text-black">Enterprise integration patterns (ServiceNow, Scale Conduit)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 print:text-black" />
              <span className="print:text-black">Operator certification scoring logic</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 print:text-black" />
              <span className="print:text-black">Competitive positioning and differentiation claims</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Implementation Note */}
      <Card className="border-cyan-500/50 bg-cyan-500/10 print:border-black print:bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold print:text-black">Implementation Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm print:text-black">
          <p><strong>Component:</strong> <code className="bg-muted px-1 rounded print:bg-gray-200">AccessGate</code> with <code className="bg-muted px-1 rounded print:bg-gray-200">accessType="partner"</code></p>
          <p><strong>Database Field:</strong> <code className="bg-muted px-1 rounded print:bg-gray-200">profiles.partner_access_approved</code></p>
          <p><strong>Approval Email:</strong> steve@bevalid.app</p>
          <p><strong>Edge Function:</strong> <code className="bg-muted px-1 rounded print:bg-gray-200">notify-access-request</code> + <code className="bg-muted px-1 rounded print:bg-gray-200">approve-access-request</code></p>
        </CardContent>
      </Card>

      <LegalFooter />
    </PrintableSection>
  );
};
