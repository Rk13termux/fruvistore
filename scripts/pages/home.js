// Home Page - Fruvi Landing (AgroTech Experience)
export function renderHomePage(root) {
  root.innerHTML = `
  <!-- HERO SECTION - Revolutionary Landing -->
  <section class="hero-revolutionary">
    <div class="container hero-revolutionary__content">
      <div class="hero-grid">
        <!-- Left Column - Text Content -->
        <div class="hero-text-column">
          <div class="hero-revolutionary__text">
        <!-- Attention Grabber -->
        <div class="hero-attention-grabber">
          <div class="attention-badge">
            <i class="fas fa-bolt"></i>
            <span>¡Descubre el futuro de la alimentación!</span>
          </div>
        </div>

        <!-- Main Headline -->
        <h1 class="hero-revolutionary__title">
          <span class="title-revolutionary">Frutas que</span>
          <span class="title-impact">transforman</span>
          <span class="title-revolutionary">tu salud</span>
        </h1>

        <!-- Compelling Subheadline -->
        <div class="hero-compelling-copy">
          <p class="hero-revolutionary__subtitle">
            Imagina frutas que conocen exactamente lo que tu cuerpo necesita. Cada bocado está optimizado por IA para maximizar tu energía, fortalecer tu inmunidad y acelerar tu metabolismo.
          </p>

          <!-- Pain Points & Solutions -->
          <div class="hero-pain-solution">
            <div class="pain-point">
              <i class="fas fa-times-circle"></i>
              <span>¿Cansado de frutas genéricas sin impacto real?</span>
            </div>
            <div class="solution-point">
              <i class="fas fa-check-circle"></i>
              <span>Frutas personalizadas que resuelven tus problemas específicos de salud</span>
            </div>
          </div>
        </div>

        <!-- Social Proof Numbers -->
        <div class="hero-social-proof">
          <div class="proof-stat">
            <div class="proof-number">15,000+</div>
            <div class="proof-label">Personas transformadas</div>
          </div>
          <div class="proof-stat">
            <div class="proof-number">98%</div>
            <div class="proof-label">Satisfacción nutricional</div>
          </div>
          <div class="proof-stat">
            <div class="proof-number">24/7</div>
            <div class="proof-label">Soporte IA</div>
          </div>
        </div>

        <!-- Urgency & Scarcity -->
        <div class="hero-urgency">
          <div class="urgency-badge">
            <i class="fas fa-clock"></i>
            <span>Limited Time: Primer mes 50% OFF</span>
          </div>
        </div>

        <!-- Call to Actions -->
        <div class="hero-revolutionary__actions">
          <a class="cta-button-small" href="#/registro">
            <i class="fas fa-user-plus"></i>
            <span>Crear cuenta</span>
          </a>
          <a class="cta-button-small secondary" href="#/registro">
            <i class="fas fa-brain"></i>
            <span>Probar AI ahora</span>
          </a>
        </div>

        </div>

      </div>

      <!-- Scroll Indicator Centered at Bottom -->
      <div class="scroll-indicator-revolutionary">
        <div class="scroll-progress">
          <div class="progress-bar"></div>
        </div>
      </div>
    </div>

  <!-- QUIÉN ES FRUVI -->
  <section class="about-fruvi">
    <div class="container">
      <div class="about-content">
        <div class="about-text">
          <h2>¿Quién es Fruvi?</h2>
          <p>Fruvi es la primera tienda de frutas premium impulsada por inteligencia artificial. Nacimos de la visión de revolucionar la alimentación saludable, combinando la frescura de las frutas naturales con la precisión de la tecnología avanzada.</p>
          <p>Nuestra misión es hacer que cada bocado cuente para tu salud. Utilizamos algoritmos de IA para analizar perfiles nutricionales individuales y recomendar las frutas perfectas que tu cuerpo necesita en cada momento.</p>
          <div class="about-stats">
            <div class="stat-item">
              <div class="stat-number">5+</div>
              <div class="stat-label">Años de innovación</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">50+</div>
              <div class="stat-label">Variedades premium</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">15,000+</div>
              <div class="stat-label">Clientes satisfechos</div>
            </div>
          </div>
        </div>
        <div class="about-visual">
          <div class="about-image">
            <i class="fas fa-seedling"></i>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FEATURES SHOWCASE -->
  <section class="features-showcase">
    <div class="container">
      <div class="features-header">
        <h2 class="features-title">¿Por qué elegir Fruvi?</h2>
        <p class="features-subtitle">La solución definitiva para tu salud alimenticia: tecnología inteligente que resuelve los problemas nutricionales modernos</p>
      </div>

      <div class="features-grid features-grid--6">
        <div class="feature-card feature-card--premium feature-card--solution">
          <div class="feature-icon">
            <i class="fas fa-brain"></i>
            <div class="icon-bg"></div>
          </div>
          <h3>Deficiencias Nutricionales</h3>
          <p>¿Sientes fatiga constante o falta de energía? Nuestra IA analiza tu perfil nutricional y crea planes personalizados con frutas específicas para cubrir tus carencias vitamínicas.</p>
          <div class="feature-highlight">
            <span>100% Personalizado</span>
          </div>
        </div>

        <div class="feature-card feature-card--premium feature-card--solution">
          <div class="feature-icon">
            <i class="fas fa-bolt"></i>
            <div class="icon-bg"></div>
          </div>
          <h3>Falta de Energía Natural</h3>
          <p>Olvídate de los energizantes artificiales. Nuestras frutas premium proporcionan energía sostenible con azúcares naturales, vitaminas B y minerales esenciales.</p>
          <div class="feature-highlight">
            <span>Energía Sostenible</span>
          </div>
        </div>

        <div class="feature-card feature-card--premium feature-card--solution">
          <div class="feature-icon">
            <i class="fas fa-shield-alt"></i>
            <div class="icon-bg"></div>
          </div>
          <h3>Sistema Inmune Débil</h3>
          <p>Fortalece tus defensas naturales con frutas ricas en vitamina C, antioxidantes y compuestos bioactivos que potencian tu sistema inmunológico.</p>
          <div class="feature-highlight">
            <span>Inmunidad Reforzada</span>
          </div>
        </div>

        <div class="feature-card feature-card--premium feature-card--solution">
          <div class="feature-icon">
            <i class="fas fa-leaf"></i>
            <div class="icon-bg"></div>
          </div>
          <h3>Problemas Digestivos</h3>
          <p>Frutas con alto contenido en fibra natural y enzimas digestivas que mejoran tu tránsito intestinal, reducen la inflamación y promueven una microbiota saludable.</p>
          <div class="feature-highlight">
            <span>Digestión Óptima</span>
          </div>
        </div>

        <div class="feature-card feature-card--premium feature-card--solution">
          <div class="feature-icon">
            <i class="fas fa-balance-scale"></i>
            <div class="icon-bg"></div>
          </div>
          <h3>Control de Peso Saludable</h3>
          <p>Planes nutricionales balanceados con frutas de bajo índice glucémico, alto contenido en agua y nutrientes que aceleran tu metabolismo naturalmente.</p>
          <div class="feature-highlight">
            <span>Metabolismo Acelerado</span>
          </div>
        </div>

        <div class="feature-card feature-card--premium feature-card--solution">
          <div class="feature-icon">
            <i class="fas fa-clock"></i>
            <div class="icon-bg"></div>
          </div>
          <h3>Envejecimiento Prematuro</h3>
          <p>Antioxidantes naturales, colágeno vegetal y compuestos anti-edad que protegen tus células del estrés oxidativo y mantienen tu juventud celular.</p>
          <div class="feature-highlight">
            <span>Jóvenes por Dentro</span>
          </div>
        </div>
      </div>

      <div class="features-trust-indicators">
        <div class="trust-metric">
          <div class="metric-number">98%</div>
          <div class="metric-label">Satisfacción Nutricional</div>
        </div>
        <div class="trust-metric">
          <div class="metric-number">500+</div>
          <div class="metric-label">Planes Personalizados</div>
        </div>
        <div class="trust-metric">
          <div class="metric-number">24/7</div>
          <div class="metric-label">Soporte IA Nutricional</div>
        </div>
      </div>
    </div>
  </section>

  <!-- FRUIT EXPERIENCE GALLERY -->
  <section class="fruit-gallery">
    <div class="container">
      <header class="section-header">
        <span class="section-kicker">Tienda Premium</span>
        <h2>Descubre la excelencia frutal en nuestra tienda</h2>
        <p>Explora nuestra selección curada de frutas premium, desde exóticas importadas hasta las mejores variedades colombianas. Cada producto con trazabilidad completa, análisis nutricional y entregas garantizadas.</p>
        <div class="store-highlights">
          <div class="highlight-item">
            <i class="fas fa-shield-alt"></i>
            <span>Trazabilidad Blockchain</span>
          </div>
          <div class="highlight-item">
            <i class="fas fa-brain"></i>
            <span>IA Nutricional</span>
          </div>
          <div class="highlight-item">
            <i class="fas fa-truck"></i>
            <span>Entrega Express 24-48h</span>
          </div>
          <div class="highlight-item">
            <i class="fas fa-award"></i>
            <span>Certificación Premium</span>
          </div>
        </div>
      </header>

      <div class="gallery-carousel">
        <div class="gallery-track">
          ${(() => {
            const galleryItems = [
              { src:'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=1200&auto=format&fit=crop', title:'Cosechas Inteligentes', subtitle:'Sensores midiendo calidad en tiempo real desde el campo.' },
              { src:'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?q=80&w=1200&auto=format&fit=crop', title:'Frutas Tropicales', subtitle:'Selección premium de frutas colombianas y exóticas.' },
              { src:'https://images.unsplash.com/photo-1464446066817-4116494586bb?q=80&w=1200&auto=format&fit=crop', title:'Ensaladas Frescas', subtitle:'Preparadas con frutas de temporada y máxima frescura.' },
              { src:'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1200&auto=format&fit=crop', title:'Cajas Gourmet', subtitle:'Curadurías personalizadas para experiencias únicas.' },
              { src:'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200&auto=format&fit=crop', title:'Smoothies Premium', subtitle:'Bebidas funcionales con ingredientes certificados.' },
              { src:'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1200&auto=format&fit=crop', title:'Jugos Naturales', subtitle:'Prensados en frío para máxima retención de nutrientes.' },
              { src:'https://images.unsplash.com/photo-1457530378978-8bac673b8062?q=80&w=1200&auto=format&fit=crop', title:'Snacks Saludables', subtitle:'Deshidratados naturalmente, ricos en antioxidantes.' },
              { src:'https://images.unsplash.com/photo-1579427421896-ffe6ecd0bb41?q=80&w=1200&auto=format&fit=crop', title:'Cultivos Sostenibles', subtitle:'Agricultura regenerativa con impacto positivo.' },
              { src:'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1200&auto=format&fit=crop', title:'Presentaciones Artísticas', subtitle:'Belleza natural para mesas y eventos especiales.' },
              { src:'https://images.unsplash.com/photo-1550160837-67bf0a58a71b?q=80&w=1200&auto=format&fit=crop', title:'Cajas Misteriosas', subtitle:'Sorpresas frutales con garantía de calidad premium.' }
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

      <div class="store-cta">
        <a href="#/tienda" class="btn-store-main">
          <i class="fas fa-store"></i>
          Explorar Tienda Completa
        </a>
        <p class="cta-subtitle">Más de 500 variedades disponibles • Envío gratuito en pedidos superiores a $50.000</p>
      </div>
    </div>
  </section>

  <!-- MYSTERY BOXES SHOWCASE -->
  <section class="mystery-boxes-showcase">
    <div class="container">
      <div class="mystery-header">
        <div class="mystery-badge">
          <i class="fas fa-gift"></i>
          Exclusivo Premium
        </div>
        <h2>¿Qué misterio guarda tu próxima caja?</h2>
        <p class="mystery-subtitle">
          Descubre combinaciones sorprendentes de frutas premium seleccionadas por nuestra IA.
          Cada caja es única y está diseñada para maximizar tu bienestar nutricional.
        </p>
      </div>

      <div class="mystery-content">
        <div class="mystery-description">
          <h3>Frutas que nunca imaginaste</h3>
          <div class="fruits-showcase">
            <div class="fruit-category">
              <h4><i class="fas fa-globe-americas"></i> Exóticas del Mundo</h4>
              <ul>
                <li>Maracuyá passionfruit de Costa Rica</li>
                <li>Granada roja de Turquía</li>
                <li>Kiwi gold de Nueva Zelanda</li>
                <li>Mangostán de Tailandia</li>
                <li>Carambola estrella de Brasil</li>
              </ul>
            </div>
            <div class="fruit-category">
              <h4><i class="fas fa-leaf"></i> Nacionales de Colombia</h4>
              <ul>
                <li>Borojó del Chocó</li>
                <li>Guanábana del Valle</li>
                <li>Lulo de Nariño</li>
                <li>Tamarindo de Córdoba</li>
                <li>Zapote de la Costa</li>
              </ul>
            </div>
          </div>

          <div class="mystery-cta">
            <p class="cta-question">¿Listo para la sorpresa?</p>
            <a href="#/cajas-misteriosas" class="btn-mystery-main glow-pulse">
              <i class="fas fa-box-open"></i>
              Obtener Mi Caja Misteriosa
            </a>
            <p class="cta-note">Solo para miembros premium • Entrega garantizada</p>
          </div>
        </div>

        <div class="mystery-boxes-grid">
          <div class="mystery-box-card">
            <div class="box-image">
              <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=300&h=300&fit=crop" alt="Caja Misteriosa Premium">
              <div class="box-shine"></div>
            </div>
            <div class="box-content">
              <h4>Caja Élite</h4>
              <p>8-10 frutas exóticas</p>
              <span class="box-price">Desde $89.900</span>
            </div>
          </div>

          <div class="mystery-box-card">
            <div class="box-image">
              <img src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=300&h=300&fit=crop" alt="Caja Misteriosa Gourmet">
              <div class="box-shine"></div>
            </div>
            <div class="box-content">
              <h4>Caja Gourmet</h4>
              <p>6-8 frutas premium</p>
              <span class="box-price">Desde $64.900</span>
            </div>
          </div>

          <div class="mystery-box-card">
            <div class="box-image">
              <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=300&h=300&fit=crop" alt="Caja Misteriosa Discovery">
              <div class="box-shine"></div>
            </div>
            <div class="box-content">
              <h4>Caja Discovery</h4>
              <p>4-6 frutas sorpresa</p>
              <span class="box-price">Desde $39.900</span>
            </div>
          </div>

          <div class="mystery-box-card">
            <div class="box-image">
              <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=300&h=300&fit=crop" alt="Caja Misteriosa Tropical">
              <div class="box-shine"></div>
            </div>
            <div class="box-content">
              <h4>Caja Tropical</h4>
              <p>5-7 frutas tropicales</p>
              <span class="box-price">Desde $54.900</span>
            </div>
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
        <div class="recipes-reference">
          <p><i class="fas fa-utensils"></i> <strong>¡Disponible en Recetas Fruvi!</strong> Accede a nuestra colección completa de batidos personalizados, ensaladas funcionales y bowls nutricionales con IA integrada.</p>
          <a href="#/recetas" class="btn-recipes-link">
            <i class="fas fa-arrow-right"></i>
            Explorar Recetas Completas
          </a>
        </div>
      </header>

      <div class="smoothie-grid">
        ${[
          {
            title:'Recarga Inmune Cítrica',
            desc:'Naranja Valencia, mango ataulfo, cúrcuma nano-emulsionada y probióticos. 120% vitamina C.',
            macros:'24g carb • 5g prot • 2g grasa',
            src:'https://images.unsplash.com/photo-1576402187878-974f70c890a5?q=80&w=400&h=500&fit=crop'
          },
          {
            title:'Verde Performance',
            desc:'Piña golden, espinaca baby, matcha ceremonial y proteína vegetal. Beta-alanina natural.',
            macros:'18g carb • 12g prot • 4g grasa',
            src:'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?q=80&w=400&h=500&fit=crop'
          },
          {
            title:'Night Recovery Berry',
            desc:'Arándano silvestre, cereza tart, lavanda comestible y magnesio biodisponible.',
            macros:'22g carb • 6g prot • 3g grasa',
            src:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=400&h=500&fit=crop'
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
  </section>  <!-- FRUIT ARTISTRY -->
  <section class="fruit-artistry">
    <div class="container">
      <div class="artistry-grid">
        <div class="artistry-copy">
          <span class="section-kicker">Experiencias Visuales</span>
          <h2>¿Sabías que tu cuerpo necesita frutas específicas según tu perfil único?</h2>
          <p>Descubre con nuestra IA Nutricional exactamente qué vitaminas te faltan, cuáles frutas maximizan tu energía y cómo combinarlas para resultados sorprendentes. Miles de usuarios ya transformaron su salud sin esfuerzo.</p>

          <div class="nutrition-benefits">
            <h3>Potencia tu salud con IA Nutricional</h3>
            <p>Descubre exactamente qué necesitas para optimizar tu bienestar:</p>
            <div class="benefits-grid">
              <div class="benefit-item">
                <i class="fas fa-chart-line"></i>
                <h4>Análisis personalizado</h4>
                <p>Evaluación completa de tus necesidades nutricionales específicas</p>
              </div>
              <div class="benefit-item">
                <i class="fas fa-brain"></i>
                <h4>Recomendaciones IA</h4>
                <p>Sugerencias inteligentes basadas en tu perfil único</p>
              </div>
              <div class="benefit-item">
                <i class="fas fa-heartbeat"></i>
                <h4>Seguimiento continuo</h4>
                <p>Monitoreo de tus objetivos y progreso de salud</p>
              </div>
              <div class="benefit-item">
                <i class="fas fa-file-alt"></i>
                <h4>Reportes detallados</h4>
                <p>Información precisa sobre cada fruta y combinación</p>
              </div>
            </div>

            <div class="nutrition-cta">
              <p class="cta-text">¿Listo para transformar tu alimentación?</p>
              <div class="cta-buttons">
                <a href="#/registro" class="btn-primary glow-pulse">
                  <i class="fas fa-user-plus"></i>
                  Registrarme Gratis
                </a>
                <a href="#/login" class="btn-secondary">
                  <i class="fas fa-sign-in-alt"></i>
                  Iniciar Sesión
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="artistry-gallery">
          <div class="artistry-item">
            <img src="https://images.unsplash.com/photo-1568152950566-c1bf43f4ab28?q=80&w=900&auto=format&fit=crop" alt="Ensalada de frutas gourmet - Combinaciones nutricionales perfectas">
            <div class="item-overlay">
              <h4>Ensalada de frutas gourmet</h4>
              <p>Composiciones balanceadas con IA nutricional</p>
            </div>
          </div>
          <div class="artistry-item">
            <img src="https://images.unsplash.com/photo-1576402187878-974f70c890a5?q=80&w=900&auto=format&fit=crop" alt="Batido artesanal premium - Recetas personalizadas por perfil">
            <div class="item-overlay">
              <h4>Batido artesanal premium</h4>
              <p>Formulado según tus necesidades específicas</p>
            </div>
          </div>
          <div class="artistry-item">
            <img src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=900&auto=format&fit=crop" alt="Decoración con frutas premium - Eventos corporativos">
            <div class="item-overlay">
              <h4>Decoración con frutas premium</h4>
              <p>Arte frutal para experiencias inolvidables</p>
            </div>
          </div>
          <div class="artistry-item">
            <img src="https://images.unsplash.com/photo-1548346749-7f0b6c2447c8?q=80&w=900&auto=format&fit=crop" alt="Bandeja de frutas artesanales - Curaduría nutricional">
            <div class="item-overlay">
              <h4>Bandeja de frutas artesanales</h4>
              <p>Selecciones premium con trazabilidad completa</p>
            </div>
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
              <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop&crop=face" alt="María González">
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
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop&crop=face" alt="Carlos Rodríguez">
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
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop&crop=face" alt="Ana Martínez">
            </div>
            <div class="author-info">
              <div class="author-name">Ana Martínez</div>
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
            "Como nutricionista, aprecio la precisión de los datos nutricionales. Mis pacientes han visto mejoras
            reales en su salud gracias a las recomendaciones personalizadas de Fruvi."
          </p>
          <div class="testimonial-author">
            <div class="author-avatar">
              <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop&crop=face" alt="Dra. Laura Silva">
            </div>
            <div class="author-info">
              <div class="author-name">Dra. Laura Silva</div>
              <div class="author-title">Nutricionista Certificada</div>
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
            "La trazabilidad blockchain me da confianza total. Sé exactamente de dónde vienen mis frutas
            y cómo se cultivaron. Es la transparencia que el mercado necesitaba."
          </p>
          <div class="testimonial-author">
            <div class="author-avatar">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop&crop=face" alt="Roberto Mendoza">
            </div>
            <div class="author-info">
              <div class="author-name">Roberto Mendoza</div>
              <div class="author-title">Chef Profesional</div>
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
            "Desde que uso Fruvi, mi energía diaria ha mejorado notablemente. Las frutas llegan frescas
            y la IA me ayuda a mantener una alimentación balanceada sin esfuerzo."
          </p>
          <div class="testimonial-author">
            <div class="author-avatar">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop&crop=face" alt="Isabella Torres">
            </div>
            <div class="author-info">
              <div class="author-name">Isabella Torres</div>
              <div class="author-title">Atleta Profesional</div>
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
        <h2>¿Por qué elegir Fruvi? Resolvemos tus dudas</h2>
        <p>Descubre cómo nuestra tecnología AgroTech revoluciona tu experiencia con frutas premium</p>
      </div>

      <div class="faq-grid">
        <div class="faq-item">
          <div class="faq-question">
            <i class="fas fa-seedling"></i>
            <h3>¿Cómo garantizan la calidad premium de las frutas?</h3>
          </div>
          <div class="faq-answer">
            <p>Trabajamos exclusivamente con productores locales certificados con sensores IoT en campo. Cada lote tiene trazabilidad blockchain completa desde la cosecha hasta tu puerta, garantizando origen verificado, maduración óptima y estándares de calidad premium que superan las normativas internacionales.</p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <i class="fas fa-clock"></i>
            <h3>¿Cómo mantienen la frescura por tanto tiempo?</h3>
          </div>
          <div class="faq-answer">
            <p>Nuestra logística inteligente coordina cosecha y despacho en tiempo real. Mantenemos cadena de frío completa con monitoreo GPS, limitamos el tránsito máximo a 24-48 horas, y utilizamos empaques inteligentes que preservan la humedad y temperatura ideal para cada variedad de fruta.</p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <i class="fas fa-brain"></i>
            <h3>¿Qué hace única la IA Nutricional de Fruvi?</h3>
          </div>
          <div class="faq-answer">
            <p>Nuestra IA analiza tu perfil nutricional, historial de consumo y objetivos de salud para crear recomendaciones personalizadas. Incluye datos por 100g para más de 500 frutas, calcula macros/micros precisos, y aprende de tus preferencias para sugerencias cada vez más acertadas.</p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <i class="fas fa-shield-alt"></i>
            <h3>¿Es seguro comprar frutas en línea?</h3>
          </div>
          <div class="faq-answer">
            <p>Absolutamente. Procesamos pagos con encriptación SSL de 256 bits PCI DSS compliant. Nuestra trazabilidad blockchain te permite verificar el origen de cada fruta en tiempo real. Además, ofrecemos garantía de satisfacción: si no estás 100% conforme, te devolvemos el dinero.</p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <i class="fas fa-truck"></i>
            <h3>¿Cómo funciona la entrega express?</h3>
          </div>
          <div class="faq-answer">
            <p>Optimizamos rutas con algoritmos de machine learning que consideran tráfico, clima y demanda. Recibes actualizaciones en tiempo real vía app, y puedes reprogramar entregas según tu conveniencia. El 98% de nuestros pedidos llegan dentro de la ventana prometida.</p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <i class="fas fa-users"></i>
            <h3>¿Puedo personalizar mi suscripción?</h3>
          </div>
          <div class="faq-answer">
            <p>Totalmente. Elige frecuencia (semanal, quincenal, mensual), tamaño de cajas (individual, familiar, gourmet), y preferencias nutricionales. Nuestra IA aprende de tus gustos y ajusta automáticamente las recomendaciones para mantener la variedad y nutrición óptima.</p>
          </div>
        </div>
      </div>

      <div class="faq-cta">
        <h3>¿Listo para transformar tu alimentación?</h3>
        <p>Únete a miles de personas que ya disfrutan de frutas premium con tecnología de vanguardia</p>
        <a href="#/registro" class="btn-primary glow-pulse">
          <i class="fas fa-rocket"></i>
          Comenzar Ahora - ¡Es Gratis!
        </a>
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
