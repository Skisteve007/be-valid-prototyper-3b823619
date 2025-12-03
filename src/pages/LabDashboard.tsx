import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Code, 
  Zap, 
  Shield, 
  Database, 
  FileText,
  LogOut,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/clean-check-logo.png";
import { User, Session } from "@supabase/supabase-js";

const LabDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if user is admin or lab partner
  useEffect(() => {
    const checkAccess = async () => {
      if (!session?.user) {
        setCheckingAccess(false);
        return;
      }

      try {
        // Check if user is an administrator
        const { data: isAdmin } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'administrator'
        });

        // Check if user is associated with a lab partner (by email match)
        const { data: labPartner } = await supabase
          .from('lab_partners')
          .select('id')
          .eq('contact_email', session.user.email)
          .eq('active', true)
          .maybeSingle();

        setIsAuthorized(!!isAdmin || !!labPartner);
      } catch (error) {
        console.error('Error checking access:', error);
        setIsAuthorized(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    if (session?.user) {
      checkAccess();
    }
  }, [session]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !session) {
      navigate("/auth");
    }
  }, [loading, session, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (loading || checkingAccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-900 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-6">
              This dashboard is only available to authorized lab partners and administrators.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/partners")}
                className="w-full bg-blue-900 hover:bg-blue-800"
              >
                Become a Lab Partner
              </Button>
              <Button 
                variant="outline"
                onClick={handleSignOut}
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Clean Check" className="h-10 w-auto" />
            <span className="text-lg font-bold text-slate-800">Lab Partner Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.email}</span>
            <Button 
              variant="outline"
              onClick={handleSignOut}
              className="border-slate-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Lab Partner Operations Console
          </h1>
          <p className="text-slate-600">
            Access real-time data, manage compliance standards, and debug integrations through our enterprise-grade administrative suite.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Webhook Inspector Module */}
          <Card className="border-0 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Code className="h-5 w-5" />
                Real-time Webhook Event Inspector
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Live logging of every API interaction. Monitor data flow and debug issues instantly.
              </p>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400 h-32 overflow-auto">
                <p>{">"} POST /api/webhook/result - 200 OK</p>
                <p>{">"} barcode: CC-84729103 | status: negative</p>
                <p>{">"} timestamp: {new Date().toISOString()}</p>
                <p className="animate-pulse">{">"} Awaiting next event...</p>
              </div>
              <Button variant="outline" className="mt-4 w-full border-blue-900 text-blue-900 hover:bg-blue-50">
                <RefreshCw className="h-4 w-4 mr-2" />
                Replay Selected Payload
              </Button>
            </CardContent>
          </Card>

          {/* Exception Engine Module */}
          <Card className="border-0 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Automated Sample Exception Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Intelligent log of all sample exceptions and inconclusive results requiring manual review.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-sm font-medium text-amber-800">Sample #82910 - Inconclusive</span>
                  <span className="text-xs text-amber-600">Review Pending</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-green-800">Sample #82909 - Resolved</span>
                  <span className="text-xs text-green-600">Auto-Reorder Sent</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-sm font-medium text-red-800">Sample #82908 - Failed QC</span>
                  <span className="text-xs text-red-600">Action Required</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requisition Manager Module */}
          <Card className="border-0 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Database className="h-5 w-5" />
                Requisition & Compliance Standard (FHIR R4)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                View and manage all active compliance standards and data schemas for required testing profiles.
              </p>
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-50">
                  <FileText className="h-4 w-4 mr-2" />
                  View Current FHIR R4 Standard
                </Button>
                <Button variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-50">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Requisition Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Integration Status Module */}
          <Card className="border-0 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Integration Health & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Check the health of your <strong>REST API + Webhooks</strong> connection, <strong>HIPAA-Ready</strong> status, and <strong>2257 Compliance</strong> assurance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-gray-800">API Connection Status</span>
                  <span className="flex items-center gap-2 text-sm font-bold text-green-700">
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                    Operational
                  </span>
                </li>
                <li className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-sm font-medium text-gray-800">Last Webhook Success</span>
                  <span className="text-sm text-slate-600">5 seconds ago</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-gray-800">HIPAA Compliance</span>
                  <span className="flex items-center gap-2 text-sm font-bold text-green-700">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    Active
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LabDashboard;
