import { ArrowRight, MessageSquare, Users, Scale, CheckCircle, FileCheck, Database, Shield, QrCode } from "lucide-react";

interface FlowDiagramProps {
  variant: "senate" | "conduit";
}

const FlowDiagram = ({ variant }: FlowDiagramProps) => {
  if (variant === "senate") {
    const steps = [
      { icon: MessageSquare, label: "Input" },
      { icon: Users, label: "Governance Pipeline" },
      { icon: Scale, label: "Validation Checks" },
      { icon: CheckCircle, label: "Arbitration (as needed)" },
      { icon: FileCheck, label: "Output + Proof Record" },
    ];

    return (
      <div className="bg-card/50 border border-border rounded-lg p-4">
        <p className="text-xs text-muted-foreground font-medium mb-3 text-center">Multi-Stage Governance Flow (High-Level)</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-[10px] text-muted-foreground text-center max-w-16">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Conduit model diagram
  const steps = [
    { icon: Database, label: "Customer System of Record" },
    { icon: Shield, label: "Valid/SYNTH (govern + verify)" },
    { icon: CheckCircle, label: "Time-Limited Verification Token" },
    { icon: QrCode, label: "Optional Share (no records exposed)" },
  ];

  return (
    <div className="bg-card/50 border border-border rounded-lg p-4">
      <p className="text-xs text-muted-foreground font-medium mb-3 text-center">Conduit Model — Your Data Stays With You</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <step.icon className="h-5 w-5 text-cyan-400" />
              </div>
              <span className="text-[10px] text-muted-foreground text-center max-w-20">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowDiagram;
