import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Car, Building2, RefreshCw, Upload, Trash2 } from "lucide-react";

interface MarketingLead {
  id: string;
  company_name: string;
  contact_email: string;
  category: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const EMAIL_TEMPLATES = {
  exotic: {
    subject: "Protect Your Fleet from Liability - Clean Check Driver Verification",
    body: `Hi,

Don't let a junkie drive your Lambo.

Your exotic fleet is worth millions. One incident with an impaired driver destroys your reputation AND your insurance rates.

Clean Check provides:
✅ Pre-rental driver toxicology screening
✅ Real-time "Green Light" verification badges
✅ Zero-tolerance instant red flags
✅ Full liability documentation

Fleet License: Starting at $99/month - unlimited drivers.

Ready to protect your assets?

Best,
Clean Check Team
https://cleancheck.fit/compliance`
  },
  corporate: {
    subject: "Fleet Risk Management Solution - Clean Check",
    body: `Hi,

Your fleet's safety record directly impacts your bottom line.

Clean Check's Fleet Risk Tier system provides:
✅ Continuous driver health & toxicology monitoring
✅ DOT-compliant screening workflows
✅ Real-time driver status dashboards
✅ Reduced insurance premiums through verified safety

Enterprise Fleet License: Starting at $99/month

Let's discuss how we can reduce your fleet liability exposure.

Best,
Clean Check Enterprise Team
https://cleancheck.fit/compliance`
  },
  followup: {
    subject: "Quick follow-up - Clean Check Fleet Solutions",
    body: `Hi,

Just checking in on my previous message about Clean Check's driver verification system.

Would you have 15 minutes this week for a quick demo? I'd love to show you how other fleets are using our platform to reduce liability and improve safety scores.

Let me know what works for your schedule.

Best,
Clean Check Team`
  }
};

export const LeadOutreachTab = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<MarketingLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [csvInput, setCsvInput] = useState("");
  const [importing, setImporting] = useState(false);
  const [newLead, setNewLead] = useState({
    company_name: "",
    contact_email: "",
    category: "Exotic Rental",
    notes: ""
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("marketing_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching leads", description: error.message, variant: "destructive" });
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  const handleAddLead = async () => {
    if (!newLead.company_name || !newLead.contact_email) {
      toast({ title: "Missing fields", description: "Company name and email are required", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("marketing_leads").insert({
      company_name: newLead.company_name,
      contact_email: newLead.contact_email,
      category: newLead.category,
      notes: newLead.notes || null
    });

    if (error) {
      toast({ title: "Error adding lead", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Lead added successfully" });
      setNewLead({ company_name: "", contact_email: "", category: "Exotic Rental", notes: "" });
      fetchLeads();
    }
  };

  const handleBulkImport = async () => {
    if (!csvInput.trim()) {
      toast({ title: "No data to import", variant: "destructive" });
      return;
    }

    setImporting(true);
    const lines = csvInput.trim().split("\n");
    const leadsToInsert: { company_name: string; contact_email: string; category: string }[] = [];

    for (const line of lines) {
      const parts = line.split(",").map(p => p.trim());
      if (parts.length >= 2) {
        // Format: email, company_name, category (optional)
        const [email, company, category] = parts;
        if (email && email.includes("@")) {
          leadsToInsert.push({
            contact_email: email,
            company_name: company || "Unknown Company",
            category: category && ["Exotic Rental", "Corporate Fleet", "Rideshare Boss"].includes(category) 
              ? category 
              : "Corporate Fleet"
          });
        }
      } else if (parts[0] && parts[0].includes("@")) {
        // Just email
        leadsToInsert.push({
          contact_email: parts[0],
          company_name: "Unknown Company",
          category: "Corporate Fleet"
        });
      }
    }

    if (leadsToInsert.length === 0) {
      toast({ title: "No valid emails found", variant: "destructive" });
      setImporting(false);
      return;
    }

    const { error } = await supabase.from("marketing_leads").insert(leadsToInsert);

    if (error) {
      toast({ title: "Import failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Imported ${leadsToInsert.length} leads successfully` });
      setCsvInput("");
      fetchLeads();
    }
    setImporting(false);
  };

  const handleSendEmail = async (lead: MarketingLead, templateType: "exotic" | "corporate" | "followup") => {
    const template = EMAIL_TEMPLATES[templateType];
    const mailtoLink = `mailto:${lead.contact_email}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;
    
    // Open mailto link
    window.open(mailtoLink, "_blank");

    // Update status to Contacted if currently New
    if (lead.status === "New") {
      const { error } = await supabase
        .from("marketing_leads")
        .update({ status: "Contacted" })
        .eq("id", lead.id);

      if (error) {
        toast({ title: "Error updating status", description: error.message, variant: "destructive" });
      } else {
        fetchLeads();
      }
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    const { error } = await supabase
      .from("marketing_leads")
      .update({ status: newStatus })
      .eq("id", leadId);

    if (error) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    } else {
      fetchLeads();
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    const { error } = await supabase
      .from("marketing_leads")
      .delete()
      .eq("id", leadId);

    if (error) {
      toast({ title: "Error deleting lead", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Lead deleted" });
      fetchLeads();
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "New": return "default";
      case "Contacted": return "secondary";
      case "Interested": return "outline";
      case "Not Interested": return "destructive";
      default: return "default";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Exotic Rental": return "text-amber-400";
      case "Corporate Fleet": return "text-blue-400";
      case "Rideshare Boss": return "text-green-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Single Lead */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Add New Lead
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input
                placeholder="Exotic Auto Rentals"
                value={newLead.company_name}
                onChange={(e) => setNewLead({ ...newLead, company_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Contact Email</Label>
              <Input
                type="email"
                placeholder="contact@company.com"
                value={newLead.contact_email}
                onChange={(e) => setNewLead({ ...newLead, contact_email: e.target.value })}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={newLead.category} onValueChange={(v) => setNewLead({ ...newLead, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Exotic Rental">Exotic Rental</SelectItem>
                  <SelectItem value="Corporate Fleet">Corporate Fleet</SelectItem>
                  <SelectItem value="Rideshare Boss">Rideshare Boss</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddLead} className="w-full">Add Lead</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Import (CSV)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste CSV data here. Format: email, company_name, category (one per line)&#10;Example:&#10;john@exoticcars.com, Exotic Car Rentals, Exotic Rental&#10;fleet@corporate.com, Corporate Fleet Inc, Corporate Fleet"
              rows={5}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
            />
            <Button onClick={handleBulkImport} disabled={importing}>
              {importing ? "Importing..." : "Import Leads"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lead Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lead Pipeline ({leads.length})</span>
            <Button variant="outline" size="sm" onClick={fetchLeads}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : leads.length === 0 ? (
            <p className="text-muted-foreground">No leads yet. Add some above!</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.company_name}</TableCell>
                      <TableCell>{lead.contact_email}</TableCell>
                      <TableCell>
                        <span className={getCategoryColor(lead.category)}>{lead.category}</span>
                      </TableCell>
                      <TableCell>
                        <Select value={lead.status} onValueChange={(v) => handleStatusChange(lead.id, v)}>
                          <SelectTrigger className="w-32">
                            <Badge variant={getStatusBadgeVariant(lead.status)}>{lead.status}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Interested">Interested</SelectItem>
                            <SelectItem value="Not Interested">Not Interested</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendEmail(lead, "exotic")}
                            className="text-amber-500 border-amber-500/50 hover:bg-amber-500/10"
                          >
                            <Car className="h-3 w-3 mr-1" />
                            Exotic
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendEmail(lead, "corporate")}
                            className="text-blue-500 border-blue-500/50 hover:bg-blue-500/10"
                          >
                            <Building2 className="h-3 w-3 mr-1" />
                            Corp
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendEmail(lead, "followup")}
                            className="text-green-500 border-green-500/50 hover:bg-green-500/10"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Follow
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
