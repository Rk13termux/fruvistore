// DR. LARA - Nutricionista IA Premium con Base de Conocimiento Completa
import { chatCompletionWithHistory, chatCompletionWithDatabase } from '../services/groqService.js';
import { getCompanyKnowledge, getAIKnowledgeBase, getForbiddenResponses, getProductsClient } from '../services/supabaseService.js';

export function renderDrLaraPage(root) {
    // Cargar datos de la base de datos AI al iniciar el chat
    let companyKnowledge = [];
    let aiKnowledgeBase = [];
    let forbiddenResponses = [];
    let productsInfo = [];

    async function loadAIKnowledge() {
      try {
        companyKnowledge = await getCompanyKnowledge();
        aiKnowledgeBase = await getAIKnowledgeBase();
        forbiddenResponses = await getForbiddenResponses();
          // Load some key products from the products database for realtime info
          try {
            const productsClient = getProductsClient();
            const { data: products } = await productsClient
              .from('current_products')
              .select('id, name, category, priceKg, stock, organic')
              .order('featured', { ascending: false })
              .limit(8);
            productsInfo = products || [];
          } catch (e) {
            console.log('No se pudo cargar información de productos en loadAIKnowledge:', e?.message || e);
            productsInfo = [];
          }
        console.log('✅ Datos AI cargados:', { companyKnowledge, aiKnowledgeBase, forbiddenResponses });
      } catch (err) {
        console.error('❌ Error cargando datos AI:', err);
      }
    }

    // Llama a la carga de datos al iniciar la página
    loadAIKnowledge();
  // Chat tipo Grok: logo centrado, título Dr.Lara, input grande, fondo negro
  root.innerHTML = `
  <section class="dr-lara-grok-chat">
    <div class="dr-lara-grok-header" id="drLaraHeader">
      <img src="" alt="Dra. Lara" class="dr-lara-grok-logo" id="drLaraLogo">
      <h1 class="dr-lara-grok-title">Dr.Lara</h1>
    </div>
    <div class="dr-lara-grok-messages" id="chatMessages"></div>
    <div class="dr-lara-grok-inputbox">
      <form id="chatForm" class="dr-lara-grok-form" autocomplete="off">
        <textarea id="userInput" rows="1" placeholder="¿Qué quieres saber?" aria-label="Escribe tu consulta"></textarea>
        <button type="submit" class="dr-lara-grok-send-btn" id="sendBtn" title="Enviar consulta" aria-label="Enviar consulta">
          <i class="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
    <div class="dr-lara-grok-actions">
      <button class="dr-lara-grok-action-btn" data-question="¿Cuáles son los mejores alimentos para bajar de peso de forma saludable?">¿Alimentos para bajar de peso?</button>
      <button class="dr-lara-grok-action-btn" data-question="¿Qué frutas colombianas tienen más antioxidantes y beneficios para la salud?">¿Frutas antioxidantes?</button>
      <button class="dr-lara-grok-action-btn" data-question="¿Cómo puedo mejorar mi digestión con la alimentación diaria?">¿Mejorar digestión?</button>
      <button class="dr-lara-grok-action-btn" data-question="¿Qué desayuno recomienda una nutricionista para tener energía todo el día?">¿Desayuno saludable?</button>
      <button class="dr-lara-grok-action-btn" data-question="¿Cuántas veces al día debo comer para mantener un peso saludable?">¿Frecuencia de comidas?</button>
    </div>
  </section>
  `;

  // Conversation history
  const history = [];
  const messagesEl = root.querySelector('#chatMessages');
  const form = root.querySelector('#chatForm');
  const input = root.querySelector('#userInput');
  const faqBtns = root.querySelectorAll('.dr-lara-grok-action-btn');
  const startChatBtn = root.querySelector('#startChatBtn');
  const chatSection = root.querySelector('#chatSection') || root.querySelector('.dr-lara-grok-chat');

  // Graceful logo loader with fallback sequence
  (function loadDrLaraLogo() {
    const logoEl = root.querySelector('.dr-lara-grok-logo');
    if (!logoEl) return;
    const candidates = [
      '/public/logolara.png',
      '/public/logo.png',
      '/public/logolara.png',
      'public/logolara.png',
      './public/logolara.png',
      '/images/logolara.png',
      '/images/logo.png',
      './logolara.png',
      'logolara.png',
      '/logolara.png',
      '/logo.png',
      '/assets/logolara.png',
      'assets/logolara.png'
    ];
    let idx = 0;
    function tryNext() {
      if (idx >= candidates.length) return;
      const src = candidates[idx++];
      const test = new Image();
      test.onload = () => { logoEl.src = src; };
      test.onerror = () => { tryNext(); };
      test.src = src;
    }
    tryNext();
  })();

  // Animación tipo Grok para respuestas
  function showAnimatedResponse(text, { replaceNode = null } = {}) {
    // Append an animated response bubble, or replace a given node if needed
    const msgDiv = document.createElement('div');
    msgDiv.className = 'dr-lara-grok-response';
    if (replaceNode && replaceNode.parentNode) {
      replaceNode.parentNode.replaceChild(msgDiv, replaceNode);
    } else {
      messagesEl.appendChild(msgDiv);
    }
    messagesEl.scrollTop = messagesEl.scrollHeight;
    let i = 0;
    // Ocultar header al responder y ajustar layout para que el chat se muestre desde arriba
    const header = document.getElementById('drLaraHeader');
    if (header) header.style.display = 'none';
    const chatWrap = document.querySelector('.dr-lara-grok-chat');
    if (chatWrap) chatWrap.style.justifyContent = 'flex-start';
    function typeChar() {
      if (i <= text.length) {
        msgDiv.innerHTML = text.slice(0, i) + '<span class="dr-lara-grok-cursor">|</span>';
        i++;
        setTimeout(typeChar, 12 + Math.random() * 30);
      } else {
        // Convert markdown to HTML after the typing animation finishes and add styling
        msgDiv.innerHTML = renderSafeMarkdown(text);
        msgDiv.classList.add('dr-lara-response-html');
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    }
    typeChar();
    return msgDiv;
  }

  // Enviar pregunta frecuente al chat
  faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.getAttribute('data-question');
      input.value = question;
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    });
  });

  // Manejar envío de pregunta
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    input.value = '';
    const loadingBubble = showAnimatedResponse('Pensando...');
    try {
      // Llamada real a Groq/Dr.Lara (solo historial y pregunta)
      const response = await chatCompletionWithHistory([
        ...history,
        { role: 'user', content: question }
      ]);
      // Añadir pregunta y respuesta al historial
      history.push({ role: 'user', content: question });
      history.push({ role: 'assistant', content: response });
      // Replace the loading bubble with the final response
      showAnimatedResponse(response, { replaceNode: loadingBubble });
      // Hide predefined questions after first response
      const actions = document.querySelector('.dr-lara-grok-actions');
      if (actions) actions.style.display = 'none';
    } catch (err) {
      showAnimatedResponse('Error al obtener respuesta. Intenta de nuevo.');
    }
  });

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

  // Handle start chat (guarded - not all variants contain a start button)
  if (startChatBtn) {
    startChatBtn.addEventListener('click', async () => {
    root.querySelector('.dr-lara-intro').style.display = 'none';
    if (chatSection) chatSection.style.display = 'grid';

    await loadUserStatus();
    animateCreditsUpdate();

    // Personalized greeting with knowledge base
    let greeting = await getPersonalizedGreeting();
    setTimeout(() => appendMessage('assistant', greeting), 300);
    });
  }

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

        // Load a few products for the greeting (realtime)
        let topProductsSummary = '';
        try {
          const prodClient = getProductsClient();
          const { data: topProducts } = await prodClient
            .from('current_products')
            .select('name, priceKg, stock, category')
            .order('featured', { ascending: false })
            .limit(4);
          if (topProducts && topProducts.length) {
            topProductsSummary = '\n\nProductos destacados: ' + topProducts.map(p => `${p.name} (${p.category}) - $${p.priceKg?.toLocaleString('es-CO') || 'N/A'}/kg`).join(', ');
          }
        } catch (e) {
          console.log('No se pudo cargar productos para saludo:', e?.message || e);
        }

        if (isPremium) {
          greeting = `¡Hola ${fullUserName}! 👩‍⚕️✨\n\nSoy la <strong>Dra. Lara</strong>, tu nutricionista personal premium. Tengo acceso completo a:\n\n✅ Base de conocimiento especializada en frutas colombianas\n✅ Consultas ilimitadas sin restricciones\n✅ Planes nutricionales personalizados\n✅ Recomendaciones con productos reales de Fruvi\n\n¿Cómo puedo ayudarte hoy con tu salud y nutrición?${companyInfo}${topProductsSummary}`;
        } else {
          const credits = await window.getCreditBalance(user.id);
          greeting = `¡Hola ${fullUserName}! 👩‍⚕️\n\nSoy la <strong>Dra. Lara</strong>, tu nutricionista especializada en frutas premium colombianas. Puedo ayudarte con:\n\n🍎 Recomendaciones nutricionales personalizadas\n🥑 Beneficios de frutas premium\n🌿 Planes alimenticios con productos Fruvi\n📊 Análisis nutricional básico\n\nTienes <strong>${credits} créditos</strong> disponibles. Cada consulta básica cuesta 1 crédito.\n\n💎 Con la membresía Premium obtienes consultas ilimitadas + descuentos permanentes.\n\n¿En qué puedo ayudarte?${companyInfo}${topProductsSummary}`;

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
    // Use enhanced completion with database integration (includes products, knowledge base, medical info)
    const reply = await chatCompletionWithDatabase(text, currentUserId, fullUserName);
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

      // 5. Include a short selection of products so the assistant can recommend real items
      let productSnippet = '';
      try {
        const productsClient = getProductsClient();
        const { data: products } = await productsClient
          .from('current_products')
          .select('name, category, priceKg, stock, organic')
          .order('featured', { ascending: false })
          .limit(6);
        if (products && products.length > 0) {
          productSnippet = '\n\n🛒 PRODUCTOS DESTACADOS (actuales):\n' + products.map(p => `- ${p.name} (${p.category}) — $${p.priceKg?.toLocaleString('es-CO') || 'N/A'}/kg — Stock: ${p.stock || 'Disponible'} ${p.organic ? '• Orgánico' : ''}`).join('\n');
        }
      } catch (e) {
        console.log('No se pudo cargar productos para el prompt:', e?.message || e);
      }

      // 6. Build enhanced system prompt
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

${productSnippet}
\n🎨 ESTILO DE RESPUESTA:
- Profesional pero cercano
- Usar emojis con moderación (🍎🥑✨💚)
- Estructurar con listas, negritas, espacios
- Mencionar beneficios científicos respaldados
- Incluir llamados a acción sutiles ("¿Te gustaría que te enviemos...?")
 - Evita usar tablas Markdown con '|' (pipes) o filas separadoras; usa listas o tarjetas para datos tabulares
 - Usa emojis de forma moderada y relevante (ej. 🍎🥑✨)

¿Entendido? Responde siempre como la Dra. Lara, experta en frutas premium colombianas.
IMPORTANTE: Responde en **Markdown** que contenga encabezados, listas, y tarjetas de producto cuando recomiendes productos (usa formato de lista con precios). Evita html con scripts. Nosotros convertiremos Markdown a HTML para mostrarlo bonito en la UI.`;

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
    // Enhance any CTA anchors inside the message bubble to be keyboard accessible
    const ctas = item.querySelectorAll('.ai-cta');
    ctas.forEach(a => {
      try {
        if (!a.hasAttribute('role')) a.setAttribute('role', 'button');
        if (!a.hasAttribute('tabindex')) a.setAttribute('tabindex', '0');
        if (!a.hasAttribute('aria-label')) a.setAttribute('aria-label', a.textContent.trim());
        // Allow Enter/Space to activate the anchor as a button
        a.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); a.click(); }
        });
      } catch (e) { /* defensive, ignore */ }
    });
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
    if (!text) return '';
    // Escape HTML special characters first
    let s = escapeHtml(String(text));

    // Convert Markdown tables (pipes) to professional bullet lists.
    // We remove pipe characters and the separator row (e.g. |----|) and turn each data row into a bullet list using the column headers.
    const tableLines = s.split('\n');
    let i = 0;
    let processed = [];
    while (i < tableLines.length) {
      const line = tableLines[i];
      const trimmed = line.trim();
      // detect header row starting and ending with |
      if (/^\|.*\|$/.test(trimmed)) {
        // Parse header cells
        const headerCells = trimmed.split('|').map(h => h.trim()).filter(h => h.length);
        // Check next line is a separator (|----| or | --- |)
        let j = i + 1;
        if (j < tableLines.length && /^\|[\s:-|]+\|$/.test(tableLines[j].trim())) {
          j++; // skip separator row
        }
        // Collect table rows
        const tableRows = [];
        while (j < tableLines.length && /^\|.*\|$/.test(tableLines[j].trim())) {
          const rowCells = tableLines[j].split('|').slice(1, -1).map(c => c.trim());
          tableRows.push(rowCells);
          j++;
        }
        // Convert each row into a bullet list item with header: value pairs
        tableRows.forEach(cells => {
          const pairs = headerCells.map((h, idx) => `${h}: ${cells[idx] ? cells[idx] : ''}`);
          processed.push('- ' + pairs.join(' — '));
        });
        // Skip the consumed lines
        i = j;
        continue;
      }
      processed.push(line);
      i++;
    }
    s = processed.join('\n');
    // Remove any leftover table separator lines (e.g. |----|) and convert remaining pipes to em-dashes
    s = s.replace(/^\s*\|[\s\S]*\|\s*$/gm, (m) => {
      // If a line contains at least two pipes and only dashes/spaces, remove it
      if (/^\s*\|[\s:-|]+\|\s*$/.test(m)) return '';
      // Otherwise, convert simple pipes to em-dashes
      return m.replace(/\s*\|\s*/g, ' — ');
    });

    // Links: [text](url)
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/gi, (m, t, url) => {
      const safeUrl = escapeHtml(url);
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${t}</a>`;
    });

    // Bold **text**
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic *text*
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Inline code `code`
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headings: ##
    s = s.replace(/^###\s*(.+)$/gim, '<h4>$1</h4>');
    s = s.replace(/^##\s*(.+)$/gim, '<h3>$1</h3>');
    s = s.replace(/^#\s*(.+)$/gim, '<h2>$1</h2>');

    // Lists: convert lines starting with - or * to <ul><li>
    // First, protect existing HTML
    const lines = s.split('\n');
    let out = [];
    let inList = false;
    for (let line of lines) {
      const trimmed = line.trim();
      if (/^[-*]\s+/.test(trimmed)) {
        if (!inList) { out.push('<ul class="dr-lara-list">'); inList = true; }
        const item = trimmed.replace(/^[-*]\s+/, '');
        // If the list item contains a dollar sign, mark it as a product item for special styling
        const isProduct = /\$\s?[\d,.]+/.test(item) || /stock[:]?/i.test(item);
        out.push(`<li${isProduct ? ' class="product-item"' : ''}>${item}</li>`);
      } else {
        if (inList) { out.push('</ul>'); inList = false; }
        if (trimmed === '') out.push('<br>'); else out.push(`<p>${trimmed}</p>`);
      }
    }
    if (inList) out.push('</ul>');
    let html = out.join('\n');

    // Post-process product-item list entries to give them structured markup
    html = html.replace(/<li class=\"product-item\">([\s\S]*?)<\/li>/gi, (m, inner) => {
      // Try to split by em-dash or hyphen to separate name from details
      const parts = inner.split(/\s*[—-]\s*/);
      const name = parts[0] ? parts[0].trim() : inner.trim();
      const details = parts.slice(1).join(' — ').trim();
      const detailsHtml = details ? `<div class=\"product-details\">${details}</div>` : '';
      return `<li class=\"product-item\"><div class=\"product-name\">${name}</div>${detailsHtml}</li>`;
    });

    return html;
  }

  function escapeHtml(s = '') {
    return s.replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }
}
