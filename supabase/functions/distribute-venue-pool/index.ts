import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, data?: any) => {
  console.log(`[VENUE-POOL-DISTRIBUTION] ${step}:`, data ? JSON.stringify(data) : '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    logStep('Starting venue pool distribution');

    // Find all undistributed pools that have ended
    const today = new Date().toISOString().split('T')[0];
    
    const { data: expiredPools, error: poolsError } = await supabase
      .from('venue_pool_distributions')
      .select('*')
      .eq('distributed', false)
      .lt('pass_end_date', today);

    if (poolsError) {
      logStep('Error fetching expired pools', poolsError);
      throw poolsError;
    }

    logStep('Found expired pools', { count: expiredPools?.length || 0 });

    const results = [];

    for (const pool of expiredPools || []) {
      logStep('Processing pool', { pool_id: pool.id });

      // Get unique venue visits for this pool
      const { data: visits, error: visitsError } = await supabase
        .from('venue_visit_tracking')
        .select('venue_id')
        .eq('pool_distribution_id', pool.id);

      if (visitsError) {
        logStep('Error fetching visits for pool', { pool_id: pool.id, error: visitsError });
        continue;
      }

      const uniqueVenues = [...new Set(visits?.map(v => v.venue_id) || [])];
      const venueCount = uniqueVenues.length;

      logStep('Unique venues visited', { pool_id: pool.id, venueCount, venues: uniqueVenues });

      if (venueCount === 0) {
        // No venues visited - mark as distributed with no payouts
        await supabase
          .from('venue_pool_distributions')
          .update({ distributed: true, updated_at: new Date().toISOString() })
          .eq('id', pool.id);

        results.push({
          pool_id: pool.id,
          status: 'no_venues',
          total_amount: pool.total_pool_amount,
        });
        continue;
      }

      // Calculate equal share per venue
      const sharePerVenue = pool.total_pool_amount / venueCount;

      // Distribute to each venue
      for (const venue_id of uniqueVenues) {
        // Update venue visit tracking with share amount
        await supabase
          .from('venue_visit_tracking')
          .update({ share_amount: sharePerVenue })
          .eq('pool_distribution_id', pool.id)
          .eq('venue_id', venue_id);

        // Credit venue earnings
        await supabase.rpc('update_venue_earnings', {
          _venue_id: venue_id,
          _amount: sharePerVenue
        });

        // Add to venue payout ledger
        await supabase.from('venue_payout_ledger').insert({
          venue_id,
          amount: sharePerVenue,
          transaction_id: pool.transaction_id,
          status: 'pending',
        });

        logStep('Credited venue', { venue_id, share: sharePerVenue });
      }

      // Mark pool as distributed
      await supabase
        .from('venue_pool_distributions')
        .update({ distributed: true, updated_at: new Date().toISOString() })
        .eq('id', pool.id);

      results.push({
        pool_id: pool.id,
        status: 'distributed',
        total_amount: pool.total_pool_amount,
        venue_count: venueCount,
        share_per_venue: sharePerVenue,
        venues: uniqueVenues,
      });
    }

    logStep('Distribution complete', { processed: results.length });

    return new Response(JSON.stringify({
      success: true,
      processed_pools: results.length,
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logStep('Error in venue pool distribution', errorMessage);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
