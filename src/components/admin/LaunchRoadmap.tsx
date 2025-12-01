import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Circle, ExternalLink, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChecklistItem {
  id: string;
  day_number: number;
  task_name: string;
  status: boolean;
  template_id_ref: string | null;
}

interface LaunchRoadmapProps {
  onNavigateToTemplate: (templateId: string) => void;
}

export function LaunchRoadmap({ onNavigateToTemplate }: LaunchRoadmapProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChecklist();
  }, []);

  const fetchChecklist = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_strategy_checklist")
        .select("*")
        .order("day_number", { ascending: true });

      if (error) throw error;
      setChecklist(data || []);
    } catch (error: any) {
      toast.error("Failed to load launch roadmap");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("admin_strategy_checklist")
        .update({ status: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setChecklist((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: !currentStatus } : item))
      );

      toast.success(!currentStatus ? "Task completed! 🎉" : "Task marked incomplete");
    } catch (error: any) {
      toast.error("Failed to update task status");
      console.error(error);
    }
  };

  const getWeekLabel = (dayNumber: number) => {
    if (dayNumber <= 7) return "WEEK 1: THE IGNITION";
    return "WEEK 2: THE PRESSURE";
  };

  const completedCount = checklist.filter((item) => item.status).length;
  const progressPercent = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;

  if (loading) {
    return <div className="p-4">Loading roadmap...</div>;
  }

  let currentWeek = "";

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-pink-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              🚀 The 2-Week Sprint
            </CardTitle>
            <CardDescription className="mt-2 text-base">
              Launch Roadmap: Stay accountable with this 14-day execution plan
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {completedCount}/{checklist.length}
            </div>
            <div className="text-sm text-muted-foreground">Tasks Complete</div>
            <div className="mt-2">
              <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-1">
          {checklist.map((item) => {
            const weekLabel = getWeekLabel(item.day_number);
            const showWeekHeader = weekLabel !== currentWeek;
            currentWeek = weekLabel;

            return (
              <div key={item.id}>
                {showWeekHeader && (
                  <div className="mt-6 mb-3 first:mt-0">
                    <Badge className="bg-gradient-to-r from-blue-600 to-pink-600 text-white px-4 py-1">
                      {weekLabel}
                    </Badge>
                  </div>
                )}

                <div
                  className={`flex items-start gap-3 p-3 rounded-lg transition-all hover:bg-muted/50 ${
                    item.status ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      id={item.id}
                      checked={item.status}
                      onCheckedChange={() => toggleTaskStatus(item.id, item.status)}
                      className="mt-0.5"
                    />
                    
                    <div className="flex items-center gap-2 min-w-[60px]">
                      {item.status ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="font-semibold text-sm">Day {item.day_number}</span>
                    </div>

                    <label
                      htmlFor={item.id}
                      className={`flex-1 text-sm cursor-pointer ${
                        item.status ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {item.task_name}
                    </label>
                  </div>

                  {item.template_id_ref && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onNavigateToTemplate(item.template_id_ref!)}
                      className="gap-2 flex-shrink-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Go to Template
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
