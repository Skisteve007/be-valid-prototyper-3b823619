import { useState } from "react";
import { 
  Shield, 
  FileText, 
  Download, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Building2,
  Clock,
  Users,
  BarChart3,
  Lock,
  FileJson,
  FileSpreadsheet
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface Finding {
  id: string;
  reason_code: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  affected_records: number;
  sample_values?: string[];
  suggested_fix?: string;
}

interface SeatMetric {
  seat_id: number;
  seat_name: string;
  provider: string;
  status: string;
  latency_ms: number;
  score: number;
  confidence: number;
}

interface B2BReportData {
  trace_id: string;
  created_at: string;
  source_type: string;
  dataset_type: string;
  integrity_score: number;
  tier: "PASS" | "REVIEW" | "DENY";
  
  // Counts
  total_records: number;
  cleaned_records: number;
  flagged_records: number;
  high_risk_records: number;
  
  // Findings grouped by reason code
  findings: Finding[];
  
  // Governance details
  seats: SeatMetric[];
  judge_used: boolean;
  avg_latency_ms: number;
  synth_index_summary: string;
  
  // Attestation
  retention_mode: "minimal" | "standard" | "extended";
  data_handling_statement: string;
}

interface B2BReportPackProps {
  data: B2BReportData;
  onDownloadPDF?: () => void;
  onDownloadJSON?: () => void;
  onDownloadCSV?: () => void;
  onDownloadExceptionsCSV?: () => void;
}

const B2BReportPack = ({ 
  data, 
  onDownloadPDF, 
  onDownloadJSON, 
  onDownloadCSV,
  onDownloadExceptionsCSV 
}: B2BReportPackProps) => {
  const [findingsExpanded, setFindingsExpanded] = useState(true);

  const getTierConfig = (tier: string) => {
    switch (tier) {
      case "PASS":
        return {
          icon: CheckCircle,
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/20",
          borderColor: "border-emerald-500/50"
        };
      case "REVIEW":
        return {
          icon: AlertTriangle,
          color: "text-amber-400",
          bgColor: "bg-amber-500/20",
          borderColor: "border-amber-500/50"
        };
      case "DENY":
        return {
          icon: XCircle,
          color: "text-red-400",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/50"
        };
      default:
        return {
          icon: Shield,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          borderColor: "border-border"
        };
    }
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "critical":
        return { color: "text-red-400", bgColor: "bg-red-500/20", borderColor: "border-red-500/50" };
      case "high":
        return { color: "text-orange-400", bgColor: "bg-orange-500/20", borderColor: "border-orange-500/50" };
      case "medium":
        return { color: "text-amber-400", bgColor: "bg-amber-500/20", borderColor: "border-amber-500/50" };
      default:
        return { color: "text-blue-400", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/50" };
    }
  };

  const tierConfig = getTierConfig(data.tier);
  const TierIcon = tierConfig.icon;

  // Group findings by reason code
  const findingsByCode = data.findings.reduce((acc, finding) => {
    if (!acc[finding.reason_code]) {
      acc[finding.reason_code] = [];
    }
    acc[finding.reason_code].push(finding);
    return acc;
  }, {} as Record<string, Finding[]>);

  return (
    <div className="space-y-6">
      {/* Header Card - Executive Summary */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 border border-primary/40">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Verification & Governance Report Pack</CardTitle>
                <CardDescription>Enterprise Data Integrity Assessment</CardDescription>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${tierConfig.bgColor} ${tierConfig.color} ${tierConfig.borderColor} px-3 py-1`}
            >
              <TierIcon className="h-4 w-4 mr-1" />
              {data.tier}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-background/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Building2 className="h-3 w-3" />
                Source
              </div>
              <p className="font-medium text-sm">{data.source_type}</p>
              <p className="text-xs text-muted-foreground">{data.dataset_type}</p>
            </div>
            
            <div className="p-3 bg-background/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Clock className="h-3 w-3" />
                Run Date
              </div>
              <p className="font-medium text-sm">
                {new Date(data.created_at).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(data.created_at).toLocaleTimeString()}
              </p>
            </div>
            
            <div className="p-3 bg-background/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <BarChart3 className="h-3 w-3" />
                Integrity Score
              </div>
              <p className="font-bold text-2xl">{data.integrity_score}</p>
            </div>
            
            <div className="p-3 bg-background/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <FileText className="h-3 w-3" />
                Trace ID
              </div>
              <code className="text-xs text-primary font-mono break-all">{data.trace_id}</code>
            </div>
          </div>

          {/* Record Counts */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-muted/30 rounded">
              <p className="text-lg font-bold">{data.total_records}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/30">
              <p className="text-lg font-bold text-emerald-400">{data.cleaned_records}</p>
              <p className="text-xs text-muted-foreground">Cleaned</p>
            </div>
            <div className="p-2 bg-amber-500/10 rounded border border-amber-500/30">
              <p className="text-lg font-bold text-amber-400">{data.flagged_records}</p>
              <p className="text-xs text-muted-foreground">Flagged</p>
            </div>
            <div className="p-2 bg-red-500/10 rounded border border-red-500/30">
              <p className="text-lg font-bold text-red-400">{data.high_risk_records}</p>
              <p className="text-xs text-muted-foreground">High Risk</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="findings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="attestation">Attestation</TabsTrigger>
        </TabsList>

        {/* Findings Tab */}
        <TabsContent value="findings" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Findings & Exception Report
              </CardTitle>
              <CardDescription>
                {data.findings.length} issues found across {Object.keys(findingsByCode).length} categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(findingsByCode).map(([code, findings]) => (
                <Collapsible key={code} defaultOpen={findings.some(f => f.severity === "critical" || f.severity === "high")}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {code}
                        </Badge>
                        <span className="text-sm">{findings.length} issue(s)</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-3 pb-3">
                    <div className="space-y-2">
                      {findings.map((finding) => {
                        const sevConfig = getSeverityConfig(finding.severity);
                        return (
                          <div 
                            key={finding.id} 
                            className={`p-3 rounded border ${sevConfig.borderColor} ${sevConfig.bgColor.replace('/20', '/10')}`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="text-sm text-foreground">{finding.description}</p>
                              <Badge variant="outline" className={`${sevConfig.bgColor} ${sevConfig.color} ${sevConfig.borderColor} shrink-0`}>
                                {finding.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Affected: {finding.affected_records} records
                            </p>
                            {finding.suggested_fix && (
                              <p className="text-xs text-primary mt-1">
                                Fix: {finding.suggested_fix}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}

              {data.findings.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-emerald-400" />
                  <p>No issues found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Governance Tab */}
        <TabsContent value="governance" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Governance Details
              </CardTitle>
              <CardDescription>
                Multi-model orchestration summary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-muted/30 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Seats Used</p>
                  <p className="font-bold text-lg">{data.seats.filter(s => s.status === "online").length}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Abstains</p>
                  <p className="font-bold text-lg">{data.seats.filter(s => s.status !== "online").length}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Avg Latency</p>
                  <p className="font-bold text-lg">{data.avg_latency_ms}ms</p>
                </div>
                <div className="p-3 bg-muted/30 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Judge Used</p>
                  <p className="font-bold text-lg">{data.judge_used ? "Yes" : "No"}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">Seat Performance</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Seat</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Latency</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.seats.map((seat) => (
                      <TableRow key={seat.seat_id}>
                        <TableCell className="font-medium">{seat.provider}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={seat.status === "online" ? "text-emerald-400" : "text-muted-foreground"}>
                            {seat.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{seat.latency_ms}ms</TableCell>
                        <TableCell className="text-right">{seat.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="p-3 bg-muted/30 rounded border border-border">
                <p className="text-xs text-muted-foreground mb-1">Synth Index Computation</p>
                <p className="text-sm text-foreground">{data.synth_index_summary}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attestation Tab */}
        <TabsContent value="attestation" className="mt-4">
          <Card className="border-cyan-500/30 bg-cyan-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-cyan-400" />
                Data Handling Attestation
              </CardTitle>
              <CardDescription>
                Conduit Model Compliance Statement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-background/50 rounded-lg border border-cyan-500/30">
                <p className="text-sm text-foreground leading-relaxed">
                  {data.data_handling_statement || 
                    "Sources of truth retain raw data; Valid/SYNTH acts as a conduit — orchestrating verification, applying governance rules, and returning signed tokens. We retain only minimal artifacts (timestamps, hashes, audit trails) necessary for compliance and do not store raw PII or source records."}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-muted/30 rounded border border-border text-center">
                  <Shield className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs font-medium">Retention Mode</p>
                  <p className="text-xs text-muted-foreground capitalize">{data.retention_mode}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded border border-border text-center">
                  <Lock className="h-5 w-5 mx-auto mb-1 text-cyan-400" />
                  <p className="text-xs font-medium">Raw Data</p>
                  <p className="text-xs text-muted-foreground">Not Stored</p>
                </div>
                <div className="p-3 bg-muted/30 rounded border border-border text-center">
                  <CheckCircle className="h-5 w-5 mx-auto mb-1 text-emerald-400" />
                  <p className="text-xs font-medium">Audit Trail</p>
                  <p className="text-xs text-muted-foreground">Hash Chained</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Download Actions */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm font-medium mb-3">Download Report Pack</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {onDownloadPDF && (
              <Button variant="outline" size="sm" onClick={onDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF Report
              </Button>
            )}
            {onDownloadJSON && (
              <Button variant="outline" size="sm" onClick={onDownloadJSON}>
                <FileJson className="h-4 w-4 mr-2" />
                Audit JSON
              </Button>
            )}
            {onDownloadCSV && (
              <Button variant="outline" size="sm" onClick={onDownloadCSV}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Cleaned CSV
              </Button>
            )}
            {onDownloadExceptionsCSV && (
              <Button variant="outline" size="sm" onClick={onDownloadExceptionsCSV}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Exceptions CSV
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BReportPack;
