import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PartyPopper, 
  Truck, 
  Users,
  FlaskConical, 
  Car,
  Shield,
  Check
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const industryCards = [
  {
    id: "nightlife",
    title: "Nightlife & Marketing™",
    icon: PartyPopper,
    price: "$999",
    priceLabel: "The 'Mega Scan' Venue Package",
    borderColor: "border-purple-500",
    headerBg: "bg-gradient-to-r from-purple-600 to-purple-500",
    glowColor: "shadow-[0_0_30px_rgba(168,85,247,0.4)]",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
    features: [
      "Venue Access Control",
      "Promoter Tracking",
      "FBO Split Setup",
      "Marketing Broadcasts",
    ],
  },
  {
    id: "transportation",
    title: "Transportation & Logistics™",
    icon: Truck,
    price: "$499",
    priceLabel: "Fleet Operations Package",
    borderColor: "border-yellow-500",
    headerBg: "bg-gradient-to-r from-yellow-500 to-amber-500",
    glowColor: "shadow-[0_0_30px_rgba(234,179,8,0.4)]",
    iconBg: "bg-yellow-500/20",
    iconColor: "text-yellow-400",
    features: [
      "Driver Verification",
      "Fleet Tracking",
      "Cargo Manifest Audits",
      "Vehicle Access Control",
    ],
  },
  {
    id: "workforce",
    title: "Workforce & Staffing™",
    icon: Users,
    price: "$299",
    priceLabel: "Enterprise HR Package",
    borderColor: "border-blue-500",
    headerBg: "bg-gradient-to-r from-blue-600 to-blue-500",
    glowColor: "shadow-[0_0_30px_rgba(59,130,246,0.4)]",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    features: [
      "Time & Attendance",
      "Employee ID Verification",
      "Zero-Trust Access",
      "Training Status Tracking",
    ],
  },
  {
    id: "labs",
    title: "Labs & Health™",
    icon: FlaskConical,
    price: "$199",
    priceLabel: "Health Compliance Package",
    borderColor: "border-emerald-500",
    headerBg: "bg-gradient-to-r from-emerald-600 to-teal-500",
    glowColor: "shadow-[0_0_30px_rgba(16,185,129,0.4)]",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    features: [
      "API Integration",
      "Toxicology Results",
      "Health Vetting",
      "Certification Status",
    ],
  },
  {
    id: "rentals",
    title: "Rentals & Exotics™",
    icon: Car,
    price: "$599",
    priceLabel: "Luxury Asset Package",
    borderColor: "border-amber-400",
    headerBg: "bg-gradient-to-r from-gray-900 via-amber-900 to-gray-900",
    glowColor: "shadow-[0_0_30px_rgba(251,191,36,0.3)]",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    isLuxury: true,
    features: [
      "Asset Protection",
      "Insurance Verify",
      "High-Value Client Vetting",
      "Anti-Fraud Measures",
    ],
  },
  {
    id: "security",
    title: "Security & Training™",
    icon: Shield,
    price: "$399",
    priceLabel: "Security Operations Package",
    borderColor: "border-red-500",
    headerBg: "bg-gradient-to-r from-red-600 to-red-500",
    glowColor: "shadow-[0_0_30px_rgba(239,68,68,0.4)]",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    features: [
      "Guard Verification",
      "License Checks",
      "Incident Reporting",
      "Certification Tracking",
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
      
      <Navbar />
      
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
              <Card 
                key={card.id}
                className={`relative overflow-hidden bg-card/80 backdrop-blur-sm ${card.borderColor} border-2 ${card.glowColor} transition-all duration-300 hover:scale-[1.02] group`}
              >
                {/* Header with color */}
                <div className={`${card.headerBg} px-6 py-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${card.iconBg} backdrop-blur-sm`}>
                        <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                      </div>
                      <CardTitle className={`text-lg font-bold ${card.isLuxury ? 'text-amber-300' : 'text-white'}`}>
                        {card.title}
                      </CardTitle>
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-2 pt-6">
                  {/* Price */}
                  <div className="text-center">
                    <div className={`text-4xl md:text-5xl font-black ${card.iconColor}`}>
                      {card.price}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {card.priceLabel}
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4 pb-6">
                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    {card.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full ${card.iconBg} flex items-center justify-center`}>
                          <Check className={`h-3 w-3 ${card.iconColor}`} />
                        </div>
                        <span className="text-sm text-foreground/90">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA Button */}
                  <Button 
                    asChild
                    className={`w-full ${card.headerBg} hover:opacity-90 ${card.isLuxury ? 'text-amber-100' : 'text-white'} font-bold`}
                  >
                    <Link to="/partner-application">
                      Get Started
                    </Link>
                  </Button>
                </CardContent>
              </Card>
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
