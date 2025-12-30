import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, DollarSign, Calendar, CreditCard, Database, RefreshCw } from "lucide-react";

interface UniversalPaymentTermsProps {
  variant?: "full" | "compact";
  showTitle?: boolean;
}

export const UniversalPaymentTerms = ({ variant = "full", showTitle = true }: UniversalPaymentTermsProps) => {
  if (variant === "compact") {
    return (
      <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-3 text-sm">
        <p className="font-semibold text-primary flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" /> Universal Fees & Payment Terms (All Tiers)
        </p>
        <ul className="space-y-2 text-muted-foreground">
          <li>• <strong className="text-foreground">10% Onboarding & Systems Integration Fee</strong> — due immediately upon signing</li>
          <li>• <strong className="text-foreground">Contract Fee Due</strong> — within 14 calendar days of signature</li>
          <li>• <strong className="text-foreground">10% Renewal Fee</strong> — due at each annual renewal</li>
          <li>• <strong className="text-foreground">Payment</strong> — USD, ACH/wire preferred</li>
        </ul>
      </div>
    );
  }

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-4">
        {showTitle && (
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-primary/20 text-primary border-primary/50">UNIVERSAL</Badge>
            <CardTitle className="text-xl md:text-2xl">Fees & Payment Terms (All Tiers)</CardTitle>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Onboarding Fee */}
        <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <DollarSign className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Onboarding & Systems Integration Fee (10%)</h4>
              <p className="text-sm text-muted-foreground mb-2">
                A 10% "Onboarding & Systems Integration Fee" applies to every customer, at every tier.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong className="text-foreground">Due immediately upon signing</strong> — must be paid first to initiate onboarding</li>
                <li>• Covers: technical intake, environment mapping, policy alignment, implementation planning, integration coordination, and kickoff</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contract Fee Due Date */}
        <div className="p-4 rounded-lg border border-cyan-500/30 bg-cyan-500/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Calendar className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Contract Fee Due Date (after signing)</h4>
              <p className="text-sm text-muted-foreground">
                After the Agreement is signed and onboarding is initiated, the remaining contract fees are due within the following window:
              </p>
              <p className="text-sm text-foreground mt-2 font-medium">
                The contract fee (license/setup/pilot/annual amount, as applicable) is due within <strong>fourteen (14) calendar days</strong> of the Agreement initiation date (signature date), unless otherwise stated in a signed Order Form/SOW.
              </p>
            </div>
          </div>
        </div>

        {/* Renewal Year Fee */}
        <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <RefreshCw className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Renewal Year Fee (10% annually)</h4>
              <p className="text-sm text-muted-foreground mb-2">
                At each annual renewal, a new 10% Onboarding & Systems Integration Fee is due.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Purpose:</strong> annual audit, policy refresh, environment changes, and required updates requested by the client.
              </p>
            </div>
          </div>
        </div>

        {/* Billing and Payment Method */}
        <div className="p-4 rounded-lg border border-purple-500/30 bg-purple-500/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <CreditCard className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Billing and Payment Method</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All amounts are due in <strong className="text-foreground">USD</strong></li>
                <li>• <strong className="text-foreground">ACH/wire preferred</strong>; card acceptance optional (if card is accepted, any processing surcharge must be listed on the Order Form)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Storage Posture */}
        <div className="p-4 rounded-lg border border-border/50 bg-muted/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Database className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Data Storage Posture (clarity statement)</h4>
              <p className="text-sm text-muted-foreground">
                VALID integrates into the client's systems. We do not aim to be the client's general-purpose data warehouse. We store only the minimum metadata required to produce governance outcomes and proof records, as defined in the deployment scope.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UniversalPaymentTerms;
