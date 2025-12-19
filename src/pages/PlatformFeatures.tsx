import { Helmet } from "react-helmet-async";
import { 
  PartyPopper, 
  Truck, 
  Users,
  FlaskConical, 
  Car,
  Shield,
  Calendar,
  Building2,
  Check,
  DollarSign,
  GraduationCap
} from "lucide-react";
import ResponsiveHeader from "@/components/ResponsiveHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Import background images
import nightlifeBg from "@/assets/industry-nightlife-bg.jpg";
import transportationBg from "@/assets/industry-transportation-bg.jpg";
import workforceBg from "@/assets/industry-workforce-bg.jpg";
import labsBg from "@/assets/industry-labs-bg.jpg";
import rentalsBg from "@/assets/industry-rentals-bg.jpg";
import securityBg from "@/assets/industry-security-bg.jpg";
import universityBg from "@/assets/industry-university-bg.jpg";

const industryCards = [
  {
    id: "nightlife",
    title: "Nightlife & Entertainment™",
    icon: PartyPopper,
    priceStart: "$99",
    priceSuffix: "/month",
    tiers: "Starter: $99/mo | Pro: $199/mo | Enterprise: $399–$799/mo",
    bgImage: nightlifeBg,
    gradientOverlay: "from-purple-900/95 via-purple-800/80 to-transparent",
    borderColor: "border-purple-500",
    accentColor: "text-purple-300",
    included: [
      "Unlimited ID scans at door",
      "GHOST™ Pass system (you earn 30%!)",
      "Community Pool distributions",
      "Promoter Tracking",
      "Real-time Analytics",
    ],
    addOns: [
      { name: "Staff Background Check", price: "$50–$100/employee" },
      { name: "Health Badge Verify", price: "$35–$75/test" },
      { name: "Staff Monitoring", price: "$5–$8/employee/mo" },
    ],
    onboarding: "from $250",
  },
  {
    id: "transportation",
    title: "Transportation & Logistics™",
    icon: Truck,
    priceStart: "$99",
    priceSuffix: "/month + per-driver fees",
    tiers: "Starter: $99/mo | Pro: $199/mo | Enterprise: $299/mo",
    bgImage: transportationBg,
    gradientOverlay: "from-yellow-900/95 via-amber-800/80 to-transparent",
    borderColor: "border-yellow-500",
    accentColor: "text-yellow-300",
    included: [
      "Fleet Dashboard",
      "Compliance Reporting",
      "Vehicle Access Control",
    ],
    perUnit: [
      { name: "Active Driver (Monthly)", price: "$5–$8/driver" },
      { name: "Initial Background Check", price: "$50–$100/driver" },
      { name: "MVR (Driving Record)", price: "$15–$25/check" },
      { name: "Continuous Monitoring", price: "$5–$10/driver/mo" },
      { name: "DOT Drug Screen", price: "$50–$85/test" },
    ],
    onboarding: "from $250",
  },
  {
    id: "workforce",
    title: "Workforce & Staffing™",
    icon: Users,
    priceStart: "$199",
    priceSuffix: "/month + per-employee fees",
    tiers: "Starter: $199/mo | Pro: $299/mo | Enterprise: $499/mo",
    bgImage: workforceBg,
    gradientOverlay: "from-blue-900/95 via-blue-800/80 to-transparent",
    borderColor: "border-blue-500",
    accentColor: "text-blue-300",
    included: [
      "Time & Attendance",
      "Zero-Trust Access",
      "Training Status Tracking",
    ],
    perUnit: [
      { name: "Active Employee (Monthly)", price: "$4–$6/employee" },
      { name: "Initial Background Check", price: "$50–$100/employee" },
      { name: "Drug Screen", price: "$50–$85/test" },
      { name: "I-9/E-Verify", price: "$8–$15/check" },
      { name: "Continuous Monitoring", price: "$5–$10/employee/mo" },
    ],
    onboarding: "from $500",
  },
  {
    id: "labs",
    title: "Labs & Health™",
    icon: FlaskConical,
    priceStart: "$99",
    priceSuffix: "/month",
    tiers: "Starter: $99/mo | Pro: $199/mo | Enterprise: $299/mo",
    bgImage: labsBg,
    gradientOverlay: "from-emerald-900/95 via-teal-800/80 to-transparent",
    borderColor: "border-emerald-500",
    accentColor: "text-emerald-300",
    included: [
      "Lab Partner Integration",
      "Results Dashboard",
      "Certification Tracking",
    ],
    perUnit: [
      { name: "Lab Kit Sales", price: "40–60% margin" },
      { name: "API Verification", price: "$1–$3/call" },
      { name: "Certificate Generation", price: "$2–$5/cert" },
      { name: "Tox Screen (10-Panel)", price: "$50–$100/test" },
    ],
    onboarding: "from $250",
  },
  {
    id: "rentals",
    title: "Rentals & Exotics™",
    icon: Car,
    priceStart: "$199",
    priceSuffix: "/month + per-rental fees",
    tiers: "Starter: $199/mo | Pro: $299/mo | Enterprise: $399/mo",
    bgImage: rentalsBg,
    gradientOverlay: "from-gray-900/95 via-amber-950/80 to-transparent",
    borderColor: "border-amber-400",
    accentColor: "text-amber-300",
    included: [
      "Asset Protection Dashboard",
      "Anti-Fraud Measures",
      "Client History Tracking",
    ],
    perUnit: [
      { name: "Customer ID Verification", price: "$5–$10/rental" },
      { name: "Full Background Check", price: "$50–$100/check" },
      { name: "Insurance Verification", price: "$5–$10/check" },
      { name: "High-Value Client Vetting", price: "$25–$50/check" },
    ],
    onboarding: "from $500",
  },
  {
    id: "security",
    title: "Security & Training™",
    icon: Shield,
    priceStart: "$199",
    priceSuffix: "/month + per-guard fees",
    tiers: "Starter: $199/mo | Pro: $299/mo | Enterprise: $399/mo",
    bgImage: securityBg,
    gradientOverlay: "from-red-900/95 via-red-800/80 to-transparent",
    borderColor: "border-red-500",
    accentColor: "text-red-300",
    included: [
      "Guard Verification",
      "Incident Reporting",
      "Certification Tracking",
    ],
    perUnit: [
      { name: "Active Guard (Monthly)", price: "$5–$8/guard" },
      { name: "Initial Background Check", price: "$50–$100/guard" },
      { name: "License Verification", price: "$10–$20/check" },
      { name: "Continuous Monitoring", price: "$5–$10/guard/mo" },
    ],
    onboarding: "from $500",
  },
  {
    id: "events",
    title: "Events & Festivals™",
    icon: Calendar,
    priceStart: "$499",
    priceSuffix: "/event",
    tiers: "Single Day: $499–$999 | Multi-Day: $1,500–$2,500 | Festival: Custom",
    bgImage: securityBg,
    gradientOverlay: "from-pink-900/95 via-pink-800/80 to-transparent",
    borderColor: "border-pink-500",
    accentColor: "text-pink-300",
    included: [
      "Crowd Analytics",
      "Multi-Gate Management",
      "Real-time Reporting",
    ],
    perUnit: [
      { name: "Per Attendee Scan", price: "$0.10–$0.25/scan" },
      { name: "VIP Verification", price: "$2–$5/person" },
      { name: "Vendor/Staff Check", price: "$5–$10/person" },
      { name: "GHOST™ Passes", price: "30/30/10/30 split" },
    ],
    onboarding: "from $2,500",
  },
  {
    id: "hospitality",
    title: "Hospitality™",
    icon: Building2,
    priceStart: "$199",
    priceSuffix: "/month + per-guest fees",
    tiers: "Starter: $199/mo | Pro: $399/mo | Enterprise: $599/mo",
    bgImage: labsBg,
    gradientOverlay: "from-indigo-900/95 via-indigo-800/80 to-transparent",
    borderColor: "border-indigo-500",
    accentColor: "text-indigo-300",
    included: [
      "Guest Dashboard",
      "Concierge Integration",
      "VIP Alerts",
    ],
    perUnit: [
      { name: "Guest Verification", price: "$1–$3/check-in" },
      { name: "VIP Recognition", price: "$2–$5/guest" },
      { name: "Amenity Access", price: "$0.50–$1/scan" },
      { name: "Health Badge Verify", price: "$35–$75/test" },
    ],
    onboarding: "from $500",
  },
  {
    id: "universities",
    title: "Universities & Education™",
    icon: GraduationCap,
    priceStart: "$50K",
    priceSuffix: "/year (campus license)",
    tiers: "Small: $50K–$100K | Medium: $100K–$250K | Large: $250K–$500K",
    bgImage: universityBg,
    gradientOverlay: "from-indigo-900/95 via-violet-800/80 to-transparent",
    borderColor: "border-violet-500",
    accentColor: "text-violet-300",
    included: [
      "Building-by-Building Tracking",
      "Watchlist Screening",
      "Title IX / Clery Act Compliance",
    ],
    perUnit: [
      { name: "Per-Student/Person", price: "$5–$15/person/year" },
      { name: "Per-Building", price: "$500–$2,000/building/mo" },
      { name: "Stadium Integration", price: "$25K–$75K/year" },
      { name: "Continuous Monitoring", price: "$3–$5/person/mo" },
    ],
    onboarding: "from $5,000",
  },
];

const PlatformFeatures = () => {
  return (
    <>
      <Helmet>
        <title>Vendor Pricing | VALID™ GHOST PASS™ Industry Packages</title>
        <meta name="description" content="Explore VALID™ industry pricing packages starting at $99/month for nightlife, transportation, workforce, health, rentals, and security operations." />
      </Helmet>
      
      <ResponsiveHeader />
      
      <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 mb-6">
              B2B Industry Packages
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
                GHOST PASS™ ECOSYSTEM
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-2">
              Industry packages <span className="text-cyan-400 font-semibold">starting at $99/month</span>
            </p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-4">
              Base platform + usage fees (per scan/transaction) that scale with your business.
            </p>
            <p className="text-sm text-emerald-400 font-medium">
              All packages include GHOST™ Pass revenue share — venues earn 30% on every pass sold.
            </p>
          </div>
          
          {/* 4x2 Grid of Industry Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {industryCards.map((card) => (
              <div 
                key={card.id}
                className={`relative overflow-hidden rounded-xl ${card.borderColor} border shadow-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl group flex flex-col`}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${card.bgImage})` }}
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${card.gradientOverlay}`} />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full p-4">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20">
                      <card.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white drop-shadow-lg leading-tight">
                      {card.title}
                    </h3>
                  </div>
                  
                  {/* Price Section */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-white uppercase tracking-wide font-medium">Starting at</span>
                    </div>
                    <div className="text-3xl font-black text-white drop-shadow-lg">
                      {card.priceStart}<span className="text-sm font-medium text-white">{card.priceSuffix}</span>
                    </div>
                    <p className="text-xs font-semibold text-white mt-1 leading-tight">
                      {card.tiers}
                    </p>
                  </div>
                  
                  {/* Included Section */}
                  <div className="mb-3">
                    <p className="text-xs text-white uppercase tracking-wide mb-1 font-semibold">Included:</p>
                    <div className="space-y-1">
                      {card.included.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                          <span className="text-sm text-white font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Per-Unit or Add-Ons Section */}
                  {(card.perUnit || card.addOns) && (
                    <div className="mb-3 flex-grow">
                      <p className="text-xs text-white uppercase tracking-wide mb-1 font-semibold">
                        {card.addOns ? "Optional Add-Ons:" : "Per-Use Fees:"}
                      </p>
                      <div className="space-y-0.5">
                        {(card.perUnit || card.addOns)?.slice(0, 4).map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-white font-medium">{item.name}</span>
                            <span className="text-white font-bold">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Onboarding */}
                  <p className="text-xs text-white font-medium mb-2">+ Onboarding {card.onboarding}</p>
                  
                  {/* CTA Button */}
                  <Button 
                    asChild
                    size="sm"
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold border border-white/30 hover:border-white/50 text-xs h-8"
                  >
                    <Link to="/partner-application">
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* How Pricing Works */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-cyan-500/20 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">
              HOW PRICING WORKS
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-center text-sm mb-6">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-cyan-400 mb-1">BASE</div>
                <div className="text-muted-foreground text-xs">Monthly access to dashboard, support, analytics</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-purple-400 mb-1">+ PER-USER</div>
                <div className="text-muted-foreground text-xs">Scales with your team size (drivers, employees, guards)</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-emerald-400 mb-1">+ PER-CHECK</div>
                <div className="text-muted-foreground text-xs">Pay per background check, drug screen, etc.</div>
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <DollarSign className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-emerald-400 font-semibold text-sm">
                NIGHTLIFE VENUES: Most venues PROFIT from VALID™ —
              </p>
              <p className="text-emerald-300 text-xs">
                your GHOST™ Pass earnings often EXCEED your subscription cost!
              </p>
            </div>
          </div>
          
          {/* Stadium Tier & Custom Enterprise */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {/* Stadium Tier */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40">
                  <Shield className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">STADIUM & ARENA TIER</h3>
                  <p className="text-amber-400 font-semibold">$2,500–$7,500/month</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-3 text-sm">
                For NFL stadiums, arenas, and major festivals. Stadium pays for guest verifications as operational cost.
              </p>
              <div className="space-y-1 text-xs text-muted-foreground mb-4">
                <p>• <span className="text-amber-400">Per-Scan Pricing:</span> $0.10–$0.50/scan (volume-based)</p>
                <p>• <span className="text-amber-400">Includes:</span> Unlimited scanners, API access, 24/7 support</p>
                <p>• <span className="text-amber-400">Onboarding:</span> $10,000–$25,000</p>
              </div>
              <Button asChild className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40">
                <Link to="/partner-application">
                  Contact Sales
                </Link>
              </Button>
            </div>

            {/* Custom Enterprise */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-foreground mb-2">
                CUSTOM ENTERPRISE?
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Multi-venue deployments and custom integrations available. Let's build something together.
              </p>
              <Button asChild variant="outline" className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                <a href="https://calendly.com/steve-bevalid/30min" target="_blank" rel="noopener noreferrer">
                  Schedule a Call
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PlatformFeatures;