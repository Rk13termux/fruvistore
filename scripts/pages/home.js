// Home Page - Fruvi Landing (dark glass)
export function renderHomePage(root) {
  root.innerHTML = `
  <!-- HERO -->
  <section class="hero">
    <div class="container hero__grid">
      <div class="hero__copy fade-in-up">
        <h1>Fruvi: Fruta premium, fresca y trazable</h1>
        <p>Conecta con cultivos locales, recibe fruta seleccionada y descubre su valor nutricional con IA. Calidad verificada, entrega programada y soporte experto.</p>
        <div class="hero__actions">
          <a class="cta-button glow-pulse" href="#/registro">Crear cuenta</a>
          <a class="btn-link" href="#/nutricion-ai">Explorar Nutrición AI →</a>
        </div>
        <div class="hero__badges">
          <span class="badge glass">Entrega 24-48h</span>
          <span class="badge glass">Origen verificado</span>
          <span class="badge glass">Pago seguro</span>
        </div>
      </div>
      <div class="hero__media fade-in-up">
        <div class="media-card glass">
          <img src="https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=900&auto=format&fit=crop" alt="Frutas premium">
        </div>
      </div>
    </div>
  </section>

  <!-- FEATURES -->
  <section class="section features">
    <div class="container">
      <h2 class="section__title">¿Por qué elegir Fruvi?</h2>
      <div class="cards-grid">
        ${[
          { icon:'fa-seedling', title:'Calidad certificada', desc:'Selección por lotes con controles de frescura y sabor. Estándares premium en toda la cadena.' },
          { icon:'fa-truck-fast', title:'Logística óptima', desc:'Cosecha + empaquetado + entrega en 24-48h. Mantén la cadena de frío y los nutrientes.' },
          { icon:'fa-shield-heart', title:'Salud y bienestar', desc:'Planes personalizados de frutas según tus metas. IA nutricional para recomendaciones.' },
          { icon:'fa-mobile-screen', title:'Experiencia app', desc:'Compra en 3 toques. Historial, favoritos y reordenes. Chat IA 24/7.' }
        ].map(f => `
          <article class="card glass fade-in-up">
            <i class="fas ${f.icon} card__icon"></i>
            <h3>${f.title}</h3>
            <p>${f.desc}</p>
          </article>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- PRODUCT SPOTLIGHT -->
  <section class="section spotlight">
    <div class="container spotlight__wrap glass">
      <div class="spotlight__copy">
        <h2>Naranjas de Valencia • Dulzura con Vitamina C</h2>
        <p>Directo del productor. Niveles altos de vitamina C y antioxidantes. Perfectas para jugos o snacks energéticos.</p>
        <div class="spotlight__actions">
          <a class="cta-button" href="#/tienda">Ver tienda</a>
          <a class="btn-link" href="#/nutricion-ai">Ver nutrición con IA</a>
        </div>
      </div>
      <div class="spotlight__media">
        <img src="https://images.unsplash.com/photo-1607877411656-e1e4e9f7f4a2?q=80&w=900&auto=format&fit=crop" alt="Naranjas frescas">
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section class="section how-it-works">
    <div class="container">
      <h2 class="section__title">¿Cómo funciona?</h2>
      <div class="steps-grid">
        ${[
          { step:'01', title:'Regístrate', text:'Crea tu cuenta y dinos tus preferencias de frutas.' },
          { step:'02', title:'Elige y ordena', text:'Explora la tienda, agrega al carrito y confirma.' },
          { step:'03', title:'IA Nutricional', text:'Consulta beneficios y nutrientes con Fruvi AI.' },
          { step:'04', title:'Recibe tu pedido', text:'Entrega programada en 24-48h. Frescura garantizada.' }
        ].map(s => `
          <div class="step glass fade-in-up">
            <div class="step__num">${s.step}</div>
            <h3>${s.title}</h3>
            <p>${s.text}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS -->
  <section class="section testimonials">
    <div class="container">
      <h2 class="section__title">Clientes que confían en Fruvi</h2>
      <div class="cards-grid">
        ${[
          { quote:'La calidad es excepcional y la IA me ayuda a elegir mejor.', name:'María G.' },
          { quote:'Entregas puntuales y frutas con sabor increíble.', name:'Luis R.' },
          { quote:'Mi plan semanal de frutas me ha mejorado la energía.', name:'Ana P.' }
        ].map(t => `
          <blockquote class="card glass fade-in-up">
            <p>“${t.quote}”</p>
            <footer>— ${t.name}</footer>
          </blockquote>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="section faq">
    <div class="container">
      <h2 class="section__title">Preguntas frecuentes</h2>
      <div class="faq__list">
        ${[
          { q:'¿De dónde provienen las frutas?', a:'Trabajamos con productores locales certificados y trazabilidad por lote.' },
          { q:'¿Cómo se garantiza la frescura?', a:'Cosecha y despacho coordinados, cadena de frío y tiempos máximos de tránsito.' },
          { q:'¿Qué métodos de pago aceptan?', a:'Tarjetas, transferencias y billeteras. Pago seguro cifrado.' },
          { q:'¿Puedo ver la nutrición de cualquier fruta?', a:'Sí, con Nutrición AI obtienes datos por 100 g para frutas de todo el mundo.' }
        ].map(item => `
          <details class="faq__item glass">
            <summary>${item.q}</summary>
            <p>${item.a}</p>
          </details>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- FINAL CTA -->
  <section class="section final-cta">
    <div class="container final-cta__wrap glass fade-in-up">
      <h2>Empieza hoy con Fruvi</h2>
      <p>Regístrate gratis, recibe frutas premium y descubre su valor con IA.</p>
      <div>
        <a href="#/registro" class="cta-button">Crear cuenta</a>
        <a href="#/tienda" class="btn-link">Ver tienda →</a>
      </div>
    </div>
  </section>
  `;
}
