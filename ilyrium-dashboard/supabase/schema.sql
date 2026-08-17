-- Ilyrium Database Schema
-- PostgreSQL (Supabase)

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. PLANS TABLE
-- Defines subscription tiers and their limits
-- ============================================
CREATE TABLE IF NOT EXISTS plans (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL UNIQUE,
    slug        TEXT NOT NULL UNIQUE,
    price_sol   DECIMAL(10, 4) NOT NULL DEFAULT 0,
    rps_limit   INT NOT NULL DEFAULT 10,
    daily_limit BIGINT NOT NULL DEFAULT 100000,
    features    JSONB DEFAULT '[]'::JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default plans idempotently
INSERT INTO plans (name, slug, price_sol, rps_limit, daily_limit, features) VALUES
    ('Developer', 'developer', 0, 10, 100000, '["100,000 Requests / day", "Standard Support", "Shared Nodes", "Community Discord"]'),
    ('Pro Tier',  'pro',       2.5, 100, -1,   '["Unlimited Requests", "Priority 24/7 Support", "Dedicated Nodes", "Custom Rate Limits"]')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 2. USERS TABLE
-- Wallet-based authentication (Solana Wallet Address)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT NOT NULL UNIQUE,
    plan_id        UUID REFERENCES plans(id),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);

-- ============================================
-- 3. API KEYS TABLE
-- Each user can have multiple secret API keys
-- ============================================
CREATE TABLE IF NOT EXISTS api_keys (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       TEXT NOT NULL DEFAULT 'Untitled Key',
    key_value  TEXT NOT NULL UNIQUE,
    status     TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_value ON api_keys(key_value);

-- ============================================
-- 4. USAGE LOGS TABLE
-- Flushed from the Go engine via Redis
-- ============================================
CREATE TABLE IF NOT EXISTS usage_logs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id    UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    request_count BIGINT NOT NULL DEFAULT 0,
    error_count   BIGINT NOT NULL DEFAULT 0,
    avg_latency   DECIMAL(8, 2) DEFAULT 0,
    period_start  TIMESTAMPTZ NOT NULL,
    period_end    TIMESTAMPTZ NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usage_logs_key ON usage_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_period ON usage_logs(period_start, period_end);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- Grant access to server-side Next.js API handler
-- ============================================
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Allow anon / authenticated API requests full access for application logic
DROP POLICY IF EXISTS "Allow public read access on plans" ON plans;
CREATE POLICY "Allow public read access on plans" ON plans FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon full access on users" ON users;
CREATE POLICY "Allow anon full access on users" ON users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon full access on api_keys" ON api_keys;
CREATE POLICY "Allow anon full access on api_keys" ON api_keys FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon full access on usage_logs" ON usage_logs;
CREATE POLICY "Allow anon full access on usage_logs" ON usage_logs FOR ALL USING (true) WITH CHECK (true);
