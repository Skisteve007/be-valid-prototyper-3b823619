import { PrintButton, ExportPDFButton, LastUpdated, PrintableHeading, PrintableParagraph, PrintableBulletList, PrintableCard, BrandedHeader, LegalFooter } from "../PrintStyles";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const WhatWeSell = () => {
  return (
    <div className="space-y-6 print-content">
      <BrandedHeader title="What We Sell" variant="both" />
      
      <div className="flex justify-between items-start">
        <div>
          <PrintableHeading level={2}>What We Sell (In Plain English)</PrintableHeading>
          <LastUpdated />
        </div>
        <div className="flex gap-2 print:hidden">
          <PrintButton />
          <ExportPDFButton />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PrintableCard>
          <PrintableHeading level={3}>SYNTH™</PrintableHeading>
          <p className="text-lg font-medium print:!text-black">
            SYNTH is the safety and proof layer for AI decisions.
          </p>
          <p className="text-sm text-muted-foreground mt-2 print:!text-gray-600">
            It checks AI answers using policy controls, creates audit-ready records, and can stop unsafe actions.
          </p>
        </PrintableCard>

        <PrintableCard>
          <PrintableHeading level={3}>VALID™ / GhostPass</PrintableHeading>
          <p className="text-lg font-medium print:!text-black">
            VALID/GhostPass verifies identity, access, compliance, and payment fast using privacy-first QR verification.
          </p>
          <p className="text-sm text-muted-foreground mt-2 print:!text-gray-600">
            Encrypted, time-limited tokens. No raw personal data stored.
          </p>
        </PrintableCard>
      </div>

      <PrintableCard>
        <PrintableHeading level={3}>Who Buys</PrintableHeading>
        <PrintableBulletList items={[
          "Enterprises deploying AI agents in regulated workflows",
          "Security and compliance-heavy industries (finance, healthcare, legal)",
          "High-volume venues and access control operators",
          "Transportation and workforce compliance organizations",
          "Identity and access management teams",
          "Operations leaders who need audit-ready records"
        ]} />
      </PrintableCard>

      <PrintableCard>
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
      </PrintableCard>

      <PrintableCard>
        <PrintableHeading level={3}>Implementation Timeline</PrintableHeading>
        <p className="text-lg font-medium print:!text-black mb-2">Menu Sale → Onboarding → 30–45 Days to Launch</p>
        <PrintableBulletList items={[
          "Customer selects package from pricing menu",
          "Onboarding call to gather requirements and credentials",
          "Configuration and integration setup (we handle this)",
          "Testing and validation period",
          "Go-live within 30–45 days after receiving customer inputs"
        ]} />
      </PrintableCard>

      <PrintableCard>
        <PrintableHeading level={3}>Pricing & Packages</PrintableHeading>
        <PrintableParagraph>
          Do not quote pricing from memory. Always refer customers to the official pricing page for current packages and rates.
        </PrintableParagraph>
        <Button variant="outline" className="print:hidden mt-2" asChild>
          <Link to="/admin?tab=pricing">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Pricing Menu
          </Link>
        </Button>
      </PrintableCard>

      <LegalFooter />
    </div>
  );
};
