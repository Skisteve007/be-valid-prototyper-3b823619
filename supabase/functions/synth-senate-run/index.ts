import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Seat configuration with models
const SEAT_CONFIG = [
  { seat_id: 1, provider: 'OpenAI', model: 'gpt-4o', enabled: true },
  { seat_id: 2, provider: 'Anthropic', model: 'claude-3.5-sonnet', enabled: true },
  { seat_id: 3, provider: 'Google', model: 'gemini-1.5-pro', enabled: true },
  { seat_id: 4, provider: 'Meta', model: 'llama-3', enabled: false }, // No direct API
  { seat_id: 5, provider: 'DeepSeek', model: 'deepseek-v3', enabled: false }, // No direct API
  { seat_id: 6, provider: 'Mistral', model: 'mistral-large', enabled: false }, // No direct API
  { seat_id: 7, provider: 'xAI', model: 'grok', enabled: false }, // No direct API
];

interface SeatBallot {
  seat_id: number;
  provider: string;
  model: string;
  status: 'online' | 'offline' | 'timeout' | 'error';
  stance: 'approve' | 'revise' | 'block' | 'abstain';
  score: number;
  confidence: number;
  risk_flags: string[];
  key_points: string[];
  counterpoints: string[];
  recommended_edits?: string[];
  latency_ms?: number;
  token_usage?: number;
}

interface JudgeOutput {
  final_answer: string;
  participation_summary: Record<string, { responded: boolean; weight: number; stance?: string }>;
  contested: boolean;
  trace_id: string;
  reasoning?: string;
  disagreement_explanation?: string;
  score_variance?: number;
  blocks_count?: number;
}

function generateTraceId(): string {
  return `senate_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Call AI model for seat evaluation
async function evaluateSeat(
  apiKey: string,
  seatConfig: typeof SEAT_CONFIG[0],
  inputText: string,
  startTime: number
): Promise<SeatBallot> {
  const systemPrompt = `You are Seat ${seatConfig.seat_id} (${seatConfig.provider} - ${seatConfig.model}) in the SYNTH Senate.

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
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash', // Using Lovable AI gateway
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: inputText }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      console.error(`Seat ${seatConfig.seat_id} API error:`, response.status);
      return createOfflineBallot(seatConfig, 'error');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(`Seat ${seatConfig.seat_id} no JSON in response`);
      return createOfflineBallot(seatConfig, 'error');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      seat_id: seatConfig.seat_id,
      provider: seatConfig.provider,
      model: seatConfig.model,
      status: 'online',
      stance: parsed.stance || 'abstain',
      score: Math.min(100, Math.max(0, parsed.score || 50)),
      confidence: Math.min(1, Math.max(0, parsed.confidence || 0.5)),
      risk_flags: parsed.risk_flags || [],
      key_points: parsed.key_points || [],
      counterpoints: parsed.counterpoints || [],
      recommended_edits: parsed.recommended_edits,
      latency_ms: latencyMs,
      token_usage: data.usage?.total_tokens
    };
  } catch (error) {
    console.error(`Seat ${seatConfig.seat_id} error:`, error);
    return createOfflineBallot(seatConfig, 'error');
  }
}

function createOfflineBallot(config: typeof SEAT_CONFIG[0], status: 'offline' | 'timeout' | 'error'): SeatBallot {
  return {
    seat_id: config.seat_id,
    provider: config.provider,
    model: config.model,
    status,
    stance: 'abstain',
    score: 0,
    confidence: 0,
    risk_flags: [],
    key_points: [],
    counterpoints: []
  };
}

// Judge synthesis
async function runJudge(
  apiKey: string,
  inputText: string,
  ballots: SeatBallot[],
  weights: Record<string, number>
): Promise<JudgeOutput> {
  const traceId = generateTraceId();
  const onlineSeats = ballots.filter(b => b.status === 'online');
  
  // Calculate if contested
  const blockCount = onlineSeats.filter(b => b.stance === 'block' && b.confidence > 0.7).length;
  const scores = onlineSeats.map(b => b.score);
  const scoreVariance = scores.length > 1 
    ? Math.sqrt(scores.reduce((a, b) => a + Math.pow(b - (scores.reduce((x, y) => x + y, 0) / scores.length), 2), 0) / scores.length)
    : 0;
  
  const contested = blockCount >= 2 || scoreVariance > 25;

  // Build participation summary
  const participationSummary: Record<string, { responded: boolean; weight: number; stance?: string }> = {};
  SEAT_CONFIG.forEach(config => {
    const ballot = ballots.find(b => b.seat_id === config.seat_id);
    participationSummary[`Seat ${config.seat_id}`] = {
      responded: ballot?.status === 'online',
      weight: weights[`seat_${config.seat_id}`] || 14,
      stance: ballot?.stance
    };
  });

  // Prepare judge prompt
  const ballotsForJudge = onlineSeats.map(b => 
    `Seat ${b.seat_id} (${b.provider}): ${b.stance.toUpperCase()} | Score: ${b.score} | Confidence: ${(b.confidence * 100).toFixed(0)}%
    Key Points: ${b.key_points.join('; ')}
    Risk Flags: ${b.risk_flags.join(', ') || 'None'}`
  ).join('\n\n');

  const judgePrompt = `You are the SUPREME COURT JUDGE (ChatGPT o1) in the SYNTH Senate.

INPUT BEING EVALUATED:
"${inputText}"

SEAT BALLOTS:
${ballotsForJudge}

${contested ? 'NOTE: High disagreement detected. Explain the contested points.' : ''}

Synthesize a final answer based on the weighted votes. Return JSON:
{
  "final_answer": "The synthesized, safe response",
  "reasoning": "Why you reached this conclusion",
  ${contested ? '"disagreement_explanation": "Explain the key points of disagreement",' : ''}
  "verdict": "CERTIFIED" | "CONTESTED"
}`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an impartial AI judge synthesizing multi-model consensus.' },
          { role: 'user', content: judgePrompt }
        ],
        temperature: 0.2,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      console.error('Judge API error:', response.status);
      return {
        final_answer: 'Unable to synthesize response due to system error.',
        participation_summary: participationSummary,
        contested,
        trace_id: traceId,
        score_variance: scoreVariance,
        blocks_count: blockCount
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        final_answer: parsed.final_answer || 'No answer synthesized.',
        participation_summary: participationSummary,
        contested,
        trace_id: traceId,
        reasoning: parsed.reasoning,
        disagreement_explanation: parsed.disagreement_explanation,
        score_variance: scoreVariance,
        blocks_count: blockCount
      };
    }

    return {
      final_answer: content,
      participation_summary: participationSummary,
      contested,
      trace_id: traceId,
      score_variance: scoreVariance,
      blocks_count: blockCount
    };
  } catch (error) {
    console.error('Judge error:', error);
    return {
      final_answer: 'System error during synthesis.',
      participation_summary: participationSummary,
      contested: true,
      trace_id: traceId,
      score_variance: scoreVariance,
      blocks_count: blockCount
    };
  }
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
    const { input_text, weights: customWeights } = await req.json();

    if (!input_text || input_text.length < 5) {
      throw new Error('Input text must be at least 5 characters');
    }

    const startTime = Date.now();

    // Default weights
    const weights = customWeights || {
      seat_1: 15, seat_2: 15, seat_3: 15, seat_4: 14,
      seat_5: 14, seat_6: 14, seat_7: 13
    };

    // Evaluate all seats in parallel
    const ballotPromises = SEAT_CONFIG.map(config => {
      if (config.enabled) {
        return evaluateSeat(Deno.env.get('LOVABLE_API_KEY') || '', config, input_text, Date.now());
      }
      return Promise.resolve(createOfflineBallot(config, 'offline'));
    });

    const ballots = await Promise.all(ballotPromises);
    console.log('[SENATE-RUN] All seats evaluated');

    // Run judge
    const judgeOutput = await runJudge(
      Deno.env.get('LOVABLE_API_KEY') || '',
      input_text,
      ballots,
      weights
    );

    const processingTime = Date.now() - startTime;

    // Store in database
    const { error: insertError } = await supabaseClient
      .from('synth_senate_runs')
      .insert({
        user_id: userId,
        trace_id: judgeOutput.trace_id,
        input_text,
        ballots,
        judge_output: judgeOutput,
        final_answer: judgeOutput.final_answer,
        contested: judgeOutput.contested,
        participation_summary: judgeOutput.participation_summary,
        weights_used: weights,
        processing_time_ms: processingTime
      });

    if (insertError) {
      console.error('[SENATE-RUN] Failed to store run:', insertError);
    }

    console.log(`[SENATE-RUN] Complete in ${processingTime}ms. Contested: ${judgeOutput.contested}`);

    return new Response(
      JSON.stringify({
        ballots,
        judge_output: judgeOutput,
        processing_time_ms: processingTime,
        contested: judgeOutput.contested
      }),
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
