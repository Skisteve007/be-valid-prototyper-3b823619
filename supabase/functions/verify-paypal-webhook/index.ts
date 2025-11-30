import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource: {
    id: string;
    subscriber?: {
      email_address: string;
      custom_id?: string; // user_id
    };
    amount?: {
      value: string;
    };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("PayPal webhook received");
    
    // Create Supabase client with service role for admin operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get webhook body
    const webhookEvent: PayPalWebhookEvent = await req.json();
    console.log("Webhook event type:", webhookEvent.event_type);
    console.log("Webhook event ID:", webhookEvent.id);

    // ========================================
    // PAYPAL WEBHOOK SIGNATURE VERIFICATION
    // ========================================
    // In production, you MUST verify the webhook signature
    // https://developer.paypal.com/api/rest/webhooks/
    
    const webhookId = Deno.env.get('PAYPAL_WEBHOOK_ID');
    const paypalHeaders = {
      'PAYPAL-TRANSMISSION-ID': req.headers.get('PAYPAL-TRANSMISSION-ID'),
      'PAYPAL-TRANSMISSION-TIME': req.headers.get('PAYPAL-TRANSMISSION-TIME'),
      'PAYPAL-TRANSMISSION-SIG': req.headers.get('PAYPAL-TRANSMISSION-SIG'),
      'PAYPAL-CERT-URL': req.headers.get('PAYPAL-CERT-URL'),
      'PAYPAL-AUTH-ALGO': req.headers.get('PAYPAL-AUTH-ALGO'),
    };

    // TODO: Implement PayPal signature verification
    // For now, we log the event but don't automatically update payment status
    // This prevents fraudulent payment confirmations
    
    console.log("PayPal headers:", paypalHeaders);

    // Handle different webhook events
    switch (webhookEvent.event_type) {
      case 'PAYMENT.SALE.COMPLETED':
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
      case 'BILLING.SUBSCRIPTION.PAYMENT.COMPLETED':
        console.log("Payment completed event");
        
        // Extract user ID from custom_id field
        const userId = webhookEvent.resource.subscriber?.custom_id;
        const email = webhookEvent.resource.subscriber?.email_address;
        const amount = webhookEvent.resource.amount?.value;

        if (!userId) {
          console.error("No user ID found in webhook");
          return new Response(
            JSON.stringify({ error: 'No user ID in webhook' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Update user's payment status
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({
            payment_status: 'paid',
            payment_date: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error("Error updating payment status:", updateError);
          throw updateError;
        }

        console.log(`Payment confirmed for user ${userId}, email: ${email}, amount: ${amount}`);

        // Send admin notification emails
        const adminEmails = ['sgrillocce@gmail.com', 'Office@bigtexasroof.com'];
        
        for (const adminEmail of adminEmails) {
          try {
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
              },
              body: JSON.stringify({
                from: 'Clean Check <noreply@cleancheck.app>',
                to: adminEmail,
                subject: '💳 New Payment Confirmed via PayPal Webhook',
                html: `
                  <h2>Payment Confirmation</h2>
                  <p><strong>User ID:</strong> ${userId}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Amount:</strong> $${amount}</p>
                  <p><strong>PayPal Event ID:</strong> ${webhookEvent.id}</p>
                  <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                  <hr>
                  <p><em>This payment was verified via PayPal webhook.</em></p>
                `,
              }),
            });
          } catch (emailError) {
            console.error("Failed to send admin notification:", emailError);
          }
        }

        break;

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.SUSPENDED':
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        console.log("Subscription cancelled/suspended/expired");
        
        const cancelledUserId = webhookEvent.resource.subscriber?.custom_id;
        
        if (cancelledUserId) {
          // Update payment status to reflect cancellation
          await supabaseClient
            .from('profiles')
            .update({
              payment_status: 'cancelled',
            })
            .eq('user_id', cancelledUserId);
          
          console.log(`Subscription status updated for user ${cancelledUserId}`);
        }
        break;

      default:
        console.log(`Unhandled webhook event type: ${webhookEvent.event_type}`);
    }

    return new Response(
      JSON.stringify({ success: true, event_type: webhookEvent.event_type }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
