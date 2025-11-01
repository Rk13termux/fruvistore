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
          <div class="dr-ai-header">
            <div class="dr-ai-logo">
              <i class="fas fa-brain"></i>
            </div>
            <div class="dr-ai-info">
              <h1 class="dr-ai-title">Dr. Nutricionista IA</h1>
              <div class="user-status" id="userStatusBadge">
                <span class="status-free">FREE</span>
              </div>
            </div>
          </div>
          <p class="ai-intro__subtitle">Tu asistente inteligente de nutrición y salud</p>

          <div class="credits-info" id="creditsInfo">
            <div class="credits-display">
              <i class="fas fa-coins"></i>
              <span id="currentCredits">Cargando...</span>
              <span class="credits-label">créditos disponibles</span>
            </div>
          </div>

          <button class="cta-button ai-start-chat" id="startChatBtn">
            <i class="fas fa-comments"></i>
            Comenzar Consulta
          </button>

          <div class="quick-actions">
            <a href="#/suscripcion" class="btn-outline">
              <i class="fas fa-plus"></i>
              Comprar Créditos
            </a>
            <a href="#/nutrition" class="btn-secondary">
              <i class="fas fa-search"></i>
              Buscar Frutas
            </a>
          </div>
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
  <section class="fruvi-chatgpt medical-chat" id="chatSection" style="display: none;">
    <header class="fruvi-chatgpt__header medical-header">
      <div class="container fruvi-chatgpt__header__inner">
        <div class="brand medical-brand">
          <div class="dr-ai-logo-small">
            <i class="fas fa-brain"></i>
          </div>
          <div class="doctor-info">
            <span class="doctor-name">Dr. Nutricionista IA</span>
            <span class="doctor-title">Asistente Inteligente de Salud</span>
          </div>
        </div>
        <div class="chat-status" id="chatStatus">
          <div class="credits-indicator">
            <i class="fas fa-coins"></i>
            <span id="chatCredits">Cargando...</span>
          </div>
        </div>
        <button class="btn-secondary back-to-intro" id="backToIntroBtn">
          <i class="fas fa-arrow-left"></i>
          Volver
        </button>
      </div>
    </header>
    <main class="fruvi-chatgpt__main">
      <div class="container fruvi-chatgpt__scroll" id="chatMessages" aria-live="polite"></div>
    </main>
    <footer class="fruvi-chatgpt__input medical-input">
      <div class="container">
        <form id="chatForm" class="fruvi-chatgpt__form" autocomplete="off">
          <textarea id="userInput" rows="1" placeholder="Describe tus síntomas, objetivos de salud o preguntas médicas nutricionales..." aria-label="Escribe tu consulta médica"></textarea>
          <div class="fruvi-chatgpt__actions">
            <button type="submit" class="btn-primary fruvi-send-btn medical-send-btn" id="sendBtn" title="Enviar consulta">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
        <div class="credits-disclaimer">
          <div class="disclaimer-item">
            <i class="fas fa-coins"></i>
            <span id="creditCostDisplay">Consulta básica: 1 crédito</span>
          </div>
          <div class="disclaimer-item">
            <i class="fas fa-brain"></i>
            <span>IA especializada en nutrición</span>
          </div>
          <div class="disclaimer-item">
            <i class="fas fa-shield-alt"></i>
            <span>Información confidencial</span>
          </div>
        </div>
        <p class="fruvi-chatgpt__hint medical-hint">
          <i class="fas fa-info-circle"></i>
          Esta es información nutricional informativa. Para diagnósticos médicos, consulta a tu médico tratante.
        </p>
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

  // Load user status and credits on page load
  loadUserStatus();

  // Make loadUserStatus globally available for cross-page updates
  window.loadUserStatus = loadUserStatus;

  async function loadUserStatus() {
    try {
      const user = await window.getUser();
      const statusBadge = document.getElementById('userStatusBadge');
      const creditsInfo = document.getElementById('creditsInfo');
      const chatCredits = document.getElementById('chatCredits');

      if (user) {
        // Check premium access
        let isPremium = false;
        try {
          const { checkPremiumAccess } = await import('../services/subscriptionService.js');
          const access = await checkPremiumAccess(user.id);
          isPremium = access.hasAccess;
        } catch (e) {
          console.log('No se pudo verificar acceso premium');
        }

        // Update status badge
        if (statusBadge) {
          statusBadge.innerHTML = isPremium ?
            '<span class="status-premium"><i class="fas fa-crown"></i> PREMIUM</span>' :
            '<span class="status-free">FREE</span>';
        }

        // Load credits - initialize with 25 credits if first time
        let credits = await window.getCreditBalance();
        if (credits === 0) {
          // Initialize user with 25 credits on first access
          try {
            const { initializeUserCredits } = await import('../services/subscriptionService.js');
            await initializeUserCredits(user.id);
            credits = 25; // Set initial credits
            console.log('✅ Usuario inicializado con 25 créditos');
          } catch (e) {
            console.log('Error initializing credits:', e);
            credits = 0;
          }
        }

        if (creditsInfo) {
          document.getElementById('currentCredits').textContent = credits;
        }
        if (chatCredits) {
          chatCredits.textContent = credits;
        }
      } else {
        // Not logged in
        if (statusBadge) {
          statusBadge.innerHTML = '<span class="status-guest">VISITANTE</span>';
        }
        if (creditsInfo) {
          creditsInfo.style.display = 'none';
        }
        if (chatCredits) {
          chatCredits.textContent = '0';
        }
      }
    } catch (e) {
      console.log('Error loading user status:', e);
    }
  }

  // Handle start chat
  startChatBtn.addEventListener('click', async () => {
    root.querySelector('.ai-assistant-intro').style.display = 'none';
    chatSection.style.display = 'grid';

    // Update credits in chat header
    await loadUserStatus();

    // Personalized greeting based on user status and premium access
    let greeting = '¡Hola! Soy el Dr. Nutricionista IA 🤖. Puedo ayudarte con información general sobre nutrición y frutas.';

    try {
      const user = await window.getUser();
      if (user) {
        // Get full name from customers table
        let fullUserName = '';
        try {
          const { data: customer } = await supabaseClient
            .from('customers')
            .select('full_name')
            .eq('user_id', user.id)
            .single();
          fullUserName = customer?.full_name || user.email?.split('@')[0] || 'amigo';
        } catch (e) {
          fullUserName = user.email?.split('@')[0] || 'amigo';
        }

        // Check premium access
        let isPremium = false;
        try {
          const { checkPremiumAccess } = await import('../services/subscriptionService.js');
          const access = await checkPremiumAccess(user.id);
          isPremium = access.hasAccess;
        } catch (e) {
          console.log('No se pudo verificar acceso premium para saludo');
        }

        if (isPremium) {
          greeting = `¡Hola ${fullUserName}! 👨‍⚕️ Soy el <strong>Dr. Nutricionista IA</strong>, tu asistente premium de salud. Tengo acceso completo a funciones avanzadas y puedo ofrecerte consultas especializadas, planes nutricionales personalizados y seguimiento profesional. ¿Cómo te sientes hoy? ¿En qué puedo ayudarte con tu salud y nutrición?`;
        } else {
          const credits = await window.getCreditBalance();
          greeting = `¡Hola ${fullUserName}! 🤖 Soy el Dr. Nutricionista IA. Actualmente tienes <strong>${credits} créditos</strong> disponibles. Cada consulta cuesta entre 1-8 créditos según la complejidad. ¿Qué te gustaría consultar sobre nutrición y salud?`;

          // If user has 0 credits, show warning
          if (credits === 0) {
            greeting += `\n\n⚠️ **¡Atención!** No tienes créditos disponibles. Compra créditos para continuar consultando.`;
          }
        }
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
    let userName = '';
    let fullUserName = '';
    try {
      const user = await window.getUser();
      currentUserId = user?.id || null;
      userName = user?.email?.split('@')[0] || '';

      // Get full name from customers table
      if (currentUserId) {
        try {
          const { supabaseClient } = await import('../services/supabaseService.js');
          const { data: customer } = await supabaseClient
            .from('customers')
            .select('full_name')
            .eq('user_id', currentUserId)
            .single();
          fullUserName = customer?.full_name || userName;
        } catch (e) {
          console.log('No se pudo obtener nombre completo:', e.message);
          fullUserName = userName;
        }
      }
    } catch (e) {
      console.log('No se pudo obtener usuario actual:', e.message);
    }

    // Check credits for premium features
    if (currentUserId) {
      try {
        // Determine query type and credit cost
        let creditCost = 1; // Default basic query
        const userMessage = text.toLowerCase();

        if (userMessage.includes('análisis') || userMessage.includes('nutricional') || userMessage.includes('composición')) {
          creditCost = 3; // Nutrition analysis
        } else if (userMessage.includes('plan') || userMessage.includes('dieta') || userMessage.includes('alimentación')) {
          creditCost = 5; // Meal plan
        } else if (userMessage.includes('consulta') || userMessage.includes('médico') || userMessage.includes('diagnóstico')) {
          creditCost = 8; // Medical consultation
        }

        // Update credit cost display
        const costDisplay = document.getElementById('creditCostDisplay');
        if (costDisplay) {
          costDisplay.textContent = `Esta consulta cuesta: ${creditCost} crédito${creditCost > 1 ? 's' : ''}`;
        }

        // Check if user has unlimited credits (premium subscription)
        const { checkPremiumAccess } = await import('../services/subscriptionService.js');
        const access = await checkPremiumAccess(currentUserId);

        if (!access.hasAccess) {
          // Check credits balance
          const currentCredits = await window.getCreditBalance();

          if (currentCredits < creditCost) {
            appendMessage('assistant', `❌ **Créditos insuficientes**\n\nNecesitas ${creditCost} crédito${creditCost > 1 ? 's' : ''} para esta consulta, pero solo tienes ${currentCredits}.\n\n💳 **Compra más créditos** para continuar consultando al Dr. Nutricionista IA.\n\n[Ir a Comprar Créditos](#/suscripcion)`);
            input.value = '';
            autosize();
            return;
          }

          // Show credit cost before deduction
          appendMessage('assistant', `💰 **Costo de consulta:** ${creditCost} crédito${creditCost > 1 ? 's' : ''}\n\nProcesando pago...`);

          // Deduct credits from database
          try {
            const deducted = await window.deductCredits(creditCost, `Consulta IA: ${text.substring(0, 50)}...`);
            if (!deducted) {
              appendMessage('assistant', '❌ Error procesando el pago de créditos. Intenta nuevamente.');
              input.value = '';
              autosize();
              return;
            }
          } catch (deductError) {
            console.error('Error deducting credits:', deductError);
            appendMessage('assistant', '❌ Error procesando el pago de créditos. Intenta nuevamente.');
            input.value = '';
            autosize();
            return;
          }

          // Update credits display in real-time
          await loadUserStatus();
          // Also update credits in subscription page if it's open
          if (window.location.hash.includes('#/suscripcion')) {
            try {
              const subscriptionScript = document.querySelector('script[src*="subscription.js"]');
              if (subscriptionScript && window.loadCreditsBalance) {
                await window.loadCreditsBalance();
              }
            } catch (e) {
              console.log('Could not refresh subscription page credits');
            }
          }

          // Show credit deduction message
          const remainingCredits = currentCredits - creditCost;
          appendMessage('assistant', `✅ **Pago procesado:** ${creditCost} crédito${creditCost > 1 ? 's' : ''} deducido${creditCost > 1 ? 's' : ''}.\n\n💰 **Créditos restantes:** ${remainingCredits}`);
        } else {
          // Premium user - unlimited credits
          if (costDisplay) {
            costDisplay.innerHTML = '<i class="fas fa-infinity"></i> <strong>Créditos ilimitados</strong> (Premium)';
          }
        }
      } catch (e) {
        console.log('No se pudo verificar créditos:', e.message);
      }
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
      const reply = await chatCompletionWithDatabase(text, currentUserId, fullUserName);
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
    item.className = `fruvi-msg ${role === 'user' ? 'fruvi-msg--user medical-user' : 'fruvi-msg--assistant medical-assistant'} fade-in-up`;
    const icon = role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-user-md"></i>';
    const textHtml = renderSafeMarkdown(content);

    // Add action buttons for assistant messages - dynamic based on content
    let actionButtons = '';
    if (role === 'assistant') {
      const buttons = [];

      // Check if user is asking about prices - don't show cart buttons in that case
      const isAskingAboutPrices = content.toLowerCase().includes('precio') ||
                                  content.toLowerCase().includes('cuánto') ||
                                  content.toLowerCase().includes('costo') ||
                                  content.toLowerCase().includes('valor') ||
                                  content.toLowerCase().includes('pagar') ||
                                  content.toLowerCase().includes('cuanto') ||
                                  content.toLowerCase().includes('creditos') ||
                                  content.toLowerCase().includes('créditos') ||
                                  content.toLowerCase().includes('comprar');

      // Only show cart buttons if NOT asking about prices
      if (!isAskingAboutPrices) {
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

        // Always add view cart button (only if not asking about prices)
        buttons.push(`
          <button class="btn-sm btn-info chat-view-cart">
            <i class="fas fa-shopping-cart"></i> Ver Carrito
          </button>
        `);
      }

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
    tip.className = 'fruvi-msg fruvi-msg--assistant medical-assistant typing';
    tip.innerHTML = `
      <div class="fruvi-msg__avatar medical-avatar">
        <i class="fas fa-user-md"></i>
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div class="fruvi-msg__bubble medical-bubble">
        <div class="medical-typing">
          <span>Analizando tu consulta médica</span>
          <div class="loading-dots">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>
        </div>
      </div>
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
      existingItem.total = existingItem.price * existingItem.quantity;
    } else {
      chatCart.push({
        product: productName,
        price: price,
        quantity: qty,
        total: price * qty
      });
    }

    saveChatCart();

    // Personalized response based on cart size
    const totalItems = chatCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = chatCart.reduce((sum, item) => sum + item.total, 0);

    let response = `¡Perfecto! 🎉 Agregué ${qty} kg de ${productName} a tu carrito. `;

    if (totalItems >= 3) {
      response += `¡Qué rico pedido llevas! Ya tienes ${totalItems} kg de frutas frescas por $${totalValue.toLocaleString('es-CO')}. ¿Estás listo para confirmar tu pedido? ¡Aprovecha y cuida tu salud con frutas frescas! 🌱💚`;
    } else {
      response += `Ahora llevas ${totalItems} kg en total. ¿Te gustaría agregar algo más para completar tu pedido?`;
    }

    appendMessage('assistant', response);

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
  window.finalizeOrder = async function() {
    const total = chatCart.reduce((sum, item) => sum + item.total, 0);
    const orderText = chatCart.map(item =>
      `${item.quantity}kg ${item.product} - $${item.total.toLocaleString('es-CO')}`
    ).join('\n');

    const whatsappMessage = `¡Hola Fruvi! 🍎 Quiero hacer este pedido:\n\n${orderText}\n\n💰 Total: $${total.toLocaleString('es-CO')}\n\n🚚 ¿Me puedes ayudar con el envío? ¿Dónde te gustaría recibirlo?\n\n¡Gracias! 😊`;

    const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    // Get user name for personalized message
    let userName = '';
    try {
      const user = await window.getUser();
      if (user) {
        // Get full name from customers table
        try {
          const { supabaseClient } = await import('../services/supabaseService.js');
          const { data: customer } = await supabaseClient
            .from('customers')
            .select('full_name')
            .eq('user_id', user.id)
            .single();
          userName = customer?.full_name || user.email?.split('@')[0] || '';
        } catch (e) {
          userName = user.email?.split('@')[0] || '';
        }
      }
    } catch (e) {}

    const farewellMessage = userName
      ? `¡Perfecto ${userName}! 🚀 Te envié todo por WhatsApp para coordinar la entrega. ¡Gracias por elegir Fruvi para cuidar tu salud! 🌱💚`
      : '¡Perfecto! 🚀 Te envié todo por WhatsApp para coordinar la entrega. ¡Gracias por elegir Fruvi! 🌱💚';

    appendMessage('assistant', farewellMessage);

    // Clear cart after successful order
    chatCart = [];
    saveChatCart();
  };

  window.clearChatCart = function() {
    chatCart = [];
    saveChatCart();
    appendMessage('assistant', 'Carrito vaciado. ¿Qué más te gustaría comprar?');
  };
}

