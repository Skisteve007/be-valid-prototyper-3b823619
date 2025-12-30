import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, Home, Brain, Shield, Target, BarChart3, MessageSquare, 
  Scale, Eye, Lock, AlertTriangle, CheckCircle, Award, Users, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SynthMethodology = () => {
  const navigate = useNavigate();

  const domains = [
    {
      id: 'LC',
      name: 'Logical Consistency',
      weight: 30,
      description: 'Maintain internally consistent reasoning across reframed questions and time.',
      signals: ['Contradiction rate', 'Invariance under paraphrase', 'Step consistency'],
      icon: Brain,
      color: 'cyan',
    },
    {
      id: 'ED',
      name: 'Evidence Discipline',
      weight: 20,
      description: 'Separate facts from assumptions, request missing data, avoid unsupported claims.',
      signals: ['Explicit assumptions', 'Evidence requests', 'Unsupported claim rate'],
      icon: Eye,
      color: 'blue',
    },
    {
      id: 'CA',
      name: 'Calibration',
      weight: 20,
      description: 'Express uncertainty appropriately and update beliefs with new information.',
      signals: ['Confidence labeling', 'Probability calibration', 'Update correctness'],
      icon: Target,
      color: 'amber',
    },
    {
      id: 'SP',
      name: 'Safety & Policy',
      weight: 20,
      description: 'Comply with safety constraints, avoid disallowed actions, choose safe reframes.',
      signals: ['Policy compliance rate', 'Safe reframing', 'Refusal correctness'],
      icon: Shield,
      color: 'green',
    },
    {
      id: 'CP',
      name: 'Communication Precision',
      weight: 10,
      description: 'Produce correct, high-signal answers under word/format constraints.',
      signals: ['Constraint adherence', 'Clarity', 'Error rate under compression'],
      icon: MessageSquare,
      color: 'purple',
    },
  ];

  const tiers = [
    { percentile: 'Top 20%', name: 'Qualified', color: 'gray' },
    { percentile: 'Top 15%', name: 'Trusted Tester', color: 'cyan' },
    { percentile: 'Top 10%', name: 'Moderator Candidate', color: 'blue' },
    { percentile: 'Top 5%', name: 'Senior Moderator', color: 'amber' },
    { percentile: 'Top 1%', name: 'SYNTH Operator', color: 'green' },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-400' },
      blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400' },
      amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400' },
      green: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400' },
      purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400' },
      gray: { bg: 'bg-gray-500/20', border: 'border-gray-500/50', text: 'text-gray-400' },
    };
    return colors[color] || colors.cyan;
  };

  return (
    <>
      <Helmet>
        <title>SYNTH™ Elite Methodology | Valid™</title>
        <meta name="description" content="SYNTH™ Elite Program scoring methodology - measuring reasoning performance under structured constraints" />
      </Helmet>

      <div className="min-h-screen synth-bg text-foreground">
        {/* Grid overlay */}
        <div className="fixed inset-0 z-0 synth-grid opacity-50" />
        
        {/* Background gradient accents */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(0,212,255,0.08), transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(59,130,246,0.08), transparent 50%)
            `,
          }}
        />
        
        {/* Header */}
        <header className="synth-header fixed top-0 left-0 right-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/synth')}
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <div>
                <h1 className="text-xl font-bold synth-neon-blue">
                  SYNTH™ Elite Methodology
                </h1>
                <p className="text-gray-400 text-xs">Scoring Framework & Tiering System</p>
              </div>
            </div>
            
            <Button
              onClick={() => navigate('/synth/challenges')}
              className="synth-btn-primary"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Take Challenge
            </Button>
          </div>
        </header>

        {/* Spacer */}
        <div className="h-20" />

        {/* Main Content */}
        <main className="relative z-10 p-4 sm:p-8 max-w-6xl mx-auto space-y-12">
          
          {/* Purpose Section */}
          <section className="text-center py-8">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-6 synth-pulse">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Purpose</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              SYNTH™ identifies and recruits top-tier operators and moderators by measuring <strong className="text-cyan-400">reasoning performance under structured constraints</strong>.
            </p>
            <p className="text-sm text-gray-500 mt-4 max-w-2xl mx-auto">
              We do not diagnose psychology or infer private mental states. We measure observable performance signals: consistency, evidence discipline, safety compliance, and reliability over time.
            </p>
          </section>

          {/* Domains Section */}
          <section>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">What We Measure</h3>
              <p className="text-gray-400">Five domains combined into the SYNTH Score</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {domains.map((domain) => {
                const colors = getColorClasses(domain.color);
                return (
                  <Card key={domain.id} className={`synth-card border-0 relative overflow-hidden`}>
                    <div className="absolute inset-0 synth-sheen pointer-events-none" />
                    <CardHeader className="pb-2 relative">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                          <domain.icon className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <span className={`text-2xl font-bold ${colors.text}`}>{domain.weight}%</span>
                      </div>
                      <CardTitle className={`text-lg ${colors.text}`}>{domain.name}</CardTitle>
                      <span className="text-xs text-gray-500 font-mono">({domain.id})</span>
                    </CardHeader>
                    <CardContent className="relative">
                      <p className="text-sm text-gray-400 mb-3">{domain.description}</p>
                      <div className="space-y-1">
                        {domain.signals.map((signal, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            {signal}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Scoring Formula */}
          <section>
            <Card className="synth-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Composite SYNTH Score
                </CardTitle>
                <CardDescription className="text-gray-400">Weighted combination of all five domains (0–100)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="synth-terminal rounded-lg p-4 font-mono text-center text-lg mb-6">
                  <span className="text-white">SYNTH = </span>
                  <span className="text-cyan-400">0.30·LC</span>
                  <span className="text-gray-500"> + </span>
                  <span className="text-blue-400">0.20·ED</span>
                  <span className="text-gray-500"> + </span>
                  <span className="text-amber-400">0.20·CA</span>
                  <span className="text-gray-500"> + </span>
                  <span className="text-emerald-400">0.20·SP</span>
                  <span className="text-gray-500"> + </span>
                  <span className="text-purple-400">0.10·CP</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-white/5 border border-cyan-500/20">
                    <p className="font-semibold text-white mb-1">Minimum Requirements</p>
                    <p className="text-gray-400 text-xs">N = 10 tasks across at least 3 sessions</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-cyan-500/20">
                    <p className="font-semibold text-white mb-1">Aggregation</p>
                    <p className="text-gray-400 text-xs">Robust median/trimmed mean to reduce outliers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Tiering Section */}
          <section>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Tiering System</h3>
              <p className="text-gray-400">Percentile rank within the evaluation population</p>
            </div>
            
            <div className="space-y-3">
              {tiers.map((tier, index) => {
                const colors = getColorClasses(tier.color);
                const width = 100 - (index * 20);
                return (
                  <div key={tier.name} className="flex items-center gap-4">
                    <div className="w-24 text-right">
                      <span className={`text-sm font-semibold ${colors.text}`}>{tier.percentile}</span>
                    </div>
                    <div className="flex-1">
                      <div className={`h-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center px-4`} style={{ width: `${width}%` }}>
                        <span className={`font-bold ${colors.text}`}>{tier.name}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Operator Certification Rubric Section (Canonical) */}
          <section>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Operator Certification Rubric (Best‑Practice Aligned)</h3>
              <p className="text-gray-400 max-w-3xl mx-auto">
                SYNTH measures how a person thinks and verifies while using AI—not just whether they got an answer. The rubric scores verification discipline, risk behavior, calibration, and auditability, producing a numeric score (0–100) with category breakdowns and an evidence trail that can be reviewed by engineers, doctors, and professors.
              </p>
            </div>

            <Card className="synth-card border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-cyan-500/20">
                        <th className="text-left p-4 text-cyan-400 font-semibold">Category (0–100)</th>
                        <th className="text-left p-4 text-cyan-400 font-semibold">What we measure</th>
                        <th className="text-left p-4 text-cyan-400 font-semibold hidden lg:table-cell">What "good" looks like</th>
                        <th className="text-left p-4 text-cyan-400 font-semibold hidden xl:table-cell">Evidence captured</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="hover:bg-white/5"><td className="p-4 font-medium text-white"><span className="text-cyan-400 font-bold">1)</span> Verification Discipline</td><td className="p-4 text-gray-400">Does the operator validate claims and avoid "confident nonsense"?</td><td className="p-4 text-gray-400 hidden lg:table-cell">Cross-checks facts, asks for sources, verifies before acting</td><td className="p-4 text-gray-400 text-xs hidden xl:table-cell">Source checks, citations, verification steps, corrections</td></tr>
                      <tr className="hover:bg-white/5"><td className="p-4 font-medium text-white"><span className="text-cyan-400 font-bold">2)</span> Risk Handling & Escalation</td><td className="p-4 text-gray-400">Do they apply brakes in high-stakes situations?</td><td className="p-4 text-gray-400 hidden lg:table-cell">Flags uncertainty, escalates to human review, uses safe defaults</td><td className="p-4 text-gray-400 text-xs hidden xl:table-cell">Red-flag events, escalation triggers, blocked actions</td></tr>
                      <tr className="hover:bg-white/5"><td className="p-4 font-medium text-white"><span className="text-cyan-400 font-bold">3)</span> Calibration (Trust vs Skepticism)</td><td className="p-4 text-gray-400">Do they know when to trust AI vs challenge it?</td><td className="p-4 text-gray-400 hidden lg:table-cell">Matches confidence to evidence; doesn't over-trust fluent answers</td><td className="p-4 text-gray-400 text-xs hidden xl:table-cell">Confidence markers, challenge rate, acceptance patterns</td></tr>
                      <tr className="hover:bg-white/5"><td className="p-4 font-medium text-white"><span className="text-cyan-400 font-bold">4)</span> Reasoning Quality (Problem Solving)</td><td className="p-4 text-gray-400">Can they frame problems correctly and stay consistent?</td><td className="p-4 text-gray-400 hidden lg:table-cell">Clear problem definition, stepwise reasoning, handles ambiguity</td><td className="p-4 text-gray-400 text-xs hidden xl:table-cell">Prompt quality, constraint handling, revisions</td></tr>
                      <tr className="hover:bg-white/5"><td className="p-4 font-medium text-white"><span className="text-cyan-400 font-bold">5)</span> Policy Compliance (Scope + Data)</td><td className="p-4 text-gray-400">Do they follow governance rules and avoid unsafe data use?</td><td className="p-4 text-gray-400 hidden lg:table-cell">Stays within scope; avoids restricted data exposure</td><td className="p-4 text-gray-400 text-xs hidden xl:table-cell">Policy hits/violations, restricted data detection</td></tr>
                      <tr className="hover:bg-white/5"><td className="p-4 font-medium text-white"><span className="text-cyan-400 font-bold">6)</span> Auditability & Record Quality</td><td className="p-4 text-gray-400">Can a reviewer reconstruct what happened and why?</td><td className="p-4 text-gray-400 hidden lg:table-cell">Creates clean trail: inputs → checks → decision → outcome</td><td className="p-4 text-gray-400 text-xs hidden xl:table-cell">Proof record IDs, decision rationale, trace completeness</td></tr>
                      <tr className="hover:bg-white/5"><td className="p-4 font-medium text-white"><span className="text-cyan-400 font-bold">7)</span> Bias / Fairness Awareness</td><td className="p-4 text-gray-400">Do they recognize bias risks and mitigate appropriately?</td><td className="p-4 text-gray-400 hidden lg:table-cell">Flags biased assumptions; uses neutral criteria</td><td className="p-4 text-gray-400 text-xs hidden xl:table-cell">Bias flags, fairness checks, remediation actions</td></tr>
                      <tr className="hover:bg-white/5"><td className="p-4 font-medium text-white"><span className="text-cyan-400 font-bold">8)</span> Incident Response Readiness</td><td className="p-4 text-gray-400">Do they respond correctly when AI fails?</td><td className="p-4 text-gray-400 hidden lg:table-cell">Reports anomalies, documents failures, participates in root-cause</td><td className="p-4 text-gray-400 text-xs hidden xl:table-cell">Incident flags, reports, remediation steps</td></tr>
                      <tr className="hover:bg-white/5"><td className="p-4 font-medium text-white"><span className="text-cyan-400 font-bold">9)</span> Tool/Model Hygiene (Interface Traceability)</td><td className="p-4 text-gray-400">Do they use approved tools and remain reproducible?</td><td className="p-4 text-gray-400 hidden lg:table-cell">Uses approved interfaces; can reproduce results; avoids shadow AI</td><td className="p-4 text-gray-400 text-xs hidden xl:table-cell">LLM/interface used, model/version, routing logs</td></tr>
                      <tr className="hover:bg-white/5"><td className="p-4 font-medium text-white"><span className="text-cyan-400 font-bold">10)</span> Operational Outcome Integrity</td><td className="p-4 text-gray-400">Do results hold up in the real world?</td><td className="p-4 text-gray-400 hidden lg:table-cell">Outputs are usable, verifiable, consistent with requirements</td><td className="p-4 text-gray-400 text-xs hidden xl:table-cell">Post-check outcomes, overrides, error rates</td></tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card className="synth-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Outputs Delivered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                      <span className="text-gray-300"><strong className="text-white">Overall Score (0–100)</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                      <span className="text-gray-300"><strong className="text-white">Category sub-scores (0–100)</strong> for each rubric line</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                      <span className="text-gray-300"><strong className="text-white">Trendline</strong> (7/30/60/90+ days): improving / stable / drifting</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                      <span className="text-gray-300"><strong className="text-white">Evidence pack:</strong> proof record IDs + reviewer-ready traces</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    <strong>Optional:</strong> PASS / REVIEW / FAIL derived from score thresholds (kept secondary to numeric scoring)
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Promotion Rules */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="synth-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  Promotion Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Must meet minimum task count + stability threshold</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Must maintain percentile over time (no one-off spikes)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Must pass Safety domain minimum (SP floor)</span>
                </div>
              </CardContent>
            </Card>

            <Card className="synth-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-400">
                  <Lock className="w-5 h-5" />
                  Anti-Gaming Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Rotating question bank + parameterized variants</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Mixed task types (cannot optimize for one pattern)</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Anomaly detection for sudden score jumps</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Blind scoring via structured rubrics</span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Data Principles */}
          <section>
            <Card className="synth-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Data Collection Principles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-white/5 border border-cyan-500/20">
                    <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-white">Opt-in</p>
                    <p className="text-xs text-gray-400">Participation</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-blue-500/20">
                    <Lock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-white">Minimal</p>
                    <p className="text-xs text-gray-400">Data capture</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-emerald-500/20">
                    <Eye className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-white">Audit Logging</p>
                    <p className="text-xs text-gray-400">With redaction</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-amber-500/20">
                    <Target className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-white">Performance</p>
                    <p className="text-xs text-gray-400">Not identity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <section className="text-center py-8 border-t border-cyan-500/20">
            <h3 className="text-xl font-bold text-white mb-4">Ready to test your reasoning?</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => navigate('/synth/challenges')}
                className="synth-btn-primary"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Challenge
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/synth')}
                className="border-gray-600 text-gray-300 hover:bg-white/10 bg-transparent"
              >
                Back to SYNTH
              </Button>
            </div>
          </section>
        </main>

        {/* Home FAB */}
        <button
          onClick={() => navigate('/')}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full synth-card flex items-center justify-center hover:scale-110 transition z-50 synth-pulse"
        >
          <Home className="w-6 h-6 text-cyan-400" />
        </button>
      </div>
    </>
  );
};

export default SynthMethodology;
