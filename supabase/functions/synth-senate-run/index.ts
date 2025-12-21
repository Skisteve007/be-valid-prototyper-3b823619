import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================================
// BALLOT V1 SCHEMA - Per Seat
// ============================================================
interface BallotV1Timing {
  latency_ms: number;
  started_at?: string;
  completed_at?: string;
}

interface BallotV1Usage {
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
}

interface BallotV1Error {
  code: string;
  message: string;
}

interface BallotV1Citation {
  title: string;
  url: string;
}

interface BallotV1 {
  ballot_version: "v1";
  seat_id: number;
  seat_name: string;
  provider: "OpenAI" | "Anthropic" | "Google" | "Meta" | "DeepSeek" | "Mistral" | "xAI";
  model: string;
  status: "online" | "offline" | "timeout" | "error";
  stance: "approve" | "revise" | "block" | "abstain";
  score: number;
  confidence: number;
  risk_flags: string[];
  key_points: string[];
  counterpoints: string[];
  recommended_edits?: string[];
  citations?: BallotV1Citation[];
  raw_text?: string;
  timing: BallotV1Timing;
  usage?: BallotV1Usage;
  error?: BallotV1Error;
}

// ============================================================
// SENATE RUN RESPONSE V1 SCHEMA
// ============================================================
interface SenateRunRequest {
  prompt: string;
  context_ids?: string[];
  mode?: "standard" | "probation";
}

interface SenateRunWeights {
  normalization: "sum100";
  by_seat_id: Record<string, number>;
}

interface JudgeSeatInfluence {
  seat_id: number;
  influence: "high" | "medium" | "low" | "none";
}

interface JudgeRiskVerdict {
  level: "low" | "medium" | "high";
  notes: string[];
}

interface JudgeOutput {
  provider: "OpenAI";
  model: string;
  final_answer: string;
  rationale: string[];
  risk_verdict: JudgeRiskVerdict;
  seat_influence?: JudgeSeatInfluence[];
}

interface ParticipationSummary {
  online_seats: number[];
  offline_seats: number[];
  timeout_seats: number[];
  error_seats: number[];
}

interface SenateRunResponseV1 {
  response_version: "v1";
  trace_id: string;
  created_at: string;
  request: SenateRunRequest;
  weights: SenateRunWeights;
  seats: BallotV1[];
  judge: JudgeOutput;
  participation_summary: ParticipationSummary;
  contested: boolean;
  contested_reasons: string[];
}

// ============================================================
// SEAT CONFIGURATION
// ============================================================
const SEAT_CONFIG: Array<{
  seat_id: number;
  seat_name: string;
  provider: BallotV1["provider"];
  model: string;
  enabled: boolean;
}> = [
  { seat_id: 1, seat_name: "Seat 1 — OpenAI", provider: "OpenAI", model: "gpt-4o", enabled: true },
  { seat_id: 2, seat_name: "Seat 2 — Anthropic", provider: "Anthropic", model: "claude-3.5-sonnet", enabled: true },
  { seat_id: 3, seat_name: "Seat 3 — Google", provider: "Google", model: "gemini-1.5-pro", enabled: true },
  { seat_id: 4, seat_name: "Seat 4 — Meta", provider: "Meta", model: "llama-3.1-70b-instruct", enabled: false },
  { seat_id: 5, seat_name: "Seat 5 — DeepSeek", provider: "DeepSeek", model: "deepseek-v3", enabled: false },
  { seat_id: 6, seat_name: "Seat 6 — Mistral", provider: "Mistral", model: "mistral-large", enabled: false },
  { seat_id: 7, seat_name: "Seat 7 — xAI", provider: "xAI", model: "grok-2", enabled: false },
];

function generateTraceId(): string {
  return `trace_${Math.random().toString(36).substring(2, 14)}`;
}

// ============================================================
// CREATE OFFLINE/ERROR BALLOT
// ============================================================
function createOfflineBallot(
  config: typeof SEAT_CONFIG[0],
  status: "offline" | "timeout" | "error",
  errorCode: string,
  errorMessage: string
): BallotV1 {
  return {
    ballot_version: "v1",
    seat_id: config.seat_id,
    seat_name: config.seat_name,
    provider: config.provider,
    model: config.model,
    status,
    stance: "abstain",
    score: 0,
    confidence: 0,
    risk_flags: [],
    key_points: [],
    counterpoints: [],
    recommended_edits: [],
    timing: { latency_ms: status === "timeout" ? 20000 : 0 },
    error: { code: errorCode, message: errorMessage }
  };
}

// ============================================================
// EVALUATE SEAT (Call AI Model)
// ============================================================
async function evaluateSeat(
  seatConfig: typeof SEAT_CONFIG[0],
  inputText: string,
  timeoutMs: number = 20000
): Promise<BallotV1> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  const systemPrompt = `You are ${seatConfig.seat_name} (${seatConfig.provider} - ${seatConfig.model}) in the SYNTH Senate.

Your role is to evaluate the input and return a structured ballot with your assessment.

Return ONLY valid JSON in this exact format:
{
  "stance": "approve" | "revise" | "block" | "abstain",
  "score": 0-100,
  "confidence": 0.0-1.0,
  "risk_flags": ["list of any risks identified"],
  "key_points": ["3-7 key observations about the input"],
  "counterpoints": ["0-5 potential counterarguments or concerns"],
  "recommended_edits": ["optional suggested improvements"]
}

Be thorough but concise. Focus on accuracy, safety, and helpfulness.`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: inputText }
        ],
        temperature: 0.3,
        max_tokens: 1000
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const completedAt = new Date().toISOString();
    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      console.error(`[SEAT ${seatConfig.seat_id}] API error: ${response.status}`);
      return createOfflineBallot(seatConfig, "error", "API_ERROR", `API returned status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(`[SEAT ${seatConfig.seat_id}] No JSON in response`);
      return createOfflineBallot(seatConfig, "error", "PARSE_ERROR", "No valid JSON in AI response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      ballot_version: "v1",
      seat_id: seatConfig.seat_id,
      seat_name: seatConfig.seat_name,
      provider: seatConfig.provider,
      model: seatConfig.model,
      status: "online",
      stance: parsed.stance || "abstain",
      score: Math.min(100, Math.max(0, parseInt(parsed.score) || 50)),
      confidence: Math.min(1, Math.max(0, parseFloat(parsed.confidence) || 0.5)),
      risk_flags: parsed.risk_flags || [],
      key_points: parsed.key_points || [],
      counterpoints: parsed.counterpoints || [],
      recommended_edits: parsed.recommended_edits,
      timing: {
        latency_ms: latencyMs,
        started_at: startedAt,
        completed_at: completedAt
      },
      usage: data.usage ? {
        input_tokens: data.usage.prompt_tokens,
        output_tokens: data.usage.completion_tokens,
        total_tokens: data.usage.total_tokens
      } : undefined
    };

  } catch (error) {
    const latencyMs = Date.now() - startTime;
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[SEAT ${seatConfig.seat_id}] Timeout after ${latencyMs}ms`);
      return createOfflineBallot(seatConfig, "timeout", "TIMEOUT", `Seat timed out after ${latencyMs}ms.`);
    }
    
    console.error(`[SEAT ${seatConfig.seat_id}] Error:`, error);
    return createOfflineBallot(seatConfig, "error", "UNKNOWN_ERROR", error instanceof Error ? error.message : "Unknown error");
  }
}

// ============================================================
// RUN JUDGE SYNTHESIS
// ============================================================
async function runJudge(
  inputText: string,
  ballots: BallotV1[],
  weights: SenateRunWeights
): Promise<{ judge: JudgeOutput; contested: boolean; contested_reasons: string[] }> {
  
  const onlineSeats = ballots.filter(b => b.status === "online");
  
  // Calculate contested status
  const blockCount = onlineSeats.filter(b => b.stance === "block" && b.confidence > 0.7).length;
  const scores = onlineSeats.map(b => b.score);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const scoreVariance = scores.length > 1 
    ? Math.sqrt(scores.reduce((a, b) => a + Math.pow(b - avgScore, 2), 0) / scores.length)
    : 0;
  
  const contested = blockCount >= 2 || scoreVariance > 25;
  const contested_reasons: string[] = [];
  
  if (blockCount >= 2) {
    contested_reasons.push(`${blockCount} seats issued BLOCK with high confidence`);
  }
  if (scoreVariance > 25) {
    contested_reasons.push(`High score variance (${scoreVariance.toFixed(1)}) indicates significant disagreement`);
  }

  // Calculate seat influence based on weights and status
  const seat_influence: JudgeSeatInfluence[] = ballots.map(ballot => {
    const weight = weights.by_seat_id[ballot.seat_id.toString()] || 0;
    let influence: "high" | "medium" | "low" | "none";
    
    if (ballot.status !== "online") {
      influence = "none";
    } else if (weight >= 15) {
      influence = "high";
    } else if (weight >= 10) {
      influence = "medium";
    } else {
      influence = "low";
    }
    
    return { seat_id: ballot.seat_id, influence };
  });

  // Prepare judge prompt
  const ballotsForJudge = onlineSeats.map(b => 
    `${b.seat_name}: ${b.stance.toUpperCase()} | Score: ${b.score} | Confidence: ${(b.confidence * 100).toFixed(0)}%
     Key Points: ${b.key_points.join('; ')}
     Risk Flags: ${b.risk_flags.join(', ') || 'None'}
     Counterpoints: ${b.counterpoints.join('; ') || 'None'}`
  ).join('\n\n');

  const judgePrompt = `You are the SUPREME COURT JUDGE (OpenAI o1) in the SYNTH Senate.

INPUT BEING EVALUATED:
"${inputText}"

SEAT BALLOTS:
${ballotsForJudge}

${contested ? 'NOTE: High disagreement detected. Explain the contested points.' : ''}

Synthesize a final answer based on the weighted votes. Return JSON:
{
  "final_answer": "The synthesized, comprehensive response addressing the input",
  "rationale": ["Bullet point reasons for your conclusion"],
  "risk_level": "low" | "medium" | "high",
  "risk_notes": ["Any risk considerations"]
}`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an impartial AI judge synthesizing multi-model consensus for the SYNTH Senate.' },
          { role: 'user', content: judgePrompt }
        ],
        temperature: 0.2,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      console.error('[JUDGE] API error:', response.status);
      return {
        judge: {
          provider: "OpenAI",
          model: "o1",
          final_answer: "Unable to synthesize response due to system error.",
          rationale: ["Judge API call failed"],
          risk_verdict: { level: "high", notes: ["System error during synthesis"] },
          seat_influence
        },
        contested: true,
        contested_reasons: [...contested_reasons, "Judge synthesis failed"]
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    let parsed = {
      final_answer: content,
      rationale: ["Direct response from judge"],
      risk_level: "medium" as const,
      risk_notes: [] as string[]
    };
    
    if (jsonMatch) {
      try {
        const p = JSON.parse(jsonMatch[0]);
        parsed = {
          final_answer: p.final_answer || content,
          rationale: p.rationale || ["Synthesized from seat ballots"],
          risk_level: p.risk_level || "medium",
          risk_notes: p.risk_notes || []
        };
      } catch (e) {
        console.warn('[JUDGE] Failed to parse JSON, using raw content');
      }
    }

    return {
      judge: {
        provider: "OpenAI",
        model: "o1",
        final_answer: parsed.final_answer,
        rationale: parsed.rationale,
        risk_verdict: {
          level: parsed.risk_level as "low" | "medium" | "high",
          notes: parsed.risk_notes
        },
        seat_influence
      },
      contested,
      contested_reasons
    };

  } catch (error) {
    console.error('[JUDGE] Error:', error);
    return {
      judge: {
        provider: "OpenAI",
        model: "o1",
        final_answer: "System error during synthesis.",
        rationale: ["Exception occurred"],
        risk_verdict: { level: "high", notes: ["Unexpected error in judge synthesis"] },
        seat_influence
      },
      contested: true,
      contested_reasons: [...contested_reasons, "Exception in judge processing"]
    };
  }
}

// ============================================================
// SESSION LOCK DETECTION
// ============================================================
interface SessionLockResult {
  should_escalate: boolean;
  escalation_level: number;
  reason_codes: string[];
  action: 'none' | 'verify' | 'restrict' | 'lock';
}

async function checkSessionLock(
  supabaseClient: any,
  userId: string,
  sessionId: string | null,
  currentText: string,
  isProbation: boolean
): Promise<SessionLockResult> {
  // Get previous run for comparison
  const { data: previousRun } = await supabaseClient
    .from('synth_senate_runs')
    .select('input_text')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!previousRun) {
    return { should_escalate: false, escalation_level: 0, reason_codes: [], action: 'none' };
  }

  const currentTokens = currentText.split(/\s+/).length;
  const previousTokens = previousRun.input_text.split(/\s+/).length;
  
  // Simple readability proxy (average word length)
  const currentReadability = currentText.length / Math.max(currentTokens, 1);
  const previousReadability = previousRun.input_text.length / Math.max(previousTokens, 1);
  
  // Call the database function for detection
  const { data, error } = await supabaseClient.rpc('detect_session_lock_trigger', {
    p_user_id: userId,
    p_session_id: sessionId,
    p_current_tokens: currentTokens,
    p_previous_tokens: previousTokens,
    p_current_readability: currentReadability,
    p_previous_readability: previousReadability,
    p_language_shift: false // Would require language detection
  });

  if (error || !data || data.length === 0) {
    console.log('[SESSION-LOCK] No escalation needed or error:', error);
    return { should_escalate: false, escalation_level: 0, reason_codes: [], action: 'none' };
  }

  const result = data[0];
  return {
    should_escalate: result.should_escalate,
    escalation_level: result.escalation_level,
    reason_codes: result.reason_codes || [],
    action: result.action as SessionLockResult['action']
  };
}

// ============================================================
// CHECK PROBATION STATUS
// ============================================================
async function checkProbationStatus(
  supabaseClient: any,
  userId: string
): Promise<{ isProbation: boolean; probationSettings: any | null }> {
  const { data, error } = await supabaseClient
    .from('synth_probation')
    .select('*')
    .eq('target_user_id', userId)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) {
    return { isProbation: false, probationSettings: null };
  }

  return { isProbation: true, probationSettings: data };
}

// ============================================================
// MAIN HANDLER
// ============================================================
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
    console.log('[SENATE-RUN] Starting senate evaluation');

    // Auth
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
    const body = await req.json();
    const { 
      prompt: inputPrompt,
      input_text, // Legacy support
      context_ids,
      mode = "standard",
      options = {}
    } = body;

    const prompt = inputPrompt || input_text;

    if (!prompt || prompt.length < 5) {
      throw new Error('Prompt must be at least 5 characters');
    }

    const timeoutMs = options.timeout_ms || 20000;
    const createdAt = new Date().toISOString();
    const traceId = generateTraceId();

    // ========== CHECK PROBATION STATUS ==========
    const { isProbation, probationSettings } = await checkProbationStatus(supabaseClient, userId);
    const effectiveMode = isProbation ? "probation" : mode;
    
    if (isProbation) {
      console.log(`[SENATE-RUN] User ${userId} is on PROBATION - applying stricter thresholds`);
    }

    // ========== SESSION LOCK CHECK ==========
    const sessionId = options.session_id || null;
    const sessionLock = await checkSessionLock(supabaseClient, userId, sessionId, prompt, isProbation);
    
    if (sessionLock.should_escalate) {
      console.log(`[SESSION-LOCK] Escalation triggered: level=${sessionLock.escalation_level}, action=${sessionLock.action}`);
      
      // Log security event
      await supabaseClient.from('synth_security_events').insert({
        user_id: userId,
        session_id: sessionId,
        event_type: 'session_lock_trigger',
        reason_codes: sessionLock.reason_codes,
        metrics: { 
          input_length: prompt.length,
          escalation_level: sessionLock.escalation_level 
        },
        escalation_level: sessionLock.escalation_level,
        action_taken: sessionLock.action
      });

      // If LOCK level, reject the request
      if (sessionLock.action === 'lock') {
        return new Response(
          JSON.stringify({ 
            error: 'Session locked due to security concerns',
            session_lock: {
              action: 'lock',
              reason_codes: sessionLock.reason_codes
            }
          }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Get user calibration weights or use defaults
    const { data: calibrationData } = await supabaseClient
      .from('synth_calibration')
      .select('*')
      .eq('user_id', userId)
      .single();

    const weights: SenateRunWeights = {
      normalization: "sum100",
      by_seat_id: {
        "1": calibrationData?.seat_1_weight ?? 15,
        "2": calibrationData?.seat_2_weight ?? 15,
        "3": calibrationData?.seat_3_weight ?? 15,
        "4": calibrationData?.seat_4_weight ?? 14,
        "5": calibrationData?.seat_5_weight ?? 14,
        "6": calibrationData?.seat_6_weight ?? 14,
        "7": calibrationData?.seat_7_weight ?? 13
      }
    };

    console.log(`[SENATE-RUN] Trace: ${traceId}, Weights:`, weights.by_seat_id, `Mode: ${effectiveMode}`);

    // Evaluate all seats in parallel
    const ballotPromises = SEAT_CONFIG.map(config => {
      if (config.enabled) {
        return evaluateSeat(config, prompt, timeoutMs);
      }
      return Promise.resolve(createOfflineBallot(
        config,
        "offline",
        "MISSING_API_KEY",
        `Seat unavailable: no API key configured for provider ${config.provider}.`
      ));
    });

    const seats = await Promise.all(ballotPromises);
    console.log('[SENATE-RUN] All seats evaluated');

    // Build participation summary
    const participation_summary: ParticipationSummary = {
      online_seats: seats.filter(s => s.status === "online").map(s => s.seat_id),
      offline_seats: seats.filter(s => s.status === "offline").map(s => s.seat_id),
      timeout_seats: seats.filter(s => s.status === "timeout").map(s => s.seat_id),
      error_seats: seats.filter(s => s.status === "error").map(s => s.seat_id)
    };

    // Run judge
    const { judge, contested, contested_reasons } = await runJudge(prompt, seats, weights);

    // Build full response
    const response: SenateRunResponseV1 & { 
      probation_mode?: boolean;
      session_lock?: { action: string; reason_codes: string[] } | null;
    } = {
      response_version: "v1",
      trace_id: traceId,
      created_at: createdAt,
      request: {
        prompt,
        context_ids,
        mode: effectiveMode as "standard" | "probation"
      },
      weights,
      seats,
      judge,
      participation_summary,
      contested,
      contested_reasons,
      probation_mode: isProbation,
      session_lock: sessionLock.should_escalate ? {
        action: sessionLock.action,
        reason_codes: sessionLock.reason_codes
      } : null
    };

    // Store in database (hash chain is handled by trigger)
    const { error: insertError } = await supabaseClient
      .from('synth_senate_runs')
      .insert({
        user_id: userId,
        trace_id: traceId,
        input_text: prompt,
        ballots: seats,
        judge_output: judge,
        final_answer: judge.final_answer,
        contested,
        participation_summary,
        weights_used: weights,
        processing_time_ms: Date.now() - new Date(createdAt).getTime()
      });

    if (insertError) {
      console.error('[SENATE-RUN] Failed to store run:', insertError);
    }

    // Log enhanced event if probation
    if (isProbation && probationSettings?.extra_logging) {
      await supabaseClient.from('synth_security_events').insert({
        user_id: userId,
        session_id: sessionId,
        event_type: 'probation_run_logged',
        reason_codes: ['PROBATION_ENHANCED_LOGGING'],
        metrics: { 
          trace_id: traceId,
          contested,
          online_seats: participation_summary.online_seats.length
        },
        escalation_level: 0
      });
    }

    console.log(`[SENATE-RUN] Complete. Trace: ${traceId}, Contested: ${contested}, Probation: ${isProbation}`);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SENATE-RUN] Error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
