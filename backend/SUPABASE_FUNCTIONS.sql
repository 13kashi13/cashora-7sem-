-- ============================================================
-- CashoraAI – Required Supabase / PostgreSQL helper functions
-- Run these in the Supabase SQL Editor (or via psql) once.
-- ============================================================

-- 1. login() — called by POST /auth/login
--    Verifies a user's password using pgcrypto crypt() and returns
--    the user row if credentials are valid.
--
--    Prerequisites: pgcrypto extension must be enabled.
--      CREATE EXTENSION IF NOT EXISTS pgcrypto;
--
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION login(p_email text, p_password text)
RETURNS TABLE(
  id        uuid,
  email     text,
  name      text,
  username  text,
  timezone  text,
  bio       text,
  role      text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id, email, name, username, timezone, bio, role
  FROM   users
  WHERE  email         = p_email
    AND  password_hash = crypt(p_password, password_hash);
$$;

-- Grant execute to the anon / authenticated roles used by supabase-js:
GRANT EXECUTE ON FUNCTION login(text, text) TO anon;
GRANT EXECUTE ON FUNCTION login(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION login(text, text) TO service_role;


-- ============================================================
-- 2. Required table schemas (create if they don't exist yet)
-- ============================================================

-- users table
CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text UNIQUE NOT NULL,
  password_hash text NOT NULL,          -- store with: crypt('plaintext', gen_salt('bf'))
  name          text,
  username      text,
  timezone      text DEFAULT 'Asia/Kolkata',
  bio           text,
  role          text DEFAULT 'user',    -- 'admin' | 'user'
  created_at    timestamptz DEFAULT now()
);

-- platform_tokens table (YouTube, Instagram, Threads, Bluesky tokens)
CREATE TABLE IF NOT EXISTS platform_tokens (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES users(id) ON DELETE CASCADE,
  platform      text NOT NULL,          -- 'youtube' | 'instagram' | 'threads' | 'bluesky'
  access_token  text,
  refresh_token text,
  token_type    text,
  expiry_date   text,                   -- stored as string (ms epoch) for Bluesky, ISO for others
  account_id    text,                   -- platform-specific account / channel / DID id
  username      text,                   -- human-readable handle on the platform
  app_id        text,
  app_secret    text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now(),
  UNIQUE (user_id, platform)
);

-- library_items table
CREATE TABLE IF NOT EXISTS library_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES users(id) ON DELETE CASCADE,
  title       text NOT NULL DEFAULT 'Untitled Video',
  date        text,
  status      text DEFAULT 'draft',
  platforms   jsonb DEFAULT '["YouTube","Instagram"]'::jsonb,
  type        text DEFAULT 'upload',
  file_path   text DEFAULT '',
  caption     text DEFAULT '',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- scheduled_posts table
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid REFERENCES users(id) ON DELETE CASCADE,
  title          text,
  caption        text,
  platforms      text,
  scheduled_time timestamptz NOT NULL,
  status         text DEFAULT 'scheduled', -- 'scheduled' | 'processing' | 'posted' | 'failed'
  video_path     text,
  filename       text,
  email          text,
  posted_at      timestamptz,
  error_message  text,
  created_at     timestamptz DEFAULT now()
);

-- posting_statuses table (n8n webhook results)
CREATE TABLE IF NOT EXISTS posting_statuses (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status     text,
  platforms  text,
  message    text,
  email      text,
  created_at timestamptz DEFAULT now()
);

-- automation_settings table
CREATE TABLE IF NOT EXISTS automation_settings (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  auto_publish boolean DEFAULT false,
  smart_thumb  boolean DEFAULT true,
  webhook      boolean DEFAULT true,
  aspect       text DEFAULT '9:16',
  tags         text DEFAULT '#cashora #ai #viral #contentcreator',
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);


-- ============================================================
-- 3. Seed demo users (run once — skip if already populated)
-- ============================================================

-- Insert demo accounts (password is bcrypt-hashed with pgcrypto):
INSERT INTO users (email, password_hash, name, username, timezone, bio, role)
VALUES
  ('demo@cashora.tech',    crypt('demo123',  gen_salt('bf')), 'Demo User',    '@cashora_user',    'Asia/Kolkata', 'Automating high-conversion video content with CashoraAI.', 'user'),
  ('admin@cashora.tech',   crypt('admin123', gen_salt('bf')), 'Admin User',   '@cashora_admin',   'Asia/Kolkata', 'CashoraAI Administrator.',                                 'admin'),
  ('test@example.com',     crypt('test123',  gen_salt('bf')), 'Test User',    '@test_user',       'Asia/Kolkata', 'Test account.',                                             'user'),
  ('vaibhav@cashora.tech', crypt('demo123',  gen_salt('bf')), 'Vaibhav Gawai','@vaibhav_cashora', 'Asia/Kolkata', 'Founder of CashoraAI.',                                    'admin')
ON CONFLICT (email) DO NOTHING;


-- ============================================================
-- 4. Row Level Security (optional but recommended)
-- ============================================================

-- Enable RLS on each table:
-- ALTER TABLE library_items      ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE scheduled_posts    ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE automation_settings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE platform_tokens    ENABLE ROW LEVEL SECURITY;

-- Example policy (users see only their own rows):
-- CREATE POLICY "own rows only" ON library_items
--   FOR ALL USING (user_id = auth.uid());

-- NOTE: Since index.js uses the SERVICE ROLE KEY (bypasses RLS),
-- RLS policies are optional but good practice for direct client access.

