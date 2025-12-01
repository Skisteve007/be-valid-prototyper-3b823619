import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify token and check expiration
    const { data: certificate, error: certError } = await supabase
      .from('safety_certificates')
      .select('*, profiles!inner(full_name, profile_image_url, member_id)')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (certError || !certificate) {
      console.error('Certificate lookup error:', certError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired certificate' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark as used
    await supabase
      .from('safety_certificates')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token);

    // Get the most recent verified test result
    const { data: order, error: orderError } = await supabase
      .from('lab_orders')
      .select('created_at, result_status')
      .eq('user_id', certificate.profiles.user_id)
      .eq('test_type', 'TOX_10_PANEL')
      .eq('result_status', 'negative')
      .eq('order_status', 'result_received')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (orderError) {
      console.error('Order lookup error:', orderError);
      return new Response(
        JSON.stringify({ error: 'No verified results found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return certificate data
    const certificateData = {
      member_id: certificate.profiles.member_id,
      full_name: certificate.profiles.full_name,
      profile_image_url: certificate.profiles.profile_image_url,
      test_type: '10-Panel Toxicology Screen',
      result: 'NEGATIVE',
      verified_date: new Date(order.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      expires_at: certificate.expires_at
    };

    console.log('Certificate viewed successfully:', certificateData);

    return new Response(
      JSON.stringify(certificateData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in view-safety-certificate function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});