import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Wallet, Users, BarChart3, 
  CreditCard, Zap, Clock, Download,
  CheckCircle, ArrowRight, DollarSign
} from "lucide-react";
import { PaymentCalculator } from "./PaymentCalculator";

const GAS_FEE_TIERS = [
  { volume: "Under 1,000 scans/month", range: "$0.25–$0.50" },
  { volume: "1,000–10,000 scans/month", range: "$0.15–$0.25" },
  { volume: "10,000–100,000 scans/month", range: "$0.10–$0.15" },
  { volume: "100,000+ scans/month", range: "$0.05–$0.10" },
];

const DIRECT_PAYMENT_EXAMPLES = [
  { amount: 30, gasFee: 0.20 },
  { amount: 75, gasFee: 0.20 },
  { amount: 150, gasFee: 0.20 },
  { amount: 500, gasFee: 0.20 },
  { amount: 2000, gasFee: 0.20 },
];

interface SectionProps {
  id: string;
}

export function WelcomeSection({ id }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        Welcome to VALID™
      </h2>
      <p className="text-muted-foreground mb-6">
        VALID™ is a comprehensive payment and verification platform designed for venues, 
        promoters, and their guests. Here's what makes VALID™ powerful:
      </p>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Verified Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Every guest is verified through secure QR scanning, ensuring only approved 
            members gain entry. Real-time verification with instant results.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-500" />
              Wallet Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Members load funds into their VALID™ wallet. Venues charge directly 
            from the wallet via QR scan—fast, contactless, and secure.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Automatic Splits
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            GHOST™ Pass purchases automatically split between venue, promoter, 
            community pool, and VALID™. No manual calculations needed.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              Reporting + Payouts
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Real-time dashboards show all transactions. Automated payouts with 
            standard (1–2 days) or instant (minutes) options.
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export function WalletSection({ id }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Wallet className="h-6 w-6 text-primary" />
        How the Wallet Works
      </h2>
      
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        {[
          { step: 1, title: "Fund Wallet", desc: "Member adds funds via card or bank" },
          { step: 2, title: "Scan & Charge", desc: "Venue scans QR and charges wallet" },
          { step: 3, title: "Receipt", desc: "Both parties receive instant receipt" },
          { step: 4, title: "Payout", desc: "Venue receives scheduled payout" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {item.step}
              </div>
              <h4 className="font-medium mt-2">{item.title}</h4>
              <p className="text-xs text-muted-foreground text-center max-w-[120px]">{item.desc}</p>
            </div>
            {i < 3 && <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />}
          </div>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <p className="text-sm">
            <strong>Security Note:</strong> Wallet funds are held in secure escrow until 
            charged by a verified venue. All transactions are encrypted and logged for 
            complete transparency.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

export function GhostPassSection({ id }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Zap className="h-6 w-6 text-primary" />
        GHOST™ Pass (30/30/10/30 Split)
      </h2>

      <p className="text-muted-foreground mb-4">
        GHOST™ Passes provide instant venue credit with automatic revenue sharing. 
        Available in three tiers:
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { name: "Bronze", amount: 10, color: "bg-amber-700" },
          { name: "Silver", amount: 20, color: "bg-gray-400" },
          { name: "Gold", amount: 50, color: "bg-yellow-500" },
        ].map((tier) => (
          <Card key={tier.name} className="text-center">
            <CardHeader>
              <div className={`w-12 h-12 ${tier.color} rounded-full mx-auto mb-2`} />
              <CardTitle>{tier.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">${tier.amount}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Revenue Split Diagram</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 bg-green-500/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">30%</div>
              <div className="text-sm">Venue</div>
            </div>
            <div className="flex-1 bg-blue-500/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">30%</div>
              <div className="text-sm">Promoter</div>
            </div>
            <div className="flex-1 bg-purple-500/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">10%</div>
              <div className="text-sm">Community Pool</div>
            </div>
            <div className="flex-1 bg-orange-500/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">30%</div>
              <div className="text-sm">VALID™</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-lg">Fees Deducted from Venue Share</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Transaction Fee:</span>
            <Badge variant="outline">1.5% of venue share</Badge>
          </div>
          <div className="flex justify-between">
            <span>Verification Gas Fee:</span>
            <Badge variant="outline">Per-scan (see tier table)</Badge>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function DirectPaymentSection({ id }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <CreditCard className="h-6 w-6 text-primary" />
        Direct Payments
      </h2>

      <p className="text-muted-foreground mb-4">
        Direct payments are for all non-GHOST™ Pass transactions. The venue keeps the 
        majority, minus fees.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {["Cover Charge", "Bar Tab", "Food & Beverage", "Bottle Service", "Merchandise", "Event Tickets", "VIP Upgrades", "Other"].map((type) => (
          <Badge key={type} variant="secondary">{type}</Badge>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Fee Structure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Transaction Fee:</span>
            <Badge>1.5% of total</Badge>
          </div>
          <div className="flex justify-between">
            <span>Verification Gas Fee:</span>
            <Badge>Per-scan (tiered)</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Example Calculations
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            *Example gas fee shown: $0.20/scan (1,000–10,000 scans/month tier)
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Amount</th>
                  <th className="text-right py-2">Transaction Fee (1.5%)</th>
                  <th className="text-right py-2">Gas Fee*</th>
                  <th className="text-right py-2 text-green-600">Venue Net</th>
                </tr>
              </thead>
              <tbody>
                {DIRECT_PAYMENT_EXAMPLES.map((ex) => {
                  const txFee = ex.amount * 0.015;
                  const net = ex.amount - txFee - ex.gasFee;
                  return (
                    <tr key={ex.amount} className="border-b">
                      <td className="py-2">${ex.amount.toFixed(2)}</td>
                      <td className="text-right text-destructive">-${txFee.toFixed(2)}</td>
                      <td className="text-right text-destructive">-${ex.gasFee.toFixed(2)}</td>
                      <td className="text-right font-medium text-green-600">${net.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function FeeScheduleSection({ id }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        Complete Fee Schedule
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Venue Fees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Transaction Fee</span>
              <Badge>1.5% per payment</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Verification Gas Fee</span>
              <Badge variant="outline">Per scan (tiered)</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Standard Payout</span>
              <Badge variant="secondary">Free (1–2 business days)</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Instant Payout</span>
              <Badge variant="destructive">1.5% (minutes)</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gas Fee Tiers</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Monthly Volume</th>
                  <th className="text-right py-2">Fee/Scan</th>
                </tr>
              </thead>
              <tbody>
                {GAS_FEE_TIERS.map((tier, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{tier.volume}</td>
                    <td className="text-right font-medium">{tier.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-yellow-500/30 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="text-lg">Member Fees</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            <strong>Convenience Fee:</strong> Members may pay a convenience fee when 
            adding funds to their wallet (if enabled by admin).
          </p>
          <p className="mt-2">
            <strong>Note:</strong> If a $50 monthly minimum gas fee is configured for 
            your venue, this will be disclosed in your partner dashboard.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

export function PayoutSection({ id }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Download className="h-6 w-6 text-primary" />
        Payouts & Transfers
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Standard Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">FREE</div>
            <p className="text-sm text-muted-foreground">1–2 business days</p>
            <div className="mt-4 text-sm">
              <strong>Example:</strong> $1,000 collected → $1,000 deposited
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Instant Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-2">1.5%</div>
            <p className="text-sm text-muted-foreground">Within minutes</p>
            <div className="mt-4 text-sm">
              <strong>Example:</strong> $1,000 collected → $985 deposited
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Auto-Payout Schedules</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            Configure automatic payouts on your preferred schedule:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Daily (next business day)</li>
            <li>Weekly (every Monday)</li>
            <li>Bi-weekly</li>
            <li>Monthly (1st of month)</li>
          </ul>
          <p className="mt-2 text-muted-foreground">
            Contact your account manager to set up auto-payouts.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

export function QuickReferenceSection({ id }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        Quick Reference Card
      </h2>

      <Card className="print:border-2 print:border-black">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-2">GHOST™ Pass Split</h3>
              <div className="text-sm space-y-1">
                <div>Venue: 30%</div>
                <div>Promoter: 30%</div>
                <div>Community Pool: 10%</div>
                <div>VALID™: 30%</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Fees deducted from venue share
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Direct Payment</h3>
              <div className="text-sm space-y-1">
                <div>Transaction Fee: 1.5%</div>
                <div>Gas Fee: Per scan (tiered)</div>
                <div>Venue keeps remainder</div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-bold mb-2">Gas Fee Tiers</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {GAS_FEE_TIERS.map((tier, i) => (
                  <div key={i} className="bg-muted p-2 rounded">
                    <div className="font-medium">{tier.range}</div>
                    <div className="text-muted-foreground">{tier.volume}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 border-t pt-4">
              <h3 className="font-bold mb-2">Support</h3>
              <div className="text-sm space-y-1">
                <div>Email: support@validnetwork.com</div>
                <div>Partner Hotline: 1-888-VALID-NOW</div>
                <div>Hours: 24/7</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function CalculatorSection({ id }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-bold mb-4">Interactive Calculator</h2>
      <PaymentCalculator />
    </section>
  );
}
