import { defineConfig } from 'vite'

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  // Usar base path solo en producción para GitHub Pages
  base: isProduction ? '/fruvistore/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
