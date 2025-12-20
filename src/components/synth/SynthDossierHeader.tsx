import React, { useState } from 'react';
import { Share2, Download, MoreHorizontal, Trash2, FileDown, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SynthDossierHeaderProps {
  codename: string;
  tier: string;
  synthIndex: number;
  percentile: number;
  integrityScore: number;
  windowDays: 7 | 30 | 60 | 90;
  policyVersion: string;
  isAnonymous?: boolean;
  onToggleVisibility?: () => void;
  onShareBadge?: () => void;
  onExportDossier?: () => void;
  onDeleteData?: () => void;
  onExportData?: () => void;
}

const SynthDossierHeader: React.FC<SynthDossierHeaderProps> = ({
  codename,
  tier,
  synthIndex,
  percentile,
  integrityScore,
  windowDays,
  policyVersion,
  isAnonymous = true,
  onToggleVisibility,
  onShareBadge,
  onExportDossier,
  onDeleteData,
  onExportData,
}) => {
  const [anonymous, setAnonymous] = useState(isAnonymous);

  const handleToggleVisibility = () => {
    setAnonymous(!anonymous);
    onToggleVisibility?.();
  };

  const getTierColor = (t: string) => {
    const colors: Record<string, string> = {
      'INITIATE': 'text-cyan-400',
      'OPERATOR': 'text-blue-400',
      'ARCHITECT': 'text-purple-400',
      'ORACLE': 'text-amber-400',
      'APEX': 'text-emerald-400',
      'PRIME': 'text-rose-400',
      'SPECIALIST': 'text-indigo-400',
    };
    return colors[t.toUpperCase()] || 'text-cyan-400';
  };

  return (
    <div 
      className="w-full synth-card rounded-2xl p-6 border border-cyan-500/20 mb-6"
      style={{
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 40px rgba(0, 212, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
      }}
    >
      {/* Desktop layout */}
      <div className="hidden md:flex items-start justify-between gap-6">
        {/* Left: Title stack */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">SYNTH DOSSIER™</p>
          <h1 
            className={`text-3xl font-mono font-bold mb-4 ${getTierColor(tier)}`}
            style={{ 
              fontFamily: "'JetBrains Mono', monospace",
              textShadow: `0 0 10px currentColor`
            }}
          >
            {codename}
          </h1>
          
          {/* Chips row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              WINDOW: {windowDays}D
            </span>
            <button
              onClick={handleToggleVisibility}
              className="px-3 py-1 rounded-full text-xs font-medium bg-muted/20 border border-muted/30 text-muted-foreground hover:bg-muted/30 transition flex items-center gap-1.5"
            >
              {anonymous ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              VISIBILITY: {anonymous ? 'ANONYMOUS' : 'PUBLIC'}
            </button>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-muted/10 border border-muted/20 text-muted-foreground">
              POLICY: {policyVersion}
            </span>
          </div>
        </div>

        {/* Right: Metrics stack */}
        <div className="flex items-center gap-3">
          {/* Tier card */}
          <div className="px-4 py-3 rounded-xl bg-muted/10 border border-muted/20 text-center min-w-[90px]">
            <p className="text-xs text-muted-foreground mb-1">TIER</p>
            <p className={`text-lg font-bold ${getTierColor(tier)}`}>{tier}</p>
          </div>

          {/* SYNTH Index card */}
          <div className="px-4 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center min-w-[100px]">
            <p className="text-xs text-cyan-400/70 mb-1">SYNTH INDEX</p>
            <p 
              className="text-2xl font-bold font-mono text-cyan-400"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {synthIndex.toFixed(1)}
            </p>
          </div>

          {/* Percentile card */}
          <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center min-w-[80px]">
            <p className="text-xs text-emerald-400/70 mb-1">RANK</p>
            <p className="text-lg font-bold text-emerald-400">TOP {percentile}%</p>
          </div>

          {/* Integrity card */}
          <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center min-w-[90px]">
            <p className="text-xs text-amber-400/70 mb-1">INTEGRITY</p>
            <p className="text-lg font-bold text-amber-400">{integrityScore}/100</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShareBadge}
            className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
          >
            <Share2 className="w-4 h-4 mr-1.5" />
            SHARE BADGE
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportDossier}
            className="border-muted/40 text-muted-foreground hover:bg-muted/10 bg-transparent"
          >
            <Download className="w-4 h-4 mr-1.5" />
            EXPORT DOSSIER
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-muted/40 text-muted-foreground hover:bg-muted/10 bg-transparent w-9 h-9"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="synth-card border-cyan-500/20">
              <DropdownMenuItem onClick={onDeleteData} className="text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                DELETE MY DATA
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportData}>
                <FileDown className="w-4 h-4 mr-2" />
                EXPORT DATA
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden space-y-4">
        {/* Title */}
        <div>
          <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">SYNTH DOSSIER™</p>
          <h1 
            className={`text-2xl font-mono font-bold ${getTierColor(tier)}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {codename}
          </h1>
        </div>

        {/* Chips - horizontal scroll */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 whitespace-nowrap flex-shrink-0">
            {windowDays}D
          </span>
          <button
            onClick={handleToggleVisibility}
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted/20 border border-muted/30 text-muted-foreground flex items-center gap-1 whitespace-nowrap flex-shrink-0"
          >
            {anonymous ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {anonymous ? 'ANON' : 'PUBLIC'}
          </button>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-muted/10 border border-muted/20 text-muted-foreground whitespace-nowrap flex-shrink-0">
            {policyVersion}
          </span>
        </div>

        {/* Metrics - horizontal scroll */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <div className="px-3 py-2 rounded-lg bg-muted/10 border border-muted/20 text-center flex-shrink-0">
            <p className="text-[10px] text-muted-foreground">TIER</p>
            <p className={`text-sm font-bold ${getTierColor(tier)}`}>{tier}</p>
          </div>
          <div className="px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-center flex-shrink-0">
            <p className="text-[10px] text-cyan-400/70">INDEX</p>
            <p className="text-lg font-bold font-mono text-cyan-400">{synthIndex.toFixed(1)}</p>
          </div>
          <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center flex-shrink-0">
            <p className="text-[10px] text-emerald-400/70">RANK</p>
            <p className="text-sm font-bold text-emerald-400">TOP {percentile}%</p>
          </div>
          <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center flex-shrink-0">
            <p className="text-[10px] text-amber-400/70">INTEGRITY</p>
            <p className="text-sm font-bold text-amber-400">{integrityScore}/100</p>
          </div>
        </div>

        {/* Actions menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
            >
              ACTIONS
              <MoreHorizontal className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="synth-card border-cyan-500/20 w-56">
            <DropdownMenuItem onClick={onShareBadge}>
              <Share2 className="w-4 h-4 mr-2" />
              SHARE BADGE
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportDossier}>
              <Download className="w-4 h-4 mr-2" />
              EXPORT DOSSIER
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportData}>
              <FileDown className="w-4 h-4 mr-2" />
              EXPORT DATA
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDeleteData} className="text-destructive focus:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              DELETE MY DATA
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Divider + note */}
      <div className="mt-6 pt-4 border-t border-cyan-500/10">
        <p className="text-xs text-muted-foreground text-center">
          Generated by a proprietary multi-judge frontier evaluation system. Auditable artifacts; not guarantees. — <span className="text-cyan-400/70">SYNTH Board</span>
        </p>
      </div>
    </div>
  );
};

export default SynthDossierHeader;
