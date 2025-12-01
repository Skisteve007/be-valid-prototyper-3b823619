import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FlaskConical, Loader2, TestTube } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LabOrder {
  id: string;
  user_id: string;
  order_status: string;
  barcode_value: string;
  result_status: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

export const LabIntegrationsTab = () => {
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulateDialogOpen, setSimulateDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchLabOrders();
  }, []);

  const fetchLabOrders = async () => {
    try {
      // Fetch lab orders first
      const { data: ordersData, error: ordersError } = await supabase
        .from("lab_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Then fetch profile names for each order
      const ordersWithProfiles = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", order.user_id)
            .single();

          return {
            ...order,
            profiles: profile || { full_name: "Unknown" },
          };
        })
      );

      setOrders(ordersWithProfiles);
    } catch (error: any) {
      console.error("Error fetching lab orders:", error);
      toast.error("Failed to load lab orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateResult = (order: LabOrder) => {
    setSelectedOrder(order);
    setSimulateDialogOpen(true);
  };

  const simulateLabResult = async (result: "negative" | "positive") => {
    if (!selectedOrder) return;

    setSimulating(true);
    try {
      // Update lab order
      const { error: updateError } = await supabase
        .from("lab_orders")
        .update({
          result_status: result,
          order_status: "result_received",
        })
        .eq("id", selectedOrder.id);

      if (updateError) throw updateError;

      // If negative, mark profile as verified
      if (result === "negative") {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            status_color: "green",
          })
          .eq("user_id", selectedOrder.user_id);

        if (profileError) throw profileError;
      }

      toast.success(
        `Lab result simulated: ${result.toUpperCase()}. User ${
          result === "negative" ? "verified" : "notified"
        }.`
      );

      setSimulateDialogOpen(false);
      setSelectedOrder(null);
      await fetchLabOrders();
    } catch (error: any) {
      console.error("Error simulating lab result:", error);
      toast.error(error.message || "Failed to simulate lab result");
    } finally {
      setSimulating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10">Pending</Badge>;
      case "sample_collected":
        return <Badge variant="outline" className="bg-blue-500/10">Sample Collected</Badge>;
      case "result_received":
        return <Badge variant="outline" className="bg-green-500/10">Result Received</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getResultBadge = (result: string | null) => {
    if (!result) return <Badge variant="outline">Pending</Badge>;
    switch (result) {
      case "negative":
        return <Badge className="bg-green-600">Negative</Badge>;
      case "positive":
        return <Badge className="bg-red-600">Positive</Badge>;
      case "inconclusive":
        return <Badge className="bg-yellow-600">Inconclusive</Badge>;
      default:
        return <Badge variant="outline">{result}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FlaskConical className="h-6 w-6" />
            Lab Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No lab orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.profiles?.full_name || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {order.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {order.barcode_value}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.order_status)}</TableCell>
                      <TableCell>{getResultBadge(order.result_status)}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleSimulateResult(order)}
                          size="sm"
                          variant="outline"
                          disabled={order.order_status === "result_received"}
                        >
                          <TestTube className="h-4 w-4 mr-2" />
                          Simulate Result
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={simulateDialogOpen} onOpenChange={setSimulateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Simulate Lab Result</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Select a result to simulate for this lab order:
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>User:</strong> {selectedOrder?.profiles?.full_name}
              </p>
              <p className="text-sm">
                <strong>Barcode:</strong> {selectedOrder?.barcode_value}
              </p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              onClick={() => simulateLabResult("negative")}
              disabled={simulating}
              className="bg-green-600 hover:bg-green-700"
            >
              {simulating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Negative"
              )}
            </Button>
            <Button
              onClick={() => simulateLabResult("positive")}
              disabled={simulating}
              variant="destructive"
            >
              {simulating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Positive"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
