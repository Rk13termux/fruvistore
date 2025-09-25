#!/bin/bash

# Fruvi - GitHub Secrets Setup
echo "🔐 CONFIGURANDO GITHUB SECRETS PARA FRUVI"
echo "========================================"

echo ""
echo "📋 INSTRUCCIONES PARA CONFIGURAR SECRETS:"
echo ""

echo "PASO 1: Ve a tu repositorio en GitHub"
echo "   https://github.com/Rk13termux/fruvistore"
echo ""

echo "PASO 2: Configura estos 3 secrets:"
echo "   1. Settings > Secrets and variables > Actions"
echo "   2. Click 'New repository secret'"
echo "   3. Agrega estos secrets:"
echo ""

echo "   🔑 Secret Name: VITE_SUPABASE_URL"
echo "      Secret Value: https://tu-proyecto.supabase.co"
echo ""

echo "   🔑 Secret Name: VITE_SUPABASE_ANON_KEY"
echo "      Secret Value: tu-anon-key-de-supabase"
echo ""

echo "   🔑 Secret Name: VITE_GROQ_API_KEY"
echo "      Secret Value: tu-api-key-de-groq"
echo ""

echo "PASO 3: Haz commit y push"
echo "   git add ."
echo "   git commit -m 'feat: configure environment variables for GitHub Pages'"
echo "   git push origin main"
echo ""

echo "PASO 4: GitHub Pages se desplegará automáticamente"
echo "   Tu sitio: https://rk13termux.github.io/fruvistore"
echo ""

echo "✅ ¡Listo! Las API keys estarán seguras y el push funcionará"
