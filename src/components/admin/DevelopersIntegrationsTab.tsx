import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  AlertTriangle, 
  Shield, 
  TrendingUp,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { WebhookEventInspector } from "./WebhookEventInspector";
import { ExceptionEngine } from "./ExceptionEngine";
import { SecurityBadging } from "./SecurityBadging";
import { AnalyticsWidget } from "./AnalyticsWidget";

export const DevelopersIntegrationsTab = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    successRate: 0,
    pendingExceptions: 0,
    avgTurnaround: 0
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Load webhook event stats
      const { data: events } = await supabase
        .from("webhook_events")
        .select("response_status");
      
      const successCount = events?.filter(e => e.response_status === 200).length || 0;
      const totalEvents = events?.length || 0;

      // Load exception stats
      const { data: exceptions } = await supabase
        .from("exception_queue")
        .select("status")
        .eq("status", "pending");

      // Load turnaround time
      const { data: orders } = await supabase
        .from("lab_orders")
        .select("created_at, updated_at, order_status")
        .eq("order_status", "result_received")
        .order("created_at", { ascending: false })
        .limit(50);

      let avgTurnaround = 0;
      if (orders && orders.length > 0) {
        const turnarounds = orders.map(o => {
          const created = new Date(o.created_at).getTime();
          const updated = new Date(o.updated_at).getTime();
          return (updated - created) / (1000 * 60 * 60); // hours
        });
        avgTurnaround = turnarounds.reduce((a, b) => a + b, 0) / turnarounds.length;
      }

      setStats({
        totalEvents,
        successRate: totalEvents > 0 ? (successCount / totalEvents) * 100 : 100,
        pendingExceptions: exceptions?.length || 0,
        avgTurnaround
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Code className="h-4 w-4 text-blue-500" />
              Total API Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">All-time webhook calls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {stats.successRate >= 95 ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">200 OK responses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Pending Exceptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingExceptions}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              Avg Turnaround
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTurnaround.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Sample to result</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="webhook-inspector" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="webhook-inspector">
            <Code className="h-4 w-4 mr-2" />
            Webhook Inspector
          </TabsTrigger>
          <TabsTrigger value="exception-engine">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Exception Engine
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security & Standards
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="webhook-inspector" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Webhook Event Inspector
              </CardTitle>
              <CardDescription>
                Live log of every API interaction with detailed payload inspection and replay capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WebhookEventInspector onRefresh={loadDashboardStats} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exception-engine" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Automated Exception Engine
              </CardTitle>
              <CardDescription>
                Intelligent handling of sample issues, inconclusive results, and automated user notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExceptionEngine onRefresh={loadDashboardStats} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityBadging />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Lab Performance Analytics
              </CardTitle>
              <CardDescription>
                Track lab partner efficiency and turnaround times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsWidget />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};