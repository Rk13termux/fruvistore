import { defineConfig } from 'vite'
import { copyFileSync, cpSync, existsSync, mkdirSync } from 'fs'
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
        try {
          // Copy entire admin folder to dist
          const adminSrc = 'admin'
          const adminDest = 'dist/admin'
          
          if (!existsSync(adminDest)) {
            mkdirSync(adminDest, { recursive: true })
          }
          
          cpSync(adminSrc, adminDest, { recursive: true })
          console.log('✅ Admin folder copied to dist/admin/')
          
          // Copy scripts folder (needed for admin dashboard)
          const scriptsSrc = 'scripts'
          const scriptsDest = 'dist/scripts'
          
          if (existsSync(scriptsSrc)) {
            cpSync(scriptsSrc, scriptsDest, { recursive: true })
            console.log('✅ Scripts folder copied to dist/scripts/')
          }
          
          // Copy styles folder (needed for admin)
          const stylesSrc = 'styles'
          const stylesDest = 'dist/styles'
          
          if (existsSync(stylesSrc)) {
            cpSync(stylesSrc, stylesDest, { recursive: true })
            console.log('✅ Styles folder copied to dist/styles/')
          }
          
          // Copy _redirects file (for Netlify compatibility)
          if (existsSync('_redirects')) {
            copyFileSync('_redirects', 'dist/_redirects')
            console.log('✅ _redirects copied to dist/')
          }
          
          // Copy CNAME file (for GitHub Pages custom domain)
          if (existsSync('CNAME')) {
            copyFileSync('CNAME', 'dist/CNAME')
            console.log('✅ CNAME copied to dist/')
          }
          
          // Copy .nojekyll (for GitHub Pages)
          if (existsSync('.nojekyll')) {
            copyFileSync('.nojekyll', 'dist/.nojekyll')
            console.log('✅ .nojekyll copied to dist/')
          }
          
        } catch (error) {
          console.error('❌ Error copying files:', error)
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
