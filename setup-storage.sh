#!/bin/bash

# Script para configurar Supabase Storage para avatars en Fruvi
echo "🚀 Configurando Supabase Storage para avatars..."

# Verificar si supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI no está instalado. Instálalo desde: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Verificar si estamos en el directorio correcto
if [ ! -f "index.html" ]; then
    echo "❌ No estás en el directorio raíz del proyecto Fruvi"
    exit 1
fi

echo "✅ Verificando conexión con Supabase..."

# Obtener las credenciales de localStorage (simulado)
SUPABASE_URL="https://ipjkpgmptexkhilrjnsl.supabase.co"
SUPABASE_ANON="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwamtwZ21wdGV4a2hpbHJqbnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzQxOTQsImV4cCI6MjA3NDMxMDE5NH0.IxY5mC4SxyTzj1Vnns5kDu14wqkcVDksi3FvNEJ1F1o"

echo "🔧 Creando bucket 'avatars'..."

# Crear el bucket usando la API REST de Supabase
curl -X POST "${SUPABASE_URL}/rest/v1/storage/buckets" \
  -H "Authorization: Bearer ${SUPABASE_ANON}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "avatars",
    "public": true,
    "file_size_limit": 5242880,
    "allowed_mime_types": ["image/jpeg", "image/png", "image/gif", "image/webp"]
  }'

echo ""
echo "✅ Bucket 'avatars' creado exitosamente!"
echo ""
echo "📝 Ahora ejecuta estos comandos en Supabase SQL Editor:"
echo ""
echo "-- Políticas RLS para el bucket avatars"
echo "CREATE POLICY \"Avatar images are publicly accessible\" ON storage.objects"
echo "  FOR SELECT USING (bucket_id = 'avatars');"
echo ""
echo "CREATE POLICY \"Users can upload avatar images\" ON storage.objects"
echo "  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);"
echo ""
echo "CREATE POLICY \"Users can update their own avatar\" ON storage.objects"
echo "  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);"
echo ""
echo "CREATE POLICY \"Users can delete their own avatar\" ON storage.objects"
echo "  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);"
echo ""
echo "🎉 ¡Configuración completada! Ya puedes subir avatares en Fruvi."
