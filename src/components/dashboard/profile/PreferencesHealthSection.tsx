import { UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Syringe, Sparkles, Cigarette } from "lucide-react";

interface PreferencesHealthSectionProps {
  setValue: UseFormSetValue<any>;
  partnerPreferences: string[];
  covidVaccinated: boolean;
  circumcised?: boolean;
  smoker: boolean;
}

export const PreferencesHealthSection = ({
  setValue,
  partnerPreferences,
  covidVaccinated,
  circumcised,
  smoker,
}: PreferencesHealthSectionProps) => {
  const togglePartnerPreference = (preference: string) => {
    const current = partnerPreferences || [];
    const updated = current.includes(preference)
      ? current.filter(p => p !== preference)
      : [...current, preference];
    setValue("partner_preferences", updated);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold border-b pb-2 bg-gradient-to-r from-blue-600 via-primary to-pink-600 bg-clip-text text-transparent">Partner Preferences & Health</h3>
      
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          Partner Preferences
        </Label>
        {["Men", "Women", "Couples", "Groups"].map((pref) => (
          <div key={pref} className="flex items-center space-x-2">
            <Checkbox
              checked={partnerPreferences?.includes(pref)}
              onCheckedChange={() => togglePartnerPreference(pref)}
            />
            <Label className="cursor-pointer">{pref}</Label>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={covidVaccinated}
          onCheckedChange={(checked) => setValue("covid_vaccinated", checked as boolean)}
        />
        <Label className="cursor-pointer flex items-center gap-2">
          <Syringe className="w-4 h-4 text-blue-500" />
          COVID Vaccination Status
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={circumcised || false}
          onCheckedChange={(checked) => setValue("circumcised", checked as boolean)}
        />
        <Label className="cursor-pointer flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          Circumcised
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={smoker}
          onCheckedChange={(checked) => setValue("smoker", checked as boolean)}
        />
        <Label className="cursor-pointer flex items-center gap-2">
          <Cigarette className="w-4 h-4 text-orange-500" />
          Smoker
        </Label>
      </div>
    </div>
  );
};
