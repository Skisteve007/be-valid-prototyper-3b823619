import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, Trash2, Edit, Beer, DoorOpen, ShoppingBag, 
  Shirt, UtensilsCrossed, Warehouse, Activity, ChevronDown, ChevronUp
} from "lucide-react";
import { toast } from "sonner";

interface Station {
  id: string;
  venue_id: string;
  station_name: string;
  station_category: string;
  is_active: boolean;
  created_at: string;
  assigned_staff_name?: string | null;
  shift_assignment?: string | null;
  assignment_number?: number;
}

interface StationLiveFeed {
  stationId: string;
  transactions: {
    id: string;
    amount: number;
    timestamp: string;
    description: string;
  }[];
  totalRevenue: number;
  transactionCount: number;
}

interface StationManagerProps {
  venueId: string | null;
  onStationsChange?: () => void;
}

const CATEGORY_OPTIONS = [
  { value: "bar", label: "Bar", icon: Beer, color: "text-amber-400" },
  { value: "alcohol", label: "Alcohol", icon: Beer, color: "text-orange-400" },
  { value: "concessions", label: "Concessions", icon: ShoppingBag, color: "text-green-400" },
  { value: "food", label: "Food", icon: UtensilsCrossed, color: "text-red-400" },
  { value: "swag", label: "Swag/Merchandise", icon: Shirt, color: "text-purple-400" },
  { value: "door", label: "Door/Entry", icon: DoorOpen, color: "text-cyan-400" },
  { value: "other", label: "Other", icon: Warehouse, color: "text-slate-400" }
];

const SHIFT_OPTIONS = [
  { value: "morning", label: "Morning (6AM-2PM)" },
  { value: "afternoon", label: "Afternoon (2PM-10PM)" },
  { value: "night", label: "Night (10PM-6AM)" },
  { value: "swing", label: "Swing Shift" },
  { value: "double", label: "Double Shift" },
  { value: "on_call", label: "On Call" }
];

const StationManager = ({ venueId, onStationsChange }: StationManagerProps) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [liveFeeds, setLiveFeeds] = useState<Record<string, StationLiveFeed>>({});
  const [expandedStations, setExpandedStations] = useState<Set<string>>(new Set());
  const [isAddingStation, setIsAddingStation] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [newStationName, setNewStationName] = useState("");
  const [newStationCategory, setNewStationCategory] = useState("bar");
  const [newStaffName, setNewStaffName] = useState("");
  const [newShiftAssignment, setNewShiftAssignment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (venueId) {
      loadStations();
      setupRealtimeSubscription();
    }
  }, [venueId]);

  const loadStations = async () => {
    if (!venueId) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from("venue_stations")
      .select("*")
      .eq("venue_id", venueId)
      .order("station_category", { ascending: true });

    if (error) {
      console.error("Error loading stations:", error);
      // Demo fallback data
      setStations([
        { id: "demo-1", venue_id: venueId, station_name: "Main Bar", station_category: "bar", is_active: true, created_at: new Date().toISOString() },
        { id: "demo-2", venue_id: venueId, station_name: "VIP Bar", station_category: "bar", is_active: true, created_at: new Date().toISOString() },
        { id: "demo-3", venue_id: venueId, station_name: "Front Door", station_category: "door", is_active: true, created_at: new Date().toISOString() },
        { id: "demo-4", venue_id: venueId, station_name: "Concession Stand A", station_category: "concessions", is_active: true, created_at: new Date().toISOString() },
        { id: "demo-5", venue_id: venueId, station_name: "Merch Booth", station_category: "swag", is_active: true, created_at: new Date().toISOString() }
      ]);
      generateDemoLiveFeeds();
    } else {
      setStations(data || []);
      if (data && data.length > 0) {
        await loadLiveFeeds(data);
      } else {
        generateDemoLiveFeeds();
      }
    }
    setIsLoading(false);
  };

  const generateDemoLiveFeeds = () => {
    const demoFeeds: Record<string, StationLiveFeed> = {};
    const demoStations = ["demo-1", "demo-2", "demo-3", "demo-4", "demo-5"];
    
    demoStations.forEach(stationId => {
      const transactionCount = Math.floor(Math.random() * 50) + 10;
      const transactions = Array.from({ length: transactionCount }, (_, i) => ({
        id: `tx-${stationId}-${i}`,
        amount: Math.floor(Math.random() * 100) + 5,
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        description: ["Drink", "Entry", "Snack", "T-Shirt", "Combo"][Math.floor(Math.random() * 5)]
      }));
      
      demoFeeds[stationId] = {
        stationId,
        transactions: transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        totalRevenue: transactions.reduce((sum, t) => sum + t.amount, 0),
        transactionCount
      };
    });
    
    setLiveFeeds(demoFeeds);
  };

  const loadLiveFeeds = async (stationList: Station[]) => {
    const feeds: Record<string, StationLiveFeed> = {};
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();

    for (const station of stationList) {
      const { data: transactions } = await supabase
        .from("pos_transactions")
        .select("id, total_amount, created_at, transaction_type")
        .eq("station_id", station.id)
        .gte("created_at", oneHourAgo)
        .order("created_at", { ascending: false });

      feeds[station.id] = {
        stationId: station.id,
        transactions: (transactions || []).map(t => ({
          id: t.id,
          amount: t.total_amount || 0,
          timestamp: t.created_at,
          description: t.transaction_type || "Transaction"
        })),
        totalRevenue: (transactions || []).reduce((sum, t) => sum + (t.total_amount || 0), 0),
        transactionCount: transactions?.length || 0
      };
    }

    setLiveFeeds(feeds);
  };

  const setupRealtimeSubscription = () => {
    if (!venueId) return;

    const channel = supabase
      .channel(`stations-${venueId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pos_transactions',
          filter: `venue_id=eq.${venueId}`
        },
        (payload) => {
          // Update live feed when new transaction comes in
          if (payload.new && typeof payload.new === 'object' && 'station_id' in payload.new) {
            const newTx = payload.new as { station_id: string; id: string; total_amount: number; created_at: string; transaction_type: string };
            if (newTx.station_id) {
              setLiveFeeds(prev => {
                const stationFeed = prev[newTx.station_id] || { stationId: newTx.station_id, transactions: [], totalRevenue: 0, transactionCount: 0 };
                return {
                  ...prev,
                  [newTx.station_id]: {
                    ...stationFeed,
                    transactions: [
                      { id: newTx.id, amount: newTx.total_amount, timestamp: newTx.created_at, description: newTx.transaction_type },
                      ...stationFeed.transactions.slice(0, 49)
                    ],
                    totalRevenue: stationFeed.totalRevenue + (newTx.total_amount || 0),
                    transactionCount: stationFeed.transactionCount + 1
                  }
                };
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleAddStation = async () => {
    if (!venueId || !newStationName.trim()) {
      toast.error("Please enter a station name");
      return;
    }

    const { data, error } = await supabase
      .from("venue_stations")
      .insert({
        venue_id: venueId,
        station_name: newStationName.trim(),
        station_category: newStationCategory,
        assigned_staff_name: newStaffName.trim() || null,
        shift_assignment: newShiftAssignment || null,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create station");
      console.error(error);
    } else {
      toast.success(`Station #${data.assignment_number} "${newStationName}" created!`);
      setStations(prev => [...prev, data]);
      setNewStationName("");
      setNewStationCategory("bar");
      setNewStaffName("");
      setNewShiftAssignment("");
      setIsAddingStation(false);
      onStationsChange?.();
    }
  };

  const handleUpdateStation = async () => {
    if (!editingStation) return;

    const { error } = await supabase
      .from("venue_stations")
      .update({
        station_name: newStationName,
        station_category: newStationCategory,
        assigned_staff_name: newStaffName.trim() || null,
        shift_assignment: newShiftAssignment || null
      })
      .eq("id", editingStation.id);

    if (error) {
      toast.error("Failed to update station");
    } else {
      toast.success("Station updated!");
      setStations(prev => prev.map(s => 
        s.id === editingStation.id 
          ? { ...s, station_name: newStationName, station_category: newStationCategory, assigned_staff_name: newStaffName.trim() || null, shift_assignment: newShiftAssignment || null }
          : s
      ));
      setEditingStation(null);
      setNewStationName("");
      setNewStationCategory("bar");
      setNewStaffName("");
      setNewShiftAssignment("");
      onStationsChange?.();
    }
  };

  const handleToggleStation = async (station: Station) => {
    const { error } = await supabase
      .from("venue_stations")
      .update({ is_active: !station.is_active })
      .eq("id", station.id);

    if (error) {
      toast.error("Failed to toggle station");
    } else {
      setStations(prev => prev.map(s => 
        s.id === station.id ? { ...s, is_active: !s.is_active } : s
      ));
    }
  };

  const handleDeleteStation = async (stationId: string) => {
    const { error } = await supabase
      .from("venue_stations")
      .delete()
      .eq("id", stationId);

    if (error) {
      toast.error("Failed to delete station");
    } else {
      toast.success("Station deleted");
      setStations(prev => prev.filter(s => s.id !== stationId));
      onStationsChange?.();
    }
  };

  const toggleExpand = (stationId: string) => {
    setExpandedStations(prev => {
      const next = new Set(prev);
      if (next.has(stationId)) {
        next.delete(stationId);
      } else {
        next.add(stationId);
      }
      return next;
    });
  };

  const getCategoryInfo = (category: string) => {
    return CATEGORY_OPTIONS.find(c => c.value === category) || CATEGORY_OPTIONS[CATEGORY_OPTIONS.length - 1];
  };

  const groupedStations = stations.reduce((acc, station) => {
    const cat = station.station_category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(station);
    return acc;
  }, {} as Record<string, Station[]>);

  // Calculate totals
  const totalRevenue = Object.values(liveFeeds).reduce((sum, feed) => sum + feed.totalRevenue, 0);
  const totalTransactions = Object.values(liveFeeds).reduce((sum, feed) => sum + feed.transactionCount, 0);

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Station Management</h2>
          <p className="text-slate-400 text-sm">
            {stations.length} stations • ${totalRevenue.toLocaleString()} revenue • {totalTransactions} transactions
          </p>
        </div>
        <Dialog open={isAddingStation} onOpenChange={setIsAddingStation}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Add Station
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Station</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Station Name</Label>
                <Input
                  placeholder="e.g., Main Bar, VIP Entrance, Concession A"
                  value={newStationName}
                  onChange={(e) => setNewStationName(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Category</Label>
                <Select value={newStationCategory} onValueChange={setNewStationCategory}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {CATEGORY_OPTIONS.map(cat => (
                      <SelectItem key={cat.value} value={cat.value} className="text-white">
                        <div className="flex items-center gap-2">
                          <cat.icon className={`w-4 h-4 ${cat.color}`} />
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Assigned Staff Name</Label>
                <Input
                  placeholder="e.g., John Smith"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Shift Assignment</Label>
                <Select value={newShiftAssignment} onValueChange={setNewShiftAssignment}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select shift..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {SHIFT_OPTIONS.map(shift => (
                      <SelectItem key={shift.value} value={shift.value} className="text-white">
                        {shift.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddStation} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black">
                Create Station
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingStation} onOpenChange={(open) => !open && setEditingStation(null)}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              Edit Station {editingStation?.assignment_number && `#${editingStation.assignment_number}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Station Name</Label>
              <Input
                value={newStationName}
                onChange={(e) => setNewStationName(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Category</Label>
              <Select value={newStationCategory} onValueChange={setNewStationCategory}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {CATEGORY_OPTIONS.map(cat => (
                    <SelectItem key={cat.value} value={cat.value} className="text-white">
                      <div className="flex items-center gap-2">
                        <cat.icon className={`w-4 h-4 ${cat.color}`} />
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Assigned Staff Name</Label>
              <Input
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Shift Assignment</Label>
              <Select value={newShiftAssignment} onValueChange={setNewShiftAssignment}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Select shift..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {SHIFT_OPTIONS.map(shift => (
                    <SelectItem key={shift.value} value={shift.value} className="text-white">
                      {shift.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdateStation} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stations Grid by Category */}
      {Object.entries(groupedStations).map(([category, categoryStations]) => {
        const catInfo = getCategoryInfo(category);
        const categoryRevenue = categoryStations.reduce((sum, s) => sum + (liveFeeds[s.id]?.totalRevenue || 0), 0);
        
        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-3">
              <catInfo.icon className={`w-5 h-5 ${catInfo.color}`} />
              <h3 className={`font-semibold ${catInfo.color}`}>{catInfo.label}</h3>
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {categoryStations.length} stations • ${categoryRevenue.toLocaleString()}
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryStations.map(station => {
                const feed = liveFeeds[station.id];
                const isExpanded = expandedStations.has(station.id);
                
                return (
                  <Card key={station.id} className={`bg-slate-900 border-slate-700 ${!station.is_active ? 'opacity-50' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-xs px-1.5 py-0.5">
                            #{station.assignment_number || '—'}
                          </Badge>
                          <catInfo.icon className={`w-4 h-4 ${catInfo.color}`} />
                          <CardTitle className="text-white text-base">{station.station_name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                          <Switch
                            checked={station.is_active}
                            onCheckedChange={() => handleToggleStation(station)}
                            className="data-[state=checked]:bg-green-500"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-white"
                            onClick={() => {
                              setEditingStation(station);
                              setNewStationName(station.station_name);
                              setNewStationCategory(station.station_category);
                              setNewStaffName(station.assigned_staff_name || "");
                              setNewShiftAssignment(station.shift_assignment || "");
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300"
                            onClick={() => handleDeleteStation(station.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Staff & Shift Info */}
                      {(station.assigned_staff_name || station.shift_assignment) && (
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          {station.assigned_staff_name && (
                            <span className="text-slate-300">
                              <span className="text-slate-500">Staff:</span> {station.assigned_staff_name}
                            </span>
                          )}
                          {station.shift_assignment && (
                            <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-xs">
                              {SHIFT_OPTIONS.find(s => s.value === station.shift_assignment)?.label || station.shift_assignment}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {/* Summary Stats */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-800 rounded-lg p-3 text-center">
                          <p className="text-2xl font-mono text-green-400">${feed?.totalRevenue?.toLocaleString() || 0}</p>
                          <p className="text-xs text-slate-400">Revenue</p>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-3 text-center">
                          <p className="text-2xl font-mono text-cyan-400">{feed?.transactionCount || 0}</p>
                          <p className="text-xs text-slate-400">Transactions</p>
                        </div>
                      </div>
                      
                      {/* Expand/Collapse Transaction Log */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(station.id)}
                        className="w-full text-slate-400 hover:text-white"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-2" />
                            Hide Transactions
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-2" />
                            View Transactions
                          </>
                        )}
                      </Button>
                      
                      {/* Transaction Log (Expanded) */}
                      {isExpanded && (
                        <div className="bg-slate-800 rounded-lg p-2 max-h-48 overflow-y-auto space-y-1">
                          {feed?.transactions?.length ? (
                            feed.transactions.slice(0, 20).map(tx => (
                              <div key={tx.id} className="flex items-center justify-between text-sm py-1 border-b border-slate-700 last:border-0">
                                <div className="flex items-center gap-2">
                                  <Activity className="w-3 h-3 text-cyan-400" />
                                  <span className="text-slate-300">{tx.description}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-green-400 font-mono">${tx.amount}</span>
                                  <span className="text-slate-500 text-xs">
                                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-500 text-center py-2">No transactions yet</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {stations.length === 0 && !isLoading && (
        <Card className="bg-slate-900 border-slate-700 border-dashed">
          <CardContent className="py-12 text-center">
            <Warehouse className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No stations configured yet</p>
            <Button onClick={() => setIsAddingStation(true)} className="bg-cyan-500 hover:bg-cyan-600 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Station
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StationManager;
