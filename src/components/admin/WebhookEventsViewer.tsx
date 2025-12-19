import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Webhook } from "lucide-react";
import { format } from "date-fns";

interface WebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  response_status: number | null;
  error_message: string | null;
  processed_at: string;
  created_at: string;
}

export const WebhookEventsViewer = () => {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("stripe_webhook_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setEvents((data as unknown as WebhookEvent[]) || []);
    } catch (error) {
      console.error("Failed to load webhook events:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: number | null, error: string | null) => {
    if (error) {
      return <Badge variant="destructive">Error</Badge>;
    }
    if (status === 200) {
      return <Badge className="bg-green-500">Success</Badge>;
    }
    if (status && status >= 400) {
      return <Badge variant="destructive">{status}</Badge>;
    }
    return <Badge variant="secondary">Unknown</Badge>;
  };

  const getEventTypeBadge = (eventType: string) => {
    if (eventType.includes("succeeded") || eventType.includes("paid")) {
      return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">{eventType}</Badge>;
    }
    if (eventType.includes("failed") || eventType.includes("deleted")) {
      return <Badge className="bg-red-500/20 text-red-600 border-red-500/30">{eventType}</Badge>;
    }
    if (eventType.includes("updated") || eventType.includes("created")) {
      return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">{eventType}</Badge>;
    }
    return <Badge variant="outline">{eventType}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhook Events
            </CardTitle>
            <CardDescription>Last 20 Stripe webhook events received</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadEvents}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Webhook className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No webhook events received yet</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Event ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{getEventTypeBadge(event.event_type)}</TableCell>
                    <TableCell>
                      {getStatusBadge(event.response_status, event.error_message)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(event.created_at), "MMM d, yyyy h:mm:ss a")}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {event.event_id.substring(0, 20)}...
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
