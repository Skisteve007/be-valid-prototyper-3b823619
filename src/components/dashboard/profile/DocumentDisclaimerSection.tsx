import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface DocumentDisclaimerSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  disclaimerAccepted: boolean;
}

export const DocumentDisclaimerSection = ({
  register,
  setValue,
  disclaimerAccepted,
}: DocumentDisclaimerSectionProps) => {
  return (
    <>
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">STD Acknowledgment</h3>
        <div className="space-y-2">
          <Label htmlFor="std_acknowledgment">STD Status & Information</Label>
          <Textarea
            id="std_acknowledgment"
            {...register("std_acknowledgment")}
            rows={4}
            placeholder="Please provide any relevant health information..."
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">References</h3>
        <div className="space-y-2">
          <Label htmlFor="user_references">Reference Information</Label>
          <Textarea
            id="user_references"
            {...register("user_references")}
            rows={4}
            placeholder="Add reference contacts or information..."
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Sexual Preferences</h3>
        <div className="space-y-2">
          <Label htmlFor="sexual_preferences">Your Preferences</Label>
          <Textarea
            id="sexual_preferences"
            {...register("sexual_preferences")}
            rows={4}
            placeholder="Describe your preferences..."
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Disclaimer</h3>
        
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <p className="text-sm">
            By checking this box, I certify that all information provided is accurate and I understand that 
            Clean Check is a platform for sharing health information. I take full responsibility for the 
            accuracy of my information and understand the importance of maintaining up-to-date health records.
          </p>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={disclaimerAccepted}
              onCheckedChange={(checked) => setValue("disclaimer_accepted", checked as boolean)}
              required
            />
            <Label className="cursor-pointer">I accept the disclaimer and certify all information is accurate *</Label>
          </div>
        </div>
      </div>
    </>
  );
};
