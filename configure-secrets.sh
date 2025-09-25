#!/bin/bash

# Fruvi - Configure GitHub Secrets
echo "🔐 CONFIGURACIÓN DE GITHUB SECRETS PARA FRUVI"
echo "============================================="

echo ""
echo "📋 NECESITAS TUS API KEYS REALES:"
echo ""

# Ask for Supabase credentials
echo "🔑 SUPABASE CREDENTIALS:"
read -p "Enter your Supabase URL (https://xxx.supabase.co): " supabase_url
read -p "Enter your Supabase Anon Key: " supabase_key

echo ""
echo "🤖 GROQ API KEY:"
read -p "Enter your Groq API Key: " groq_key

echo ""
echo "✅ AHORA VE A GITHUB Y CONFIGURA LOS SECRETS:"
echo ""

echo "1️⃣ Ve a: https://github.com/Rk13termux/fruvistore/settings/secrets/actions"
echo ""

echo "2️⃣ Agrega estos 3 secrets con TUS VALORES REALES:"
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

echo "3️⃣ DESPUÉS DE CONFIGURAR LOS SECRETS:"
echo "   git push origin main"
echo ""

echo "4️⃣ ¡TU SITIO FUNCIONARÁ EN:"
echo "   https://rk13termux.github.io/fruvistore"
echo ""

echo "✅ API keys seguras y protegidas por GitHub Secrets"
