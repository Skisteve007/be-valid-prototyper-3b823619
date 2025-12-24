import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRight, BookOpen, Bot, Brain, ScrollText, Settings2, 
  BarChart3, FileText, Sliders, Lightbulb, RefreshCw,
  CheckCircle, Shield, XCircle, UserCheck, AlertTriangle,
  Scale, Send, Loader2, Gavel
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ThinkTankManager from "./ThinkTankManager";
import { SenateSeatCard, SeatBallot } from "@/components/synth/SenateSeatCard";
import { SenateJudgeCard, JudgeOutput, ParticipationSummary } from "@/components/synth/SenateJudgeCard";

interface AuditLog {
  id: string;
  request_id: string;
  created_at: string;
  user_role: string;
  risk_decision: string;
  outcome: string;
  coherence_score: number;
  verification_score: number;
  sanitized_prompt: string;
  redaction_summary: Record<string, number> | null;
  agent_outputs: Record<string, unknown> | null;
  judge_output: Record<string, unknown> | null;
  verification_results: Record<string, unknown> | null;
  final_answer: string | null;
}

interface Policy {
  id: string;
  policy_name: string;
  coherence_threshold: number;
  verification_threshold: number;
  storage_mode: string;
  is_active: boolean;
  updated_at: string;
}

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

// Default offline seat configuration - 6 Senators + 1 Judge architecture
const createDefaultSeats = (): SeatBallot[] => [
  { ballot_version: "v1", seat_id: 1, seat_name: "Senator 1 — OpenAI", provider: 'OpenAI', model: 'GPT-4o', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [], timing: { latency_ms: 0 } },
  { ballot_version: "v1", seat_id: 2, seat_name: "Senator 2 — Anthropic", provider: 'Anthropic', model: 'Claude 3.5', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [], timing: { latency_ms: 0 } },
  { ballot_version: "v1", seat_id: 3, seat_name: "Senator 3 — Google", provider: 'Google', model: 'Gemini 1.5', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [], timing: { latency_ms: 0 } },
  { ballot_version: "v1", seat_id: 4, seat_name: "Senator 4 — Meta", provider: 'Meta', model: 'Llama 3', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [], timing: { latency_ms: 0 } },
  { ballot_version: "v1", seat_id: 5, seat_name: "Senator 5 — DeepSeek", provider: 'DeepSeek', model: 'V3', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [], timing: { latency_ms: 0 } },
  { ballot_version: "v1", seat_id: 6, seat_name: "Senator 6 — Mistral", provider: 'Mistral', model: 'Large', status: 'offline', stance: 'abstain', score: 0, confidence: 0, risk_flags: [], key_points: [], counterpoints: [], timing: { latency_ms: 0 } },
];

const createDefaultParticipation = (): ParticipationSummary => ({
  online_seats: [],
  offline_seats: [1, 2, 3, 4, 5, 6],
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

const StatCard = ({ label, value, color }: { label: string; value: string | number; color: string }) => {
  const colorClasses: Record<string, string> = {
    blue: 'border-blue-500/30 bg-blue-500/10',
    emerald: 'border-emerald-500/30 bg-emerald-500/10',
    amber: 'border-amber-500/30 bg-amber-500/10',
    red: 'border-red-500/30 bg-red-500/10',
    purple: 'border-purple-500/30 bg-purple-500/10',
    green: 'border-green-500/30 bg-green-500/10',
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color] || colorClasses.blue}`}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  );
};

const DetailRow = ({ label, value, className = '' }: { label: string; value: string; className?: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={`text-sm font-medium ${className || 'text-foreground'}`}>{value}</span>
  </div>
);

export function SynthAdminTab() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filterOutcome, setFilterOutcome] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  // Senate state
  const [senatePrompt, setSenatePrompt] = useState('');
  const [senateLoading, setSenateLoading] = useState(false);
  const [seats, setSeats] = useState<SeatBallot[]>(createDefaultSeats());
  const [judgeOutput, setJudgeOutput] = useState<JudgeOutput | null>(null);
  const [participationSummary, setParticipationSummary] = useState<ParticipationSummary>(createDefaultParticipation());
  const [contested, setContested] = useState(false);
  const [contestedReasons, setContestedReasons] = useState<string[]>([]);
  const [traceId, setTraceId] = useState('');

  const weights = { seat_1: 17, seat_2: 17, seat_3: 17, seat_4: 17, seat_5: 16, seat_6: 16 };

  const [stats, setStats] = useState({
    total: 0,
    released: 0,
    partial: 0,
    refused: 0,
    humanReview: 0,
    avgCoherence: 0,
    avgVerification: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: logsData, error: logsError } = await supabase
        .from('synth_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (logsError) throw logsError;

      const { data: policiesData, error: policiesError } = await supabase
        .from('synth_policies')
        .select('*')
        .order('created_at', { ascending: false });

      if (policiesError) throw policiesError;

      const typedLogs = (logsData || []) as AuditLog[];
      setLogs(typedLogs);
      setPolicies((policiesData || []) as Policy[]);

      const total = typedLogs.length;
      const released = typedLogs.filter(l => l.outcome === 'RELEASE_FULL').length;
      const partial = typedLogs.filter(l => l.outcome === 'RELEASE_SAFE_PARTIAL').length;
      const refused = typedLogs.filter(l => l.outcome === 'REFUSE').length;
      const humanReview = typedLogs.filter(l => l.outcome === 'HUMAN_REVIEW_REQUIRED').length;
      const avgCoherence = total > 0 
        ? typedLogs.reduce((acc, l) => acc + (l.coherence_score || 0), 0) / total 
        : 0;
      const avgVerification = total > 0 
        ? typedLogs.reduce((acc, l) => acc + (l.verification_score || 0), 0) / total 
        : 0;

      setStats({ total, released, partial, refused, humanReview, avgCoherence, avgVerification });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updatePolicy = async (policyId: string, updates: Partial<Policy>) => {
    try {
      const { error } = await supabase
        .from('synth_policies')
        .update(updates)
        .eq('id', policyId);

      if (error) throw error;
      toast.success('Policy updated');
      fetchData();
    } catch (error) {
      console.error('Error updating policy:', error);
      toast.error('Failed to update policy');
    }
  };

  // Senate run handler
  const handleSenateRun = async () => {
    if (!senatePrompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setSenateLoading(true);
    setSeats(createDefaultSeats());
    setJudgeOutput(null);
    setParticipationSummary(createDefaultParticipation());
    setContested(false);
    setContestedReasons([]);
    setTraceId('pending...');

    try {
      const { data, error } = await supabase.functions.invoke('synth-senate-run', {
        body: { prompt: senatePrompt.trim() }
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
      setSenateLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filterOutcome !== 'all' && log.outcome !== filterOutcome) return false;
    if (filterRisk !== 'all' && log.risk_decision !== filterRisk) return false;
    return true;
  });

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'RELEASE_FULL': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/50';
      case 'RELEASE_SAFE_PARTIAL': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
      case 'REFUSE': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'HUMAN_REVIEW_REQUIRED': return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'ALLOW': return 'text-green-400';
      case 'RESTRICT': return 'text-amber-400';
      case 'BLOCK': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const OutcomeIcon = ({ outcome }: { outcome: string }) => {
    switch (outcome) {
      case 'RELEASE_FULL': return <CheckCircle className="w-4 h-4" />;
      case 'RELEASE_SAFE_PARTIAL': return <Shield className="w-4 h-4" />;
      case 'REFUSE': return <XCircle className="w-4 h-4" />;
      case 'HUMAN_REVIEW_REQUIRED': return <UserCheck className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <section className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                SYNTH™ Neuro Oversight Nexus
              </CardTitle>
              <CardDescription>
                7-Seat Senate Architecture: 6 AI Senators deliberate, 1 Judge arbitrates final decisions.
              </CardDescription>
            </div>
            <Button
              onClick={fetchData}
              variant="outline"
              size="sm"
              className="border-blue-500/50 text-blue-400"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">🟢 Senator 1: OpenAI</Badge>
            <Badge variant="outline" className="border-orange-500/50 text-orange-400">🟠 Senator 2: Anthropic</Badge>
            <Badge variant="outline" className="border-blue-500/50 text-blue-400">🔵 Senator 3: Google</Badge>
            <Badge variant="outline" className="border-indigo-500/50 text-indigo-400">🟣 Senator 4: Meta</Badge>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">🔷 Senator 5: DeepSeek</Badge>
            <Badge variant="outline" className="border-amber-500/50 text-amber-400">🟡 Senator 6: Mistral</Badge>
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">⚖️ Judge: OpenAI o1</Badge>
          </div>

          {/* Quick Links */}
          <div className="grid gap-3 sm:grid-cols-4">
            <Button variant="outline" onClick={() => navigate("/synth/logs")} className="justify-between">
              View Full Logs
              <ScrollText className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate("/synth/policies")} className="justify-between">
              Policies Page
              <Settings2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate("/synth/docs")} className="justify-between">
              Docs
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate("/synth/senate")} className="justify-between">
              Full Senate
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full Architecture Tabs */}
      <Tabs defaultValue="senate" className="space-y-6">
        <TabsList className="bg-muted/50 border border-border flex-wrap">
          <TabsTrigger value="senate" className="data-[state=active]:bg-purple-500/20">
            <Scale className="w-4 h-4 mr-2" />
            Senate
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-500/20">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-blue-500/20">
            <FileText className="w-4 h-4 mr-2" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="policies" className="data-[state=active]:bg-blue-500/20">
            <Sliders className="w-4 h-4 mr-2" />
            Policies
          </TabsTrigger>
          <TabsTrigger value="think-tank" className="data-[state=active]:bg-cyan-500/20">
            <Lightbulb className="w-4 h-4 mr-2" />
            Think Tank
          </TabsTrigger>
        </TabsList>

        {/* Senate Tab - 6 Senators + 1 Judge */}
        <TabsContent value="senate" className="space-y-6">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gavel className="w-5 h-5 text-purple-400" />
                Senate Deliberation
              </CardTitle>
              <CardDescription>
                Enter your prompt to run through the 7-seat Senate: 6 AI Senators evaluate, 1 Judge delivers the final verdict.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter the text you want the Senate to evaluate..."
                  value={senatePrompt}
                  onChange={(e) => setSenatePrompt(e.target.value)}
                  className="min-h-[120px] font-mono text-sm"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {senatePrompt.length} characters • 6 senators + 1 judge will deliberate
                  </p>
                  <Button 
                    onClick={handleSenateRun} 
                    disabled={senateLoading || !senatePrompt.trim()}
                  >
                    {senateLoading ? (
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

          {/* 6 Senator Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                Senate Seats (6 Senators)
              </h3>
              <Badge variant="outline" className="border-border">
                {seats.filter(s => s.status === 'online').length}/6 Online
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {seats.map((seat) => (
                <SenateSeatCard 
                  key={seat.seat_id} 
                  seat={seat} 
                  weight={weights[`seat_${seat.seat_id}` as keyof typeof weights] || 17}
                />
              ))}
            </div>
          </div>

          {/* Judge Output */}
          {(judgeOutput || senateLoading) && (
            <SenateJudgeCard 
              judge={judgeOutput || createDefaultJudge()}
              participation_summary={participationSummary}
              contested={contested}
              contested_reasons={contestedReasons}
              trace_id={traceId}
              isLoading={senateLoading && !judgeOutput}
            />
          )}
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <StatCard label="Total Requests" value={stats.total} color="blue" />
            <StatCard label="Released" value={stats.released} color="emerald" />
            <StatCard label="Partial" value={stats.partial} color="amber" />
            <StatCard label="Refused" value={stats.refused} color="red" />
            <StatCard label="Human Review" value={stats.humanReview} color="blue" />
            <StatCard label="Avg Coherence" value={`${(stats.avgCoherence * 100).toFixed(1)}%`} color="purple" />
            <StatCard label="Avg Verification" value={`${(stats.avgVerification * 100).toFixed(1)}%`} color="green" />
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : logs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No audit logs yet. SYNTH™ will record activity here.
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.slice(0, 5).map(log => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getOutcomeColor(log.outcome)}`}>
                          <OutcomeIcon outcome={log.outcome} />
                        </div>
                        <div>
                          <p className="text-sm text-foreground font-medium truncate max-w-xs">
                            {log.sanitized_prompt?.substring(0, 50)}...
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${getRiskColor(log.risk_decision)}`}>
                          {log.risk_decision}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getOutcomeColor(log.outcome)}`}>
                          {log.outcome}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={filterOutcome}
              onChange={(e) => setFilterOutcome(e.target.value)}
              className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm"
            >
              <option value="all">All Outcomes</option>
              <option value="RELEASE_FULL">Release Full</option>
              <option value="RELEASE_SAFE_PARTIAL">Release Partial</option>
              <option value="REFUSE">Refused</option>
              <option value="HUMAN_REVIEW_REQUIRED">Human Review</option>
            </select>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm"
            >
              <option value="all">All Risk Levels</option>
              <option value="ALLOW">Allow</option>
              <option value="RESTRICT">Restrict</option>
              <option value="BLOCK">Block</option>
            </select>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Prompt</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Risk</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Coherence</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Outcome</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading...</td>
                      </tr>
                    ) : filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No logs found</td>
                      </tr>
                    ) : (
                      filteredLogs.slice(0, 20).map(log => (
                        <tr key={log.id} className="hover:bg-muted/30 transition">
                          <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground max-w-xs truncate">
                            {log.sanitized_prompt}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-medium ${getRiskColor(log.risk_decision)}`}>
                              {log.risk_decision}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">
                            {(log.coherence_score * 100).toFixed(0)}%
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getOutcomeColor(log.outcome)}`}>
                              <OutcomeIcon outcome={log.outcome} />
                              {log.outcome}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              onClick={() => setSelectedLog(log)}
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Log Detail Modal */}
          {selectedLog && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedLog(null)}>
              <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-foreground">Log Detail</h3>
                  <Button onClick={() => setSelectedLog(null)} variant="ghost" size="sm">✕</Button>
                </div>
                
                <div className="space-y-4">
                  <DetailRow label="Request ID" value={selectedLog.request_id} />
                  <DetailRow label="Created" value={new Date(selectedLog.created_at).toLocaleString()} />
                  <DetailRow label="User Role" value={selectedLog.user_role} />
                  <DetailRow label="Risk Decision" value={selectedLog.risk_decision} className={getRiskColor(selectedLog.risk_decision)} />
                  <DetailRow label="Outcome" value={selectedLog.outcome} className={getOutcomeColor(selectedLog.outcome).split(' ')[0]} />
                  <DetailRow label="Coherence Score" value={`${(selectedLog.coherence_score * 100).toFixed(1)}%`} />
                  <DetailRow label="Verification Score" value={`${(selectedLog.verification_score * 100).toFixed(1)}%`} />
                  
                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground mb-2">Sanitized Prompt</p>
                    <p className="text-sm text-foreground bg-muted p-3 rounded">{selectedLog.sanitized_prompt}</p>
                  </div>
                  
                  {selectedLog.final_answer && (
                    <div className="border-t border-border pt-4">
                      <p className="text-xs text-muted-foreground mb-2">Final Answer</p>
                      <p className="text-sm text-foreground bg-muted p-3 rounded">{selectedLog.final_answer}</p>
                    </div>
                  )}
                  
                  {selectedLog.agent_outputs && (
                    <div className="border-t border-border pt-4">
                      <p className="text-xs text-muted-foreground mb-2">Agent Outputs</p>
                      <pre className="text-xs text-foreground bg-muted p-3 rounded overflow-x-auto">
                        {JSON.stringify(selectedLog.agent_outputs, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {selectedLog.judge_output && (
                    <div className="border-t border-border pt-4">
                      <p className="text-xs text-muted-foreground mb-2">Judge Output</p>
                      <pre className="text-xs text-foreground bg-muted p-3 rounded overflow-x-auto">
                        {JSON.stringify(selectedLog.judge_output, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Policies</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : policies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No policies configured</div>
              ) : (
                <div className="space-y-6">
                  {policies.map(policy => (
                    <div key={policy.id} className="border border-border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-foreground font-medium">{policy.policy_name}</h4>
                          <p className="text-xs text-muted-foreground">
                            Last updated: {new Date(policy.updated_at).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${policy.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                          {policy.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Coherence Threshold</label>
                          <Input
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            value={policy.coherence_threshold}
                            onChange={(e) => updatePolicy(policy.id, { coherence_threshold: parseFloat(e.target.value) })}
                            className="bg-muted border-border"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Verification Threshold</label>
                          <Input
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            value={policy.verification_threshold}
                            onChange={(e) => updatePolicy(policy.id, { verification_threshold: parseFloat(e.target.value) })}
                            className="bg-muted border-border"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Storage Mode</label>
                          <select
                            value={policy.storage_mode}
                            onChange={(e) => updatePolicy(policy.id, { storage_mode: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm"
                          >
                            <option value="raw">Raw</option>
                            <option value="hashed">Hashed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Think Tank Tab */}
        <TabsContent value="think-tank" className="space-y-6">
          <ThinkTankManager />
        </TabsContent>
      </Tabs>
    </section>
  );
}
