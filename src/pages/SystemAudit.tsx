import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Mail, Shield, TrendingUp, TrendingDown, Minus, History } from 'lucide-react';
import { toast } from 'sonner';

interface AuditCheck {
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: string;
}

interface AuditReport {
  timestamp: string;
  environment: string;
  checks: Record<string, AuditCheck>;
  summary: {
    passed: number;
    failed: number;
    warnings: number;
    issues: string[];
  };
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  status: string;
  passed: number;
  failed: number;
  warned: number;
  trigger_type: string;
  details: Record<string, unknown>;
}

const SystemAudit = () => {
  const [audit, setAudit] = useState<AuditReport | null>(null);
  const [auditHistory, setAuditHistory] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [trend, setTrend] = useState<'improving' | 'declining' | 'stable'>('stable');

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = '/access-portal';
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'administrator');

    if (!roles || roles.length === 0) {
      window.location.href = '/dashboard';
      return;
    }

    setIsAdmin(true);
    runAudit();
    fetchAuditHistory();
  };

  const fetchAuditHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching audit history:', error);
        return;
      }

      if (data) {
        setAuditHistory(data as AuditLogEntry[]);
        
        // Calculate trend from last 2 audits
        if (data.length >= 2) {
          const latest = data[0];
          const previous = data[1];
          
          if (latest.failed < previous.failed) {
            setTrend('improving');
          } else if (latest.failed > previous.failed) {
            setTrend('declining');
          } else {
            setTrend('stable');
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch audit history:', err);
    }
  };

  const runAudit = async (sendEmail = false) => {
    setLoading(true);
    try {
      const url = sendEmail 
        ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/system-audit?email=true&trigger=manual`
        : `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/system-audit?trigger=manual`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      });

      const data = await response.json();
      setAudit(data);

      // Refresh history after running audit
      setTimeout(() => fetchAuditHistory(), 1000);

      if (sendEmail) {
        toast.success('Audit report sent to steve@bevalid.app');
      }
    } catch (error) {
      console.error('Audit error:', error);
      toast.error('Failed to run audit');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warn':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">PASS</Badge>;
      case 'fail':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">FAIL</Badge>;
      case 'warn':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">WARN</Badge>;
      default:
        return null;
    }
  };

  const getOverallStatusBadge = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">🟢 HEALTHY</Badge>;
      case 'WARNING':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">🟡 WARNING</Badge>;
      case 'CRITICAL':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">🔴 CRITICAL</Badge>;
      default:
        return <Badge className="bg-muted/20 text-muted-foreground border-border">{status}</Badge>;
    }
  };

  const getTrendIndicator = () => {
    switch (trend) {
      case 'improving':
        return (
          <div className="flex items-center gap-2 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Improving</span>
          </div>
        );
      case 'declining':
        return (
          <div className="flex items-center gap-2 text-red-400">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm font-medium">Declining</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Minus className="w-5 h-5" />
            <span className="text-sm font-medium">Stable</span>
          </div>
        );
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Checking authorization...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold tracking-wider text-foreground">
                VALID™ System Audit
              </h1>
              <p className="text-sm text-muted-foreground">
                Automated health checks for production systems
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => runAudit(false)}
              disabled={loading}
              variant="outline"
              className="border-cyan-500/30 hover:bg-cyan-500/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => runAudit(true)}
              disabled={loading}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Report
            </Button>
          </div>
        </div>

        {audit && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card className="bg-emerald-500/10 border-emerald-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-emerald-400">{audit.summary.passed}</div>
                  <div className="text-sm text-emerald-400/70 uppercase tracking-wider">Passed</div>
                </CardContent>
              </Card>
              <Card className="bg-red-500/10 border-red-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-red-400">{audit.summary.failed}</div>
                  <div className="text-sm text-red-400/70 uppercase tracking-wider">Failed</div>
                </CardContent>
              </Card>
              <Card className="bg-amber-500/10 border-amber-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-amber-400">{audit.summary.warnings}</div>
                  <div className="text-sm text-amber-400/70 uppercase tracking-wider">Warnings</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="mb-1">{getTrendIndicator()}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">Trend</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Checks */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>System Checks</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Last run: {new Date(audit.timestamp).toLocaleString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(audit.checks).map(([key, check]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/30"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(check.status)}
                        <div>
                          <div className="font-medium capitalize text-foreground">{key}</div>
                          <div className="text-sm text-muted-foreground">{check.message}</div>
                          {check.details && (
                            <div className="text-xs text-red-400/70 mt-1">{check.details}</div>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(check.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Issues Summary */}
            {audit.summary.issues.length > 0 && (
              <Card className="mt-6 bg-red-500/5 border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-red-400">Issues Detected</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {audit.summary.issues.map((issue, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Audit History */}
        {auditHistory.length > 0 && (
          <Card className="mt-8 bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                Audit History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditHistory.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30"
                  >
                    <div className="flex items-center gap-4">
                      {getOverallStatusBadge(log.status)}
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-emerald-400">{log.passed} passed</span>
                      {log.failed > 0 && <span className="text-red-400">{log.failed} failed</span>}
                      {log.warned > 0 && <span className="text-amber-400">{log.warned} warned</span>}
                      <Badge variant="outline" className="text-xs">
                        {log.trigger_type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Playwright Note */}
        <Card className="mt-8 bg-card/30 border-border/30">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-2">📋 E2E Testing (Playwright)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              For full end-to-end UI testing with Playwright, set up in your local or CI environment:
            </p>
            <pre className="bg-background/50 p-4 rounded-lg text-xs text-cyan-400 overflow-x-auto">
{`# Install Playwright
npm init playwright@latest

# Run tests
npx playwright test

# View report
npx playwright show-report`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemAudit;
