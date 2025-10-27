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
  VITE_SUPABASE_SERVICE_ROLE_KEY: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  VITE_SUPABASE_PRODUCTS_URL: process.env.VITE_SUPABASE_PRODUCTS_URL,
  VITE_SUPABASE_PRODUCTS_ANON_KEY: process.env.VITE_SUPABASE_PRODUCTS_ANON_KEY,
  VITE_SUPABASE_PRODUCTS_SERVICE_ROLE_KEY: process.env.VITE_SUPABASE_PRODUCTS_SERVICE_ROLE_KEY,
  VITE_GROQ_API_KEY: process.env.VITE_GROQ_API_KEY,
  VITE_ADMIN_USER: process.env.VITE_ADMIN_USER,
  VITE_ADMIN_PASSWORD: process.env.VITE_ADMIN_PASSWORD
}
const allEnvVars = { ...envFileVars, ...envLocalVars, ...systemEnvVars }

console.log('🔍 Fuentes de variables encontradas:')
console.log('📄 .env:', Object.keys(envFileVars).length > 0 ? '✅ Presente' : '❌ Ausente')
console.log('📄 .env.local:', Object.keys(envLocalVars).length > 0 ? '✅ Presente' : '❌ Ausente')
console.log('🖥️ Variables de sistema:', Object.values(systemEnvVars).some(v => v) ? '✅ Presentes' : '❌ Ausentes')

const envVars = {
  VITE_SUPABASE_URL: systemEnvVars.VITE_SUPABASE_URL || envFileVars.VITE_SUPABASE_URL || 'https://ipjkpgmptexkhilrjnsl.supabase.co',
  VITE_SUPABASE_ANON_KEY: systemEnvVars.VITE_SUPABASE_ANON_KEY || envFileVars.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key',
  VITE_SUPABASE_SERVICE_ROLE_KEY: systemEnvVars.VITE_SUPABASE_SERVICE_ROLE_KEY || envFileVars.VITE_SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key',
  VITE_SUPABASE_PRODUCTS_URL: systemEnvVars.VITE_SUPABASE_PRODUCTS_URL || envFileVars.VITE_SUPABASE_PRODUCTS_URL || 'https://xujenwuefrgxfsiqjqhl.supabase.co',
  VITE_SUPABASE_PRODUCTS_ANON_KEY: systemEnvVars.VITE_SUPABASE_PRODUCTS_ANON_KEY || envFileVars.VITE_SUPABASE_PRODUCTS_ANON_KEY || 'your-products-anon-key',
  VITE_SUPABASE_PRODUCTS_SERVICE_ROLE_KEY: systemEnvVars.VITE_SUPABASE_PRODUCTS_SERVICE_ROLE_KEY || envFileVars.VITE_SUPABASE_PRODUCTS_SERVICE_ROLE_KEY || 'your-products-service-key',
  VITE_GROQ_API_KEY: systemEnvVars.VITE_GROQ_API_KEY || envFileVars.VITE_GROQ_API_KEY || 'placeholder-groq-api-key',
  VITE_ADMIN_USER: systemEnvVars.VITE_ADMIN_USER || envFileVars.VITE_ADMIN_USER || 'admin_user',
  VITE_ADMIN_PASSWORD: systemEnvVars.VITE_ADMIN_PASSWORD || envFileVars.VITE_ADMIN_PASSWORD || 'admin_password'
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
  VITE_SUPABASE_URL: systemEnvVars.VITE_SUPABASE_URL ? 'process.env' : envFileVars.VITE_SUPABASE_URL ? '.env' : 'default',
  VITE_SUPABASE_ANON_KEY: systemEnvVars.VITE_SUPABASE_ANON_KEY ? 'process.env' : envFileVars.VITE_SUPABASE_ANON_KEY ? '.env' : 'default',
  VITE_SUPABASE_PRODUCTS_URL: systemEnvVars.VITE_SUPABASE_PRODUCTS_URL ? 'process.env' : envFileVars.VITE_SUPABASE_PRODUCTS_URL ? '.env' : 'default',
  VITE_SUPABASE_PRODUCTS_ANON_KEY: systemEnvVars.VITE_SUPABASE_PRODUCTS_ANON_KEY ? 'process.env' : envFileVars.VITE_SUPABASE_PRODUCTS_ANON_KEY ? '.env' : 'default',
  VITE_GROQ_API_KEY: systemEnvVars.VITE_GROQ_API_KEY ? 'process.env' : envFileVars.VITE_GROQ_API_KEY ? '.env' : 'default'
})

// Write back to index.html
fs.writeFileSync(indexPath, htmlContent)

// Also inject variables into secure-access.html for admin panel
const secureAccessPath = path.join(rootDir, 'secure-access.html')
if (fs.existsSync(secureAccessPath)) {
  let secureHtmlContent = fs.readFileSync(secureAccessPath, 'utf8')
  
  // Only inject admin variables for security
  const adminEnvVars = {
    VITE_ADMIN_USER: envVars.VITE_ADMIN_USER,
    VITE_ADMIN_PASSWORD: envVars.VITE_ADMIN_PASSWORD
  }
  
  // Check if __ENV__ script already exists in secure-access.html
  if (secureHtmlContent.includes('window.__ENV__')) {
    // Replace existing __ENV__ block
    secureHtmlContent = secureHtmlContent.replace(
      /window\.__ENV__\s*=\s*{[\s\S]*?};/g, 
      `window.__ENV__ = ${JSON.stringify(adminEnvVars, null, 8)};`
    )
  } else {
    // Insert new __ENV__ block after <head>
    const adminScript = `    <script>
    // Variables de entorno inyectadas
    window.__ENV__ = ${JSON.stringify(adminEnvVars, null, 8)};
    </script>`
    secureHtmlContent = secureHtmlContent.replace('</head>', `${adminScript}\n    </head>`)
  }
  
  fs.writeFileSync(secureAccessPath, secureHtmlContent)
  console.log('✅ Admin variables injected into secure-access.html')
}

console.log('✅ Build preparation completed')
