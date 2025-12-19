import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, Shield, Users } from "lucide-react";
import { toast } from "sonner";

interface AccessRequest {
  user_id: string;
  full_name: string | null;
  email: string | null;
  investor_access_approved: boolean;
  partner_access_approved: boolean;
  investor_access_requested_at: string | null;
  partner_access_requested_at: string | null;
}

export const AccessApprovalManager = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, investor_access_approved, partner_access_approved, investor_access_requested_at, partner_access_requested_at")
        .or("investor_access_requested_at.not.is.null,partner_access_requested_at.not.is.null")
        .order("investor_access_requested_at", { ascending: false, nullsFirst: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching access requests:", error);
      toast.error("Failed to load access requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId: string, accessType: "investor" | "partner", approve: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const updateData = accessType === "investor"
        ? {
            investor_access_approved: approve,
            investor_access_approved_at: approve ? new Date().toISOString() : null,
            access_approved_by: approve ? user?.id : null,
          }
        : {
            partner_access_approved: approve,
            partner_access_approved_at: approve ? new Date().toISOString() : null,
            access_approved_by: approve ? user?.id : null,
          };

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("user_id", userId);

      if (error) throw error;

      toast.success(approve ? "Access approved!" : "Access denied");
      fetchPendingRequests();
    } catch (error) {
      console.error("Error updating access:", error);
      toast.error("Failed to update access");
    }
  };

  const handleRevoke = async (userId: string, accessType: "investor" | "partner") => {
    try {
      const updateData = accessType === "investor"
        ? {
            investor_access_approved: false,
            investor_access_approved_at: null,
            investor_access_requested_at: null,
            access_approved_by: null,
          }
        : {
            partner_access_approved: false,
            partner_access_approved_at: null,
            partner_access_requested_at: null,
            access_approved_by: null,
          };

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("user_id", userId);

      if (error) throw error;

      toast.success(`${accessType === "investor" ? "Investor" : "Partner"} access revoked`);
      fetchPendingRequests();
    } catch (error) {
      console.error("Error revoking access:", error);
      toast.error("Failed to revoke access");
    }
  };

  const pendingInvestor = requests.filter(r => r.investor_access_requested_at && !r.investor_access_approved);
  const pendingPartner = requests.filter(r => r.partner_access_requested_at && !r.partner_access_approved);
  const approved = requests.filter(r => r.investor_access_approved || r.partner_access_approved);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Investor Requests */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-cyan-400" />
            Pending Investor Deck Requests
            {pendingInvestor.length > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingInvestor.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingInvestor.length === 0 ? (
            <p className="text-muted-foreground text-sm">No pending investor requests</p>
          ) : (
            <div className="space-y-3">
              {pendingInvestor.map((req) => (
                <div key={`inv-${req.user_id}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{req.full_name || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">{req.email}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {req.investor_access_requested_at && new Date(req.investor_access_requested_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-500 text-green-500 hover:bg-green-500/20"
                      onClick={() => handleApproval(req.user_id, "investor", true)}
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500/20"
                      onClick={() => handleApproval(req.user_id, "investor", false)}
                    >
                      <X className="w-4 h-4 mr-1" /> Deny
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Partner Requests */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-purple-400" />
            Pending Partner Solutions Requests
            {pendingPartner.length > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingPartner.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingPartner.length === 0 ? (
            <p className="text-muted-foreground text-sm">No pending partner requests</p>
          ) : (
            <div className="space-y-3">
              {pendingPartner.map((req) => (
                <div key={`par-${req.user_id}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{req.full_name || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">{req.email}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {req.partner_access_requested_at && new Date(req.partner_access_requested_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-500 text-green-500 hover:bg-green-500/20"
                      onClick={() => handleApproval(req.user_id, "partner", true)}
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500/20"
                      onClick={() => handleApproval(req.user_id, "partner", false)}
                    >
                      <X className="w-4 h-4 mr-1" /> Deny
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approved Users */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Check className="w-5 h-5 text-green-400" />
            Approved Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approved.length === 0 ? (
            <p className="text-muted-foreground text-sm">No approved users yet</p>
          ) : (
            <div className="space-y-2">
              {approved.map((req) => (
                <div key={`app-${req.user_id}`} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{req.full_name || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">{req.email}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {req.investor_access_approved && (
                      <>
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">Investor</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500/20 h-7 px-2"
                          onClick={() => handleRevoke(req.user_id, "investor")}
                        >
                          <X className="w-3 h-3 mr-1" /> Revoke
                        </Button>
                      </>
                    )}
                    {req.partner_access_approved && (
                      <>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">Partner</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500/20 h-7 px-2"
                          onClick={() => handleRevoke(req.user_id, "partner")}
                        >
                          <X className="w-3 h-3 mr-1" /> Revoke
                        </Button>
                      </>
                    )}
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