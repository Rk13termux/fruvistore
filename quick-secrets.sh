#!/bin/bash

# Fruvi - Quick GitHub Secrets Setup
echo "🔐 FRUVI - CONFIGURACIÓN RÁPIDA DE SECRETS"
echo "=========================================="

echo ""
echo "📋 NECESITAS TUS API KEYS:"
echo ""

# Ask for Supabase credentials
echo "🔑 SUPABASE CREDENTIALS:"
read -p "Enter your Supabase URL (https://xxx.supabase.co): " supabase_url
read -p "Enter your Supabase Anon Key: " supabase_key

echo ""
echo "🤖 GROQ API KEY:"
read -p "Enter your Groq API Key: " groq_key

echo ""
echo "✅ CONFIGURACIÓN COMPLETADA"
echo ""
echo "📋 INSTRUCCIONES PARA GITHUB:"
echo ""
echo "1. Ve a: https://github.com/Rk13termux/fruvistore/settings/secrets/actions"
echo ""
echo "2. Agrega estos 3 secrets:"
echo ""
echo "   Secret Name: VITE_SUPABASE_URL"
echo "   Secret Value: $supabase_url"
echo ""
echo "   Secret Name: VITE_SUPABASE_ANON_KEY"
echo "   Secret Value: $supabase_key"
echo ""
echo "   Secret Name: VITE_GROQ_API_KEY"
echo "   Secret Value: $groq_key"
echo ""
echo "3. Después de configurar los secrets:"
echo "   git push origin main"
echo ""
echo "4. Tu sitio estará en:"
echo "   https://rk13termux.github.io/fruvistore"
echo ""
echo "✅ ¡API keys seguras y push funcionará!"
