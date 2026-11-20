// ─── Supabase Client ─────────────────────────────────────────
// Uses service-role key on the server so it can bypass RLS.
// Falls back to anon key if service key isn't set yet.
const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key  = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false }
});

console.log('✅ Supabase client initialised →', url);

module.exports = supabase;

