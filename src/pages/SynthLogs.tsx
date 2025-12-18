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

  const getDecisionBadge = (decision: string) => {
    const styles: Record<string, string> = {
      RELEASE_FULL: 'bg-green-500/20 text-green-400',
      RELEASE_SAFE_PARTIAL: 'bg-yellow-500/20 text-yellow-400',
      HUMAN_REVIEW_REQUIRED: 'bg-orange-500/20 text-orange-400',
      REFUSE: 'bg-red-500/20 text-red-400',
    };
    return styles[decision] || 'bg-muted text-muted-foreground';
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'RELEASE_FULL': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'RELEASE_SAFE_PARTIAL': return <Shield className="w-4 h-4 text-yellow-400" />;
      case 'HUMAN_REVIEW_REQUIRED': return <Clock className="w-4 h-4 text-orange-400" />;
      case 'REFUSE': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>SYNTH™ Audit Logs | Flight Recorder</title>
        <meta name="description" content="View and export SYNTH™ audit logs - complete flight recorder for AI governance" />
      </Helmet>

      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/synth')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">SYNTH™ Logs</h1>
                <p className="text-xs text-muted-foreground">Flight Recorder</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Filters & Actions */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 flex-1 w-full md:w-auto">
                <div className="relative flex-1 md:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by request ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={decisionFilter} onValueChange={setDecisionFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Decisions</SelectItem>
                    <SelectItem value="RELEASE_FULL">Release Full</SelectItem>
                    <SelectItem value="RELEASE_SAFE_PARTIAL">Safe Partial</SelectItem>
                    <SelectItem value="HUMAN_REVIEW_REQUIRED">Human Review</SelectItem>
                    <SelectItem value="REFUSE">Refuse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchLogs}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportLogs('csv')}>
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportLogs('json')}>
                  <Download className="w-4 h-4 mr-2" />
                  JSON
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{logs.length}</div>
              <div className="text-xs text-muted-foreground">Total Audits</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-400">
                {logs.filter(l => l.outcome === 'RELEASE_FULL').length}
              </div>
              <div className="text-xs text-muted-foreground">Released</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-orange-400">
                {logs.filter(l => l.outcome === 'HUMAN_REVIEW_REQUIRED').length}
              </div>
              <div className="text-xs text-muted-foreground">Human Review</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-400">
                {logs.filter(l => l.outcome === 'REFUSE').length}
              </div>
              <div className="text-xs text-muted-foreground">Refused</div>
            </CardContent>
          </Card>
        </div>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Logs ({filteredLogs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No audit logs found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Coherence</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow 
                      key={log.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedLog(log)}
                    >
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(log.timestamp), 'MMM d, HH:mm:ss')}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.request_id}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${getDecisionBadge(log.outcome)}`}>
                          {getDecisionIcon(log.outcome)}
                          <span className="ml-1">{log.outcome?.replace(/_/g, ' ')}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{log.risk_decision}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {((log.coherence_score || 0) * 100).toFixed(0)}%
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {((log.verification_score || 0) * 100).toFixed(0)}%
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {log.processing_time_ms}ms
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Log Detail Modal */}
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Audit Detail: {selectedLog?.request_id}
              </DialogTitle>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Decision</div>
                    <Badge className={getDecisionBadge(selectedLog.outcome)}>
                      {selectedLog.outcome?.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Risk Level</div>
                    <Badge variant="outline">{selectedLog.risk_decision}</Badge>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Coherence</div>
                    <div className="font-mono">{((selectedLog.coherence_score || 0) * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Verification</div>
                    <div className="font-mono">{((selectedLog.verification_score || 0) * 100).toFixed(0)}%</div>
                  </div>
                </div>

                {/* Sanitized Prompt */}
                <div>
                  <div className="text-sm font-medium mb-2">Sanitized Prompt</div>
                  <div className="p-3 bg-muted/50 rounded-lg text-sm font-mono whitespace-pre-wrap">
                    {selectedLog.sanitized_prompt || 'N/A'}
                  </div>
                </div>

                {/* Final Answer */}
                <div>
                  <div className="text-sm font-medium mb-2">Final Answer</div>
                  <div className="p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap">
                    {selectedLog.final_answer || 'N/A'}
                  </div>
                </div>

                {/* Agent Outputs */}
                <div>
                  <div className="text-sm font-medium mb-2">Agent Outputs</div>
                  <pre className="p-3 bg-muted/50 rounded-lg text-xs overflow-auto max-h-[200px]">
                    {JSON.stringify(selectedLog.agent_outputs, null, 2)}
                  </pre>
                </div>

                {/* Judge Output */}
                <div>
                  <div className="text-sm font-medium mb-2">Judge Output</div>
                  <pre className="p-3 bg-muted/50 rounded-lg text-xs overflow-auto max-h-[200px]">
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
