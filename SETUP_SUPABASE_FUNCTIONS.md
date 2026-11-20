# 🔧 Setup Supabase Functions & Database

**Issue:** Login is failing because the database functions and tables haven't been created yet.

**Solution:** Run the SQL setup in your Supabase dashboard.

---

## Steps to Fix

### 1. Go to Supabase Dashboard

1. Open https://app.supabase.com
2. Select your project: **jeyqjgmypryfspvrfcmm**
3. Click **SQL Editor** (in left sidebar)

### 2. Create New Query

1. Click **+ New Query** (top left)
2. Copy the entire content from: `server/SUPABASE_FUNCTIONS.sql`
3. Paste it into the SQL editor

### 3. Run the SQL

1. Click **Run** button (or Ctrl+Enter)
2. Wait for completion (should see green checkmarks)

---

## What This Will Do

✅ Enable pgcrypto extension (for password hashing)  
✅ Create `login()` function (RPC endpoint)  
✅ Create 6 tables:
   - `users` - Login accounts
   - `platform_tokens` - OAuth tokens
   - `library_items` - Video library
   - `scheduled_posts` - Posts queue
   - `posting_statuses` - Real-time status
   - `automation_settings` - User preferences

✅ Seed 4 demo accounts:
   - `demo@cashora.tech` / `demo123`
   - `admin@cashora.tech` / `admin123`
   - `test@example.com` / `test123`
   - `vaibhav@cashora.tech` / `demo123`

---

## SQL Script Content

Here's what you'll be running (from `server/SUPABASE_FUNCTIONS.sql`):

```sql
-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create login() function
CREATE OR REPLACE FUNCTION login(p_email text, p_password text)
RETURNS TABLE(
  id uuid, email text, name text, username text,
  timezone text, bio text, role text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id, email, name, username, timezone, bio, role
  FROM users
  WHERE email = p_email
    AND password_hash = crypt(p_password, password_hash);
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION login(text, text) TO anon;
GRANT EXECUTE ON FUNCTION login(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION login(text, text) TO service_role;

-- Create all tables (users, platform_tokens, library_items, etc.)
-- Create seed data with demo accounts
```

---

## Quick Copy-Paste

**File Location:** `c:\Users\Alok\cashoraAI\server\SUPABASE_FUNCTIONS.sql`

Open this file and copy ALL content → Paste into Supabase SQL Editor → Click Run

---

## After Running SQL

Once you see green checkmarks, the setup is complete. Then:

1. **Refresh the browser** on login page
2. **Try logging in:**
   ```
   Email: demo@cashora.tech
   Password: demo123
   ```

---

## Verify It Worked

In Supabase dashboard, check:

1. **SQL Editor** → **+ New Query**
2. Run this test query:
   ```sql
   SELECT COUNT(*) FROM users;
   ```
3. Should return: `4` (the 4 demo accounts)

---

## If Still Failing

1. Check that the `login()` function exists:
   ```sql
   -- In SQL Editor, run:
   SELECT * FROM pg_proc WHERE proname = 'login';
   ```

2. Check that users table has data:
   ```sql
   SELECT email, role FROM users;
   ```

3. Check if password_hash matches:
   ```sql
   -- Test the crypt function manually:
   SELECT crypt('demo123', password_hash) = password_hash AS password_matches
   FROM users WHERE email = 'demo@cashora.tech';
   ```

---

## Browser Cache Issue

After running SQL, if login still fails:

1. **Hard refresh browser:** Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. **Clear cookies:** Open DevTools (F12) → Application → Cookies → Delete all
3. **Try login again**

---

## Need More Help?

Check the server logs in your terminal:
```
PS C:\Users\Alok\cashoraAI\server\npm start
```

You should see errors like:
```
Login RPC error: Could not find the function public.login(...)
```

Once you run the SQL, this error will disappear and login will work.

