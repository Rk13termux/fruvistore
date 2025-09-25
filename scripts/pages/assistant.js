// Assistant Page (AI Chat powered by Groq)
import { chatCompletion } from '../services/groqService.js';

export function renderAssistantPage(root) {
  root.innerHTML = `
  <section class="ai-assistant">
    <div class="container">
      <h2>Asistente de IA FreshFruits</h2>
      <p>¿Tienes preguntas sobre nuestras frutas o cómo comprar? ¡Nuestro asistente está aquí para ayudarte!</p>
      <div class="chat-container">
        <div class="chat-messages" id="chatMessages">
          <div class="message bot-message">
            <i class="fas fa-robot"></i>
            <p>¡Hola! Soy tu asistente FreshFruits. ¿En qué puedo ayudarte hoy?</p>
          </div>
        </div>
        <div class="chat-input">
          <input type="text" id="userInput" placeholder="Escribe tu pregunta aquí...">
          <button id="sendBtn"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
    </div>
  </section>
  `;

  const input = root.querySelector('#userInput');
  const sendBtn = root.querySelector('#sendBtn');

  sendBtn.addEventListener('click', () => sendMessage());
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  function sendMessage() {
    const message = (input.value || '').trim();
    if (!message) return;
    addMessage(message, 'user');
    input.value = '';
    showTyping();
    chatCompletion(message)
      .then(res => {
        hideTyping();
        addMessage(res, 'bot');
      })
      .catch(err => {
        console.error(err);
        hideTyping();
        addMessage('Lo siento, hubo un problema procesando tu mensaje. Intenta nuevamente.', 'bot');
      });
  }

  function addMessage(text, sender) {
    const wrap = root.querySelector('#chatMessages');
    const div = document.createElement('div');
    div.className = `message ${sender}-message`;
    const icon = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    div.innerHTML = `${icon}<p>${escapeHtml(text)}</p>`;
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
  }

  function showTyping() {
    const wrap = root.querySelector('#chatMessages');
    const div = document.createElement('div');
    div.id = 'typingIndicator';
    div.className = 'message bot-message typing-indicator';
    div.innerHTML = '<i class="fas fa-robot"></i><p>Escribiendo <span class="loading"></span></p>';
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
  }

  function hideTyping() {
    const el = root.querySelector('#typingIndicator');
    if (el) el.remove();
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  }
}
