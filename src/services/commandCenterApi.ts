import { ghostPassSupabase } from './ghostPassSupabase';

// Types matching backend responses
export interface SystemStats {
  total_users: number;
  total_wallets: number;
  total_balance_cents: number;
  active_passes: number;
  expired_passes: number;
  pending_payouts: number;
  total_transactions: number;
  total_scans: number;
  revenue_today_cents: number;
  revenue_week_cents: number;
  revenue_month_cents: number;
}

export interface PayoutRequestAdmin {
  id: string;
  vendor_user_id: string;
  vendor_email: string;
  amount_cents: number;
  status: string;
  requested_at: string;
  processed_at?: string;
  processed_by?: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  admin_user_id: string;
  admin_email: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_value?: any;
  new_value?: any;
  timestamp: string;
  metadata?: any;
}

export interface AdminDashboard {
  stats: SystemStats;
  recent_transactions: any[];
  pending_payouts: PayoutRequestAdmin[];
  recent_audit_logs: AuditLog[];
  current_fee_config: {
    valid_pct: number;
    vendor_pct: number;
    pool_pct: number;
    promoter_pct: number;
  };
  current_scan_fees: { [key: string]: number };
  current_pricing: { [key: string]: number };
  current_retention: { retention_days: number };
}

export interface FeeConfigUpdate {
  valid_pct: number;
  vendor_pct: number;
  pool_pct: number;
  promoter_pct: number;
  venue_id?: string;
}

export interface ScanFeeUpdate {
  venue_id: string;
  fee_cents: number;
}

export interface GhostPassPricingUpdate {
  one_day_cents: number;
  three_day_cents: number;
  five_day_cents: number;
  seven_day_cents: number;
  ten_day_cents: number;
  fourteen_day_cents: number;
  thirty_day_cents: number;
}

export interface RetentionOverride {
  retention_days: number;
  justification: string;
}

export interface PayoutAction {
  action: 'approve' | 'reject' | 'process';
  notes?: string;
}

export const commandCenterApi = {
  // GET /admin/dashboard
  getDashboard: async (): Promise<AdminDashboard> => {
    try {
      // Get system statistics
      const { count: usersCount } = await ghostPassSupabase
        .from('users')
        .select('id', { count: 'exact', head: true });

      const { count: walletsCount } = await ghostPassSupabase
        .from('wallets')
        .select('id', { count: 'exact', head: true });

      // Get total balance
      const { data: walletsData } = await ghostPassSupabase
        .from('wallets')
        .select('balance_cents');
      const totalBalance = walletsData?.reduce((sum, w) => sum + (w.balance_cents || 0), 0) || 0;

      // Get pass statistics
      const now = new Date().toISOString();
      const { count: activePasses } = await ghostPassSupabase
        .from('ghost_passes')
        .select('id', { count: 'exact', head: true })
        .gte('expires_at', now);

      const { count: expiredPasses } = await ghostPassSupabase
        .from('ghost_passes')
        .select('id', { count: 'exact', head: true })
        .lt('expires_at', now);

      // Get payout statistics
      const { count: pendingPayouts } = await ghostPassSupabase
        .from('payout_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'PENDING');

      // Get transaction count
      const { count: transactionsCount } = await ghostPassSupabase
        .from('transactions')
        .select('id', { count: 'exact', head: true });

      // Get total scans
      const { count: totalScans } = await ghostPassSupabase
        .from('entry_point_audit_logs')
        .select('id', { count: 'exact', head: true })
        .eq('action_type', 'SCAN');

      // Get revenue statistics
      const today = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const { data: revenueToday } = await ghostPassSupabase
        .from('transactions')
        .select('amount_cents')
        .eq('type', 'SPEND')
        .gte('timestamp', today);

      const { data: revenueWeek } = await ghostPassSupabase
        .from('transactions')
        .select('amount_cents')
        .eq('type', 'SPEND')
        .gte('timestamp', weekAgo);

      const { data: revenueMonth } = await ghostPassSupabase
        .from('transactions')
        .select('amount_cents')
        .eq('type', 'SPEND')
        .gte('timestamp', monthAgo);

      const revenueTodayCents = revenueToday?.reduce((sum, t) => sum + Math.abs(t.amount_cents), 0) || 0;
      const revenueWeekCents = revenueWeek?.reduce((sum, t) => sum + Math.abs(t.amount_cents), 0) || 0;
      const revenueMonthCents = revenueMonth?.reduce((sum, t) => sum + Math.abs(t.amount_cents), 0) || 0;

      // Get recent transactions
      const { data: recentTransactions } = await ghostPassSupabase
        .from('transactions')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      // Get pending payouts
      const { data: pendingPayoutsData } = await ghostPassSupabase
        .from('payout_requests')
        .select('id, vendor_user_id, amount_cents, status, requested_at, processed_at, processed_by, notes')
        .eq('status', 'PENDING')
        .order('requested_at', { ascending: false })
        .limit(10);

      const pendingPayoutsList: PayoutRequestAdmin[] = [];
      if (pendingPayoutsData) {
        for (const payout of pendingPayoutsData) {
          const { data: vendorData } = await ghostPassSupabase
            .from('users')
            .select('email')
            .eq('id', payout.vendor_user_id)
            .single();

          pendingPayoutsList.push({
            ...payout,
            vendor_email: vendorData?.email || 'Unknown'
          });
        }
      }

      // Get recent audit logs
      const { data: recentAuditData } = await ghostPassSupabase
        .from('audit_logs')
        .select('id, admin_user_id, action, resource_type, resource_id, old_value, new_value, timestamp, metadata')
        .order('timestamp', { ascending: false })
        .limit(10);

      const recentAuditLogs: AuditLog[] = [];
      if (recentAuditData) {
        for (const log of recentAuditData) {
          const { data: adminData } = await ghostPassSupabase
            .from('users')
            .select('email')
            .eq('id', log.admin_user_id)
            .single();

          recentAuditLogs.push({
            ...log,
            admin_email: adminData?.email || 'Unknown'
          });
        }
      }

      // Get current configurations - ensure defaults exist in database
      let currentFeeConfig;
      const { data: feeConfigData } = await ghostPassSupabase
        .from('fee_configs')
        .select('*')
        .eq('venue_id', 'default')
        .maybeSingle();

      if (!feeConfigData) {
        // Insert default fee config if it doesn't exist
        const defaultFeeConfig = {
          venue_id: 'default',
          valid_pct: 30.0,
          vendor_pct: 30.0,
          pool_pct: 30.0,
          promoter_pct: 10.0
        };
        await ghostPassSupabase.from('fee_configs').insert(defaultFeeConfig);
        currentFeeConfig = defaultFeeConfig;
      } else {
        currentFeeConfig = feeConfigData;
      }

      let currentScanFees;
      const { data: scanFeesData } = await ghostPassSupabase
        .from('system_configs')
        .select('config_value')
        .eq('config_key', 'scan_fees')
        .maybeSingle();

      if (!scanFeesData) {
        // Insert default scan fees if they don't exist
        const defaultScanFees = { default: 10 };
        await ghostPassSupabase.from('system_configs').insert({
          config_key: 'scan_fees',
          config_value: defaultScanFees
        });
        currentScanFees = defaultScanFees;
      } else {
        currentScanFees = scanFeesData.config_value;
      }

      let currentPricing;
      const { data: pricingData } = await ghostPassSupabase
        .from('system_configs')
        .select('config_value')
        .eq('config_key', 'ghostpass_pricing')
        .maybeSingle();

      if (!pricingData) {
        // Insert default pricing if it doesn't exist
        const defaultPricing = { "1": 1000, "3": 2000, "7": 5000 };
        await ghostPassSupabase.from('system_configs').insert({
          config_key: 'ghostpass_pricing',
          config_value: defaultPricing
        });
        currentPricing = defaultPricing;
      } else {
        currentPricing = pricingData.config_value;
      }

      let currentRetention;
      const { data: retentionData } = await ghostPassSupabase
        .from('system_configs')
        .select('config_value')
        .eq('config_key', 'data_retention')
        .maybeSingle();

      if (!retentionData) {
        // Insert default retention if it doesn't exist
        const defaultRetention = { retention_days: 60 };
        await ghostPassSupabase.from('system_configs').insert({
          config_key: 'data_retention',
          config_value: defaultRetention
        });
        currentRetention = defaultRetention;
      } else {
        currentRetention = retentionData.config_value;
      }

      return {
        stats: {
          total_users: usersCount || 0,
          total_wallets: walletsCount || 0,
          total_balance_cents: totalBalance,
          active_passes: activePasses || 0,
          expired_passes: expiredPasses || 0,
          pending_payouts: pendingPayouts || 0,
          total_transactions: transactionsCount || 0,
          total_scans: totalScans || 0,
          revenue_today_cents: revenueTodayCents,
          revenue_week_cents: revenueWeekCents,
          revenue_month_cents: revenueMonthCents
        },
        recent_transactions: recentTransactions || [],
        pending_payouts: pendingPayoutsList,
        recent_audit_logs: recentAuditLogs,
        current_fee_config: currentFeeConfig,
        current_scan_fees: currentScanFees,
        current_pricing: currentPricing,
        current_retention: currentRetention
      };
    } catch (error) {
      console.error('[commandCenterApi] Error in getDashboard:', error);
      throw error;
    }
  },

  // POST /admin/fees/config
  updateFeeConfig: async (config: FeeConfigUpdate): Promise<void> => {
    try {
      const venueId = config.venue_id || 'default';

      // Upsert with on_conflict to match backend behavior
      await ghostPassSupabase
        .from('fee_configs')
        .upsert({
          venue_id: venueId,
          valid_pct: config.valid_pct,
          vendor_pct: config.vendor_pct,
          pool_pct: config.pool_pct,
          promoter_pct: config.promoter_pct
        }, { onConflict: 'venue_id' });
    } catch (error) {
      console.error('[commandCenterApi] Error in updateFeeConfig:', error);
      throw error;
    }
  },

  // POST /admin/fees/scan
  updateScanFee: async (feeUpdate: ScanFeeUpdate): Promise<void> => {
    try {
      // Get current system config for scan fees
      const { data: currentConfig } = await ghostPassSupabase
        .from('system_configs')
        .select('config_value')
        .eq('config_key', 'scan_fees')
        .maybeSingle();

      const scanFees = currentConfig?.config_value || {};
      
      // Update scan fee for venue
      scanFees[feeUpdate.venue_id] = feeUpdate.fee_cents;

      // Save updated config with on_conflict
      await ghostPassSupabase
        .from('system_configs')
        .upsert({
          config_key: 'scan_fees',
          config_value: scanFees
        }, { onConflict: 'config_key' });
    } catch (error) {
      console.error('[commandCenterApi] Error in updateScanFee:', error);
      throw error;
    }
  },

  // POST /admin/pricing/ghostpass
  updateGhostPassPricing: async (pricing: GhostPassPricingUpdate): Promise<void> => {
    try {
      // New pricing configuration
      const newPricing = {
        "1": pricing.one_day_cents,
        "3": pricing.three_day_cents,
        "5": pricing.five_day_cents,
        "7": pricing.seven_day_cents,
        "10": pricing.ten_day_cents,
        "14": pricing.fourteen_day_cents,
        "30": pricing.thirty_day_cents
      };

      // Save updated pricing with on_conflict
      await ghostPassSupabase
        .from('system_configs')
        .upsert({
          config_key: 'ghostpass_pricing',
          config_value: newPricing
        }, { onConflict: 'config_key' });
    } catch (error) {
      console.error('[commandCenterApi] Error in updateGhostPassPricing:', error);
      throw error;
    }
  },

  // POST /admin/payouts/{payout_id}/action
  processPayoutAction: async (payoutId: string, action: PayoutAction): Promise<void> => {
    try {
      await ghostPassSupabase
        .from('payout_requests')
        .update({
          status: action.action.toUpperCase(),
          processed_at: new Date().toISOString(),
          notes: action.notes
        })
        .eq('id', payoutId);
    } catch (error) {
      console.error('[commandCenterApi] Error in processPayoutAction:', error);
      throw error;
    }
  },

  // POST /admin/payouts/process-all
  processAllPayouts: async (): Promise<void> => {
    try {
      await ghostPassSupabase
        .from('payout_requests')
        .update({
          status: 'APPROVED',
          processed_at: new Date().toISOString(),
          notes: 'Batch processed by admin'
        })
        .eq('status', 'PENDING');
    } catch (error) {
      console.error('[commandCenterApi] Error in processAllPayouts:', error);
      throw error;
    }
  },

  // POST /admin/retention/override
  overrideRetention: async (override: RetentionOverride): Promise<void> => {
    try {
      // New retention configuration
      const newRetention = {
        retention_days: override.retention_days,
        justification: override.justification,
        overridden_at: new Date().toISOString()
      };

      // Save updated retention config with on_conflict
      await ghostPassSupabase
        .from('system_configs')
        .upsert({
          config_key: 'data_retention',
          config_value: newRetention
        }, { onConflict: 'config_key' });
    } catch (error) {
      console.error('[commandCenterApi] Error in overrideRetention:', error);
      throw error;
    }
  }
};
