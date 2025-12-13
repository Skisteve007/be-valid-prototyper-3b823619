import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, Beer, DoorOpen, Crown, Shirt, 
  CheckCircle2, XCircle, Clock, LogOut, RefreshCw
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";

interface Transaction {
  id: string;
  time: string;
  amount: number;
  type: string;
  status: "success" | "failed" | "pending";
}

const StaffPOS = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<"success" | "failed" | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [staffName, setStaffName] = useState("Staff Member");
  const [venueId, setVenueId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      }

      // Load recent transactions for this device (simulated with random data for demo)
      const mockTransactions: Transaction[] = [
        { id: "1", time: new Date().toLocaleTimeString(), amount: 10, type: "ENTRY", status: "success" },
        { id: "2", time: new Date(Date.now() - 60000).toLocaleTimeString(), amount: 24.50, type: "BAR", status: "success" },
        { id: "3", time: new Date(Date.now() - 120000).toLocaleTimeString(), amount: 10, type: "ENTRY", status: "success" },
      ];
      setTransactions(mockTransactions);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    setLastScanResult(null);

    // Simulate scan delay
    setTimeout(() => {
      // In production, this would integrate with camera/scanner
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      setLastScanResult(success ? "success" : "failed");
      
      if (success) {
        const newTx: Transaction = {
          id: Date.now().toString(),
          time: new Date().toLocaleTimeString(),
          amount: 10,
          type: "ENTRY",
          status: "success"
        };
        setTransactions(prev => [newTx, ...prev.slice(0, 19)]);
        toast.success("Ghost Pass™ Verified!");
      } else {
        toast.error("Scan failed - Invalid or expired pass");
      }
      
      setIsScanning(false);
    }, 1500);
  };

  const handleQuickKey = (type: string, amount: number) => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString(),
      amount,
      type,
      status: "success"
    };
    setTransactions(prev => [newTx, ...prev.slice(0, 19)]);
    toast.success(`${type} - $${amount.toFixed(2)} added`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/vendor-portal");
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
          {/* Main Scan Button */}
          <Card className={`bg-gradient-to-br border-2 transition-all duration-300 ${
            lastScanResult === "success" ? "from-green-900/50 to-green-950 border-green-500" :
            lastScanResult === "failed" ? "from-red-900/50 to-red-950 border-red-500" :
            "from-slate-900 to-slate-950 border-cyan-500/50"
          }`}>
            <CardContent className="p-6">
              <Button
                onClick={handleScan}
                disabled={isScanning}
                className={`w-full h-32 text-2xl font-bold rounded-2xl transition-all ${
                  isScanning ? "bg-slate-700" :
                  lastScanResult === "success" ? "bg-green-600 hover:bg-green-500" :
                  lastScanResult === "failed" ? "bg-red-600 hover:bg-red-500" :
                  "bg-cyan-500 hover:bg-cyan-400"
                } text-black`}
              >
                {isScanning ? (
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
                  className="h-20 bg-cyan-600 hover:bg-cyan-500 text-white flex flex-col gap-1"
                >
                  <DoorOpen className="w-6 h-6" />
                  <span className="text-xs">Cover Charge</span>
                  <span className="font-bold">$10</span>
                </Button>
                
                <Button 
                  onClick={() => handleQuickKey("DRINK", 12)}
                  className="h-20 bg-amber-600 hover:bg-amber-500 text-white flex flex-col gap-1"
                >
                  <Beer className="w-6 h-6" />
                  <span className="text-xs">Drink</span>
                  <span className="font-bold">$12</span>
                </Button>
                
                <Button 
                  onClick={() => handleQuickKey("VIP", 50)}
                  className="h-20 bg-purple-600 hover:bg-purple-500 text-white flex flex-col gap-1"
                >
                  <Crown className="w-6 h-6" />
                  <span className="text-xs">VIP Upgrade</span>
                  <span className="font-bold">$50</span>
                </Button>
                
                <Button 
                  onClick={() => handleQuickKey("SWAG", 25)}
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
                {transactions.map((tx) => (
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
                    <span>
                      {tx.status === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default StaffPOS;
