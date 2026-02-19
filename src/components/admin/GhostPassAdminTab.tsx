import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Activity, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GhostPassAdminPanel from './GhostPassAdminPanel';
import SCUMonitor from './SCUMonitor';
import { sensoryMonitorApi } from '@/services/sensoryMonitorApi';

export const GhostPassAdminTab = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalScans: 0,
    activePasses: 0,
    revenue30d: 0,
    expiredPasses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const sensoryStats = await sensoryMonitorApi.getStats();
      setStats({
        totalScans: sensoryStats.total_signals || 0,
        activePasses: sensoryStats.by_status?.approved || 0,
        revenue30d: 0, // TODO: Calculate from transactions
        expiredPasses: sensoryStats.by_status?.rejected || 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-cyan-400" />
          <h2 className="text-3xl font-bold">Ghost Pass Admin</h2>
        </div>
        <p className="text-muted-foreground">
          Manage Ghost Pass system, SCU monitoring, and platform configuration
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="scu-monitor">
            <Shield className="h-4 w-4 mr-2" />
            SCU Monitor
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.totalScans}</div>
                <p className="text-xs text-muted-foreground">QR code scans</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Passes</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.activePasses}</div>
                <p className="text-xs text-muted-foreground">Not yet expired</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue (30d)</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(stats.revenue30d / 100).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expired Passes</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.expiredPasses}</div>
                <p className="text-xs text-muted-foreground">Past expiry date</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Ghost Pass platform health and connectivity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Connection</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Status</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Environment</span>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                    Sandbox
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scu-monitor" className="space-y-4">
          <SCUMonitor onBack={() => {}} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>
                Configure Ghost Pass fees, pricing, and system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GhostPassAdminPanel />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
