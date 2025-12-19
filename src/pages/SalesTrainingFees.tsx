import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, CreditCard, Zap, TrendingDown, Calculator, MessageSquare, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SalesTrainingFees = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Admin</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-lg font-bold">Sales Training — Fee Comparison</h1>
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">INTERNAL</Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Title */}
        <section>
          <h2 className="text-2xl font-bold mb-2">How We Beat 2.0%–2.3% Card Fees</h2>
          <p className="text-muted-foreground">Club / Nightlife Example — Use in sales conversations</p>
        </section>

        {/* Our Pricing */}
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-400" />
              Our Pricing (Simple)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-emerald-400">$0.20</p>
                <p className="text-sm text-muted-foreground">per Door Scan</p>
                <p className="text-xs text-muted-foreground mt-1">(each successful entry authorization)</p>
              </div>
              <div className="bg-background/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-emerald-400">$0.20</p>
                <p className="text-sm text-muted-foreground">per Purchase Scan</p>
                <p className="text-xs text-muted-foreground mt-1">(each successful purchase authorization)</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">+ SaaS (venue subscription)</Badge>
              <Badge variant="outline">Optional: ID verification (usage-based)</Badge>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mt-4">
              <p className="text-sm font-semibold text-cyan-400">
                "No percentage processing fee — usage-based pricing."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Math */}
        <Card className="border-cyan-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-cyan-400" />
              Quick Math (Use This Line)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If average purchase is <strong className="text-foreground">$75</strong>, then <strong className="text-foreground">$0.20 per purchase</strong> is about:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Our Effective Rate</p>
                <p className="text-3xl font-bold text-emerald-400">~0.27%</p>
                <p className="text-xs text-muted-foreground">$0.20 ÷ $75</p>
              </div>
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Typical Card Rate</p>
                <p className="text-3xl font-bold text-destructive">~2.3%</p>
                <p className="text-xs text-muted-foreground">$1.73 on a $75 purchase</p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm">
                At 2.3%, a <strong>$75 purchase</strong> costs about <span className="text-destructive font-semibold">$1.73</span> in processing fees.
              </p>
              <p className="text-sm mt-2">
                With us, that same purchase scan fee is <span className="text-emerald-400 font-semibold">$0.20</span>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Example Night */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-purple-400" />
              Example Night (Plug-and-Play)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Assumptions */}
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="font-semibold mb-2">Assumptions:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <strong className="text-foreground">2,000</strong> guests (door scans)</li>
                <li>• <strong className="text-foreground">1,500</strong> purchases (purchase scans)</li>
                <li>• Average purchase = <strong className="text-foreground">$75</strong></li>
                <li>• Purchase volume = <strong className="text-foreground">$112,500</strong></li>
              </ul>
            </div>

            {/* Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Our fees */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <p className="font-semibold text-emerald-400 mb-3">Our Usage Fees</p>
                <ul className="text-sm space-y-2">
                  <li className="flex justify-between">
                    <span>Door: 2,000 × $0.20</span>
                    <span className="font-semibold">$400</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Purchases: 1,500 × $0.20</span>
                    <span className="font-semibold">$300</span>
                  </li>
                  <li className="flex justify-between border-t border-emerald-500/30 pt-2 mt-2">
                    <span className="font-semibold">Total usage</span>
                    <span className="font-bold text-emerald-400">$700</span>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">(+ SaaS subscription)</p>
              </div>

              {/* Card fees */}
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <p className="font-semibold text-destructive mb-3">Typical Card Fees (2.3%)</p>
                <ul className="text-sm space-y-2">
                  <li className="flex justify-between">
                    <span>2.3% × $112,500</span>
                    <span className="font-bold text-destructive">$2,587.50</span>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground mt-4">
                  (not including chargebacks, disputes, or PCI compliance costs)
                </p>
              </div>
            </div>

            {/* Savings callout */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Potential Savings Per Night</p>
              <p className="text-3xl font-bold text-purple-400">$1,887.50</p>
              <p className="text-xs text-muted-foreground mt-1">($2,587.50 − $700 = ~73% reduction)</p>
            </div>
          </CardContent>
        </Card>

        {/* Positioning */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-400" />
              Positioning (What to Say)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm">"You're used to paying 2%–2.3% plus chargebacks."</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm">"We price per usage: $0.20 at the door and $0.20 per purchase authorization."</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm">"Because it's wallet/ACH-first, you reduce chargebacks and disputes."</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm">"You also get entry logs, audit trails, and policy enforcement that reduce operational risk."</p>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="font-semibold text-sm text-destructive">Do NOT say:</span>
                  </div>
                  <p className="text-sm">"No fees."</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="font-semibold text-sm text-emerald-400">DO say:</span>
                  </div>
                  <p className="text-sm">"No percentage processing fee — usage-based."</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Value adds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-400" />
              Additional Value Props
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="font-semibold mb-1">Zero Chargebacks</p>
                <p className="text-xs text-muted-foreground">Wallet/ACH eliminates card disputes</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="font-semibold mb-1">Audit Trails</p>
                <p className="text-xs text-muted-foreground">Every entry & purchase logged</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="font-semibold mb-1">Policy Enforcement</p>
                <p className="text-xs text-muted-foreground">Age, ID, status checks at door</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default SalesTrainingFees;
