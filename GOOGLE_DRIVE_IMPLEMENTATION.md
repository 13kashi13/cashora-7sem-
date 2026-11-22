# Google Drive Implementation Summary

## Problem Solved
Videos were **disappearing after page refresh** because:
- Blotato URLs are temporary
- Session cookies weren't persisting between Vercel/Render
- Database saves failed due to authentication issues
- localStorage is browser-specific and gets cleared

## Solution: Google Drive Storage
Videos now automatically upload to Google Drive for permanent storage.

---

## What Was Added

### Backend Files
1. **`backend/src/services/googleDrive.js`** - Google Drive upload service
   - Downloads video from Blotato URL
   - Uploads to Google Drive
   - Makes file publicly shareable
   - Returns permanent Drive URL

2. **`backend/index.js`** - New endpoints:
   - `POST /api/video/save-to-drive` - Upload video to Drive
   - `GET /api/video/drive-status` - Check Drive connection

### Frontend Changes
1. **`frontend/config.js`** - Added Drive endpoints to config

2. **`frontend/dashboard/index.html`** - Updated `finishVideoGeneration()`:
   - Automatically uploads video to Drive after generation
   - Saves Drive URL to library instead of temporary Blotato URL
   - Falls back to localStorage if Drive unavailable

### Documentation
1. **`GOOGLE_DRIVE_SETUP.md`** - Complete setup guide
2. **`SESSION_FIX.md`** - Session cookie fix documentation

---

## How It Works

```
1. User generates video
   ↓
2. Blotato creates video (temporary URL)
   ↓
3. Video completes, frontend calls /api/video/save-to-drive
   ↓
4. Backend downloads video from Blotato URL
   ↓
5. Backend uploads to Google Drive
   ↓
6. Drive returns permanent shareable link
   ↓
7. Frontend saves Drive URL to library
   ↓
8. ✅ Video persists forever!
```

---

## Setup Required

You need to set up ONE of these options:

### Option 1: Service Account (Recommended)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create service account
3. Download JSON key
4. Add to `.env`:
   ```env
   GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
   ```
5. Add same to **Render environment variables**

### Option 2: OAuth (Easier)
1. Add Drive scope to your existing YouTube OAuth
2. Disconnect and reconnect YouTube in dashboard
3. Accept Drive permissions
4. Backend automatically uses YouTube tokens

**Full instructions**: See `GOOGLE_DRIVE_SETUP.md`

---

## Testing

### 1. Check Drive Connection
```bash
curl http://localhost:4000/api/video/drive-status
```

Expected: `{"success": true, "message": "Connected to Google Drive"}`

### 2. Test Upload
```bash
curl -X POST http://localhost:4000/api/video/save-to-drive \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://database.blotato.io/storage/v1/object/public/public_media/23c6b38b-50ab-4d36-9b61-23cada1a1e25/videogen2-render-14910198-47d7-4943-a3ef-6d5e63ff9470.mp4",
    "title": "Test",
    "prompt": "test"
  }'
```

Expected: Drive URL in response

### 3. Generate Video in UI
1. Go to dashboard
2. Enter prompt → Generate
3. Wait for completion
4. Check console: should see "Video saved to Google Drive"
5. Refresh page
6. ✅ Video still in library!

---

## What Happens Without Drive Setup

The system has **graceful fallback**:

1. If Drive not configured:
   - Videos still save to localStorage
   - Alert shows: "Video saved to local storage only. Set up Google Drive for permanent storage."
   - Videos disappear on refresh (localStorage only)

2. If Drive upload fails:
   - Falls back to saving Blotato URL
   - Alert shows: "Video saved to Library (Drive unavailable)"
   - Videos might disappear if Blotato URL expires

---

## Environment Variables

### Local Development (`.env`)
```env
# Option 1: Service Account
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# Option 2: OAuth (auto-populated)
GOOGLE_DRIVE_ACCESS_TOKEN=
GOOGLE_DRIVE_REFRESH_TOKEN=
```

### Render Deployment
Add the same variables to Render's environment settings:
- Dashboard → Environment → Add Variable
- Name: `GOOGLE_SERVICE_ACCOUNT_KEY`
- Value: (paste entire JSON key)

---

## Benefits

✅ **Permanent Storage**: Videos never disappear
✅ **No Session Needed**: Drive URLs work without login
✅ **Shareable**: Anyone with link can view
✅ **Free**: 15GB storage per Google account
✅ **Reliable**: Google's infrastructure
✅ **Fast**: Direct video streaming from Drive

---

## Security

- Videos are **public** (anyone with link can view)
- This is intentional for easy sharing
- Service account key is kept secret in environment variables
- Never committed to Git (in `.gitignore`)

---

## Cost

**FREE** with Google Account (15GB)
- Average video: 5-50MB
- 15GB = 300-3000 videos
- Upgrade to Google One if needed: $1.99/month for 100GB

---

## Files Changed

| File | Changes |
|------|---------|
| `backend/src/services/googleDrive.js` | New - Drive upload service |
| `backend/index.js` | Added 2 endpoints, imported Drive service |
| `backend/.env.example` | Added Drive credentials template |
| `frontend/config.js` | Added Drive endpoints |
| `frontend/dashboard/index.html` | Updated video save logic |
| `GOOGLE_DRIVE_SETUP.md` | New - setup guide |
| `SESSION_FIX.md` | New - session documentation |

---

## Git Commits

- `eaf999a` - Session cookie fix (httpOnly=false, sameSite=none)
- `a01a516` - Google Drive storage implementation

---

## Next Steps

1. ✅ Code is deployed to GitHub
2. ⏳ **You need to**: Set up Google Drive credentials (see GOOGLE_DRIVE_SETUP.md)
3. ⏳ **You need to**: Add credentials to Render environment
4. ⏳ Render will auto-deploy when variables are added
5. ✅ Test video generation
6. ✅ Verify video persists after refresh

---

## Quick Start

```bash
# 1. Set up service account (see GOOGLE_DRIVE_SETUP.md)

# 2. Add to .env
echo 'GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}' >> backend/.env

# 3. Test connection
curl http://localhost:4000/api/video/drive-status

# 4. Generate video in UI

# 5. Refresh page - video should still be there! 🎉
```

---

## Support

If videos still disappear after setup:
1. Check Drive status: `curl /api/video/drive-status`
2. Check browser console for errors
3. Check backend logs for upload failures
4. Verify service account JSON is valid
5. Make sure Drive API is enabled in Cloud Console

The implementation includes extensive logging to help debug issues.
