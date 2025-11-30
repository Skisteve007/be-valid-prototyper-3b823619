import { UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
      <h3 className="text-lg font-semibold border-b pb-2">Partner Preferences & Health</h3>
      
      <div className="space-y-3">
        <Label>Partner Preferences</Label>
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
        <Label className="cursor-pointer">COVID Vaccination Status</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={circumcised || false}
          onCheckedChange={(checked) => setValue("circumcised", checked as boolean)}
        />
        <Label className="cursor-pointer">Circumcised ✨</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={smoker}
          onCheckedChange={(checked) => setValue("smoker", checked as boolean)}
        />
        <Label className="cursor-pointer">Smoker ✨</Label>
      </div>
    </div>
  );
};
