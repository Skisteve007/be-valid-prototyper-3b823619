import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, Search, Eye, Download, FileJson, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface ProofRecord {
  id: string;
  request_type: string;
  requester_hash: string | null;
  verdict: string;
  scores: any;
  flags: string[];
  proof_record_id: string;
  input_hash: string;
  output_hash: string;
  lens_summaries: any;
  connector_refs: any;
  signature: string | null;
  signed_at: string | null;
  created_at: string;
}

interface AccountProofRecordsTabProps {
  accountId: string;
}

export const AccountProofRecordsTab = ({ accountId }: AccountProofRecordsTabProps) => {
  const [records, setRecords] = useState<ProofRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<ProofRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    loadRecords();
  }, [accountId]);

  const loadRecords = async () => {
    try {
      const { data, error } = await supabase
        .from("account_proof_records")
        .select("*")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error: any) {
      toast.error("Failed to load proof records");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => 
    record.proof_record_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.request_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.verdict.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getVerdictBadge = (verdict: string) => {
    const colors: Record<string, string> = {
      'OK': 'bg-green-500 text-white',
      'REVIEW': 'bg-yellow-500 text-black',
      'BLOCK': 'bg-red-500 text-white',
    };
    return <Badge className={colors[verdict] || 'bg-muted'}>{verdict}</Badge>;
  };

  const handleExportJSON = (record: ProofRecord) => {
    const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proof-${record.proof_record_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON exported");
  };

  const handleExportPDF = (record: ProofRecord) => {
    // In production, this would generate a proper PDF
    toast.info("PDF export coming soon");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by proof ID, type, or verdict..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      {records.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No proof records yet. Run a demo to generate records.
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead>Proof Record ID</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(record.created_at), "MMM d, h:mm a")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.request_type}</Badge>
                  </TableCell>
                  <TableCell>{getVerdictBadge(record.verdict)}</TableCell>
                  <TableCell className="font-mono text-sm">{record.proof_record_id}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {record.requester_hash ? record.requester_hash.substring(0, 12) + "..." : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportJSON(record)}
                      >
                        <FileJson className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportPDF(record)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-mono">{selectedRecord?.proof_record_id}</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 p-4">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Verdict</p>
                    <p className="mt-1">{getVerdictBadge(selectedRecord.verdict)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Request Type</p>
                    <p className="mt-1 font-medium">{selectedRecord.request_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="mt-1">{format(new Date(selectedRecord.created_at), "PPpp")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Signed</p>
                    <p className="mt-1">
                      {selectedRecord.signed_at 
                        ? format(new Date(selectedRecord.signed_at), "PPpp")
                        : "—"
                      }
                    </p>
                  </div>
                </div>

                {/* Hashes */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Hashes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Input Hash</p>
                      <p className="font-mono text-xs break-all">{selectedRecord.input_hash}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Output Hash</p>
                      <p className="font-mono text-xs break-all">{selectedRecord.output_hash}</p>
                    </div>
                    {selectedRecord.signature && (
                      <div>
                        <p className="text-xs text-muted-foreground">Signature</p>
                        <p className="font-mono text-xs break-all">{selectedRecord.signature}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Scores */}
                {Object.keys(selectedRecord.scores).length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Scores</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                        {JSON.stringify(selectedRecord.scores, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}

                {/* Lens Summaries */}
                {Object.keys(selectedRecord.lens_summaries).length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Lens Summaries</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                        {JSON.stringify(selectedRecord.lens_summaries, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}

                {/* Flags */}
                {selectedRecord.flags.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Flags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecord.flags.map((flag, idx) => (
                          <Badge key={idx} variant="destructive">{flag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Export Buttons */}
                <div className="flex gap-3">
                  <Button onClick={() => handleExportJSON(selectedRecord)} className="gap-2">
                    <Download className="h-4 w-4" /> Export JSON
                  </Button>
                  <Button variant="outline" onClick={() => handleExportPDF(selectedRecord)} className="gap-2">
                    <FileText className="h-4 w-4" /> Export PDF
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
