import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generatePrefillId(): string {
  return `pf_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  );

  try {
    // Auth required
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = userData.user.id;
    const { action, prefill_id, url, title, selected_text, timestamp } = await req.json();

    // CREATE prefill
    if (action === 'create') {
      if (!selected_text || selected_text.length < 1) {
        return new Response(
          JSON.stringify({ error: 'selected_text is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const newPrefillId = generatePrefillId();

      const { error: insertError } = await supabaseClient
        .from('synth_prefills')
        .insert({
          prefill_id: newPrefillId,
          user_id: userId,
          url: url || null,
          title: title || null,
          selected_text,
          timestamp: timestamp || Date.now()
        });

      if (insertError) {
        console.error('[PREFILL] Insert error:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to create prefill' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[PREFILL] Created prefill ${newPrefillId} for user ${userId}`);

      return new Response(
        JSON.stringify({ prefill_id: newPrefillId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET prefill
    if (action === 'get') {
      if (!prefill_id) {
        return new Response(
          JSON.stringify({ error: 'prefill_id is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // CRITICAL SECURITY: Only return prefill if it belongs to the authenticated user
      const { data: prefill, error: selectError } = await supabaseClient
        .from('synth_prefills')
        .select('*')
        .eq('prefill_id', prefill_id)
        .eq('user_id', userId) // User-scoped!
        .eq('consumed', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (selectError || !prefill) {
        console.log(`[PREFILL] Not found or unauthorized: ${prefill_id}`);
        return new Response(
          JSON.stringify({ error: 'Prefill not found or expired' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Mark as consumed
      await supabaseClient
        .from('synth_prefills')
        .update({ consumed: true })
        .eq('id', prefill.id);

      console.log(`[PREFILL] Retrieved and consumed prefill ${prefill_id}`);

      return new Response(
        JSON.stringify({
          url: prefill.url,
          title: prefill.title,
          selected_text: prefill.selected_text,
          timestamp: prefill.timestamp
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use "create" or "get"' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[PREFILL] Error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
