import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IncognitoTokenRequest {
  user_id: string;
  venue_id?: string;
  promoter_id?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { user_id, venue_id, promoter_id }: IncognitoTokenRequest = await req.json();

    console.log('Generating Incognito token:', { user_id, venue_id, promoter_id });

    // 1. Check if user has a valid payment method on file
    const { data: paymentMethod, error: pmError } = await supabase
      .from('user_payment_methods')
      .select('*')
      .eq('user_id', user_id)
      .eq('is_default', true)
      .single();

    if (pmError || !paymentMethod) {
      console.log('No payment method found for user');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'NO_PAYMENT_METHOD',
          message: 'Please add a payment method before using Incognito mode.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // 2. Get user's profile for compliance status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, status_color, full_name, member_id')
      .eq('user_id', user_id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ success: false, error: 'Profile not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // 3. Process the $5 payment
    const TOTAL_FEE = 5.00;
    const VENUE_SHARE = 2.00;
    const CLEANCHECK_SHARE = 2.00;
    const PROMOTER_SHARE = 1.00;

    // Create transaction record
    const { data: transaction, error: txError } = await supabase
      .from('incognito_transactions')
      .insert({
        user_id,
        venue_id: venue_id || null,
        promoter_id: promoter_id || null,
        total_amount: TOTAL_FEE,
        venue_share: VENUE_SHARE,
        cleancheck_share: CLEANCHECK_SHARE,
        promoter_share: promoter_id ? PROMOTER_SHARE : 0,
        payment_method_id: paymentMethod.id,
        payment_status: 'processing'
      })
      .select()
      .single();

    if (txError) {
      console.error('Failed to create transaction:', txError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to process payment' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Process payment (simulated - integrate with actual payment provider)
    const paymentReference = `INCOG-${Date.now()}-${transaction.id.slice(0, 8)}`;
    
    // Update transaction as completed
    await supabase
      .from('incognito_transactions')
      .update({ 
        payment_status: 'completed',
        payment_reference: paymentReference,
        processed_at: new Date().toISOString()
      })
      .eq('id', transaction.id);

    console.log('Payment processed:', paymentReference);

    // 4. Generate 24-hour incognito token
    const token = crypto.randomUUID() + '-' + Date.now().toString(36);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store incognito token (reuse qr_access_tokens table with special prefix)
    const { error: tokenError } = await supabase
      .from('qr_access_tokens')
      .insert({
        profile_id: profile.id,
        token: `INCOG_${token}`,
        expires_at: expiresAt.toISOString()
      });

    if (tokenError) {
      console.error('Failed to create incognito token:', tokenError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to generate token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // 5. If there's a promoter, add to their payout ledger
    if (promoter_id) {
      await supabase
        .from('promoter_payout_ledger')
        .insert({
          promoter_id,
          transaction_id: transaction.id,
          amount: PROMOTER_SHARE,
          status: 'pending'
        });

      // Update affiliate pending earnings
      await supabase.rpc('update_affiliate_pending_earnings', {
        _affiliate_id: promoter_id,
        _amount: PROMOTER_SHARE
      });

      console.log('Promoter commission credited:', PROMOTER_SHARE);
    }

    // 6. Add venue to payout ledger and update earnings
    if (venue_id) {
      // Get venue's bank endpoint
      const { data: venueData } = await supabase
        .from('partner_venues')
        .select('venue_name, bank_endpoint, paypal_email')
        .eq('id', venue_id)
        .single();

      // Create venue payout record
      await supabase
        .from('venue_payout_ledger')
        .insert({
          venue_id,
          transaction_id: transaction.id,
          amount: VENUE_SHARE,
          status: 'pending',
          bank_endpoint: venueData?.bank_endpoint || venueData?.paypal_email
        });

      // Update venue earnings
      await supabase.rpc('update_venue_earnings', {
        _venue_id: venue_id,
        _amount: VENUE_SHARE
      });

      console.log('Venue payout credited:', VENUE_SHARE, 'to', venueData?.venue_name);
    }

    // 7. Log complete audit trail
    console.log('=== INCOGNITO TRANSACTION AUDIT LOG ===');
    console.log('Transaction ID:', transaction.id);
    console.log('User ID:', user_id);
    console.log('Venue ID:', venue_id || 'N/A');
    console.log('Promoter ID:', promoter_id || 'N/A');
    console.log('Total Amount:', TOTAL_FEE);
    console.log('Venue Share:', VENUE_SHARE);
    console.log('Promoter Share:', promoter_id ? PROMOTER_SHARE : 0);
    console.log('Clean Check Share:', CLEANCHECK_SHARE);
    console.log('Payment Reference:', paymentReference);
    console.log('Timestamp:', new Date().toISOString());
    console.log('========================================');

    return new Response(
      JSON.stringify({ 
        success: true, 
        token: `INCOG_${token}`,
        expires_at: expiresAt.toISOString(),
        transaction_id: transaction.id,
        payment_reference: paymentReference,
        compliance_status: profile.status_color,
        embedded_data: {
          venue_id: venue_id || null,
          promoter_id: promoter_id || null,
          member_id: profile.member_id
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating incognito token:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
