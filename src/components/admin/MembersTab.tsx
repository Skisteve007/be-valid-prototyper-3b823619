import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Download, Search, Users, UserPlus, Mail, Calendar, Tag, Copy, Send, X } from "lucide-react";
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
  payment_date: string | null;
  status_expiry: string | null;
  phone: string | null;
  investor_access_approved: boolean | null;
  partner_access_approved: boolean | null;
}

type MembershipFilter = 'all' | 'current' | 'expired' | 'unpaid';

export const MembersTab = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [membershipFilter, setMembershipFilter] = useState<MembershipFilter>('all');
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
    withDiscount: 0,
    current: 0,
    expired: 0,
    unpaid: 0,
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, email, member_id, created_at, signup_discount_code, status_color, payment_status, payment_date, status_expiry, phone, investor_access_approved, partner_access_approved")
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
      
      const current = data?.filter(m => getMembershipStatus(m) === 'current').length || 0;
      const expired = data?.filter(m => getMembershipStatus(m) === 'expired').length || 0;
      const unpaid = data?.filter(m => getMembershipStatus(m) === 'unpaid').length || 0;

      setStats({
        total: data?.length || 0,
        thisWeek,
        thisMonth,
        withDiscount,
        current,
        expired,
        unpaid,
      });
    } catch (error: any) {
      toast.error("Failed to load members");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMembershipStatus = (member: Member): 'current' | 'expired' | 'unpaid' => {
    if (member.payment_status !== 'paid') {
      return 'unpaid';
    }
    
    if (member.status_expiry) {
      const expiry = new Date(member.status_expiry);
      if (expiry < new Date()) {
        return 'expired';
      }
    }
    
    return 'current';
  };

  const getDaysUntilExpiry = (expiryDate: string | null): number | null => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getMembershipBadge = (member: Member) => {
    const status = getMembershipStatus(member);
    switch (status) {
      case 'current':
        return <Badge className="bg-green-500 text-white">Current</Badge>;
      case 'expired':
        return <Badge className="bg-red-500 text-white">Expired</Badge>;
      case 'unpaid':
        return <Badge variant="secondary">Unpaid</Badge>;
    }
  };

  const getExpiryDisplay = (member: Member) => {
    if (member.payment_status !== 'paid') {
      return <span className="text-muted-foreground text-sm">—</span>;
    }
    
    if (!member.status_expiry) {
      return <span className="text-muted-foreground text-sm">No expiry set</span>;
    }
    
    const expiryDate = new Date(member.status_expiry);
    const daysLeft = getDaysUntilExpiry(member.status_expiry);
    const isExpired = daysLeft !== null && daysLeft < 0;
    const isExpiringSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
    
    return (
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-500' : 'text-foreground'}`}>
          {format(expiryDate, 'MMM d, yyyy')}
        </span>
        {isExpired ? (
          <span className="text-xs text-red-500 font-medium">
            Expired {Math.abs(daysLeft!)} days ago
          </span>
        ) : isExpiringSoon ? (
          <span className="text-xs text-amber-500">
            {daysLeft} days left
          </span>
        ) : daysLeft !== null ? (
          <span className="text-xs text-muted-foreground">
            {daysLeft} days left
          </span>
        ) : null}
      </div>
    );
  };

  const exportToCSV = () => {
    const csvRows = [];
    csvRows.push(['Member ID', 'Full Name', 'Email', 'Phone', 'Signup Date', 'Discount Code', 'Status', 'Payment Status', 'Membership'].join(','));
    
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
        member.payment_status || 'unpaid',
        getMembershipStatus(member)
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
    let filtered = members;
    
    // Apply membership filter
    if (membershipFilter !== 'all') {
      filtered = filtered.filter(m => getMembershipStatus(m) === membershipFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.full_name?.toLowerCase().includes(query) ||
        m.email?.toLowerCase().includes(query) ||
        m.member_id?.toLowerCase().includes(query) ||
        m.signup_discount_code?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = getFilteredMembers().map(m => m.id);
      setSelectedMembers(new Set(allIds));
    } else {
      setSelectedMembers(new Set());
    }
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    const newSelected = new Set(selectedMembers);
    if (checked) {
      newSelected.add(memberId);
    } else {
      newSelected.delete(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const getSelectedEmails = (): string[] => {
    return members
      .filter(m => selectedMembers.has(m.id) && m.email)
      .map(m => m.email as string);
  };

  const copySelectedEmails = () => {
    const emails = getSelectedEmails();
    if (emails.length === 0) {
      toast.error("No members with emails selected");
      return;
    }
    navigator.clipboard.writeText(emails.join(', '));
    toast.success(`${emails.length} email(s) copied to clipboard`);
  };

  const openMailtoWithSelected = () => {
    const emails = getSelectedEmails();
    if (emails.length === 0) {
      toast.error("No members with emails selected");
      return;
    }
    window.location.href = `mailto:?bcc=${emails.join(',')}`;
    toast.success(`Opening email client with ${emails.length} recipient(s)`);
  };

  const selectExpiredMembers = () => {
    const expiredIds = members
      .filter(m => getMembershipStatus(m) === 'expired')
      .map(m => m.id);
    setSelectedMembers(new Set(expiredIds));
    setMembershipFilter('expired');
    toast.success(`Selected ${expiredIds.length} expired member(s)`);
  };

  const handleRevokeAccess = async (userId: string, accessType: "investor" | "partner") => {
    try {
      const updateData = accessType === "investor"
        ? {
            investor_access_approved: false,
            investor_access_approved_at: null,
            investor_access_requested_at: null,
            access_approved_by: null,
          }
        : {
            partner_access_approved: false,
            partner_access_approved_at: null,
            partner_access_requested_at: null,
            access_approved_by: null,
          };

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("user_id", userId);

      if (error) throw error;

      toast.success(`${accessType === "investor" ? "Investor" : "Partner"} access revoked`);
      loadMembers();
    } catch (error) {
      console.error("Error revoking access:", error);
      toast.error("Failed to revoke access");
    }
  };

  const filteredMembers = getFilteredMembers();
  const allFilteredSelected = filteredMembers.length > 0 && filteredMembers.every(m => selectedMembers.has(m.id));

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
        
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setMembershipFilter('current')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <UserPlus className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.current}</p>
                <p className="text-sm text-muted-foreground">Current</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setMembershipFilter('expired')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.expired}</p>
                <p className="text-sm text-muted-foreground">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setMembershipFilter('unpaid')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Tag className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.unpaid}</p>
                <p className="text-sm text-muted-foreground">Unpaid</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Members Actions */}
      {selectedMembers.size > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <span className="font-medium">{selectedMembers.size} member(s) selected</span>
                <span className="text-muted-foreground">({getSelectedEmails().length} with emails)</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={copySelectedEmails}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Emails
                </Button>
                <Button variant="outline" size="sm" onClick={openMailtoWithSelected}>
                  <Send className="h-4 w-4 mr-2" />
                  Open in Email Client
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedMembers(new Set())}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="h-6 w-6" />
                VALID Members
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
          
          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <Button 
              variant={membershipFilter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setMembershipFilter('all')}
            >
              All ({stats.total})
            </Button>
            <Button 
              variant={membershipFilter === 'current' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setMembershipFilter('current')}
              className={membershipFilter === 'current' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              Current ({stats.current})
            </Button>
            <Button 
              variant={membershipFilter === 'expired' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setMembershipFilter('expired')}
              className={membershipFilter === 'expired' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              Expired ({stats.expired})
            </Button>
            <Button 
              variant={membershipFilter === 'unpaid' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setMembershipFilter('unpaid')}
            >
              Unpaid ({stats.unpaid})
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={selectExpiredMembers}
              className="ml-auto"
            >
              <Mail className="h-4 w-4 mr-2" />
              Select All Expired for Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={allFilteredSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Signup Date</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Health Status</TableHead>
                  <TableHead className="text-center">Access</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      {searchQuery || membershipFilter !== 'all' ? "No members match your filter" : "No members yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow 
                      key={member.id} 
                      className={`${selectedMembers.has(member.id) ? 'bg-primary/5' : ''} ${getMembershipStatus(member) === 'expired' ? 'bg-red-500/5' : ''}`}
                    >
                      <TableCell>
                        <Checkbox 
                          checked={selectedMembers.has(member.id)}
                          onCheckedChange={(checked) => handleSelectMember(member.id, checked as boolean)}
                        />
                      </TableCell>
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
                        ) : (
                          <span className="text-muted-foreground">No email</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(member.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>{getMembershipBadge(member)}</TableCell>
                      <TableCell>{getExpiryDisplay(member)}</TableCell>
                      <TableCell>{getStatusBadge(member.status_color)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {member.investor_access_approved && (
                            <div className="flex items-center gap-1">
                              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-xs">Investor</Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 w-5 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/20"
                                onClick={() => handleRevokeAccess(member.user_id, "investor")}
                                title="Revoke Investor Access"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                          {member.partner_access_approved && (
                            <div className="flex items-center gap-1">
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 text-xs">Partner</Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 w-5 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/20"
                                onClick={() => handleRevokeAccess(member.user_id, "partner")}
                                title="Revoke Partner Access"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                          {!member.investor_access_approved && !member.partner_access_approved && (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </div>
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
