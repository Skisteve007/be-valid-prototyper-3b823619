import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Search, Building2, Plus, Eye, Play, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Account {
  id: string;
  account_name: string;
  industry: string;
  location_city: string | null;
  location_country: string;
  status: string;
  last_run_at: string | null;
  last_verdict: string | null;
  total_runs: number;
  created_at: string;
}

type IndustryFilter = 'all' | 'enterprise' | 'healthcare' | 'fintech' | 'legal' | 'government' | 'insurance';

const INDUSTRY_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  'enterprise': { label: 'Enterprise', emoji: '🏢', color: 'bg-cyan-500 text-white' },
  'healthcare': { label: 'Healthcare', emoji: '🏥', color: 'bg-red-500 text-white' },
  'fintech': { label: 'FinTech', emoji: '💳', color: 'bg-green-500 text-white' },
  'legal': { label: 'Legal', emoji: '⚖️', color: 'bg-indigo-500 text-white' },
  'government': { label: 'Government', emoji: '🏛️', color: 'bg-slate-500 text-white' },
  'insurance': { label: 'Insurance', emoji: '🛡️', color: 'bg-amber-500 text-black' },
};

interface AccountsDirectoryTabProps {
  onSelectAccount: (accountId: string) => void;
}

export const AccountsDirectoryTab = ({ onSelectAccount }: AccountsDirectoryTabProps) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<IndustryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [countries, setCountries] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add account dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAccount, setNewAccount] = useState({
    account_name: "",
    industry: "enterprise",
    location_city: "",
    location_country: "USA",
  });
  const [addingAccount, setAddingAccount] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from("enterprise_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAccounts(data || []);
      const uniqueCountries = [...new Set(data?.map(a => a.location_country) || [])].filter(Boolean).sort();
      setCountries(uniqueCountries as string[]);
    } catch (error: any) {
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async () => {
    if (!newAccount.account_name) {
      toast.error("Please enter an account name");
      return;
    }

    setAddingAccount(true);
    try {
      const { error } = await supabase
        .from("enterprise_accounts")
        .insert({
          account_name: newAccount.account_name,
          industry: newAccount.industry,
          location_city: newAccount.location_city || null,
          location_country: newAccount.location_country,
        });

      if (error) throw error;

      toast.success("Account created successfully");
      setShowAddDialog(false);
      setNewAccount({
        account_name: "",
        industry: "enterprise",
        location_city: "",
        location_country: "USA",
      });
      loadAccounts();
    } catch (error: any) {
      toast.error("Failed to create account");
    } finally {
      setAddingAccount(false);
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.account_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (account.location_city?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCountry = countryFilter === "all" || account.location_country === countryFilter;
    const matchesIndustry = industryFilter === "all" || account.industry === industryFilter;
    const matchesStatus = statusFilter === "all" || account.status === statusFilter;
    return matchesSearch && matchesCountry && matchesIndustry && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, countryFilter, industryFilter, statusFilter]);

  const getIndustryBadge = (industry: string) => {
    const config = INDUSTRY_CONFIG[industry] || INDUSTRY_CONFIG['enterprise'];
    return (
      <Badge className={config.color}>
        {config.emoji} {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-500 text-white',
      'pending': 'bg-yellow-500 text-black',
      'onboarding': 'bg-blue-500 text-white',
      'inactive': 'bg-muted text-muted-foreground',
    };
    return <Badge className={colors[status] || 'bg-muted'}>{status}</Badge>;
  };

  const getVerdictBadge = (verdict: string | null) => {
    if (!verdict) return <span className="text-muted-foreground">—</span>;
    const colors: Record<string, string> = {
      'OK': 'bg-green-500 text-white',
      'REVIEW': 'bg-yellow-500 text-black',
      'BLOCK': 'bg-red-500 text-white',
    };
    return <Badge className={colors[verdict] || 'bg-muted'}>{verdict}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Accounts Directory
            </CardTitle>
            <CardDescription>
              {accounts.length} enterprise accounts • Manage deployments, connectors, and runs
            </CardDescription>
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Account</DialogTitle>
                <DialogDescription>
                  Add a new enterprise account to manage deployments
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Account Name *</Label>
                  <Input
                    placeholder="Enter account name"
                    value={newAccount.account_name}
                    onChange={(e) => setNewAccount({ ...newAccount, account_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select 
                    value={newAccount.industry} 
                    onValueChange={(val) => setNewAccount({ ...newAccount, industry: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="enterprise">🏢 Enterprise</SelectItem>
                      <SelectItem value="healthcare">🏥 Healthcare</SelectItem>
                      <SelectItem value="fintech">💳 FinTech</SelectItem>
                      <SelectItem value="legal">⚖️ Legal</SelectItem>
                      <SelectItem value="government">🏛️ Government</SelectItem>
                      <SelectItem value="insurance">🛡️ Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      placeholder="City"
                      value={newAccount.location_city}
                      onChange={(e) => setNewAccount({ ...newAccount, location_city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      placeholder="Country"
                      value={newAccount.location_country}
                      onChange={(e) => setNewAccount({ ...newAccount, location_country: e.target.value })}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAddAccount} 
                  disabled={addingAccount}
                  className="w-full"
                >
                  {addingAccount && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={industryFilter} onValueChange={(val: IndustryFilter) => setIndustryFilter(val)}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent className="bg-background border z-50">
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="fintech">FinTech</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="insurance">Insurance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent className="bg-background border z-50">
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-background border z-50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Last Verdict</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No accounts found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAccounts.map((account) => (
                  <TableRow key={account.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{account.account_name}</TableCell>
                    <TableCell>
                      {account.location_city ? `${account.location_city}, ${account.location_country}` : account.location_country}
                    </TableCell>
                    <TableCell>{getIndustryBadge(account.industry)}</TableCell>
                    <TableCell>{getStatusBadge(account.status)}</TableCell>
                    <TableCell>
                      {account.last_run_at 
                        ? format(new Date(account.last_run_at), "MMM d, h:mm a")
                        : <span className="text-muted-foreground">Never</span>
                      }
                    </TableCell>
                    <TableCell>{getVerdictBadge(account.last_verdict)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectAccount(account.id)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectAccount(account.id)}
                          title="Configure"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectAccount(account.id)}
                          className="gap-1"
                        >
                          <Play className="h-3 w-3" /> Run
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">Page {currentPage} of {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
