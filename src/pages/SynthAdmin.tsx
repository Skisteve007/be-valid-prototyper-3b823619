import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Home, Brain, Shield, AlertTriangle, CheckCircle, XCircle, 
  UserCheck, Clock, Filter, RefreshCw, Settings, ChevronDown, ChevronRight,
  BarChart3, FileText, Sliders, Lightbulb, Scale
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ThinkTankManager from '@/components/admin/ThinkTankManager';
import { SteveOwnerGate } from '@/components/SteveOwnerGate';

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

const SynthAdmin = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filterOutcome, setFilterOutcome] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  // Stats
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
      // Fetch logs
      const { data: logsData, error: logsError } = await supabase
        .from('synth_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (logsError) throw logsError;

      // Fetch policies  
      const { data: policiesData, error: policiesError } = await supabase
        .from('synth_policies')
        .select('*')
        .order('created_at', { ascending: false });

      if (policiesError) throw policiesError;

      const typedLogs = (logsData || []) as AuditLog[];
      setLogs(typedLogs);
      setPolicies((policiesData || []) as Policy[]);

      // Calculate stats
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
    <>
      <Helmet>
        <title>SYNTH™ Admin Console | Valid™</title>
        <meta name="description" content="SYNTH™ Neural Oversight Nexus - View audit logs, manage policies, and monitor AI governance." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        {/* Background */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: `
              radial-gradient(circle at 30% 20%, rgba(59,130,246,0.05), transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(168,85,247,0.05), transparent 50%),
              linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background)))
            `,
          }}
        />

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/synth')}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SYNTH™ Neural Oversight Console
                </h1>
                <p className="text-muted-foreground text-xs">AI Governance Flight Recorder & Policy Management</p>
              </div>
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
        </header>

        <div className="h-20" />

        <main className="relative z-10 p-4 sm:p-8 max-w-7xl mx-auto">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="bg-muted/50 border border-border">
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
              <TabsTrigger value="debate" className="data-[state=active]:bg-purple-500/20">
                <Scale className="w-4 h-4 mr-2" />
                AI Debate
              </TabsTrigger>
            </TabsList>

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
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
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
              </div>
            </TabsContent>

            {/* Logs Tab */}
            <TabsContent value="logs" className="space-y-6">
              {/* Filters */}
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

              {/* Logs Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
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
                          <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                            No logs found
                          </td>
                        </tr>
                      ) : (
                        filteredLogs.map(log => (
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
              </div>

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
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Active Policies</h3>
                
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
              </div>
            </TabsContent>

            {/* Think Tank Tab */}
            <TabsContent value="think-tank" className="space-y-6">
              <ThinkTankManager />
            </TabsContent>

            {/* AI Debate Tab */}
            <TabsContent value="debate" className="space-y-6">
              <div className="bg-card border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Scale className="w-5 h-5 text-purple-400" />
                      AI Debate Room
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Multi-model Senate debate with 7 AI providers
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link
                    to="/debate-room"
                    className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Scale className="w-5 h-5 text-purple-400" />
                      </div>
                      <h4 className="text-foreground font-semibold group-hover:text-purple-400 transition">
                        Public Demo
                      </h4>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Run debates with available AI providers. Shows senator cards and judge verdicts.
                    </p>
                  </Link>
                  
                  <Link
                    to="/synth/senate-lab"
                    className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-cyan-400" />
                      </div>
                      <h4 className="text-foreground font-semibold group-hover:text-cyan-400 transition">
                        Admin Lab
                      </h4>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Full admin access with raw JSON, session IDs, and internal debugging.
                    </p>
                  </Link>
                </div>
                
                <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                  <h4 className="text-sm font-medium text-foreground mb-2">Senate Providers</h4>
                  <div className="flex flex-wrap gap-2">
                    {['OpenAI', 'Anthropic', 'Google Gemini', 'DeepSeek', 'xAI Grok', 'Mistral', 'Llama'].map((provider) => (
                      <span key={provider} className="px-2 py-1 rounded text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        {provider}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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

// Helper components
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

// Wrap with SteveOwnerGate for Tier-0 access control
const SynthAdminProtected = () => (
  <SteveOwnerGate>
    <SynthAdmin />
  </SteveOwnerGate>
);

export default SynthAdminProtected;
