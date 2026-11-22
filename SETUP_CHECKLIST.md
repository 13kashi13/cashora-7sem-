# Google Drive Setup Checklist ✅

Follow this checklist as you go through the setup.

## ☁️ Google Cloud Console

### Step 1: Access Console
- [ ] Opened https://console.cloud.google.com
- [ ] Signed in with Google account
- [ ] Can see the console dashboard

### Step 2: Project Setup
- [ ] Have a project selected (or created new one named "Cashora")
- [ ] Project name visible at top of screen

### Step 3: Enable Drive API
- [ ] Navigated to: APIs & Services → Library
- [ ] Searched for "Google Drive API"
- [ ] Clicked "Enable"
- [ ] Status shows "API Enabled"

### Step 4: Create Service Account
- [ ] Navigated to: APIs & Services → Credentials
- [ ] Clicked "+ Create Credentials"
- [ ] Selected "Service Account"
- [ ] Filled in name: `cashora-video-storage`
- [ ] Clicked "Create and Continue"
- [ ] Skipped role, clicked "Continue"
- [ ] Skipped user access, clicked "Done"
- [ ] Service account appears in list

### Step 5: Download JSON Key
- [ ] Clicked on service account email (looks like: cashora-video-storage@...)
- [ ] Clicked "Keys" tab
- [ ] Clicked "Add Key" → "Create new key"
- [ ] Selected "JSON" format
- [ ] Clicked "Create"
- [ ] JSON file downloaded to Downloads folder
- [ ] Found the file (named like: cashora-xxxxx-abc123.json)

## 💻 Local Setup

### Step 6: Add to .env File
- [ ] Opened the downloaded JSON file
- [ ] Copied entire content (Cmd+A, Cmd+C on Mac)
- [ ] Opened backend/.env file
- [ ] Found line: `GOOGLE_SERVICE_ACCOUNT_KEY=`
- [ ] Pasted JSON after the = sign (entire JSON on one line)
- [ ] Saved file (Cmd+S)
- [ ] No line breaks in the JSON

### Step 7: Test Local Backend
- [ ] Opened Terminal
- [ ] Changed to backend folder: `cd backend`
- [ ] Started server: `npm start`
- [ ] Server started without errors
- [ ] Opened new Terminal tab
- [ ] Ran: `curl http://localhost:4000/api/video/drive-status`
- [ ] Response shows: `{"success":true,"message":"Connected to Google Drive"}`

## 🚀 Render Deployment

### Step 8: Add to Render
- [ ] Opened https://dashboard.render.com
- [ ] Found service: cashora-backend-1w64
- [ ] Clicked on the service
- [ ] Clicked "Environment" tab on left
- [ ] Clicked "Add Environment Variable"
- [ ] Key: `GOOGLE_SERVICE_ACCOUNT_KEY`
- [ ] Value: (pasted entire JSON)
- [ ] Clicked "Save Changes"
- [ ] Render shows "Deploying..."
- [ ] Waited for deployment to finish (2-3 minutes)
- [ ] Status shows "Live"

### Step 9: Test Production
- [ ] Ran: `curl https://cashora-backend-1w64.onrender.com/api/video/drive-status`
- [ ] Response shows: `{"success":true,"message":"Connected to Google Drive"}`

## 🎬 Video Test

### Step 10: Generate Test Video
- [ ] Opened: https://cashora-7sem-frontend.vercel.app/dashboard/
- [ ] Clicked "Create" tab
- [ ] Entered prompt: "A sunset over ocean waves"
- [ ] Clicked "Generate" button
- [ ] Waited for video generation (2-3 minutes)
- [ ] Video preview appeared
- [ ] Alert showed: "✅ Video saved to Google Drive and Library!"
- [ ] Clicked "Library" tab
- [ ] Video appears in library
- [ ] Refreshed page (Cmd+R or F5)
- [ ] Video STILL appears in library ✅

## 🎉 Success!

If all checkboxes are checked, your Google Drive storage is working!

Videos will now:
- ✅ Persist after page refresh
- ✅ Be stored in your Google Drive
- ✅ Have permanent shareable links
- ✅ Work on any device/browser

---

## 🆘 Troubleshooting

### "Google Drive not configured"
- Check .env has `GOOGLE_SERVICE_ACCOUNT_KEY=` with JSON (no line breaks)
- Restart backend server
- Check JSON is valid (no copy/paste errors)

### "Failed to initialize Google Drive"
- Make sure Drive API is enabled in Cloud Console
- Check service account JSON is correct
- Look at backend logs for detailed error

### "Insufficient Permission"
- Make sure service account has access
- Check that `drive.file` scope is enabled

### Video doesn't show after refresh
- Check browser console for errors
- Verify Drive upload succeeded (check alert message)
- Test Drive status endpoint

### Render deployment stuck
- Check Render logs for errors
- Verify environment variable was saved
- Try manual redeploy

---

## 📞 Need Help?

If stuck:
1. Check which step failed (use this checklist)
2. Look at error messages in Terminal/Console
3. Check Render logs if production issue
4. Share screenshot of error

---

## 🔗 Quick Links

- Google Cloud Console: https://console.cloud.google.com
- Render Dashboard: https://dashboard.render.com
- Your Backend: https://cashora-backend-1w64.onrender.com
- Your Frontend: https://cashora-7sem-frontend.vercel.app/dashboard/
- Test Drive Status: `curl https://cashora-backend-1w64.onrender.com/api/video/drive-status`
