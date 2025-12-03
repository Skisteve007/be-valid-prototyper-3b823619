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
import { Plus, CheckCircle, DollarSign, Users, TrendingUp, Trash2 } from "lucide-react";

interface Affiliate {
  id: string;
  user_id: string;
  referral_code: string;
  total_earnings: number;
  pending_earnings: number;
  total_clicks: number;
  paypal_email: string | null;
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>PayPal</TableHead>
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
                        <p className="font-medium">{aff.profile?.full_name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{aff.profile?.member_id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {aff.referral_code}
                      </Badge>
                    </TableCell>
                    <TableCell>{aff.total_clicks}</TableCell>
                    <TableCell className="text-xs">
                      {aff.paypal_email || <span className="text-muted-foreground">Not set</span>}
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
    </div>
  );
};

export default SalesTeamTab;
