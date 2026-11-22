# Force Render to Deploy Latest Code

## The Issue
The `/api/video/config-check` endpoint returns "Cannot GET" because Render is running old code.

## Solution: Manual Deploy

### Option 1: Trigger Deploy from Render Dashboard

1. Go to https://dashboard.render.com
2. Click on `cashora-backend-1w64` service
3. Look at the top right - you'll see current deployment status
4. Click the **"Manual Deploy"** button (or "Deploy latest commit")
5. Select "Clear build cache & deploy"
6. Wait 2-3 minutes for deployment to complete
7. Look for "Live" status with green checkmark

### Option 2: Push a Dummy Commit

If there's no manual deploy button, push a tiny change:

```bash
cd "/Users/v41bhx/sem7 final presentation/cashoraAI"
echo "# Trigger deploy" >> backend/README.md
git add backend/README.md
git commit -m "Trigger Render deployment"
git push origin main
```

Render will automatically detect the push and redeploy.

## Verify Deployment

After deployment completes:

1. Check Render logs show the new commit hash (2f139be or later)
2. Visit: https://cashora-backend-1w64.onrender.com/api/video/config-check
3. Should return JSON (not "Cannot GET")

## Then Test via Vercel Proxy

Once Render is deployed:
- https://cashora-7sem-frontend.vercel.app/api/video/config-check

Should return:
```json
{
  "blotato": { "configured": true, "keyPrefix": "blt_jhRzKX..." },
  "gemini": { "configured": true, "keyPrefix": "AIzaSyAQ.A..." },
  "session": { "exists": true, "hasUser": true, "userId": "..." }
}
```

## Current Render Deployment Settings

Check these in Render dashboard:

- **Auto-Deploy:** Should be "Yes" for main branch
- **Branch:** Should be "main"
- **Build Command:** `npm install` (or `cd backend && npm install`)
- **Start Command:** `node index.js` (or `cd backend && node index.js`)
- **Root Directory:** Should be blank or `backend`

If Root Directory is blank, the start command needs to be:
```
cd backend && node index.js
```

If Root Directory is `backend`, the start command should be:
```
node index.js
```
