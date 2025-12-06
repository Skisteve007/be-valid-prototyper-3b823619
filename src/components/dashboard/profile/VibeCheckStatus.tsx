import { UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Heart, Gem } from "lucide-react";

interface VibeCheckStatusProps {
  setValue: UseFormSetValue<any>;
  bootyEnhanced?: boolean;
  breastsEnhanced?: boolean;
  lovesEnhancements?: boolean;
}

export const VibeCheckStatus = ({
  setValue,
  bootyEnhanced = false,
  breastsEnhanced = false,
  lovesEnhancements = false,
}: VibeCheckStatusProps) => {
  return (
    <div className="space-y-4 py-4 border-b border-border/50">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={bootyEnhanced}
          onCheckedChange={(checked) => setValue("booty_enhanced", checked as boolean)}
        />
        <Label className="cursor-pointer flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-500" />
          Booty Enhanced (check if yes)
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={breastsEnhanced}
          onCheckedChange={(checked) => setValue("breasts_enhanced", checked as boolean)}
        />
        <Label className="cursor-pointer flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500" />
          Breasts Enhanced (check if yes)
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={lovesEnhancements}
          onCheckedChange={(checked) => setValue("loves_enhancements", checked as boolean)}
        />
        <Label className="cursor-pointer flex items-center gap-2">
          <Gem className="w-4 h-4 text-purple-500" />
          Love Surgical & Injectable Enhancements? (check if yes)
        </Label>
      </div>
    </div>
  );
};
