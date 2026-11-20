# 🚀 Cashora Deployment Guide - Quick Reference

## ✅ Your Project is Ready!

Repository: https://github.com/13kashi13/cashora-7sem-

---

## 🎯 Quick Deploy (Follow in Order)

### 1️⃣ Deploy Backend First (Railway)

**URL:** https://railway.app

1. Sign up with GitHub
2. New Project → Deploy from GitHub
3. Select: `13kashi13/cashora-7sem-`
4. **Set Root Directory:** `backend`
5. Add environment variables (see below)
6. Deploy
7. **Copy your Railway URL** (e.g., `https://cashora-production.up.railway.app`)

### 2️⃣ Update Frontend Configuration

Edit `frontend/env.js` in your repository:

```javascript
window.CASHORA_API_URL = 'https://YOUR-RAILWAY-URL.up.railway.app';
```

Commit and push:
```bash
cd frontend
# Edit env.js with your Railway URL
git add env.js
git commit -m "Update backend URL"
git push
```

### 3️⃣ Deploy Frontend (Vercel)

**URL:** https://vercel.com

1. Sign up with GitHub
2. New Project → Import
3. Select: `13kashi13/cashora-7sem-`
4. **Set Root Directory:** `frontend`
5. Deploy
6. **Copy your Vercel URL** (e.g., `https://cashora.vercel.app`)

### 4️⃣ Update Backend CORS

Go back to Railway:

1. Open your backend project
2. Variables tab
3. Add/Update:
   ```
   FRONTEND_URL=https://YOUR-VERCEL-URL.vercel.app
   CORS_ORIGIN=https://YOUR-VERCEL-URL.vercel.app
   ```
4. Redeploy

---

## 🔑 Environment Variables

### Backend (Railway)

**Required:**
```env
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGIN=https://your-frontend.vercel.app
SESSION_SECRET=generate-32-char-random-string
SUPABASE_URL=https://jeyqjgmypryfspvrfcmm.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpleXFqZ215cHJ5ZnNwdnJmY21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMjQ4MzksImV4cCI6MjExMDYwMDgzOX0.tNgiM-PdTeLaJWb6nUDHlXFN2rTvXEhVqo5e5nHmJ80
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpleXFqZ215cHJ5ZnNwdnJmY21tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NTAyNDgzOSwiZXhwIjoyMTEwNjAwODM5fQ.AeKlYlaQXc7fMCdMFg70avQThFU3aOp6swotpw5nNyw
```

**Optional (but recommended):**
```env
N8N_WEBHOOK_URL=https://felixfelix.app.n8n.cloud/webhook/89093ed9-5a7c-4f9b-a9a5-6c27045e0f2d
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
INSTAGRAM_ACCESS_TOKEN=your-instagram-token
THREADS_ACCESS_TOKEN=your-threads-token
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
PIXABAY_API_KEY=your-pixabay-key
```

### Frontend (Vercel)

No environment variables needed if you update `env.js` directly.

**Alternative:** Add in Vercel dashboard:
```env
VITE_API_BASE_URL=https://your-backend.railway.app
```

---

## ✅ Testing Your Deployment

### 1. Test Backend

```bash
curl https://your-backend.railway.app/auth/user
```

Should return:
```json
{"loggedIn":false}
```

### 2. Test Frontend

1. Visit: `https://your-frontend.vercel.app`
2. Open browser console (F12)
3. Look for: `✅ Cashora API configured`
4. Click "Sign In"
5. Try logging in
6. Check dashboard loads

---

## 🐛 Troubleshooting

### CORS Error

**Symptom:** Console shows CORS policy error

**Fix:**
1. Check `FRONTEND_URL` in Railway matches Vercel URL exactly
2. Ensure no trailing slashes
3. Redeploy backend after changing

### Session Not Working

**Symptom:** Login succeeds but user not logged in

**Fix:**
1. Verify `SESSION_SECRET` is set in Railway
2. Check cookies are enabled in browser
3. Ensure HTTPS (automatic on Railway/Vercel)

### API Calls Fail

**Symptom:** Network errors, 404s

**Fix:**
1. Check `frontend/env.js` has correct Railway URL
2. Verify backend is running in Railway dashboard
3. Check Railway logs for errors

### Backend Crashes

**Check Railway logs:**
1. Go to Railway dashboard
2. Click on your backend project
3. Click "Deployments" → Latest deployment
4. Check logs for errors
5. Verify all required env vars are set

---

## 📋 Post-Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] Backend URL copied
- [ ] `frontend/env.js` updated with backend URL
- [ ] Changes committed and pushed to GitHub
- [ ] Frontend deployed to Vercel
- [ ] Vercel URL copied
- [ ] Backend `FRONTEND_URL` and `CORS_ORIGIN` updated
- [ ] Backend redeployed
- [ ] Backend API test passes (curl)
- [ ] Frontend loads without errors
- [ ] Login works
- [ ] Dashboard accessible
- [ ] Session persists across pages
- [ ] File upload works
- [ ] All features tested

---

## 🎨 Optional: Custom Domains

### Vercel Custom Domain

1. Go to Vercel dashboard
2. Select your project
3. Settings → Domains
4. Add your domain
5. Update DNS records as instructed
6. Update backend `FRONTEND_URL` with new domain

### Railway Custom Domain

1. Go to Railway dashboard
2. Select your backend
3. Settings → Domains
4. Add custom domain
5. Update DNS records
6. Update frontend `env.js` with new domain

---

## 📞 Support

### Logs

**Backend (Railway):**
- Railway Dashboard → Your Project → Deployments → View Logs

**Frontend (Vercel):**
- Vercel Dashboard → Your Project → Deployments → View Function Logs

### Common Issues

1. **"Cannot read properties of undefined"**
   - Frontend `config.js` not loading
   - Check script tags in HTML

2. **"Failed to fetch"**
   - Backend not accessible
   - Check Railway deployment status

3. **"Network Error"**
   - CORS misconfigured
   - Check `CORS_ORIGIN` matches frontend URL

### Getting Help

1. Check Railway logs for backend errors
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Test backend API with curl
5. Check Network tab in browser DevTools

---

## 🎯 Architecture Overview

```
Frontend (Vercel)          Backend (Railway)        Database (Supabase)
     │                           │                        │
     │    API Requests           │                        │
     ├──────────────────────────>│                        │
     │   (with credentials)       │    Database Queries   │
     │                           ├───────────────────────>│
     │                           │                        │
     │    JSON Response          │    Query Results       │
     │<──────────────────────────┤<───────────────────────┤
     │                           │                        │
```

**Frontend:**
- Static HTML/CSS/JS
- Served by Vercel CDN
- Fast global delivery

**Backend:**
- Express.js API server
- Hosted on Railway
- Handles auth, database, uploads
- Runs background scheduler

**Database:**
- PostgreSQL on Supabase
- Stores users, content, schedules
- Real-time updates

---

## ✨ Features Available

✅ User authentication
✅ Session management
✅ File uploads
✅ Content library
✅ Post scheduling
✅ AI caption improvement
✅ YouTube integration
✅ Instagram integration  
✅ Threads integration
✅ Twitter integration
✅ Bluesky integration
✅ n8n webhooks
✅ Analytics dashboard
✅ Automation settings
✅ Background post scheduler

---

## 📚 Documentation

- **Backend API:** `backend/README.md`
- **Frontend Setup:** `frontend/README.md`
- **Complete Guide:** `RESTRUCTURE_COMPLETE.md`
- **Environment Vars:** `backend/.env.example`, `frontend/.env.example`

---

**Your Cashora application is production-ready!** 🎉

Follow the 4 steps above and you'll be live in ~15 minutes.
