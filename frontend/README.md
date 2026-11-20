# Cashora Frontend

Static frontend for Cashora AI content automation platform.

## Structure

```
frontend/
├── index.html              # Landing page
├── login/                  # Authentication page
├── dashboard/             # Main dashboard interface  
├── contact/               # Contact page
├── venue/                 # Venue page
├── team/                  # Team page
├── terms-and-conditions/  # Legal pages
├── workflow/              # Workflow demo
├── 404/                   # Error page
├── assets/                # Static assets (CSS, JS, images)
├── env.js                 # Environment configuration
├── config.js              # API endpoint configuration
└── README.md              # This file
```

## Configuration

### Set Backend URL

Edit `env.js`:

```javascript
// For local development
window.CASHORA_API_URL = 'http://localhost:4000';

// For production
window.CASHORA_API_URL = 'https://your-backend.railway.app';
```

### API Configuration

All API endpoints are centralized in `config.js`. The frontend automatically uses the `CASHORA_API_URL` from `env.js`.

## Development

### Local Development

1. Set backend URL in `env.js`
2. Serve with any static file server:

```bash
# Using Python
python3 -m http.server 3000

# Using Node http-server
npx http-server -p 3000

# Using PHP
php -S localhost:3000
```

3. Open http://localhost:3000

### With Live Reload

```bash
npx live-server --port=3000
```

## Deployment to Vercel

### Method 1: Via Vercel CLI

```bash
npm install -g vercel
vercel
```

### Method 2: Via Vercel Dashboard

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Set **Root Directory** to `frontend`
5. Deploy!

### Environment Variables

In Vercel dashboard, add:

```
VITE_API_BASE_URL=https://your-backend.railway.app
```

Then update `env.js` to use this:

```javascript
window.CASHORA_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-backend.railway.app';
```

## API Integration

### Making API Calls

Use the global `CASHORA_API` helper:

```javascript
// GET request
const response = await window.CASHORA_API.get(window.CASHORA_CONFIG.auth.user);
const data = await response.json();

// POST request
const response = await window.CASHORA_API.post(
  window.CASHORA_CONFIG.auth.login,
  { email, password }
);

// With FormData
const formData = new FormData();
formData.append('video', file);
const response = await window.CASHORA_API.post(
  window.CASHORA_CONFIG.upload.video,
  formData
);
```

### Important: Credentials

All API calls must include `credentials: 'include'` to send cookies for session management. This is automatically handled by `CASHORA_API`.

## Pages

### Landing Page (`index.html`)
- Homepage with company information
- Call-to-action buttons
- Navigation to other pages

### Login (`login/index.html`)
- Email/password authentication
- Redirects to dashboard on success
- Session check on load

### Dashboard (`dashboard/index.html`)
- Multi-tab interface:
  - **Dashboard**: Overview and stats
  - **Create**: Upload and schedule content
  - **Library**: View uploaded content
  - **Analytics**: Platform performance
  - **Distribution**: Manage social accounts
  - **Settings**: User preferences

### Other Pages
- Contact, Team, Venue, Terms, Workflow pages
- All pages use same design system

## Customization

### Update Backend URL

Production: Edit `env.js`

```javascript
window.CASHORA_API_URL = 'https://cashora-backend.railway.app';
```

### Add New API Endpoint

Edit `config.js`:

```javascript
window.CASHORA_CONFIG = {
  // ... existing endpoints
  myNewEndpoint: {
    list: `${API_BASE_URL}/api/my-endpoint`,
    create: `${API_BASE_URL}/api/my-endpoint`,
    update: (id) => `${API_BASE_URL}/api/my-endpoint/${id}`
  }
};
```

### Update Styling

Styles are embedded in each HTML file. Look for `<style>` tags.

## Troubleshooting

### CORS Errors

Make sure:
1. Backend has CORS enabled for your frontend domain
2. `credentials: 'include'` is set in fetch requests
3. Backend `CORS_ORIGIN` matches frontend URL

### Session Not Persisting

Check:
1. Cookies are enabled in browser
2. Backend session configuration is correct
3. Frontend and backend URLs match CORS settings

### API Calls Fail

Verify:
1. `env.js` has correct backend URL
2. Backend server is running
3. Network tab shows correct request URL
4. Backend logs show the request

### Login Redirects to Wrong Page

Update redirect URLs in login page after successful login.

## Assets

Static assets (images, icons, JS bundles) are served from:
- `/assets/js/` - JavaScript bundles
- CDN URLs for external resources

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Notes

- No API keys or secrets in frontend code
- All authentication via session cookies
- HTTPS required in production
- Content Security Policy headers recommended

## Production Checklist

- [ ] Update `env.js` with production backend URL
- [ ] Test all pages load correctly
- [ ] Test login/logout flow
- [ ] Verify dashboard functionality
- [ ] Test on mobile devices
- [ ] Check browser console for errors
- [ ] Enable HTTPS
- [ ] Set up custom domain (optional)

## License

ISC
