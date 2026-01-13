import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Zap, FileText, Award, Scale, ScrollText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ModalType = "synth" | "patent-enforcement" | "patent-orchestration" | null;

export function CommandHeader() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <div className="border-b border-cyan-500/20 bg-gradient-to-b from-cyan-500/5 to-transparent">
      <div className="container mx-auto px-4 py-12">
        {/* Title Block */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4">
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-mono text-xs tracking-wider">SYSTEM ONLINE</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300">
              SYNTH
            </span>
            <span className="text-white/90 ml-3">SALES COMMAND CENTER</span>
          </h1>
          
          <p className="text-lg text-cyan-400/80 font-mono max-w-3xl mx-auto">
            Enterprise AI Governance • $5K Pilots to $5M Licenses • The Single Source of Truth
          </p>
        </div>

        {/* Identity Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {/* Governance Standard - Navigates to page */}
          <IdentityCard
            icon={Shield}
            label="THE STANDARD"
            value="Grillo AI Governance"
            sublabel="The Constitution for AI"
            onClick={() => navigate('/governance-constitution')}
            variant="amber"
          />
          
          {/* SYNTH - Opens Senate explainer modal */}
          <IdentityCard
            icon={Zap}
            label="THE PRODUCT"
            value="SYNTH™"
            sublabel="Enforcement Engine"
            onClick={() => setActiveModal("synth")}
            variant="cyan"
          />
          
          {/* Patent: Enforcement - Opens patent modal */}
          <IdentityCard
            icon={FileText}
            label="PATENT: ENFORCEMENT"
            value="63/958,297"
            sublabel="Filed Jan 12, 2026"
            onClick={() => setActiveModal("patent-enforcement")}
            variant="blue"
          />
          
          {/* Patent: Orchestration - Opens patent modal */}
          <IdentityCard
            icon={Award}
            label="PATENT: ORCHESTRATION"
            value="63/948,868"
            sublabel="Filed Dec 26, 2025"
            onClick={() => setActiveModal("patent-orchestration")}
            variant="purple"
          />
        </div>

        {/* Principal */}
        <div className="text-center mt-8">
          <p className="text-cyan-400/60 font-mono text-sm">
            PRINCIPAL: <span className="text-cyan-400">STEVEN GRILLO</span> • Product Architect, AI
          </p>
        </div>
      </div>

      {/* SYNTH Senate Explainer Modal */}
      <Dialog open={activeModal === "synth"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-2xl bg-[#0a0a0f] border-cyan-500/40 text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-full bg-cyan-500/20 border border-cyan-500/50">
                <Zap className="h-6 w-6 text-cyan-400" />
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                SYNTH™ — The Enforcement Engine
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* What is SYNTH */}
            <div className="p-4 rounded-lg border border-cyan-500/30 bg-cyan-500/5">
              <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                <ScrollText className="h-4 w-4" />
                What is SYNTH™?
              </h3>
              <p className="text-foreground/80 text-sm leading-relaxed">
                SYNTH™ is a <span className="text-cyan-400 font-semibold">multi-model AI governance engine</span> that 
                operates like a judicial system. Instead of trusting a single AI, SYNTH™ convenes a 
                <span className="text-cyan-400 font-semibold"> Senate of 7 independent AI models</span> that 
                debate, vote, and reach consensus on every decision.
              </p>
            </div>

            {/* Judicial Architecture */}
            <div className="p-4 rounded-lg border border-cyan-500/30 bg-black/40">
              <h3 className="text-cyan-400 font-bold mb-3">The Judicial Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded bg-cyan-500/5 border border-cyan-500/20">
                  <p className="text-cyan-400 font-mono text-xs mb-1">THE SENATE</p>
                  <p className="text-foreground/70 text-xs">5 AI models debate truth, each casting weighted votes</p>
                </div>
                <div className="p-3 rounded bg-cyan-500/5 border border-cyan-500/20">
                  <p className="text-cyan-400 font-mono text-xs mb-1">EXECUTIVE SECRETARY</p>
                  <p className="text-foreground/70 text-xs">Reviews & organizes Senate consensus for clarity</p>
                </div>
                <div className="p-3 rounded bg-cyan-500/5 border border-cyan-500/20">
                  <p className="text-cyan-400 font-mono text-xs mb-1">THE JUDGE</p>
                  <p className="text-foreground/70 text-xs">Synthesizes final verdict with cryptographic proof</p>
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-mono">
                IMMUTABLE AUDIT TRAIL
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-mono">
                WEIGHTED VOTING
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 text-xs font-mono">
                FAULT TOLERANCE
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-mono">
                CRYPTOGRAPHIC PROOF
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Patent: Enforcement Modal */}
      <Dialog open={activeModal === "patent-enforcement"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-xl bg-[#0a0a0f] border-blue-500/40 text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-full bg-blue-500/20 border border-blue-500/50">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Patent: Enforcement Engine
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-blue-400 font-mono text-lg font-bold">63/958,297</span>
                <span className="text-blue-400/60 text-xs font-mono">U.S. PROVISIONAL</span>
              </div>
              <p className="text-foreground/60 text-xs font-mono mb-2">Filed: January 12, 2026</p>
            </div>

            <div className="p-4 rounded-lg border border-blue-500/20 bg-black/40">
              <h4 className="text-blue-400 font-bold text-sm mb-2">What It Protects</h4>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Multi-model consensus voting mechanisms
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Weighted ballot aggregation algorithms
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Hash-chain audit trail implementation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Session lock & anomaly detection
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Patent: Orchestration Modal */}
      <Dialog open={activeModal === "patent-orchestration"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-xl bg-[#0a0a0f] border-purple-500/40 text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-full bg-purple-500/20 border border-purple-500/50">
                <Award className="h-6 w-6 text-purple-400" />
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Patent: Orchestration System
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="p-4 rounded-lg border border-purple-500/30 bg-purple-500/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-purple-400 font-mono text-lg font-bold">63/948,868</span>
                <span className="text-purple-400/60 text-xs font-mono">U.S. PROVISIONAL</span>
              </div>
              <p className="text-foreground/60 text-xs font-mono mb-2">Filed: December 26, 2025</p>
            </div>

            <div className="p-4 rounded-lg border border-purple-500/20 bg-black/40">
              <h4 className="text-purple-400 font-bold text-sm mb-2">What It Protects</h4>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Parallel seat invocation architecture
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Offline/timeout/error fault tolerance
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Employer calibration weight systems
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Probation mode & learning rate tracking
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface IdentityCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sublabel: string;
  onClick: () => void;
  variant: "amber" | "cyan" | "blue" | "purple";
}

const variantStyles = {
  amber: {
    glow: "from-amber-500/30 to-orange-500/30",
    border: "border-amber-500/50 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    bg: "from-amber-500/10 to-orange-500/10",
    icon: "text-amber-400",
    label: "text-amber-400/80",
    value: "text-amber-200",
    sublabel: "text-amber-400/60",
  },
  cyan: {
    glow: "from-cyan-500/30 to-blue-500/30",
    border: "border-cyan-500/50 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]",
    bg: "from-cyan-500/10 to-blue-500/10",
    icon: "text-cyan-400",
    label: "text-cyan-400/80",
    value: "text-cyan-200",
    sublabel: "text-cyan-400/60",
  },
  blue: {
    glow: "from-blue-500/30 to-cyan-500/30",
    border: "border-blue-500/50 group-hover:border-blue-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    bg: "from-blue-500/10 to-cyan-500/10",
    icon: "text-blue-400",
    label: "text-blue-400/80",
    value: "text-blue-200",
    sublabel: "text-blue-400/60",
  },
  purple: {
    glow: "from-purple-500/30 to-pink-500/30",
    border: "border-purple-500/50 group-hover:border-purple-400 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    bg: "from-purple-500/10 to-pink-500/10",
    icon: "text-purple-400",
    label: "text-purple-400/80",
    value: "text-purple-200",
    sublabel: "text-purple-400/60",
  },
};

function IdentityCard({ icon: Icon, label, value, sublabel, onClick, variant }: IdentityCardProps) {
  const styles = variantStyles[variant];
  
  return (
    <button 
      className="relative group w-full text-left cursor-pointer"
      onClick={onClick}
    >
      {/* Enhanced glow */}
      <div className={`absolute inset-0 rounded-lg blur-xl transition-opacity bg-gradient-to-r ${styles.glow} opacity-50 group-hover:opacity-100`} />
      
      <div className={`relative p-4 rounded-lg border backdrop-blur-sm transition-all bg-gradient-to-br ${styles.bg} ${styles.border}`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`h-4 w-4 ${styles.icon}`} />
          <span className={`text-[10px] font-mono tracking-wider ${styles.label}`}>
            {label}
          </span>
          <span className={`ml-auto text-[8px] font-mono ${styles.label} animate-pulse`}>
            CLICK
          </span>
        </div>
        <p className={`text-lg font-bold ${styles.value}`}>{value}</p>
        <p className={`text-xs font-mono mt-1 ${styles.sublabel}`}>{sublabel}</p>
      </div>
    </button>
  );
}
