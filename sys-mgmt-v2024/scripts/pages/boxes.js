// Boxes Page - Fruit Boxes Store

export async function renderBoxesPage(root) {

  // Detectar si estamos en GitHub Pages o en local
  const isGitHubPages = window.location.hostname.includes('github.io');
  const imagePrefix = isGitHubPages ? '/fruvistore' : '';

  // Obtener estado del usuario desde el objeto global window
  const userStatus = await window.getUserStatus();

  const categories = ['Todas', 'Frutas Mixtas', 'Cítricas', 'Tropicales', 'Bayas'];

  const boxes = [
    // Frutas Mixtas
    {
      id: 101,
      category: 'Frutas Mixtas',
      img: `${imagePrefix}/images/products/mango-ataulfo.png`,
      name: 'Caja Mixta 5kg',
      desc: 'Selección variada de frutas frescas: manzanas, naranjas, plátanos y peras.',
      weight: 5,
      priceKg: 8.50,
      totalPrice: 42.50,
      organic: true,
      rating: 4.9,
      contents: ['Manzanas', 'Naranjas', 'Plátanos', 'Peras']
    },
    {
      id: 102,
      category: 'Frutas Mixtas',
      img: `${imagePrefix}/images/products/fresa-premium.jpg`,
      name: 'Caja Mixta 10kg',
      desc: 'Gran variedad de frutas premium: fresas, kiwis, uvas y mangos.',
      weight: 10,
      priceKg: 7.80,
      totalPrice: 78.00,
      organic: true,
      rating: 4.8,
      contents: ['Fresas', 'Kiwis', 'Uvas', 'Mangos']
    },
    {
      id: 103,
      category: 'Frutas Mixtas',
      img: `${imagePrefix}/images/products/pina-golden.jpg`,
      name: 'Caja Familiar 15kg',
      desc: 'Caja perfecta para familias: piñas, sandías, melones y frutas cítricas.',
      weight: 15,
      priceKg: 6.90,
      totalPrice: 103.50,
      organic: false,
      rating: 4.7,
      contents: ['Piñas', 'Sandías', 'Melones', 'Cítricos']
    },

    // Cítricas
    {
      id: 104,
      category: 'Cítricas',
      img: `${imagePrefix}/images/products/naranja_valecia.png`,
      name: 'Caja Cítricos 8kg',
      desc: 'Especialidad en cítricos: naranjas, limones, mandarinas y pomelos.',
      weight: 8,
      priceKg: 4.50,
      totalPrice: 36.00,
      organic: true,
      rating: 4.8,
      contents: ['Naranjas', 'Limones', 'Mandarinas', 'Pomelos']
    },
    {
      id: 105,
      category: 'Cítricas',
      img: `${imagePrefix}/images/products/limon-eureka.png`,
      name: 'Caja Cítricos 12kg',
      desc: 'Caja completa de cítricos frescos y jugosos.',
      weight: 12,
      priceKg: 4.20,
      totalPrice: 50.40,
      organic: false,
      rating: 4.6,
      contents: ['Naranjas Valencia', 'Limones', 'Mandarinas', 'Toronjas']
    },
    {
      id: 106,
      category: 'Cítricas',
      img: `${imagePrefix}/images/products/mandarina-clementina.png`,
      name: 'Caja Premium Cítricos 6kg',
      desc: 'Selección premium de cítricos orgánicos de alta calidad.',
      weight: 6,
      priceKg: 5.80,
      totalPrice: 34.80,
      organic: true,
      rating: 4.9,
      contents: ['Naranjas Premium', 'Limones Orgánicos', 'Mandarinas']
    },

    // Tropicales
    {
      id: 107,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/mango-ataulfo.png`,
      name: 'Caja Tropical 7kg',
      desc: 'Sabores del trópico: mangos, piñas, papayas y guayabas.',
      weight: 7,
      priceKg: 9.20,
      totalPrice: 64.40,
      organic: true,
      rating: 4.9,
      contents: ['Mangos', 'Piñas', 'Papayas', 'Guayabas']
    },
    {
      id: 108,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/kiwi-zespri.jpg`,
      name: 'Caja Tropical 11kg',
      desc: 'Experiencia tropical completa con frutas exóticas.',
      weight: 11,
      priceKg: 8.50,
      totalPrice: 93.50,
      organic: false,
      rating: 4.7,
      contents: ['Mangos', 'Piñas', 'Kiwis', 'Papayas', 'Guayabas']
    },
    {
      id: 109,
      category: 'Tropicales',
      img: `${imagePrefix}/images/products/pina-golden.jpg`,
      name: 'Caja Tropical Premium 9kg',
      desc: 'Frutas tropicales premium seleccionadas a mano.',
      weight: 9,
      priceKg: 10.50,
      totalPrice: 94.50,
      organic: true,
      rating: 4.8,
      contents: ['Mangos Premium', 'Piñas Doradas', 'Papayas', 'Kiwis']
    }
  ];

  root.innerHTML = `
    <section class="store">
      <!-- Hero Section -->
      <div class="store-hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">
              <i class="fas fa-box-open"></i>
              Cajas de Frutas Premium
            </h1>
            <p class="hero-subtitle">
              Descubre nuestras cajas de frutas frescas y orgánicas, perfectas para familias y empresas
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">${boxes.length}</span>
                <span class="stat-label">Cajas</span>
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
      </div>

      <div class="container">
        <!-- Header -->
        <div class="store-header">
          <h2>Cajas de Frutas</h2>
          <p class="store-subtitle">Cajas por kilos con frutas frescas y de la más alta calidad, entregadas directamente a tu puerta</p>

          <!-- Registration Banner for non-registered users -->
          ${userStatus.isGuest ? `
            <div class="registration-banner glass">
              <div class="banner-content">
                <div class="banner-icon">
                  <i class="fas fa-user-plus"></i>
                </div>
                <div class="banner-text">
                  <h3>¡Regístrate y accede a beneficios exclusivos!</h3>
                  <p>Compra cajas de frutas frescas, recibe entregas a domicilio y obtén ofertas especiales</p>
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
              <option value="name">Nombre</option>
              <option value="price-low">Precio (Menor a Mayor)</option>
              <option value="price-high">Precio (Mayor a Menor)</option>
              <option value="rating">Calificación</option>
              <option value="weight-low">Peso (Menor a Mayor)</option>
              <option value="weight-high">Peso (Mayor a Menor)</option>
            </select>
          </div>
          <div class="filter-group">
            <label>
              <input type="checkbox" id="organicFilter"> Solo Orgánicas
            </label>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="products-grid" id="productsGrid">
          ${boxes.map(box => `
            <div class="product-card glass fade-in-up ${userStatus.isGuest ? 'locked' : ''}" data-category="${box.category}" data-organic="${box.organic}" data-price="${box.totalPrice}" data-rating="${box.rating}" data-weight="${box.weight}">
              <div class="product-badge ${box.organic ? 'organic' : ''}">
                ${box.organic ? 'Orgánica' : 'Convencional'}
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
                <img src="${box.img}" alt="${box.name}" loading="lazy">
              </div>
              <div class="product-info">
                <h3 class="product-name">${box.name}</h3>
                <div class="product-rating">
                  <div class="stars">
                    ${'★'.repeat(Math.floor(box.rating))}${'☆'.repeat(5-Math.floor(box.rating))}
                  </div>
                  <span class="rating-score">${box.rating}</span>
                </div>
                <p class="product-desc">${box.desc}</p>
                <div class="box-contents">
                  <small><strong>Contiene:</strong> ${box.contents.join(', ')}</small>
                </div>
                <div class="product-weight">
                  <span class="weight-badge">${box.weight}kg</span>
                </div>
                <div class="product-price">
                  <span class="price-main">$${box.totalPrice.toFixed(2)}</span>
                  <span class="price-unit">($${box.priceKg.toFixed(2)}/kg)</span>
                </div>
                <button class="btn-primary add-to-cart" data-product-id="${box.id}">
                  <i class="fas fa-shopping-cart"></i>
                  Añadir al Carrito
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Cart Summary (floating) -->
      <div class="cart-summary glass ${userStatus.isGuest ? 'locked' : ''}" id="cartSummary">
        <div class="cart-header">
          <i class="fas fa-shopping-cart"></i>
          <span class="cart-count" id="cartCount">0</span>
        </div>
        <div class="cart-total">
          <span>Total:</span>
          <span class="cart-amount" id="cartTotal">$0.00</span>
        </div>
        <button class="btn-primary cart-checkout" id="cartCheckout">
          <i class="fas fa-whatsapp"></i>
          Pedir por WhatsApp
        </button>
      </div>
    </section>
  `;

  // Setup interactions
  setupBoxesInteractions(boxes);
}

// Product interactions (quantity, add to cart)
function setupBoxesInteractions(boxes) {
  const productCards = document.querySelectorAll('.product-card');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const organicFilter = document.getElementById('organicFilter');
  const productsGrid = document.getElementById('productsGrid');

  // Product card interactions
  productCards.forEach(card => {
    const addBtn = card.querySelector('.add-to-cart');
    const productId = Number(addBtn.dataset.productId);

    addBtn.addEventListener('click', () => {
      const box = boxes.find(b => b.id === productId);
      if (box) {
        const cartItem = {
          id: box.id,
          name: box.name,
          price: box.totalPrice / box.weight, // precio por kg para consistencia
          quantity: box.weight, // cantidad en kg
          weight: box.weight,
          totalPrice: box.totalPrice,
          contents: box.contents
        };

        addToCart(cartItem);
      }
    });
  });

  // Filters
  function applyFilters() {
    const category = categoryFilter.value;
    const sortBy = sortFilter.value;
    const onlyOrganic = organicFilter.checked;

    let filtered = boxes.filter(box => {
      if (category !== 'Todas' && box.category !== category) return false;
      if (onlyOrganic && !box.organic) return false;
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.totalPrice - b.totalPrice;
        case 'price-high': return b.totalPrice - a.totalPrice;
        case 'rating': return b.rating - a.rating;
        case 'weight-low': return a.weight - b.weight;
        case 'weight-high': return b.weight - a.weight;
        default: return a.name.localeCompare(b.name);
      }
    });

    // Update grid
    productsGrid.innerHTML = filtered.map(box => `
      <div class="product-card glass fade-in-up" data-category="${box.category}" data-organic="${box.organic}" data-price="${box.totalPrice}" data-rating="${box.rating}" data-weight="${box.weight}">
        <div class="product-badge ${box.organic ? 'organic' : ''}">
          ${box.organic ? 'Orgánica' : 'Convencional'}
        </div>
        <div class="product-image">
          <img src="${box.img}" alt="${box.name}" loading="lazy">
        </div>
        <div class="product-info">
          <h3 class="product-name">${box.name}</h3>
          <div class="product-rating">
            <div class="stars">
              ${'★'.repeat(Math.floor(box.rating))}${'☆'.repeat(5-Math.floor(box.rating))}
            </div>
            <span class="rating-score">${box.rating}</span>
          </div>
          <p class="product-desc">${box.desc}</p>
          <div class="box-contents">
            <small><strong>Contiene:</strong> ${box.contents.join(', ')}</small>
          </div>
          <div class="product-weight">
            <span class="weight-badge">${box.weight}kg</span>
          </div>
          <div class="product-price">
            <span class="price-main">$${box.totalPrice.toFixed(2)}</span>
            <span class="price-unit">($${box.priceKg.toFixed(2)}/kg)</span>
          </div>
          <button class="btn-primary add-to-cart" data-product-id="${box.id}">
            <i class="fas fa-shopping-cart"></i>
            Añadir al Carrito
          </button>
        </div>
      </div>
    `).join('');

    // Re-wire buttons
    productsGrid.querySelectorAll('.add-to-cart').forEach(btn => {
      const productId = Number(btn.dataset.productId);
      btn.addEventListener('click', () => {
        const box = boxes.find(b => b.id === productId);
        if (box) {
          const cartItem = {
            id: box.id,
            name: box.name,
            price: box.totalPrice / box.weight,
            quantity: box.weight,
            weight: box.weight,
            totalPrice: box.totalPrice,
            contents: box.contents
          };

          addToCart(cartItem);
        }
      });
    });
  }

  categoryFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
  organicFilter.addEventListener('change', applyFilters);

  // Setup cart
  setupCart();
}

// Cart functions (separate from store)
let cartBoxes = JSON.parse(localStorage.getItem('fruvi_cart_boxes') || '[]');

// Make cartBoxes globally available
window.cartBoxes = cartBoxes;

function setupCart() {
  updateCartDisplay();

  document.getElementById('cartCheckout')?.addEventListener('click', () => {
    if (cartBoxes.length === 0) {
      showNotification('Tu carrito está vacío', false);
      return;
    }

    // Show checkout modal with cart data
    if (window.checkoutModalBoxes) {
      window.checkoutModalBoxes.show({ items: cartBoxes });
    } else {
      showNotification('Error: Modal de checkout no disponible', false);
    }
  });
}

function addToCart(item) {
  const existing = cartBoxes.find(cartItem => cartItem.id === item.id);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cartBoxes.push(item);
  }

  localStorage.setItem('fruvi_cart_boxes', JSON.stringify(cartBoxes));
  updateCartDisplay();
  showNotification(`${item.name} añadido al carrito`, true);
}

function updateCartDisplay() {
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');

  const totalItems = cartBoxes.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartBoxes.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  countEl.textContent = totalItems;
  totalEl.textContent = `$${totalPrice.toFixed(2)}`;
}

function updateCartItemQuantity(productId, newQuantity) {
  const itemIndex = cartBoxes.findIndex(item => item.id === productId);
  if (itemIndex !== -1) {
    if (newQuantity <= 0) {
      cartBoxes.splice(itemIndex, 1);
      showNotification('Producto eliminado del carrito', true);
    } else {
      cartBoxes[itemIndex].quantity = newQuantity;
      showNotification('Cantidad actualizada', true);
    }
    localStorage.setItem('fruvi_cart_boxes', JSON.stringify(cartBoxes));
    updateCartDisplay();
  }
}

function removeCartItem(productId) {
  const itemIndex = cartBoxes.findIndex(item => item.id === productId);
  if (itemIndex !== -1) {
    const itemName = cartBoxes[itemIndex].name;
    cartBoxes.splice(itemIndex, 1);
    localStorage.setItem('fruvi_cart_boxes', JSON.stringify(cartBoxes));
    updateCartDisplay();
    showNotification(`${itemName} eliminado del carrito`, true);
  }
}

// Make cart functions globally available
window.updateCartBoxesItemQuantity = updateCartItemQuantity;
window.removeCartBoxesItem = removeCartItem;

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
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    animation: 'slideInRight 0.3s ease-out'
  });

  if (success) {
    Object.assign(notification.style, {
      background: 'rgba(255,155,64,0.1)',
      color: '#ff9b40'
    });
  } else {
    Object.assign(notification.style, {
      background: 'rgba(255,107,107,0.1)',
      color: '#ff6b6b'
    });
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Registration benefits (shared function)
if (!window.getRegistrationBenefits) {
  window.getRegistrationBenefits = () => [
    { icon: 'fas fa-truck', title: 'Envío Gratis', description: 'Entrega gratuita en pedidos superiores a $50' },
    { icon: 'fas fa-percentage', title: 'Descuentos Exclusivos', description: 'Hasta 20% de descuento en productos premium' },
    { icon: 'fas fa-clock', title: 'Entrega Rápida', description: 'Recibe tus frutas frescas en menos de 24 horas' },
    { icon: 'fas fa-shield-alt', title: 'Garantía de Calidad', description: 'Solo frutas frescas y de la mejor calidad' },
    { icon: 'fas fa-headset', title: 'Soporte 24/7', description: 'Atención al cliente disponible todo el día' },
    { icon: 'fas fa-gift', title: 'Regalos Especiales', description: 'Recibe frutas gratis en tu cumpleaños' }
  ];
}

// User status function (placeholder)
if (!window.getUserStatus) {
  window.getUserStatus = async () => ({ isGuest: false });
}

// User function (placeholder)
if (!window.getUser) {
  window.getUser = async () => null;
}