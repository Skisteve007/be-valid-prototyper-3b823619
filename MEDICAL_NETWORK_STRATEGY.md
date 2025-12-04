# CleanCheck Medical Network Integration Strategy

## Executive Summary

This document defines CleanCheck's strategy for integrating with medical laboratory networks, healthcare information systems, and compliance frameworks. It covers HIPAA-compliant data exchange, HL7/FHIR interoperability standards, and certified lab partner protocols.

---

## 1. Medical Network Landscape

### 1.1 Integration Ecosystem

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MEDICAL NETWORK INTEGRATION LANDSCAPE                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Reference Labs                    CleanCheck                Healthcare    │
│   ┌─────────────┐                  ┌─────────────┐         ┌─────────────┐ │
│   │  LabCorp    │───HL7/REST──────►│             │◄────────│   EHR/EMR   │ │
│   │  Quest      │                  │  Integration │         │  Systems    │ │
│   │  BioRef     │                  │     Hub      │         │ (Epic,Cerner)│ │
│   └─────────────┘                  │             │         └─────────────┘ │
│                                    │  ┌───────┐  │                         │
│   Point-of-Care                    │  │ FHIR  │  │         ┌─────────────┐ │
│   ┌─────────────┐                  │  │ API   │  │◄────────│   HIE/HIN   │ │
│   │ Rapid Test  │───API────────────│  └───────┐  │         │  Networks   │ │
│   │  Providers  │                  │          │  │         └─────────────┘ │
│   └─────────────┘                  │  ┌───────┐  │                         │
│                                    │  │Result │  │         ┌─────────────┐ │
│   Toxicology Labs                  │  │Parser │  │────────►│  Pharmacy   │ │
│   ┌─────────────┐                  │  └───────┘  │         │  Benefit    │ │
│   │ Drug Screen │───HL7────────────│             │         │  Managers   │ │
│   │  Labs       │                  └─────────────┘         └─────────────┘ │
│   └─────────────┘                         │                               │
│                                           ▼                               │
│                              ┌─────────────────────┐                      │
│                              │   Compliance Layer   │                      │
│                              │  • HIPAA Encryption  │                      │
│                              │  • Audit Logging     │                      │
│                              │  • BAA Management    │                      │
│                              └─────────────────────┘                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Supported Test Categories

| Category | Test Types | Turnaround | Integration Priority |
|----------|------------|------------|---------------------|
| **STD Panel** | HIV, Syphilis, Gonorrhea, Chlamydia, Hepatitis B/C, HSV-1/2 | 2-5 days | Critical |
| **Toxicology** | 10-Panel Drug Screen, Extended Panel | 1-3 days | High |
| **Health Panel** | CBC, Lipid Panel, Metabolic Panel | 1-2 days | Medium |
| **Rapid Tests** | COVID-19, Rapid HIV, Strep | 15-30 min | Future |

---

## 2. Lab Partner Integration Framework

### 2.1 Partner Onboarding Process

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Partner    │    │   Technical  │    │   Security   │    │   Go-Live    │
│  Discovery   │───►│    Setup     │───►│   Review     │───►│  Activation  │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
      │                    │                   │                   │
      ▼                    ▼                   ▼                   ▼
 • Capabilities       • API Key Gen       • Pen Test          • Pilot Phase
 • Volume Est.        • Webhook Config    • BAA Signing       • Monitoring
 • Pricing            • Test Environment  • Compliance Audit  • Full Launch
```

### 2.2 Database Schema: Lab Partners

```sql
-- lab_partners table structure
CREATE TABLE public.lab_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  api_key TEXT NOT NULL,  -- Hashed
  contact_email TEXT,
  active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Extended fields for medical integration
  clia_number TEXT,           -- CLIA certification
  cap_accredited BOOLEAN,     -- CAP accreditation
  supported_tests TEXT[],     -- Array of test codes
  result_format TEXT,         -- 'HL7' | 'FHIR' | 'REST_JSON'
  webhook_url TEXT,           -- Outbound notifications
  timezone TEXT DEFAULT 'UTC'
);
```

### 2.3 Lab Result Processing Flow

```
Lab System                           CleanCheck
    │                                    │
    │  POST /receive-lab-result          │
    │  X-Lab-API-Key: {hashed_key}       │
    ├───────────────────────────────────►│
    │                                    │
    │                          ┌─────────┴─────────┐
    │                          │ 1. Validate API Key│
    │                          │ 2. Parse Result    │
    │                          │ 3. Match Barcode   │
    │                          │ 4. Apply Rules     │
    │                          └─────────┬─────────┘
    │                                    │
    │                          ┌─────────┴─────────┐
    │                          │ Result = Negative? │
    │                          └─────────┬─────────┘
    │                                    │
    │                    ┌───────────────┼───────────────┐
    │                    ▼               ▼               ▼
    │              ┌─────────┐    ┌─────────────┐  ┌──────────┐
    │              │ Negative│    │Inconclusive │  │ Positive │
    │              │ → Lock  │    │ → Exception │  │→ Exception│
    │              │ Profile │    │    Queue    │  │  + Alert │
    │              └─────────┘    └─────────────┘  └──────────┘
    │                                    │
    │◄───────────────────────────────────┤
    │  200 OK / { processed: true }      │
```

### 2.4 Result Status Mapping

| Lab Result | CleanCheck Status | Profile Color | Action Required |
|------------|-------------------|---------------|-----------------|
| `NEGATIVE` | `result_received_locked` | Grey (pending user action) | User must unlock to verify |
| `POSITIVE` | `result_received_locked` | Grey | Exception queue + privacy firewall |
| `INCONCLUSIVE` | `result_received_locked` | Grey | Exception queue for manual review |
| `INVALID_SAMPLE` | `pending` | Grey | Re-collection required |

---

## 3. Healthcare Data Standards

### 3.1 HL7 v2.x Integration

**Supported Message Types**:

| Message | Description | Direction |
|---------|-------------|-----------|
| `ORM^O01` | Order Message | Outbound (future) |
| `ORU^R01` | Observation Result | Inbound |
| `ADT^A04` | Patient Registration | Inbound (future) |
| `ACK` | Acknowledgment | Both |

**Sample ORU^R01 Parser**:
```typescript
// Edge function: parse-hl7-result
interface HL7Segment {
  MSH: { sendingApp: string; messageType: string; timestamp: string };
  PID: { patientId: string; name: string; dob: string };
  OBR: { orderId: string; testCode: string; collectionDate: string };
  OBX: { resultCode: string; value: string; units: string; status: string }[];
}

const parseHL7Result = (hl7Message: string): LabResult => {
  const segments = hl7Message.split('\r');
  
  // Extract OBX segments for results
  const results = segments
    .filter(s => s.startsWith('OBX'))
    .map(parseOBXSegment);
  
  // Map to CleanCheck format
  return {
    barcode: extractPatientId(segments),
    test_type: mapTestCode(extractTestCode(segments)),
    result: aggregateResults(results),
    processed_at: new Date().toISOString()
  };
};
```

### 3.2 FHIR R4 Integration (Future)

**Resource Mappings**:

| FHIR Resource | CleanCheck Entity | Use Case |
|---------------|-------------------|----------|
| `Patient` | `profiles` | Member demographics |
| `DiagnosticReport` | `lab_orders` | Test results |
| `Observation` | Result details | Individual test values |
| `ServiceRequest` | Order placement | Test ordering |
| `Organization` | `lab_partners` | Lab information |

**FHIR DiagnosticReport Example**:
```json
{
  "resourceType": "DiagnosticReport",
  "id": "cleancheck-result-123",
  "status": "final",
  "category": [{
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/v2-0074",
      "code": "LAB",
      "display": "Laboratory"
    }]
  }],
  "code": {
    "coding": [{
      "system": "http://loinc.org",
      "code": "24331-1",
      "display": "STD Panel"
    }]
  },
  "subject": {
    "reference": "Patient/CC-12345678"
  },
  "effectiveDateTime": "2024-12-04T10:30:00Z",
  "conclusion": "All tests negative"
}
```

### 3.3 LOINC Code Mapping

| Test | LOINC Code | Description |
|------|------------|-------------|
| HIV-1/2 Ab | 75622-1 | HIV 1 and 2 Ab Screen |
| Syphilis | 20507-0 | Treponema pallidum Ab |
| Chlamydia | 43304-5 | Chlamydia trachomatis |
| Gonorrhea | 43305-2 | Neisseria gonorrhoeae |
| Hepatitis B | 5196-1 | Hepatitis B surface Ag |
| Hepatitis C | 16128-1 | Hepatitis C Ab |
| HSV-1 | 31411-7 | HSV Type 1 Ab |
| HSV-2 | 31412-5 | HSV Type 2 Ab |
| Drug Screen 10P | 19584-0 | Drug Screen Panel |

---

## 4. HIPAA Compliance Framework

### 4.1 Protected Health Information (PHI) Handling

**PHI Data Elements in CleanCheck**:

| Data Element | Classification | Storage | Access Control |
|--------------|---------------|---------|----------------|
| Test Results | PHI | Encrypted at rest | User + Admin only |
| Health Status | PHI | Encrypted at rest | User controlled sharing |
| Lab Documents | PHI | Encrypted storage bucket | User + Admin only |
| Barcode/Requisition ID | PHI | Encrypted | System + Lab partner |
| Member Name | PII/PHI | Encrypted | RLS protected |
| Date of Birth | PII/PHI | Encrypted | RLS protected |

### 4.2 Technical Safeguards

```
┌─────────────────────────────────────────────────────────────┐
│                  HIPAA TECHNICAL SAFEGUARDS                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Access Control                    Audit Controls           │
│  ┌───────────────────┐            ┌───────────────────┐    │
│  │ • Unique user IDs │            │ • Activity logs   │    │
│  │ • Role-based access│            │ • Access tracking │    │
│  │ • Auto log-off    │            │ • Modification log│    │
│  │ • Encryption keys │            │ • 7-year retention│    │
│  └───────────────────┘            └───────────────────┘    │
│                                                             │
│  Integrity Controls                Transmission Security    │
│  ┌───────────────────┐            ┌───────────────────┐    │
│  │ • Data validation │            │ • TLS 1.3 required│    │
│  │ • Error detection │            │ • End-to-end encrypt│   │
│  │ • Tamper evident  │            │ • Certificate mgmt │   │
│  └───────────────────┘            └───────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Business Associate Agreements (BAA)

**Required BAAs**:

| Vendor | Service | BAA Status |
|--------|---------|------------|
| Supabase | Database/Auth/Storage | ✅ Signed |
| Resend | Email delivery | ✅ Signed |
| Vercel | Hosting | ✅ Signed |
| Lab Partners | Result transmission | Per partner |

**BAA Key Provisions**:
- Data use limitations
- Safeguard requirements
- Breach notification procedures
- Subcontractor management
- Termination provisions

### 4.4 Breach Response Protocol

```
┌────────────────────────────────────────────────────────────────┐
│                    BREACH RESPONSE TIMELINE                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Discovery          Assessment          Notification           │
│  ┌──────────┐      ┌──────────┐        ┌──────────┐           │
│  │ Hour 0   │─────►│ Hour 24  │───────►│ Day 60   │           │
│  │          │      │          │        │ (Max)    │           │
│  │ Detect & │      │ Risk     │        │ HHS/State│           │
│  │ Contain  │      │ Analysis │        │ + Users  │           │
│  └──────────┘      └──────────┘        └──────────┘           │
│       │                 │                   │                  │
│       ▼                 ▼                   ▼                  │
│  • Isolate system   • PHI involved?    • 500+ affected:       │
│  • Preserve logs    • # individuals     media notice          │
│  • Security team    • Risk level       • Individual letters   │
│  • Document all     • Mitigation       • HHS portal submit    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Privacy Firewall Architecture

### 5.1 User Consent Model

**Principle**: Results remain completely private until user explicitly publishes

```typescript
// Privacy states for lab results
type ResultPrivacyState = 
  | 'received_locked'    // Result received, user hasn't viewed
  | 'viewed_private'     // User viewed, chose to keep private
  | 'verified_public';   // User chose to publish to profile

// User action flow
const handleResultAction = async (orderId: string, action: 'keep_private' | 'verify_profile') => {
  if (action === 'keep_private') {
    // Result stays private, status unchanged
    await updateOrder(orderId, { 
      privacy_choice: 'private',
      privacy_choice_at: new Date()
    });
  } else {
    // User consents to publish
    await updateOrder(orderId, { 
      order_status: 'verified_active',
      privacy_choice: 'public',
      privacy_choice_at: new Date()
    });
    await updateProfile(userId, {
      status_color: 'green',
      status_expiry: calculateExpiry()
    });
  }
};
```

### 5.2 Data Minimization

**Shared Profile Data** (when QR scanned):

| Shown | Hidden |
|-------|--------|
| First name + last initial | Full name |
| Verification status (color) | Actual test results |
| Expiry date | Personal details |
| Member ID | Contact info |

**Not Transmitted**:
- Actual lab values
- Positive result history
- Medical conditions
- Treatment information

---

## 6. Exception Handling System

### 6.1 Exception Types

| Exception Type | Trigger | Handling |
|----------------|---------|----------|
| `positive_result` | Lab reports positive | Privacy-protected queue |
| `inconclusive` | Result needs review | Manual lab follow-up |
| `invalid_sample` | Sample quality issue | Re-collection notification |
| `barcode_mismatch` | Barcode not found | Manual matching |
| `duplicate_result` | Result already received | Log and skip |
| `partner_error` | Lab system error | Retry queue |

### 6.2 Exception Queue Schema

```sql
CREATE TABLE public.exception_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES lab_orders(id),
  user_id UUID NOT NULL,
  exception_type TEXT NOT NULL,
  exception_reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, resolved, escalated
  notes TEXT,
  notified_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 6.3 Admin Exception Dashboard

**Queue Metrics**:
- Pending exceptions count
- Average resolution time
- Exception type distribution
- Partner-specific error rates

---

## 7. Turnaround Time Tracking

### 7.1 SLA Definitions

| Test Type | Target TAT | Alert Threshold | Escalation |
|-----------|------------|-----------------|------------|
| STD Panel | 72 hours | 96 hours | Lab manager |
| Toxicology | 48 hours | 72 hours | Lab manager |
| Rapid Test | 1 hour | 2 hours | Immediate |

### 7.2 TAT Calculation

```typescript
// Analytics: Calculate turnaround time
const calculateTurnaround = (order: LabOrder): number => {
  if (!order.result_received_at) return null;
  
  const created = new Date(order.created_at);
  const received = new Date(order.result_received_at);
  
  return (received.getTime() - created.getTime()) / (1000 * 60 * 60); // Hours
};

// Aggregate for analytics
const getTurnaroundStats = async (partnerId?: string) => {
  const query = supabase
    .from('lab_orders')
    .select('created_at, updated_at, test_type')
    .eq('order_status', 'result_received');
  
  if (partnerId) {
    query.eq('lab_partner_id', partnerId);
  }
  
  const { data } = await query;
  
  return {
    average: calculateAverage(data.map(calculateTurnaround)),
    fastest: Math.min(...data.map(calculateTurnaround)),
    slowest: Math.max(...data.map(calculateTurnaround)),
    byTestType: groupByTestType(data)
  };
};
```

---

## 8. Future Medical Integrations

### 8.1 Roadmap

| Phase | Integration | Timeline | Priority |
|-------|-------------|----------|----------|
| **Current** | Direct lab API (REST) | Live | Critical |
| **Q1 2025** | HL7 v2.x message parsing | 3 months | High |
| **Q2 2025** | FHIR R4 API endpoints | 6 months | Medium |
| **Q3 2025** | Health Information Exchange | 9 months | Medium |
| **Q4 2025** | EHR/EMR integration (Epic, Cerner) | 12 months | Low |

### 8.2 Smart Health Card Support (Future)

**SMART Health Cards** for portable verification:

```json
{
  "iss": "https://cleancheck.fit",
  "nbf": 1701686400,
  "vc": {
    "type": ["VerifiableCredential", "HealthStatusCredential"],
    "credentialSubject": {
      "memberId": "CC-12345678",
      "status": "verified",
      "testType": "STD_PANEL",
      "validUntil": "2025-02-03"
    }
  }
}
```

### 8.3 Telehealth Integration (Future)

**Use Cases**:
- Virtual consultations for positive results
- Prescription referrals
- Follow-up testing coordination

---

## 9. Compliance Certifications

### 9.1 Current Compliance

| Certification | Status | Renewal |
|--------------|--------|---------|
| HIPAA Compliance | ✅ Self-attested | Annual |
| SOC 2 Type II (via Supabase) | ✅ Inherited | Annual |
| PCI-DSS (via PayPal) | ✅ Delegated | N/A |

### 9.2 Target Certifications

| Certification | Target Date | Investment |
|--------------|-------------|------------|
| HITRUST CSF | Q2 2025 | $50K-100K |
| ISO 27001 | Q4 2025 | $30K-50K |
| SOC 2 Type II (Direct) | Q3 2025 | $40K-60K |

---

## 10. Monitoring & Quality Assurance

### 10.1 Lab Partner Metrics

| Metric | Target | Alert |
|--------|--------|-------|
| Result delivery rate | > 99.5% | < 98% |
| Average turnaround | < 72 hrs | > 96 hrs |
| Error rate | < 0.1% | > 0.5% |
| API uptime | > 99.9% | < 99.5% |

### 10.2 Data Quality Checks

```typescript
// Automated validation on result receipt
const validateLabResult = (result: IncomingResult): ValidationResult => {
  const errors: string[] = [];
  
  // Required fields
  if (!result.barcode) errors.push('Missing barcode');
  if (!result.result) errors.push('Missing result value');
  if (!['negative', 'positive', 'inconclusive'].includes(result.result)) {
    errors.push('Invalid result value');
  }
  
  // Barcode format
  if (result.barcode && !/^[A-Z0-9]{8,12}$/.test(result.barcode)) {
    errors.push('Invalid barcode format');
  }
  
  // Timestamp validation
  if (result.processed_at) {
    const processedDate = new Date(result.processed_at);
    if (processedDate > new Date()) {
      errors.push('Future timestamp not allowed');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-04 | CleanCheck Engineering | Initial medical network strategy |

---

*This document is confidential and subject to HIPAA privacy requirements.*
