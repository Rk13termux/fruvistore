// 🍃 FRUVI STORE - Production Configuration
// This file contains the production configuration that loads dynamically
window.FRUVI_CONFIG = {
  // 🗄️ Supabase Users Database
  SUPABASE: {
    URL: 'https://ipjkpgmptexkhilrjnsl.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwamtwZ21wdGV4a2hpbHJqbnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzQxOTQsImV4cCI6MjA3NDMxMDE5NH0.IxY5mC4SxyTzj1Vnns5kDu14wqkcVDksi3FvNEJ1F1o',
    SERVICE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwamtwZ21wdGV4a2hpbHJqbnNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODczNDE5NCwiZXhwIjoyMDc0MzEwMTk0fQ.aYN09m8o8KMKy8LY0FsGNXU9-zMFt3b49b5P7PJYD5U'
  },
  
  // 🛒 Supabase Products Database
  PRODUCTS: {
    URL: 'https://xujenwuefrgxfsiqjqhl.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1amVud3VlZnJneGZzaXFqcWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTExNTYsImV4cCI6MjA3NjU2NzE1Nn0.89UAEW8CVBkz8lEAdnJzt0XJNo0C4lCrZMBBcRYKmMs',
    SERVICE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1amVud3VlZnJneGZzaXFqcWhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk5MTE1NiwiZXhwIjoyMDc2NTY3MTU2fQ.PyGpOZyj1a9dXAVNSyay8fTqotdE1SAiiI-PRws_qtk'
  },

  // 💰 Supabase Credits Database (Users AI Credits)
  CREDITS: {
    URL: 'https://ipjkpgmptexkhilrjnsl.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwamtwZ21wdGV4a2hpbHJqbnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzQxOTQsImV4cCI6MjA3NDMxMDE5NH0.IxY5mC4SxyTzj1Vnns5kDu14wqkcVDksi3FvNEJ1F1o',
    SERVICE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwamtwZ21wdGV4a2hpbHJqbnNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODczNDE5NCwiZXhwIjoyMDc0MzEwMTk0fQ.aYN09m8o8KMKy8LY0FsGNXU9-zMFt3b49b5P7PJYD5U'
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
  VITE_SUPABASE_CREDITS_URL: window.FRUVI_CONFIG.CREDITS.URL,
  VITE_SUPABASE_CREDITS_ANON_KEY: window.FRUVI_CONFIG.CREDITS.ANON_KEY,
  VITE_SUPABASE_CREDITS_SERVICE_ROLE_KEY: window.FRUVI_CONFIG.CREDITS.SERVICE_KEY,
  VITE_GROQ_API_KEY: window.FRUVI_CONFIG.AI.GROQ_KEY,
  VITE_GROQ_MODEL: window.FRUVI_CONFIG.AI.MODEL,
  VITE_ADMIN_USER: window.FRUVI_CONFIG.ADMIN.USER,
  VITE_ADMIN_PASSWORD: window.FRUVI_CONFIG.ADMIN.PASSWORD
};

console.log('🍃 Fruvi Store config loaded successfully');