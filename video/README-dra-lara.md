# Video Dra. Lara - Instrucciones

## Archivos de Video Requeridos

Para la sección de presentación de Dra. Lara, necesitas agregar los siguientes archivos de video en esta carpeta `/video/`:

### Archivos Principales:
1. **dra-lara-intro.mp4** - Formato MP4 (principal, mejor compatibilidad)
2. **dra-lara-intro.webm** - Formato WebM (alternativo, mejor compresión)

### Imagen Poster (opcional pero recomendada):
3. **dr-lara-poster.jpg** - Imagen que se muestra antes de que el video cargue
   - Ubicación: `/images/dr-lara-poster.jpg`

### Imagen Fallback:
4. **dr-lara-avatar.png** - Se muestra si el navegador no soporta video
   - Ubicación: `/images/dr-lara-avatar.png`

---

## Especificaciones Técnicas del Video

### Características Recomendadas:
- **Duración:** 10-30 segundos (loop automático)
- **Resolución:** 720p (1280x720) o 1080p (1920x1080)
- **Orientación:** Vertical o cuadrada preferible
- **Codec MP4:** H.264
- **Codec WebM:** VP9
- **Sin audio** (el video se reproduce en mute)

### Contenido Sugerido:
- Doctora profesional en bata blanca
- Consultorio médico de fondo
- Ambiente de confianza y profesionalismo
- Iluminación cálida y natural
- Expresión amable y cercana

---

## Recursos para Obtener el Video

### Opción 1: Video Stock Gratuito
- **Pexels:** https://www.pexels.com/search/videos/female%20doctor/
- **Pixabay:** https://pixabay.com/videos/search/doctor/
- **Videvo:** https://www.videvo.net/free-stock-video-footage/doctor/

**Búsquedas recomendadas:**
- "female doctor smiling"
- "nutritionist consultation"
- "medical professional"
- "healthcare professional"

### Opción 2: Generar con IA
- **D-ID:** https://www.d-id.com/ (avatares que hablan)
- **HeyGen:** https://www.heygen.com/ (videos AI profesionales)
- **Synthesia:** https://www.synthesia.io/

### Opción 3: Grabar Video Propio
Si tienes acceso a una doctora o nutricionista real, mejor aún para generar confianza.

---

## Conversión de Formatos

### De MP4 a WebM (con FFmpeg):
```bash
ffmpeg -i dra-lara-intro.mp4 -c:v libvpx-vp9 -b:v 1M dra-lara-intro.webm
```

### Extraer Poster del Video:
```bash
ffmpeg -i dra-lara-intro.mp4 -ss 00:00:02 -vframes 1 ../images/dr-lara-poster.jpg
```

### Optimizar Tamaño MP4:
```bash
ffmpeg -i dra-lara-intro-original.mp4 -vcodec h264 -acodec none -b:v 1500k dra-lara-intro.mp4
```

---

## Implementación Actual

El código en `scripts/pages/dr-lara.js` ya está configurado para usar estos videos:

```html
<video class="dr-lara-video" autoplay loop muted playsinline>
  <source src="/video/dra-lara-intro.mp4" type="video/mp4">
  <source src="/video/dra-lara-intro.webm" type="video/webm">
  <img src="/images/dr-lara-avatar.png" alt="Dra. Lara" class="dr-lara-image">
</video>
```

**Características:**
- ✅ Autoplay (se reproduce automáticamente)
- ✅ Loop (se repite infinitamente)
- ✅ Muted (sin audio para permitir autoplay)
- ✅ Playsinline (se reproduce inline en móviles)
- ✅ Fallback a imagen si no hay soporte de video

---

## Verificación

Después de agregar los archivos, verifica:
1. El video se reproduce automáticamente al cargar la página
2. El loop funciona correctamente
3. El badge "Experta en Nutrición" aparece sobre el video
4. En móviles el video mantiene buena calidad

---

## Alternativa Temporal (Placeholder)

Si aún no tienes el video, puedes usar temporalmente solo la imagen:

```html
<div class="dr-lara-media">
  <img src="/images/dr-lara-avatar.png" alt="Dra. Lara" class="dr-lara-image">
  <div class="media-badge">
    <i class="fas fa-user-md"></i> Experta en Nutrición
  </div>
</div>
```

El CSS ya está preparado para ambos casos (video o imagen).
