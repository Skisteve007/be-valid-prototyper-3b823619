import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentSuccessRequest {
  userId: string;
  paymentAmount: string;
  paymentType: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    // Create client with anon key for auth verification
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } }
    });

    // Verify authentication
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { paymentAmount, paymentType }: Omit<PaymentSuccessRequest, 'userId'> = await req.json();
    
    // Use authenticated user's ID instead of client-provided userId
    const userId = user.id;
    
    console.log('Processing payment success for authenticated user:', userId, 'Type:', paymentType);

    // Initialize Supabase client with service key for profile updates
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Determine membership type and expiry period
    const isDriver14DayPass = paymentType === 'driver-14day';
    const isAnnualPass = paymentType?.toLowerCase().includes('annual') || 
                         paymentType?.toLowerCase().includes('year') || 
                         paymentType?.toLowerCase().includes('1-year') ||
                         paymentType === 'single-annual' ||
                         paymentType === 'couple-annual';
    
    // Calculate expiry date based on payment type
    const expiryDate = new Date();
    let expiryDays = 60; // Default: 60-day subscription
    
    if (isDriver14DayPass) {
      expiryDays = 14;
    } else if (isAnnualPass) {
      expiryDays = 365;
    }
    
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    // Prepare update object - always set expiry for paid memberships
    const profileUpdate: Record<string, any> = { 
      payment_status: 'paid',
      payment_date: new Date().toISOString(),
      status_expiry: expiryDate.toISOString()
    };

    // If it's a 14-day driver pass, also set status to green
    if (isDriver14DayPass) {
      profileUpdate.status_color = 'green';
    }
    
    console.log(`Setting membership expiry to: ${expiryDate.toISOString()} (${expiryDays}-day period, type: ${paymentType})`);

    // Update user profile
    const { data: profile, error: updateError } = await supabaseClient
      .from('profiles')
      .update(profileUpdate)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating profile:', updateError);
      throw new Error('Failed to update user profile');
    }

    console.log('Profile updated successfully:', profile);

    // Get user email for admin notification
    const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(userId);
    
    if (userError) {
      console.error('Error fetching user data:', userError);
    }

    const userEmail = userData?.user?.email || 'Unknown';
    const userName = profile?.full_name || 'New User';

    // Customize email subject and content based on payment type
    const emailSubject = isDriver14DayPass 
      ? "🚗 New Driver 14-Day Pass Purchase - Clean Check"
      : "🎉 New Payment Received - Clean Check";
    
    const membershipTypeDisplay = isDriver14DayPass 
      ? "Driver Verification Pass (14-Day)"
      : paymentType;

    // Send admin notification email
    try {
      const emailResponse = await resend.emails.send({
        from: "Clean Check <onboarding@resend.dev>",
        to: ["sgrillocce@gmail.com", "Office@bigtexasroof.com"],
        subject: emailSubject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">New Payment Received!</h1>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #1f2937;">Payment Details</h2>
              <p><strong>Member Name:</strong> ${userName}</p>
              <p><strong>Member ID:</strong> ${profile?.member_id || 'N/A'}</p>
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Amount:</strong> $${paymentAmount}</p>
              <p><strong>Membership Type:</strong> ${membershipTypeDisplay}</p>
              <p><strong>Payment Date:</strong> ${new Date().toLocaleString()}</p>
              <div style="background: #fef3c7; padding: 10px; border-radius: 4px; margin-top: 10px;">
                <strong>⏰ Membership Expiry:</strong> ${expiryDays}-day ${isAnnualPass ? 'annual pass' : isDriver14DayPass ? 'driver pass' : 'subscription'} expires on ${expiryDate.toLocaleDateString()}
              </div>
            </div>
            <p>The user's account has been automatically upgraded${isDriver14DayPass ? ' with a 14-day expiry' : ''}.</p>
            <p style="color: #6b7280; font-size: 14px;">This is an automated notification from Clean Check.</p>
          </div>
        `,
      });

      console.log("Admin notification email sent successfully:", emailResponse);
    } catch (emailError: any) {
      console.error("Failed to send admin notification email:", emailError);
      // Don't fail the entire request if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment processed successfully',
        profile: profile,
        isDriver14DayPass: isDriver14DayPass
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in process-payment-success function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);