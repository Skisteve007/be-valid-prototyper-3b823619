import React from 'react';
import { X, Scale, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Sparkles, FileText, GraduationCap, Stethoscope, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RatifyCorrection } from '@/hooks/useRatify';

interface RatifyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  corrections: RatifyCorrection[];
  pendingCorrections: RatifyCorrection[];
  activeCorrection: RatifyCorrection | null;
  onSelectCorrection: (correction: RatifyCorrection) => void;
  onRatify: (id: string) => void;
  onRatifyAll: () => void;
  onDismiss: (id: string) => void;
}

const RatifyPanel: React.FC<RatifyPanelProps> = ({
  isOpen,
  onClose,
  corrections,
  pendingCorrections,
  activeCorrection,
  onSelectCorrection,
  onRatify,
  onRatifyAll,
  onDismiss,
}) => {
  if (!isOpen) return null;

  const currentIndex = activeCorrection 
    ? pendingCorrections.findIndex(c => c.id === activeCorrection.id) 
    : -1;

  const goToPrevious = () => {
    if (currentIndex > 0) {
      onSelectCorrection(pendingCorrections[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < pendingCorrections.length - 1) {
      onSelectCorrection(pendingCorrections[currentIndex + 1]);
    }
  };

  const getCategoryIcon = (category: RatifyCorrection['category']) => {
    switch (category) {
      case 'hallucination': return <AlertTriangle className="w-4 h-4" />;
      case 'factual_error': return <FileText className="w-4 h-4" />;
      case 'citation_needed': return <GraduationCap className="w-4 h-4" />;
      default: return <Scale className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: RatifyCorrection['category']) => {
    switch (category) {
      case 'hallucination': return 'AI Hallucination';
      case 'factual_error': return 'Factual Error';
      case 'logical_inconsistency': return 'Logic Issue';
      case 'citation_needed': return 'Citation Needed';
      case 'outdated_info': return 'Outdated Info';
      default: return 'Issue';
    }
  };

  const getSeverityColor = (severity: RatifyCorrection['severity']) => {
    switch (severity) {
      case 'error': return 'text-red-400 bg-red-500/20 border-red-500/40';
      case 'warning': return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
      case 'info': return 'text-blue-400 bg-blue-500/20 border-blue-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-background via-background to-background border-2 border-emerald-500/40 rounded-2xl shadow-[0_0_60px_rgba(16,185,129,0.3)]">
        
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 animate-pulse pointer-events-none" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40">
              <Scale className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Ratify™
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-muted-foreground">
                {pendingCorrections.length} correction{pendingCorrections.length !== 1 ? 's' : ''} awaiting your approval
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-destructive/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Persona badges */}
        <div className="relative flex items-center gap-2 px-4 py-2 border-b border-border/30 overflow-x-auto">
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">Trusted by:</span>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/30">
            <GraduationCap className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] text-blue-400 font-medium">Students</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <Stethoscope className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-medium">Doctors</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
            <Gavel className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] text-amber-400 font-medium">Legal</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-4 overflow-y-auto max-h-[60vh]">
          {activeCorrection ? (
            <div className="space-y-4">
              {/* Category & Severity badge */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getSeverityColor(activeCorrection.severity)}`}>
                  {getCategoryIcon(activeCorrection.category)}
                  <span className="text-sm font-medium">{getCategoryLabel(activeCorrection.category)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Confidence: {activeCorrection.confidence}%</span>
                </div>
              </div>

              {/* Split view comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Original Text - RED */}
                <div className="relative p-4 rounded-xl bg-red-500/5 border-2 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                  <div className="absolute -top-3 left-3 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40">
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Original</span>
                  </div>
                  <p className="text-sm text-red-200/90 leading-relaxed mt-2 line-through decoration-red-500/50">
                    {activeCorrection.originalText}
                  </p>
                </div>

                {/* Vetted Text - GREEN */}
                <div className="relative p-4 rounded-xl bg-emerald-500/5 border-2 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <div className="absolute -top-3 left-3 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Vetted</span>
                  </div>
                  <p className="text-sm text-emerald-200/90 leading-relaxed mt-2">
                    {activeCorrection.suggestedCorrection}
                  </p>
                </div>
              </div>

              {/* Context/Source if available */}
              {activeCorrection.source && (
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Source</span>
                  <p className="text-xs text-foreground/80 mt-1">{activeCorrection.source}</p>
                </div>
              )}

              {/* Navigation between corrections */}
              {pendingCorrections.length > 1 && (
                <div className="flex items-center justify-center gap-4 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPrevious}
                    disabled={currentIndex <= 0}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {currentIndex + 1} of {pendingCorrections.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToNext}
                    disabled={currentIndex >= pendingCorrections.length - 1}
                    className="rounded-full"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-400 mb-3" />
              <p className="text-foreground font-medium">All corrections have been ratified</p>
              <p className="text-sm text-muted-foreground mt-1">Your content is verified and ready</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {activeCorrection && (
          <div className="relative p-4 border-t border-border/50 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(activeCorrection.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              Dismiss
            </Button>
            
            <div className="flex items-center gap-2">
              {pendingCorrections.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRatifyAll}
                  className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                >
                  Ratify All ({pendingCorrections.length})
                </Button>
              )}
              
              {/* THE RATIFY BUTTON - Prominent, glowing */}
              <Button
                onClick={() => onRatify(activeCorrection.id)}
                className="relative px-6 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-full shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] transition-all duration-300"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/50 to-cyan-500/50 blur-md animate-pulse" />
                <span className="relative flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  RATIFY & APPLY
                </span>
              </Button>
            </div>
          </div>
        )}

        {/* Legal footer note */}
        <div className="relative px-4 py-2 border-t border-border/30 bg-muted/20">
          <p className="text-[9px] text-muted-foreground text-center">
            By clicking "Ratify & Apply," you formally consent to replace your original text with the Senate-verified correction. 
            <span className="text-emerald-400/80 ml-1">Human action required for liability protection.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RatifyPanel;
