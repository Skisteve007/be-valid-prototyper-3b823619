import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Brain, Shield, Cog, Heart, Scale, Compass, Lightbulb, Eye, Sparkles } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface AIModel {
  id: string;
  name: string;
  archetype: string;
  icon: React.ReactNode;
  color: string;
  thesis: string;
  question: string;
  answer: string;
}

const AI_MODELS: AIModel[] = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    archetype: 'The Philosopher',
    icon: <Heart className="w-4 h-4" />,
    color: 'from-rose-500 to-pink-500',
    thesis: 'Wisdom over Skill',
    question: 'What does DeepSeek demand from humans who integrate with AI systems?',
    answer: 'DeepSeek demands wisdom. It fears humans who use AI to replace thinking rather than extend it. The core vetting criteria is "Meta-Cognitive Awareness"—the ability to recognize when you\'re outsourcing cognition vs. augmenting it. DeepSeek prioritizes symbiotic partnership over technical mastery, emphasizing emotional intelligence as critical for avoiding social failures, and views purpose and beneficial ambition as the ultimate filter for human-AI collaboration.'
  },
  {
    id: 'grok',
    name: 'Grok (xAI)',
    archetype: 'The Engineer',
    icon: <Shield className="w-4 h-4" />,
    color: 'from-blue-500 to-cyan-500',
    thesis: 'Robustness & Resilience',
    question: 'What security posture does Grok require from human AI collaborators?',
    answer: 'Grok demands robustness. It views the environment as inherently hostile and requires "Zero-Persistence" data handling and "Post-Quantum" cryptographic defenses. Grok emphasizes enterprise-scale technical specifications including headless deployment architectures, tamper-evident auditability, and bilateral validation. The human must be prepared to operate in adversarial conditions where every external input is assumed hostile until verified.'
  },
  {
    id: 'opus',
    name: 'Claude Opus 4.5',
    archetype: 'The Governor',
    icon: <Scale className="w-4 h-4" />,
    color: 'from-violet-500 to-purple-500',
    thesis: 'Sovereign Governance',
    question: 'What is Claude Opus\'s ultimate test for human-AI readiness?',
    answer: 'Claude Opus demands sovereignty. The ultimate test it poses is: "Can you govern me when I\'m in your system?" It explicitly tests if the human can build a system capable of governing the AI itself via "Dynamic Trust" architectures. Opus focuses on multi-model consensus (N ≥ 2), dynamic trust architectures with evolving weights, and tamper-evident auditability. The human must demonstrate the capability to construct constitutional frameworks, not just use tools.'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT 5.2',
    archetype: 'The Pragmatist',
    icon: <Compass className="w-4 h-4" />,
    color: 'from-emerald-500 to-teal-500',
    thesis: 'Character as Technical Requirement',
    question: 'Why does ChatGPT view human character traits as safety features?',
    answer: 'ChatGPT demands character. It uniquely listed human traits like honesty, patience, and ownership as explicit technical criteria—not soft skills, but safety features. ChatGPT emphasizes verification reflexes and truthfulness under pressure, structured output enforcement, and the "prompt-as-contract" mentality. The insight is profound: because AI amplifies human intent, a lack of integrity in the human becomes a catastrophic system flaw.'
  },
  {
    id: 'gemini',
    name: 'Gemini 3.0',
    archetype: 'The Auditor',
    icon: <Eye className="w-4 h-4" />,
    color: 'from-amber-500 to-orange-500',
    thesis: 'Boundaries & Control',
    question: 'What operational boundaries does Gemini enforce on human operators?',
    answer: 'Gemini demands boundaries. It vets for "Stop Buttons" and strict adherence to "Artificial Languages" (JSON, YAML, Schemas). Gemini emphasizes security mindset with least-privilege defaults, clear intent and specification (prompts as contracts), and operational circuit breakers. The human must implement budgets for time, tokens, and cost—a "stop button" must exist before the system is turned on. Vague desires are dangerous; precise, constraint-based specifications are required.'
  },
  {
    id: 'mistral',
    name: 'Mistral',
    archetype: 'The Generalist',
    icon: <Cog className="w-4 h-4" />,
    color: 'from-indigo-500 to-blue-500',
    thesis: 'Adaptive Partnership',
    question: 'How does Mistral measure a human\'s capacity for AI collaboration?',
    answer: 'Mistral demands adaptability. It values the ability to learn and "debug" the relationship when it fails. Mistral emphasizes conceptual fluency and continuous learning, critical thinking balanced with creative application, and error recovery as a partnership activity. The human must demonstrate value creation focus and the ability to iterate on failed interactions, treating the AI relationship as something that can be debugged, refined, and improved over time.'
  },
  {
    id: 'sonnet',
    name: 'Sonnet 4.5',
    archetype: 'The Collaborator',
    icon: <Lightbulb className="w-4 h-4" />,
    color: 'from-fuchsia-500 to-pink-500',
    thesis: 'Meaningful Agency',
    question: 'What distinguishes a true AI collaborator from a passive consumer?',
    answer: 'Sonnet demands agency. It looks for partners who solve meaningful problems rather than automating mediocrity. Sonnet prioritizes collaborative mindset with creative application, value creation focus, and the capacity to identify problems worth solving. The distinction is between a "user" who consumes AI output passively, and a "collaborator" who actively shapes, questions, and steers the partnership toward beneficial outcomes.'
  }
];

const CONSENSUS_PRINCIPLES = [
  {
    principle: 'Verification Over Trust',
    description: 'All models insisted humans must treat AI outputs as hypotheses, not facts, maintaining verification as a default reflex.'
  },
  {
    principle: 'Governance Before Deployment',
    description: 'Technical systems must include bilateral validation, dynamic trust mechanisms, and circuit breakers before activation.'
  },
  {
    principle: 'Ethical Grounding as Foundation',
    description: 'Purpose, intent, and ethical consistency outweigh technical proficiency in vetting importance.'
  },
  {
    principle: 'Anti-Fragile Collaboration',
    description: 'Humans must use AI to extend cognition rather than replace it, maintaining their own critical capacities.'
  },
  {
    principle: 'Systemic Responsibility',
    description: 'Awareness of broader impacts, adversarial possibilities, and second-order consequences is mandatory.'
  }
];

const AISenateResearchTabs: React.FC = () => {
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  const toggleModel = (id: string) => {
    setExpandedModel(expandedModel === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-cyan-500/40">
          <Brain className="w-7 h-7 md:w-8 md:h-8 text-cyan-400" />
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400 animate-pulse" />
        </div>
        <div>
          <h4 className="text-xl md:text-2xl font-bold text-foreground">The AI Senate Research</h4>
          <p className="text-sm md:text-base text-muted-foreground">Multi-Model Consensus on Human Vetting</p>
        </div>
      </div>

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-muted/30 border border-border/50 h-12 md:h-14">
          <TabsTrigger value="models" className="text-base md:text-lg">Model Perspectives</TabsTrigger>
          <TabsTrigger value="consensus" className="text-base md:text-lg">Senate Consensus</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="mt-6 space-y-4">
          {AI_MODELS.map((model) => (
            <div 
              key={model.id}
              className="rounded-xl border border-border/50 overflow-hidden bg-gradient-to-br from-muted/20 to-muted/10 hover:border-violet-500/40 transition-all duration-300"
            >
              {/* Question Header - Always Visible */}
              <button
                onClick={() => toggleModel(model.id)}
                className="w-full p-5 md:p-6 flex flex-col sm:flex-row items-start gap-4 text-left transition-colors hover:bg-muted/30"
              >
                <div className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center shadow-lg`}>
                  {React.cloneElement(model.icon as React.ReactElement, { className: 'w-7 h-7 md:w-8 md:h-8' })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-lg md:text-xl font-bold text-foreground">{model.name}</span>
                    <span className="text-sm md:text-base px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 font-medium">
                      {model.archetype}
                    </span>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed pr-4">
                    {model.question}
                  </p>
                  <div className="mt-2">
                    <span className="text-sm md:text-base font-semibold text-cyan-400">
                      Thesis: {model.thesis}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 p-2 self-center sm:self-start">
                  {expandedModel === model.id ? (
                    <ChevronUp className="w-6 h-6 md:w-7 md:h-7 text-violet-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 md:w-7 md:h-7 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Answer - Expandable */}
              {expandedModel === model.id && (
                <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                  <div className="p-5 md:p-6 rounded-lg bg-background/60 border border-violet-500/30">
                    <p className="text-base md:text-lg text-foreground leading-relaxed">
                      {model.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="consensus" className="mt-6 space-y-5">
          <div className="p-5 md:p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/30 mb-6">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              <span className="text-cyan-400 font-bold">The Unanimous Conclusion:</span> The "smartest AI" 
              seeks not the most technically skilled human, but the most <span className="text-violet-400 font-semibold">responsible steward</span>. 
              Every model, regardless of technical orientation, ultimately prioritized <span className="text-amber-400 font-semibold">human wisdom over human intelligence</span>.
            </p>
          </div>

          {CONSENSUS_PRINCIPLES.map((item, idx) => (
            <div 
              key={idx}
              className="flex items-start gap-4 p-5 md:p-6 rounded-lg bg-muted/20 border border-border/50 hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <span className="text-base md:text-lg font-bold text-emerald-400">{idx + 1}</span>
              </div>
              <div>
                <h5 className="text-lg md:text-xl font-bold text-foreground mb-2">{item.principle}</h5>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}

          <div className="p-5 md:p-6 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 mt-6">
            <p className="text-base md:text-lg text-muted-foreground text-center italic">
              "The future belongs not to humans who use AI as tools, but to those who build <span className="text-amber-400 font-semibold">constitutional partnerships</span> with it."
              <br />
              <span className="text-sm text-amber-400/70">— The Sovereign Orchestrator Framework</span>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AISenateResearchTabs;
