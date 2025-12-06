import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SurveyPayload {
  source_id: string;
  survey_type: 'member' | 'partner';
  responses: Record<string, string>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 1. Security Check: Only allow POST requests
  if (req.method !== 'POST') {
    console.log('[SURVEY] Method not allowed:', req.method);
    return new Response(
      JSON.stringify({ message: 'Method Not Allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const payload: SurveyPayload = await req.json();
    console.log('[SURVEY] Received payload:', JSON.stringify(payload));

    // 2. Validation: Ensure we have the identity and type
    if (!payload.source_id || !payload.survey_type || !payload.responses) {
      console.log('[SURVEY] Validation failed - missing required fields');
      return new Response(
        JSON.stringify({ message: 'Missing required source ID, type, or response data.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let result;

    // 3. Route to appropriate table based on survey type
    if (payload.survey_type === 'member') {
      console.log('[SURVEY] Processing member survey submission');
      
      const { data, error } = await supabase
        .from('member_beta_surveys')
        .insert({
          user_id: payload.source_id,
          ease_of_use: payload.responses.q1 || '',
          trust_in_security: payload.responses.q2 || '',
          qr_sharing_experience: payload.responses.q3 || '',
          missing_feature: payload.responses.q4 || null,
          recommendation_likelihood: payload.responses.q5 || null
        })
        .select('id')
        .single();

      if (error) {
        console.error('[SURVEY] Member survey insert error:', error);
        throw error;
      }
      
      result = data;
      console.log('[SURVEY] Member survey saved with ID:', result?.id);

    } else if (payload.survey_type === 'partner') {
      console.log('[SURVEY] Processing partner survey submission');
      
      const { data, error } = await supabase
        .from('partner_beta_surveys')
        .insert({
          partner_id: payload.source_id,
          revenue_share_rating: payload.responses.q1 || '',
          zero_trust_liability: payload.responses.q2 || '',
          staff_efficiency: payload.responses.q3 || '',
          deployment_barrier: payload.responses.q4 || null,
          missing_feature: payload.responses.q5 || null
        })
        .select('id')
        .single();

      if (error) {
        console.error('[SURVEY] Partner survey insert error:', error);
        throw error;
      }
      
      result = data;
      console.log('[SURVEY] Partner survey saved with ID:', result?.id);

    } else {
      console.log('[SURVEY] Invalid survey type:', payload.survey_type);
      return new Response(
        JSON.stringify({ message: 'Invalid survey type. Must be "member" or "partner".' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[BACKEND LOG] Successfully filed survey: ${payload.survey_type} from ID: ${payload.source_id}`);

    // 4. Respond to the frontend
    return new Response(
      JSON.stringify({ 
        message: 'Survey data successfully filed for admin review.', 
        record_id: result?.id 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[SURVEY] Error processing survey submission:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error during data filing.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
