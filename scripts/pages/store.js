// Store Page - Professional Fruit Store

// Initialize cart store at the top to avoid initialization issues
let cartStore = JSON.parse(localStorage.getItem('fruvi_cart_store') || '[]');
// Make cartStore globally available
window.cartStore = cartStore;

export async function renderStorePage(root) {

  // Detectar si estamos en GitHub Pages o en local
  const isGitHubPages = window.location.hostname.includes('github.io');
  const imagePrefix = isGitHubPages ? '/fruvistore' : '';

  // Obtener estado del usuario desde el objeto global window
  const userStatus = await window.getUserStatus();

  const categories = ['Todas', 'Cítricas', 'Tropicales', 'Bananos', 'Uvas', 'Bayas', 'Frutas Dulces', 'Exóticas'];

  // Get products from Supabase instead of hardcoded data
  let products = [];
  try {
    console.log('📦 Loading products from database...');
    products = await window.getStoreProducts();
    console.log(`✅ Loaded ${products.length} products from database`);
  } catch (error) {
    console.error('❌ Error loading products from database:', error);
    // Fallback to Colombian fruits if database fails
    products = getColombianFruits(imagePrefix);
  }

  const origins = [...new Set(products.map(p => p.origin))].sort();

  const bestSellers = products.slice(0, 10);

  root.innerHTML = `
    <section class="store">
      <!-- Hero Section - Optimizado psicológicamente -->
      <div class="store-hero hero-optimized">
        <div class="container">
          <div class="hero-content-optimized">
            <!-- Badge Premium -->
            <div class="hero-badge-premium">
              <i class="fas fa-crown"></i>
              <span>Calidad Premium</span>
            </div>

            <!-- Título Principal - Enfoque en beneficio -->
            <h1 class="hero-title-optimized">
              <span class="title-line-1">Frutas Frescas</span>
              <span class="title-line-2">Directo a tu Puerta</span>
            </h1>

            <!-- Subtítulo - Propuesta de valor -->
            <p class="hero-subtitle-optimized">
              Nutrición de calidad, frescura garantizada y la mejor selección de frutas premium a un clic de distancia
            </p>

            <!-- Features - Beneficios clave -->
            <div class="hero-features-optimized">
              <div class="feature-item-optimized">
                <i class="fas fa-check-circle"></i>
                <span>100% Orgánico</span>
              </div>
              <div class="feature-item-optimized">
                <i class="fas fa-truck"></i>
                <span>Entrega Hoy</span>
              </div>
              <div class="feature-item-optimized">
                <i class="fas fa-shield-alt"></i>
                <span>Frescura Garantizada</span>
              </div>
            </div>

            <!-- Stats - Prueba social -->
            <div class="hero-stats-optimized">
              <div class="stat-item-optimized">
                <div class="stat-number">${products.length}+</div>
                <div class="stat-label">Productos</div>
              </div>
              <div class="stat-item-optimized featured-stat">
                <div class="stat-number">
                  100%
                  <i class="fas fa-star stat-icon"></i>
                </div>
                <div class="stat-label">Satisfacción</div>
              </div>
              <div class="stat-item-optimized">
                <div class="stat-number">${categories.length - 1}</div>
                <div class="stat-label">Categorías</div>
              </div>
            </div>

            <!-- Trust badges - Credibilidad -->
            <div class="hero-trust-optimized">
              <div class="trust-badge-optimized">
                <i class="fas fa-shipping-fast"></i>
                <span>Express</span>
              </div>
              <div class="trust-badge-optimized">
                <i class="fas fa-leaf"></i>
                <span>Orgánico</span>
              </div>
              <div class="trust-badge-optimized">
                <i class="fas fa-lock"></i>
                <span>Seguro</span>
              </div>
            </div>

            <!-- Urgency banner - Escasez y urgencia -->
            <div class="hero-urgency-optimized store-urgency">
              <i class="fas fa-fire"></i>
              <span>Envío GRATIS +$50k</span>
            </div>
          </div>
        </div>

        <!-- Best Sellers Gallery -->
        <div class="best-sellers-gallery" style="margin-top: 60px;">
          <h2 class="gallery-title" style="text-align: center; font-size: 2rem; font-weight: 700; color: #fff; margin-bottom: 32px; display: flex; align-items: center; justify-content: center; gap: 12px;">
            <i class="fas fa-fire" style="color: #ff6b6b;"></i>
            Los Más Vendidos de la Semana
            <span class="trending-badge" style="background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); color: #000; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 800;">TRENDING</span>
          </h2>
          <div class="gallery-scroll infinite-scroll">
            <div class="gallery-track">
              ${bestSellers.map(product => `
                <div class="gallery-item">
                  <div class="hot-badge">🔥 HOT</div>
                  <img src="${product.img}" alt="${product.name}" loading="lazy">
                  <div class="gallery-item-overlay">
                    <div class="gallery-item-info">
                      <h4>${product.name}</h4>
                      <span class="gallery-price">$${product.priceKg.toFixed(2)}/kg</span>
                    </div>
                  </div>
                </div>
              `).join('')}
              <!-- Duplicate for infinite scroll -->
              ${bestSellers.map(product => `
                <div class="gallery-item">
                  <div class="hot-badge">🔥 HOT</div>
                  <img src="${product.img}" alt="${product.name}" loading="lazy">
                  <div class="gallery-item-overlay">
                    <div class="gallery-item-info">
                      <h4>${product.name}</h4>
                      <span class="gallery-price">$${product.priceKg.toFixed(2)}/kg</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <!-- Header -->
        <div class="store-header">
          <h2>Frutas Premium</h2>
          <p class="store-subtitle">Frescura garantizada directo del campo a tu mesa. Cada fruta seleccionada con los más altos estándares de calidad para tu bienestar.</p>

          <!-- Registration Banner for non-registered users -->
          ${userStatus.isGuest ? `
            <div class="registration-banner glass">
              <div class="banner-content">
                <div class="banner-icon">
                  <i class="fas fa-user-plus"></i>
                </div>
                <div class="banner-text">
                  <h3>¡Regístrate y accede a beneficios exclusivos!</h3>
                  <p>Compra frutas frescas, recibe entregas a domicilio y obtén ofertas especiales</p>
                </div>
                <div class="banner-actions">
                  <button class="btn-primary register-now" onclick="window.location.hash='#/registro'">
                    <i class="fas fa-rocket"></i>
                    Registrarme Ahora
                  </button>
                </div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Registration Benefits (for non-registered users) -->
        ${userStatus.isGuest ? `
          <div class="registration-benefits">
            <h3 class="benefits-title">
              <i class="fas fa-star"></i>
              ¿Qué obtienes al registrarte?
            </h3>
            <div class="benefits-grid">
              ${window.getRegistrationBenefits().map(benefit => `
                <div class="benefit-card glass">
                  <div class="benefit-icon">
                    <i class="${benefit.icon}"></i>
                  </div>
                  <div class="benefit-content">
                    <h4>${benefit.title}</h4>
                    <p>${benefit.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Filters Section - Rediseñada -->
        <div class="store-filters-container">
          <div class="filters-header">
            <h3>
              <i class="fas fa-filter"></i>
              Encuentra Tu Fruta Ideal
            </h3>
            <p>Utiliza los filtros para personalizar tu búsqueda y encontrar las frutas perfectas para ti</p>
          </div>
          
          <div class="store-filters glass">
            <!-- Grid de filtros vertical -->
            <div class="filters-grid">
              <!-- Buscador de Frutas -->
              <div class="filter-group search-group">
                <label>
                  <i class="fas fa-search"></i>
                  BUSCAR FRUTAS:
                </label>
                <div class="search-input-wrapper">
                  <input 
                    type="text" 
                    id="searchFilter" 
                    placeholder="Escribe el nombre de la fruta que buscas..."
                    autocomplete="off"
                  >
                  <i class="fas fa-times search-clear" id="searchClear" style="display: none;"></i>
                </div>
              </div>

              <!-- Categoría -->
              <div class="filter-group">
                <label>
                  <i class="fas fa-tags"></i>
                  CATEGORÍA:
                </label>
                <select id="categoryFilter" class="filter-select">
                  ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
              </div>

              <!-- Ordenar por -->
              <div class="filter-group">
                <label>
                  <i class="fas fa-sort"></i>
                  ORDENAR POR:
                </label>
                <select id="sortFilter" class="filter-select">
                  <option value="name" selected>Nombre</option>
                  <option value="price-low">Precio: Menor a Mayor</option>
                  <option value="price-high">Precio: Mayor a Menor</option>
                  <option value="rating">Mejor Calificadas</option>
                </select>
              </div>

              <!-- Calificación Mínima -->
              <div class="filter-group">
                <label>
                  <i class="fas fa-star"></i>
                  CALIFICACIÓN MÍNIMA:
                </label>
                <select id="ratingMinFilter" class="filter-select">
                  <option value="">Todas</option>
                  <option value="4.5">⭐ 4.5 Estrellas</option>
                  <option value="4.0">⭐ 4.0 Estrellas</option>
                  <option value="3.5">⭐ 3.5 Estrellas</option>
                </select>
              </div>

              <!-- Origen -->
              <div class="filter-group">
                <label>
                  <i class="fas fa-map-marker-alt"></i>
                  ORIGEN:
                </label>
                <select id="originFilter" class="filter-select">
                  <option value="">Todos los Orígenes</option>
                  ${origins.map(origin => `<option value="${origin}">${origin}</option>`).join('')}
                </select>
              </div>

              <!-- Precio Mínimo -->
              <div class="filter-group">
                <label>
                  <i class="fas fa-dollar-sign"></i>
                  PRECIO MÍNIMO:
                </label>
                <input 
                  type="number" 
                  id="priceMinFilter" 
                  class="filter-input" 
                  placeholder="0.00" 
                  min="0" 
                  step="0.01"
                >
              </div>

              <!-- Precio Máximo -->
              <div class="filter-group">
                <label>
                  <i class="fas fa-dollar-sign"></i>
                  PRECIO MÁXIMO:
                </label>
                <input 
                  type="number" 
                  id="priceMaxFilter" 
                  class="filter-input" 
                  placeholder="20.00" 
                  min="0" 
                  step="0.01"
                >
              </div>

              <!-- Solo Orgánicas -->
              <div class="filter-group checkbox-group">
                <label>
                  <i class="fas fa-leaf"></i>
                  FILTROS ADICIONALES:
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" id="organicFilter">
                  <span class="checkbox-custom"></span>
                  <span class="checkbox-text">
                    <i class="fas fa-leaf"></i>
                    Solo Frutas Orgánicas
                  </span>
                </label>
              </div>

              <!-- Botón Limpiar Filtros -->
              <div class="filter-group">
                <label>
                  <i class="fas fa-redo"></i>
                  ACCIONES:
                </label>
                <button class="btn-clear-filters" id="clearFilters">
                  <i class="fas fa-redo"></i>
                  Limpiar Todos los Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="products-grid" id="productsGrid">
          ${products.map(product => `
            <div class="product-card glass fade-in-up ${userStatus.isGuest ? 'locked' : ''}" data-category="${product.category}" data-organic="${product.organic}" data-price="${product.priceKg}" data-rating="${product.rating}">
              <div class="product-badge ${product.organic ? 'organic' : ''}">
                ${product.organic ? 'Orgánica' : 'Convencional'}
              </div>

              <!-- Lock overlay for non-registered users -->
              ${userStatus.isGuest ? `
                <div class="product-lock-overlay">
                  <div class="lock-icon">
                    <i class="fas fa-lock"></i>
                  </div>
                  <div class="lock-text">
                    <span>Regístrate para comprar</span>
                  </div>
                </div>
              ` : ''}

              <div class="product-image">
                <img src="${product.img}" alt="${product.name}" loading="lazy">
              </div>
              <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                  <div class="stars">
                    ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}
                  </div>
                  <span class="rating-score">${product.rating}</span>
                </div>
                <p class="product-desc">${product.desc}</p>
                <div class="product-origin">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>${product.origin}</span>
                </div>
                <div class="product-price">
                  <span class="price-main">$${product.priceKg.toFixed(2)}</span>
                  <span class="price-unit">/kg</span>
                </div>
              </div>
              <div class="product-actions">
                <div class="quantity-selector ${userStatus.isGuest ? 'disabled' : ''}">
                  <button class="qty-btn minus" aria-label="Reducir cantidad" ${userStatus.isGuest ? 'disabled' : ''}>-</button>
                  <input type="number" min="0" step="0.5" value="1" class="qty-input" readonly ${userStatus.isGuest ? 'disabled' : ''}>
                  <button class="qty-btn plus" aria-label="Aumentar cantidad" ${userStatus.isGuest ? 'disabled' : ''}>+</button>
                </div>
                <div class="total-price" aria-live="polite">
                  Total: $${(product.priceKg*1).toFixed(2)}
                </div>
                ${userStatus.isGuest ? `
                  <button class="btn-locked register-to-buy" onclick="window.location.hash='#/registro'">
                    <i class="fas fa-user-plus"></i>
                    Regístrate para Comprar
                  </button>
                ` : `
                  <button class="btn-primary add-to-cart" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i>
                    Agregar
                  </button>
                `}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Cart Summary (floating) -->
        <div class="cart-summary glass ${userStatus.isGuest ? 'locked' : ''}" id="cartSummary">
          <div class="cart-header">
            <i class="fas fa-shopping-basket"></i>
            <span>Carrito</span>
            <span class="cart-count" id="cartCount">0</span>
          </div>
          <div class="cart-total">
            <span>Total:</span>
            <span class="cart-amount" id="cartTotal">$0.00</span>
          </div>
          ${userStatus.isGuest ? `
            <button class="btn-locked register-to-checkout" onclick="window.location.hash='#/registro'">
              <i class="fas fa-user-plus"></i>
              Regístrate para Comprar
            </button>
          ` : `
            <button class="btn-primary cart-checkout" id="cartCheckout" style="background: #4ecdc4; color: #000;">
              Proceder al Pago
            </button>
          `}
        </div>

        <!-- Periodic Registration Prompts for non-registered users -->
        ${userStatus.isGuest ? `
          <div class="registration-prompts" id="registrationPrompts"></div>
        ` : ''}
      </div>
    </section>
  `;

  // Wire interactions
  setupFilters(products);
  setupProductInteractions(products);
  setupCart();

  // Setup periodic registration prompts for non-registered users
  if (userStatus.isGuest) {
    setupRegistrationPrompts();
  }

// Filter and sort functionality
function setupFilters(products) {
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const organicFilter = document.getElementById('organicFilter');
  const priceMinFilter = document.getElementById('priceMinFilter');
  const priceMaxFilter = document.getElementById('priceMaxFilter');
  const ratingMinFilter = document.getElementById('ratingMinFilter');
  const originFilter = document.getElementById('originFilter');
  const searchFilter = document.getElementById('searchFilter');
  const searchClear = document.getElementById('searchClear');
  const grid = document.getElementById('productsGrid');

  // Search clear button
  searchFilter.addEventListener('input', () => {
    searchClear.style.display = searchFilter.value ? 'block' : 'none';
    applyFilters();
  });

  searchClear.addEventListener('click', () => {
    searchFilter.value = '';
    searchClear.style.display = 'none';
    applyFilters();
  });

  function applyFilters() {
    let filtered = [...products];

    // Search filter
    const searchTerm = searchFilter.value.toLowerCase().trim();
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.desc.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    const category = categoryFilter.value;
    if (category !== 'Todas') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Organic filter
    if (organicFilter.checked) {
      filtered = filtered.filter(p => p.organic);
    }

    // Price range filter
    const priceMin = parseFloat(priceMinFilter.value) || 0;
    const priceMax = parseFloat(priceMaxFilter.value) || Infinity;
    filtered = filtered.filter(p => p.priceKg >= priceMin && p.priceKg <= priceMax);

    // Rating min filter
    const ratingMin = parseFloat(ratingMinFilter.value) || 0;
    filtered = filtered.filter(p => p.rating >= ratingMin);

    // Origin filter
    const origin = originFilter.value;
    if (origin) {
      filtered = filtered.filter(p => p.origin === origin);
    }

    // Sort
    const sortBy = sortFilter.value;
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.priceKg - b.priceKg;
        case 'price-high': return b.priceKg - a.priceKg;
        case 'rating': return b.rating - a.rating;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

    // Re-render grid
    grid.innerHTML = filtered.map(product => `
      <div class="product-card glass fade-in-up" data-category="${product.category}" data-organic="${product.organic}" data-price="${product.priceKg}" data-rating="${product.rating}">
        <div class="product-badge ${product.organic ? 'organic' : ''}">
          ${product.organic ? 'Orgánica' : 'Convencional'}
        </div>
        <div class="product-image">
          <img src="${product.img}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <div class="product-rating">
            <div class="stars">
              ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}
            </div>
            <span class="rating-score">${product.rating}</span>
          </div>
          <p class="product-desc">${product.desc}</p>
          <div class="product-origin">
            <i class="fas fa-map-marker-alt"></i>
            <span>${product.origin}</span>
          </div>
          <div class="product-price">
            <span class="price-main">$${product.priceKg.toFixed(2)}</span>
            <span class="price-unit">/kg</span>
          </div>
        </div>
        <div class="product-actions">
          <div class="quantity-selector">
            <button class="qty-btn minus" aria-label="Reducir cantidad">-</button>
            <input type="number" min="0" step="0.5" value="1" class="qty-input" readonly>
            <button class="qty-btn plus" aria-label="Aumentar cantidad">+</button>
          </div>
          <div class="total-price" aria-live="polite">
            Total: $${(product.priceKg*1).toFixed(2)}
          </div>
          <button class="btn-primary add-to-cart" data-product-id="${product.id}">
            <i class="fas fa-shopping-cart"></i>
            Agregar
          </button>
        </div>
      </div>
    `).join('');

    // Re-wire interactions for filtered products
    setupProductInteractions(filtered);
  }

  categoryFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
  organicFilter.addEventListener('change', applyFilters);
  priceMinFilter.addEventListener('input', applyFilters);
  priceMaxFilter.addEventListener('input', applyFilters);
  ratingMinFilter.addEventListener('change', applyFilters);
  originFilter.addEventListener('change', applyFilters);
}

// Product interactions (quantity, add to cart)
function setupProductInteractions(products) {
  document.querySelectorAll('.product-card').forEach(card => {
    const productId = Number(card.querySelector('.add-to-cart').dataset.productId);
    const product = products.find(p => p.id === productId);
    const minusBtn = card.querySelector('.minus');
    const plusBtn = card.querySelector('.plus');
    const qtyInput = card.querySelector('.qty-input');
    const totalPrice = card.querySelector('.total-price');
    const addBtn = card.querySelector('.add-to-cart');

    function updateTotal() {
      const qty = Number(qtyInput.value);
      const total = qty * product.priceKg;
      totalPrice.textContent = `Total: $${total.toFixed(2)}`;
    }

    minusBtn.addEventListener('click', () => {
      const current = Number(qtyInput.value);
      if (current > 0.5) {
        qtyInput.value = current - 0.5;
        updateTotal();
      }
    });

    plusBtn.addEventListener('click', () => {
      const current = Number(qtyInput.value);
      qtyInput.value = current + 0.5;
      updateTotal();
    });

    addBtn.addEventListener('click', () => {
      const qty = Number(qtyInput.value);
      if (qty <= 0) return;

      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.priceKg,
        quantity: qty,
        image: product.img,
        category: product.category
      };

      addToCart(cartItem);
    });
  });
}

function setupCart() {
  updateCartDisplay();

  document.getElementById('cartCheckout')?.addEventListener('click', () => {
    if (cartStore.length === 0) {
      showNotification('🛒 Tu carrito está vacío', false);
      return;
    }

    // Show checkout modal with cart data
    if (window.checkoutModalStore) {
      window.checkoutModalStore.show({ items: cartStore });
    } else {
      showNotification('❌ Error: Modal de checkout no disponible', false);
    }
  });
}

function addToCart(item) {
  const existing = cartStore.find(cartItem => cartItem.id === item.id);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cartStore.push(item);
  }

  localStorage.setItem('fruvi_cart_store', JSON.stringify(cartStore));
  updateCartDisplay();
  
  // Usar MessageTemplates si está disponible
  if (window.MessageTemplates) {
    showNotification(window.MessageTemplates.addToCart(item.name), true);
  } else {
    showNotification(`🛒 ${item.name} añadido al carrito`, true);
  }
}

function updateCartDisplay() {
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');

  // Safety check for DOM elements
  if (!countEl || !totalEl) {
    console.warn('Cart display elements not found in DOM');
    return;
  }

  const totalItems = cartStore.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartStore.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  countEl.textContent = totalItems;
  totalEl.textContent = `$${totalPrice.toFixed(2)}`;
}

function updateCartItemQuantity(productId, newQuantity) {
  const itemIndex = cartStore.findIndex(item => item.id === productId);
  if (itemIndex !== -1) {
    if (newQuantity <= 0) {
      cartStore.splice(itemIndex, 1);
      showNotification('🗑️ Producto eliminado del carrito', true);
    } else {
      cartStore[itemIndex].quantity = newQuantity;
      showNotification('✅ Cantidad actualizada', true);
    }
    localStorage.setItem('fruvi_cart_store', JSON.stringify(cartStore));
    updateCartDisplay();
  }
}

function removeCartItem(productId) {
  const itemIndex = cartStore.findIndex(item => item.id === productId);
  if (itemIndex !== -1) {
    const itemName = cartStore[itemIndex].name;
    cartStore.splice(itemIndex, 1);
    localStorage.setItem('fruvi_cart_store', JSON.stringify(cartStore));
    updateCartDisplay();
    showNotification(`${itemName} eliminado del carrito`, true);
  }
}

function showNotification(message, success = true) {
  const notification = document.createElement('div');
  notification.className = `store-notification ${success ? 'success' : 'error'} glass`;
  notification.innerHTML = `
    <i class="fas ${success ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    <span>${message}</span>
  `;

  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '10000',
    padding: '12px 16px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  });

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Setup periodic registration prompts for non-registered users
function setupRegistrationPrompts() {
  const promptsContainer = document.getElementById('registrationPrompts');
  if (!promptsContainer) return;

  const prompts = [
    {
      title: "¡No te quedes sin probar estas frutas!",
      message: "Regístrate ahora y recibe un 10% de descuento en tu primera compra",
      icon: "fas fa-gift",
      color: "#ff6b6b"
    },
    {
      title: "Frutas frescas esperando por ti",
      message: "Crea tu cuenta y accede a nuestro catálogo completo",
      icon: "fas fa-shopping-cart",
      color: "#4ecdc4"
    },
    {
      title: "Entrega a domicilio gratis",
      message: "Regístrate hoy y recibe entrega gratuita en tu primer pedido",
      icon: "fas fa-truck",
      color: "#45b7d1"
    },
    {
      title: "Ofertas exclusivas para miembros",
      message: "Sé el primero en conocer nuestras ofertas especiales",
      icon: "fas fa-star",
      color: "#f9ca24"
    }
  ];

  let currentPrompt = 0;

  function showNextPrompt() {
    if (currentPrompt >= prompts.length) {
      currentPrompt = 0;
    }

    const prompt = prompts[currentPrompt];
    promptsContainer.innerHTML = `
      <div class="registration-prompt glass fade-in-up">
        <div class="prompt-icon" style="color: ${prompt.color}">
          <i class="${prompt.icon}"></i>
        </div>
        <div class="prompt-content">
          <h4>${prompt.title}</h4>
          <p>${prompt.message}</p>
        </div>
        <div class="prompt-actions">
          <button class="btn-primary register-prompt-btn" onclick="window.location.hash='#/registro'">
            <i class="fas fa-user-plus"></i>
            Registrarme
          </button>
          <button class="btn-outline dismiss-prompt" onclick="this.parentElement.parentElement.remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;

    currentPrompt++;
  }

  // Show first prompt immediately
  showNextPrompt();

  // Show new prompt every 15 seconds
  setInterval(showNextPrompt, 15000);
}

// Colombian Fruits Database
function getColombianFruits(imagePrefix = '') {
  return [
    // BAYAS (Alfabético)
    {
      id: 1,
      category: 'Bayas',
      img: `${imagePrefix}/images/products/agraz.jpg`,
      name: 'Agraz',
      desc: 'Pequeña baya azulada andina, rica en antioxidantes.',
      priceKg: 18.000,
      organic: true,
      rating: 4.6,
      origin: 'Boyacá',
      season: 'Junio-Agosto'
    },
    {
      id: 2,
      category: 'Bayas',
      img: `${imagePrefix}/images/products/arandano.jpg`,
      name: 'Arándano',
      desc: 'Arándano azul cultivado en altura, superfood.',
      priceKg: 25.000,
      organic: true,
      rating: 4.9,
      origin: 'Antioquia',
      season: 'Octubre-Diciembre'
    },
    {
      id: 3,
      category: 'Bayas',
      img: `${imagePrefix}/images/products/frambuesa.jpg`,
      name: 'Frambuesa',
      desc: 'Frambuesa roja delicada de clima frío.',
      priceKg: 32.000,
      organic: true,
      rating: 4.8,
      origin: 'Cundinamarca',
      season: 'Noviembre-Febrero'
    },
    {
      id: 4,
      category: 'Bayas',
      img: `${imagePrefix}/images/products/fresa.jpg`,
      name: 'Fresa',
      desc: 'Fresas rojas dulces de clima frío.',
      priceKg: 12.500,
      organic: true,
      rating: 4.9,
      origin: 'Cundinamarca',
      season: 'Diciembre-Abril'
    },
    {
      id: 5,
      category: 'Bayas',
      img: `${imagePrefix}/images/products/mora.jpg`,
      name: 'Mora de Castilla',
      desc: 'Mora andina dulce-ácida, rica en antioxidantes.',
      priceKg: 8.000,
      organic: true,
      rating: 4.7,
      origin: 'Cundinamarca',
      season: 'Junio-Septiembre'
    },
    {
      id: 6,
      category: 'Bayas',
      img: `${imagePrefix}/images/products/uchuva.jpg`,
      name: 'Uchuva',
      desc: 'Fruta dorada andina dulce y nutritiva.',
      priceKg: 15.000,
      organic: true,
      rating: 4.8,
      origin: 'Boyacá',
      season: 'Todo el año'
    },

    // BANANOS (Alfabético)
    {
      id: 7,
      category: 'Bananos',
      img: `${imagePrefix}/images/products/banano_bocadillo.jpg`,
      name: 'Banano Bocadillo',
      desc: 'Banano pequeño y muy dulce, ideal para postres.',
      priceKg: 3.500,
      organic: true,
      rating: 4.9,
      origin: 'Quindío',
      season: 'Todo el año'
    },
    {
      id: 8,
      category: 'Bananos',
      img: `${imagePrefix}/images/products/banano_criollo.jpg`,
      name: 'Banano Criollo',
      desc: 'Banano tradicional colombiano, resistente.',
      priceKg: 2.800,
      organic: false,
      rating: 4.5,
      origin: 'Córdoba',
      season: 'Todo el año'
    },
    {
      id: 9,
      category: 'Bananos',
      img: `${imagePrefix}/images/products/banano_guineo.jpg`,
      name: 'Banano Guineo',
      desc: 'Banano corto y grueso, muy nutritivo.',
      priceKg: 3.200,
      organic: false,
      rating: 4.6,
      origin: 'Chocó',
      season: 'Todo el año'
    },
    {
      id: 10,
      category: 'Bananos',
      img: `${imagePrefix}/images/products/banano_uraba.jpg`,
      name: 'Banano Urabá',
      desc: 'Banano premium de la región de Urabá, dulce y cremoso.',
      priceKg: 2.200,
      organic: false,
      rating: 4.8,
      origin: 'Antioquia',
      season: 'Todo el año'
    },
    {
      id: 11,
      category: 'Bananos',
      img: `${imagePrefix}/images/products/platano_dominico.jpg`,
      name: 'Plátano Dominico',
      desc: 'Plátano dulce maduro, excelente para freír.',
      priceKg: 2.000,
      organic: false,
      rating: 4.6,
      origin: 'Magdalena',
      season: 'Todo el año'
    },
    {
      id: 12,
      category: 'Bananos',
      img: `${imagePrefix}/images/products/platano_hartón.jpg`,
      name: 'Plátano Hartón',
      desc: 'Plátano verde tradicional, perfecto para cocinar.',
      priceKg: 1.800,
      organic: false,
      rating: 4.7,
      origin: 'Valle del Cauca',
      season: 'Todo el año'
    },
    {
      id: 13,
      category: 'Bananos',
      img: `${imagePrefix}/images/products/platano_popocho.jpg`,
      name: 'Plátano Popocho',
      desc: 'Plátano gigante para cocción, típico de la costa.',
      priceKg: 1.500,
      organic: false,
      rating: 4.4,
      origin: 'Atlántico',
      season: 'Todo el año'
    },

    // CÍTRICAS (Alfabético)
    {
      id: 14,
      category: 'Cítricas',
      img: `${imagePrefix}/images/products/bergamota.jpg`,
      name: 'Bergamota',
      desc: 'Cítrico aromático usado para aceites esenciales.',
      priceKg: 12.000,
      organic: true,
      rating: 4.3,
      origin: 'Risaralda',
      season: 'Enero-Marzo'
    },
    {
      id: 15,
      category: 'Cítricas',
      img: `${imagePrefix}/images/products/cidra.jpg`,
      name: 'Cidra',
      desc: 'Cítrico grande aromático, usado en conservas.',
      priceKg: 5.500,
      organic: false,
      rating: 4.2,
      origin: 'Santander',
      season: 'Mayo-Julio'
    },
    {
      id: 16,
      category: 'Cítricas',
      img: `${imagePrefix}/images/products/lima_acida.jpg`,
      name: 'Lima Ácida',
      desc: 'Lima pequeña muy ácida, ideal para aderezos.',
      priceKg: 4.800,
      organic: false,
      rating: 4.4,
      origin: 'Bolívar',
      season: 'Todo el año'
    },
    {
      id: 17,
      category: 'Cítricas',
      img: `${imagePrefix}/images/products/limon_comun.jpg`,
      name: 'Limón Común',
      desc: 'Limón amarillo tradicional, muy ácido.',
      priceKg: 3.800,
      organic: false,
      rating: 4.5,
      origin: 'Tolima',
      season: 'Todo el año'
    },
    {
      id: 18,
      category: 'Cítricas',
      img: `${imagePrefix}/images/products/limon_mandarino.jpg`,
      name: 'Limón Mandarino',
      desc: 'Híbrido cítrico, mezcla de limón y mandarina.',
      priceKg: 5.200,
      organic: true,
      rating: 4.6,
      origin: 'Quindío',
      season: 'Febrero-Abril'
    },
    {
      id: 19,
      category: 'Cítricas',
      img: `${imagePrefix}/images/products/limon_tahiti.jpg`,
      name: 'Limón Tahití',
      desc: 'Limón verde aromático, perfecto para bebidas.',
      priceKg: 4.500,
      organic: true,
      rating: 4.9,
      origin: 'Caldas',
      season: 'Todo el año'
    },
    {
      id: 20,
      category: 'Cítricas',
      img: `${imagePrefix}/images/products/mandarina_oneco.jpg`,
      name: 'Mandarina Oneco',
      desc: 'Mandarina tradicional colombiana, fácil de pelar.',
      priceKg: 3.200,
      organic: false,
      rating: 4.8,
      origin: 'Valle del Cauca',
      season: 'Abril-Junio'
    },
    {
      id: 21,
      category: 'Cítricas',
      img: `${imagePrefix}/images/products/mandarina_arrayana.jpg`,
      name: 'Mandarina Arrayana',
      desc: 'Mandarina dulce de temporada, muy jugosa.',
      priceKg: 3.800,
      organic: false,
      rating: 4.7,
      origin: 'Caldas',
      season: 'Mayo-Julio'
    },
    {
      id: 22,
      category: 'Cítricas',
      img: `${imagePrefix}/images/products/naranja_ombligo.jpg`,
      name: 'Naranja Ombligo',
      desc: 'Naranja sin semillas, dulce y fácil de pelar.',
      priceKg: 2.800,
      organic: false,
      rating: 4.6,
      origin: 'Santander',
      season: 'Enero-Abril'
    },
    {
      id: 23,
      category: 'Cítricas',
      img: `${imagePrefix}/images/products/naranja_valencia.jpg`,
      name: 'Naranja Valencia',
      desc: 'Naranja jugosa del Valle, rica en vitamina C.',
      priceKg: 2.500,
      organic: false,
      rating: 4.7,
      origin: 'Valle del Cauca',
      season: 'Marzo-Agosto'
    },
    {
      id: 24,
      category: 'Cítricas',
      img: `${imagePrefix}/images/products/toronja.jpg`,
      name: 'Toronja Rosada',
      desc: 'Toronja jugosa con pulpa rosada, refrescante.',
      priceKg: 3.000,
      organic: false,
      rating: 4.4,
      origin: 'Valle del Cauca',
      season: 'Febrero-Mayo'
    },

    // EXÓTICAS (Alfabético)
    {
      id: 25,
      category: 'Exóticas',
      img: `${imagePrefix}/images/products/araza.jpg`,
      name: 'Arazá',
      desc: 'Fruta amazónica ácida, muy aromática.',
      priceKg: 22.000,
      organic: true,
      rating: 4.5,
      origin: 'Amazonas',
      season: 'Septiembre-Noviembre'
    },
    {
      id: 26,
      category: 'Exóticas',
      img: `${imagePrefix}/images/products/borojó.jpg`,
      name: 'Borojó',
      desc: 'Superfruit del Pacífico, energizante natural.',
      priceKg: 8.500,
      organic: true,
      rating: 4.4,
      origin: 'Chocó',
      season: 'Abril-Agosto'
    },
    {
      id: 27,
      category: 'Exóticas',
      img: `${imagePrefix}/images/products/caimito.jpg`,
      name: 'Caimito',
      desc: 'Fruta morada cremosa con sabor dulce único.',
      priceKg: 14.500,
      organic: false,
      rating: 4.6,
      origin: 'Córdoba',
      season: 'Marzo-Mayo'
    },
    {
      id: 28,
      category: 'Exóticas',
      img: `${imagePrefix}/images/products/chirimoya.jpg`,
      name: 'Chirimoya',
      desc: 'Fruta cremosa y dulce de clima frío.',
      priceKg: 12.000,
      organic: false,
      rating: 4.8,
      origin: 'Nariño',
      season: 'Abril-Junio'
    },
    {
      id: 29,
      category: 'Exóticas',
      img: `${imagePrefix}/images/products/copoazu.jpg`,
      name: 'Copoazú',
      desc: 'Prima del cacao, pulpa cremosa y aromática.',
      priceKg: 16.000,
      organic: true,
      rating: 4.7,
      origin: 'Vaupés',
      season: 'Junio-Agosto'
    },
    {
      id: 30,
      category: 'Exóticas',
      img: `${imagePrefix}/images/products/feijoa.jpg`,
      name: 'Feijoa',
      desc: 'Fruta aromática andina, sabor único.',
      priceKg: 9.500,
      organic: false,
      rating: 4.7,
      origin: 'Cundinamarca',
      season: 'Marzo-Mayo'
    },
    {
      id: 31,
      category: 'Exóticas',
      img: `${imagePrefix}/images/products/gulupa.jpg`,
      name: 'Gulupa',
      desc: 'Fruta de la pasión morada, dulce y aromática.',
      priceKg: 8.200,
      organic: true,
      rating: 4.8,
      origin: 'Huila',
      season: 'Todo el año'
    },
    {
      id: 32,
      category: 'Exóticas',
      img: `${imagePrefix}/images/products/mangostino.jpg`,
      name: 'Mangostino',
      desc: 'Reina de las frutas, pulpa blanca exquisita.',
      priceKg: 45.000,
      organic: true,
      rating: 4.9,
      origin: 'Chocó',
      season: 'Octubre-Diciembre'
    },
    {
      id: 33,
      category: 'Exóticas',
      img: `${imagePrefix}/images/products/nispero.jpg`,
      name: 'Níspero',
      desc: 'Fruta dulce de árbol perenne, muy nutritiva.',
      priceKg: 7.800,
      organic: false,
      rating: 4.4,
      origin: 'Valle del Cauca',
      season: 'Enero-Marzo'
    },
    {
      id: 34,
      category: 'Exóticas',
      img: `${imagePrefix}/images/products/pitahaya.jpg`,
      name: 'Pitahaya',
      desc: 'Fruta del dragón, refrescante y exótica.',
      priceKg: 18.500,
      organic: true,
      rating: 4.6,
      origin: 'Magdalena',
      season: 'Julio-Octubre'
    },
    {
      id: 35,
      category: 'Exóticas',
      img: `${imagePrefix}/images/products/rambutan.jpg`,
      name: 'Rambután',
      desc: 'Fruta peluda asiática cultivada en Colombia.',
      priceKg: 28.000,
      organic: true,
      rating: 4.5,
      origin: 'Putumayo',
      season: 'Agosto-Octubre'
    },
    {
      id: 36,
      category: 'Exóticas',
      img: `${imagePrefix}/images/products/zapote.jpg`,
      name: 'Zapote',
      desc: 'Fruta tropical cremosa, sabor a chocolate.',
      priceKg: 11.500,
      organic: false,
      rating: 4.6,
      origin: 'Magdalena',
      season: 'Mayo-Julio'
    },

    // FRUTAS DULCES (Alfabético) 
    {
      id: 37,
      category: 'Frutas Dulces',
      img: `${imagePrefix}/images/products/breva.jpg`,
      name: 'Breva',
      desc: 'Higo grande y dulce de clima frío.',
      priceKg: 11.000,
      organic: false,
      rating: 4.7,
      origin: 'Cundinamarca',
      season: 'Noviembre-Enero'
    },
    {
      id: 38,
      category: 'Frutas Dulces',
      img: `${imagePrefix}/images/products/ciruela.jpg`,
      name: 'Ciruela',
      desc: 'Ciruela tropical dulce y jugosa.',
      priceKg: 6.500,
      organic: false,
      rating: 4.5,
      origin: 'Tolima',
      season: 'Febrero-Abril'
    },
    {
      id: 39,
      category: 'Frutas Dulces',
      img: `${imagePrefix}/images/products/curuba.jpg`,
      name: 'Curuba',
      desc: 'Fruta andina ácida, ideal para jugos.',
      priceKg: 5.500,
      organic: true,
      rating: 4.6,
      origin: 'Nariño',
      season: 'Marzo-Agosto'
    },
    {
      id: 40,
      category: 'Frutas Dulces',
      img: `${imagePrefix}/images/products/durazno.jpg`,
      name: 'Durazno',
      desc: 'Durazno de clima frío, dulce y aromático.',
      priceKg: 9.500,
      organic: false,
      rating: 4.7,
      origin: 'Boyacá',
      season: 'Diciembre-Febrero'
    },
    {
      id: 41,
      category: 'Frutas Dulces',
      img: `${imagePrefix}/images/products/granadilla.jpg`,
      name: 'Granadilla',
      desc: 'Fruta dulce de pulpa gelatinosa y aromática.',
      priceKg: 7.200,
      organic: false,
      rating: 4.9,
      origin: 'Cundinamarca',
      season: 'Todo el año'
    },
    {
      id: 42,
      category: 'Frutas Dulces',
      img: `${imagePrefix}/images/products/lulo.jpg`,
      name: 'Lulo',
      desc: 'Fruta ácida tradicional, perfecta para jugos.',
      priceKg: 6.800,
      organic: false,
      rating: 4.8,
      origin: 'Nariño',
      season: 'Todo el año'
    },
    {
      id: 43,
      category: 'Frutas Dulces',
      img: `${imagePrefix}/images/products/manzana_anna.jpg`,
      name: 'Manzana Anna',
      desc: 'Manzana tropical cultivada en Colombia.',
      priceKg: 7.500,
      organic: false,
      rating: 4.3,
      origin: 'Boyacá',
      season: 'Diciembre-Febrero'
    },
    {
      id: 44,
      category: 'Frutas Dulces',
      img: `${imagePrefix}/images/products/pera.jpg`,
      name: 'Pera',
      desc: 'Pera jugosa de clima templado.',
      priceKg: 8.200,
      organic: false,
      rating: 4.4,
      origin: 'Cundinamarca',
      season: 'Noviembre-Enero'
    },
    {
      id: 45,
      category: 'Frutas Dulces',
      img: `${imagePrefix}/images/products/tomate_arbol.jpg`,
      name: 'Tomate de Árbol',
      desc: 'Fruta ácida perfecta para jugos y salsas.',
      priceKg: 4.500,
      organic: true,
      rating: 4.6,
      origin: 'Cundinamarca',
      season: 'Todo el año'
    },

    // TROPICALES (Alfabético)
    {
      id: 46,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/aguacate_fortuna.jpg`,
      name: 'Aguacate Fortuna',
      desc: 'Aguacate grande tradicional colombiano.',
      priceKg: 4.200,
      organic: false,
      rating: 4.6,
      origin: 'Tolima',
      season: 'Febrero-Mayo'
    },
    {
      id: 47,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/aguacate_hass.jpg`,
      name: 'Aguacate Hass',
      desc: 'Aguacate cremoso de exportación.',
      priceKg: 6.800,
      organic: true,
      rating: 4.9,
      origin: 'Caldas',
      season: 'Todo el año'
    },
    {
      id: 48,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/anon.jpg`,
      name: 'Anón',
      desc: 'Fruta cremosa dulce, prima de la chirimoya.',
      priceKg: 9.800,
      organic: false,
      rating: 4.5,
      origin: 'Atlántico',
      season: 'Abril-Junio'
    },
    {
      id: 49,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/badea.jpg`,
      name: 'Badea',
      desc: 'Fruta de la pasión gigante, refrescante.',
      priceKg: 3.800,
      organic: false,
      rating: 4.3,
      origin: 'Valle del Cauca',
      season: 'Marzo-Junio'
    },
    {
      id: 50,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/banano_morado.jpg`,
      name: 'Banano Morado',
      desc: 'Banano exótico de piel morada, muy dulce.',
      priceKg: 5.500,
      organic: true,
      rating: 4.8,
      origin: 'Quindío',
      season: 'Todo el año'
    },
    {
      id: 51,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/carambolo.jpg`,
      name: 'Carambolo',
      desc: 'Fruta estrella, decorativa y refrescante.',
      priceKg: 8.500,
      organic: false,
      rating: 4.2,
      origin: 'Meta',
      season: 'Agosto-Octubre'
    },
    {
      id: 52,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/coco.jpg`,
      name: 'Coco',
      desc: 'Coco fresco de la costa, agua natural.',
      priceKg: 2.500,
      organic: false,
      rating: 4.5,
      origin: 'Atlántico',
      season: 'Todo el año'
    },
    {
      id: 53,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/guama.jpg`,
      name: 'Guama',
      desc: 'Vaina dulce tropical, pulpa algodonosa.',
      priceKg: 4.200,
      organic: false,
      rating: 4.4,
      origin: 'Casanare',
      season: 'Enero-Marzo'
    },
    {
      id: 54,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/guanabana.jpg`,
      name: 'Guanábana',
      desc: 'Fruta grande cremosa, ideal para jugos.',
      priceKg: 6.500,
      organic: true,
      rating: 4.7,
      origin: 'Tolima',
      season: 'Todo el año'
    },
    {
      id: 55,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/guayaba_pera.jpg`,
      name: 'Guayaba Pera',
      desc: 'Guayaba aromática, perfecta para jugos.',
      priceKg: 4.000,
      organic: false,
      rating: 4.7,
      origin: 'Boyacá',
      season: 'Octubre-Febrero'
    },
    {
      id: 56,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/guayaba_agria.jpg`,
      name: 'Guayaba Agria',
      desc: 'Guayaba ácida pequeña, rica en vitamina C.',
      priceKg: 3.500,
      organic: false,
      rating: 4.3,
      origin: 'Santander',
      season: 'Septiembre-Noviembre'
    },
    {
      id: 57,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/mango_azucar.jpg`,
      name: 'Mango Azúcar',
      desc: 'Mango pequeño muy dulce, variedad criolla.',
      priceKg: 3.200,
      organic: false,
      rating: 4.8,
      origin: 'Sucre',
      season: 'Abril-Junio'
    },
    {
      id: 58,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/mango_keitt.jpg`,
      name: 'Mango Keitt',
      desc: 'Mango grande y jugoso, de larga duración.',
      priceKg: 3.800,
      organic: false,
      rating: 4.7,
      origin: 'Cundinamarca',
      season: 'Agosto-Octubre'
    },
    {
      id: 59,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/mango_tommy.jpg`,
      name: 'Mango Tommy',
      desc: 'Mango dulce y jugoso, variedad premium.',
      priceKg: 4.200,
      organic: false,
      rating: 4.9,
      origin: 'Magdalena',
      season: 'Marzo-Junio'
    },
    {
      id: 60,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/maracuya.jpg`,
      name: 'Maracuyá',
      desc: 'Fruta de la pasión, intensa y aromática.',
      priceKg: 6.500,
      organic: true,
      rating: 4.9,
      origin: 'Huila',
      season: 'Todo el año'
    },
    {
      id: 61,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/papaya_maradol.jpg`,
      name: 'Papaya Maradol',
      desc: 'Papaya grande y dulce, rica en enzimas.',
      priceKg: 2.800,
      organic: false,
      rating: 4.6,
      origin: 'Santander',
      season: 'Todo el año'
    },
    {
      id: 62,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/papaya_hawaiana.jpg`,
      name: 'Papaya Hawaiana',
      desc: 'Papaya pequeña muy dulce, pulpa anaranjada.',
      priceKg: 3.500,
      organic: true,
      rating: 4.8,
      origin: 'Valle del Cauca',
      season: 'Todo el año'
    },
    {
      id: 63,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/pina_md2.jpg`,
      name: 'Piña MD2',
      desc: 'Piña extra dulce, variedad premium.',
      priceKg: 3.500,
      organic: true,
      rating: 4.8,
      origin: 'Meta',
      season: 'Todo el año'
    },
    {
      id: 64,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/pina_perolera.jpg`,
      name: 'Piña Perolera',
      desc: 'Piña tradicional colombiana, muy aromática.',
      priceKg: 2.800,
      organic: false,
      rating: 4.5,
      origin: 'Santander',
      season: 'Todo el año'
    },

    // UVAS (Alfabético)
    {
      id: 65,
      category: 'Uvas',
      img: `${imagePrefix}/images/products/uva_roja.jpg`,
      name: 'Uva Roja Isabella',
      desc: 'Uva roja dulce y jugosa, cultivada en clima frío.',
      priceKg: 8.500,
      organic: false,
      rating: 4.8,
      origin: 'Boyacá',
      season: 'Noviembre-Febrero'
    },
    {
      id: 66,
      category: 'Uvas',
      img: `${imagePrefix}/images/products/uva_verde.jpg`,
      name: 'Uva Verde Thompson',
      desc: 'Uva verde sin semillas, crujiente y dulce.',
      priceKg: 9.200,
      organic: true,
      rating: 4.7,
      origin: 'Boyacá',
      season: 'Diciembre-Marzo'
    },
    {
      id: 67,
      category: 'Uvas',
      img: `${imagePrefix}/images/products/uva_negra.jpg`,
      name: 'Uva Negra',
      desc: 'Uva oscura dulce, rica en antioxidantes.',
      priceKg: 9.800,
      organic: true,
      rating: 4.6,
      origin: 'Cundinamarca',
      season: 'Enero-Marzo'
    }
  ];
}

// Make cart functions globally available
window.updateCartStoreItemQuantity = updateCartItemQuantity;
window.removeCartStoreItem = removeCartItem;
}
