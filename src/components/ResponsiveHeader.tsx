import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { AdminLoginDialog } from "./AdminLoginDialog";

const ResponsiveHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const hideHeader =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/synth") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/wallet") ||
    pathname.startsWith("/vendor-portal") ||
    pathname.startsWith("/scanner") ||
    pathname.startsWith("/staff") ||
    pathname.startsWith("/manager") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/access-portal");

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "administrator")
            .maybeSingle();
          
          setIsAdmin(!!roleData);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      setShowLoginDialog(true);
    }
  };

  return (
    <>
      {!hideHeader && (
        <header className="w-full px-2 sm:px-8 md:px-16 lg:px-24 py-3 sm:py-4 flex items-center justify-between gap-3 bg-transparent absolute top-0 left-0 right-0 z-50">
          {/* Logo - Text Only */}
          <Link to="/" className="flex flex-col items-start shrink-0">
            <span className="text-base sm:text-2xl md:text-3xl font-bold font-display tracking-[0.12em] sm:tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">
              VALID<sup className="text-[0.5em] text-cyan-400">™</sup>
            </span>
            {/* Shorter text on mobile */}
            <span className="text-[0.45rem] sm:text-[0.5rem] md:text-[0.6rem] tracking-[0.08em] sm:tracking-[0.15em] text-cyan-400/80 font-medium uppercase">
              <span className="hidden xs:inline">Powered By </span>Synth AI
            </span>
          </Link>

          {/* Right Side Controls */}
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            {/* Partner Solutions Button */}
            <Link
              to="/partners"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-[0.6rem] sm:text-xs font-bold tracking-wide sm:tracking-wider uppercase rounded-full border border-amber-400/60 bg-amber-500/10 text-amber-400 hover:bg-amber-500/15 hover:shadow-[0_0_16px_rgba(251,191,36,0.35)] transition-all whitespace-nowrap"
            >
              Partners
            </Link>

            {/* Theme Toggle - hidden on very small screens */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Member Login Pill */}
            <Link
              to="/auth?mode=login"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-[0.6rem] sm:text-xs font-bold tracking-wide sm:tracking-wider uppercase rounded-full border border-cyan-400/60 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/15 hover:shadow-[0_0_16px_rgba(0,240,255,0.35)] transition-all whitespace-nowrap"
            >
              Login
            </Link>

            {/* Admin Panel */}
            <button
              onClick={handleAdminClick}
              disabled={checkingAuth}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[0.55rem] sm:text-[0.65rem] font-bold tracking-wide uppercase rounded-full border border-teal-300/40 bg-black/20 text-teal-200 hover:bg-black/30 hover:border-teal-200/60 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {isAdmin ? "Admin Panel" : "Admin"}
            </button>
          </div>
        </header>
      )}

      {!hideHeader && (
        <AdminLoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      )}
    </>
  );
};

export default ResponsiveHeader;
