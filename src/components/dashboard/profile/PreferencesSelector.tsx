import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Heart,
  Sparkles,
  Lock,
  Users,
  UserPlus,
  Hand,
  Grip,
  Drama,
  Shirt,
  Eye,
  CheckCircle,
  UsersRound,
  User,
  Zap,
  LucideIcon,
  Palette,
  Flame,
  Bike,
  Ship,
  ChefHat,
  ShoppingBag,
  Plane,
  Dumbbell
} from "lucide-react";

interface PreferenceCategory {
  id: string;
  title: string;
  items: string[];
}

interface PreferencesSelectorProps {
  selectedPreferences: Record<string, string[]>;
  onPreferencesChange: (preferences: Record<string, string[]>) => void;
}

const PREFERENCE_CATEGORIES: PreferenceCategory[] = [
  {
    id: "social_dynamic",
    title: "Social Dynamic",
    items: ["Couples", "Singles", "Groups", "One-on-One", "Observing", "Full Swap", "Soft Swap"],
  },
  {
    id: "relationship_styles",
    title: "Relationship Style",
    items: ["Casual", "Serious", "Open", "Throuple", "Couple"],
  },
  {
    id: "sensory_preferences",
    title: "Sensory Preferences",
    items: ["Light Touch", "Firm Touch", "Roleplay", "Costumes", "Blindfolds", "All"],
  },
  {
    id: "specific_activities",
    title: "Specific Activities",
    items: ["Group Activities", "Threesomes", "Multiple Men Only", "Multiple Women Only", "Experimental"],
  },
];

const HOBBY_INTERESTS = [
  { id: "motorcycle", label: "Motorcycle Riding", Icon: Bike, color: "text-red-500" },
  { id: "boating", label: "Boating", Icon: Ship, color: "text-blue-500" },
  { id: "cooking", label: "Cooking", Icon: ChefHat, color: "text-orange-500" },
  { id: "shopping", label: "Shopping", Icon: ShoppingBag, color: "text-pink-500" },
  { id: "travel", label: "Travel", Icon: Plane, color: "text-teal-500" },
  { id: "exercise", label: "Exercise", Icon: Dumbbell, color: "text-green-500" },
];

const getCategoryIcon = (categoryId: string): { Icon: LucideIcon; color: string } => {
  const iconMap: Record<string, { Icon: LucideIcon; color: string }> = {
    social_dynamic: { Icon: Users, color: "text-teal-500" },
    relationship_styles: { Icon: Heart, color: "text-pink-500" },
    sensory_preferences: { Icon: Palette, color: "text-purple-500" },
    specific_activities: { Icon: Flame, color: "text-orange-500" },
  };
  return iconMap[categoryId] || { Icon: Sparkles, color: "text-primary" };
};

export const PreferencesSelector = ({
  selectedPreferences,
  onPreferencesChange,
}: PreferencesSelectorProps) => {
  const togglePreference = (categoryId: string, item: string) => {
    const currentCategoryPreferences = selectedPreferences[categoryId] || [];
    const isSelected = currentCategoryPreferences.includes(item);

    const updatedCategoryPreferences = isSelected
      ? currentCategoryPreferences.filter((i) => i !== item)
      : [...currentCategoryPreferences, item];

    onPreferencesChange({
      ...selectedPreferences,
      [categoryId]: updatedCategoryPreferences,
    });
  };

  const isSelected = (categoryId: string, item: string) => {
    return selectedPreferences[categoryId]?.includes(item) || false;
  };

  // Map preference items to icons
  const getIconForPreference = (item: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      // Social Dynamic
      "Couples": Heart,
      "Singles": User,
      "Groups": UsersRound,
      "One-on-One": UserPlus,
      "Observing": Eye,
      "Full Swap": Sparkles,
      "Soft Swap": Zap,
      
      // Relationship Style
      "Casual": Sparkles,
      "Serious": Heart,
      "Open": Lock,
      "Throuple": Users,
      "Couple": UserPlus,
      
      // Sensory Preferences
      "Light Touch": Hand,
      "Firm Touch": Grip,
      "Roleplay": Drama,
      "Costumes": Shirt,
      "Blindfolds": Eye,
      "All": CheckCircle,
      
      // Specific Activities
      "Group Activities": UsersRound,
      "Threesomes": Users,
      "Multiple Men Only": User,
      "Multiple Women Only": User,
      "Experimental": Zap,
    };
    
    return iconMap[item] || Sparkles; // Default icon
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold border-b pb-2">
          <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">User Interests & Preferences</span>
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Select your interests and preferences across different categories
        </p>
      </div>

      {/* Hobby Interests - Icon Only */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          Hobby Interests
        </Label>
        <div className="flex flex-wrap gap-3">
          {HOBBY_INTERESTS.map((hobby) => {
            const selected = isSelected("hobby_interests", hobby.id);
            return (
              <button
                key={hobby.id}
                type="button"
                onClick={() => togglePreference("hobby_interests", hobby.id)}
                className={`p-3 rounded-full border-2 transition-all duration-200 ${
                  selected
                    ? "border-primary bg-primary/20 shadow-lg shadow-primary/30 scale-110"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
                title={hobby.label}
              >
                <hobby.Icon className={`w-6 h-6 ${selected ? "text-primary" : hobby.color}`} />
              </button>
            );
          })}
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        {PREFERENCE_CATEGORIES.map((category) => {
          const { Icon, color } = getCategoryIcon(category.id);
          return (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center gap-2 flex-1">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="flex-1">{category.title}</span>
                  {selectedPreferences[category.id]?.length > 0 && (
                    <Badge variant="secondary" className="mr-2">
                      {selectedPreferences[category.id].length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-2">
                  {category.items.map((item) => {
                    const IconComponent = getIconForPreference(item);
                    return (
                      <Badge
                        key={item}
                        variant={isSelected(category.id, item) ? "default" : "outline"}
                        className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-primary/80 flex items-center gap-2"
                        onClick={() => togglePreference(category.id, item)}
                      >
                        <IconComponent className="w-4 h-4" />
                        {item}
                      </Badge>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
