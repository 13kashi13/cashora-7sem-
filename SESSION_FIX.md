# Session Cookie Fix for Cross-Origin Authentication

## The Problem
Videos were saving to localStorage but disappearing on page refresh because database saves were failing. The root cause: **session cookies weren't being sent between the Vercel frontend and Render backend**.

### Why This Happened
1. **Different Domains**: Frontend at `cashora-7sem-frontend.vercel.app`, Backend at `cashora-backend-1w64.onrender.com`
2. **Cookie Restrictions**: By default, cookies set by one domain aren't sent to another domain
3. **Vercel Proxy**: Even though Vercel proxies `/auth/*` and `/api/*` to Render, the browser still sees two different domains
4. **Session Cookie Settings**: The original settings (`httpOnly: true`, `sameSite: 'lax'`) blocked cross-origin cookie transmission

## The Solution
Changed session cookie settings in `backend/index.js`:

```javascript
// OLD SETTINGS (didn't work cross-origin)
app.use(cookieSession({
  name: 'cashora.sid',
  keys: [sessionSecret],
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,        // ❌ Blocks frontend JavaScript access
  sameSite: 'lax',       // ❌ Blocks cross-site requests
  maxAge: 24 * 60 * 60 * 1000
}));

// NEW SETTINGS (works cross-origin)
app.use(cookieSession({
  name: 'cashora.sid',
  keys: [sessionSecret],
  secure: process.env.NODE_ENV === 'production',
  httpOnly: false,       // ✅ Frontend can read via document.cookie
  sameSite: 'none',      // ✅ Allows cross-site cookies (requires secure=true in production)
  maxAge: 24 * 60 * 60 * 1000
}));
```

### What Changed
- **`httpOnly: false`**: Allows frontend JavaScript to access the cookie (needed for the frontend to send it back)
- **`sameSite: 'none'`**: Allows the cookie to be sent with cross-site requests (required when frontend and backend are on different domains)

## Security Note
- `httpOnly: false` means the cookie is accessible via JavaScript (less secure against XSS attacks)
- `sameSite: 'none'` requires `secure: true` in production (HTTPS only)
- This is a common pattern for split frontend/backend deployments
- Alternative (more secure): Use JWT tokens stored in localStorage instead of cookies

## After Deployment
1. **Deploy to Render**: Render will automatically deploy from the pushed commit
2. **Clear cookies**: Users should clear browser cookies or use incognito mode to test
3. **Test login**: Login at `demo@cashora.tech` should now persist
4. **Test video save**: Generate a video, refresh the page - it should still be there
5. **Verify database**: Check Supabase `library_items` table to confirm saves are working

## How to Verify It's Working
```javascript
// In browser console after logging in:
fetch('https://cashora-7sem-frontend.vercel.app/auth/user', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(d => console.log('Auth status:', d));
// Should show: { loggedIn: true, ... }
```

## Commit
- **Hash**: `eaf999a`
- **Message**: "fix: session cookie settings for cross-origin requests (httpOnly=false, sameSite=none)"
- **Files**: `backend/index.js`

## Next Steps
Once Render deploys this fix:
1. Test login persistence
2. Test video generation and library save
3. Verify videos survive page refresh
4. If still not working, check Render logs for any database errors
