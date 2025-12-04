import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IncognitoPaymentRequest {
  user_id: string;
  venue_id: string;
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

    const { user_id, venue_id, promoter_id }: IncognitoPaymentRequest = await req.json();

    console.log('Processing Incognito payment:', { user_id, venue_id, promoter_id });

    // Define the split amounts
    const TOTAL_FEE = 5.00;
    const VENUE_SHARE = 2.00;      // 40%
    const CLEANCHECK_SHARE = 2.00; // 40%
    const PROMOTER_SHARE = 1.00;   // 20%

    // 1. Get user's default payment method
    const { data: paymentMethod, error: pmError } = await supabase
      .from('user_payment_methods')
      .select('*')
      .eq('user_id', user_id)
      .eq('is_default', true)
      .single();

    if (pmError || !paymentMethod) {
      console.error('No payment method found:', pmError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No payment method on file. Please add a payment method.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Found payment method:', paymentMethod.payment_type);

    // 2. Create the transaction record (pending)
    const { data: transaction, error: txError } = await supabase
      .from('incognito_transactions')
      .insert({
        user_id,
        venue_id,
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
        JSON.stringify({ success: false, error: 'Failed to create transaction' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('Transaction created:', transaction.id);

    // 3. Process payment based on payment method type
    let paymentSuccess = false;
    let paymentReference = '';

    switch (paymentMethod.payment_type) {
      case 'paypal':
        // For PayPal, we would use the billing agreement ID to charge
        // This requires PayPal's billing agreements API
        paymentReference = `PP-${Date.now()}-${transaction.id.slice(0, 8)}`;
        // TODO: Integrate with PayPal Billing Agreements API
        // const paypalResult = await chargePayPalBillingAgreement(paymentMethod.token_reference, TOTAL_FEE);
        paymentSuccess = true; // Simulated for now
        console.log('PayPal payment processed:', paymentReference);
        break;

      case 'card':
        // For cards, we would use Stripe's payment intents with saved payment methods
        paymentReference = `CARD-${Date.now()}-${transaction.id.slice(0, 8)}`;
        // TODO: Integrate with Stripe Payment Intents API
        // const stripeResult = await chargeStripePaymentMethod(paymentMethod.token_reference, TOTAL_FEE);
        paymentSuccess = true; // Simulated for now
        console.log('Card payment processed:', paymentReference);
        break;

      case 'zelle':
        // Zelle doesn't support programmatic charges
        // This would need to be a manual request or different flow
        paymentReference = `ZELLE-PENDING-${transaction.id.slice(0, 8)}`;
        paymentSuccess = true; // Mark as pending for manual processing
        console.log('Zelle payment marked pending:', paymentReference);
        break;

      default:
        console.error('Unknown payment type:', paymentMethod.payment_type);
        paymentSuccess = false;
    }

    if (!paymentSuccess) {
      // Update transaction as failed
      await supabase
        .from('incognito_transactions')
        .update({ payment_status: 'failed' })
        .eq('id', transaction.id);

      return new Response(
        JSON.stringify({ success: false, error: 'Payment processing failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // 4. Update transaction as completed
    await supabase
      .from('incognito_transactions')
      .update({ 
        payment_status: 'completed',
        payment_reference: paymentReference,
        processed_at: new Date().toISOString()
      })
      .eq('id', transaction.id);

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

    // 6. Log venue analytics
    const { data: venue } = await supabase
      .from('partner_venues')
      .select('venue_name')
      .eq('id', venue_id)
      .single();

    console.log('Incognito payment completed for venue:', venue?.venue_name);

    return new Response(
      JSON.stringify({ 
        success: true, 
        transaction_id: transaction.id,
        payment_reference: paymentReference,
        splits: {
          total: TOTAL_FEE,
          venue: VENUE_SHARE,
          cleancheck: CLEANCHECK_SHARE,
          promoter: promoter_id ? PROMOTER_SHARE : 0
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing incognito payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
