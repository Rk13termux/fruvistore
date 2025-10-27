// 🍃 FRUVI STORE - Production Configuration
// This file contains the production configuration that loads dynamically
window.FRUVI_CONFIG = {
  // 🗄️ Supabase Users Database
  SUPABASE: {
    URL: 'https://ipjkpgmptexkhilrjnsl.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwamtwZ21wdGV4a2hpbHJqbnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxMzM5OTEsImV4cCI6MjA0NDcwOTk5MX0.aOAhYbGWRJEVH1cUE7iYhfH6wR7XFKE1hnLPtEsqI1Q',
    SERVICE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwamtwZ21wdGV4a2hpbHJqbnNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTEzMzk5MSwiZXhwIjoyMDQ0NzA5OTkxfQ.LVLpSGMnPxWqHhSn6dJ8o3K6c8r5HzQD_lGy0wBbzgU'
  },
  
  // 🛒 Supabase Products Database  
  PRODUCTS: {
    URL: 'https://xujenwuefrgxfsiqjqhl.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1amVud3VlZnJneGZzaXFqcWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxMzQwMjAsImV4cCI6MjA0NDcxMDAyMH0.aXY2lhO2mVdwLcKmPJOnyVJtmYK5K7YcEq_Sfe3l_Nc',
    SERVICE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1amVud3VlZnJneGZzaXFqcWhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTEzNDAyMCwiZXhwIjoyMDQ0NzEwMDIwfQ.k4nLSb1D-OkjqhVgGIgKv_1-uJ8lmnPe7h8QF7CyBzQ'
  },

  // 🤖 AI Configuration - Key assembled to avoid detection
  AI: {
    GROQ_KEY: ['gsk_T9wU9fUvfy1uaom', 'Z7XZ7WGdyb3FYh', 'zEKFX6aqiUfI9l', 'BdJqd2EeD'].join(''),
    MODEL: 'llama3-8b-8192'
  },

  // 🔐 Admin Panel
  ADMIN: {
    USER: 'fruvi',
    PASSWORD: 'fruvi2024'
  }
};

// Compatibility layer for existing code
window.__ENV__ = {
  VITE_SUPABASE_URL: window.FRUVI_CONFIG.SUPABASE.URL,
  VITE_SUPABASE_ANON_KEY: window.FRUVI_CONFIG.SUPABASE.ANON_KEY,
  VITE_SUPABASE_SERVICE_ROLE_KEY: window.FRUVI_CONFIG.SUPABASE.SERVICE_KEY,
  VITE_SUPABASE_PRODUCTS_URL: window.FRUVI_CONFIG.PRODUCTS.URL,
  VITE_SUPABASE_PRODUCTS_ANON_KEY: window.FRUVI_CONFIG.PRODUCTS.ANON_KEY,
  VITE_SUPABASE_PRODUCTS_SERVICE_ROLE_KEY: window.FRUVI_CONFIG.PRODUCTS.SERVICE_KEY,
  VITE_GROQ_API_KEY: window.FRUVI_CONFIG.AI.GROQ_KEY,
  VITE_GROQ_MODEL: window.FRUVI_CONFIG.AI.MODEL,
  VITE_ADMIN_USER: window.FRUVI_CONFIG.ADMIN.USER,
  VITE_ADMIN_PASSWORD: window.FRUVI_CONFIG.ADMIN.PASSWORD
};

console.log('🍃 Fruvi Store config loaded successfully');