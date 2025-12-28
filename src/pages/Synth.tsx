import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Code2, Palette, BarChart3, ToggleRight, Home, ArrowLeft, 
  Shield, AlertTriangle, Eye, Scale, CheckCircle, XCircle, UserCheck,
  Zap, Lock, FileText, ChevronDown, ChevronRight, Sparkles
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
      title: 'SENATE CHAMBER',
      subtitle: '5 Senators Debate Truth',
      description: 'Five specialized AI senators with distinct perspectives debate the request to evaluate truth in the data source.',
      icon: Scale,
      color: 'blue',
    },
    {
      step: 5,
      title: 'EXECUTIVE SECRETARY',
      subtitle: 'Clean & Organize',
      description: 'Reviews Senate conclusions, ensures answers are clean and organized, and can return issues to the Senate for reconsideration before passing to the Judge.',
      icon: UserCheck,
      color: 'purple',
    },
    {
      step: 6,
      title: 'JUDGE',
      subtitle: 'Final Arbiter',
      description: 'Reviews the Senate decision, aligns it with its own knowledge to confirm truth, and formulates the final answer. If disagreement exists, sends back for re-debate.',
      icon: Eye,
      color: 'cyan',
    },
    {
      step: 7,
      title: 'VERIFY',
      subtitle: 'Policy + Evidence',
      description: 'Final verification against policies and evidence requirements.',
      icon: CheckCircle,
      color: 'green',
    },
    {
      step: 8,
      title: 'FLIGHT RECORDER',
      subtitle: 'Audit Log',
      description: 'Every decision is logged for compliance, review, and forensic analysis.',
      icon: FileText,
      color: 'orange',
    },
    {
      step: 9,
      title: 'RELEASE',
      subtitle: 'Answer Delivery',
      description: 'Safe answers are released; unsafe requests are refused or escalated.',
      icon: Zap,
      color: 'cyan',
    },
  ];

  const agents = [
    // Senate Seats (5 debating agents)
    {
      name: 'Skeptic',
      role: 'Risk Auditor',
      description: 'Finds hallucinations and liability traps. Questions assumptions and identifies potential legal or factual issues.',
      icon: AlertTriangle,
      color: 'red',
      tier: 'senate',
    },
    {
      name: 'Optimist',
      role: 'Solution Designer',
      description: 'Crafts the best compliant helpful answer. Balances helpfulness with safety requirements.',
      icon: CheckCircle,
      color: 'cyan',
      tier: 'senate',
    },
    {
      name: 'Fact-Checker',
      role: 'Evidence Validator',
      description: 'Marks key claims as supported, unverified, or contradicted. Ensures factual accuracy.',
      icon: Eye,
      color: 'blue',
      tier: 'senate',
    },
    {
      name: 'Advocate',
      role: 'Context Champion',
      description: 'Advocates for nuance and context. Ensures edge cases and user intent are fully considered.',
      icon: Sparkles,
      color: 'amber',
      tier: 'senate',
    },
    {
      name: 'Guardian',
      role: 'Policy Enforcer',
      description: 'Enforces compliance boundaries. Ensures no policy violations or regulatory overreach.',
      icon: Shield,
      color: 'green',
      tier: 'senate',
    },
    // Executive Secretary (6th agent)
    {
      name: 'Executive Secretary',
      role: 'Senate Coordinator',
      description: 'Cleans and organizes Senate conclusions. Can return issues to the 5 senators for reconsideration before presenting the final position to the Judge.',
      icon: UserCheck,
      color: 'purple',
      tier: 'secretary',
    },
    // Judge (7th agent - Final Arbiter)
    {
      name: 'Judge',
      role: 'Final Arbiter',
      description: 'Reviews the Senate decision, aligns with its own knowledge to verify truth, and formulates the final answer. If not agreed, triggers re-debate cycle.',
      icon: Scale,
      color: 'orange',
      tier: 'judge',
    },
  ];

  const outcomes = [
    {
      label: 'RELEASE_FULL',
      description: 'Complete answer delivered',
      color: 'cyan',
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
      color: 'orange',
      icon: UserCheck,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
      cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-400', glow: 'shadow-[0_0_20px_rgba(0,212,255,0.3)]' },
      amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
      purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]' },
      blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]' },
      green: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
      orange: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]' },
      red: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]' },
    };
    return colors[color] || colors.cyan;
  };

  return (
    <>
      <Helmet>
        <title>SYNTH™ - Neural Oversight Nexus | Valid™</title>
        <meta name="description" content="Enterprise AI Logic Flight Recorder & Consensus Engine. Intercepts risk before an answer is released." />
      </Helmet>

      <div className="min-h-screen synth-bg text-foreground font-electrolize">
        {/* Grid overlay */}
        <div className="fixed inset-0 z-0 synth-grid opacity-50" />
        
        {/* Background gradient accents */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(0,212,255,0.08), transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(59,130,246,0.08), transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.5), transparent 80%)
            `,
          }}
        />
        
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 synth-header">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-full bg-cyan-500/10 border border-cyan-500/40 hover:bg-cyan-500/20 transition shadow-[0_0_15px_rgba(0,212,255,0.4)] hover:shadow-[0_0_25px_rgba(0,212,255,0.6)]"
              >
                <ArrowLeft className="w-5 h-5 text-cyan-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold synth-neon-blue">
                  SYNTH™ — Neural Oversight Nexus
                </h1>
                <p className="text-gray-400 text-xs tracking-wide">Agentic AI Governance & Consensus Architecture</p>
              </div>
            </div>
            
            <span className="synth-badge-release px-3 py-1 rounded-full text-xs font-semibold tracking-wider synth-pulse">
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
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-8 synth-pulse">
              <Brain className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              SYNTH™ — Neural Oversight Nexus
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Agentic AI Governance & Consensus Architecture
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <div className="flex items-center gap-2 text-gray-300">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span>Intercepts risk before an answer is released</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Scale className="w-5 h-5 text-blue-400" />
                <span>Forces multi-agent consensus + verification</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>Creates audit logs for compliance</span>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
              <Button
                onClick={() => navigate('/synth/senate')}
                className="synth-btn-primary font-semibold py-6"
              >
                <Scale className="w-4 h-4 mr-2" />
                Senate (7)
              </Button>
              <Button
                onClick={() => navigate('/synth/console')}
                variant="outline"
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 py-6 bg-transparent"
              >
                Console
              </Button>
              <Button
                onClick={() => navigate('/synth/logs')}
                variant="outline"
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 py-6 bg-transparent"
              >
                Logs
              </Button>
              <Button
                onClick={() => navigate('/synth/docs')}
                variant="outline"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 py-6 bg-transparent"
              >
                API Docs
              </Button>
              <Button
                onClick={() => navigate('/synth/policies')}
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 py-6 bg-transparent"
              >
                Policies
              </Button>
              <Button
                onClick={() => navigate('/synth/challenges')}
                variant="outline"
                className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 py-6 bg-transparent"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Challenges
              </Button>
            </div>
          </section>

          {/* How SYNTH Works - Pipeline */}
          <section id="pipeline" className="scroll-mt-24">
            <h3 className="text-3xl font-bold text-white text-center mb-4">How SYNTH™ Works</h3>
            <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
              Every AI request passes through our 9-step verification pipeline. The purpose is to evaluate truth in the data source.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pipelineSteps.map((step) => {
                const colors = getColorClasses(step.color);
                return (
                  <div
                    key={step.step}
                    className={`relative p-5 rounded-xl synth-card transition-all hover:scale-105 cursor-pointer ${colors.glow}`}
                    onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
                  >
                    <div className="absolute inset-0 rounded-xl synth-sheen pointer-events-none" />
                    <div className="relative flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
                        <step.icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-semibold ${colors.text} mb-1`}>STEP {step.step}</div>
                        <h4 className="text-white font-bold text-sm">{step.title}</h4>
                        <p className="text-gray-400 text-xs">{step.subtitle}</p>
                      </div>
                    </div>
                    {expandedStep === step.step && (
                      <p className="relative mt-3 text-gray-400 text-xs border-t border-white/10 pt-3">
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
            <h3 className="text-3xl font-bold text-white text-center mb-4">The "Supreme Court" — Adversarial Senate</h3>
            <p className="text-gray-400 text-center mb-4 max-w-2xl mx-auto">
              Multiple independent AI agents form the governance structure: Senators debate truth, 
              the Executive Secretary cleans and organizes, and the Judge delivers the final verdict.
            </p>
            
            {/* Flow Diagram */}
            <div className="flex items-center justify-center gap-2 mb-12 text-sm">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400">5 Senators</span>
              <span className="text-gray-500">→</span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400">Executive Secretary</span>
              <span className="text-gray-500">→</span>
              <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400">Judge</span>
            </div>

            {/* Senate Seats - 5 Debating Agents */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-blue-400 text-center mb-4 flex items-center justify-center gap-2">
                <Scale className="w-5 h-5" />
                Senate Chamber — 5 Seats
              </h4>
              <p className="text-gray-500 text-center text-sm mb-6">These 5 agents debate truth in the data source</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {agents.filter(a => a.tier === 'senate').map((agent) => {
                  const colors = getColorClasses(agent.color);
                  return (
                    <div
                      key={agent.name}
                      className={`relative p-5 rounded-xl synth-card ${colors.glow}`}
                    >
                      <div className="absolute inset-0 rounded-xl synth-sheen pointer-events-none" />
                      <div className="relative text-center">
                        <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-3 mx-auto`}>
                          <agent.icon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <h4 className={`text-base font-bold ${colors.text} mb-1`}>{agent.name}</h4>
                        <p className="text-white/80 text-xs font-medium mb-2">{agent.role}</p>
                        <p className="text-gray-400 text-xs">{agent.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Executive Secretary & Judge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Executive Secretary */}
              {agents.filter(a => a.tier === 'secretary').map((agent) => {
                const colors = getColorClasses(agent.color);
                return (
                  <div
                    key={agent.name}
                    className={`relative p-6 rounded-2xl synth-card border-2 border-purple-500/30 ${colors.glow}`}
                  >
                    <div className="absolute inset-0 rounded-2xl synth-sheen pointer-events-none" />
                    <div className="relative">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                          <agent.icon className={`w-7 h-7 ${colors.text}`} />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">6th Agent</span>
                          <h4 className={`text-lg font-bold ${colors.text}`}>{agent.name}</h4>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm font-medium mb-2">{agent.role}</p>
                      <p className="text-gray-400 text-sm">{agent.description}</p>
                    </div>
                  </div>
                );
              })}

              {/* Judge */}
              {agents.filter(a => a.tier === 'judge').map((agent) => {
                const colors = getColorClasses(agent.color);
                return (
                  <div
                    key={agent.name}
                    className={`relative p-6 rounded-2xl synth-card border-2 border-orange-500/30 ${colors.glow}`}
                  >
                    <div className="absolute inset-0 rounded-2xl synth-sheen pointer-events-none" />
                    <div className="relative">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                          <agent.icon className={`w-7 h-7 ${colors.text}`} />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">7th Agent — Final</span>
                          <h4 className={`text-lg font-bold ${colors.text}`}>{agent.name}</h4>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm font-medium mb-2">{agent.role}</p>
                      <p className="text-gray-400 text-sm">{agent.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Decision Flow Process */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h4 className="text-xl font-bold text-white text-center mb-6">The Decision Flow</h4>
              <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
                Every question or data analysis follows a rigorous deliberation process to ensure truth and accuracy.
              </p>
              
              <div className="synth-card rounded-2xl p-6 space-y-6">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center flex-shrink-0 text-cyan-400 font-bold text-sm">1</div>
                  <div>
                    <h5 className="text-white font-semibold mb-1">Question Enters the Senate Chamber</h5>
                    <p className="text-gray-400 text-sm">A question or data for analysis is submitted to the Supreme Court. All 5 Senate agents receive the input simultaneously.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-sm">2</div>
                  <div>
                    <h5 className="text-white font-semibold mb-1">Senate Deliberation</h5>
                    <p className="text-gray-400 text-sm">The 5 Senate agents—Skeptic, Optimist, Fact-Checker, Advocate, and Guardian—debate the most factual and accurate response. Each agent applies their specialized lens until consensus is reached.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold text-sm">3</div>
                  <div>
                    <h5 className="text-white font-semibold mb-1">Executive Secretary Review</h5>
                    <p className="text-gray-400 text-sm">The Senate's consensus is passed to the Executive Secretary, who reviews, cleans, and organizes the response. She confirms with the Senate: <span className="text-purple-300 italic">"This is what you want to present?"</span></p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center flex-shrink-0 text-amber-400 font-bold text-sm">4</div>
                  <div>
                    <h5 className="text-white font-semibold mb-1">Refinement Loop (If Needed)</h5>
                    <p className="text-gray-400 text-sm">If the Executive Secretary identifies improvements or concerns, she sends recommendations back to the Senate. The Senate reviews, deliberates again, and returns a refined decision. This cycle repeats until the Executive Secretary approves the final position.</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center flex-shrink-0 text-orange-400 font-bold text-sm">5</div>
                  <div>
                    <h5 className="text-white font-semibold mb-1">Submission to the Judge</h5>
                    <p className="text-gray-400 text-sm">Once the Executive Secretary gives final approval, the polished Senate position is submitted to the Judge for review.</p>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center flex-shrink-0 text-cyan-400 font-bold text-sm">6</div>
                  <div>
                    <h5 className="text-white font-semibold mb-1">Judge Formulates Final Answer</h5>
                    <p className="text-gray-400 text-sm">The Judge reviews the Senate's decision, aligns it with its own knowledge to verify truth, and formulates the final authoritative answer. This answer is then released or flagged for further action.</p>
                  </div>
                </div>

                {/* Visual Flow Diagram */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                    <span className="px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">Question In</span>
                    <span className="text-gray-500">→</span>
                    <span className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">5 Senators Debate</span>
                    <span className="text-gray-500">→</span>
                    <span className="px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">Executive Secretary</span>
                    <span className="text-gray-500 hidden sm:inline">⟲</span>
                    <span className="px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400">Judge</span>
                    <span className="text-gray-500">→</span>
                    <span className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">Final Answer</span>
                  </div>
                  <p className="text-center text-gray-500 text-xs mt-3">⟲ indicates potential refinement loop between Executive Secretary and Senate</p>
                </div>
              </div>
            </div>
          </section>

          {/* Output Modes */}
          <section>
            <h3 className="text-3xl font-bold text-white text-center mb-4">Output Modes</h3>
            <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
              Every request results in one of four possible outcomes
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {outcomes.map((outcome) => {
                const badgeClass = 
                  outcome.color === 'cyan' ? 'synth-badge-release' :
                  outcome.color === 'amber' ? 'synth-badge-partial' :
                  outcome.color === 'red' ? 'synth-badge-refuse' :
                  'synth-badge-review';
                const colors = getColorClasses(outcome.color);
                return (
                  <div
                    key={outcome.label}
                    className={`flex items-center gap-3 px-6 py-4 rounded-full ${badgeClass}`}
                  >
                    <outcome.icon className={`w-5 h-5 ${colors.text}`} />
                    <div>
                      <div className="font-bold text-sm">{outcome.label}</div>
                      <div className="text-gray-400 text-xs">{outcome.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Investor Positioning Section */}
          <section className="text-center py-12 border-t border-cyan-500/20">
            <div className="max-w-3xl mx-auto">
              <div className="inline-block synth-badge-release px-4 py-1 rounded-full text-xs font-semibold tracking-wider mb-6">
                INVESTOR POSITIONING
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">SYNTH™ is Already Built</h3>
              <p className="text-gray-400 mb-6">
                We've already built SYNTH™, our audit-grade AI governance engine:
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {['sanitize', 'debate', 'judge', 'verify', 'log', 'release'].map((step) => (
                  <span key={step} className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 text-sm font-medium">
                    {step}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                SYNTH™ is <span className="text-cyan-400 font-semibold">live today</span> as an API + web console, which proves the core system works.
              </p>
              <div className="synth-card rounded-xl p-6 text-left mb-8">
                <p className="text-sm text-gray-400 mb-4">
                  <strong className="text-white">Distribution channels</strong> (Chrome extension, partner integrations, SDKs) are thin clients that simply call the SYNTH™ API. That means we can ship new distribution fast without rebuilding the engine.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-white/5 border border-cyan-500/20">
                    <p className="text-cyan-400 font-semibold mb-1">Immediate Defensibility</p>
                    <p className="text-gray-400">Value is in the governance engine, not a UI wrapper</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-blue-500/20">
                    <p className="text-blue-400 font-semibold mb-1">Model-Agnostic</p>
                    <p className="text-gray-400">Swap underlying models as AI landscape evolves</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-emerald-500/20">
                    <p className="text-emerald-400 font-semibold mb-1">Enterprise-Ready</p>
                    <p className="text-gray-400">Logs, controls, and human review routing</p>
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
                className="synth-btn-primary font-semibold"
              >
                <Brain className="w-4 h-4 mr-2" />
                Console
              </Button>
              <Button
                onClick={() => navigate('/synth/logs')}
                variant="outline"
                className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
              >
                <FileText className="w-4 h-4 mr-2" />
                Logs
              </Button>
              <Button
                onClick={() => navigate('/synth/docs')}
                variant="outline"
                className="border-blue-500/40 text-blue-400 hover:bg-blue-500/10 bg-transparent"
              >
                <Code2 className="w-4 h-4 mr-2" />
                Docs
              </Button>
              <Button
                onClick={() => navigate('/synth/methodology')}
                variant="outline"
                className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 bg-transparent"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Methodology
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

export default Synth;
