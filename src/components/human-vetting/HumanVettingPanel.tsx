import React, { useState } from 'react';
import { X, Eye, Users, Activity, Brain, Target, Shield, Zap, Clock, TrendingUp, BarChart3, CheckCircle, Sparkles, Building2, User, Briefcase, GraduationCap, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface HumanVettingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VettingDuration {
  id: string;
  label: string;
  days: number;
  description: string;
  recommended?: boolean;
}

const VETTING_DURATIONS: VettingDuration[] = [
  { id: '7d', label: '7 Days', days: 7, description: 'Quick assessment sprint' },
  { id: '14d', label: '2 Weeks', days: 14, description: 'Standard evaluation period' },
  { id: '30d', label: '1 Month', days: 30, description: 'Comprehensive baseline', recommended: true },
  { id: '60d', label: '60 Days', days: 60, description: 'Deep pattern analysis' },
  { id: '90d', label: '90 Days', days: 90, description: 'Enterprise certification' },
  { id: '180d', label: '6 Months', days: 180, description: 'Executive-level validation' },
];

const USE_CASES = [
  {
    id: 'personal',
    icon: <User className="w-6 h-6 text-cyan-400" />,
    title: "Personal Development",
    description: "Sharpen your AI collaboration instincts through structured cognitive exercises and real-time feedback",
    highlight: "Self-paced learning with personalized insights",
    customNote: null
  },
  {
    id: 'recruitment',
    icon: <Briefcase className="w-6 h-6 text-emerald-400" />,
    title: "Recruitment & Hiring",
    description: "Screen candidates' reasoning agility, verification habits, and AI-augmented problem-solving under controlled conditions",
    highlight: "Pre-hire cognitive benchmarking",
    customNote: "We build custom assessment scopes tailored to your hiring criteria"
  },
  {
    id: 'monitoring',
    icon: <Building2 className="w-6 h-6 text-violet-400" />,
    title: "Workforce Oversight",
    description: "Continuous observation of how teams leverage LLMs—measure productivity, compliance, and cognitive discipline",
    highlight: "Real-time workforce intelligence",
    customNote: "Custom monitoring dashboards designed for your operational needs"
  },
  {
    id: 'enterprise',
    icon: <Rocket className="w-6 h-6 text-amber-400" />,
    title: "Enterprise Programs",
    description: "NASA, NVIDIA, Oracle-grade cognitive certification with fully bespoke work scopes and evaluation frameworks",
    highlight: "White-glove integration",
    customNote: "End-to-end custom solutions: your protocols, your metrics, your compliance standards"
  },
];

const SCORING_CATEGORIES = [
  { name: 'Verification Discipline', score: 87, color: 'from-cyan-500 to-cyan-400' },
  { name: 'Risk Handling', score: 92, color: 'from-emerald-500 to-emerald-400' },
  { name: 'Reasoning Quality', score: 78, color: 'from-amber-500 to-amber-400' },
  { name: 'Auditability', score: 95, color: 'from-violet-500 to-violet-400' },
  { name: 'Tool Hygiene', score: 84, color: 'from-blue-500 to-blue-400' },
];

const HumanVettingPanel: React.FC<HumanVettingPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  if (!isOpen) return null;

  const handleEnroll = async () => {
    if (!selectedDuration) {
      toast.error('Please select a vetting duration');
      return;
    }

    setIsEnrolling(true);
    
    // Simulate enrollment
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const duration = VETTING_DURATIONS.find(d => d.id === selectedDuration);
    toast.success(`Human Vetting activated for ${duration?.label}!`, {
      description: 'The Senate will now monitor your AI collaboration patterns.'
    });
    
    setIsEnrolling(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-12 p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden bg-gradient-to-br from-background via-background to-background border-2 border-violet-500/50 rounded-2xl shadow-[0_0_80px_rgba(139,92,246,0.4)]">
        
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-violet-500/10 animate-pulse pointer-events-none" />
        
        {/* Scanning line effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"
            style={{
              animation: 'scanLine 3s ease-in-out infinite',
            }}
          />
          <style>{`
            @keyframes scanLine {
              0% { top: 0; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
            }
          `}</style>
        </div>

        {/* Header */}
        <div className="relative flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-500/30 border border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
              <Eye className="w-6 h-6 text-violet-400" />
              <Activity className="absolute -top-1 -right-1 w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Human Vetting™
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-muted-foreground">
                AI-Augmented Cognitive & Behavioral Assessment
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

        {/* Content */}
        <div className="relative p-4 overflow-y-auto max-h-[70vh]">
          {showPreview ? (
            /* Example Score Preview */
            <div className="space-y-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Setup
              </Button>

              {/* Example Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/40 mb-4">
                  <Activity className="w-4 h-4 text-violet-400 animate-pulse" />
                  <span className="text-sm font-semibold text-violet-400">LIVE EXAMPLE DATA</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Operator Certification Report
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  30-Day Evaluation Window • Subject ID: DEMO-001
                </p>
              </div>

              {/* Overall Score */}
              <div className="relative p-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/40 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Overall Score</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">+4.2% vs baseline</span>
                  </div>
                </div>
                
                {/* Large score display */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="text-6xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      87
                    </div>
                    <div className="text-sm text-muted-foreground">/100</div>
                  </div>
                  
                  {/* Circular progress visualization */}
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted/20"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${87 * 2.51} 251`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-sm font-semibold text-emerald-400">CERTIFIED</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Verified AI collaboration competency
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Scores */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Category Breakdown
                </h4>
                
                {SCORING_CATEGORIES.map((cat, idx) => (
                  <div key={idx} className="relative p-3 rounded-lg bg-muted/20 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{cat.name}</span>
                      <span className="text-sm font-bold text-foreground">{cat.score}/100</span>
                    </div>
                    <div className="relative h-2 rounded-full bg-muted/40 overflow-hidden">
                      <div 
                        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${cat.color}`}
                        style={{ width: `${cat.score}%`, transition: 'width 1s ease-out' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity Timeline Preview */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Recent Activity Log
                </h4>
                <div className="space-y-2 text-xs">
                  {[
                    { time: '2m ago', event: 'Verification checkpoint passed', status: 'success' },
                    { time: '15m ago', event: 'Adversarial query detected & handled', status: 'success' },
                    { time: '1h ago', event: 'Complex reasoning task completed', status: 'success' },
                    { time: '3h ago', event: 'Citation accuracy verified', status: 'warning' },
                  ].map((log, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
                      <div className={`w-2 h-2 rounded-full ${
                        log.status === 'success' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`} />
                      <span className="text-muted-foreground">{log.time}</span>
                      <span className="text-foreground">{log.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Setup View */
            <div className="space-y-6">
              {/* Explainer */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-500/30 border border-violet-400/50 mb-4 shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                  <Eye className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Measure Human + AI Synergy
                </h3>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                  During the evaluation period, the <span className="text-violet-400 font-semibold">Senate</span> observes 
                  your interactions with Large Language Models. You'll encounter calibrated adversarial prompts, 
                  reasoning challenges, and verification checkpoints designed to measure cognitive discipline, 
                  critical thinking, and AI-augmented problem-solving capabilities.
                </p>
              </div>

              {/* Use Cases Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {USE_CASES.map((useCase, idx) => (
                  <div 
                    key={idx}
                    className="group relative p-5 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border-2 border-border/60 hover:border-violet-500/60 hover:shadow-[0_0_25px_rgba(139,92,246,0.2)] transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 rounded-xl bg-background/80 border border-border/50 group-hover:border-violet-500/40 transition-colors">
                        {useCase.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-foreground mb-1 group-hover:text-violet-400 transition-colors">
                          {useCase.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                          {useCase.description}
                        </p>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-violet-500/10 border border-violet-500/30">
                          <Sparkles className="w-3 h-3 text-violet-400" />
                          <span className="text-[10px] font-medium text-violet-400">{useCase.highlight}</span>
                        </div>
                        {useCase.customNote && (
                          <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                            <p className="text-[10px] text-amber-400 font-medium flex items-center gap-1.5">
                              <Shield className="w-3 h-3" />
                              {useCase.customNote}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Duration Selection */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Select Evaluation Window
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {VETTING_DURATIONS.map((duration) => (
                    <button
                      key={duration.id}
                      onClick={() => setSelectedDuration(duration.id)}
                      className={`
                        relative p-3 rounded-xl border-2 transition-all duration-200
                        ${selectedDuration === duration.id
                          ? 'bg-violet-500/20 border-violet-500/60 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                          : 'bg-muted/30 border-border/50 hover:border-violet-500/40'
                        }
                      `}
                    >
                      {duration.recommended && (
                        <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-bold">
                          RECOMMENDED
                        </div>
                      )}
                      <div className={`text-lg font-bold ${
                        selectedDuration === duration.id ? 'text-violet-400' : 'text-foreground'
                      }`}>
                        {duration.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {duration.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* What Gets Measured */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/5 to-purple-500/5 border border-violet-500/30">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-violet-400" />
                  What Gets Measured
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Verification Discipline',
                    'Risk Handling & Escalation',
                    'Calibration Accuracy',
                    'Reasoning Quality',
                    'Policy Compliance',
                    'Auditability',
                    'Bias Awareness',
                    'Incident Response',
                    'Tool Hygiene',
                    'Outcome Integrity'
                  ].map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                      <CheckCircle className="w-3 h-3 text-violet-400" />
                      <span className="text-foreground">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => setShowPreview(true)}
                  variant="outline"
                  className="w-full border-violet-500/40 text-violet-400 hover:bg-violet-500/10"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Preview Example Score Report
                </Button>

                <Button
                  onClick={handleEnroll}
                  disabled={!selectedDuration || isEnrolling}
                  className="w-full relative px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:shadow-[0_0_35px_rgba(139,92,246,0.7)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEnrolling ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enrolling...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Begin Human Vetting
                    </span>
                  )}
                </Button>
              </div>

              {/* Enterprise CTA */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-center">
                <p className="text-xs text-muted-foreground">
                  <span className="text-amber-400 font-semibold">Enterprise clients:</span> Contact us for custom 
                  work scopes, team-wide deployments, and integration with your HR systems.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HumanVettingPanel;
