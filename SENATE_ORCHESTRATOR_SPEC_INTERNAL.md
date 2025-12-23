# SENATE_ORCHESTRATOR_SPEC_INTERNAL
**Doc ID:** SYNTH-SENATE-SPEC-002  
**Status:** Internal Engineering Spec (Prototype)  
**Purpose:** Replace the CEO/human message bus with a governed, auditable, cost-controlled multi-model deliberation pipeline.

---

## 1) Non-Negotiables (Ass-Covering Rules)
1. **No Over-Claims:** The product must not claim SOC2/HIPAA/ISO/patents unless verifiable artifacts exist (report numbers, BAA, patent numbers).
2. **Auditability:** Every session produces a replayable transcript and a final decision record.
3. **Fail-Closed Option:** If confidence is low or contradictions remain unresolved, the system outputs:  
   **"DEFERRED: Insufficient certainty. Required evidence: X."**
4. **Vendor Independence:** Models are pluggable via config; no hard-coded vendor logic.
5. **Cost & Safety Controls:** Hard budgets for time, tokens, and number of model calls per session.

---

## 2) Architecture (Minimum Viable Orchestrator)
### Modules
- **Intake Gateway** → creates canonical ChallengePacket
- **Dispatcher** → fans out to Senators in parallel
- **Contradiction Engine** → detects conflicts & triggers Round 2
- **Judge** → produces final arbitrated output
- **Audit Logger** → append-only log + redaction + retention rules
- **Policy Engine** → enforces claim boundaries + allowed actions/tools

---

## 3) Configuration Layer (Swappable Models)
All model providers must be defined in a config registry:
- provider: `openai | anthropic | google | deepseek | xai | local`
- model name/version
- endpoint URL
- API key reference (never hard-coded)
- max tokens
- timeout seconds
- cost per 1k tokens (estimated)
- role suitability: `judge | senator | summarizer`

**Requirement:** Orchestrator must be able to replace any model without code changes beyond config.

---

## 4) ChallengePacket (Canonical Input)
`ChallengePacket` fields (minimum):
- `challenge_id` (uuid)
- `created_at` (ISO)
- `domain` (finance/security/product/legal/etc.)
- `priority` (low/med/high)
- `prompt` (string)
- `constraints` (array: claim limits, compliance language, prohibited actions)
- `success_criteria` (array)
- `inputs` (optional attachments/links; may be empty)
- `budget`:
  - `max_rounds` (default 2)
  - `max_senators` (default 5)
  - `max_total_tokens`
  - `max_total_cost_usd_estimate`
  - `timeout_seconds_total`

---

## 5) Senator Output Schema (Strict)
Each Senator must return JSON with:
- `role`: string
- `claims`: array of { claim, confidence_0_1 }
- `assumptions`: array of strings
- `evidence_needed`: array of strings
- `risks`: array of { risk, severity_low_med_high }
- `recommendation`: string
- `counterarguments`: array of strings
- `citations`: array of { title, url } OR empty
- `notes`: string (optional)

**Rule:** Anything not matching schema is rejected and retried once with a "format correction" prompt.

---

## 6) Contradiction Engine (Practical, Not Overbuilt)
### Detect conflicts when:
- Two claims refer to same concept but opposite stance (yes/no, do/don't)
- Confidence is high on both sides (>= 0.65) AND disagreement exists
- Or one flags "critical risk" and another omits it

### Output:
- `conflicts`: list of { topic, senator_a, senator_b, conflict_question }

### Round 2:
Only senators involved in conflicts respond, strictly answering conflict questions.

---

## 7) Judge (Arbitration + Bias Control)
### Judge Input Pack
- ChallengePacket
- Senator outputs Round 1
- Conflicts + Round 2 answers (if any)

### Judge Output Schema
- `final_decision` (one paragraph)
- `rationale` (bullets)
- `dissent` (who disagreed + why)
- `conditions` (what must be true for decision to hold)
- `unknowns` (what we don't know)
- `next_actions` (task list)
- `confidence_0_1`
- `safety_language` (approved phrasing to avoid over-claims)

### Bias control (minimum)
- For high-stakes domains, rotate judge between 2+ judge-capable models OR run a "meta-check":
  - secondary judge validates only for contradictions/unsupported claims

---

## 8) Cost / Performance Controls
- Parallelism is allowed but must respect budgets.
- If estimated cost exceeds budget:
  - reduce senators, reduce max tokens, or switch to cheaper model tier.
- Hard timeout per call + total session timeout.
- Cache:
  - store past sessions and allow reuse of stable sub-results (optional later)

---

## 9) Security & Logging
- API keys in server secret manager only.
- Redact PII from logs where possible.
- Retention policy configurable by environment.
- Admin-only UI for transcript review.

---

## 10) MVP Definition (What "Done" Means)
MVP is achieved when:
1) Intake creates ChallengePacket
2) 3+ senators run in parallel and return schema-valid JSON
3) Contradictions are detected and Round 2 runs when needed
4) Judge outputs final decision with dissent + confidence
5) Transcript is saved and viewable in admin UI

---

## Think Tank Origin
This spec synthesizes:
- **DeepSeek:** Original Senate Autopilot blueprint
- **Grok:** Practical critique (API costs, judge bias, contradiction depth)
- **GPT/Copilot:** Liability-safe refinements (fail-closed, no over-claims, vendor independence)

**Philosophy:** Governance becomes infrastructure. The human is the overseer, not the router.

---
**End Spec**
