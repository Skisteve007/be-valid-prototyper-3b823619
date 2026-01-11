import React, { useState, useRef } from 'react';
import { X, Scale, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Sparkles, FileText, GraduationCap, Stethoscope, Gavel, Upload, FileUp, Brain, Shield, Zap, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RatifyCorrection } from '@/hooks/useRatify';
import { toast } from 'sonner';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCorrections, setShowCorrections] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Accept common document types
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown',
      ];
      
      if (allowedTypes.includes(file.type) || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        setSelectedFile(file);
        toast.success(`Selected: ${file.name}`);
      } else {
        toast.error('Please upload a PDF, Word document, or text file');
      }
    }
  };

  const handleSubmitToSenate = async () => {
    if (!selectedFile) {
      toast.error('Please select a document first');
      return;
    }

    setIsUploading(true);
    
    // Simulate processing - in production this would call the Senate API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Document submitted to the Senate for review!', {
      description: 'You will be notified when corrections are ready for ratification.'
    });
    
    setSelectedFile(null);
    setIsUploading(false);
    setShowCorrections(true);
  };

  const capabilities = [
    {
      icon: <Brain className="w-5 h-5 text-cyan-400" />,
      title: "AI Hallucination Detection",
      description: "Identifies when AI generates plausible but false information"
    },
    {
      icon: <Eye className="w-5 h-5 text-emerald-400" />,
      title: "Factual Verification",
      description: "Cross-references claims against trusted sources"
    },
    {
      icon: <Shield className="w-5 h-5 text-amber-400" />,
      title: "Citation Validation",
      description: "Ensures proper sourcing for academic and legal standards"
    },
    {
      icon: <Zap className="w-5 h-5 text-violet-400" />,
      title: "Logic Analysis",
      description: "Detects logical inconsistencies and contradictions"
    }
  ];

  // Show corrections view if we have pending corrections and user clicked to see them
  const showCorrectionsView = showCorrections && pendingCorrections.length > 0 && activeCorrection;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-background via-background to-background border-2 border-emerald-500/40 rounded-2xl shadow-[0_0_60px_rgba(16,185,129,0.3)]">
        
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 animate-pulse pointer-events-none" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Scale className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Ratify™
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-muted-foreground">
                {showCorrectionsView 
                  ? `${pendingCorrections.length} correction${pendingCorrections.length !== 1 ? 's' : ''} awaiting your approval`
                  : 'Your AI-Powered Fact Verification Assistant'
                }
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
          {showCorrectionsView ? (
            // Corrections Review View
            <div className="space-y-4">
              {/* Back button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCorrections(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Upload
              </Button>

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
            // Welcome / Upload View
            <div className="space-y-6">
              {/* Explainer Section */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-emerald-400/50 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <Scale className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  The Senate Votes. You Ratify.
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Upload any document—thesis, medical note, legal brief, or report—and our AI Senate will 
                  review it for errors, hallucinations, and missing citations. You retain final approval.
                </p>
              </div>

              {/* Capabilities Grid */}
              <div className="grid grid-cols-2 gap-3">
                {capabilities.map((cap, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-emerald-500/40 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {cap.icon}
                      <span className="text-xs font-semibold text-foreground">{cap.title}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{cap.description}</p>
                  </div>
                ))}
              </div>

              {/* Upload Section */}
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt,.md"
                  className="hidden"
                />
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative cursor-pointer p-8 rounded-xl border-2 border-dashed border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/60 transition-all group"
                >
                  {/* Animated glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 via-cyan-500/5 to-emerald-500/5 animate-pulse pointer-events-none" />
                  
                  <div className="relative flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all">
                      <FileUp className="w-7 h-7 text-emerald-400" />
                    </div>
                    
                    {selectedFile ? (
                      <>
                        <p className="text-sm font-medium text-emerald-400">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">Click to select a different file</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-foreground">
                          Drop your document here or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supports PDF, Word, and text files
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitToSenate}
                disabled={!selectedFile || isUploading}
                className="w-full relative px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting to Senate...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Submit for Senate Review
                  </span>
                )}
              </Button>

              {/* View existing corrections if any */}
              {pendingCorrections.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setShowCorrections(true)}
                  className="w-full border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  View {pendingCorrections.length} Pending Correction{pendingCorrections.length !== 1 ? 's' : ''}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions - Only show when viewing corrections */}
        {showCorrectionsView && activeCorrection && (
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
            {showCorrectionsView 
              ? <>By clicking "Ratify & Apply," you formally consent to replace your original text with the Senate-verified correction. <span className="text-emerald-400/80 ml-1">Human action required for liability protection.</span></>
              : <>Ratify™ uses multi-model AI consensus to verify facts and detect errors. <span className="text-emerald-400/80">Your approval is always required before any changes are applied.</span></>
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default RatifyPanel;
