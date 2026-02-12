import { ghostPassSupabase } from './ghostPassSupabase';

export interface Signal {
  signal_id: string;
  payload_type: 'scu' | 'capsule';
  sensory_type?: string;
  sensory_types?: string[];
  source_id: string;
  timestamp: string;
  received_at: string;
  status: string;
  ghost_pass_approved: boolean;
  signal_data?: any;
  metadata?: any;
  validation_result?: any;
  capsule_id?: string;
  scu_count?: number;
  scus?: any[];
}

export interface SensoryStats {
  total_signals: number;
  by_type: Record<string, number>;
  by_status: Record<string, number>;
  recent_activity?: Signal[];
}

export interface SenateStats {
  pending_count: number;
  by_priority: {
    high: number;
    medium: number;
    normal: number;
  };
  by_decision: {
    approved: number;
    rejected: number;
    escalated: number;
    request_more_data: number;
  };
  total_decisions: number;
}

export interface SenateDecision {
  decision_id: string;
  evaluation_id: string;
  signal_id: string;
  decision: string;
  reason: string;
  reviewer_id: string;
  trust_score: number;
  timestamp: string;
  metadata?: any;
}

export const sensoryMonitorApi = {
  // GET /sensory-monitor/signals
  // Backend returns: { signals, total, limit, offset, has_more }
  getSignals: async (limit: number = 50, offset: number = 0): Promise<{
    signals: Signal[];
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  }> => {
    try {
      const { data, error } = await ghostPassSupabase
        .from('sensory_signals')
        .select('*')
        .order('received_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('[sensoryMonitorApi] Error fetching signals:', error);
        return { signals: [], total: 0, limit, offset, has_more: false };
      }

      const signals = data || [];
      
      return {
        signals,
        total: signals.length, // Backend returns len(signals), not total count
        limit,
        offset,
        has_more: signals.length === limit
      };
    } catch (error) {
      console.error('[sensoryMonitorApi] Error in getSignals:', error);
      return { signals: [], total: 0, limit, offset, has_more: false };
    }
  },

  // GET /sensory-monitor/signals/{signal_id}
  // Backend returns: signal object or 404
  getSignalById: async (signalId: string): Promise<Signal | null> => {
    try {
      const { data, error } = await ghostPassSupabase
        .from('sensory_signals')
        .select('*')
        .eq('signal_id', signalId)
        .single();

      if (error) {
        console.error('[sensoryMonitorApi] Error fetching signal:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('[sensoryMonitorApi] Error in getSignalById:', error);
      return null;
    }
  },

  // GET /sensory-monitor/stats
  // Backend returns: { total_signals, by_type, by_status, recent_activity }
  // by_status uses the 'status' field (approved/rejected/unknown), NOT ghost_pass_approved
  getStats: async (): Promise<SensoryStats> => {
    try {
      // Get total count
      const { count: total, error: countError } = await ghostPassSupabase
        .from('sensory_signals')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('[sensoryMonitorApi] Error fetching count:', countError);
      }

      // Get all signals for statistics (sensory_type and status fields)
      const { data: allSignals, error } = await ghostPassSupabase
        .from('sensory_signals')
        .select('sensory_type, status');

      if (error) {
        console.error('[sensoryMonitorApi] Error fetching stats:', error);
        return {
          total_signals: 0,
          by_type: {},
          by_status: {}
        };
      }

      // Calculate by_type and by_status statistics (exactly like backend)
      const by_type: Record<string, number> = {};
      const by_status: Record<string, number> = {};

      allSignals?.forEach(signal => {
        // Count by sensory type
        const type = signal.sensory_type || 'UNKNOWN';
        if (type) {
          by_type[type] = (by_type[type] || 0) + 1;
        }

        // Count by status (approved/rejected/unknown)
        const status = signal.status || 'UNKNOWN';
        by_status[status] = (by_status[status] || 0) + 1;
      });

      // Get recent activity (last 10 signals)
      const { data: recentSignals } = await ghostPassSupabase
        .from('sensory_signals')
        .select('*')
        .order('received_at', { ascending: false })
        .limit(10);

      return {
        total_signals: total || 0,
        by_type,
        by_status,
        recent_activity: recentSignals || []
      };
    } catch (error) {
      console.error('[sensoryMonitorApi] Error in getStats:', error);
      return {
        total_signals: 0,
        by_type: {},
        by_status: {}
      };
    }
  },

  // GET /senate/stats
  // Backend uses SenateEvaluationStore.get_stats() which tries views first, then manual counting
  // Returns: { pending_count, by_priority: {high, medium, normal}, by_decision: {approved, rejected, escalated, request_more_data}, total_decisions }
  getSenateStats: async (): Promise<SenateStats> => {
    try {
      // Try to use the views first (matches backend exactly)
      const { data: senateStats, error: senateError } = await ghostPassSupabase
        .from('v_senate_statistics')
        .select('*')
        .maybeSingle();

      const { data: decisionStats, error: decisionError } = await ghostPassSupabase
        .from('v_decision_statistics')
        .select('*')
        .maybeSingle();

      // If views work, use them (preferred method - matches backend)
      if (!senateError && !decisionError && senateStats && decisionStats) {
        return {
          pending_count: senateStats.pending_count || 0,
          by_priority: {
            high: senateStats.high_priority_count || 0,
            medium: senateStats.medium_priority_count || 0,
            normal: senateStats.normal_priority_count || 0
          },
          by_decision: {
            approved: decisionStats.approved_count || 0,
            rejected: decisionStats.rejected_count || 0,
            escalated: decisionStats.escalated_count || 0,
            request_more_data: decisionStats.request_more_data_count || 0
          },
          total_decisions: decisionStats.total_decisions || 0
        };
      }

      // Fallback to manual counting (matches backend in-memory fallback)
      console.warn('[sensoryMonitorApi] Views not available, using manual counting');
      
      // Get all pending evaluations
      const { data: pendingEvals, error: pendingError } = await ghostPassSupabase
        .from('senate_evaluations')
        .select('priority, status');

      // Get all decisions
      const { data: allDecisions, error: decisionsError } = await ghostPassSupabase
        .from('senate_decisions')
        .select('decision');

      if (pendingError || decisionsError) {
        console.error('[sensoryMonitorApi] Error fetching Senate stats:', pendingError || decisionsError);
      }

      // Count pending by priority
      const pending = pendingEvals?.filter(e => e.status === 'pending') || [];
      const by_priority = {
        high: pending.filter(e => e.priority === 'high').length,
        medium: pending.filter(e => e.priority === 'medium').length,
        normal: pending.filter(e => e.priority === 'normal').length
      };

      // Count decisions by type
      const by_decision = {
        approved: allDecisions?.filter(d => d.decision === 'approved').length || 0,
        rejected: allDecisions?.filter(d => d.decision === 'rejected').length || 0,
        escalated: allDecisions?.filter(d => d.decision === 'escalated').length || 0,
        request_more_data: allDecisions?.filter(d => d.decision === 'request_more_data').length || 0
      };

      return {
        pending_count: pending.length,
        by_priority,
        by_decision,
        total_decisions: allDecisions?.length || 0
      };
    } catch (error) {
      console.error('[sensoryMonitorApi] Error in getSenateStats:', error);
      return {
        pending_count: 0,
        by_priority: { high: 0, medium: 0, normal: 0 },
        by_decision: { approved: 0, rejected: 0, escalated: 0, request_more_data: 0 },
        total_decisions: 0
      };
    }
  },

  // GET /senate/history
  // Backend returns: { decisions, total, by_decision }
  getSenateHistory: async (limit: number = 50, decision_filter?: string): Promise<{
    decisions: SenateDecision[];
    total: number;
    by_decision: {
      approved: number;
      rejected: number;
      escalated: number;
      request_more_data: number;
    };
  }> => {
    try {
      let query = ghostPassSupabase
        .from('senate_decisions')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      // Apply decision filter if provided
      if (decision_filter) {
        query = query.eq('decision', decision_filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[sensoryMonitorApi] Error fetching Senate history:', error);
        return {
          decisions: [],
          total: 0,
          by_decision: { approved: 0, rejected: 0, escalated: 0, request_more_data: 0 }
        };
      }

      const decisions = data || [];

      // Count by decision type (exactly like backend)
      const by_decision = {
        approved: decisions.filter(d => d.decision === 'approved').length,
        rejected: decisions.filter(d => d.decision === 'rejected').length,
        escalated: decisions.filter(d => d.decision === 'escalated').length,
        request_more_data: decisions.filter(d => d.decision === 'request_more_data').length
      };

      return {
        decisions,
        total: decisions.length,
        by_decision
      };
    } catch (error) {
      console.error('[sensoryMonitorApi] Error in getSenateHistory:', error);
      return {
        decisions: [],
        total: 0,
        by_decision: { approved: 0, rejected: 0, escalated: 0, request_more_data: 0 }
      };
    }
  },

  // POST /sensory-monitor/audit
  // Backend creates: { audit_id, signal_id, sensory_type, timestamp, outcome, metadata, created_at }
  // Then calls SensorySignalStore.add_audit_entry() which inserts into 'signal_audit_log' table
  // BUT the actual table in supabase.sql is 'sensory_audit_trail' with different schema
  // We need to map backend format to actual database schema
  logAuditEntry: async (entry: {
    signal_id: string;
    sensory_type: string;
    timestamp: string;
    outcome: string;
    metadata?: any;
  }): Promise<{ status: string; audit_id?: string; message: string }> => {
    try {
      // Backend creates audit_id like this
      const audit_id = `audit_${Date.now()}`;
      
      // Map to sensory_audit_trail schema
      // Table fields: audit_id (serial), event_type, signal_id, evaluation_id, decision_id, actor, action, details, timestamp
      const auditEntry = {
        // audit_id is auto-generated (serial primary key) - don't include it
        event_type: 'signal_viewed', // Event type for audit trail
        signal_id: entry.signal_id,
        actor: 'admin_user',
        action: entry.outcome,
        details: {
          sensory_type: entry.sensory_type,
          metadata: entry.metadata || {},
          created_at: new Date().toISOString()
        },
        timestamp: entry.timestamp
      };

      const { error } = await ghostPassSupabase
        .from('sensory_audit_trail')
        .insert(auditEntry);

      if (error) {
        console.error('[sensoryMonitorApi] Error logging audit entry:', error);
        return {
          status: 'error',
          message: `Failed to log audit entry: ${error.message}`
        };
      }

      return {
        status: 'success',
        audit_id,
        message: 'Audit entry logged'
      };
    } catch (error) {
      console.error('[sensoryMonitorApi] Error in logAuditEntry:', error);
      return {
        status: 'error',
        message: 'Failed to log audit entry'
      };
    }
  },

  // GET /sensory-monitor/audit/{signal_id}
  // Backend returns: { signal_id, audit_entries, total_entries }
  getAuditEntries: async (signalId: string): Promise<{
    signal_id: string;
    audit_entries: any[];
    total_entries: number;
  }> => {
    try {
      const { data, error } = await ghostPassSupabase
        .from('sensory_audit_trail')
        .select('*')
        .eq('signal_id', signalId)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('[sensoryMonitorApi] Error fetching audit entries:', error);
        return {
          signal_id: signalId,
          audit_entries: [],
          total_entries: 0
        };
      }

      const entries = data || [];

      return {
        signal_id: signalId,
        audit_entries: entries,
        total_entries: entries.length
      };
    } catch (error) {
      console.error('[sensoryMonitorApi] Error in getAuditEntries:', error);
      return {
        signal_id: signalId,
        audit_entries: [],
        total_entries: 0
      };
    }
  }
};

// Environment API - matches backend environment configuration
export const environmentApi = {
  // Get environment mode - checks system_configs table
  getMode: async (): Promise<{
    environment_mode: 'sandbox' | 'production';
    is_sandbox: boolean;
    is_production: boolean;
  }> => {
    try {
      const { data, error } = await ghostPassSupabase
        .from('system_configs')
        .select('config_value')
        .eq('config_key', 'environment_mode')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('[environmentApi] Error fetching environment mode:', error);
      }

      // Extract mode from config_value (could be nested or direct)
      let mode = 'sandbox';
      if (data?.config_value) {
        if (typeof data.config_value === 'string') {
          mode = data.config_value;
        } else if (data.config_value.mode) {
          mode = data.config_value.mode;
        } else if (data.config_value.environment_mode) {
          mode = data.config_value.environment_mode;
        }
      }

      return {
        environment_mode: mode as 'sandbox' | 'production',
        is_sandbox: mode === 'sandbox',
        is_production: mode === 'production'
      };
    } catch (error) {
      console.error('[environmentApi] Error in getMode:', error);
      // Default to sandbox for safety
      return {
        environment_mode: 'sandbox',
        is_sandbox: true,
        is_production: false
      };
    }
  },

  // Get sensory channel statuses - checks system_configs for channel configuration
  getSensoryChannels: async (): Promise<{
    sensory_channels: Record<string, any>;
  }> => {
    try {
      const { data, error } = await ghostPassSupabase
        .from('system_configs')
        .select('config_value')
        .eq('config_key', 'sensory_channels')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('[environmentApi] Error fetching sensory channels:', error);
      }

      // Default channel configuration (all available in sandbox mode)
      const defaultChannels = {
        VISION: { available: true, authority_required: false, locked: false, authority_bypassed: true, environment_mode: 'sandbox' },
        HEARING: { available: true, authority_required: false, locked: false, authority_bypassed: true, environment_mode: 'sandbox' },
        TOUCH: { available: true, authority_required: false, locked: false, authority_bypassed: true, environment_mode: 'sandbox' },
        BALANCE: { available: true, authority_required: false, locked: false, authority_bypassed: true, environment_mode: 'sandbox' },
        SMELL: { available: true, authority_required: false, locked: false, authority_bypassed: true, environment_mode: 'sandbox' },
        TASTE: { available: true, authority_required: false, locked: false, authority_bypassed: true, environment_mode: 'sandbox' }
      };

      // Use stored config if available, otherwise use defaults
      const channels = data?.config_value || defaultChannels;

      return { sensory_channels: channels };
    } catch (error) {
      console.error('[environmentApi] Error in getSensoryChannels:', error);
      // Return default channels on error
      return {
        sensory_channels: {
          VISION: { available: true, authority_required: false, locked: false, authority_bypassed: true, environment_mode: 'sandbox' },
          HEARING: { available: true, authority_required: false, locked: false, authority_bypassed: true, environment_mode: 'sandbox' },
          TOUCH: { available: true, authority_required: false, locked: false, authority_bypassed: true, environment_mode: 'sandbox' },
          BALANCE: { available: true, authority_required: false, locked: false, authority_bypassed: true, environment_mode: 'sandbox' },
          SMELL: { available: true, authority_required: false, locked: false, authority_bypassed: true, environment_mode: 'sandbox' },
          TASTE: { available: true, authority_required: false, locked: false, authority_bypassed: true, environment_mode: 'sandbox' }
        }
      };
    }
  }
};
