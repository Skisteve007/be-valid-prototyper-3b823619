import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const REFERRAL_STORAGE_KEY = "cleancheck_referral_code";

export function useReferralTracking() {
  useEffect(() => {
    // Check URL for referral code
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref");

    if (refCode) {
      // Store in localStorage
      localStorage.setItem(REFERRAL_STORAGE_KEY, refCode);
      
      // Increment click count for the affiliate
      supabase.rpc("increment_affiliate_clicks", { _referral_code: refCode })
        .then(() => console.log("Affiliate click tracked"))
        .catch((err) => console.error("Failed to track click:", err));

      // Clean the URL without refreshing
      const url = new URL(window.location.href);
      url.searchParams.delete("ref");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, []);
}

export function getStoredReferralCode(): string | null {
  return localStorage.getItem(REFERRAL_STORAGE_KEY);
}

export function clearStoredReferralCode(): void {
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
}

// Call this after successful payment to create referral record
export async function processReferralOnPayment(
  userId: string,
  transactionAmount: number
): Promise<boolean> {
  const refCode = getStoredReferralCode();
  if (!refCode) return false;

  try {
    // Get affiliate by referral code
    const { data: affiliate, error: affError } = await supabase
      .from("affiliates")
      .select("id, user_id")
      .eq("referral_code", refCode)
      .maybeSingle();

    if (affError || !affiliate) {
      console.error("Affiliate not found:", affError);
      return false;
    }

    // Don't allow self-referrals
    if (affiliate.user_id === userId) {
      console.log("Self-referral blocked");
      clearStoredReferralCode();
      return false;
    }

    // Calculate 20% commission
    const commissionAmount = transactionAmount * 0.20;

    // Create referral record
    const { error: refError } = await supabase.from("referrals").insert({
      affiliate_id: affiliate.id,
      referred_user_id: userId,
      commission_amount: commissionAmount,
      transaction_amount: transactionAmount,
      status: "pending",
    });

    if (refError) {
      // Might be duplicate referral
      console.error("Failed to create referral:", refError);
      return false;
    }

    // Update affiliate pending earnings
    await supabase.rpc("update_affiliate_pending_earnings", {
      _affiliate_id: affiliate.id,
      _amount: commissionAmount,
    });

    clearStoredReferralCode();
    return true;
  } catch (err) {
    console.error("Error processing referral:", err);
    return false;
  }
}
