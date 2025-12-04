import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Plus, 
  Mail, 
  Phone, 
  Building2, 
  Calendar,
  Trash2,
  Edit2,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

type InvestorStage = "prospect" | "contacted" | "interested" | "due_diligence" | "committed" | "passed";

interface Investor {
  id: string;
  name: string;
  firm: string;
  email: string;
  phone: string;
  stage: InvestorStage;
  targetAmount: number;
  notes: string;
  lastContact: string;
  linkedIn?: string;
}

const STORAGE_KEY = "investor-pipeline-data";

const stageConfig: Record<InvestorStage, { label: string; color: string; order: number }> = {
  prospect: { label: "Prospect", color: "bg-slate-500/20 text-slate-600 border-slate-500/30", order: 1 },
  contacted: { label: "Contacted", color: "bg-blue-500/20 text-blue-600 border-blue-500/30", order: 2 },
  interested: { label: "Interested", color: "bg-amber-500/20 text-amber-600 border-amber-500/30", order: 3 },
  due_diligence: { label: "Due Diligence", color: "bg-purple-500/20 text-purple-600 border-purple-500/30", order: 4 },
  committed: { label: "Committed", color: "bg-green-500/20 text-green-600 border-green-500/30", order: 5 },
  passed: { label: "Passed", color: "bg-red-500/20 text-red-600 border-red-500/30", order: 6 },
};

const initialInvestors: Investor[] = [
  {
    id: "1",
    name: "Sarah Chen",
    firm: "Sequoia Capital",
    email: "schen@sequoia.com",
    phone: "(650) 555-0100",
    stage: "prospect",
    targetAmount: 500000,
    notes: "Focus on consumer health tech. Previously invested in Hims, Ro.",
    lastContact: "",
    linkedIn: "https://linkedin.com/in/example",
  },
  {
    id: "2",
    name: "Marcus Williams",
    firm: "Andreessen Horowitz",
    email: "mwilliams@a16z.com",
    phone: "(650) 555-0200",
    stage: "contacted",
    targetAmount: 750000,
    notes: "Bio fund partner. Interested in privacy-first health platforms.",
    lastContact: "2024-12-01",
  },
];

export function TargetInvestorDashboard() {
  const [investors, setInvestors] = useState<Investor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialInvestors;
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);
  const [filterStage, setFilterStage] = useState<InvestorStage | "all">("all");

  const [formData, setFormData] = useState<Partial<Investor>>({
    name: "",
    firm: "",
    email: "",
    phone: "",
    stage: "prospect",
    targetAmount: 0,
    notes: "",
    linkedIn: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(investors));
  }, [investors]);

  const resetForm = () => {
    setFormData({
      name: "",
      firm: "",
      email: "",
      phone: "",
      stage: "prospect",
      targetAmount: 0,
      notes: "",
      linkedIn: "",
    });
    setEditingInvestor(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.firm) {
      toast.error("Name and firm are required");
      return;
    }

    if (editingInvestor) {
      setInvestors((prev) =>
        prev.map((inv) =>
          inv.id === editingInvestor.id
            ? { ...inv, ...formData, lastContact: inv.lastContact }
            : inv
        )
      );
      toast.success("Investor updated");
    } else {
      const newInvestor: Investor = {
        id: Date.now().toString(),
        name: formData.name || "",
        firm: formData.firm || "",
        email: formData.email || "",
        phone: formData.phone || "",
        stage: (formData.stage as InvestorStage) || "prospect",
        targetAmount: formData.targetAmount || 0,
        notes: formData.notes || "",
        lastContact: "",
        linkedIn: formData.linkedIn,
      };
      setInvestors((prev) => [...prev, newInvestor]);
      toast.success("Investor added");
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setInvestors((prev) => prev.filter((inv) => inv.id !== id));
    toast.success("Investor removed");
  };

  const handleStageChange = (id: string, newStage: InvestorStage) => {
    setInvestors((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? { ...inv, stage: newStage, lastContact: new Date().toISOString().split("T")[0] }
          : inv
      )
    );
    toast.success(`Stage updated to ${stageConfig[newStage].label}`);
  };

  const openEditDialog = (investor: Investor) => {
    setEditingInvestor(investor);
    setFormData(investor);
    setIsAddDialogOpen(true);
  };

  // Stats
  const totalPipeline = investors
    .filter((i) => !["passed"].includes(i.stage))
    .reduce((acc, inv) => acc + inv.targetAmount, 0);
  const committedAmount = investors
    .filter((i) => i.stage === "committed")
    .reduce((acc, inv) => acc + inv.targetAmount, 0);
  const activeInvestors = investors.filter((i) => !["passed", "committed"].includes(i.stage)).length;
  const conversionRate = investors.length > 0
    ? Math.round((investors.filter((i) => i.stage === "committed").length / investors.length) * 100)
    : 0;

  const filteredInvestors = investors
    .filter((inv) => filterStage === "all" || inv.stage === filterStage)
    .sort((a, b) => stageConfig[a.stage].order - stageConfig[b.stage].order);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Pipeline Value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalPipeline)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Committed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(committedAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Prospects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeInvestors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Conversion Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{conversionRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Funding Progress</CardTitle>
          <CardDescription>Target: $2,000,000 Seed Round</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Committed Capital</span>
              <span className="font-medium">{formatCurrency(committedAmount)} / $2,000,000</span>
            </div>
            <Progress value={(committedAmount / 2000000) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Investor List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Investor Pipeline</CardTitle>
              <CardDescription>Track and manage investor relationships</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterStage} onValueChange={(v) => setFilterStage(v as InvestorStage | "all")}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {Object.entries(stageConfig).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Investor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingInvestor ? "Edit Investor" : "Add New Investor"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input
                          value={formData.name || ""}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Smith"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Firm *</Label>
                        <Input
                          value={formData.firm || ""}
                          onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                          placeholder="Acme Ventures"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@acme.vc"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={formData.phone || ""}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Stage</Label>
                        <Select
                          value={formData.stage}
                          onValueChange={(v) => setFormData({ ...formData, stage: v as InvestorStage })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(stageConfig).map(([key, { label }]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Target Amount ($)</Label>
                        <Input
                          type="number"
                          value={formData.targetAmount || ""}
                          onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
                          placeholder="250000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>LinkedIn URL</Label>
                      <Input
                        value={formData.linkedIn || ""}
                        onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={formData.notes || ""}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Investment thesis, connections, follow-up items..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleSave} className="w-full">
                      {editingInvestor ? "Update Investor" : "Add Investor"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredInvestors.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No investors found</p>
            ) : (
              filteredInvestors.map((investor) => (
                <div
                  key={investor.id}
                  className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium">{investor.name}</h4>
                        <Badge variant="outline" className={stageConfig[investor.stage].color}>
                          {stageConfig[investor.stage].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {investor.firm}
                        </span>
                        {investor.email && (
                          <a href={`mailto:${investor.email}`} className="flex items-center gap-1 hover:text-foreground">
                            <Mail className="h-3 w-3" />
                            {investor.email}
                          </a>
                        )}
                        {investor.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {investor.phone}
                          </span>
                        )}
                      </div>
                      {investor.notes && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{investor.notes}</p>
                      )}
                      {investor.lastContact && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Last contact: {investor.lastContact}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-semibold text-sm">{formatCurrency(investor.targetAmount)}</span>
                      <Select
                        value={investor.stage}
                        onValueChange={(v) => handleStageChange(investor.id, v as InvestorStage)}
                      >
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(stageConfig).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {investor.linkedIn && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={investor.linkedIn} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(investor)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(investor.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
