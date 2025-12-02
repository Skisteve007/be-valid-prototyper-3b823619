import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackingRequest {
  logId: string;
  eventType: 'opened' | 'clicked';
  url?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const logId = url.searchParams.get('logId');
    const eventType = url.searchParams.get('type') as 'opened' | 'clicked';
    const clickUrl = url.searchParams.get('url');

    if (!logId || !eventType) {
      return new Response('Missing required parameters', { status: 400 });
    }

    // Get user agent and IP
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    console.log(`Tracking ${eventType} event for log ID: ${logId}`);

    // Get the campaign log to find template_id
    const { data: campaignLog, error: logError } = await supabase
      .from('email_campaign_log')
      .select('template_id')
      .eq('id', logId)
      .single();

    if (logError || !campaignLog) {
      console.error('Campaign log not found:', logError);
      return new Response('Campaign log not found', { status: 404 });
    }

    // Check if this event already exists (prevent duplicate opens/clicks)
    const { data: existingEvent } = await supabase
      .from('email_tracking_events')
      .select('id')
      .eq('campaign_log_id', logId)
      .eq('event_type', eventType)
      .maybeSingle();

    if (!existingEvent) {
      // Insert tracking event
      const { error: eventError } = await supabase
        .from('email_tracking_events')
        .insert({
          campaign_log_id: logId,
          event_type: eventType,
          event_data: clickUrl ? { url: clickUrl } : {},
          user_agent: userAgent,
          ip_address: ipAddress,
        });

      if (eventError) {
        console.error('Error inserting tracking event:', eventError);
      } else {
        console.log('Tracking event inserted successfully');
      }

      // Increment campaign analytics
      if (campaignLog.template_id) {
        const { error: statError } = await supabase.rpc('increment_campaign_stat', {
          _campaign_id: campaignLog.template_id,
          _stat_type: eventType,
        });

        if (statError) {
          console.error('Error incrementing campaign stat:', statError);
        } else {
          console.log('Campaign stat incremented successfully');
        }
      }
    }

    // For opens, return a transparent 1x1 pixel GIF
    if (eventType === 'opened') {
      const pixel = Uint8Array.from(atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), c => c.charCodeAt(0));
      return new Response(pixel, {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          ...corsHeaders,
        },
      });
    }

    // For clicks, redirect to the target URL
    if (eventType === 'clicked' && clickUrl) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': clickUrl,
          ...corsHeaders,
        },
      });
    }

    return new Response('Event tracked', {
      status: 200,
      headers: { 'Content-Type': 'text/plain', ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in track-email-event function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
