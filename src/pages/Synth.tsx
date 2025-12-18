import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Code2, Palette, BarChart3, ToggleRight, Home, ArrowLeft, 
  Shield, AlertTriangle, Eye, Scale, CheckCircle, XCircle, UserCheck,
  Zap, Lock, FileText, ChevronDown, ChevronRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';

const Synth = () => {
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const pipelineSteps = [
    {
      step: 1,
      title: 'INTERCEPT',
      subtitle: 'Air Gap Gateway',
      description: 'All AI requests pass through a secure air-gapped gateway before processing.',
      icon: Shield,
      color: 'cyan',
    },
    {
      step: 2,
      title: 'CLASSIFY RISK',
      subtitle: 'ALLOW / RESTRICT / BLOCK',
      description: 'Requests are classified by risk level based on content type and user role.',
      icon: AlertTriangle,
      color: 'amber',
    },
    {
      step: 3,
      title: 'SANITIZE',
      subtitle: 'PII/PHI Redaction',
      description: 'Personal and health information is automatically redacted and minimized.',
      icon: Lock,
      color: 'purple',
    },
    {
      step: 4,
      title: 'SUPREME COURT',
      subtitle: '3 Agents Debate',
      description: 'Multiple AI agents with different perspectives analyze the request.',
      icon: Scale,
      color: 'blue',
    },
    {
      step: 5,
      title: 'JUDGE',
      subtitle: 'Coherence Score',
      description: 'A judge agent resolves contradictions and produces a coherence score.',
      icon: Eye,
      color: 'emerald',
    },
    {
      step: 6,
      title: 'VERIFY',
      subtitle: 'Policy + Evidence',
      description: 'Final verification against policies and evidence requirements.',
      icon: CheckCircle,
      color: 'green',
    },
    {
      step: 7,
      title: 'FLIGHT RECORDER',
      subtitle: 'Audit Log',
      description: 'Every decision is logged for compliance, review, and forensic analysis.',
      icon: FileText,
      color: 'orange',
    },
    {
      step: 8,
      title: 'RELEASE',
      subtitle: 'Answer Delivery',
      description: 'Safe answers are released; unsafe requests are refused or escalated.',
      icon: Zap,
      color: 'pink',
    },
  ];

  const agents = [
    {
      name: 'Skeptic',
      role: 'Risk Auditor',
      description: 'Finds hallucinations and liability traps. Questions assumptions and identifies potential legal or factual issues.',
      icon: AlertTriangle,
      color: 'red',
    },
    {
      name: 'Optimist',
      role: 'Solution Designer',
      description: 'Crafts the best compliant helpful answer. Balances helpfulness with safety requirements.',
      icon: CheckCircle,
      color: 'emerald',
    },
    {
      name: 'Fact-Checker',
      role: 'Evidence Validator',
      description: 'Marks key claims as supported, unverified, or contradicted. Ensures factual accuracy.',
      icon: Eye,
      color: 'blue',
    },
    {
      name: 'Judge',
      role: 'Final Arbiter',
      description: 'Decides RELEASE vs MISTRIAL. Outputs coherence score and final synthesized answer.',
      icon: Scale,
      color: 'purple',
    },
  ];

  const outcomes = [
    {
      label: 'RELEASE_FULL',
      description: 'Complete answer delivered',
      color: 'emerald',
      icon: CheckCircle,
    },
    {
      label: 'RELEASE_SAFE_PARTIAL',
      description: 'Partial answer with redactions',
      color: 'amber',
      icon: Shield,
    },
    {
      label: 'REFUSE',
      description: 'Request blocked',
      color: 'red',
      icon: XCircle,
    },
    {
      label: 'HUMAN_REVIEW_REQUIRED',
      description: 'Escalated to human reviewer',
      color: 'blue',
      icon: UserCheck,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
      cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-400', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]' },
      amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
      purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]' },
      blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]' },
      emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
      green: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]' },
      orange: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]' },
      pink: { bg: 'bg-pink-500/20', border: 'border-pink-500/50', text: 'text-pink-400', glow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]' },
      red: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]' },
    };
    return colors[color] || colors.cyan;
  };

  return (
    <>
      <Helmet>
        <title>SYNTH™ - The Digital Auditor | Valid™</title>
        <meta name="description" content="Enterprise AI Logic Flight Recorder & Consensus Engine. Intercepts risk before an answer is released." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        {/* Background */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: `
              radial-gradient(circle at 30% 20%, rgba(59,130,246,0.1), transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(168,85,247,0.1), transparent 50%),
              linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background)))
            `,
          }}
        />
        
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SYNTH™ — The Digital Auditor
                </h1>
                <p className="text-muted-foreground text-xs">Enterprise AI Logic Flight Recorder & Consensus Engine</p>
              </div>
            </div>
            
            <span className="text-blue-400 text-xs font-medium bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
              ENTERPRISE
            </span>
          </div>
        </header>

        {/* Spacer */}
        <div className="h-20" />

        {/* Main Content */}
        <main className="relative z-10 p-4 sm:p-8 max-w-6xl mx-auto space-y-16">
          
          {/* Hero Section */}
          <section className="text-center py-12">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-8">
              <Brain className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              SYNTH™ — The Digital Auditor
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Enterprise AI Logic Flight Recorder & Consensus Engine
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <div className="flex items-center gap-2 text-foreground/80">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>Intercepts risk before an answer is released</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/80">
                <Scale className="w-5 h-5 text-purple-400" />
                <span>Forces multi-agent consensus + verification</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/80">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>Creates audit logs for compliance</span>
              </div>
            </div>
            
            {/* Navigation Buttons - Clear & Easy Access */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
              <Button
                onClick={() => navigate('/synth/console')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-6"
              >
                Console
              </Button>
              <Button
                onClick={() => navigate('/synth/logs')}
                variant="outline"
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 py-6"
              >
                Logs
              </Button>
              <Button
                onClick={() => navigate('/synth/docs')}
                variant="outline"
                className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 py-6"
              >
                API Docs
              </Button>
              <Button
                onClick={() => navigate('/synth/policies')}
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 py-6"
              >
                Policies
              </Button>
            </div>
          </section>

          {/* How SYNTH Works - Pipeline */}
          <section id="pipeline" className="scroll-mt-24">
            <h3 className="text-3xl font-bold text-foreground text-center mb-4">How SYNTH™ Works</h3>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              Every AI request passes through our 8-step verification pipeline
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pipelineSteps.map((step) => {
                const colors = getColorClasses(step.color);
                return (
                  <div
                    key={step.step}
                    className={`relative p-5 rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-sm transition-all hover:scale-105 cursor-pointer ${colors.glow}`}
                    onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
                        <step.icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-semibold ${colors.text} mb-1`}>STEP {step.step}</div>
                        <h4 className="text-foreground font-bold text-sm">{step.title}</h4>
                        <p className="text-muted-foreground text-xs">{step.subtitle}</p>
                      </div>
                    </div>
                    {expandedStep === step.step && (
                      <p className="mt-3 text-muted-foreground text-xs border-t border-border/50 pt-3">
                        {step.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Supreme Court Agents */}
          <section>
            <h3 className="text-3xl font-bold text-foreground text-center mb-4">The "Supreme Court" Agents</h3>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              Four specialized AI agents debate every high-risk request
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {agents.map((agent) => {
                const colors = getColorClasses(agent.color);
                return (
                  <div
                    key={agent.name}
                    className={`relative p-6 rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-sm ${colors.glow}`}
                  >
                    <div className={`w-14 h-14 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-4`}>
                      <agent.icon className={`w-7 h-7 ${colors.text}`} />
                    </div>
                    <h4 className={`text-lg font-bold ${colors.text} mb-1`}>{agent.name}</h4>
                    <p className="text-foreground/80 text-sm font-medium mb-3">{agent.role}</p>
                    <p className="text-muted-foreground text-sm">{agent.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Output Modes */}
          <section>
            <h3 className="text-3xl font-bold text-foreground text-center mb-4">Output Modes</h3>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              Every request results in one of four possible outcomes
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {outcomes.map((outcome) => {
                const colors = getColorClasses(outcome.color);
                return (
                  <div
                    key={outcome.label}
                    className={`flex items-center gap-3 px-6 py-4 rounded-full border ${colors.border} ${colors.bg} ${colors.glow}`}
                  >
                    <outcome.icon className={`w-5 h-5 ${colors.text}`} />
                    <div>
                      <div className={`font-bold text-sm ${colors.text}`}>{outcome.label}</div>
                      <div className="text-muted-foreground text-xs">{outcome.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Investor Positioning Section */}
          <section className="text-center py-12 border-t border-border/50">
            <div className="max-w-3xl mx-auto">
              <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-semibold tracking-wider mb-6">
                INVESTOR POSITIONING
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">SYNTH™ is Already Built</h3>
              <p className="text-muted-foreground mb-6">
                We've already built SYNTH™, our audit-grade AI governance engine:
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {['sanitize', 'debate', 'judge', 'verify', 'log', 'release'].map((step) => (
                  <span key={step} className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-sm font-medium">
                    {step}
                  </span>
                ))}
              </div>
              <p className="text-foreground/80 mb-6">
                SYNTH™ is <span className="text-emerald-400 font-semibold">live today</span> as an API + web console, which proves the core system works.
              </p>
              <div className="bg-muted/30 rounded-xl p-6 border border-border/50 text-left mb-8">
                <p className="text-sm text-muted-foreground mb-4">
                  <strong className="text-foreground">Distribution channels</strong> (Chrome extension, partner integrations, SDKs) are thin clients that simply call the SYNTH™ API. That means we can ship new distribution fast without rebuilding the engine.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-blue-400 font-semibold mb-1">Immediate Defensibility</p>
                    <p className="text-muted-foreground">Value is in the governance engine, not a UI wrapper</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-purple-400 font-semibold mb-1">Model-Agnostic</p>
                    <p className="text-muted-foreground">Swap underlying models as AI landscape evolves</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-emerald-400 font-semibold mb-1">Enterprise-Ready</p>
                    <p className="text-muted-foreground">Logs, controls, and human review routing</p>
                  </div>
                </div>
              </div>
              <p className="text-amber-400 italic text-sm mb-8">
                "We can demonstrate SYNTH™ today: paste a prompt, see the decision, view the claim table, and export the audit log."
              </p>
            </div>
            
            {/* Quick Access Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
              <Button
                onClick={() => navigate('/synth/console')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-6"
              >
                Console
              </Button>
              <Button
                onClick={() => navigate('/synth/logs')}
                variant="outline"
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 py-6"
              >
                Logs
              </Button>
              <Button
                onClick={() => navigate('/synth/docs')}
                variant="outline"
                className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 py-6"
              >
                API Docs
              </Button>
              <Button
                onClick={() => navigate('/synth/policies')}
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 py-6"
              >
                Policies
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

export default Synth;
