import { Link } from "react-router-dom";
import { ArrowLeft, DollarSign, Scan, Shield, Wallet, Building2, Users, Car, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const RevenueEngine = () => {
  return (
    <div
      className="min-h-screen overflow-y-auto bg-background text-foreground p-4 md:p-8"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/admin" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Admin
          </Link>
          <Badge variant="outline" className="border-primary text-primary">
            SOURCE OF TRUTH
          </Badge>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
            <DollarSign className="h-8 w-8 text-primary" />
            The Revenue Engine
          </h1>
          <p className="text-muted-foreground text-lg">
            SaaS + Usage + Optional Modules — No Percentage Processing Fees
          </p>
        </div>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-center text-lg">
              <strong>"Every scan = revenue"</strong> is true, but we monetize through{" "}
              <span className="text-primary font-semibold">SaaS + usage + optional compliance/security modules</span>{" "}
              (not % transaction fees).
            </p>
          </CardContent>
        </Card>

        {/* Section 1: Operator / Venue SaaS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              1) Operator / Venue SaaS (Licensing)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Nightlife / Events</span>
                </div>
                <p className="text-muted-foreground text-sm">$___ per venue per month</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Stadiums & Arenas</span>
                </div>
                <p className="text-muted-foreground text-sm">Enterprise SaaS + SLA (contracted)</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Transportation</span>
                </div>
                <p className="text-muted-foreground text-sm">Fleet SaaS (tiered by active drivers)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Usage Fees (Core) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5 text-primary" />
              2) Usage Fees (Core)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nightlife / Events */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                Nightlife / Events (Clubs, Festivals, Corporate Events)
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="font-mono text-lg text-primary">$0.20 per Door Scan</p>
                  <p className="text-sm text-muted-foreground">Successful entry authorization</p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="font-mono text-lg text-primary">$0.20 per Purchase Scan</p>
                  <p className="text-sm text-muted-foreground">Successful purchase authorization</p>
                </div>
              </div>
              <div className="p-3 rounded bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium">No percentage processing fee — usage-based pricing.</p>
              </div>
            </div>

            <Separator />

            {/* Stadiums & Arenas */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Stadiums & Arenas (High Volume)
              </h3>
              <p className="text-muted-foreground">Two billable components (separate line items):</p>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="font-semibold">1) Scan Events (entry + purchases)</p>
                  <p className="text-muted-foreground">Tiered per scan (volume-based; $0.__–$0.__)</p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="font-semibold">2) Deep Screening (optional per event)</p>
                  <p className="font-mono text-primary">$2.75–$3.50 per attendee per event</p>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    <li>• Billed <strong>once per attendee per event</strong></li>
                    <li>• Re-entry requires re-scan, but deep screening is not re-billed within the same event</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* Transportation */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Car className="h-4 w-4" />
                Transportation (Fleet)
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="font-semibold">Fleet SaaS</p>
                  <p className="text-muted-foreground">Tiered by active drivers</p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="font-semibold">Driver Deep Face Check</p>
                  <p className="font-mono text-primary">$3.25/check (range $2.75–$3.50)</p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="font-semibold">Included Checks</p>
                  <p className="text-muted-foreground">
                    1 per active driver per month (e.g., 10 active drivers → 10 included checks), overage billed per check
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Optional Verification & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              3) Optional Verification & Compliance Modules (Only When Used)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 rounded-lg border bg-muted/30">
                <p className="font-semibold">ID verification / Age verification</p>
                <p className="text-muted-foreground text-sm">Vendor pass-through + markup (venue/company paid)</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30">
                <p className="font-semibold">Lab tests (onboarding)</p>
                <p className="text-muted-foreground text-sm">Vendor pass-through + orchestration/markup</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30">
                <p className="font-semibold">Background / MVR</p>
                <p className="text-muted-foreground text-sm">Vendor pass-through + markup</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Wallet Funding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              4) Wallet Funding Convenience Fees (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-muted/30">
                <p className="font-semibold">ACH Funding</p>
                <p className="text-muted-foreground text-sm">Default (low/no convenience fee)</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30">
                <p className="font-semibold">Instant Funding (debit/card)</p>
                <p className="text-muted-foreground text-sm">End-user convenience fee (e.g., $3.95)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stadium Examples */}
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Truthful Stadium Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg border bg-muted/30">
              <h4 className="font-semibold mb-2">Example A — Scan Events Only (Base Model)</h4>
              <p className="font-mono text-muted-foreground">
                70,000 attendees × $0.__ per entry scan × 10 games
              </p>
              <p className="font-mono text-muted-foreground">
                = $____ / year (scan-only)
              </p>
            </div>

            <div className="p-4 rounded-lg border-2 border-primary bg-primary/10">
              <h4 className="font-semibold mb-2">Example B — Mandatory Deep Screening (Premium Security Mode)</h4>
              <p className="font-mono">
                70,000 attendees × $3.25 deep screening × 10 games
              </p>
              <p className="font-mono text-2xl text-primary font-bold mt-2">
                = $2,275,000 / year
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                (Deep screening billed once per attendee per event; re-entry does not re-bill deep screening.)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-4 border-t">
          Internal Reference — Pricing Model v1.0
        </div>
      </div>
    </div>
  );
};

export default RevenueEngine;
