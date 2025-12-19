import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Response codes for door scan
type ScanResultCode = 'VERIFIED' | 'EXPIRED' | 'USED' | 'INVALID' | 'DENIED';

interface DoorScanResult {
  status: ScanResultCode;
  decision: 'GOOD' | 'REVIEW' | 'NO';
  profile?: {
    fullName: string;
    memberId: string;
    profileImageUrl?: string;
    idFrontUrl?: string;
    idBackUrl?: string;
    isValid: boolean;
    idvStatus: string;
    idvTier: string;
  };
  expiresAt?: string;
  message: string;
  scanEventId?: string;
  scanFeeBilled?: boolean;
}

const SCAN_FEE_AMOUNT = 0.20;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Use service role for door scan validation
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { token, venueId, deviceId, idempotencyKey } = await req.json();

    if (!token) {
      const result: DoorScanResult = {
        status: 'INVALID',
        decision: 'NO',
        message: 'No token provided'
      };
      return new Response(
        JSON.stringify(result),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Door scan initiated for token:', token.substring(0, 8) + '...');

    // Validate token
    const { data: tokenData, error: tokenError } = await supabase
      .from('qr_access_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      console.log('Token not found:', tokenError);
      const result: DoorScanResult = {
        status: 'INVALID',
        decision: 'NO',
        message: 'Token not recognized'
      };
      
      // Log scan event (failed - no billing)
      await supabase.from('door_scan_log').insert({
        venue_id: venueId || '00000000-0000-0000-0000-000000000000',
        device_id: deviceId,
        scan_result: 'denied',
        deny_reason: 'invalid_token'
      });
      
      return new Response(
        JSON.stringify(result),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    
    if (now > expiresAt) {
      console.log('Token expired:', tokenData.expires_at);
      const result: DoorScanResult = {
        status: 'EXPIRED',
        decision: 'NO',
        message: 'Code has evaporated — guest must generate a new code'
      };
      
      await supabase.from('door_scan_log').insert({
        venue_id: venueId || '00000000-0000-0000-0000-000000000000',
        device_id: deviceId,
        scan_result: 'denied',
        deny_reason: 'token_expired'
      });
      
      return new Response(
        JSON.stringify(result),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if token already used (single-use)
    if (tokenData.used_at) {
      console.log('Token already used:', tokenData.used_at);
      const result: DoorScanResult = {
        status: 'USED',
        decision: 'NO',
        message: 'Code already used — guest must generate a new code'
      };
      
      await supabase.from('door_scan_log').insert({
        venue_id: venueId || '00000000-0000-0000-0000-000000000000',
        device_id: deviceId,
        scan_result: 'denied',
        deny_reason: 'token_already_used'
      });
      
      return new Response(
        JSON.stringify(result),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark token as used
    await supabase
      .from('qr_access_tokens')
      .update({ used_at: now.toISOString() })
      .eq('id', tokenData.id);

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', tokenData.profile_id)
      .single();

    if (profileError || !profile) {
      console.error('Profile not found:', profileError);
      const result: DoorScanResult = {
        status: 'INVALID',
        decision: 'NO',
        message: 'Profile not found'
      };
      return new Response(
        JSON.stringify(result),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine decision based on profile data
    let decision: 'GOOD' | 'REVIEW' | 'NO' = 'GOOD';
    let status: ScanResultCode = 'VERIFIED';

    // Check IDV status
    if (profile.idv_status !== 'verified') {
      decision = 'REVIEW';
    }

    // Check validity
    if (!profile.is_valid) {
      decision = 'REVIEW';
    }

    // Check validity expiry
    if (profile.validity_expires_at) {
      const validityExpiry = new Date(profile.validity_expires_at);
      if (now > validityExpiry) {
        decision = 'REVIEW';
      }
    }

    // Log successful scan first to get the scan_log_id
    const { data: scanLog, error: scanLogError } = await supabase
      .from('door_scan_log')
      .insert({
        venue_id: venueId || '00000000-0000-0000-0000-000000000000',
        device_id: deviceId,
        scanned_user_id: profile.user_id,
        scan_result: decision === 'GOOD' ? 'approved' : 'review'
      })
      .select('id')
      .single();

    if (scanLogError) {
      console.error('Failed to log scan:', scanLogError);
    }

    // Record billable scan event (idempotent)
    // Use the provided idempotency key or generate one from scan_log_id
    const effectiveVenueId = venueId || '00000000-0000-0000-0000-000000000000';
    const scanIdempotencyKey = idempotencyKey || 
      `door_entry:${effectiveVenueId}:${profile.user_id}:${scanLog?.id || tokenData.id}`;

    let scanEventId: string | null = null;
    let scanFeeBilled = false;

    // Only bill for successful authorizations (GOOD or REVIEW decisions, not NO)
    if (scanLog?.id && (decision === 'GOOD' || decision === 'REVIEW')) {
      // Check grace window first (60 seconds default)
      const { data: inGraceWindow } = await supabase
        .rpc('is_within_scan_grace_window', {
          p_venue_id: effectiveVenueId,
          p_user_id: profile.user_id,
          p_event_type: 'door_entry',
          p_grace_seconds: 60
        });

      if (!inGraceWindow) {
        // Record the billable scan event
        const { data: eventId, error: eventError } = await supabase
          .rpc('record_billable_scan_event', {
            p_venue_id: effectiveVenueId,
            p_user_id: profile.user_id,
            p_event_type: 'door_entry',
            p_idempotency_key: scanIdempotencyKey,
            p_scan_log_id: scanLog.id,
            p_fee_amount: SCAN_FEE_AMOUNT
          });

        if (eventError) {
          console.error('Failed to record billable scan event:', eventError);
        } else {
          scanEventId = eventId;
          scanFeeBilled = true;
          console.log('Billable scan event recorded:', eventId);
        }
      } else {
        console.log('Scan within grace window, not billing');
      }
    }

    // Generate short-lived signed URLs for ID images (60s)
    // For now, we'll return the stored URLs directly
    // In production, these should be signed URLs with 60s expiry
    const idFrontUrl = profile.health_document_url || undefined;
    const idBackUrl = undefined; // Placeholder for back ID image

    const result: DoorScanResult = {
      status,
      decision,
      profile: {
        fullName: profile.full_name || 'Unknown',
        memberId: profile.member_id || 'N/A',
        profileImageUrl: profile.profile_image_url || undefined,
        idFrontUrl,
        idBackUrl,
        isValid: profile.is_valid ?? false,
        idvStatus: profile.idv_status || 'pending',
        idvTier: profile.idv_tier || 'basic'
      },
      expiresAt: new Date(Date.now() + 60000).toISOString(), // Door display expires in 60s
      message: decision === 'GOOD' ? 'Verified — Entry Approved' : 
               decision === 'REVIEW' ? 'Review Required — Check ID' : 
               'Entry Denied',
      scanEventId: scanEventId || undefined,
      scanFeeBilled
    };

    console.log('Door scan successful:', result.status, result.decision, 'billed:', scanFeeBilled);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in door-scan function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        status: 'INVALID',
        decision: 'NO',
        message: errorMessage 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});