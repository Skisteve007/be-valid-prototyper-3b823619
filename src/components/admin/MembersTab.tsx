import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Download, Search, Users, UserPlus, Mail, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

interface Member {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  member_id: string | null;
  created_at: string;
  signup_discount_code: string | null;
  status_color: string | null;
  payment_status: string | null;
  phone: string | null;
}

export const MembersTab = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
    withDiscount: 0,
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, email, member_id, created_at, signup_discount_code, status_color, payment_status, phone")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMembers(data || []);

      // Calculate stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const thisWeek = data?.filter(m => new Date(m.created_at) >= weekAgo).length || 0;
      const thisMonth = data?.filter(m => new Date(m.created_at) >= monthAgo).length || 0;
      const withDiscount = data?.filter(m => m.signup_discount_code).length || 0;

      setStats({
        total: data?.length || 0,
        thisWeek,
        thisMonth,
        withDiscount,
      });
    } catch (error: any) {
      toast.error("Failed to load members");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvRows = [];
    csvRows.push(['Member ID', 'Full Name', 'Email', 'Phone', 'Signup Date', 'Discount Code', 'Status', 'Payment Status'].join(','));
    
    const filteredMembers = getFilteredMembers();
    filteredMembers.forEach((member) => {
      csvRows.push([
        member.member_id || '',
        `"${member.full_name || ''}"`,
        member.email || '',
        member.phone || '',
        format(new Date(member.created_at), 'yyyy-MM-dd HH:mm'),
        member.signup_discount_code || '',
        member.status_color || 'grey',
        member.payment_status || 'unpaid'
      ].join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `clean-check-members-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Members exported to CSV");
  };

  const getFilteredMembers = () => {
    if (!searchQuery) return members;
    const query = searchQuery.toLowerCase();
    return members.filter(m => 
      m.full_name?.toLowerCase().includes(query) ||
      m.email?.toLowerCase().includes(query) ||
      m.member_id?.toLowerCase().includes(query) ||
      m.signup_discount_code?.toLowerCase().includes(query)
    );
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'green':
        return <Badge className="bg-green-500">Verified</Badge>;
      case 'yellow':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'red':
        return <Badge className="bg-red-500">Alert</Badge>;
      default:
        return <Badge variant="secondary">Inactive</Badge>;
    }
  };

  const filteredMembers = getFilteredMembers();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <UserPlus className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.thisWeek}</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.thisMonth}</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <Tag className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.withDiscount}</p>
                <p className="text-sm text-muted-foreground">Via Referral</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="h-6 w-6" />
                Clean Check Members
              </CardTitle>
              <CardDescription>
                All registered members with their signup information
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={loadMembers}>
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Signup Date</TableHead>
                  <TableHead>Discount Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No members match your search" : "No members yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-mono text-sm">
                        {member.member_id || '-'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {member.full_name || '-'}
                      </TableCell>
                      <TableCell>
                        {member.email ? (
                          <a href={`mailto:${member.email}`} className="text-primary hover:underline flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </a>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{member.phone || '-'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(member.created_at), 'MMM d, yyyy h:mm a')}
                      </TableCell>
                      <TableCell>
                        {member.signup_discount_code ? (
                          <Badge variant="outline" className="bg-pink-500/10 text-pink-600 border-pink-500/30">
                            {member.signup_discount_code}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(member.status_color)}</TableCell>
                      <TableCell>
                        <Badge variant={member.payment_status === 'paid' ? 'default' : 'secondary'}>
                          {member.payment_status || 'unpaid'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredMembers.length} of {members.length} members
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembersTab;