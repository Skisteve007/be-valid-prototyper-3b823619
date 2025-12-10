import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SmartSplitRequest {
  user_id: string;
  transaction_type: 'ACCESS_PASS' | 'POS_SPEND';
  gross_amount: number;
  venue_id?: string;
  pass_duration_days?: number;
}

const logStep = (step: string, data?: any) => {
  console.log(`[SMART-SPLIT] ${step}:`, data ? JSON.stringify(data) : '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { user_id, transaction_type, gross_amount, venue_id, pass_duration_days = 1 }: SmartSplitRequest = await req.json();
    
    logStep('Processing Smart-Split transaction', { user_id, transaction_type, gross_amount, venue_id });

    // Get user's originator (promoter who recruited them)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('originator_id')
      .eq('user_id', user_id)
      .single();

    if (profileError) {
      logStep('Error fetching profile', profileError);
    }

    const originator_id = profile?.originator_id;
    logStep('Originator ID', { originator_id });

    if (transaction_type === 'ACCESS_PASS') {
      // ===== WATERFALL LOGIC FOR GHOST PASS SALES =====
      
      let remainingNet = gross_amount;
      let promoterCut = 0;

      // STEP 1: Promoter Cut (10% off top if originator exists)
      if (originator_id) {
        promoterCut = gross_amount * 0.10;
        remainingNet = gross_amount - promoterCut;
        
        // Credit promoter wallet
        await supabase.from('promoter_payout_ledger').insert({
          promoter_id: originator_id,
          amount: promoterCut,
          status: 'pending',
        });
        
        // Update affiliate pending earnings
        await supabase.rpc('update_affiliate_pending_earnings', {
          _affiliate_id: originator_id,
          _amount: promoterCut
        });
        
        logStep('Promoter cut credited', { promoterCut, originator_id });
      }

      // STEP 2: Platform Split on remaining net
      const validOperations = remainingNet * 0.60; // 60% to VALID
      const venuePool = remainingNet * 0.40; // 40% to venue pool

      logStep('Platform split calculated', { validOperations, venuePool, remainingNet });

      // Create transaction record
      const { data: transaction, error: txError } = await supabase
        .from('incognito_transactions')
        .insert({
          user_id,
          venue_id,
          total_amount: gross_amount,
          cleancheck_share: validOperations,
          promoter_share: promoterCut,
          venue_share: venuePool,
          payment_status: 'completed',
          transaction_type: 'ACCESS_PASS',
          processed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (txError) {
        logStep('Error creating transaction', txError);
        throw txError;
      }

      // STEP 3: Create pool distribution for tracking venue visits
      const passStartDate = new Date();
      const passEndDate = new Date();
      passEndDate.setDate(passEndDate.getDate() + pass_duration_days);

      const { data: poolDistribution, error: poolError } = await supabase
        .from('venue_pool_distributions')
        .insert({
          transaction_id: transaction.id,
          pass_start_date: passStartDate.toISOString().split('T')[0],
          pass_end_date: passEndDate.toISOString().split('T')[0],
          total_pool_amount: venuePool,
          distributed: false,
        })
        .select()
        .single();

      if (poolError) {
        logStep('Error creating pool distribution', poolError);
      }

      logStep('ACCESS_PASS processed successfully', {
        transaction_id: transaction.id,
        pool_distribution_id: poolDistribution?.id,
        breakdown: {
          gross: gross_amount,
          promoter_cut: promoterCut,
          valid_share: validOperations,
          venue_pool: venuePool,
        }
      });

      return new Response(JSON.stringify({
        success: true,
        transaction_id: transaction.id,
        pool_distribution_id: poolDistribution?.id,
        breakdown: {
          gross_amount,
          promoter_cut: promoterCut,
          valid_operations: validOperations,
          venue_pool: venuePool,
          net_after_promoter: remainingNet,
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } else if (transaction_type === 'POS_SPEND') {
      // ===== LOGIC FOR POS/BAR SPENDING =====
      
      if (!venue_id) {
        throw new Error('venue_id required for POS_SPEND transactions');
      }

      // Get venue's promoter spend commission rate
      const { data: venue, error: venueError } = await supabase
        .from('partner_venues')
        .select('promoter_spend_commission_rate, paypal_email')
        .eq('id', venue_id)
        .single();

      if (venueError) {
        logStep('Error fetching venue', venueError);
        throw venueError;
      }

      const commissionRate = venue?.promoter_spend_commission_rate || 0;
      let promoterCommission = 0;
      let venueShare = gross_amount;

      // STEP 1 & 2: Apply promoter commission if rate > 0 and user has originator
      if (commissionRate > 0 && originator_id) {
        promoterCommission = gross_amount * commissionRate;
        venueShare = gross_amount - promoterCommission;

        // Credit promoter
        await supabase.from('promoter_payout_ledger').insert({
          promoter_id: originator_id,
          amount: promoterCommission,
          status: 'pending',
        });

        await supabase.rpc('update_affiliate_pending_earnings', {
          _affiliate_id: originator_id,
          _amount: promoterCommission
        });

        logStep('POS promoter commission credited', { promoterCommission, originator_id, commissionRate });
      }

      // Credit venue
      await supabase.rpc('update_venue_earnings', {
        _venue_id: venue_id,
        _amount: venueShare
      });

      // Create transaction record
      const { data: transaction, error: txError } = await supabase
        .from('incognito_transactions')
        .insert({
          user_id,
          venue_id,
          total_amount: gross_amount,
          cleancheck_share: 0, // VALID takes processing fees separately
          promoter_share: promoterCommission,
          venue_share: venueShare,
          payment_status: 'completed',
          transaction_type: 'POS_SPEND',
          processed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (txError) {
        logStep('Error creating POS transaction', txError);
        throw txError;
      }

      logStep('POS_SPEND processed successfully', {
        transaction_id: transaction.id,
        breakdown: {
          gross: gross_amount,
          promoter_commission: promoterCommission,
          venue_share: venueShare,
          commission_rate: commissionRate,
        }
      });

      return new Response(JSON.stringify({
        success: true,
        transaction_id: transaction.id,
        breakdown: {
          gross_amount,
          promoter_commission: promoterCommission,
          venue_share: venueShare,
          commission_rate: commissionRate,
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    throw new Error('Invalid transaction_type');

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logStep('Error processing Smart-Split', errorMessage);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
