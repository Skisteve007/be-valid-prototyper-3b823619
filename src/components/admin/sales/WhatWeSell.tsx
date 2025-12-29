import { PrintButton, LastUpdated, PrintableSection, PrintableHeading, PrintableParagraph, PrintableBulletList, QualityGateChecklist, BrandedHeader, LegalFooter } from "../PrintStyles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const WhatWeSell = () => {
  return (
    <PrintableSection>
      <BrandedHeader title="What We Sell" variant="both" />
      <div className="flex items-center justify-between mb-6">
        <PrintableHeading level={2}>What We Sell (In Plain English)</PrintableHeading>
        <PrintButton />
      </div>
      <LastUpdated />

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="print:border-black print:bg-white">
          <CardHeader>
            <CardTitle className="text-xl print:text-black">SYNTH™</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium print:text-black">
              SYNTH is the safety and proof layer for AI decisions.
            </p>
            <p className="text-sm text-muted-foreground mt-2 print:text-black">
              It checks AI answers using policy controls, creates audit-ready records, and can stop unsafe actions.
            </p>
          </CardContent>
        </Card>

        <Card className="print:border-black print:bg-white">
          <CardHeader>
            <CardTitle className="text-xl print:text-black">VALID™ / GhostPass</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium print:text-black">
              VALID/GhostPass verifies identity, access, compliance, and payment fast using privacy-first QR verification.
            </p>
            <p className="text-sm text-muted-foreground mt-2 print:text-black">
              Encrypted, time-limited tokens. No raw personal data stored.
            </p>
          </CardContent>
        </Card>
      </div>

      <PrintableHeading level={3}>Who Buys</PrintableHeading>
      <PrintableBulletList items={[
        "Enterprises deploying AI agents in regulated workflows",
        "Security and compliance-heavy industries (finance, healthcare, legal)",
        "High-volume venues and access control operators",
        "Transportation and workforce compliance organizations",
        "Identity and access management teams",
        "Operations leaders who need audit-ready records"
      ]} />

      <PrintableHeading level={3}>Top Outcomes Customers Get</PrintableHeading>
      <PrintableBulletList items={[
        "Fraud and liability reduced — verification gates catch problems early",
        "Faster operations — QR verification in seconds, not minutes",
        "Audit-ready records — prove what happened, when, and why",
        "Privacy-first — verification signals, not raw personal data",
        "Fail-safe modes — system degrades safely when things go wrong",
        "Policy enforcement — rules are followed, not just suggested",
        "Integration-ready — works with existing systems",
        "Enterprise security posture — built for regulated environments"
      ]} />

      <PrintableHeading level={3}>Implementation Timeline</PrintableHeading>
      <Card className="mb-6 print:border-black print:bg-white">
        <CardContent className="pt-6">
          <p className="text-lg font-medium print:text-black mb-2">Menu Sale → Onboarding → 30–45 Days to Launch</p>
          <PrintableBulletList items={[
            "Customer selects package from pricing menu",
            "Onboarding call to gather requirements and credentials",
            "Configuration and integration setup (we handle this)",
            "Testing and validation period",
            "Go-live within 30–45 days after receiving customer inputs"
          ]} />
        </CardContent>
      </Card>

      <PrintableHeading level={3}>Pricing & Packages</PrintableHeading>
      <PrintableParagraph>
        Do not quote pricing from memory. Always refer customers to the official pricing page for current packages and rates.
      </PrintableParagraph>
      <Button variant="outline" className="print:hidden" asChild>
        <Link to="/admin?tab=pricing">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Pricing Menu
        </Link>
      </Button>

      <QualityGateChecklist />
      <LegalFooter />
    </PrintableSection>
  );
};
