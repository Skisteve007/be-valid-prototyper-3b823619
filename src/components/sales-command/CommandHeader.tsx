import { Shield, Zap, FileText, Award } from "lucide-react";

export function CommandHeader() {
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
    </div>
  );
}

interface IdentityCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sublabel: string;
}

function IdentityCard({ icon: Icon, label, value, sublabel }: IdentityCardProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative p-4 rounded-lg border border-cyan-500/30 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-4 w-4 text-cyan-400" />
          <span className="text-[10px] font-mono text-cyan-400/60 tracking-wider">{label}</span>
        </div>
        <p className="text-lg font-bold text-white/90">{value}</p>
        <p className="text-xs text-cyan-400/50 font-mono mt-1">{sublabel}</p>
      </div>
    </div>
  );
}
