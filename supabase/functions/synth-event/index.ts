import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Valid event types matching the database enum
const VALID_EVENT_TYPES = [
  'PROMPT_SUBMITTED',
  'AUDIT_STARTED',
  'AUDIT_COMPLETED',
  'DECISION_VIEWED',
  'SAFE_ANSWER_COPIED',
  'SAFE_ANSWER_INSERTED',
  'USER_ACCEPTED_REWRITE',
  'USER_REJECTED_REWRITE',
  'USER_EDITED_AND_RESUBMITTED',
  'USER_CHANGED_RISKY_INTENT',
  'HUMAN_REVIEW_REQUESTED',
  'HUMAN_REVIEW_COMPLETED',
  'HUMAN_REVIEW_OVERRULED',
  'POLICY_BLOCK_TRIGGERED',
  'INJECTION_PATTERN_DETECTED',
  'TEMPLATE_DUPLICATION_DETECTED',
  'ANOMALY_SCORE_SPIKE_DETECTED',
];

const VALID_SOURCES = ['console', 'extension', 'partner', 'api'];

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      event_type, 
      request_id, 
      source = 'console',
      risk_decision,
      decision,
      coherence_score,
      verification_score,
      prompt_hash,
      answer_hash,
      metadata = {}
    } = await req.json();

    // Validate event_type
    if (!event_type || !VALID_EVENT_TYPES.includes(event_type)) {
      return new Response(
        JSON.stringify({ error: `Invalid event_type. Must be one of: ${VALID_EVENT_TYPES.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate source
    if (!VALID_SOURCES.includes(source)) {
      return new Response(
        JSON.stringify({ error: `Invalid source. Must be one of: ${VALID_SOURCES.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration missing");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header if present
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Call the log_synth_event function
    const { data: eventId, error } = await supabase.rpc('log_synth_event', {
      p_user_id: userId,
      p_event_type: event_type,
      p_request_id: request_id || null,
      p_source: source,
      p_risk_decision: risk_decision || null,
      p_decision: decision || null,
      p_coherence_score: coherence_score || null,
      p_verification_score: verification_score || null,
      p_prompt_hash: prompt_hash || null,
      p_answer_hash: answer_hash || null,
      p_metadata: metadata,
    });

    if (error) {
      console.error("Error logging event:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Event logged: ${event_type} (${eventId})`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        event_id: eventId,
        event_type,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});