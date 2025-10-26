// Home Page - Fruvi Landing (AgroTech Experience)
export function renderHomePage(root) {
  console.log('🏠 renderHomePage called with root:', !!root, root?.tagName);
  root.innerHTML = `
  <!-- HERO SECTION - Premium Landing -->
  <section class="hero-premium">
    <!-- Animated Background Particles -->
    <div class="hero-particles">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
      <div class="particle particle-5"></div>
    </div>

    <!-- Stars Galaxy Animation -->
    <div class="stars-galaxy">
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="nebula"></div>
      <div class="nebula"></div>
      <div class="nebula"></div>
    </div>

    <div class="container hero-premium__content">
      <div class="hero-premium__text">
        <div class="hero-premium__badge">
          <i class="fas fa-crown"></i>
          AgroTech Intelligence Hub
        </div>
        <h1 class="hero-premium__title">
          <span class="title-main">Fruvi</span>
          <span class="title-sub">Tecnología agrícola para fruta premium</span>
        </h1>
        <p class="hero-premium__subtitle">
          Impulsamos la nueva era AgroTech: sensores de cultivo, analítica satelital e IA nutricional sincronizan cada lote para entregarte fruta premium con datos en tiempo real y experiencias personalizadas.
        </p>

        <div class="hero-premium__stats">
          <div class="stat-item">
            <div class="stat-number">500+</div>
            <div class="stat-label">Variedades auditadas</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">24-48h</div>
            <div class="stat-label">Logística inteligente</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">100%</div>
            <div class="stat-label">Trazabilidad blockchain</div>
          </div>
        </div>

        <div class="hero-premium__actions">
          <a class="cta-button-premium pulse-cta" href="#/registro">
            <i class="fas fa-rocket"></i>
            Comenzar Ahora
          </a>
          <a class="btn-link-premium" href="#/nutricion-ai">
            <i class="fas fa-brain"></i>
            Explorar IA Nutricional →
          </a>
        </div>

        <div class="hero-premium__trust">
          <div class="trust-badges">
            <span class="trust-badge">
              <i class="fas fa-shield-alt"></i>
              Calidad Certificada
            </span>
            <span class="trust-badge">
              <i class="fas fa-leaf"></i>
              100% Natural
            </span>
            <span class="trust-badge">
              <i class="fas fa-truck"></i>
              Envío Seguro
            </span>
          </div>
        </div>
      </div>

        <div class="hero-premium__visual">
          <div class="hero-showcase">
            <div class="showcase-main">
              <video src="/video/video02.mp4" alt="Fruvi Premium Experience" autoplay muted loop class="hero-video-main"></video>
              <div class="showcase-overlay">
              <div class="nutrition-badge">
                <i class="fas fa-heartbeat"></i>
                <span>Alta en Antioxidantes</span>
              </div>
            </div>
          </div>
          <div class="showcase-secondary">
            <div class="mini-card">
              <i class="fas fa-apple-whole"></i>
              <span>Manzanas Orgánicas</span>
            </div>
            <div class="mini-card">
              <i class="fas fa-circle"></i>
              <span>Naranjas Dulces</span>
            </div>
            <div class="mini-card">
              <i class="fas fa-lemon"></i>
              <span>Plátanos Premium</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="scroll-indicator">
      <div class="scroll-text">Descubre más</div>
      <div class="scroll-mouse">
        <div class="scroll-wheel"></div>
      </div>
    </div>
  </section>

  <!-- FEATURES SHOWCASE -->
  <section class="features-showcase">
    <div class="container">
      <div class="features-header">
        <h2 class="features-title">¿Por qué elegir Fruvi?</h2>
        <p class="features-subtitle">Tecnología y naturaleza se unen para ofrecerte la mejor experiencia en frutas</p>
      </div>

      <div class="features-grid">
        <div class="feature-card feature-card--premium">
          <div class="feature-icon">
            <i class="fas fa-seedling"></i>
            <div class="icon-bg"></div>
          </div>
          <h3>Calidad Certificada</h3>
          <p>Selección rigurosa por lotes con controles de frescura, sabor y origen. Estándares premium en toda la cadena de valor.</p>
          <div class="feature-highlight">
            <span>98% Satisfacción</span>
          </div>
        </div>

        <div class="feature-card feature-card--premium">
          <div class="feature-icon">
            <i class="fas fa-brain"></i>
            <div class="icon-bg"></div>
          </div>
          <h3>IA Nutricional</h3>
          <p>Descubre el valor nutricional de cada fruta con inteligencia artificial. Planes personalizados según tus metas de salud.</p>
          <div class="feature-highlight">
            <span>100+ Frutas Analizadas</span>
          </div>
        </div>

        <div class="feature-card feature-card--premium">
          <div class="feature-icon">
            <i class="fas fa-truck-fast"></i>
            <div class="icon-bg"></div>
          </div>
          <h3>Logística Express</h3>
          <p>Cosecha coordinada, empaquetado premium y entrega en 24-48h. Cadena de frío garantizada para máxima frescura.</p>
          <div class="feature-highlight">
            <span>Entrega Garantizada</span>
          </div>
        </div>

        <div class="feature-card feature-card--premium">
          <div class="feature-icon">
            <i class="fas fa-mobile-screen"></i>
            <div class="icon-bg"></div>
          </div>
          <h3>Experiencia Premium</h3>
          <p>App intuitiva, chat IA 24/7, historial completo y reordenes inteligentes. La mejor experiencia de compra de frutas.</p>
          <div class="feature-highlight">
            <span>Compra en 3 Toques</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FRUIT EXPERIENCE GALLERY -->
  <section class="fruit-gallery">
    <div class="container">
      <header class="section-header">
        <span class="section-kicker">Galería Sensorial</span>
        <h2>Explora el universo visual de la fruta premium</h2>
        <p>Visita cada lote con imágenes 4K capturadas en origen: cultivos regenerativos, cosechas inteligentes y presentaciones listas para sorprender.</p>
      </header>

      <div class="gallery-carousel">
        <div class="gallery-track">
          ${(() => {
            const galleryItems = [
              { src:'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=1200&auto=format&fit=crop', title:'Cosecha Inteligente', subtitle:'Sensores midiendo brix y humedad en tiempo real.' },
              { src:'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?q=80&w=1200&auto=format&fit=crop', title:'Smoothies Funcionales', subtitle:'Formulados por IA según tus objetivos diarios.' },
              { src:'https://images.unsplash.com/photo-1464446066817-4116494586bb?q=80&w=1200&auto=format&fit=crop', title:'Ensaladas Energéticas', subtitle:'Mix antioxidante con trazabilidad blockchain.' },
              { src:'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1200&auto=format&fit=crop', title:'Decoración Premium', subtitle:'Mesas frutales curadas para experiencias corporativas.' },
              { src:'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200&auto=format&fit=crop', title:'Bowls Nutricionales', subtitle:'Micronutrientes calibrados por nuestro motor IA.' },
              { src:'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1200&auto=format&fit=crop', title:'Bebidas Cold-Pressed', subtitle:'Filtrado en frío con reportes de vitaminas por lote.' },
              { src:'https://images.unsplash.com/photo-1457530378978-8bac673b8062?q=80&w=1200&auto=format&fit=crop', title:'Snacks Funcionales', subtitle:'Deshidratados a baja temperatura con control de polifenoles.' },
              { src:'https://images.unsplash.com/photo-1579427421896-ffe6ecd0bb41?q=80&w=1200&auto=format&fit=crop', title:'Huertos Regenerativos', subtitle:'Drones monitoreando salud del suelo y follaje.' },
              { src:'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1200&auto=format&fit=crop', title:'Platos Sensoriales', subtitle:'Presentaciones cromáticas para experiencias wellness.' },
              { src:'https://images.unsplash.com/photo-1550160837-67bf0a58a71b?q=80&w=1200&auto=format&fit=crop', title:'Cajas Experienciales', subtitle:'Curaduría semanal en packaging compostable tech-enabled.' }
            ];
            const carouselItems = [...galleryItems, ...galleryItems];
            return carouselItems.map((item, index) => `
              <article class="gallery-slide" style="--i:${index};">
                <figure class="gallery-media">
                  <img src="${item.src}" alt="${item.title}">
                  <figcaption>
                    <h3>${item.title}</h3>
                    <p>${item.subtitle}</p>
                  </figcaption>
                </figure>
              </article>
            `).join('');
          })()}
        </div>
        <div class="gallery-gradient" aria-hidden="true"></div>
      </div>
    </div>
  </section>

  <!-- PRODUCT HIGHLIGHT -->
  <section class="product-highlight">
    <div class="container">
      <div class="highlight-grid">
        <div class="highlight-content">
          <div class="highlight-badge">Producto Destacado</div>
          <h2>Naranjas de Valencia Premium</h2>
          <p class="highlight-desc">
            Directo del corazón de Valencia. Naranjas dulces con niveles excepcionales de vitamina C
            y antioxidantes naturales. Perfectas para jugos energéticos o snacks saludables.
          </p>

          <div class="highlight-nutrition">
            <div class="nutrition-item">
              <div class="nutrition-value">93%</div>
              <div class="nutrition-label">Vitamina C</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-value">52</div>
              <div class="nutrition-label">Calorías</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-value">2.4g</div>
              <div class="nutrition-label">Fibra</div>
            </div>
          </div>

          <div class="highlight-actions">
            <a href="#/tienda" class="cta-button-secondary">
              <i class="fas fa-shopping-cart"></i>
              Ver en Tienda
            </a>
            <a href="#/nutricion-ai" class="btn-link-secondary">
              <i class="fas fa-search"></i>
              Analizar Nutrición
            </a>
          </div>
        </div>

        <div class="highlight-visual">
          <div class="highlight-image">
            <video src="/video/video01.mp4" alt="Fruvi Experience" autoplay muted loop class="hero-video"></video>
            <div class="image-overlay"></div>
          </div>
          <div class="highlight-decoration">
            <div class="decoration-circle"></div>
            <div class="decoration-dots"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SMART SMOOTHIE LAB -->
  <section class="smoothie-lab">
    <div class="container">
      <header class="section-header">
        <span class="section-kicker">IA Mixology</span>
        <h2>Laboratorio de batidos inteligentes</h2>
        <p>Nuestra IA combina datos biométricos, clima y objetivos para sugerirte batidos funcionales. Cada receta incluye macronutrientes, vitaminas y tiempos de consumo recomendados.</p>
      </header>

      <div class="smoothie-grid">
        ${[
          {
            title:'Recarga Inmune Cítrica',
            desc:'Naranja Valencia, mango ataulfo, cúrcuma nano-emulsionada y probióticos. 120% vitamina C.',
            macros:'24g carb • 5g prot • 2g grasa',
            src:'https://images.unsplash.com/photo-1576402187878-974f70c890a5?q=80&w=900&auto=format&fit=crop'
          },
          {
            title:'Verde Performance',
            desc:'Piña golden, espinaca baby, matcha ceremonial y proteína vegetal. Beta-alanina natural.',
            macros:'18g carb • 12g prot • 4g grasa',
            src:'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?q=80&w=900&auto=format&fit=crop'
          },
          {
            title:'Night Recovery Berry',
            desc:'Arándano silvestre, cereza tart, lavanda comestible y magnesio biodisponible.',
            macros:'22g carb • 6g prot • 3g grasa',
            src:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=900&auto=format&fit=crop'
          }
        ].map(item => `
          <article class="smoothie-card">
            <div class="smoothie-media">
              <img src="${item.src}" alt="${item.title}">
            </div>
            <div class="smoothie-content">
              <h3>${item.title}</h3>
              <p>${item.desc}</p>
              <span class="smoothie-macros">${item.macros}</span>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- FRUIT ARTISTRY -->
  <section class="fruit-artistry">
    <div class="container">
      <div class="artistry-grid">
        <div class="artistry-copy">
          <span class="section-kicker">Experiencias Visuales</span>
          <h2>Arte frutal para eventos y bienestar corporativo</h2>
          <p>Diseñamos mesas y arreglos con algoritmos de colorimetría y frescura. Cada composición maximiza contraste, textura y valor nutricional para despertar todos los sentidos.</p>
          <ul class="artistry-list">
            <li>Centros de mesa comestibles con sensores de temperatura.</li>
            <li>Ensaladas gourmet personalizadas por perfiles nutrigenéticos.</li>
            <li>Trays fotogénicos para marketing gastronómico y hospitality.</li>
          </ul>
        </div>
        <div class="artistry-gallery">
          <div class="artistry-item">
            <img src="https://images.unsplash.com/photo-1568152950566-c1bf43f4ab28?q=80&w=900&auto=format&fit=crop" alt="Ensalada de frutas gourmet">
          </div>
          <div class="artistry-item">
            <img src="https://images.unsplash.com/photo-1576402187878-974f70c890a5?q=80&w=900&auto=format&fit=crop" alt="Batido artesanal premium">
          </div>
          <div class="artistry-item">
            <img src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=900&auto=format&fit=crop" alt="Decoración con frutas premium">
          </div>
          <div class="artistry-item">
            <img src="https://images.unsplash.com/photo-1548346749-7f0b6c2447c8?q=80&w=900&auto=format&fit=crop" alt="Bandeja de frutas artesanales">
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS - Interactive Steps -->
  <section class="how-it-works-interactive">
    <div class="container">
      <div class="how-header">
        <h2>Tu viaje hacia la salud comienza aquí</h2>
        <p>Cuatro pasos simples para transformar tu alimentación con frutas premium</p>
      </div>

      <div class="steps-container">
        <div class="step-line"></div>

        <div class="step-item step-item--1">
          <div class="step-number">01</div>
          <div class="step-content">
            <h3>Regístrate Gratis</h3>
            <p>Crea tu perfil y cuéntanos tus preferencias. Nuestra IA aprenderá tus gustos y necesidades nutricionales.</p>
          </div>
          <div class="step-visual">
            <i class="fas fa-user-plus"></i>
          </div>
        </div>

        <div class="step-item step-item--2">
          <div class="step-number">02</div>
          <div class="step-content">
            <h3>Explora y Elige</h3>
            <p>Navega nuestra selección premium, consulta información nutricional con IA y arma tu pedido perfecto.</p>
          </div>
          <div class="step-visual">
            <i class="fas fa-search"></i>
          </div>
        </div>

        <div class="step-item step-item--3">
          <div class="step-number">03</div>
          <div class="step-content">
            <h3>IA Personalizada</h3>
            <p>Recibe recomendaciones basadas en tu perfil, descubre combinaciones saludables y optimiza tu nutrición.</p>
          </div>
          <div class="step-visual">
            <i class="fas fa-brain"></i>
          </div>
        </div>

        <div class="step-item step-item--4">
          <div class="step-number">04</div>
          <div class="step-content">
            <h3>Disfruta tu Entrega</h3>
            <p>Recibe frutas frescas en 24-48h. Calidad garantizada, frescura máxima y satisfacción total.</p>
          </div>
          <div class="step-visual">
            <i class="fas fa-box-open"></i>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SOCIAL PROOF -->
  <section class="social-proof">
    <div class="container">
      <div class="proof-header">
        <h2>Únete a miles de personas saludables</h2>
        <p>Descubre por qué nuestros clientes eligen Fruvi para su bienestar diario</p>
      </div>

      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="testimonial-rating">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
          </div>
          <p class="testimonial-text">
            "La calidad es excepcional. La IA me ayuda a elegir frutas según mis necesidades nutricionales.
            Nunca había tenido acceso tan fácil a frutas premium."
          </p>
          <div class="testimonial-author">
            <div class="author-avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="author-info">
              <div class="author-name">María González</div>
              <div class="author-title">Cliente Premium</div>
            </div>
          </div>
        </div>

        <div class="testimonial-card">
          <div class="testimonial-rating">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
          </div>
          <p class="testimonial-text">
            "Las entregas son puntuales y las frutas llegan en perfectas condiciones.
            Mi familia ha mejorado su alimentación gracias a Fruvi."
          </p>
          <div class="testimonial-author">
            <div class="author-avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="author-info">
              <div class="author-name">Carlos Rodríguez</div>
              <div class="author-title">Cliente Frecuente</div>
            </div>
          </div>
        </div>

        <div class="testimonial-card">
          <div class="testimonial-rating">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
          </div>
          <p class="testimonial-text">
            "La app es increíble. Puedo ver la nutrición de cada fruta y recibir recomendaciones personalizadas.
            Ha revolucionado cómo compro frutas."
          </p>
          <div class="testimonial-author">
            <div class="author-avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="author-info">
              <div class="author-name">Ana Martínez</div>
              <div class="author-title">Cliente Premium</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ MODERN -->
  <section class="faq-modern">
    <div class="container">
      <div class="faq-header">
        <h2>Preguntas Frecuentes</h2>
        <p>Todo lo que necesitas saber sobre Fruvi</p>
      </div>

      <div class="faq-grid">
        <div class="faq-item">
          <div class="faq-question">
            <i class="fas fa-seedling"></i>
            <h3>¿De dónde provienen las frutas?</h3>
          </div>
          <div class="faq-answer">
            <p>Trabajamos exclusivamente con productores locales certificados. Cada lote tiene trazabilidad completa desde la cosecha hasta tu puerta, garantizando origen verificado y estándares de calidad premium.</p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <i class="fas fa-clock"></i>
            <h3>¿Cómo se garantiza la frescura?</h3>
          </div>
          <div class="faq-answer">
            <p>Coordinamos cosecha y despacho para tiempos óptimos, mantenemos cadena de frío completa y limitamos el tránsito máximo a 48 horas. Cada fruta llega en su punto óptimo de maduración.</p>
          </div>
        </div>

        <div class="faq-item">
          <i class="fas fa-credit-card"></i>
          <h3>¿Qué métodos de pago aceptan?</h3>
        </div>
        <div class="faq-answer">
          <p>Aceptamos tarjetas de crédito/débito, transferencias bancarias y billeteras digitales. Todos los pagos están protegidos con encriptación SSL de 256 bits y cumplen con estándares PCI DSS.</p>
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">
          <i class="fas fa-brain"></i>
          <h3>¿Puedo ver la nutrición de cualquier fruta?</h3>
        </div>
        <div class="faq-answer">
          <p>Sí, con nuestra IA Nutricional puedes consultar datos por 100g para más de 500 frutas diferentes. Incluye vitaminas, minerales, calorías, antioxidantes y recomendaciones de consumo.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- FINAL CTA - Premium -->
  <section class="final-cta-premium">
    <div class="container">
      <div class="cta-content">
        <h2>Transforma tu salud con frutas premium</h2>
        <p>Únete hoy a la revolución de la alimentación saludable. Regístrate gratis y descubre un mundo de frutas frescas con IA nutricional.</p>

        <div class="cta-stats">
          <div class="cta-stat">
            <div class="stat-number">10K+</div>
            <div class="stat-label">Clientes Satisfechos</div>
          </div>
          <div class="cta-stat">
            <div class="stat-number">500+</div>
            <div class="stat-label">Frutas Disponibles</div>
          </div>
          <div class="cta-stat">
            <div class="stat-number">4.9/5</div>
            <div class="stat-label">Calificación Promedio</div>
          </div>
        </div>

        <div class="cta-actions">
          <a href="#/registro" class="cta-button-premium-final">
            <i class="fas fa-rocket"></i>
            Comenzar Mi Viaje
          </a>
          <a href="#/tienda" class="btn-link-premium-final">
            <i class="fas fa-store"></i>
            Explorar Tienda →
          </a>
        </div>
      </div>

      <div class="cta-visual">
        <div class="cta-stars">
          <div class="cta-star star-large"></div>
          <div class="cta-star star-medium"></div>
          <div class="cta-star star-small"></div>
          <div class="cta-nebula-small"></div>
        </div>
      </div>
    </div>
  </section>
  `;
}
