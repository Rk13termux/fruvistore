#!/bin/bash

# Script para optimizar imágenes de productos
# Uso: ./optimize-images.sh [carpeta_origen] [carpeta_destino]

echo "🍎 Optimizando imágenes de Fruvi..."

ORIGEN=${1:-"images-originales"}
DESTINO=${2:-"images/products"}

# Crear directorio destino si no existe
mkdir -p "$DESTINO"

# Verificar si ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "❌ Error: ImageMagick no está instalado."
    echo "Instala con: sudo apt-get install imagemagick"
    exit 1
fi

# Verificar si jpegoptim está instalado
if ! command -v jpegoptim &> /dev/null; then
    echo "⚠️  Advertencia: jpegoptim no está instalado. Instala con: sudo apt-get install jpegoptim"
fi

echo "📁 Procesando imágenes de $ORIGEN a $DESTINO..."

# Optimizar cada imagen
for img in "$ORIGEN"/*.{jpg,jpeg,png}; do
    if [[ -f "$img" ]]; then
        filename=$(basename "$img")
        name="${filename%.*}"
        output="$DESTINO/${name}.jpg"

        echo "🔄 Optimizando: $filename"

        # Convertir a JPG y optimizar
        convert "$img" -resize "800x600>" -quality 85 -strip "$output"

        # Optimizar con jpegoptim si está disponible
        if command -v jpegoptim &> /dev/null; then
            jpegoptim --max=85 "$output"
        fi

        echo "✅ $filename → ${name}.jpg"
    fi
done

echo ""
echo "🎉 ¡Optimización completada!"
echo "📊 Imágenes procesadas: $(ls -1 "$DESTINO" | wc -l)"
echo "📂 Ubicación: $DESTINO"
echo ""
echo "💡 Próximos pasos:"
echo "1. Revisa las imágenes en $DESTINO"
echo "2. Ajusta la calidad si es necesario"
echo "3. Haz commit y push para sincronizar con GitHub Pages"
