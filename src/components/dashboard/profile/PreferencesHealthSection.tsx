import { UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Syringe, Sparkles, Cigarette } from "lucide-react";

interface PreferencesHealthSectionProps {
  setValue: UseFormSetValue<any>;
  covidVaccinated: boolean;
  circumcised?: boolean;
  smoker: boolean;
}

export const PreferencesHealthSection = ({
  setValue,
  covidVaccinated,
  circumcised,
  smoker,
}: PreferencesHealthSectionProps) => {

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold border-b pb-2">
        <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Health</span>
      </h3>

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
