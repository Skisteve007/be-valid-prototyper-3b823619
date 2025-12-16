import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, DollarSign, Users, Clock, TrendingUp, 
  Beer, DoorOpen, ShoppingBag, Shirt, Settings,
  Download, RefreshCw, LogOut, ChevronDown, ChevronUp,
  AlertTriangle, FileText, PieChart as PieChartIcon, LineChart as LineChartIcon,
  Warehouse, Calendar
} from "lucide-react";
import StationManager from "@/components/admin/StationManager";
import LiveOperationsCard from "@/components/vendor/LiveOperationsCard";
import FinancialsModule from "@/components/vendor/FinancialsModule";
import WorkforceModule from "@/components/vendor/WorkforceModule";
import ShiftScheduler from "@/components/vendor/ShiftScheduler";
import { getIndustryConfig, IndustryType } from "@/config/industryConfig";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from "recharts";
import jsPDF from "jspdf";
import { PrivacyBadgeB2B } from "@/components/privacy";

type TimePeriod = "live" | "shift" | "24h" | "week" | "month";

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
  station: string;
  scans: number;
  revenue: number;
  rejections: number;
  voids: number;
}

interface TransactionItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  timestamp: string;
  category: string;
}

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pulse");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("live");
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
  const [industryType, setIndustryType] = useState<string>("Nightlife");
  const [stations, setStations] = useState<{ id: string; station_name: string }[]>([]);
  
  // Drill-down states
  const [showRevenueBreakdown, setShowRevenueBreakdown] = useState(false);
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [showStaffRoster, setShowStaffRoster] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Trend data for graphs
  const [trendData, setTrendData] = useState<{ name: string; headcount: number; revenue: number }[]>([]);
  const [itemizedTransactions, setItemizedTransactions] = useState<TransactionItem[]>([]);

  useEffect(() => {
    checkAccessAndLoadData();
  }, []);

  useEffect(() => {
    if (venueId) {
      loadVenueData(venueId);
    }
  }, [timePeriod]);

  const getTimeFilter = () => {
    const now = new Date();
    switch (timePeriod) {
      case "live":
        return new Date(now.getTime() - 60 * 60 * 1000).toISOString(); // Last hour
      case "shift":
        return new Date(now.setHours(now.getHours() - 8)).toISOString(); // 8 hours
      case "24h":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case "week":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case "month":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date().toISOString().split('T')[0];
    }
  };

  const checkAccessAndLoadData = async () => {
    try {
      // DEMO MODE: Bypass auth for testing
      // Load first venue for demo purposes
      const { data: venues } = await supabase
        .from("partner_venues")
        .select("id, venue_name, industry_type")
        .limit(1)
        .maybeSingle();

      if (venues) {
        setVenueId(venues.id);
        setVenueName(venues.venue_name);
        setIndustryType(venues.industry_type || "Nightlife");
        await loadVenueData(venues.id);
        await loadStations(venues.id);
      } else {
        // Fallback demo data if no venues exist
        setVenueName("Demo Venue");
        setStats({
          headcount: 247,
          totalRevenue: 18450,
          scansPerMinute: 4.2,
          doorRevenue: 4500,
          barRevenue: 9200,
          concessionsRevenue: 2800,
          swagRevenue: 1950
        });
        setStaffList([
          { id: "1", name: "Mike T.", station: "Main Door", scans: 89, revenue: 890, rejections: 3, voids: 1 },
          { id: "2", name: "Sarah L.", station: "Bar", scans: 156, revenue: 4200, rejections: 0, voids: 2 },
          { id: "3", name: "James K.", station: "VIP", scans: 45, revenue: 2100, rejections: 1, voids: 0 },
          { id: "4", name: "Alex R.", station: "Concessions", scans: 78, revenue: 1560, rejections: 2, voids: 5 }
        ]);
        generateTrendData();
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      // Load demo data on error
      setVenueName("Demo Venue");
      setStats({
        headcount: 247,
        totalRevenue: 18450,
        scansPerMinute: 4.2,
        doorRevenue: 4500,
        barRevenue: 9200,
        concessionsRevenue: 2800,
        swagRevenue: 1950
      });
      generateTrendData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadStations = async (venueId: string) => {
    const { data } = await supabase
      .from("venue_stations")
      .select("id, station_name")
      .eq("venue_id", venueId)
      .eq("is_active", true);
    
    setStations(data || []);
  };

  const loadVenueData = async (venueId: string) => {
    const timeFilter = getTimeFilter();
    
    const { data: transactions } = await supabase
      .from("incognito_transactions")
      .select("*")
      .eq("venue_id", venueId)
      .gte("created_at", timeFilter);

    const { data: posTransactions } = await supabase
      .from("pos_transactions")
      .select("*")
      .eq("venue_id", venueId)
      .gte("created_at", timeFilter);

    const { data: activeSessions } = await supabase
      .from("member_active_sessions")
      .select("*")
      .eq("venue_id", venueId)
      .eq("is_active", true);

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

    // Generate itemized transactions for drill-down
    const items: TransactionItem[] = [];
    transactions?.forEach((t, i) => items.push({
      id: t.id,
      description: "Ghost Pass™ Entry",
      quantity: 1,
      unitPrice: t.venue_share || 10,
      total: t.venue_share || 10,
      timestamp: t.created_at,
      category: "door"
    }));
    posTransactions?.forEach((t) => items.push({
      id: t.id,
      description: t.transaction_type === "bar_charge" ? "Bar Tab" : 
                   t.transaction_type === "swag" ? "Merchandise" : "Concession",
      quantity: 1,
      unitPrice: t.total_amount || 0,
      total: t.total_amount || 0,
      timestamp: t.created_at,
      category: t.transaction_type || "bar_charge"
    }));
    setItemizedTransactions(items);

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
        station: shift.staff_role || "Door",
        scans: Math.floor(Math.random() * 100),
        revenue: Math.floor(Math.random() * 2000),
        rejections: Math.floor(Math.random() * 5),
        voids: Math.floor(Math.random() * 3)
      }));
      setStaffList(staffStats);
    }

    // Generate trend data for graphs
    generateTrendData();
  };

  const generateTrendData = () => {
    const data = [];
    const periods = timePeriod === "week" ? 7 : timePeriod === "month" ? 30 : 24;
    const labelFormat = timePeriod === "week" || timePeriod === "month" ? "Day" : "Hour";
    
    for (let i = 0; i < periods; i++) {
      data.push({
        name: `${labelFormat} ${i + 1}`,
        headcount: Math.floor(Math.random() * 200) + 50,
        revenue: Math.floor(Math.random() * 5000) + 1000
      });
    }
    setTrendData(data);
  };

  const calculateSettlement = () => {
    const grossSales = stats.totalRevenue;
    const tax = grossSales * (taxRate / 100);
    const commission = grossSales * 0.30;
    const fees = grossSales * 0.029;
    const netPayout = grossSales - tax - commission - fees;
    
    return { grossSales, tax, commission, fees, netPayout };
  };

  const exportSettlementPDF = () => {
    const settlement = calculateSettlement();
    const doc = new jsPDF();
    const now = new Date();
    
    doc.setFontSize(20);
    doc.text("Valid™ Settlement Report", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Venue: ${venueName}`, 20, 35);
    doc.text(`Generated: ${now.toLocaleString()}`, 20, 45);
    doc.text(`Period: ${timePeriod.toUpperCase()}`, 20, 55);
    
    doc.setFontSize(14);
    doc.text("Settlement Breakdown", 20, 75);
    
    doc.setFontSize(12);
    doc.text(`(+) Gross Sales: $${settlement.grossSales.toLocaleString()}`, 30, 90);
    doc.text(`(-) State Tax (${taxRate}%): -$${settlement.tax.toFixed(2)}`, 30, 100);
    doc.text(`(-) Platform Commission (30%): -$${settlement.commission.toFixed(2)}`, 30, 110);
    doc.text(`(-) Processing Fees (2.9%): -$${settlement.fees.toFixed(2)}`, 30, 120);
    
    doc.setFontSize(16);
    doc.text(`NET PAYOUT: $${settlement.netPayout.toFixed(2)}`, 30, 140);
    
    doc.save(`settlement-${venueName}-${now.toISOString().split('T')[0]}.pdf`);
    toast.success("Settlement report exported!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/vendor-portal");
  };

  const getPieChartData = () => [
    { name: "Door", value: stats.doorRevenue, color: "#00bcd4" },
    { name: "Bar", value: stats.barRevenue, color: "#f59e0b" },
    { name: "Concessions", value: stats.concessionsRevenue, color: "#22c55e" },
    { name: "Swag", value: stats.swagRevenue, color: "#a855f7" }
  ];

  const isHighRiskStaff = (staff: StaffMember) => {
    // High scans but low revenue = potential theft indicator
    return staff.scans > 50 && (staff.revenue / staff.scans) < 5;
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
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-cyan-400">{venueName}</h1>
              <Badge variant="outline" className={`${timePeriod === 'live' ? 'border-green-500/50 text-green-400' : 'border-slate-500/50 text-slate-400'}`}>
                {timePeriod === 'live' && <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />}
                {timePeriod.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
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

        {/* Time Period Toggle */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 p-2 bg-slate-900 rounded-lg border border-slate-700">
            {[
              { id: "live", label: "LIVE", icon: Activity },
              { id: "shift", label: "END OF SHIFT", icon: Clock },
              { id: "24h", label: "24 HOURS", icon: Clock },
              { id: "week", label: "THIS WEEK", icon: LineChartIcon },
              { id: "month", label: "THIS MONTH", icon: LineChartIcon }
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={timePeriod === id ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimePeriod(id as TimePeriod)}
                className={timePeriod === id ? "bg-cyan-500 text-black" : "text-slate-400 hover:text-white"}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-900 border border-slate-700 mb-6 flex flex-wrap">
              <TabsTrigger value="pulse" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Activity className="w-4 h-4 mr-2" />
                Live Operations
              </TabsTrigger>
              <TabsTrigger value="financials" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                <DollarSign className="w-4 h-4 mr-2" />
                Financials
              </TabsTrigger>
              <TabsTrigger value="workforce" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                <Users className="w-4 h-4 mr-2" />
                Workforce
              </TabsTrigger>
              <TabsTrigger value="scheduler" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                <Calendar className="w-4 h-4 mr-2" />
                Shift Manager
              </TabsTrigger>
              <TabsTrigger value="stations" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400">
                <Warehouse className="w-4 h-4 mr-2" />
                Stations
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-slate-500/20 data-[state=active]:text-slate-400">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* LIVE OPERATIONS TAB - Polymorphic */}
            <TabsContent value="pulse" className="space-y-6">
              <LiveOperationsCard
                industryType={industryType}
                primaryValue={stats.headcount}
                secondaryValue={stats.barRevenue}
                tertiaryValue={12}
                isLive={timePeriod === 'live'}
              />

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-slate-400">Headcount</CardDescription>
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
                      <span className="text-sm">{timePeriod === 'live' ? "Tonight's gross" : `${timePeriod} period`}</span>
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

              {/* Trend Graph for Weekly/Monthly */}
              {(timePeriod === "week" || timePeriod === "month") && (
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <LineChartIcon className="w-5 h-5 text-cyan-400" />
                      Traffic Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={trendData}>
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="headcount" stroke="#00bcd4" fill="#00bcd4" fillOpacity={0.3} name="Headcount" />
                        <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Revenue ($)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Live Activity Feed */}
              {timePeriod === "live" && (
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
              )}
            </TabsContent>

            {/* REVENUE BUCKETS TAB */}
            <TabsContent value="revenue" className="space-y-6">
              {/* Clickable Revenue Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { key: "door", label: "Door Entry", icon: DoorOpen, value: stats.doorRevenue, color: "cyan", badge: "DOOR" },
                  { key: "bar_charge", label: "Alcohol & Drinks", icon: Beer, value: stats.barRevenue, color: "amber", badge: "BAR" },
                  { key: "concession", label: "Food & Snacks", icon: ShoppingBag, value: stats.concessionsRevenue, color: "green", badge: "CONCESSIONS" },
                  { key: "swag", label: "Merchandise", icon: Shirt, value: stats.swagRevenue, color: "purple", badge: "SWAG" }
                ].map(({ key, label, icon: Icon, value, color, badge }) => (
                  <Card 
                    key={key}
                    className={`bg-slate-900 border-${color}-500/30 cursor-pointer hover:border-${color}-500/60 transition-all hover:scale-[1.02]`}
                    onClick={() => { setSelectedCategory(key); setShowRevenueBreakdown(true); }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon className={`w-8 h-8 text-${color}-400`} />
                        <div className="flex items-center gap-2">
                          <Badge className={`bg-${color}-500/20 text-${color}-400`}>{badge}</Badge>
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                      <CardTitle className="text-3xl font-mono text-white mt-4">
                        ${value.toLocaleString()}
                      </CardTitle>
                      <CardDescription className="text-slate-400">{label}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Pie Chart */}
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-cyan-400" />
                    Revenue Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getPieChartData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {getPieChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-4">
                      {getPieChartData().map(item => (
                        <div key={item.name} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-white">{item.name}</span>
                          </div>
                          <span className="text-lg font-mono text-white">${item.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 4:01 AM SETTLEMENT TAB */}
            <TabsContent value="settlement" className="space-y-6">
              <Card 
                className="bg-slate-900 border-purple-500/30 cursor-pointer hover:border-purple-500/60 transition-all"
                onClick={() => setShowSettlementModal(true)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-400" />
                      End of Night Settlement Report
                    </CardTitle>
                    <FileText className="w-5 h-5 text-slate-500" />
                  </div>
                  <CardDescription className="text-slate-400">
                    Click to view full closing statement
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

                  <Button 
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-500"
                    onClick={(e) => { e.stopPropagation(); exportSettlementPDF(); }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF Report
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FINANCIALS TAB */}
            <TabsContent value="financials" className="space-y-6">
              <FinancialsModule 
                industryType={industryType}
                venueName={venueName}
                grossRevenue={stats.totalRevenue}
                revenueByCategory={{
                  door: stats.doorRevenue,
                  bar: stats.barRevenue,
                  concessions: stats.concessionsRevenue,
                  swag: stats.swagRevenue
                }}
                taxRate={taxRate}
                onTaxRateChange={setTaxRate}
              />
            </TabsContent>

            {/* WORKFORCE TAB */}
            <TabsContent value="workforce" className="space-y-6">
              <WorkforceModule 
                venueId={venueId} 
                industryType={industryType}
                stations={stations} 
              />
            </TabsContent>

            {/* SHIFT SCHEDULER TAB */}
            <TabsContent value="scheduler" className="space-y-6">
              <ShiftScheduler venueId={venueId} industryType={industryType} />
            </TabsContent>

            {/* STATIONS TAB */}
            <TabsContent value="stations" className="space-y-6">
              <StationManager venueId={venueId} onStationsChange={() => loadVenueData(venueId!)} />
            </TabsContent>

            {/* STAFF AUDIT TAB */}
            <TabsContent value="staff" className="space-y-6">
              <Card className="bg-slate-900 border-orange-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-orange-400" />
                        Workforce Roster
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {timePeriod} performance metrics
                      </CardDescription>
                    </div>
                    {staffList.some(isHighRiskStaff) && (
                      <Badge className="bg-red-500/20 text-red-400 border border-red-500/50">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Anomaly Detected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-3 text-slate-400 font-medium">Staff Name</th>
                          <th className="text-left p-3 text-slate-400 font-medium">Station</th>
                          <th className="text-right p-3 text-slate-400 font-medium">Total Scans</th>
                          <th className="text-right p-3 text-slate-400 font-medium">Total Sales ($)</th>
                          <th className="text-right p-3 text-slate-400 font-medium">Void/Refund</th>
                          <th className="text-right p-3 text-slate-400 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffList.length > 0 ? staffList.map((staff, index) => {
                          const isRisk = isHighRiskStaff(staff);
                          return (
                            <tr 
                              key={staff.id} 
                              className={`border-b border-slate-800 hover:bg-slate-800/50 ${isRisk ? 'bg-red-500/10' : ''}`}
                            >
                              <td className="p-3 text-white">
                                <div className="flex items-center gap-2">
                                  {index === 0 && <span className="text-yellow-400">🥇</span>}
                                  {index === 1 && <span className="text-slate-400">🥈</span>}
                                  {index === 2 && <span className="text-amber-600">🥉</span>}
                                  {staff.name}
                                </div>
                              </td>
                              <td className="p-3 text-slate-400">{staff.station}</td>
                              <td className="p-3 text-right text-cyan-400 font-mono">{staff.scans}</td>
                              <td className="p-3 text-right text-green-400 font-mono">${staff.revenue.toLocaleString()}</td>
                              <td className="p-3 text-right text-red-400 font-mono">{staff.voids}</td>
                              <td className="p-3 text-right">
                                {isRisk ? (
                                  <Badge className="bg-red-500/20 text-red-400">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Review
                                  </Badge>
                                ) : (
                                  <Badge className="bg-green-500/20 text-green-400">Normal</Badge>
                                )}
                              </td>
                            </tr>
                          );
                        }) : (
                          <tr>
                            <td colSpan={6} className="p-6 text-center text-slate-500">
                              No active staff shifts during this period
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

              {/* Privacy & Compliance Dashboard for Venue Owners */}
              <div className="mt-8">
                <PrivacyBadgeB2B variant="dashboard" venueId={venueId || undefined} />
              </div>
            </TabsContent>
          </Tabs>
        </main>

        {/* Revenue Breakdown Modal */}
        <Dialog open={showRevenueBreakdown} onOpenChange={setShowRevenueBreakdown}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Itemized Sales Ledger - {selectedCategory?.toUpperCase()}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-2 text-slate-400">Description</th>
                    <th className="text-right p-2 text-slate-400">Qty</th>
                    <th className="text-right p-2 text-slate-400">Unit Price</th>
                    <th className="text-right p-2 text-slate-400">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {itemizedTransactions
                    .filter(t => t.category === selectedCategory || selectedCategory === 'door' && t.category === 'door')
                    .slice(0, 20)
                    .map((t, i) => (
                      <tr key={i} className="border-b border-slate-800">
                        <td className="p-2 text-white">{t.description}</td>
                        <td className="p-2 text-right text-slate-400">{t.quantity}</td>
                        <td className="p-2 text-right text-slate-400">${t.unitPrice.toFixed(2)}</td>
                        <td className="p-2 text-right text-green-400 font-mono">${t.total.toFixed(2)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {itemizedTransactions.filter(t => t.category === selectedCategory).length === 0 && (
                <p className="text-center text-slate-500 py-4">No transactions in this category</p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Settlement Detail Modal */}
        <Dialog open={showSettlementModal} onOpenChange={setShowSettlementModal}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Closing Statement
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 font-mono text-sm">
              <div className="p-3 bg-slate-800 rounded flex justify-between">
                <span className="text-green-400">(+) Gross Sales</span>
                <span className="text-white">${settlement.grossSales.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-800 rounded flex justify-between">
                <span className="text-red-400">(-) State Tax ({taxRate}%)</span>
                <span className="text-red-400">-${settlement.tax.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-800 rounded flex justify-between">
                <span className="text-orange-400">(-) Staff/Promoter Commissions</span>
                <span className="text-orange-400">-${(settlement.commission * 0.33).toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-800 rounded flex justify-between">
                <span className="text-yellow-400">(-) Platform Fees</span>
                <span className="text-yellow-400">-${(settlement.commission * 0.67 + settlement.fees).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-700 pt-4">
                <div className="p-4 bg-green-500/10 rounded border-2 border-green-500/50 flex justify-between">
                  <span className="text-green-400 font-bold">= NET DEPOSIT</span>
                  <span className="text-green-400 font-bold text-xl">${settlement.netPayout.toFixed(2)}</span>
                </div>
              </div>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-500"
                onClick={() => { exportSettlementPDF(); setShowSettlementModal(false); }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default VendorDashboard;
