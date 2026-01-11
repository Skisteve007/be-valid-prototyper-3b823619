import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Users, Activity, Brain, Target, Shield, Zap, Clock, TrendingUp, BarChart3, CheckCircle, Sparkles, Building2, User, Briefcase, Rocket, ArrowLeft } from 'lucide-react';
import AISenateResearchTabs from '@/components/human-vetting/AISenateResearchTabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  { name: 'Epistemic Humility & Verification', score: 87, color: 'from-cyan-500 to-cyan-400', tier: 1 },
  { name: 'Security Discipline & Data Hygiene', score: 92, color: 'from-emerald-500 to-emerald-400', tier: 1 },
  { name: 'Clear Intent & Specification', score: 78, color: 'from-amber-500 to-amber-400', tier: 1 },
  { name: 'Multi-Model Orchestration', score: 85, color: 'from-violet-500 to-violet-400', tier: 2 },
  { name: 'Structured Output Mastery', score: 91, color: 'from-blue-500 to-blue-400', tier: 2 },
  { name: 'Operational Circuit Breakers', score: 88, color: 'from-indigo-500 to-indigo-400', tier: 2 },
  { name: 'Dynamic Trust & Auditability', score: 94, color: 'from-fuchsia-500 to-fuchsia-400', tier: 3 },
  { name: 'Beneficial Ambition', score: 82, color: 'from-rose-500 to-rose-400', tier: 3 },
];

const HumanVetting: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

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
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="relative flex flex-col items-center justify-center mb-12">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-500/30 border-2 border-violet-500/40 shadow-[0_0_40px_rgba(139,92,246,0.5)] mb-6">
            <Eye className="w-10 h-10 text-violet-400" />
            <Activity className="absolute -top-2 -right-2 w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
            Human Vetting™
            <Sparkles className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-2xl">
            AI-Augmented Cognitive & Behavioral Assessment
          </p>
        </div>

        {showPreview ? (
          /* Example Score Preview */
          <div className="space-y-8">
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
              <h2 className="text-2xl font-bold text-foreground">
                Operator Certification Report
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                30-Day Evaluation Window • Subject ID: DEMO-001
              </p>
            </div>

            {/* Overall Score */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-2 border-violet-500/40 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Overall Score</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">+4.2% vs baseline</span>
                </div>
              </div>
              
              {/* Large score display */}
              <div className="flex flex-wrap items-center gap-8">
                <div className="relative">
                  <div className="text-7xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    87
                  </div>
                  <div className="text-sm text-muted-foreground">/100</div>
                </div>
                
                {/* Circular progress visualization */}
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/20"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${87 * 3.01} 301`}
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
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-semibold text-emerald-400">CERTIFIED</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Verified AI collaboration competency
                  </p>
                </div>
              </div>
            </div>

            {/* Category Scores */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Category Breakdown
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                {SCORING_CATEGORIES.map((cat, idx) => (
                  <div key={idx} className="relative p-4 rounded-xl bg-muted/20 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground">{cat.name}</span>
                      <span className="text-sm font-bold text-foreground">{cat.score}/100</span>
                    </div>
                    <div className="relative h-3 rounded-full bg-muted/40 overflow-hidden">
                      <div 
                        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${cat.color}`}
                        style={{ width: `${cat.score}%`, transition: 'width 1s ease-out' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Timeline Preview */}
            <div className="p-6 rounded-2xl bg-muted/20 border border-border/50">
              <h3 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity Log
              </h3>
              <div className="space-y-3">
                {[
                  { time: '2m ago', event: 'Verification checkpoint passed', status: 'success' },
                  { time: '15m ago', event: 'Adversarial query detected & handled', status: 'success' },
                  { time: '1h ago', event: 'Complex reasoning task completed', status: 'success' },
                  { time: '3h ago', event: 'Citation accuracy verified', status: 'warning' },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-background/50">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      log.status === 'success' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`} />
                    <span className="text-sm text-muted-foreground w-20">{log.time}</span>
                    <span className="text-sm text-foreground">{log.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Setup View */
          <div className="space-y-10">
            {/* Explainer */}
            <div className="text-center">
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                During the evaluation period, the <span className="text-violet-400 font-semibold">Senate</span> observes 
                your interactions with Large Language Models. You'll encounter calibrated adversarial prompts, 
                reasoning challenges, and verification checkpoints designed to measure cognitive discipline, 
                critical thinking, and AI-augmented problem-solving capabilities.
              </p>
            </div>

            {/* Use Cases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {USE_CASES.map((useCase, idx) => (
                <div 
                  key={idx}
                  className="group relative p-6 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 border-2 border-border/60 hover:border-violet-500/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 p-4 rounded-xl bg-background/80 border border-border/50 group-hover:border-violet-500/40 transition-colors">
                      {useCase.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-violet-400 transition-colors">
                        {useCase.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {useCase.description}
                      </p>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30">
                        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-xs font-medium text-violet-400">{useCase.highlight}</span>
                      </div>
                      {useCase.customNote && (
                        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                          <p className="text-xs text-amber-400 font-medium flex items-center gap-2">
                            <Shield className="w-4 h-4" />
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
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Select Evaluation Window
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {VETTING_DURATIONS.map((duration) => (
                  <button
                    key={duration.id}
                    onClick={() => setSelectedDuration(duration.id)}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all duration-300 text-left
                      ${selectedDuration === duration.id 
                        ? 'bg-violet-500/20 border-violet-500/60 shadow-[0_0_25px_rgba(139,92,246,0.4)]' 
                        : 'bg-muted/20 border-border/50 hover:border-violet-500/40 hover:bg-muted/40'
                      }
                    `}
                  >
                    {duration.recommended && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40">
                        <span className="text-[9px] font-semibold text-amber-400 uppercase">Recommended</span>
                      </div>
                    )}
                    <div className="text-lg font-bold text-foreground mb-1">{duration.label}</div>
                    <div className="text-xs text-muted-foreground">{duration.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* What Gets Measured */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Target className="w-5 h-5" />
                What Gets Measured
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tier 1: Foundation */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-2 border-cyan-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Tier 1: Foundation</span>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2" />
                      <span><strong className="text-foreground">Epistemic Humility</strong> — Cross-referencing and verification behavior</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2" />
                      <span><strong className="text-foreground">Security Discipline</strong> — Data hygiene and confidentiality practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2" />
                      <span><strong className="text-foreground">Clear Intent</strong> — Specificity and precision in AI instructions</span>
                    </li>
                  </ul>
                </div>

                {/* Tier 2: Architecture */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-2 border-violet-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-violet-400" />
                    <span className="text-sm font-bold text-violet-400 uppercase tracking-wider">Tier 2: Architecture</span>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2" />
                      <span><strong className="text-foreground">Multi-Model Orchestration</strong> — Strategic use of diverse AI capabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2" />
                      <span><strong className="text-foreground">Structured Output</strong> — Consistent formatting and schema adherence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2" />
                      <span><strong className="text-foreground">Circuit Breakers</strong> — Error handling and graceful degradation</span>
                    </li>
                  </ul>
                </div>

                {/* Tier 3: Wisdom */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-2 border-amber-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-bold text-amber-400 uppercase tracking-wider">Tier 3: Wisdom</span>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2" />
                      <span><strong className="text-foreground">Dynamic Trust</strong> — Adaptive skepticism calibrated to stakes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2" />
                      <span><strong className="text-foreground">Auditability</strong> — Transparent reasoning chains and documentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2" />
                      <span><strong className="text-foreground">Beneficial Ambition</strong> — Positive-sum collaboration goals</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Senate Research Tabs */}
            <AISenateResearchTabs />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-border/50">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowPreview(true)}
                className="gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Preview Example Score Report
              </Button>
              
              <Button
                size="lg"
                onClick={handleEnroll}
                disabled={!selectedDuration || isEnrolling}
                className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-[0_0_25px_rgba(139,92,246,0.4)]"
              >
                {isEnrolling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Begin Human Vetting
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HumanVetting;
