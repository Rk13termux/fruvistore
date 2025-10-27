#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

// Function to read .env file
function readEnvFile(filename) {
  const envPath = path.join(rootDir, filename)
  if (!fs.existsSync(envPath)) return {}

  const content = fs.readFileSync(envPath, 'utf8')
  const env = {}

  content.split('\n').forEach(line => {
    // Ignorar comentarios y líneas vacías
    if (line.trim().startsWith('#') || line.trim() === '') return

    const [key, ...values] = line.split('=')
    if (key && values.length) {
      env[key] = values.join('=')
    }
  })

  return env
}

// Read environment variables from multiple sources (más robusto para producción)
const envFileVars = readEnvFile('.env')
const envLocalVars = readEnvFile('.env.local')
const systemEnvVars = {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
  VITE_SUPABASE_PRODUCTS_URL: process.env.VITE_SUPABASE_PRODUCTS_URL,
  VITE_SUPABASE_PRODUCTS_ANON_KEY: process.env.VITE_SUPABASE_PRODUCTS_ANON_KEY,
  VITE_GROQ_API_KEY: process.env.VITE_GROQ_API_KEY
}
const allEnvVars = { ...envFileVars, ...envLocalVars, ...systemEnvVars }

console.log('🔍 Fuentes de variables encontradas:')
console.log('📄 .env:', Object.keys(envFileVars).length > 0 ? '✅ Presente' : '❌ Ausente')
console.log('📄 .env.local:', Object.keys(envLocalVars).length > 0 ? '✅ Presente' : '❌ Ausente')
console.log('🖥️ Variables de sistema:', Object.values(systemEnvVars).some(v => v) ? '✅ Presentes' : '❌ Ausentes')

const envVars = {
  VITE_SUPABASE_URL: systemEnvVars.VITE_SUPABASE_URL || 'https://ipjkpgmptexkhilrjnsl.supabase.co',
  VITE_SUPABASE_ANON_KEY: systemEnvVars.VITE_SUPABASE_ANON_KEY || 'your-anon-key',
  VITE_GROQ_API_KEY: systemEnvVars.VITE_GROQ_API_KEY || 'placeholder-key-for-github-pages',
  VITE_SUPABASE_PRODUCTS_URL: systemEnvVars.VITE_SUPABASE_PRODUCTS_URL || 'https://xujenwuefrgxfsiqjqhl.supabase.co',
  VITE_SUPABASE_PRODUCTS_ANON_KEY: systemEnvVars.VITE_SUPABASE_PRODUCTS_ANON_KEY || 'your-anon-key'
}

console.log('📋 Variables finales a inyectar:')
console.log('URL:', envVars.VITE_SUPABASE_URL)
console.log('KEY presente:', !!envVars.VITE_SUPABASE_ANON_KEY)
console.log('GROQ presente:', !!envVars.VITE_GROQ_API_KEY)

// Read index.html
const indexPath = path.join(rootDir, 'index.html')
let htmlContent = fs.readFileSync(indexPath, 'utf8')

// Check if __ENV__ script already exists
if (htmlContent.includes('window.__ENV__')) {
  // Always replace all existing __ENV__ blocks to avoid duplicates
  console.log('🔄 Reemplazando todos los bloques __ENV__ existentes...');
  // Remove all existing __ENV__ script blocks first
  htmlContent = htmlContent.replace(/<script>[\s\S]*?window\.__ENV__\s*=[\s\S]*?<\/script>/g, '');
  // Then add the new one
  const envScript = `<script>
  window.__ENV__ = ${JSON.stringify(envVars, null, 2)};
</script>`;
  // Insert before closing </head> tag
  htmlContent = htmlContent.replace('</head>', `${envScript}\n  </head>`);
}
console.log('✅ Environment variables injected into HTML')
console.log('📋 Variables inyectadas:', Object.keys(envVars))
console.log('🔍 Fuentes utilizadas:', {
  VITE_SUPABASE_URL: systemEnvVars.VITE_SUPABASE_URL ? 'process.env' : 'default',
  VITE_SUPABASE_ANON_KEY: systemEnvVars.VITE_SUPABASE_ANON_KEY ? 'process.env' : 'default',
  VITE_SUPABASE_PRODUCTS_URL: systemEnvVars.VITE_SUPABASE_PRODUCTS_URL ? 'process.env' : 'default',
  VITE_SUPABASE_PRODUCTS_ANON_KEY: systemEnvVars.VITE_SUPABASE_PRODUCTS_ANON_KEY ? 'process.env' : 'default',
  VITE_GROQ_API_KEY: systemEnvVars.VITE_GROQ_API_KEY ? 'process.env' : 'default'
})

// Write back to index.html
fs.writeFileSync(indexPath, htmlContent)

console.log('✅ Build preparation completed')
