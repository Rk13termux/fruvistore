const WHATSAPP_NUMBER = '573013401182';

const COP_FORMATTER = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

const BOXES_DATA = [
  {
    id: 'aurora-boreal',
    level: 'Signature',
    title: 'Caja Aurora Boreal',
    theme: 'Botánica nórdica x Boyacá',
    price: 189000,
    servings: '8 - 10 porciones',
    leadTime: '48h de antelación',
    image: '/images/products/arandanos-azules.jpg',
    description: 'Frutas frías con toques florales y cítricos, pensadas para amenidades de lujo y regalos con narrativa.',
    highlights: [
      'Notas azules y cítricas en equilibrio',
      'Incluye ficha sensorial curada por Fruvi',
      'Ideal para amenidades premium'
    ],
    fruits: [
      { name: 'Arándanos azules', origin: 'Boyacá, Colombia', note: 'Toque ácido refrescante' },
      { name: 'Frambuesas', origin: 'Cundinamarca, Colombia', note: 'Aroma floral delicado' },
      { name: 'Moras silvestres', origin: 'Santander, Colombia', note: 'Notas terrosas profundas' },
      { name: 'Feijoa boyacense', origin: 'Duitama, Colombia', note: 'Aroma botánico fresco' }
    ],
    extras: [
      'Ficha sensorial curada por Fruvi',
      'Playlist ambient Fruvi para acompañar la experiencia'
    ],
    season: 'Invierno 2025'
  },
  {
    id: 'selva-en-bruma',
    level: 'Boutique',
    title: 'Selva en Bruma',
    theme: 'Tropical consciente',
    price: 149000,
    servings: '6 - 8 porciones',
    leadTime: '36h de antelación',
    image: '/images/products/pina-golden.jpg',
    description: 'Selección vibrante inspirada en rituales de bienestar. Ideal para bienvenida a spas, retiros creativos o ejecutivos en misión.',
    highlights: [
      'Equilibrio entre dulzor y acidez',
      'Presentación en capas con musgo preservado'
    ],
    fruits: [
      { name: 'Piña golden', origin: 'Meta, Colombia', note: 'Dulzor tropical intenso' },
      { name: 'Maracuyá amarillo', origin: 'Huila, Colombia', note: 'Toque ácido refrescante' },
      { name: 'Guanábana', origin: 'Valle del Cauca, Colombia', note: 'Aroma exótico suave' },
      { name: 'Mango tommy', origin: 'Tolima, Colombia', note: 'Textura cremosa' }
    ],
    extras: [
      'Etiqueta personalizada con mensaje de bienvenida'
    ],
    occasions: ['evento', 'hospitality'],
    season: 'Colección Selva Viva'
  },
  {
    id: 'atelier-citrico',
    level: 'Experiencia',
    title: 'Atelier Cítrico',
    theme: 'Cítricos premium',
    price: 129000,
    servings: '6 - 8 porciones',
    leadTime: '24h de antelación',
    image: '/images/products/naranja-valencia.jpg',
    description: 'Colección de cítricos finos con notas herbales. Perfecta para brunchs ejecutivos o celebraciones íntimas.',
    highlights: [
      'Selección de cítricos premium',
      'Notas herbales frescas'
    ],
    fruits: [
      { name: 'Naranja Valencia', origin: 'Valle del Cauca, Colombia', note: 'Jugo abundante y dulce' },
      { name: 'Limón Tahití', origin: 'Santander, Colombia', note: 'Acidez equilibrada' },
      { name: 'Pomelo rosado', origin: 'Cundinamarca, Colombia', note: 'Toque floral sutil' },
      { name: 'Mandarina clementina', origin: 'Antioquia, Colombia', note: 'Aroma cítrico intenso' }
    ],
    extras: [
      'Receta de cóctel cítrico incluida'
    ],
    occasions: ['brunch', 'celebracion'],
    season: 'Primavera 2025'
  },
  {
    id: 'bosque-magico',
    level: 'Deluxe',
    title: 'Bosque Mágico',
    theme: 'Bosque encantado',
    price: 169000,
    servings: '8 - 10 porciones',
    leadTime: '48h de antelación',
    image: '/images/products/uva-verde.jpg',
    description: 'Frutas silvestres con toques mágicos. Ideal para experiencias premium y regalos memorables.',
    highlights: [
      'Frutas silvestres premium',
      'Presentación artística'
    ],
    fruits: [
      { name: 'Uva verde sin semilla', origin: 'Cundinamarca, Colombia', note: 'Crocante y dulce' },
      { name: 'Fresas del Quindío', origin: 'Quindío, Colombia', note: 'Aroma intenso' },
      { name: 'Moras de Castilla', origin: 'Santander, Colombia', note: 'Toque ácido' },
      { name: 'Arándanos rojos', origin: 'Boyacá, Colombia', note: 'Notas dulces' }
    ],
    extras: [
      'Caja decorativa reutilizable',
      'Tarjeta con historia de cada fruta'
    ],
    occasions: ['regalo', 'experiencia'],
    season: 'Verano 2025'
  },
  {
    id: 'jardin-secreto',
    level: 'Premium',
    title: 'Jardín Secreto',
    theme: 'Jardín exótico',
    price: 199000,
    servings: '10 - 12 porciones',
    leadTime: '72h de antelación',
    image: '/images/products/mango-azucar.jpg',
    description: 'La experiencia más completa de Fruvi. Frutas exóticas con narrativa premium para ocasiones especiales.',
    highlights: [
      'Selección de frutas exóticas',
      'Experiencia completa premium'
    ],
    fruits: [
      { name: 'Mango azúcar', origin: 'Tolima, Colombia', note: 'Dulzor excepcional' },
      { name: 'Papaya maradol', origin: 'Valle del Cauca, Colombia', note: 'Textura cremosa' },
      { name: 'Carambolo', origin: 'Cundinamarca, Colombia', note: 'Forma estrella única' },
      { name: 'Rambután', origin: 'Meta, Colombia', note: 'Textura peluda exótica' },
      { name: 'Pitahaya amarilla', origin: 'Santander, Colombia', note: 'Sabor tropical suave' }
    ],
    extras: [
      'Libro de recetas premium',
      'Acceso a club exclusivo Fruvi'
    ],
    occasions: ['especial', 'premium'],
    season: 'Colección Jardín Secreto'
  },
  {
    id: 'oceano-profundo',
    level: 'Signature',
    title: 'Océano Profundo',
    theme: 'Marino ancestral',
    price: 195000,
    servings: '8 - 10 porciones',
    leadTime: '48h de antelación',
    image: '/images/products/arandanos-azules.jpg',
    description: 'Frutas azules y tropicales que evocan la profundidad del océano. Una experiencia sensorial única.',
    highlights: [
      'Paleta azul profunda y refrescante',
      'Inspirado en aguas ancestrales',
      'Ritual de degustación incluido'
    ],
    fruits: [
      { name: 'Arándanos azules', origin: 'Boyacá, Colombia', note: 'Profundidad azul intensa' },
      { name: 'Moras azules', origin: 'Santander, Colombia', note: 'Toque oceánico' },
      { name: 'Uva negra', origin: 'Cundinamarca, Colombia', note: 'Aroma profundo' },
      { name: 'Granada roja', origin: 'Antioquia, Colombia', note: 'Explosión de sabor' }
    ],
    extras: [
      'Ritual de degustación guiada',
      'Música ambiental marina'
    ],
    occasions: ['experiencia', 'especial'],
    season: 'Otoño 2025'
  },
  {
    id: 'montana-sagrada',
    level: 'Boutique',
    title: 'Montaña Sagrada',
    theme: 'Andino espiritual',
    price: 155000,
    servings: '6 - 8 porciones',
    leadTime: '36h de antelación',
    image: '/images/products/feijoa.jpg',
    description: 'Frutas de altura con esencia andina. Conecta con la espiritualidad de las montañas colombianas.',
    highlights: [
      'Frutas de páramo premium',
      'Energía andina ancestral',
      'Cosecha sostenible'
    ],
    fruits: [
      { name: 'Feijoa premium', origin: 'Boyacá, Colombia', note: 'Esencia andina pura' },
      { name: 'Mora de páramo', origin: 'Cundinamarca, Colombia', note: 'Frescura de altura' },
      { name: 'Fresa silvestre', origin: 'Santander, Colombia', note: 'Sabor ancestral' },
      { name: 'Arándano andino', origin: 'Nariño, Colombia', note: 'Toque místico' }
    ],
    extras: [
      'Ceremonia de agradecimiento incluida',
      'Infusión de hierbas andinas'
    ],
    occasions: ['espiritual', 'experiencia'],
    season: 'Invierno Andino'
  },
  {
    id: 'desierto-dorado',
    level: 'Experiencia',
    title: 'Desierto Dorado',
    theme: 'Sahara colombiano',
    price: 135000,
    servings: '6 - 8 porciones',
    leadTime: '24h de antelación',
    image: '/images/products/mango-azucar.jpg',
    description: 'Frutas doradas que brillan como el sol del desierto. Una experiencia cálida y reconfortante.',
    highlights: [
      'Paleta dorada y soleada',
      'Frutas desérticas colombianas',
      'Energía solar positiva'
    ],
    fruits: [
      { name: 'Mango dorado', origin: 'Tolima, Colombia', note: 'Sol tropical' },
      { name: 'Papaya amarilla', origin: 'Valle del Cauca, Colombia', note: 'Calidez natural' },
      { name: 'Piña miel', origin: 'Meta, Colombia', note: 'Dulzura desértica' },
      { name: 'Maracuyá maduro', origin: 'Huila, Colombia', note: 'Pasión dorada' }
    ],
    extras: [
      'Aceite esencial de frutas cítricas',
      'Tarjeta con afirmaciones positivas'
    ],
    occasions: ['celebracion', 'regalo'],
    season: 'Verano Dorado'
  },
  {
    id: 'valle-encantado',
    level: 'Deluxe',
    title: 'Valle Encantado',
    theme: 'Mágico colombiano',
    price: 175000,
    servings: '8 - 10 porciones',
    leadTime: '48h de antelación',
    image: '/images/products/uva-verde.jpg',
    description: 'Frutas legendarias de los valles colombianos. Una caja que cuenta historias ancestrales.',
    highlights: [
      'Frutas con historia cultural',
      'Presentación artística única',
      'Narrativa incluida'
    ],
    fruits: [
      { name: 'Uva criolla', origin: 'Cundinamarca, Colombia', note: 'Tradición ancestral' },
      { name: 'Guayaba rosa', origin: 'Quindío, Colombia', note: 'Sabor legendario' },
      { name: 'Níspero chino', origin: 'Antioquia, Colombia', note: 'Fruta mítica' },
      { name: 'Ciruela roja', origin: 'Santander, Colombia', note: 'Colorido encantado' }
    ],
    extras: [
      'Historia de cada fruta incluida',
      'Caja decorativa artesanal',
      'Certificado de autenticidad'
    ],
    occasions: ['regalo', 'especial'],
    season: 'Colección Legendaria'
  },
  {
    id: 'sabana-eterna',
    level: 'Premium',
    title: 'Sábana Eterna',
    theme: 'Llanero infinito',
    price: 210000,
    servings: '10 - 12 porciones',
    leadTime: '72h de antelación',
    image: '/images/products/pina-golden.jpg',
    description: 'La experiencia más completa de la sabana colombiana. Frutas que representan la inmensidad de nuestros llanos.',
    highlights: [
      'Selección completa de frutas llaneras',
      'Experiencia cultural total',
      'Conexión con la tierra infinita'
    ],
    fruits: [
      { name: 'Piña gigante', origin: 'Meta, Colombia', note: 'Inmensidad tropical' },
      { name: 'Mango de la sabana', origin: 'Casanare, Colombia', note: 'Sabor ancestral' },
      { name: 'Papaya llanera', origin: 'Arauca, Colombia', note: 'Dulzura infinita' },
      { name: 'Guayaba sabanera', origin: 'Vichada, Colombia', note: 'Frescura eterna' },
      { name: 'Corozo dulce', origin: 'Guaviare, Colombia', note: 'Tesoro escondido' }
    ],
    extras: [
      'Libro de historias llaneras',
      'Música tradicional incluida',
      'Acceso VIP a eventos Fruvi',
      'Caja premium con diseño exclusivo'
    ],
    occasions: ['premium', 'experiencia', 'especial'],
    season: 'Sábana Infinita'
  }
];

function formatOption(value, label) {
  return `<option value="${value}">${label}</option>`;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function buildBoxCard(box) {
  const highlightsHtml = box.highlights.map(highlight => `<li>${highlight}</li>`).join('');
  const fruitsHtml = box.fruits.map(fruit =>
    `<div class="fruit-item">
      <strong>${fruit.name}</strong> - ${fruit.origin}
      <small>${fruit.note}</small>
    </div>`
  ).join('');
  const extrasHtml = box.extras.map(extra => `<li>${extra}</li>`).join('');

  return `
    <div class="box-card" data-box-id="${box.id}" data-level="${box.level}" data-occasions="${box.occasions ? box.occasions.join(',') : ''}">
      <div class="box-image">
        <img src="${box.image}" alt="${box.title}" loading="lazy">
        <div class="box-level">${box.level}</div>
      </div>
      <div class="box-content">
        <h3 class="box-title">${box.title}</h3>
        <p class="box-theme">${box.theme}</p>
        <p class="box-description">${box.description}</p>
        <div class="box-details">
          <div class="box-price">${COP_FORMATTER.format(box.price)}</div>
          <div class="box-servings">${box.servings}</div>
          <div class="box-lead-time">${box.leadTime}</div>
        </div>
        <div class="box-highlights">
          <h4>Características destacadas:</h4>
          <ul>${highlightsHtml}</ul>
        </div>
        <div class="box-fruits">
          <h4>Frutas incluidas:</h4>
          ${fruitsHtml}
        </div>
        ${extrasHtml ? `
        <div class="box-extras">
          <h4>Extras incluidos:</h4>
          <ul>${extrasHtml}</ul>
        </div>
        ` : ''}
        <div class="box-actions">
          <button class="btn btn-primary whatsapp-order" data-box-id="${box.id}">Ordenar por WhatsApp</button>
        </div>
      </div>
    </div>
  `;
}

function buildStepsSection() {
  return `
    <section class="steps-section">
      <div class="container">
        <h2>¿Cómo funciona?</h2>
        <div class="steps-grid">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Elige tu caja</h3>
            <p>Explora nuestras cajas misteriosas y encuentra la perfecta para tu ocasión.</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Personaliza tu pedido</h3>
            <p>Indica fecha de entrega, mensaje especial y cualquier requerimiento adicional.</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Recibe tu experiencia</h3>
            <p>Disfruta de frutas frescas premium con entrega a domicilio en Bogotá.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function buildSubscriptionSection() {
  return `
    <section class="subscription-section">
      <div class="container">
        <div class="subscription-content">
          <h2>¿Quieres más experiencias Fruvi?</h2>
          <p>Suscríbete a nuestro newsletter y recibe ofertas exclusivas, lanzamientos de nuevas cajas y tips de frutas.</p>
          <form class="subscription-form">
            <input type="email" placeholder="Tu correo electrónico" required>
            <button type="submit" class="btn btn-primary">Suscribirme</button>
          </form>
        </div>
      </div>
    </section>
  `;
}

function setupMysteryBoxesInteractions() {
  const searchInput = document.getElementById('search-input');
  const levelFilter = document.getElementById('level-filter');
  const occasionFilter = document.getElementById('occasion-filter');
  const boxesGrid = document.querySelector('.boxes-grid');

  if (!searchInput || !levelFilter || !occasionFilter || !boxesGrid) return;

  function filterBoxes() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedLevel = levelFilter.value;
    const selectedOccasion = occasionFilter.value;

    const boxCards = boxesGrid.querySelectorAll('.box-card');

    boxCards.forEach(card => {
      const title = card.querySelector('.box-title').textContent.toLowerCase();
      const description = card.querySelector('.box-description').textContent.toLowerCase();
      const theme = card.querySelector('.box-theme').textContent.toLowerCase();
      const level = card.dataset.level;
      const occasions = card.dataset.occasions || '';

      const matchesSearch = !searchTerm ||
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        theme.includes(searchTerm);

      const matchesLevel = !selectedLevel || level === selectedLevel;
      const matchesOccasion = !selectedOccasion || occasions.includes(selectedOccasion);

      card.style.display = matchesSearch && matchesLevel && matchesOccasion ? 'block' : 'none';
    });
  }

  const debouncedFilter = debounce(filterBoxes, 300);
  searchInput.addEventListener('input', debouncedFilter);
  levelFilter.addEventListener('change', filterBoxes);
  occasionFilter.addEventListener('change', filterBoxes);

  wireCardButtons();
}

function wireCardButtons() {
  document.querySelectorAll('.whatsapp-order').forEach(button => {
    button.addEventListener('click', (e) => {
      const boxId = e.target.dataset.boxId;
      const whatsappUrl = buildWhatsAppUrl(boxId);
      window.open(whatsappUrl, '_blank');
    });
  });
}

function buildWhatsAppUrl(boxId) {
  const box = BOXES_DATA.find(b => b.id === boxId);
  if (!box) return buildGeneralWhatsAppUrl();

  const message = buildWhatsAppMessage(box);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

function buildWhatsAppMessage(box) {
  return `¡Hola Fruvi! 👋

Me interesa ordenar la caja: *${box.title}*
Tema: ${box.theme}
Precio: ${COP_FORMATTER.format(box.price)}
Porciones: ${box.servings}
Tiempo de entrega: ${box.leadTime}

Frutas incluidas:
${box.fruits.map(fruit => `• ${fruit.name} (${fruit.origin})`).join('\n')}

Extras:
${box.extras.map(extra => `• ${extra}`).join('\n')}

¿Me pueden ayudar con el pedido?`;
}

function buildGeneralWhatsAppUrl() {
  const message = encodeURIComponent('¡Hola Fruvi! 👋 Me gustaría conocer más sobre las cajas misteriosas.');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

export function renderMysteryBoxesPage(root) {
  const uniqueLevels = [...new Set(BOXES_DATA.map(box => box.level))];
  const uniqueOccasions = [...new Set(BOXES_DATA.flatMap(box => box.occasions || []))];

  const levelOptions = '<option value="">Todos los niveles</option>' +
    uniqueLevels.map(level => formatOption(level, level)).join('');

  const occasionOptions = '<option value="">Todas las ocasiones</option>' +
    uniqueOccasions.map(occasion => {
      const labels = {
        'evento': 'Evento',
        'hospitality': 'Hospitality',
        'brunch': 'Brunch',
        'celebracion': 'Celebración',
        'regalo': 'Regalo',
        'experiencia': 'Experiencia',
        'especial': 'Especial',
        'premium': 'Premium'
      };
      return formatOption(occasion, labels[occasion] || occasion);
    }).join('');

  root.innerHTML = `
    <div class="mystery-boxes-page">
      <section class="hero-section">
        <div class="container">
          <h1>Cajas Misteriosas Fruvi</h1>
          <p>Descubre experiencias premium con las mejores frutas de Colombia. Cada caja es una narrativa única, curada por expertos en frutas finas.</p>
        </div>
      </section>

      <section class="filters-section">
        <div class="container">
          <div class="filters-grid">
            <div class="filter-group">
              <label for="search-input">Buscar cajas:</label>
              <input type="text" id="search-input" placeholder="Buscar por nombre, tema o descripción...">
            </div>
            <div class="filter-group">
              <label for="level-filter">Nivel:</label>
              <select id="level-filter">${levelOptions}</select>
            </div>
            <div class="filter-group">
              <label for="occasion-filter">Ocación:</label>
              <select id="occasion-filter">${occasionOptions}</select>
            </div>
          </div>
        </div>
      </section>

      <section class="boxes-section">
        <div class="container">
          <div class="boxes-grid">
            ${BOXES_DATA.map(box => buildBoxCard(box)).join('')}
          </div>
        </div>
      </section>

      ${buildStepsSection()}
      ${buildSubscriptionSection()}
    </div>
  `;

  setupMysteryBoxesInteractions();
}
