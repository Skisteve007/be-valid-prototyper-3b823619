# VALID — Mobile App Handoff Documentation

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Target:** iOS + Android via Capacitor WebView Wrapper

---

## 📱 Mobile Readiness Checklist

### ✅ PWA Support (Complete)
- [x] `manifest.json` with name, icons, theme color, shortcuts
- [x] Service Worker (`/sw.js`) with offline caching
- [x] Offline fallback page (`/offline.html`)
- [x] iOS "Add to Home Screen" prompt
- [x] Android install banner with native prompt
- [x] Deep link shortcuts for core routes

### ✅ Mobile Responsiveness (Complete)
- [x] All pages use responsive Tailwind utilities
- [x] Touch targets minimum 44px on mobile
- [x] Viewport meta configured correctly
- [x] Safe area insets supported (`viewport-fit=cover`)

### ✅ Security Constraints (Complete)
- [x] Tier-0 routes protected by `SteveOwnerGate` component
- [x] Steve emails hardcoded: `steve@bevalid.app`, `sgrillocce@gmail.com`
- [x] Admin/Think Tank links hidden from non-Steve users
- [x] Auth state checked via Supabase session (server-side validation)

---

## 🏗️ Project Architecture

### Technology Stack
```
Frontend:     React 18 + TypeScript + Vite
Styling:      Tailwind CSS + shadcn/ui
Backend:      Supabase (Lovable Cloud)
Auth:         Supabase Auth (email/password + session tokens)
State:        TanStack Query + React Context
Routing:      React Router v6
i18n:         i18next (10 languages)
Mobile:       Capacitor 7 (pre-configured)
```

### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui primitives
│   ├── admin/           # Admin-only components
│   ├── dashboard/       # Member dashboard components
│   ├── demos/           # Demo page components
│   └── ...
├── pages/               # Route pages
├── hooks/               # Custom React hooks
├── config/              # App configuration
├── integrations/        # Supabase client
└── i18n/                # Translations

public/
├── manifest.json        # PWA manifest
├── sw.js                # Service worker
├── offline.html         # Offline fallback
└── app-icon.jpg         # App icon

supabase/
├── functions/           # Edge functions
└── config.toml          # Supabase config
```

---

## 🔐 Security Architecture

### Tier-0 Access Control (Steve-Only)
```typescript
// src/hooks/useIsSteveOwner.ts
const STEVE_EMAILS = ['steve@bevalid.app', 'sgrillocce@gmail.com'];

// Protected routes use SteveOwnerGate component:
<SteveOwnerGate fallbackPath="/">
  <ProtectedContent />
</SteveOwnerGate>
```

### Protected Routes (Steve-Only)
| Route | Description |
|-------|-------------|
| `/admin` | Admin Dashboard |
| `/admin/*` | All admin sub-routes |
| `/think-tank` | Think Tank Manager |
| `/synth-admin` | SYNTH Admin Console |
| `/synth-*` | Most SYNTH routes |

### Public Routes (No Auth Required)
| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/demos` | Demo Hub |
| `/demos/*` | Individual demos |
| `/partners` | Partner landing |
| `/auth` | Login/Signup |
| `/privacy`, `/terms` | Legal pages |

### Member Routes (Auth Required)
| Route | Description |
|-------|-------------|
| `/dashboard` | Member dashboard |
| `/my-access` | Access management |
| `/wallet/*` | Wallet features |
| `/scanner` | QR Scanner |

---

## 🛠️ Build Instructions

### Prerequisites
```bash
Node.js >= 18
npm >= 9
Git
```

### Local Development
```bash
# Clone repository
git clone <repo-url>
cd valid-app

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:8080
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Output
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # Main bundle (~500KB)
│   └── index-[hash].css     # Styles (~50KB)
├── manifest.json
├── sw.js
└── ...
```

---

## 🌍 Environment Variables

### Required (Auto-provided by Lovable Cloud)
```env
VITE_SUPABASE_URL=https://csfwfxkuyapfakrmhgjh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_SUPABASE_PROJECT_ID=csfwfxkuyapfakrmhgjh
```

### Edge Function Secrets (Configured in Lovable Cloud)
- `STRIPE_SECRET_KEY` - Payment processing
- `RESEND_API_KEY` - Email delivery
- `FOOTPRINT_API_KEY` - IDV verification

**⚠️ Note:** Secrets are NOT exposed to the client. They're only available in Edge Functions.

---

## 📲 Capacitor Configuration

### Current Config (`capacitor.config.ts`)
```typescript
const config: CapacitorConfig = {
  appId: 'app.lovable.16cc72454b534d559023a9d1ac8edb5b',
  appName: 'VALID',
  webDir: 'dist',
  server: {
    url: 'https://16cc7245-4b53-4d55-9023-a9d1ac8edb5b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    BiometricAuth: {
      androidTitle: 'VALID Login',
      androidSubtitle: 'Use your fingerprint to login',
      androidConfirmationRequired: false,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0a0a',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0a0a0a',
    }
  }
};
```

### For Production Native Build
Change the server config to use local assets:
```typescript
server: {
  // Remove url to use local webDir
  cleartext: false  // Require HTTPS
}
```

### Native Platform Setup
```bash
# Add platforms
npx cap add ios
npx cap add android

# Sync web build to native
npm run build
npx cap sync

# Open in IDE
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio
```

---

## 📷 Camera/QR Features

### Current Implementation
- QR Code generation: `qrcode.react` library (web-based)
- QR Scanning: Browser `navigator.mediaDevices.getUserMedia()`

### Capacitor Migration Path
For native camera access, install:
```bash
npm install @capacitor/camera @capacitor-mlkit/barcode-scanning
npx cap sync
```

Update scan components to use:
```typescript
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

const scanQR = async () => {
  const { barcodes } = await BarcodeScanner.scan();
  return barcodes[0]?.rawValue;
};
```

---

## 🔗 Deep Links

### Supported Routes
| Deep Link | Route |
|-----------|-------|
| `valid://` | `/` |
| `valid://demos` | `/demos` |
| `valid://demos/*` | `/demos/*` |
| `valid://partners` | `/partners` |
| `valid://auth` | `/auth` |
| `valid://dashboard` | `/dashboard` |
| `valid://scanner` | `/scanner` |

### iOS Universal Links
Add to `apple-app-site-association`:
```json
{
  "applinks": {
    "apps": [],
    "details": [{
      "appID": "TEAM_ID.app.lovable.16cc72454b534d559023a9d1ac8edb5b",
      "paths": ["*"]
    }]
  }
}
```

### Android App Links
Add to `AndroidManifest.xml`:
```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="bevalid.app" />
</intent-filter>
```

---

## 🚀 Deployment

### Web (Current)
- Hosted on Lovable Cloud
- Auto-deploys on commit
- URL: `https://www.bevalid.app`

### iOS App Store
1. Build with Xcode
2. Configure signing with Apple Developer account
3. Archive and submit via App Store Connect

### Google Play Store
1. Build signed APK/AAB with Android Studio
2. Create Play Console listing
3. Upload and submit for review

---

## 🧪 Testing Checklist

### PWA Testing
- [ ] Install from Chrome on Android
- [ ] Add to Home Screen from Safari on iOS
- [ ] Verify offline page displays correctly
- [ ] Test manifest shortcuts work

### Native Wrapper Testing
- [ ] App launches without white screen
- [ ] All routes navigate correctly
- [ ] No mixed-content warnings
- [ ] Camera permissions work (if applicable)
- [ ] WhatsApp links open external app
- [ ] Auth flow completes successfully

### Security Testing
- [ ] Admin routes redirect non-Steve users
- [ ] Think Tank not accessible to regular users
- [ ] Session persists across app restarts
- [ ] Logout clears all auth state

---

## 📞 Handoff Contacts

**For questions about:**
- Codebase architecture → Review this document
- Supabase/Backend → Lovable Cloud dashboard
- Business logic → Contact Steve

---

## 📋 Known Issues / Considerations

1. **WhatsApp Links**: `wa.me` links work on mobile but may be blocked in iframe previews
2. **Biometric Auth**: Requires native Capacitor plugin, not available in web-only PWA
3. **Push Notifications**: Service worker ready, but requires FCM/APNs configuration for native
4. **Camera**: Web camera works but native scanner is faster/more reliable

---

**Document maintained by Lovable AI — Last generated December 2024**
