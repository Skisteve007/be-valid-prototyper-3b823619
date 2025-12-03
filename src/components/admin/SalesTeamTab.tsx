import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, CheckCircle, DollarSign, Users, TrendingUp, Trash2, Eye, ShieldCheck, Clock } from "lucide-react";
import { MobileDataCard, ResponsiveDataList } from "./MobileDataCard";

interface Affiliate {
  id: string;
  user_id: string;
  referral_code: string;
  total_earnings: number;
  pending_earnings: number;
  total_clicks: number;
  paypal_email: string | null;
  payout_method?: string;
  phone_number?: string;
  id_front_url?: string;
  id_back_url?: string;
  status?: string;
  full_name?: string | null;
  email?: string | null;
  created_at: string;
  profile?: {
    full_name: string | null;
    member_id: string | null;
  };
}

interface Referral {
  id: string;
  affiliate_id: string;
  status: string;
  commission_amount: number;
  created_at: string;
}

const SalesTeamTab = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showIdDialog, setShowIdDialog] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [newAffiliateEmail, setNewAffiliateEmail] = useState("");
  const [newReferralCode, setNewReferralCode] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchAffiliates();
    fetchPendingReferrals();
  }, []);

  const fetchAffiliates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("affiliates")
      .select(`
        *,
        profile:profiles!affiliates_user_id_fkey(full_name, member_id)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching affiliates:", error);
      toast.error("Failed to load affiliates");
    } else {
      // Handle the profile data properly
      const mappedData = (data || []).map(aff => ({
        ...aff,
        profile: Array.isArray(aff.profile) ? aff.profile[0] : aff.profile
      }));
      setAffiliates(mappedData);
    }
    setLoading(false);
  };

  const fetchPendingReferrals = async () => {
    const { data, error } = await supabase
      .from("referrals")
      .select("*")
      .eq("status", "pending");

    if (!error && data) {
      setReferrals(data);
    }
  };

  const addAffiliate = async () => {
    if (!newAffiliateEmail || !newReferralCode) {
      toast.error("Please fill all fields");
      return;
    }

    setAdding(true);

    // Find user by email from auth (we need to look up in profiles)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id")
      .ilike("user_id", `%`) // We need email from auth
      .limit(1);

    // Actually, we need to find user_id by querying auth through a different method
    // For now, let's assume we're creating with the email lookup through admin
    
    // First check if referral code is unique
    const { data: existing } = await supabase
      .from("affiliates")
      .select("id")
      .eq("referral_code", newReferralCode.toUpperCase())
      .maybeSingle();

    if (existing) {
      toast.error("Referral code already exists");
      setAdding(false);
      return;
    }

    // For now, we'll need to add affiliate by user email lookup
    // This would typically be done via edge function with service role
    const { error } = await supabase.functions.invoke("create-affiliate", {
      body: {
        email: newAffiliateEmail,
        referralCode: newReferralCode.toUpperCase(),
      },
    });

    if (error) {
      toast.error("Failed to create affiliate. Make sure user exists.");
    } else {
      toast.success("Affiliate created successfully!");
      setShowAddDialog(false);
      setNewAffiliateEmail("");
      setNewReferralCode("");
      fetchAffiliates();
    }

    setAdding(false);
  };

  const markAsPaid = async (affiliateId: string) => {
    // Update all pending referrals to paid for this affiliate
    const { error: refError } = await supabase
      .from("referrals")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("affiliate_id", affiliateId)
      .eq("status", "pending");

    if (refError) {
      toast.error("Failed to update referrals");
      return;
    }

    // Get current pending amount
    const affiliate = affiliates.find(a => a.id === affiliateId);
    if (!affiliate) return;

    // Move pending to total and clear pending
    const { error: affError } = await supabase
      .from("affiliates")
      .update({
        total_earnings: (affiliate.total_earnings || 0) + (affiliate.pending_earnings || 0),
        pending_earnings: 0,
      })
      .eq("id", affiliateId);

    if (affError) {
      toast.error("Failed to update affiliate balance");
      return;
    }

    toast.success("Marked as paid!");
    fetchAffiliates();
    fetchPendingReferrals();
  };

  const deleteAffiliate = async (affiliateId: string) => {
    if (!confirm("Are you sure? This will delete the affiliate and all their referral history.")) {
      return;
    }

    const { error } = await supabase
      .from("affiliates")
      .delete()
      .eq("id", affiliateId);

    if (error) {
      toast.error("Failed to delete affiliate");
      return;
    }

    toast.success("Affiliate deleted");
    fetchAffiliates();
  };

  const viewIdDocuments = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    setShowIdDialog(true);
  };

  const approveAffiliate = async (affiliateId: string) => {
    const { error } = await (supabase
      .from("affiliates") as any)
      .update({ status: "approved" })
      .eq("id", affiliateId);

    if (error) {
      toast.error("Failed to approve affiliate");
      return;
    }

    toast.success("Affiliate approved!");
    fetchAffiliates();
    setShowIdDialog(false);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><ShieldCheck className="h-3 w-3 mr-1" /> Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const totalOwed = affiliates.reduce((sum, a) => sum + (a.pending_earnings || 0), 0);
  const totalPaid = affiliates.reduce((sum, a) => sum + (a.total_earnings || 0), 0);
  const totalClicks = affiliates.reduce((sum, a) => sum + (a.total_clicks || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sales Team Management</h2>
          <p className="text-muted-foreground">Manage affiliates and track commissions</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Affiliate
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Affiliates</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
            <TrendingUp className="h-4 w-4 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400">Total Owed</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">${totalOwed.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid Out</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">${totalPaid.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Affiliates Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Affiliates</CardTitle>
          <CardDescription>Click "Mark Paid" after you've sent PayPal payment</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : affiliates.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No affiliates yet. Add your first one!</p>
          ) : (
            <ResponsiveDataList
              mobileCards={
                <div className="space-y-3">
                  {affiliates.map((aff) => (
                      <MobileDataCard
                      key={aff.id}
                      title={aff.full_name || aff.profile?.full_name || "Unknown"}
                      subtitle={aff.email || aff.profile?.member_id}
                      badge={{
                        text: aff.status === "approved" ? "✓ Verified" : "Pending",
                        variant: aff.status === "approved" ? "default" : "secondary",
                        className: aff.status === "approved" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }}
                      details={[
                        { label: "Code", value: aff.referral_code },
                        { label: "Phone", value: aff.phone_number || "N/A" },
                        { label: "Payout", value: aff.paypal_email || "Not set" },
                        { 
                          label: "Owed", 
                          value: aff.pending_earnings > 0 
                            ? <span className="text-yellow-400 font-semibold">${aff.pending_earnings.toFixed(2)}</span>
                            : "$0.00"
                        },
                      ]}
                      actions={
                        <>
                          {(aff.id_front_url || aff.id_back_url) && (
                            <Button
                              size="lg"
                              variant="outline"
                              className="h-12 px-4 text-blue-400 border-blue-500/50"
                              onClick={() => viewIdDocuments(aff)}
                            >
                              <Eye className="h-5 w-5 mr-2" /> View ID
                            </Button>
                          )}
                          {aff.pending_earnings > 0 && aff.paypal_email && (
                            <Button
                              size="lg"
                              className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => markAsPaid(aff.id)}
                            >
                              <CheckCircle className="h-5 w-5 mr-2" /> Pay
                            </Button>
                          )}
                          <Button
                            size="lg"
                            variant="destructive"
                            className="h-12 px-4"
                            onClick={() => deleteAffiliate(aff.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </>
                      }
                    />
                  ))}
                </div>
              }
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Payout</TableHead>
                    <TableHead>Owed</TableHead>
                    <TableHead>Total Paid</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliates.map((aff) => (
                    <TableRow key={aff.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{aff.full_name || aff.profile?.full_name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{aff.email || aff.phone_number || aff.profile?.member_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(aff.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {aff.referral_code}
                        </Badge>
                      </TableCell>
                      <TableCell>{aff.total_clicks}</TableCell>
                      <TableCell className="text-xs">
                        <div>
                          <p>{aff.paypal_email || <span className="text-muted-foreground">Not set</span>}</p>
                          {aff.payout_method && (
                            <p className="text-muted-foreground capitalize">{aff.payout_method}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {aff.pending_earnings > 0 ? (
                          <span className="text-yellow-400 font-semibold">
                            ${aff.pending_earnings.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">$0.00</span>
                        )}
                      </TableCell>
                      <TableCell className="text-green-400">
                        ${aff.total_earnings?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {(aff.id_front_url || aff.id_back_url) && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-400 border-blue-500/50 hover:bg-blue-500/10"
                              onClick={() => viewIdDocuments(aff)}
                            >
                              <Eye className="h-3 w-3 mr-1" /> View ID
                            </Button>
                          )}
                          {aff.pending_earnings > 0 && aff.paypal_email && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-400 border-green-500/50 hover:bg-green-500/10"
                              onClick={() => markAsPaid(aff.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" /> Mark Paid
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => deleteAffiliate(aff.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveDataList>
          )}
        </CardContent>
      </Card>

      {/* Add Affiliate Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Affiliate</DialogTitle>
            <DialogDescription>
              Enter the user's email address and create a unique referral code for them.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={newAffiliateEmail}
                onChange={(e) => setNewAffiliateEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                User must already have an account
              </p>
            </div>
            <div>
              <Label htmlFor="code">Referral Code</Label>
              <Input
                id="code"
                placeholder="MIAMIVIP"
                value={newReferralCode}
                onChange={(e) => setNewReferralCode(e.target.value.toUpperCase())}
                className="font-mono uppercase"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Code will be used in: cleancheck.fit?ref=CODE
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addAffiliate} disabled={adding}>
              {adding ? "Creating..." : "Create Affiliate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View ID Documents Dialog */}
      <Dialog open={showIdDialog} onOpenChange={setShowIdDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Identity Verification</DialogTitle>
            <DialogDescription>
              Review the submitted ID documents for {selectedAffiliate?.profile?.full_name || "this affiliate"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAffiliate && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{selectedAffiliate.profile?.full_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedAffiliate.phone_number || "No phone"}</p>
                </div>
                {getStatusBadge(selectedAffiliate.status)}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Government ID (Front)</Label>
                  {selectedAffiliate.id_front_url ? (
                    <a 
                      href={selectedAffiliate.id_front_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block border rounded-lg overflow-hidden hover:border-primary transition-colors"
                    >
                      <img 
                        src={selectedAffiliate.id_front_url} 
                        alt="ID Front" 
                        className="w-full h-48 object-cover"
                      />
                    </a>
                  ) : (
                    <div className="h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                      Not uploaded
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Government ID (Back)</Label>
                  {selectedAffiliate.id_back_url ? (
                    <a 
                      href={selectedAffiliate.id_back_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block border rounded-lg overflow-hidden hover:border-primary transition-colors"
                    >
                      <img 
                        src={selectedAffiliate.id_back_url} 
                        alt="ID Back" 
                        className="w-full h-48 object-cover"
                      />
                    </a>
                  ) : (
                    <div className="h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                      Not uploaded
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Click on an image to view full size in a new tab.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIdDialog(false)}>
              Close
            </Button>
            {selectedAffiliate?.status === "pending" && (
              <Button 
                onClick={() => selectedAffiliate && approveAffiliate(selectedAffiliate.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <ShieldCheck className="h-4 w-4 mr-2" /> Approve Partner
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesTeamTab;
