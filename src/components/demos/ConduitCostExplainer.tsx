import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Database, 
  Trash2, 
  DollarSign, 
  ChevronDown, 
  Zap,
  Filter,
  CloudOff,
  ArrowRight,
  CheckCircle,
  Target,
  Gauge,
  Shield
} from "lucide-react";

interface ConduitCostExplainerProps {
  variant?: "card" | "inline" | "compact";
}

const ConduitCostExplainer = ({ variant = "card" }: ConduitCostExplainerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const keyBenefits = [
    {
      icon: Filter,
      title: "Intelligent Filtering",
      description: "SYNTH™ analyzes conversations for subject and anchor words, identifying the 25% that matters.",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
    },
    {
      icon: Trash2,
      title: "75%+ Data Flush",
      description: "Non-pertinent data is immediately purged after governance signals are extracted.",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
    {
      icon: DollarSign,
      title: "Massive Cost Reduction",
      description: "Clients save 75%+ on data storage costs while using their existing data warehouse.",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
    },
    {
      icon: Zap,
      title: "Reduced Latency",
      description: "Less data = faster queries. Latency drops proportionally with data reduction.",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
    },
  ];

  const flowSteps = [
    { label: "AI Agent Conversation", icon: Target },
    { label: "SYNTH™ Filter Layer", icon: Filter },
    { label: "Extract Subject/Anchors", icon: Shield },
    { label: "Flush 75%+ Non-Pertinent", icon: Trash2 },
    { label: "Store Only Essentials", icon: Database },
  ];

  if (variant === "compact") {
    return (
      <div className="p-3 rounded-lg border border-cyan-500/30 bg-cyan-500/5">
        <div className="flex items-center gap-2 mb-2">
          <CloudOff className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-cyan-400">Conduit Architecture</span>
          <Badge variant="outline" className="text-[10px] border-emerald-500/50 text-emerald-400">
            75%+ Savings
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          SYNTH™ filters AI conversations, extracting only subject/anchor words and flushing the rest. 
          Your data warehouse, our governance layer — 75%+ storage and latency reduction.
        </p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="flex items-start gap-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
        <CloudOff className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground mb-1">
            No Data Storage — Conduit Only
          </p>
          <p className="text-xs text-muted-foreground">
            VALID | SYNTH™ operates as a governance filter between your AI agents and data warehouse. 
            We cleanse conversations for subject and anchor words, flush 75%+ of non-pertinent data, 
            and emit governance signals. Your existing infrastructure, our intelligence layer — 
            cutting storage costs and latency dramatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-2 border-cyan-500/40 bg-gradient-to-br from-card via-card to-cyan-500/5">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-4 cursor-pointer hover:bg-muted/20 transition-colors rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40">
                  <CloudOff className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    How We Save You 75%+ on Data Storage
                    <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-400 font-bold">
                      COST SAVINGS
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-xs">
                    Tap to learn how SYNTH™ reduces storage costs and latency
                  </CardDescription>
                </div>
              </div>
              <ChevronDown className={`h-6 w-6 text-cyan-400 transition-transform duration-500 ease-out ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
          <CardContent className="space-y-6 pt-2">
            {/* Core Concept */}
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
              <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                The Conduit Model
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">VALID | SYNTH™</strong> is not a data warehouse — 
                it's an intelligent filter that sits between your AI agents and your existing storage infrastructure.
              </p>
              <div className="mt-3 p-3 rounded-md bg-black/20 border border-white/10">
                <p className="text-xs text-muted-foreground">
                  When a user converses with your AI, SYNTH™ monitors the exchange in real-time, 
                  identifying <strong className="text-cyan-400">subject words</strong> and{" "}
                  <strong className="text-cyan-400">anchor points</strong> — the 25% that actually matters. 
                  The remaining 75%+ of conversational noise is immediately flushed after governance 
                  signals are extracted.
                </p>
              </div>
            </div>

            {/* Flow Diagram */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-400" />
                Data Flow
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-2 p-4 rounded-lg bg-muted/30 border border-border">
                {flowSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`p-2 rounded-lg ${i === 3 ? 'bg-red-500/20 border-red-500/40' : 'bg-primary/10 border-primary/30'} border`}>
                        <step.icon className={`h-4 w-4 ${i === 3 ? 'text-red-400' : 'text-primary'}`} />
                      </div>
                      <span className="text-[9px] text-muted-foreground text-center max-w-16">{step.label}</span>
                    </div>
                    {i < flowSteps.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Key Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {keyBenefits.map((benefit, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-lg border ${benefit.borderColor} ${benefit.bgColor}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-md bg-black/20">
                        <benefit.icon className={`w-4 h-4 ${benefit.color}`} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold ${benefit.color}`}>{benefit.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Line */}
            <div className="p-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-400">The Bottom Line</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use your existing data warehouse. Use our governance filter. 
                    <strong className="text-foreground"> Cut your storage and latency by 75%+</strong> while 
                    gaining enterprise-grade AI governance with proof records and audit trails.
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-2 italic">
                    VALID | SYNTH™ — We check. We don't collect.
                  </p>
                </div>
              </div>
            </div>

            {/* Conduit Rule Reminder */}
            <div className="text-center pt-2 border-t border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                All elements operate as signal conduits — no local data storage
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ConduitCostExplainer;
