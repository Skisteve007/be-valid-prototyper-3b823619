import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, QrCode, User, Check, X, Clock, 
  Fingerprint, Eye, EyeOff, Trash2, ArrowRight, 
  Smartphone, Building2, Lock, Zap, Wallet, HeartPulse,
  CreditCard, DollarSign, Users, Timer, AlertTriangle,
  TrendingUp, Banknote, ShieldOff, Receipt, PieChart,
  UserCheck, Scale, Search, FileSearch, ArrowDown,
  MonitorCheck, Store, Database, Landmark, ArrowDownRight,
  CircleDollarSign, ArrowRightLeft, Settings
} from "lucide-react";

interface FlowStep {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  status: "pending" | "active" | "complete";
  detail: string;
}

// Principal Cargo items that users can choose to share
const PRINCIPAL_CARGO = [
  { id: "identity", label: "Identity", icon: Fingerprint, color: "blue", description: "Verified ID without exposing personal data" },
  { id: "wallet", label: "Pre-Funded Wallet", icon: Wallet, color: "amber", description: "No credit cards, no chargebacks" },
  { id: "health", label: "Bio-Status", icon: HeartPulse, color: "purple", description: "Health/lab verification signals" },
];

export function GhostPassDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeToggles, setActiveToggles] = useState({
    identity: true,
    wallet: true,
    health: false,
  });

  const flowSteps: FlowStep[] = [
    {
      id: 1,
      icon: QrCode,
      title: "CUSTOMER SCANS",
      description: "Ghost Pass presented at door",
      status: currentStep >= 1 ? (currentStep === 1 ? "active" : "complete") : "pending",
      detail: "Customer presents their Ghost Pass QR. They control what signals to share via Principal Cargo toggles."
    },
    {
      id: 2,
      icon: Shield,
      title: "INSTANT VERIFICATION",
      description: "SYNTH validates signals",
      status: currentStep >= 2 ? (currentStep === 2 ? "active" : "complete") : "pending",
      detail: "Multi-model Senate verifies identity + wallet balance + any health signals—without storing PII."
    },
    {
      id: 3,
      icon: Wallet,
      title: "PRE-FUNDED PAYMENT",
      description: "Wallet ready to spend",
      status: currentStep >= 3 ? (currentStep === 3 ? "active" : "complete") : "pending",
      detail: "Customer's pre-funded wallet is live. No credit cards needed. No chargebacks possible. Instant settlement."
    },
    {
      id: 4,
      icon: Trash2,
      title: "ZERO RETENTION",
      description: "Data self-destructs",
      status: currentStep >= 4 ? (currentStep === 4 ? "active" : "complete") : "pending",
      detail: "Session ends, token expires. Venue never housed any customer data. Zero liability, zero breach risk."
    },
  ];

  const runDemo = async () => {
    setIsRunning(true);
    setCurrentStep(0);

    for (let i = 1; i <= 4; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(i);
    }

    setIsRunning(false);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-cyan-500/30 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-cyan-400 font-mono">
            <Shield className="h-6 w-6" />
            MODULE C: GHOST PASS™ DEMO
          </CardTitle>
          <p className="text-muted-foreground">
            The Ghost Pass is a pre-funded, privacy-first wallet that benefits <strong className="text-cyan-400">both</strong> customers 
            and establishments. Show prospects how it eliminates chargebacks, speeds up entry, and removes liability.
          </p>
        </CardHeader>
      </Card>

      {/* Two-Column Value Props: Customer vs Business */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Benefits */}
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-400" />
              <CardTitle className="text-lg font-mono text-green-400">FOR THE CUSTOMER</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <BenefitItem 
              icon={Fingerprint} 
              title="No Wallet Fumbling" 
              description="No ID, no credit card needed at the door or bar. Just scan and go."
              color="green"
            />
            <BenefitItem 
              icon={Eye} 
              title="Privacy Control" 
              description="Customer chooses what to share via Principal Cargo toggles. Their data, their rules."
              color="green"
            />
            <BenefitItem 
              icon={Wallet} 
              title="Pre-Funded Wallet" 
              description="No blocked credit cards, no declined transactions. Full control over your spending."
              color="green"
            />
            <BenefitItem 
              icon={CreditCard} 
              title="Money Management" 
              description="Keep control of your money in one place. Load once, spend anywhere."
              color="green"
            />
            <BenefitItem 
              icon={Timer} 
              title="Faster Entry & Service" 
              description="Skip the bottlenecks. Verified and ready to spend in under 2 seconds."
              color="green"
            />
          </CardContent>
        </Card>

        {/* Business Benefits */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-400" />
              <CardTitle className="text-lg font-mono text-amber-400">FOR THE ESTABLISHMENT</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <BenefitItem 
              icon={ShieldOff} 
              title="Zero Data Liability" 
              description="Never store customer PII. Data stays at source. Can't breach what you don't have."
              color="amber"
            />
            <BenefitItem 
              icon={Receipt} 
              title="No Chargebacks" 
              description="Pre-funded wallet = no disputes, no reversals, no fraud headaches."
              color="amber"
            />
            <BenefitItem 
              icon={DollarSign} 
              title="75% Lower Fees" 
              description="Bypass credit card processing fees. Save 75% on every transaction."
              color="amber"
            />
            <BenefitItem 
              icon={Banknote} 
              title="Fast Settlement" 
              description="Get paid within a few hours of requesting. No waiting 3-5 days for processing."
              color="amber"
            />
            <BenefitItem 
              icon={Timer} 
              title="Eliminate Bottlenecks" 
              description="Faster door entry, faster bar service. No fumbling for IDs or cards."
              color="amber"
            />
            <BenefitItem 
              icon={UserCheck} 
              title="Promoter Tracking" 
              description="Track sales by promoter/staff. Configurable commission (default 10%) per Ghost Pass sold."
              color="amber"
            />
            <BenefitItem 
              icon={PieChart} 
              title="Vendor Pool Revenue" 
              description="30% of all Ghost Pass sales go into a shared pool. Your share is based on usage—more scans, more payout."
              color="amber"
            />
          </CardContent>
        </Card>
      </div>

      {/* Revenue Share Model */}
      <Card className="border-cyan-500/30 bg-cyan-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-lg font-mono text-cyan-400">GHOST PASS REVENUE SHARE</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Every Ghost Pass sold creates revenue for multiple parties. Establishments are incentivized to promote Ghost Pass adoption.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border-2 border-amber-500/50 bg-amber-500/10 text-center">
              <div className="text-3xl font-bold text-amber-400 font-mono">30%</div>
              <p className="text-sm font-semibold text-amber-300 mt-1">VENUE</p>
              <p className="text-xs text-muted-foreground">Direct to establishment</p>
            </div>
            <div className="p-4 rounded-xl border-2 border-cyan-500/50 bg-cyan-500/10 text-center">
              <div className="text-3xl font-bold text-cyan-400 font-mono">30%</div>
              <p className="text-sm font-semibold text-cyan-300 mt-1">VALID™</p>
              <p className="text-xs text-muted-foreground">Platform fee</p>
            </div>
            <div className="p-4 rounded-xl border-2 border-purple-500/50 bg-purple-500/10 text-center">
              <div className="text-3xl font-bold text-purple-400 font-mono">30%</div>
              <p className="text-sm font-semibold text-purple-300 mt-1">VENDOR POOL</p>
              <p className="text-xs text-muted-foreground">Split by usage (like Spotify)</p>
            </div>
            <div className="p-4 rounded-xl border-2 border-green-500/50 bg-green-500/10 text-center">
              <div className="text-3xl font-bold text-green-400 font-mono">10%</div>
              <p className="text-sm font-semibold text-green-300 mt-1">PROMOTER</p>
              <p className="text-xs text-muted-foreground">Vendor-configurable</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <p className="text-sm text-purple-300">
              <strong>Vendor Pool:</strong> All participating establishments share a 30% pool, distributed based on usage volume—
              just like Spotify royalties. Higher usage = bigger payout. This incentivizes venues to drive Ghost Pass adoption.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Two-Tier Identification */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-lg font-mono text-blue-400">TWO-TIER IDENTIFICATION</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Explain to prospects: We offer two levels of identity verification based on their security needs.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border-2 border-blue-500/30 bg-black/40">
              <div className="flex items-center gap-2 mb-3">
                <Fingerprint className="h-5 w-5 text-blue-400" />
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">TIER 1</Badge>
              </div>
              <h4 className="font-semibold text-blue-300 mb-2">Standard Verification</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Confirms person is who they claim to be
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Age verification (21+, 18+, etc.)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Real-time identity match
                </li>
              </ul>
            </div>
            <div className="p-4 rounded-xl border-2 border-red-500/30 bg-black/40">
              <div className="flex items-center gap-2 mb-3">
                <FileSearch className="h-5 w-5 text-red-400" />
                <Badge className="bg-red-500/20 text-red-400 border-red-500/50">TIER 2</Badge>
              </div>
              <h4 className="font-semibold text-red-300 mb-2">Deep Screening</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-red-400" />
                  Terrorist watch list check
                </li>
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-red-400" />
                  Most wanted list check
                </li>
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-red-400" />
                  Sexual predator registry check
                </li>
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-red-400" />
                  In-depth background screening
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Compliance Objection Handler */}
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <CardTitle className="text-lg font-mono text-yellow-400">HANDLING PRIVACY OBJECTIONS</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Prospects will ask about HIPAA, PII, and data capture. Here's how to address it:
          </p>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg border border-yellow-500/30 bg-black/40">
            <p className="text-foreground italic mb-4">
              "We're a <strong className="text-cyan-400">conduit</strong>, not a warehouse. We throw the signal, not store the data. 
              All verification happens in real-time at check-in. The data stays with its source—the IDV provider, the lab, the health system. 
              We only pass through a binary VERIFIED or NOT VERIFIED signal. If there's ever a dispute, the customer goes directly to their 
              source data provider, not to you. You never touch, store, or assume liability for any PII or health information."
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-green-500/50 text-green-400 font-mono text-xs">
                HIPAA Safe
              </Badge>
              <Badge variant="outline" className="border-green-500/50 text-green-400 font-mono text-xs">
                PII Never Stored
              </Badge>
              <Badge variant="outline" className="border-green-500/50 text-green-400 font-mono text-xs">
                Source-of-Truth Architecture
              </Badge>
              <Badge variant="outline" className="border-green-500/50 text-green-400 font-mono text-xs">
                Zero Liability Transfer
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Principal Cargo Section */}
      <Card className="border-purple-500/30 bg-purple-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-lg font-mono text-purple-400">PRINCIPAL CARGO (User-Controlled Signals)</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Customers choose exactly what to share. Each signal is a toggle—on or off. The venue only sees what the customer allows.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {PRINCIPAL_CARGO.map((item) => {
              const isActive = activeToggles[item.id as keyof typeof activeToggles];
              const getColorClasses = () => {
                if (!isActive) return { border: 'border-muted', bg: 'bg-black/40', text: 'text-muted-foreground', iconBg: 'bg-muted/20' };
                switch (item.color) {
                  case 'blue': return { border: 'border-blue-500', bg: 'bg-blue-500/20', text: 'text-blue-400', iconBg: 'bg-blue-500/30' };
                  case 'amber': return { border: 'border-amber-500', bg: 'bg-amber-500/20', text: 'text-amber-400', iconBg: 'bg-amber-500/30' };
                  case 'purple': return { border: 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)]', bg: 'bg-purple-500/25', text: 'text-purple-300', iconBg: 'bg-purple-500/40' };
                  default: return { border: 'border-muted', bg: 'bg-black/40', text: 'text-muted-foreground', iconBg: 'bg-muted/20' };
                }
              };
              const colors = getColorClasses();
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveToggles(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof prev] }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${colors.border} ${colors.bg} ${
                    isActive ? 'shadow-[0_0_15px_rgba(0,0,0,0.3)]' : 'opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-2 ${colors.iconBg}`}>
                    <item.icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <p className={`font-mono text-sm font-bold ${colors.text}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  <Badge 
                    variant="outline" 
                    className={`mt-2 text-[10px] ${
                      isActive ? 'border-green-500 text-green-400' : 'border-muted text-muted-foreground'
                    }`}
                  >
                    {isActive ? 'SHARING' : 'HIDDEN'}
                  </Badge>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Verification Flow Diagram */}
      <Card className="border-cyan-500/30 bg-black/40">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-mono text-foreground">VERIFICATION FLOW</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={runDemo}
              disabled={isRunning}
              className="bg-cyan-500 text-black hover:bg-cyan-400 font-mono"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isRunning ? "RUNNING..." : "RUN DEMO"}
            </Button>
            <Button
              onClick={resetDemo}
              variant="outline"
              className="border-cyan-500/50 text-cyan-400 font-mono"
            >
              RESET
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Flow Steps */}
          <div className="relative">
            <div className="absolute top-[50px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-0.5 bg-cyan-500/20">
              <div 
                className="h-full bg-cyan-400 transition-all duration-500"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-4 gap-4 relative z-10">
              {flowSteps.map((step) => (
                <div key={step.id} className="flex flex-col items-center text-center">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300
                    ${step.status === 'complete' ? 'bg-green-500/20 border-2 border-green-500' : ''}
                    ${step.status === 'active' ? 'bg-cyan-500/20 border-2 border-cyan-500 animate-pulse' : ''}
                    ${step.status === 'pending' ? 'bg-black/40 border-2 border-cyan-500/30' : ''}
                  `}>
                    <step.icon className={`h-5 w-5 ${
                      step.status === 'complete' ? 'text-green-400' :
                      step.status === 'active' ? 'text-cyan-400' : 'text-cyan-400/40'
                    }`} />
                  </div>
                  <p className={`font-mono text-xs mb-1 ${
                    step.status === 'pending' ? 'text-muted-foreground' : 'text-cyan-400'
                  }`}>
                    STEP {step.id}
                  </p>
                  <h4 className={`font-semibold text-sm mb-1 ${
                    step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2 Branch: Point of Entry Decision */}
          <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5">
            <div className="flex items-center gap-2 mb-3">
              <MonitorCheck className="h-5 w-5 text-blue-400" />
              <p className="font-mono text-sm text-blue-400">STEP 2 BRANCH: POINT OF ENTRY DECISION</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg border border-blue-500/20 bg-black/40 text-center">
                <Eye className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-blue-300">VIEW SIGNAL</p>
                <p className="text-[10px] text-muted-foreground">Door staff sees VERIFIED or DENIED</p>
              </div>
              <div className="p-3 rounded-lg border border-amber-500/20 bg-black/40 text-center">
                <Database className="h-5 w-5 text-amber-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-amber-300">ON-PREM STORAGE</p>
                <p className="text-[10px] text-muted-foreground">Optional: venue can store signal locally if needed</p>
              </div>
              <div className="p-3 rounded-lg border border-purple-500/20 bg-black/40 text-center">
                <MonitorCheck className="h-5 w-5 text-purple-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-purple-300">MANAGEMENT STATION</p>
                <p className="text-[10px] text-muted-foreground">Signal also sent to authoritative management</p>
              </div>
            </div>
          </div>

          {/* Step 3 Branch: Multiple Concession Points */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Store className="h-5 w-5 text-amber-400" />
              <p className="font-mono text-sm text-amber-400">STEP 3 EXPANSION: MULTIPLE CONCESSION POINTS</p>
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <div className="p-2 rounded-lg border border-amber-500/30 bg-black/40 text-center w-20">
                <Wallet className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                <p className="text-[9px] text-amber-300">BAR</p>
              </div>
              <ArrowDownRight className="h-4 w-4 text-amber-400/50 hidden md:block" />
              <div className="p-2 rounded-lg border border-amber-500/30 bg-black/40 text-center w-20">
                <Wallet className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                <p className="text-[9px] text-amber-300">VIP</p>
              </div>
              <ArrowDownRight className="h-4 w-4 text-amber-400/50 hidden md:block" />
              <div className="p-2 rounded-lg border border-amber-500/30 bg-black/40 text-center w-20">
                <Wallet className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                <p className="text-[9px] text-amber-300">FOOD</p>
              </div>
              <ArrowDownRight className="h-4 w-4 text-amber-400/50 hidden md:block" />
              <div className="p-2 rounded-lg border border-amber-500/30 bg-black/40 text-center w-20">
                <Wallet className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                <p className="text-[9px] text-amber-300">MERCH</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Customer uses pre-funded wallet at multiple concession points throughout the venue
            </p>
          </div>

          {/* Step 4 Branch: User-Controlled Destruction */}
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-5 w-5 text-red-400" />
              <p className="font-mono text-sm text-red-400">STEP 4 DETAIL: USER-CONTROLLED DATA DESTRUCTION</p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              The customer pre-selects their destruction preference. Three options available:
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2 rounded-lg border border-red-500/30 bg-black/40 text-center">
                <Timer className="h-4 w-4 text-red-400 mx-auto mb-1" />
                <p className="text-[10px] text-red-300 font-semibold">60 SECONDS</p>
                <p className="text-[9px] text-muted-foreground">Immediate after session</p>
              </div>
              <div className="p-2 rounded-lg border border-amber-500/30 bg-black/40 text-center">
                <Clock className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                <p className="text-[10px] text-amber-300 font-semibold">24 HOURS</p>
                <p className="text-[9px] text-muted-foreground">Next-day cleanup</p>
              </div>
              <div className="p-2 rounded-lg border border-purple-500/30 bg-black/40 text-center">
                <Trash2 className="h-4 w-4 text-purple-400 mx-auto mb-1" />
                <p className="text-[10px] text-purple-300 font-semibold">END OF EVENT</p>
                <p className="text-[9px] text-muted-foreground">When event closes</p>
              </div>
            </div>
          </div>

          {/* Step 5: Financial Capture to Payout */}
          <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Landmark className="h-5 w-5 text-green-400" />
              <p className="font-mono text-sm text-green-400">STEP 5: FINANCIAL CAPTURE → PAYOUT</p>
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <div className="p-3 rounded-lg border border-green-500/30 bg-black/40 text-center">
                <Wallet className="h-5 w-5 text-green-400 mx-auto mb-1" />
                <p className="text-[10px] text-green-300 font-semibold">PRE-FUNDED WALLET</p>
                <p className="text-[9px] text-muted-foreground">Customer's loaded funds</p>
              </div>
              <ArrowRight className="h-4 w-4 text-green-400" />
              <div className="p-3 rounded-lg border border-cyan-500/30 bg-black/40 text-center">
                <Landmark className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
                <p className="text-[10px] text-cyan-300 font-semibold">FBO BANK</p>
                <p className="text-[9px] text-muted-foreground">Like PayPal holding</p>
              </div>
              <ArrowRight className="h-4 w-4 text-green-400" />
              <div className="p-3 rounded-lg border border-amber-500/30 bg-black/40 text-center">
                <CircleDollarSign className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                <p className="text-[10px] text-amber-300 font-semibold">CAPTURES</p>
                <p className="text-[9px] text-muted-foreground">Each transaction logged</p>
              </div>
              <ArrowRight className="h-4 w-4 text-green-400" />
              <div className="p-3 rounded-lg border border-green-500/30 bg-black/40 text-center">
                <Banknote className="h-5 w-5 text-green-400 mx-auto mb-1" />
                <p className="text-[10px] text-green-300 font-semibold">VENDOR PAYOUT</p>
                <p className="text-[9px] text-muted-foreground">Within hours of request</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Funds flow from customer wallet → FBO bank → financial captures → vendor disbursement within hours of requesting
            </p>
          </div>

          {/* Active Step Detail */}
          {currentStep > 0 && (
            <div className="p-4 rounded-lg border border-cyan-500/30 bg-cyan-500/5">
              <div className="flex items-center gap-3">
                {(() => {
                  const ActiveIcon = flowSteps[currentStep - 1]?.icon || Shield;
                  return <ActiveIcon className="h-5 w-5 text-cyan-400" />;
                })()}
                <div>
                  <p className="font-mono text-cyan-400 text-sm">{flowSteps[currentStep - 1]?.title}</p>
                  <p className="text-foreground">{flowSteps[currentStep - 1]?.detail}</p>
                </div>
              </div>
            </div>
          )}

          {/* Completion State */}
          {currentStep === 4 && !isRunning && (
            <div className="p-4 rounded-lg border-2 border-green-500 bg-green-500/10">
              <div className="flex items-center gap-3">
                <Check className="h-6 w-6 text-green-400" />
                <div>
                  <p className="font-semibold text-green-400">VERIFICATION COMPLETE</p>
                  <p className="text-sm text-muted-foreground">
                    Customer verified. Wallet active. Zero data stored. Token expires per user preference.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ROI Stats for Business */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          value="75%"
          label="Lower Processing Fees"
          description="vs. credit card fees"
          color="green"
        />
        <StatCard
          value="0"
          label="Chargebacks"
          description="Pre-funded = no disputes"
          color="cyan"
        />
        <StatCard
          value="<2s"
          label="Verification Time"
          description="No bottlenecks"
          color="purple"
        />
        <StatCard
          value="30%"
          label="Direct Revenue"
          description="Per Ghost Pass sold"
          color="amber"
        />
      </div>

      {/* Sales Pitch */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-amber-500/20">
              <Zap className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="font-bold text-amber-400 mb-2 font-mono">THE PITCH</p>
              <p className="text-lg text-foreground italic mb-4">
                "Your customers load their Ghost Pass wallet once and never reach for their pocket again—no ID, no credit card. 
                You eliminate chargebacks, save 75% on processing fees, and get paid within a few hours of requesting. Plus, you never store a single 
                piece of customer data, so there's nothing to breach, nothing to lose, zero liability. And for every Ghost Pass you sell, 
                you keep 30% directly, plus you're entered into a usage-based pool that pays out like Spotify royalties."
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-green-500/50 text-green-400 font-mono text-xs">
                  <DollarSign className="h-3 w-3 mr-1" />
                  75% Fee Savings
                </Badge>
                <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 font-mono text-xs">
                  <Receipt className="h-3 w-3 mr-1" />
                  Zero Chargebacks
                </Badge>
                <Badge variant="outline" className="border-purple-500/50 text-purple-400 font-mono text-xs">
                  <ShieldOff className="h-3 w-3 mr-1" />
                  Zero Liability
                </Badge>
                <Badge variant="outline" className="border-amber-500/50 text-amber-400 font-mono text-xs">
                  <PieChart className="h-3 w-3 mr-1" />
                  30% + Pool Revenue
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface BenefitItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: "green" | "amber" | "cyan" | "purple";
}

function BenefitItem({ icon: Icon, title, description, color }: BenefitItemProps) {
  const colorClasses = {
    green: "text-green-400",
    amber: "text-amber-400",
    cyan: "text-cyan-400",
    purple: "text-purple-400",
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`p-1.5 rounded-lg bg-black/40 ${colorClasses[color]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h4 className={`font-semibold text-sm ${colorClasses[color]}`}>{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

interface StatCardProps {
  value: string;
  label: string;
  description: string;
  color: "green" | "amber" | "cyan" | "purple";
}

function StatCard({ value, label, description, color }: StatCardProps) {
  const colorClasses = {
    green: "border-green-500/30 text-green-400",
    amber: "border-amber-500/30 text-amber-400",
    cyan: "border-cyan-500/30 text-cyan-400",
    purple: "border-purple-500/30 text-purple-400",
  };

  return (
    <Card className={`${colorClasses[color]} bg-black/40`}>
      <CardContent className="p-4 text-center">
        <p className={`text-2xl font-bold font-mono ${colorClasses[color].split(' ')[1]}`}>{value}</p>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
