# CleanCheck Client-to-Server Architecture Migration Guide

## Overview

This document outlines the architectural migration strategy for CleanCheck, transitioning sensitive operations from client-side execution to secure server-side (Edge Functions) processing.

---

## 1. Current Architecture Assessment

### 1.1 Client-Side Operations (Before Migration)

```
┌─────────────────────────────────────────────────────────────┐
│                    CURRENT STATE                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Browser (Client)                                           │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  • Authentication logic                              │   │
│   │  • Payment processing calls                          │   │
│   │  • Direct database queries                           │   │
│   │  • Business logic validation                         │   │
│   │  • QR code generation                                │   │
│   │  • Email trigger logic                               │   │
│   └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Supabase (Direct Access)                │   │
│   │  • PostgreSQL with RLS                               │   │
│   │  • Storage buckets                                   │   │
│   │  • Auth service                                      │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Security Risks in Current Architecture

| Risk | Severity | Description |
|------|----------|-------------|
| Exposed Business Logic | High | Validation rules visible in client bundle |
| API Key Exposure | Critical | Third-party keys potentially in client code |
| Data Manipulation | High | Client can craft malicious requests |
| Rate Limiting Bypass | Medium | No server-side request throttling |
| Audit Trail Gaps | Medium | Client actions not centrally logged |

---

## 2. Target Architecture

### 2.1 Server-Side Operations (After Migration)

```
┌─────────────────────────────────────────────────────────────┐
│                    TARGET STATE                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Browser (Client)                                           │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  • UI rendering & state management                   │   │
│   │  • Form validation (UX only)                         │   │
│   │  • API calls to Edge Functions                       │   │
│   │  • Local caching & optimistic updates                │   │
│   └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Edge Functions (Server)                 │   │
│   │  • Authentication verification                       │   │
│   │  • Business logic & validation                       │   │
│   │  • Payment processing                                │   │
│   │  • Third-party API calls                             │   │
│   │  • Email/notification dispatch                       │   │
│   │  • Audit logging                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Supabase (Protected Access)             │   │
│   │  • PostgreSQL with RLS (defense in depth)            │   │
│   │  • Storage with signed URLs                          │   │
│   │  • Auth service                                      │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Migration Phases

### Phase 1: Critical Security Operations

**Priority: Immediate**

| Operation | Current Location | Target Location | Edge Function |
|-----------|-----------------|-----------------|---------------|
| Payment Processing | Client → PayPal | Server → PayPal | `process-payment-success` |
| Webhook Verification | N/A | Server | `verify-paypal-webhook` |
| Lab Result Processing | Direct DB | Server | `receive-lab-result` |
| Admin Role Verification | Client check | Server | `verify-admin-access` |

**Migration Pattern:**

```typescript
// BEFORE: Client-side payment handling
const handlePayment = async (paymentData) => {
  // ❌ Business logic exposed in client
  const discount = calculateDiscount(paymentData.code);
  await supabase.from('profiles').update({ 
    payment_status: 'paid',
    status_expiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  });
};

// AFTER: Server-side payment handling
const handlePayment = async (paymentData) => {
  // ✅ Client only sends data, server handles logic
  const { data, error } = await supabase.functions.invoke('process-payment-success', {
    body: { paymentId: paymentData.id, userId: user.id }
  });
};
```

### Phase 2: Business Logic Migration

**Priority: High**

| Operation | Current Location | Target Location | Edge Function |
|-----------|-----------------|-----------------|---------------|
| QR Token Generation | Client | Server | `generate-qr-token` |
| Profile Sharing | Client logic | Server | `view-profile-with-token` |
| Certificate Generation | Client | Server | `view-safety-certificate` |
| Membership Expiry Check | Client | Server + DB Trigger | `check-status-expiry` |

### Phase 3: Third-Party Integrations

**Priority: Medium**

| Operation | Current Location | Target Location | Edge Function |
|-----------|-----------------|-----------------|---------------|
| Email Dispatch | Client trigger | Server | `send-welcome-email` |
| Marketing Campaigns | Client trigger | Server | `send-marketing-campaign` |
| Partner Notifications | Client trigger | Server | `notify-partner-application` |
| Affiliate Tracking | Client | Server | `create-affiliate` |

### Phase 4: Optimization & Caching

**Priority: Low**

| Operation | Strategy |
|-----------|----------|
| Profile Data | Edge caching with 5-min TTL |
| Sponsor Logos | CDN caching with 24-hour TTL |
| Static Assets | Immutable caching |
| API Responses | ETag-based caching |

---

## 4. Edge Function Implementation Standards

### 4.1 Standard Function Template

```typescript
// supabase/functions/[function-name]/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // 1. CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 2. Authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // 3. Initialize Supabase Client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // 4. Verify User
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // 5. Parse Request Body
    const body = await req.json();

    // 6. Input Validation
    if (!body.requiredField) {
      throw new Error('Missing required field');
    }

    // 7. Business Logic (SERVER-SIDE ONLY)
    // ... your secure logic here ...

    // 8. Audit Logging
    console.log(`[${new Date().toISOString()}] User ${user.id} performed action`);

    // 9. Response
    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // 10. Error Handling (no sensitive data exposure)
    console.error('Function error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### 4.2 Security Requirements for Edge Functions

| Requirement | Implementation |
|-------------|----------------|
| JWT Verification | `verify_jwt = true` in config.toml (default) |
| Input Validation | Zod schema validation on all inputs |
| Rate Limiting | Implement per-user request throttling |
| Error Handling | Never expose stack traces or internal details |
| Audit Logging | Log all security-relevant actions |
| Secrets | Use `Deno.env.get()` for all secrets |

---

## 5. Client-Side Refactoring

### 5.1 API Layer Abstraction

```typescript
// src/lib/api.ts

import { supabase } from '@/integrations/supabase/client';

export const api = {
  // Payment Operations
  payments: {
    processSuccess: async (paymentId: string, type: string) => {
      const { data, error } = await supabase.functions.invoke('process-payment-success', {
        body: { paymentId, type }
      });
      if (error) throw error;
      return data;
    },
  },

  // Profile Operations
  profiles: {
    generateQRToken: async (profileId: string) => {
      const { data, error } = await supabase.functions.invoke('generate-qr-token', {
        body: { profileId }
      });
      if (error) throw error;
      return data;
    },
    
    viewWithToken: async (token: string) => {
      const { data, error } = await supabase.functions.invoke('view-profile-with-token', {
        body: { token }
      });
      if (error) throw error;
      return data;
    },
  },

  // Admin Operations
  admin: {
    verifyAccess: async () => {
      const { data, error } = await supabase.functions.invoke('verify-admin-access');
      if (error) throw error;
      return data;
    },
  },
};
```

### 5.2 Component Refactoring Pattern

```typescript
// BEFORE: Business logic in component
const PaymentButton = () => {
  const handlePayment = async () => {
    // ❌ Discount calculation exposed
    const discount = code === 'VIP50' ? 0.5 : 0;
    const finalAmount = basePrice * (1 - discount);
    
    // ❌ Direct database update
    await supabase.from('profiles').update({
      payment_status: 'paid',
      status_expiry: calculateExpiry()
    });
  };
};

// AFTER: Thin client, thick server
const PaymentButton = () => {
  const handlePayment = async () => {
    // ✅ Server handles all business logic
    const result = await api.payments.processSuccess(paymentId, 'membership');
    
    if (result.success) {
      toast.success('Payment processed!');
      router.push('/dashboard');
    }
  };
};
```

---

## 6. Database Layer Adjustments

### 6.1 Service Role Key Usage

```typescript
// Edge Function with elevated privileges

// Use service role for system operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Service role bypasses RLS - use carefully
const { data, error } = await supabaseAdmin
  .from('profiles')
  .update({ status_color: 'green' })
  .eq('user_id', userId);
```

### 6.2 RLS as Defense in Depth

Even with server-side logic, maintain RLS policies:

```sql
-- RLS still active as secondary protection
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Service role key bypasses RLS when needed
-- But RLS protects against any client-side mistakes
```

---

## 7. Migration Checklist

### Pre-Migration
- [ ] Document all client-side business logic
- [ ] Identify third-party API calls in client
- [ ] Map data flow for each operation
- [ ] Create Edge Function templates
- [ ] Set up secrets in Supabase Vault

### During Migration
- [ ] Implement Edge Functions (Phase 1-3)
- [ ] Add comprehensive logging
- [ ] Update client to use API layer
- [ ] Remove business logic from client bundle
- [ ] Update error handling

### Post-Migration
- [ ] Verify no secrets in client bundle
- [ ] Run security audit
- [ ] Performance testing
- [ ] Update documentation
- [ ] Team training on new architecture

---

## 8. Existing Edge Functions Inventory

| Function | Purpose | Auth Required | Status |
|----------|---------|---------------|--------|
| `create-affiliate` | Affiliate registration | Yes | ✅ Migrated |
| `create-first-admin` | Initial admin setup | No (one-time) | ✅ Migrated |
| `generate-qr-token` | QR code token generation | Yes | ✅ Migrated |
| `notify-partner-application` | Partner notification | No (webhook) | ✅ Migrated |
| `notify-payment` | Payment notification | No (webhook) | ✅ Migrated |
| `process-payment-success` | Payment processing | No (callback) | ✅ Migrated |
| `receive-lab-result` | Lab result ingestion | API Key | ✅ Migrated |
| `request-affiliate-payout` | Payout requests | Yes | ✅ Migrated |
| `send-lab-partner-onboarding` | Lab partner emails | Yes (admin) | ✅ Migrated |
| `send-marketing-campaign` | Marketing emails | Yes (admin) | ✅ Migrated |
| `send-partner-inquiry` | Partner inquiries | No | ✅ Migrated |
| `send-welcome-email` | Welcome emails | System | ✅ Migrated |
| `submit-partner-application` | Application processing | No | ✅ Migrated |
| `verify-paypal-webhook` | Webhook verification | No (webhook) | ✅ Migrated |
| `view-profile-with-token` | Profile viewing | Token | ✅ Migrated |
| `view-safety-certificate` | Certificate viewing | Token | ✅ Migrated |

---

## 9. Performance Considerations

### 9.1 Edge Function Optimization

| Strategy | Implementation |
|----------|----------------|
| Cold Start Reduction | Keep functions warm with scheduled pings |
| Response Compression | Enable gzip for large responses |
| Connection Pooling | Reuse Supabase client connections |
| Parallel Queries | Use Promise.all for independent queries |

### 9.2 Client-Side Caching

```typescript
// React Query for intelligent caching
const { data: profile } = useQuery({
  queryKey: ['profile', userId],
  queryFn: () => api.profiles.get(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
});
```

---

## 10. Rollback Strategy

In case of migration issues:

1. **Feature Flags**: Toggle between client/server implementations
2. **Gradual Rollout**: Migrate 10% → 50% → 100% of traffic
3. **Monitoring**: Alert on error rate spikes
4. **Quick Revert**: Keep client-side code commented, not deleted

```typescript
// Feature flag pattern
const useServerSidePayments = featureFlags.get('server_payments');

const handlePayment = useServerSidePayments
  ? () => api.payments.processSuccess(paymentId)
  : () => legacyClientSidePayment(paymentId);
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-04 | CleanCheck Engineering | Initial architecture guide |

---

*This document is part of the CleanCheck technical documentation suite.*
