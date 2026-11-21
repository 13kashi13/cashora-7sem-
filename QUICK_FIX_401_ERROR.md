# Quick Fix: 401 Authentication Error

## The Problem
You're seeing: `Failed to load resource: the server responded with a status of 401`

This means the backend can't verify your login session.

## The Solution (3 Steps)

### Step 1: Add Environment Variables to Render (2 minutes)

1. Go to https://dashboard.render.com
2. Click on `cashora-backend-1w64` service
3. Click "Environment" in the left sidebar
4. Click "Add Environment Variable" button
5. Add these two variables:

```
Name: BLOTATO_API_KEY
Value: blt_jhRzKXJ2lJO3dqwHUCoW36MJKRNECCnmQLN3Ny+Mvp8=
```

```
Name: GEMINI_API_KEY  
Value: AIzaSyAQ.Ab8RN6IP9usMewqUhY_D-G2eXFqpl76m4MP8vYUN-fIwysKqrA
```

6. Click "Save Changes"
7. **Wait 2-3 minutes** for automatic redeployment

### Step 2: Log In to Your Deployed Site (1 minute)

1. Go to https://cashora-7sem-frontend.vercel.app/
2. **Important:** Make sure you actually log in with your credentials
3. After login, you should see the Dashboard

### Step 3: Test the Video Generation (1 minute)

1. Click on "Create" tab in the dashboard
2. You should see new video settings (Duration, Aspect Ratio, Visual Style)
3. Type a prompt: "A beautiful sunset"
4. Click "Start Generate"
5. Watch it work! 

## Verify It's Working

Open browser console (F12) and go to:
```
https://cashora-7sem-frontend.vercel.app/api/video/config-check
```

You should see:
```json
{
  "blotato": { "configured": true },
  "gemini": { "configured": true },
  "session": { "exists": true, "hasUser": true }
}
```

If `configured: false` → Environment variables not added yet
If `hasUser: false` → You're not logged in

## Still Getting 401?

Try this:
1. **Log out** completely
2. **Clear cookies** for cashora-7sem-frontend.vercel.app
3. **Close browser** completely
4. **Open fresh browser**
5. **Log in again**
6. **Try video generation**

## How to Check Cookies

Open DevTools Console (F12) and type:
```javascript
document.cookie
```

You should see: `cashora.sid=...` 

If you don't see this cookie, you're not logged in properly.

## Timeline

- **0-3 min**: Add env vars to Render, wait for redeploy
- **3-4 min**: Log in to Vercel site  
- **4-5 min**: Test video generation
- **5-10 min**: Wait for video to generate

## What Happens Next

When you click "Start Generate":
1. Your prompt gets enhanced by Gemini AI (2-3 seconds)
2. Enhanced prompt sent to Blotato for video generation (instant)
3. Status polls every 15 seconds showing progress
4. Video ready in 3-5 minutes (depending on Blotato queue)
5. Video preview appears in the create section

## Expected Progress Messages

In the console you'll see:
```
Enhancing prompt...
✅ Prompt enhanced: "A cinematic beautiful sunset..."
Generating video...
✅ Video generation started. ID: abc123
Polling video status...
Status: queued
Status: processing  
Status: completed
✅ Video ready!
```

## Contact

If still not working after following ALL steps above:
1. Send screenshot of `/api/video/config-check` response
2. Send screenshot of console errors
3. Send screenshot of Render environment variables page
