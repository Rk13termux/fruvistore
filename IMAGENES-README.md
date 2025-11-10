# 🖼️ Guía de Imágenes - Fruvi Store

## 📁 Estructura de Carpetas

```
/public/
  /images/
    /products/     ← Imágenes de frutas individuales (26 archivos)
    /caja/         ← Imágenes de cajas (4 archivos)
  /video/          ← Videos del hero (2 archivos)
```

## ✅ Archivos Disponibles

### `/public/images/products/` (26 imágenes)
- agraz.jpg
- aguacate_hass.jpg
- aguacate_papelillo.jpg
- anon.jpg
- arandano.jpg
- arandanos-azules.jpg
- araza.jpg
- frambuesa.jpg
- frambuesas.jpg
- fresa.jpg
- fresa-premium.jpg
- kiwi-zespri.jpg
- limon-eureka.png
- mandarina-clementina.png
- mango-ataulfo.png
- manzana-gala.jpg
- manzana-granny-smith.jpg
- manzana-honeycrisp.jpg
- mora.jpg
- naranja_valecia.png
- pina-golden.jpg
- placeholder.jpg
- uchuva.jpg
- uva-blanca-thompson.jpg
- uva-negra-concord.jpg
- uva-roja-sin-semillas.jpg

### `/public/images/caja/` (4 imágenes)
- default-box.png
- caja-mixta.jpg
- caja-citrica.jpg
- caja-tropical.jpg

### `/public/video/` (2 videos)
- video01.mp4
- video02.mp4

## 🔧 Cómo Usar las Imágenes

### En el Código
Vite automáticamente sirve los archivos de `/public/` desde la raíz:

```javascript
// ✅ CORRECTO - Para productos
img: '/images/products/agraz.jpg'

// ✅ CORRECTO - Para cajas
img: '/images/caja/caja-mixta.jpg'

// ✅ CORRECTO - Para videos
src: '/video/video01.mp4'

// ❌ INCORRECTO - NO usar /public/ en las rutas
img: '/public/images/products/agraz.jpg'  // ❌
```

### En Supabase (Base de Datos)

Todas las URLs deben seguir este formato:
```sql
-- Productos
image_url: '/images/products/nombre-archivo.jpg'

-- IMPORTANTE: TODO EN MINÚSCULAS
image_url: '/images/products/agraz.jpg'  ✅
image_url: '/images/products/Agraz.jpg'  ❌
```

## 🛠️ Arreglar URLs en Supabase

Si las imágenes no cargan, ejecuta este script en Supabase SQL Editor:

```sql
-- Ir a: https://supabase.com/dashboard/project/[TU-PROJECT]/editor
-- Copiar y ejecutar: database/fix-image-urls.sql
```

El script normalizará todas las URLs a:
- Minúsculas
- Formato `/images/products/archivo.jpg`
- Extrae nombres de URLs externas

## 📝 Normalización Automática

El código ya normaliza automáticamente las URLs:

### `storeService.js`
```javascript
// Convierte automáticamente:
"Agraz.jpg" → "/images/products/agraz.jpg"
"https://example.com/Fresa.jpg" → "/images/products/fresa.jpg"
"/images/products/Mango.png" → "/images/products/mango.png"
```

## ⚠️ Troubleshooting

### Las imágenes no cargan
1. Verifica que el archivo existe en `/public/images/products/`
2. Verifica que el nombre está en minúsculas
3. Verifica la URL en la BD (debe empezar con `/images/products/`)
4. Ejecuta el script `fix-image-urls.sql` en Supabase

### Error 404 en imágenes
```
❌ GET /images/products/Agraz.jpg → 404
✅ Archivo existe: agraz.jpg (minúsculas)
💡 Ejecutar fix-image-urls.sql para normalizar BD
```

### Cajas sin imagen
```javascript
// En boxes.js, verifica que use:
img: resolveImagePath('/images/caja/caja-mixta.jpg')
```

## 🚀 Deployment

Cuando haces `npm run build`:
1. Vite copia `/public/` → `/dist/`
2. Las rutas se mantienen iguales
3. GitHub Pages sirve desde `/dist/`

Por eso las rutas NO usan `/public/` en el código.
