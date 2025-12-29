import { PrintButton, LastUpdated, PrintableSection, PrintableHeading, PrintableParagraph, PrintableBulletList, QualityGateChecklist } from "../PrintStyles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertTriangle } from "lucide-react";

export const PackagingPricing = () => {
  return (
    <PrintableSection>
      <div className="flex items-center justify-between mb-6">
        <PrintableHeading level={2}>Packaging & Pricing</PrintableHeading>
        <PrintButton />
      </div>
      <LastUpdated />

      <Card className="mb-6 border-amber-500 bg-amber-500/10 print:border-black print:bg-white">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 print:text-black flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold print:text-black">Important: Do Not Quote Pricing from Memory</p>
              <p className="text-sm text-muted-foreground print:text-black">
                Always refer customers to the official pricing menu. Pricing may change and quoting outdated rates creates problems.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <PrintableHeading level={3}>How to Choose a Package</PrintableHeading>
      <PrintableBulletList items={[
        "Start with the customer's primary use case (AI governance, access control, or both)",
        "Estimate their volume (verifications per day/week/month)",
        "Identify their deployment requirements (cloud, private, hybrid)",
        "Match to the appropriate tier based on scale and features",
        "Discuss add-ons for specific needs (premium support, custom integration)",
        "Review the pricing menu together and confirm fit"
      ]} />

      <Card className="mb-6 print:border-black print:bg-white">
        <CardHeader>
          <CardTitle className="text-lg print:text-black">Package Selection Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 print:text-black">
            <div className="flex items-start gap-3">
              <span className="font-bold text-primary print:text-black">1.</span>
              <div>
                <p className="font-medium">Qualify the Opportunity</p>
                <p className="text-sm text-muted-foreground print:text-black">What's the pain? What's the scale? What's the timeline?</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-primary print:text-black">2.</span>
              <div>
                <p className="font-medium">Match to Package</p>
                <p className="text-sm text-muted-foreground print:text-black">Based on volume, features, and deployment needs</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-primary print:text-black">3.</span>
              <div>
                <p className="font-medium">Review Pricing Together</p>
                <p className="text-sm text-muted-foreground print:text-black">Walk through the pricing menu, answer questions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-primary print:text-black">4.</span>
              <div>
                <p className="font-medium">Confirm and Close</p>
                <p className="text-sm text-muted-foreground print:text-black">Get agreement, schedule onboarding</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PrintableHeading level={3}>Access the Pricing Menu</PrintableHeading>
      <PrintableParagraph>
        The official pricing menu contains current packages, rates, and terms. Use this as the single source of truth for all pricing discussions.
      </PrintableParagraph>

      <div className="flex gap-4 print:hidden">
        <Button variant="default" asChild>
          <Link to="/admin?tab=pricing">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Pricing Menu
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/admin?tab=packages">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Industry Packages
          </Link>
        </Button>
      </div>

      <Card className="mt-6 print:border-black print:bg-white">
        <CardHeader>
          <CardTitle className="text-lg print:text-black">When Pricing Questions Come Up</CardTitle>
        </CardHeader>
        <CardContent>
          <PrintableParagraph>
            <strong>Script:</strong> "Let me pull up the current pricing menu so we're looking at the latest rates together. Pricing varies by volume and deployment model, so let's find the package that fits your needs."
          </PrintableParagraph>
          <PrintableParagraph>
            Never promise discounts without approval. If they ask for a custom deal, say: "I can take that back to our team and see what's possible. Let's first confirm the package makes sense for your use case."
          </PrintableParagraph>
        </CardContent>
      </Card>

      <QualityGateChecklist />
    </PrintableSection>
  );
};
