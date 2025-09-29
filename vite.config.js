import { defineConfig } from 'vite'

export default defineConfig({
  base: '/fruvistore/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  publicDir: 'public', // Directorio público para assets estáticos
  define: {
    // Inyectar variables de entorno durante el build
    __VITE_SUPABASE_URL__: JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'),
    __VITE_SUPABASE_ANON_KEY__: JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'),
    __VITE_GROQ_API_KEY__: JSON.stringify(process.env.VITE_GROQ_API_KEY || 'placeholder-key-for-github-pages')
  }
})
