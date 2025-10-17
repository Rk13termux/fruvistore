// Cart Page - Independent Shopping Cart with Excel Export

export async function renderCartPage(root) {
  // Detectar si estamos en GitHub Pages o en local
  const isGitHubPages = window.location.hostname.includes('github.io');
  const imagePrefix = isGitHubPages ? '/fruvistore' : '';

  // Obtener estado del usuario
  const userStatus = await window.getUserStatus();

  if (userStatus.isGuest) {
    root.innerHTML = `
      <section class="cart-guest">
        <div class="container">
          <div class="guest-message">
            <div class="guest-content">
              <i class="fas fa-shopping-cart"></i>
              <h2>Carrito de Compras</h2>
              <p>Necesitas estar registrado para acceder a tu carrito de compras</p>
              <div class="guest-actions">
                <button class="btn-primary-pro" onclick="window.location.hash='#/registro'">
                  <i class="fas fa-user-plus"></i>
                  Registrarse
                </button>
                <button class="btn-secondary-pro" onclick="window.location.hash='#/login'">
                  <i class="fas fa-sign-in-alt"></i>
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    return;
  }

  // Cargar carrito desde localStorage
  const cart = JSON.parse(localStorage.getItem('fruvi_cart') || '[]');

  root.innerHTML = `
    <section class="cart-page">
      <div class="container">
        <!-- Cart Header -->
        <div class="cart-header">
          <div class="header-content">
            <h1 class="page-title">
              <i class="fas fa-shopping-cart"></i>
              Mi Carrito de Compras
            </h1>
            <div class="cart-stats">
              <div class="stat-item">
                <span class="stat-number" id="cartItemsCount">${cart.length}</span>
                <span class="stat-label">Productos</span>
              </div>
              <div class="stat-item">
                <span class="stat-number" id="cartTotalItems">${cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                <span class="stat-label">Unidades</span>
              </div>
              <div class="stat-item">
                <span class="stat-number" id="cartTotalPrice">$${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                <span class="stat-label">Total</span>
              </div>
            </div>
          </div>
          
          <div class="cart-actions-header">
            <button class="btn-secondary-pro" onclick="window.location.hash='#/tienda'">
              <i class="fas fa-arrow-left"></i>
              Seguir Comprando
            </button>
            ${cart.length > 0 ? `
              <div class="action-buttons">
                <button class="btn-outline-pro" id="clearCartBtn">
                  <i class="fas fa-trash"></i>
                  Vaciar Carrito
                </button>
                <button class="btn-success-pro" id="exportExcelBtn">
                  <i class="fas fa-file-excel"></i>
                  Exportar a Excel
                </button>
                <button class="btn-primary-pro" id="checkoutBtn">
                  <i class="fas fa-credit-card"></i>
                  Proceder al Pago
                </button>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Cart Content -->
        <div class="cart-content">
          ${cart.length === 0 ? `
            <div class="empty-cart">
              <div class="empty-cart-content">
                <div class="empty-icon">
                  <i class="fas fa-shopping-cart"></i>
                </div>
                <h3>Tu carrito está vacío</h3>
                <p>¡Descubre nuestras deliciosas frutas frescas y comienza a llenar tu carrito!</p>
                <div class="empty-actions">
                  <button class="btn-primary-pro" onclick="window.location.hash='#/tienda'">
                    <i class="fas fa-leaf"></i>
                    Explorar Productos
                  </button>
                </div>
              </div>
            </div>
          ` : `
            <!-- Cart Items List -->
            <div class="cart-items-section">
              <div class="section-header">
                <h3>
                  <i class="fas fa-list"></i>
                  Productos en tu carrito
                </h3>
                <div class="bulk-actions">
                  <button class="btn-sm-outline" id="selectAllBtn">
                    <i class="fas fa-check-square"></i>
                    Seleccionar Todo
                  </button>
                  <button class="btn-sm-outline" id="deleteSelectedBtn" style="display: none;">
                    <i class="fas fa-trash"></i>
                    Eliminar Seleccionados
                  </button>
                </div>
              </div>

              <div class="cart-items-list" id="cartItemsList">
                ${renderCartItems(cart)}
              </div>
            </div>

            <!-- Cart Summary -->
            <div class="cart-summary-section">
              <div class="summary-card glass-pro">
                <h3>
                  <i class="fas fa-calculator"></i>
                  Resumen del Pedido
                </h3>
                
                <div class="summary-details" id="summaryDetails">
                  ${renderCartSummary(cart)}
                </div>

                <div class="summary-actions">
                  <button class="btn-outline-pro btn-full" id="saveListBtn">
                    <i class="fas fa-save"></i>
                    Guardar Lista
                  </button>
                  <button class="btn-success-pro btn-full" id="exportExcelBtn2">
                    <i class="fas fa-file-excel"></i>
                    Exportar a Excel
                  </button>
                  <button class="btn-primary-pro btn-full" id="checkoutBtn2">
                    <i class="fas fa-credit-card"></i>
                    Proceder al Pago
                  </button>
                </div>
              </div>
            </div>
          `}
        </div>

        <!-- Recommendations Section -->
        ${cart.length > 0 ? `
          <div class="recommendations-section">
            <h3>
              <i class="fas fa-thumbs-up"></i>
              Te puede interesar
            </h3>
            <div class="recommendations-grid" id="recommendationsGrid">
              <!-- Las recomendaciones se cargarán dinámicamente -->
            </div>
          </div>
        ` : ''}
      </div>
    </section>
  `;

  // Setup interactions
  setupCartInteractions();
  if (cart.length > 0) {
    loadRecommendations();
  }
}

// Render cart items
function renderCartItems(cart) {
  return cart.map((item, index) => `
    <div class="cart-item glass-pro" data-item-id="${item.id}" data-index="${index}">
      <div class="item-checkbox">
        <input type="checkbox" class="item-select" data-item-id="${item.id}">
      </div>
      
      <div class="item-image">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        ${item.organic ? '<div class="organic-badge"><i class="fas fa-leaf"></i></div>' : ''}
      </div>

      <div class="item-details">
        <div class="item-header">
          <h4 class="item-name">${item.name}</h4>
          <div class="item-category">
            <i class="fas fa-tag"></i>
            ${item.category}
          </div>
        </div>
        
        <div class="item-info">
          <div class="price-per-unit">
            <i class="fas fa-dollar-sign"></i>
            $${item.price.toFixed(2)} por kg
          </div>
          ${item.organic ? `
            <div class="organic-info">
              <i class="fas fa-leaf"></i>
              Certificada Orgánica
            </div>
          ` : ''}
        </div>
      </div>

      <div class="item-quantity">
        <label>Cantidad (kg)</label>
        <div class="quantity-controls">
          <button class="qty-btn minus" data-item-id="${item.id}">
            <i class="fas fa-minus"></i>
          </button>
          <input type="number" class="qty-input" value="${item.quantity}" min="0.5" max="50" step="0.5" data-item-id="${item.id}">
          <button class="qty-btn plus" data-item-id="${item.id}">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>

      <div class="item-subtotal">
        <label>Subtotal</label>
        <div class="subtotal-amount">
          $${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>

      <div class="item-actions">
        <button class="btn-favorite" data-item-id="${item.id}" title="Agregar a favoritos">
          <i class="far fa-heart"></i>
        </button>
        <button class="btn-remove" data-item-id="${item.id}" title="Eliminar del carrito">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Render cart summary
function renderCartSummary(cart) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  return `
    <div class="summary-line">
      <span>Subtotal (${cart.length} productos):</span>
      <span>$${subtotal.toFixed(2)}</span>
    </div>
    <div class="summary-line">
      <span>Total unidades:</span>
      <span>${cart.reduce((sum, item) => sum + item.quantity, 0)} kg</span>
    </div>
    <div class="summary-line">
      <span>Envío:</span>
      <span>${shippingCost === 0 ? 'GRATIS' : '$' + shippingCost.toFixed(2)}</span>
    </div>
    ${shippingCost > 0 ? `
      <div class="summary-note">
        <i class="fas fa-info-circle"></i>
        Envío gratis en compras mayores a $50
      </div>
    ` : `
      <div class="summary-note success">
        <i class="fas fa-check-circle"></i>
        ¡Tienes envío gratis!
      </div>
    `}
    <div class="summary-line total">
      <span>Total a Pagar:</span>
      <span>$${total.toFixed(2)}</span>
    </div>
  `;
}

// Setup cart interactions
function setupCartInteractions() {
  // Quantity controls
  document.addEventListener('click', (e) => {
    if (e.target.closest('.qty-btn')) {
      const btn = e.target.closest('.qty-btn');
      const itemId = parseInt(btn.dataset.itemId);
      const isPlus = btn.classList.contains('plus');
      updateQuantity(itemId, isPlus ? 0.5 : -0.5);
    }

    if (e.target.closest('.btn-remove')) {
      const btn = e.target.closest('.btn-remove');
      const itemId = parseInt(btn.dataset.itemId);
      removeFromCart(itemId);
    }

    if (e.target.closest('#clearCartBtn')) {
      clearCart();
    }

    if (e.target.closest('#exportExcelBtn') || e.target.closest('#exportExcelBtn2')) {
      exportToExcel();
    }

    if (e.target.closest('#saveListBtn')) {
      saveCartList();
    }

    if (e.target.closest('#selectAllBtn')) {
      selectAllItems();
    }

    if (e.target.closest('#deleteSelectedBtn')) {
      deleteSelectedItems();
    }
  });

  // Quantity input changes
  document.addEventListener('change', (e) => {
    if (e.target.classList.contains('qty-input')) {
      const itemId = parseInt(e.target.dataset.itemId);
      const newQuantity = parseFloat(e.target.value);
      setQuantity(itemId, newQuantity);
    }

    if (e.target.classList.contains('item-select')) {
      updateBulkActionsVisibility();
    }
  });
}

// Update quantity
function updateQuantity(itemId, change) {
  const cart = JSON.parse(localStorage.getItem('fruvi_cart') || '[]');
  const item = cart.find(item => item.id === itemId);
  
  if (item) {
    item.quantity = Math.max(0.5, item.quantity + change);
    if (item.quantity > 50) item.quantity = 50;
    
    saveCart(cart);
    updateCartDisplay();
    showNotification(`Cantidad actualizada: ${item.quantity} kg`, true);
  }
}

// Set specific quantity
function setQuantity(itemId, quantity) {
  const cart = JSON.parse(localStorage.getItem('fruvi_cart') || '[]');
  const item = cart.find(item => item.id === itemId);
  
  if (item) {
    item.quantity = Math.max(0.5, Math.min(50, quantity));
    saveCart(cart);
    updateCartDisplay();
  }
}

// Remove item from cart
function removeFromCart(itemId) {
  const cart = JSON.parse(localStorage.getItem('fruvi_cart') || '[]');
  const itemIndex = cart.findIndex(item => item.id === itemId);
  
  if (itemIndex !== -1) {
    const removedItem = cart[itemIndex];
    cart.splice(itemIndex, 1);
    saveCart(cart);
    
    showNotification(`${removedItem.name} eliminado del carrito`, false);
    
    // Reload page if cart is empty
    if (cart.length === 0) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      updateCartDisplay();
    }
  }
}

// Clear entire cart
function clearCart() {
  if (confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
    localStorage.removeItem('fruvi_cart');
    showNotification('Carrito vaciado correctamente', true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('fruvi_cart', JSON.stringify(cart));
}

// Update cart display
function updateCartDisplay() {
  const cart = JSON.parse(localStorage.getItem('fruvi_cart') || '[]');
  
  // Update stats
  document.getElementById('cartItemsCount').textContent = cart.length;
  document.getElementById('cartTotalItems').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cartTotalPrice').textContent = `$${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`;
  
  // Update items list
  const itemsList = document.getElementById('cartItemsList');
  if (itemsList) {
    itemsList.innerHTML = renderCartItems(cart);
  }
  
  // Update summary
  const summaryDetails = document.getElementById('summaryDetails');
  if (summaryDetails) {
    summaryDetails.innerHTML = renderCartSummary(cart);
  }
}

// Select all items
function selectAllItems() {
  const checkboxes = document.querySelectorAll('.item-select');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  
  checkboxes.forEach(cb => {
    cb.checked = !allChecked;
  });
  
  updateBulkActionsVisibility();
}

// Update bulk actions visibility
function updateBulkActionsVisibility() {
  const selectedItems = document.querySelectorAll('.item-select:checked');
  const deleteBtn = document.getElementById('deleteSelectedBtn');
  const selectAllBtn = document.getElementById('selectAllBtn');
  
  if (deleteBtn) {
    deleteBtn.style.display = selectedItems.length > 0 ? 'block' : 'none';
  }
  
  if (selectAllBtn) {
    const allCheckboxes = document.querySelectorAll('.item-select');
    const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
    selectAllBtn.innerHTML = allChecked ? 
      '<i class="fas fa-square"></i> Deseleccionar Todo' : 
      '<i class="fas fa-check-square"></i> Seleccionar Todo';
  }
}

// Delete selected items
function deleteSelectedItems() {
  const selectedCheckboxes = document.querySelectorAll('.item-select:checked');
  const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.itemId));
  
  if (selectedIds.length === 0) return;
  
  if (confirm(`¿Eliminar ${selectedIds.length} producto(s) seleccionado(s)?`)) {
    const cart = JSON.parse(localStorage.getItem('fruvi_cart') || '[]');
    const filteredCart = cart.filter(item => !selectedIds.includes(item.id));
    
    saveCart(filteredCart);
    showNotification(`${selectedIds.length} producto(s) eliminado(s)`, true);
    
    if (filteredCart.length === 0) {
      setTimeout(() => window.location.reload(), 1000);
    } else {
      updateCartDisplay();
      updateBulkActionsVisibility();
    }
  }
}

// Export to Excel
async function exportToExcel() {
  try {
    const cart = JSON.parse(localStorage.getItem('fruvi_cart') || '[]');
    if (cart.length === 0) {
      showNotification('No hay productos en el carrito para exportar', false);
      return;
    }

    // Crear datos para Excel
    const excelData = cart.map((item, index) => ({
      '#': index + 1,
      'Producto': item.name,
      'Categoría': item.category,
      'Precio por Kg': `$${item.price.toFixed(2)}`,
      'Cantidad (Kg)': item.quantity,
      'Subtotal': `$${(item.price * item.quantity).toFixed(2)}`,
      'Orgánico': item.organic ? 'Sí' : 'No'
    }));

    // Calcular totales
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shippingCost;

    // Agregar filas de resumen
    excelData.push({});
    excelData.push({
      'Producto': 'RESUMEN',
      'Precio por Kg': '',
      'Cantidad (Kg)': cart.reduce((sum, item) => sum + item.quantity, 0),
      'Subtotal': `$${subtotal.toFixed(2)}`
    });
    excelData.push({
      'Producto': 'Envío',
      'Subtotal': shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toFixed(2)}`
    });
    excelData.push({
      'Producto': 'TOTAL',
      'Subtotal': `$${total.toFixed(2)}`
    });

    // Crear archivo Excel usando SheetJS
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Estilo para el header
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "CCCCCC" } }
      };
    }

    XLSX.utils.book_append_sheet(wb, ws, "Carrito de Compras");

    // Generar nombre de archivo con fecha
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = `Fruvi_Carrito_${dateStr}_${timeStr}.xlsx`;

    // Descargar archivo
    XLSX.writeFile(wb, filename);
    
    showNotification('Archivo Excel exportado correctamente', true);
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    showNotification('Error al exportar a Excel. Por favor, intenta de nuevo.', false);
  }
}

// Save cart list as JSON
function saveCartList() {
  try {
    const cart = JSON.parse(localStorage.getItem('fruvi_cart') || '[]');
    if (cart.length === 0) {
      showNotification('No hay productos en el carrito para guardar', false);
      return;
    }

    const listData = {
      fecha: new Date().toISOString(),
      productos: cart,
      resumen: {
        totalProductos: cart.length,
        totalUnidades: cart.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        envio: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 50 ? 0 : 5.99,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 50 ? 0 : 5.99)
      }
    };

    const dataStr = JSON.stringify(listData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `Fruvi_Lista_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Lista guardada correctamente', true);
  } catch (error) {
    console.error('Error al guardar lista:', error);
    showNotification('Error al guardar la lista', false);
  }
}

// Load recommendations
function loadRecommendations() {
  // This would typically load from an API
  // For now, we'll use placeholder content
  const recommendationsGrid = document.getElementById('recommendationsGrid');
  if (recommendationsGrid) {
    recommendationsGrid.innerHTML = `
      <div class="recommendation-item">
        <i class="fas fa-apple-whole"></i>
        <span>Manzanas frescas</span>
      </div>
      <div class="recommendation-item">
        <i class="fas fa-lemon"></i>
        <span>Cítricos de temporada</span>
      </div>
      <div class="recommendation-item">
        <i class="fas fa-seedling"></i>
        <span>Productos orgánicos</span>
      </div>
    `;
  }
}

// Show notification
function showNotification(message, success = true) {
  const notification = document.createElement('div');
  notification.className = `notification ${success ? 'success' : 'error'}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${success ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;

  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '10000',
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: success ? '#10b981' : '#ef4444',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    opacity: '0',
    transform: 'translateX(120%)'
  });

  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 10);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(120%)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}