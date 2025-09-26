#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

// Read environment variables
const envVars = {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key',
  VITE_GROQ_API_KEY: process.env.VITE_GROQ_API_KEY || 'placeholder-key-for-github-pages'
}

// Read index.html
const indexPath = path.join(rootDir, 'index.html')
let htmlContent = fs.readFileSync(indexPath, 'utf8')

// Inject environment variables as script tags
const envScript = `
<script>
  window.__ENV__ = ${JSON.stringify(envVars, null, 2)};
</script>
`

// Insert before closing </head> tag
htmlContent = htmlContent.replace('</head>', `${envScript}\n  </head>`)

console.log('✅ Environment variables injected into HTML')

// Write back to index.html
fs.writeFileSync(indexPath, htmlContent)

console.log('✅ Build preparation completed')
