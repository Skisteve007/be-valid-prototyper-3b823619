# Clean Check - Native Mobile App Setup with Biometric Authentication

## What's Been Implemented

✅ **Email Confirmation System**: New users receive a welcome email with their unique Member ID (format: CC-12345678)
✅ **Biometric Authentication**: Full fingerprint and Face ID support for iOS and Android
✅ **Capacitor Configuration**: Native mobile app framework configured and ready
✅ **Member ID Generation**: Automatic unique ID generation for each new member

## How to Test on a Physical Device or Emulator

### Prerequisites

- **Mac with Xcode** (for iOS development)
- **Android Studio** (for Android development)
- **Git** installed on your machine

### Step-by-Step Setup

#### 1. Export to GitHub
- Click the "Export to Github" button in Lovable
- This creates a repository with your code

#### 2. Clone the Repository
```bash
git clone <your-github-repo-url>
cd <your-project-folder>
```

#### 3. Install Dependencies
```bash
npm install
```

#### 4. Initialize Capacitor (if not already done)
```bash
npx cap init
```
Use these values:
- App ID: `app.lovable.3ed86c89d0124ddbae081cef2104dd1c`
- App Name: `Clean Check`

#### 5. Add iOS Platform (Mac only)
```bash
npx cap add ios
npx cap update ios
```

#### 6. Add Android Platform
```bash
npx cap add android
npx cap update android
```

#### 7. Build the Web Assets
```bash
npm run build
```

#### 8. Sync Capacitor
```bash
npx cap sync
```

#### 9. Run on Device/Emulator

**For iOS:**
```bash
npx cap open ios
```
This opens Xcode. Then:
- Select your device or simulator from the device selector
- Click the Play button to build and run

**For Android:**
```bash
npx cap open android
```
This opens Android Studio. Then:
- Select your device or emulator
- Click the Run button

## Testing Biometric Authentication

### On Physical Devices:

**iOS (iPhone/iPad):**
1. Ensure Face ID or Touch ID is set up on your device (Settings → Face ID & Passcode)
2. Sign up for a new account in the app
3. Check the "Enable biometric login" checkbox during signup
4. After signup, you'll be prompted to authenticate with your biometric
5. Next time you login, tap "Login with Biometrics" button

**Android:**
1. Ensure fingerprint is registered (Settings → Security → Fingerprint)
2. Sign up for a new account
3. Enable biometric during signup
4. Authenticate with fingerprint when prompted

### In Simulators/Emulators:

**iOS Simulator:**
- In the simulator menu: Features → Face ID → Enrolled
- When prompted, use: Features → Face ID → Matching Face

**Android Emulator:**
- Settings → Security → Fingerprint
- Use the emulator fingerprint sensor simulation

## How the System Works

### Email Confirmation Flow:
1. User signs up with email and password
2. Profile is created with unique Member ID (CC-XXXXXXXX)
3. Welcome email is sent to user with their Member ID
4. User can login immediately (auto-confirm is enabled for testing)

### Biometric Authentication Flow:
1. During signup, user can opt-in to biometric authentication
2. Credentials are stored securely (using device keychain on native platforms)
3. On login page, "Login with Biometrics" button appears
4. User authenticates with fingerprint/Face ID
5. App retrieves stored credentials and logs them in

## Important Notes

### Development vs Production:

**Current Setup (Development):**
- Hot-reload enabled (connects to Lovable preview URL)
- Email auto-confirm enabled for easy testing
- Credentials stored in localStorage (browser) or device storage (native)

**For Production:**
1. Change `capacitor.config.ts` - remove the `server.url` line
2. Build the app: `npm run build`
3. Sync: `npx cap sync`
4. Configure email confirmation in Lovable Cloud backend
5. Implement proper secure storage for credentials

### Security Considerations:

⚠️ **Important**: The current biometric implementation uses base64 encoding for credential storage. For production:
- Implement `@capacitor/preferences` with encryption
- Or use native keychain storage plugins
- Never store passwords in plain text

### Email Setup:

Make sure your Resend domain is verified:
- Go to https://resend.com/domains
- Add and verify your domain
- Update the `from` address in the edge function

### Testing Email:

To test emails without deploying:
1. View Backend → Functions → send-welcome-email
2. Test the function with sample data

## Troubleshooting

### "Biometric not available"
- Ensure biometric is set up on the device
- Check device settings for Face ID/Fingerprint
- Make sure you're running on a physical device or properly configured emulator

### Edge Function Errors
- The Resend import warning in build is expected for Deno edge functions
- Edge functions work when deployed, not in local preview

### Android Build Issues
- Make sure Java 11 or higher is installed
- Update Android Studio to latest version
- Sync Gradle files

### iOS Build Issues
- Open Xcode and update to latest version
- Clean build folder: Product → Clean Build Folder
- Check signing certificates

## Next Steps

1. **Test the email system**: Sign up with a real email address
2. **Test biometrics**: Try on a physical device with fingerprint/Face ID
3. **Customize emails**: Update the welcome email template in the edge function
4. **Add document upload**: Implement the document upload feature for health verification
5. **Generate QR codes**: After document upload, generate unique QR codes

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Biometric Auth Plugin](https://github.com/aparajita/capacitor-biometric-auth)
- [Lovable Cloud Documentation](https://docs.lovable.dev/features/cloud)
- [Blog Post: Mobile Development with Lovable](https://docs.lovable.dev)

## Support

If you encounter issues, check:
1. Console logs in browser/device
2. Edge function logs in Lovable Cloud backend
3. Device logs in Xcode/Android Studio
