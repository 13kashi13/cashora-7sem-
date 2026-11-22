# Fix: Gemini API Key is Invalid

## The Issue
The video generation is failing because the Gemini API key is invalid.

Current key: `AIzaSyAQ.Ab8RN6IP9usMewqUhY_D-G2eXFqpl76m4MP8vYUN-fIwysKqrA`

Error: "API key not valid. Please pass a valid API key."

## Why It's Invalid

The key has a `.` (dot) after `AIzaSyAQ` which is not valid format.

Valid Gemini API keys:
- Start with `AIzaSy`
- Are 39 characters long
- Contain only alphanumeric characters (A-Z, a-z, 0-9, -, _)
- **No dots** in the middle

## Get a Valid Gemini API Key

### Step 1: Go to Google AI Studio
Visit: https://aistudio.google.com/app/apikey

### Step 2: Create API Key
1. Click "Create API Key" button
2. Select your Google Cloud project (or create new one)
3. Copy the generated key

### Step 3: Update Local .env
Open `/Users/v41bhx/sem7 final presentation/cashoraAI/backend/.env`

Replace the line:
```
GEMINI_API_KEY=AIzaSyAQ.Ab8RN6IP9usMewqUhY_D-G2eXFqpl76m4MP8vYUN-fIwysKqrA
```

With:
```
GEMINI_API_KEY=YOUR_NEW_VALID_KEY_HERE
```

### Step 4: Update Render Environment
1. Go to https://dashboard.render.com
2. Select `cashora-backend-1w64` service
3. Go to "Environment" tab
4. Find `GEMINI_API_KEY` variable
5. Click "Edit"
6. Paste the new valid key
7. Click "Save"
8. Wait for redeploy (2-3 minutes)

### Step 5: Test Again
After updating both local and Render:

```bash
cd "/Users/v41bhx/sem7 final presentation/cashoraAI/backend"
node testVideoGeneration.js
```

Should show:
```
✅ Gemini Success!
Original: A beautiful sunset over mountains
Enhanced: A cinematic sunset over majestic snow-capped mountains...
✅ Video Created!
```

## Alternative: Use Different Model

If you can't get a Gemini key, you could use OpenAI GPT instead.

Need an OpenAI API key from: https://platform.openai.com/api-keys

Then we can modify the code to use GPT-4 for prompt enhancement.

## Testing After Fix

Once you have the valid key, run:

```bash
# Test APIs
node testVideoGeneration.js

# If successful, test the full app
npm start
```

Then visit:
- Local: http://localhost:3000/dashboard/
- Production: https://cashora-7sem-frontend.vercel.app/dashboard/

Go to Create tab and try generating a video!
