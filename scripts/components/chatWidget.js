// Floating AI Chat Widget (Fruvi Glass)
import { chatCompletion } from '../services/groqService.js';

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
        <div class="message bot-message"><i class="fas fa-robot"></i><p>¡Hola! Soy el asistente de Fruvi. Pregúntame sobre frutas, nutrición o compras.</p></div>
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

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}-message`;
    const icon = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    div.innerHTML = `${icon}<p>${escapeHtml(text)}`;
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
      const res = await chatCompletion(text);
      hideTyping();
      addMessage(res, 'bot');
    } catch (e) {
      console.error(e);
      hideTyping();
      addMessage('Lo siento, tuve un problema procesando tu mensaje.', 'bot');
    }
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') send(); });
}

function escapeHtml(s) { return s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }
