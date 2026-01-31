-- Add new columns for payout destination and ID verification tier
ALTER TABLE public.ghost_pass_event_intakes
ADD COLUMN IF NOT EXISTS payout_destination JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS id_verification_tier TEXT DEFAULT 'tier_1';

-- Add comment for clarity
COMMENT ON COLUMN public.ghost_pass_event_intakes.payout_destination IS 'Where to send payments when no Stripe Connect exists (e.g., Venmo, PayPal, Cash App details)';
COMMENT ON COLUMN public.ghost_pass_event_intakes.id_verification_tier IS 'tier_1 = Basic ID verification, tier_2 = ID + background check (terrorist list, most wanted, sexual predator list)';