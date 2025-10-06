import { defineConfig } from 'vite'

export default defineConfig({
  // Usar base path solo en producción para GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/fruvistore/' : './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
