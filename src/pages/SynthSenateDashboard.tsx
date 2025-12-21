import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Brain, 
  Scale, 
  History,
  BookOpen,
  Sparkles,
  Sliders,
  Send,
  Loader2
} from 'lucide-react';
import { SenateSeatCard, SeatBallot } from '@/components/synth/SenateSeatCard';
import { SenateJudgeCard, JudgeOutput } from '@/components/synth/SenateJudgeCard';
import { CalibrationPanel } from '@/components/synth/CalibrationPanel';
import { LearningRateChart } from '@/components/synth/LearningRateChart';
import { useIsAdmin } from '@/hooks/useIsAdmin';

// Default offline seat configuration
const createDefaultSeats = (): SeatBallot[] => [
  { seat_id: 1, provider: 'OpenAI', model: 'GPT-4o', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [] },
  { seat_id: 2, provider: 'Anthropic', model: 'Claude 3.5', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [] },
  { seat_id: 3, provider: 'Google', model: 'Gemini 1.5', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [] },
  { seat_id: 4, provider: 'Meta', model: 'Llama 3', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [] },
  { seat_id: 5, provider: 'DeepSeek', model: 'V3', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [] },
  { seat_id: 6, provider: 'Mistral', model: 'Large', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [] },
  { seat_id: 7, provider: 'xAI', model: 'Grok', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [] },
];

const SynthSenateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdmin } = useIsAdmin();
  
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [seats, setSeats] = useState<SeatBallot[]>(createDefaultSeats());
  const [judgeOutput, setJudgeOutput] = useState<JudgeOutput | null>(null);
  const [activeTab, setActiveTab] = useState('senate');
  
  const [weights] = useState({
    seat_1: 15, seat_2: 15, seat_3: 15, seat_4: 14, seat_5: 14, seat_6: 14, seat_7: 13
  });

  // Check for prefill from Chrome extension
  useEffect(() => {
    const prefillId = searchParams.get('prefill_id');
    if (prefillId) {
      loadPrefill(prefillId);
    }
  }, [searchParams]);

  const loadPrefill = async (prefillId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('synth-prefill', {
        body: { action: 'get', prefill_id: prefillId }
      });
      
      if (error) throw error;
      if (data?.selected_text) {
        setPrompt(data.selected_text);
        toast.success('Context loaded from extension');
      }
    } catch (error) {
      console.error('Failed to load prefill:', error);
    }
  };

  const handleSenateRun = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setSeats(createDefaultSeats());
    setJudgeOutput(null);

    try {
      const { data, error } = await supabase.functions.invoke('synth-senate-run', {
        body: { input_text: prompt.trim() }
      });

      if (error) throw error;

      if (data?.ballots) {
        setSeats(data.ballots);
      }
      if (data?.judge_output) {
        setJudgeOutput(data.judge_output);
      }

      toast.success(data?.contested ? 'Senate run complete (CONTESTED)' : 'Senate run complete');
    } catch (error) {
      console.error('Senate run error:', error);
      toast.error('Senate run failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock learning rate data
  const learningData = [
    { date: 'Week 1', errorRate: 45, eventCount: 12 },
    { date: 'Week 2', errorRate: 38, eventCount: 18 },
    { date: 'Week 3', errorRate: 32, eventCount: 22 },
    { date: 'Week 4', errorRate: 28, eventCount: 15 },
    { date: 'Week 5', errorRate: 25, eventCount: 20 },
  ];

  return (
    <div className="min-h-screen synth-bg">
      <Helmet>
        <title>SYNTH™ Senate Dashboard | 7-Seat AI Governance</title>
        <meta name="description" content="SYNTH™ Senate Dashboard - Multi-model AI governance with 7 seats and judicial synthesis" />
      </Helmet>

      {/* Grid overlay */}
      <div className="fixed inset-0 z-0 synth-grid opacity-50" />

      {/* Header */}
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
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-600 flex items-center justify-center synth-pulse">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg synth-neon-blue">SYNTH™ Senate</h1>
                <p className="text-xs text-gray-400">7-Seat AI Governance</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/synth/logs')} className="border-gray-600 text-gray-300 hover:bg-white/10 bg-transparent">
              <History className="w-4 h-4 mr-2" />
              Logs
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/synth/docs')} className="border-gray-600 text-gray-300 hover:bg-white/10 bg-transparent">
              <BookOpen className="w-4 h-4 mr-2" />
              Docs
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700 p-1">
            <TabsTrigger value="senate" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Scale className="w-4 h-4 mr-2" />
              Senate
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="calibration" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                <Sliders className="w-4 h-4 mr-2" />
                Calibration
              </TabsTrigger>
            )}
            <TabsTrigger value="learning" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <Sparkles className="w-4 h-4 mr-2" />
              Learning Rate
            </TabsTrigger>
          </TabsList>

          {/* Senate Tab */}
          <TabsContent value="senate" className="space-y-6">
            {/* Input Panel */}
            <Card className="synth-card border-0">
              <CardHeader>
                <CardTitle className="text-white">Senate Input</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your prompt to run through the 7-seat Senate for multi-model evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter the text you want the Senate to evaluate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] font-mono text-sm synth-terminal text-gray-200 placeholder:text-gray-500 border-gray-700 focus:border-cyan-500/50"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {prompt.length} characters • 7 seats will evaluate
                    </p>
                    <Button 
                      onClick={handleSenateRun} 
                      disabled={isLoading || !prompt.trim()}
                      className="synth-btn-primary"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Running Senate...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Run Senate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 7 Seat Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Senate Seats</h3>
                <Badge variant="outline" className="border-gray-600 text-gray-400">
                  {seats.filter(s => s.status === 'online').length}/7 Online
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {seats.map((seat) => (
                  <SenateSeatCard 
                    key={seat.seat_id} 
                    seat={seat} 
                    weight={weights[`seat_${seat.seat_id}` as keyof typeof weights] || 14}
                  />
                ))}
              </div>
            </div>

            {/* Judge Output */}
            {(judgeOutput || isLoading) && (
              <SenateJudgeCard 
                judge={judgeOutput || {
                  final_answer: '',
                  participation_summary: {},
                  contested: false,
                  trace_id: 'pending...'
                }}
                isLoading={isLoading && !judgeOutput}
              />
            )}
          </TabsContent>

          {/* Calibration Tab (Employer-only) */}
          {isAdmin && (
            <TabsContent value="calibration">
              <CalibrationPanel isEmployer={true} />
            </TabsContent>
          )}

          {/* Learning Rate Tab */}
          <TabsContent value="learning">
            <LearningRateChart 
              data={learningData}
              insufficientData={learningData.length < 3}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SynthSenateDashboard;
