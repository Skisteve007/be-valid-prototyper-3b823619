# THIRD-PARTY DEPENDENCY PLAN (INTERNAL)

**Classification:** CONFIDENTIAL — Admin Eyes Only  
**Owner:** Steven Grillo, CEO  
**Last Updated:** December 2024  
**Status:** Active Plan

---

## Purpose

This document catalogs VALID's critical third-party dependencies, assesses associated risks, and defines mitigation strategies.

---

## 1. Critical Dependencies

### Identity Verification

| Provider | Service | Criticality | Alternative |
|----------|---------|-------------|-------------|
| Footprint | IDV, KYC, document verification | CRITICAL | Persona, Jumio |
| | Biometric liveness | CRITICAL | iProov |

**Risk:** Single provider dependency  
**Mitigation:** API abstraction layer, documented switchover plan

---

### Payments

| Provider | Service | Criticality | Alternative |
|----------|---------|-------------|-------------|
| Stripe | Card processing, Connect | CRITICAL | Adyen, PayPal |
| PayPal | Alternative payment | MEDIUM | — |

**Risk:** Account freeze, fee changes  
**Mitigation:** Stripe Connect for venue payouts, diversified payment options

---

### Infrastructure

| Provider | Service | Criticality | Alternative |
|----------|---------|-------------|-------------|
| Supabase | Database, Auth, Storage | CRITICAL | Self-hosted Postgres, Firebase |
| Vercel | Frontend hosting | HIGH | Netlify, Cloudflare Pages |
| Cloudflare | CDN, DNS | HIGH | AWS CloudFront |

**Risk:** Service outage, pricing changes  
**Mitigation:** Database backups, deployment flexibility

---

### Communications

| Provider | Service | Criticality | Alternative |
|----------|---------|-------------|-------------|
| Resend | Transactional email | MEDIUM | SendGrid, Postmark |
| Twilio | SMS (future) | MEDIUM | MessageBird |

**Risk:** Deliverability issues  
**Mitigation:** Multiple sender domains, fallback providers

---

### AI/ML

| Provider | Service | Criticality | Alternative |
|----------|---------|-------------|-------------|
| OpenAI | SYNTH reasoning | HIGH | Anthropic, Google |
| Anthropic | SYNTH deliberation | HIGH | OpenAI |
| Google | Gemini models | MEDIUM | — |

**Risk:** API changes, model deprecation, rate limits  
**Mitigation:** Multi-model Senate architecture, caching, graceful degradation

---

## 2. Vendor Assessment Criteria

All critical vendors must meet:

- [ ] SOC 2 Type II or equivalent
- [ ] GDPR compliance (if handling EU data)
- [ ] DPA/BAA signed
- [ ] 99.9% uptime SLA
- [ ] Security incident notification clause
- [ ] Data portability provisions

---

## 3. Dependency Health Checks

| Check | Frequency | Owner |
|-------|-----------|-------|
| Uptime monitoring | Continuous | Engineering |
| Security posture review | Quarterly | Security |
| Contract renewal review | 90 days before expiry | Legal |
| Pricing/terms monitoring | Monthly | Finance |
| Alternative evaluation | Annually | Engineering |

---

## 4. Switchover Procedures

### Footprint → Alternative IDV
1. Activate abstraction layer
2. Configure new provider credentials
3. A/B test with subset of users
4. Full migration (2-week window)
5. Decommission old integration

### Stripe → Alternative Payments
1. Enable new payment processor
2. Parallel processing period
3. Migrate recurring subscriptions
4. Update payout configurations
5. Full cutover

---

## 5. Open Source Dependencies

### Security Policy
- Dependabot enabled
- Weekly vulnerability scans
- Maximum 7-day patch window for critical CVEs
- No dependencies with known unpatched vulnerabilities

### Key Libraries
| Package | Purpose | Risk Level |
|---------|---------|------------|
| React | UI framework | LOW |
| Supabase JS | Database client | MEDIUM |
| Stripe JS | Payment client | LOW |
| Tailwind | Styling | LOW |

---

## 6. Escrow & Business Continuity

### Data Escrow
- Daily database backups (Supabase)
- 30-day backup retention
- Cross-region replication (planned)

### Code Escrow
- GitHub repository (private)
- Regular exports to secondary location

---

*Document ID: THIRD_PARTY_DEPENDENCY_PLAN_INTERNAL_v1*
