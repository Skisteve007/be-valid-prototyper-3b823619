import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Save, DollarSign, Package, FileText, Receipt, Edit2, Check, X } from "lucide-react";

interface PricingCatalogItem {
  id: string;
  event_code: string;
  event_name: string;
  description: string | null;
  payer: string;
  unit_price: number;
  vendor_cost: number | null;
  markup: number | null;
  billing_cadence: string;
  is_active: boolean;
}

interface IndustryPackage {
  id: string;
  package_key: string;
  display_name: string;
  description: string | null;
  target_audience: string | null;
  saas_monthly_fee: number | null;
  saas_annual_fee: number | null;
  included_events: string[];
  volume_tiers: any;
  payout_cadence_options: string[];
  payout_cadence_default: string;
  is_active: boolean;
  sort_order: number;
}

interface StatementTemplate {
  id: string;
  package_id: string | null;
  template_name: string;
  line_item_config: any;
  is_active: boolean;
}

const payerColors: Record<string, string> = {
  venue: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  guest: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  company: "bg-amber-500/20 text-amber-400 border-amber-500/50",
  driver: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
  renter: "bg-pink-500/20 text-pink-400 border-pink-500/50",
};

export function PricingContractsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [catalogItems, setCatalogItems] = useState<PricingCatalogItem[]>([]);
  const [packages, setPackages] = useState<IndustryPackage[]>([]);
  const [statements, setStatements] = useState<StatementTemplate[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<PricingCatalogItem>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catalogRes, packagesRes, statementsRes] = await Promise.all([
        supabase.from("pricing_catalog").select("*").order("event_code"),
        supabase.from("industry_packages").select("*").order("sort_order"),
        supabase.from("statement_templates").select("*"),
      ]);

      if (catalogRes.error) throw catalogRes.error;
      if (packagesRes.error) throw packagesRes.error;
      if (statementsRes.error) throw statementsRes.error;

      setCatalogItems(catalogRes.data || []);
      setPackages(packagesRes.data || []);
      setStatements(statementsRes.data || []);
    } catch (error: any) {
      toast.error("Failed to load pricing data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: PricingCatalogItem) => {
    setEditingId(item.id);
    setEditValues({
      unit_price: item.unit_price,
      vendor_cost: item.vendor_cost,
      markup: item.markup,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("pricing_catalog")
        .update({
          unit_price: editValues.unit_price,
          vendor_cost: editValues.vendor_cost,
          markup: editValues.markup,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Pricing updated");
      setEditingId(null);
      setEditValues({});
      loadData();
    } catch (error: any) {
      toast.error("Failed to update pricing");
    } finally {
      setSaving(false);
    }
  };

  const updatePackageFee = async (id: string, field: string, value: number | null) => {
    try {
      const { error } = await supabase
        .from("industry_packages")
        .update({ [field]: value })
        .eq("id", id);

      if (error) throw error;

      toast.success("Package updated");
      loadData();
    } catch (error: any) {
      toast.error("Failed to update package");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pricing & Contracts</h2>
          <p className="text-muted-foreground">
            Canonical source of truth for all pricing. Changes here reflect in statements, contracts, and sales materials.
          </p>
        </div>
      </div>

      {/* Global Definition Card */}
      <Card className="border-cyan-500/30 bg-cyan-500/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <DollarSign className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Scan Event Definition (Global)</h3>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>1 Scan Event = 1 successful authorization</strong> (door entry OR purchase authorization).
                Re-scans/retries do NOT bill twice — enforced via idempotency key per order/session + 60-second grace window.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="catalog" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Catalog
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Packages
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contracts
          </TabsTrigger>
          <TabsTrigger value="statements" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Statements
          </TabsTrigger>
        </TabsList>

        {/* Pricing Catalog */}
        <TabsContent value="catalog" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Atomic Billable Events</CardTitle>
              <CardDescription>
                Every billable event with payer, unit price, vendor cost, and markup. Edit inline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Payer</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Vendor Cost</TableHead>
                    <TableHead className="text-right">Markup</TableHead>
                    <TableHead>Cadence</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catalogItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">{item.event_code}</TableCell>
                      <TableCell className="font-medium">{item.event_name}</TableCell>
                      <TableCell>
                        <Badge className={payerColors[item.payer] || "bg-muted"}>
                          {item.payer}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === item.id ? (
                          <Input
                            type="number"
                            step="0.01"
                            className="w-20 h-8 text-right"
                            value={editValues.unit_price ?? ""}
                            onChange={(e) => setEditValues({ ...editValues, unit_price: parseFloat(e.target.value) || 0 })}
                          />
                        ) : (
                          <span className="text-emerald-400 font-semibold">${item.unit_price.toFixed(2)}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === item.id ? (
                          <Input
                            type="number"
                            step="0.01"
                            className="w-20 h-8 text-right"
                            value={editValues.vendor_cost ?? ""}
                            onChange={(e) => setEditValues({ ...editValues, vendor_cost: parseFloat(e.target.value) || null })}
                          />
                        ) : (
                          <span className="text-muted-foreground">
                            {item.vendor_cost != null ? `$${item.vendor_cost.toFixed(2)}` : "—"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === item.id ? (
                          <Input
                            type="number"
                            step="0.01"
                            className="w-20 h-8 text-right"
                            value={editValues.markup ?? ""}
                            onChange={(e) => setEditValues({ ...editValues, markup: parseFloat(e.target.value) || null })}
                          />
                        ) : (
                          <span className="text-cyan-400">
                            {item.markup != null ? `$${item.markup.toFixed(2)}` : "—"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">{item.billing_cadence}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === item.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button size="sm" variant="ghost" onClick={() => saveEdit(item.id)} disabled={saving}>
                              <Check className="h-4 w-4 text-emerald-400" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEdit}>
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => startEdit(item)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Industry Packages */}
        <TabsContent value="packages" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="border-border/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{pkg.display_name}</CardTitle>
                      <Badge variant="outline">{pkg.package_key}</Badge>
                      {pkg.is_active && <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>}
                    </div>
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                  <p className="text-xs text-muted-foreground">Target: {pkg.target_audience}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-xs">SaaS Monthly Fee</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-muted-foreground">$</span>
                        <Input
                          type="number"
                          className="h-8"
                          placeholder="TBD"
                          value={pkg.saas_monthly_fee ?? ""}
                          onChange={(e) => updatePackageFee(pkg.id, "saas_monthly_fee", e.target.value ? parseFloat(e.target.value) : null)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">SaaS Annual Fee</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-muted-foreground">$</span>
                        <Input
                          type="number"
                          className="h-8"
                          placeholder="TBD"
                          value={pkg.saas_annual_fee ?? ""}
                          onChange={(e) => updatePackageFee(pkg.id, "saas_annual_fee", e.target.value ? parseFloat(e.target.value) : null)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Payout Cadence Default</Label>
                      <p className="text-sm font-medium mt-1">{pkg.payout_cadence_default}</p>
                    </div>
                    <div>
                      <Label className="text-xs">Cadence Options</Label>
                      <p className="text-sm text-muted-foreground mt-1">{pkg.payout_cadence_options?.join(", ")}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Included Events</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pkg.included_events?.map((code) => (
                        <Badge key={code} variant="outline" className="font-mono text-xs">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {pkg.volume_tiers && Array.isArray(pkg.volume_tiers) && pkg.volume_tiers.length > 0 && (
                    <div>
                      <Label className="text-xs">Volume Tiers</Label>
                      {(() => {
                        const tiers = pkg.volume_tiers as any[];
                        const hasPerScanFee = tiers.some((t) => typeof t?.per_scan_fee === "number");
                        const hasSaasMonthly = tiers.some((t) => t?.saas_monthly != null);

                        if (hasPerScanFee) {
                          return (
                            <Table className="mt-2">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Tier</TableHead>
                                  <TableHead>Volume Range</TableHead>
                                  <TableHead className="text-right">Per-Scan Fee</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {tiers.map((tier: any, idx: number) => {
                                  const fee = tier?.per_scan_fee;
                                  return (
                                    <TableRow key={tier?.tier ?? idx}>
                                      <TableCell className="font-medium">Tier {tier?.tier ?? "—"}</TableCell>
                                      <TableCell>{tier?.label ?? "—"}</TableCell>
                                      <TableCell className="text-right text-emerald-400 font-semibold">
                                        {typeof fee === "number" ? `$${fee.toFixed(2)}` : "—"}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          );
                        }

                        if (hasSaasMonthly) {
                          return (
                            <Table className="mt-2">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Tier</TableHead>
                                  <TableHead>Driver Range</TableHead>
                                  <TableHead className="text-right">SaaS Monthly</TableHead>
                                  <TableHead className="text-right">Included Checks</TableHead>
                                  <TableHead className="text-right">Overage Rate</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {tiers.map((tier: any, idx: number) => {
                                  const min = tier?.min_drivers;
                                  const max = tier?.max_drivers;
                                  const driverRange =
                                    min != null || max != null
                                      ? `${min ?? "—"}–${max ?? "∞"}`
                                      : tier?.label ?? "—";
                                  const saasMonthly = tier?.saas_monthly;
                                  const includedChecks = tier?.included_checks;
                                  const overageRate = tier?.overage_rate;

                                  return (
                                    <TableRow key={tier?.tier ?? idx}>
                                      <TableCell className="font-medium">{tier?.tier ?? "—"}</TableCell>
                                      <TableCell>{driverRange}</TableCell>
                                      <TableCell className="text-right">
                                        {typeof saasMonthly === "number" ? `$${saasMonthly.toLocaleString()}` : "—"}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {typeof includedChecks === "number" ? includedChecks : "—"}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {typeof overageRate === "number" ? `$${overageRate.toFixed(2)}` : "—"}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          );
                        }

                        return (
                          <pre className="mt-2 rounded-md border border-border bg-muted/30 p-3 text-xs overflow-auto">
                            {JSON.stringify(tiers, null, 2)}
                          </pre>
                        );
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contract Templates */}
        <TabsContent value="contracts" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Templates</CardTitle>
              <CardDescription>
                Generate contracts from package + customer details. Templates coming soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Contract template editor coming soon.</p>
                <p className="text-sm">Will generate PDFs from industry packages + customer info.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statement Templates */}
        <TabsContent value="statements" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Statement Templates</CardTitle>
              <CardDescription>
                Line items per industry for venue/fleet statements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {statements.map((stmt) => {
                const pkg = packages.find((p) => p.id === stmt.package_id);
                return (
                  <div key={stmt.id} className="p-4 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{stmt.template_name}</h4>
                      <Badge variant="outline">{pkg?.display_name || "Unknown Package"}</Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Line Items:</Label>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(stmt.line_item_config) &&
                          (stmt.line_item_config as any[]).map((item: any, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {item.label}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
