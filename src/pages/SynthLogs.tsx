import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Brain, 
  Search, 
  Download, 
  RefreshCw,
  ChevronRight,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  request_id: string;
  timestamp: string;
  user_role: string;
  risk_decision: string;
  outcome: string;
  coherence_score: number;
  verification_score: number;
  processing_time_ms: number;
  redaction_summary: any;
  agent_outputs: any;
  judge_output: any;
  final_answer: string;
  sanitized_prompt: string;
}

const SynthLogs: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('synth_audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to load logs');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_role?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDecision = decisionFilter === 'all' || log.outcome === decisionFilter;
    return matchesSearch && matchesDecision;
  });

  const exportLogs = (format: 'json' | 'csv') => {
    const dataToExport = filteredLogs.map(log => ({
      request_id: log.request_id,
      timestamp: log.timestamp,
      user_role: log.user_role,
      risk_decision: log.risk_decision,
      decision: log.outcome,
      coherence_score: log.coherence_score,
      verification_score: log.verification_score,
      processing_time_ms: log.processing_time_ms,
    }));

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      downloadBlob(blob, 'synth-audit-logs.json');
    } else {
      const headers = Object.keys(dataToExport[0] || {}).join(',');
      const rows = dataToExport.map(row => Object.values(row).join(',')).join('\n');
      const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
      downloadBlob(blob, 'synth-audit-logs.csv');
    }
    toast.success(`Exported ${filteredLogs.length} logs as ${format.toUpperCase()}`);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDecisionBadgeClass = (decision: string) => {
    switch (decision) {
      case 'RELEASE_FULL': return 'synth-badge-release';
      case 'RELEASE_SAFE_PARTIAL': return 'synth-badge-partial';
      case 'HUMAN_REVIEW_REQUIRED': return 'synth-badge-review';
      case 'REFUSE': return 'synth-badge-refuse';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'RELEASE_FULL': return <CheckCircle className="w-4 h-4 text-cyan-400" />;
      case 'RELEASE_SAFE_PARTIAL': return <Shield className="w-4 h-4 text-amber-400" />;
      case 'HUMAN_REVIEW_REQUIRED': return <Clock className="w-4 h-4 text-orange-400" />;
      case 'REFUSE': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 0.85) return 'synth-score-high';
    if (score >= 0.6) return 'synth-score-medium';
    return 'synth-score-low';
  };

  return (
    <div className="min-h-screen synth-bg">
      <Helmet>
        <title>SYNTH™ Audit Logs | Flight Recorder</title>
        <meta name="description" content="View and export SYNTH™ audit logs - complete flight recorder for AI governance" />
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
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center synth-pulse">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg synth-neon-blue">SYNTH™ Logs</h1>
                <p className="text-xs text-gray-400">Flight Recorder</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Filters & Actions */}
        <Card className="synth-card border-0 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 flex-1 w-full md:w-auto">
                <div className="relative flex-1 md:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search by request ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white/5 border-gray-700 text-gray-200 placeholder:text-gray-500"
                  />
                </div>
                <Select value={decisionFilter} onValueChange={setDecisionFilter}>
                  <SelectTrigger className="w-[180px] bg-white/5 border-gray-700 text-gray-200">
                    <SelectValue placeholder="Filter by decision" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="all">All Decisions</SelectItem>
                    <SelectItem value="RELEASE_FULL">Release Full</SelectItem>
                    <SelectItem value="RELEASE_SAFE_PARTIAL">Safe Partial</SelectItem>
                    <SelectItem value="HUMAN_REVIEW_REQUIRED">Human Review</SelectItem>
                    <SelectItem value="REFUSE">Refuse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchLogs} className="border-gray-600 text-gray-300 hover:bg-white/10 bg-transparent">
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportLogs('csv')} className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportLogs('json')} className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  JSON
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="synth-card border-0">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-white">{logs.length}</div>
              <div className="text-xs text-gray-400">Total Audits</div>
            </CardContent>
          </Card>
          <Card className="synth-card border-0">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold synth-score-high">
                {logs.filter(l => l.outcome === 'RELEASE_FULL').length}
              </div>
              <div className="text-xs text-gray-400">Released</div>
            </CardContent>
          </Card>
          <Card className="synth-card border-0">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold synth-score-medium">
                {logs.filter(l => l.outcome === 'HUMAN_REVIEW_REQUIRED').length}
              </div>
              <div className="text-xs text-gray-400">Human Review</div>
            </CardContent>
          </Card>
          <Card className="synth-card border-0">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold synth-score-low">
                {logs.filter(l => l.outcome === 'REFUSE').length}
              </div>
              <div className="text-xs text-gray-400">Refused</div>
            </CardContent>
          </Card>
        </div>

        {/* Logs Table */}
        <Card className="synth-card border-0">
          <CardHeader>
            <CardTitle className="text-white">Audit Logs ({filteredLogs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-20 text-cyan-400" />
                <p>No audit logs found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-transparent">
                      <TableHead className="text-gray-400">Timestamp</TableHead>
                      <TableHead className="text-gray-400">Request ID</TableHead>
                      <TableHead className="text-gray-400">Decision</TableHead>
                      <TableHead className="text-gray-400">Risk</TableHead>
                      <TableHead className="text-gray-400">Coherence</TableHead>
                      <TableHead className="text-gray-400">Verification</TableHead>
                      <TableHead className="text-gray-400">Time</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow 
                        key={log.id} 
                        className="cursor-pointer synth-table-row border-gray-700/50"
                        onClick={() => setSelectedLog(log)}
                      >
                        <TableCell className="text-xs text-gray-400">
                          {format(new Date(log.timestamp), 'MMM d, HH:mm:ss')}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-gray-300">{log.request_id}</TableCell>
                        <TableCell>
                          <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${getDecisionBadgeClass(log.outcome)}`}>
                            {getDecisionIcon(log.outcome)}
                            <span>{log.outcome?.replace(/_/g, ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">{log.risk_decision}</Badge>
                        </TableCell>
                        <TableCell className={`font-mono text-sm ${getScoreClass(log.coherence_score || 0)}`}>
                          {((log.coherence_score || 0) * 100).toFixed(0)}%
                        </TableCell>
                        <TableCell className={`font-mono text-sm ${getScoreClass(log.verification_score || 0)}`}>
                          {((log.verification_score || 0) * 100).toFixed(0)}%
                        </TableCell>
                        <TableCell className="text-xs text-gray-400">
                          {log.processing_time_ms}ms
                        </TableCell>
                        <TableCell>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Log Detail Modal */}
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto synth-card border-cyan-500/30">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 synth-neon-blue">
                <Brain className="w-5 h-5" />
                Audit Detail: {selectedLog?.request_id}
              </DialogTitle>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Decision</div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${getDecisionBadgeClass(selectedLog.outcome)}`}>
                      {selectedLog.outcome?.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Risk Level</div>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">{selectedLog.risk_decision}</Badge>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Coherence</div>
                    <div className={`font-mono ${getScoreClass(selectedLog.coherence_score || 0)}`}>
                      {((selectedLog.coherence_score || 0) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Verification</div>
                    <div className={`font-mono ${getScoreClass(selectedLog.verification_score || 0)}`}>
                      {((selectedLog.verification_score || 0) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Sanitized Prompt */}
                <div>
                  <div className="text-sm font-medium mb-2 text-white">Sanitized Prompt</div>
                  <div className="p-3 synth-terminal rounded-lg text-sm font-mono whitespace-pre-wrap text-gray-300">
                    {selectedLog.sanitized_prompt || 'N/A'}
                  </div>
                </div>

                {/* Final Answer */}
                <div>
                  <div className="text-sm font-medium mb-2 text-white">Final Answer</div>
                  <div className="p-3 synth-terminal rounded-lg text-sm whitespace-pre-wrap text-gray-300">
                    {selectedLog.final_answer || 'N/A'}
                  </div>
                </div>

                {/* Agent Outputs */}
                <div>
                  <div className="text-sm font-medium mb-2 text-white">Agent Outputs</div>
                  <pre className="p-3 synth-terminal rounded-lg text-xs overflow-auto max-h-[200px] text-gray-300">
                    {JSON.stringify(selectedLog.agent_outputs, null, 2)}
                  </pre>
                </div>

                {/* Judge Output */}
                <div>
                  <div className="text-sm font-medium mb-2 text-white">Judge Output</div>
                  <pre className="p-3 synth-terminal rounded-lg text-xs overflow-auto max-h-[200px] text-gray-300">
                    {JSON.stringify(selectedLog.judge_output, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default SynthLogs;
