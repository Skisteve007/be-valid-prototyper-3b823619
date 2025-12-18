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
  Check
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

const industryCards = [
  {
    id: "nightlife",
    title: "Nightlife & Entertainment™",
    icon: PartyPopper,
    priceStart: "$99",
    tiers: "Starter: $99/mo | Pro: $199/mo | Enterprise: $399–$799/mo",
    onboarding: "+ Onboarding from $250",
    bgImage: nightlifeBg,
    gradientOverlay: "from-purple-900/90 via-purple-800/70 to-transparent",
    borderColor: "border-purple-500",
    accentColor: "text-purple-300",
    features: [
      "Venue Access Control",
      "GHOST™ Pass Revenue Share (30%!)",
      "Promoter Tracking",
      "FBO Split Setup",
      "Real-time Analytics",
    ],
  },
  {
    id: "transportation",
    title: "Transportation & Logistics™",
    icon: Truck,
    priceStart: "$99",
    tiers: "Starter: $99/mo | Pro: $199/mo | Enterprise: $299/mo",
    onboarding: "+ Onboarding from $250",
    bgImage: transportationBg,
    gradientOverlay: "from-yellow-900/90 via-amber-800/70 to-transparent",
    borderColor: "border-yellow-500",
    accentColor: "text-yellow-300",
    features: [
      "Driver Verification",
      "Fleet Tracking",
      "Cargo Manifest Audits",
      "Vehicle Access Control",
      "Compliance Reporting",
    ],
  },
  {
    id: "workforce",
    title: "Workforce & Staffing™",
    icon: Users,
    priceStart: "$199",
    tiers: "Starter: $199/mo | Pro: $299/mo | Enterprise: $499/mo",
    onboarding: "+ Onboarding from $500",
    bgImage: workforceBg,
    gradientOverlay: "from-blue-900/90 via-blue-800/70 to-transparent",
    borderColor: "border-blue-500",
    accentColor: "text-blue-300",
    features: [
      "Time & Attendance",
      "Employee ID Verification",
      "Zero-Trust Access",
      "Training Status Tracking",
      "Background Check Integration",
    ],
  },
  {
    id: "labs",
    title: "Labs & Health™",
    icon: FlaskConical,
    priceStart: "$99",
    tiers: "Starter: $99/mo | Pro: $199/mo | Enterprise: $299/mo",
    onboarding: "+ Onboarding from $250",
    bgImage: labsBg,
    gradientOverlay: "from-emerald-900/90 via-teal-800/70 to-transparent",
    borderColor: "border-emerald-500",
    accentColor: "text-emerald-300",
    features: [
      "API Integration",
      "Toxicology Results",
      "Health Vetting",
      "Certification Status",
      "Lab Kit Ordering",
    ],
  },
  {
    id: "rentals",
    title: "Rentals & Exotics™",
    icon: Car,
    priceStart: "$199",
    tiers: "Starter: $199/mo | Pro: $299/mo | Enterprise: $399/mo",
    onboarding: "+ Onboarding from $500",
    bgImage: rentalsBg,
    gradientOverlay: "from-gray-900/95 via-amber-950/60 to-transparent",
    borderColor: "border-amber-400",
    accentColor: "text-amber-300",
    isLuxury: true,
    features: [
      "Asset Protection",
      "Insurance Verification",
      "High-Value Client Vetting",
      "Anti-Fraud Measures",
      "Damage Documentation",
    ],
  },
  {
    id: "security",
    title: "Security & Training™",
    icon: Shield,
    priceStart: "$199",
    tiers: "Starter: $199/mo | Pro: $299/mo | Enterprise: $399/mo",
    onboarding: "+ Onboarding from $500",
    bgImage: securityBg,
    gradientOverlay: "from-red-900/90 via-red-800/70 to-transparent",
    borderColor: "border-red-500",
    accentColor: "text-red-300",
    features: [
      "Guard Verification",
      "License Checks",
      "Incident Reporting",
      "Certification Tracking",
      "Shift Management",
    ],
  },
  {
    id: "events",
    title: "Events & Festivals™",
    icon: Calendar,
    priceStart: "$499",
    tiers: "Single Event: $499–$2,500 | Festival: Custom",
    onboarding: "+ Onboarding from $2,500",
    bgImage: securityBg,
    gradientOverlay: "from-pink-900/90 via-pink-800/70 to-transparent",
    borderColor: "border-pink-500",
    accentColor: "text-pink-300",
    features: [
      "Multi-Day Pass Management",
      "Crowd Analytics",
      "VIP Access Control",
      "Real-time Reporting",
      "Emergency Protocols",
    ],
  },
  {
    id: "hospitality",
    title: "Hospitality™",
    icon: Building2,
    priceStart: "$199",
    tiers: "Starter: $199/mo | Pro: $399/mo | Enterprise: $599/mo",
    onboarding: "+ Onboarding from $500",
    bgImage: labsBg,
    gradientOverlay: "from-indigo-900/90 via-indigo-800/70 to-transparent",
    borderColor: "border-indigo-500",
    accentColor: "text-indigo-300",
    features: [
      "Guest Verification",
      "Amenity Access Control",
      "Concierge Integration",
      "VIP Recognition",
      "Loyalty Program Sync",
    ],
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
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 mb-6">
              B2B Industry Packages
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
                GHOST PASS™ ECOSYSTEM
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4">
              Industry packages <span className="text-cyan-400 font-semibold">starting at $99/month</span>
            </p>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              All packages include GHOST™ Pass revenue share — <span className="text-emerald-400 font-semibold">venues earn 30%</span> on every pass sold.
            </p>
          </div>
          
          {/* 4x2 Grid of Industry Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {industryCards.map((card) => (
              <div 
                key={card.id}
                className={`relative overflow-hidden rounded-2xl ${card.borderColor} border-2 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group min-h-[440px] flex flex-col`}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${card.bgImage})` }}
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${card.gradientOverlay}`} />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full p-5">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/20">
                      <card.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white drop-shadow-lg leading-tight">
                      {card.title}
                    </h3>
                  </div>
                  
                  {/* Price Section */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-white/70">Starting at</span>
                    </div>
                    <div className={`text-4xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`}>
                      {card.priceStart}<span className="text-lg font-medium">/mo</span>
                    </div>
                    <p className={`text-xs font-medium ${card.accentColor} mt-1`}>
                      {card.tiers}
                    </p>
                    <p className="text-xs text-white/60 mt-0.5">
                      {card.onboarding}
                    </p>
                  </div>
                  
                  {/* Features List */}
                  <div className="space-y-2 flex-grow">
                    {card.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-white/90 drop-shadow-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA Button */}
                  <Button 
                    asChild
                    className="w-full mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold border border-white/30 hover:border-white/50 text-sm h-9"
                  >
                    <Link to="/partner-application">
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary Table */}
          <div className="mt-16 p-6 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-cyan-500/20 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">
              VERTICAL PRICING SUMMARY
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Vertical</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Starting At</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Onboarding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr><td className="py-2 px-4 text-foreground">Nightlife & Entertainment</td><td className="py-2 px-4 text-cyan-400 font-semibold">$99/month</td><td className="py-2 px-4 text-muted-foreground">from $250</td></tr>
                  <tr><td className="py-2 px-4 text-foreground">Transportation & Logistics</td><td className="py-2 px-4 text-cyan-400 font-semibold">$99/month</td><td className="py-2 px-4 text-muted-foreground">from $250</td></tr>
                  <tr><td className="py-2 px-4 text-foreground">Workforce & Staffing</td><td className="py-2 px-4 text-cyan-400 font-semibold">$199/month</td><td className="py-2 px-4 text-muted-foreground">from $500</td></tr>
                  <tr><td className="py-2 px-4 text-foreground">Labs & Health</td><td className="py-2 px-4 text-cyan-400 font-semibold">$99/month</td><td className="py-2 px-4 text-muted-foreground">from $250</td></tr>
                  <tr><td className="py-2 px-4 text-foreground">Rentals & Exotics</td><td className="py-2 px-4 text-cyan-400 font-semibold">$199/month</td><td className="py-2 px-4 text-muted-foreground">from $500</td></tr>
                  <tr><td className="py-2 px-4 text-foreground">Security & Training</td><td className="py-2 px-4 text-cyan-400 font-semibold">$199/month</td><td className="py-2 px-4 text-muted-foreground">from $500</td></tr>
                  <tr><td className="py-2 px-4 text-foreground">Events & Festivals</td><td className="py-2 px-4 text-cyan-400 font-semibold">$499/event</td><td className="py-2 px-4 text-muted-foreground">from $2,500</td></tr>
                  <tr><td className="py-2 px-4 text-foreground">Hospitality</td><td className="py-2 px-4 text-cyan-400 font-semibold">$199/month</td><td className="py-2 px-4 text-muted-foreground">from $500</td></tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
              <div className="p-3 rounded-lg bg-white/5">
                <Check className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-muted-foreground">GHOST™ Pass Revenue (30%)</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <Check className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-muted-foreground">Community Pool</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <Check className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-muted-foreground">Real-time Dashboard</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <Check className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-muted-foreground">Dedicated Support</span>
              </div>
            </div>
          </div>
          
          {/* Stadium Tier CTA Section */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
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
              <p className="text-muted-foreground mb-4 text-sm">
                For NFL stadiums, arenas, and major festivals. Custom SLA, unlimited scanners, API access, 24/7 support.
              </p>
              <p className="text-xs text-muted-foreground mb-4">Onboarding from $10,000</p>
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