# DATA LIFECYCLE POLICY (INTERNAL)

**Classification:** CONFIDENTIAL — Admin Eyes Only  
**Owner:** Steven Grillo, CEO  
**Last Updated:** December 2024  
**Status:** Active Policy

---

## Purpose

This policy defines how VALID handles personal data throughout its lifecycle: collection, processing, storage, retention, and deletion.

---

## 1. Data Classification

### Tier 1: Highly Sensitive
- Government ID documents
- Biometric data (face scans, fingerprints)
- Financial account details
- Health/lab results
- Social Security Numbers (if collected)

**Handling:** Encrypted at rest and in transit, strict access controls, audit logging, minimal retention.

### Tier 2: Sensitive
- Email addresses
- Phone numbers
- Date of birth
- Profile preferences
- Location data

**Handling:** Encrypted in transit, access controls, reasonable retention.

### Tier 3: Operational
- Session logs
- Analytics data (anonymized)
- System metrics

**Handling:** Standard security, aggregation preferred.

---

## 2. Collection Principles

1. **Minimization:** Collect only what's necessary for the stated purpose
2. **Consent:** Explicit consent for sensitive data; legitimate interest for operational
3. **Transparency:** Clear disclosure in privacy policy
4. **Purpose Limitation:** Use data only for stated purposes

---

## 3. Storage Requirements

| Data Type | Storage Location | Encryption | Access Control |
|-----------|------------------|------------|----------------|
| IDV Documents | Footprint (vault) | AES-256 | API key + user consent |
| User Profiles | Supabase | At rest | RLS policies |
| Lab Results | Supabase (encrypted column) | AES-256 | User + Admin only |
| Session Tokens | Memory/Redis | In transit | TTL-based expiry |
| Audit Logs | Supabase | At rest | Admin only |

---

## 4. Retention Schedule

| Data Category | Retention Period | Deletion Method |
|---------------|------------------|-----------------|
| Active user profiles | Account lifetime + 30 days | Soft delete → Hard delete |
| Inactive accounts | 2 years inactivity | Anonymization or deletion |
| IDV verification records | 7 years (regulatory) | Secure erasure |
| Lab results | User-controlled + 1 year | Secure erasure |
| Audit logs | 3 years | Archive then delete |
| Session data | 24 hours | Automatic TTL |
| Payment records | 7 years (tax) | Archive |

---

## 5. Deletion Procedures

### User-Initiated Deletion
1. User requests deletion via dashboard or support
2. System flags account for deletion
3. 30-day grace period (reversible)
4. Hard deletion of personal data
5. Anonymization of aggregate data
6. Confirmation email sent

### Regulatory Deletion (GDPR/CCPA)
1. Verify requestor identity
2. 30-day compliance window
3. Document all deleted data
4. Notify third-party processors
5. Provide deletion confirmation

---

## 6. Data Subject Rights

| Right | Implementation |
|-------|----------------|
| Access | Profile export feature |
| Rectification | Profile editing |
| Erasure | Deletion request flow |
| Portability | JSON export |
| Restriction | Account freeze option |
| Objection | Marketing opt-out |

---

## 7. Third-Party Data Sharing

### Approved Processors
- Footprint (IDV)
- Stripe (payments)
- Resend (email)
- Supabase (database)

### Requirements
- DPA in place
- Security assessment completed
- Minimum necessary data shared
- Logging of all transfers

---

## 8. Breach Response

1. **Detection:** Automated monitoring, user reports
2. **Containment:** Immediate isolation
3. **Assessment:** Scope and impact analysis
4. **Notification:** 72 hours for regulators (GDPR), immediate for affected users
5. **Remediation:** Root cause fix
6. **Review:** Post-incident analysis

---

*Document ID: DATA_LIFECYCLE_POLICY_INTERNAL_v1*
