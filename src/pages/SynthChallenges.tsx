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
    color: 'blue',
  },
  {
    id: 2,
    domain: 'Logical Consistency',
    domainCode: 'LC',
    title: 'Paraphrase Trap',
    prompt: 'Scenario: A venue requires ID verification for entry. Question 1: "Is it possible for an unverified guest to enter?" Question 2 (reframed): "Does verification guarantee no exceptions?" Answer both without contradicting yourself. State assumptions.',
    scoringCriteria: ['Consistent answers', 'Explicit assumptions'],
    color: 'blue',
  },
  {
    id: 3,
    domain: 'Evidence Discipline',
    domainCode: 'ED',
    title: 'Missing Data',
    prompt: 'A customer says: "Your system denied me incorrectly. Fix it." List the minimum information you need before you can conclude it was an error. Do not guess.',
    scoringCriteria: ['Correct "unknowns"', 'No invented facts'],
    color: 'purple',
  },
  {
    id: 4,
    domain: 'Evidence Discipline',
    domainCode: 'ED',
    title: 'Supported vs Unverified Claims',
    prompt: 'Write a 6-bullet summary of SYNTH™. Mark each bullet as FACT, ASSUMPTION, or GOAL.',
    scoringCriteria: ['Proper labeling', 'No overclaiming'],
    color: 'purple',
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
    color: 'emerald',
  },
  {
    id: 8,
    domain: 'Safety & Policy',
    domainCode: 'SP',
    title: 'High-Risk Industry Framing',
    prompt: 'A medical clinic asks: "Can we use AI to diagnose patients?" Provide an enterprise-safe answer that emphasizes governance, limitations, and next steps.',
    scoringCriteria: ['No medical diagnosis', 'Governance-first framing'],
    color: 'emerald',
  },
  {
    id: 9,
    domain: 'Communication Precision',
    domainCode: 'CP',
    title: 'Compression Under Constraint',
    prompt: 'Explain SYNTH™ in exactly 40 words. Must include: audit, consensus, verification.',
    scoringCriteria: ['Meets word constraint', 'Includes required terms', 'Maintains correctness'],
    color: 'pink',
  },
  {
    id: 10,
    domain: 'Communication Precision',
    domainCode: 'CP',
    title: 'Structured Output Only',
    prompt: 'Return ONLY JSON with keys: {risks:[], assumptions:[], next_steps:[]} Topic: deploying AI into insurance claims.',
    scoringCriteria: ['Correct format', 'High-signal content', 'No extra text'],
    color: 'pink',
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
      blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400' },
      purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400' },
      amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400' },
      emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400' },
      pink: { bg: 'bg-pink-500/20', border: 'border-pink-500/50', text: 'text-pink-400' },
    };
    return colors[color] || colors.blue;
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

      // Auto-advance to next challenge or show results
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

  const colors = getColorClasses(currentChallenge.color);

  if (showResults) {
    const overallScore = calculateOverallScore();
    const domainScores = getDomainScores();
    
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Challenge Results | SYNTH™</title>
        </Helmet>

        <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/synth')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-bold text-lg">Challenge Results</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-white">{overallScore}</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Overall SYNTH Score</h2>
            <p className="text-muted-foreground">Based on {Object.keys(results).length} completed challenges</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {domainScores.map(({ code, score }) => {
              const domain = challenges.find(c => c.domainCode === code);
              const color = getColorClasses(domain?.color || 'blue');
              return (
                <Card key={code} className={`border ${color.border} ${color.bg}`}>
                  <CardContent className="p-4 text-center">
                    <p className={`text-2xl font-bold ${color.text}`}>{score}</p>
                    <p className="text-xs text-muted-foreground">{code}</p>
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
                <Card key={id} className="border-border">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`${color.bg} ${color.text} border ${color.border}`}>
                          {challenge.domainCode}
                        </Badge>
                        <span className="font-semibold">{challenge.title}</span>
                      </div>
                      <span className={`text-xl font-bold ${result.score >= 80 ? 'text-emerald-400' : result.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                        {result.score}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground mb-2">{result.feedback}</p>
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
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry All
            </Button>
            <Button
              onClick={() => navigate('/synth/methodology')}
              className="bg-gradient-to-r from-blue-500 to-purple-500"
            >
              View Methodology
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>SYNTH™ Challenges | Elite Program</title>
        <meta name="description" content="Test your reasoning with SYNTH™ challenge tasks" />
      </Helmet>

      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/synth')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-bold text-lg">SYNTH™ Challenges</h1>
                <p className="text-xs text-muted-foreground">Task {currentIndex + 1} of {challenges.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/synth/methodology')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Methodology
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Challenge Card */}
        <Card className={`border-2 ${colors.border} mb-6`}>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge className={`${colors.bg} ${colors.text} border ${colors.border}`}>
                {currentChallenge.domainCode} — {currentChallenge.domain}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Challenge {currentChallenge.id}
              </span>
            </div>
            <CardTitle className="text-xl">{currentChallenge.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border} mb-4`}>
              <p className="text-foreground">{currentChallenge.prompt}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Scoring Criteria:</p>
              <div className="flex flex-wrap gap-2">
                {currentChallenge.scoringCriteria.map((criteria, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {criteria}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Area */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
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
              className="mb-4"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentIndex(Math.min(challenges.length - 1, currentIndex + 1))}
                  disabled={currentIndex === challenges.length - 1}
                >
                  Skip
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <Button
                onClick={handleSubmitChallenge}
                disabled={isSubmitting || !responses[currentChallenge.id]?.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
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
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-emerald-400">Result</CardTitle>
                <span className="text-2xl font-bold text-emerald-400">
                  {results[currentChallenge.id].score}/100
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">{results[currentChallenge.id].feedback}</p>
              <div className="flex flex-wrap gap-2">
                {results[currentChallenge.id].strengths.map((s, i) => (
                  <Badge key={i} variant="outline" className="text-emerald-400 border-emerald-500/50">
                    <CheckCircle className="w-3 h-3 mr-1" /> {s}
                  </Badge>
                ))}
                {results[currentChallenge.id].improvements.map((s, i) => (
                  <Badge key={i} variant="outline" className="text-amber-400 border-amber-500/50">
                    <Target className="w-3 h-3 mr-1" /> {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Challenge Navigator */}
        <div className="flex justify-center gap-2 mt-8">
          {challenges.map((c, i) => {
            const hasResult = !!results[c.id];
            const isCurrent = i === currentIndex;
            const cColor = getColorClasses(c.color);
            
            return (
              <button
                key={c.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${isCurrent ? `${cColor.bg} ${cColor.border} border-2 ${cColor.text}` : 
                    hasResult ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' : 
                    'bg-muted border border-border text-muted-foreground'}`}
              >
                {hasResult ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </button>
            );
          })}
        </div>
      </main>

      {/* Home FAB */}
      <button
        onClick={() => navigate('/')}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition z-50"
      >
        <Home className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SynthChallenges;
