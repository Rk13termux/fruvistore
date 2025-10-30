// Assistant Page (AI Chat powered by Groq) - Full-screen ChatGPT-like UI with Database Integration
import { chatCompletionWithHistory, chatCompletionWithDatabase } from '../services/groqService.js';

export function renderAssistantPage(root) {
  // Full page chat layout with professional introduction
  root.innerHTML = `
  <!-- AI Assistant Introduction -->
  <section class="ai-assistant-intro">
    <div class="container">
      <div class="ai-intro__content">
        <div class="ai-intro__text">
          <h1 class="ai-intro__title">
            <i class="fas fa-brain"></i>
            Asistente IA de Fruvi
          </h1>
          <p class="ai-intro__subtitle">Tu experto en frutas, nutrición y bienestar</p>
          <div class="ai-intro__features">
            <div class="feature-item">
              <i class="fas fa-apple-whole"></i>
              <div>
                <h3>Información Nutricional</h3>
                <p>Datos detallados sobre vitaminas, minerales y beneficios de cada fruta.</p>
              </div>
            </div>
            <div class="feature-item">
              <i class="fas fa-utensils"></i>
              <div>
                <h3>Recetas Saludables</h3>
                <p>Sugerencias de recetas creativas y equilibradas con frutas frescas.</p>
              </div>
            </div>
            <div class="feature-item">
              <i class="fas fa-shopping-cart"></i>
              <div>
                <h3>Asesor de Compras</h3>
                <p>Recomendaciones personalizadas según tus necesidades y preferencias.</p>
              </div>
            </div>
            <div class="feature-item">
              <i class="fas fa-heartbeat"></i>
              <div>
                <h3>Consejos de Salud</h3>
                <p>Orientación experta sobre el consumo de frutas para tu bienestar.</p>
              </div>
            </div>
          </div>
          <button class="cta-button ai-start-chat" id="startChatBtn">
            <i class="fas fa-comments"></i>
            Comenzar Conversación
          </button>
        </div>
        <div class="ai-intro__visual">
          <div class="ai-animation-container">
            <div class="floating-fruits">
              <div class="fruit apple"><i class="fas fa-apple-whole"></i></div>
              <div class="fruit banana"><i class="fas fa-lemon"></i></div>
              <div class="fruit orange"><i class="fas fa-circle"></i></div>
              <div class="fruit grape"><i class="fas fa-circle"></i></div>
            </div>
            <div class="ai-brain">
              <i class="fas fa-brain"></i>
              <div class="brain-particles">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
            <div class="health-icons">
              <i class="fas fa-heart"></i>
              <i class="fas fa-leaf"></i>
              <i class="fas fa-seedling"></i>
            </div>
          </div>
                </div>
      </div>
    </div>
  </section>

  <!-- Chat Interface (hidden initially) -->
  <section class="fruvi-chatgpt" id="chatSection" style="display: none;">
    <header class="fruvi-chatgpt__header">
      <div class="container fruvi-chatgpt__header__inner">
        <div class="brand"><i class="fas fa-apple-whole"></i><span>Fruvi</span></div>
        <div class="subtitle">Asistente IA especializado en frutas</div>
        <button class="btn-secondary back-to-intro" id="backToIntroBtn">
          <i class="fas fa-arrow-left"></i>
          Volver
        </button>
      </div>
    </header>
    <main class="fruvi-chatgpt__main">
      <div class="container fruvi-chatgpt__scroll" id="chatMessages" aria-live="polite"></div>
    </main>
    <footer class="fruvi-chatgpt__input">
      <div class="container">
        <form id="chatForm" class="fruvi-chatgpt__form" autocomplete="off">
          <textarea id="userInput" rows="1" placeholder="Pregunta a Fruvi sobre frutas, recetas, nutrición, compras..." aria-label="Escribe tu mensaje"></textarea>
          <div class="fruvi-chatgpt__actions">
            <button type="submit" class="btn-primary fruvi-send-btn" id="sendBtn" title="Enviar mensaje">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
        <p class="fruvi-chatgpt__hint">Fruvi puede equivocarse. Verifica información importante, especialmente nutrición o alergias.</p>
      </div>
    </footer>
  </section>
  `;

  // Conversation history
  const history = [];
  const messagesEl = root.querySelector('#chatMessages');
  const form = root.querySelector('#chatForm');
  const input = root.querySelector('#userInput');
  const chatSection = root.querySelector('#chatSection');
  const startChatBtn = root.querySelector('#startChatBtn');
  const backToIntroBtn = root.querySelector('#backToIntroBtn');

  // Cart management for chat
  let chatCart = JSON.parse(localStorage.getItem('fruvi_chat_cart') || '[]');
  let currentProducts = []; // Store current products for button generation

  // Handle start chat
  startChatBtn.addEventListener('click', async () => {
    root.querySelector('.ai-assistant-intro').style.display = 'none';
    chatSection.style.display = 'grid';

    // Personalized greeting based on user status
    let greeting = '¡Hola! Soy <strong>Fruvi</strong> 🍎. Puedo ayudarte con frutas, compras, envíos, nutrición y recetas. ¿En qué te ayudo hoy?';

    try {
      const user = await window.getUser();
      if (user) {
        greeting = `¡Hola ${user.email?.split('@')[0] || 'usuario'}! Soy <strong>Fruvi</strong> 🍎, tu asistente personal. Tengo acceso a tu información y puedo ayudarte con productos, precios, stock y recomendaciones personalizadas. ¿En qué te ayudo hoy?`;
      }
    } catch (e) {
      console.log('No se pudo obtener información del usuario para saludo personalizado');
    }

    // Initial greeting
    setTimeout(() => appendMessage('assistant', greeting), 300);
  });

  // Handle back to intro
  backToIntroBtn.addEventListener('click', () => {
    chatSection.style.display = 'none';
    root.querySelector('.ai-assistant-intro').style.display = 'block';
    // Clear chat history
    messagesEl.innerHTML = '';
    history.length = 0;
  });

  // Autosize textarea
  input.addEventListener('input', autosize);
  function autosize() {
    input.style.height = 'auto';
    const max = 180; // px
    input.style.height = Math.min(input.scrollHeight, max) + 'px';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = (input.value || '').trim();
    if (!text) return;

    // Get current user for personalized responses
    let currentUserId = null;
    try {
      const user = await window.getUser();
      currentUserId = user?.id || null;
    } catch (e) {
      console.log('No se pudo obtener usuario actual:', e.message);
    }

    // Push user message
    history.push({ role: 'user', content: text });
    appendMessage('user', text);
    input.value = '';
    autosize();
    const stopTyping = showTyping();

    try {
      // Load current products for button generation
      if (currentProducts.length === 0) {
        try {
          currentProducts = await window.getStoreProducts() || [];
        } catch (e) {
          console.log('No se pudieron cargar productos para botones:', e.message);
        }
      }

      // Use database-integrated completion for better responses
      const reply = await chatCompletionWithDatabase(text, currentUserId);
      stopTyping();
      history.push({ role: 'assistant', content: reply });
      appendMessage('assistant', reply);
    } catch (err) {
      console.error('Error con base de datos, usando modo básico:', err);
      try {
        // Fallback to history-based completion
        const reply = await chatCompletionWithHistory(history);
        stopTyping();
        history.push({ role: 'assistant', content: reply });
        appendMessage('assistant', reply);
      } catch (fallbackErr) {
        console.error(fallbackErr);
        stopTyping();
        appendMessage('assistant', 'Lo siento, hubo un problema procesando tu mensaje. Intenta nuevamente.');
      }
    }
  });

  function appendMessage(role, content) {
    const item = document.createElement('div');
    item.className = `fruvi-msg ${role === 'user' ? 'fruvi-msg--user' : 'fruvi-msg--assistant'} fade-in-up`;
    const icon = role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    const textHtml = renderSafeMarkdown(content);

    // Add action buttons for assistant messages - dynamic based on content
    let actionButtons = '';
    if (role === 'assistant') {
      const buttons = [];

      // Extract product names from content and create buttons
      const productMatches = content.match(/\b(aguacate|manzana|mango|pera|platano|uva|fresa|kiwi|naranja|limon|papaya|piña|sandia|melon|cereza|ciruela|durazno|nectarina|mandarina|granada|frambuesa|arandano|morá|guanabana|maracuya|lulo|feijoa|carambolo|pitahaya|lichi|longan|rambutan|jaca|nance|zapote|mamey|anona|chirimoya|guayaba|tomate de arbol|coco|datil|dátil|higo|tuna|nopal|aloe vera|acelga|espinaca|lechuga|repollo|coliflor|brocoli|zanahoria|remolacha|cebolla|ajo|papá|yuca|arracacha|ñame|malanga|plátano|guineo|banano|cambur)\b/gi) || [];

      if (productMatches.length > 0) {
        // Get unique products
        const uniqueProducts = [...new Set(productMatches.map(p => p.toLowerCase()))];

        uniqueProducts.forEach(product => {
          // Try to find product in database to get real price
          try {
            // Find product in current products array
            const productData = currentProducts.find(p => p.name.toLowerCase().includes(product));
            if (productData) {
              buttons.push(`
                <button class="btn-sm btn-success chat-add-to-cart" data-product="${productData.name}" data-price="${productData.priceKg || 10000}">
                  <i class="fas fa-cart-plus"></i> Agregar ${productData.name}
                </button>
              `);
            }
          } catch (e) {
            // Fallback with generic button
            buttons.push(`
              <button class="btn-sm btn-success chat-add-to-cart" data-product="${product}" data-price="10000">
                <i class="fas fa-cart-plus"></i> Agregar ${product}
              </button>
            `);
          }
        });
      }

      // Always add view cart button
      buttons.push(`
        <button class="btn-sm btn-info chat-view-cart">
          <i class="fas fa-shopping-cart"></i> Ver Carrito
        </button>
      `);

      if (buttons.length > 0) {
        actionButtons = `<div class="chat-action-buttons">${buttons.join('')}</div>`;
      }
    }

    item.innerHTML = `
      <div class="fruvi-msg__avatar">${icon}</div>
      <div class="fruvi-msg__bubble">${textHtml}${actionButtons}</div>
    `;

    messagesEl.appendChild(item);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Add event listeners for action buttons
    if (role === 'assistant') {
      item.querySelectorAll('.chat-add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const product = e.target.dataset.product;
          const price = parseInt(e.target.dataset.price);
          addToCartFromChat(product, price);
        });
      });

      item.querySelectorAll('.chat-view-cart').forEach(btn => {
        btn.addEventListener('click', viewCartFromChat);
      });
    }
  }

  function showTyping() {
    const tip = document.createElement('div');
    tip.className = 'fruvi-msg fruvi-msg--assistant typing';
    tip.innerHTML = `
      <div class="fruvi-msg__avatar"><i class="fas fa-robot"></i></div>
      <div class="fruvi-msg__bubble">Escribiendo <span class="loading"></span></div>
    `;
    messagesEl.appendChild(tip);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return () => { tip.remove(); };
  }

  function renderSafeMarkdown(text) {
    // Basic sanitization + lightweight markdown for bold and code; line breaks
    const escaped = escapeHtml(text);
    return escaped
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  function escapeHtml(s = '') {
    return s.replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }
  // Cart functions for chat
  function addToCartFromChat(productName, price) {
    // Ask for quantity
    const quantity = prompt(`¿Cuántos kilos de ${productName} deseas agregar?`, '1');
    if (!quantity || isNaN(quantity) || quantity <= 0) return;

    const qty = parseFloat(quantity);
    const existingItem = chatCart.find(item => item.product === productName);

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      chatCart.push({
        product: productName,
        price: price,
        quantity: qty,
        total: price * qty
      });
    }

    saveChatCart();
    appendMessage('assistant', `¡Perfecto! Agregué ${qty} kg de ${productName} a tu carrito. Total: $${(price * qty).toLocaleString('es-CO')}`);

    // Show cart summary
    showCartSummary();
  }

  function viewCartFromChat() {
    if (chatCart.length === 0) {
      appendMessage('assistant', 'Tu carrito está vacío. ¿Qué frutas te gustaría agregar?');
      return;
    }

    showCartSummary();
  }

  function showCartSummary() {
    if (chatCart.length === 0) return;

    const total = chatCart.reduce((sum, item) => sum + item.total, 0);
    const cartHtml = `
      <div class="chat-cart-summary">
        <h4>🛒 Tu Carrito de Compras</h4>
        ${chatCart.map(item => `
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
          <button class="btn-sm btn-success" onclick="finalizeOrder()">
            <i class="fab fa-whatsapp"></i> Finalizar por WhatsApp
          </button>
          <button class="btn-sm btn-secondary" onclick="clearChatCart()">
            <i class="fas fa-trash"></i> Vaciar Carrito
          </button>
        </div>
      </div>
    `;

    appendMessage('assistant', cartHtml);
  }

  function saveChatCart() {
    localStorage.setItem('fruvi_chat_cart', JSON.stringify(chatCart));
  }

  // Global functions for cart actions
  window.finalizeOrder = function() {
    const total = chatCart.reduce((sum, item) => sum + item.total, 0);
    const orderText = chatCart.map(item =>
      `${item.quantity}kg ${item.product} - $${item.total.toLocaleString('es-CO')}`
    ).join('\n');

    const whatsappMessage = `¡Hola Fruvi! Quiero hacer este pedido:\n\n${orderText}\n\nTotal: $${total.toLocaleString('es-CO')}\n\n¿Me puedes ayudar con el envío?`;

    const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    appendMessage('assistant', '¡Excelente! Te redirigí a WhatsApp para finalizar tu pedido. ¡Gracias por comprar en Fruvi! 🍎');
  };

  window.clearChatCart = function() {
    chatCart = [];
    saveChatCart();
    appendMessage('assistant', 'Carrito vaciado. ¿Qué más te gustaría comprar?');
  };
}
