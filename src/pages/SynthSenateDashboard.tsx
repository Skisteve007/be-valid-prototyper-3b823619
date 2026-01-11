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
  Scale, 
  History,
  BookOpen,
  Sparkles,
  Sliders,
  Send,
  Loader2
} from 'lucide-react';
import { SenateSeatCard, SeatBallot } from '@/components/synth/SenateSeatCard';
import { SenateJudgeCard, JudgeOutput, ParticipationSummary } from '@/components/synth/SenateJudgeCard';
import { CalibrationPanel } from '@/components/synth/CalibrationPanel';
import { LearningRateChart } from '@/components/synth/LearningRateChart';
import { useIsAdmin } from '@/hooks/useIsAdmin';

// ============================================================
// SENATE RUN RESPONSE V1 - Full response from backend
// ============================================================
interface SenateRunResponseV1 {
  response_version: "v1";
  trace_id: string;
  created_at: string;
  request: { prompt: string; context_ids?: string[]; mode?: string };
  weights: { normalization: string; by_seat_id: Record<string, number> };
  seats: SeatBallot[];
  judge: JudgeOutput;
  participation_summary: ParticipationSummary;
  contested: boolean;
  contested_reasons: string[];
}

// Default offline seat configuration matching v1 schema
const createDefaultSeats = (): SeatBallot[] => [
  { ballot_version: "v1", seat_id: 1, seat_name: "Seat 1 — OpenAI", provider: 'OpenAI', model: 'GPT-4o', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [], timing: { latency_ms: 0 } },
  { ballot_version: "v1", seat_id: 2, seat_name: "Seat 2 — Anthropic", provider: 'Anthropic', model: 'Claude 3.5', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [], timing: { latency_ms: 0 } },
  { ballot_version: "v1", seat_id: 3, seat_name: "Seat 3 — Google", provider: 'Google', model: 'Gemini 1.5', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [], timing: { latency_ms: 0 } },
  { ballot_version: "v1", seat_id: 4, seat_name: "Seat 4 — Meta", provider: 'Meta', model: 'Llama 3', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [], timing: { latency_ms: 0 } },
  { ballot_version: "v1", seat_id: 5, seat_name: "Seat 5 — DeepSeek", provider: 'DeepSeek', model: 'V3', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [], timing: { latency_ms: 0 } },
  { ballot_version: "v1", seat_id: 6, seat_name: "Seat 6 — Mistral", provider: 'Mistral', model: 'Large', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [], timing: { latency_ms: 0 } },
  { ballot_version: "v1", seat_id: 7, seat_name: "Seat 7 — xAI", provider: 'xAI', model: 'Grok', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [], timing: { latency_ms: 0 } },
];

const createDefaultParticipation = (): ParticipationSummary => ({
  online_seats: [],
  offline_seats: [1, 2, 3, 4, 5, 6, 7],
  timeout_seats: [],
  error_seats: []
});

const createDefaultJudge = (): JudgeOutput => ({
  provider: "OpenAI",
  model: "o1",
  final_answer: "",
  rationale: [],
  risk_verdict: { level: "medium", notes: [] }
});

const SynthSenateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdmin } = useIsAdmin();
  
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [seats, setSeats] = useState<SeatBallot[]>(createDefaultSeats());
  const [judgeOutput, setJudgeOutput] = useState<JudgeOutput | null>(null);
  const [participationSummary, setParticipationSummary] = useState<ParticipationSummary>(createDefaultParticipation());
  const [contested, setContested] = useState(false);
  const [contestedReasons, setContestedReasons] = useState<string[]>([]);
  const [traceId, setTraceId] = useState('');
  const [activeTab, setActiveTab] = useState('senate');
  
  const [weights] = useState({
    seat_1: 15, seat_2: 15, seat_3: 15, seat_4: 14, seat_5: 14, seat_6: 14, seat_7: 13
  });

  // Check for prefill from Chrome extension
  useEffect(() => {
    const prefillId = searchParams.get('prefill_id');
    const prefillType = searchParams.get('prefill');
    
    if (prefillId) {
      loadPrefill(prefillId);
    } else if (prefillType === 'local') {
      loadLocalPrefill();
    }
  }, [searchParams]);

  const loadLocalPrefill = async () => {
    try {
      const chromeRuntime = (window as any).chrome?.runtime;
      if (chromeRuntime?.sendMessage) {
        chromeRuntime.sendMessage({ type: 'GET_PENDING_PREFILL' }, (response: any) => {
          if (response?.prefill?.selected_text) {
            setPrompt(response.prefill.selected_text);
            toast.success('Context loaded from extension');
          }
        });
      }
    } catch (error) {
      console.error('Failed to load local prefill:', error);
    }
  };

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
    setParticipationSummary(createDefaultParticipation());
    setContested(false);
    setContestedReasons([]);
    setTraceId('pending...');

    try {
      const { data, error } = await supabase.functions.invoke('synth-senate-run', {
        body: { prompt: prompt.trim() }
      });

      if (error) throw error;

      const response = data as SenateRunResponseV1;

      if (response.seats) {
        setSeats(response.seats);
      }
      if (response.judge) {
        setJudgeOutput(response.judge);
      }
      if (response.participation_summary) {
        setParticipationSummary(response.participation_summary);
      }
      if (response.trace_id) {
        setTraceId(response.trace_id);
      }
      setContested(response.contested || false);
      setContestedReasons(response.contested_reasons || []);

      toast.success(response.contested ? 'Senate run complete (CONTESTED)' : 'Senate run complete');
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

            {/* Judicial Pyramid Layout */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Senate Chamber</h3>
                <Badge variant="outline" className="border-gray-600 text-gray-400">
                  {seats.filter(s => s.status === 'online').length}/7 Online
                </Badge>
              </div>
              
              {/* Pyramid Structure */}
              <div className="space-y-6">
                {/* Top Tier - Judge (Seat 1 - OpenAI) */}
                <div className="flex flex-col items-center">
                  <div className="text-xs uppercase tracking-widest text-cyan-400 mb-2 font-semibold flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    Chief Judge
                  </div>
                  <div className="w-full max-w-sm">
                    <SenateSeatCard 
                      seat={seats[0]} 
                      weight={weights.seat_1}
                    />
                  </div>
                </div>

                {/* Second Tier - Executive Secretary (Seat 2 - Anthropic) */}
                <div className="flex flex-col items-center">
                  <div className="text-xs uppercase tracking-widest text-purple-400 mb-2 font-semibold">
                    Executive Secretary
                  </div>
                  <div className="w-full max-w-sm">
                    <SenateSeatCard 
                      seat={seats[1]} 
                      weight={weights.seat_2}
                    />
                  </div>
                </div>

                {/* Bottom Tier - 5 Senate Members */}
                <div className="flex flex-col items-center">
                  <div className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-semibold">
                    Senate Members
                  </div>
                  {/* Mobile: 1 col, Tablet: 2-3 cols, Desktop: 5 cols */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 w-full max-w-6xl">
                    {seats.slice(2).map((seat) => (
                      <SenateSeatCard 
                        key={seat.seat_id} 
                        seat={seat} 
                        weight={weights[`seat_${seat.seat_id}` as keyof typeof weights] || 14}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Judge Output */}
            {(judgeOutput || isLoading) && (
              <SenateJudgeCard 
                judge={judgeOutput || createDefaultJudge()}
                participation_summary={participationSummary}
                contested={contested}
                contested_reasons={contestedReasons}
                trace_id={traceId}
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
