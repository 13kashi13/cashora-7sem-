// Environment configuration
// Backend API URL for Cashora

// Production (Vercel): use same origin. vercel.json proxies /auth/* and /api/*
// to the Render backend, so the session cookie is first-party and isn't
// blocked by browsers' third-party cookie protections.
// Local development: talk to the backend directly.
var isLocal = ['localhost', '127.0.0.1'].indexOf(window.location.hostname) !== -1;
window.CASHORA_API_URL = isLocal && window.location.port !== '4000' ? 'http://localhost:4000' : '';
