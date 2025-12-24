# GHOST TOKEN SPECIFICATION (INTERNAL)

**Classification:** CONFIDENTIAL — Admin Eyes Only  
**Owner:** Steven Grillo, CEO  
**Last Updated:** December 2024  
**Status:** Technical Specification

---

## Purpose

This document specifies the Ghost Token system—a privacy-preserving identity mechanism that allows members to share verified attributes without revealing personal details.

---

## 1. Overview

### What is a Ghost Token?
A Ghost Token is a cryptographic credential that:
- Proves identity verification status without exposing PII
- Enables venue/partner scanning without member identification
- Supports time-limited, revocable access
- Maintains audit trails without storing personal data

### Core Principles
1. **Privacy First:** No PII in the token payload
2. **Verifiable:** Cryptographically signed, tamper-evident
3. **Revocable:** Can be invalidated server-side
4. **Auditable:** All uses logged without identifying the user
5. **Ephemeral:** Short-lived by default

---

## 2. Token Structure

### JWT Format
```
Header.Payload.Signature
```

### Header
```json
{
  "alg": "HS256",
  "typ": "GHOST"
}
```

### Payload
```json
{
  "sub": "ghost_abc123xyz",      // Opaque user reference (NOT user_id)
  "iss": "valid.app",            // Issuer
  "iat": 1703462400,             // Issued at (Unix timestamp)
  "exp": 1703548800,             // Expires (24h default)
  "aud": "venue|partner|public", // Audience scope
  "claims": {
    "age_verified": true,        // Boolean only, no DOB
    "idv_tier": "standard",      // Verification level
    "health_valid": true,        // Health panel status (if applicable)
    "member_since": "2024"       // Year only
  },
  "jti": "unique_token_id"       // For revocation
}
```

---

## 3. Token Lifecycle

### Generation
1. User authenticates via standard auth
2. User requests Ghost Token via dashboard
3. Server generates opaque subject ID (hash of user_id + salt)
4. Server creates JWT with minimal claims
5. Token stored in `ghost_tokens` table (jti → user_id mapping)
6. Token returned to client

### Validation
1. Scanner/venue receives Ghost Token (QR or NFC)
2. Token sent to `/api/validate-ghost-token`
3. Server verifies:
   - Signature validity
   - Expiration not passed
   - Token not revoked (jti check)
   - Audience matches requestor
4. Returns claim results (not user identity)

### Revocation
1. User revokes via dashboard, OR
2. Admin revokes via admin panel, OR
3. Automatic revocation on security event
4. `ghost_tokens.revoked_at` set
5. All future validations fail

---

## 4. Database Schema

```sql
CREATE TABLE ghost_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jti TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  subject_hash TEXT NOT NULL,  -- Opaque identifier
  audience TEXT NOT NULL,
  claims JSONB,
  issued_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Users can only see their own tokens
ALTER TABLE ghost_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own tokens"
  ON ghost_tokens FOR SELECT
  USING (auth.uid() = user_id);

-- Index for validation lookups
CREATE INDEX idx_ghost_tokens_jti ON ghost_tokens(jti);
CREATE INDEX idx_ghost_tokens_user ON ghost_tokens(user_id);
```

---

## 5. API Endpoints

### Generate Token
```
POST /api/generate-ghost-token
Authorization: Bearer <user_jwt>

Request:
{
  "audience": "venue",
  "ttl_hours": 24,
  "include_claims": ["age_verified", "idv_tier"]
}

Response:
{
  "ghost_token": "eyJ...",
  "expires_at": "2024-12-25T00:00:00Z",
  "qr_data": "valid://ghost/eyJ..."
}
```

### Validate Token
```
POST /api/validate-ghost-token
Authorization: Bearer <venue_api_key>

Request:
{
  "ghost_token": "eyJ..."
}

Response:
{
  "valid": true,
  "claims": {
    "age_verified": true,
    "idv_tier": "standard"
  },
  "expires_at": "2024-12-25T00:00:00Z"
}
```

### Revoke Token
```
POST /api/revoke-ghost-token
Authorization: Bearer <user_jwt>

Request:
{
  "jti": "unique_token_id",
  "reason": "user_requested"
}

Response:
{
  "revoked": true
}
```

---

## 6. Security Considerations

### Token Signing
- Secret stored in Supabase secrets
- Rotation every 90 days (planned)
- Old tokens remain valid until expiry

### Rate Limiting
- Generation: 10 tokens/user/hour
- Validation: 1000 requests/venue/minute

### Audit Logging
```sql
CREATE TABLE ghost_token_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jti TEXT NOT NULL,
  event_type TEXT NOT NULL,  -- generated, validated, revoked, expired
  actor_type TEXT,           -- user, venue, admin, system
  actor_id TEXT,             -- Opaque reference
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 7. Privacy Mapping

| What Venues See | What They DON'T See |
|-----------------|---------------------|
| Age verified (Y/N) | Actual date of birth |
| IDV complete (Y/N) | ID document details |
| Health valid (Y/N) | Lab results |
| Member since (year) | Exact join date |
| Opaque subject ID | Real user ID or name |

---

## 8. Future Enhancements

- [ ] Zero-knowledge proof integration
- [ ] Selective disclosure (choose which claims)
- [ ] Multi-use vs single-use tokens
- [ ] Cross-venue token federation
- [ ] Hardware security module (HSM) signing

---

*Document ID: GHOST_TOKEN_SPEC_INTERNAL_v1*
