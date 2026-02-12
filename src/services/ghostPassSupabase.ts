import { createClient } from '@supabase/supabase-js';

// Ghost Pass Supabase credentials
const GHOST_PASS_SUPABASE_URL = 'https://szjuufogsbpeaqnamuyo.supabase.co';
const GHOST_PASS_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6anV1Zm9nc2JwZWFxbmFtdXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMTg4NzAsImV4cCI6MjA4Mzc5NDg3MH0.IDDl1ztwCj3C3SYXR1qawMjoKcbq0z8xfOGoLF9y3Fw';

// Create a separate Supabase client for Ghost Pass database
export const ghostPassSupabase = createClient(
  GHOST_PASS_SUPABASE_URL,
  GHOST_PASS_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false, // Don't persist auth for this client
      autoRefreshToken: false,
    }
  }
);
