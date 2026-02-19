// Entry Point Audit Trail Types
export type EntryPointActionType = 'SCAN' | 'CREATE' | 'EDIT' | 'DEACTIVATE' | 'ACTIVATE' | 'DELETE';
export type GatewayType = 'ENTRY_POINT' | 'INTERNAL_AREA' | 'TABLE_SEAT';

export interface EntryPointAuditLog {
  id: string;
  action_type: EntryPointActionType;
  entry_point_id: string;
  entry_point_type: GatewayType;
  entry_point_name: string;
  employee_name: string;
  employee_id: string;
  admin_user_id?: string;
  admin_email?: string;
  scanner_token?: string;
  source_location: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface EntryPointAuditCreate {
  action_type: EntryPointActionType;
  entry_point_id: string;
  source_location: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface EntryPointAuditFilter {
  entry_point_id?: string;
  employee_name?: string;
  action_type?: EntryPointActionType;
  start_date?: string;
  end_date?: string;
  source_location?: string;
  limit?: number;
  offset?: number;
}

export interface AuditSummaryStats {
  period_days: number;
  total_actions: number;
  total_scans: number;
  total_edits: number;
  total_creates: number;
  total_deactivates: number;
  unique_entry_points: number;
  unique_employees: number;
  most_active_entry_point: string;
  most_active_employee: string;
}

export interface RecentScansResponse {
  period_hours: number;
  total_scans: number;
  scans: Array<{
    id: string;
    entry_point_name: string;
    entry_point_type: GatewayType;
    employee_name: string;
    created_at: string;
    metadata?: Record<string, any>;
  }>;
}
