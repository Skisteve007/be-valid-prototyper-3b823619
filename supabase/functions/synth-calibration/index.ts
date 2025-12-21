import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalibrationData {
  seat_1_weight: number;
  seat_2_weight: number;
  seat_3_weight: number;
  seat_4_weight: number;
  seat_5_weight: number;
  seat_6_weight: number;
  seat_7_weight: number;
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

    // Check if user is admin/employer
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .in('role', ['administrator', 'employer'])
      .single();

    const isEmployer = !!roleData;

    // GET calibration
    if (req.method === 'GET') {
      const { data: calibration, error } = await supabaseClient
        .from('synth_calibration')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Return default if none exists
      const defaultCalibration = {
        seat_1_weight: 15,
        seat_2_weight: 15,
        seat_3_weight: 15,
        seat_4_weight: 14,
        seat_5_weight: 14,
        seat_6_weight: 14,
        seat_7_weight: 13,
      };

      return new Response(
        JSON.stringify({
          calibration: calibration || defaultCalibration,
          is_employer: isEmployer
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PUT calibration (requires employer role)
    if (req.method === 'PUT') {
      if (!isEmployer) {
        return new Response(
          JSON.stringify({ error: 'Employer access required' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const body: CalibrationData = await req.json();

      // Validate weights sum to 100
      const total = body.seat_1_weight + body.seat_2_weight + body.seat_3_weight +
                    body.seat_4_weight + body.seat_5_weight + body.seat_6_weight + body.seat_7_weight;
      
      if (total !== 100) {
        return new Response(
          JSON.stringify({ error: `Weights must sum to 100 (current: ${total})` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check for existing calibration
      const { data: existing } = await supabaseClient
        .from('synth_calibration')
        .select('*')
        .eq('user_id', userId)
        .single();

      const oldValue = existing ? {
        seat_1_weight: existing.seat_1_weight,
        seat_2_weight: existing.seat_2_weight,
        seat_3_weight: existing.seat_3_weight,
        seat_4_weight: existing.seat_4_weight,
        seat_5_weight: existing.seat_5_weight,
        seat_6_weight: existing.seat_6_weight,
        seat_7_weight: existing.seat_7_weight,
      } : null;

      // Upsert calibration
      const { error: upsertError } = await supabaseClient
        .from('synth_calibration')
        .upsert({
          user_id: userId,
          ...body,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (upsertError) {
        throw upsertError;
      }

      // Log audit entry
      await supabaseClient
        .from('synth_calibration_audit')
        .insert({
          actor_user_id: userId,
          action_type: 'calibration_change',
          from_value: oldValue,
          to_value: body
        });

      console.log(`[CALIBRATION] Updated for user ${userId}`);

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[CALIBRATION] Error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
