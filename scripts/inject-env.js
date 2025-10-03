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
  VITE_GROQ_API_KEY: process.env.VITE_GROQ_API_KEY
}
const allEnvVars = { ...envFileVars, ...envLocalVars, ...systemEnvVars }

console.log('🔍 Fuentes de variables encontradas:')
console.log('📄 .env:', Object.keys(envFileVars).length > 0 ? '✅ Presente' : '❌ Ausente')
console.log('📄 .env.local:', Object.keys(envLocalVars).length > 0 ? '✅ Presente' : '❌ Ausente')
console.log('🖥️ Variables de sistema:', Object.keys(systemEnvVars).length > 0 ? '✅ Presentes' : '❌ Ausentes')

const envVars = {
  VITE_SUPABASE_URL: allEnvVars.VITE_SUPABASE_URL || 'https://ipjkpgmptexkhilrjnsl.supabase.co',
  VITE_SUPABASE_ANON_KEY: allEnvVars.VITE_SUPABASE_ANON_KEY || 'your-anon-key',
  VITE_GROQ_API_KEY: allEnvVars.VITE_GROQ_API_KEY || 'placeholder-key-for-github-pages'
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
  // Verificar si contiene placeholders o si necesitamos actualizar
  if (htmlContent.includes('${{') || htmlContent.includes('secrets.') || htmlContent.includes('your-anon-key') || htmlContent.includes('ipjkpgmptexkhilrjnsl.supabase.co')) {
    console.log('🔄 Placeholders detectados, reemplazando...');
    // Reemplazar completamente el bloque existente
    const oldScriptPattern = /<script>\s*window\.__ENV__\s*=\s*{[^}]+};\s*<\/script>/g;
    const newScript = `<script>
  window.__ENV__ = ${JSON.stringify(envVars, null, 2)};
</script>`;
    htmlContent = htmlContent.replace(oldScriptPattern, newScript);
  } else {
    // Verificar si las variables actuales son diferentes a las del .env
    const currentEnvMatch = htmlContent.match(/window\.__ENV__\s*=\s*({[^}]+})/);
    if (currentEnvMatch) {
      try {
        const currentEnv = JSON.parse(currentEnvMatch[1].replace(/'/g, '"'));
        const needsUpdate = JSON.stringify(currentEnv) !== JSON.stringify(envVars);

        if (needsUpdate) {
          console.log('🔄 Variables diferentes detectadas, actualizando...');
          const oldScriptPattern = /<script>\s*window\.__ENV__\s*=\s*{[^}]+};\s*<\/script>/g;
          const newScript = `<script>
  window.__ENV__ = ${JSON.stringify(envVars, null, 2)};
</script>`;
          htmlContent = htmlContent.replace(oldScriptPattern, newScript);
        } else {
          console.log('ℹ️ Variables ya están actualizadas, skipping...');
          process.exit(0);
        }
      } catch (e) {
        console.log('🔄 Error parseando variables actuales, reemplazando...');
        const oldScriptPattern = /<script>\s*window\.__ENV__\s*=\s*{[^}]+};\s*<\/script>/g;
        const newScript = `<script>
  window.__ENV__ = ${JSON.stringify(envVars, null, 2)};
</script>`;
        htmlContent = htmlContent.replace(oldScriptPattern, newScript);
      }
    }
  }
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
