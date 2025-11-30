import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Users, 
  UserPlus, 
  Heart, 
  Sparkles,
  Activity,
  Eye,
  Hand,
  Music,
  Flame,
  Shield,
  Zap,
  Star,
  User,
  UsersRound,
  UserCheck,
  LucideIcon
} from "lucide-react";

interface InterestTag {
  id: string;
  category: string;
  label: string;
}

interface InterestsSelectorProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
}

export const InterestsSelector = ({
  selectedInterests,
  onInterestsChange,
}: InterestsSelectorProps) => {
  const [tags, setTags] = useState<InterestTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from("interest_tags")
        .select("*")
        .order("category", { ascending: true })
        .order("label", { ascending: true });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Failed to load interest tags");
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (tagId: string) => {
    const isSelected = selectedInterests.includes(tagId);
    const updated = isSelected
      ? selectedInterests.filter((id) => id !== tagId)
      : [...selectedInterests, tagId];
    onInterestsChange(updated);
  };

  const isSelected = (tagId: string) => selectedInterests.includes(tagId);

  // Map tag labels to icons
  const getIconForTag = (label: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      // Social Dynamic
      "Couples": Heart,
      "Singles": User,
      "Groups": UsersRound,
      "One-on-One": UserCheck,
      "Observing": Eye,
      "Throuple": Users,
      "Full Swap": Sparkles,
      "Soft Swap": Star,
      
      // Sensory Preferences
      "Visual": Eye,
      "Touch": Hand,
      "Auditory": Music,
      
      // Specific Activities
      "Bondage": Shield,
      "Role Play": Activity,
      "Sensory Play": Zap,
      "Impact Play": Flame,
    };
    
    return iconMap[label] || Activity; // Default icon
  };

  // Group tags by category
  const groupedTags = tags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, InterestTag[]>);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading interests...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold border-b pb-2">User Preferences</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Select your interests and preferences
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedTags).map(([category, categoryTags]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-base font-medium">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {categoryTags.map((tag) => {
                const IconComponent = getIconForTag(tag.label);
                return (
                  <Badge
                    key={tag.id}
                    variant={isSelected(tag.id) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-primary/80 flex items-center gap-2"
                    onClick={() => toggleInterest(tag.id)}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tag.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};