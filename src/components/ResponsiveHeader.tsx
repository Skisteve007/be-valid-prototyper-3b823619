import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { AdminLoginDialog } from "./AdminLoginDialog";
import { StrategicDevelopmentDialog } from "./StrategicDevelopmentDialog";

const STEVE_EMAILS = ['steve@bevalid.app', 'sgrillocce@gmail.com'];

const ResponsiveHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const [isSteveOwner, setIsSteveOwner] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showStrategicDialog, setShowStrategicDialog] = useState(false);
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
    pathname.startsWith("/access-portal") ||
    pathname.startsWith("/partners") ||
    pathname.startsWith("/investor") ||
    pathname.startsWith("/pitch") ||
    pathname.startsWith("/deck") ||
    pathname.startsWith("/partner-application") ||
    pathname.startsWith("/demos");

  useEffect(() => {
    const checkSteveStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.email) {
          setIsSteveOwner(STEVE_EMAILS.includes(session.user.email.toLowerCase()));
        } else {
          setIsSteveOwner(false);
        }
      } catch (error) {
        console.error("Error checking Steve status:", error);
        setIsSteveOwner(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSteveStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSteveStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdminClick = () => {
    if (isSteveOwner) {
      navigate("/admin");
    } else {
      setShowLoginDialog(true);
    }
  };

  return (
    <>
      {!hideHeader && (
        <header className="w-full px-2 sm:px-8 md:px-16 lg:px-24 py-3 sm:py-6 bg-transparent absolute top-0 left-0 right-0 z-50">
          <div className="flex items-center justify-between gap-2">
            {/* Logo - Text Only */}
            <Link to="/" className="flex flex-col items-start shrink-0">
              <span className="text-base sm:text-2xl md:text-3xl font-bold font-display tracking-[0.12em] sm:tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">
                VALID<sup className="text-[0.5em] text-cyan-400">™</sup>
              </span>
              <span className="hidden sm:block text-[0.5rem] md:text-[0.6rem] tracking-[0.15em] text-cyan-400/80 font-medium uppercase">
                Powered By Synth AI
              </span>
            </Link>

            {/* Right Side Controls */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Mobile: Show only key buttons */}
              <Link
                to="/research-governance-labs"
                className="hidden sm:flex px-3 sm:px-4 py-1.5 sm:py-2 text-[0.6rem] sm:text-xs font-bold tracking-wide sm:tracking-wider uppercase rounded-full border border-purple-400/60 bg-purple-500/10 text-purple-400 hover:bg-purple-500/15 hover:shadow-[0_0_16px_rgba(168,85,247,0.35)] transition-all whitespace-nowrap"
              >
                Labs
              </Link>

              {/* Demos Button */}
              <Link
                to="/demos"
                className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-[0.55rem] sm:text-xs font-bold tracking-wide sm:tracking-wider uppercase rounded-full border border-emerald-400/60 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 hover:shadow-[0_0_16px_rgba(52,211,153,0.35)] transition-all whitespace-nowrap"
              >
                Demos
              </Link>

              {/* Partner Solutions Button - hidden on mobile */}
              <Link
                to="/partners"
                className="hidden sm:flex px-3 sm:px-4 py-1.5 sm:py-2 text-[0.6rem] sm:text-xs font-bold tracking-wide sm:tracking-wider uppercase rounded-full border border-amber-400/60 bg-amber-500/10 text-amber-400 hover:bg-amber-500/15 hover:shadow-[0_0_16px_rgba(251,191,36,0.35)] transition-all whitespace-nowrap"
              >
                Partners
              </Link>

              {/* Theme Toggle - hidden on mobile */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* Member Login Pill */}
              <Link
                to="/auth?mode=login"
                className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-[0.55rem] sm:text-xs font-bold tracking-wide sm:tracking-wider uppercase rounded-full border border-cyan-400/60 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/15 hover:shadow-[0_0_16px_rgba(0,240,255,0.35)] transition-all whitespace-nowrap"
              >
                Login
              </Link>

              {/* Strategic Development - only show for Steve */}
              {isSteveOwner && (
                <button
                  onClick={() => setShowStrategicDialog(true)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 text-[0.5rem] sm:text-[0.65rem] font-bold tracking-wide uppercase rounded-full border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-300/60 transition-colors whitespace-nowrap"
                >
                  Dev
                </button>
              )}

              {/* Admin Panel - only show for Steve */}
              {isSteveOwner && (
                <button
                  onClick={handleAdminClick}
                  disabled={checkingAuth}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 text-[0.5rem] sm:text-[0.65rem] font-bold tracking-wide uppercase rounded-full border border-teal-300/40 bg-black/20 text-teal-200 hover:bg-black/30 hover:border-teal-200/60 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  Admin
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {!hideHeader && (
        <AdminLoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      )}

      {!hideHeader && (
        <StrategicDevelopmentDialog open={showStrategicDialog} onOpenChange={setShowStrategicDialog} />
      )}
    </>
  );
};

export default ResponsiveHeader;
