import { useState } from "react";
import { Shield, Zap, FileText, Award, Scale, ScrollText, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CommandHeader() {
  const [showGovernanceModal, setShowGovernanceModal] = useState(false);
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
          <IdentityCard
            icon={Shield}
            label="THE STANDARD"
            value="Grillo AI Governance"
            sublabel="The Constitution for AI"
            onClick={() => setShowGovernanceModal(true)}
            isClickable
          />
          <IdentityCard
            icon={Zap}
            label="THE PRODUCT"
            value="SYNTH™"
            sublabel="Enforcement Engine"
          />
          <IdentityCard
            icon={FileText}
            label="PATENT: ENFORCEMENT"
            value="63/958,297"
            sublabel="Filed Jan 12, 2026"
          />
          <IdentityCard
            icon={Award}
            label="PATENT: ORCHESTRATION"
            value="63/948,868"
            sublabel="Filed Dec 26, 2025"
          />
        </div>

        {/* Principal */}
        <div className="text-center mt-8">
          <p className="text-cyan-400/60 font-mono text-sm">
            PRINCIPAL: <span className="text-cyan-400">STEVEN GRILLO</span> • Product Architect, AI
          </p>
        </div>
      </div>

      {/* Governance Explainer Modal */}
      <Dialog open={showGovernanceModal} onOpenChange={setShowGovernanceModal}>
        <DialogContent className="max-w-2xl bg-[#0a0a0f] border-amber-500/40 text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-full bg-amber-500/20 border border-amber-500/50">
                <Scale className="h-6 w-6 text-amber-400" />
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                The Grillo AI Governance Standard
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
            <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
              <h3 className="text-amber-400 font-bold mb-3">The Judicial Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded bg-black/40 border border-amber-500/20">
                  <p className="text-amber-400 font-mono text-xs mb-1">THE SENATE</p>
                  <p className="text-foreground/70 text-xs">5 AI models debate truth, each casting weighted votes</p>
                </div>
                <div className="p-3 rounded bg-black/40 border border-amber-500/20">
                  <p className="text-amber-400 font-mono text-xs mb-1">EXECUTIVE SECRETARY</p>
                  <p className="text-foreground/70 text-xs">Reviews & organizes Senate consensus for clarity</p>
                </div>
                <div className="p-3 rounded bg-black/40 border border-amber-500/20">
                  <p className="text-amber-400 font-mono text-xs mb-1">THE JUDGE</p>
                  <p className="text-foreground/70 text-xs">Synthesizes final verdict with cryptographic proof</p>
                </div>
              </div>
            </div>

            {/* Patents */}
            <div className="p-4 rounded-lg border border-cyan-500/30 bg-black/40">
              <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Patent Protection
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-cyan-400 font-mono text-sm">63/958,297</p>
                  <p className="text-foreground/60 text-xs">ENFORCEMENT ENGINE</p>
                  <p className="text-foreground/40 text-xs">Filed Jan 12, 2026</p>
                </div>
                <div>
                  <p className="text-cyan-400 font-mono text-sm">63/948,868</p>
                  <p className="text-foreground/60 text-xs">ORCHESTRATION SYSTEM</p>
                  <p className="text-foreground/40 text-xs">Filed Dec 26, 2025</p>
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
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-mono">
                CRYPTOGRAPHIC PROOF
              </span>
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
  onClick?: () => void;
  isClickable?: boolean;
}

function IdentityCard({ icon: Icon, label, value, sublabel, onClick, isClickable }: IdentityCardProps) {
  const Wrapper = isClickable ? 'button' : 'div';
  
  return (
    <Wrapper 
      className={`relative group w-full text-left ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Enhanced glow for clickable */}
      <div className={`absolute inset-0 rounded-lg blur-xl transition-opacity ${
        isClickable 
          ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 opacity-50 group-hover:opacity-100' 
          : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100'
      }`} />
      
      <div className={`relative p-4 rounded-lg border backdrop-blur-sm transition-all ${
        isClickable 
          ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-orange-500/10 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
          : 'border-cyan-500/30 bg-black/40'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`h-4 w-4 ${isClickable ? 'text-amber-400' : 'text-cyan-400'}`} />
          <span className={`text-[10px] font-mono tracking-wider ${isClickable ? 'text-amber-400/80' : 'text-cyan-400/60'}`}>
            {label}
          </span>
          {isClickable && (
            <span className="ml-auto text-[8px] font-mono text-amber-400/60 animate-pulse">
              CLICK TO LEARN MORE
            </span>
          )}
        </div>
        <p className={`text-lg font-bold ${isClickable ? 'text-amber-200' : 'text-white/90'}`}>{value}</p>
        <p className={`text-xs font-mono mt-1 ${isClickable ? 'text-amber-400/60' : 'text-cyan-400/50'}`}>{sublabel}</p>
      </div>
    </Wrapper>
  );
}
