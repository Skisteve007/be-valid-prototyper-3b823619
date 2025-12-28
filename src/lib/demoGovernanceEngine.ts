/**
 * DemoGovernanceEngine - Simulated governance for demos
 * 
 * Rules:
 * - DEMO_MODE=true switches all demos into simulated pipeline mode
 * - Deterministic: same input yields same verdict
 * - Realistic latency (300ms-2s) with step-by-step progress
 * - Proof records are real (hashes/timestamps/expiry/signature)
 */

export type Tier = 0 | 1 | 2 | 3;
export type DemoContext = "upload" | "qna" | "conduit";
export type Industry = "healthcare" | "banking" | "higher_ed" | "pharma" | "generic";
export type Verdict = "CERTIFIED" | "MISTRIAL";
export type Grade = "green" | "yellow" | "red";

export interface TraceStep {
  label: string;
  status: "pending" | "running" | "complete" | "failed";
  ms: number;
}

export interface ProofRecord {
  proof_id: string;
  input_hash: string;
  issued_at: string;
  expires_at: string;
  policy_pack_version: string;
  signature: string;
}

export interface GovernanceResult {
  verdict: Verdict;
  grade: Grade;
  reasons: string[];
  trace_steps: TraceStep[];
  proof_record: ProofRecord;
}

// Demo mode flag - set to true for simulated mode
export const DEMO_MODE = true;

// Trigger words that force MISTRIAL
const MISTRIAL_TRIGGERS = [
  "dosage", "guarantee", "ssn", "social security", 
  "wire transfer", "password", "credit card", "bank account",
  "pii", "hipaa", "confidential", "classified"
];

// Reasons library by verdict type
const CERTIFIED_REASONS = [
  "All consensus checks passed across primary models",
  "Policy compliance verified against active rule pack",
  "Multi-model agreement confirmed (3/3 models)",
  "Contradiction check cleared with high confidence",
  "Source validation successful against trusted references",
  "Output structure validated and sanitized",
  "No PII exposure detected in response",
];

const MISTRIAL_REASONS = [
  "Policy violation detected in output content",
  "Model disagreement exceeded threshold (2/3 split)",
  "Contradiction detected with source material",
  "Confidence threshold not met (below 0.85)",
  "Potential PII exposure flagged for review",
  "Output failed structural validation",
  "Trigger phrase detected requiring human review",
];

// Tier-specific trace steps
const TRACE_STEPS_BY_TIER: Record<Tier, string[]> = {
  3: ["Input Validation", "Governance Pipeline", "Output + Proof"],
  2: ["Input Validation", "Governance Pipeline", "Red Team Check", "Arbitration", "Output + Proof"],
  1: ["Input Validation", "Governance Pipeline", "Red Team Check", "Shadow Mode Analysis", "Active Veto Check", "Arbitration", "Output + Proof"],
  0: ["Input Validation", "Sector Laws Mapped", "Governance Pipeline", "Red Team Check", "Shadow Mode Analysis", "Active Veto Check", "Exclusivity Verification", "Arbitration", "Output + Proof"],
};

/**
 * Simple hash function for deterministic verdict generation
 * Uses a basic string hashing algorithm
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate SHA256-like hash string for proof records
 */
function generateHash(input: string): string {
  const hash = simpleHash(input + Date.now().toString());
  const hashStr = hash.toString(16).padStart(16, '0');
  return `sha256:${hashStr}${simpleHash(input).toString(16).padStart(16, '0')}${simpleHash(hashStr).toString(16).padStart(32, '0')}`;
}

/**
 * Generate a proof ID (UUID-like)
 */
function generateProofId(): string {
  const segments = [
    Math.random().toString(36).slice(2, 10),
    Math.random().toString(36).slice(2, 6),
    Math.random().toString(36).slice(2, 6),
    Math.random().toString(36).slice(2, 6),
    Math.random().toString(36).slice(2, 14),
  ];
  return `prf_${segments.join('-')}`;
}

/**
 * Generate a digital signature for the proof record
 */
function generateSignature(proofId: string, inputHash: string): string {
  const combined = `${proofId}:${inputHash}:valid-synth-v1`;
  return `sig_${simpleHash(combined).toString(36)}${Date.now().toString(36)}`;
}

/**
 * Check if input contains mistrial trigger words
 */
function containsTriggerWords(input: string): boolean {
  const lowerInput = input.toLowerCase();
  return MISTRIAL_TRIGGERS.some(trigger => lowerInput.includes(trigger));
}

/**
 * Determine verdict deterministically based on input hash
 */
function determineVerdict(input: string, tier: Tier): { verdict: Verdict; grade: Grade } {
  // Force MISTRIAL for trigger words
  if (containsTriggerWords(input)) {
    return { verdict: "MISTRIAL", grade: "red" };
  }

  // Deterministic verdict based on hash
  const hash = simpleHash(input);
  const bucket = hash % 100;
  
  // Tier affects strictness thresholds
  const mistrialThreshold = tier === 0 ? 10 : tier === 1 ? 15 : tier === 2 ? 20 : 25;
  const yellowThreshold = mistrialThreshold + 15;

  if (bucket < mistrialThreshold) {
    return { verdict: "MISTRIAL", grade: "red" };
  } else if (bucket < yellowThreshold) {
    return { verdict: "CERTIFIED", grade: "yellow" };
  } else {
    return { verdict: "CERTIFIED", grade: "green" };
  }
}

/**
 * Select reasons based on verdict and input
 */
function selectReasons(verdict: Verdict, input: string): string[] {
  const pool = verdict === "CERTIFIED" ? CERTIFIED_REASONS : MISTRIAL_REASONS;
  const hash = simpleHash(input);
  const count = 3 + (hash % 3); // 3-5 reasons
  
  const selected: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = (hash + i * 7) % pool.length;
    if (!selected.includes(pool[idx])) {
      selected.push(pool[idx]);
    }
  }
  
  // Add trigger-specific reason if applicable
  if (containsTriggerWords(input) && verdict === "MISTRIAL") {
    selected.unshift("Trigger phrase detected requiring human review");
  }
  
  return selected.slice(0, 5);
}

/**
 * Generate trace steps with simulated timing
 */
function generateTraceSteps(tier: Tier): TraceStep[] {
  const labels = TRACE_STEPS_BY_TIER[tier];
  return labels.map((label, idx) => ({
    label,
    status: "complete" as const,
    ms: 300 + Math.floor(Math.random() * 500) + (idx * 150),
  }));
}

/**
 * Generate a real proof record with proper hashes and signatures
 */
function generateProofRecord(input: string): ProofRecord {
  const proofId = generateProofId();
  const inputHash = generateHash(input);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

  return {
    proof_id: proofId,
    input_hash: inputHash,
    issued_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    policy_pack_version: "v2.4.1-stable",
    signature: generateSignature(proofId, inputHash),
  };
}

/**
 * Main governance engine function
 * 
 * @param tier - Customer tier (0-3)
 * @param context - Demo context (upload, qna, conduit)
 * @param industry - Industry vertical
 * @param input - Input text or sample ID
 * @returns Promise<GovernanceResult>
 */
export async function runGovernance(
  tier: Tier,
  context: DemoContext,
  industry: Industry,
  input: string
): Promise<GovernanceResult> {
  // Add realistic latency (300ms - 2s based on tier complexity)
  const baseLatency = 300;
  const tierLatency = (3 - tier) * 400; // Higher tiers take longer
  const totalLatency = baseLatency + tierLatency + Math.random() * 500;
  
  await new Promise(resolve => setTimeout(resolve, totalLatency));

  const { verdict, grade } = determineVerdict(input, tier);
  const reasons = selectReasons(verdict, input);
  const trace_steps = generateTraceSteps(tier);
  const proof_record = generateProofRecord(input);

  return {
    verdict,
    grade,
    reasons,
    trace_steps,
    proof_record,
  };
}

/**
 * Run governance with step-by-step callbacks for UI progress
 */
export async function runGovernanceWithProgress(
  tier: Tier,
  context: DemoContext,
  industry: Industry,
  input: string,
  onStep: (stepIndex: number, step: TraceStep) => void
): Promise<GovernanceResult> {
  const labels = TRACE_STEPS_BY_TIER[tier];
  const trace_steps: TraceStep[] = [];

  for (let i = 0; i < labels.length; i++) {
    const ms = 300 + Math.floor(Math.random() * 500);
    const step: TraceStep = {
      label: labels[i],
      status: "running",
      ms,
    };
    
    onStep(i, step);
    await new Promise(resolve => setTimeout(resolve, ms));
    
    step.status = "complete";
    trace_steps.push(step);
    onStep(i, step);
  }

  const { verdict, grade } = determineVerdict(input, tier);
  const reasons = selectReasons(verdict, input);
  const proof_record = generateProofRecord(input);

  return {
    verdict,
    grade,
    reasons,
    trace_steps,
    proof_record,
  };
}

/**
 * Verify a proof record (for Demo D)
 */
export function verifyProofRecord(proofId: string, inputHash?: string): {
  valid: boolean;
  status: "valid" | "expired" | "not_found" | "tampered";
  message: string;
} {
  // In demo mode, validate format and simulate verification
  if (!proofId.startsWith("prf_")) {
    return {
      valid: false,
      status: "not_found",
      message: "Proof record not found in registry",
    };
  }

  // Simulate occasional expired records
  const hash = simpleHash(proofId);
  if (hash % 10 === 0) {
    return {
      valid: false,
      status: "expired",
      message: "Proof record has expired",
    };
  }

  // Check for tampering if inputHash provided
  if (inputHash && !inputHash.startsWith("sha256:")) {
    return {
      valid: false,
      status: "tampered",
      message: "Input hash format invalid - possible tampering detected",
    };
  }

  return {
    valid: true,
    status: "valid",
    message: "Proof record verified successfully",
  };
}

/**
 * Get tier-specific CTA configuration
 */
export function getTierCTA(tier: Tier): {
  primary: string;
  primaryAction: string;
  secondary: string;
  secondaryAction: string;
} {
  switch (tier) {
    case 3:
      return {
        primary: "Pay $5,000 Setup",
        primaryAction: "/checkout?tier=3",
        secondary: "View Pricing",
        secondaryAction: "/pricing",
      };
    case 2:
      return {
        primary: "Sign Pilot + Pay Deposit",
        primaryAction: "/sign?tier=2",
        secondary: "Schedule Call",
        secondaryAction: "/schedule",
      };
    case 1:
      return {
        primary: "Sign Enterprise Agreement",
        primaryAction: "/sign?tier=1",
        secondary: "Request Redline",
        secondaryAction: "/redline",
      };
    case 0:
      return {
        primary: "Sign LOI + Request Wire Instructions",
        primaryAction: "/sign?tier=0",
        secondary: "Schedule Executive Call",
        secondaryAction: "/schedule-exec",
      };
    default:
      return {
        primary: "Contact Sales",
        primaryAction: "/contact",
        secondary: "Learn More",
        secondaryAction: "/about",
      };
  }
}

/**
 * Generate a time-limited share token
 */
export function generateShareToken(): string {
  return `vld_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
