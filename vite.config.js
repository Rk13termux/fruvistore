import { defineConfig } from 'vite'

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  // Para dominio personalizado en GitHub Pages, usar base '/'
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
