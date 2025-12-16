import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuditCheck {
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: string;
}

interface AuditReport {
  timestamp: string;
  environment: string;
  checks: Record<string, AuditCheck>;
  summary: {
    passed: number;
    failed: number;
    warnings: number;
    issues: string[];
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const checks: Record<string, AuditCheck> = {};

    // 1. Database Connection Check
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      checks.database = { 
        status: 'pass', 
        message: `Database connected. ${count || 0} users registered.` 
      };
    } catch (e: unknown) {
      checks.database = { 
        status: 'fail', 
        message: 'Database connection failed',
        details: e instanceof Error ? e.message : String(e) 
      };
    }

    // 2. Auth System Check
    try {
      const { data: authSettings } = await supabase.auth.getSession();
      checks.auth = { 
        status: 'pass', 
        message: 'Auth system operational.' 
      };
    } catch (e: unknown) {
      checks.auth = { 
        status: 'fail', 
        message: 'Auth system error',
        details: e instanceof Error ? e.message : String(e) 
      };
    }

    // 3. Email Provider Check
    if (resendApiKey) {
      checks.email = { 
        status: 'pass', 
        message: 'Email provider (Resend) configured.' 
      };
    } else {
      checks.email = { 
        status: 'fail', 
        message: 'RESEND_API_KEY not configured.' 
      };
    }

    // 4. Partner Venues Check
    try {
      const { count, error } = await supabase
        .from('partner_venues')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      checks.venues = { 
        status: 'pass', 
        message: `${count || 0} partner venues in database.` 
      };
    } catch (e: unknown) {
      checks.venues = { 
        status: 'warn', 
        message: 'Could not fetch venues',
        details: e instanceof Error ? e.message : String(e) 
      };
    }

    // 5. Lab Partners Check
    try {
      const { count, error } = await supabase
        .from('lab_partners')
        .select('*', { count: 'exact', head: true })
        .eq('active', true);
      
      if (error) throw error;
      checks.labPartners = { 
        status: count && count > 0 ? 'pass' : 'warn', 
        message: `${count || 0} active lab partners.` 
      };
    } catch (e: unknown) {
      checks.labPartners = { 
        status: 'warn', 
        message: 'Could not fetch lab partners',
        details: e instanceof Error ? e.message : String(e) 
      };
    }

    // 6. Recent Signups Check (last 24h activity)
    try {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday);
      
      if (error) throw error;
      checks.recentActivity = { 
        status: 'pass', 
        message: `${count || 0} new signups in last 24 hours.` 
      };
    } catch (e: unknown) {
      checks.recentActivity = { 
        status: 'warn', 
        message: 'Could not check recent activity',
        details: e instanceof Error ? e.message : String(e) 
      };
    }

    // 7. Page Views Check
    try {
      const { count, error } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      checks.analytics = { 
        status: 'pass', 
        message: `${count || 0} total page views tracked.` 
      };
    } catch (e: unknown) {
      checks.analytics = { 
        status: 'warn', 
        message: 'Could not fetch analytics',
        details: e instanceof Error ? e.message : String(e) 
      };
    }

    // 8. Compliance Certifications Check
    try {
      const { data, error } = await supabase
        .from('compliance_certifications')
        .select('certification_type, certification_status')
        .eq('certification_status', 'active');
      
      if (error) throw error;
      const certTypes = data?.map(c => c.certification_type).join(', ') || 'None';
      checks.compliance = { 
        status: data && data.length > 0 ? 'pass' : 'warn', 
        message: `Active certifications: ${certTypes || 'None configured'}` 
      };
    } catch (e: unknown) {
      checks.compliance = { 
        status: 'warn', 
        message: 'Could not fetch compliance data',
        details: e instanceof Error ? e.message : String(e) 
      };
    }

    // Calculate summary
    const summary = {
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: [] as string[]
    };

    for (const [key, value] of Object.entries(checks)) {
      if (value.status === 'pass') {
        summary.passed++;
      } else if (value.status === 'fail') {
        summary.failed++;
        summary.issues.push(`❌ ${key}: ${value.message}`);
      } else {
        summary.warnings++;
        summary.issues.push(`⚠️ ${key}: ${value.message}`);
      }
    }

    const audit: AuditReport = {
      timestamp: new Date().toISOString(),
      environment: 'production',
      checks,
      summary
    };

    // Determine overall status for logging
    let overallStatus = 'HEALTHY';
    if (summary.failed > 0) {
      overallStatus = summary.failed >= 3 ? 'CRITICAL' : 'WARNING';
    } else if (summary.warnings > 0) {
      overallStatus = 'WARNING';
    }

    // Get trigger type from query params
    const url = new URL(req.url);
    const triggerType = url.searchParams.get('trigger') || 'manual';
    const sendEmail = url.searchParams.get('email') === 'true';

    // Save audit log to database
    try {
      const { error: insertError } = await supabase
        .from('audit_logs')
        .insert({
          timestamp: new Date().toISOString(),
          status: overallStatus,
          passed: summary.passed,
          failed: summary.failed,
          warned: summary.warnings,
          trigger_type: triggerType,
          details: {
            checks: checks,
            site_url: 'https://bevalid.app',
            issues: summary.issues,
          },
        });

      if (insertError) {
        console.error('Failed to save audit log:', insertError);
      } else {
        console.log('Audit log saved successfully');
      }
    } catch (logError) {
      console.error('Error saving audit log:', logError);
    }

    if (sendEmail && resendApiKey) {
      const statusEmoji = summary.failed > 0 ? '❌' : summary.warnings > 0 ? '⚠️' : '✅';
      const statusText = summary.failed > 0 ? 'ISSUES DETECTED' : summary.warnings > 0 ? 'WARNINGS' : 'ALL PASSED';

      const checksHtml = Object.entries(checks).map(([key, value]) => {
        const emoji = value.status === 'pass' ? '✅' : value.status === 'fail' ? '❌' : '⚠️';
        return `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #333;">${emoji}</td>
          <td style="padding: 8px; border-bottom: 1px solid #333; text-transform: capitalize;">${key}</td>
          <td style="padding: 8px; border-bottom: 1px solid #333;">${value.message}</td>
        </tr>`;
      }).join('');

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #111; border-radius: 12px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #00f0ff, #0080ff); padding: 30px; text-align: center; }
            .header h1 { margin: 0; color: #000; font-size: 24px; letter-spacing: 2px; }
            .status { font-size: 18px; margin-top: 10px; color: #000; font-weight: bold; }
            .content { padding: 30px; }
            .summary { display: flex; justify-content: space-around; margin-bottom: 30px; text-align: center; }
            .stat { padding: 15px; }
            .stat-number { font-size: 32px; font-weight: bold; }
            .stat-label { font-size: 12px; color: #888; text-transform: uppercase; }
            .passed .stat-number { color: #00ff88; }
            .failed .stat-number { color: #ff4444; }
            .warnings .stat-number { color: #ffaa00; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; padding: 12px 8px; border-bottom: 2px solid #00f0ff; color: #00f0ff; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #333; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>VALID™ SYSTEM AUDIT</h1>
              <div class="status">${statusEmoji} ${statusText}</div>
            </div>
            <div class="content">
              <div class="summary">
                <div class="stat passed">
                  <div class="stat-number">${summary.passed}</div>
                  <div class="stat-label">Passed</div>
                </div>
                <div class="stat failed">
                  <div class="stat-number">${summary.failed}</div>
                  <div class="stat-label">Failed</div>
                </div>
                <div class="stat warnings">
                  <div class="stat-number">${summary.warnings}</div>
                  <div class="stat-label">Warnings</div>
                </div>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th style="width: 30px;"></th>
                    <th>Check</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  ${checksHtml}
                </tbody>
              </table>
            </div>
            <div class="footer">
              Audit performed: ${new Date().toLocaleString()}<br>
              Environment: Production | bevalid.app
            </div>
          </div>
        </body>
        </html>
      `;

      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "VALID™ System <alerts@bevalid.app>",
            to: ["steve@bevalid.app"],
            subject: `${statusEmoji} VALID™ System Audit - ${statusText} - ${new Date().toLocaleDateString()}`,
            html: emailHtml,
          }),
        });

        if (!emailRes.ok) {
          console.error("Failed to send audit email:", await emailRes.text());
        }
      } catch (emailError) {
        console.error("Email send error:", emailError);
      }
    }

    return new Response(JSON.stringify(audit, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Audit error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
