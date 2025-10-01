#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

// Function to read .env.local file
function readEnvFile() {
  const envPath = path.join(rootDir, '.env.local')
  if (!fs.existsSync(envPath)) return {}

  const content = fs.readFileSync(envPath, 'utf8')
  const env = {}

  content.split('\n').forEach(line => {
    const [key, ...values] = line.split('=')
    if (key && values.length) {
      env[key] = values.join('=')
    }
  })

  return env
}

// Read environment variables from multiple sources
const envFileVars = readEnvFile()
const envVars = {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || envFileVars.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://your-project.supabase.co',
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || envFileVars.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'your-anon-key',
  VITE_GROQ_API_KEY: process.env.VITE_GROQ_API_KEY || envFileVars.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY || 'placeholder-key-for-github-pages'
}

// Read index.html
const indexPath = path.join(rootDir, 'index.html')
let htmlContent = fs.readFileSync(indexPath, 'utf8')

// Check if __ENV__ script already exists
if (htmlContent.includes('window.__ENV__')) {
  console.log('ℹ️  Environment variables already injected, skipping...')
  process.exit(0)
}

// Inject environment variables as script tags
const envScript = `
<script>
  window.__ENV__ = ${JSON.stringify(envVars, null, 2)};
</script>
`

// Insert before closing </head> tag
htmlContent = htmlContent.replace('</head>', `${envScript}\n  </head>`)

console.log('✅ Environment variables injected into HTML')
console.log('📋 Variables inyectadas:', Object.keys(envVars))
console.log('🔍 Fuentes utilizadas:', {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'process.env' : envFileVars.VITE_SUPABASE_URL ? '.env.local' : 'default',
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ? 'process.env' : envFileVars.VITE_SUPABASE_ANON_KEY ? '.env.local' : 'default',
  VITE_GROQ_API_KEY: process.env.VITE_GROQ_API_KEY ? 'process.env' : envFileVars.VITE_GROQ_API_KEY ? '.env.local' : 'default'
})

// Write back to index.html
fs.writeFileSync(indexPath, htmlContent)

console.log('✅ Build preparation completed')
