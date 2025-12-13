// Dynamic 'Live Operations' Card - Context-aware based on Vendor_Type
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, Users, Truck, Building, Shield, Heart, Car } from "lucide-react";
import { getIndustryConfig, IndustryType } from "@/config/industryConfig";

interface LiveOperationsCardProps {
  industryType: string;
  primaryValue: number;
  secondaryValue: number | string;
  tertiaryValue: number | string;
  isLive?: boolean;
}

const getIndustryIcon = (type: string) => {
  switch (type) {
    case 'Transportation': return Truck;
    case 'Workforce': return Building;
    case 'Security': return Shield;
    case 'Medical': return Heart;
    case 'Rentals': return Car;
    default: return Users;
  }
};

const LiveOperationsCard = ({
  industryType,
  primaryValue,
  secondaryValue,
  tertiaryValue,
  isLive = false
}: LiveOperationsCardProps) => {
  const config = getIndustryConfig(industryType);
  const IndustryIcon = getIndustryIcon(industryType);

  return (
    <Card className="bg-slate-900 border-slate-700 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IndustryIcon className="w-5 h-5 text-cyan-400" />
            <CardTitle className="text-white">Live Operations</CardTitle>
          </div>
          {isLive && (
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              LIVE
            </Badge>
          )}
        </div>
        <CardDescription className="text-slate-400">
          {industryType} Dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Primary Metric */}
          <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">{config.primaryMetric}</p>
            <p className="text-3xl font-mono text-cyan-400 font-bold">
              {typeof primaryValue === 'number' ? primaryValue.toLocaleString() : primaryValue}
            </p>
            <div className="flex items-center justify-center gap-1 mt-1 text-green-400">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">Active</span>
            </div>
          </div>

          {/* Secondary Metric */}
          <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">{config.secondaryMetric}</p>
            <p className="text-3xl font-mono text-green-400 font-bold">
              {typeof secondaryValue === 'number' 
                ? (industryType === 'Workforce' ? `${secondaryValue}%` : `$${secondaryValue.toLocaleString()}`)
                : secondaryValue}
            </p>
            <div className="flex items-center justify-center gap-1 mt-1 text-slate-400">
              <Activity className="w-3 h-3" />
              <span className="text-xs">Tracked</span>
            </div>
          </div>

          {/* Tertiary Metric */}
          <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">{config.tertiaryMetric}</p>
            <p className="text-3xl font-mono text-purple-400 font-bold">
              {typeof tertiaryValue === 'number' ? tertiaryValue.toLocaleString() : tertiaryValue}
            </p>
            <div className="flex items-center justify-center gap-1 mt-1 text-slate-400">
              <Activity className="w-3 h-3" />
              <span className="text-xs">Status</span>
            </div>
          </div>
        </div>

        {/* Assignment Unit Info */}
        <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-500 text-center">
            Assignment Unit: <span className="text-cyan-400 font-medium">{config.assignmentUnit}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveOperationsCard;
