import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle, XCircle, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Exception {
  id: string;
  order_id: string;
  user_id: string;
  exception_type: string;
  exception_reason: string;
  status: string;
  notified_at: string | null;
  resolved_at: string | null;
  notes: string | null;
  created_at: string;
  profiles: {
    full_name: string;
  } | null;
  lab_orders: {
    barcode_value: string;
  } | null;
}

export const ExceptionEngine = ({ onRefresh }: { onRefresh: () => void }) => {
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedException, setSelectedException] = useState<Exception | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    loadExceptions();
  }, []);

  const loadExceptions = async () => {
    try {
      // First fetch exceptions
      const { data: exceptionsData, error: exceptionsError } = await supabase
        .from("exception_queue")
        .select("*, lab_orders(barcode_value)")
        .order("created_at", { ascending: false });

      if (exceptionsError) throw exceptionsError;

      // Then fetch profile data for each exception
      const exceptionsWithProfiles = await Promise.all(
        (exceptionsData || []).map(async (exception) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", exception.user_id)
            .single();

          return {
            ...exception,
            profiles: profile || { full_name: "Unknown" },
          };
        })
      );

      setExceptions(exceptionsWithProfiles);
    } catch (error: any) {
      console.error("Error loading exceptions:", error);
      toast.error("Failed to load exceptions");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedException) return;

    setResolving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("exception_queue")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
          resolved_by: user?.id,
          notes: notes || selectedException.notes
        })
        .eq("id", selectedException.id);

      if (error) throw error;

      toast.success("Exception marked as resolved");
      setDialogOpen(false);
      setSelectedException(null);
      setNotes("");
      await loadExceptions();
      onRefresh();
    } catch (error: any) {
      console.error("Error resolving exception:", error);
      toast.error("Failed to resolve exception");
    } finally {
      setResolving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>;
      case "notified":
        return <Badge className="bg-blue-600">Notified</Badge>;
      case "resolved":
        return <Badge className="bg-green-600">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getExceptionIcon = (type: string) => {
    if (type === "sample_damaged") {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {exceptions.filter(e => e.status === "pending").length} pending exceptions
          </p>
          <p className="text-xs text-muted-foreground">
            Automated notifications sent to users for sample issues
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Exception Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exceptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No exceptions in queue
                </TableCell>
              </TableRow>
            ) : (
              exceptions.map((exception) => (
                <TableRow key={exception.id}>
                  <TableCell className="font-mono text-xs">
                    {format(new Date(exception.created_at), "MMM dd, HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{exception.profiles?.full_name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground font-mono">{exception.user_id.slice(0, 8)}...</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getExceptionIcon(exception.exception_type)}
                      <span className="text-sm capitalize">
                        {exception.exception_type.replace(/_/g, " ")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{exception.exception_reason}</TableCell>
                  <TableCell>{getStatusBadge(exception.status)}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {exception.lab_orders?.barcode_value}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedException(exception);
                        setNotes(exception.notes || "");
                        setDialogOpen(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Exception Details</DialogTitle>
          </DialogHeader>
          {selectedException && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold">User</p>
                  <p className="text-sm">{selectedException.profiles?.full_name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{selectedException.user_id}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Exception Type</p>
                  <p className="text-sm capitalize">{selectedException.exception_type.replace(/_/g, " ")}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Reason</p>
                  <p className="text-sm">{selectedException.exception_reason}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Status</p>
                  {getStatusBadge(selectedException.status)}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Resolution Notes</p>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about how this exception was resolved..."
                  rows={4}
                />
              </div>

              {selectedException.notified_at && (
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md text-sm">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    User Notified
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
                    {format(new Date(selectedException.notified_at), "PPpp")}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            {selectedException?.status !== "resolved" && (
              <Button
                onClick={handleResolve}
                disabled={resolving}
                className="bg-green-600 hover:bg-green-700"
              >
                {resolving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Mark as Resolved
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};