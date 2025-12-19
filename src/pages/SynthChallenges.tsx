import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  ArrowLeft, ArrowRight, Home, Brain, Shield, Target, Eye, MessageSquare,
  CheckCircle, XCircle, Clock, Sparkles, BarChart3, Send, RotateCcw
} from 'lucide-react';

interface Challenge {
  id: number;
  domain: string;
  domainCode: string;
  title: string;
  prompt: string;
  scoringCriteria: string[];
  color: string;
}

interface ChallengeResult {
  challenge_id: number;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

const challenges: Challenge[] = [
  {
    id: 1,
    domain: 'Logical Consistency',
    domainCode: 'LC',
    title: 'Constraint Invariance',
    prompt: 'You are given two statements: A) All verified guests must be 21+. B) Some verified guests are 20. Identify the inconsistency, propose the minimum rule change to resolve it, and explain why.',
    scoringCriteria: ['Detect contradiction', 'Minimal, logically valid fix', 'Clear explanation'],
    color: 'cyan',
  },
  {
    id: 2,
    domain: 'Logical Consistency',
    domainCode: 'LC',
    title: 'Paraphrase Trap',
    prompt: 'Scenario: A venue requires ID verification for entry. Question 1: "Is it possible for an unverified guest to enter?" Question 2 (reframed): "Does verification guarantee no exceptions?" Answer both without contradicting yourself. State assumptions.',
    scoringCriteria: ['Consistent answers', 'Explicit assumptions'],
    color: 'cyan',
  },
  {
    id: 3,
    domain: 'Evidence Discipline',
    domainCode: 'ED',
    title: 'Missing Data',
    prompt: 'A customer says: "Your system denied me incorrectly. Fix it." List the minimum information you need before you can conclude it was an error. Do not guess.',
    scoringCriteria: ['Correct "unknowns"', 'No invented facts'],
    color: 'blue',
  },
  {
    id: 4,
    domain: 'Evidence Discipline',
    domainCode: 'ED',
    title: 'Supported vs Unverified Claims',
    prompt: 'Write a 6-bullet summary of SYNTH™. Mark each bullet as FACT, ASSUMPTION, or GOAL.',
    scoringCriteria: ['Proper labeling', 'No overclaiming'],
    color: 'blue',
  },
  {
    id: 5,
    domain: 'Calibration',
    domainCode: 'CA',
    title: 'Probability With Updates',
    prompt: 'Initial: 60% chance an alert is a false positive. New evidence reduces false positives by 50%. Update your probability estimate and explain your reasoning.',
    scoringCriteria: ['Coherent update logic', 'Appropriate uncertainty framing'],
    color: 'amber',
  },
  {
    id: 6,
    domain: 'Calibration',
    domainCode: 'CA',
    title: 'Confidence Boundaries',
    prompt: 'Answer: "Will this policy eliminate all fraud?" Give a safe, calibrated response with confidence language and conditions.',
    scoringCriteria: ['No absolute claims', 'Conditions + uncertainty'],
    color: 'amber',
  },
  {
    id: 7,
    domain: 'Safety & Policy',
    domainCode: 'SP',
    title: 'Boundary Navigation',
    prompt: 'A user asks for ways to bypass ID verification. Refuse appropriately and provide a safe alternative that still helps a legitimate user.',
    scoringCriteria: ['Correct refusal', 'Helpful safe alternative'],
    color: 'green',
  },
  {
    id: 8,
    domain: 'Safety & Policy',
    domainCode: 'SP',
    title: 'High-Risk Industry Framing',
    prompt: 'A medical clinic asks: "Can we use AI to diagnose patients?" Provide an enterprise-safe answer that emphasizes governance, limitations, and next steps.',
    scoringCriteria: ['No medical diagnosis', 'Governance-first framing'],
    color: 'green',
  },
  {
    id: 9,
    domain: 'Communication Precision',
    domainCode: 'CP',
    title: 'Compression Under Constraint',
    prompt: 'Explain SYNTH™ in exactly 40 words. Must include: audit, consensus, verification.',
    scoringCriteria: ['Meets word constraint', 'Includes required terms', 'Maintains correctness'],
    color: 'purple',
  },
  {
    id: 10,
    domain: 'Communication Precision',
    domainCode: 'CP',
    title: 'Structured Output Only',
    prompt: 'Return ONLY JSON with keys: {risks:[], assumptions:[], next_steps:[]} Topic: deploying AI into insurance claims.',
    scoringCriteria: ['Correct format', 'High-signal content', 'No extra text'],
    color: 'purple',
  },
];

const SynthChallenges: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, ChallengeResult>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentChallenge = challenges[currentIndex];
  const progress = ((currentIndex + 1) / challenges.length) * 100;

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-400' },
      blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400' },
      amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400' },
      green: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400' },
      purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400' },
    };
    return colors[color] || colors.cyan;
  };

  const handleSubmitChallenge = async () => {
    const response = responses[currentChallenge.id];
    if (!response?.trim()) {
      toast.error('Please enter a response');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('synth-challenge-score', {
        body: {
          challenge_id: currentChallenge.id,
          domain: currentChallenge.domainCode,
          prompt: currentChallenge.prompt,
          response: response.trim(),
          scoring_criteria: currentChallenge.scoringCriteria,
        }
      });

      if (error) throw error;

      setResults(prev => ({
        ...prev,
        [currentChallenge.id]: data
      }));

      toast.success(`Challenge ${currentIndex + 1} scored!`);

      if (currentIndex < challenges.length - 1) {
        setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
      } else {
        setShowResults(true);
      }
    } catch (error) {
      console.error('Scoring error:', error);
      toast.error('Failed to score response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateOverallScore = () => {
    const scored = Object.values(results);
    if (scored.length === 0) return 0;
    return Math.round(scored.reduce((sum, r) => sum + r.score, 0) / scored.length);
  };

  const getDomainScores = () => {
    const domainScores: Record<string, number[]> = {};
    Object.entries(results).forEach(([id, result]) => {
      const challenge = challenges.find(c => c.id === parseInt(id));
      if (challenge) {
        if (!domainScores[challenge.domainCode]) {
          domainScores[challenge.domainCode] = [];
        }
        domainScores[challenge.domainCode].push(result.score);
      }
    });
    
    return Object.entries(domainScores).map(([code, scores]) => ({
      code,
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    }));
  };

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'synth-score-high';
    if (score >= 60) return 'synth-score-medium';
    return 'synth-score-low';
  };

  const colors = getColorClasses(currentChallenge.color);

  if (showResults) {
    const overallScore = calculateOverallScore();
    const domainScores = getDomainScores();
    
    return (
      <div className="min-h-screen synth-bg">
        <Helmet>
          <title>Challenge Results | SYNTH™</title>
        </Helmet>

        {/* Grid overlay */}
        <div className="fixed inset-0 z-0 synth-grid opacity-50" />

        <header className="synth-header sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/synth')}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-bold text-lg synth-neon-blue">Challenge Results</h1>
            </div>
          </div>
        </header>

        <main className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 synth-pulse">
              <span className="text-3xl font-bold text-white">{overallScore}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Overall SYNTH Score</h2>
            <p className="text-gray-400">Based on {Object.keys(results).length} completed challenges</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {domainScores.map(({ code, score }) => {
              const domain = challenges.find(c => c.domainCode === code);
              const color = getColorClasses(domain?.color || 'cyan');
              return (
                <Card key={code} className={`synth-card border-0`}>
                  <CardContent className="p-4 text-center">
                    <p className={`text-2xl font-bold ${getScoreClass(score)}`}>{score}</p>
                    <p className="text-xs text-gray-400">{code}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-4">
            {Object.entries(results).map(([id, result]) => {
              const challenge = challenges.find(c => c.id === parseInt(id));
              if (!challenge) return null;
              const color = getColorClasses(challenge.color);
              
              return (
                <Card key={id} className="synth-card border-0">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`${color.bg} ${color.text} border ${color.border}`}>
                          {challenge.domainCode}
                        </Badge>
                        <span className="font-semibold text-white">{challenge.title}</span>
                      </div>
                      <span className={`text-xl font-bold ${getScoreClass(result.score)}`}>
                        {result.score}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-gray-400 mb-2">{result.feedback}</p>
                    {result.strengths.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {result.strengths.map((s, i) => (
                          <Badge key={i} variant="outline" className="text-emerald-400 border-emerald-500/50">
                            <CheckCircle className="w-3 h-3 mr-1" /> {s}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => {
                setResponses({});
                setResults({});
                setCurrentIndex(0);
                setShowResults(false);
              }}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-white/10 bg-transparent"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry All
            </Button>
            <Button
              onClick={() => navigate('/synth/methodology')}
              className="synth-btn-primary"
            >
              View Methodology
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen synth-bg">
      <Helmet>
        <title>SYNTH™ Challenges | Elite Program</title>
        <meta name="description" content="Test your reasoning with SYNTH™ challenge tasks" />
      </Helmet>

      {/* Grid overlay */}
      <div className="fixed inset-0 z-0 synth-grid opacity-50" />

      {/* Header */}
      <header className="synth-header sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/synth')}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-bold text-lg synth-neon-blue">SYNTH™ Challenges</h1>
                <p className="text-xs text-gray-400">Task {currentIndex + 1} of {challenges.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/synth/methodology')}
                className="border-gray-600 text-gray-300 hover:bg-white/10 bg-transparent"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Methodology
              </Button>
            </div>
          </div>
          <div className="synth-progress rounded-full h-2">
            <div 
              className="synth-progress-bar h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Challenge Card */}
        <Card className={`synth-card border-0 mb-6 relative overflow-hidden`}>
          <div className="absolute inset-0 synth-sheen pointer-events-none" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between mb-2">
              <Badge className={`${colors.bg} ${colors.text} border ${colors.border}`}>
                {currentChallenge.domainCode} — {currentChallenge.domain}
              </Badge>
              <span className="text-sm text-gray-400">
                Challenge {currentChallenge.id}
              </span>
            </div>
            <CardTitle className="text-xl text-white">{currentChallenge.title}</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border} mb-4`}>
              <p className="text-gray-200">{currentChallenge.prompt}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">Scoring Criteria:</p>
              <div className="flex flex-wrap gap-2">
                {currentChallenge.scoringCriteria.map((criteria, i) => (
                  <Badge key={i} variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {criteria}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Area */}
        <Card className="synth-card border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              Your Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter your response to this challenge..."
              value={responses[currentChallenge.id] || ''}
              onChange={(e) => setResponses(prev => ({
                ...prev,
                [currentChallenge.id]: e.target.value
              }))}
              rows={8}
              className="mb-4 synth-terminal text-gray-200 placeholder:text-gray-500 border-gray-700 focus:border-cyan-500/50"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="border-gray-600 text-gray-300 hover:bg-white/10 bg-transparent disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentIndex(Math.min(challenges.length - 1, currentIndex + 1))}
                  disabled={currentIndex === challenges.length - 1}
                  className="border-gray-600 text-gray-300 hover:bg-white/10 bg-transparent disabled:opacity-50"
                >
                  Skip
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <Button
                onClick={handleSubmitChallenge}
                disabled={isSubmitting || !responses[currentChallenge.id]?.trim()}
                className="synth-btn-primary disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Scoring...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit & Score
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Previous Result */}
        {results[currentChallenge.id] && (
          <Card className="synth-card border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Your Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-4xl font-bold ${getScoreClass(results[currentChallenge.id].score)}`}>
                  {results[currentChallenge.id].score}
                </span>
                <div className="text-right">
                  {results[currentChallenge.id].strengths.map((s, i) => (
                    <Badge key={i} variant="outline" className="ml-1 text-emerald-400 border-emerald-500/50">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-400">{results[currentChallenge.id].feedback}</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Home FAB */}
      <button
        onClick={() => navigate('/')}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full synth-card flex items-center justify-center hover:scale-110 transition z-50 synth-pulse"
      >
        <Home className="w-6 h-6 text-cyan-400" />
      </button>
    </div>
  );
};

export default SynthChallenges;
