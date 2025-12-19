import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Log webhook event to database
const logWebhookEvent = async (
  eventId: string,
  eventType: string,
  payload: unknown,
  responseStatus: number,
  responseBody?: string,
  errorMessage?: string
) => {
  try {
    await supabaseAdmin.from("stripe_webhook_events").insert({
      event_id: eventId,
      event_type: eventType,
      payload: payload,
      response_status: responseStatus,
      response_body: responseBody,
      error_message: errorMessage,
      processed_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to log webhook event:", err);
  }
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    logStep("ERROR: Missing stripe-signature header");
    return new Response("Missing signature", { status: 400 });
  }

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    logStep("ERROR: STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  let event: Stripe.Event;
  const body = await req.text();

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    logStep("Webhook signature verified", { eventType: event.type, eventId: event.id });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    logStep("ERROR: Signature verification failed", { error: errorMessage });
    return new Response(`Webhook signature verification failed: ${errorMessage}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logStep("Payment succeeded", {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          customerId: paymentIntent.customer,
          metadata: paymentIntent.metadata,
        });
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logStep("Payment failed", {
          paymentIntentId: paymentIntent.id,
          error: paymentIntent.last_payment_error?.message,
        });
        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout completed", {
          sessionId: session.id,
          customerId: session.customer,
          customerEmail: session.customer_email,
          paymentStatus: session.payment_status,
          metadata: session.metadata,
        });

        if (session.metadata?.user_id && session.metadata?.membership_type) {
          const userId = session.metadata.user_id;
          const membershipType = session.metadata.membership_type;
          
          let expiryDate = new Date();
          if (membershipType === "driver_pass_14_day") {
            expiryDate.setDate(expiryDate.getDate() + 14);
          } else if (membershipType === "annual_pass") {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          } else {
            expiryDate.setMonth(expiryDate.getMonth() + 1);
          }

          const { error } = await supabaseAdmin
            .from("profiles")
            .update({
              payment_status: "paid",
              payment_date: new Date().toISOString(),
              status_expiry: expiryDate.toISOString(),
              status_color: "green",
            })
            .eq("user_id", userId);

          if (error) {
            logStep("ERROR: Failed to update profile", { userId, error: error.message });
          } else {
            logStep("Profile updated with payment", { userId, membershipType, expiry: expiryDate });
          }
        }
        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        logStep("Connected account updated", {
          accountId: account.id,
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
        });

        // Update venue with latest account status
        const { error } = await supabaseAdmin
          .from("partner_venues")
          .update({
            stripe_charges_enabled: account.charges_enabled,
            stripe_payouts_enabled: account.payouts_enabled,
            stripe_onboarding_complete: 
              (account.requirements?.currently_due?.length || 0) === 0 &&
              (account.requirements?.past_due?.length || 0) === 0,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_account_id", account.id);

        if (error) {
          logStep("ERROR: Failed to update venue Stripe status", { error: error.message });
        } else {
          logStep("Venue Stripe status updated", { accountId: account.id });
        }
        break;
      }

      case "transfer.created": {
        const transfer = event.data.object as Stripe.Transfer;
        logStep("Transfer created", {
          transferId: transfer.id,
          amount: transfer.amount,
          currency: transfer.currency,
          destination: transfer.destination,
          metadata: transfer.metadata,
        });

        // Update ledger entry if exists
        if (transfer.metadata?.venue_id) {
          await supabaseAdmin
            .from("venue_ledger_entries")
            .update({ paid_at: new Date().toISOString() })
            .eq("stripe_transfer_id", transfer.id);
        }
        break;
      }

      case "payout.paid": {
        const payout = event.data.object as Stripe.Payout;
        logStep("Payout paid", {
          payoutId: payout.id,
          amount: payout.amount,
          currency: payout.currency,
          arrivalDate: payout.arrival_date,
        });
        break;
      }

      case "payout.failed": {
        const payout = event.data.object as Stripe.Payout;
        logStep("Payout failed", {
          payoutId: payout.id,
          amount: payout.amount,
          failureCode: payout.failure_code,
          failureMessage: payout.failure_message,
        });
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription event", {
          eventType: event.type,
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription cancelled", {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
        });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Invoice paid", {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          amountPaid: invoice.amount_paid,
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Invoice payment failed", {
          invoiceId: invoice.id,
          customerId: invoice.customer,
        });
        break;
      }

      default:
        logStep("Unhandled event type", { eventType: event.type });
    }

    // Log successful webhook processing
    await logWebhookEvent(event.id, event.type, event.data.object, 200, "success");

    return new Response(JSON.stringify({ received: true, eventType: event.type }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logStep("ERROR: Processing webhook", { error: errorMessage, eventType: event.type });

    // Log failed webhook processing
    await logWebhookEvent(event.id, event.type, event.data.object, 500, undefined, errorMessage);

    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
