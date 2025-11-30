import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, Award, QrCode, UserCheck, Shield, Settings, Home } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import ProfileTab from "@/components/dashboard/ProfileTab";
import CertificationsTab from "@/components/dashboard/CertificationsTab";
import QRCodeTab from "@/components/dashboard/QRCodeTab";
import PendingReferencesTab from "@/components/dashboard/PendingReferencesTab";
import logo from "@/assets/clean-check-logo.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrRefreshKey, setQrRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("profile");
  const { isAdmin } = useIsAdmin();

  // Check if tab parameter is in URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleProfileUpdate = () => {
    // Increment the key to force QR Code tab to refresh
    console.log("Dashboard: Refreshing QR code tab");
    setQrRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <img src={logo} alt="Clean Check" className="h-24 w-auto mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 relative">
          <div className="flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 via-pink-500/60 to-blue-500/60 blur-3xl rounded-full scale-150"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-pink-400/40 to-blue-400/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
              <img src={logo} alt="Clean Check" className="relative h-28 w-auto" />
            </div>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <Button 
              onClick={() => setActiveTab("qrcode")}
              className="relative bg-transparent border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-950/30"
            >
              <div className="absolute inset-0 bg-orange-600/25 blur-lg rounded-md -z-10 animate-pulse"></div>
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
            {isAdmin && (
              <Button 
                onClick={() => navigate("/admin")} 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/50"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            )}
            <Button 
              onClick={handleLogout} 
              className="relative bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 border-0"
            >
              <div className="absolute inset-0 bg-pink-500/40 blur-lg rounded-md -z-10"></div>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Dashboard</span>
            </CardTitle>
            <CardDescription className="text-base">
              Manage your profile, documents, and QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500/40 blur-3xl rounded-lg"></div>
                <div className="absolute inset-0 bg-blue-400/30 blur-2xl rounded-lg animate-pulse"></div>
                <TabsList className="relative grid w-full grid-cols-4 bg-blue-50 dark:bg-blue-950/50 backdrop-blur-sm border-2 border-blue-500/50 shadow-2xl shadow-blue-500/40 ring-2 ring-blue-400/30">
                  <TabsTrigger 
                    value="profile" 
                    className="transition-all duration-300 hover:scale-105 hover:bg-green-100 dark:hover:bg-green-900/30 hover:shadow-lg hover:shadow-green-500/30"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="certifications"
                    className="transition-all duration-300 hover:scale-105 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger 
                    value="qrcode"
                    className="transition-all duration-300 hover:scale-105 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:shadow-lg hover:shadow-purple-500/30"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Code
                  </TabsTrigger>
                  <TabsTrigger 
                    value="references"
                    className="transition-all duration-300 hover:scale-105 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:shadow-lg hover:shadow-orange-500/30"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    References
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="profile">
                <ProfileTab userId={user.id} onUpdate={handleProfileUpdate} />
              </TabsContent>
              
              <TabsContent value="certifications">
                <CertificationsTab userId={user.id} />
              </TabsContent>
              
              <TabsContent value="qrcode">
                <QRCodeTab key={qrRefreshKey} userId={user.id} />
              </TabsContent>
              
              <TabsContent value="references">
                <PendingReferencesTab userId={user.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Floating Back to Home Button */}
      <Button
        onClick={() => navigate("/")}
        className="fixed bottom-8 left-8 h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 shadow-2xl shadow-blue-400/40 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 z-50"
        title="Back to Home"
      >
        <Home className="h-6 w-6 text-white" />
      </Button>

      {/* Floating Admin Button - Only visible for admins */}
      {isAdmin && (
        <Button
          onClick={() => navigate("/admin")}
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-2xl shadow-purple-500/50 hover:shadow-purple-600/60 transition-all duration-300 hover:scale-110 z-50"
          title="Go to Admin Panel"
        >
          <Settings className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
};

export default Dashboard;