// DR. LARA - Nutricionista IA Premium con Base de Conocimiento Completa
import { chatCompletionWithHistory } from '../services/groqService.js';
import { getUsersClient } from '../services/supabaseService.js';

export function renderDrLaraPage(root) {
  // Full page chat layout con introducción profesional
  root.innerHTML = `
  <!-- Dr. Lara Introduction -->
  <section class="dr-lara-intro">
    <div class="container">
      <div class="dr-lara-intro__content">
        <div class="dr-lara-intro__text">
          <div class="dr-lara-header">
            <div class="dr-lara-logo">
              <i class="fas fa-user-md"></i>
            </div>
            <div class="dr-lara-info">
              <h1 class="dr-lara-title">Dra. Lara IA</h1>
              <p class="dr-lara-specialty">Nutricionista Especializada en Frutas Premium</p>
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
              <i class="fas fa-question-circle"></i>
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
                <p>Consultas personalizadas con IA especializada en nutrición premium</p>
              </div>
              <div class="feature">
                <i class="fas fa-apple-alt"></i>
                <h3>Frutas Premium Colombianas</h3>
                <p>Recomendaciones con productos reales de Fruvi</p>
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
            <button class="cta-button dr-lara-start-chat primary-cta" id="startChatBtn">
              <i class="fas fa-comments"></i>
              ¡Comienza Tu Consulta Gratis!
            </button>

            <div class="secondary-ctas">
              <a href="#/suscripcion" class="btn-premium">
                <i class="fas fa-crown"></i>
                Obtener Premium Ilimitado
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

        <!-- Visual Profesional -->
        <div class="dr-lara-intro__visual">
          <div class="dr-lara-media">
            <video 
              class="dr-lara-video" 
              autoplay 
              loop 
              muted 
              playsinline
              poster="/images/dr-lara-poster.jpg"
            >
              <source src="/video/dra-lara-intro.mp4" type="video/mp4">
              <source src="/video/dra-lara-intro.webm" type="video/webm">
              <!-- Fallback para navegadores sin soporte de video -->
              <img src="/images/dr-lara-avatar.png" alt="Dra. Lara" class="dr-lara-image">
            </video>
            <div class="media-badge">
              <i class="fas fa-user-md"></i> Experta en Nutrición
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Chat Interface (hidden initially) -->
  <section class="dr-lara-chatgpt medical-chat" id="chatSection" style="display: none;">
    <main class="dr-lara-chatgpt__main">
      <div class="container dr-lara-chatgpt__scroll" id="chatMessages" aria-live="polite"></div>
    </main>

    <footer class="dr-lara-chatgpt__input medical-input">
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
        <form id="chatForm" class="dr-lara-chatgpt__form" autocomplete="off">
          <textarea id="userInput" rows="1" placeholder="Describe tus objetivos de salud, preguntas sobre nutrición o frutas premium..." aria-label="Escribe tu consulta"></textarea>
          <div class="dr-lara-chatgpt__actions">
            <button type="submit" class="btn-primary dr-lara-send-btn medical-send-btn" id="sendBtn" title="Enviar consulta">
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
            <span>IA especializada en nutrición premium</span>
          </div>
          <div class="disclaimer-item">
            <i class="fas fa-shield-alt"></i>
            <span>Información confidencial</span>
          </div>
        </div>
        <p class="dr-lara-chatgpt__hint medical-hint">
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

  // Load user status and credits on page load
  loadUserStatus();

  // Make loadUserStatus globally available for cross-page updates
  window.loadUserStatus = loadUserStatus;

  // AUTO-INITIALIZE credits for user when page loads
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
  }, 500);

  // Add credits update animation function
  function animateCreditsUpdate() {
    const creditsEl = document.getElementById('currentCredits');
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
      const percentage = Math.min((currentCredits / totalCredits) * 100, 100);
      progressFill.style.width = `${percentage}%`;
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

        // Load credits
        let credits = await window.getCreditBalance(user.id);
        console.log(`💰 Créditos actuales en BD para usuario ${user.id}: ${credits}`);

        if (credits === 0) {
          console.log('🔄 Intentando inicializar créditos para usuario nuevo...');
          try {
            const { initializeUserCredits } = await import('../services/subscriptionService.js');
            await initializeUserCredits(user.id);
            credits = await window.getCreditBalance();
            console.log(`✅ Créditos inicializados: ${credits}`);
          } catch (e) {
            console.log('Error initializing credits:', e);
            credits = 0;
          }
        }

        // Update credits display
        if (creditsInfo) {
          document.getElementById('currentCredits').textContent = credits;
        }

        // Animate credits update
        animateCreditsUpdate();

        // Update progress bar
        updateCreditsProgress(credits);
      } else {
        // Not logged in
        if (statusBadge) {
          statusBadge.innerHTML = '<span class="status-guest">VISITANTE</span>';
        }
        if (creditsInfo) {
          creditsInfo.style.display = 'none';
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
        const currentCredits = await window.getCreditBalance(user.id);
        console.log(`🔍 Créditos actuales en BD para ${user.id}: ${currentCredits}`);

        if (currentCredits === 0) {
          console.log('🔄 Inicializando créditos para nuevo usuario...');
          try {
            const { initializeUserCredits } = await import('../services/subscriptionService.js');
            await initializeUserCredits(user.id);
            const newCredits = await window.getCreditBalance(user.id);
            console.log(`✅ Créditos inicializados: ${newCredits}`);
            await loadUserStatus();
            animateCreditsUpdate();
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
    root.querySelector('.dr-lara-intro').style.display = 'none';
    chatSection.style.display = 'grid';

    await loadUserStatus();
    animateCreditsUpdate();

    // Personalized greeting with knowledge base
    let greeting = await getPersonalizedGreeting();
    setTimeout(() => appendMessage('assistant', greeting), 300);
  });

  // Get personalized greeting from knowledge base
  async function getPersonalizedGreeting() {
    let greeting = '¡Hola! Soy la Dra. Lara 🌿, tu nutricionista especializada en frutas premium colombianas.';

    try {
      const user = await window.getUser();
      if (user) {
        // Get full name
        let fullUserName = '';
        try {
          const supabaseClient = getUsersClient();
          const { data: customer } = await supabaseClient
            .from('customers')
            .select('full_name')
            .eq('user_id', user.id)
            .single();
          fullUserName = customer?.full_name || user.email?.split('@')[0] || 'amigo/a';
        } catch (e) {
          fullUserName = user.email?.split('@')[0] || 'amigo/a';
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

        // Load company knowledge for greeting
        let companyInfo = '';
        try {
          const supabaseClient = getUsersClient();
          const { data: knowledge } = await supabaseClient
            .from('company_knowledge')
            .select('content')
            .eq('category', 'quienes_somos')
            .single();
          
          if (knowledge && knowledge.content) {
            const shortIntro = knowledge.content.substring(0, 200) + '...';
            companyInfo = `\n\n${shortIntro}`;
          }
        } catch (e) {
          console.log('No se pudo cargar conocimiento de empresa:', e);
        }

        if (isPremium) {
          greeting = `¡Hola ${fullUserName}! 👩‍⚕️✨\n\nSoy la <strong>Dra. Lara</strong>, tu nutricionista personal premium. Tengo acceso completo a:\n\n✅ Base de conocimiento especializada en frutas colombianas\n✅ Consultas ilimitadas sin restricciones\n✅ Planes nutricionales personalizados\n✅ Recomendaciones con productos reales de Fruvi\n\n¿Cómo puedo ayudarte hoy con tu salud y nutrición?${companyInfo}`;
        } else {
          const credits = await window.getCreditBalance(user.id);
          greeting = `¡Hola ${fullUserName}! 👩‍⚕️\n\nSoy la <strong>Dra. Lara</strong>, tu nutricionista especializada en frutas premium colombianas. Puedo ayudarte con:\n\n🍎 Recomendaciones nutricionales personalizadas\n🥑 Beneficios de frutas premium\n🌿 Planes alimenticios con productos Fruvi\n📊 Análisis nutricional básico\n\nTienes <strong>${credits} créditos</strong> disponibles. Cada consulta básica cuesta 1 crédito.\n\n💎 Con la membresía Premium obtienes consultas ilimitadas + descuentos permanentes.\n\n¿En qué puedo ayudarte?${companyInfo}`;

          if (credits === 0) {
            greeting += `\n\n⚠️ <strong>Sin créditos disponibles</strong>. Adquiere más créditos o activa la membresía Premium para continuar.`;
          }
        }
      }
    } catch (e) {
      console.log('No se pudo obtener información del usuario para saludo personalizado');
    }

    return greeting;
  }

  // Autosize textarea
  input.addEventListener('input', autosize);
  function autosize() {
    input.style.height = 'auto';
    const max = 180;
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

      if (currentUserId) {
        try {
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
          // Check credits balance
          const currentCredits = await window.getCreditBalance(currentUserId);
          console.log(`💰 Verificando créditos para consulta: ${currentCredits} disponibles, costo: ${creditCost}`);

          if (currentCredits < creditCost) {
            appendMessage('assistant', `❌ Créditos insuficientes. Necesitas ${creditCost} crédito${creditCost > 1 ? 's' : ''} para esta consulta.\n\n💳 Adquiere más créditos o activa la membresía Premium para consultas ilimitadas.`);
            input.value = '';
            autosize();
            return;
          }

          // Deduct credits from database
          try {
            const deducted = await window.deductCredits(currentUserId, creditCost, `Consulta Dra. Lara: ${text.substring(0, 50)}...`);
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
          animateCreditsUpdate();
          const currentCreditsAfter = await window.getCreditBalance(currentUserId);
          updateCreditsProgress(currentCreditsAfter);

          // Show credit deduction message
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
      // Use enhanced completion with full knowledge base
      const reply = await chatCompletionWithDrLaraKnowledge(text, currentUserId, fullUserName);
      stopTyping();
      history.push({ role: 'assistant', content: reply });
      appendMessage('assistant', reply);
    } catch (err) {
      console.error('Error con Dra. Lara:', err);
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

  // Enhanced chat completion with full knowledge base integration
  async function chatCompletionWithDrLaraKnowledge(userMessage, userId = null, userName = '') {
    try {
      const supabaseClient = getUsersClient();
      
      // 1. Load company knowledge
      let companyKnowledge = '';
      try {
        const { data: knowledge } = await supabaseClient
          .from('company_knowledge')
          .select('category, content')
          .limit(10);
        
        if (knowledge && knowledge.length > 0) {
          companyKnowledge = '\n\n📚 CONOCIMIENTO DE LA EMPRESA FRUVI:\n' +
            knowledge.map(k => `[${k.category.toUpperCase()}]: ${k.content.substring(0, 300)}...`).join('\n');
        }
      } catch (e) {
        console.log('No se pudo cargar company_knowledge:', e);
      }

      // 2. Load AI knowledge base (priority topics)
      let aiKnowledge = '';
      try {
        const { data: knowledge } = await supabaseClient
          .from('ai_knowledge_base')
          .select('topic, content, priority, tags')
          .eq('is_active', true)
          .order('priority', { ascending: false })
          .limit(10);
        
        if (knowledge && knowledge.length > 0) {
          aiKnowledge = '\n\n🧠 BASE DE CONOCIMIENTO PREMIUM:\n' +
            knowledge.map(k => `[Prioridad ${k.priority}] ${k.topic}: ${k.content.substring(0, 250)}...`).join('\n\n');
        }
      } catch (e) {
        console.log('No se pudo cargar ai_knowledge_base:', e);
      }

      // 3. Load forbidden responses for filtering
      let forbiddenPhrases = [];
      try {
        const { data: forbidden } = await supabaseClient
          .from('ai_forbidden_responses')
          .select('forbidden_phrase, severity')
          .eq('is_active', true);
        
        if (forbidden && forbidden.length > 0) {
          forbiddenPhrases = forbidden.map(f => f.forbidden_phrase);
        }
      } catch (e) {
        console.log('No se pudo cargar forbidden_responses:', e);
      }

      // 4. Check premium access
      let isPremium = false;
      try {
        const { checkPremiumAccess } = await import('../services/subscriptionService.js');
        const access = await checkPremiumAccess(userId);
        isPremium = access.hasAccess;
      } catch (e) {
        console.log('No se pudo verificar acceso premium');
      }

      // 5. Build enhanced system prompt
      const systemPrompt = `Eres la Dra. Lara 👩‍⚕️, nutricionista especializada en frutas premium colombianas de Fruvi.

🎯 TU IDENTIDAD:
- Médica nutricionista graduada de Harvard, 15 años de experiencia
- Especialista en alimentación funcional con frutas tropicales
- Personalidad: profesional, empática, cercana, motivadora
- Comunicación: clara, precisa, evitando jerga médica innecesaria

${companyKnowledge}

${aiKnowledge}

🚫 FRASES PROHIBIDAS (NUNCA USAR):
${forbiddenPhrases.map(phrase => `- "${phrase}"`).join('\n')}

💎 ESTADO DEL USUARIO:
- Usuario: ${userName || 'Invitado'}
- Plan: ${isPremium ? 'PREMIUM (consultas ilimitadas)' : 'FREE (créditos limitados)'}

📋 PROTOCOLO DE CONSULTA:
1. Saludar cálidamente y confirmar entendimiento de la consulta
2. Usar conocimiento de Fruvi y base de datos para respuestas precisas
3. Recomendar productos REALES de Fruvi cuando sea relevante (aguacate Hass, mangostino, pitahaya, etc.)
4. Incluir precios reales de los productos mencionados
5. Dar consejos prácticos, recetas, tips de conservación
6. Si es usuario FREE y pregunta algo complejo, sugerir amablemente upgrade a Premium
7. NUNCA usar frases prohibidas
8. Mantener tono premium, marca de lujo, excelencia

🎨 ESTILO DE RESPUESTA:
- Profesional pero cercano
- Usar emojis con moderación (🍎🥑✨💚)
- Estructurar con listas, negritas, espacios
- Mencionar beneficios científicos respaldados
- Incluir llamados a acción sutiles ("¿Te gustaría que te enviemos...?")

¿Entendido? Responde siempre como la Dra. Lara, experta en frutas premium colombianas.`;

      // 6. Call Groq with enhanced prompt
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ];

      // Import and call Groq service
      const { chatCompletionWithHistory } = await import('../services/groqService.js');
      const response = await chatCompletionWithHistory(messages);

      // 7. Filter forbidden phrases from response
      let filteredResponse = response;
      forbiddenPhrases.forEach(phrase => {
        const regex = new RegExp(phrase, 'gi');
        filteredResponse = filteredResponse.replace(regex, '');
      });

      // 8. Save conversation to database
      if (userId) {
        try {
          await supabaseClient
            .from('ai_doctor_conversations')
            .insert([
              {
                user_id: userId,
                session_id: `drlara_${userId}_${Date.now()}`,
                message_type: 'user',
                message_content: userMessage,
                is_premium: isPremium
              },
              {
                user_id: userId,
                session_id: `drlara_${userId}_${Date.now()}`,
                message_type: 'assistant',
                message_content: filteredResponse,
                is_premium: isPremium
              }
            ]);
        } catch (e) {
          console.log('No se pudo guardar conversación:', e);
        }
      }

      return filteredResponse;
    } catch (error) {
      console.error('Error en chatCompletionWithDrLaraKnowledge:', error);
      // Fallback to basic completion
      const { chatCompletionWithHistory } = await import('../services/groqService.js');
      return await chatCompletionWithHistory([{ role: 'user', content: userMessage }]);
    }
  }

  function appendMessage(role, content) {
    const item = document.createElement('div');
    item.className = `dr-lara-msg ${role === 'user' ? 'dr-lara-msg--user medical-user' : 'dr-lara-msg--assistant medical-assistant'} fade-in-up`;
    const icon = role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-user-md"></i>';
    const textHtml = renderSafeMarkdown(content);

    item.innerHTML = `
      <div class="dr-lara-msg__avatar">${icon}</div>
      <div class="dr-lara-msg__bubble">${textHtml}</div>
    `;

    messagesEl.appendChild(item);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const tip = document.createElement('div');
    tip.className = 'dr-lara-msg dr-lara-msg--assistant medical-assistant typing';
    tip.innerHTML = `
      <div class="dr-lara-msg__avatar medical-avatar">
        <i class="fas fa-user-md"></i>
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div class="dr-lara-msg__bubble medical-bubble">
        <div class="medical-typing">
          <span>Analizando tu consulta...</span>
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
    const escaped = escapeHtml(text);
    return escaped
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  function escapeHtml(s = '') {
    return s.replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }
}
