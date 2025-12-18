import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
        name: "Is VALID liable for manual checks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely not. VALID™ assumes ZERO liability for any manual checks, manual runs, or manual mode operations. All decisions and responsibility rest entirely with the venue and its staff.",
        },
      },
      {
        "@type": "Question",
        name: "Does VALID store any data from manual mode?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. VALID™ does NOT store any photos, notes, personal data, or any information whatsoever from manual mode. All data stays on YOUR device or YOUR storage systems. VALID™ has no access to it and accepts no responsibility for it.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>GHOST™ Pass Owner Guide | VALID™</title>
        <meta
          name="description"
          content="GHOST™ Pass Owner Guide for venues: ID check modes, manual evidence storage, and billing/payouts."
        />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)] animate-pulse">
            VALID™ / GHOST™ PASS
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
                <strong>What it does:</strong> Your staff visually checks the ID at the door. VALID™ provides documentation tools (note + optional evidence) for your internal records.
              </p>
              <p className="text-sm font-medium text-primary">
                Price: No provider per-scan fee.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CRITICAL LIABILITY DISCLAIMER - Accordion */}
        <Accordion type="single" collapsible className="mb-6">
          <AccordionItem value="liability" className="border-2 border-destructive/50 bg-destructive/5 rounded-lg">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2 text-destructive font-semibold">
                <AlertTriangle className="h-5 w-5" />
                IMPORTANT: VALID™ LIABILITY DISCLAIMER
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="p-4 bg-background border border-destructive/30 rounded-lg">
                <p className="font-bold text-sm mb-3 uppercase tracking-wide">Manual Mode — Zero Liability to VALID™</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1 font-bold">⚠</span>
                    <span><strong>VALID™ assumes ABSOLUTELY NO LIABILITY for any manual checks, manual runs, or manual mode operations.</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1 font-bold">⚠</span>
                    <span><strong>VALID™ DOES NOT STORE ANY INFORMATION</strong> — no photos, no notes, no personal data, no ID images — NOTHING is stored by VALID™ in manual mode.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1 font-bold">⚠</span>
                    <span>Any photos, notes, or data captured using the device in manual mode are stored <strong>LOCALLY ON YOUR DEVICE</strong> or exported to <strong>YOUR OWN storage systems</strong> — NOT on VALID™ servers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1 font-bold">⚠</span>
                    <span>VALID™ has <strong>NO RESPONSIBILITY</strong> for any data you or your staff choose to capture, store, retain, or manage on your own devices or storage.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1 font-bold">⚠</span>
                    <span>The venue and its staff bear <strong>FULL AND SOLE RESPONSIBILITY</strong> for all manual check decisions, data handling, compliance with privacy laws, and any consequences thereof.</span>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
                <span>Manual mode decisions are made <strong>entirely by the venue and its staff</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>VALID™ does not verify identity in Manual mode and accepts no liability for manual checks.</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>The venue is <strong>solely responsible</strong> for entry decisions, compliance with local laws, staff training, and all data captured.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>VALID™ provides tools only — <strong>VALID™ does not store, process, or retain any data from manual checks.</strong></span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 3: Manual Evidence Storage */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" />
              3) Manual Evidence — YOUR Storage, NOT Ours
            </CardTitle>
            <Badge variant="outline" className="w-fit">Venue-Controlled — VALID™ Stores Nothing</Badge>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg mb-4">
              <p className="text-sm font-bold text-destructive">
                VALID™ DOES NOT STORE ANY PHOTOS, NOTES, OR DATA FROM MANUAL MODE.
              </p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              In Manual mode, if your venue uses photo evidence:
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>All evidence stays on <strong>YOUR device</strong> or is exported to <strong>YOUR storage</strong> (e.g., Google Drive).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Nothing is transmitted to or stored on VALID™ servers.</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>You control retention, access, deletion, and who can view it — <strong>VALID™ has no access to this data.</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>VALID™ accepts <strong>no responsibility</strong> for any data you capture, store, or manage on your devices.</span>
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
              <h4 className="font-semibold mb-2">When guests pay using GHOST™ Pass QR / Wallet</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Payments run through VALID™'s platform via Stripe Connect.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Fees can be deducted from that night's GHOST™ Pass sales before payout, including:</span>
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
                Nights with low or no GHOST™ Pass sales
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                If there are not enough GHOST™ Pass sales to cover usage-based fees:
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
              <p className="font-medium mb-1">Q: Is VALID™ liable for manual checks?</p>
              <p className="text-sm text-muted-foreground">
                A: <strong>Absolutely not.</strong> VALID™ assumes ZERO liability for any manual checks, manual runs, or manual mode operations. All decisions and responsibility rest entirely with the venue and its staff.
              </p>
            </div>

            <div className="border-b pb-4">
              <p className="font-medium mb-1">Q: Does VALID™ store any data from manual mode?</p>
              <p className="text-sm text-muted-foreground">
                A: <strong>No.</strong> VALID™ does NOT store any photos, notes, personal data, or any information whatsoever from manual mode. All data stays on YOUR device or YOUR storage systems. VALID™ has no access to it and accepts no responsibility for it.
              </p>
            </div>

            <div>
              <p className="font-medium mb-1">Q: Where does manual evidence go?</p>
              <p className="text-sm text-muted-foreground">
                A: In Manual mode, any notes/photos are recorded by venue staff using VALID™ as a documentation tool. Records are associated with your venue account so your authorized team can review them. Your venue controls who can access them and how long they're retained. If you want an external backup or to follow your own retention policy, a manager can export/offload copies to your venue's storage (example: Google Drive). VALID™ does not verify identity in Manual mode and does not make entry/compliance decisions.
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
