import { defineConfig } from 'vite'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

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
    cssCodeSplit: true,
    // Copy additional files to dist
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    },
    copyPublicDir: true
  },
  // Plugin to copy admin files after build
  plugins: [
    {
      name: 'copy-admin-files',
      writeBundle() {
        // Copy admin files to dist after build
        try {
          copyFileSync('admin-panel-secure.html', 'dist/admin-panel-secure.html')
          copyFileSync('secure-access.html', 'dist/secure-access.html')
          console.log('✅ Admin files copied to dist/')
        } catch (error) {
          console.error('❌ Error copying admin files:', error)
        }
      }
    }
  ],
  // Configure static file serving
  publicDir: 'public',
  // Ensure proper MIME types and environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  // Load environment variables from .env file
  envPrefix: 'VITE_'
});
