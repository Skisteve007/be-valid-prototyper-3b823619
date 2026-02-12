-- User Roles Table for Ghost Pass
-- Manages authorization for venue operators and administrators

CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'administrator', 'venue_operator', 'staff', 'user')),
    venue_id TEXT,
    granted_by UUID,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role, venue_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_venue ON user_roles(venue_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_expires ON user_roles(expires_at);

-- Comments
COMMENT ON TABLE user_roles IS 'User role assignments for authorization';
COMMENT ON COLUMN user_roles.user_id IS 'UUID of the user from auth.users';
COMMENT ON COLUMN user_roles.role IS 'Role type: owner, administrator, venue_operator, staff, user';
COMMENT ON COLUMN user_roles.venue_id IS 'Optional venue association for venue-specific roles';
COMMENT ON COLUMN user_roles.granted_by IS 'User ID who granted this role';
COMMENT ON COLUMN user_roles.expires_at IS 'Optional expiration date for temporary roles';

-- Sample roles for testing (replace with actual user IDs)
-- INSERT INTO user_roles (user_id, role, venue_id)
-- VALUES 
--     ('00000000-0000-0000-0000-000000000000', 'owner', NULL),
--     ('00000000-0000-0000-0000-000000000001', 'administrator', NULL),
--     ('00000000-0000-0000-0000-000000000002', 'venue_operator', 'venue_001')
-- ON CONFLICT (user_id, role, venue_id) DO NOTHING;
