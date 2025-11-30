import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, Award, QrCode, UserCheck } from "lucide-react";
import ProfileTab from "@/components/dashboard/ProfileTab";
import CertificationsTab from "@/components/dashboard/CertificationsTab";
import QRCodeTab from "@/components/dashboard/QRCodeTab";
import PendingReferencesTab from "@/components/dashboard/PendingReferencesTab";
import logo from "@/assets/clean-check-logo.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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
            <img src={logo} alt="Clean Check" className="h-30 w-auto" />
          </div>
          <Button variant="outline" onClick={handleLogout} className="absolute right-4 top-1/2 -translate-y-1/2">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 via-primary to-pink-600 bg-clip-text text-transparent font-bold">
              Dashboard
            </CardTitle>
            <CardDescription className="text-base">
              Manage your profile, documents, and QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-500/40 blur-3xl rounded-lg"></div>
                <div className="absolute inset-0 bg-green-400/30 blur-2xl rounded-lg animate-pulse"></div>
                <TabsList className="relative grid w-full grid-cols-4 bg-blue-50 dark:bg-blue-950/50 backdrop-blur-sm border-2 border-green-500/50 shadow-2xl shadow-green-500/40 ring-2 ring-green-400/30">
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
                <ProfileTab userId={user.id} />
              </TabsContent>
              
              <TabsContent value="certifications">
                <CertificationsTab userId={user.id} />
              </TabsContent>
              
              <TabsContent value="qrcode">
                <QRCodeTab userId={user.id} />
              </TabsContent>
              
              <TabsContent value="references">
                <PendingReferencesTab userId={user.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;