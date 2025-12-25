import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface VendorAccessState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isVendor: boolean;
  isStaff: boolean;
  hasInvestorAccess: boolean;
  hasPartnerAccess: boolean;
  loading: boolean;
  userId: string | null;
  venueId: string | null;
}

export const useVendorAccess = () => {
  const [state, setState] = useState<VendorAccessState>({
    isLoggedIn: false,
    isAdmin: false,
    isVendor: false,
    isStaff: false,
    hasInvestorAccess: false,
    hasPartnerAccess: false,
    loading: true,
    userId: null,
    venueId: null,
  });

  useEffect(() => {
    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAccess();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setState({
          isLoggedIn: false,
          isAdmin: false,
          isVendor: false,
          isStaff: false,
          hasInvestorAccess: false,
          hasPartnerAccess: false,
          loading: false,
          userId: null,
          venueId: null,
        });
        return;
      }

      // Check roles
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const isAdmin = roles?.some(r => r.role === "administrator") || false;

      // Check venue operator status
      const { data: venueOp } = await supabase
        .from("venue_operators")
        .select("access_level, venue_id")
        .eq("user_id", user.id)
        .maybeSingle();

      const isVendor = isAdmin || 
        venueOp?.access_level === "owner" || 
        venueOp?.access_level === "manager";
      const isStaff = venueOp?.access_level === "staff";

      // Check investor/partner access
      const { data: profile } = await supabase
        .from("profiles")
        .select("investor_access_approved, partner_access_approved")
        .eq("user_id", user.id)
        .maybeSingle();

      setState({
        isLoggedIn: true,
        isAdmin,
        isVendor,
        isStaff,
        hasInvestorAccess: isAdmin || profile?.investor_access_approved === true,
        hasPartnerAccess: isAdmin || profile?.partner_access_approved === true,
        loading: false,
        userId: user.id,
        venueId: venueOp?.venue_id || null,
      });
    } catch (error) {
      console.error("Error checking access:", error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return state;
};
