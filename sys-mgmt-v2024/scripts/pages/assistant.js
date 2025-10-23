// Assistant Page (AI Chat powered by Groq) - Full-screen ChatGPT-like UI
import { chatCompletionWithHistory } from '../services/groqService.js';

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

  // Handle start chat
  startChatBtn.addEventListener('click', () => {
    root.querySelector('.ai-assistant-intro').style.display = 'none';
    chatSection.style.display = 'grid';
    // Initial greeting
    setTimeout(() => appendMessage('assistant', '¡Hola! Soy <strong>Fruvi</strong> 🍎. Puedo ayudarte con frutas, compras, envíos, nutrición y recetas. ¿En qué te ayudo hoy?'), 300);
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
    // Push user message
    history.push({ role: 'user', content: text });
    appendMessage('user', text);
    input.value = '';
    autosize();
    const stopTyping = showTyping();
    try {
      const reply = await chatCompletionWithHistory(history);
      stopTyping();
      history.push({ role: 'assistant', content: reply });
      appendMessage('assistant', reply);
    } catch (err) {
      console.error(err);
      stopTyping();
      appendMessage('assistant', 'Lo siento, hubo un problema procesando tu mensaje. Intenta nuevamente.');
    }
  });

  function appendMessage(role, content) {
    const item = document.createElement('div');
    item.className = `fruvi-msg ${role === 'user' ? 'fruvi-msg--user' : 'fruvi-msg--assistant'} fade-in-up`;
    const icon = role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    const textHtml = renderSafeMarkdown(content);
    item.innerHTML = `
      <div class="fruvi-msg__avatar">${icon}</div>
      <div class="fruvi-msg__bubble">${textHtml}</div>
    `;
    messagesEl.appendChild(item);
    messagesEl.scrollTop = messagesEl.scrollHeight;
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
}
