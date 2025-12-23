# SECURITY, PRIVACY & DILIGENCE POSITIONING (INTERNAL)
**Document ID:** SEC-POS-001  
**Status:** Internal Working Draft (Not a certification)  
**Last Updated:** 2025-12-23  
**Owner:** Founder / Security Lead  
**Scope:** Project VALID + AI Senate (prototype → enterprise readiness)

## 0) Purpose (Why this exists)
This document defines what we **do**, what we **do not claim**, and what we are **building toward** so that:
- investor / enterprise diligence questions have consistent answers,
- we avoid overstatement ("HIPAA-compliant", "we store nothing", etc.),
- we reduce legal and reputational risk during outbound enterprise conversations.

## 1) Truth-in-Claims Policy (Non‑negotiable)
We do **not** claim certifications or regulatory compliance unless we can evidence it.
Examples:
- Do NOT say "HIPAA compliant" unless we have a signed BAA and defined PHI controls.
- Do NOT say "SOC 2 Type II" unless audited and report exists.
- Do NOT say "patented" unless issued. Use "patent-pending" only if filed.

Approved phrasing:
- "privacy by design"
- "data minimization"
- "bank-grade roadmap / enterprise-ready architecture path"
- "prototype with security controls appropriate for current stage"

## 2) Data Lifecycle & Retention (Answer before anyone asks)
We explicitly define retention for:
A) **PII / identity artifacts** (if collected)  
B) **verification outputs** (e.g. pass/fail / tiered status)  
C) **transaction metadata** (timestamps, device, scan events)  
D) **audit logs**

### 2.1 Default Retention Targets (can be configured per customer/region)
- **PII / raw documents:** minimize; retain only as required for verification workflow.  
- **Verification result token metadata:** retain only what is necessary to prove a valid verification state.  
- **Scan events / transactional metadata:** retain for **X days** (default: 30) for fraud & dispute resolution.  
- **Security audit logs (admin access, key events):** retain for **Y days** (default: 90–180) subject to legal requirements.

### 2.2 Deletion & Purge
- Automated purge jobs must exist for metadata beyond retention windows.
- Deletion events should be logged (without retaining deleted content).
- Any exception requires explicit documented approval.

## 3) Token/QR Security Model (Stop screenshot replay)
### 3.1 Threat
Static QR codes can be copied (screenshots) and replayed.

### 3.2 Required Controls (roadmap items are allowed—label them)
- **Ephemeral token** (short TTL) OR **nonce challenge** during scan.
- **One-time-use** option for high-risk flows.
- **Digital signatures**: tokens must be signed server-side; scanners verify signature.
- **Server-side invalidation** after scan (optional mode).

## 4) Dependency & Fallback Plan (No single point of failure)
We depend on external sources (labs, IDV vendors). Diligence questions must be answered:

### 4.1 Failure Modes
- Vendor API down
- Vendor false negative/positive
- Vendor SLA breach / region outage
- Data quality degradation

### 4.2 Graceful Degradation
Approved fallback behaviors:
- "Last-known-good verification" only if timestamped + expired clearly.
- "Verification unavailable" fail-closed mode for high-risk venues.
- Queue + retry with user-visible status for consumer flows.

We do not promise 100% uptime without contracted SLAs.

## 5) Insider Threat + Human Layer (Fourth Ring)
We explicitly address:
- least privilege / RBAC for staff,
- privileged access logging,
- separate prod vs dev environments,
- break-glass access with approvals,
- phishing-resistant admin auth (MFA required),
- documented incident response runbooks + breach drills.

## 6) Key Management & Signing
- Private signing keys should be stored in managed KMS/HSM where possible.
- No private keys in client apps or public repos.
- Secret scanning + mandatory MFA for GitHub org/repo access.
- Rotate keys on schedule; log key usage.

## 7) Compliance Roadmap (Transparent and timeboxed)
This is a roadmap, not a claim:
- SOC 2 Type I → Type II
- Pen test cadence (e.g., annual + before major launches)
- HIPAA posture (only if/when PHI is processed; BAA required)
- GDPR readiness (DPA templates, deletion rights, export)

## 8) Enterprise Deployment Posture
Supported / planned options:
- Vercel/managed cloud for early stage
- Phase 2: VPC deployment
- Phase 3: hybrid/on‑prem for regulated clients

## 9) Patent Positioning (Do not oversell)
We separate:
- what is standard (QR + hashes) vs
- what is novel (multi-party arbitration, contradiction resolution, ephemeral signed token chaining, auditable dissent logs).

We only use "patent-pending" if filed.

## 10) Required Disclaimers (Use in decks, demos, meetings)
- "This is a prototype / early-stage system."
- "No regulatory compliance is claimed unless explicitly stated with evidence."
- "This is not legal advice."
- "We can support regulated deployments via VPC/on‑prem roadmap and third-party security validation."

---
**End of Internal Policy**
