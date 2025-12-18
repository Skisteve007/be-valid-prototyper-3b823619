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
  CreditCard
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

      {/* Section E: Labs & Health */}
      <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FlaskConical className="h-5 w-5 text-emerald-400" />
            🏥 Labs & Health
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
                  <TableCell className="text-sm">Use existing devices</TableCell>
                  <TableCell className="text-cyan-400">$250</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Professional</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$199</TableCell>
                  <TableCell className="text-sm">1 Tablet</TableCell>
                  <TableCell className="text-cyan-400">$500</TableCell>
                </TableRow>
                <TableRow className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium">Enterprise</TableCell>
                  <TableCell className="text-emerald-400 font-semibold">$299</TableCell>
                  <TableCell className="text-sm">2 Tablets + Hub</TableCell>
                  <TableCell className="text-cyan-400">$1,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm font-semibold text-foreground mb-2">💵 Revenue Model:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Lab kit sales: <span className="text-emerald-400 font-semibold">40–60% margin (WE KEEP)</span></div>
              <div>API verification: <span className="text-cyan-400">$1–$3/call</span></div>
              <div>Certificate generation: <span className="text-cyan-400">$2–$5/cert</span></div>
              <div>Tox screen (10-panel): <span className="text-cyan-400">$50–$100/test</span></div>
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

      {/* Section K: Member/Consumer Pricing */}
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

      {/* Section L: Transaction & API Revenue */}
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
