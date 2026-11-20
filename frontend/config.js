// API Configuration
// This file centralizes all API endpoint URLs for easy environment switching

const API_BASE_URL = typeof window.CASHORA_API_URL === 'string' ? window.CASHORA_API_URL : 'http://localhost:4000';

// Export configuration
window.CASHORA_CONFIG = {
  API_BASE_URL: API_BASE_URL,
  
  // API Endpoints
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    user: `${API_BASE_URL}/auth/user`,
    logout: `${API_BASE_URL}/auth/logout`
  },
  
  user: {
    profile: `${API_BASE_URL}/api/user/profile`
  },
  
  upload: {
    video: `${API_BASE_URL}/api/upload`
  },
  
  posting: {
    status: `${API_BASE_URL}/api/posting-status`
  },
  
  schedule: {
    post: `${API_BASE_URL}/api/schedule-post`,
    list: `${API_BASE_URL}/api/scheduled-posts`,
    trigger: (id) => `${API_BASE_URL}/api/scheduled-posts/${id}/trigger`,
    delete: (id) => `${API_BASE_URL}/api/scheduled-posts/${id}`
  },
  
  library: {
    list: `${API_BASE_URL}/api/library`,
    create: `${API_BASE_URL}/api/library`,
    update: (id) => `${API_BASE_URL}/api/library/${id}`,
    delete: (id) => `${API_BASE_URL}/api/library/${id}`
  },
  
  automation: {
    settings: `${API_BASE_URL}/api/automation-settings`
  },
  
  ai: {
    improveCaption: `${API_BASE_URL}/api/ai/improve-caption`
  },
  
  youtube: {
    auth: `${API_BASE_URL}/auth/youtube`,
    callback: `${API_BASE_URL}/auth/youtube/callback`,
    disconnect: `${API_BASE_URL}/auth/youtube/disconnect`,
    status: `${API_BASE_URL}/api/youtube/status`,
    analytics: `${API_BASE_URL}/api/analytics/youtube`
  },
  
  instagram: {
    status: `${API_BASE_URL}/api/instagram/status`,
    disconnect: `${API_BASE_URL}/auth/instagram/disconnect`,
    analytics: `${API_BASE_URL}/api/analytics/instagram`
  },
  
  threads: {
    status: `${API_BASE_URL}/api/threads/status`,
    disconnect: `${API_BASE_URL}/auth/threads/disconnect`,
    analytics: `${API_BASE_URL}/api/analytics/threads`
  },
  
  twitter: {
    status: `${API_BASE_URL}/api/twitter/status`,
    analytics: `${API_BASE_URL}/api/analytics/twitter`
  },
  
  bluesky: {
    post: `${API_BASE_URL}/api/bluesky/post`,
    sessionInject: `${API_BASE_URL}/api/bluesky/session/inject`,
    rateLimit: `${API_BASE_URL}/api/bluesky/rate-limit`,
    status: `${API_BASE_URL}/api/bluesky/status`,
    analytics: `${API_BASE_URL}/api/analytics/bluesky`
  },
  
  dashboard: {
    overview: `${API_BASE_URL}/api/dashboard/overview`
  }
};

// Helper function for making API calls with credentials
window.CASHORA_API = {
  async fetch(url, options = {}) {
    const defaultOptions = {
      credentials: 'include', // Important: sends cookies for session
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete defaultOptions.headers['Content-Type'];
    }
    
    try {
      const response = await fetch(url, defaultOptions);
      return response;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  },
  
  async get(url) {
    return this.fetch(url, { method: 'GET' });
  },
  
  async post(url, data) {
    return this.fetch(url, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data)
    });
  },
  
  async put(url, data) {
    return this.fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  async delete(url) {
    return this.fetch(url, { method: 'DELETE' });
  }
};

console.log('✅ Cashora API configured:', API_BASE_URL);
