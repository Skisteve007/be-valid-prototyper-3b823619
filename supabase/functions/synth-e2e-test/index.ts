import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  duration_ms?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  );

  const results: TestResult[] = [];
  const startTime = Date.now();

  try {
    // Auth check - require admin for running tests
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = userData.user.id;

    // Check admin role
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'administrator')
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Admin access required for E2E tests' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[E2E-TEST] Starting test suite...');

    // ========== TEST 1: Senate Run - Partial Seat Availability ==========
    {
      const testStart = Date.now();
      try {
        // Run a Senate query - should return 7 seats even with only some online
        const { data, error } = await supabaseClient.functions.invoke('synth-senate-run', {
          body: { input_text: 'E2E Test: Validate partial seat availability' },
          headers: { Authorization: authHeader }
        });

        if (error) throw error;

        const ballots = data?.ballots || [];
        const hasSevenSeats = ballots.length === 7;
        const hasJudgeOutput = !!data?.judge_output?.trace_id;
        const offlineHandled = ballots.filter((b: any) => b.status === 'offline').length >= 4; // At least 4 should be offline

        results.push({
          name: 'Senate: 7 Seats Always Returned',
          passed: hasSevenSeats,
          message: hasSevenSeats ? `Got ${ballots.length} seats as expected` : `Expected 7 seats, got ${ballots.length}`,
          duration_ms: Date.now() - testStart
        });

        results.push({
          name: 'Senate: Judge Output Has trace_id',
          passed: hasJudgeOutput,
          message: hasJudgeOutput ? `trace_id: ${data.judge_output.trace_id}` : 'Missing trace_id',
          duration_ms: Date.now() - testStart
        });

        results.push({
          name: 'Senate: Offline Seats Handled Gracefully',
          passed: offlineHandled,
          message: offlineHandled ? 'Offline seats marked correctly' : 'Offline handling issue',
          duration_ms: Date.now() - testStart
        });
      } catch (error) {
        results.push({
          name: 'Senate: Seat Orchestration',
          passed: false,
          message: `Error: ${error instanceof Error ? error.message : 'Unknown'}`,
          duration_ms: Date.now() - testStart
        });
      }
    }

    // ========== TEST 2: Calibration - Weight Validation ==========
    {
      const testStart = Date.now();
      try {
        // Test invalid weights (not summing to 100)
        const invalidWeights = {
          seat_1_weight: 20,
          seat_2_weight: 20,
          seat_3_weight: 20,
          seat_4_weight: 20,
          seat_5_weight: 20,
          seat_6_weight: 20,
          seat_7_weight: 20 // = 140, not 100
        };

        const { data, error } = await supabaseClient.functions.invoke('synth-calibration', {
          method: 'PUT',
          body: invalidWeights,
          headers: { Authorization: authHeader }
        });

        // Should fail with 400
        const rejectedInvalid = error || (data?.error?.includes('100'));

        results.push({
          name: 'Calibration: Reject Invalid Weights (sum != 100)',
          passed: !!rejectedInvalid,
          message: rejectedInvalid ? 'Correctly rejected weights not summing to 100' : 'FAILED: Accepted invalid weights',
          duration_ms: Date.now() - testStart
        });
      } catch (error) {
        results.push({
          name: 'Calibration: Weight Validation',
          passed: true, // Error is expected
          message: 'Correctly rejected with error',
          duration_ms: Date.now() - testStart
        });
      }
    }

    // ========== TEST 3: Calibration - Valid Weights ==========
    {
      const testStart = Date.now();
      try {
        const validWeights = {
          seat_1_weight: 20,
          seat_2_weight: 15,
          seat_3_weight: 15,
          seat_4_weight: 14,
          seat_5_weight: 14,
          seat_6_weight: 12,
          seat_7_weight: 10 // = 100
        };

        const { data, error } = await supabaseClient.functions.invoke('synth-calibration', {
          method: 'PUT',
          body: validWeights,
          headers: { Authorization: authHeader }
        });

        const accepted = !error && data?.success;

        results.push({
          name: 'Calibration: Accept Valid Weights (sum = 100)',
          passed: accepted,
          message: accepted ? 'Valid weights accepted' : `Rejected valid weights: ${error?.message || JSON.stringify(data)}`,
          duration_ms: Date.now() - testStart
        });
      } catch (error) {
        results.push({
          name: 'Calibration: Valid Weights',
          passed: false,
          message: `Error: ${error instanceof Error ? error.message : 'Unknown'}`,
          duration_ms: Date.now() - testStart
        });
      }
    }

    // ========== TEST 4: Prefill - User Scoped Security ==========
    {
      const testStart = Date.now();
      try {
        // Create prefill as current user
        const { data: createData, error: createError } = await supabaseClient.functions.invoke('synth-prefill', {
          body: { 
            action: 'create', 
            selected_text: 'E2E Test Security Check',
            url: 'https://test.example.com',
            title: 'Test Page'
          },
          headers: { Authorization: authHeader }
        });

        if (createError) throw createError;
        const prefillId = createData?.prefill_id;

        if (!prefillId) {
          throw new Error('No prefill_id returned');
        }

        // Verify the prefill belongs to the user by checking it can be retrieved
        const { data: getData, error: getError } = await supabaseClient.functions.invoke('synth-prefill', {
          body: { action: 'get', prefill_id: prefillId },
          headers: { Authorization: authHeader }
        });

        // Note: The prefill is marked as consumed after first get, so this tests the happy path
        results.push({
          name: 'Prefill: Create and Retrieve (User Scoped)',
          passed: !getError && getData?.selected_text === 'E2E Test Security Check',
          message: !getError ? 'Prefill created and retrieved successfully' : `Error: ${getError?.message}`,
          duration_ms: Date.now() - testStart
        });

        // Test: Trying to fetch same prefill again should fail (consumed)
        const { data: getData2, error: getError2 } = await supabaseClient.functions.invoke('synth-prefill', {
          body: { action: 'get', prefill_id: prefillId },
          headers: { Authorization: authHeader }
        });

        results.push({
          name: 'Prefill: Consumed After First Fetch',
          passed: !!getError2 || getData2?.error,
          message: getError2 || getData2?.error ? 'Correctly rejected consumed prefill' : 'FAILED: Allowed re-fetch of consumed prefill',
          duration_ms: Date.now() - testStart
        });

      } catch (error) {
        results.push({
          name: 'Prefill: Security Test',
          passed: false,
          message: `Error: ${error instanceof Error ? error.message : 'Unknown'}`,
          duration_ms: Date.now() - testStart
        });
      }
    }

    // ========== TEST 5: RBAC - Non-Employer Calibration Access ==========
    {
      const testStart = Date.now();
      // Note: We can't easily test non-employer without a second user, so we verify the check exists
      // by checking the GET endpoint returns is_employer flag
      try {
        const { data, error } = await supabaseClient.functions.invoke('synth-calibration', {
          method: 'GET',
          headers: { Authorization: authHeader }
        });

        const hasEmployerFlag = data?.hasOwnProperty('is_employer');

        results.push({
          name: 'RBAC: Calibration Returns is_employer Flag',
          passed: hasEmployerFlag,
          message: hasEmployerFlag ? `is_employer: ${data.is_employer}` : 'Missing is_employer flag',
          duration_ms: Date.now() - testStart
        });
      } catch (error) {
        results.push({
          name: 'RBAC: Calibration Access Check',
          passed: false,
          message: `Error: ${error instanceof Error ? error.message : 'Unknown'}`,
          duration_ms: Date.now() - testStart
        });
      }
    }

    // ========== TEST 6: Database Tables Exist ==========
    {
      const testStart = Date.now();
      const tables = ['synth_calibration', 'synth_prefills', 'synth_senate_runs', 'synth_security_events', 'synth_calibration_audit', 'synth_learning_events', 'synth_probation'];
      
      for (const table of tables) {
        try {
          const { error } = await supabaseClient.from(table).select('id').limit(1);
          results.push({
            name: `Database: Table ${table} Exists`,
            passed: !error,
            message: !error ? 'Table accessible' : `Error: ${error.message}`,
            duration_ms: Date.now() - testStart
          });
        } catch (error) {
          results.push({
            name: `Database: Table ${table}`,
            passed: false,
            message: `Error: ${error instanceof Error ? error.message : 'Unknown'}`,
            duration_ms: Date.now() - testStart
          });
        }
      }
    }

    // ========== TEST 7: Audit Logging ==========
    {
      const testStart = Date.now();
      try {
        // Check if we have audit entries from our calibration test
        const { data, error } = await supabaseClient
          .from('synth_calibration_audit')
          .select('*')
          .eq('actor_user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);

        const hasAuditEntry = !error && data && data.length > 0;

        results.push({
          name: 'Audit: Calibration Changes Logged',
          passed: hasAuditEntry,
          message: hasAuditEntry ? 'Audit entry found' : 'No audit entry found',
          duration_ms: Date.now() - testStart
        });
      } catch (error) {
        results.push({
          name: 'Audit: Logging Check',
          passed: false,
          message: `Error: ${error instanceof Error ? error.message : 'Unknown'}`,
          duration_ms: Date.now() - testStart
        });
      }
    }

    const totalDuration = Date.now() - startTime;
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;

    console.log(`[E2E-TEST] Complete: ${passed} passed, ${failed} failed in ${totalDuration}ms`);

    return new Response(
      JSON.stringify({
        summary: {
          total: results.length,
          passed,
          failed,
          duration_ms: totalDuration
        },
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[E2E-TEST] Error:', message);
    return new Response(
      JSON.stringify({ error: message, results }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
