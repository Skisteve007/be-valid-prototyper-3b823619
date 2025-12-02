import { useState, useEffect, useRef } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FlaskConical, Loader2, TestTube, Key, Image, Upload, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LabPartnersManager } from "./LabPartnersManager";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface CertifiedProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  lab_certified: boolean;
  lab_logo_url: string | null;
  member_id: string | null;
}

export const LabIntegrationsTab = () => {
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [certifiedProfiles, setCertifiedProfiles] = useState<CertifiedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLogos, setLoadingLogos] = useState(true);
  const [simulateDialogOpen, setSimulateDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [selectedProfileForLogo, setSelectedProfileForLogo] = useState<string | null>(null);

  useEffect(() => {
    fetchLabOrders();
    fetchCertifiedProfiles();
  }, []);

  const fetchCertifiedProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, lab_certified, lab_logo_url, member_id")
        .eq("lab_certified", true)
        .order("full_name", { ascending: true });

      if (error) throw error;
      setCertifiedProfiles(data || []);
    } catch (error: any) {
      console.error("Error fetching certified profiles:", error);
      toast.error("Failed to load certified profiles");
    } finally {
      setLoadingLogos(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, profileId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(profileId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `lab-logo-${profileId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ lab_logo_url: publicUrl })
        .eq('id', profileId);

      if (updateError) throw updateError;

      toast.success("Lab logo updated successfully");
      await fetchCertifiedProfiles();
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload lab logo");
    } finally {
      setUploadingLogo(null);
      setSelectedProfileForLogo(null);
    }
  };

  const handleRemoveLogo = async (profileId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ lab_logo_url: null })
        .eq('id', profileId);

      if (error) throw error;

      toast.success("Lab logo removed");
      await fetchCertifiedProfiles();
    } catch (error: any) {
      console.error("Error removing logo:", error);
      toast.error("Failed to remove lab logo");
    }
  };

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
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">
            <FlaskConical className="h-4 w-4 mr-2" />
            Lab Orders
          </TabsTrigger>
          <TabsTrigger value="logos">
            <Image className="h-4 w-4 mr-2" />
            Lab Logos
          </TabsTrigger>
          <TabsTrigger value="partners">
            <Key className="h-4 w-4 mr-2" />
            API Partners
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FlaskConical className="h-6 w-6" />
                Lab Orders
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
        </TabsContent>

        <TabsContent value="logos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Image className="h-6 w-6" />
                Lab Logo Management
              </CardTitle>
              <CardDescription>
                Upload and manage lab logos for certified members
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingLogos ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : certifiedProfiles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No lab-certified members found
                </div>
              ) : (
                <div className="space-y-4">
                  {certifiedProfiles.map((profile) => (
                    <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded border-2 border-cyan-500/50 bg-white flex items-center justify-center overflow-hidden">
                          {profile.lab_logo_url ? (
                            <img 
                              src={profile.lab_logo_url} 
                              alt="Lab Logo" 
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <span className="text-xs text-gray-400 text-center">No Logo</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{profile.full_name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground font-mono">{profile.member_id}</p>
                          <Badge className="bg-green-600 mt-1">Lab Certified</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id={`logo-upload-${profile.id}`}
                          onChange={(e) => handleLogoUpload(e, profile.id)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`logo-upload-${profile.id}`)?.click()}
                          disabled={uploadingLogo === profile.id}
                        >
                          {uploadingLogo === profile.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              {profile.lab_logo_url ? "Change" : "Upload"}
                            </>
                          )}
                        </Button>
                        {profile.lab_logo_url && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveLogo(profile.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners">
          <LabPartnersManager />
        </TabsContent>
      </Tabs>

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
