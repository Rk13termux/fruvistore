// Home Page - Fruvi Professional Design
export function renderHomePage(root) {
  root.innerHTML = `
  <!-- HERO PROFESSIONAL -->
  <section class="hero-pro">
    <div class="animated-background">
      <div class="particles"></div>
      <div class="gradient-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
      <div class="grid-overlay"></div>
    </div>
    
    <div class="container hero-pro__content">
      <div class="hero-pro__main">
        <div class="hero-pro__badge">
          <div class="badge-glow"></div>
          <i class="fas fa-star"></i>
          <span>Líder en frutas premium</span>
        </div>
        
        <h1 class="hero-pro__title">
          <span class="title-line-1">Frutas Premium</span>
          <span class="title-line-2">Directas del Huerto</span>
          <span class="title-accent">Con Tecnología IA</span>
        </h1>
        
        <p class="hero-pro__description">
          Revoluciona tu alimentación con frutas seleccionadas por expertos, 
          entregadas en 24h y analizadas por nuestra IA nutricional avanzada.
        </p>
        
        <div class="hero-pro__metrics">
          <div class="metric-item">
            <div class="metric-number">15,000+</div>
            <div class="metric-label">Clientes activos</div>
          </div>
          <div class="metric-item">
            <div class="metric-number">98.7%</div>
            <div class="metric-label">Satisfacción</div>
          </div>
          <div class="metric-item">
            <div class="metric-number">24h</div>
            <div class="metric-label">Entrega garantizada</div>
          </div>
        </div>
        
        <div class="hero-pro__actions">
          <button class="btn-primary-pro" onclick="location.href='#/registro'">
            <span class="btn-text">Comenzar Ahora</span>
            <div class="btn-glow"></div>
            <i class="fas fa-arrow-right"></i>
          </button>
          <button class="btn-secondary-pro" onclick="location.href='#/tienda'">
            <span class="btn-text">Ver Productos</span>
            <i class="fas fa-shopping-basket"></i>
          </button>
        </div>
        
        <div class="hero-pro__trust">
          <div class="trust-item">
            <i class="fas fa-shield-check"></i>
            <span>Certificación orgánica</span>
          </div>
          <div class="trust-item">
            <i class="fas fa-truck"></i>
            <span>Envío gratis +$25k</span>
          </div>
          <div class="trust-item">
            <i class="fas fa-medal"></i>
            <span>Garantía 100%</span>
          </div>
        </div>
      </div>
      
      <div class="hero-pro__visual">
        <div class="floating-card main-card">
          <div class="card-glow"></div>
          <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=500&auto=format&fit=crop" alt="Frutas premium">
          <div class="card-overlay">
            <div class="quality-seal">
              <i class="fas fa-certificate"></i>
              <span>Premium</span>
            </div>
          </div>
        </div>
        
        <div class="floating-card ai-card">
          <div class="ai-icon">
            <i class="fas fa-brain"></i>
          </div>
          <div class="ai-content">
            <h4>IA Nutricional</h4>
            <p>Análisis personalizado</p>
            <div class="ai-progress">
              <div class="progress-bar"></div>
            </div>
          </div>
        </div>
        
        <div class="floating-card delivery-card">
          <div class="delivery-icon">
            <i class="fas fa-shipping-fast"></i>
          </div>
          <div class="delivery-content">
            <h4>Entrega Express</h4>
            <p>En 24 horas</p>
            <div class="delivery-status">
              <div class="status-dot"></div>
              <span>En camino</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FEATURES PROFESSIONAL -->
  <section class="features-pro">
    <div class="container">
      <div class="section-header-pro">
        <h2>¿Por qué somos diferentes?</h2>
        <p>Tecnología, calidad y experiencia que marca la diferencia</p>
      </div>
      
      <div class="features-grid-pro">
        <div class="feature-card-pro">
          <div class="feature-icon">
            <i class="fas fa-seedling"></i>
          </div>
          <h3>Origen Certificado</h3>
          <p>Trazabilidad completa desde el huerto hasta tu mesa. Certificaciones orgánicas y de comercio justo.</p>
          <div class="feature-link">
            <span>Conocer más</span>
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
        
        <div class="feature-card-pro">
          <div class="feature-icon">
            <i class="fas fa-brain"></i>
          </div>
          <h3>Inteligencia Artificial</h3>
          <p>Análisis nutricional personalizado y recomendaciones basadas en tus objetivos de salud.</p>
          <div class="feature-link">
            <span>Probar IA</span>
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
        
        <div class="feature-card-pro">
          <div class="feature-icon">
            <i class="fas fa-rocket"></i>
          </div>
          <h3>Entrega Ultra-rápida</h3>
          <p>Logística optimizada con cadena de frío. De la cosecha a tu puerta en menos de 24 horas.</p>
          <div class="feature-link">
            <span>Ver zonas</span>
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- PRODUCTS SHOWCASE -->
  <section class="products-pro">
    <div class="container">
      <div class="section-header-pro">
        <h2>Productos estrella</h2>
        <p>Lo mejor de cada temporada, seleccionado por expertos</p>
      </div>
      
      <div class="products-slider-pro">
        <div class="product-card-pro">
          <div class="product-image">
            <img src="https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=400&auto=format&fit=crop" alt="Manzanas premium">
            <div class="product-badge">Bestseller</div>
          </div>
          <div class="product-info">
            <h4>Manzanas Gala Premium</h4>
            <p>Valle del Elqui, Chile</p>
            <div class="product-price">$8.990 <span>/kg</span></div>
            <button class="add-to-cart-pro">
              <i class="fas fa-plus"></i>
              Agregar
            </button>
          </div>
        </div>
        
        <div class="product-card-pro">
          <div class="product-image">
            <img src="https://images.unsplash.com/photo-1543528176-61b239494933?q=80&w=400&auto=format&fit=crop" alt="Fresas orgánicas">
            <div class="product-badge">Orgánico</div>
          </div>
          <div class="product-info">
            <h4>Fresas Orgánicas</h4>
            <p>Curicó, Chile</p>
            <div class="product-price">$12.990 <span>/bandeja</span></div>
            <button class="add-to-cart-pro">
              <i class="fas fa-plus"></i>
              Agregar
            </button>
          </div>
        </div>
        
        <div class="product-card-pro">
          <div class="product-image">
            <img src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=400&auto=format&fit=crop" alt="Aguacates Hass">
            <div class="product-badge">Premium</div>
          </div>
          <div class="product-info">
            <h4>Aguacates Hass</h4>
            <p>La Ligua, Chile</p>
            <div class="product-price">$15.990 <span>/kg</span></div>
            <button class="add-to-cart-pro">
              <i class="fas fa-plus"></i>
              Agregar
            </button>
          </div>
        </div>
      </div>
      
      <div class="products-cta">
        <button class="btn-outline-pro" onclick="location.href='#/tienda'">
          Ver toda la tienda
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS MINIMAL -->
  <section class="testimonials-pro">
    <div class="container">
      <div class="section-header-pro">
        <h2>Lo que dicen nuestros clientes</h2>
        <p>Experiencias reales de quienes ya transformaron su alimentación</p>
      </div>
      
      <div class="testimonials-grid-pro">
        <div class="testimonial-card-pro">
          <div class="testimonial-content">
            <p>"La calidad es excepcional. Mis hijos ahora prefieren las frutas a los dulces."</p>
          </div>
          <div class="testimonial-author">
            <img src="https://images.unsplash.com/photo-1494790108755-2616b612b550?q=80&w=100&auto=format&fit=crop" alt="María González">
            <div class="author-info">
              <h5>María González</h5>
              <span>Madre de familia</span>
            </div>
          </div>
        </div>
        
        <div class="testimonial-card-pro">
          <div class="testimonial-content">
            <p>"Como chef, la diferencia en sabor y frescura es notable. Fruvi es mi proveedor oficial."</p>
          </div>
          <div class="testimonial-author">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="Luis Rodriguez">
            <div class="author-info">
              <h5>Luis Rodríguez</h5>
              <span>Chef ejecutivo</span>
            </div>
          </div>
        </div>
        
        <div class="testimonial-card-pro">
          <div class="testimonial-content">
            <p>"La IA nutricional me ayudó a optimizar mi dieta. Mi energía mejoró notablemente."</p>
          </div>
          <div class="testimonial-author">
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop" alt="Ana Patricia">
            <div class="author-info">
              <h5>Ana Patricia</h5>
              <span>Nutricionista</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FINAL CTA PROFESSIONAL -->
  <section class="cta-pro">
    <div class="container">
      <div class="cta-pro__content">
        <h2>Comienza tu transformación hoy</h2>
        <p>Únete a miles de familias que ya disfrutan de la mejor calidad en frutas premium</p>
        
        <div class="cta-pro__actions">
          <button class="btn-primary-pro large" onclick="location.href='#/registro'">
            <span class="btn-text">Crear cuenta gratis</span>
            <div class="btn-glow"></div>
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div class="cta-pro__benefits">
          <div class="benefit-item">
            <i class="fas fa-check"></i>
            <span>Sin compromiso</span>
          </div>
          <div class="benefit-item">
            <i class="fas fa-check"></i>
            <span>Envío gratis primer pedido</span>
          </div>
          <div class="benefit-item">
            <i class="fas fa-check"></i>
            <span>Acceso completo a IA</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}
