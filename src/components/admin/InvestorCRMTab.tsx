import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  Mail, 
  Phone, 
  Building2, 
  DollarSign, 
  Calendar,
  ExternalLink,
  TrendingUp,
  Users,
  Target,
  FileText
} from "lucide-react";
import { format } from "date-fns";

interface Investor {
  id: string;
  name: string;
  firm: string;
  email: string;
  phone: string;
  type: "angel" | "vc" | "strategic" | "family_office";
  status: "prospect" | "contacted" | "meeting_scheduled" | "due_diligence" | "term_sheet" | "closed" | "passed";
  check_size: string;
  notes: string;
  last_contact: string;
  next_followup: string;
  created_at: string;
}

// Using localStorage for now since we don't have an investors table
const STORAGE_KEY = "cleancheck_investor_crm";

export const InvestorCRMTab = () => {
  const navigate = useNavigate();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [newInvestor, setNewInvestor] = useState({
    name: "",
    firm: "",
    email: "",
    phone: "",
    type: "angel" as Investor["type"],
    status: "prospect" as Investor["status"],
    check_size: "",
    notes: "",
    last_contact: "",
    next_followup: "",
  });

  useEffect(() => {
    loadInvestors();
  }, []);

  const loadInvestors = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setInvestors(JSON.parse(stored));
    }
  };

  const saveInvestors = (data: Investor[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setInvestors(data);
  };

  const handleAddInvestor = (e: React.FormEvent) => {
    e.preventDefault();
    const investor: Investor = {
      ...newInvestor,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    const updated = [...investors, investor];
    saveInvestors(updated);
    setDialogOpen(false);
    resetForm();
    toast.success("Investor added successfully");
  };

  const handleUpdateInvestor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvestor) return;
    
    const updated = investors.map(inv => 
      inv.id === editingInvestor.id 
        ? { ...editingInvestor, ...newInvestor }
        : inv
    );
    saveInvestors(updated);
    setEditingInvestor(null);
    setDialogOpen(false);
    resetForm();
    toast.success("Investor updated successfully");
  };

  const handleDeleteInvestor = (id: string) => {
    if (!confirm("Delete this investor?")) return;
    const updated = investors.filter(inv => inv.id !== id);
    saveInvestors(updated);
    toast.success("Investor deleted");
  };

  const handleStatusChange = (id: string, status: Investor["status"]) => {
    const updated = investors.map(inv => 
      inv.id === id ? { ...inv, status } : inv
    );
    saveInvestors(updated);
    toast.success("Status updated");
  };

  const resetForm = () => {
    setNewInvestor({
      name: "",
      firm: "",
      email: "",
      phone: "",
      type: "angel",
      status: "prospect",
      check_size: "",
      notes: "",
      last_contact: "",
      next_followup: "",
    });
  };

  const openEditDialog = (investor: Investor) => {
    setEditingInvestor(investor);
    setNewInvestor({
      name: investor.name,
      firm: investor.firm,
      email: investor.email,
      phone: investor.phone,
      type: investor.type,
      status: investor.status,
      check_size: investor.check_size,
      notes: investor.notes,
      last_contact: investor.last_contact,
      next_followup: investor.next_followup,
    });
    setDialogOpen(true);
  };

  const getStatusColor = (status: Investor["status"]) => {
    const colors: Record<string, string> = {
      prospect: "bg-slate-500",
      contacted: "bg-blue-500",
      meeting_scheduled: "bg-purple-500",
      due_diligence: "bg-orange-500",
      term_sheet: "bg-yellow-500",
      closed: "bg-green-500",
      passed: "bg-red-500",
    };
    return colors[status] || "bg-slate-500";
  };

  const getTypeLabel = (type: Investor["type"]) => {
    const labels: Record<string, string> = {
      angel: "Angel",
      vc: "VC",
      strategic: "Strategic",
      family_office: "Family Office",
    };
    return labels[type] || type;
  };

  const filteredInvestors = investors.filter(inv => {
    if (filterStatus !== "all" && inv.status !== filterStatus) return false;
    if (filterType !== "all" && inv.type !== filterType) return false;
    return true;
  });

  const stats = {
    total: investors.length,
    active: investors.filter(i => !["closed", "passed"].includes(i.status)).length,
    pipeline: investors.filter(i => ["meeting_scheduled", "due_diligence", "term_sheet"].includes(i.status)).length,
    closed: investors.filter(i => i.status === "closed").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Contacts</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{stats.pipeline}</div>
                <div className="text-sm text-muted-foreground">In Pipeline</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{stats.closed}</div>
                <div className="text-sm text-muted-foreground">Closed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Investor CRM</CardTitle>
              <CardDescription>Track investor relationships and fundraising pipeline</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="meeting_scheduled">Meeting</SelectItem>
                  <SelectItem value="due_diligence">Due Diligence</SelectItem>
                  <SelectItem value="term_sheet">Term Sheet</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="angel">Angel</SelectItem>
                  <SelectItem value="vc">VC</SelectItem>
                  <SelectItem value="strategic">Strategic</SelectItem>
                  <SelectItem value="family_office">Family Office</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) {
                  setEditingInvestor(null);
                  resetForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Investor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingInvestor ? "Edit Investor" : "Add Investor"}</DialogTitle>
                    <DialogDescription>
                      {editingInvestor ? "Update investor details" : "Add a new investor contact"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={editingInvestor ? handleUpdateInvestor : handleAddInvestor} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input
                          value={newInvestor.name}
                          onChange={(e) => setNewInvestor({ ...newInvestor, name: e.target.value })}
                          placeholder="John Smith"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Firm</Label>
                        <Input
                          value={newInvestor.firm}
                          onChange={(e) => setNewInvestor({ ...newInvestor, firm: e.target.value })}
                          placeholder="Acme Ventures"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={newInvestor.email}
                          onChange={(e) => setNewInvestor({ ...newInvestor, email: e.target.value })}
                          placeholder="john@acme.vc"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={newInvestor.phone}
                          onChange={(e) => setNewInvestor({ ...newInvestor, phone: e.target.value })}
                          placeholder="+1 555 123 4567"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select 
                          value={newInvestor.type} 
                          onValueChange={(v) => setNewInvestor({ ...newInvestor, type: v as Investor["type"] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="angel">Angel</SelectItem>
                            <SelectItem value="vc">VC</SelectItem>
                            <SelectItem value="strategic">Strategic</SelectItem>
                            <SelectItem value="family_office">Family Office</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select 
                          value={newInvestor.status} 
                          onValueChange={(v) => setNewInvestor({ ...newInvestor, status: v as Investor["status"] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prospect">Prospect</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
                            <SelectItem value="due_diligence">Due Diligence</SelectItem>
                            <SelectItem value="term_sheet">Term Sheet</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                            <SelectItem value="passed">Passed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Check Size</Label>
                      <Input
                        value={newInvestor.check_size}
                        onChange={(e) => setNewInvestor({ ...newInvestor, check_size: e.target.value })}
                        placeholder="$50K - $100K"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Last Contact</Label>
                        <Input
                          type="date"
                          value={newInvestor.last_contact}
                          onChange={(e) => setNewInvestor({ ...newInvestor, last_contact: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Next Follow-up</Label>
                        <Input
                          type="date"
                          value={newInvestor.next_followup}
                          onChange={(e) => setNewInvestor({ ...newInvestor, next_followup: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={newInvestor.notes}
                        onChange={(e) => setNewInvestor({ ...newInvestor, notes: e.target.value })}
                        placeholder="Meeting notes, interests, concerns..."
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {editingInvestor ? "Update Investor" : "Add Investor"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInvestors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No investors found. Add your first investor contact.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInvestors.map((investor) => (
                <Card key={investor.id} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{investor.name}</h3>
                          <Badge variant="outline">{getTypeLabel(investor.type)}</Badge>
                          <Badge className={`${getStatusColor(investor.status)} text-white`}>
                            {investor.status.replace("_", " ")}
                          </Badge>
                        </div>
                        {investor.firm && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Building2 className="h-3 w-3" />
                            {investor.firm}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-4 mt-2 text-sm">
                          {investor.email && (
                            <a 
                              href={`mailto:${investor.email}`}
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              <Mail className="h-3 w-3" />
                              {investor.email}
                            </a>
                          )}
                          {investor.phone && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {investor.phone}
                            </span>
                          )}
                          {investor.check_size && (
                            <span className="flex items-center gap-1 text-green-600">
                              <DollarSign className="h-3 w-3" />
                              {investor.check_size}
                            </span>
                          )}
                        </div>
                        {investor.notes && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {investor.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Select 
                          value={investor.status} 
                          onValueChange={(v) => handleStatusChange(investor.id, v as Investor["status"])}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prospect">Prospect</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="meeting_scheduled">Meeting</SelectItem>
                            <SelectItem value="due_diligence">Due Diligence</SelectItem>
                            <SelectItem value="term_sheet">Term Sheet</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                            <SelectItem value="passed">Passed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(investor)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteInvestor(investor.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate("/pitch-deck")}>
              <FileText className="h-4 w-4 mr-2" />
              View Pitch Deck
            </Button>
            <Button variant="outline" onClick={() => window.open("/competitive-scorecard", "_blank")}>
              <Target className="h-4 w-4 mr-2" />
              Competitive Analysis
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                const csv = [
                  ["Name", "Firm", "Email", "Type", "Status", "Check Size", "Notes"].join(","),
                  ...investors.map(i => [
                    i.name, i.firm, i.email, i.type, i.status, i.check_size, `"${i.notes.replace(/"/g, '""')}"`
                  ].join(","))
                ].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `investor-crm-${format(new Date(), "yyyy-MM-dd")}.csv`;
                a.click();
                toast.success("Exported to CSV");
              }}
            >
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorCRMTab;
