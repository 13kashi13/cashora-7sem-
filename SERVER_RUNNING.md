# ✅ Server Running Locally

**Started:** November 19, 2026  
**Status:** Active and Connected to Supabase

---

## Server Details

| Property | Value |
|----------|-------|
| **Status** | ✅ Running |
| **Primary URL** | http://127.0.0.1:4000 |
| **Backup URL** | http://127.0.0.1:2000 |
| **Environment** | development |
| **Database** | Supabase (PostgreSQL) |
| **Node Process** | index.js |

---

## Connection Status

```
✅ Supabase client initialised → https://jeyqjgmypryfspvrfcmm.supabase.co
✅ Server running at http://127.0.0.1:4000
```

---

## Available Endpoints

### Authentication
- **Login Page:** http://127.0.0.1:4000/login/
- **Get Current User:** http://127.0.0.1:4000/auth/user
- **Logout:** http://127.0.0.1:4000/auth/logout

### OAuth Integrations
- 📸 **Instagram:** API Enabled (@vaibhav.tf7)
- 🧵 **Threads:** API Enabled (@vaibhav.tf7)
- 📺 **YouTube:** OAuth Redirect: http://127.0.0.1:4000/auth/youtube/callback
- 🐦 **Twitter/X:** Not configured

### API Routes
- **Upload:** `POST /api/upload`
- **Schedule Post:** `POST /api/schedule-post`
- **Library:** `GET/POST/PUT/DELETE /api/library`
- **Automation Settings:** `GET/POST /api/automation-settings`
- **Posting Status:** `GET /api/posting-status`
- **Scheduled Posts:** `GET/DELETE /api/scheduled-posts`

---

## Test Login Credentials

```
Email:    demo@cashora.tech
Password: demo123
```

Or try:
```
Email:    admin@cashora.tech
Password: admin123
```

---

## Features Active

✅ Session Management (24 hour expiry)  
✅ File Upload (Multer configured)  
✅ n8n Webhook Integration  
✅ Scheduled Posts Auto-Trigger (every 10s)  
✅ CORS Enabled  
✅ Static File Serving  
✅ Express Sessions  

---

## Storage

🗄️ **Database:** Supabase PostgreSQL  
📁 **File Uploads:** `/server/uploads/`  
📊 **Data Tables:**
- users
- platform_tokens
- library_items
- scheduled_posts
- posting_statuses
- automation_settings

---

## To Access

### From Browser
- http://127.0.0.1:4000/login/

### From Terminal (Test API)
```bash
# Test login endpoint
curl -X POST http://127.0.0.1:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@cashora.tech","password":"demo123"}'

# Check server status
curl http://127.0.0.1:4000/auth/user
```

---

## Logs Available

All requests, errors, and database operations are logged to console in the terminal where the server is running.

**Process ID:** Terminal 4 (Kiro process manager)

---

## To Stop Server

Run in Kiro:
```
control_pwsh_process with action: "stop" and terminalId: "4"
```

Or press `Ctrl+C` in the terminal where the server is running.

