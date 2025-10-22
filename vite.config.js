import { defineConfig } from 'vite'

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  // Para dominio personalizado en GitHub Pages, usar base '/'
  base: '/',
  server: {
    // Configure middleware to serve CSS files directly without HMR injection
    middlewareMode: false,
    hmr: {
      // Disable HMR for CSS files to prevent JavaScript injection
      overlay: false
    }
  },
  css: {
    // Disable CSS injection into JS bundles in development
    devSourcemap: false
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Ensure CSS is extracted properly
    cssCodeSplit: true
  },
  // Configure static file serving
  publicDir: 'public',
  // Ensure proper MIME types and environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    // Inject Supabase environment variables for runtime access
    '__ENV__': {
      VITE_SUPABASE_URL: JSON.stringify(process.env.VITE_SUPABASE_URL || ''),
      VITE_SUPABASE_ANON_KEY: JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || ''),
      VITE_SUPABASE_PRODUCTS_URL: JSON.stringify(process.env.VITE_SUPABASE_PRODUCTS_URL || ''),
      VITE_SUPABASE_PRODUCTS_ANON_KEY: JSON.stringify(process.env.VITE_SUPABASE_PRODUCTS_ANON_KEY || ''),
      VITE_GROQ_API_KEY: JSON.stringify(process.env.VITE_GROQ_API_KEY || ''),
      VITE_ADMIN_API_KEY: JSON.stringify(process.env.VITE_ADMIN_API_KEY || '')
    }
  },
  // Load environment variables from .env file
  envPrefix: 'VITE_'
});
