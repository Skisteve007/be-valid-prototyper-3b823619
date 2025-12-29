import { PrintButton, LastUpdated, PrintableSection, PrintableHeading, PrintableParagraph, QualityGateChecklist } from "../PrintStyles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

export const SalesLanguageGuide = () => {
  return (
    <PrintableSection>
      <div className="flex items-center justify-between mb-6">
        <PrintableHeading level={2}>Approved vs Forbidden Language (Sales Training)</PrintableHeading>
        <PrintButton />
      </div>
      <LastUpdated />

      <Card className="mb-6 print:border-black print:bg-white">
        <CardHeader>
          <CardTitle className="text-xl print:text-black">How to Sound Credible Without Leaking IP</CardTitle>
        </CardHeader>
        <CardContent>
          <PrintableParagraph>
            Credibility comes from being precise and honest, not from revealing internal details. 
            Customers trust vendors who speak clearly about outcomes without overpromising or disclosing proprietary mechanics.
          </PrintableParagraph>
          <PrintableParagraph>
            <strong>Rule:</strong> Describe what we do and why it matters. Never describe how we do it at an implementation level.
          </PrintableParagraph>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="print:border-black print:bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-green-600 print:text-black">
              <CheckCircle className="h-5 w-5" />
              ✅ SAY THIS (Approved)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 print:text-black">
              <li>• "We are a governance layer for AI decisions."</li>
              <li>• "We provide policy controls and verification gates."</li>
              <li>• "We create audit-ready records."</li>
              <li>• "We use privacy-first verification signals."</li>
              <li>• "We have fail-safe modes for reliability."</li>
              <li>• "We reduce risk and improve auditability."</li>
              <li>• "We complement existing systems."</li>
              <li>• "Details are available under NDA."</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="print:border-black print:bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-destructive print:text-black">
              <XCircle className="h-5 w-5" />
              ⛔ DO NOT SAY (Forbidden)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 print:text-black">
              <li>• "Guaranteed truth" or "perfect accuracy"</li>
              <li>• "Unhackable" or "100% secure"</li>
              <li>• Any model names, seat counts, or weights</li>
              <li>• Token TTL numbers or threshold values</li>
              <li>• Database schemas or function names</li>
              <li>• Internal scoring or veto rules</li>
              <li>• "We never store anything" (absolute claims)</li>
              <li>• Implementation diagrams or code patterns</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 print:border-black print:bg-white">
        <CardHeader>
          <CardTitle className="text-lg print:text-black">Forbidden Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4 print:text-black">
            These claims create liability, damage credibility, and may be false. Never use them:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="font-semibold text-destructive print:text-black">❌ Don't Say:</p>
              <ul className="text-sm space-y-1 print:text-black">
                <li>• "Guaranteed truth"</li>
                <li>• "Perfect accuracy"</li>
                <li>• "Unhackable"</li>
                <li>• "100% secure"</li>
                <li>• "Military-grade"</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-green-600 print:text-black">✅ Instead Say:</p>
              <ul className="text-sm space-y-1 print:text-black">
                <li>• "We reduce risk"</li>
                <li>• "We improve reliability"</li>
                <li>• "We add auditability and control"</li>
                <li>• "Enterprise-ready security posture"</li>
                <li>• "Built for regulated environments"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="print:border-black print:bg-white">
        <CardHeader>
          <CardTitle className="text-lg print:text-black">When Pressed for Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PrintableParagraph>
            <strong>Script:</strong> "I appreciate you wanting to go deeper. We're happy to share technical architecture details in a session with your technical team under NDA. For now, what matters is the outcome: we make AI decisions governable and auditable."
          </PrintableParagraph>
        </CardContent>
      </Card>

      <QualityGateChecklist />
    </PrintableSection>
  );
};
