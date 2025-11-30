import { UseFormSetValue, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface PersonalInfoSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  genderIdentity: string;
  sexualOrientation: string;
  profileImageUrl: string;
  uploadingImage: boolean;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PersonalInfoSection = ({
  register,
  setValue,
  genderIdentity,
  sexualOrientation,
  profileImageUrl,
  uploadingImage,
  handleImageUpload,
}: PersonalInfoSectionProps) => {
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - 18 - i).toString());

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold border-b pb-2">Personal Information & Locations</h3>
      
      <div className="space-y-2">
        <Label className="text-base">Profile Photo *</Label>
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profileImageUrl} />
            <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
          </Avatar>
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="max-w-xs"
            />
            {uploadingImage && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input id="full_name" {...register("full_name")} required placeholder="Sample Donor" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input id="email" type="email" {...register("email")} required placeholder="donor@cleancheck.com" disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="where_from">🏠 Where You From</Label>
          <Input id="where_from" {...register("where_from")} placeholder="Los Angeles, CA" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current_home_city">🌍 Current Home City</Label>
          <Input id="current_home_city" {...register("current_home_city")} placeholder="Miami, FL" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>🎂 Birthday *</Label>
        <div className="grid grid-cols-3 gap-2">
          <Select onValueChange={(value) => setValue("birthday_day", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {days.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setValue("birthday_month", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, idx) => <SelectItem key={month} value={month}>{monthNames[idx]}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setValue("birthday_year", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>I Identify As *</Label>
        <div className="flex gap-2">
          {["Male", "Female", "Transgender"].map((gender) => (
            <Button
              key={gender}
              type="button"
              variant={genderIdentity === gender ? "default" : "outline"}
              onClick={() => setValue("gender_identity", gender)}
            >
              {gender}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Sexual Orientation *</Label>
        <div className="flex flex-wrap gap-2">
          {["Gay", "Bi", "Straight", "Pansexual", "Asexual"].map((orientation) => (
            <Button
              key={orientation}
              type="button"
              variant={sexualOrientation === orientation ? "default" : "outline"}
              onClick={() => setValue("sexual_orientation", orientation)}
            >
              {orientation}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="relationship_status">Relationship Status *</Label>
        <Select onValueChange={(value) => setValue("relationship_status", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Single">Single</SelectItem>
            <SelectItem value="In a Relationship">In a Relationship</SelectItem>
            <SelectItem value="Married">Married</SelectItem>
            <SelectItem value="Open Relationship">Open Relationship</SelectItem>
            <SelectItem value="It's Complicated">It's Complicated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
