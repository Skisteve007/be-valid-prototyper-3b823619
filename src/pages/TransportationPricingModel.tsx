import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Users, Clock, CheckCircle2, Zap, Shield, AlertTriangle, Truck, UserCheck, ClipboardCheck, FlaskConical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TransportationPricingModel = () => {
  const tiers = [
    { tier: 'T1', drivers: 'Up to 10', saas: 499, included: 10 },
    { tier: 'T2', drivers: '11–20', saas: 999, included: 20 },
    { tier: 'T3', drivers: '21–50', saas: 1999, included: 50 },
    { tier: 'T4', drivers: '51–100', saas: 3499, included: 100 },
    { tier: 'T5', drivers: '101+', saas: 'Enterprise', included: 'Contracted' },
  ];

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
          <h1 className="text-lg font-bold">Transportation — Pricing</h1>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">SOURCE OF TRUTH</Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Intro */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Fleet / Driver Pricing Model</h2>
          <p className="text-muted-foreground leading-relaxed">
            Transportation pricing is based on <strong>active drivers</strong> per billing period, not vehicles or trucks.
          </p>
        </section>

        {/* Active Driver Rule */}
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-400" />
              Active Driver Rule (Critical)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-background/50 rounded-lg p-4">
              <p className="text-sm mb-3">
                <strong className="text-blue-400">Active Driver</strong> = a driver account that completes at least one billable action in the month:
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4 list-disc">
                <li>A deep face check</li>
                <li>An onboarding step</li>
                <li>An authenticated shift/trip check-in</li>
              </ul>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <p className="text-sm">
                <strong className="text-amber-400">Rule:</strong> Inactive drivers (no activity in the month) do <strong>not</strong> count toward tier sizing.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Tiers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              Driver-Based Pricing Tiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 font-medium">Tier</th>
                    <th className="text-left py-3 font-medium">Active Drivers</th>
                    <th className="text-right py-3 font-medium">SaaS / Month</th>
                    <th className="text-right py-3 font-medium">Included Checks</th>
                    <th className="text-right py-3 font-medium">Overage Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.map((t, i) => (
                    <tr key={t.tier} className={`border-b border-border/50 ${t.tier === 'T5' ? 'bg-purple-500/5' : ''}`}>
                      <td className="py-3">
                        <Badge variant={t.tier === 'T5' ? 'default' : 'outline'} className={t.tier === 'T5' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : ''}>
                          {t.tier}
                        </Badge>
                      </td>
                      <td className="py-3">{t.drivers}</td>
                      <td className="text-right py-3 font-semibold">
                        {typeof t.saas === 'number' ? `$${t.saas.toLocaleString()}` : t.saas}
                      </td>
                      <td className="text-right py-3">
                        {typeof t.included === 'number' ? `${t.included} / month` : t.included}
                      </td>
                      <td className="text-right py-3 text-emerald-400">
                        {t.tier === 'T5' ? 'Contracted' : '$3.25'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic">
              Overage rate range: $2.75–$3.50 (admin-editable). Default: $3.25
            </p>
          </CardContent>
        </Card>

        {/* Deep Face Check Pricing */}
        <Card className="border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              Deep Face Check Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Vendor Cost (Footprint)</p>
                <p className="text-xl font-bold">~$1.90</p>
                <p className="text-xs text-muted-foreground">per check</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Customer Price (Default)</p>
                <p className="text-xl font-bold text-emerald-400">$3.25</p>
                <p className="text-xs text-muted-foreground">per check</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Allowed Range</p>
                <p className="text-xl font-bold">$2.75–$3.50</p>
                <p className="text-xs text-muted-foreground">admin-editable</p>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-sm">Included Checks Rule</h4>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc ml-4">
                <li>Included checks per month = number of active drivers counted for the tier</li>
                <li>Included checks apply only to <strong>successful</strong> checks</li>
                <li>Retries/re-scans must not double-bill (idempotency + retry grace window)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-amber-400" />
              Driver Onboarding (Billed Separately)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Each driver onboarding requires IDV + drug test. Billed as pass-through + orchestration/markup.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium">Line Item</th>
                    <th className="text-right py-2 font-medium">Pricing</th>
                    <th className="text-right py-2 font-medium">Editable</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-2">Onboarding Orchestration Fee</td>
                    <td className="text-right">$____ per driver</td>
                    <td className="text-right text-emerald-400">✓ Admin</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2">IDV Standard</td>
                    <td className="text-right">Vendor pass-through + $____ markup</td>
                    <td className="text-right text-emerald-400">✓ Admin</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-muted-foreground" />
                      Drug Test Lab
                    </td>
                    <td className="text-right">Vendor pass-through + $____ markup</td>
                    <td className="text-right text-emerald-400">✓ Admin</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">MVR / Background (Optional)</td>
                    <td className="text-right text-muted-foreground">Vendor pass-through + $____ markup</td>
                    <td className="text-right text-emerald-400">✓ Admin</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Statements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-400" />
              Statement Line Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Monthly statements must include:
            </p>
            <div className="bg-muted/30 rounded-lg p-4">
              <ul className="text-sm space-y-2">
                <li className="flex justify-between">
                  <span>SaaS Fee (Tier based on active drivers):</span>
                  <span className="text-muted-foreground">$X,XXX</span>
                </li>
                <li className="flex justify-between">
                  <span>Included Deep Face Checks:</span>
                  <span className="text-muted-foreground">XX included</span>
                </li>
                <li className="flex justify-between">
                  <span>Overage Deep Face Checks:</span>
                  <span className="text-muted-foreground">count × $3.25</span>
                </li>
                <li className="flex justify-between border-t border-border pt-2 mt-2">
                  <span className="font-semibold">Onboarding (if applicable):</span>
                  <span></span>
                </li>
                <li className="flex justify-between ml-4">
                  <span>– Orchestration Fees:</span>
                  <span className="text-muted-foreground">count × rate</span>
                </li>
                <li className="flex justify-between ml-4">
                  <span>– IDV Pass-through + Markup:</span>
                  <span className="text-muted-foreground">count × rate</span>
                </li>
                <li className="flex justify-between ml-4">
                  <span>– Drug Test Pass-through + Markup:</span>
                  <span className="text-muted-foreground">count × rate</span>
                </li>
                <li className="flex justify-between border-t border-border pt-2 mt-2 font-semibold">
                  <span>Total:</span>
                  <span className="text-emerald-400">Net amount due</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contract Template Info */}
        <Card className="border-cyan-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-cyan-400" />
              Contract Template Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-sm">Provider</h4>
                <p className="text-sm text-muted-foreground">Giant Ventures LLC</p>
              </div>
              <div className="bg-background/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-sm">Required Definitions</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Active Driver</li>
                  <li>• Deep Face Check</li>
                  <li>• Included Checks</li>
                  <li>• Overage Checks</li>
                </ul>
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-sm">Must Include</h4>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc ml-4">
                <li>Pricing Schedule table reflecting tiers + overage rate range</li>
                <li>Onboarding pass-through + orchestration fee section</li>
                <li>Required disclaimer (see below)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="border-amber-500/30 bg-amber-500/5">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-sm">
            <strong className="text-amber-400">Required Disclaimer:</strong>{' '}
            Screening reduces risk and improves auditability, but does <strong>not guarantee</strong> identification of every prohibited individual.
          </AlertDescription>
        </Alert>

      </main>
    </div>
  );
};

export default TransportationPricingModel;
