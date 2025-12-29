import { PrintButton, LastUpdated, PrintableSection, PrintableHeading, PrintableParagraph, PrintableBulletList, QualityGateChecklist } from "../PrintStyles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const IncumbentPositioning = () => {
  return (
    <PrintableSection>
      <div className="flex items-center justify-between mb-6">
        <PrintableHeading level={2}>How We Fit With Big Platforms</PrintableHeading>
        <PrintButton />
      </div>
      <LastUpdated />

      <p className="text-lg font-medium mb-6 print:text-black">
        Salesforce, IAM Systems, Access Control, AI Suites — We Complement, Not Replace
      </p>

      <Card className="mb-6 print:border-black print:bg-white">
        <CardHeader>
          <CardTitle className="text-xl print:text-black">Core Positioning</CardTitle>
        </CardHeader>
        <CardContent>
          <PrintableParagraph>
            <strong>We are a verification and governance layer, not a replacement for systems of record.</strong>
          </PrintableParagraph>
          <PrintableBulletList items={[
            "Salesforce is your CRM — it manages customer relationships and data",
            "IAM systems control who logs in and what they can access",
            "Access control systems manage physical doors and credentials",
            "AI suites generate outputs and automate workflows",
            "We add the 'prove it' layer: verification, governance, and audit trails"
          ]} />
        </CardContent>
      </Card>

      <PrintableHeading level={3}>The Value We Add</PrintableHeading>
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card className="print:border-black print:bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base print:text-black">Without Us</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm print:text-black">
              <li>• AI outputs are trusted without verification</li>
              <li>• Access decisions happen but aren't auditable</li>
              <li>• Disputes are hard to resolve — no proof</li>
              <li>• Compliance is manual and reactive</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="print:border-black print:bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base print:text-black">With Us</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm print:text-black">
              <li>• AI outputs are verified before action</li>
              <li>• Access decisions create audit trails</li>
              <li>• Disputes are resolvable — records exist</li>
              <li>• Compliance is built in and provable</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <PrintableHeading level={3}>Three Integration Patterns</PrintableHeading>

      <Card className="mb-4 print:border-black print:bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg print:text-black">Pattern 1: AI Output Governance</CardTitle>
        </CardHeader>
        <CardContent>
          <PrintableParagraph>
            Your AI system generates an output. Before that output is used, we verify it against policy and create an audit record.
          </PrintableParagraph>
          <p className="text-sm text-muted-foreground print:text-black">
            <strong>Example:</strong> AI recommends an action → SYNTH checks policy → Approved output with audit trail → Action proceeds
          </p>
        </CardContent>
      </Card>

      <Card className="mb-4 print:border-black print:bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg print:text-black">Pattern 2: Access Verification Layer</CardTitle>
        </CardHeader>
        <CardContent>
          <PrintableParagraph>
            Your access control system makes a decision. We add verification and create an auditable record of who, what, when, and why.
          </PrintableParagraph>
          <p className="text-sm text-muted-foreground print:text-black">
            <strong>Example:</strong> Access request → GhostPass verifies credentials → Verification signal to access system → Audit log created
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6 print:border-black print:bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg print:text-black">Pattern 3: Compliance Audit Layer</CardTitle>
        </CardHeader>
        <CardContent>
          <PrintableParagraph>
            Your systems of record hold the data. We provide the audit trail that proves compliance across multiple systems.
          </PrintableParagraph>
          <p className="text-sm text-muted-foreground print:text-black">
            <strong>Example:</strong> Transaction in CRM + Access event + AI decision → Unified audit record → Compliance report ready
          </p>
        </CardContent>
      </Card>

      <PrintableHeading level={3}>Competitive Positioning Script</PrintableHeading>
      <Card className="print:border-black print:bg-white">
        <CardContent className="pt-6">
          <PrintableParagraph>
            <strong>When they say:</strong> "We already have Salesforce / Okta / [vendor]."
          </PrintableParagraph>
          <PrintableParagraph>
            <strong>You say:</strong> "Great — those are systems of record. They handle data and access. We add the verification and audit layer that proves what happened. When you need to show an auditor or resolve a dispute, that's where we come in. We complement what you have, we don't replace it."
          </PrintableParagraph>
          <PrintableParagraph>
            <strong>Follow-up:</strong> "What's your biggest gap today between what your systems do and what auditors ask for?"
          </PrintableParagraph>
        </CardContent>
      </Card>

      <QualityGateChecklist />
    </PrintableSection>
  );
};
