// Floating AI Chat Widget (Fruvi Glass) - Synchronized with Main Assistant
import { chatCompletionWithDatabase } from '../services/groqService.js';

export function initChatWidget() {
  if (document.getElementById('fruvi-chat-fab')) return; // avoid duplicates

  const wrap = document.createElement('div');
  wrap.id = 'fruvi-chat-widget';
  wrap.innerHTML = `
    <button id="fruvi-chat-fab" class="chat-fab glow-pulse" aria-label="Abrir chat IA">
      <i class="fas fa-comment-dots"></i>
      <span class="fab-badge">AI</span>
    </button>
    <div id="fruvi-chat-backdrop" class="chat-backdrop" aria-hidden="true"></div>
    <div id="fruvi-chat-panel" class="chat-panel glass" aria-hidden="true">
      <div class="chat-panel__header">
        <div class="brand"><i class="fas fa-robot"></i> <span>Fruvi AI</span></div>
        <button id="fruvi-chat-close" class="btn-icon" aria-label="Cerrar"><i class="fas fa-xmark"></i></button>
      </div>
      <div id="fruvi-chat-messages" class="chat-panel__messages">
        <div class="message bot-message"><i class="fas fa-brain"></i><p>¡Hola! Soy <strong>Fruvi</strong> 🍎, tu asistente personal para frutas frescas. ¿Qué frutas te interesan hoy?</p></div>
      </div>
      <div class="chat-panel__input">
        <input type="text" id="fruvi-chat-input" placeholder="Escribe tu pregunta..." />
        <button id="fruvi-chat-send" class="btn-primary"><i class="fas fa-paper-plane"></i></button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  const fab = document.getElementById('fruvi-chat-fab');
  const panel = document.getElementById('fruvi-chat-panel');
  const backdrop = document.getElementById('fruvi-chat-backdrop');
  const closeBtn = document.getElementById('fruvi-chat-close');
  const sendBtn = document.getElementById('fruvi-chat-send');
  const input = document.getElementById('fruvi-chat-input');
  const msgs = document.getElementById('fruvi-chat-messages');

  const open = () => {
    panel.setAttribute('aria-hidden', 'false');
    panel.classList.add('open');
    backdrop.classList.add('show');
    input.focus();
  };
  const close = () => {
    panel.setAttribute('aria-hidden', 'true');
    panel.classList.remove('open');
    backdrop.classList.remove('show');
  };

  fab.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Move these functions outside to make them accessible
  function renderWidgetMarkdown(text) {
    // Basic markdown rendering for widget
    const escaped = escapeHtml(text);
    return escaped
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  function generateWidgetActionButtons(text) {
    // Extract product names from response
    const productMatches = text.match(/\b(aguacate|manzana|mango|pera|platano|uva|fresa|kiwi|naranja|limon|papaya|piña|sandia|melon|cereza|ciruela|durazno|nectarina|mandarina|granada|frambuesa|arandano|morá|guanabana|maracuya|lulo|feijoa|carambolo|pitahaya|lichi|longan|rambutan|jaca|nance|zapote|mamey|anona|chirimoya|guayaba|tomate de arbol|coco|datil|dátil|higo|tuna|nopal|aloe vera|acelga|espinaca|lechuga|repollo|coliflor|brocoli|zanahoria|remolacha|cebolla|ají|papá|yuca|arracacha|ñame|malanga|plátano|guineo|banano|cambur)\b/gi) || [];

    if (productMatches.length === 0) return '';

    // Get unique products
    const uniqueProducts = [...new Set(productMatches.map(p => p.toLowerCase()))];

    const buttons = uniqueProducts.map(product => {
      return `<button class="widget-btn widget-add-to-cart" data-product="${product}" data-price="10000">
        <i class="fas fa-cart-plus"></i> ${product.charAt(0).toUpperCase() + product.slice(1)}
      </button>`;
    }).filter(Boolean);

    // Always add cart view button
    buttons.push(`<button class="widget-btn widget-view-cart">
      <i class="fas fa-shopping-cart"></i> Ver Carrito
    </button>`);

    return `<div class="widget-action-buttons">${buttons.join('')}</div>`;
  }

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}-message`;
    const icon = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-brain"></i>';
    const processedText = renderWidgetMarkdown(text);
    div.innerHTML = `${icon}<p>${processedText}`;

    // Add action buttons for bot messages
    if (sender === 'bot') {
      const buttons = generateWidgetActionButtons(text);
      if (buttons) {
        div.innerHTML += buttons;
      }
    }

    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.id = 'fruvi-chat-typing';
    t.className = 'message bot-message typing-indicator';
    t.innerHTML = '<i class="fas fa-robot"></i><p>Escribiendo <span class="loading"></span></p>';
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function hideTyping() { const t = document.getElementById('fruvi-chat-typing'); if (t) t.remove(); }

  async function send() {
    const text = (input.value || '').trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    showTyping();

    try {
      // Get user name for personalized responses
      let userName = '';
      try {
function escapeHtml(s) { return s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }

function renderWidgetMarkdown(text) {
  // Basic markdown rendering for widget
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

function generateWidgetActionButtons(text) {
  // Extract product names from response
  const productMatches = text.match(/\b(aguacate|manzana|mango|pera|platano|uva|fresa|kiwi|naranja|limon|papaya|piña|sandia|melon|cereza|ciruela|durazno|nectarina|mandarina|granada|frambuesa|arandano|morá|guanabana|maracuya|lulo|feijoa|carambolo|pitahaya|lichi|longan|rambutan|jaca|nance|zapote|mamey|anona|chirimoya|guayaba|tomate de arbol|coco|datil|dátil|higo|tuna|nopal|aloe vera|acelga|espinaca|lechuga|repollo|coliflor|brocoli|zanahoria|remolacha|cebolla|ajo|papá|yuca|arracacha|ñame|malanga|plátano|guineo|banano|cambur)\b/gi) || [];

  if (productMatches.length === 0) return '';

  // Get unique products
  const uniqueProducts = [...new Set(productMatches.map(p => p.toLowerCase()))];

  const buttons = uniqueProducts.map(product => {
    return `<button class="widget-btn widget-add-to-cart" data-product="${product}" data-price="10000">
      <i class="fas fa-cart-plus"></i> ${product.charAt(0).toUpperCase() + product.slice(1)}
    </button>`;
  }).filter(Boolean);

  // Always add cart view button
  buttons.push(`<button class="widget-btn widget-view-cart">
    <i class="fas fa-shopping-cart"></i> Ver Carrito
  </button>`);

  return `<div class="widget-action-buttons">${buttons.join('')}</div>`;
}

// Widget cart functions (simplified version)
function addToWidgetCart(productName, price) {
  const quantity = prompt(`¿Cuántos kilos de ${productName} deseas agregar?`, '1');
  if (!quantity || isNaN(quantity) || quantity <= 0) return;

  const qty = parseFloat(quantity);
  let widgetCart = JSON.parse(localStorage.getItem('fruvi_widget_cart') || '[]');

  const existingItem = widgetCart.find(item => item.product === productName);

  if (existingItem) {
    existingItem.quantity += qty;
    existingItem.total = existingItem.price * existingItem.quantity;
  } else {
    widgetCart.push({
      product: productName,
      price: price,
      quantity: qty,
      total: price * qty
    });
  }

  localStorage.setItem('fruvi_widget_cart', JSON.stringify(widgetCart));

  const totalItems = widgetCart.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = widgetCart.reduce((sum, item) => sum + item.total, 0);

  let response = `¡Perfecto! 🎉 Agregué ${qty} kg de ${productName} a tu carrito. `;

  if (totalItems >= 3) {
    response += `¡Qué rico pedido llevas! Ya tienes ${totalItems} kg de frutas frescas. ¿Estás listo para confirmar?`;
  } else {
    response += `Ahora llevas ${totalItems} kg en total. ¿Te gustaría agregar algo más?`;
  }

  addMessage(response, 'bot');
}

function viewWidgetCart() {
  let widgetCart = JSON.parse(localStorage.getItem('fruvi_widget_cart') || '[]');

  if (widgetCart.length === 0) {
    addMessage('Tu carrito está vacío. ¿Qué frutas te gustaría agregar?', 'bot');
    return;
  }

  const total = widgetCart.reduce((sum, item) => sum + item.total, 0);
  const cartHtml = `
    <div class="widget-cart-summary">
      <h4>🛒 Tu Carrito</h4>
      ${widgetCart.map(item => `
        <div class="cart-item">
          <span>${item.product}</span>
          <span>${item.quantity} kg x $${item.price.toLocaleString('es-CO')}</span>
          <span>$${item.total.toLocaleString('es-CO')}</span>
        </div>
      `).join('')}
      <div class="cart-total">
        <strong>Total: $${total.toLocaleString('es-CO')}</strong>
      </div>
      <div class="cart-actions">
        <button class="widget-btn widget-finalize" onclick="finalizeWidgetOrder()">
          <i class="fab fa-whatsapp"></i> Finalizar por WhatsApp
        </button>
        <button class="widget-btn widget-clear" onclick="clearWidgetCart()">
          <i class="fas fa-trash"></i> Vaciar
        </button>
      </div>
    </div>
  `;

  addMessage(cartHtml, 'bot');
}

// Global functions for widget cart
window.finalizeWidgetOrder = function() {
  let widgetCart = JSON.parse(localStorage.getItem('fruvi_widget_cart') || '[]');
  const total = widgetCart.reduce((sum, item) => sum + item.total, 0);
  const orderText = widgetCart.map(item =>
    `${item.quantity}kg ${item.product} - $${item.total.toLocaleString('es-CO')}`
  ).join('\n');

  const whatsappMessage = `¡Hola Fruvi! 🍎 Quiero hacer este pedido:\n\n${orderText}\n\n💰 Total: $${total.toLocaleString('es-CO')}\n\n🚚 ¿Me puedes ayudar con el envío?\n\n¡Gracias! 😊`;

  const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(whatsappMessage)}`;
  window.open(whatsappUrl, '_blank');

  addMessage('¡Excelente! 🚀 Te envié todo por WhatsApp para coordinar la entrega. ¡Gracias por elegir Fruvi! 🌱💚', 'bot');

  // Clear cart after successful order
  localStorage.setItem('fruvi_widget_cart', JSON.stringify([]));
};

window.clearWidgetCart = function() {
  localStorage.setItem('fruvi_widget_cart', JSON.stringify([]));
  addMessage('Carrito vaciado. ¿Qué más te gustaría comprar?', 'bot');
};
        const user = await window.getUser();
        if (user) {
          userName = user.email?.split('@')[0] || '';
        }
      } catch (e) {}

      // Use the same enhanced database completion as the main assistant
      const res = await chatCompletionWithDatabase(text, null, userName);
      hideTyping();
      addMessage(res, 'bot');
    } catch (e) {
      console.error(e);
      hideTyping();
      addMessage('Lo siento, tuve un problema procesando tu mensaje. ¿Puedes intentarlo de nuevo?', 'bot');
    }
  }

  // Fix send button functionality
  sendBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Send button clicked');
    send();
  });

  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      console.log('Enter key pressed');
      send();
    }
  });

  // Add event listeners for action buttons (delegated)
  msgs.addEventListener('click', (e) => {
    if (e.target.classList.contains('widget-add-to-cart')) {
      const product = e.target.dataset.product;
      const price = parseInt(e.target.dataset.price);
      addToWidgetCart(product, price);
    } else if (e.target.classList.contains('widget-view-cart')) {
      viewWidgetCart();
    }
  });
}

function escapeHtml(s) { return s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }
