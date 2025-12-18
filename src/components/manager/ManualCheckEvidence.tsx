import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, FileText, CheckCircle, XCircle, AlertTriangle, RefreshCw, Eye, Clock } from "lucide-react";

interface ManualCheck {
  id: string;
  scan_log_id: string;
  photo_url: string | null;
  notes: string;
  final_decision: "allow" | "deny";
  evidence_confirmed: boolean;
  created_at: string;
}

interface ScanLogWithEvidence {
  id: string;
  created_at: string;
  manual_check_evidence: ManualCheck[];
}

interface ManualCheckEvidenceProps {
  venueId: string;
}

const ManualCheckEvidence = ({ venueId }: ManualCheckEvidenceProps) => {
  const [checks, setChecks] = useState<ScanLogWithEvidence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCheck, setSelectedCheck] = useState<ManualCheck | null>(null);

  useEffect(() => {
    loadManualChecks();
  }, [venueId]);

  const loadManualChecks = async () => {
    setIsLoading(true);
    try {
      const { data: scanLogs, error } = await supabase
        .from("door_scan_log")
        .select(`
          id,
          created_at,
          manual_check_evidence (
            id,
            scan_log_id,
            photo_url,
            notes,
            final_decision,
            evidence_confirmed,
            created_at
          )
        `)
        .eq("venue_id", venueId)
        .eq("scan_result", "manual_check")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setChecks((scanLogs as unknown as ScanLogWithEvidence[]) || []);
    } catch (error) {
      console.error("Error loading manual checks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDecisionBadge = (decision: string) => {
    if (decision === "allow") {
      return <Badge className="bg-green-500/20 text-green-500 border-green-500/50">Allowed</Badge>;
    }
    return <Badge className="bg-red-500/20 text-red-500 border-red-500/50">Denied</Badge>;
  };

  const stats = {
    total: checks.length,
    withEvidence: checks.filter(c => c.manual_check_evidence.length > 0).length,
    withoutEvidence: checks.filter(c => c.manual_check_evidence.length === 0).length,
    confirmed: checks.filter(c => c.manual_check_evidence.some(e => e.evidence_confirmed)).length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Manual Check Evidence
            </CardTitle>
            <CardDescription>Review manual check decisions and evidence</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadManualChecks} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-yellow-500/10 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-500">{stats.total}</p>
            <p className="text-xs text-yellow-500/70">Total Manual Checks</p>
          </div>
          <div className="p-3 bg-green-500/10 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-500">{stats.withEvidence}</p>
            <p className="text-xs text-green-500/70">With Evidence</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-500">{stats.withoutEvidence}</p>
            <p className="text-xs text-red-500/70">Missing Evidence</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg text-center">
            <p className="text-2xl font-bold text-primary">{stats.confirmed}</p>
            <p className="text-xs text-primary/70">Confirmed</p>
          </div>
        </div>

        {/* Missing Evidence Warning */}
        {stats.withoutEvidence > 0 && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-6">
            <div className="flex items-center gap-2 text-red-500 font-medium mb-2">
              <AlertTriangle className="w-5 h-5" />
              {stats.withoutEvidence} Manual Check(s) Missing Evidence
            </div>
            <p className="text-sm text-muted-foreground">
              These checks should include photo + notes to be compliant. Follow up with staff.
            </p>
          </div>
        )}

        {/* Checks List */}
        {checks.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No manual checks tonight.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {checks.map(check => {
              const evidence = check.manual_check_evidence[0];
              const hasEvidence = !!evidence;

              return (
                <div
                  key={check.id}
                  className={`p-4 rounded-lg border ${
                    !hasEvidence
                      ? "border-red-500/50 bg-red-500/5"
                      : evidence.evidence_confirmed
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-yellow-500/30 bg-yellow-500/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {!hasEvidence ? (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            No Evidence
                          </Badge>
                        ) : (
                          <>
                            {getDecisionBadge(evidence.final_decision)}
                            {evidence.evidence_confirmed && (
                              <Badge variant="outline" className="text-green-500 border-green-500/50">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Confirmed
                              </Badge>
                            )}
                          </>
                        )}
                      </div>

                      {hasEvidence && (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            <span className="line-clamp-2">{evidence.notes}</span>
                          </div>
                          {evidence.photo_url && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Camera className="w-4 h-4" />
                              <span>Photo attached</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-sm font-mono">
                        {new Date(check.created_at).toLocaleTimeString()}
                      </p>
                      {hasEvidence && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedCheck(evidence)}>
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Manual Check Evidence</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Decision</label>
                                <div className="mt-1">
                                  {evidence.final_decision === "allow" ? (
                                    <Badge className="bg-green-500/20 text-green-500">
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Allowed Entry
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-red-500/20 text-red-500">
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Denied Entry
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Notes</label>
                                <p className="mt-1 p-3 bg-muted/50 rounded-lg text-sm">
                                  {evidence.notes}
                                </p>
                              </div>
                              {evidence.photo_url && (
                                <div>
                                  <label className="text-sm font-medium">Photo Evidence</label>
                                  <img
                                    src={evidence.photo_url}
                                    alt="Evidence"
                                    className="mt-1 rounded-lg max-h-64 object-contain"
                                  />
                                </div>
                              )}
                              <div>
                                <label className="text-sm font-medium">Timestamp</label>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {new Date(evidence.created_at).toLocaleString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Evidence Confirmed:</label>
                                {evidence.evidence_confirmed ? (
                                  <Badge className="bg-green-500/20 text-green-500">Yes</Badge>
                                ) : (
                                  <Badge variant="outline">Pending</Badge>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManualCheckEvidence;
