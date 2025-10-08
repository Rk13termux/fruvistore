// Assistant Page (AI Chat powered by Groq) - Full-screen ChatGPT-like UI
import { chatCompletionWithHistory } from '../services/groqService.js';

export function renderAssistantPage(root) {
  // Full page chat layout
  root.innerHTML = `
  <section class="fruvi-chatgpt">
    <header class="fruvi-chatgpt__header">
      <div class="container fruvi-chatgpt__header__inner">
        <div class="brand"><i class="fas fa-apple-alt"></i><span>Fruvi</span></div>
        <div class="subtitle">Asistente IA especializado en frutas</div>
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

  // Initial greeting
  appendMessage('assistant', '¡Hola! Soy <strong>Fruvi</strong> 🍎. Puedo ayudarte con frutas, compras, envíos, nutrición y recetas. ¿En qué te ayudo hoy?');

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
      <div class="fruvi-msg__bubble">Escribiendo <span class="loading"></span></div>`;
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
