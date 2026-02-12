import { ghostPassSupabase } from '@/integrations/supabase/ghostpass-client';
import type {
  EntryPointAuditLog,
  EntryPointAuditCreate,
  EntryPointAuditFilter,
  AuditSummaryStats,
  RecentScansResponse,
  EntryPointActionType
} from '@/integrations/supabase/types';

/**
 * Audit Trail API Service
 * Matches backend/routes/audit.py implementation exactly
 * Uses Ghost Pass Supabase instance
 */

/**
 * Manually log an entry point action (for frontend-initiated actions)
 * POST /audit/entry-point
 */
export const logEntryPointAction = async (
  auditData: EntryPointAuditCreate
): Promise<{ status: string; audit_id: string; message: string }> => {
  try {
    // Get current user
    const { data: { user } } = await ghostPassSupabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get entry point details
    const { data: gateway, error: gatewayError } = await ghostPassSupabase
      .from('gateway_points' as any)
      .select('*')
      .eq('id', auditData.entry_point_id)
      .single();

    if (gatewayError || !gateway) {
      throw new Error('Entry point not found');
    }

    // Get admin user info if current user is admin
    let adminEmail: string | null = null;
    const { data: userData } = await ghostPassSupabase
      .from('users' as any)
      .select('role, email')
      .eq('id', user.id)
      .single();

    if (userData && (userData as any).role === 'ADMIN') {
      adminEmail = (userData as any).email;
    }

    // Insert audit log
    const auditLog = {
      action_type: auditData.action_type,
      entry_point_id: auditData.entry_point_id,
      entry_point_type: (gateway as any).type,
      entry_point_name: (gateway as any).name,
      employee_name: (gateway as any).employee_name,
      employee_id: (gateway as any).employee_id,
      admin_user_id: adminEmail ? user.id : null,
      admin_email: adminEmail,
      source_location: auditData.source_location,
      old_values: auditData.old_values || null,
      new_values: auditData.new_values || null,
      metadata: auditData.metadata || {}
    };

    const { data: result, error: insertError } = await ghostPassSupabase
      .from('entry_point_audit_logs' as any)
      .insert(auditLog)
      .select()
      .single();

    if (insertError) throw insertError;

    return {
      status: 'success',
      audit_id: (result as any).id,
      message: 'Audit log created successfully'
    };
  } catch (error) {
    console.error('Error logging entry point action:', error);
    throw error;
  }
};

/**
 * Get entry point audit logs with filtering
 * GET /audit/entry-point
 */
export const getEntryPointAuditLogs = async (
  filters?: EntryPointAuditFilter
): Promise<EntryPointAuditLog[]> => {
  try {
    // Call the database function to get filtered audit logs
    const { data, error } = await ghostPassSupabase.rpc('get_entry_point_audit_logs' as any, {
      p_entry_point_id: filters?.entry_point_id || null,
      p_employee_name: filters?.employee_name || null,
      p_action_type: filters?.action_type || null,
      p_start_date: filters?.start_date || null,
      p_end_date: filters?.end_date || null,
      p_source_location: filters?.source_location || null,
      p_limit: filters?.limit || 100,
      p_offset: filters?.offset || 0
    });

    if (error) throw error;
    return (data || []) as EntryPointAuditLog[];
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

/**
 * Get audit trail summary statistics
 * GET /audit/entry-point/summary
 */
export const getAuditSummary = async (days: number = 30): Promise<AuditSummaryStats> => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();

    // Call the database function to get summary stats
    const { data, error } = await ghostPassSupabase.rpc('get_audit_summary_stats' as any, {
      p_start_date: startDate.toISOString(),
      p_end_date: endDate.toISOString()
    });

    if (error) throw error;

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return {
        period_days: days,
        total_actions: 0,
        total_scans: 0,
        total_edits: 0,
        total_creates: 0,
        total_deactivates: 0,
        unique_entry_points: 0,
        unique_employees: 0,
        most_active_entry_point: 'None',
        most_active_employee: 'None'
      };
    }

    const stats = Array.isArray(data) ? data[0] : data;
    return {
      ...stats,
      period_days: days
    } as AuditSummaryStats;
  } catch (error) {
    console.error('Error fetching audit summary:', error);
    throw error;
  }
};

/**
 * Get complete history for a specific entry point
 * GET /audit/entry-point/{entry_point_id}/history
 */
export const getEntryPointHistory = async (
  entryPointId: string,
  limit: number = 50
): Promise<EntryPointAuditLog[]> => {
  try {
    // Verify entry point exists
    const { data: gateway, error: gatewayError } = await ghostPassSupabase
      .from('gateway_points' as any)
      .select('id')
      .eq('id', entryPointId)
      .single();

    if (gatewayError || !gateway) {
      throw new Error('Entry point not found');
    }

    // Get audit history
    const { data, error } = await ghostPassSupabase.rpc('get_entry_point_audit_logs' as any, {
      p_entry_point_id: entryPointId,
      p_employee_name: null,
      p_action_type: null,
      p_start_date: null,
      p_end_date: null,
      p_source_location: null,
      p_limit: limit,
      p_offset: 0
    });

    if (error) throw error;
    return (data || []) as EntryPointAuditLog[];
  } catch (error) {
    console.error('Error fetching entry point history:', error);
    throw error;
  }
};

/**
 * Get activity history for a specific employee
 * GET /audit/entry-point/employee/{employee_name}/activity
 */
export const getEmployeeActivity = async (
  employeeName: string,
  days: number = 7,
  limit: number = 100
): Promise<EntryPointAuditLog[]> => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get employee activity
    const { data, error } = await ghostPassSupabase.rpc('get_entry_point_audit_logs' as any, {
      p_entry_point_id: null,
      p_employee_name: employeeName,
      p_action_type: null,
      p_start_date: startDate.toISOString(),
      p_end_date: null,
      p_source_location: null,
      p_limit: limit,
      p_offset: 0
    });

    if (error) throw error;
    return (data || []) as EntryPointAuditLog[];
  } catch (error) {
    console.error('Error fetching employee activity:', error);
    throw error;
  }
};

/**
 * Get recent scan activity across all entry points
 * GET /audit/entry-point/recent-scans
 */
export const getRecentScans = async (
  hours: number = 24,
  limit: number = 50
): Promise<RecentScansResponse> => {
  try {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);

    // Get recent scans
    const { data, error } = await ghostPassSupabase.rpc('get_entry_point_audit_logs' as any, {
      p_entry_point_id: null,
      p_employee_name: null,
      p_action_type: 'SCAN',
      p_start_date: startDate.toISOString(),
      p_end_date: null,
      p_source_location: null,
      p_limit: limit,
      p_offset: 0
    });

    if (error) throw error;

    const logs = (data || []) as EntryPointAuditLog[];

    // Format for display
    const scans = logs.map((log: EntryPointAuditLog) => ({
      id: log.id,
      entry_point_name: log.entry_point_name,
      entry_point_type: log.entry_point_type,
      employee_name: log.employee_name,
      created_at: log.created_at,
      metadata: log.metadata
    }));

    return {
      period_hours: hours,
      total_scans: scans.length,
      scans
    };
  } catch (error) {
    console.error('Error fetching recent scans:', error);
    throw error;
  }
};

/**
 * Clean up old audit logs (admin only)
 * DELETE /audit/entry-point/cleanup
 */
export const cleanupOldAuditLogs = async (
  daysToKeep: number = 90
): Promise<{ status: string; message: string; cutoff_date: string }> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    // Delete old logs
    const { error } = await ghostPassSupabase
      .from('entry_point_audit_logs' as any)
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    if (error) throw error;

    // Note: Admin action logging would be done here if we had the admin action logging function

    return {
      status: 'success',
      message: `Cleaned up audit logs older than ${daysToKeep} days`,
      cutoff_date: cutoffDate.toISOString()
    };
  } catch (error) {
    console.error('Error cleaning up audit logs:', error);
    throw error;
  }
};

// Export all functions as auditApi object for consistency with frontend
export const auditApi = {
  logEntryPointAction,
  getEntryPointAuditLogs,
  getAuditSummary,
  getEntryPointHistory,
  getEmployeeActivity,
  getRecentScans,
  cleanupOldAuditLogs
};
