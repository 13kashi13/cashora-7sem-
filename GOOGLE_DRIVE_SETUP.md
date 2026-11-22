# Google Drive Storage Setup

## Why Google Drive?
Videos generated with Blotato need permanent storage. Without it, videos disappear when:
- Page is refreshed
- Browser cache is cleared
- localStorage is full

Google Drive solves this by:
- ✅ Permanent video storage
- ✅ Shareable links that work forever
- ✅ No session/authentication needed to view
- ✅ Free 15GB storage per Google account

---

## Setup Options

### Option 1: Service Account (Recommended)
Best for production. Videos are stored in a dedicated Google account.

#### Step 1: Create Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create new one)
3. Navigate to: **IAM & Admin** → **Service Accounts**
4. Click **Create Service Account**
5. Name: `cashora-video-storage`
6. Click **Create and Continue**
7. Skip role assignment (click Continue)
8. Click **Done**

#### Step 2: Create Key
1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Choose **JSON** format
5. Click **Create** (a JSON file will download)

#### Step 3: Add to Environment Variables
1. Open the downloaded JSON file
2. Copy the ENTIRE content (it's one line of JSON)
3. Add to `.env` file:
```env
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key_id":"..."}
```

4. Add to **Render** environment variables:
   - Name: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - Value: (paste entire JSON)

#### Step 4: Enable Drive API
1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click **Enable**

#### Step 5: Share Drive Folder (Optional)
If you want videos in a specific folder:
1. Create a folder in Google Drive
2. Right-click → Share
3. Add the service account email (found in JSON: `client_email`)
4. Give "Editor" permission
5. Copy folder ID from URL: `drive.google.com/drive/folders/[FOLDER_ID]`
6. Add to `.env`:
```env
GOOGLE_DRIVE_FOLDER_ID=your-folder-id-here
```

---

### Option 2: OAuth (Use Existing YouTube Login)
Reuses your YouTube OAuth credentials. Simpler but less secure for production.

#### Step 1: Add Drive Scope to YouTube OAuth
1. Your YouTube OAuth is already set up in Google Cloud Console
2. In Google Cloud Console:
   - Go to **APIs & Services** → **Credentials**
   - Click on your OAuth client
   - Add scope: `https://www.googleapis.com/auth/drive.file`

#### Step 2: Re-authenticate YouTube
1. Disconnect YouTube in the dashboard
2. Reconnect YouTube
3. Google will ask for Drive permissions
4. Accept

#### Step 3: Tokens Are Auto-Set
The backend will automatically use your YouTube OAuth tokens for Drive access.

---

## Testing

### Check Drive Status
```bash
curl http://localhost:4000/api/video/drive-status
```

Expected response:
```json
{
  "success": true,
  "message": "Connected to Google Drive",
  "canUpload": true
}
```

### Test Video Upload
```bash
curl -X POST http://localhost:4000/api/video/save-to-drive \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://database.blotato.io/storage/v1/object/public/public_media/23c6b38b-50ab-4d36-9b61-23cada1a1e25/videogen2-render-14910198-47d7-4943-a3ef-6d5e63ff9470.mp4",
    "title": "Test Video",
    "prompt": "test"
  }'
```

Expected response:
```json
{
  "success": true,
  "driveFileId": "1abc...",
  "driveUrl": "https://drive.google.com/file/d/...",
  "directUrl": "https://drive.google.com/uc?export=download&id=...",
  "message": "Video saved to Google Drive successfully!"
}
```

---

## Troubleshooting

### "Google Drive not configured"
- Check that `GOOGLE_SERVICE_ACCOUNT_KEY` is set in `.env`
- Make sure the JSON is valid (no line breaks)
- Restart the backend server

### "Failed to initialize Google Drive"
- Check that Google Drive API is enabled in Cloud Console
- Verify service account JSON is correct
- Check backend logs for detailed error

### "Insufficient Permission"
- Make sure service account has access to the Drive folder
- Check that `drive.file` scope is enabled

### "Videos still disappearing"
- Check browser console for errors
- Verify Drive save succeeded (look for "Video saved to Google Drive")
- Check that `driveUrl` is stored in library items

---

## How It Works

1. **User generates video** → Blotato creates video
2. **Video completes** → Frontend calls `/api/video/save-to-drive`
3. **Backend downloads video** → From Blotato URL
4. **Backend uploads to Drive** → Using service account or OAuth
5. **Drive returns shareable link** → Public URL anyone can view
6. **Frontend saves to library** → With Drive URL, not Blotato URL
7. **Videos persist forever** → Even after page refresh

---

## Security Notes

### Service Account Key
- ⚠️ **Keep the JSON key secret!** It has full access to your Drive
- Never commit to Git (already in `.gitignore`)
- Only add to secure environment variables (Render, not GitHub)

### File Permissions
- Videos are made public (anyone with link can view)
- This is intentional for easy sharing across platforms
- If you need private videos, modify `googleDrive.js` permissions

### OAuth Tokens
- Less secure than service account
- Tokens can expire and need refresh
- User can revoke access anytime

---

## Cost

**Google Drive**: Free up to 15GB
- Average video: 5-50MB
- 15GB = 300-3000 videos
- Upgrade to Google One if needed ($1.99/month for 100GB)

---

## Next Steps

1. ✅ Choose Option 1 (Service Account) or Option 2 (OAuth)
2. ✅ Follow setup steps above
3. ✅ Add credentials to `.env` and Render
4. ✅ Test with `/api/video/drive-status`
5. ✅ Generate a video and verify it stays after refresh
6. 🎉 Videos now persist permanently!

---

## Quick Start (Service Account)

```bash
# 1. Create service account at console.cloud.google.com
# 2. Download JSON key
# 3. Copy entire JSON content
# 4. Add to .env:
echo 'GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}' >> backend/.env

# 5. Enable Drive API in Cloud Console
# 6. Restart backend
npm run dev

# 7. Test
curl http://localhost:4000/api/video/drive-status
```

That's it! Videos will now save to Google Drive automatically. 🎉
