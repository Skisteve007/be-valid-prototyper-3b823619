import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, Home, Brain, Shield, Target, BarChart3, MessageSquare, 
  Scale, Eye, Lock, AlertTriangle, CheckCircle, Award, Users, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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
      color: 'blue',
    },
    {
      id: 'ED',
      name: 'Evidence Discipline',
      weight: 20,
      description: 'Separate facts from assumptions, request missing data, avoid unsupported claims.',
      signals: ['Explicit assumptions', 'Evidence requests', 'Unsupported claim rate'],
      icon: Eye,
      color: 'purple',
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
      color: 'emerald',
    },
    {
      id: 'CP',
      name: 'Communication Precision',
      weight: 10,
      description: 'Produce correct, high-signal answers under word/format constraints.',
      signals: ['Constraint adherence', 'Clarity', 'Error rate under compression'],
      icon: MessageSquare,
      color: 'pink',
    },
  ];

  const tiers = [
    { percentile: 'Top 20%', name: 'Qualified', color: 'gray' },
    { percentile: 'Top 15%', name: 'Trusted Tester', color: 'blue' },
    { percentile: 'Top 10%', name: 'Moderator Candidate', color: 'purple' },
    { percentile: 'Top 5%', name: 'Senior Moderator', color: 'amber' },
    { percentile: 'Top 1%', name: 'SYNTH Operator', color: 'emerald' },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400' },
      purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400' },
      amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400' },
      emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400' },
      pink: { bg: 'bg-pink-500/20', border: 'border-pink-500/50', text: 'text-pink-400' },
      gray: { bg: 'bg-gray-500/20', border: 'border-gray-500/50', text: 'text-gray-400' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      <Helmet>
        <title>SYNTH™ Elite Methodology | Valid™</title>
        <meta name="description" content="SYNTH™ Elite Program scoring methodology - measuring reasoning performance under structured constraints" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        {/* Background */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: `
              radial-gradient(circle at 30% 20%, rgba(59,130,246,0.08), transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(168,85,247,0.08), transparent 50%),
              linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background)))
            `,
          }}
        />
        
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-blue-500/20">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/synth')}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SYNTH™ Elite Methodology
                </h1>
                <p className="text-muted-foreground text-xs">Scoring Framework & Tiering System</p>
              </div>
            </div>
            
            <Button
              onClick={() => navigate('/synth/challenges')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
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
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Purpose</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              SYNTH™ identifies and recruits top-tier operators and moderators by measuring <strong className="text-foreground">reasoning performance under structured constraints</strong>.
            </p>
            <p className="text-sm text-muted-foreground mt-4 max-w-2xl mx-auto">
              We do not diagnose psychology or infer private mental states. We measure observable performance signals: consistency, evidence discipline, safety compliance, and reliability over time.
            </p>
          </section>

          {/* Domains Section */}
          <section>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">What We Measure</h3>
              <p className="text-muted-foreground">Five domains combined into the SYNTH Score</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {domains.map((domain) => {
                const colors = getColorClasses(domain.color);
                return (
                  <Card key={domain.id} className={`border ${colors.border} ${colors.bg} backdrop-blur-sm`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                          <domain.icon className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <span className={`text-2xl font-bold ${colors.text}`}>{domain.weight}%</span>
                      </div>
                      <CardTitle className={`text-lg ${colors.text}`}>{domain.name}</CardTitle>
                      <span className="text-xs text-muted-foreground font-mono">({domain.id})</span>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{domain.description}</p>
                      <div className="space-y-1">
                        {domain.signals.map((signal, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-foreground/70">
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
            <Card className="border-blue-500/30 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Composite SYNTH Score
                </CardTitle>
                <CardDescription>Weighted combination of all five domains (0–100)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-background/50 rounded-lg p-4 font-mono text-center text-lg mb-6">
                  <span className="text-foreground">SYNTH = </span>
                  <span className="text-blue-400">0.30·LC</span>
                  <span className="text-muted-foreground"> + </span>
                  <span className="text-purple-400">0.20·ED</span>
                  <span className="text-muted-foreground"> + </span>
                  <span className="text-amber-400">0.20·CA</span>
                  <span className="text-muted-foreground"> + </span>
                  <span className="text-emerald-400">0.20·SP</span>
                  <span className="text-muted-foreground"> + </span>
                  <span className="text-pink-400">0.10·CP</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <p className="font-semibold text-foreground mb-1">Minimum Requirements</p>
                    <p className="text-muted-foreground text-xs">N = 10 tasks across at least 3 sessions</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <p className="font-semibold text-foreground mb-1">Aggregation</p>
                    <p className="text-muted-foreground text-xs">Robust median/trimmed mean to reduce outliers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Tiering Section */}
          <section>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Tiering System</h3>
              <p className="text-muted-foreground">Percentile rank within the evaluation population</p>
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

          {/* Promotion Rules */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-emerald-500/30 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  Promotion Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Must meet minimum task count + stability threshold</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Must maintain percentile over time (no one-off spikes)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Must pass Safety domain minimum (SP floor)</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-500/30 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-400">
                  <Lock className="w-5 h-5" />
                  Anti-Gaming Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Rotating question bank + parameterized variants</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Mixed task types (cannot optimize for one pattern)</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Anomaly detection for sudden score jumps</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Blind scoring via structured rubrics</span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Data Principles */}
          <section>
            <Card className="border-border bg-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Data Collection Principles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-background/50">
                    <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-foreground">Opt-in</p>
                    <p className="text-xs text-muted-foreground">Participation</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50">
                    <Lock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-foreground">Minimal</p>
                    <p className="text-xs text-muted-foreground">Data capture</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50">
                    <Eye className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-foreground">Audit Logging</p>
                    <p className="text-xs text-muted-foreground">With redaction</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50">
                    <Target className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-foreground">Performance</p>
                    <p className="text-xs text-muted-foreground">Not identity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <section className="text-center py-8 border-t border-border/50">
            <h3 className="text-xl font-bold text-foreground mb-4">Ready to test your reasoning?</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => navigate('/synth/challenges')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Challenge
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/synth')}
                className="border-muted-foreground/30"
              >
                Back to SYNTH
              </Button>
            </div>
          </section>
        </main>

        {/* Home FAB */}
        <button
          onClick={() => navigate('/')}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition z-50"
        >
          <Home className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};

export default SynthMethodology;
