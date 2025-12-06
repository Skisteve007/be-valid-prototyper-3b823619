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
    const { userId, platform, timestamp } = await req.json();

    console.log(`[LOG-SOCIAL-EMBED] Received request for user ${userId}, platform: ${platform}`);

    if (!userId || !platform) {
      console.error('[LOG-SOCIAL-EMBED] Missing required fields: userId or platform');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userId and platform' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role for admin access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert new analytics event into the dedicated table
    const { data, error } = await supabase
      .from('social_embed_analytics')
      .insert({
        user_id: userId,
        platform: platform,
        event_type: 'embed_copy',
        click_count: 0
      })
      .select();

    if (error) {
      console.error('[LOG-SOCIAL-EMBED] Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to log social embed event', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[LOG-SOCIAL-EMBED] Successfully logged embed event for user ${userId} to platform: ${platform} at ${timestamp}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Embed event logged for platform: ${platform}`,
        userId,
        platform,
        timestamp,
        analyticsId: data?.[0]?.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[LOG-SOCIAL-EMBED] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
