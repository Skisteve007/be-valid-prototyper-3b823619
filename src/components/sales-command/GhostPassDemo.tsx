import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, QrCode, User, Check, X, Clock, 
  Fingerprint, Eye, EyeOff, Trash2, ArrowRight, 
  Smartphone, Building2, Lock, Zap
} from "lucide-react";

interface FlowStep {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  status: "pending" | "active" | "complete";
  detail: string;
}

export function GhostPassDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const flowSteps: FlowStep[] = [
    {
      id: 1,
      icon: QrCode,
      title: "QR SCAN",
      description: "User presents Ghost Pass QR",
      status: currentStep >= 1 ? (currentStep === 1 ? "active" : "complete") : "pending",
      detail: "Encrypted ephemeral token scanned at venue entry point"
    },
    {
      id: 2,
      icon: Shield,
      title: "SYNTH VERIFICATION",
      description: "Senate validates identity",
      status: currentStep >= 2 ? (currentStep === 2 ? "active" : "complete") : "pending",
      detail: "Multi-model consensus verifies identity signals without storing PII"
    },
    {
      id: 3,
      icon: Check,
      title: "GHOST PASS GRANTED",
      description: "Temporary access issued",
      status: currentStep >= 3 ? (currentStep === 3 ? "active" : "complete") : "pending",
      detail: "Time-bound access token (30s–5m TTL) with venue-specific permissions"
    },
    {
      id: 4,
      icon: Trash2,
      title: "AUTO-REVOCATION",
      description: "Zero persistence guaranteed",
      status: currentStep >= 4 ? (currentStep === 4 ? "active" : "complete") : "pending",
      detail: "Token expires automatically. No PII stored. Audit record only."
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
            MODULE C: GHOST PASS DEMO
          </CardTitle>
          <p className="text-muted-foreground">
            For Events, Venues, and Identity verification. SYNTH isn't just for AI—it's for humans too.
            Show how we verify identity with zero data retention.
          </p>
        </CardHeader>
      </Card>

      {/* Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ValueCard
          icon={Lock}
          title="Stop Ticket Fraud"
          description="QR tokens are cryptographically bound to verified identity"
        />
        <ValueCard
          icon={EyeOff}
          title="Stop Data Leaks"
          description="We verify without storing. No PII honey pot."
        />
        <ValueCard
          icon={Trash2}
          title="Zero Persistence"
          description="Tokens auto-expire. Nothing to breach."
        />
      </div>

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
              {flowSteps.map((step, idx) => (
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
                    Identity verified. Access granted. Token will self-destruct in 5 minutes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Use Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UseCaseCard
          icon={Building2}
          title="Events & Venues"
          pitch="Stop ticket fraud at the door. Every scan is verified against a cryptographic identity—no more screenshot scams."
          stats={["20% fraud reduction", "Zero data liability", "Sub-second verification"]}
        />
        <UseCaseCard
          icon={Smartphone}
          title="Age-Restricted Access"
          pitch="Verify age without storing birthdates. Perfect for bars, cannabis dispensaries, and adult venues."
          stats={["COPPA compliant", "CCPA compliant", "No PII stored"]}
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
              <p className="text-lg text-foreground italic">
                "Ticket fraud is costing you 20%. Ghost Pass kills it with identity verification that deletes itself. 
                Stop Ticket Fraud. Stop Data Leaks. Zero Storage."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ValueCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
  return (
    <Card className="border-cyan-500/20 bg-black/40">
      <CardContent className="p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-cyan-500/10">
          <Icon className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface UseCaseCardProps {
  icon: React.ElementType;
  title: string;
  pitch: string;
  stats: string[];
}

function UseCaseCard({ icon: Icon, title, pitch, stats }: UseCaseCardProps) {
  return (
    <Card className="border-cyan-500/30 bg-black/40">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="h-6 w-6 text-cyan-400" />
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <p className="text-muted-foreground mb-4">{pitch}</p>
        <div className="flex flex-wrap gap-2">
          {stats.map((stat, i) => (
            <Badge key={i} variant="outline" className="border-green-500/50 text-green-400 font-mono text-xs">
              <Check className="h-3 w-3 mr-1" />
              {stat}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
