import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { challenge_id, domain, prompt, response, scoring_criteria } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are a SYNTH™ challenge scorer. Score the user's response to the given challenge.

DOMAIN: ${domain}
CHALLENGE PROMPT: ${prompt}
SCORING CRITERIA: ${scoring_criteria.join(", ")}

Evaluate the response and return a JSON object with:
- score: 0-100 based on how well it meets the criteria
- feedback: 1-2 sentence summary of performance
- strengths: array of 1-3 things done well (short phrases)
- improvements: array of 1-3 areas to improve (short phrases)

Be fair but rigorous. A score of 80+ means excellent, 60-79 is good, below 60 needs work.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `USER RESPONSE:\n${response}` }
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error("AI scoring failed");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "{}";
    
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = { score: 50, feedback: "Unable to parse response", strengths: [], improvements: ["Try again"] };
    }

    return new Response(JSON.stringify({
      challenge_id,
      score: result.score || 50,
      feedback: result.feedback || "Response evaluated",
      strengths: result.strengths || [],
      improvements: result.improvements || [],
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error("Challenge scoring error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ 
      error: message,
      score: 0,
      feedback: "Scoring failed",
      strengths: [],
      improvements: [],
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
