#!/bin/bash

# Fruvi - Professional Setup Script
echo "🍎 Fruvi Professional Setup"
echo "=========================="

# Check if we're in the right directory
if [ ! -f "index.html" ] || [ ! -f "README.md" ]; then
    echo "❌ Error: Please run this script from the Fruvi project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Fruvi Professional Fruit Store"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Create deployment configuration
echo ""
echo "🚀 Creating deployment configuration..."

cat > .env.example << 'EOF'
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Groq AI Configuration
GROQ_API_KEY=your_groq_api_key_here

# Optional: Custom domain
CUSTOM_DOMAIN=your-domain.com
EOF

echo "✅ Created .env.example file"
echo "✅ Deployment configuration ready"

# Create Netlify configuration
cat > netlify.toml << 'EOF'
[build]
  publish = "."
  command = "echo 'Fruvi is ready for deployment!'"

[build.environment]
  NODE_VERSION = "18"

# Redirect rules for SPA
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
EOF

echo "✅ Created netlify.toml configuration"

# Create Vercel configuration
cat > vercel.json << 'EOF'
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
EOF

echo "✅ Created vercel.json configuration"

# Create LICENSE file
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2024 Fruvi - Professional Fruit Store

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

echo "✅ Created LICENSE file"

# Create GitHub workflow for automatic deployment
mkdir -p .github/workflows

cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to Netlify

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2
      with:
        publish-dir: '.'
        production-deploy: true
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: 'Deploy from GitHub Actions'
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
EOF

echo "✅ Created GitHub Actions workflow"

# Create deployment guide
cat > DEPLOYMENT.md << 'EOF'
# 🚀 Deployment Guide - Fruvi Professional

## Opción 1: Netlify (Recomendado)

### Paso 1: Preparar el proyecto
1. Asegúrate de tener tu repositorio en GitHub
2. Configura las variables de entorno en Netlify

### Paso 2: Configurar Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Haz clic en "New site from Git"
3. Conecta tu repositorio de GitHub
4. Configura las variables de entorno:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`

### Paso 3: Deploy
- Netlify detectará automáticamente el proyecto
- El sitio se desplegará automáticamente
- Tu URL será: `https://random-name.netlify.app`

## Opción 2: Vercel

### Paso 1: Importar proyecto
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Import Project"
3. Conecta tu repositorio de GitHub

### Paso 2: Configurar variables
1. Ve a Project Settings > Environment Variables
2. Añade las mismas variables que en Netlify

### Paso 3: Deploy
- Vercel desplegará automáticamente
- Tu URL será: `https://your-project.vercel.app`

## Opción 3: GitHub Pages

### Paso 1: Configurar GitHub Pages
1. Ve a Settings > Pages en tu repositorio
2. Selecciona "Deploy from a branch"
3. Elige la rama `main`
4. El sitio estará en: `https://username.github.io/repository-name`

## Variables de Entorno Requeridas

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

## Configuración de Dominio Personalizado

### Netlify
1. Ve a Site Settings > Domain management
2. Añade tu dominio personalizado
3. Configura los registros DNS según las instrucciones

### Vercel
1. Ve a Project Settings > Domains
2. Añade tu dominio personalizado
3. Configura los registros DNS

## Verificación del Deployment

1. Verifica que todas las páginas carguen correctamente
2. Prueba el registro y login de usuarios
3. Verifica que la tienda funcione correctamente
4. Prueba el asistente de IA
5. Verifica que el carrito funcione

## Solución de Problemas

### Error: "Supabase no inicializado"
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que las credenciales de Supabase sean válidas

### Error: "CORS policy"
- Verifica que tu sitio esté en la lista de dominios permitidos en Supabase
- Ve a Supabase > Settings > API > URL Configuration

### Error: "Groq API key not found"
- Verifica que la variable `GROQ_API_KEY` esté configurada
- Asegúrate de que la API key sea válida

## Monitoreo y Analytics

### Netlify Analytics
- Visitas, páginas vistas, fuentes de tráfico
- Performance y tiempo de carga

### Supabase Analytics
- Uso de la base de datos
- Errores y performance

## Actualizaciones

Para actualizar la aplicación:

1. Haz cambios en tu repositorio local
2. Commit y push los cambios
3. Netlify/Vercel desplegará automáticamente
4. Los cambios estarán disponibles en minutos

## Soporte

Si tienes problemas:
1. Revisa los logs de deployment en tu plataforma
2. Verifica la consola del navegador
3. Revisa la configuración de variables de entorno
4. Contacta al soporte de la plataforma de deployment
EOF

echo "✅ Created DEPLOYMENT.md guide"

# Final instructions
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Create a repository on GitHub"
echo "2. Push your code: git push origin main"
echo "3. Deploy on Netlify or Vercel"
echo "4. Configure environment variables"
echo "5. Share your professional Fruvi store!"
echo ""
echo "📖 Read DEPLOYMENT.md for detailed instructions"
echo "📚 Check README.md for project documentation"
