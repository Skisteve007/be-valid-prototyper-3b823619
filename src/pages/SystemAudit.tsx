import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Mail, Shield } from 'lucide-react';
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

const SystemAudit = () => {
  const [audit, setAudit] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
  };

  const runAudit = async (sendEmail = false) => {
    setLoading(true);
    try {
      const url = sendEmail 
        ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/system-audit?email=true`
        : `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/system-audit`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      });

      const data = await response.json();
      setAudit(data);

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
            <div className="grid grid-cols-3 gap-4 mb-8">
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
