import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Calculator, DollarSign, Shield, TrendingUp } from "lucide-react";

const ROICalculator = () => {
  const [monthlyPatrons, setMonthlyPatrons] = useState([500]);
  const [avgIncidentCost, setAvgIncidentCost] = useState([25000]);
  const [incidentReduction, setIncidentReduction] = useState([75]);

  const patronCount = monthlyPatrons[0];
  const incidentCost = avgIncidentCost[0];
  const reduction = incidentReduction[0];

  // Calculations
  const baselineIncidentRate = 0.02; // 2% of patrons involved in incidents annually
  const annualIncidents = Math.round(patronCount * 12 * baselineIncidentRate);
  const incidentsAvoided = Math.round(annualIncidents * (reduction / 100));
  const liabilitySaved = incidentsAvoided * incidentCost;
  
  // VALID subscription cost (assuming mid-tier at $499/mo)
  const annualCost = 499 * 12;
  const netSavings = liabilitySaved - annualCost;
  const roi = annualCost > 0 ? Math.round((netSavings / annualCost) * 100) : 0;

  // Revenue from verified entry (optional upsell)
  const verifiedEntryRate = 0.15; // 15% opt for premium verified entry
  const verifiedEntryFee = 5;
  const additionalRevenue = Math.round(patronCount * 12 * verifiedEntryRate * verifiedEntryFee);

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-amber-500/30 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-400">
          <Calculator className="h-6 w-6" />
          ROI Calculator
        </CardTitle>
        <p className="text-sm text-slate-400">See your potential savings with VALID</p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Sliders */}
        <div className="space-y-6">
          {/* Monthly Patrons */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">Monthly Patrons</label>
              <span className="text-sm font-bold text-white">{patronCount.toLocaleString()}</span>
            </div>
            <Slider
              value={monthlyPatrons}
              onValueChange={setMonthlyPatrons}
              min={100}
              max={10000}
              step={100}
              className="[&_[role=slider]]:bg-amber-400"
            />
          </div>

          {/* Average Incident Cost */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">Avg. Liability Incident Cost</label>
              <span className="text-sm font-bold text-white">${incidentCost.toLocaleString()}</span>
            </div>
            <Slider
              value={avgIncidentCost}
              onValueChange={setAvgIncidentCost}
              min={5000}
              max={100000}
              step={5000}
              className="[&_[role=slider]]:bg-amber-400"
            />
          </div>

          {/* Incident Reduction */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">Estimated Incident Reduction</label>
              <span className="text-sm font-bold text-white">{reduction}%</span>
            </div>
            <Slider
              value={incidentReduction}
              onValueChange={setIncidentReduction}
              min={25}
              max={90}
              step={5}
              className="[&_[role=slider]]:bg-amber-400"
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
          <div className="bg-slate-950/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Shield className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">Liability Saved</span>
            </div>
            <p className="text-2xl font-bold text-white">${liabilitySaved.toLocaleString()}</p>
            <p className="text-xs text-slate-500">{incidentsAvoided} incidents avoided/year</p>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sky-400 mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">Net Savings</span>
            </div>
            <p className="text-2xl font-bold text-white">${netSavings.toLocaleString()}</p>
            <p className="text-xs text-slate-500">After VALID subscription</p>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-violet-400 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">ROI</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{roi}%</p>
            <p className="text-xs text-slate-500">Return on investment</p>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">Bonus Revenue</span>
            </div>
            <p className="text-2xl font-bold text-white">${additionalRevenue.toLocaleString()}</p>
            <p className="text-xs text-slate-500">From verified entry fees</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center">
          * Estimates based on industry averages. Actual results may vary.
        </p>
      </CardContent>
    </Card>
  );
};

export default ROICalculator;
