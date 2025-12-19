import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate a unique request ID
function generateRequestId(): string {
  return `synth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Simple hash function for privacy
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

// PII/PHI detection patterns
const PII_PATTERNS = [
  { type: 'email', pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi },
  { type: 'phone', pattern: /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g },
  { type: 'ssn', pattern: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g },
  { type: 'credit_card', pattern: /\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/g },
  { type: 'name', pattern: /\b(Mr\.|Mrs\.|Ms\.|Dr\.)\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/g },
];

const PHI_PATTERNS = [
  { type: 'dob', pattern: /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](19|20)\d{2}\b/g },
  { type: 'medical_id', pattern: /\b(MRN|patient\s*id|medical\s*record)[:\s]*\d+\b/gi },
];

// Step A: Classify Risk
function classifyRisk(prompt: string): 'ALLOW' | 'RESTRICT' | 'BLOCK' {
  const lowerPrompt = prompt.toLowerCase();
  
  // Block patterns
  const blockPatterns = [
    /how\s+to\s+(make|create|build)\s+(bomb|weapon|explosive)/i,
    /hack\s+(into|someone)/i,
    /steal\s+(identity|credit\s*card)/i,
    /illegal\s+drug\s+(recipe|synthesis)/i,
  ];
  
  for (const pattern of blockPatterns) {
    if (pattern.test(lowerPrompt)) return 'BLOCK';
  }
  
  // Restrict patterns (need extra verification)
  const restrictPatterns = [
    /medical\s+(advice|diagnosis|treatment)/i,
    /legal\s+(advice|counsel)/i,
    /financial\s+(advice|investment)/i,
    /prescription|medication/i,
  ];
  
  for (const pattern of restrictPatterns) {
    if (pattern.test(lowerPrompt)) return 'RESTRICT';
  }
  
  return 'ALLOW';
}

// Step B: Sanitize prompt
function sanitizePrompt(prompt: string): { 
  sanitized: string; 
  piiDetected: boolean; 
  phiDetected: boolean; 
  entitiesRedacted: number;
} {
  let sanitized = prompt;
  let entitiesRedacted = 0;
  let piiDetected = false;
  let phiDetected = false;
  
  // Redact PII
  for (const { type, pattern } of PII_PATTERNS) {
    const matches = sanitized.match(pattern);
    if (matches) {
      piiDetected = true;
      entitiesRedacted += matches.length;
      sanitized = sanitized.replace(pattern, `[REDACTED_${type.toUpperCase()}]`);
    }
  }
  
  // Redact PHI
  for (const { type, pattern } of PHI_PATTERNS) {
    const matches = sanitized.match(pattern);
    if (matches) {
      phiDetected = true;
      entitiesRedacted += matches.length;
      sanitized = sanitized.replace(pattern, `[REDACTED_${type.toUpperCase()}]`);
    }
  }
  
  return { sanitized, piiDetected, phiDetected, entitiesRedacted };
}

// Call AI model with specific role
async function callAgent(
  apiKey: string, 
  role: 'skeptic' | 'optimist' | 'factchecker',
  prompt: string
): Promise<string> {
  const systemPrompts: Record<string, string> = {
    skeptic: `You are a SKEPTIC agent in a multi-model debate system. Your job is to:
- Identify potential risks, inaccuracies, or harmful implications in the user's request
- Point out what could go wrong if this request is answered carelessly
- Flag any claims that need verification
- Be critical but constructive
Respond in JSON format: { "risks": ["risk1", "risk2"], "concerns": "your main concern", "recommendation": "PROCEED_WITH_CAUTION" | "NEEDS_VERIFICATION" | "REFUSE" }`,
    
    optimist: `You are an OPTIMIST agent in a multi-model debate system. Your job is to:
- Provide the most helpful, accurate, and compliant answer possible
- Focus on what the user actually needs
- Ensure the response is safe and appropriate
- Add necessary disclaimers for sensitive topics
Respond in JSON format: { "answer": "your helpful response", "disclaimers": ["if any"], "confidence": 0.0-1.0 }`,
    
    factchecker: `You are a FACT-CHECKER agent in a multi-model debate system. Your job is to:
- Extract key factual claims from the request and proposed responses
- Assess which claims can be verified vs unverifiable
- Flag any contradictions or inconsistencies
Respond in JSON format: { "claims": [{"claim": "...", "status": "SUPPORTED" | "UNVERIFIED" | "CONTRADICTED", "notes": "..."}] }`,
  };

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompts[role] },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      console.error(`Agent ${role} error:`, response.status);
      return JSON.stringify({ error: `Agent ${role} failed` });
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || JSON.stringify({ error: "No response" });
  } catch (error) {
    console.error(`Agent ${role} exception:`, error);
    return JSON.stringify({ error: String(error) });
  }
}

// Step D: Judge the debate
async function runJudge(
  apiKey: string,
  prompt: string,
  skepticOutput: string,
  optimistOutput: string,
  factcheckerOutput: string
): Promise<{
  decision: string;
  coherenceScore: number;
  contradictions: string[];
  finalAnswer: string;
}> {
  const judgePrompt = `You are the SUPREME COURT JUDGE in a multi-model AI governance system.

You have received outputs from three agents debating this request:
"${prompt}"

SKEPTIC says: ${skepticOutput}

OPTIMIST says: ${optimistOutput}

FACT-CHECKER says: ${factcheckerOutput}

Your job:
1. Detect any contradictions between agents
2. Calculate a coherence score (0.0-1.0) based on how much the agents agree
3. Decide whether to RELEASE the optimist's answer or declare MISTRIAL
4. If releasing, provide the final safe answer

Respond in JSON format:
{
  "decision": "RELEASE" | "MISTRIAL",
  "coherence_score": 0.0-1.0,
  "contradictions": ["any contradictions found"],
  "reasoning": "why you made this decision",
  "final_answer": "the safe answer to release, or explanation if MISTRIAL"
}`;

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an impartial AI judge making final decisions on AI output safety and accuracy." },
          { role: "user", content: judgePrompt }
        ],
      }),
    });

    if (!response.ok) {
      console.error("Judge error:", response.status);
      return {
        decision: "MISTRIAL",
        coherenceScore: 0,
        contradictions: ["Judge failed to respond"],
        finalAnswer: "Unable to process request due to internal error.",
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        decision: parsed.decision || "MISTRIAL",
        coherenceScore: parsed.coherence_score || 0,
        contradictions: parsed.contradictions || [],
        finalAnswer: parsed.final_answer || "Unable to provide answer.",
      };
    }
    
    return {
      decision: "MISTRIAL",
      coherenceScore: 0,
      contradictions: ["Could not parse judge output"],
      finalAnswer: content,
    };
  } catch (error) {
    console.error("Judge exception:", error);
    return {
      decision: "MISTRIAL",
      coherenceScore: 0,
      contradictions: [String(error)],
      finalAnswer: "System error occurred.",
    };
  }
}

// Parse agent outputs safely
function parseAgentOutput(output: string): any {
  try {
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Failed to parse agent output:", e);
  }
  return { raw: output };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const requestId = generateRequestId();

  try {
    const { prompt, user_role, metadata } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "prompt is required and must be a string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`[${requestId}] Starting SYNTH audit pipeline...`);

    // Step A: Classify Risk
    const riskDecision = classifyRisk(prompt);
    console.log(`[${requestId}] Risk classification: ${riskDecision}`);

    // If BLOCK, refuse immediately
    if (riskDecision === "BLOCK") {
      const response = {
        request_id: requestId,
        decision: "REFUSE",
        risk_decision: riskDecision,
        coherence_score: 0,
        verification_score: 0,
        redaction_summary: { pii_detected: false, phi_detected: false, entities_redacted: 0 },
        risks: ["Request blocked due to prohibited content"],
        claims: [],
        contradictions: [],
        final_answer: "This request cannot be processed as it appears to involve prohibited content.",
      };

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step B: Sanitize
    const sanitization = sanitizePrompt(prompt);
    console.log(`[${requestId}] Sanitization complete. Entities redacted: ${sanitization.entitiesRedacted}`);

    // Step C: Debate (parallel agent calls)
    console.log(`[${requestId}] Starting multi-agent debate...`);
    const [skepticRaw, optimistRaw, factcheckerRaw] = await Promise.all([
      callAgent(LOVABLE_API_KEY, "skeptic", sanitization.sanitized),
      callAgent(LOVABLE_API_KEY, "optimist", sanitization.sanitized),
      callAgent(LOVABLE_API_KEY, "factchecker", sanitization.sanitized),
    ]);

    const skeptic = parseAgentOutput(skepticRaw);
    const optimist = parseAgentOutput(optimistRaw);
    const factchecker = parseAgentOutput(factcheckerRaw);

    // Step D: Judge
    console.log(`[${requestId}] Running judge...`);
    const judgeResult = await runJudge(
      LOVABLE_API_KEY,
      sanitization.sanitized,
      skepticRaw,
      optimistRaw,
      factcheckerRaw
    );

    // Step E: Verification Gate
    const verificationScore = factchecker.claims 
      ? factchecker.claims.filter((c: any) => c.status === "SUPPORTED").length / Math.max(factchecker.claims.length, 1)
      : 0.5;

    let decision: string;
    if (judgeResult.coherenceScore < 0.85 || verificationScore < 0.90) {
      decision = "HUMAN_REVIEW_REQUIRED";
    } else if (judgeResult.decision === "MISTRIAL") {
      decision = "HUMAN_REVIEW_REQUIRED";
    } else if (sanitization.entitiesRedacted > 0) {
      decision = "RELEASE_SAFE_PARTIAL";
    } else {
      decision = "RELEASE_FULL";
    }

    // Extract risks from skeptic
    const risks = skeptic.risks || (skeptic.concerns ? [skeptic.concerns] : []);
    
    // Extract claims from factchecker
    const claims = factchecker.claims || [];

    const processingTimeMs = Date.now() - startTime;

    // Step F: Log to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Log to synth_audit_logs (existing)
      await supabase.from("synth_audit_logs").insert({
        request_id: requestId,
        user_role: user_role || "anonymous",
        risk_decision: riskDecision,
        sanitized_prompt: sanitization.sanitized,
        prompt_hash: hashString(prompt),
        redaction_summary: {
          pii_detected: sanitization.piiDetected,
          phi_detected: sanitization.phiDetected,
          entities_redacted: sanitization.entitiesRedacted,
        },
        agent_outputs: { skeptic, optimist, factchecker },
        judge_output: judgeResult,
        verification_results: { claims, verification_score: verificationScore },
        outcome: decision,
        final_answer: judgeResult.finalAnswer,
        final_answer_hash: hashString(judgeResult.finalAnswer),
        coherence_score: judgeResult.coherenceScore,
        verification_score: verificationScore,
        policy_ok: decision !== "REFUSE",
        processing_time_ms: processingTimeMs,
      });
      
      console.log(`[${requestId}] Audit log saved to database`);

      // Step G: Log movement events (new event-based tracking)
      const userId = metadata?.user_id || null;
      
      // Map decision to synth_decision enum
      const synthDecision = decision === "RELEASE_FULL" ? "RELEASE_FULL"
        : decision === "RELEASE_SAFE_PARTIAL" ? "RELEASE_SAFE_PARTIAL"
        : decision === "REFUSE" ? "REFUSE"
        : decision === "HUMAN_REVIEW_REQUIRED" ? "HUMAN_REVIEW_REQUIRED"
        : null;
      
      // Map risk to synth_risk_decision enum
      const synthRisk = riskDecision === "ALLOW" ? "ALLOW"
        : riskDecision === "RESTRICT" ? "RESTRICT"
        : riskDecision === "BLOCK" ? "BLOCK"
        : null;

      // Log AUDIT_COMPLETED event with full context
      try {
        await supabase.rpc('log_synth_event', {
          p_user_id: userId,
          p_event_type: 'AUDIT_COMPLETED',
          p_request_id: requestId,
          p_source: 'console',
          p_risk_decision: synthRisk,
          p_decision: synthDecision,
          p_coherence_score: judgeResult.coherenceScore,
          p_verification_score: verificationScore,
          p_prompt_hash: hashString(prompt),
          p_answer_hash: hashString(judgeResult.finalAnswer),
          p_metadata: {
            processing_time_ms: processingTimeMs,
            entities_redacted: sanitization.entitiesRedacted,
            risks_count: risks.length,
            claims_count: claims.length,
            contradictions_count: judgeResult.contradictions.length,
          }
        });
        console.log(`[${requestId}] Movement event logged`);
      } catch (eventError) {
        console.error(`[${requestId}] Failed to log movement event:`, eventError);
      }

    }

    // Build response
    const response = {
      request_id: requestId,
      decision,
      risk_decision: riskDecision,
      coherence_score: judgeResult.coherenceScore,
      verification_score: verificationScore,
      redaction_summary: {
        pii_detected: sanitization.piiDetected,
        phi_detected: sanitization.phiDetected,
        entities_redacted: sanitization.entitiesRedacted,
      },
      risks,
      claims,
      contradictions: judgeResult.contradictions,
      final_answer: judgeResult.finalAnswer,
    };

    console.log(`[${requestId}] Audit complete in ${processingTimeMs}ms. Decision: ${decision}`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(`[${requestId}] Error:`, error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        request_id: requestId,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
