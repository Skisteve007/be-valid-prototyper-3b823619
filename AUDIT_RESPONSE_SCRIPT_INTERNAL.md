# AUDIT RESPONSE SCRIPT (INTERNAL)
**Document ID:** AUDIT-RESP-001  
**Status:** Internal Sales/Security Script  
**Purpose:** Prepared responses when prospects audit us with their own AI

---

## When They Audit Us With Their Own AI

### Layman Version (Say This First)

"That's perfect — you *should* audit us. We don't ask you to trust our pitch.  

Every decision we produce comes with a **proof record** — basically a **tamper‑proof receipt**.  

It shows *what rulebook we used*, *when the decision happened*, and it can be independently verified.  

So even if you use your own AI to test us, you don't have to believe us — you can **verify the receipt**."

**One-liner:**

"Don't trust the narrative — verify the proof record."

---

### Technical Version (If Security/Engineering Is in the Room)

"Please audit us with your own systems. Our outputs ship with a **verifiable proof record** that includes:

- `proof_id`
- `input_hash` (hash of the evaluated payload, not the raw source record)
- `issued_at` / `expires_at`
- `policy_pack_version`
- decision signal (`ALLOW/BLOCK/FLAG` or `CERTIFIED/MISTRIAL`) + reason codes
- cryptographic signature over the record

Your team can validate:

1) Signature validity (tamper detection)
2) Policy/version traceability (what rules produced the result)
3) Replay consistency (same input + same policy pack → same decision path, within configured nondeterminism bounds)
4) Boundary compliance: enterprise deployments can run **in your environment** so raw payloads stay inside your network boundary

**Key point:**

LLMs can argue about content. They can't alter a signature, timestamp, or policy version. The audit becomes: *does the proof record verify?*

---

### Objection Handling (Fast)

**Q: "So you store our data?"**  
A: "No. In enterprise mode the runtime can run inside your environment; we return signed decision signals + proof artifacts. We don't become your system of record."

**Q: "We'll test you with our own model."**  
A: "Great — we're model‑agnostic. Validate the proof record; that's the ground truth."

---

### Do NOT Say

- "Our models will beat your models"
- "We'll clown on your AI"

**Say instead:**

"We welcome audits because we're built for independent verification."

---
**End Script**
