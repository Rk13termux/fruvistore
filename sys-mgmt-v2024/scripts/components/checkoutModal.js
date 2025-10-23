// Checkout Modal Component
import * as XLSX from 'xlsx';

export class CheckoutModal {
  constructor() {
    this.currentStep = 1;
    this.orderData = null;
    this.init();
  }

  init() {
    // Create modal HTML
    this.createModalHTML();
    this.bindEvents();
  }

  createModalHTML() {
    const modalHTML = `
      <!-- Checkout Modal -->
      <div id="checkoutModal" class="checkout-modal">
        <div class="checkout-backdrop"></div>
        <div class="checkout-content glass">
          <div class="checkout-header">
            <h2 id="checkoutTitle">Resumen del Pedido</h2>
            <button id="closeCheckoutModal" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div id="checkoutSteps">
            <!-- Step 1: Order Summary -->
            <div id="step1" class="checkout-step active">
              <div class="order-summary">
                <h3>Tu Pedido</h3>
                <div id="orderItemsList" class="order-items"></div>
                <div class="order-totals">
                  <div class="total-row">
                    <span>Subtotal:</span>
                    <span id="orderSubtotal">$0.00</span>
                  </div>
                  <div class="total-row">
                    <span>Envío:</span>
                    <span id="orderShipping">$5.00</span>
                  </div>
                  <div class="total-row final-total">
                    <span>Total:</span>
                    <span id="orderTotal">$0.00</span>
                  </div>
                </div>
                <button id="whatsappBtn" class="btn-primary whatsapp-btn">
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
    document.getElementById('closeCheckoutModal')?.addEventListener('click', () => this.close());
    document.querySelector('.checkout-backdrop')?.addEventListener('click', () => this.close());

    // WhatsApp button
    document.getElementById('whatsappBtn')?.addEventListener('click', (e) => this.handleWhatsApp(e));

    // Cart item controls
    this.bindCartItemControls();
  }

  bindCartItemControls() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.quantity-btn.plus')) {
        const productId = parseInt(e.target.closest('.quantity-btn').dataset.productId);
        const currentItem = this.orderData.items.find(item => item.id === productId);
        if (currentItem) {
          window.updateCartItemQuantity(productId, currentItem.quantity + 1);
          this.updateOrderSummary();
        }
      }

      if (e.target.closest('.quantity-btn.minus')) {
        const productId = parseInt(e.target.closest('.quantity-btn').dataset.productId);
        const currentItem = this.orderData.items.find(item => item.id === productId);
        if (currentItem) {
          window.updateCartItemQuantity(productId, currentItem.quantity - 1);
          this.updateOrderSummary();
        }
      }

      if (e.target.closest('.remove-btn')) {
        const productId = parseInt(e.target.closest('.remove-btn').dataset.productId);
        window.removeCartItem(productId);
        this.updateOrderSummary();
      }
    });
  }

  show(orderData) {
    this.orderData = orderData;
    this.currentStep = 1;

    // Update modal content
    this.updateOrderSummary();
    this.updateWhatsAppLink();

    // Show modal
    const modal = document.getElementById('checkoutModal');
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Update title
    document.getElementById('checkoutTitle').textContent = 'Resumen del Pedido - Enviar por WhatsApp';
  }

  close() {
    const modal = document.getElementById('checkoutModal');
    modal?.classList.remove('active');
    document.body.style.overflow = '';
    this.currentStep = 1;
  }

  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
      this.updateStepDisplay();
    }
  }

  updateStepDisplay() {
    // Update step visibility
    document.querySelectorAll('.checkout-step').forEach((step, index) => {
      step.classList.toggle('active', index + 1 === this.currentStep);
    });

    // Update title
    const title = document.getElementById('checkoutTitle');
    if (this.currentStep === 1) {
      title.textContent = 'Resumen del Pedido';
    } else {
      title.textContent = 'Instrucciones de Pedido';
    }
  }

  updateOrderSummary() {
    const itemsList = document.getElementById('orderItemsList');
    const subtotalEl = document.getElementById('orderSubtotal');
    const totalEl = document.getElementById('orderTotal');

    const items = window.cart || [];
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

    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) {
      whatsappBtn.href = whatsappUrl;
    }
  }

  generateWhatsAppMessage() {
    const items = window.cart || [];
    if (items.length === 0) return '';

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 5.00;
    const total = subtotal + shipping;

    let message = '🛒 *NUEVO PEDIDO - Fruvi Store*\n\n';
    message += '*Productos:*\n';

    items.forEach(item => {
      message += `• ${item.name}\n`;
      if (item.weight) {
        message += `  Caja: ${item.weight}kg × $${item.price.toFixed(2)}/kg\n`;
        message += `  Subtotal: $${(item.price * item.quantity).toFixed(2)}\n`;
        if (item.contents) {
          message += `  Contiene: ${item.contents.join(', ')}\n`;
        }
      } else {
        message += `  Cantidad: ${item.quantity}kg × $${item.price.toFixed(2)}/kg\n`;
        message += `  Subtotal: $${(item.price * item.quantity).toFixed(2)}\n`;
      }
      message += '\n';
    });

    message += `*Resumen:*\n`;
    message += `Subtotal: $${subtotal.toFixed(2)}\n`;
    message += `Envío: $${shipping.toFixed(2)}\n`;
    message += `Total: $${total.toFixed(2)}\n\n`;
    message += `✅ Listo para procesar el pedido. ¡Gracias por tu compra!`;

    return message;
  }

  async downloadExcel() {
    if (!this.orderData || !this.orderData.items || this.orderData.items.length === 0) {
      this.showNotification('❌ No hay productos en el carrito', 'error');
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = this.prepareExcelData();

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      ws['!cols'] = [
        { wch: 30 }, // Producto
        { wch: 10 }, // Cantidad
        { wch: 12 }, // Precio Unitario
        { wch: 15 }, // Subtotal
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Pedido Fruvi');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `pedido-fruvi-${timestamp}.xlsx`;

      // Download file
      XLSX.writeFile(wb, filename);

      // Show success message
      this.showNotification('✅ Excel descargado correctamente', 'success');

      // Move to next step
      setTimeout(() => {
        this.nextStep();
      }, 1000);

    } catch (error) {
      console.error('Error downloading Excel:', error);
      this.showNotification('❌ Error al descargar Excel: ' + error.message, 'error');
    }
  }

  prepareExcelData() {
    const data = [
      ['🛒 PEDIDO - FRUVI STORE'],
      [''],
      ['INFORMACIÓN DEL CLIENTE'],
      ['Nombre:', ''],
      ['Email:', ''],
      ['Teléfono:', ''],
      ['Dirección:', ''],
      [''],
      ['DETALLE DEL PEDIDO'],
      ['Producto', 'Cantidad (kg)', 'Precio Unitario', 'Subtotal'],
    ];

    if (this.orderData && this.orderData.items) {
      this.orderData.items.forEach(item => {
        data.push([
          item.name,
          item.quantity,
          `$${item.price.toFixed(2)}`,
          `$${(item.price * item.quantity).toFixed(2)}`
        ]);
      });
    }

    // Add totals
    const subtotal = this.orderData?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const shipping = 5.00;
    const total = subtotal + shipping;

    data.push(
      [''],
      ['RESUMEN'],
      ['Subtotal:', '', '', `$${subtotal.toFixed(2)}`],
      ['Envío:', '', '', `$${shipping.toFixed(2)}`],
      ['TOTAL:', '', '', `$${total.toFixed(2)}`],
      [''],
      ['📅 Fecha del pedido:', new Date().toLocaleString('es-ES')],
      ['🔗 Enlace del pedido:', window.location.href]
    );

    return data;
  }

  handleWhatsApp(e) {
    e.preventDefault();

    if (!this.orderData || !this.orderData.items || this.orderData.items.length === 0) {
      this.showNotification('❌ No hay productos en el pedido', 'error');
      return;
    }

    // Open WhatsApp
    const whatsappUrl = e.target.closest('a').href;
    window.open(whatsappUrl, '_blank');

    this.showNotification('📱 WhatsApp abierto con tu pedido', 'success');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `checkout-notification ${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;

    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '10000',
      padding: '12px 16px',
      borderRadius: '8px',
      background: type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Export singleton instance
export const checkoutModal = new CheckoutModal();
