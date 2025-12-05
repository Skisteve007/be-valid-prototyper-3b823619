import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BundlePreferences {
  includeId: boolean;
  includePayment: boolean;
}

interface IncognitoTokenRequest {
  user_id: string;
  venue_id?: string;
  promoter_id?: string;
  bundle_preferences?: BundlePreferences;
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

    const { user_id, venue_id, promoter_id, bundle_preferences }: IncognitoTokenRequest = await req.json();

    console.log('Generating Incognito Master Token:', { user_id, venue_id, promoter_id, bundle_preferences });

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

    // 2. Get user's profile for compliance status and photo
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, status_color, full_name, member_id, profile_image_url')
      .eq('user_id', user_id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ success: false, error: 'Profile not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // 3. Get ID documents if requested in bundle
    let idDocumentData = null;
    if (bundle_preferences?.includeId) {
      const { data: docs } = await supabase
        .from('certifications')
        .select('id, title, document_url, expiry_date')
        .eq('user_id', user_id)
        .or('title.ilike.%ID%,title.ilike.%License%,title.ilike.%Passport%,title.ilike.%Driver%')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (docs && docs.length > 0) {
        idDocumentData = docs[0];
        console.log('ID document attached to token:', idDocumentData.title);
      }
    }

    // 4. Process the $5 payment
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

    // 5. Generate 24-hour incognito token with embedded bundle data
    const tokenBase = crypto.randomUUID() + '-' + Date.now().toString(36);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Encode bundle flags in the token prefix for easy parsing
    // Format: INCOG_{flags}_{token}
    // Flags: I = ID included, P = Payment included
    let flags = '';
    if (bundle_preferences?.includeId && idDocumentData) flags += 'I';
    if (bundle_preferences?.includePayment) flags += 'P';
    if (flags === '') flags = 'S'; // S = Status only

    const fullToken = `INCOG_${flags}_${tokenBase}`;

    // Store incognito token
    const { error: tokenError } = await supabase
      .from('qr_access_tokens')
      .insert({
        profile_id: profile.id,
        token: fullToken,
        expires_at: expiresAt.toISOString()
      });

    if (tokenError) {
      console.error('Failed to create incognito token:', tokenError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to generate token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // 6. If there's a promoter, add to their payout ledger
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

      // Start Promoter Session for Gross Revenue Tracking
      if (venue_id) {
        const { data: sessionData, error: sessionError } = await supabase
          .from('promoter_sessions')
          .insert({
            transaction_id: transaction.id,
            promoter_id,
            venue_id,
            user_id,
            session_start: new Date().toISOString(),
            commission_rate: 0.05,
            commission_status: 'tracking'
          })
          .select()
          .single();

        if (sessionError) {
          console.error('Failed to start promoter session:', sessionError);
        } else {
          console.log('Promoter session started for gross revenue tracking:', sessionData.id);
        }
      }
    }

    // 7. Add venue to payout ledger and update earnings
    if (venue_id) {
      const { data: venueData } = await supabase
        .from('partner_venues')
        .select('venue_name, bank_endpoint, paypal_email')
        .eq('id', venue_id)
        .single();

      await supabase
        .from('venue_payout_ledger')
        .insert({
          venue_id,
          transaction_id: transaction.id,
          amount: VENUE_SHARE,
          status: 'pending',
          bank_endpoint: venueData?.bank_endpoint || venueData?.paypal_email
        });

      await supabase.rpc('update_venue_earnings', {
        _venue_id: venue_id,
        _amount: VENUE_SHARE
      });

      console.log('Venue payout credited:', VENUE_SHARE, 'to', venueData?.venue_name);
    }

    // 8. Log complete audit trail
    console.log('=== INCOGNITO MASTER TOKEN AUDIT LOG ===');
    console.log('Transaction ID:', transaction.id);
    console.log('User ID:', user_id);
    console.log('Member ID:', profile.member_id);
    console.log('Venue ID:', venue_id || 'N/A');
    console.log('Promoter ID:', promoter_id || 'N/A');
    console.log('Bundle Flags:', flags);
    console.log('ID Included:', bundle_preferences?.includeId ? 'YES' : 'NO');
    console.log('Payment Auth Included:', bundle_preferences?.includePayment ? 'YES' : 'NO');
    console.log('Total Amount:', TOTAL_FEE);
    console.log('Venue Share:', VENUE_SHARE);
    console.log('Promoter Share:', promoter_id ? PROMOTER_SHARE : 0);
    console.log('Clean Check Share:', CLEANCHECK_SHARE);
    console.log('Payment Reference:', paymentReference);
    console.log('Token Expires:', expiresAt.toISOString());
    console.log('Timestamp:', new Date().toISOString());
    console.log('==========================================');

    return new Response(
      JSON.stringify({ 
        success: true, 
        token: fullToken,
        expires_at: expiresAt.toISOString(),
        transaction_id: transaction.id,
        payment_reference: paymentReference,
        compliance_status: profile.status_color,
        embedded_data: {
          venue_id: venue_id || null,
          promoter_id: promoter_id || null,
          member_id: profile.member_id,
          bundle_flags: flags,
          id_verified: bundle_preferences?.includeId && idDocumentData ? true : false,
          payment_authorized: bundle_preferences?.includePayment || false,
          photo_url: profile.profile_image_url
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
