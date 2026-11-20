# 🚀 Quick Fix - Setup Supabase Database (2 minutes)

## The Problem
❌ Login function `public.login()` doesn't exist in Supabase  
❌ Demo user accounts haven't been created  
❌ Tables are empty

## The Solution

### Option 1: Automatic (Easiest) ⭐ 
**I'll set it up for you via API**

### Option 2: Manual (Fastest)
**Copy-paste SQL into Supabase dashboard**

---

## ⭐ OPTION 1: Automatic Setup

I can programmatically create everything using the Supabase Admin API. This requires:

1. Your **Supabase Service Role Key** (from Settings → API)
2. Running a setup script

Would you like me to do this?

---

## 📋 OPTION 2: Manual Setup (Copy-Paste)

### Step 1: Open Supabase Dashboard
https://app.supabase.com → Select **jeyqjgmypryfspvrfcmm** project

### Step 2: Go to SQL Editor
Click **SQL Editor** in left sidebar

### Step 3: Create New Query
Click **+ New Query** button

### Step 4: Copy This SQL
```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create login function
CREATE OR REPLACE FUNCTION login(p_email text, p_password text)
RETURNS TABLE(
  id uuid, email text, name text, username text, timezone text, bio text, role text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id, email, name, username, timezone, bio, role
  FROM users
  WHERE email = p_email AND password_hash = crypt(p_password, password_hash);
$$;

GRANT EXECUTE ON FUNCTION login(text, text) TO anon;
GRANT EXECUTE ON FUNCTION login(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION login(text, text) TO service_role;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text,
  username text,
  timezone text DEFAULT 'Asia/Kolkata',
  bio text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Create other tables
CREATE TABLE IF NOT EXISTS platform_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  platform text NOT NULL,
  access_token text,
  refresh_token text,
  token_type text,
  expiry_date text,
  account_id text,
  username text,
  app_id text,
  app_secret text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, platform)
);

CREATE TABLE IF NOT EXISTS library_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Video',
  date text,
  status text DEFAULT 'draft',
  platforms jsonb DEFAULT '["YouTube","Instagram"]'::jsonb,
  type text DEFAULT 'upload',
  file_path text DEFAULT '',
  caption text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scheduled_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text,
  caption text,
  platforms text,
  scheduled_time timestamptz NOT NULL,
  status text DEFAULT 'scheduled',
  video_path text,
  filename text,
  email text,
  posted_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posting_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text,
  platforms text,
  message text,
  email text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS automation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  auto_publish boolean DEFAULT false,
  smart_thumb boolean DEFAULT true,
  webhook boolean DEFAULT true,
  aspect text DEFAULT '9:16',
  tags text DEFAULT '#cashora #ai #viral #contentcreator',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed demo users
INSERT INTO users (email, password_hash, name, username, timezone, bio, role)
VALUES
  ('demo@cashora.tech', crypt('demo123', gen_salt('bf')), 'Demo User', '@cashora_user', 'Asia/Kolkata', 'Automating high-conversion video content with CashoraAI.', 'user'),
  ('admin@cashora.tech', crypt('admin123', gen_salt('bf')), 'Admin User', '@cashora_admin', 'Asia/Kolkata', 'CashoraAI Administrator.', 'admin'),
  ('test@example.com', crypt('test123', gen_salt('bf')), 'Test User', '@test_user', 'Asia/Kolkata', 'Test account.', 'user'),
  ('vaibhav@cashora.tech', crypt('demo123', gen_salt('bf')), 'Vaibhav Gawai', '@vaibhav_cashora', 'Asia/Kolkata', 'Founder of CashoraAI.', 'admin')
ON CONFLICT (email) DO NOTHING;
```

### Step 5: Run It
Click **Run** button (or Ctrl+Enter)

### Step 6: Wait for Green Checkmarks
You should see success messages like:
```
✓ CREATE EXTENSION
✓ CREATE FUNCTION login
✓ GRANT EXECUTE
✓ CREATE TABLE users
✓ CREATE TABLE platform_tokens
... etc
✓ INSERT 4 rows
```

### Step 7: Test Login
1. Refresh your browser at http://127.0.0.1:4000/login/
2. Login with:
   - **Email:** `demo@cashora.tech`
   - **Password:** `demo123`

---

## ✅ Demo Accounts Created

| Email | Password | Role |
|-------|----------|------|
| `demo@cashora.tech` | `demo123` | user |
| `admin@cashora.tech` | `admin123` | admin |
| `test@example.com` | `test123` | user |
| `vaibhav@cashora.tech` | `demo123` | admin |

---

## If You Need Help

Let me know if:
1. ✅ You've run the SQL (Option 2 above)
2. ❌ You want me to do it automatically (Option 1)
3. 🔧 You want me to create a setup API endpoint

Once the SQL runs, login will work immediately!

