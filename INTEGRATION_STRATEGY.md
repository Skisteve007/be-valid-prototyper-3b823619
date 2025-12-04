# CleanCheck Integration Strategy: Existing Systems Middleware

## Executive Summary

This document outlines the integration architecture for connecting CleanCheck with external systems, third-party services, and enterprise middleware. It covers API design patterns, webhook handling, data synchronization, and enterprise integration requirements.

---

## 1. Integration Architecture Overview

### 1.1 System Landscape

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLEANCHECK INTEGRATION HUB                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   External Partners              CleanCheck Core              Enterprise    │
│   ┌─────────────┐               ┌─────────────┐            ┌─────────────┐ │
│   │ Lab Partners│◄──────────────│             │────────────►│ Venue POS  │ │
│   │ (LabCorp,   │  Webhooks     │   Supabase  │  REST API   │ Systems    │ │
│   │  Quest)     │               │   Backend   │             └─────────────┘ │
│   └─────────────┘               │             │                             │
│                                 │  ┌───────┐  │            ┌─────────────┐ │
│   ┌─────────────┐               │  │ Edge  │  │────────────►│ HR/Payroll │ │
│   │   PayPal    │◄──────────────│  │ Func  │  │  Webhooks   │ (ADP, etc) │ │
│   │  Payments   │  IPN/Webhooks │  └───────┘  │             └─────────────┘ │
│   └─────────────┘               │             │                             │
│                                 │  ┌───────┐  │            ┌─────────────┐ │
│   ┌─────────────┐               │  │  DB   │  │────────────►│ Background │ │
│   │   Resend    │◄──────────────│  │(Postgres)│  Events     │ Check APIs │ │
│   │   Email     │  API Calls    │  └───────┘  │             └─────────────┘ │
│   └─────────────┘               └─────────────┘                             │
│                                        │                                    │
│   ┌─────────────┐                      │                   ┌─────────────┐ │
│   │  Zapier/    │◄─────────────────────┴───────────────────►│ n8n        │ │
│   │  Make.com   │         Workflow Automation               │ Workflows  │ │
│   └─────────────┘                                           └─────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Integration Patterns

| Pattern | Use Case | Implementation |
|---------|----------|----------------|
| **Webhooks (Inbound)** | Lab results, payment notifications | Edge Functions with signature verification |
| **Webhooks (Outbound)** | Event notifications to partners | Configurable webhook dispatch |
| **REST API** | Venue/enterprise data access | Authenticated API endpoints |
| **Batch Processing** | Bulk data sync, reports | Scheduled Edge Functions |
| **Event-Driven** | Real-time status updates | Supabase Realtime + webhooks |

---

## 2. Inbound Integrations

### 2.1 Lab Partner Integration

**Purpose**: Receive test results from certified lab partners

**Architecture**:
```
Lab Partner System
       │
       │ HTTPS POST (API Key Auth)
       ▼
┌──────────────────┐
│ receive-lab-result│ Edge Function
│  - Verify API key │
│  - Validate payload│
│  - Update order   │
│  - Queue exception│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   lab_orders     │ Database
│   exception_queue│
│   webhook_events │
└──────────────────┘
```

**Endpoint**: `POST /functions/v1/receive-lab-result`

**Authentication**: API Key in `X-Lab-API-Key` header

**Payload Schema**:
```json
{
  "barcode": "string (required)",
  "result": "negative | positive | inconclusive",
  "test_type": "STD_PANEL | TOX_10_PANEL",
  "lab_requisition_id": "string",
  "processed_at": "ISO 8601 timestamp"
}
```

**Response Codes**:
| Code | Meaning |
|------|---------|
| 200 | Result processed successfully |
| 400 | Invalid payload |
| 401 | Invalid or missing API key |
| 404 | Barcode not found |
| 409 | Result already received |

### 2.2 Payment Webhook Integration (PayPal)

**Purpose**: Process payment confirmations and subscription events

**Architecture**:
```
PayPal IPN/Webhooks
       │
       │ HTTPS POST
       ▼
┌───────────────────────┐
│ verify-paypal-webhook │ Edge Function
│  - Verify signature   │
│  - Validate payment   │
│  - Update profile     │
│  - Send confirmation  │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ process-payment-success│ Edge Function
│  - Set membership tier │
│  - Calculate expiry    │
│  - Trigger welcome email│
└───────────────────────┘
```

**Supported Events**:
- `PAYMENT.CAPTURE.COMPLETED` - One-time payment
- `BILLING.SUBSCRIPTION.CREATED` - New subscription
- `BILLING.SUBSCRIPTION.CANCELLED` - Subscription cancelled
- `BILLING.SUBSCRIPTION.PAYMENT.FAILED` - Payment failure

### 2.3 Partner Application Webhooks

**Purpose**: Receive and process strategic partner applications

**Endpoint**: `POST /functions/v1/submit-partner-application`

**Workflow**:
1. Validate application data
2. Upload ID documents to secure storage
3. Create affiliate record
4. Generate unique referral code
5. Notify admin team via email

---

## 3. Outbound Integrations

### 3.1 Email Dispatch (Resend)

**Service**: Resend.com

**Use Cases**:
- Welcome emails for new members
- Payment confirmations
- Lab result notifications
- Marketing campaigns
- Partner onboarding

**Edge Functions**:
| Function | Purpose |
|----------|---------|
| `send-welcome-email` | New member onboarding |
| `send-marketing-campaign` | Bulk marketing dispatch |
| `send-lab-partner-onboarding` | Partner activation |
| `notify-payment` | Transaction confirmations |
| `notify-partner-application` | Application alerts |

**Rate Limits**:
- 100 emails/second (Resend limit)
- Batch processing for campaigns
- Queue-based delivery for reliability

### 3.2 Webhook Dispatch (Outbound)

**Purpose**: Notify external systems of CleanCheck events

**Configurable Events**:
```typescript
type WebhookEvent = 
  | 'member.created'
  | 'member.verified'
  | 'member.status_changed'
  | 'payment.completed'
  | 'lab_result.received'
  | 'venue.checkin';
```

**Webhook Payload Structure**:
```json
{
  "event": "member.verified",
  "timestamp": "2024-12-04T10:30:00Z",
  "data": {
    "member_id": "CC-12345678",
    "status": "green",
    "test_type": "STD_PANEL"
  },
  "signature": "sha256=..."
}
```

**Security**:
- HMAC-SHA256 signature in `X-CleanCheck-Signature` header
- Timestamp validation (5-minute window)
- Retry with exponential backoff (3 attempts)

---

## 4. Enterprise Integration Patterns

### 4.1 Venue POS Integration

**Use Case**: Venues verify member status at check-in

**Integration Methods**:

**Option A: QR Code Scan (Recommended)**
```
Member presents QR → Venue scans → CleanCheck API → Status returned
```

**Option B: Direct API Lookup**
```typescript
// Venue system calls CleanCheck API
GET /api/v1/verify/{member_id}
Authorization: Bearer {venue_api_key}

Response:
{
  "valid": true,
  "status": "green",
  "verified_until": "2025-02-03T00:00:00Z",
  "member_name": "J*** D***" // Masked for privacy
}
```

**Option C: Webhook Subscription**
```typescript
// Venue receives real-time updates for their roster
POST https://venue-system.com/webhook/cleancheck
{
  "event": "roster.status_changed",
  "member_id": "CC-12345678",
  "new_status": "expired",
  "venue_id": "venue_abc123"
}
```

### 4.2 HR/Payroll System Integration

**Use Case**: Workplace compliance tracking

**Architecture**:
```
┌─────────────────┐         ┌─────────────────┐
│  HR System      │◄───────►│  CleanCheck     │
│  (ADP, Workday) │ Sync    │  Workplace API  │
└─────────────────┘         └─────────────────┘
         │                          │
         ▼                          ▼
┌─────────────────┐         ┌─────────────────┐
│  Employee       │         │  workplace_     │
│  Records        │         │  roster         │
└─────────────────┘         └─────────────────┘
```

**Data Flow**:
1. HR system sends employee roster via API/SFTP
2. CleanCheck matches employees by email/ID
3. Status updates pushed back to HR system
4. Compliance reports generated on schedule

### 4.3 Background Check API Integration

**Use Case**: Combine health verification with background screening

**Supported Providers**:
- Checkr
- GoodHire
- Sterling

**Integration Pattern**:
```typescript
// Initiate combined verification
POST /api/v1/verification/combined
{
  "member_id": "CC-12345678",
  "checks": ["health_panel", "background_basic"],
  "callback_url": "https://client.com/webhook"
}

// Results delivered via webhook
{
  "health_status": "verified",
  "background_status": "clear",
  "combined_badge": "trusted_verified"
}
```

---

## 5. Workflow Automation

### 5.1 Zapier Integration

**Trigger Events Available**:
- New member signup
- Payment completed
- Status changed (green/yellow/red/grey)
- Lab result received
- Venue check-in recorded

**Action Events Available**:
- Create/update member profile
- Send custom notification
- Generate verification link

**Setup**:
```typescript
// Zapier webhook trigger
const triggerZap = async (webhookUrl: string, eventData: any) => {
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    mode: "no-cors",
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      event: eventData.type,
      data: eventData.payload
    })
  });
};
```

### 5.2 n8n Workflow Integration

**Available via MCP**: n8n can be connected to expose workflows as agent tools

**Common Workflows**:
| Workflow | Trigger | Actions |
|----------|---------|---------|
| Member Onboarding | New signup | Send welcome sequence, create CRM contact |
| Expiry Reminder | 7 days before expiry | Email reminder, SMS alert |
| Venue Digest | Daily schedule | Compile check-in stats, send report |
| Lead Nurture | Abandoned cart | Follow-up sequence |

---

## 6. API Design Standards

### 6.1 Authentication Methods

| Method | Use Case | Implementation |
|--------|----------|----------------|
| **JWT Bearer** | Member/Admin API calls | Supabase Auth tokens |
| **API Key** | Lab partners, B2B integrations | X-API-Key header |
| **Webhook Signature** | Inbound webhooks | HMAC-SHA256 verification |
| **OAuth 2.0** | Future enterprise SSO | Authorization code flow |

### 6.2 API Versioning

```
Base URL: https://api.cleancheck.fit/v1/

Versioning Strategy:
- Major versions in URL path (/v1/, /v2/)
- Minor/patch changes backward compatible
- Deprecation notices 6 months in advance
- Sunset headers for deprecated endpoints
```

### 6.3 Rate Limiting

| Tier | Requests/minute | Burst |
|------|-----------------|-------|
| Free | 60 | 10 |
| Partner | 300 | 50 |
| Enterprise | 1000 | 200 |

**Headers**:
```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 287
X-RateLimit-Reset: 1701686400
```

### 6.4 Error Response Format

```json
{
  "error": {
    "code": "INVALID_MEMBER_ID",
    "message": "The provided member ID does not exist",
    "details": {
      "member_id": "CC-99999999"
    },
    "documentation_url": "https://docs.cleancheck.fit/errors/INVALID_MEMBER_ID"
  },
  "request_id": "req_abc123xyz"
}
```

---

## 7. Data Synchronization

### 7.1 Real-time Sync (Supabase Realtime)

**Enabled Tables**:
```sql
-- Enable realtime for status updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.venue_qr_scans;
```

**Client Subscription**:
```typescript
const channel = supabase
  .channel('member-status')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'profiles',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    updateStatusBadge(payload.new.status_color);
  })
  .subscribe();
```

### 7.2 Batch Synchronization

**Schedule**: Daily at 02:00 UTC

**Operations**:
1. Expire memberships past `status_expiry`
2. Cleanup expired QR tokens (7+ days old)
3. Generate compliance reports
4. Sync workplace rosters

**Implementation**:
```sql
-- Scheduled function: check_status_expiry()
UPDATE public.profiles 
SET status_color = 'grey'
WHERE status_expiry IS NOT NULL 
  AND status_expiry < NOW() 
  AND status_color != 'grey';
```

---

## 8. Security Considerations

### 8.1 Data in Transit

- TLS 1.3 required for all API communications
- Certificate pinning recommended for mobile apps
- Webhook payloads encrypted with partner-specific keys

### 8.2 Data at Rest

- PII encrypted in database (AES-256)
- API keys hashed (bcrypt) before storage
- Webhook secrets stored in Supabase Vault

### 8.3 Access Control

```typescript
// Partner API key validation
const validatePartnerKey = async (apiKey: string) => {
  const { data: partner } = await supabase
    .from('lab_partners')
    .select('id, name, active')
    .eq('api_key', hashApiKey(apiKey))
    .single();
  
  if (!partner?.active) {
    throw new Error('Invalid or inactive API key');
  }
  
  // Log API access
  await supabase.from('webhook_events').insert({
    event_type: 'api_access',
    lab_partner_id: partner.id,
    payload: { endpoint: '/receive-lab-result' }
  });
  
  return partner;
};
```

### 8.4 Audit Logging

All integration events logged to `webhook_events` table:

| Field | Description |
|-------|-------------|
| event_type | Type of integration event |
| lab_partner_id | Partner identifier (if applicable) |
| payload | Request/response data (sanitized) |
| response_status | HTTP status code |
| error_message | Error details (if failed) |
| created_at | Timestamp |

---

## 9. Integration Checklist

### New Partner Onboarding

- [ ] Generate unique API key
- [ ] Configure webhook endpoints
- [ ] Set up test environment
- [ ] Provide API documentation
- [ ] Verify signature validation
- [ ] Test all event types
- [ ] Configure rate limits
- [ ] Enable monitoring/alerting
- [ ] Sign data processing agreement
- [ ] Go-live validation

### Enterprise Deployment

- [ ] SSO/SAML configuration
- [ ] IP allowlisting (if required)
- [ ] Custom webhook endpoints
- [ ] Dedicated support channel
- [ ] SLA documentation
- [ ] Compliance certification sharing
- [ ] Data residency requirements
- [ ] Disaster recovery testing

---

## 10. Monitoring & Alerting

### Key Metrics

| Metric | Threshold | Alert |
|--------|-----------|-------|
| Webhook success rate | < 95% | Page on-call |
| API latency (p99) | > 2000ms | Slack notification |
| Failed auth attempts | > 100/hour | Security alert |
| Queue depth | > 1000 | Scale warning |

### Dashboard Components

- Webhook event volume by type
- Partner API usage breakdown
- Error rate by endpoint
- Latency percentiles over time

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-04 | CleanCheck Engineering | Initial integration strategy |

---

*This document is part of the CleanCheck technical documentation suite.*
