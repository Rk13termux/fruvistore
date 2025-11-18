// Checkout Modal Component for Boxes

export class CheckoutModalBoxes {
  constructor() {
    this.currentStep = 1;
    this.orderData = null;
    this.initialized = false;
  }

  init() {
    // Create modal HTML
    this.createModalHTML();
    this.bindEvents();
  }

  createModalHTML() {
    const modalHTML = `
      <!-- Checkout Modal Boxes -->
      <div id="checkoutModalBoxes" class="checkout-modal">
        <div class="checkout-backdrop"></div>
        <div class="checkout-content glass">
          <div class="checkout-header">
                        <h2 id="checkoutTitleBoxes">Resumen del Pedido - Cajas</h2>
            <button id="closeCheckoutModalBoxes" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div id="checkoutStepsBoxes">
            <!-- Step 1: Order Summary -->
            <div id="step1Boxes" class="checkout-step active">
              <div class="order-summary">
                <h3>Tu Pedido</h3>
                <div id="orderItemsListBoxes" class="order-items"></div>
                <div class="order-totals">
                  <div class="total-row">
                    <span>Subtotal:</span>
                    <span id="orderSubtotalBoxes">$0.00</span>
                  </div>
                  <div class="total-row">
                    <span>Envío:</span>
                    <span id="orderShippingBoxes">$5.00</span>
                  </div>
                  <div class="total-row final-total">
                    <span>Total:</span>
                    <span id="orderTotalBoxes">$0.00</span>
                  </div>
                </div>
                <button id="whatsappBtnBoxes" class="btn-primary whatsapp-btn">
                  <i class="fab fa-whatsapp"></i>
                  Enviar Pedido por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  bindEvents() {
    // Close modal
    document.getElementById('closeCheckoutModalBoxes')?.addEventListener('click', () => this.close());
    document.querySelector('#checkoutModalBoxes .checkout-backdrop')?.addEventListener('click', () => this.close());

    // WhatsApp button
    document.getElementById('whatsappBtnBoxes')?.addEventListener('click', (e) => this.handleWhatsApp(e));

    // Cart item controls
    this.bindCartItemControls();
  }

  bindCartItemControls() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.quantity-btn.plus')) {
        const productId = parseInt(e.target.closest('.quantity-btn').dataset.productId);
        const currentItem = this.orderData.items.find(item => item.id === productId);
        if (currentItem) {
          window.updateCartBoxesItemQuantity(productId, currentItem.quantity + 1);
          this.updateOrderSummary();
        }
      }

      if (e.target.closest('.quantity-btn.minus')) {
        const productId = parseInt(e.target.closest('.quantity-btn').dataset.productId);
        const currentItem = this.orderData.items.find(item => item.id === productId);
        if (currentItem) {
          window.updateCartBoxesItemQuantity(productId, currentItem.quantity - 1);
          this.updateOrderSummary();
        }
      }

      if (e.target.closest('.remove-btn')) {
        const productId = parseInt(e.target.closest('.remove-btn').dataset.productId);
        window.removeCartBoxesItem(productId);
        this.updateOrderSummary();
      }
    });
  }

  show(orderData) {
    // Initialize modal if not already done
    if (!this.initialized) {
      this.init();
      this.initialized = true;
    }
    
    this.orderData = orderData;
    this.currentStep = 1;

    // Update modal content
    this.updateOrderSummary();
    this.updateWhatsAppLink();

    // Show modal
    const modal = document.getElementById('checkoutModalBoxes');
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Update title
    document.getElementById('checkoutTitleBoxes').textContent = 'Resumen del Pedido - Cajas';
  }

  close() {
    const modal = document.getElementById('checkoutModalBoxes');
    modal?.classList.remove('active');
    document.body.style.overflow = '';
    this.currentStep = 1;
  }

  updateOrderSummary() {
    const itemsList = document.getElementById('orderItemsListBoxes');
    const subtotalEl = document.getElementById('orderSubtotalBoxes');
    const totalEl = document.getElementById('orderTotalBoxes');

    const items = window.cartBoxes || [];
    if (items.length === 0) {
      itemsList.innerHTML = '<p style="text-align: center; color: var(--muted);">Tu carrito está vacío</p>';
      subtotalEl.textContent = '$0.00';
      totalEl.textContent = '$5.00';
      return;
    }

    let subtotal = 0;

    itemsList.innerHTML = items.map(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      return `
        <div class="order-item">
          <div class="item-info">
            <h4>${item.name}</h4>
            <div class="item-controls">
              <button class="quantity-btn minus" data-product-id="${item.id}">
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity-display">${item.quantity}kg</span>
              <button class="quantity-btn plus" data-product-id="${item.id}">
                <i class="fas fa-plus"></i>
              </button>
              <button class="remove-btn" data-product-id="${item.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <p>$${item.price.toFixed(2)}/kg</p>
          </div>
          <div class="item-total">
            $${itemTotal.toFixed(2)}
          </div>
        </div>
      `;
    }).join('');

    const shipping = 5.00;
    const total = subtotal + shipping;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
  }

  updateWhatsAppLink() {
    const phoneNumber = '+573125298577';
    const message = this.generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const whatsappBtn = document.getElementById('whatsappBtnBoxes');
    if (whatsappBtn) {
      whatsappBtn.href = whatsappUrl;
    }
  }

  generateWhatsAppMessage() {
    const items = window.cartBoxes || [];
    if (items.length === 0) return '';

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 5.00;
    const total = subtotal + shipping;

    // Mensaje profesional y persuasivo para FruviBox
    let message = '📦 *NUEVO PEDIDO FRUVIBOX* 🎁\n\n';
    
    message += '🎉 *TUS CAJAS PREMIUM*\n\n';

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Cantidad: *${item.quantity} ${item.quantity > 1 ? 'cajas' : 'caja'}*\n`;
      message += `   Precio: $${item.price.toFixed(2)}/caja\n`;
      message += `   Subtotal: *$${(item.price * item.quantity).toFixed(2)}*\n\n`;
    });

    message += '----------------------------\n\n';
    message += '📊 *RESUMEN DEL PEDIDO*\n\n';
    message += `Subtotal: $${subtotal.toFixed(2)}\n`;
    message += `Envío: $${shipping.toFixed(2)}\n`;
    message += `*TOTAL: $${total.toFixed(2)}*\n\n`;
    
    message += '✨ *Tu FruviBox lista para enviarse*\n\n';
    message += '🎁 *Beneficios:*\n';
    message += '✅ Combinaciones balanceadas\n';
    message += '✅ Frutas premium\n';
    message += '✅ Variedad garantizada\n\n';
    message += '🙏 *¡Gracias por elegir FruviBox!* 💝';

    return message;
  }

  handleWhatsApp(e) {
    e.preventDefault();
    const whatsappUrl = e.target.href;
    window.open(whatsappUrl, '_blank');

    // Clear cart after sending order
    window.cartBoxes = [];
    localStorage.setItem('fruvi_cart_store', JSON.stringify([]));
    this.close();

    // Show success message
    this.showNotification('¡Pedido enviado exitosamente!', true);
  }

  showNotification(message, success = true) {
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
}