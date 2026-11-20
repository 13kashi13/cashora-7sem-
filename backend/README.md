# Cashora Backend API

Express.js backend server for Cashora AI content automation platform.

## Features

- **Authentication**: Email/password login with session management
- **Content Library**: Store and manage video content
- **Scheduling**: Schedule posts across multiple platforms
- **AI Integration**: Caption improvement using LLM APIs
- **Platform Integrations**: YouTube, Instagram, Threads, Twitter, Bluesky
- **n8n Webhooks**: Automated workflow triggers
- **Supabase Database**: PostgreSQL backend

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
- Supabase URL and keys
- LLM API keys (OpenAI, Gemini, etc.)
- Social media platform tokens
- Session secret

### 3. Run Development Server

```bash
npm start
```

Or with auto-reload:

```bash
npm run dev
```

Server will start on `http://localhost:4000`

## API Endpoints

### Authentication

- `POST /auth/login` - Email/password login
- `GET /auth/user` - Get current user session
- `GET /auth/logout` - Logout and destroy session
- `POST /api/user/profile` - Update user profile

### Content Upload & Processing

- `POST /api/upload` - Upload video file (forwards to n8n)
- `POST /api/posting-status` - Receive posting status from n8n
- `GET /api/posting-status` - Get recent posting statuses

### Scheduling

- `POST /api/schedule-post` - Schedule a post
- `GET /api/scheduled-posts` - Get all scheduled posts
- `POST /api/scheduled-posts/:id/trigger` - Trigger post immediately
- `DELETE /api/scheduled-posts/:id` - Cancel scheduled post

### Content Library

- `GET /api/library` - Get library items
- `POST /api/library` - Add item to library
- `PUT /api/library/:id` - Update library item
- `DELETE /api/library/:id` - Delete library item

### Automation Settings

- `GET /api/automation-settings` - Get user automation preferences
- `POST /api/automation-settings` - Update automation settings

### AI Features

- `POST /api/ai/improve-caption` - Improve caption using LLM

### Platform Integrations

#### YouTube
- `GET /auth/youtube` - Start YouTube OAuth flow
- `GET /auth/youtube/callback` - OAuth callback
- `GET /auth/youtube/disconnect` - Disconnect YouTube
- `GET /api/youtube/status` - Check YouTube connection
- `GET /api/analytics/youtube` - Get YouTube analytics

#### Instagram
- `GET /api/instagram/status` - Check Instagram connection
- `GET /auth/instagram/disconnect` - Disconnect Instagram
- `GET /api/analytics/instagram` - Get Instagram analytics

#### Threads
- `GET /api/threads/status` - Check Threads connection
- `GET /auth/threads/disconnect` - Disconnect Threads
- `GET /api/analytics/threads` - Get Threads analytics

#### Twitter/X
- `GET /api/twitter/status` - Check Twitter connection
- `GET /api/analytics/twitter` - Get Twitter analytics

#### Bluesky
- `POST /api/bluesky/post` - Post to Bluesky
- `POST /api/bluesky/session/inject` - Inject Bluesky session
- `GET /api/bluesky/status` - Check Bluesky connection
- `GET /api/analytics/bluesky` - Get Bluesky analytics

### Analytics

- `GET /api/dashboard/overview` - Get dashboard overview stats

## Environment Variables

### Required

```env
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# Session
SESSION_SECRET=your-secret-32-char-minimum

# Frontend (for CORS)
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### Optional

```env
# LLM for Caption Improvement
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
GROQ_API_KEY=...

# Social Media
INSTAGRAM_ACCESS_TOKEN=...
THREADS_ACCESS_TOKEN=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Automation
N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/...
```

## Database Setup

Run the SQL script in Supabase:

```bash
cat SUPABASE_FUNCTIONS.sql
```

This creates:
- `users` table
- `library_items` table
- `scheduled_posts` table
- `posting_statuses` table
- `automation_settings` table
- `login()` function

## Deployment

### Railway

1. Create new project on Railway
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Add environment variables
5. Deploy!

Railway will automatically:
- Detect Node.js
- Run `npm install`
- Start with `npm start`

### Configuration for Production

```env
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGIN=https://your-frontend.vercel.app
SESSION_SECRET=generate-strong-random-secret
```

## File Uploads

Files are stored in `./uploads/` directory. For production:

1. Consider using Supabase Storage
2. Or integrate with S3/Cloudinary
3. Update `multer` configuration accordingly

## Background Scheduler

The server runs a background scheduler that:
- Checks for due posts every 10 seconds
- Triggers n8n webhook when time matches
- Updates post status in database
- Logs all activities

## Security Notes

- Never commit `.env` file
- Use strong `SESSION_SECRET` (32+ characters)
- Set `NODE_ENV=production` in production
- Enable `secure` cookies with HTTPS
- Restrict CORS origins in production
- Keep `SUPABASE_SERVICE_KEY` secret

## Development

### Hot Reload

```bash
npm run dev
```

### Test API

```bash
curl http://localhost:4000/auth/user
```

### Check Logs

```bash
tail -f server.log
```

## Troubleshooting

### CORS Errors
- Check `FRONTEND_URL` matches your frontend domain
- Verify `credentials: true` in frontend fetch

### Session Not Persisting
- Ensure cookies are enabled
- Check `sameSite` and `secure` settings
- Verify frontend sends `credentials: 'include'`

### Database Errors
- Check Supabase credentials
- Verify tables exist
- Check RLS policies

### File Upload Fails
- Ensure `uploads/` directory exists
- Check write permissions
- Verify n8n webhook URL

## Support

For issues or questions:
- Check the logs
- Review environment variables
- Verify database connection
- Test with Postman/curl

## License

ISC
