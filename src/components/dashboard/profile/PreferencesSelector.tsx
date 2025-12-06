import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Unlock,
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
} from "lucide-react";

interface PreferenceCategory {
  id: string;
  title: string;
  items: string[];
}

interface CategorySharingState {
  social_dynamic: boolean;
  relationship_styles: boolean;
  sensory_preferences: boolean;
  specific_activities: boolean;
}

interface PreferencesSelectorProps {
  selectedPreferences: Record<string, string[]>;
  onPreferencesChange: (preferences: Record<string, string[]>) => void;
  categorySharingState: CategorySharingState;
  onToggleCategorySharing: (categoryId: keyof CategorySharingState, enabled: boolean) => void;
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
  { id: "motorcycle", label: "Motorcycle Riding", emoji: "🏍️" },
  { id: "boating", label: "Boating", emoji: "🚤" },
  { id: "cooking", label: "Cooking", emoji: "👨‍🍳" },
  { id: "shopping", label: "Shopping", emoji: "🛍️" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "exercise", label: "Exercise", emoji: "💪" },
  { id: "car_enthusiast", label: "Car Enthusiast", emoji: "🏎️" },
  { id: "beach", label: "Beach Time", emoji: "🏖️" },
  { id: "music", label: "Music Lover", emoji: "🎵" },
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
  categorySharingState,
  onToggleCategorySharing,
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
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-semibold">
            <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">User Interests & Preferences</span>
          </h3>
        </div>
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
                className={`p-4 rounded-full border-2 transition-all duration-200 touch-manipulation active:scale-95 ${
                  selected
                    ? "border-primary bg-primary/20 shadow-lg shadow-primary/30 scale-110"
                    : "border-border active:border-primary/50 active:bg-muted/50"
                }`}
                title={hobby.label}
              >
                <span className="text-3xl">{hobby.emoji}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        {PREFERENCE_CATEGORIES.map((category) => {
          const { Icon, color } = getCategoryIcon(category.id);
          const isShared = categorySharingState[category.id as keyof CategorySharingState];
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCategorySharing(category.id as keyof CategorySharingState, !isShared);
                    }}
                    className="h-auto py-1 px-2 mr-2"
                    title={isShared ? "Click to hide from peers" : "Click to share with peers"}
                  >
                    {isShared ? (
                      <Unlock className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
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
                        className="cursor-pointer px-4 py-2 text-sm transition-colors active:scale-95 active:opacity-80 touch-manipulation flex items-center gap-2"
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
