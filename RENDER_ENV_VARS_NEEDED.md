# Environment Variables Needed on Render

Add these environment variables to your Render backend deployment:

## Video Generation (NEW - Required)
```
BLOTATO_API_KEY=blt_jhRzKXJ2lJO3dqwHUCoW36MJKRNECCnmQLN3Ny+Mvp8=
GEMINI_API_KEY=AIzaSyAQ.Ab8RN6IP9usMewqUhY_D-G2eXFqpl76m4MP8vYUN-fIwysKqrA
```

## Steps to Add to Render:

1. Go to https://dashboard.render.com
2. Select your backend service: `cashora-backend-1w64`
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add `BLOTATO_API_KEY` with value: `blt_jhRzKXJ2lJO3dqwHUCoW36MJKRNECCnmQLN3Ny+Mvp8=`
6. Add `GEMINI_API_KEY` with value: `AIzaSyAQ.Ab8RN6IP9usMewqUhY_D-G2eXFqpl76m4MP8vYUN-fIwysKqrA`
7. Click "Save Changes" - Render will automatically redeploy

## Testing After Deployment:

1. Wait for Render to finish redeploying (2-3 minutes)
2. Go to https://cashora-7sem-frontend.vercel.app/
3. **Log in** with your credentials
4. Go to Dashboard → Create tab
5. Fill in the video settings (duration, aspect ratio, visual style)
6. Enter a prompt in the text area
7. Click "Start Generate"
8. The prompt will be enhanced by Gemini AI
9. Video generation will start with Blotato
10. Status will update every 15 seconds showing progress
11. When complete, video preview will appear

## Troubleshooting:

**If you see 401 errors:**
- Make sure you're logged in (check if you see your name in top right)
- Clear browser cookies and log in again
- Check browser console for specific error messages

**If video generation doesn't start:**
- Open browser DevTools → Console
- Look for error messages
- Check that BLOTATO_API_KEY and GEMINI_API_KEY are added to Render
- Verify Render deployment completed successfully

**If it says "Gemini API key format looks unusual":**
- The key format with `AIzaSyAQ.` prefix is unusual for Gemini keys
- Normal format is `AIzaSy` followed by alphanumeric characters
- Please verify the key is correct from Google AI Studio: https://aistudio.google.com/app/apikey
