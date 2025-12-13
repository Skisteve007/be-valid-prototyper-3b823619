// Universal Financials Module - Common to all industries
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, Download, FileText, TrendingUp, Calculator, Percent } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { getIndustryConfig } from "@/config/industryConfig";

interface FinancialsModuleProps {
  industryType: string;
  venueName: string;
  grossRevenue: number;
  revenueByCategory: Record<string, number>;
  taxRate: number;
  onTaxRateChange: (rate: number) => void;
  commissionRate?: number;
  processingFeeRate?: number;
}

const FinancialsModule = ({
  industryType,
  venueName,
  grossRevenue,
  revenueByCategory,
  taxRate,
  onTaxRateChange,
  commissionRate = 30,
  processingFeeRate = 2.9
}: FinancialsModuleProps) => {
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const config = getIndustryConfig(industryType);

  const calculateSettlement = () => {
    const tax = grossRevenue * (taxRate / 100);
    const commission = grossRevenue * (commissionRate / 100);
    const fees = grossRevenue * (processingFeeRate / 100);
    const netPayout = grossRevenue - tax - commission - fees;
    
    return { grossRevenue, tax, commission, fees, netPayout };
  };

  const settlement = calculateSettlement();

  const exportSettlementPDF = () => {
    const doc = new jsPDF();
    const now = new Date();
    
    doc.setFontSize(20);
    doc.text("Valid™ Settlement Report", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Venue: ${venueName}`, 20, 35);
    doc.text(`Industry: ${industryType}`, 20, 45);
    doc.text(`Generated: ${now.toLocaleString()}`, 20, 55);
    
    doc.setFontSize(14);
    doc.text("Settlement Breakdown", 20, 75);
    
    doc.setFontSize(12);
    doc.text(`(+) Gross Revenue: $${settlement.grossRevenue.toLocaleString()}`, 30, 90);
    doc.text(`(-) State Tax (${taxRate}%): -$${settlement.tax.toFixed(2)}`, 30, 100);
    doc.text(`(-) Platform Commission (${commissionRate}%): -$${settlement.commission.toFixed(2)}`, 30, 110);
    doc.text(`(-) Processing Fees (${processingFeeRate}%): -$${settlement.fees.toFixed(2)}`, 30, 120);
    
    doc.setFontSize(16);
    doc.text(`NET PAYOUT: $${settlement.netPayout.toFixed(2)}`, 30, 140);
    
    // Revenue by category breakdown
    doc.setFontSize(14);
    doc.text("Revenue by Category", 20, 165);
    
    let yPos = 180;
    config.revenueCategories.forEach(cat => {
      const amount = revenueByCategory[cat.id] || 0;
      doc.setFontSize(12);
      doc.text(`${cat.label}: $${amount.toLocaleString()}`, 30, yPos);
      yPos += 10;
    });
    
    doc.save(`settlement-${venueName}-${now.toISOString().split('T')[0]}.pdf`);
    toast.success("Settlement report exported!");
  };

  return (
    <>
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <CardTitle className="text-white">Financials</CardTitle>
            </div>
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              Universal Engine
            </Badge>
          </div>
          <CardDescription className="text-slate-400">
            Revenue, Tax Engine & Settlement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Revenue */}
          <div className="p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Revenue</p>
                <p className="text-4xl font-mono text-green-400 font-bold">
                  ${grossRevenue.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-400/50" />
            </div>
          </div>

          {/* Revenue Categories */}
          <div className="grid grid-cols-2 gap-3">
            {config.revenueCategories.map(cat => (
              <div 
                key={cat.id} 
                className="p-3 bg-slate-800 rounded-lg border border-slate-700"
              >
                <p className="text-xs text-slate-400 mb-1">{cat.label}</p>
                <p className="text-xl font-mono font-bold" style={{ color: cat.color }}>
                  ${(revenueByCategory[cat.id] || 0).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Tax Engine */}
          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Percent className="w-4 h-4 text-yellow-400" />
              <p className="text-sm font-medium text-white">Tax Engine</p>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="taxRate" className="text-slate-400 whitespace-nowrap">Rate:</Label>
              <Input
                id="taxRate"
                type="number"
                value={taxRate}
                onChange={(e) => onTaxRateChange(Number(e.target.value))}
                className="bg-slate-700 border-slate-600 text-white w-20"
                min={0}
                max={25}
                step={0.1}
              />
              <span className="text-slate-400">%</span>
              <span className="text-sm text-slate-500 ml-auto">
                = ${(grossRevenue * taxRate / 100).toFixed(2)} tax
              </span>
            </div>
          </div>

          {/* 4:01 AM Settlement Button */}
          <Button 
            onClick={() => setShowSettlementModal(true)}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white"
          >
            <Calculator className="w-4 h-4 mr-2" />
            4:01 AM Settlement
          </Button>
        </CardContent>
      </Card>

      {/* Settlement Modal */}
      <Dialog open={showSettlementModal} onOpenChange={setShowSettlementModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Net Payout Calculation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 font-mono text-sm">
            <div className="p-3 bg-slate-800 rounded flex justify-between">
              <span className="text-green-400">(+) Gross Revenue</span>
              <span className="text-white">${settlement.grossRevenue.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-slate-800 rounded flex justify-between">
              <span className="text-red-400">(-) State Tax ({taxRate}%)</span>
              <span className="text-red-400">-${settlement.tax.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-slate-800 rounded flex justify-between">
              <span className="text-orange-400">(-) Platform Commission ({commissionRate}%)</span>
              <span className="text-orange-400">-${settlement.commission.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-slate-800 rounded flex justify-between">
              <span className="text-yellow-400">(-) Processing Fees ({processingFeeRate}%)</span>
              <span className="text-yellow-400">-${settlement.fees.toFixed(2)}</span>
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
    </>
  );
};

export default FinancialsModule;
