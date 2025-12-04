import { UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Wine, Sparkles, XCircle, ShieldCheck } from "lucide-react";

interface VicesSectionProps {
  setValue: UseFormSetValue<any>;
  vices: string[];
}

export const VicesSection = ({
  setValue,
  vices,
}: VicesSectionProps) => {
  const toggleVice = (vice: string) => {
    const current = vices || [];
    const updated = current.includes(vice)
      ? current.filter(v => v !== vice)
      : [...current, vice];
    setValue("vices", updated);
  };

  const viceRows = [
    [
      { value: "Drinking", icon: Wine, color: "text-purple-500" },
      { value: "Don't drink at all", icon: XCircle, color: "text-red-500" },
    ],
    [
      { value: "Party enhancers", icon: Sparkles, color: "text-pink-500" },
      { value: "No enhancers at all", icon: ShieldCheck, color: "text-green-500" },
    ],
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold border-b pb-2">
        <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Vices</span>
      </h3>
      
      <div className="space-y-1">
        <Label className="flex items-center gap-2 text-sm mb-2">
          Select your preferences
        </Label>
        {viceRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-1">
            {row.map((option) => {
              const IconComponent = option.icon;
              return (
                <div key={option.value} className="flex items-center space-x-1.5 p-1.5 rounded hover:bg-muted/50 transition-colors">
                  <Checkbox
                    checked={vices?.includes(option.value)}
                    onCheckedChange={() => toggleVice(option.value)}
                    className="min-h-[20px] min-w-[20px]"
                  />
                  <Label className="cursor-pointer flex items-center gap-1">
                    <IconComponent className={`w-4 h-4 ${option.color}`} />
                    <span className="text-sm">{option.value}</span>
                  </Label>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};