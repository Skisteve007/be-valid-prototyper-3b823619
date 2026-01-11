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
        <div className="relative flex flex-col items-center justify-center mb-12 md:mb-16">
          <div className="relative flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-500/30 border-2 border-violet-500/40 shadow-[0_0_40px_rgba(139,92,246,0.5)] mb-6">
            <Eye className="w-12 h-12 md:w-14 md:h-14 text-violet-400" />
            <Activity className="absolute -top-2 -right-2 w-7 h-7 md:w-8 md:h-8 text-cyan-400 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground flex items-center gap-3 mb-3">
            Human Vetting™
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-amber-400" />
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground text-center max-w-3xl px-4">
            AI-Augmented Cognitive & Behavioral Assessment
          </p>
        </div>

        {showPreview ? (
          /* Example Score Preview */
          <div className="space-y-10">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowPreview(false)}
              className="text-lg text-muted-foreground hover:text-foreground gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Setup
            </Button>

            {/* Example Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-violet-500/20 border border-violet-500/40 mb-5">
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-violet-400 animate-pulse" />
                <span className="text-base md:text-lg font-semibold text-violet-400">LIVE EXAMPLE DATA</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Operator Certification Report
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mt-3">
                30-Day Evaluation Window • Subject ID: DEMO-001
              </p>
            </div>

            {/* Overall Score */}
            <div className="relative p-8 md:p-10 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-2 border-violet-500/40 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <span className="text-lg md:text-xl font-semibold text-muted-foreground uppercase tracking-wider">Overall Score</span>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                  <span className="text-base md:text-lg text-emerald-400 font-medium">+4.2% vs baseline</span>
                </div>
              </div>
              
              {/* Large score display */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8 md:gap-12">
                <div className="relative text-center sm:text-left">
                  <div className="text-8xl md:text-9xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    87
                  </div>
                  <div className="text-lg md:text-xl text-muted-foreground">/100</div>
                </div>
                
                {/* Circular progress visualization */}
                <div className="relative w-36 h-36 md:w-44 md:h-44">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/20"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
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
                    <CheckCircle className="w-14 h-14 md:w-16 md:h-16 text-emerald-400" />
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex-1 min-w-[200px] text-center sm:text-left">
                  <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-lg md:text-xl font-semibold text-emerald-400">CERTIFIED</span>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground mt-3">
                    Verified AI collaboration competency
                  </p>
                </div>
              </div>
            </div>

            {/* Category Scores */}
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-3">
                <BarChart3 className="w-6 h-6 md:w-7 md:h-7" />
                Category Breakdown
              </h3>
              
              <div className="grid gap-5 md:gap-6 lg:grid-cols-2">
                {SCORING_CATEGORIES.map((cat, idx) => (
                  <div key={idx} className="relative p-5 md:p-6 rounded-xl bg-muted/20 border border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-base md:text-lg font-medium text-foreground">{cat.name}</span>
                      <span className="text-base md:text-lg font-bold text-foreground">{cat.score}/100</span>
                    </div>
                    <div className="relative h-4 md:h-5 rounded-full bg-muted/40 overflow-hidden">
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
            <div className="p-6 md:p-8 rounded-2xl bg-muted/20 border border-border/50">
              <h3 className="text-xl md:text-2xl font-semibold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 md:w-7 md:h-7" />
                Recent Activity Log
              </h3>
              <div className="space-y-4">
                {[
                  { time: '2m ago', event: 'Verification checkpoint passed', status: 'success' },
                  { time: '15m ago', event: 'Adversarial query detected & handled', status: 'success' },
                  { time: '1h ago', event: 'Complex reasoning task completed', status: 'success' },
                  { time: '3h ago', event: 'Citation accuracy verified', status: 'warning' },
                ].map((log, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-4 md:p-5 rounded-lg bg-background/50">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      log.status === 'success' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`} />
                    <span className="text-base md:text-lg text-muted-foreground w-24 flex-shrink-0">{log.time}</span>
                    <span className="text-base md:text-lg text-foreground">{log.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Setup View */
          <div className="space-y-10">
            {/* Explainer */}
            <div className="text-center px-4">
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                During the evaluation period, the <span className="text-violet-400 font-semibold">Senate</span> observes 
                your interactions with Large Language Models. You'll encounter calibrated adversarial prompts, 
                reasoning challenges, and verification checkpoints designed to measure cognitive discipline, 
                critical thinking, and AI-augmented problem-solving capabilities.
              </p>
            </div>

            {/* Use Cases Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {USE_CASES.map((useCase, idx) => (
                <div 
                  key={idx}
                  className="group relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 border-2 border-border/60 hover:border-violet-500/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    <div className="flex-shrink-0 p-5 md:p-6 rounded-xl bg-background/80 border border-border/50 group-hover:border-violet-500/40 transition-colors">
                      <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                        {React.cloneElement(useCase.icon as React.ReactElement, { className: 'w-10 h-10 md:w-12 md:h-12' })}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-violet-400 transition-colors">
                        {useCase.title}
                      </h4>
                      <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed">
                        {useCase.description}
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30">
                        <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-violet-400" />
                        <span className="text-sm md:text-base font-medium text-violet-400">{useCase.highlight}</span>
                      </div>
                      {useCase.customNote && (
                        <div className="mt-5 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                          <p className="text-sm md:text-base text-amber-400 font-medium flex items-center gap-3">
                            <Shield className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
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
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-3">
                <Clock className="w-6 h-6 md:w-7 md:h-7" />
                Select Evaluation Window
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {VETTING_DURATIONS.map((duration) => (
                  <button
                    key={duration.id}
                    onClick={() => setSelectedDuration(duration.id)}
                    className={`
                      relative p-5 md:p-6 rounded-xl border-2 transition-all duration-300 text-left
                      ${selectedDuration === duration.id 
                        ? 'bg-violet-500/20 border-violet-500/60 shadow-[0_0_25px_rgba(139,92,246,0.4)]' 
                        : 'bg-muted/20 border-border/50 hover:border-violet-500/40 hover:bg-muted/40'
                      }
                    `}
                  >
                    {duration.recommended && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40">
                        <span className="text-[10px] md:text-xs font-semibold text-amber-400 uppercase">Recommended</span>
                      </div>
                    )}
                    <div className="text-xl md:text-2xl font-bold text-foreground mb-2">{duration.label}</div>
                    <div className="text-sm md:text-base text-muted-foreground">{duration.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* What Gets Measured */}
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-3">
                <Target className="w-6 h-6 md:w-7 md:h-7" />
                What Gets Measured
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Tier 1: Foundation */}
                <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-2 border-cyan-500/30">
                  <div className="flex items-center gap-3 mb-5">
                    <Shield className="w-7 h-7 md:w-8 md:h-8 text-cyan-400" />
                    <span className="text-base md:text-lg font-bold text-cyan-400 uppercase tracking-wider">Tier 1: Foundation</span>
                  </div>
                  <ul className="space-y-4 text-base md:text-lg text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Epistemic Humility</strong> — Cross-referencing and verification behavior</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Security Discipline</strong> — Data hygiene and confidentiality practices</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Clear Intent</strong> — Specificity and precision in AI instructions</span>
                    </li>
                  </ul>
                </div>

                {/* Tier 2: Architecture */}
                <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-2 border-violet-500/30">
                  <div className="flex items-center gap-3 mb-5">
                    <Brain className="w-7 h-7 md:w-8 md:h-8 text-violet-400" />
                    <span className="text-base md:text-lg font-bold text-violet-400 uppercase tracking-wider">Tier 2: Architecture</span>
                  </div>
                  <ul className="space-y-4 text-base md:text-lg text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-violet-400 mt-2.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Multi-Model Orchestration</strong> — Strategic use of diverse AI capabilities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-violet-400 mt-2.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Structured Output</strong> — Consistent formatting and schema adherence</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-violet-400 mt-2.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Circuit Breakers</strong> — Error handling and graceful degradation</span>
                    </li>
                  </ul>
                </div>

                {/* Tier 3: Wisdom */}
                <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-2 border-amber-500/30">
                  <div className="flex items-center gap-3 mb-5">
                    <Zap className="w-7 h-7 md:w-8 md:h-8 text-amber-400" />
                    <span className="text-base md:text-lg font-bold text-amber-400 uppercase tracking-wider">Tier 3: Wisdom</span>
                  </div>
                  <ul className="space-y-4 text-base md:text-lg text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-2.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Dynamic Trust</strong> — Adaptive skepticism calibrated to stakes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-2.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Auditability</strong> — Transparent reasoning chains and documentation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-2.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Beneficial Ambition</strong> — Positive-sum collaboration goals</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Senate Research Tabs */}
            <AISenateResearchTabs />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center pt-8 border-t border-border/50">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowPreview(true)}
                className="gap-3 text-lg md:text-xl px-8 py-6 h-auto"
              >
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
                Preview Example Score Report
              </Button>
              
              <Button
                size="lg"
                onClick={handleEnroll}
                disabled={!selectedDuration || isEnrolling}
                className="gap-3 text-lg md:text-xl px-8 py-6 h-auto bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-[0_0_25px_rgba(139,92,246,0.4)]"
              >
                {isEnrolling ? (
                  <>
                    <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 md:w-6 md:h-6" />
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
