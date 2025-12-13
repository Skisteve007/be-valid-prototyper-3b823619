import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PartyPopper, 
  Shield, 
  Truck, 
  FlaskConical, 
  Car,
  Users,
  Clock,
  Lock,
  GraduationCap,
  IdCard,
  MapPin,
  FileCheck,
  Activity,
  FileText,
  Link2,
  Gem,
  ShieldCheck,
  AlertTriangle,
  Calendar
} from "lucide-react";
import Navbar from "@/components/Navbar";

const verticalCards = [
  {
    id: "nightlife",
    title: "Nightlife & Events™",
    icon: PartyPopper,
    gradient: "from-purple-600 via-pink-500 to-orange-400",
    bgColor: "bg-gradient-to-br from-purple-900/40 to-pink-900/30",
    borderColor: "border-purple-500/40",
    glowColor: "shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    features: [
      { icon: Users, text: "FBO Revenue Split" },
      { icon: PartyPopper, text: "Promoter Commissions" },
      { icon: Gem, text: "VIP Access Control" },
      { icon: ShieldCheck, text: "Age/Tox Compliance" },
    ],
    description: "Transform nightlife operations with instant verification, automated revenue sharing, and real-time compliance monitoring."
  },
  {
    id: "security",
    title: "Security & Workforce™",
    icon: Shield,
    gradient: "from-blue-600 via-cyan-500 to-teal-400",
    bgColor: "bg-gradient-to-br from-blue-900/40 to-cyan-900/30",
    borderColor: "border-cyan-500/40",
    glowColor: "shadow-[0_0_30px_rgba(6,182,212,0.3)]",
    features: [
      { icon: IdCard, text: "Staff ID Verification" },
      { icon: Clock, text: "Clock-in/out Audit" },
      { icon: Lock, text: "Zero-Trust Access Control (Z-TAC)" },
      { icon: GraduationCap, text: "Training/Certification Status" },
    ],
    description: "Enterprise-grade workforce management with continuous verification and immutable audit trails."
  },
  {
    id: "transportation",
    title: "Transportation & Logistics™",
    icon: Truck,
    gradient: "from-green-600 via-emerald-500 to-teal-400",
    bgColor: "bg-gradient-to-br from-green-900/40 to-emerald-900/30",
    borderColor: "border-emerald-500/40",
    glowColor: "shadow-[0_0_30px_rgba(16,185,129,0.3)]",
    features: [
      { icon: IdCard, text: "Verified Driver ID" },
      { icon: Car, text: "Vehicle Access Control" },
      { icon: FileCheck, text: "Cargo Manifest Audit" },
      { icon: MapPin, text: "Fleet Tracking Integration" },
    ],
    description: "Secure logistics operations with verified driver credentials and real-time fleet compliance tracking."
  },
  {
    id: "lab-health",
    title: "Lab & Health Vetting™",
    icon: FlaskConical,
    gradient: "from-red-600 via-rose-500 to-pink-400",
    bgColor: "bg-gradient-to-br from-red-900/40 to-rose-900/30",
    borderColor: "border-rose-500/40",
    glowColor: "shadow-[0_0_30px_rgba(244,63,94,0.3)]",
    features: [
      { icon: Activity, text: "Real-time Health/Tox Compliance" },
      { icon: Lock, text: "Decoupled PII (Pass/Fail Only)" },
      { icon: FileText, text: "Certification Status" },
      { icon: Link2, text: "API Integration with Labs" },
    ],
    description: "HIPAA-compliant health verification with zero PII exposure and seamless lab partner integration."
  },
  {
    id: "rentals",
    title: "Rentals & Exotic Goods™",
    icon: Car,
    gradient: "from-amber-600 via-yellow-500 to-orange-400",
    bgColor: "bg-gradient-to-br from-amber-900/40 to-yellow-900/30",
    borderColor: "border-amber-500/40",
    glowColor: "shadow-[0_0_30px_rgba(245,158,11,0.3)]",
    features: [
      { icon: Gem, text: "High-Value Asset Custody Verification" },
      { icon: ShieldCheck, text: "Insurance Compliance Check" },
      { icon: AlertTriangle, text: "Anti-Fraud Measures" },
      { icon: Calendar, text: "Rental Term Verification" },
    ],
    description: "Protect high-value assets with verified identity, insurance compliance, and fraud prevention protocols."
  },
];

const PlatformFeatures = () => {
  return (
    <>
      <Helmet>
        <title>Platform Features | Valid™ Ghost Pass™ Ecosystem</title>
        <meta name="description" content="Explore the full Ghost Pass™ ecosystem powering multi-vertical operations across nightlife, security, transportation, health, and rentals." />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 mb-6">
              Multi-Vertical Operating System
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
                Ghost Pass™ Ecosystem
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              One identity platform. Five vertical markets. Infinite possibilities.
              <br className="hidden md:block" />
              <span className="text-cyan-400/80">The Network Effect investors need to see.</span>
            </p>
          </div>
          
          {/* Vertical Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {verticalCards.map((vertical, index) => (
              <Card 
                key={vertical.id}
                className={`relative overflow-hidden ${vertical.bgColor} ${vertical.borderColor} border ${vertical.glowColor} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group`}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${vertical.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <CardHeader className="relative z-10 pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2.5 rounded-lg bg-gradient-to-br ${vertical.gradient} shadow-lg`}>
                      <vertical.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-bold text-foreground">
                      {vertical.title}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {vertical.description}
                  </p>
                </CardHeader>
                
                <CardContent className="relative z-10 pt-4">
                  <div className="space-y-3">
                    {vertical.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-background/30 backdrop-blur-sm border border-border/30 transition-colors hover:bg-background/50"
                      >
                        <feature.icon className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground/90">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                {/* Card number indicator */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/20 backdrop-blur-sm border border-border/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Bottom CTA Section */}
          <div className="mt-16 text-center">
            <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Valid™ is the Infrastructure Layer
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every vertical runs on the same Zero-Trust architecture. One platform. 
                Universal compliance. Infinite scalability.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PlatformFeatures;
