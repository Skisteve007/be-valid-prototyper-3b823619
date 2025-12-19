import { supabase } from "@/integrations/supabase/client";

export type SynthEventType = 
  | 'PROMPT_SUBMITTED'
  | 'AUDIT_STARTED'
  | 'AUDIT_COMPLETED'
  | 'DECISION_VIEWED'
  | 'SAFE_ANSWER_COPIED'
  | 'SAFE_ANSWER_INSERTED'
  | 'USER_ACCEPTED_REWRITE'
  | 'USER_REJECTED_REWRITE'
  | 'USER_EDITED_AND_RESUBMITTED'
  | 'USER_CHANGED_RISKY_INTENT'
  | 'HUMAN_REVIEW_REQUESTED'
  | 'HUMAN_REVIEW_COMPLETED'
  | 'HUMAN_REVIEW_OVERRULED'
  | 'POLICY_BLOCK_TRIGGERED'
  | 'INJECTION_PATTERN_DETECTED'
  | 'TEMPLATE_DUPLICATION_DETECTED'
  | 'ANOMALY_SCORE_SPIKE_DETECTED';

export type SynthEventSource = 'console' | 'extension' | 'partner' | 'api';

export interface SynthEventPayload {
  event_type: SynthEventType;
  request_id?: string;
  source?: SynthEventSource;
  risk_decision?: 'ALLOW' | 'RESTRICT' | 'BLOCK';
  decision?: 'RELEASE_FULL' | 'RELEASE_SAFE_PARTIAL' | 'REFUSE' | 'HUMAN_REVIEW_REQUIRED';
  coherence_score?: number;
  verification_score?: number;
  prompt_hash?: string;
  answer_hash?: string;
  metadata?: Record<string, unknown>;
}

// Simple hash function for client-side use
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

export function useSynthEvents() {
  const logEvent = async (payload: SynthEventPayload): Promise<void> => {
    try {
      const { data, error } = await supabase.functions.invoke('synth-event', {
        body: payload,
      });

      if (error) {
        console.error('[SYNTH] Event logging error:', error);
      } else {
        console.log('[SYNTH] Event logged:', payload.event_type, data?.event_id);
      }
    } catch (err) {
      console.error('[SYNTH] Failed to log event:', err);
    }
  };

  // Convenience methods for common events
  const logPromptSubmitted = (requestId: string, promptHash?: string, metadata?: Record<string, unknown>) => 
    logEvent({ 
      event_type: 'PROMPT_SUBMITTED', 
      request_id: requestId,
      prompt_hash: promptHash,
      metadata 
    });

  const logAuditStarted = (requestId: string) => 
    logEvent({ 
      event_type: 'AUDIT_STARTED', 
      request_id: requestId 
    });

  const logDecisionViewed = (requestId: string, decision: string, metadata?: Record<string, unknown>) => 
    logEvent({ 
      event_type: 'DECISION_VIEWED', 
      request_id: requestId,
      decision: decision as SynthEventPayload['decision'],
      metadata 
    });

  const logSafeAnswerCopied = (requestId: string, answerHash?: string) => 
    logEvent({ 
      event_type: 'SAFE_ANSWER_COPIED', 
      request_id: requestId,
      answer_hash: answerHash,
    });

  const logUserAcceptedRewrite = (requestId: string, metadata?: Record<string, unknown>) => 
    logEvent({ 
      event_type: 'USER_ACCEPTED_REWRITE', 
      request_id: requestId,
      metadata 
    });

  const logUserRejectedRewrite = (requestId: string, metadata?: Record<string, unknown>) => 
    logEvent({ 
      event_type: 'USER_REJECTED_REWRITE', 
      request_id: requestId,
      metadata 
    });

  const logUserEditedAndResubmitted = (requestId: string, originalPromptHash: string, newPromptHash: string) => 
    logEvent({ 
      event_type: 'USER_EDITED_AND_RESUBMITTED', 
      request_id: requestId,
      metadata: { original_prompt_hash: originalPromptHash, new_prompt_hash: newPromptHash }
    });

  const logHumanReviewRequested = (requestId: string, reason?: string) => 
    logEvent({ 
      event_type: 'HUMAN_REVIEW_REQUESTED', 
      request_id: requestId,
      metadata: { reason }
    });

  return {
    logEvent,
    logPromptSubmitted,
    logAuditStarted,
    logDecisionViewed,
    logSafeAnswerCopied,
    logUserAcceptedRewrite,
    logUserRejectedRewrite,
    logUserEditedAndResubmitted,
    logHumanReviewRequested,
    hashString,
  };
}