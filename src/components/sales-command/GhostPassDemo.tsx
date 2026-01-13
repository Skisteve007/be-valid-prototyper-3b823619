import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, QrCode, User, Check, X, Clock, 
  Fingerprint, Eye, EyeOff, Trash2, ArrowRight, 
  Smartphone, Building2, Lock, Zap, Wallet, HeartPulse,
  CreditCard, DollarSign, Users, Timer, AlertTriangle,
  TrendingUp, Banknote, ShieldOff, Receipt
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
  { id: "health", label: "Bio-Status", icon: HeartPulse, color: "green", description: "Health/lab verification signals" },
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
              description="Load it once, spend anywhere. No declined cards, no transaction anxiety."
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
              description="Never store customer PII. Can't breach what you don't have."
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
              title="Instant Settlement" 
              description="Get paid immediately. No waiting 3-5 days for merchant processing."
              color="amber"
            />
          </CardContent>
        </Card>
      </div>

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
            {PRINCIPAL_CARGO.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveToggles(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof prev] }))}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                  activeToggles[item.id as keyof typeof activeToggles]
                    ? `border-${item.color}-500 bg-${item.color}-500/20 shadow-[0_0_15px_rgba(0,0,0,0.3)]`
                    : 'border-muted bg-black/40 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-2 ${
                  activeToggles[item.id as keyof typeof activeToggles] ? `bg-${item.color}-500/30` : 'bg-muted/20'
                }`}>
                  <item.icon className={`h-6 w-6 ${
                    activeToggles[item.id as keyof typeof activeToggles] 
                      ? item.color === 'blue' ? 'text-blue-400' : item.color === 'amber' ? 'text-amber-400' : 'text-green-400'
                      : 'text-muted-foreground'
                  }`} />
                </div>
                <p className={`font-mono text-sm font-bold ${
                  activeToggles[item.id as keyof typeof activeToggles]
                    ? item.color === 'blue' ? 'text-blue-400' : item.color === 'amber' ? 'text-amber-400' : 'text-green-400'
                    : 'text-muted-foreground'
                }`}>
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                <Badge 
                  variant="outline" 
                  className={`mt-2 text-[10px] ${
                    activeToggles[item.id as keyof typeof activeToggles] ? 'border-green-500 text-green-400' : 'border-muted text-muted-foreground'
                  }`}
                >
                  {activeToggles[item.id as keyof typeof activeToggles] ? 'SHARING' : 'HIDDEN'}
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flow Diagram */}
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
        <CardContent>
          <div className="relative">
            {/* Connection Lines */}
            <div className="absolute top-[50px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-0.5 bg-cyan-500/20">
              <div 
                className="h-full bg-cyan-400 transition-all duration-500"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>

            {/* Steps */}
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

          {/* Active Step Detail */}
          {currentStep > 0 && (
            <div className="mt-8 p-4 rounded-lg border border-cyan-500/30 bg-cyan-500/5">
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
            <div className="mt-4 p-4 rounded-lg border-2 border-green-500 bg-green-500/10">
              <div className="flex items-center gap-3">
                <Check className="h-6 w-6 text-green-400" />
                <div>
                  <p className="font-semibold text-green-400">VERIFICATION COMPLETE</p>
                  <p className="text-sm text-muted-foreground">
                    Customer verified. Wallet active. Zero data stored. Token expires in 60 seconds.
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
          value="INSTANT"
          label="Settlement"
          description="No 3-5 day wait"
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
                You eliminate chargebacks, save 75% on processing fees, and get paid instantly. Plus, you never store a single 
                piece of customer data, so there's nothing to breach, nothing to lose, zero liability."
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
                  <Banknote className="h-3 w-3 mr-1" />
                  Instant Payouts
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
