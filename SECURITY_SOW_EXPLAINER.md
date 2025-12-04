# CleanCheck FinTech & DevSecOps Statement of Work (SOW)

## Executive Summary

This document outlines the security architecture, compliance requirements, and DevSecOps practices for CleanCheck - a privacy-first health verification platform handling sensitive Personal Health Information (PHI) and payment data.

---

## 1. Platform Overview

### 1.1 Application Scope
- **Frontend**: React/TypeScript SPA with Vite build system
- **Backend**: Supabase (PostgreSQL, Edge Functions, Auth, Storage)
- **Payments**: PayPal integration for subscription billing
- **Mobile**: Capacitor wrapper for iOS/Android deployment

### 1.2 Data Classification

| Data Type | Classification | Storage | Encryption |
|-----------|---------------|---------|------------|
| User Credentials | Critical | Supabase Auth | bcrypt + AES-256 |
| PHI (Health Status) | Critical | PostgreSQL | AES-256 at rest |
| Payment Data | Critical | PayPal (external) | PCI-DSS compliant |
| Profile Images | Sensitive | Supabase Storage | AES-256 at rest |
| QR Tokens | Sensitive | PostgreSQL | Time-limited, hashed |
| Session Data | Internal | JWT | RS256 signed |

---

## 2. Compliance Framework

### 2.1 HIPAA Compliance
CleanCheck handles Protected Health Information (PHI) and maintains compliance through:

- **Privacy Rule**: User consent required before any health data sharing
- **Security Rule**: Technical safeguards implemented (encryption, access controls)
- **Breach Notification**: Incident response plan with 72-hour notification window
- **Business Associates**: All third-party integrations reviewed for BAA requirements

### 2.2 Payment Security (PCI-DSS)
- **No Card Storage**: All payment processing delegated to PayPal
- **Tokenization**: Payment references stored as non-reversible tokens
- **TLS 1.3**: All payment-related communications encrypted in transit

### 2.3 Data Privacy (GDPR/CCPA)
- **Right to Access**: Users can export their data
- **Right to Deletion**: Account deletion removes all PII
- **Consent Management**: Explicit opt-in for data sharing features
- **Data Minimization**: Only essential data collected

---

## 3. Security Architecture

### 3.1 Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Flow                       │
├─────────────────────────────────────────────────────────────┤
│  User → Supabase Auth → JWT Token → RLS Policy Enforcement  │
│                                                              │
│  Roles: guest → registered → paid → active_member → admin   │
└─────────────────────────────────────────────────────────────┘
```

**Implementation Details:**
- JWT tokens with 1-hour expiry, auto-refresh enabled
- Role-based access control (RBAC) via `user_roles` table
- Row-Level Security (RLS) on all database tables
- Security-definer functions for cross-table queries

### 3.2 Database Security

**Row-Level Security (RLS) Policy Matrix:**

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | Owner + Admin | Owner | Owner + Admin | Disabled |
| lab_orders | Owner + Admin | Owner | Admin Only | Disabled |
| certifications | Owner + Admin | Owner | Owner + Admin | Owner |
| user_roles | Owner + Admin | System | Admin Only | Admin Only |

**Critical Security Functions:**
```sql
-- Role verification (prevents RLS recursion)
has_role(_user_id uuid, _role app_role) → boolean

-- Venue operator verification
is_venue_operator(_user_id uuid, _venue_id uuid) → boolean

-- QR token validation (time-limited access)
has_valid_qr_token(_profile_id uuid, _token text) → boolean
```

### 3.3 API Security (Edge Functions)

**Security Headers:**
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Restricted in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

**JWT Verification:**
- All authenticated endpoints require valid JWT
- Public endpoints explicitly marked with `verify_jwt = false`
- Service role key used only for system operations

### 3.4 Data Encryption

| Layer | Method | Key Management |
|-------|--------|----------------|
| At Rest | AES-256 | Supabase managed |
| In Transit | TLS 1.3 | Auto-renewed certificates |
| Application | bcrypt (passwords) | Salt per user |
| QR Tokens | SHA-256 hash | Time-limited validity |

---

## 4. DevSecOps Practices

### 4.1 Secure Development Lifecycle

```
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│   Plan     │ →  │   Code     │ →  │   Build    │ →  │   Test     │
│            │    │            │    │            │    │            │
│ • Threat   │    │ • Secure   │    │ • SAST     │    │ • DAST     │
│   Modeling │    │   Coding   │    │ • Dep Scan │    │ • Pen Test │
└────────────┘    └────────────┘    └────────────┘    └────────────┘
       │                                                      │
       │              ┌────────────┐    ┌────────────┐        │
       └───────────── │   Deploy   │ ←  │   Monitor  │ ←──────┘
                      │            │    │            │
                      │ • Secrets  │    │ • Logging  │
                      │ • Config   │    │ • Alerts   │
                      └────────────┘    └────────────┘
```

### 4.2 Security Checklist

#### Database Security
- [ ] RLS enabled on all tables
- [ ] RLS policies follow least-privilege principle
- [ ] PII encryption at rest verified
- [ ] Database backups configured with retention policy

#### Authentication & Access
- [ ] Auth flow secured with proper validation
- [ ] JWT validation active on all protected endpoints
- [ ] Role-based access control properly separated
- [ ] Session management with proper token expiry

#### API Security
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all user inputs
- [ ] Secure error handling (no sensitive data exposure)

#### Secrets Management
- [ ] No hardcoded API keys or credentials
- [ ] Key rotation policy defined
- [ ] Secret access audit logging

#### Monitoring & Logging
- [ ] Audit logging active for security events
- [ ] Error monitoring with real-time alerting
- [ ] Access logs retained per compliance requirements

### 4.3 Dependency Security

**Automated Scanning:**
- GitHub Dependabot for vulnerability alerts
- npm audit on build pipeline
- Snyk integration for deep dependency analysis

**Update Policy:**
- Critical vulnerabilities: 24-hour remediation
- High vulnerabilities: 7-day remediation
- Medium/Low: Monthly review cycle

---

## 5. Incident Response Plan

### 5.1 Severity Classification

| Severity | Description | Response Time | Escalation |
|----------|-------------|---------------|------------|
| P1 - Critical | Data breach, system compromise | 15 minutes | Immediate exec notification |
| P2 - High | Service degradation, auth issues | 1 hour | Engineering lead |
| P3 - Medium | Non-critical bugs, performance | 4 hours | On-call engineer |
| P4 - Low | Minor issues, improvements | 24 hours | Normal triage |

### 5.2 Breach Response Protocol

1. **Detection** (0-15 min)
   - Automated alerts trigger
   - On-call engineer acknowledges

2. **Containment** (15-60 min)
   - Isolate affected systems
   - Revoke compromised credentials
   - Preserve evidence

3. **Investigation** (1-24 hours)
   - Root cause analysis
   - Impact assessment
   - User notification preparation

4. **Notification** (24-72 hours)
   - Affected users notified
   - Regulatory bodies informed (if required)
   - Public disclosure (if required)

5. **Remediation** (1-7 days)
   - Vulnerability patched
   - Systems hardened
   - Post-mortem documented

---

## 6. Third-Party Integrations

### 6.1 Integration Security Assessment

| Service | Purpose | Data Shared | Security Review |
|---------|---------|-------------|-----------------|
| Supabase | Backend | All app data | SOC 2 Type II |
| PayPal | Payments | Email, amounts | PCI-DSS Level 1 |
| Resend | Email | Email addresses | SOC 2 Type II |
| Vercel | Hosting | Static assets | SOC 2 Type II |

### 6.2 API Key Management

**Storage:**
- Production secrets in Supabase Vault
- Development secrets in environment variables
- No secrets in source code repository

**Access Control:**
- Principle of least privilege
- Service-specific API keys
- Regular key rotation schedule

---

## 7. Infrastructure Security

### 7.1 Network Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                    ┌─────▼─────┐
                    │   CDN     │  Vercel Edge Network
                    │ (TLS 1.3) │  DDoS Protection
                    └─────┬─────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
        ┌─────▼─────┐ ┌───▼───┐ ┌─────▼─────┐
        │  Static   │ │  API  │ │   Edge    │
        │  Assets   │ │ Gateway│ │ Functions │
        └───────────┘ └───┬───┘ └─────┬─────┘
                          │           │
                    ┌─────▼───────────▼─────┐
                    │     Supabase          │
                    │  ┌─────────────────┐  │
                    │  │   PostgreSQL    │  │
                    │  │   (RLS Active)  │  │
                    │  └─────────────────┘  │
                    │  ┌─────────────────┐  │
                    │  │    Storage      │  │
                    │  │  (Encrypted)    │  │
                    │  └─────────────────┘  │
                    └───────────────────────┘
```

### 7.2 Environment Separation

| Environment | Purpose | Data | Access |
|-------------|---------|------|--------|
| Development | Feature development | Synthetic | Developers |
| Staging | Pre-production testing | Anonymized | QA + Developers |
| Production | Live service | Real | Operations only |

---

## 8. Audit & Compliance Reporting

### 8.1 Audit Logs Retained

- **Authentication events**: 90 days
- **Data access logs**: 1 year
- **Administrative actions**: 2 years
- **Payment records**: 7 years

### 8.2 Compliance Certifications (Target)

- [ ] SOC 2 Type II
- [ ] HIPAA Compliance Attestation
- [ ] ISO 27001 (future)

### 8.3 Penetration Testing Schedule

- **External pen test**: Quarterly
- **Internal security audit**: Monthly
- **Automated vulnerability scanning**: Continuous

---

## 9. Contact & Escalation

### Security Team

| Role | Contact | Responsibility |
|------|---------|----------------|
| Security Lead | security@cleancheck.fit | Overall security posture |
| DevOps Lead | devops@cleancheck.fit | Infrastructure security |
| Compliance Officer | compliance@cleancheck.fit | Regulatory compliance |

### Emergency Contacts

- **Security Hotline**: security-emergency@cleancheck.fit
- **Data Breach Response**: breach@cleancheck.fit

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-04 | CleanCheck Security | Initial SOW |

---

*This document is confidential and intended for internal use and authorized partners only.*
