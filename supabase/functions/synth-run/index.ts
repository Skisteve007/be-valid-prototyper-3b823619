import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TIERS = ['Initiate', 'Operator', 'Architect', 'Oracle', 'Apex'] as const;
const POLICY_VERSION = 'POL-1.0';
const BOARD_PROFILE = 'BOARD-A';

interface SynthRunRequest {
  template_id: string;
  input_text: string;
  source_url?: string;
  client_meta?: Record<string, unknown>;
  ranking_window: '7d' | '30d' | '60d' | '90d';
}

// Simple hash function for input text
function hashText(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

// Determine tier based on synth_index
function getTier(synthIndex: number): typeof TIERS[number] {
  if (synthIndex >= 95) return 'Apex';
  if (synthIndex >= 85) return 'Oracle';
  if (synthIndex >= 70) return 'Architect';
  if (synthIndex >= 50) return 'Operator';
  return 'Initiate';
}

// Determine percentile based on synth_index
function getPercentile(synthIndex: number): number {
  if (synthIndex >= 99) return 1;
  if (synthIndex >= 95) return 5;
  if (synthIndex >= 90) return 10;
  if (synthIndex >= 75) return 25;
  return 50;
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
    console.log('[SYNTH-RUN] Starting evaluation');

    // Auth required
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error('Invalid authentication');
    }

    const userId = userData.user.id;
    console.log('[SYNTH-RUN] User authenticated:', userId);

    // Check entitlement
    const { data: entitlement, error: entError } = await supabaseClient
      .rpc('get_or_create_synth_entitlement', { p_user_id: userId });

    if (entError) {
      console.error('[SYNTH-RUN] Entitlement error:', entError);
      throw new Error('Failed to check entitlement');
    }

    if (!entitlement) {
      return new Response(
        JSON.stringify({ 
          error: 'No active entitlement', 
          locked: true,
          message: 'Trial expired. Please purchase a ranking window pass.' 
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[SYNTH-RUN] Entitlement valid:', entitlement.plan);

    // Parse request
    const body: SynthRunRequest = await req.json();
    const { template_id, input_text, source_url, client_meta, ranking_window } = body;

    if (!input_text || input_text.length < 10) {
      throw new Error('Input text must be at least 10 characters');
    }

    const startTime = Date.now();
    const inputHash = hashText(input_text);
    const hostname = source_url ? new URL(source_url).hostname : null;

    // ============================================
    // SYNTH Multi-Judge Evaluation Pipeline
    // (Proprietary - model names not exposed)
    // ============================================

    // Call Lovable AI Gateway for multi-judge evaluation
    const systemPrompt = `You are the SYNTH Board, a proprietary multi-judge frontier evaluation system.

EVALUATION CRITERIA:
1. COHERENCE (0-100): Logical consistency, clear reasoning, structured argumentation
2. VERIFICATION (0-100): Factual accuracy, verifiable claims, proper citations
3. CONSTRAINT_DISCIPLINE (0-100): Adherence to instructions, staying on topic
4. OMISSION_RESISTANCE (0-100): Completeness, addressing all aspects
5. ADAPTATION (0-100): Context awareness, appropriate tone and style

TEMPLATE: ${template_id}

Evaluate the following text and return a JSON object with:
- synth_index: Overall score 0-100 (weighted average)
- coherence: 0-100
- verification: 0-100
- constraint_discipline: 0-100
- omission_resistance: 0-100
- adaptation: 0-100
- integrity_score: 0-100 (authenticity assessment)
- integrity_flags: array of any concerns (e.g., "potential_plagiarism", "inconsistent_style")
- reason_codes: array of evaluation notes (e.g., "strong_structure", "weak_citations")
- final_output: A brief board narrative (2-3 sentences, do NOT mention model names)

Return ONLY valid JSON, no other text.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-5-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input_text }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!aiResponse.ok) {
      console.error('[SYNTH-RUN] AI Gateway error:', await aiResponse.text());
      throw new Error('Evaluation service unavailable');
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || '';
    
    // Parse AI response
    let evaluation;
    try {
      // Extract JSON from response (handle potential markdown code blocks)
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in response');
      evaluation = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error('[SYNTH-RUN] Parse error:', parseErr, 'Raw:', rawContent);
      // Fallback to default scores
      evaluation = {
        synth_index: 65,
        coherence: 70,
        verification: 60,
        constraint_discipline: 65,
        omission_resistance: 60,
        adaptation: 70,
        integrity_score: 85,
        integrity_flags: [],
        reason_codes: ['evaluation_fallback'],
        final_output: 'Evaluation completed with standard parameters.'
      };
    }

    const synthIndex = Math.min(100, Math.max(0, evaluation.synth_index || 65));
    const tier = getTier(synthIndex);
    const percentile = getPercentile(synthIndex);
    const processingTime = Date.now() - startTime;

    // Get or create session
    const { data: sessionId } = await supabaseClient
      .rpc('get_or_create_synth_session', { 
        p_user_id: userId, 
        p_source: client_meta?.source === 'extension' ? 'extension' : 'console' 
      });

    // Store run in database
    const { data: run, error: runError } = await supabaseClient
      .from('synth_runs')
      .insert({
        user_id: userId,
        session_id: sessionId,
        template_id,
        template_category: template_id,
        input_hash: inputHash,
        input_length: input_text.length,
        source_url,
        source_hostname: hostname,
        source_type: client_meta?.source === 'extension' ? 'extension' : 'web',
        synth_index: synthIndex,
        tier,
        percentile,
        ranking_window,
        coherence_score: evaluation.coherence,
        verification_score: evaluation.verification,
        constraint_discipline_score: evaluation.constraint_discipline,
        omission_resistance_score: evaluation.omission_resistance,
        adaptation_score: evaluation.adaptation,
        integrity_score: evaluation.integrity_score,
        integrity_flags: evaluation.integrity_flags || [],
        reason_codes: evaluation.reason_codes || [],
        policy_version_id: POLICY_VERSION,
        board_profile_id: BOARD_PROFILE,
        final_output: evaluation.final_output,
        client_meta,
        processing_time_ms: processingTime
      })
      .select()
      .single();

    if (runError) {
      console.error('[SYNTH-RUN] Failed to store run:', runError);
    }

    // Decrement trial runs if applicable
    if (entitlement.plan === 'trial_24h') {
      await supabaseClient.rpc('decrement_synth_trial_run', { 
        p_entitlement_id: entitlement.id 
      });
    }

    // Get trend data (last 4 runs)
    const { data: trendData } = await supabaseClient
      .from('synth_runs')
      .select('synth_index')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(4);

    const trendPoints = (trendData || []).map(r => r.synth_index).reverse();

    console.log('[SYNTH-RUN] Evaluation complete:', { tier, synthIndex, percentile });

    return new Response(
      JSON.stringify({
        run_id: run?.id,
        synth_index: synthIndex,
        tier,
        percentile,
        dimension_scores: {
          coherence: evaluation.coherence,
          verification: evaluation.verification,
          constraint_discipline: evaluation.constraint_discipline,
          omission_resistance: evaluation.omission_resistance,
          adaptation: evaluation.adaptation
        },
        trend: { points: trendPoints },
        integrity: {
          score: evaluation.integrity_score,
          flags: evaluation.integrity_flags || []
        },
        reason_codes: evaluation.reason_codes || [],
        final_output: evaluation.final_output,
        processing_time_ms: processingTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SYNTH-RUN] Error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
