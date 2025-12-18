import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Clock, WifiOff } from "lucide-react";

interface ScanLog {
  id: string;
  scan_result: string;
  deny_reason: string | null;
  created_at: string;
  synced_at: string | null;
  scanned_user_id: string | null;
}

interface ScanLogTableProps {
  venueId: string;
}

const ScanLogTable = ({ venueId }: ScanLogTableProps) => {
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadLogs();
    const channel = supabase
      .channel(`scan-logs-${venueId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "door_scan_log",
          filter: `venue_id=eq.${venueId}`,
        },
        () => {
          loadLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [venueId, filter]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("door_scan_log")
        .select("*")
        .eq("venue_id", venueId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (filter !== "all") {
        query = query.eq("scan_result", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error loading scan logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case "allow":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "deny":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "manual_check":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case "allow":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/50">Allow</Badge>;
      case "deny":
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/50">Deny</Badge>;
      case "manual_check":
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">Manual Check</Badge>;
      default:
        return <Badge variant="outline">{result}</Badge>;
    }
  };

  const stats = {
    total: logs.length,
    allow: logs.filter(l => l.scan_result === "allow").length,
    deny: logs.filter(l => l.scan_result === "deny").length,
    manual: logs.filter(l => l.scan_result === "manual_check").length,
    pending: logs.filter(l => !l.synced_at).length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Scan Logs</CardTitle>
            <CardDescription>Tonight's entry scan results</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ({stats.total})</SelectItem>
                <SelectItem value="allow">Allow ({stats.allow})</SelectItem>
                <SelectItem value="deny">Deny ({stats.deny})</SelectItem>
                <SelectItem value="manual_check">Manual ({stats.manual})</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={loadLogs} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="p-3 bg-green-500/10 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-500">{stats.allow}</p>
            <p className="text-xs text-green-500/70">Allowed</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-500">{stats.deny}</p>
            <p className="text-xs text-red-500/70">Denied</p>
          </div>
          <div className="p-3 bg-yellow-500/10 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-500">{stats.manual}</p>
            <p className="text-xs text-yellow-500/70">Manual</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-muted-foreground">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pending Sync</p>
          </div>
        </div>

        {/* Logs Table */}
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No scan logs yet tonight.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map(log => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getResultIcon(log.scan_result)}
                  <div>
                    <div className="flex items-center gap-2">
                      {getResultBadge(log.scan_result)}
                      {!log.synced_at && (
                        <Badge variant="outline" className="text-xs">
                          <WifiOff className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    {log.deny_reason && (
                      <p className="text-sm text-muted-foreground mt-1">{log.deny_reason}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScanLogTable;
