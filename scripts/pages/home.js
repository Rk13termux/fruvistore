// Home Page - Fruvi Landing Page Persuasiva Ultra Elegante
export function renderHomePage(root) {
  console.log('🏠 renderHomePage called with root:', !!root, root?.tagName);
  root.innerHTML = `
  <!-- HERO SECTION - Impacto Inmediato -->
  <section class="hero-premium">
    <div class="hero-particles">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
      <div class="particle particle-5"></div>
    </div>

    <div class="stars-galaxy">
      ${Array.from({length: 15}, () => '<div class="star"></div>').join('')}
      ${Array.from({length: 3}, () => '<div class="nebula"></div>').join('')}
    </div>

    <div class="container hero-premium__content">
      <div class="hero-premium__text">
        <div class="hero-premium__badge">
          <i class="fas fa-crown"></i>
          Centro Médico Nutricional con IA
        </div>
        <h1 class="hero-premium__title">
          <span class="title-main">Tu Vida Saludable</span>
          <span class="title-sub">Comienza Hoy Mismo</span>
        </h1>
        <p class="hero-premium__subtitle">
          <strong>Imagina tener un doctor nutricional en tu bolsillo.</strong> Fruvi combina frutas premium de origen certificado con inteligencia artificial avanzada para transformar tu salud. Accede a <strong>5 plataformas revolucionarias</strong> diseñadas para tu bienestar total.
        </p>

        <div class="hero-premium__stats">
          <div class="stat-item">
            <div class="stat-icon"><i class="fas fa-users-medical"></i></div>
            <div class="stat-number">15,247</div>
            <div class="stat-label">Vidas Transformadas</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon"><i class="fas fa-apple-whole"></i></div>
            <div class="stat-number">520+</div>
            <div class="stat-label">Frutas Analizadas</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon"><i class="fas fa-robot"></i></div>
            <div class="stat-number">24/7</div>
            <div class="stat-label">Dr. IA Activo</div>
          </div>
        </div>

        <div class="hero-premium__actions">
          <a class="cta-button-premium pulse-cta" href="#/registro">
            <i class="fas fa-rocket"></i>
            Comenzar Gratis Ahora
          </a>
          <a class="btn-link-premium" href="#/login">
            <i class="fas fa-sign-in-alt"></i>
            Ya soy miembro →
          </a>
        </div>

        <div class="hero-premium__trust">
          <div class="trust-badges">
            <span class="trust-badge">
              <i class="fas fa-shield-check"></i>
              Registro Seguro SSL
            </span>
            <span class="trust-badge">
              <i class="fas fa-leaf"></i>
              100% Orgánico
            </span>
            <span class="trust-badge">
              <i class="fas fa-award"></i>
              Calidad Certificada
            </span>
          </div>
        </div>
      </div>

      <div class="hero-premium__visual">
        <div class="hero-showcase">
          <div class="showcase-main">
            <video src="/video/video02.mp4" alt="Fruvi Premium Experience" autoplay muted loop playsinline class="hero-video-main"></video>
            <div class="showcase-overlay">
              <div class="nutrition-badge">
                <i class="fas fa-heartbeat"></i>
                <span>Potenciado con IA Médica</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="scroll-indicator">
      <div class="scroll-text">Descubre qué encontrarás</div>
      <div class="scroll-mouse">
        <div class="scroll-wheel"></div>
      </div>
    </div>
  </section>

  <- Estructura limpia y BENEFICIOS DE REGISTRO -->
  <section class="registration-benefits">
    <div class="container">
      <div class="benefits-header">
        <span class="section-kicker">¿Por Qué Unirte a Fruvi?</span>
        <h2>5 Plataformas. 1 Cuenta. Infinitas Posibilidades.</h2>
        <p>Al registrarte gratis, desbloqueas acceso completo a nuestro ecosistema de salud diseñado por médicos y potenciado por IA</p>
      </div>

      <div class="benefits-grid">
        <div class="benefit-card">
          <div class="benefit-icon">
            <i class="fas fa-gifts"></i>
            <div class="icon-glow"></div>
          </div>
          <h3>Acceso Total a 5 Plataformas</h3>
          <p>Una sola cuenta te conecta con: Tienda Premium (500+ frutas), FruviBox (cajas personalizadas), Frushake IA (recetas inteligentes), Nutrición IA (análisis completo) y Dr. IA (consultas 24/7)</p>
          <div class="benefit-value">
            <span class="value-badge">Valor Comercial: $299/mes</span>
            <span class="value-price">Gratis para Siempre</span>
          </div>
        </div>

        <div class="benefit-card">
          <div class="benefit-icon">
            <i class="fas fa-brain-circuit"></i>
            <div class="icon-glow"></div>
          </div>
          <h3>IA que Aprende de Ti</h3>
          <p>Nuestro algoritmo médico estudia tus preferencias, historial y objetivos para crear recomendaciones 100% personalizadas que evolucionan contigo</p>
          <div class="benefit-value">
            <span class="value-badge">Motor de 520+ Frutas</span>
            <span class="value-price">Precisión del 98.7%</span>
          </div>
        </div>

        <div class="benefit-card">
          <div class="benefit-icon">
            <i class="fas fa-stethoscope"></i>
            <div class="icon-glow"></div>
          </div>
          <h3>Dr. IA - Tu Nutricionista Personal</h3>
          <p>Consultas nutricionales ilimitadas vía chat, planes alimenticios personalizados y respuestas instantáneas a tus dudas de salud. Como tener un doctor en casa.</p>
          <div class="benefit-value">
            <span class="value-badge">Chat Ilimitado</span>
            <span class="value-price">Disponible 24/7/365</span>
          </div>
        </div>

        <div class="benefit-card">
          <div class="benefit-icon">
            <i class="fas fa-truck-fast"></i>
            <div class="icon-glow"></div>
          </div>
          <h3>Envío Premium Gratis</h3>
          <p>Primera compra con envío totalmente gratuito. Además, descuentos automáticos en pedidos recurrentes y acceso VIP a ofertas flash exclusivas</p>
          <div class="benefit-value">
            <span class="value-badge">Ahorro Instantáneo</span>
            <span class="value-price">Desde $30.000 COP</span>
          </div>
        </div>

        <div class="benefit-card">
          <div class="benefit-icon">
            <i class="fas fa-chart-line-up"></i>
            <div class="icon-glow"></div>
          </div>
          <h3>Dashboard de Salud Integral</h3>
          <p>Monitorea tu progreso con gráficos visuales, historial nutricional completo y análisis de mejoras en tu bienestar mes a mes</p>
          <div class="benefit-value">
            <span class="value-badge">Analytics Médico</span>
            <span class="value-price">Reportes Semanales</span>
          </div>
        </div>

        <div class="benefit-card">
          <div class="benefit-icon">
            <i class="fas fa-shield-halved"></i>
            <div class="icon-glow"></div>
          </div>
          <h3>Seguridad Médica Garantizada</h3>
          <p>Todos tus datos médicos y nutricionales están encriptados bajo los más altos estándares internacionales. Control total de tu privacidad</p>
          <div class="benefit-value">
            <span class="value-badge">Encriptación AES-256</span>
            <span class="value-price">Cumple HIPAA</span>
          </div>
        </div>
      </div>

      <div class="benefits-cta">
        <a href="#/registro" class="cta-button-large">
          <i class="fas fa-star-shooting"></i>
          Crear Mi Cuenta Gratis Ahora
        </a>
        <p class="cta-subtitle">⚡ Sin tarjeta de crédito • Activación en 30 segundos • Cancela cuando quieras</p>
      </div>
    </div>
  </section>

  <- Estructura limpia y PLATAFORMA #1: TIENDA PREMIUM -->
  <section class="platform-section platform-tienda">
    <div class="container">
      <div class="platform-content">
        <div class="platform-text">
          <div class="platform-badge">
            <i class="fas fa-store-alt"></i>
            Plataforma 1 de 5
          </div>
          <h2>🛒 Tienda Premium de Frutas</h2>
          <p class="platform-desc">
            Explora un catálogo médicamente curado de <strong>520+ frutas premium</strong> seleccionadas por nutricionistas. Cada fruta incluye análisis nutricional completo, origen verificado, certificaciones orgánicas y garantía de frescura del 100%.
          </p>
          
          <div class="platform-features">
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Filtros Inteligentes:</strong> Busca por categoría, origen geográfico, rango de precio, calificación de clientes y valores nutricionales específicos</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Reseñas Verificadas:</strong> Lee opiniones reales de más de 12,000 clientes con fotos de productos recibidos y calificaciones detalladas</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Análisis Nutricional:</strong> Información completa por cada 100g: calorías, macros, vitaminas, minerales y fitonutrientes</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Carrito Inteligente con IA:</strong> Sugerencias automáticas basadas en tu historial y objetivos de salud personalizados</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Checkout Ultrarrápido:</strong> Paga con tarjeta, transferencia o billetera digital en menos de 60 segundos con máxima seguridad</span>
            </div>
          </div>

          <div class="platform-action">
            <a href="#/registro" class="btn-platform-primary">
              <i class="fas fa-cart-plus"></i>
              Empezar a Comprar Ahora
            </a>
            <div class="platform-stats-mini">
              <span><strong>4.9/5</strong> ⭐⭐⭐⭐⭐ (3,850 reseñas)</span>
              <span>•</span>
              <span><strong>98.2%</strong> satisfacción total</span>
            </div>
          </div>
        </div>

        <div class="platform-visual">
          <div class="platform-screenshot">
            <div class="screenshot-header">
              <div class="header-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span class="header-title">Tienda Fruvi - 520+ Frutas Premium</span>
            </div>
            <video src="/video/video01.mp4" alt="Tienda Fruvi Premium" autoplay muted loop playsinline class="platform-video"></video>
            <div class="screenshot-badge screenshot-badge-1">
              <i class="fas fa-shipping-fast"></i>
              Envío 24-48h
            </div>
            <div class="screenshot-badge screenshot-badge-2">
              <i class="fas fa-seedling"></i>
              100% Orgánico
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <- Estructura limpia y PLATAFORMA #2: FRUVIBOX -->
  <section class="platform-section platform-boxes">
    <div class="container">
      <div class="platform-content platform-content--reverse">
        <div class="platform-visual">
          <div class="platform-screenshot">
            <div class="screenshot-header">
              <div class="header-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span class="header-title">FruviBox - Cajas Personalizadas</span>
            </div>
            <div class="boxes-preview">
              <div class="box-card">
                <div class="box-icon">🌴</div>
                <h4>Tropical Paradise</h4>
                <p class="box-price">$48.900</p>
              </div>
              <div class="box-card box-card-featured">
                <div class="box-badge">⭐ Más Popular</div>
                <div class="box-icon">⚡</div>
                <h4>Energía Vital</h4>
                <p class="box-price">$59.900</p>
              </div>
              <div class="box-card">
                <div class="box-icon">💎</div>
                <h4>Premium Elite</h4>
                <p class="box-price">$79.900</p>
              </div>
            </div>
            <div class="screenshot-badge screenshot-badge-1">
              <i class="fas fa-sparkles"></i>
              Curado por IA
            </div>
            <div class="screenshot-badge screenshot-badge-2">
              <i class="fas fa-repeat"></i>
              Suscripción Flexible
            </div>
          </div>
        </div>

        <div class="platform-text">
          <div class="platform-badge">
            <i class="fas fa-box-heart"></i>
            Plataforma 2 de 5
          </div>
          <h2>📦 FruviBox - Cajas Personalizadas</h2>
          <p class="platform-desc">
            Recibe cada semana o mes una <strong>caja premium curada por nutricionistas e IA</strong> con frutas seleccionadas según tus objetivos de salud. Olvídate de planificar, nosotros lo hacemos por ti.
          </p>
          
          <div class="platform-features">
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>12+ Cajas Temáticas:</strong> Tropical, Energía Vital, Antioxidante, Detox, Inmune Boost, Fitness Pro, Keto Friendly, y más opciones especializadas</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>100% Personalizable:</strong> Indica alergias, frutas favoritas o que prefieres evitar. La IA ajusta cada caja automáticamente</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Frecuencia Flexible:</strong> Elige entrega semanal, quincenal o mensual. Pausa o cancela cuando quieras sin penalización</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Sorpresas Exclusivas:</strong> Cada caja incluye 1-2 frutas exóticas o de temporada que no están en la tienda regular</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Descuentos Automáticos:</strong> Ahorra hasta 25% con suscripciones recurrentes comparado con compras individuales</span>
            </div>
          </div>

          <div class="platform-action">
            <a href="#/registro" class="btn-platform-primary">
              <i class="fas fa-box-open"></i>
              Crear Mi FruviBox
            </a>
            <div class="platform-stats-mini">
              <span><strong>4,890</strong> suscriptores activos</span>
              <span>•</span>
              <span>Ahorra <strong>hasta 25%</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <- Estructura limpia y PLATAFORMA #3: FRUSHAKE IA -->
  <section class="platform-section platform-tienda">
    <div class="container">
      <div class="platform-content">
        <div class="platform-text">
          <div class="platform-badge">
            <i class="fas fa-blender"></i>
            Plataforma 3 de 5
          </div>
          <h2>🥤 Frushake IA - Recetas Inteligentes</h2>
          <p class="platform-desc">
            Descubre <strong>+300 recetas de batidos funcionales</strong> diseñadas por nutricionistas deportivos y optimizadas por IA según tus objetivos: pérdida de peso, ganancia muscular, energía, inmunidad o longevidad.
          </p>
          
          <div class="platform-features">
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Recetas Personalizadas por IA:</strong> El algoritmo crea batidos únicos según tu perfil biométrico, nivel de actividad y metas de salud</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Información Nutricional Completa:</strong> Cada receta muestra macros, calorías, vitaminas, minerales y horario óptimo de consumo</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Filtros Avanzados:</strong> Busca por objetivo (energía, recovery, inmunidad), tiempo de preparación, calorías o ingredientes disponibles</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Modo Compra Rápida:</strong> Agrega todos los ingredientes de una receta al carrito con un solo clic</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Videos Paso a Paso:</strong> Aprende técnicas profesionales de preparación con videos HD y tips de chefs especializados</span>
            </div>
          </div>

          <div class="platform-action">
            <a href="#/registro" class="btn-platform-primary">
              <i class="fas fa-magic-wand-sparkles"></i>
              Explorar Recetas IA
            </a>
            <div class="platform-stats-mini">
              <span><strong>+300</strong> recetas disponibles</span>
              <span>•</span>
              <span><strong>Nuevas</strong> cada semana</span>
            </div>
          </div>
        </div>

        <div class="platform-visual">
          <div class="platform-screenshot">
            <div class="screenshot-header">
              <div class="header-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span class="header-title">Frushake IA - Batidos Funcionales</span>
            </div>
            <video src="/video/video02.mp4" alt="Frushake IA" autoplay muted loop playsinline class="platform-video"></video>
            <div class="screenshot-badge screenshot-badge-1">
              <i class="fas fa-dna"></i>
              Personalizado
            </div>
            <div class="screenshot-badge screenshot-badge-2">
              <i class="fas fa-bolt"></i>
              Resultados Reales
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <- Estructura limpia y PLATAFORMA #4: NUTRICIÓN IA -->
  <section class="platform-section platform-boxes">
    <div class="container">
      <div class="platform-content platform-content--reverse">
        <div class="platform-visual">
          <div class="platform-screenshot">
            <div class="screenshot-header">
              <div class="header-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span class="header-title">Nutrición IA - Análisis Avanzado</span>
            </div>
            <video src="/video/video01.mp4" alt="Nutrición IA" autoplay muted loop playsinline class="platform-video"></video>
            <div class="screenshot-badge screenshot-badge-1">
              <i class="fas fa-brain"></i>
              Motor de IA
            </div>
            <div class="screenshot-badge screenshot-badge-2">
              <i class="fas fa-chart-pie"></i>
              520+ Frutas
            </div>
          </div>
        </div>

        <div class="platform-text">
          <div class="platform-badge">
            <i class="fas fa-chart-mixed"></i>
            Plataforma 4 de 5
          </div>
          <h2>🍎 Nutrición IA - Análisis Completo</h2>
          <p class="platform-desc">
            Consulta información nutricional médica de <strong>520+ frutas analizadas</strong> con datos científicos actualizados. Compara frutas, crea planes alimenticios y optimiza tu dieta con precisión de laboratorio.
          </p>
          
          <div class="platform-features">
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Base de Datos Médica:</strong> Información nutricional por 100g de 520+ frutas con datos del USDA, OMS y estudios científicos peer-reviewed</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Comparador Inteligente:</strong> Compara hasta 5 frutas simultáneamente en calorías, vitaminas, minerales, antioxidantes y fitonutrientes</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Calculadora de Porciones:</strong> Ajusta cantidades automáticamente según tus necesidades calóricas y objetivos nutricionales diarios</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Alertas de Salud:</strong> Recibe advertencias sobre interacciones con medicamentos o condiciones médicas específicas</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Reportes Visuales:</strong> Gráficos interactivos y dashboards para entender tu consumo nutricional de forma intuitiva</span>
            </div>
          </div>

          <div class="platform-action">
            <a href="#/registro" class="btn-platform-primary">
              <i class="fas fa-microscope"></i>
              Analizar Nutrición
            </a>
            <div class="platform-stats-mini">
              <span><strong>520+</strong> frutas catalogadas</span>
              <span>•</span>
              <span><strong>Datos científicos</strong> verificados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <- Estructura limpia y PLATAFORMA #5: DR. IA 24/7 -->
  <section class="platform-section platform-tienda">
    <div class="container">
      <div class="platform-content">
        <div class="platform-text">
          <div class="platform-badge">
            <i class="fas fa-user-doctor"></i>
            Plataforma 5 de 5
          </div>
          <h2>🩺 Dr. IA - Tu Nutricionista 24/7</h2>
          <p class="platform-desc">
            Chatea con un <strong>asistente médico nutricional potenciado por IA</strong> disponible las 24 horas. Obtén consultas instantáneas, planes personalizados y respuestas a tus dudas de salud en tiempo real.
          </p>
          
          <div class="platform-features">
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Consultas Ilimitadas:</strong> Haz todas las preguntas que necesites sobre nutrición, frutas, dietas y salud sin límite de mensajes</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Respuestas Instantáneas:</strong> El Dr. IA responde en menos de 3 segundos con información médica respaldada por estudios científicos</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Planes Personalizados:</strong> Recibe planes alimenticios semanales adaptados a tus condiciones médicas, alergias y preferencias</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Modo de Emergencia:</strong> Consultas urgentes sobre reacciones alérgicas, interacciones o dudas médicas críticas con respuesta priorizada</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-double"></i>
              <span><strong>Historial Médico:</strong> Todas las conversaciones se guardan de forma segura y encriptada para seguimiento continuo</span>
            </div>
          </div>

          <div class="platform-action">
            <a href="#/registro" class="btn-platform-primary">
              <i class="fas fa-comments-medical"></i>
              Consultar al Dr. IA
            </a>
            <div class="platform-stats-mini">
              <span><strong>Disponible</strong> 24/7/365</span>
              <span>•</span>
              <span><strong>Respuesta</strong> en 3 segundos</span>
            </div>
          </div>
        </div>

        <div class="platform-visual">
          <div class="platform-screenshot">
            <div class="screenshot-header">
              <div class="header-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span class="header-title">Dr. IA - Asistente Médico Nutricional</span>
            </div>
            <video src="/video/video02.mp4" alt="Dr. IA" autoplay muted loop playsinline class="platform-video"></video>
            <div class="screenshot-badge screenshot-badge-1">
              <i class="fas fa-robot"></i>
              IA Médica
            </div>
            <div class="screenshot-badge screenshot-badge-2">
              <i class="fas fa-clock"></i>
              Siempre Activo
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <- Estructura limpia y GARANTÍAS Y SEGURIDAD -->
  <section class="guarantees-section">
    <div class="container">
      <div class="guarantees-header">
        <span class="section-kicker">Compra Sin Riesgos</span>
        <h2>Nuestras Garantías de Satisfacción</h2>
      </div>

      <div class="guarantees-grid">
        <div class="guarantee-card">
          <div class="guarantee-icon">
            <i class="fas fa-shield-check"></i>
          </div>
          <h3>100% Satisfacción Garantizada</h3>
          <p>Si no estás completamente satisfecho con tu compra, te devolvemos el 100% de tu dinero en las primeras 48 horas. Sin preguntas.</p>
        </div>

        <div class="guarantee-card">
          <div class="guarantee-icon">
            <i class="fas fa-leaf-heart"></i>
          </div>
          <h3>Frescura del 100% o Reembolso</h3>
          <p>Cada fruta pasa por 3 controles de calidad. Si llega una sola pieza en mal estado, reemplazamos todo tu pedido gratis.</p>
        </div>

        <div class="guarantee-card">
          <div class="guarantee-icon">
            <i class="fas fa-truck-clock"></i>
          </div>
          <h3>Entrega en 24-48h o Gratis</h3>
          <p>Tu pedido llega en el tiempo prometido o el envío es totalmente gratuito. Rastreo en tiempo real incluido.</p>
        </div>

        <div class="guarantee-card">
          <div class="guarantee-icon">
            <i class="fas fa-lock-keyhole"></i>
          </div>
          <h3>Datos 100% Seguros</h3>
          <p>Encriptación AES-256, certificación SSL, cumplimiento HIPAA. Tus datos médicos están más seguros que en un banco.</p>
        </div>
      </div>
    </div>
  </section>

  <- Estructura limpia y TESTIMONIOS -->
  <section class="testimonials-premium">
    <div class="container">
      <div class="testimonials-header">
        <span class="section-kicker">Historias Reales</span>
        <h2>Más de 15,000 Personas Ya Transformaron Su Salud</h2>
        <p>Lee lo que dicen nuestros miembros sobre su experiencia con Fruvi</p>
      </div>

      <div class="testimonials-grid">
        <div class="testimonial-card-premium">
          <div class="testimonial-stars">
            ${'<i class="fas fa-star"></i>'.repeat(5)}
          </div>
          <p class="testimonial-text">
            "Llevo 4 meses usando Fruvi y he perdido 12 kilos. El Dr. IA me ayudó a crear un plan personalizado y las FruviBox hacen súper fácil mantener mi dieta. ¡Es como tener un nutricionista en casa!"
          </p>
          <div class="testimonial-author">
            <div class="author-avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <div>
              <div class="author-name">María González</div>
              <div class="author-title">Miembro Premium • 4 meses</div>
            </div>
          </div>
          <div class="testimonial-badge">
            <i class="fas fa-badge-check"></i>
            Verificado
          </div>
        </div>

        <div class="testimonial-card-premium">
          <div class="testimonial-stars">
            ${'<i class="fas fa-star"></i>'.repeat(5)}
          </div>
          <p class="testimonial-text">
            "La calidad es excepcional. Cada fruta llega perfecta y fresca. Mi familia completa usa la app ahora. Los batidos de Frushake IA son increíbles y mis hijos los aman."
          </p>
          <div class="testimonial-author">
            <div class="author-avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <div>
              <div class="author-name">Carlos Rodríguez</div>
              <div class="author-title">Miembro Activo • 8 meses</div>
            </div>
          </div>
          <div class="testimonial-badge">
            <i class="fas fa-badge-check"></i>
            Verificado
          </div>
        </div>

        <div class="testimonial-card-premium">
          <div class="testimonial-stars">
            ${'<i class="fas fa-star"></i>'.repeat(5)}
          </div>
          <p class="testimonial-text">
            "Soy atleta y necesito nutrición precisa. El análisis nutricional de Fruvi es nivel laboratorio. He mejorado mi rendimiento un 30% desde que optimicé mi dieta con su IA."
          </p>
          <div class="testimonial-author">
            <div class="author-avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <div>
              <div class="author-name">Ana Martínez</div>
              <div class="author-title">Atleta Professional • 6 meses</div>
            </div>
          </div>
          <div class="testimonial-badge">
            <i class="fas fa-badge-check"></i>
            Verificado
          </div>
        </div>
      </div>
    </div>
  </section>

  <- Estructura limpia y FAQ ELEGANTE -->
  <section class="faq-elegant">
    <div class="container">
      <div class="faq-header">
        <span class="section-kicker">¿Tienes Dudas?</span>
        <h2>Preguntas Frecuentes</h2>
        <p>Respuestas a las preguntas más comunes sobre Fruvi</p>
      </div>

      <div class="faq-grid">
        <div class="faq-item-premium">
          <div class="faq-question-premium">
            <i class="fas fa-circle-question"></i>
            <h3>¿Realmente es gratis registrarse?</h3>
          </div>
          <div class="faq-answer-premium">
            <p>Sí, 100% gratis. Creas tu cuenta sin costo, sin tarjeta de crédito y sin compromiso. Accedes inmediatamente a las 5 plataformas. Solo pagas cuando decides comprar frutas.</p>
          </div>
        </div>

        <div class="faq-item-premium">
          <div class="faq-question-premium">
            <i class="fas fa-circle-question"></i>
            <h3>¿Cómo garantizan la frescura?</h3>
          </div>
          <div class="faq-answer-premium">
            <p>Coordinamos cosecha y despacho en 24-48h máximo. Usamos empaques con control de temperatura, 3 controles de calidad por pedido y cadena de frío completa. Garantía de frescura 100% o reembolso total.</p>
          </div>
        </div>

        <div class="faq-item-premium">
          <div class="faq-question-premium">
            <i class="fas fa-circle-question"></i>
            <h3>¿El Dr. IA puede reemplazar a mi doctor?</h3>
          </div>
          <div class="faq-answer-premium">
            <p>No. El Dr. IA es un asistente nutricional educativo, no reemplaza consultas médicas profesionales. Para diagnósticos o tratamientos, siempre consulta a un médico certificado.</p>
          </div>
        </div>

        <div class="faq-item-premium">
          <div class="faq-question-premium">
            <i class="fas fa-circle-question"></i>
            <h3>¿Puedo cancelar mi suscripción FruviBox?</h3>
          </div>
          <div class="faq-answer-premium">
            <p>Sí, cuando quieras. Sin penalizaciones, sin contratos largos. Pausas o cancelas desde tu dashboard con un clic. Si cancelas, mantienes acceso a todas las demás plataformas.</p>
          </div>
        </div>

        <div class="faq-item-premium">
          <div class="faq-question-premium">
            <i class="fas fa-circle-question"></i>
            <h3>¿Qué métodos de pago aceptan?</h3>
          </div>
          <div class="faq-answer-premium">
            <p>Tarjetas de crédito/débito (Visa, Mastercard, Amex), PSE, Nequi, Daviplata y transferencias bancarias. Todos los pagos están encriptados con SSL de 256 bits.</p>
          </div>
        </div>

        <div class="faq-item-premium">
          <div class="faq-question-premium">
            <i class="fas fa-circle-question"></i>
            <h3>¿Hacen envíos a toda Colombia?</h3>
          </div>
          <div class="faq-answer-premium">
            <p>Actualmente cubrimos Bogotá, Medellín, Cali, Barranquilla y sus áreas metropolitanas. Estamos expandiendo a más ciudades cada mes. Regístrate para recibir notificación cuando lleguemos a tu ciudad.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <- Estructura limpia y CTA FINAL CON URGENCIA -->
  <section class="final-cta-urgent">
    <div class="container">
      <div class="cta-urgent-content">
        <div class="cta-urgent-badge">
          <i class="fas fa-fire"></i>
          Oferta de Lanzamiento
        </div>
        <h2>Únete Hoy y Recibe Beneficios Exclusivos</h2>
        <p class="cta-urgent-desc">
          Los primeros <strong>500 nuevos miembros</strong> de este mes reciben:
        </p>

        <div class="cta-benefits-list">
          <div class="cta-benefit-item">
            <i class="fas fa-gift"></i>
            <span><strong>Envío Gratis</strong> en tu primera compra (ahorra $15.000)</span>
          </div>
          <div class="cta-benefit-item">
            <i class="fas fa-percent"></i>
            <span><strong>20% de descuento</strong> en tu primera FruviBox</span>
          </div>
          <div class="cta-benefit-item">
            <i class="fas fa-star"></i>
            <span><strong>Acceso VIP</strong> a recetas exclusivas de Frushake IA</span>
          </div>
          <div class="cta-benefit-item">
            <i class="fas fa-crown"></i>
            <span><strong>Consulta premium</strong> de 30 min con Dr. IA incluida</span>
          </div>
        </div>

        <div class="cta-urgent-stats">
          <div class="cta-stat-item">
            <div class="stat-number-large">15,247</div>
            <div class="stat-label-large">Miembros Activos</div>
          </div>
          <div class="cta-stat-item">
            <div class="stat-number-large">4.9/5</div>
            <div class="stat-label-large">Calificación</div>
          </div>
          <div class="cta-stat-item">
            <div class="stat-number-large">98.2%</div>
            <div class="stat-label-large">Satisfacción</div>
          </div>
        </div>

        <div class="cta-urgent-actions">
          <a href="#/registro" class="cta-button-final">
            <i class="fas fa-rocket"></i>
            Crear Mi Cuenta Gratis Ahora
          </a>
          <p class="cta-urgent-note">
            ⚡ <strong>Solo quedan 143 espacios</strong> con beneficios de lanzamiento<br>
            ✅ Sin tarjeta de crédito • Activación instantánea • Cancela cuando quieras
          </p>
        </div>

        <div class="cta-trust-final">
          <div class="trust-item">
            <i class="fas fa-shield-check"></i>
            <span>Pago Seguro SSL</span>
          </div>
          <div class="trust-item">
            <i class="fas fa-award"></i>
            <span>Certificado Orgánico</span>
          </div>
          <div class="trust-item">
            <i class="fas fa-medal"></i>
            <span>Premio Mejor Servicio 2024</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}
