import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Database, Lock, Key, Server, Eye, AlertTriangle, CheckCircle2 } from "lucide-react";

interface SecurityTask {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  priority: "critical" | "high" | "medium";
}

interface SecurityCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  tasks: SecurityTask[];
}

const initialCategories: SecurityCategory[] = [
  {
    id: "database",
    title: "Database Security",
    icon: <Database className="h-5 w-5" />,
    tasks: [
      { id: "rls-enabled", label: "RLS Enabled on All Tables", description: "Row Level Security policies active", completed: false, priority: "critical" },
      { id: "rls-policies", label: "RLS Policies Reviewed", description: "All policies follow least-privilege principle", completed: false, priority: "critical" },
      { id: "pii-encryption", label: "PII Encryption at Rest", description: "Sensitive data encrypted in database", completed: false, priority: "critical" },
      { id: "backup-enabled", label: "Database Backups Configured", description: "Automated backups with retention policy", completed: false, priority: "high" },
    ],
  },
  {
    id: "authentication",
    title: "Authentication & Access",
    icon: <Lock className="h-5 w-5" />,
    tasks: [
      { id: "auth-flow", label: "Auth Flow Secured", description: "Proper signup/login implementation", completed: false, priority: "critical" },
      { id: "jwt-validation", label: "JWT Validation Active", description: "Edge functions validate tokens", completed: false, priority: "critical" },
      { id: "role-based-access", label: "Role-Based Access Control", description: "Admin/user roles properly separated", completed: false, priority: "high" },
      { id: "session-management", label: "Session Management", description: "Proper token expiry and refresh", completed: false, priority: "high" },
    ],
  },
  {
    id: "api",
    title: "API Security",
    icon: <Server className="h-5 w-5" />,
    tasks: [
      { id: "cors-configured", label: "CORS Properly Configured", description: "Cross-origin requests restricted", completed: false, priority: "high" },
      { id: "rate-limiting", label: "Rate Limiting Implemented", description: "API abuse prevention active", completed: false, priority: "medium" },
      { id: "input-validation", label: "Input Validation", description: "All user inputs sanitized", completed: false, priority: "critical" },
      { id: "error-handling", label: "Secure Error Handling", description: "No sensitive data in error responses", completed: false, priority: "high" },
    ],
  },
  {
    id: "secrets",
    title: "Secrets Management",
    icon: <Key className="h-5 w-5" />,
    tasks: [
      { id: "env-secrets", label: "Secrets in Environment", description: "No hardcoded API keys or credentials", completed: false, priority: "critical" },
      { id: "key-rotation", label: "Key Rotation Policy", description: "Regular rotation of sensitive keys", completed: false, priority: "medium" },
      { id: "access-audit", label: "Secret Access Audit", description: "Logging of secret access patterns", completed: false, priority: "medium" },
    ],
  },
  {
    id: "monitoring",
    title: "Monitoring & Logging",
    icon: <Eye className="h-5 w-5" />,
    tasks: [
      { id: "audit-logs", label: "Audit Logging Active", description: "Security events tracked", completed: false, priority: "high" },
      { id: "error-monitoring", label: "Error Monitoring", description: "Real-time error alerting configured", completed: false, priority: "medium" },
      { id: "access-logs", label: "Access Logs Retained", description: "User access patterns logged", completed: false, priority: "medium" },
    ],
  },
];

const STORAGE_KEY = "security-checklist-state";

export function SecurityChecklist() {
  const [categories, setCategories] = useState<SecurityCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialCategories;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const toggleTask = (categoryId: string, taskId: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              tasks: category.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : category
      )
    );
  };

  const totalTasks = categories.reduce((acc, cat) => acc + cat.tasks.length, 0);
  const completedTasks = categories.reduce(
    (acc, cat) => acc + cat.tasks.filter((t) => t.completed).length,
    0
  );
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const criticalIncomplete = categories.flatMap((c) =>
    c.tasks.filter((t) => t.priority === "critical" && !t.completed)
  );

  const getPriorityBadge = (priority: SecurityTask["priority"]) => {
    const styles = {
      critical: "bg-destructive/20 text-destructive border-destructive/30",
      high: "bg-orange-500/20 text-orange-600 border-orange-500/30",
      medium: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
    };
    return (
      <Badge variant="outline" className={`text-[10px] ${styles[priority]}`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Security Architecture Checklist</CardTitle>
            </div>
            <Badge variant={progressPercent === 100 ? "default" : "secondary"}>
              {completedTasks}/{totalTasks} Complete
            </Badge>
          </div>
          <CardDescription>Track critical security tasks for DevSecOps compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {criticalIncomplete.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                <AlertTriangle className="h-4 w-4" />
                {criticalIncomplete.length} Critical Task{criticalIncomplete.length > 1 ? "s" : ""} Incomplete
              </div>
              <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                {criticalIncomplete.slice(0, 3).map((task) => (
                  <li key={task.id}>• {task.label}</li>
                ))}
                {criticalIncomplete.length > 3 && (
                  <li>...and {criticalIncomplete.length - 3} more</li>
                )}
              </ul>
            </div>
          )}

          {progressPercent === 100 && (
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" />
                All Security Tasks Complete
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => {
          const catCompleted = category.tasks.filter((t) => t.completed).length;
          const catTotal = category.tasks.length;
          const catPercent = Math.round((catCompleted / catTotal) * 100);

          return (
            <Card key={category.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                      {category.icon}
                    </div>
                    <CardTitle className="text-sm font-medium">{category.title}</CardTitle>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {catCompleted}/{catTotal}
                  </span>
                </div>
                <Progress value={catPercent} className="h-1 mt-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                {category.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-2 rounded-md transition-colors ${
                      task.completed ? "bg-muted/50" : "hover:bg-muted/30"
                    }`}
                  >
                    <Checkbox
                      id={task.id}
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(category.id, task.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={task.id}
                        className={`text-sm font-medium cursor-pointer ${
                          task.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {task.label}
                      </label>
                      <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                    </div>
                    {getPriorityBadge(task.priority)}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
