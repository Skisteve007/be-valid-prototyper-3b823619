import { UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Syringe, Sparkles, Cigarette, Lock, Unlock } from "lucide-react";
import { VibeCheckStatus } from "./VibeCheckStatus";

interface PreferencesHealthSectionProps {
  setValue: UseFormSetValue<any>;
  covidVaccinated: boolean;
  circumcised?: boolean;
  smoker: boolean;
  sharingEnabled?: boolean;
  onToggleSharing?: (enabled: boolean) => void;
  bootyEnhanced?: boolean;
  breastsEnhanced?: boolean;
  lovesEnhancements?: boolean;
}

export const PreferencesHealthSection = ({
  setValue,
  covidVaccinated,
  circumcised,
  smoker,
  sharingEnabled = false,
  onToggleSharing,
  bootyEnhanced = false,
  breastsEnhanced = false,
  lovesEnhancements = false,
}: PreferencesHealthSectionProps) => {

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">LIFESTYLE & VIBE</span>
          <Lock className="w-5 h-5 text-amber-500" />
        </h3>
        {onToggleSharing && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onToggleSharing(!sharingEnabled)}
            className="h-auto py-1 px-2"
            title={sharingEnabled ? "Click to hide from peers" : "Click to share with peers"}
          >
            {sharingEnabled ? (
              <Unlock className="w-4 h-4 text-green-500" />
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>

      <VibeCheckStatus
        setValue={setValue}
        bootyEnhanced={bootyEnhanced}
        breastsEnhanced={breastsEnhanced}
        lovesEnhancements={lovesEnhancements}
      />

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={covidVaccinated}
          onCheckedChange={(checked) => setValue("covid_vaccinated", checked as boolean)}
        />
        <Label className="cursor-pointer flex items-center gap-2">
          <Syringe className="w-4 h-4 text-blue-500" />
          COVID Vaccinated (check if yes)
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={circumcised || false}
          onCheckedChange={(checked) => setValue("circumcised", checked as boolean)}
        />
        <Label className="cursor-pointer flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          Circumcised (check if yes)
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={smoker}
          onCheckedChange={(checked) => setValue("smoker", checked as boolean)}
        />
        <Label className="cursor-pointer flex items-center gap-2">
          <Cigarette className="w-4 h-4 text-orange-500" />
          Smoker (check if yes)
        </Label>
      </div>
    </div>
  );
};
