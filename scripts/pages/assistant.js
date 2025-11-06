// Assistant Page (AI Chat powered by Groq) - Full-screen ChatGPT-like UI with Database Integration
import { chatCompletionWithHistory, chatCompletionWithDatabase } from '../services/groqService.js';
import { getUsersClient } from '../services/supabaseService.js';

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

          <!-- Pain Points Section -->
          <div class="pain-points">
            <div class="pain-point">
              <i class="fas fa-exclamation-triangle"></i>
              <span>¿Cansado de dietas que no funcionan?</span>
            </div>
            <div class="pain-point">
              <i class="fas fa-weight"></i>
              <span>¿Problemas con el peso y la salud?</span>
            </div>
            <div class="pain-point">
              <i class="fas fa-brain"></i>
              <span>¿Confundido con tanta información nutricional?</span>
            </div>
          </div>

          <!-- Solutions Section -->
          <div class="solutions">
            <h2>¡La Solución Está Aquí!</h2>
            <div class="solution-features">
              <div class="feature">
                <i class="fas fa-user-md"></i>
                <h3>Asesoramiento Profesional</h3>
                <p>Consultas personalizadas con IA especializada en nutrición</p>
              </div>
              <div class="feature">
                <i class="fas fa-apple-alt"></i>
                <h3>Planes Basados en Frutas</h3>
                <p>Recomendaciones fundamentadas en frutas frescas y naturales</p>
              </div>
              <div class="feature">
                <i class="fas fa-chart-line"></i>
                <h3>Seguimiento Continuo</h3>
                <p>Monitorea tu progreso y ajusta tu alimentación</p>
              </div>
            </div>
          </div>

          <div class="credits-info" id="creditsInfo">
            <div class="credits-display">
              <i class="fas fa-coins"></i>
              <span id="currentCredits">Cargando...</span>
              <span class="credits-label">créditos disponibles</span>
            </div>
          </div>

          <!-- Call to Action Buttons -->
          <div class="cta-section">
            <button class="cta-button ai-start-chat primary-cta" id="startChatBtn">
              <i class="fas fa-comments"></i>
              ¡Comienza Tu Consulta Ahora!
            </button>

            <div class="secondary-ctas">
              <a href="#/suscripcion" class="btn-premium">
                <i class="fas fa-crown"></i>
                Obtener Premium Ilimitado
              </a>
              <a href="#/nutrition" class="btn-explore">
                <i class="fas fa-search"></i>
                Explorar Frutas
              </a>
            </div>
          </div>

          <!-- Social Proof -->
          <div class="social-proof">
            <div class="trust-indicators">
              <div class="trust-item">
                <i class="fas fa-shield-alt"></i>
                <span>Información Confidencial</span>
              </div>
              <div class="trust-item">
                <i class="fas fa-brain"></i>
                <span>IA Especializada</span>
              </div>
              <div class="trust-item">
                <i class="fas fa-heart"></i>
                <span>Enfoque en Salud</span>
              </div>
            </div>
          </div>
        </div>

        <div class="ai-intro__visual">
          <!-- Icono eliminado según solicitud del usuario -->
        </div>
      </div>
    </div>
  </section>
      </div>
    </div>
  </section>

  <!-- Chat Interface (hidden initially) -->
  <section class="fruvi-chatgpt medical-chat" id="chatSection" style="display: none;">
    <main class="fruvi-chatgpt__main">
      <div class="container fruvi-chatgpt__scroll" id="chatMessages" aria-live="polite"></div>
    </main>

    <footer class="fruvi-chatgpt__input medical-input">
      <!-- Credits Progress Bar -->
      <div class="credits-progress-section" id="creditsProgressSection">
        <div class="container">
          <div class="credits-progress-container">
            <div class="credits-progress-bar">
              <div class="progress-fill" id="progressFill"></div>
            </div>
            <div class="credits-progress-info">
              <span class="credits-current" id="progressCurrentCredits">0</span>
              <span class="credits-separator">/</span>
              <span class="credits-total" id="progressTotalCredits">25</span>
              <span class="credits-label">créditos</span>
            </div>
          </div>
        </div>
      </div>
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

  // Removed cart functionality - focus on medical consultation only

  // Load user status and credits on page load
  loadUserStatus();

  // Make loadUserStatus globally available for cross-page updates
  window.loadUserStatus = loadUserStatus;

  // AUTO-INITIALIZE credits for user when page loads
  // This ensures user is added to user_ai_credits table from first moment
  setTimeout(async () => {
    try {
      const user = await window.getUser();
      if (user && user.id) {
        console.log('🚀 Auto-inicializando créditos para usuario:', user.id);
        await initializeCreditsForNewUser();
      }
    } catch (e) {
      console.log('Error en auto-inicialización:', e);
    }
  }, 500); // Quick delay to ensure page is ready

  // Add credits update animation function
  function animateCreditsUpdate() {
    const creditsEl = document.getElementById('chatCredits');
    if (creditsEl) {
      creditsEl.classList.add('credits-update-animation');
      setTimeout(() => creditsEl.classList.remove('credits-update-animation'), 800);
    }
  }

  // Update credits progress bar
  function updateCreditsProgress(currentCredits, totalCredits = 25) {
    const progressFill = document.getElementById('progressFill');
    const currentEl = document.getElementById('progressCurrentCredits');
    const totalEl = document.getElementById('progressTotalCredits');

    if (progressFill && currentEl && totalEl) {
      // Calculate percentage (bar fills completely when user recharges)
      const percentage = Math.min((currentCredits / totalCredits) * 100, 100);
      progressFill.style.width = `${percentage}%`;

      // Update text
      currentEl.textContent = currentCredits;
      totalEl.textContent = totalCredits;
    }
  }

  // Make animation function globally available
  window.animateCreditsUpdate = animateCreditsUpdate;
  window.updateCreditsProgress = updateCreditsProgress;

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

        // Load credits - always get from database (no local initialization)
        let credits = await window.getCreditBalance(user.id);
        console.log(`💰 Créditos actuales en BD para usuario ${user.id}: ${credits}`);

        // If still 0, try to initialize once
        if (credits === 0) {
          console.log('🔄 Intentando inicializar créditos para usuario nuevo...');
          try {
            const { initializeUserCredits } = await import('../services/subscriptionService.js');
            await initializeUserCredits(user.id);
            credits = await window.getCreditBalance(); // Re-check after initialization
            console.log(`✅ Créditos inicializados: ${credits}`);
          } catch (e) {
            console.log('Error initializing credits:', e);
            credits = 0;
          }
        }

        // Force refresh credits display after loading
        if (creditsInfo) {
          document.getElementById('currentCredits').textContent = credits;
        }
        if (chatCredits) {
          chatCredits.textContent = credits;
          // Animate credits update
          animateCreditsUpdate();
        }

        // Update progress bar
        updateCreditsProgress(credits);

        // Load and display credits used
        try {
          const { getCreditStats } = await import('../services/subscriptionService.js');
          const stats = await getCreditStats(user.id);
          const creditsUsed = stats.total_credits_spent || 0;
          const creditsUsedEl = document.getElementById('creditsUsed');
          if (creditsUsedEl) {
            creditsUsedEl.textContent = creditsUsed;
          }
        } catch (e) {
          console.log('No se pudieron cargar estadísticas de créditos:', e);
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

  async function initializeCreditsForNewUser() {
    try {
      const user = await window.getUser();
      if (user && user.id) {
        // Always check database credits
        const currentCredits = await window.getCreditBalance(user.id);
        console.log(`🔍 Créditos actuales en BD para ${user.id}: ${currentCredits}`);

        if (currentCredits === 0) {
          console.log('🔄 Inicializando créditos para nuevo usuario...');
          try {
            const { initializeUserCredits } = await import('../services/subscriptionService.js');
            await initializeUserCredits(user.id);
            const newCredits = await window.getCreditBalance(user.id);
            console.log(`✅ Créditos inicializados: ${newCredits}`);
            // Reload status to show updated credits
            await loadUserStatus();
            // Animate credits update
            animateCreditsUpdate();
            // Update progress bar
            const updatedCredits = await window.getCreditBalance(user.id);
            updateCreditsProgress(updatedCredits);
          } catch (e) {
            console.error('❌ Error inicializando créditos:', e);
          }
        }
      } else {
        console.log('⚠️ Usuario no disponible para inicialización de créditos');
      }
    } catch (e) {
      console.log('Error checking user credits initialization:', e);
    }
  }

  // Handle start chat
  startChatBtn.addEventListener('click', async () => {
    root.querySelector('.ai-assistant-intro').style.display = 'none';
    chatSection.style.display = 'grid';

    // Update credits in chat header
    await loadUserStatus();
    // Animate credits update
    animateCreditsUpdate();

    // Personalized greeting based on user status and premium access
    let greeting = '¡Hola! Soy el Dr. Nutricionista IA 🤖. Puedo ayudarte con información general sobre nutrición y frutas.';

    try {
      const user = await window.getUser();
      if (user) {
        // Get full name from customers table
        let fullUserName = '';
        try {
          const supabaseClient = getUsersClient();
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
          const credits = await window.getCreditBalance(user.id);
          greeting = `¡Hola ${fullUserName}! Soy el Dr. Nutricionista IA, tu asistente de salud inteligente. ¿En qué puedo ayudarte hoy?`;

          // If user has 0 credits, show warning
          if (credits === 0) {
            greeting += `\n\n⚠️ Créditos insuficientes. Compra más créditos para continuar consultando.`;
          }
        }
      }
    } catch (e) {
      console.log('No se pudo obtener información del usuario para saludo personalizado');
    }

    // Initial greeting
    setTimeout(() => appendMessage('assistant', greeting), 300);
  });

  // Handle back to intro (removed - no back button in current design)

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
          const { getUsersClient } = await import('../services/supabaseService.js');
          const supabaseClient = getUsersClient();
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
          // Check credits balance - ALWAYS get fresh from database
          const currentCredits = await window.getCreditBalance(currentUserId);
          console.log(`💰 Verificando créditos para consulta: ${currentCredits} disponibles, costo: ${creditCost}`);

          if (currentCredits < creditCost) {
            appendMessage('assistant', `❌ Créditos insuficientes. Necesitas ${creditCost} crédito${creditCost > 1 ? 's' : ''} para esta consulta.\n\n💳 Compra más créditos para continuar.`);
            input.value = '';
            autosize();
            return;
          }

          // No verbose messages - just process silently

          // Deduct credits from database
          try {
            const deducted = await window.deductCredits(currentUserId, creditCost, `Consulta IA: ${text.substring(0, 50)}...`);
            if (!deducted) {
              appendMessage('assistant', '❌ Error procesando el pago de créditos. Intenta nuevamente.');
              input.value = '';
              autosize();
              return;
            }
            console.log(`✅ Créditos deducidos: ${creditCost}, usuario: ${currentUserId}`);
          } catch (deductError) {
            console.error('Error deducting credits:', deductError);
            appendMessage('assistant', '❌ Error procesando el pago de créditos. Intenta nuevamente.');
            input.value = '';
            autosize();
            return;
          }

          // Update credits display in real-time
          await loadUserStatus();

          // Animate credits update
          animateCreditsUpdate();

          // Update progress bar
          const currentCreditsAfter = await window.getCreditBalance(currentUserId);
          updateCreditsProgress(currentCreditsAfter);

          // Show credit deduction message (without verbose text)
          const remainingCredits = await window.getCreditBalance(currentUserId);
          appendMessage('assistant', `✅ Consulta procesada - ${remainingCredits} créditos restantes`);
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
      // No product loading needed - focus on medical consultation

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

    // No action buttons for assistant messages - keep it clean for doctor responses
    let actionButtons = '';

    item.innerHTML = `
      <div class="fruvi-msg__avatar">${icon}</div>
      <div class="fruvi-msg__bubble">${textHtml}${actionButtons}</div>
    `;

    messagesEl.appendChild(item);
    messagesEl.scrollTop = messagesEl.scrollHeight;

      // No action buttons to handle - clean medical interface
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
  // Removed all cart functionality - focus purely on medical consultation
}

