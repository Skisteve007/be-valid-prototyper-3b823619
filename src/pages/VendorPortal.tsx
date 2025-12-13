import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, BarChart3, Lock } from "lucide-react";
import validLogo from "@/assets/valid-logo.jpeg";
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";

const VendorPortal = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Check for vendor/staff roles
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);

        if (roles?.some(r => r.role === "administrator")) {
          setUserRole("vendor");
        } else if (roles?.some(r => r.role === "paid")) {
          setUserRole("member");
        } else {
          setUserRole("guest");
        }

        // Check if venue operator
        const { data: venueOp } = await supabase
          .from("venue_operators")
          .select("access_level")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (venueOp) {
          if (venueOp.access_level === "owner" || venueOp.access_level === "manager") {
            setUserRole("vendor");
          } else if (venueOp.access_level === "staff") {
            setUserRole("staff");
          }
        }
      }
    } catch (error) {
      console.error("Error checking role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVendorLogin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth?mode=login&redirect=/vendor-portal");
      return;
    }

    // Smart routing based on role
    if (userRole === "vendor") {
      navigate("/vendor-portal/dashboard");
    } else if (userRole === "staff") {
      navigate("/staff/pos");
    } else if (userRole === "member") {
      navigate("/dashboard");
    } else {
      navigate("/auth?mode=login&redirect=/vendor-portal");
    }
  };

  return (
    <>
      <Helmet>
        <title>For Enterprise | Valid™ Vendor Portal</title>
        <meta name="description" content="Valid™ enterprise solutions for venues, clubs, and businesses. Real-time analytics, staff management, and seamless Ghost Pass™ integration." />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
          
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6">
              <img src={validLogo} alt="Valid™" className="w-5 h-5 rounded-full object-cover" />
              <span className="text-sm font-medium text-cyan-400">Enterprise Solutions</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              FOR <span className="text-cyan-400">ENTERPRISE</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              The complete operating system for venues. Real-time analytics, instant settlements, and frictionless entry—all powered by Ghost Pass™.
            </p>
            
            <Button 
              onClick={handleVendorLogin}
              disabled={isLoading}
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-6 text-lg rounded-full shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all hover:shadow-[0_0_50px_rgba(0,255,255,0.6)]"
            >
              <Lock className="w-5 h-5 mr-2" />
              Vendor Login
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <BarChart3 className="w-10 h-10 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Live Pulse</CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time headcount, revenue ticker, and scans per minute
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <DollarSign className="w-10 h-10 text-green-400 mb-2" />
                <CardTitle className="text-white">Revenue Buckets</CardTitle>
                <CardDescription className="text-slate-400">
                  Door, Bar, Concessions, Swag—broken down in real-time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <DollarSign className="w-10 h-10 text-purple-400 mb-2" />
                <CardTitle className="text-white">4:01 AM Settlement</CardTitle>
                <CardDescription className="text-slate-400">
                  Gross - Tax - Commission - Fees = Your Net Payout
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <Users className="w-10 h-10 text-orange-400 mb-2" />
                <CardTitle className="text-white">Staff Audit</CardTitle>
                <CardDescription className="text-slate-400">
                  Leaderboard with scans, revenue, and rejection rates
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 border-t border-slate-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Not a Vendor Yet?
            </h2>
            <p className="text-slate-400 mb-8">
              Apply to become a Valid™ partner venue and start earning on every Ghost Pass™ scan.
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate("/partner-application")}
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            >
              Apply for Partnership
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default VendorPortal;
