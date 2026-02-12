-- QR Codes Table for Event Access
-- This table stores generated QR codes for different access types

CREATE TABLE IF NOT EXISTS qr_codes (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('entry', 'vip', 'staff', 'vendor')),
    code TEXT UNIQUE NOT NULL,
    scan_count INTEGER DEFAULT 0,
    last_scanned_at TIMESTAMPTZ,
    last_scanned_by TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_event ON qr_codes(event_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_type ON qr_codes(type);
CREATE INDEX IF NOT EXISTS idx_qr_codes_code ON qr_codes(code);

-- QR Code Scan Log
CREATE TABLE IF NOT EXISTS qr_code_scans (
    id SERIAL PRIMARY KEY,
    qr_code_id TEXT NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    gateway_id TEXT,
    scanned_by TEXT,
    scan_result TEXT NOT NULL CHECK (scan_result IN ('success', 'denied', 'duplicate', 'expired')),
    metadata JSONB DEFAULT '{}',
    scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for scan log
CREATE INDEX IF NOT EXISTS idx_qr_scans_qr_code ON qr_code_scans(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_event ON qr_code_scans(event_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_gateway ON qr_code_scans(gateway_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_time ON qr_code_scans(scanned_at);

-- Comments
COMMENT ON TABLE qr_codes IS 'QR codes generated for event access control';
COMMENT ON TABLE qr_code_scans IS 'Log of all QR code scan attempts';

COMMENT ON COLUMN qr_codes.type IS 'Type of access: entry (general), vip, staff, or vendor';
COMMENT ON COLUMN qr_codes.code IS 'Unique code embedded in QR code';
COMMENT ON COLUMN qr_codes.scan_count IS 'Total number of successful scans';
COMMENT ON COLUMN qr_code_scans.scan_result IS 'Result of scan attempt';
