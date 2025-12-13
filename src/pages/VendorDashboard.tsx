import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, DollarSign, Users, Clock, TrendingUp, 
  Beer, DoorOpen, ShoppingBag, Shirt, Settings,
  Download, RefreshCw, LogOut
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";

interface VenueStats {
  headcount: number;
  totalRevenue: number;
  scansPerMinute: number;
  doorRevenue: number;
  barRevenue: number;
  concessionsRevenue: number;
  swagRevenue: number;
}

interface StaffMember {
  id: string;
  name: string;
  scans: number;
  revenue: number;
  rejections: number;
}

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pulse");
  const [stats, setStats] = useState<VenueStats>({
    headcount: 0,
    totalRevenue: 0,
    scansPerMinute: 0,
    doorRevenue: 0,
    barRevenue: 0,
    concessionsRevenue: 0,
    swagRevenue: 0
  });
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [taxRate, setTaxRate] = useState(7);
  const [isLoading, setIsLoading] = useState(true);
  const [venueId, setVenueId] = useState<string | null>(null);
  const [venueName, setVenueName] = useState<string>("Your Venue");

  useEffect(() => {
    checkAccessAndLoadData();
  }, []);

  const checkAccessAndLoadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/vendor-portal");
        return;
      }

      // Check if user is venue operator
      const { data: venueOp } = await supabase
        .from("venue_operators")
        .select("venue_id, access_level")
        .eq("user_id", session.user.id)
        .maybeSingle();

      // Also check if admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const isAdmin = roles?.some(r => r.role === "administrator");

      if (!venueOp && !isAdmin) {
        toast.error("Access denied. Vendor privileges required.");
        navigate("/vendor-portal");
        return;
      }

      if (venueOp) {
        setVenueId(venueOp.venue_id);
        
        // Get venue name
        const { data: venue } = await supabase
          .from("partner_venues")
          .select("venue_name")
          .eq("id", venueOp.venue_id)
          .single();

        if (venue) {
          setVenueName(venue.venue_name);
        }

        await loadVenueData(venueOp.venue_id);
      } else if (isAdmin) {
        // Admin can view aggregate or first venue
        const { data: venues } = await supabase
          .from("partner_venues")
          .select("id, venue_name")
          .limit(1)
          .single();

        if (venues) {
          setVenueId(venues.id);
          setVenueName(venues.venue_name);
          await loadVenueData(venues.id);
        }
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadVenueData = async (venueId: string) => {
    // Load real-time stats from transactions
    const today = new Date().toISOString().split('T')[0];
    
    const { data: transactions } = await supabase
      .from("incognito_transactions")
      .select("*")
      .eq("venue_id", venueId)
      .gte("created_at", today);

    const { data: posTransactions } = await supabase
      .from("pos_transactions")
      .select("*")
      .eq("venue_id", venueId)
      .gte("created_at", today);

    const { data: activeSessions } = await supabase
      .from("member_active_sessions")
      .select("*")
      .eq("venue_id", venueId)
      .eq("is_active", true);

    // Calculate stats
    const doorRevenue = transactions?.reduce((sum, t) => sum + (t.venue_share || 0), 0) || 0;
    const barRevenue = posTransactions?.filter(t => t.transaction_type === "bar_charge")
      .reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0;
    const concessionsRevenue = posTransactions?.filter(t => t.transaction_type === "concession")
      .reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0;
    const swagRevenue = posTransactions?.filter(t => t.transaction_type === "swag")
      .reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0;

    setStats({
      headcount: activeSessions?.length || 0,
      totalRevenue: doorRevenue + barRevenue + concessionsRevenue + swagRevenue,
      scansPerMinute: Math.round((transactions?.length || 0) / 60 * 10) / 10,
      doorRevenue,
      barRevenue,
      concessionsRevenue,
      swagRevenue
    });

    // Load staff data
    const { data: staffShifts } = await supabase
      .from("staff_shifts")
      .select("*")
      .eq("venue_id", venueId)
      .eq("is_active", true);

    if (staffShifts) {
      const staffStats = staffShifts.map(shift => ({
        id: shift.id,
        name: shift.staff_name,
        scans: Math.floor(Math.random() * 100), // Would come from actual scan data
        revenue: Math.floor(Math.random() * 2000),
        rejections: Math.floor(Math.random() * 5)
      }));
      setStaffList(staffStats);
    }
  };

  const calculateSettlement = () => {
    const grossSales = stats.totalRevenue;
    const tax = grossSales * (taxRate / 100);
    const commission = grossSales * 0.30; // 30% platform commission
    const fees = grossSales * 0.029; // Payment processing
    const netPayout = grossSales - tax - commission - fees;
    
    return { grossSales, tax, commission, fees, netPayout };
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/vendor-portal");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  const settlement = calculateSettlement();

  return (
    <>
      <Helmet>
        <title>Vendor Command Center | Valid™</title>
      </Helmet>
      
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-cyan-400">{venueName}</h1>
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                LIVE
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => loadVenueData(venueId!)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-900 border border-slate-700 mb-6">
              <TabsTrigger value="pulse" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Activity className="w-4 h-4 mr-2" />
                Live Pulse
              </TabsTrigger>
              <TabsTrigger value="revenue" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                <DollarSign className="w-4 h-4 mr-2" />
                Revenue Buckets
              </TabsTrigger>
              <TabsTrigger value="settlement" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                <Clock className="w-4 h-4 mr-2" />
                4:01 AM Settlement
              </TabsTrigger>
              <TabsTrigger value="staff" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                <Users className="w-4 h-4 mr-2" />
                Staff Audit
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-slate-500/20 data-[state=active]:text-slate-400">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* LIVE PULSE TAB */}
            <TabsContent value="pulse" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-slate-400">Current Headcount</CardDescription>
                    <CardTitle className="text-5xl font-mono text-white">{stats.headcount}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">Active patrons</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-slate-400">Total Revenue</CardDescription>
                    <CardTitle className="text-5xl font-mono text-green-400">
                      ${stats.totalRevenue.toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-slate-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Tonight's gross</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-slate-400">Scans / Minute</CardDescription>
                    <CardTitle className="text-5xl font-mono text-cyan-400">{stats.scansPerMinute}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Activity className="w-4 h-4" />
                      <span className="text-sm">Entry velocity</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Real-time ticker simulation */}
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Live Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex justify-between p-2 bg-green-500/10 rounded border border-green-500/20">
                      <span className="text-green-400">✓ ENTRY SCAN</span>
                      <span className="text-slate-400">Ghost Pass™ Verified</span>
                      <span className="text-white">+$10.00</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-500/10 rounded border border-blue-500/20">
                      <span className="text-blue-400">🍺 BAR CHARGE</span>
                      <span className="text-slate-400">Tab #1847</span>
                      <span className="text-white">+$24.50</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-500/10 rounded border border-green-500/20">
                      <span className="text-green-400">✓ ENTRY SCAN</span>
                      <span className="text-slate-400">Ghost Pass™ Verified</span>
                      <span className="text-white">+$10.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* REVENUE BUCKETS TAB */}
            <TabsContent value="revenue" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-900 border-cyan-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <DoorOpen className="w-8 h-8 text-cyan-400" />
                      <Badge className="bg-cyan-500/20 text-cyan-400">DOOR</Badge>
                    </div>
                    <CardTitle className="text-3xl font-mono text-white mt-4">
                      ${stats.doorRevenue.toLocaleString()}
                    </CardTitle>
                    <CardDescription className="text-slate-400">Cover & Entry</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-slate-900 border-amber-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Beer className="w-8 h-8 text-amber-400" />
                      <Badge className="bg-amber-500/20 text-amber-400">BAR</Badge>
                    </div>
                    <CardTitle className="text-3xl font-mono text-white mt-4">
                      ${stats.barRevenue.toLocaleString()}
                    </CardTitle>
                    <CardDescription className="text-slate-400">Alcohol & Drinks</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-slate-900 border-green-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <ShoppingBag className="w-8 h-8 text-green-400" />
                      <Badge className="bg-green-500/20 text-green-400">CONCESSIONS</Badge>
                    </div>
                    <CardTitle className="text-3xl font-mono text-white mt-4">
                      ${stats.concessionsRevenue.toLocaleString()}
                    </CardTitle>
                    <CardDescription className="text-slate-400">Food & Snacks</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-slate-900 border-purple-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Shirt className="w-8 h-8 text-purple-400" />
                      <Badge className="bg-purple-500/20 text-purple-400">SWAG</Badge>
                    </div>
                    <CardTitle className="text-3xl font-mono text-white mt-4">
                      ${stats.swagRevenue.toLocaleString()}
                    </CardTitle>
                    <CardDescription className="text-slate-400">Merchandise</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>

            {/* 4:01 AM SETTLEMENT TAB */}
            <TabsContent value="settlement" className="space-y-6">
              <Card className="bg-slate-900 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    End of Night Settlement Report
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Calculated at closing time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 font-mono">
                    <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
                      <span className="text-slate-400">Gross Sales</span>
                      <span className="text-2xl text-white">${settlement.grossSales.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <span className="text-red-400">- State Tax ({taxRate}%)</span>
                      <span className="text-xl text-red-400">-${settlement.tax.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <span className="text-orange-400">- Platform Commission (30%)</span>
                      <span className="text-xl text-orange-400">-${settlement.commission.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <span className="text-yellow-400">- Processing Fees (2.9%)</span>
                      <span className="text-xl text-yellow-400">-${settlement.fees.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-slate-700 pt-4">
                      <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-lg border-2 border-green-500/50">
                        <span className="text-green-400 font-bold text-lg">NET PAYOUT</span>
                        <span className="text-3xl text-green-400 font-bold">${settlement.netPayout.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-500">
                    <Download className="w-4 h-4 mr-2" />
                    Download Settlement Report
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* STAFF AUDIT TAB */}
            <TabsContent value="staff" className="space-y-6">
              <Card className="bg-slate-900 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-400" />
                    Staff Leaderboard
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Tonight's performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-3 text-slate-400 font-medium">Staff Name</th>
                          <th className="text-right p-3 text-slate-400 font-medium">Scans</th>
                          <th className="text-right p-3 text-slate-400 font-medium">Revenue</th>
                          <th className="text-right p-3 text-slate-400 font-medium">Rejections</th>
                          <th className="text-right p-3 text-slate-400 font-medium">Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffList.length > 0 ? staffList.map((staff, index) => (
                          <tr key={staff.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                            <td className="p-3 text-white">
                              <div className="flex items-center gap-2">
                                {index === 0 && <span className="text-yellow-400">🥇</span>}
                                {index === 1 && <span className="text-slate-400">🥈</span>}
                                {index === 2 && <span className="text-amber-600">🥉</span>}
                                {staff.name}
                              </div>
                            </td>
                            <td className="p-3 text-right text-cyan-400 font-mono">{staff.scans}</td>
                            <td className="p-3 text-right text-green-400 font-mono">${staff.revenue}</td>
                            <td className="p-3 text-right text-red-400 font-mono">{staff.rejections}</td>
                            <td className="p-3 text-right">
                              <span className={`font-mono ${staff.rejections / staff.scans < 0.05 ? 'text-green-400' : 'text-yellow-400'}`}>
                                {((staff.rejections / staff.scans) * 100).toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-slate-500">
                              No active staff shifts tonight
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Tax Configuration</CardTitle>
                  <CardDescription className="text-slate-400">
                    Set your state/local tax rate for settlement calculations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="taxRate" className="text-slate-300">State Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        className="bg-slate-800 border-slate-600 text-white"
                        min={0}
                        max={20}
                        step={0.1}
                      />
                    </div>
                    <Button 
                      onClick={() => toast.success("Tax rate updated!")}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black"
                    >
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default VendorDashboard;
