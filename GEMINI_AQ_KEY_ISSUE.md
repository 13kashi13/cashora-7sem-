# Gemini AQ. Key Issue - Known Google Bug

## The Problem

Your Gemini API key starts with `AQ.` which is Google's new "Auth Key" format. However, there's a **widespread bug** where these AQ. keys return:

```
401 ACCESS_TOKEN_TYPE_UNSUPPORTED
```

This is NOT your fault - it's a known issue affecting many developers.

## Why This Happens

Google is transitioning from old `AIzaSy` keys to new `AQ.` keys, but the Generative Language API (`generativelanguage.googleapis.com`) doesn't properly support AQ. keys yet.

References:
- https://discuss.ai.google.dev/t/aq-auth-key-returns-401-access-token-type-unsupported/171299
- https://discuss.ai.google.dev/t/401-access-token-type-unsupported-for-all-new-aq-auth-keys/198104

## Solutions

### Option 1: Use Google AI SDK (RECOMMENDED - Easy Fix)

Instead of calling the REST API directly, use Google's official SDK which handles AQ. keys properly.

**Install:**
```bash
npm install @google/generative-ai
```

**Updated code** (I'll implement this for you):
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY); // Works with AQ. keys
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
const result = await model.generateContent(prompt);
```

### Option 2: Get AIzaSy Key (If Possible)

Some accounts can still generate old-format keys:

1. Go to https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "API Key"  
3. Check if it starts with `AIzaSy` (not `AQ.`)
4. If yes, use that key instead

**Note:** Many newer accounts can ONLY generate AQ. keys.

### Option 3: Use Vertex AI API

Use `aiplatform.googleapis.com` instead of `generativelanguage.googleapis.com`:

```javascript
// Different endpoint that supports AQ. keys
const url = 'https://aiplatform.googleapis.com/v1/projects/YOUR_PROJECT/locations/us-central1/publishers/google/models/gemini-2.0-flash:generateContent';
```

Requires setting up Google Cloud project ID.

## What I'll Do

I'll implement **Option 1** (Google AI SDK) which is the cleanest solution and officially supports AQ. keys.

This means installing `@google/generative-ai` package and updating the video generation code to use the SDK instead of direct REST API calls.

## Timeline

- Install SDK: 30 seconds
- Update code: 2 minutes  
- Test: 1 minute
- Push to GitHub & Render: 2 minutes

Total: **5 minutes** to fix

Then your video generation will work!
