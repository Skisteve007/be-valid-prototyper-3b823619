-- Venues Table
CREATE TABLE IF NOT EXISTS venues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    venue_type TEXT NOT NULL CHECK (venue_type IN ('club', 'festival', 'arena', 'stadium', 'theater', 'conference', 'bar', 'restaurant', 'other')),
    capacity INTEGER,
    gateway_count INTEGER NOT NULL DEFAULT 1,
    default_service_fee DECIMAL(5,2) NOT NULL DEFAULT 5.00,
    default_entry_fee INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update events table to add new fields
ALTER TABLE events ADD COLUMN IF NOT EXISTS requires_pass BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'mode_a' CHECK (mode IN ('mode_a', 'mode_b'));
ALTER TABLE events ADD COLUMN IF NOT EXISTS ticket_pricing_enabled BOOLEAN DEFAULT true;
ALTER TABLE events ADD COLUMN IF NOT EXISTS pass_pricing_1day INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS pass_pricing_3day INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS pass_pricing_7day INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS pass_pricing_custom INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS pass_pricing_custom_days INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS reentry_allowed BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS reentry_fee_venue INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS reentry_fee_valid INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS entry_fee INTEGER;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_venues_type ON venues(venue_type);
CREATE INDEX IF NOT EXISTS idx_venues_name ON venues(name);

-- Comments
COMMENT ON TABLE venues IS 'Venue configurations and default settings';
COMMENT ON COLUMN venues.venue_type IS 'Type of venue: club, festival, arena, stadium, theater, conference, bar, restaurant, other';
COMMENT ON COLUMN venues.gateway_count IS 'Number of entry points/scanning stations';
COMMENT ON COLUMN venues.default_service_fee IS 'Default VALID service fee percentage';
COMMENT ON COLUMN venues.default_entry_fee IS 'Default entry fee in cents (stored as cents, displayed as dollars)';

COMMENT ON COLUMN events.requires_pass IS 'Whether event requires a Ghost Pass';
COMMENT ON COLUMN events.mode IS 'Access mode: mode_a (single entry) or mode_b (duration based)';
COMMENT ON COLUMN events.ticket_pricing_enabled IS 'Whether ticket purchases are enabled';
COMMENT ON COLUMN events.pass_pricing_1day IS 'Price for 1-day pass in cents (stored as cents, displayed as dollars)';
COMMENT ON COLUMN events.pass_pricing_3day IS 'Price for 3-day pass in cents (stored as cents, displayed as dollars)';
COMMENT ON COLUMN events.pass_pricing_7day IS 'Price for 7-day pass in cents (stored as cents, displayed as dollars)';
COMMENT ON COLUMN events.pass_pricing_custom IS 'Price for custom duration pass in cents (stored as cents, displayed as dollars)';
COMMENT ON COLUMN events.pass_pricing_custom_days IS 'Number of days for custom pass';
COMMENT ON COLUMN events.reentry_allowed IS 'Whether re-entry is permitted';
COMMENT ON COLUMN events.reentry_fee_venue IS 'Venue re-entry fee in cents (stored as cents, displayed as dollars)';
COMMENT ON COLUMN events.reentry_fee_valid IS 'VALID re-entry service fee in cents (stored as cents, displayed as dollars)';
COMMENT ON COLUMN events.entry_fee IS 'Base entry fee in cents (stored as cents, displayed as dollars)';

-- Sample venues
INSERT INTO venues (id, name, address, venue_type, capacity, gateway_count, default_service_fee, default_entry_fee)
VALUES 
    ('venue_001', 'Central Park', '123 Park Ave, New York, NY 10001', 'festival', 50000, 5, 5.00, 2500),
    ('venue_002', 'Convention Center', '456 Convention Blvd, Las Vegas, NV 89109', 'conference', 10000, 3, 7.50, 5000),
    ('venue_003', 'Comedy Club', '789 Laugh Lane, Los Angeles, CA 90001', 'club', 300, 1, 10.00, 1500)
ON CONFLICT (id) DO NOTHING;
