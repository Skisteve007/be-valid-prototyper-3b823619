# SF Demo Readiness Checklist — Jan 9, 2025

**Last Updated:** December 27, 2024  
**Target:** Demo-ready rollout for San Francisco trip  
**Freeze Date:** Jan 8 EOD

---

## ✅ COMPLETED

### 1. Mobile-Responsive UI + PWA Install Support
- [x] All pages use Tailwind responsive utilities
- [x] `manifest.json` with shortcuts for Demos, Partners, Login
- [x] Service worker (`/sw.js`) with offline caching
- [x] Offline fallback page (`/offline.html`)
- [x] iOS "Add to Home Screen" prompt
- [x] Android native install banner
- [x] Touch targets ≥44px on mobile

### 2. Internal Terms Removed from Public Copy
- [x] FlowDiagram uses generic terms ("Governance Pipeline", "Validation Checks", "Arbitration")
- [x] DemoSenateQA → "AI Review Panel", "Multi-model answer", "Model Assessments"
- [x] DemoAuditVerifier → Generic issuer "Valid/SYNTH v2.1", cleaned hash/timestamp language
- [x] DemoEnterpriseSandbox → "minimal metadata" instead of "hashes/timestamps"

### 3. Server-Side RBAC Enforcement
- [x] All edge functions require Authorization header
- [x] Auth token validated via `supabase.auth.getUser(token)`
- [x] Returns 401/403 for invalid/missing auth
- [x] Stripe webhook uses signature verification
- [x] `create-first-admin` only works when no admin exists

### 4. Tier-0 STEVE_OWNER Enforcement
- [x] `SteveOwnerGate` component blocks non-Steve users
- [x] Hardcoded emails: `steve@bevalid.app`, `sgrillocce@gmail.com`
- [x] Protected pages:
  - `/admin` (Admin.tsx)
  - `/think-tank` (ThinkTank.tsx)
  - `/synth/admin` (SynthAdmin.tsx)
  - `/synth/console` (SynthConsole.tsx)
  - `/synth/logs` (SynthLogs.tsx)
- [x] Returns 403 Access Denied page for unauthorized

### 5. Footprint Integration
- [x] `trigger-footprint-liveness` function creates Footprint session
- [x] `footprint-webhook` handles verification callbacks
- [x] Stores verification status in `driver_profiles` and `verifications` tables
- [x] Real-time broadcast for status updates
- [x] Secrets configured: `FOOTPRINT_SECRET_KEY`, `FOOTPRINT_PLAYBOOK_KEY`

---

## ⚠️ NEEDS ATTENTION (Before Jan 7)

### 6. Stripe Subscription Flow
| Item | Status | Notes |
|------|--------|-------|
| Stripe connection | ✅ Connected | Secret key configured |
| Payment products | ✅ Exist | IDV, Wallet Reload, Deal Room |
| **Subscription product** | ❌ Missing | Need to create recurring product |
| **check-subscription function** | ❌ Missing | Need to query Stripe for active sub |
| **Entitlement gating** | ⚠️ Partial | Uses `synth_entitlements` table, not Stripe |

**Current State:** One-off payments work. Subscription-based entitlement requires:
1. Create Stripe subscription product + price
2. Create `check-subscription` edge function
3. Wire entitlement checks to Stripe subscription status

**For Demo:** Current setup (trial entitlements) is functional for demo purposes.

---

## 📋 Jan 7 Pre-Demo Tasks

- [ ] Test all demo flows on mobile device
- [ ] Verify PWA install works on iOS Safari + Android Chrome
- [ ] Confirm Footprint IDV flow completes end-to-end
- [ ] Test Stripe payment flow (IDV checkout)
- [ ] Verify Steve-only routes block test accounts
- [ ] Check WhatsApp links work on mobile

## 📋 Jan 8 QA + Hardening

- [ ] Full walkthrough of Demo Hub (A, B, C, D)
- [ ] Test auth flow (signup → login → protected routes)
- [ ] Verify error handling / graceful degradation
- [ ] **Code freeze at EOD**

---

## Demo URLs

| Demo | Path | Status |
|------|------|--------|
| Demo A — AI Review Panel | `/demos/senate-qa` | ✅ Ready |
| Demo B — Monitoring | `/demos/monitoring` | ✅ Ready |
| Demo C — Enterprise Sandbox | `/demos/enterprise-sandbox` | ✅ Ready |
| Demo D — Proof Verifier | `/demos/audit-verifier` | ✅ Ready |
| Demo Hub | `/demos` | ✅ Ready |

---

## Security Summary

| Control | Implementation |
|---------|----------------|
| Tier-0 Access | `SteveOwnerGate` component + hardcoded email list |
| Auth Enforcement | Edge functions validate JWT token |
| RBAC | `user_roles` table + `has_role()` DB function |
| Webhook Security | Stripe signature verification |
| IDV Security | Footprint API keys in Cloud secrets |

---

**Document maintained for SF Demo — January 2025**
