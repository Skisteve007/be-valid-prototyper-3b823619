# SENATE_AUTOPILOT_INTERNAL (ADMIN)
**Purpose:** Define the minimal architecture for autonomous multi-model deliberation without a human message bus.  
**Status:** Internal roadmap (not a promise, not a certification).  
**Default Mode:** Async (minutes) with audit logging.

## Goal
When a challenge arrives, the system automatically routes it through the Senate, resolves contradictions, and presents one final decision from the Judge—without manual copy/paste between models.

## Minimal Flow (MVP)
1) **Intake**
- Create `challenge_id`
- Normalize into a canonical `ChallengePacket` (JSON)
- Store packet + timestamp + constraints

2) **Round 1: Parallel Senators**
- Send packet to each Senator role
- Require structured output:
  - Claims
  - Assumptions
  - Evidence Needed
  - Risks
  - Recommendation
  - Confidence (0–1)

3) **Contradiction Pass**
- Detect conflicting claims
- Generate a small set of "conflict questions"

4) **Round 2: Targeted Responses**
- Only the Senators involved in contradictions respond

5) **Judge Arbitration**
- Judge receives: summaries + contradictions + dissent
- Judge outputs:
  - Final Decision
  - Rationale
  - Conditions / Guardrails
  - What would change the decision
  - Action checklist

6) **Audit Log**
- Append-only transcript: packets, outputs, judge decision, timestamps
- Redact secrets/PII by policy

## Guardrails
- No certification claims unless evidenced (SOC2/HIPAA/etc.)
- Fail-closed option: if confidence too low → "defer + gather X"
- Access control: admin-only viewing of logs & internal docs

## Implementation Notes (non-binding)
- Central Orchestrator service (recommended) calls model APIs
- Store transcripts in DB (or object storage) with retention controls
- Provide an admin UI route: `/synth/docs/senate-autopilot` rendering this doc
