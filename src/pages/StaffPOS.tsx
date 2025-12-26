import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  QrCode, Beer, DoorOpen, Crown, Shirt, 
  CheckCircle2, XCircle, Clock, LogOut, RefreshCw, User
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Transaction {
  id: string;
  time: string;
  amount: number;
  type: string;
  status: "success" | "failed" | "pending";
  platformFee?: number;
  usedFreeCredit?: boolean;
  venueNet?: number;
}

interface ChargeResult {
  previousBalanceCents: number;
  newBalanceCents: number;
  platformFeeCents: number;
  venueNetCents: number;
  usedFreeCredit: boolean;
  freeCreditsRemaining: number;
}

const StaffPOS = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<"success" | "failed" | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [staffName, setStaffName] = useState("Staff Member");
  const [venueId, setVenueId] = useState<string | null>(null);
  const [staffUserId, setStaffUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Current guest state
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);
  const [currentGuestName, setCurrentGuestName] = useState<string | null>(null);
  const [currentGuestBalance, setCurrentGuestBalance] = useState<number | null>(null);
  const [memberInputOpen, setMemberInputOpen] = useState(false);
  const [memberInputValue, setMemberInputValue] = useState("");
  const [pendingChargeType, setPendingChargeType] = useState<{ type: string; amount: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastChargeResult, setLastChargeResult] = useState<ChargeResult | null>(null);

  useEffect(() => {
    checkAccessAndLoad();
  }, []);

  const checkAccessAndLoad = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/vendor-portal");
        return;
      }

      setStaffUserId(session.user.id);

      // Check if user is staff or venue operator
      const { data: venueOp } = await supabase
        .from("venue_operators")
        .select("venue_id, access_level")
        .eq("user_id", session.user.id)
        .maybeSingle();

      const { data: staffShift } = await supabase
        .from("staff_shifts")
        .select("venue_id, staff_name")
        .eq("staff_user_id", session.user.id)
        .eq("is_active", true)
        .maybeSingle();

      // Also check if admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const isAdmin = roles?.some(r => r.role === "administrator");

      if (!venueOp && !staffShift && !isAdmin) {
        toast.error("Access denied. Staff privileges required.");
        navigate("/vendor-portal");
        return;
      }

      if (staffShift) {
        setStaffName(staffShift.staff_name);
        setVenueId(staffShift.venue_id);
      } else if (venueOp) {
        setVenueId(venueOp.venue_id);
        setStaffName("Manager");
      } else if (isAdmin) {
        // For admins without venue assignment, get first venue
        const { data: venues } = await supabase
          .from("partner_venues")
          .select("id")
          .limit(1)
          .single();
        if (venues) {
          setVenueId(venues.id);
        }
        setStaffName("Admin");
      }

      // Load recent transactions from pos_charges
      if (venueOp?.venue_id || staffShift?.venue_id) {
        const targetVenueId = staffShift?.venue_id || venueOp?.venue_id;
        const { data: recentCharges } = await supabase
          .from("pos_charges")
          .select("*")
          .eq("venue_id", targetVenueId)
          .order("created_at", { ascending: false })
          .limit(20);

        if (recentCharges && recentCharges.length > 0) {
          const mappedTransactions: Transaction[] = recentCharges.map((c) => ({
            id: c.id,
            time: new Date(c.created_at).toLocaleTimeString(),
            amount: c.amount_cents / 100,
            type: c.charge_type,
            status: "success" as const,
            platformFee: c.platform_fee_cents / 100,
            usedFreeCredit: c.used_free_credit,
          }));
          setTransactions(mappedTransactions);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = async () => {
    // Open member input dialog to paste/scan member ID
    setPendingChargeType(null);
    setMemberInputValue("");
    setMemberInputOpen(true);
  };

  const processCharge = async (memberId: string, chargeType: string, amountCents: number) => {
    if (!venueId || !staffUserId) {
      toast.error("Missing venue or staff configuration");
      return false;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-pos-charge", {
        body: {
          venueId,
          staffUserId,
          memberId,
          chargeType,
          amountCents,
        },
      });

      if (error) {
        console.error("Charge error:", error);
        toast.error(`Charge failed: ${error.message}`);
        setLastScanResult("failed");
        return false;
      }

      if (!data.ok) {
        toast.error(`DENIED — ${data.error}`);
        setLastScanResult("failed");
        return false;
      }

      // Update guest balance from response
      if (data.wallet) {
        setCurrentGuestBalance(data.wallet.new_balance_cents / 100);
      }

      // Update guest name if available
      if (data.charge?.memberName) {
        setCurrentGuestName(data.charge.memberName);
      }

      // Store last charge result for breakdown display
      setLastChargeResult({
        previousBalanceCents: data.wallet?.previous_balance_cents || 0,
        newBalanceCents: data.wallet?.new_balance_cents || 0,
        platformFeeCents: data.split.platform_fee_cents,
        venueNetCents: data.split.venue_net_cents,
        usedFreeCredit: data.split.used_free_credit,
        freeCreditsRemaining: data.split.free_scan_credits_remaining,
      });

      // Success - add to transaction log
      const newTx: Transaction = {
        id: data.charge.id,
        time: new Date().toLocaleTimeString(),
        amount: amountCents / 100,
        type: chargeType,
        status: "success",
        platformFee: data.split.platform_fee_cents / 100,
        usedFreeCredit: data.split.used_free_credit,
        venueNet: data.split.venue_net_cents / 100,
      };
      setTransactions((prev) => [newTx, ...prev.slice(0, 19)]);

      // Show success toast with wallet info
      const feeMessage = data.split.used_free_credit
        ? "FREE credit used"
        : `Platform fee $${(data.split.platform_fee_cents / 100).toFixed(2)}`;
      
      const balanceMessage = data.wallet 
        ? ` | Balance: $${(data.wallet.new_balance_cents / 100).toFixed(2)}`
        : "";
      
      toast.success(`APPROVED — ${chargeType} $${(amountCents / 100).toFixed(2)} (${feeMessage})${balanceMessage}`);
      setLastScanResult("success");

      return true;
    } catch (err) {
      console.error("Charge error:", err);
      toast.error("Charge failed: Network error");
      setLastScanResult("failed");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMemberSubmit = async () => {
    const memberId = memberInputValue.trim();
    
    // Parse member ID - support both raw and VALID: prefix
    let cleanMemberId = memberId;
    if (memberId.startsWith("VALID:")) {
      cleanMemberId = memberId.replace("VALID:", "");
    }

    if (!cleanMemberId) {
      toast.error("Please enter a valid member ID");
      return;
    }

    setMemberInputOpen(false);
    setCurrentMemberId(cleanMemberId);

    if (pendingChargeType) {
      // Process the pending charge
      await processCharge(cleanMemberId, pendingChargeType.type, pendingChargeType.amount);
      setPendingChargeType(null);
    } else {
      // Just a scan/verify - do a $0 ENTRY check (or just set current guest)
      toast.success(`Guest set: ${cleanMemberId}`);
      setLastScanResult("success");
    }
  };

  const handleQuickKey = async (type: string, amount: number) => {
    const amountCents = Math.round(amount * 100);

    if (!currentMemberId) {
      // Need to get member ID first
      setPendingChargeType({ type, amount: amountCents });
      setMemberInputValue("");
      setMemberInputOpen(true);
      return;
    }

    // Process immediately with current guest
    await processCharge(currentMemberId, type, amountCents);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/vendor-portal");
  };

  const clearCurrentGuest = () => {
    setCurrentMemberId(null);
    setCurrentGuestName(null);
    setCurrentGuestBalance(null);
    setLastScanResult(null);
    setLastChargeResult(null);
    toast.info("Guest cleared");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Staff POS Terminal | Valid™</title>
      </Helmet>
      
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className="bg-cyan-500 text-black font-bold">POS</Badge>
              <span className="text-slate-400">{staffName}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <main className="p-4 space-y-4">
          {/* Current Guest Indicator */}
          {currentMemberId && (
            <Card className="bg-slate-800 border-cyan-500/50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-slate-300">Guest:</span>
                    <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                      {currentGuestName || currentMemberId}
                    </Badge>
                    {currentGuestBalance !== null && (
                      <Badge className="bg-green-600 text-white">
                        Balance: ${currentGuestBalance.toFixed(2)}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCurrentGuest}
                    className="text-slate-400 hover:text-white"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
                {/* Last charge breakdown */}
                {lastChargeResult && (
                  <div className="mt-2 pt-2 border-t border-slate-700 text-xs text-slate-400 grid grid-cols-2 gap-1">
                    <span>Charged:</span>
                    <span className="text-right text-green-400">${((lastChargeResult.previousBalanceCents - lastChargeResult.newBalanceCents) / 100).toFixed(2)}</span>
                    <span>Platform Fee:</span>
                    <span className="text-right">{lastChargeResult.usedFreeCredit ? "FREE" : `$${(lastChargeResult.platformFeeCents / 100).toFixed(2)}`}</span>
                    <span>Venue Net:</span>
                    <span className="text-right">${(lastChargeResult.venueNetCents / 100).toFixed(2)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Main Scan Button */}
          <Card className={`bg-gradient-to-br border-2 transition-all duration-300 ${
            lastScanResult === "success" ? "from-green-900/50 to-green-950 border-green-500" :
            lastScanResult === "failed" ? "from-red-900/50 to-red-950 border-red-500" :
            "from-slate-900 to-slate-950 border-cyan-500/50"
          }`}>
            <CardContent className="p-6">
              <Button
                onClick={handleScan}
                disabled={isScanning || isProcessing}
                className={`w-full h-32 text-2xl font-bold rounded-2xl transition-all ${
                  isScanning || isProcessing ? "bg-slate-700" :
                  lastScanResult === "success" ? "bg-green-600 hover:bg-green-500" :
                  lastScanResult === "failed" ? "bg-red-600 hover:bg-red-500" :
                  "bg-cyan-500 hover:bg-cyan-400"
                } text-black`}
              >
                {isScanning || isProcessing ? (
                  <RefreshCw className="w-10 h-10 animate-spin" />
                ) : lastScanResult === "success" ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-10 h-10" />
                    VERIFIED
                  </div>
                ) : lastScanResult === "failed" ? (
                  <div className="flex items-center gap-3">
                    <XCircle className="w-10 h-10" />
                    DENIED
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <QrCode className="w-10 h-10" />
                    SCAN GHOST PASS™
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Keys */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400 uppercase tracking-wider">Quick Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => handleQuickKey("COVER", 10)}
                  disabled={isProcessing}
                  className="h-20 bg-cyan-600 hover:bg-cyan-500 text-white flex flex-col gap-1"
                >
                  <DoorOpen className="w-6 h-6" />
                  <span className="text-xs">Cover Charge</span>
                  <span className="font-bold">$10</span>
                </Button>
                
                <Button 
                  onClick={() => handleQuickKey("DRINK", 12)}
                  disabled={isProcessing}
                  className="h-20 bg-amber-600 hover:bg-amber-500 text-white flex flex-col gap-1"
                >
                  <Beer className="w-6 h-6" />
                  <span className="text-xs">Drink</span>
                  <span className="font-bold">$12</span>
                </Button>
                
                <Button 
                  onClick={() => handleQuickKey("VIP", 50)}
                  disabled={isProcessing}
                  className="h-20 bg-purple-600 hover:bg-purple-500 text-white flex flex-col gap-1"
                >
                  <Crown className="w-6 h-6" />
                  <span className="text-xs">VIP Upgrade</span>
                  <span className="font-bold">$50</span>
                </Button>
                
                <Button 
                  onClick={() => handleQuickKey("SWAG", 25)}
                  disabled={isProcessing}
                  className="h-20 bg-slate-600 hover:bg-slate-500 text-white flex flex-col gap-1"
                >
                  <Shirt className="w-6 h-6" />
                  <span className="text-xs">Swag</span>
                  <span className="font-bold">$25</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recall Log */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recall Log (Last 20)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {transactions.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">No transactions yet</p>
                ) : (
                  transactions.map((tx) => (
                    <div 
                      key={tx.id}
                      className={`flex items-center justify-between p-2 rounded text-sm font-mono ${
                        tx.status === "success" ? "bg-green-500/10" : 
                        tx.status === "failed" ? "bg-red-500/10" : "bg-slate-800"
                      }`}
                    >
                      <span className="text-slate-400">{tx.time}</span>
                      <span className={`
                        ${tx.type === "ENTRY" ? "text-cyan-400" : ""}
                        ${tx.type === "BAR" || tx.type === "DRINK" ? "text-amber-400" : ""}
                        ${tx.type === "VIP" ? "text-purple-400" : ""}
                        ${tx.type === "SWAG" ? "text-slate-300" : ""}
                        ${tx.type === "COVER" ? "text-cyan-400" : ""}
                      `}>
                        {tx.type}
                      </span>
                      <span className="text-green-400">${tx.amount.toFixed(2)}</span>
                      <span className="text-xs text-slate-500">
                        {tx.usedFreeCredit ? "FREE" : tx.platformFee !== undefined ? `-$${tx.platformFee.toFixed(2)}` : ""}
                      </span>
                      <span>
                        {tx.status === "success" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Member ID Input Dialog */}
      <Dialog open={memberInputOpen} onOpenChange={setMemberInputOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">
              {pendingChargeType ? `Enter Member ID for ${pendingChargeType.type}` : "Scan/Enter Member ID"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Paste or type the member ID (e.g., CC-12345678 or VALID:CC-12345678)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={memberInputValue}
              onChange={(e) => setMemberInputValue(e.target.value)}
              placeholder="CC-12345678"
              className="bg-slate-800 border-slate-600 text-white"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleMemberSubmit();
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleMemberSubmit}
                disabled={!memberInputValue.trim() || isProcessing}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Confirm"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setMemberInputOpen(false)}
                className="border-slate-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StaffPOS;
