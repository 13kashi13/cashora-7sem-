# Video Generation Feature - Debugging Guide

## Current Issue: 401 Authentication Error

The 401 error you're seeing means the backend is not receiving valid session credentials when the frontend makes API calls.

## Root Cause Analysis

The error `Failed to load resource: the server responded with a status of 401` on `/api/library` suggests one of these issues:

1. **Not logged in** - The user session doesn't exist
2. **Cookie not sent** - Browser is blocking cookies
3. **CORS issue** - Credentials not being sent cross-origin
4. **Environment variables missing on Render**

## Step-by-Step Fix

### 1. Add Environment Variables to Render (CRITICAL)

Go to https://dashboard.render.com and add these:

```
BLOTATO_API_KEY=blt_jhRzKXJ2lJO3dqwHUCoW36MJKRNECCnmQLN3Ny+Mvp8=
GEMINI_API_KEY=AIzaSyAQ.Ab8RN6IP9usMewqUhY_D-G2eXFqpl76m4MP8vYUN-fIwysKqrA
```

**Wait 2-3 minutes** for Render to redeploy after adding these.

### 2. Check Configuration

After Render redeploys, test the configuration:

1. Open browser and go to: https://cashora-7sem-frontend.vercel.app/api/video/config-check
2. You should see:
```json
{
  "blotato": { "configured": true, "keyPrefix": "blt_jhRzKX..." },
  "gemini": { "configured": true, "keyPrefix": "AIzaSyAQ.Ab8..." },
  "session": { "exists": true, "hasUser": true, "userId": "some-id" }
}
```

### 3. Verify Login Status

1. Go to https://cashora-7sem-frontend.vercel.app/
2. If you see a login page, **log in first**
3. After logging in, you should be redirected to dashboard
4. Open DevTools Console (F12) and check:
   ```javascript
   document.cookie  // Should show "cashora.sid=..."
   ```

### 4. Test Video Generation

1. Go to Dashboard → Create tab
2. Look for the new video settings dropdown:
   - Duration (5/10/15 seconds)
   - Aspect Ratio (16:9, 9:16, 1:1)
   - Visual Style (Cinematic, Animated, etc.)
3. Enter a prompt: "A sunset over mountains"
4. Click "Start Generate"
5. Watch the console for logs
6. Should see: Enhancing prompt → Generating video → Polling status → Video ready

## Common Issues & Solutions

### Issue: "nothing happens" when clicking Start Generate

**Check Console Errors:**
```javascript
// Open DevTools Console (F12) and look for:
// ❌ 401 Unauthorized → Not logged in
// ❌ 400 API key not configured → Env vars missing on Render
// ❌ CORS error → Cookie issue
```

**Solutions:**
1. Make sure you're logged in
2. Clear cookies and log in again
3. Try incognito/private browsing mode
4. Check Render logs for errors

### Issue: 401 Unauthorized

This means the session cookie isn't being sent. 

**Quick Fix:**
1. Log out from https://cashora-7sem-frontend.vercel.app/
2. Clear all cookies for the site
3. Log in again
4. Try video generation again

**Why this happens:**
- Browser blocking third-party cookies
- Session expired (24 hours)
- Vercel proxy not forwarding cookies properly

**Verify the proxy is working:**
The Vercel proxy in `frontend/vercel.json` should forward all `/api/*` and `/auth/*` requests to Render with cookies intact. This makes the requests "same-origin" from the browser's perspective.

### Issue: Gemini API key format warning

The key `AIzaSyAQ.Ab8RN6IP9usMewqUhY_D-G2eXFqpl76m4MP8vYUN-fIwysKqrA` has a `.` after `AIzaSyAQ` which is unusual.

**Normal Gemini key format:**
- Starts with `AIzaSy`
- 39 characters total
- No dots or special characters

**To verify:**
1. Go to https://aistudio.google.com/app/apikey
2. Copy the API key again
3. Update in Render environment variables

### Issue: "Expected number" parse error

This error in console means JSON parsing failed, likely because:
1. The response wasn't JSON (maybe HTML error page)
2. The response was empty
3. The response had invalid JSON

**Check network tab:**
1. Open DevTools → Network tab
2. Look for failed requests (red)
3. Click on them to see the actual response
4. If you see HTML instead of JSON, it's likely a 401/403 redirect

## Testing Endpoints Manually

### Test Gemini Enhancement

```bash
curl -X POST https://cashora-7sem-frontend.vercel.app/api/video/enhance-prompt \
  -H "Content-Type: application/json" \
  -d '{"prompt":"A sunset over mountains"}' \
  --cookie "cashora.sid=YOUR_SESSION_COOKIE"
```

### Test Video Generation

```bash
curl -X POST https://cashora-7sem-frontend.vercel.app/api/video/generate \
  -H "Content-Type: application/json" \
  -d '{
    "enhancedPrompt":"A cinematic sunset over majestic mountains",
    "duration":"15",
    "aspectRatio":"16:9",
    "visualStyle":"cinematic"
  }' \
  --cookie "cashora.sid=YOUR_SESSION_COOKIE"
```

### Test Status Check

```bash
curl https://cashora-7sem-frontend.vercel.app/api/video/status/VIDEO_ID \
  --cookie "cashora.sid=YOUR_SESSION_COOKIE"
```

## Debugging Checklist

- [ ] Environment variables added to Render
- [ ] Render finished redeploying (check dashboard)
- [ ] Logged in to Vercel site
- [ ] Session cookie exists (`document.cookie` shows `cashora.sid`)
- [ ] `/api/video/config-check` shows all APIs configured
- [ ] Console shows no CORS errors
- [ ] Network tab shows requests going to same origin (not cashora-backend-1w64.onrender.com)

## Expected Flow

1. User enters prompt: "A sunset over mountains"
2. Click "Start Generate"
3. Frontend calls `/api/video/enhance-prompt` with original prompt
4. Backend calls Gemini API to enhance prompt
5. Response: "A cinematic sunset over majestic mountains with golden hour lighting..."
6. Frontend calls `/api/video/generate` with enhanced prompt + settings
7. Backend calls Blotato API to create video
8. Response: `{ videoId: "abc123", status: "processing" }`
9. Frontend polls `/api/video/status/abc123` every 15 seconds
10. Status updates: queued → processing → completed
11. When completed, video URL is returned
12. Frontend displays video preview

## Logs to Check

**Backend (Render):**
1. Go to Render dashboard
2. Click on your backend service
3. Click "Logs" tab
4. Look for:
   - `📚 Library fetch - User ID: ...` (shows if session exists)
   - `🎬 Creating Blotato video with prompt: ...` (shows video generation started)
   - Any Gemini or Blotato API errors

**Frontend (Browser Console):**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for:
   - `✅ Cashora API configured: ...`
   - `Enhancing prompt...`
   - `Prompt enhanced!`
   - `Generating video...`
   - `Polling video status...`
   - Any 401/400 errors

## Next Steps After Fixing

Once the 401 error is resolved:

1. Test with a simple prompt: "A cat playing"
2. Watch the console for progress updates
3. Wait for video to generate (can take 3-5 minutes)
4. Video preview should appear in the create section
5. Test different settings (duration, aspect ratio, visual style)
6. Try more complex prompts

## Contact Points

If issues persist:
- Check Render logs for backend errors
- Check browser console for frontend errors
- Verify all environment variables are set correctly
- Test the config-check endpoint first
- Ensure you're logged in before testing video generation
