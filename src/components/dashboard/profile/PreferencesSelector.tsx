import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    id: "relationship_styles",
    title: "Relationship Styles",
    items: ["Casual", "Serious", "Open", "Parallel", "Together"],
  },
  {
    id: "social_dynamic",
    title: "Social Dynamic",
    items: ["Couples", "Singles", "Groups", "One-on-One", "Observing"],
  },
  {
    id: "sensory_preferences",
    title: "Sensory Preferences",
    items: ["Light Touch", "Firm Touch", "Roleplay", "Costumes", "Blindfolds"],
  },
  {
    id: "specific_activities",
    title: "Specific Activities",
    items: ["Group Activities", "Threesomes", "Outdoor", "Indoor", "Experimental"],
  },
];

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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold border-b pb-2">User Interests & Preferences</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Select your interests and preferences across different categories
        </p>
      </div>

      <Accordion type="multiple" className="w-full">
        {PREFERENCE_CATEGORIES.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger className="text-base font-medium">
              {category.title}
              {selectedPreferences[category.id]?.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedPreferences[category.id].length}
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-2">
                {category.items.map((item) => (
                  <Badge
                    key={item}
                    variant={isSelected(category.id, item) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-primary/80"
                    onClick={() => togglePreference(category.id, item)}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
