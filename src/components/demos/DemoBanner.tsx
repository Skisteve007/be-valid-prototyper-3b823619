import { AlertTriangle } from "lucide-react";

const DemoBanner = () => {
  return (
    <div className="bg-amber-500/20 border border-amber-500/50 text-amber-300 px-4 py-3 text-center text-sm font-medium">
      <AlertTriangle className="inline-block h-4 w-4 mr-2 -mt-0.5" />
      DEMO MODE: Outputs may be simulated or based on synthetic data. No real customer data should be entered.
    </div>
  );
};

export default DemoBanner;
