import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  PartyPopper, 
  Truck, 
  Briefcase, 
  FlaskConical, 
  Car, 
  Shield, 
  Tent, 
  Hotel, 
  Building2, 
  Users,
  CreditCard,
  GraduationCap
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const PricingReferenceTab = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-4 border-b border-border">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          💰 VALID™ PRICING REFERENCE
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          INTERNAL USE ONLY — Quick reference for sales calls and quoting
        </p>
      </div>

      {/* Section A: Hardware Pricing */}
      <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wrench className="h-5 w-5 text-cyan-400" />
            🔧 Hardware Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-foreground font-semibold">Device</TableHead>
                  <TableHead className="text-foreground font-semibold">Purchase</TableHead>
                  <TableHead className="text-foreground font-semibold">Lease</TableHead>
                  <TableHead className="text-foreground font-semibold">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Handheld Scanner</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$599</TableCell>
                  <TableCell className="text-cyan-400">$29/mo</TableCell>
                  <TableCell className="text-muted-foreground text-sm">Portable, door staff</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Desktop Hub</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$999</TableCell>
                  <TableCell className="text-cyan-400">$49/mo</TableCell>
                  <TableCell className="text-muted-foreground text-sm">Manager station</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Tablet Kit</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$399</TableCell>
                  <TableCell className="text-cyan-400">$19/mo</TableCell>
                  <TableCell className="text-muted-foreground text-sm">iPad/Android + app</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Kiosk</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$1,499</TableCell>
                  <TableCell className="text-cyan-400">$79/mo</TableCell>
                  <TableCell className="text-muted-foreground text-sm">Self-service entry</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Section B: Nightlife & Entertainment */}
      <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <PartyPopper className="h-5 w-5 text-purple-400" />
            🎤 Nightlife & Entertainment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-foreground font-semibold">Tier</TableHead>
                  <TableHead className="text-foreground font-semibold">Monthly</TableHead>
                  <TableHead className="text-foreground font-semibold">Hardware Included</TableHead>
                  <TableHead className="text-foreground font-semibold">Onboarding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Starter</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$99</TableCell>
                  <TableCell className="text-sm">1 Handheld (+$29 lease)</TableCell>
                  <TableCell className="text-cyan-400">$250</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Professional</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$199</TableCell>
                  <TableCell className="text-sm">1 Hub + 2 Handhelds</TableCell>
                  <TableCell className="text-cyan-400">$500</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Enterprise</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$399–$799</TableCell>
                  <TableCell className="text-sm">1 Hub + 5 Handhelds INCL</TableCell>
                  <TableCell className="text-cyan-400">$1,500–$3,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm font-semibold text-foreground mb-2">✓ Software Included:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Unlimited ID scans</li>
                <li>• Banned/VIP lists</li>
                <li>• Promoter tracking</li>
                <li>• GHOST™ Passes (venue earns 30%)</li>
                <li>• Real-time analytics</li>
                <li>• Community Pool participation</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm font-semibold text-foreground mb-2">+ Add-ons:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Staff background check: <span className="text-cyan-400">$50–$100/employee</span></li>
                <li>• Health badge verify: <span className="text-cyan-400">$35–$75/test</span></li>
                <li>• Staff monitoring: <span className="text-cyan-400">$5–$8/employee/mo</span></li>
              </ul>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <p className="text-sm text-emerald-400 font-semibold">
              💡 Sales tip: Most venues PROFIT — GHOST™ earnings exceed costs!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section C: Transportation & Logistics */}
      <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Truck className="h-5 w-5 text-blue-400" />
            🚛 Transportation & Logistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-foreground font-semibold">Tier</TableHead>
                  <TableHead className="text-foreground font-semibold">Monthly</TableHead>
                  <TableHead className="text-foreground font-semibold">Hardware</TableHead>
                  <TableHead className="text-foreground font-semibold">Onboarding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Starter</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$99</TableCell>
                  <TableCell className="text-sm">1 Tablet (+$19 lease)</TableCell>
                  <TableCell className="text-cyan-400">$250</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Professional</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$199</TableCell>
                  <TableCell className="text-sm">2 Tablets</TableCell>
                  <TableCell className="text-cyan-400">$500</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Enterprise</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$299</TableCell>
                  <TableCell className="text-sm">2 Tablets + 1 Hub INCL</TableCell>
                  <TableCell className="text-cyan-400">$1,000–$3,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm font-semibold text-foreground mb-2">Per-Driver Fees:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div>Active driver/mo: <span className="text-cyan-400">$5–$8</span></div>
              <div>Initial background: <span className="text-cyan-400">$50–$100</span></div>
              <div>MVR: <span className="text-cyan-400">$15–$25</span></div>
              <div>DOT drug screen: <span className="text-cyan-400">$50–$85</span></div>
              <div>Continuous monitoring: <span className="text-cyan-400">$5–$10/mo</span></div>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-xs text-amber-400">
              📝 Example: 100 drivers: Base $199 + 100×$6 = $600 + checks ≈ $800–$1,000/month
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section D: Workforce & Staffing */}
      <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="h-5 w-5 text-orange-400" />
            👔 Workforce & Staffing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-foreground font-semibold">Tier</TableHead>
                  <TableHead className="text-foreground font-semibold">Monthly</TableHead>
                  <TableHead className="text-foreground font-semibold">Hardware</TableHead>
                  <TableHead className="text-foreground font-semibold">Onboarding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Starter</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$199</TableCell>
                  <TableCell className="text-sm">1 Tablet (+$19 lease)</TableCell>
                  <TableCell className="text-cyan-400">$500</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Professional</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$299</TableCell>
                  <TableCell className="text-sm">2 Tablets</TableCell>
                  <TableCell className="text-cyan-400">$1,000</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Enterprise</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$499</TableCell>
                  <TableCell className="text-sm">3 Tablets + 1 Hub INCL</TableCell>
                  <TableCell className="text-cyan-400">$1,500–$5,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm font-semibold text-foreground mb-2">Per-Employee Fees:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div>Active employee/mo: <span className="text-cyan-400">$3–$6</span></div>
              <div>Background check: <span className="text-cyan-400">$50–$100</span></div>
              <div>Drug screen: <span className="text-cyan-400">$50–$85</span></div>
              <div>I-9/E-Verify: <span className="text-cyan-400">$8–$15</span></div>
              <div>Continuous monitoring: <span className="text-cyan-400">$5–$10/mo</span></div>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-xs text-amber-400">
              📝 Example: 200 employees: Base $299 + 200×$4 = $800 ≈ $1,100/month
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section E: Labs & Health - EXPANDED 3 REVENUE MODELS */}
      <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FlaskConical className="h-5 w-5 text-emerald-400" />
            🏥 Labs & Health — REVENUE MODELS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* MODEL 1: Small Labs / Clinics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">MODEL 1</Badge>
              <span className="font-semibold text-foreground">SMALL LABS / CLINICS PAY US</span>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-foreground font-semibold">Tier</TableHead>
                    <TableHead className="text-foreground font-semibold">Monthly</TableHead>
                    <TableHead className="text-foreground font-semibold">Onboarding</TableHead>
                    <TableHead className="text-foreground font-semibold">Includes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-border/30 hover:bg-muted/30">
                    <TableCell className="font-medium">Starter</TableCell>
                    <TableCell className="text-emerald-400 font-semibold">$99</TableCell>
                    <TableCell className="text-cyan-400">$250</TableCell>
                    <TableCell className="text-sm text-muted-foreground">100 verifications</TableCell>
                  </TableRow>
                  <TableRow className="border-border/30 hover:bg-muted/30">
                    <TableCell className="font-medium">Professional</TableCell>
                    <TableCell className="text-emerald-400 font-semibold">$199</TableCell>
                    <TableCell className="text-cyan-400">$500</TableCell>
                    <TableCell className="text-sm text-muted-foreground">Unlimited, analytics</TableCell>
                  </TableRow>
                  <TableRow className="border-border/30 hover:bg-muted/30">
                    <TableCell className="font-medium">Enterprise</TableCell>
                    <TableCell className="text-emerald-400 font-semibold">$299</TableCell>
                    <TableCell className="text-cyan-400">$1,000</TableCell>
                    <TableCell className="text-sm text-muted-foreground">Multi-location, dedicated support</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">Per-use:</span> API <span className="text-cyan-400">$1–$3</span> | 
                Certs <span className="text-cyan-400">$2–$5</span> | 
                Margin <span className="text-emerald-400 font-semibold">40–60%</span>
              </p>
            </div>
          </div>

          <div className="border-t border-border/30" />

          {/* MODEL 2: Big Labs Partner Program */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">MODEL 2</Badge>
              <span className="font-semibold text-foreground">BIG LABS PAY US FOR MEMBER ACCESS (Partner Program)</span>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-foreground font-semibold">Partner Tier</TableHead>
                    <TableHead className="text-foreground font-semibold">Monthly</TableHead>
                    <TableHead className="text-foreground font-semibold">Setup</TableHead>
                    <TableHead className="text-foreground font-semibold">We Earn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-border/30 hover:bg-muted/30">
                    <TableCell className="font-medium">Basic Partner</TableCell>
                    <TableCell className="text-emerald-400 font-semibold">FREE</TableCell>
                    <TableCell className="text-emerald-400">FREE</TableCell>
                    <TableCell className="text-amber-400 font-semibold">20% commission</TableCell>
                  </TableRow>
                  <TableRow className="border-border/30 hover:bg-muted/30">
                    <TableCell className="font-medium">Preferred Partner</TableCell>
                    <TableCell className="text-emerald-400 font-semibold">$500</TableCell>
                    <TableCell className="text-cyan-400">$500</TableCell>
                    <TableCell className="text-amber-400 font-semibold">25% commission</TableCell>
                  </TableRow>
                  <TableRow className="border-border/30 hover:bg-muted/30">
                    <TableCell className="font-medium">Premium Partner</TableCell>
                    <TableCell className="text-emerald-400 font-semibold">$2,000</TableCell>
                    <TableCell className="text-cyan-400">$2,000</TableCell>
                    <TableCell className="text-amber-400 font-semibold">30% commission</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <p className="text-sm text-purple-400">
                💡 Sales tip: "Big labs want our members — they'll pay for featured access."
              </p>
            </div>
          </div>

          <div className="border-t border-border/30" />

          {/* MODEL 3: Affiliate Revenue */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">MODEL 3</Badge>
              <span className="font-semibold text-foreground">AFFILIATE REVENUE (No Integration Required)</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>Priority STD Testing: <span className="text-emerald-400 font-semibold">30%</span></div>
                <div>HealthLabs: <span className="text-emerald-400 font-semibold">30%</span></div>
                <div>myLAB Box: <span className="text-emerald-400 font-semibold">20%</span></div>
                <div>Quest Diagnostics: <span className="text-cyan-400">Commission/test</span></div>
                <div>Ulta Lab Tests: <span className="text-emerald-400 font-semibold">Up to 20%</span></div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/30" />

          {/* MEMBER TEST PRICING */}
          <div className="space-y-3">
            <p className="font-semibold text-foreground">💰 MEMBER TEST PRICING (What We Charge Members)</p>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-foreground font-semibold">Test</TableHead>
                    <TableHead className="text-foreground font-semibold">Our Cost</TableHead>
                    <TableHead className="text-foreground font-semibold">Member Price</TableHead>
                    <TableHead className="text-foreground font-semibold">Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-border/30 hover:bg-muted/30">
                    <TableCell className="font-medium">10-Panel Drug</TableCell>
                    <TableCell className="text-muted-foreground">$15–$25</TableCell>
                    <TableCell className="text-emerald-400 font-semibold">$39</TableCell>
                    <TableCell className="text-cyan-400">$14–$24 (40–60%)</TableCell>
                  </TableRow>
                  <TableRow className="border-border/30 hover:bg-muted/30">
                    <TableCell className="font-medium">Basic STD (3-test)</TableCell>
                    <TableCell className="text-muted-foreground">$30–$40</TableCell>
                    <TableCell className="text-emerald-400 font-semibold">$59</TableCell>
                    <TableCell className="text-cyan-400">$19–$29 (40–50%)</TableCell>
                  </TableRow>
                  <TableRow className="border-border/30 hover:bg-muted/30">
                    <TableCell className="font-medium">Full STD Panel</TableCell>
                    <TableCell className="text-muted-foreground">$60–$80</TableCell>
                    <TableCell className="text-emerald-400 font-semibold">$149</TableCell>
                    <TableCell className="text-cyan-400">$69–$89 (45–60%)</TableCell>
                  </TableRow>
                  <TableRow className="border-border/30 hover:bg-muted/30">
                    <TableCell className="font-medium">Comprehensive Wellness</TableCell>
                    <TableCell className="text-muted-foreground">$80–$100</TableCell>
                    <TableCell className="text-emerald-400 font-semibold">$199</TableCell>
                    <TableCell className="text-cyan-400">$99–$119 (50–60%)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <p className="text-sm text-emerald-400">
                📊 Example: 1,000 tests/month at 50% avg margin: 1,000 × $50 margin = <span className="font-bold text-white">$50,000/month</span> lab revenue
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section F: Rentals & Exotics */}
      <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Car className="h-5 w-5 text-red-400" />
            🚗 Rentals & Exotics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-foreground font-semibold">Tier</TableHead>
                  <TableHead className="text-foreground font-semibold">Monthly</TableHead>
                  <TableHead className="text-foreground font-semibold">Hardware</TableHead>
                  <TableHead className="text-foreground font-semibold">Onboarding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Starter</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$199</TableCell>
                  <TableCell className="text-sm">1 Tablet (+$19 lease)</TableCell>
                  <TableCell className="text-cyan-400">$500</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Professional</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$299</TableCell>
                  <TableCell className="text-sm">2 Tablets</TableCell>
                  <TableCell className="text-cyan-400">$1,000</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Enterprise</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$399</TableCell>
                  <TableCell className="text-sm">2 Tablets + Hub</TableCell>
                  <TableCell className="text-cyan-400">$1,500</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm font-semibold text-foreground mb-2">Per-Rental Fees:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Customer ID verification: <span className="text-cyan-400">$5–$10</span></div>
              <div>Full background check: <span className="text-cyan-400">$50–$100</span></div>
              <div>Insurance verification: <span className="text-cyan-400">$5–$10</span></div>
              <div>High-value vetting: <span className="text-cyan-400">$25–$50</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section G: Security & Training */}
      <Card className="border-slate-500/30 bg-gradient-to-br from-slate-500/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-slate-400" />
            🛡️ Security & Training
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-foreground font-semibold">Tier</TableHead>
                  <TableHead className="text-foreground font-semibold">Monthly</TableHead>
                  <TableHead className="text-foreground font-semibold">Hardware</TableHead>
                  <TableHead className="text-foreground font-semibold">Onboarding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Starter</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$199</TableCell>
                  <TableCell className="text-sm">1 Tablet (+$19 lease)</TableCell>
                  <TableCell className="text-cyan-400">$500</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Professional</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$299</TableCell>
                  <TableCell className="text-sm">2 Tablets</TableCell>
                  <TableCell className="text-cyan-400">$1,000</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Enterprise</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$399</TableCell>
                  <TableCell className="text-sm">3 Tablets + Hub</TableCell>
                  <TableCell className="text-cyan-400">$1,500</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm font-semibold text-foreground mb-2">Per-Guard Fees:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Active guard/mo: <span className="text-cyan-400">$5–$8</span></div>
              <div>Background check: <span className="text-cyan-400">$50–$100</span></div>
              <div>License verification: <span className="text-cyan-400">$10–$20</span></div>
              <div>Continuous monitoring: <span className="text-cyan-400">$5–$10/mo</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section H: Events & Festivals */}
      <Card className="border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tent className="h-5 w-5 text-pink-400" />
            🎪 Events & Festivals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-foreground font-semibold">Event Type</TableHead>
                  <TableHead className="text-foreground font-semibold">Price</TableHead>
                  <TableHead className="text-foreground font-semibold">Hardware</TableHead>
                  <TableHead className="text-foreground font-semibold">Onboarding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Single Day</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$499–$999</TableCell>
                  <TableCell className="text-sm">5 Handhelds</TableCell>
                  <TableCell className="text-cyan-400">$2,500</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Multi-Day</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$1,500–$2,500</TableCell>
                  <TableCell className="text-sm">10 Handhelds</TableCell>
                  <TableCell className="text-cyan-400">$5,000</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Festival</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">Custom</TableCell>
                  <TableCell className="text-sm">Custom</TableCell>
                  <TableCell className="text-cyan-400">$10,000+</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm font-semibold text-foreground mb-2">Per-Attendee Fees:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Per scan: <span className="text-cyan-400">$0.10–$0.25</span></div>
              <div>VIP verification: <span className="text-cyan-400">$2–$5</span></div>
              <div>Vendor/staff check: <span className="text-cyan-400">$5–$10</span></div>
              <div>GHOST™ Passes: <span className="text-emerald-400">30/30/10/30 split</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section I: Hospitality */}
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hotel className="h-5 w-5 text-amber-400" />
            🏨 Hospitality
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-foreground font-semibold">Tier</TableHead>
                  <TableHead className="text-foreground font-semibold">Monthly</TableHead>
                  <TableHead className="text-foreground font-semibold">Hardware</TableHead>
                  <TableHead className="text-foreground font-semibold">Onboarding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Starter</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$199</TableCell>
                  <TableCell className="text-sm">1 Tablet (+$19 lease)</TableCell>
                  <TableCell className="text-cyan-400">$500</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Professional</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$399</TableCell>
                  <TableCell className="text-sm">2 Tablets</TableCell>
                  <TableCell className="text-cyan-400">$1,000</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Enterprise</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$599</TableCell>
                  <TableCell className="text-sm">3 Tablets + Hub</TableCell>
                  <TableCell className="text-cyan-400">$2,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm font-semibold text-foreground mb-2">Per-Guest Fees:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Guest verification: <span className="text-cyan-400">$1–$3/check-in</span></div>
              <div>VIP recognition: <span className="text-cyan-400">$2–$5</span></div>
              <div>Amenity access: <span className="text-cyan-400">$0.50–$1/scan</span></div>
              <div>Health badge verify: <span className="text-cyan-400">$35–$75</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section J: Stadium & Arena */}
      <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-yellow-400" />
            🏟️ Stadium & Arena
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">PREMIUM</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm font-semibold text-foreground mb-2">💵 Monthly Fee</p>
              <p className="text-2xl font-bold text-emerald-400">$2,500–$7,500</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm font-semibold text-foreground mb-2">🚀 Onboarding</p>
              <p className="text-2xl font-bold text-cyan-400">$10,000–$25,000</p>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm font-semibold text-foreground mb-2">Hardware Included:</p>
            <p className="text-xs text-muted-foreground">2 Desktop Hubs, 20 Handhelds, 5 Kiosks (additional units custom)</p>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm font-semibold text-foreground mb-2">Pricing Options:</p>
            <div className="text-xs space-y-1">
              <p>• Per-scan: <span className="text-cyan-400">$0.10–$0.50</span> (volume-based)</p>
              <p>• OR flat monthly fee</p>
              <p className="text-muted-foreground italic">Note: stadium pays for guest verifications (not guests)</p>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <p className="text-xs text-emerald-400">
              📝 Example: NFL game 70,000 × $0.15 = $10,500/game; 10 home games = $105,000/year + base fee
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section K: Universities & Education */}
      <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-indigo-400" />
            🎓 Universities & Education
            <Badge variant="outline" className="ml-2 text-xs border-indigo-500/50 text-indigo-400">ENTERPRISE</Badge>
          </CardTitle>
          <p className="text-xs text-muted-foreground">Also: Corporate campuses, HQs, research parks, business parks ("corporate zones")</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Campus License Pricing */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm font-semibold text-foreground mb-2">Campus License (Annual):</p>
            <div className="text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-border/30 pb-1">
                <span>Small Campus <span className="text-muted-foreground">(under 10K students / small corporate)</span></span>
                <span className="text-emerald-400 font-semibold">$50,000–$100,000/yr</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/30 pb-1">
                <span>Medium Campus <span className="text-muted-foreground">(10K–30K / mid-size campus or business park)</span></span>
                <span className="text-emerald-400 font-semibold">$100,000–$250,000/yr</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Large Campus <span className="text-muted-foreground">(30K+ / multi-campus system or major corporate zone)</span></span>
                <span className="text-emerald-400 font-semibold">$250,000–$500,000/yr</span>
              </div>
            </div>
          </div>

          {/* Alternative Pricing */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm font-semibold text-foreground mb-2">Alternative Pricing Models:</p>
            <div className="text-xs space-y-1">
              <p>• Per-student / per-person: <span className="text-cyan-400">$5–$15 / person / year</span></p>
              <p>• Per-building: <span className="text-cyan-400">$500–$2,000 / building / month</span></p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Add-ons */}
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm font-semibold text-foreground mb-2">Add-Ons:</p>
              <div className="text-xs space-y-1">
                <p>• Stadium integration: <span className="text-cyan-400">$25,000–$75,000/yr</span></p>
                <p>• Background checks (new hires): <span className="text-cyan-400">$50–$100/check</span></p>
                <p>• Continuous monitoring: <span className="text-cyan-400">$3–$5/person/mo</span></p>
                <p>• Visitor kiosks: <span className="text-cyan-400">$1,500 + $200/mo</span></p>
              </div>
            </div>

            {/* Who's Verified */}
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm font-semibold text-foreground mb-2">Who's Verified:</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>• Students / Employees (ID + watchlist)</p>
                <p>• Faculty & Staff (background + monitoring)</p>
                <p>• Visitors (real-time screening + temp badges)</p>
                <p>• Contractors (credentialed, time-limited)</p>
                <p>• Event attendees (football, concerts, graduation)</p>
                <p>• Vendors</p>
              </div>
            </div>
          </div>

          {/* Watchlist Screening */}
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-sm font-semibold text-foreground mb-2">Watchlist Screening:</p>
            <div className="text-xs grid grid-cols-2 gap-1 text-red-300">
              <p>• Terrorist watchlist</p>
              <p>• Sex offender registry</p>
              <p>• Criminal database</p>
              <p>• Continuous monitoring alerts</p>
            </div>
          </div>

          {/* Onboarding */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm">
              <span className="font-semibold text-foreground">Onboarding:</span>{" "}
              <span className="text-cyan-400 font-semibold">$5,000–$25,000</span>{" "}
              <span className="text-muted-foreground">(one-time, based on campus size)</span>
            </p>
          </div>

          {/* Example */}
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <p className="text-xs text-emerald-400">
              📝 Example: 30K campus: license ~$200K + stadium ~$50K + checks ~$15K = <span className="font-bold">~$265K/year</span>
            </p>
          </div>

          {/* Sales Tip */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-xs text-amber-400 font-semibold">
              💡 Sales tip: One state university system or corporate campus network can be a multi-site <span className="text-white">$5M+ opportunity</span>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section L: Member/Consumer Pricing */}
      <Card className="border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-violet-400" />
            👤 Member/Consumer Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm font-semibold text-foreground mb-2">Member Subscription</p>
              <p className="text-2xl font-bold text-emerald-400">$39 <span className="text-sm font-normal text-muted-foreground">per 60 days</span></p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm font-semibold text-foreground mb-2">GHOST™ Pass</p>
              <div className="text-sm space-y-1">
                <p>1-Day: <span className="text-cyan-400">$10</span></p>
                <p>3-Day: <span className="text-cyan-400">$20</span></p>
                <p>1-Week: <span className="text-cyan-400">$50</span></p>
              </div>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <p className="text-sm font-semibold text-foreground mb-1">GHOST™ Pass Split:</p>
            <p className="text-xs text-emerald-400">
              30% Venue | 30% Pool | 10% Account Mgr | 30% VALID™
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section M: Transaction & API Revenue */}
      <Card className="border-teal-500/30 bg-gradient-to-br from-teal-500/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-teal-400" />
            💳 Transaction & API Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
              <p className="text-sm font-semibold text-foreground mb-2">Transaction Fees</p>
              <p className="text-2xl font-bold text-emerald-400">1.5%</p>
              <p className="text-xs text-muted-foreground">of every payment</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
              <p className="text-sm font-semibold text-foreground mb-2">Verification API</p>
              <p className="text-2xl font-bold text-cyan-400">$0.50–$2.00</p>
              <p className="text-xs text-muted-foreground">per check</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
              <p className="text-sm font-semibold text-foreground mb-2">Health/Lab Margin</p>
              <p className="text-2xl font-bold text-purple-400">40–60%</p>
              <p className="text-xs text-muted-foreground">on lab kits</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
