-- Add new status values to order_status enum for Privacy Firewall
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'result_received_locked';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'verified_active';