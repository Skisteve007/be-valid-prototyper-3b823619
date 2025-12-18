import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  ShieldCheck,
  ClipboardCheck,
  DollarSign,
  HardDrive,
  CreditCard,
  HelpCircle,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

export default function GhostPassOwnerGuide() {
  const navigate = useNavigate();
  const canonicalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/ghost-pass-owner-guide`
      : "/ghost-pass-owner-guide";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who pays per-scan fees?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The venue pays per-scan fees for Verified ID (Standard) and Verified ID (Enhanced).",
        },
      },
      {
        "@type": "Question",
        name: "Can we avoid per-scan charges on slow nights?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — switch to Mode 3 (Manual Check).",
        },
      },
      {
        "@type": "Question",
        name: "Are you liable for manual checks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Manual checks are performed by venue staff. Valid does not verify identity in Manual mode; the venue is responsible for decisions and compliance.",
        },
      },
      {
        "@type": "Question",
        name: "Where does manual evidence go?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It’s venue-controlled. Export/backup to your own storage (example: Google Drive). You control access and retention.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Ghost Pass Owner Guide | VALID</title>
        <meta
          name="description"
          content="Ghost Pass Owner Guide for venues: ID check modes, manual evidence storage, and billing/payouts."
        />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            VALID / GHOST PASS™
          </h1>
          <p className="text-xl text-muted-foreground">Owner Module</p>
        </div>

        <p className="text-muted-foreground mb-8 text-center">
          This page explains ID-check options, pricing, where manual evidence is stored, and how billing/payouts work.
        </p>

        {/* Section 1: ID Check Modes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              1) ID Check Modes (You Choose)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mode 1 */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Mode 1</Badge>
                <span className="font-semibold">Verified ID (Standard)</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>What it does:</strong> Third-party ID verification through our provider (Footprint).
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Best for:</strong> Normal busy nights.
              </p>
              <p className="text-sm font-medium text-primary">
                Price: $1.82 per scan <span className="text-muted-foreground font-normal">(includes provider cost + 30% handling margin)</span>
              </p>
            </div>

            {/* Mode 2 */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Mode 2</Badge>
                <span className="font-semibold">Verified ID (Enhanced)</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>What it does:</strong> Standard verification + enhanced screening (as supported by the provider).
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Best for:</strong> Higher-risk events / nights you want stronger checks.
              </p>
              <p className="text-sm font-medium text-primary">
                Price: $2.47 per scan <span className="text-muted-foreground font-normal">(includes provider cost + 30% handling margin)</span>
              </p>
            </div>

            {/* Mode 3 */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Mode 3</Badge>
                <span className="font-semibold">Manual Check (No third-party fee)</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>What it does:</strong> Your staff visually checks the ID at the door. Valid provides documentation tools (note + optional evidence) for your internal records.
              </p>
              <p className="text-sm font-medium text-primary">
                Price: No provider per-scan fee.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Manual Mode Responsibility */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              2) Manual Mode — Responsibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Manual mode decisions are made by the venue and its staff.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Valid does not verify identity in Manual mode.</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>The venue is responsible for entry decisions, compliance with local laws, and staff training.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Valid provides tools to record what your staff did (notes/evidence) for your venue's internal accountability.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 3: Manual Evidence Storage */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" />
              3) Manual Evidence — Where Photos/Notes Are Stored
            </CardTitle>
            <Badge variant="outline" className="w-fit">Venue-Controlled</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              In Manual mode, if your venue uses photo evidence:
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Evidence is stored under <strong>your venue's control</strong>, not ours.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Your manager device can export/backup evidence to your own storage (example: Google Drive).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>You control retention, access, and who can view it.</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-muted/50 border border-border rounded-lg">
              <p className="text-sm flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span>
                  <strong>Recommended practice:</strong> Set a simple policy like "export nightly" or "export weekly" so you are protected if a device is lost.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Billing & Payouts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              4) Billing & Payouts
            </CardTitle>
            <Badge variant="secondary" className="w-fit">Stripe Connect</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">When guests pay using Ghost Pass QR / Wallet</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Payments run through Valid's platform via Stripe Connect.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Fees can be deducted from that night's Ghost Pass sales before payout, including:</span>
                </li>
              </ul>
              <ul className="ml-6 mt-2 space-y-1 text-sm text-muted-foreground">
                <li>— Verified ID (Standard) scans at $1.82/scan</li>
                <li>— Verified ID (Enhanced) scans at $2.47/scan</li>
                <li>— Any agreed platform/service fees (if applicable)</li>
              </ul>
              <p className="text-sm mt-2">
                The venue then receives the <strong>net payout quickly</strong>.
              </p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Nights with low or no Ghost Pass sales
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                If there are not enough Ghost Pass sales to cover usage-based fees:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>The venue must keep a <strong>backup credit card on file</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Any remaining balance is <strong>charged nightly</strong></span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2 italic">
                This prevents unpaid scan costs.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: FAQ */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              5) Quick Owner FAQ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-4">
              <p className="font-medium mb-1">Q: Who pays per-scan fees?</p>
              <p className="text-sm text-muted-foreground">
                A: The venue pays per-scan fees for Modes 1 and 2.
              </p>
            </div>

            <div className="border-b pb-4">
              <p className="font-medium mb-1">Q: Can we avoid per-scan charges on slow nights?</p>
              <p className="text-sm text-muted-foreground">
                A: Yes — switch to Mode 3 (Manual Check).
              </p>
            </div>

            <div className="border-b pb-4">
              <p className="font-medium mb-1">Q: Are you liable for manual checks?</p>
              <p className="text-sm text-muted-foreground">
                A: Manual checks are performed by venue staff. Valid does not verify identity in Manual mode; the venue is responsible for decisions and compliance.
              </p>
            </div>

            <div>
              <p className="font-medium mb-1">Q: Where does manual evidence go?</p>
              <p className="text-sm text-muted-foreground">
                A: It's venue-controlled. Export/backup to your own storage (example: Google Drive). You control access and retention.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Questions? Contact your account manager or support@valid.world</p>
        </div>
      </div>
    </div>
  );
}
