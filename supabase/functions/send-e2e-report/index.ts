import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

interface TestItem {
  category: string;
  name: string;
  status: string;
  notes?: string;
  manual?: boolean;
}

interface TestPersona {
  codename: string;
  tier: string;
  plan: string;
  runsCompleted: number;
  status: string;
}

interface ReportPayload {
  to: string;
  subject: string;
  tests: TestItem[];
  personas: TestPersona[];
  bugs: string[];
  fixes: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: ReportPayload = await req.json();
    const { to, subject, tests, personas, bugs, fixes } = payload;

    const passed = tests.filter(t => t.status === 'pass').length;
    const failed = tests.filter(t => t.status === 'fail').length;
    const pending = tests.filter(t => t.status !== 'pass' && t.status !== 'fail').length;

    // Group tests by category
    const categories = [...new Set(tests.map(t => t.category))];
    
    const testsByCategory = categories.map(cat => {
      const catTests = tests.filter(t => t.category === cat);
      return `
        <h3 style="color: #00d4ff; margin-top: 20px;">${cat.toUpperCase()}</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${catTests.map(t => `
            <tr style="border-bottom: 1px solid #333;">
              <td style="padding: 8px; color: ${t.status === 'pass' ? '#22c55e' : t.status === 'fail' ? '#ef4444' : '#f59e0b'};">
                ${t.status === 'pass' ? '✓' : t.status === 'fail' ? '✗' : '○'}
              </td>
              <td style="padding: 8px; color: #e5e7eb;">${t.name}</td>
              <td style="padding: 8px; color: #9ca3af; font-size: 12px;">${t.notes || ''}</td>
              <td style="padding: 8px;">
                ${t.manual ? '<span style="color: #f59e0b; font-size: 10px;">MANUAL</span>' : ''}
              </td>
            </tr>
          `).join('')}
        </table>
      `;
    }).join('');

    const personaRows = personas.map(p => `
      <tr style="border-bottom: 1px solid #333;">
        <td style="padding: 8px; color: #a855f7; font-family: monospace;">${p.codename}</td>
        <td style="padding: 8px; color: #e5e7eb;">${p.tier}</td>
        <td style="padding: 8px; color: #9ca3af;">${p.plan}</td>
        <td style="padding: 8px; color: #e5e7eb;">${p.runsCompleted} runs</td>
        <td style="padding: 8px; color: ${p.status === 'complete' ? '#22c55e' : '#f59e0b'};">
          ${p.status.toUpperCase()}
        </td>
      </tr>
    `).join('');

    const bugsList = bugs.length > 0 
      ? `<ul>${bugs.map(b => `<li style="color: #ef4444; margin: 4px 0;">${b}</li>`).join('')}</ul>`
      : '<p style="color: #9ca3af;">No bugs logged</p>';

    const fixesList = fixes.length > 0
      ? `<ul>${fixes.map(f => `<li style="color: #22c55e; margin: 4px 0;">${f}</li>`).join('')}</ul>`
      : '<p style="color: #9ca3af;">No fixes logged</p>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { background: #0f172a; color: #e5e7eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; }
          .container { max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 2px solid #00d4ff; padding-bottom: 20px; margin-bottom: 20px; }
          .summary { display: flex; gap: 20px; margin: 20px 0; }
          .stat { padding: 15px 25px; border-radius: 8px; text-align: center; }
          .stat.pass { background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; }
          .stat.fail { background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; }
          .stat.pending { background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; }
          .stat-value { font-size: 32px; font-weight: bold; }
          .stat-label { font-size: 12px; color: #9ca3af; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: #00d4ff; margin: 0;">SYNTH™ E2E Test Report</h1>
            <p style="color: #9ca3af; margin: 5px 0;">Generated: ${new Date().toISOString()}</p>
          </div>

          <div class="summary">
            <div class="stat pass">
              <div class="stat-value" style="color: #22c55e;">${passed}</div>
              <div class="stat-label">PASSED</div>
            </div>
            <div class="stat fail">
              <div class="stat-value" style="color: #ef4444;">${failed}</div>
              <div class="stat-label">FAILED</div>
            </div>
            <div class="stat pending">
              <div class="stat-value" style="color: #f59e0b;">${pending}</div>
              <div class="stat-label">PENDING</div>
            </div>
          </div>

          <h2 style="color: #e5e7eb;">Test Results by Category</h2>
          ${testsByCategory}

          <h2 style="color: #a855f7; margin-top: 30px;">Test Personas</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 2px solid #333;">
              <th style="padding: 8px; text-align: left; color: #9ca3af;">Codename</th>
              <th style="padding: 8px; text-align: left; color: #9ca3af;">Tier</th>
              <th style="padding: 8px; text-align: left; color: #9ca3af;">Plan</th>
              <th style="padding: 8px; text-align: left; color: #9ca3af;">Runs</th>
              <th style="padding: 8px; text-align: left; color: #9ca3af;">Status</th>
            </tr>
            ${personaRows}
          </table>

          <h2 style="color: #ef4444; margin-top: 30px;">Bugs Found</h2>
          ${bugsList}

          <h2 style="color: #22c55e; margin-top: 30px;">Fixes Applied</h2>
          ${fixesList}

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; color: #6b7280; font-size: 12px;">
            <p>— SYNTH Board</p>
            <p>This report was generated by the SYNTH E2E Test Suite at bevalid.app</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'SYNTH Board <noreply@bevalid.app>',
        to: [to],
        subject: subject,
        html: htmlContent
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[E2E-REPORT] Resend error:', errorText);
      throw new Error('Failed to send email');
    }

    const result = await response.json();
    console.log('[E2E-REPORT] Email sent:', result);

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[E2E-REPORT] Error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
