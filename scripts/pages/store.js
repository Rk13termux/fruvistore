// Store Page - Professional Fruit Store

export async function renderStorePage(root) {

  // Detectar si estamos en GitHub Pages o en local
  const isGitHubPages = window.location.hostname.includes('github.io');
  const imagePrefix = isGitHubPages ? '/fruvistore' : '';

  // Obtener estado del usuario desde el objeto global window
  const userStatus = await window.getUserStatus();

  const categories = ['Todas', 'Cítricas', 'Tropicales', 'Bayas', 'Manzanas', 'Uvas'];

  // Get products from Supabase instead of hardcoded data
  let products = [];
  try {
    console.log('📦 Loading products from database...');
    products = await window.getStoreProducts();
    console.log(`✅ Loaded ${products.length} products from database`);
  } catch (error) {
    console.error('❌ Error loading products from database:', error);
    // Fallback to basic products if database fails
    products = [
      {
        id: 1,
        category: 'Cítricas',
        img: `${imagePrefix}/images/products/naranja_valecia.png`,
        name: 'Naranja Valencia',
        desc: 'Jugosa, dulce y rica en vitamina C.',
        priceKg: 2.50,
        organic: true,
        rating: 4.8,
        origin: 'España'
      }
    ];
  }

  const origins = [...new Set(products.map(p => p.origin))].sort();

  const bestSellers = products.slice(0, 10);

  root.innerHTML = `
    <section class="store">
      <!-- Hero Section -->
      <div class="store-hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">
              <i class="fas fa-shopping-basket"></i>
              Tienda de Frutas Premium
            </h1>
            <p class="hero-subtitle">
              Descubre nuestra selección exclusiva de frutas frescas y orgánicas, cultivadas con pasión y entregadas con cuidado
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">${products.length}</span>
                <span class="stat-label">Productos</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${categories.length - 1}</span>
                <span class="stat-label">Categorías</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">100%</span>
                <span class="stat-label">Fresco</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Best Sellers Gallery -->
        <div class="best-sellers-gallery">
          <h2 class="gallery-title">Frutas Más Vendidas</h2>
          <div class="gallery-scroll infinite-scroll">
            <div class="gallery-track">
              ${bestSellers.map(product => `
                <div class="gallery-item">
                  <img src="${product.img}" alt="${product.name}" loading="lazy">
                  <div class="gallery-item-info">
                    <h4>${product.name}</h4>
                    <span class="gallery-price">$${product.priceKg.toFixed(2)}/kg</span>
                  </div>
                </div>
              `).join('')}
              <!-- Duplicate for infinite scroll -->
              ${bestSellers.map(product => `
                <div class="gallery-item">
                  <img src="${product.img}" alt="${product.name}" loading="lazy">
                  <div class="gallery-item-info">
                    <h4>${product.name}</h4>
                    <span class="gallery-price">$${product.priceKg.toFixed(2)}/kg</span>
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
          <p class="store-subtitle">Selección fresca y de la más alta calidad, entregada directamente a tu puerta</p>

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

        <!-- Filters -->
        <div class="store-filters glass">
          <div class="filter-group">
            <label>Categoría:</label>
            <select id="categoryFilter">
              ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <label>Ordenar por:</label>
            <select id="sortFilter">
              <option value="name" selected>Nombre</option>
              <option value="price-low">Precio (Menor a Mayor)</option>
              <option value="price-high">Precio (Mayor a Menor)</option>
              <option value="rating">Calificación</option>
            </select>
          </div>
          <div class="filter-group">
            <label>
              <input type="checkbox" id="organicFilter"> Solo Orgánicas
            </label>
          </div>
          <div class="filter-group">
            <label>Precio mínimo:</label>
            <input type="number" id="priceMinFilter" placeholder="0.00" step="0.01" min="0">
          </div>
          <div class="filter-group">
            <label>Precio máximo:</label>
            <input type="number" id="priceMaxFilter" placeholder="20.00" step="0.01" min="0">
          </div>
          <div class="filter-group">
            <label>Calificación mínima:</label>
            <select id="ratingMinFilter">
              <option value="">Todas</option>
              <option value="4.5">4.5+</option>
              <option value="4.0">4.0+</option>
              <option value="3.5">3.5+</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Origen:</label>
            <select id="originFilter">
              <option value="">Todos</option>
              ${origins.map(origin => `<option value="${origin}">${origin}</option>`).join('')}
            </select>
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
            <button class="btn-primary cart-checkout" id="cartCheckout">
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
  const grid = document.getElementById('productsGrid');

  function applyFilters() {
    let filtered = [...products];

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

// Cart functionality
let cartStore = JSON.parse(localStorage.getItem('fruvi_cart_store') || '[]');

// Make cartStore globally available
window.cartStore = cartStore;

function setupCart() {
  updateCartDisplay();

  document.getElementById('cartCheckout')?.addEventListener('click', () => {
    if (cartStore.length === 0) {
      showNotification('Tu carrito está vacío', false);
      return;
    }

    // Show checkout modal with cart data
    if (window.checkoutModalStore) {
      window.checkoutModalStore.show({ items: cartStore });
    } else {
      showNotification('Error: Modal de checkout no disponible', false);
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
  showNotification(`${item.name} añadido al carrito`, true);
}

function updateCartDisplay() {
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');

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
      showNotification('Producto eliminado del carrito', true);
    } else {
      cartStore[itemIndex].quantity = newQuantity;
      showNotification('Cantidad actualizada', true);
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

// Make cart functions globally available
window.updateCartStoreItemQuantity = updateCartItemQuantity;
window.removeCartStoreItem = removeCartItem;
}
