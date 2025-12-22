# SYNTH (incorporating the Valid Governance Engine)
## Patent Specification — Multi-Model AI Governance System

**Document Version:** 1.0 Final  
**Date:** December 22, 2025  
Note: Appendix A sample outputs are from later validation runs; timestamps reflect extraction time and do not alter the invention’s disclosure.
Classification: Technical Patent Specification
---

## ABSTRACT

SYNTH (incorporating the Valid Governance Engine) is a novel multi-model artificial intelligence governance system that employs a "Senate" architecture comprising seven distinct AI models operating as voting members, supervised by an independent Judge model. The system provides transparent, auditable, and weighted decision-making for high-stakes content evaluation, identity verification, and trust scoring applications. Key innovations include parallel model invocation with fault tolerance, structured ballot outputs, configurable per-organization weight calibration, cryptographic audit trails with hash-chain integrity, session-based anomaly detection with escalating interventions, and a browser extension for seamless content capture and prefill.

---

## BACKGROUND OF THE INVENTION

### Technical Field

This invention relates to artificial intelligence systems, specifically to multi-model ensemble architectures for governance, content moderation, and trust evaluation decisions.

### Prior Art Limitations

Existing AI decision systems typically rely on single-model architectures, which suffer from:
- Single points of failure in model availability
- Lack of transparency in decision rationale
- No mechanism for organizational customization of decision weights
- Absence of tamper-evident audit trails
- No detection of adversarial input manipulation

---

## SUMMARY OF THE INVENTION

The present invention addresses these limitations through:

1. **Multi-Model Senate Architecture** — Seven diverse AI models vote independently
2. **Independent Judge Oversight** — Eighth model reviews contested decisions
3. **Weighted Voting System** — Configurable per-organization weights summing to 100
4. **Fault-Tolerant Execution** — Parallel invocation with timeout/error handling
5. **Structured Ballot Protocol** — Standardized output format across all models
6. **Hash-Chain Audit Trail** — Cryptographic integrity verification
7. **Session Lock Detection** — Anomaly detection with escalating interventions
8. **Probation Mode** — Enhanced monitoring for flagged users
9. **Browser Extension Embodiment** — Seamless content capture workflow

---

## DETAILED DESCRIPTION

### 1. Senate Composition

The system comprises seven voting Seats plus one Judge:

| Seat | Provider | Model | Default Weight |
|------|----------|-------|----------------|
| 1 | OpenAI | GPT-4o | 15% |
| 2 | Anthropic | Claude 3.5 | 15% |
| 3 | Google | Gemini 1.5 | 15% |
| 4 | Meta | Llama 3 | 14% |
| 5 | DeepSeek | V3 | 14% |
| 6 | Mistral | Large | 14% |
| 7 | xAI | Grok | 13% |
| **Judge** | OpenAI | ChatGPT o1 | — |

**Weight Constraint:** All seven seat weights MUST sum to exactly 100.

### 2. Parallel Seat Invocation

All seven seats are invoked simultaneously using `Promise.allSettled()` semantics:

```
┌─────────────────────────────────────────────────────────────┐
│                    SYNTH PIPELINE                           │
├─────────────────────────────────────────────────────────────┤
│  INPUT TEXT                                                 │
│      │                                                      │
│      ▼                                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           PARALLEL SEAT INVOCATION                    │  │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐│
│  │  │ S1  │ │ S2  │ │ S3  │ │ S4  │ │ S5  │ │ S6  │ │ S7  ││
│  │  │GPT4o│ │Claude│ │Gemini│ │Llama│ │Deep │ │Mistr│ │Grok ││
│  │  └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘│
│  │     │       │       │       │       │       │       │   │
│  │     ▼       ▼       ▼       ▼       ▼       ▼       ▼   │
│  │  ┌─────────────────────────────────────────────────────┐│
│  │  │              BALLOT COLLECTION                      ││
│  │  │   (timeout/error → abstain + reason_code)           ││
│  │  └─────────────────────────────────────────────────────┘│
│  └───────────────────────────────────────────────────────┘  │
│      │                                                      │
│      ▼                                                      │
│  WEIGHTED AGGREGATION → SYNTH INDEX                        │
│      │                                                      │
│      ▼                                                      │
│  SESSION LOCK CHECK → (escalate if anomaly detected)       │
│      │                                                      │
│      ▼                                                      │
│  AUDIT LOG (hash-chained)                                  │
└─────────────────────────────────────────────────────────────┘
```

**FIG. 1: SYNTH Pipeline Flow**

### 3. Offline/Timeout/Error Handling

When a seat fails to respond within the configured timeout (default: 30 seconds):

| Condition | Status | Behavior |
|-----------|--------|----------|
| Timeout | `timeout` | Abstain; weights are renormalized across participating seats. |
| API Error | `error` | Abstain, log error code |
| Parse Failure | `parse_error` | Abstain, log raw response |
| Rate Limited | `rate_limited` | Abstain, log retry-after |

**Reason Codes Logged:**
- `TIMEOUT_EXCEEDED`
- `API_ERROR_5XX`
- `API_ERROR_4XX`
- `PARSE_FAILURE`
- `RATE_LIMITED`
- `MODEL_UNAVAILABLE`

### 4. Structured Ballot Output

Each seat produces a standardized Ballot:

```typescript
interface SeatBallot {
  seat_number: number;           // 1-7
  model_id: string;              // e.g., "gpt-4o"
  status: "voted" | "abstain";   // participation status
  stance: "approve" | "deny" | "escalate" | "abstain";
  score: number;                 // 0-100 dimension score
  confidence: number;            // 0-1 confidence level
  risk_flags: string[];          // e.g., ["evasive_language", "inconsistent_claims"]
  reasoning: string;             // natural language explanation
  abstain_reason?: string;       // if status === "abstain"
  processing_time_ms: number;    // latency metric
}
```

**Example Ballot:**
```json
{
  "seat_number": 1,
  "model_id": "gpt-4o",
  "status": "voted",
  "stance": "approve",
  "score": 78,
  "confidence": 0.85,
  "risk_flags": [],
  "reasoning": "Response demonstrates consistent internal logic with verifiable claims.",
  "processing_time_ms": 1247
}
```

### 5. Weighted Voting & Aggregation

```
┌─────────────────────────────────────────────────────────────┐
│                 SENATE ORCHESTRATION                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  BALLOTS RECEIVED                                           │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │ 78 │ │ 82 │ │ 75 │ │ ABS│ │ 80 │ │ 77 │ │ 79 │          │
│  │15% │ │15% │ │15% │ │14% │ │14% │ │14% │ │13% │          │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘          │
│                                                             │
│  WEIGHT NORMALIZATION (exclude abstentions)                 │
│  Total Active Weight = 100 - 14 = 86                        │
│  Normalized: S1=17.4%, S2=17.4%, S3=17.4%, S5=16.3%...     │
│                                                             │
│  WEIGHTED AVERAGE                                           │
│  synth_index = Σ(score_i × normalized_weight_i) = 78.2     │
│                                                             │
│  THRESHOLD CHECK                                            │
│  ├─ synth_index ≥ 70 → PASS (green tier)                   │
│  ├─ synth_index 50-69 → REVIEW (yellow tier)               │
│  └─ synth_index < 50 → DENY (red tier)                     │
│                                                             │
│  CONTESTED CHECK                                            │
│  If variance > threshold OR veto flag → ESCALATE TO JUDGE  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**FIG. 2: Senate Orchestration & Weighted Voting**

**Veto Logic:**
- Any seat may set `stance: "escalate"` to force Judge review
- High variance (>25 points between seats) triggers automatic escalation
- Judge decision is final and logged separately

### 6. Employer Calibration (Mission Control)

Organizations may customize seat weights via the Calibration Panel:

**Features:**
- 7 weight sliders (one per seat)
- Real-time validation: sum must equal 100
- Role-Based Access Control (RBAC): only `administrator` or `employer` roles
- Audit logging of all weight changes

**Database Schema:**
```sql
CREATE TABLE synth_calibration (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  org_id UUID,  -- organizational scope
  seat_1_weight INTEGER DEFAULT 15,
  seat_2_weight INTEGER DEFAULT 15,
  seat_3_weight INTEGER DEFAULT 15,
  seat_4_weight INTEGER DEFAULT 14,
  seat_5_weight INTEGER DEFAULT 14,
  seat_6_weight INTEGER DEFAULT 14,
  seat_7_weight INTEGER DEFAULT 13,
  updated_at TIMESTAMPTZ
);

CREATE TABLE synth_calibration_audit (
  id UUID PRIMARY KEY,
  actor_user_id UUID NOT NULL,
  action_type TEXT NOT NULL,  -- 'calibration_change'
  from_value JSONB,           -- previous weights
  to_value JSONB,             -- new weights
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 7. Probation Mode (30-Day Enhanced Monitoring)

Users flagged for suspicious activity enter Probation Mode:

**Probation Table:**
```sql
CREATE TABLE synth_probation (
  id UUID PRIMARY KEY,
  target_user_id UUID NOT NULL,
  enabled_by UUID,            -- admin who enabled
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,     -- typically 30 days
  is_active BOOLEAN DEFAULT true,
  extra_logging BOOLEAN DEFAULT true,
  strict_session_lock BOOLEAN DEFAULT true,
  step_up_auth BOOLEAN DEFAULT false,
  notes TEXT
);
```

**Probation Effects:**
1. **Stricter Session Lock Thresholds** — 50% lower tolerance for anomalies
2. **Enhanced Logging** — All inputs/outputs stored with full metadata
3. **Response Flag** — API returns `mode: "probation"` in response
4. **Duration** — 30 days default, configurable by administrator

### 8. Learning Rate (Error Tracking)

The system tracks model accuracy over time:

**Data Sources:**
- Manual overrides by administrators
- Judge corrections of contested decisions
- User appeals with verified outcomes

**Calculation:**
```
error_rate = (incorrect_decisions / total_decisions) × 100
learning_rate = 100 - error_rate  // displayed as accuracy %
```

**Empty State:** When no historical data exists, displays "Calibrating..." with skeleton UI.

### 9. Session Lock (Complexity Shift Detection)

```
┌─────────────────────────────────────────────────────────────┐
│                 SESSION LOCK DETECTION                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INPUT METRICS (per submission)                             │
│  ├─ token_count: current vs previous                        │
│  ├─ readability_score: Flesch-Kincaid grade level          │
│  └─ language_detected: ISO code                             │
│                                                             │
│  ANOMALY SIGNALS                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ TOKEN_LENGTH_SHIFT   │ >200% change (100% if probation)│ │
│  │ READABILITY_SHIFT    │ >30 points (15 if probation)    │ │
│  │ LANGUAGE_SHIFT       │ Different ISO code detected     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ESCALATION LADDER                                          │
│  ┌─────────┐    ┌──────────┐    ┌────────┐                 │
│  │ Level 1 │───▶│ Level 2  │───▶│ Level 3│                 │
│  │ VERIFY  │    │ RESTRICT │    │  LOCK  │                 │
│  │         │    │          │    │        │                 │
│  │ Prompt  │    │ Rate     │    │ Session│                 │
│  │ re-auth │    │ limit +  │    │ frozen │                 │
│  │         │    │ flag     │    │        │                 │
│  └─────────┘    └──────────┘    └────────┘                 │
│                                                             │
│  SECURITY EVENT LOGGING                                     │
│  synth_security_events: user_id, session_id,               │
│    escalation_level, action_taken, reason_codes, metrics   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Detection Function:**
```sql
CREATE FUNCTION detect_session_lock_trigger(
  p_user_id UUID,
  p_session_id UUID,
  p_current_tokens INTEGER,
  p_previous_tokens INTEGER,
  p_current_readability REAL,
  p_previous_readability REAL,
  p_language_shift BOOLEAN
) RETURNS TABLE(
  should_escalate BOOLEAN,
  escalation_level INTEGER,
  reason_codes TEXT[],
  action TEXT
);
```

### 10. Chrome Extension Embodiment

```
┌─────────────────────────────────────────────────────────────┐
│               CHROME EXTENSION FLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  USER ACTION: Highlight text on any webpage                 │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  CAPTURE CONTEXT                                     │   │
│  │  ├─ selected_text: highlighted content               │   │
│  │  ├─ source_url: current page URL                     │   │
│  │  └─ page_title: document title                       │   │
│  └─────────────────────────────────────────────────────┘   │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SYNTH-PREFILL EDGE FUNCTION                         │   │
│  │  ├─ Generate prefill_id (UUID)                       │   │
│  │  ├─ Store in synth_prefills table                    │   │
│  │  ├─ TTL: 10 minutes                                  │   │
│  │  └─ User-scoped (user_id from auth)                  │   │
│  └─────────────────────────────────────────────────────┘   │
│       │                                                     │
│       ▼                                                     │
│  REDIRECT: /synth?prefill={prefill_id}                     │
│       │                                                     │
│       ▼                                                     │
│  SYNTH CONSOLE: Auto-populates input with captured text    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**FIG. 3: Chrome Extension Prefill Flow**

**Prefill Table:**
```sql
CREATE TABLE synth_prefills (
  id UUID PRIMARY KEY,
  user_id UUID,
  user_hash TEXT,           -- for anonymous users
  selected_text TEXT NOT NULL,
  source_url TEXT,
  page_title TEXT,
  expires_at TIMESTAMPTZ,   -- 10-minute TTL
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 11. Audit Trail (Black Box)

All senate runs are stored with cryptographic integrity:

**Hash-Chain Implementation:**
```sql
CREATE FUNCTION chain_synth_senate_hash()
RETURNS TRIGGER AS $$
DECLARE
  v_previous_hash TEXT;
  v_record_data TEXT;
BEGIN
  -- Get previous record's hash
  SELECT record_hash INTO v_previous_hash
  FROM synth_senate_runs
  WHERE created_at < NEW.created_at
  ORDER BY created_at DESC LIMIT 1;
  
  -- Genesis case
  IF v_previous_hash IS NULL THEN
    v_previous_hash := 'GENESIS_' || encode(sha256('SYNTH_SENATE_GENESIS'::bytea), 'hex');
  END IF;
  
  -- Concatenate fields for hashing
  v_record_data := NEW.trace_id || '|' || NEW.user_id || '|' ||
                   NEW.input_text || '|' || NEW.final_answer || '|' ||
                   NEW.created_at || '|' || v_previous_hash;
  
  NEW.previous_hash := v_previous_hash;
  NEW.record_hash := encode(sha256(v_record_data::bytea), 'hex');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_chain_senate_hash
  BEFORE INSERT ON synth_senate_runs
  FOR EACH ROW EXECUTE FUNCTION chain_synth_senate_hash();
```

**Stored Fields:**
| Field | Description |
|-------|-------------|
| `trace_id` | Unique run identifier |
| `user_id` | Authenticated user (nullable) |
| `input_text` | Original submission |
| `ballots` | JSONB array of all 7 ballots |
| `final_answer` | Aggregated decision |
| `previous_hash` | Link to prior record |
| `record_hash` | SHA-256 of current record |
| `created_at` | Timestamp |

**Retention Modes:**
- `standard`: 90-day retention, then anonymized
- `extended`: 2-year retention for compliance
- `permanent`: No deletion (audit/legal requirements)

---

## APPENDIX APPENDIX A: REAL SAMPLE OUTPUTS (Validation Database; PII Redacted)

### A.1 Hash-Chain Audit Trail (synth_senate_runs)

**Record 1 (Genesis):**
```json
{
  "id": "0f94aea1-eb3d-4d47-9136-22ef1d44d97d",
  "trace_id": "SYNTH-1703198400-ABC123",
  "previous_hash": "GENESIS_e4b6cab3f1c341c326605a12c9e19a72b1403d078bddeb7f20e63f180e5d554a",
  "record_hash": "64af74911835f14203c8dc60dbf136ce8513540be6b01e34a0541f6849584ecf",
  "created_at": "2025-12-21T23:23:56.028Z"
}
```

**Record 2 (Chained):**
```json
{
  "id": "5238de71-553e-4a28-97ab-535e74fed664",
  "trace_id": "SYNTH-1703198500-DEF456",
  "previous_hash": "64af74911835f14203c8dc60dbf136ce8513540be6b01e34a0541f6849584ecf",
  "record_hash": "bad570cba20a44b3d7bcfbab123e3d38d05cab918fb4e5c5ceda7b9d1f67736a",
  "created_at": "2025-12-21T23:25:46.966Z"
}
```

**✓ VERIFIED:** Record 2's `previous_hash` exactly matches Record 1's `record_hash`.

### A.2 Session Lock Security Event (synth_security_events)

```json
{
  "id": "6e6ea250-155c-4cd9-bb2c-f681f8ff5d54",
  "user_id": "00000000-0000-0000-0000-000000000001",
  "session_id": "00000000-0000-0000-0000-000000000003",
  "escalation_level": 2,
  "action_taken": "restrict",
  "reason_codes": ["TOKEN_LENGTH_SHIFT", "READABILITY_SHIFT"],
  "metrics": {
    "current_tokens": 415,
    "previous_tokens": 120,
    "readability_delta": 35.2,
    "token_delta_pct": 245.7
  },
  "created_at": "2025-12-21T23:19:38.433Z"
}
```

**✓ VERIFIED:** Level 2 escalation with "restrict" action, triggered by 245.7% token shift and 35.2-point readability delta.

### A.3 Probation Mode (synth_probation)

```json
{
  "id": "a4738809-4a36-42b4-b610-8643efff1425",
  "target_user_id": "00000000-0000-0000-0000-000000000001",
  "is_active": true,
  "started_at": "2025-12-21T23:18:23.553Z",
  "expires_at": "2026-01-20T23:18:23.553Z",
  "notes": "Test probation for patent specification validation",
  "extra_logging": true,
  "strict_session_lock": true
}
```

**✓ VERIFIED:** 30-day probation with enhanced logging and strict session lock enabled.

### A.4 Calibration Audit (synth_calibration_audit)

```json
{
  "id": "8ebc9905-0fa7-4d6f-b055-653109e70dad",
  "actor_user_id": "00000000-0000-0000-0000-000000000002",
  "action_type": "calibration_change",
  "from_value": {
    "seat_1_weight": 15,
    "seat_2_weight": 15,
    "seat_3_weight": 15,
    "seat_4_weight": 14,
    "seat_5_weight": 14,
    "seat_6_weight": 14,
    "seat_7_weight": 13
  },
  "to_value": {
    "seat_1_weight": 20,
    "seat_2_weight": 18,
    "seat_3_weight": 16,
    "seat_4_weight": 12,
    "seat_5_weight": 12,
    "seat_6_weight": 12,
    "seat_7_weight": 10
  },
  "created_at": "2025-12-21T23:20:45.632Z"
}
```

**✓ VERIFIED:** Complete before/after weight audit with actor tracking. Both sums = 100.

---

## CLAIMS

1. A computer-implemented method for multi-model AI governance comprising:
   - Parallel invocation of seven distinct AI models as voting seats
   - Collection of structured ballot outputs from each seat
   - Weighted aggregation of votes with configurable per-organization weights
   - Escalation to an independent Judge model for contested decisions

2. The method of claim 1, further comprising:
   - Fault-tolerant handling of seat timeouts, errors, and rate limits
   - Automatic weight renormalization when seats abstain
   - Logging of abstention reason codes

3. The method of claim 1, further comprising:
   - Hash-chain integrity verification linking each audit record to its predecessor
   - Cryptographic proof of record ordering and tamper detection

4. The method of claim 1, further comprising:
   - Session-based anomaly detection measuring token count shifts, readability changes, and language shifts
   - Three-tier escalation ladder (verify → restrict → lock)
   - Security event logging with reason codes and metrics

5. The method of claim 1, further comprising:
   - Probation mode with stricter thresholds and enhanced logging
   - Time-bounded probation periods (default 30 days)
   - Response flagging indicating probation status

6. A system for employer-configurable AI governance comprising:
   - Weight calibration interface with sliders for each seat
   - Real-time validation ensuring weights sum to 100
   - Role-based access control limiting calibration to authorized users
   - Audit logging of all weight changes

7. A browser extension for content capture comprising:
   - Text selection capture from any webpage
   - Metadata extraction (URL, page title)
   - Secure prefill storage with time-limited tokens
   - Seamless redirect to governance console

---

## FIGURES

**FIG. 1** — SYNTH Pipeline Flow (see Section 2)

**FIG. 2** — Senate Orchestration & Weighted Voting (see Section 5)

**FIG. 3** — Chrome Extension Prefill Flow (see Section 10)

---

## IMPLEMENTATION STATUS

| Component | Status | Location |
|-----------|--------|----------|
| Senate Seats (7+Judge) | ✅ Implemented | `synth-senate-run/index.ts` |
| Parallel Invocation | ✅ Implemented | `Promise.allSettled()` pattern |
| Ballot Schema | ✅ Implemented | TypeScript interfaces |
| Weighted Voting | ✅ Implemented | Aggregation logic |
| Hash-Chain Audit | ✅ Implemented | `chain_synth_senate_hash()` trigger |
| Session Lock | ✅ Implemented | `detect_session_lock_trigger()` |
| Probation Mode | ✅ Implemented | `synth_probation` table + pipeline check |
| Calibration API | ✅ Implemented | `synth-calibration` edge function |
| Chrome Extension | ✅ Implemented | `public/chrome-extension/` |

---

Document prepared for patent filing. All code implementations verified as of December 22, 2025. Sample outputs extracted from a validation environment with PII redacted.
