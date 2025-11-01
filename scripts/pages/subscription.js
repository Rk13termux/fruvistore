// Subscription Page - Credits System with WhatsApp Payment
// Professional subscription management with credits-based usage

import { checkPremiumAccess, getSubscriptionStatus } from '../services/subscriptionService.js';

// Credits system configuration
const CREDITS_PLANS = {
  starter: {
    name: 'Paquete Inicial',
    credits: 100,
    price: 25000, // COP
    description: 'Perfecto para comenzar tu viaje nutricional',
    features: ['100 créditos para consultas', 'Acceso básico al Dr. IA', 'Informes simples']
  },
  popular: {
    name: 'Paquete Popular',
    credits: 300,
    price: 65000, // COP
    description: 'La opción más elegida por nuestros usuarios',
    features: ['300 créditos premium', 'Análisis nutricional completo', 'Planes personalizados', 'Seguimiento básico'],
    badge: 'Más Popular'
  },
  premium: {
    name: 'Paquete Premium',
    credits: 600,
    price: 120000, // COP
    description: 'Máxima experiencia con el Dr. Nutricionista',
    features: ['600 créditos ilimitados', 'Consultas médicas completas', 'Planes avanzados', 'Seguimiento profesional', 'Reportes detallados', 'Soporte prioritario']
  },
  unlimited_monthly: {
    name: 'Ilimitado Mensual',
    credits: -1, // Unlimited
    price: 99000, // COP
    description: 'Acceso completo sin límites',
    features: ['Créditos ilimitados', 'Todas las funciones premium', 'Consultas 24/7', 'Planes ilimitados', 'Soporte VIP'],
    period: 'mes'
  },
  unlimited_yearly: {
    name: 'Ilimitado Anual',
    credits: -1, // Unlimited
    price: 990000, // COP
    description: 'El mejor valor para usuarios frecuentes',
    features: ['Créditos ilimitados', 'Todas las funciones premium', '2 meses gratis', 'Descuentos exclusivos', 'Acceso anticipado'],
    period: 'año',
    savings: '17%'
  }
};

// Credit costs for different actions
const CREDIT_COSTS = {
  basic_query: 1,      // Consulta básica
  nutrition_analysis: 3, // Análisis nutricional
  meal_plan: 5,        // Plan de comidas
  medical_consultation: 8, // Consulta médica completa
  progress_report: 2   // Reporte de progreso
};

export function renderSubscriptionPage(root) {
  console.log('renderSubscriptionPage function called');
  // Check current user status
  let currentUser = null;
  let isPremium = false;
  let subscriptionStatus = null;

  // Load user data
  (async () => {
    try {
      currentUser = await window.getUser();
      console.log('Current user in subscription page:', currentUser);
      if (currentUser) {
        console.log('Checking premium access for user:', currentUser.id);
        const access = await checkPremiumAccess(currentUser.id);
        console.log('Premium access result:', access);
        isPremium = access.hasAccess;
        subscriptionStatus = await getSubscriptionStatus(currentUser.id);
        console.log('Subscription status:', subscriptionStatus);
      } else {
        console.log('No user logged in, showing free features');
      }
    } catch (e) {
      console.log('No se pudo verificar estado del usuario:', e.message);
      console.error('Full error:', e);
    }
  })();

  root.innerHTML = `
  <section class="subscription-hero container">
    <div class="hero-content">
      <h1>Sistema de Créditos Premium</h1>
      <p>Paga solo por lo que usas. Cada consulta con el Dr. Nutricionista IA tiene un costo en créditos. Compra paquetes y accede a funciones avanzadas.</p>
      <div class="hero-stats">
        <div class="stat">
          <span class="number">1 Crédito</span>
          <span class="label">= 1 Consulta básica</span>
        </div>
        <div class="stat">
          <span class="number">Pago único</span>
          <span class="label">Sin suscripciones mensuales</span>
        </div>
        <div class="stat">
          <span class="number">Sin expiración</span>
          <span class="label">Créditos válidos indefinidamente</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Credits Balance -->
  ${currentUser ? `
  <section class="credits-balance container">
    <div class="balance-card glass">
      <h2>Tu Saldo de Créditos</h2>
      <div id="creditsBalance">
        <div class="loading">Cargando saldo...</div>
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Custom Credits Selection -->
  <section class="pricing-section container">
    <div class="section-header">
      <h2>Compra Créditos Personalizados</h2>
      <p>Elige la cantidad de créditos que necesitas para tus consultas con el Dr. Nutricionista IA</p>
    </div>

    <div class="custom-credits-selector">
      <div class="selector-card glass">
        <div class="selector-header">
          <h3>Selecciona tus Créditos</h3>
          <p>Cada crédito cuesta $250 COP</p>
        </div>

        <div class="credit-calculator">
          <div class="calculator-input">
            <label for="creditAmount">Cantidad de Créditos:</label>
            <div class="input-group">
              <button class="qty-btn" id="decreaseCredits">-</button>
              <input type="number" id="creditAmount" min="10" max="1000" value="100" step="10">
              <button class="qty-btn" id="increaseCredits">+</button>
            </div>
          </div>

          <div class="calculator-display">
            <div class="total-price">
              <span class="label">Total a pagar:</span>
              <span class="amount" id="totalPrice">$25,000 COP</span>
            </div>
            <div class="credit-value">
              <span class="label">Valor por crédito:</span>
              <span class="value">$250 COP</span>
            </div>
          </div>
        </div>

        <div class="selector-footer">
          <button class="btn-primary whatsapp-btn" id="buyCreditsBtn">
            <i class="fab fa-whatsapp"></i>
            Pagar por WhatsApp
          </button>
          <p class="payment-note">
            <i class="fas fa-info-circle"></i>
            Te contactaremos por WhatsApp para procesar tu pago y activar los créditos
          </p>
        </div>
      </div>
    </div>

    <!-- Popular Packages as Suggestions -->
    <div class="popular-packages">
      <h3>Paquetes Populares</h3>
      <div class="packages-grid">
        <div class="package-suggestion" data-credits="100">
          <div class="package-icon"><i class="fas fa-star"></i></div>
          <div class="package-info">
            <h4>100 Créditos</h4>
            <p>$25,000 COP</p>
          </div>
          <button class="btn-outline select-package">Seleccionar</button>
        </div>
        <div class="package-suggestion featured" data-credits="300">
          <div class="package-icon"><i class="fas fa-fire"></i></div>
          <div class="package-info">
            <h4>300 Créditos</h4>
            <p>$75,000 COP</p>
            <span class="popular-badge">Más Popular</span>
          </div>
          <button class="btn-primary select-package">Seleccionar</button>
        </div>
        <div class="package-suggestion" data-credits="500">
          <div class="package-icon"><i class="fas fa-crown"></i></div>
          <div class="package-info">
            <h4>500 Créditos</h4>
            <p>$125,000 COP</p>
          </div>
          <button class="btn-outline select-package">Seleccionar</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Credits Usage Guide -->
  <section class="usage-guide container">
    <div class="guide-card glass">
      <h2>¿Cómo funcionan los créditos?</h2>
      <div class="usage-grid">
        <div class="usage-item">
          <div class="usage-icon">
            <i class="fas fa-comment"></i>
          </div>
          <h4>Consulta Básica</h4>
          <p>Información general sobre frutas y nutrición</p>
          <div class="usage-cost">1 crédito</div>
        </div>
        <div class="usage-item">
          <div class="usage-icon">
            <i class="fas fa-search"></i>
          </div>
          <h4>Análisis Nutricional</h4>
          <p>Evaluación detallada de composición nutricional</p>
          <div class="usage-cost">3 créditos</div>
        </div>
        <div class="usage-item">
          <div class="usage-icon">
            <i class="fas fa-utensils"></i>
          </div>
          <h4>Plan de Alimentación</h4>
          <p>Plan personalizado de comidas y porciones</p>
          <div class="usage-cost">5 créditos</div>
        </div>
        <div class="usage-item">
          <div class="usage-icon">
            <i class="fas fa-stethoscope"></i>
          </div>
          <h4>Consulta Médica</h4>
          <p>Evaluación médica completa con recomendaciones</p>
          <div class="usage-cost">8 créditos</div>
        </div>
        <div class="usage-item">
          <div class="usage-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <h4>Reporte de Progreso</h4>
          <p>Análisis detallado de evolución nutricional</p>
          <div class="usage-cost">2 créditos</div>
        </div>
        <div class="usage-item">
          <div class="usage-icon">
            <i class="fas fa-brain"></i>
          </div>
          <h4>IA Premium</h4>
          <p>Acceso completo al Dr. Nutricionista IA</p>
          <div class="usage-cost">Créditos ilimitados</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Medical Credentials -->
  <section class="credentials-section container">
    <div class="credentials-grid">
      <div class="credential-card glass">
        <div class="credential-icon">
          <i class="fas fa-user-md"></i>
        </div>
        <h3>Dr. Alejandro Rivera</h3>
        <p>Médico Nutricionista Especialista</p>
        <ul>
          <li>Graduado Harvard University</li>
          <li>15 años de experiencia</li>
          <li>Miembro AND (Asociación Americana de Nutrición)</li>
        </ul>
      </div>

      <div class="credential-card glass">
        <div class="credential-icon">
          <i class="fas fa-microscope"></i>
        </div>
        <h3>Base Científica</h3>
        <p>Recomendaciones respaldadas por evidencia</p>
        <ul>
          <li>Estudios clínicos actualizados</li>
          <li>Meta-análisis científicos</li>
          <li>Guías nutricionales internacionales</li>
        </ul>
      </div>

      <div class="credential-card glass">
        <div class="credential-icon">
          <i class="fas fa-brain"></i>
        </div>
        <h3>Inteligencia Artificial</h3>
        <p>IA médica especializada en nutrición</p>
        <ul>
          <li>Aprendizaje continuo</li>
          <li>Personalización individual</li>
          <li>Memoria histórica</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="faq-section container">
    <h2>Preguntas Frecuentes</h2>
    <div class="faq-grid">
      <div class="faq-item">
        <h4>¿Qué incluye el plan Premium?</h4>
        <p>Acceso ilimitado al Dr. Nutricionista IA, análisis médicos personalizados, planes nutricionales, seguimiento de progreso, calculadoras avanzadas y soporte prioritario.</p>
      </div>

      <div class="faq-item">
        <h4>¿Puedo cancelar en cualquier momento?</h4>
        <p>Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario. El acceso continúa hasta el final del período pagado.</p>
      </div>

      <div class="faq-item">
        <h4>¿Los datos médicos están seguros?</h4>
        <p>Absolutamente. Utilizamos encriptación de nivel médico y cumplimos con las normativas de protección de datos. Tus consultas son confidenciales.</p>
      </div>

      <div class="faq-item">
        <h4>¿Cómo funciona el seguimiento?</h4>
        <p>El Dr. IA recuerda todas tus consultas anteriores, analiza patrones en tus síntomas y adapta las recomendaciones basándose en tu evolución.</p>
      </div>

      <div class="faq-item">
        <h4>¿Puedo cambiar de plan?</h4>
        <p>Sí, puedes actualizar o cambiar tu plan en cualquier momento. Los cambios se aplican inmediatamente.</p>
      </div>

      <div class="faq-item">
        <h4>¿Hay garantía de satisfacción?</h4>
        <p>Ofrecemos una garantía de 30 días. Si no estás satisfecho, te devolvemos el dinero sin preguntas.</p>
      </div>
    </div>
  </section>

  <!-- Guarantee Section -->
  <section class="guarantee-section container">
    <div class="guarantee-card glass">
      <div class="guarantee-content">
        <i class="fas fa-shield-alt"></i>
        <h3>Garantía de Satisfacción 100%</h3>
        <p>Si en los primeros 30 días no estás completamente satisfecho con el servicio del Dr. Nutricionista IA, te devolvemos el 100% de tu dinero. Sin preguntas, sin condiciones.</p>
        <div class="guarantee-features">
          <span><i class="fas fa-check"></i> Sin riesgo</span>
          <span><i class="fas fa-check"></i> Devolución inmediata</span>
          <span><i class="fas fa-check"></i> Soporte 24/7</span>
        </div>
      </div>
    </div>
  </section>
  `;

  // Load credits balance
  if (currentUser) {
    loadCreditsBalance();
    // Update balance display every 30 seconds
    setInterval(loadCreditsBalance, 30000);
  }

  // Make loadCreditsBalance globally available for cross-page updates
  window.loadCreditsBalance = loadCreditsBalance;

  // Setup event listeners
  setupCreditsEvents();
}

async function loadCreditsBalance() {
  try {
    const balanceElement = document.getElementById('creditsBalance');
    if (!balanceElement) return;

    const currentUser = await window.getUser();
    if (!currentUser) return;

    // Get real credits balance from database
    const creditsBalance = await window.getCreditBalance(currentUser.id);

    balanceElement.innerHTML = `
      <div class="balance-info">
        <div class="balance-header">
          <div class="balance-amount">
            <span class="number">${creditsBalance}</span>
            <span class="label">créditos disponibles</span>
          </div>
          <div class="balance-status ${creditsBalance > 10 ? 'good' : creditsBalance > 0 ? 'warning' : 'danger'}">
            ${creditsBalance > 10 ? 'Saldo suficiente' : creditsBalance > 0 ? 'Saldo bajo' : 'Sin créditos'}
          </div>
        </div>
        <div class="balance-actions">
          <button class="btn-secondary" onclick="window.location.hash='#/assistant'">
            <i class="fas fa-comments"></i> Usar créditos
          </button>
          <button class="btn-outline" onclick="document.querySelector('.custom-credits-selector')?.scrollIntoView({behavior: 'smooth'})">
            <i class="fas fa-plus"></i> Comprar más
          </button>
        </div>
        <div class="balance-history">
          <h5>Historial reciente</h5>
          <div id="recentTransactions">
            <div class="loading">Cargando historial...</div>
          </div>
        </div>
      </div>
    `;

    // Load recent transactions
    loadRecentTransactions(currentUser.id);

  } catch (error) {
    console.error('Error loading credits balance:', error);
    document.getElementById('creditsBalance').innerHTML = `
      <div class="error">Error cargando saldo de créditos</div>
    `;
  }
}

async function loadRecentTransactions(userId) {
  try {
    const transactions = await window.getCreditHistory(userId, 5); // Last 5 transactions

    const container = document.getElementById('recentTransactions');
    if (!container) return;

    if (!transactions || transactions.length === 0) {
      container.innerHTML = '<div class="history-item">Sin transacciones recientes</div>';
      return;
    }

    let html = '';
    transactions.forEach(transaction => {
      const type = transaction.transaction_type;
      const amount = transaction.amount;
      const description = transaction.description || 'Sin descripción';
      const date = new Date(transaction.created_at).toLocaleDateString('es-CO');

      const sign = amount > 0 ? '+' : '';
      const colorClass = amount > 0 ? 'text-success' : 'text-danger';

      // Format transaction type for display
      let typeLabel = '';
      switch(type) {
        case 'initial_credits': typeLabel = 'Créditos iniciales'; break;
        case 'admin_add': typeLabel = 'Agregado por admin'; break;
        case 'usage': typeLabel = 'Uso en consulta'; break;
        default: typeLabel = type;
      }

      html += `
        <div class="history-item">
          <span title="${description} - ${date}">${typeLabel}: ${description}</span>
          <span class="${colorClass}">${sign}${amount} crédito${Math.abs(amount) !== 1 ? 's' : ''}</span>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading recent transactions:', error);
    document.getElementById('recentTransactions').innerHTML = '<div class="history-item">Error cargando historial</div>';
  }
}

function setupCreditsEvents() {
  // Credit calculator controls
  const creditAmountInput = document.getElementById('creditAmount');
  const totalPriceElement = document.getElementById('totalPrice');
  const decreaseBtn = document.getElementById('decreaseCredits');
  const increaseBtn = document.getElementById('increaseCredits');
  const buyCreditsBtn = document.getElementById('buyCreditsBtn');

  // Credit price per unit
  const CREDIT_PRICE = 250; // COP per credit

  // Update total price display
  function updateTotalPrice() {
    const credits = parseInt(creditAmountInput.value) || 0;
    const total = credits * CREDIT_PRICE;
    totalPriceElement.textContent = `$${total.toLocaleString('es-CO')} COP`;
  }

  // Initialize price
  updateTotalPrice();

  // Input change event
  creditAmountInput.addEventListener('input', updateTotalPrice);

  // Decrease credits
  decreaseBtn.addEventListener('click', () => {
    const currentValue = parseInt(creditAmountInput.value) || 0;
    const minValue = parseInt(creditAmountInput.min) || 10;
    if (currentValue > minValue) {
      creditAmountInput.value = currentValue - 10;
      updateTotalPrice();
    }
  });

  // Increase credits
  increaseBtn.addEventListener('click', () => {
    const currentValue = parseInt(creditAmountInput.value) || 0;
    const maxValue = parseInt(creditAmountInput.max) || 1000;
    if (currentValue < maxValue) {
      creditAmountInput.value = currentValue + 10;
      updateTotalPrice();
    }
  });

  // Package selection buttons
  document.querySelectorAll('.select-package').forEach(button => {
    button.addEventListener('click', (e) => {
      const credits = parseInt(e.target.closest('.package-suggestion').dataset.credits);
      creditAmountInput.value = credits;
      updateTotalPrice();

      // Scroll to calculator
      document.querySelector('.custom-credits-selector').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    });
  });

  // WhatsApp payment button
  buyCreditsBtn.addEventListener('click', async () => {
    try {
      const credits = parseInt(creditAmountInput.value) || 0;
      const total = credits * CREDIT_PRICE;

      if (credits < 10) {
        showNotification('Mínimo 10 créditos requeridos', 'error');
        return;
      }

      // Check if user is logged in
      const currentUser = await window.getUser();
      if (!currentUser) {
        // Redirect to login
        window.location.hash = '#/login';
        return;
      }

      // Generate WhatsApp message with user ID for credit recharge
      const whatsappMessage = encodeURIComponent(
        `¡Hola! Quiero comprar ${credits} créditos para el Dr. Nutricionista IA.\n\n` +
        `📊 Detalles de la compra:\n` +
        `• Créditos: ${credits}\n` +
        `• Precio por crédito: $250 COP\n` +
        `• Total a pagar: $${total.toLocaleString('es-CO')} COP\n\n` +
        `👤 Información del usuario:\n` +
        `• Email: ${currentUser.email}\n` +
        `• ID de Usuario: ${currentUser.id}\n` +
        `• Nombre: ${currentUser.user_metadata?.full_name || 'No especificado'}\n\n` +
        `💰 RECARGA AUTOMÁTICA:\n` +
        `Después del pago, usar este ID para recargar: ${currentUser.id}\n\n` +
        `Por favor, confirma el pago y procederé con la activación automática de los créditos.`
      );

      // WhatsApp business number from environment
      const whatsappNumber = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || '573001234567';

      // Open WhatsApp with the message
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
      window.open(whatsappUrl, '_blank');

      // Show success message
      showNotification('Redirigiendo a WhatsApp para procesar tu compra...', 'success');

    } catch (error) {
      console.error('Error processing WhatsApp payment:', error);
      showNotification('Error procesando compra. Intenta nuevamente.', 'error');
    }
  });
}

// Global functions for credits system
window.getCreditBalance = async function() {
  try {
    const currentUser = await window.getUser();
    if (!currentUser) return 0;

    // Import the real getCreditBalance function from subscriptionService
    const { getCreditBalance: realGetCreditBalance } = await import('../services/subscriptionService.js');
    return await realGetCreditBalance(currentUser.id);
  } catch (error) {
    console.error('Error getting credit balance:', error);
    return 0;
  }
};

window.deductCredits = async function(amount, description = 'Consulta IA') {
  try {
    const currentUser = await window.getUser();
    if (!currentUser) return false;

    // Import the real deductCredits function from subscriptionService
    const { deductCredits: realDeductCredits } = await import('../services/subscriptionService.js');
    const result = await realDeductCredits(currentUser.id, amount, description);

    if (result) {
      showNotification(`Usados ${amount} créditos por ${description}`, 'info');
      // Refresh credits balance display
      await loadCreditsBalance();
      return true;
    } else {
      showNotification('Error procesando deducción de créditos', 'error');
      return false;
    }
  } catch (error) {
    console.error('Error deducting credits:', error);
    showNotification('Error procesando deducción de créditos', 'error');
    return false;
  }
};

window.addCredits = async function(amount, source = 'purchase') {
  try {
    const currentUser = await window.getUser();
    if (!currentUser) return false;

    // Import the real addCredits function from subscriptionService
    const { addCredits: realAddCredits } = await import('../services/subscriptionService.js');
    const result = await realAddCredits(currentUser.id, amount, `Créditos agregados desde ${source}`);

    if (result) {
      showNotification(`¡${amount} créditos agregados a tu cuenta!`, 'success');
      // Refresh credits balance display
      await loadCreditsBalance();
      return true;
    } else {
      showNotification('Error agregando créditos', 'error');
      return false;
    }
  } catch (error) {
    console.error('Error adding credits:', error);
    showNotification('Error agregando créditos', 'error');
    return false;
  }
};

window.getCreditHistory = async function(userId, limit = 50) {
  try {
    // Import the real getCreditHistory function from subscriptionService
    const { getCreditHistory: realGetCreditHistory } = await import('../services/subscriptionService.js');
    return await realGetCreditHistory(userId, limit);
  } catch (error) {
    console.error('Error getting credit history:', error);
    return [];
  }
};

// Global functions for credits system - EXPORT THEM
// Note: These functions are defined in subscriptionService.js, not here
// This export is just for compatibility with app.js imports

// Utility function for notifications
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
    ${message}
  `;

  // Add to page
  document.body.appendChild(notification);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}