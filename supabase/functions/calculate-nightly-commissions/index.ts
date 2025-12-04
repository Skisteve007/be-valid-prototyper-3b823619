import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting nightly commission calculation...');

    // 1. Find all open sessions (sessions without session_end that are older than 6 hours)
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    
    const { data: openSessions, error: sessionsError } = await supabase
      .from('promoter_sessions')
      .select('*')
      .is('session_end', null)
      .lt('session_start', sixHoursAgo);

    if (sessionsError) {
      console.error('Error fetching open sessions:', sessionsError);
      throw sessionsError;
    }

    console.log(`Found ${openSessions?.length || 0} open sessions to process`);

    const processedSessions = [];
    const errors = [];

    for (const session of openSessions || []) {
      try {
        console.log(`Processing session ${session.id} for promoter ${session.promoter_id}`);

        // 2. Calculate total gross revenue for this session
        const { data: revenueData, error: revenueError } = await supabase
          .from('venue_gross_revenue_log')
          .select('amount')
          .eq('session_id', session.id);

        if (revenueError) {
          console.error(`Error fetching revenue for session ${session.id}:`, revenueError);
          errors.push({ session_id: session.id, error: revenueError.message });
          continue;
        }

        const totalGrossRevenue = revenueData?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
        const commissionRate = session.commission_rate || 0.05; // Default 5%
        const commissionEarned = totalGrossRevenue * commissionRate;

        console.log(`Session ${session.id}: Gross Revenue = $${totalGrossRevenue}, Commission = $${commissionEarned}`);

        // 3. Update the session with calculated values and close it
        const { error: updateSessionError } = await supabase
          .from('promoter_sessions')
          .update({
            session_end: new Date().toISOString(),
            gross_revenue_tracked: totalGrossRevenue,
            commission_earned: commissionEarned,
            commission_status: commissionEarned > 0 ? 'pending_payout' : 'no_revenue',
            updated_at: new Date().toISOString()
          })
          .eq('id', session.id);

        if (updateSessionError) {
          console.error(`Error updating session ${session.id}:`, updateSessionError);
          errors.push({ session_id: session.id, error: updateSessionError.message });
          continue;
        }

        // 4. If commission earned, add to promoter payout ledger
        if (commissionEarned > 0) {
          const { error: ledgerError } = await supabase
            .from('promoter_payout_ledger')
            .insert({
              promoter_id: session.promoter_id,
              amount: commissionEarned,
              transaction_id: session.transaction_id,
              status: 'pending'
            });

          if (ledgerError) {
            console.error(`Error adding to ledger for session ${session.id}:`, ledgerError);
            errors.push({ session_id: session.id, error: ledgerError.message });
            continue;
          }

          // 5. Update affiliate pending earnings
          const { error: affiliateError } = await supabase.rpc(
            'update_affiliate_pending_earnings',
            { _affiliate_id: session.promoter_id, _amount: commissionEarned }
          );

          if (affiliateError) {
            console.error(`Error updating affiliate earnings for ${session.promoter_id}:`, affiliateError);
            errors.push({ session_id: session.id, error: affiliateError.message });
            continue;
          }

          // 6. Update session status to credited
          await supabase
            .from('promoter_sessions')
            .update({ commission_status: 'credited' })
            .eq('id', session.id);
        }

        processedSessions.push({
          session_id: session.id,
          promoter_id: session.promoter_id,
          gross_revenue: totalGrossRevenue,
          commission_earned: commissionEarned
        });

      } catch (sessionError) {
        console.error(`Error processing session ${session.id}:`, sessionError);
        errors.push({ session_id: session.id, error: String(sessionError) });
      }
    }

    const summary = {
      processed_at: new Date().toISOString(),
      total_sessions_found: openSessions?.length || 0,
      sessions_processed: processedSessions.length,
      total_commissions_credited: processedSessions.reduce((sum, s) => sum + s.commission_earned, 0),
      errors: errors.length,
      details: processedSessions,
      error_details: errors
    };

    console.log('Nightly commission calculation completed:', JSON.stringify(summary, null, 2));

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Nightly commission calculation failed:', error);
    return new Response(JSON.stringify({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
