// Utility functions to transform senate run responses into report data

interface SenatorBallot {
  seat_id: number;
  seat_name: string;
  provider: string;
  model: string;
  status: string;
  stance: string;
  score: number;
  confidence: number;
  risk_flags: string[];
  key_points: string[];
  counterpoints: string[];
  timing?: {
    latency_ms: number;
  };
}

interface JudgeOutput {
  final_answer: string;
  rationale: string[];
  risk_verdict: {
    level: "low" | "medium" | "high";
    notes: string[];
  };
}

interface SenateRunResponse {
  trace_id: string;
  created_at?: string;
  seats: SenatorBallot[];
  judge: JudgeOutput;
  contested: boolean;
  contested_reasons: string[];
}

export interface ScorecardData {
  trace_id: string;
  synth_index: number;
  tier: "PASS" | "REVIEW" | "DENY";
  why_reasons: string[];
  improvement_suggestions: string[];
  seats: {
    seat_id: number;
    seat_name: string;
    provider: string;
    status: string;
    stance: string;
    score: number;
    confidence: number;
  }[];
  judge_used: boolean;
  created_at: string;
}

export interface AuditProof {
  trace_id: string;
  created_at: string;
  run_type: "qa" | "clean_verify";
  record_hash: string;
  previous_hash: string | null;
  seat_votes: {
    seat_name: string;
    stance: string;
    score: number;
    confidence: number;
    flags_hash: string;
  }[];
  judge_used: boolean;
  token_ref?: string;
  retention_mode: "minimal";
}

// Calculate synth index from seat scores
export function calculateSynthIndex(seats: SenatorBallot[]): number {
  const onlineSeats = seats.filter(s => s.status === "online" || s.status === "voted");
  if (onlineSeats.length === 0) return 0;
  
  // Weighted average of scores
  const totalScore = onlineSeats.reduce((sum, seat) => {
    return sum + (seat.score * seat.confidence);
  }, 0);
  
  const totalWeight = onlineSeats.reduce((sum, seat) => sum + seat.confidence, 0);
  
  return Math.round(totalWeight > 0 ? totalScore / totalWeight : 0);
}

// Determine tier from synth index and contest status
export function determineTier(synthIndex: number, contested: boolean, judgeRiskLevel: string): "PASS" | "REVIEW" | "DENY" {
  if (contested || judgeRiskLevel === "high") {
    if (synthIndex >= 60) return "REVIEW";
    return "DENY";
  }
  
  if (synthIndex >= 75) return "PASS";
  if (synthIndex >= 50) return "REVIEW";
  return "DENY";
}

// Extract "why" reasons from seats and judge
export function extractWhyReasons(seats: SenatorBallot[], judge: JudgeOutput): string[] {
  const reasons: string[] = [];
  
  // Add judge rationale first
  if (judge.rationale && judge.rationale.length > 0) {
    reasons.push(...judge.rationale.slice(0, 2));
  }
  
  // Add top key points from high-confidence seats
  const highConfSeats = seats
    .filter(s => s.confidence >= 0.7 && s.status === "online")
    .sort((a, b) => b.confidence - a.confidence);
  
  for (const seat of highConfSeats.slice(0, 2)) {
    if (seat.key_points && seat.key_points.length > 0) {
      reasons.push(`${seat.provider}: ${seat.key_points[0]}`);
    }
  }
  
  return reasons.slice(0, 3);
}

// Extract improvement suggestions
export function extractImprovements(seats: SenatorBallot[], judge: JudgeOutput): string[] {
  const suggestions: string[] = [];
  
  // Add risk notes from judge
  if (judge.risk_verdict?.notes && judge.risk_verdict.notes.length > 0) {
    suggestions.push(...judge.risk_verdict.notes.slice(0, 2));
  }
  
  // Add counterpoints from seats
  for (const seat of seats.filter(s => s.status === "online")) {
    if (seat.counterpoints && seat.counterpoints.length > 0) {
      suggestions.push(seat.counterpoints[0]);
    }
    if (suggestions.length >= 3) break;
  }
  
  return suggestions.slice(0, 3);
}

// Generate a simple hash for audit proof
export function generateHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

// Transform senate run response to scorecard data
export function transformToScorecard(response: SenateRunResponse): ScorecardData {
  const synthIndex = calculateSynthIndex(response.seats);
  const tier = determineTier(synthIndex, response.contested, response.judge.risk_verdict?.level || "medium");
  
  return {
    trace_id: response.trace_id,
    synth_index: synthIndex,
    tier,
    why_reasons: extractWhyReasons(response.seats, response.judge),
    improvement_suggestions: extractImprovements(response.seats, response.judge),
    seats: response.seats.map(s => ({
      seat_id: s.seat_id,
      seat_name: s.seat_name,
      provider: s.provider,
      status: s.status,
      stance: s.stance,
      score: s.score,
      confidence: s.confidence
    })),
    judge_used: true,
    created_at: response.created_at || new Date().toISOString()
  };
}

// Generate audit proof from senate run
export function generateAuditProof(response: SenateRunResponse, runType: "qa" | "clean_verify" = "qa"): AuditProof {
  const seatVotes = response.seats.map(s => ({
    seat_name: s.seat_name,
    stance: s.stance,
    score: s.score,
    confidence: s.confidence,
    flags_hash: generateHash(JSON.stringify(s.risk_flags))
  }));
  
  const proofData = {
    trace_id: response.trace_id,
    created_at: response.created_at || new Date().toISOString(),
    run_type: runType,
    seat_votes: seatVotes,
    judge_used: true,
    retention_mode: "minimal" as const
  };
  
  const recordHash = generateHash(JSON.stringify(proofData));
  
  return {
    ...proofData,
    record_hash: recordHash,
    previous_hash: null
  };
}

// Download JSON file
export function downloadJSON(data: object, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Download CSV file
export function downloadCSV(rows: object[], filename: string) {
  if (rows.length === 0) return;
  
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => headers.map(h => {
      const val = (row as Record<string, unknown>)[h];
      const strVal = String(val ?? '');
      return `"${strVal.replace(/"/g, '""')}"`;
    }).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
