# 🍎 Fruvi - Tienda de Frutas Premium

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-brightgreen)](https://your-app-url.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-blue)](https://github.com/yourusername/fruvi)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Una tienda de frutas premium moderna y elegante construida con JavaScript vanilla, Supabase y diseño glassmorphism. Entrega fresca a domicilio con IA integrada.

![Fruvi Preview](https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=1200&h=600&fit=crop)

## 🌟 Características Principales.

### 🛍️ Tienda Profesional
- **15 productos premium** con imágenes reales de alta calidad de Unsplash
- **Sistema de filtros avanzado** por categoría, precio, calificación y tipo orgánico
- **Carrito de compras flotante** con cálculo automático de totales
- **Interfaz responsive** optimizada para todos los dispositivos
- **Diseño moderno** con efectos glassmorphism y animaciones suaves
- **Calificaciones** con sistema de estrellas para cada producto

### 🔐 Autenticación Completa
- **Registro de usuarios** con validación y confirmación por email
- **Login seguro** con manejo robusto de errores
- **Gestión de perfiles** con edición completa de datos personales
- **Integración Supabase** para autenticación y base de datos en tiempo real

### 🤖 AI Concierge
- **Asistente conversacional** que guía el proceso de registro
- **Extracción automática** de datos del usuario desde el chat
- **Respuestas contextuales** y personalizadas
- **Integración con Groq AI** para respuestas inteligentes

### 📱 Características Técnicas
- **Single Page Application (SPA)** con routing personalizado
- **Diseño responsive** y accesible
- **Optimización de rendimiento** con lazy loading
- **Local Storage** para persistencia de datos del carrito
- **Notificaciones elegantes** para feedback de usuario

## 🚀 Tecnologías Utilizadas

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Backend**: Supabase (Auth + Database + Storage)
- **AI**: Groq API para el asistente conversacional
- **UI**: Glassmorphism design, CSS Grid, Flexbox, Animations
- **Icons**: Font Awesome
- **Images**: Unsplash (imágenes premium de frutas)

## 📋 Requisitos del Sistema

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Cuenta de Supabase (gratuita)
- API Key de Groq (gratuita)
- Git para control de versiones

## 🛠️ Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/yourusername/fruvi.git
cd fruvi
```

### 2. Configurar Supabase
1. **Crear proyecto en [Supabase](https://supabase.com)**
2. **Crear la tabla `customers`:**
   ```sql
   CREATE TABLE customers (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     email TEXT,
     full_name TEXT,
     phone TEXT,
     address TEXT,
     city TEXT,
     zip_code TEXT,
     frequency TEXT DEFAULT 'ocasional',
     favorite_fruits TEXT[] DEFAULT '{}',
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Configurar políticas RLS:**
   ```sql
   -- Políticas de seguridad
   CREATE POLICY "Users can view own profile" ON customers
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can update own profile" ON customers
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own profile" ON customers
     FOR INSERT WITH CHECK (auth.uid() = user_id);
   ```

4. **Obtener credenciales de Supabase** (Settings > API)

### 3. Configurar Groq AI
1. **Registrarse en [Groq](https://groq.com)**
2. **Obtener API Key** del dashboard

### 4. Configurar Variables de Entorno
Actualizar las credenciales en `scripts/services/supabaseService.js`:
```javascript
// Reemplazar con tus credenciales reales
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 5. Iniciar Servidor Local
```bash
python3 -m http.server 8000
# O usar cualquier servidor local
```

### 6. Abrir en Navegador
```
http://localhost:8000
```

## 🌐 Deployment Profesional

### Opción 1: Netlify (Recomendado - Gratis)
1. **Conectar repositorio a [Netlify](https://netlify.com)**
2. **Configurar variables de entorno:**
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`
3. **Deploy automático** en cada push a GitHub

### Opción 2: Vercel
1. **Importar proyecto desde GitHub**
2. **Configurar variables de entorno**
3. **Deploy automático**

### Variables de Entorno Requeridas
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

## 📱 Catálogo de Productos

### 🍊 Cítricas
- **Naranja Valencia** - $2.50/kg (España) ⭐ 4.8
- **Limón Eureka** - $3.20/kg (México) ⭐ 4.6
- **Mandarina Clementina** - $4.10/kg (Marruecos) ⭐ 4.9

### 🥭 Tropicales
- **Mango Ataulfo** - $5.90/kg (Perú) ⭐ 4.9
- **Piña Golden** - $3.80/kg (Costa Rica) ⭐ 4.7
- **Kiwi Zespri** - $6.50/kg (Nueva Zelanda) ⭐ 4.8

### 🫐 Bayas
- **Fresa Premium** - $7.20/kg (California) ⭐ 4.9
- **Arándanos Azules** - $12.50/kg (Oregon) ⭐ 4.8
- **Frambuesas** - $15.80/kg (Colombia) ⭐ 4.7

### 🍎 Manzanas
- **Manzana Honeycrisp** - $4.20/kg (Washington) ⭐ 4.8
- **Manzana Granny Smith** - $3.50/kg (Chile) ⭐ 4.6
- **Manzana Gala** - $3.80/kg (Italia) ⭐ 4.5

### 🍇 Uvas
- **Uva Roja Sin Semillas** - $5.90/kg (California) ⭐ 4.7
- **Uva Blanca Thompson** - $4.50/kg (España) ⭐ 4.6
- **Uva Negra Concord** - $6.20/kg (Michigan) ⭐ 4.8

## 🎨 Características de Diseño

### Paleta de Colores
- **Primario**: `#7CF99B` (Verde claro premium)
- **Secundario**: `#27ae60` (Verde profesional)
- **Fondo**: `#0f151d` (Azul oscuro elegante)
- **Superficie**: `rgba(255,255,255,0.06)` (Glassmorphism)
- **Texto**: `#ffffff` (Blanco puro)

### Tipografía y Layout
- **Fuente principal**: System fonts (optimizadas)
- **Títulos**: 2.5rem con text-shadow elegante
- **Grid responsive**: 1-4 columnas según dispositivo
- **Animaciones**: Transiciones suaves de 0.3s
- **Hover effects**: Transform y box-shadow dinámicos

## 🔧 Estructura del Proyecto

```
/home/sebas/RK13/web/
├── index.html              # Página principal con landing
├── styles/
│   └── main.css           # Estilos principales
├── scripts/
│   ├── app.js             # Lógica principal y routing
│   ├── router.js          # Sistema de navegación SPA
│   ├── services/
│   │   ├── supabaseService.js    # Integración Supabase
│   │   └── groqService.js        # Servicio de IA
│   ├── pages/
│   │   ├── home.js              # Página de inicio
│   │   ├── store.js             # Tienda profesional
│   │   ├── nutrition.js         # Tabla nutricional
│   │   ├── registration.js      # Registro de usuarios
│   │   ├── login.js             # Login de usuarios
│   │   ├── profile.js           # Gestión de perfil
│   │   └── assistant.js         # Asistente de IA
│   └── components/
│       └── chatWidget.js        # Widget de chat flotante
├── setup-storage.sh       # Script de configuración de Storage
└── README.md             # Documentación completa
```

## 🤝 Contribuir

1. **Fork** el proyecto
2. **Crea una rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre un Pull Request**

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Imágenes**: [Unsplash](https://unsplash.com) por las hermosas imágenes de frutas premium
- **Iconos**: [Font Awesome](https://fontawesome.com) por los iconos elegantes
- **Inspiración**: Aplicaciones modernas como Temu, Amazon Fresh
- **Tecnologías**: Supabase, Groq, Vanilla JS

## 📞 Contacto

**Desarrollador**: Tu Nombre Completo
**Email**: tu.email@ejemplo.com
**LinkedIn**: [linkedin.com/in/tu-perfil](https://linkedin.com/in/tu-perfil)
**Portfolio**: [tu-portfolio.com](https://tu-portfolio.com)

---

⭐ **¿Te gusta Fruvi?** ¡Dame una estrella en GitHub y comparte con tus amigos!

[🔗 Ver Demo](https://your-app-url.netlify.app) • [📧 Contactar](mailto:tu.email@ejemplo.com) • [🐛 Reportar Bug](https://github.com/yourusername/fruvi/issues)

## 🌟 Características

- **🏪 Tienda de Frutas**: Catálogo interactivo de productos con precios y descripciones
- **📊 Tabla Nutricional Profesional**: Información detallada sobre el valor nutricional de cada fruta
- **🤖 Asistente de IA**: Chatbot inteligente para responder preguntas sobre frutas y compras
- **📝 Sistema de Registro**: Flujo de registro estilo Temu en 3 pasos con validación
- **💾 Base de Datos**: Integración con Supabase para almacenamiento de datos de clientes
- **📱 Diseño Responsivo**: Compatible con dispositivos móviles, tabletas y escritorio
- **🚀 GitHub Pages Compatible**: Despliegue estático sin problemas

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (Base de datos y autenticación)
- **Estilos**: CSS Grid, Flexbox, Animaciones CSS
- **Iconos**: Font Awesome
- **Diseño**: Responsive Design, Mobile-First

## 📁 Estructura del Proyecto

```
/home/sebas/RK13/web/
├── index.html          # Página principal
├── styles.css          # Hoja de estilos
├── script.js           # Lógica JavaScript
├── README.md           # Documentación
└── assets/            # Imágenes y recursos (opcional)
```

## 🚀 Configuración Rápida

### 1. Configurar Supabase

1. **Crear cuenta en Supabase**:
   - Ve a [supabase.com](https://supabase.com)
   - Regístrate y crea un nuevo proyecto

2. **Crear la tabla de clientes**:
   ```sql
   CREATE TABLE customers (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       full_name TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL,
       phone TEXT NOT NULL,
       address TEXT NOT NULL,
       city TEXT NOT NULL,
       zip_code TEXT NOT NULL,
       frequency TEXT DEFAULT 'ocasional',
       favorite_fruits TEXT[] DEFAULT '{}',
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Obtener credenciales**:
   - En tu proyecto Supabase, ve a `Settings` > `API`
   - Copia la `URL` y la `anon key`

4. **Configurar el proyecto**:
   - Abre `script.js`
   - Reemplaza las credenciales:
     ```javascript
     const SUPABASE_URL = 'https://your-project.supabase.co';
     const SUPABASE_ANON_KEY = 'your-anon-key';
     ```

### 2. Configurar GitHub Pages

1. **Crear repositorio en GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - FreshFruits website"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/freshfruits.git
   git push -u origin main
   ```

2. **Activar GitHub Pages**:
   - Ve a la configuración de tu repositorio
   - Selecciona `Pages` en el menú izquierdo
   - Elige `Deploy from a branch`
   - Selecciona la rama `main` y el directorio `/root`
   - Haz clic en `Save`

3. **Acceder a tu sitio**:
   - Tu sitio estará disponible en: `https://tu-usuario.github.io/freshfruits`

## 🎯 Funcionalidades Detalladas

### 📋 Sistema de Registro (Estilo Temu)

El sistema de registro incluye:

- **Paso 1**: Información personal (nombre, email, teléfono)
- **Paso 2**: Dirección de entrega (dirección, ciudad, código postal)
- **Paso 3**: Preferencias (frutas favoritas, frecuencia de compra)

**Validaciones incluidas**:
- Campos obligatorios
- Formato de email válido
- Formato de teléfono válido
- Notificaciones de error/éxito

### 🛒 Tienda de Frutas

- **Catálogo de productos** con imágenes, descripciones y precios
- **Sistema de carrito** (base implementada, listo para extender)
- **Diseño responsive** con grid layout
- **Animaciones hover** para mejor experiencia

### 📊 Tabla Nutricional Profesional

Información nutricional detallada para 6 frutas principales:

| Fruta | Calorías | Proteínas | Carbohidratos | Fibra | Vitamina C | Potasio | Beneficios |
|-------|----------|-----------|---------------|-------|------------|---------|------------|
| Manzana | 52 | 0.3g | 14g | 2.4g | 4.6mg | 107mg | Mejora digestión, antioxidante |
| Plátano | 89 | 1.1g | 23g | 2.6g | 8.7mg | 358mg | Energía, salud cardiovascular |
| Naranja | 47 | 0.9g | 12g | 2.4g | 53.2mg | 181mg | Sistema inmunológico, antioxidante |
| Fresa | 32 | 0.7g | 8g | 2.0g | 58.8mg | 153mg | Antioxidante, antiinflamatorio |
| Mango | 60 | 0.8g | 15g | 1.6g | 36.4mg | 168mg | Vitamina A, digestión |
| Piña | 50 | 0.5g | 13g | 1.4g | 47.8mg | 109mg | Digestión, antiinflamatorio |

### 🤖 Asistente de IA

El asistente puede responder preguntas sobre:

- **Precios y costos** de las frutas
- **Proceso de compra** y registro
- **Información de entrega** a domicilio
- **Datos nutricionales** y beneficios para la salud
- **Calidad y frescura** de los productos
- **Proceso de registro** y creación de cuenta

**Características**:
- Chat en tiempo real
- Indicador de escritura
- Respuestas contextuales
- Soporte para español

## 🎨 Diseño y Estilos

### Paleta de Colores

- **Primario**: `#2ecc71` (Verde fresco)
- **Secundario**: `#27ae60` (Verde oscuro)
- **Acento**: `#f39c12` (Naranja)
- **Neutral**: `#2c3e50` (Gris oscuro)
- **Fondo**: `#f8f9fa` (Gris claro)

### Tipografía

- **Principal**: Arial, sans-serif
- **Títulos**: 2.5rem (móvil: 2rem)
- **Cuerpo**: 1rem (base)
- **Responsive**: Escalable con viewport units

### Iconos

- **Font Awesome**: Iconos vectoriales de alta calidad
- **Categorías**: Frutas, usuario, robot, redes sociales

## 📱 Responsividad

### Breakpoints

- **Desktop**: > 768px
- **Tablet**: 768px - 480px
- **Móvil**: < 480px

### Características Responsive

- **Menú móvil**: Hamburguesa para navegación
- **Grid adaptable**: Productos en 1-4 columnas
- **Formularios**: Diseño vertical en móvil
- **Tabla**: Scroll horizontal en dispositivos pequeños
- **Chat**: Ancho completo en móvil

## 🔧 Personalización

### Cambiar Colores

Edita `styles.css` y busca las variables de color:

```css
.header {
    background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.cta-button {
    background: #f39c12;
}
```

### Agregar Nuevos Productos

En `index.html`, duplica una `product-card`:

```html
<div class="product-card">
    <img src="url-de-imagen" alt="Nombre de fruta">
    <h3>Nombre de Fruta</h3>
    <p>Descripción del producto</p>
    <div class="price">$X.XX/kg</div>
    <button class="add-to-cart">Añadir al Carrito</button>
</div>
```

### Extender el Asistente de IA

En `script.js`, añade nuevas reglas en `generateAIResponse()`:

```javascript
if (lowerMessage.includes('palabra-clave')) {
    return 'Tu respuesta personalizada aquí';
}
```

## 🚀 Despliegue

### GitHub Pages (Recomendado)

1. **Subir a GitHub**:
   ```bash
   git add .
   git commit -m "Update FreshFruits website"
   git push origin main
   ```

2. **Configurar dominio personalizado** (opcional):
   - En la configuración de GitHub Pages
   - Añade tu dominio personalizado
   - Configura los DNS según las instrucciones

### Otros Servicios Estáticos

- **Netlify**: Arrastra y suelta la carpeta del proyecto
- **Vercel**: Conecta tu repositorio de GitHub
- **Firebase Hosting**: Usa la CLI de Firebase

## 🔒 Seguridad

### Supabase Security

- **Row Level Security**: Habilitar RLS en tablas
- **Políticas de acceso**: Configurar permisos adecuados
- **API Keys**: Nunca exponer la `service_role_key`

### Frontend Security

- **Validación de formularios**: Client-side y server-side
- **Sanitización de inputs**: Prevenir XSS
- **HTTPS**: Siempre usar conexiones seguras

## 📈 Mejoras Futuras

### Características Sugeridas

- [ ] Sistema de pagos integrado
- [ ] Panel de administración
- [ ] Notificaciones por email
- [ ] Sistema de reseñas
- [ ] Integración con redes sociales
- [ ] Programa de lealtad
- [ ] Envío de newsletters
- [ ] Análisis y estadísticas

### Optimizaciones

- [ ] Lazy loading para imágenes
- [ ] Service Worker para PWA
- [ ] Optimización de rendimiento
- [ ] SEO mejorado
- [ ] Accesibilidad WCAG

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Supabase no funciona**:
   - Verifica las credenciales en `script.js`
   - Asegúrate de que las tablas estén creadas
   - Revisa la conexión a internet

2. **Estilos no cargan**:
   - Verifica la ruta del archivo CSS
   - Limpia la caché del navegador
   - Revisa la consola de errores

3. **JavaScript no funciona**:
   - Verifica la consola del navegador
   - Revisa que los IDs de elementos coincidan
   - Asegúrate de que el script se cargue al final

### Depuración

- **Console.log**: Usa `console.log()` para depurar
- **Network Tab**: Revisa las peticiones de red
- **Local Storage**: Verifica datos guardados localmente

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de usarlo y modificarlo según tus necesidades.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz un fork del proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Crea un Pull Request

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- **Email**: info@freshfruits.com
- **GitHub Issues**: Crea un issue en el repositorio
- **Documentación**: Revisa esta README y los comentarios en el código

---

**¡Gracias por elegir FreshFruits!** 🍎🍌🍊🍓
