import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Play, Settings, FileText, Link2, Clock, Activity } from "lucide-react";
import { format } from "date-fns";

interface Account {
  id: string;
  account_name: string;
  industry: string;
  status: string;
  data_environment: string | null;
  data_classes: string[];
  use_cases: string[];
  output_preference: string;
  intake_completed_at: string | null;
  last_run_at: string | null;
  last_verdict: string | null;
  total_runs: number;
}

interface ProofRecord {
  id: string;
  request_type: string;
  verdict: string;
  proof_record_id: string;
  created_at: string;
}

interface AccountOverviewTabProps {
  account: Account;
  onRefresh: () => void;
  onRunDemo: (accountId: string, deploymentId: string) => void;
}

export const AccountOverviewTab = ({ account, onRefresh, onRunDemo }: AccountOverviewTabProps) => {
  const [recentRuns, setRecentRuns] = useState<ProofRecord[]>([]);
  const [deploymentsCount, setDeploymentsCount] = useState(0);
  const [connectorsCount, setConnectorsCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, [account.id]);

  const loadStats = async () => {
    // Load recent proof records
    const { data: proofs } = await supabase
      .from("account_proof_records")
      .select("id, request_type, verdict, proof_record_id, created_at")
      .eq("account_id", account.id)
      .order("created_at", { ascending: false })
      .limit(10);
    
    setRecentRuns(proofs || []);

    // Load counts
    const { count: depCount } = await supabase
      .from("account_deployments")
      .select("*", { count: "exact", head: true })
      .eq("account_id", account.id);
    
    const { count: connCount } = await supabase
      .from("account_connectors")
      .select("*", { count: "exact", head: true })
      .eq("account_id", account.id);

    setDeploymentsCount(depCount || 0);
    setConnectorsCount(connCount || 0);
  };

  const readinessChecklist = [
    { label: "Intake completed", done: !!account.intake_completed_at },
    { label: "Data environment configured", done: !!account.data_environment },
    { label: "Use cases defined", done: account.use_cases.length > 0 },
    { label: "At least one deployment", done: deploymentsCount > 0 },
    { label: "Source connector configured", done: connectorsCount > 0 },
  ];

  const completedSteps = readinessChecklist.filter(item => item.done).length;

  const getVerdictBadge = (verdict: string) => {
    const colors: Record<string, string> = {
      'OK': 'bg-green-500 text-white',
      'REVIEW': 'bg-yellow-500 text-black',
      'BLOCK': 'bg-red-500 text-white',
    };
    return <Badge className={colors[verdict] || 'bg-muted'}>{verdict}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Status + Readiness */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge className={account.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}>
                {account.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Runs</span>
              <span className="font-medium">{account.total_runs}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Run</span>
              <span className="font-medium">
                {account.last_run_at 
                  ? format(new Date(account.last_run_at), "MMM d, h:mm a")
                  : "Never"
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Verdict</span>
              {account.last_verdict 
                ? getVerdictBadge(account.last_verdict)
                : <span className="text-muted-foreground">—</span>
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Readiness Checklist</CardTitle>
            <CardDescription>
              {completedSteps}/{readinessChecklist.length} steps completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {readinessChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={item.done ? "" : "text-muted-foreground"}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" /> Start Intake
            </Button>
            <Button variant="outline" className="gap-2">
              <Link2 className="h-4 w-4" /> Configure Connectors
            </Button>
            <Button className="gap-2">
              <Play className="h-4 w-4" /> Run Demo
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" /> View Proof Records
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Runs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Last 10 Runs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentRuns.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No runs yet. Create a deployment and run a demo to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {recentRuns.map((run) => (
                <div 
                  key={run.id} 
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">{run.proof_record_id}</span>
                    <Badge variant="outline">{run.request_type}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    {getVerdictBadge(run.verdict)}
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(run.created_at), "MMM d, h:mm a")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
