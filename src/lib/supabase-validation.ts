/**
 * Validates Supabase configuration at runtime
 * Checks for URL/key project ID mismatch
 */
export function validateSupabaseConfig(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.error('[Supabase Config] Missing environment variables: VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY');
    return false;
  }

  // Extract project ID from URL (format: https://<project-id>.supabase.co)
  const urlMatch = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/);
  if (!urlMatch) {
    console.error('[Supabase Config] Invalid VITE_SUPABASE_URL format. Expected: https://<project-id>.supabase.co');
    return false;
  }
  const urlProjectId = urlMatch[1];

  // Decode JWT to extract project ID from "ref" claim
  try {
    const payloadBase64 = key.split('.')[1];
    if (!payloadBase64) {
      console.error('[Supabase Config] Invalid API key format - not a valid JWT');
      return false;
    }
    const payload = JSON.parse(atob(payloadBase64));
    const keyProjectId = payload.ref;

    if (urlProjectId !== keyProjectId) {
      console.error(
        `[Supabase Config] PROJECT MISMATCH DETECTED!\n` +
        `  URL project ID: ${urlProjectId}\n` +
        `  Key project ID: ${keyProjectId}\n` +
        `  These must match for authentication to work.`
      );
      return false;
    }

    // Verify this is the anon key, not service role
    if (payload.role !== 'anon') {
      console.warn(
        `[Supabase Config] WARNING: Using "${payload.role}" key instead of "anon" key.\n` +
        `  Frontend should use the anon (public) key, not service role.`
      );
    }

    console.log(`[Supabase Config] ✓ Valid configuration for project: ${urlProjectId}`);
    return true;
  } catch (e) {
    console.error('[Supabase Config] Failed to decode API key:', e);
    return false;
  }
}

// Run validation on import
validateSupabaseConfig();
