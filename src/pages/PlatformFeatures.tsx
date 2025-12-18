import { Helmet } from "react-helmet-async";
import { 
  PartyPopper, 
  Truck, 
  Users,
  FlaskConical, 
  Car,
  Shield,
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
    price: "$99–$799",
    priceLabel: "/month + $250–$3,000 onboarding",
    bgImage: nightlifeBg,
    gradientOverlay: "from-purple-900/90 via-purple-800/70 to-transparent",
    borderColor: "border-purple-500",
    accentColor: "text-purple-300",
    features: [
      "ID + GHOST™ Verification",
      "Health Status Badges",
      "Payment Processing",
      "30% GHOST™ Pass Revenue",
    ],
  },
  {
    id: "transportation",
    title: "Transportation™",
    icon: Truck,
    price: "$99–$299",
    priceLabel: "/month + $250–$1,000 onboarding",
    bgImage: transportationBg,
    gradientOverlay: "from-yellow-900/90 via-amber-800/70 to-transparent",
    borderColor: "border-yellow-500",
    accentColor: "text-yellow-300",
    features: [
      "Driver Verification",
      "Fleet Safety Compliance",
      "Cargo Manifest Audits",
      "Vehicle Access Control",
    ],
  },
  {
    id: "workforce",
    title: "Workforce & Staffing™",
    icon: Users,
    price: "$199–$499",
    priceLabel: "/month + $500–$1,500 onboarding",
    bgImage: workforceBg,
    gradientOverlay: "from-blue-900/90 via-blue-800/70 to-transparent",
    borderColor: "border-blue-500",
    accentColor: "text-blue-300",
    features: [
      "Employee Screening",
      "Background Verification",
      "Shift Management",
      "Zero-Trust Access",
    ],
  },
  {
    id: "labs",
    title: "Healthcare & Wellness™",
    icon: FlaskConical,
    price: "$99–$299",
    priceLabel: "/month + $250–$1,000 onboarding",
    bgImage: labsBg,
    gradientOverlay: "from-emerald-900/90 via-teal-800/70 to-transparent",
    borderColor: "border-emerald-500",
    accentColor: "text-emerald-300",
    features: [
      "Patient Verification",
      "Health Status Tracking",
      "Lab API Integration",
      "Certification Status",
    ],
  },
  {
    id: "rentals",
    title: "Hospitality & Rentals™",
    icon: Car,
    price: "$199–$599",
    priceLabel: "/month + $500–$2,000 onboarding",
    bgImage: rentalsBg,
    gradientOverlay: "from-gray-900/95 via-amber-950/60 to-transparent",
    borderColor: "border-amber-400",
    accentColor: "text-amber-300",
    isLuxury: true,
    features: [
      "Guest Verification",
      "Insurance Verify",
      "Amenity Access",
      "Concierge Integration",
    ],
  },
  {
    id: "security",
    title: "Events & Festivals™",
    icon: Shield,
    price: "$499–$2,500",
    priceLabel: "/event + $2,500–$10,000 onboarding",
    bgImage: securityBg,
    gradientOverlay: "from-red-900/90 via-red-800/70 to-transparent",
    borderColor: "border-red-500",
    accentColor: "text-red-300",
    features: [
      "Multi-Day Support",
      "Crowd Management",
      "VIP Verification",
      "Real-time Analytics",
    ],
  },
];

const PlatformFeatures = () => {
  return (
    <>
      <Helmet>
        <title>Vendor Pricing | Valid™ Ghost Pass™ Industry Packages</title>
        <meta name="description" content="Explore Valid™ industry pricing packages for nightlife, transportation, workforce, health, rentals, and security operations." />
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
                Ghost Pass™ Ecosystem
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Color-coded industry packages tailored for your vertical.
              <br className="hidden md:block" />
              <span className="text-cyan-400/80">Select the package that fits your operation.</span>
            </p>
          </div>
          
          {/* 3x2 Grid of Industry Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {industryCards.map((card) => (
              <div 
                key={card.id}
                className={`relative overflow-hidden rounded-2xl ${card.borderColor} border-2 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group min-h-[420px] flex flex-col`}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${card.bgImage})` }}
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${card.gradientOverlay}`} />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full p-6">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-black/40 backdrop-blur-sm border border-white/20">
                      <card.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">
                      {card.title}
                    </h3>
                  </div>
                  
                  {/* Price Section */}
                  <div className="mb-6">
                    <div className={`text-5xl md:text-6xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`}>
                      {card.price}
                    </div>
                    <p className={`text-sm font-medium ${card.accentColor} mt-1`}>
                      {card.priceLabel}
                    </p>
                  </div>
                  
                  {/* Features List */}
                  <div className="space-y-2.5 flex-grow">
                    {card.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-white/90 drop-shadow-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA Button */}
                  <Button 
                    asChild
                    className="w-full mt-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold border border-white/30 hover:border-white/50"
                  >
                    <Link to="/partner-application">
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom CTA Section */}
          <div className="mt-16 text-center">
            <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Need a Custom Package?
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
                Enterprise deployments and multi-vertical integrations available.
                Contact our team for custom pricing.
              </p>
              <Button asChild variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                <Link to="/partner-application">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PlatformFeatures;
