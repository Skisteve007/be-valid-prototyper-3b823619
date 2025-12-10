import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IDVStatusBadge } from "@/components/dashboard/IDVStatusBadge";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  RefreshCw,
  ShieldCheck,
  Globe,
  AlertCircle,
  Clock,
  User,
  Hash,
  Calendar
} from "lucide-react";

interface IDVRecord {
  id: string;
  user_id: string;
  tier: "standard" | "vip";
  status: "pending" | "processing" | "verified" | "failed" | "expired";
  payment_status: "unpaid" | "paid" | "refunded";
  verified_hash: string | null;
  verification_provider: string | null;
  verification_reference: string | null;
  verified_at: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
    member_id: string | null;
  };
}

export const IDVManagementTab = () => {
  const [records, setRecords] = useState<IDVRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    standard: 0,
    vip: 0
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      // Fetch IDV records
      const { data: idvData, error: idvError } = await supabase
        .from("idv_verifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (idvError) throw idvError;

      // Fetch profiles for the user IDs
      const userIds = [...new Set((idvData || []).map(r => r.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, member_id")
        .in("user_id", userIds);

      // Create a map for quick lookup
      const profilesMap = new Map(
        (profilesData || []).map(p => [p.user_id, p])
      );

      // Combine the data
      const combinedData = (idvData || []).map(record => ({
        ...record,
        tier: record.tier as "standard" | "vip",
        status: record.status as "pending" | "processing" | "verified" | "failed" | "expired",
        payment_status: record.payment_status as "unpaid" | "paid" | "refunded",
        profiles: profilesMap.get(record.user_id) || null
      })) as IDVRecord[];

      setRecords(combinedData);

      // Calculate stats
      setStats({
        total: combinedData.length,
        verified: combinedData.filter(r => r.status === "verified").length,
        pending: combinedData.filter(r => ["pending", "processing"].includes(r.status)).length,
        standard: combinedData.filter(r => r.tier === "standard" && r.status === "verified").length,
        vip: combinedData.filter(r => r.tier === "vip" && r.status === "verified").length
      });
    } catch (error: any) {
      console.error("Error fetching IDV records:", error);
      toast.error("Failed to load IDV records");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    return (
      record.profiles?.full_name?.toLowerCase().includes(searchLower) ||
      record.profiles?.email?.toLowerCase().includes(searchLower) ||
      record.profiles?.member_id?.toLowerCase().includes(searchLower) ||
      record.verified_hash?.toLowerCase().includes(searchLower)
    );
  });

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <Card className="bg-black/40 border-white/10">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-300">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={User} label="Total Verifications" value={stats.total} color="bg-cyan-600" />
        <StatCard icon={ShieldCheck} label="Verified" value={stats.verified} color="bg-emerald-600" />
        <StatCard icon={Clock} label="Pending" value={stats.pending} color="bg-amber-600" />
        <StatCard icon={ShieldCheck} label="Standard Tier" value={stats.standard} color="bg-green-600" />
        <StatCard icon={Globe} label="VIP Tier" value={stats.vip} color="bg-fuchsia-600" />
      </div>

      {/* Main Card */}
      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              IDV Verification Records
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                <Input
                  placeholder="Search by name, email, or hash..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64 bg-black/40 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchRecords}
                disabled={loading}
                className="border-white/20"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-200">Member</TableHead>
                  <TableHead className="text-gray-200">Tier</TableHead>
                  <TableHead className="text-gray-200">Status</TableHead>
                  <TableHead className="text-gray-200">Verified Hash</TableHead>
                  <TableHead className="text-gray-200">Verified At</TableHead>
                  <TableHead className="text-gray-200">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-300 py-8">
                      {loading ? "Loading..." : "No IDV records found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{record.profiles?.full_name || "N/A"}</div>
                          <div className="text-xs text-gray-300">{record.profiles?.email}</div>
                          <div className="text-xs text-cyan-400">{record.profiles?.member_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          record.tier === "vip" 
                            ? "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50" 
                            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                        }>
                          {record.tier === "vip" ? "VIP Global" : "Standard"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <IDVStatusBadge 
                          status={record.status as any} 
                          tier={record.tier}
                          size="sm"
                        />
                      </TableCell>
                      <TableCell>
                        {record.verified_hash ? (
                          <div className="flex items-center gap-1">
                            <Hash className="h-3 w-3 text-gray-300" />
                            <code className="text-xs bg-black/60 px-2 py-0.5 rounded text-gray-200">
                              {record.verified_hash.substring(0, 12)}...
                            </code>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.verified_at ? (
                          <div className="flex items-center gap-1 text-sm text-gray-200">
                            <Calendar className="h-3 w-3 text-gray-300" />
                            {format(new Date(record.verified_at), "MMM d, yyyy")}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-300">
                        {format(new Date(record.created_at), "MMM d, yyyy HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
