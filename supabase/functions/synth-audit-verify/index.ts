import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================================
// SYNTH AUDIT VERIFIER API
// POST /synth-audit-verify
// Verifies audit proof authenticity and detects tampering
// ============================================================

interface AuditProof {
  trace_id: string;
  created_at: string;
  run_type: string;
  record_hash: string;
  previous_hash: string | null;
  seat_votes: Array<{
    seat_name: string;
    stance: string;
    score: number;
    confidence: number;
    flags_hash: string;
  }>;
  judge_used: boolean;
  token_ref?: string;
  retention_mode: string;
}

interface VerifyRequest {
  trace_id: string;
  audit_proof_json: AuditProof;
}

interface VerifyCheck {
  name: string;
  pass: boolean;
  details: string;
}

interface VerifyResponse {
  status: 'VERIFIED' | 'TAMPERED' | 'NOT_FOUND' | 'INVALID_FORMAT';
  checks: VerifyCheck[];
  verified_trace_id: string | null;
}

// Simple hash function for verification
async function computeHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Canonical JSON for consistent hashing
function canonicalJSON(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalJSON).join(',') + ']';
  }
  const keys = Object.keys(obj).sort();
  const pairs = keys.map(k => JSON.stringify(k) + ':' + canonicalJSON(obj[k]));
  return '{' + pairs.join(',') + '}';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: VerifyRequest = await req.json();
    const { trace_id, audit_proof_json } = body;

    console.log(`[AUDIT-VERIFY] Verifying trace_id: ${trace_id}`);

    const checks: VerifyCheck[] = [];
    let overallStatus: VerifyResponse['status'] = 'VERIFIED';

    // Check 1: Valid format
    if (!audit_proof_json || !audit_proof_json.trace_id || !audit_proof_json.record_hash) {
      checks.push({
        name: 'format_valid',
        pass: false,
        details: 'Audit proof is missing required fields (trace_id, record_hash)'
      });
      overallStatus = 'INVALID_FORMAT';
    } else {
      checks.push({
        name: 'format_valid',
        pass: true,
        details: 'Audit proof has all required fields'
      });
    }

    // Check 2: trace_id matches
    if (trace_id !== audit_proof_json.trace_id) {
      checks.push({
        name: 'trace_id_match',
        pass: false,
        details: `Trace ID mismatch: expected ${trace_id}, got ${audit_proof_json.trace_id}`
      });
      overallStatus = 'TAMPERED';
    } else {
      checks.push({
        name: 'trace_id_match',
        pass: true,
        details: 'Trace ID matches'
      });
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check 3: Lookup stored audit proof
    const { data: storedProof, error: lookupError } = await supabaseClient
      .from('synth_demo_audit_proofs')
      .select('audit_json')
      .eq('trace_id', trace_id)
      .single();

    if (lookupError || !storedProof) {
      checks.push({
        name: 'record_found',
        pass: false,
        details: 'No matching audit record found in database'
      });
      overallStatus = 'NOT_FOUND';
    } else {
      checks.push({
        name: 'record_found',
        pass: true,
        details: 'Audit record found in database'
      });

      const storedAudit = storedProof.audit_json as AuditProof;

      // Check 4: Recompute hash and compare
      const proofForHash = { ...audit_proof_json };
      delete (proofForHash as any).record_hash; // Remove hash before recomputing
      const recomputedHash = await computeHash(canonicalJSON(proofForHash));
      
      if (recomputedHash !== storedAudit.record_hash) {
        checks.push({
          name: 'hash_integrity',
          pass: false,
          details: `Hash mismatch detected. Expected: ${storedAudit.record_hash.substring(0, 16)}..., Got: ${recomputedHash.substring(0, 16)}...`
        });
        overallStatus = 'TAMPERED';
      } else {
        checks.push({
          name: 'hash_integrity',
          pass: true,
          details: 'Record hash matches recomputed hash'
        });
      }

      // Check 5: Compare submitted proof with stored proof
      const submittedCanonical = canonicalJSON(audit_proof_json);
      const storedCanonical = canonicalJSON(storedAudit);
      
      if (submittedCanonical !== storedCanonical) {
        checks.push({
          name: 'content_match',
          pass: false,
          details: 'Submitted audit proof differs from stored version'
        });
        overallStatus = 'TAMPERED';
      } else {
        checks.push({
          name: 'content_match',
          pass: true,
          details: 'Submitted audit proof matches stored version exactly'
        });
      }

      // Check 6: Timestamp sanity
      const createdAt = new Date(audit_proof_json.created_at);
      const now = new Date();
      const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      
      if (isNaN(createdAt.getTime())) {
        checks.push({
          name: 'timestamp_valid',
          pass: false,
          details: 'Invalid timestamp format'
        });
        if (overallStatus === 'VERIFIED') overallStatus = 'TAMPERED';
      } else if (createdAt > now) {
        checks.push({
          name: 'timestamp_valid',
          pass: false,
          details: 'Timestamp is in the future'
        });
        if (overallStatus === 'VERIFIED') overallStatus = 'TAMPERED';
      } else {
        checks.push({
          name: 'timestamp_valid',
          pass: true,
          details: `Timestamp is valid (${Math.round(hoursDiff)}h ago)`
        });
      }

      // Check 7: Chain integrity (if previous_hash exists)
      if (storedAudit.previous_hash) {
        const { data: previousRun } = await supabaseClient
          .from('synth_demo_runs')
          .select('record_hash')
          .lt('created_at', storedAudit.created_at)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (previousRun && previousRun.record_hash === storedAudit.previous_hash) {
          checks.push({
            name: 'chain_integrity',
            pass: true,
            details: 'Previous hash matches prior record in chain'
          });
        } else if (previousRun) {
          checks.push({
            name: 'chain_integrity',
            pass: false,
            details: 'Previous hash does not match prior record'
          });
          if (overallStatus === 'VERIFIED') overallStatus = 'TAMPERED';
        }
      }
    }

    const response: VerifyResponse = {
      status: overallStatus,
      checks,
      verified_trace_id: overallStatus === 'VERIFIED' ? trace_id : null,
    };

    console.log(`[AUDIT-VERIFY] Result: ${overallStatus} with ${checks.length} checks`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AUDIT-VERIFY] Error:', errorMessage);
    return new Response(JSON.stringify({ 
      status: 'INVALID_FORMAT',
      checks: [{ name: 'parse_error', pass: false, details: errorMessage }],
      verified_trace_id: null
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
