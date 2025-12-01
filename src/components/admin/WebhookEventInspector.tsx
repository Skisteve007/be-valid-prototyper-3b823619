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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RefreshCw, PlayCircle, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface WebhookEvent {
  id: string;
  event_type: string;
  payload: any;
  response_status: number;
  response_body: any;
  error_message: string | null;
  created_at: string;
  lab_partners: {
    name: string;
  } | null;
}

export const WebhookEventInspector = ({ onRefresh }: { onRefresh: () => void }) => {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [replaying, setReplaying] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("webhook_events")
        .select(`
          *,
          lab_partners (
            name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error("Error loading webhook events:", error);
      toast.error("Failed to load webhook events");
    } finally {
      setLoading(false);
    }
  };

  const handleReplay = async (event: WebhookEvent) => {
    setReplaying(true);
    try {
      // Call the edge function again with the same payload
      const { data, error } = await supabase.functions.invoke("receive-lab-result", {
        body: event.payload
      });

      if (error) throw error;

      toast.success("Event replayed successfully");
      await loadEvents();
      onRefresh();
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Error replaying event:", error);
      toast.error("Failed to replay event: " + error.message);
    } finally {
      setReplaying(false);
    }
  };

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return <Badge className="bg-green-600">Success</Badge>;
    } else if (status >= 400 && status < 500) {
      return <Badge className="bg-red-600">Client Error</Badge>;
    } else if (status >= 500) {
      return <Badge className="bg-red-800">Server Error</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
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
        <p className="text-sm text-muted-foreground">
          Showing {events.length} most recent webhook events
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            loadEvents();
            onRefresh();
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Event Type</TableHead>
              <TableHead>Lab Partner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payload</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No webhook events recorded yet
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-mono text-xs">
                    {format(new Date(event.created_at), "MMM dd, HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.event_type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {event.lab_partners?.name || "Unknown"}
                  </TableCell>
                  <TableCell>{getStatusBadge(event.response_status)}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {JSON.stringify(event.payload).substring(0, 50)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event);
                          setDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {event.response_status !== 200 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReplay(event)}
                          disabled={replaying}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Event Information</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Event Type:</strong> {selectedEvent.event_type}</p>
                  <p><strong>Timestamp:</strong> {format(new Date(selectedEvent.created_at), "PPpp")}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedEvent.response_status)}</p>
                  <p><strong>Lab Partner:</strong> {selectedEvent.lab_partners?.name || "Unknown"}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Request Payload</h4>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                  {JSON.stringify(selectedEvent.payload, null, 2)}
                </pre>
              </div>

              {selectedEvent.response_body && (
                <div>
                  <h4 className="font-semibold mb-2">Response Body</h4>
                  <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(selectedEvent.response_body, null, 2)}
                  </pre>
                </div>
              )}

              {selectedEvent.error_message && (
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Error Message</h4>
                  <div className="bg-red-50 dark:bg-red-950 p-4 rounded-md text-sm text-red-600">
                    {selectedEvent.error_message}
                  </div>
                </div>
              )}

              {selectedEvent.response_status !== 200 && (
                <Button
                  onClick={() => handleReplay(selectedEvent)}
                  disabled={replaying}
                  className="w-full"
                >
                  {replaying ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <PlayCircle className="h-4 w-4 mr-2" />
                  )}
                  Replay Event
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};