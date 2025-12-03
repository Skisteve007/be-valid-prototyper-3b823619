import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Copy, DollarSign, MousePointerClick, Users, ArrowLeft, Send } from "lucide-react";
import logo from "@/assets/clean-check-logo.png";

interface AffiliateData {
  id: string;
  referral_code: string;
  total_earnings: number;
  pending_earnings: number;
  total_clicks: number;
  paypal_email: string | null;
}

interface ReferralData {
  id: string;
  status: string;
  commission_amount: number;
  transaction_amount: number;
  created_at: string;
  referred_user: {
    full_name: string | null;
  } | null;
}

const SalesPortal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [requestingPayout, setRequestingPayout] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth?mode=login&redirect=/sales-portal");
      return;
    }
    setUserId(session.user.id);
    fetchAffiliateData(session.user.id);
  };

  const fetchAffiliateData = async (uid: string) => {
    setLoading(true);
    
    // Check if user is an affiliate
    const { data: affData, error: affError } = await supabase
      .from("affiliates")
      .select("*")
      .eq("user_id", uid)
      .maybeSingle();

    if (affError) {
      console.error("Error fetching affiliate:", affError);
      toast.error("Failed to load affiliate data");
      setLoading(false);
      return;
    }

    if (!affData) {
      // Not an affiliate yet
      setAffiliate(null);
      setLoading(false);
      return;
    }

    setAffiliate(affData);
    setPaypalEmail(affData.paypal_email || "");

    // Fetch referrals
    const { data: refData, error: refError } = await supabase
      .from("referrals")
      .select(`
        id,
        status,
        commission_amount,
        transaction_amount,
        created_at,
        referred_user_id
      `)
      .eq("affiliate_id", affData.id)
      .order("created_at", { ascending: false });

    if (!refError && refData) {
      // Map referrals with user names
      const mappedReferrals = refData.map(ref => ({
        ...ref,
        referred_user: null // We'll keep it simple for now
      }));
      setReferrals(mappedReferrals);
    }

    setLoading(false);
  };

  const copyReferralLink = () => {
    if (!affiliate) return;
    const link = `https://cleancheck.fit?ref=${affiliate.referral_code}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied to clipboard!");
  };

  const updatePaypalEmail = async () => {
    if (!affiliate || !paypalEmail) return;

    const { error } = await supabase
      .from("affiliates")
      .update({ paypal_email: paypalEmail })
      .eq("id", affiliate.id);

    if (error) {
      toast.error("Failed to update PayPal email");
      return;
    }

    toast.success("PayPal email updated!");
  };

  const requestPayout = async () => {
    if (!affiliate || !affiliate.paypal_email || affiliate.pending_earnings <= 0) {
      toast.error("Please add PayPal email and have pending earnings");
      return;
    }

    setRequestingPayout(true);

    try {
      const { error } = await supabase.functions.invoke("request-affiliate-payout", {
        body: {
          affiliateId: affiliate.id,
          amount: affiliate.pending_earnings,
          paypalEmail: affiliate.paypal_email,
        },
      });

      if (error) throw error;
      toast.success("Payout request sent! Admin will process it soon.");
    } catch (err) {
      console.error("Payout request error:", err);
      toast.error("Failed to request payout");
    } finally {
      setRequestingPayout(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">Pending</Badge>;
      case "paid":
        return <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">Paid</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/50">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Button>
          
          <Card className="max-w-lg mx-auto">
            <CardHeader className="text-center">
              <img src={logo} alt="Clean Check" className="h-16 mx-auto mb-4" />
              <CardTitle>Become an Affiliate</CardTitle>
              <CardDescription>
                You're not registered as an affiliate yet. Contact admin to get started and earn 20% commission on every referral!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground text-sm">
                Email: <a href="mailto:admin@cleancheck.fit" className="text-primary">admin@cleancheck.fit</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Button>
          <img src={logo} alt="Clean Check" className="h-12" />
        </div>

        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
          Sales Partner Dashboard
        </h1>
        <p className="text-muted-foreground mb-8">
          Track your referrals and earnings. Commission: <span className="text-green-400 font-semibold">20%</span> per sale.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
              <MousePointerClick className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{affiliate.total_clicks}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Signups</CardTitle>
              <Users className="h-4 w-4 text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{referrals.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unpaid Commission</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                ${affiliate.pending_earnings?.toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link */}
        <Card className="mb-8 border-primary/30 bg-gradient-to-br from-primary/5 to-pink-500/5">
          <CardHeader>
            <CardTitle className="text-lg">Your Referral Link</CardTitle>
            <CardDescription>Share this link to earn commission on signups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                readOnly
                value={`https://cleancheck.fit?ref=${affiliate.referral_code}`}
                className="font-mono text-sm bg-background"
              />
              <Button onClick={copyReferralLink} className="shrink-0">
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Your code: <span className="font-mono font-bold text-primary">{affiliate.referral_code}</span>
            </p>
          </CardContent>
        </Card>

        {/* Payout Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Payout Settings</CardTitle>
            <CardDescription>Set your PayPal email to receive payouts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="paypal">PayPal Email</Label>
                <Input
                  id="paypal"
                  type="email"
                  placeholder="your@paypal.com"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                />
              </div>
              <Button onClick={updatePaypalEmail} className="self-end">
                Save
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
              <div>
                <p className="font-medium">Total Earned (All Time)</p>
                <p className="text-2xl font-bold text-green-400">
                  ${affiliate.total_earnings?.toFixed(2) || "0.00"}
                </p>
              </div>
              <Button
                onClick={requestPayout}
                disabled={requestingPayout || !paypalEmail || affiliate.pending_earnings <= 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {requestingPayout ? "Requesting..." : "Request Payout"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Referrals Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No referrals yet. Share your link to start earning!
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((ref) => (
                    <TableRow key={ref.id}>
                      <TableCell className="text-muted-foreground">
                        {new Date(ref.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${ref.transaction_amount.toFixed(2)}</TableCell>
                      <TableCell className="text-green-400 font-medium">
                        ${ref.commission_amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(ref.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesPortal;
