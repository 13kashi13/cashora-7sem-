# Force Render to Deploy Latest Code - Step by Step

## The Problem
Production is showing error: `gemini-2.0-flash-exp not found`

This means Render is running OLD code, not the latest with `gemini-3.6-flash`.

## Solution: Manual Deploy

### Step 1: Go to Render Dashboard
1. Open: https://dashboard.render.com
2. Click on: **`cashora-backend-1w64`**

### Step 2: Check Current Status
Look at the top section:
- **Current commit:** Should show `37627a5` (latest)
- If it shows older commit → Deployment is stuck

### Step 3: Trigger Manual Deploy

**Option A: If you see "Manual Deploy" button**
1. Click **"Manual Deploy"** (top right)
2. Select **"Clear build cache & deploy"**
3. Click **"Yes, deploy"**
4. Wait 2-3 minutes

**Option B: If no "Manual Deploy" button**
1. Go to **"Settings"** tab
2. Scroll to **"Build & Deploy"** section
3. Click **"Redeploy"** or **"Trigger Deploy"**

**Option C: Force rebuild via GitHub**
1. In Render, go to **"Settings"**
2. Find **"Auto-Deploy"** setting
3. Make sure it's set to **"Yes"** for branch **"main"**
4. If it's already Yes, toggle to No and back to Yes
5. Save changes

### Step 4: Watch the Deployment
1. Go to **"Events"** tab
2. Should see new deployment starting
3. Click on the deployment to see logs
4. Wait for "Build successful" message
5. Wait for "Deploy live" message

### Step 5: Verify It Worked
After deployment shows "Live":

**Test in browser:**
```
https://cashora-7sem-frontend.vercel.app/api/video/config-check
```

**Test in terminal:**
```bash
curl -X POST https://cashora-7sem-frontend.vercel.app/api/video/enhance-prompt \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test"}'
```

Should return success, NOT the "2.0-flash-exp not found" error!

### Step 6: Test on UI
1. Go to: https://cashora-7sem-frontend.vercel.app/
2. Log in
3. Dashboard → Create tab  
4. Enter prompt
5. Click "Start Generate"
6. Should work! 🎉

## Troubleshooting

### If deployment fails:
**Check Render logs for errors:**
1. Go to **"Logs"** tab in Render
2. Look for error messages
3. Common issues:
   - `npm install` failed → dependency issue
   - `Module not found` → missing package
   - Port binding error → Render configuration issue

### If it says "Live" but still shows old error:
**Browser cache issue:**
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Clear browser cache
3. Try incognito/private window

**Vercel cache issue:**
1. Go to Vercel dashboard
2. Find your frontend deployment
3. Click "Redeploy"

### If package @google/generative-ai not found:
**Render didn't install dependencies:**
1. Check Render logs for `npm install` output
2. Should see `@google/generative-ai` being installed
3. If not, check `package.json` is committed to Git

## Current Code Status

✅ **Local code:** Using `gemini-3.6-flash` (correct)
✅ **GitHub code:** Commit `37627a5` pushed (correct)
✅ **Package.json:** Has `@google/generative-ai` (correct)
❌ **Render deployment:** Using old code (needs manual deploy)

## What Should Happen

When deployment succeeds:
1. Render pulls commit `37627a5` from GitHub
2. Runs `npm install` (installs @google/generative-ai)
3. Runs `node index.js`
4. Server starts with `gemini-3.6-flash` model
5. Video generation works! 🎬

## Timeline

- **Manual deploy trigger:** 30 seconds
- **Build time:** 1-2 minutes  
- **Deploy time:** 30 seconds
- **Total:** 2-3 minutes

After that, video generation will work on production!
