import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type OperatorEventType = 
  | 'STATION_SWITCH' 
  | 'SHIFT_START' 
  | 'SHIFT_END' 
  | 'SCAN_PERFORMED' 
  | 'STATION_LOGIN' 
  | 'STATION_LOGOUT';

interface LogEventRequest {
  eventType: OperatorEventType;
  venueId?: string;
  deviceId?: string;
  operatorLabel: string;
  currentStationLabel?: string;
  fromStationLabel?: string;
  toStationLabel?: string;
  scanLogId?: string;
  metadata?: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: LogEventRequest = await req.json();

    const {
      eventType,
      venueId,
      deviceId,
      operatorLabel,
      currentStationLabel,
      fromStationLabel,
      toStationLabel,
      scanLogId,
      metadata = {}
    } = body;

    if (!eventType || !operatorLabel) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: eventType, operatorLabel' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Logging operator event: ${eventType} by ${operatorLabel}`);

    // Validate event type
    const validEventTypes: OperatorEventType[] = [
      'STATION_SWITCH', 'SHIFT_START', 'SHIFT_END', 
      'SCAN_PERFORMED', 'STATION_LOGIN', 'STATION_LOGOUT'
    ];
    
    if (!validEventTypes.includes(eventType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid event type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert operator event
    const { data, error } = await supabase
      .from('operator_events')
      .insert({
        event_type: eventType,
        venue_id: venueId || null,
        device_id: deviceId || null,
        operator_label: operatorLabel,
        current_station_label: currentStationLabel || toStationLabel || null,
        from_station_label: fromStationLabel || null,
        to_station_label: toStationLabel || null,
        scan_log_id: scanLogId || null,
        operator_verification: 'self_entered',
        metadata: {
          ...metadata,
          logged_at: new Date().toISOString(),
          user_agent: req.headers.get('user-agent') || 'unknown'
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting operator event:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to log event', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Operator event logged successfully: ${data.id}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        eventId: data.id,
        message: `${eventType} logged for ${operatorLabel}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in log-operator-event function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
