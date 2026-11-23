# n8n Webhook Setup Guide

## What is n8n?
n8n is a workflow automation tool (like Zapier) that allows you to automate posting videos to multiple platforms without writing code.

## Webhook URL
Production webhook: `https://fixitfelix.app.n8n.cloud/webhook/blotato-website-post`

---

## How It Works

```
User generates video in Cashora
  ↓
Video completes (Blotato)
  ↓
Frontend saves to Google Drive
  ↓
Frontend calls: POST /api/schedule-post (with n8n trigger)
  ↓
Backend sends webhook to n8n
  ↓
n8n workflow receives video data
  ↓
n8n posts to YouTube/Instagram/Discord/etc.
  ↓
✅ Video published automatically!
```

---

## Setup Steps

### 1. Environment Variables

Already added to `.env`:
```env
N8N_WEBHOOK_URL=https://fixitfelix.app.n8n.cloud/webhook/blotato-website-post
```

**Also add to Render:**
1. Go to: https://dashboard.render.com
2. Select: cashora-backend-1w64
3. Environment tab
4. Add variable:
   - Key: `N8N_WEBHOOK_URL`
   - Value: `https://fixitfelix.app.n8n.cloud/webhook/blotato-website-post`
5. Save changes

---

## n8n Workflow Structure

Your n8n workflow should have these nodes:

### 1. Webhook Trigger Node
- Method: POST
- Path: `blotato-website-post`
- Receives data:
```json
{
  "videoUrl": "https://drive.google.com/uc?export=download&id=...",
  "title": "AI Generated Video",
  "caption": "Check out this amazing video!",
  "platforms": ["YouTube", "Instagram"],
  "scheduledTime": "2026-11-22T18:00:00Z",
  "driveFileId": "1abc123xyz",
  "thumbnailUrl": "https://...",
  "tags": ["ai", "video", "automation"]
}
```

### 2. Switch Node (Split by Platform)
- Routes data to different platform nodes based on `platforms` array

### 3. Platform Nodes
- **YouTube Upload Node**: Uses YouTube API to upload video
- **Instagram Post Node**: Posts to Instagram (requires business account)
- **Discord Webhook Node**: Posts to Discord channel
- **Twitter Post Node**: Posts to Twitter/X

### 4. Response Node
- Returns success/failure status back to Cashora

---

## Testing the Webhook

### Test from Terminal
```bash
curl -X POST https://fixitfelix.app.n8n.cloud/webhook/blotato-website-post \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://drive.google.com/uc?export=download&id=1abc123",
    "title": "Test Video",
    "caption": "This is a test",
    "platforms": ["YouTube"]
  }'
```

### Test from Dashboard
1. Go to dashboard → Create tab
2. Generate a video
3. When video completes, click "Schedule Post"
4. Select platforms and time
5. Click "Schedule"
6. Backend will send data to n8n webhook
7. Check n8n dashboard for execution logs

---

## What Gets Sent to n8n

When a user schedules a post, the backend sends:

```javascript
POST https://fixitfelix.app.n8n.cloud/webhook/blotato-website-post

{
  // Video information
  "videoUrl": "https://drive.google.com/uc?export=download&id=...",
  "driveFileId": "1abc123xyz",
  "title": "AI Generated Video - Nov 22",
  "caption": "Check out this AI-generated video!",
  "thumbnailUrl": "https://...",
  
  // Scheduling
  "scheduledTime": "2026-11-22T18:00:00.000Z",
  "timezone": "Asia/Kolkata",
  
  // Platforms
  "platforms": ["YouTube", "Instagram", "Discord"],
  
  // Metadata
  "tags": ["ai", "automation", "video"],
  "category": "Entertainment",
  "privacy": "public",
  
  // User info (if logged in)
  "userId": "123",
  "userEmail": "demo@cashora.tech"
}
```

---

## Backend Integration

The backend already has the webhook integration in `index.js`:

```javascript
// POST /api/schedule-post endpoint
app.post('/api/schedule-post', async (req, res) => {
  const { videoUrl, title, caption, platforms, scheduledTime } = req.body;
  
  // Save to database
  await supabase.from('scheduled_posts').insert({...});
  
  // Trigger n8n webhook
  if (process.env.N8N_WEBHOOK_URL) {
    try {
      await axios.post(process.env.N8N_WEBHOOK_URL, {
        videoUrl,
        title,
        caption,
        platforms,
        scheduledTime,
        ...otherData
      });
      console.log('✅ n8n webhook triggered');
    } catch (err) {
      console.error('❌ n8n webhook failed:', err.message);
    }
  }
  
  res.json({ success: true });
});
```

---

## n8n Workflow Tips

### For YouTube Upload:
- Use "YouTube" node
- Set credentials (OAuth or API key)
- Map fields:
  - `title` → Title
  - `caption` → Description  
  - `videoUrl` → Video URL (download from Drive first)
  - `tags` → Tags
  - `privacy` → Privacy (public/unlisted/private)

### For Instagram:
- Use "Instagram" node
- Requires Instagram Business Account
- Map fields:
  - `videoUrl` → Media URL
  - `caption` → Caption
  - Note: Instagram has specific video requirements (aspect ratio, length)

### For Discord:
- Use "Discord Webhook" node
- Your webhook: Already configured
- Send message with video embed

### For Scheduling:
- Use "Wait" node or "Schedule" node
- Calculate delay from `scheduledTime`
- Example: If scheduled for 6 PM, wait until that time before posting

---

## Error Handling

### In n8n:
- Add "Error Trigger" node to catch failures
- Send error notification (email, Slack, Discord)
- Retry failed uploads (add Retry node)

### In Backend:
- If n8n webhook fails, still save to database
- User can manually trigger from dashboard
- Log all webhook attempts

---

## Monitoring

### Check n8n Executions:
1. Go to n8n dashboard
2. View "Executions" tab
3. See all webhook triggers
4. Check success/failure status
5. View input/output data

### Check Backend Logs:
```bash
# Render logs
https://dashboard.render.com → cashora-backend-1w64 → Logs

# Look for:
"✅ n8n webhook triggered"
"❌ n8n webhook failed"
```

---

## Security

### Webhook Security:
- n8n webhook is public (anyone with URL can trigger)
- To secure it, add authentication:
  1. In n8n webhook node, enable "Authentication"
  2. Choose "Header Auth"
  3. Set header: `X-Webhook-Secret: your-secret-key`
  4. In backend, add header to webhook request

### Environment Variables:
- Never commit `N8N_WEBHOOK_URL` to Git (already in .gitignore)
- Store in environment variables only
- Use different webhooks for dev/production

---

## Testing Checklist

- [ ] n8n webhook URL added to .env
- [ ] n8n webhook URL added to Render
- [ ] Backend restarted/redeployed
- [ ] n8n workflow created and activated
- [ ] Test curl command works
- [ ] Generate video in dashboard
- [ ] Schedule post from dashboard
- [ ] Check n8n execution logs
- [ ] Verify video posted to platforms

---

## Quick Commands

```bash
# Add to Render (do this manually in dashboard)
N8N_WEBHOOK_URL=https://fixitfelix.app.n8n.cloud/webhook/blotato-website-post

# Test webhook
curl -X POST https://fixitfelix.app.n8n.cloud/webhook/blotato-website-post \
  -H "Content-Type: application/json" \
  -d '{"test": true, "message": "Hello from Cashora!"}'

# Check if webhook is set
curl https://cashora-backend-1w64.onrender.com/api/dashboard/overview
```

---

## Next Steps

1. ✅ Webhook URL added to .env (done)
2. ⏳ Add to Render environment variables (you need to do this)
3. ⏳ Create/configure n8n workflow
4. ⏳ Test webhook manually
5. ⏳ Generate video and schedule post
6. ⏳ Verify posts to platforms

---

## Support

- n8n Documentation: https://docs.n8n.io
- n8n Community: https://community.n8n.io
- Your n8n Instance: https://fixitfelix.app.n8n.cloud

That's it! Your automated posting system is ready to go! 🚀
