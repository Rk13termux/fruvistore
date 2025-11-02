// App bootstrap
console.log('🚀 Starting app bootstrap...');

// Dynamic imports with error handling
let startRouter, registerRoute, getCurrentPath;
let renderHomePage, renderStorePage, renderBoxesPage;
let renderNutritionPage, renderAssistantPage, renderRegistrationPage, renderLoginPage;
let renderProfilePage, renderRecipesBlogPage, renderRecipeDetailPage;
let renderDashboardPage, renderSubscriptionPage, initChatWidget, CheckoutModalStore, CheckoutModalBoxes;

async function loadModules() {
  try {
    console.log('📦 Loading user utilities...');
    await import('./utils/userUtils.js');
    console.log('✅ User utilities loaded');

    console.log('📦 Loading router module...');
    const routerModule = await import('./router.js');
    ({ startRouter, registerRoute, getCurrentPath } = routerModule);
    console.log('✅ Router loaded');

    console.log('📦 Loading page modules...');
    const homeModule = await import('./pages/home.js');
    ({ renderHomePage } = homeModule);

    const storeModule = await import('./pages/store.js');
    ({ renderStorePage } = storeModule);

    const boxesModule = await import('./pages/boxes.js');
    ({ renderBoxesPage } = boxesModule);

    const nutritionModule = await import('./pages/nutrition.js');
    ({ renderNutritionPage } = nutritionModule);

    const assistantModule = await import('./pages/assistant.js');
    ({ renderAssistantPage } = assistantModule);

    const registrationModule = await import('./pages/registration.js');
    ({ renderRegistrationPage } = registrationModule);

    const loginModule = await import('./pages/login.js');
    ({ renderLoginPage } = loginModule);

    const profileModule = await import('./pages/profile.js');
    ({ renderProfilePage } = profileModule);

    const recipesModule = await import('./pages/recipes.js');
    ({ renderRecipesBlogPage } = recipesModule);

    const recipeDetailModule = await import('./pages/recipeDetail.js');
    ({ renderRecipeDetailPage } = recipeDetailModule);

    const dashboardModule = await import('./pages/dashboard.js');
    ({ renderDashboardPage } = dashboardModule);

    console.log('📦 Loading subscription module...');
    try {
      const subscriptionModule = await import('./pages/subscription.js');
      console.log('Subscription module imported:', subscriptionModule);
      console.log('Available exports:', Object.keys(subscriptionModule));
      console.log('renderSubscriptionPage in module:', 'renderSubscriptionPage' in subscriptionModule);
      renderSubscriptionPage = subscriptionModule.renderSubscriptionPage;
      console.log('✅ Subscription module loaded, renderSubscriptionPage:', typeof renderSubscriptionPage);

      // Also load global credit functions
      console.log('🔄 Loading global credit functions...');

      // Force load credit functions from subscriptionService
      const subscriptionService = await import('./services/subscriptionService.js');

      // Define global credit functions
      window.getCreditBalance = async function(userId) {
        if (!userId) {
          console.warn('getCreditBalance called without userId');
          return 0;
        }
        return await subscriptionService.getCreditBalance(userId);
      };

      window.deductCredits = async function(userId, amount, description) {
        return await subscriptionService.deductCredits(userId, amount, description);
      };

      window.addCredits = async function(userId, amount, description, adminUserId) {
        return await subscriptionService.addCredits(userId, amount, description, adminUserId);
      };

      window.getCreditHistory = async function(userId, limit) {
        return await subscriptionService.getCreditHistory(userId, limit);
      };

      window.getCreditStats = async function(userId) {
        return await subscriptionService.getCreditStats(userId);
      };

      window.getAllUsersCredits = async function() {
        return await subscriptionService.getAllUsersCredits();
      };

      // Also load checkAndCreateTables function
      window.checkAndCreateTables = subscriptionService.checkAndCreateTables;
      window.forceInitializeCredits = subscriptionService.forceInitializeCredits;

      console.log('✅ All credit functions loaded globally from subscriptionService');
      console.log('Available credit functions:', {
        getCreditBalance: typeof window.getCreditBalance,
        deductCredits: typeof window.deductCredits,
        addCredits: typeof window.addCredits,
        getCreditHistory: typeof window.getCreditHistory,
        getCreditStats: typeof window.getCreditStats,
        getAllUsersCredits: typeof window.getAllUsersCredits
      });
    } catch (error) {
      console.error('❌ Error importing subscription module:', error);
      console.error('Error details:', error.message, error.stack);
      // Don't throw error, continue with app loading
      console.warn('⚠️ Continuing without subscription module');
    }

    const webhookModule = await import('./pages/webhook.js');
    ({ handleGumroadWebhook } = webhookModule);

    console.log('📦 Loading component modules...');
    const chatWidgetModule = await import('./components/chatWidget.js');
    ({ initChatWidget } = chatWidgetModule);

    const checkoutStoreModule = await import('./components/checkoutModalStore.js');
    ({ CheckoutModalStore } = checkoutStoreModule);

    const checkoutBoxesModule = await import('./components/checkoutModalBoxes.js');
    ({ CheckoutModalBoxes } = checkoutBoxesModule);

    console.log('✅ All modules loaded successfully!');
    return true;

  } catch (error) {
    console.error('❌ Module loading error:', error);
    console.error('Stack:', error.stack);
    return false;
  }
}

// Initialize app after modules are loaded
(async () => {
  const success = await loadModules();
  if (!success) {
    console.error('❌ Failed to load modules, app cannot start');
    return;
  }

  console.log('🚀 Starting app initialization...');

  // Verificar que las funciones se importaron correctamente
  console.log('🔍 Verificando imports:');
  console.log('renderHomePage:', typeof renderHomePage);
  console.log('renderStorePage:', typeof renderStorePage);
  console.log('renderBoxesPage:', typeof renderBoxesPage);
  console.log('renderNutritionPage:', typeof renderNutritionPage);
  console.log('renderAssistantPage:', typeof renderAssistantPage);
  console.log('renderSubscriptionPage:', typeof renderSubscriptionPage);
  console.log('renderRegistrationPage:', typeof renderRegistrationPage);
  console.log('renderLoginPage:', typeof renderLoginPage);
  console.log('renderProfilePage:', typeof renderProfilePage);
  console.log('renderRecipesBlogPage:', typeof renderRecipesBlogPage);
  console.log('renderRecipeDetailPage:', typeof renderRecipeDetailPage);
  console.log('renderDashboardPage:', typeof renderDashboardPage);
  console.log('CheckoutModalStore:', typeof CheckoutModalStore);
  console.log('CheckoutModalBoxes:', typeof CheckoutModalBoxes);

  // Check credit functions
  console.log('💰 Credit functions:');
  console.log('window.getCreditBalance:', typeof window.getCreditBalance);
  console.log('window.deductCredits:', typeof window.deductCredits);
  console.log('window.addCredits:', typeof window.addCredits);
  console.log('window.getCreditHistory:', typeof window.getCreditHistory);
  console.log('window.checkAndCreateTables:', typeof window.checkAndCreateTables);
  console.log('window.forceInitializeCredits:', typeof window.forceInitializeCredits);

  // Add development helper for dashboard testing
  console.log('🔧 Adding development helpers...');
  window.enableDashboardDev = function() {
    localStorage.setItem('fruvi_user', JSON.stringify({
      id: 'dev-user-123',
      email: 'dev@fruvi.com',
      user_metadata: { full_name: 'Usuario Demo' }
    }));
    console.log('✅ Demo user enabled. Navigating to dashboard...');
    location.hash = '#/';
    location.reload();
  };
  window.disableDashboardDev = function() {
    localStorage.removeItem('fruvi_user');
    console.log('✅ Demo user disabled. Navigating to home...');
    location.hash = '#/';
    location.reload();
  };
  window.testLogin = function() {
    console.log('🧪 Testing login flow...');
    window.enableDashboardDev();
  };
  console.log('💡 Development helpers available:');
  console.log('  - window.enableDashboardDev() // Test dashboard');
  console.log('  - window.disableDashboardDev() // Back to guest');
  console.log('  - window.testLogin() // Quick login test');

  // --- Route Registration ---

  console.log('📋 Registrando rutas...');
  registerRoute('/', async (rootEl, params) => {
    try {
      console.log('🔍 Checking user status for root route...');

      // Check if getUserStatus is available
      if (typeof window.getUserStatus !== 'function') {
        console.warn('⚠️ getUserStatus not available, defaulting to home page');
        showSPA(rootEl, renderHomePage);
        return;
      }

      const userStatus = await window.getUserStatus();
      console.log('👤 User status:', userStatus);

      if (userStatus.isGuest) {
        console.log('🏠 Routing to home page (guest user)');
        showSPA(rootEl, renderHomePage);
      } else {
        console.log('📊 Routing to dashboard (registered user)');
        showSPA(rootEl, renderDashboardPage);
      }
    } catch (error) {
      console.error('❌ Error rendering home/dashboard page:', error);
      console.log('🏠 Fallback to home page due to error');
      showSPA(rootEl, renderHomePage);
    }
  });
  registerRoute('', async (rootEl, params) => {
    try {
      console.log('🔍 Checking user status for empty route...');

      // Check if getUserStatus is available
      if (typeof window.getUserStatus !== 'function') {
        console.warn('⚠️ getUserStatus not available, defaulting to home page');
        showSPA(rootEl, renderHomePage);
        return;
      }

      const userStatus = await window.getUserStatus();
      console.log('👤 User status:', userStatus);

      if (userStatus.isGuest) {
        console.log('🏠 Routing to home page (guest user)');
        showSPA(rootEl, renderHomePage);
      } else {
        console.log('📊 Routing to dashboard (registered user)');
        showSPA(rootEl, renderDashboardPage);
      }
    } catch (error) {
      console.error('❌ Error rendering home/dashboard page:', error);
      console.log('🏠 Fallback to home page due to error');
      showSPA(rootEl, renderHomePage);
    }
  });
  registerRoute('/tienda', async (rootEl, params) => {
    try {
      const userStatus = await window.getUserStatus();
      if (userStatus && userStatus.isGuest) {
        showRegistrationRequiredPage(rootEl, 'tienda');
      } else {
        showSPA(rootEl, renderStorePage);
      }
    } catch (error) {
      console.error('❌ Error en ruta /tienda:', error);
      showRegistrationRequiredPage(rootEl, 'tienda');
    }
  });
  registerRoute('/cajas', async (rootEl, params) => {
    try {
      const userStatus = await window.getUserStatus();
      if (userStatus.isGuest) showRegistrationRequiredPage(rootEl, 'cajas');
      else showSPA(rootEl, renderBoxesPage);
    } catch (error) {
      console.error('❌ Error en ruta /cajas:', error);
      rootEl.innerHTML = `<div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid #ff9999; margin: 20px; border-radius: 8px;">
        <h2>❌ Error cargando cajas</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Revisa la consola para más detalles.</p>
      </div>`;
    }
  });
  registerRoute('/registro', async (rootEl, params) => {
    try {
      showSPA(rootEl, renderRegistrationPage);
    } catch (error) {
      console.error('❌ Error en ruta /registro:', error);
      rootEl.innerHTML = `<div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid #ff9999; margin: 20px; border-radius: 8px;">
        <h2>❌ Error cargando registro</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Revisa la consola para más detalles.</p>
      </div>`;
    }
  });
  registerRoute('/login', async (rootEl, params) => {
    try {
      showSPA(rootEl, renderLoginPage);
    } catch (error) {
      console.error('❌ Error en ruta /login:', error);
      rootEl.innerHTML = `<div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid #ff9999; margin: 20px; border-radius: 8px;">
        <h2>❌ Error cargando login</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Revisa la consola para más detalles.</p>
      </div>`;
    }
  });
  registerRoute('/nutricion', async (rootEl, params) => {
    try {
      showSPA(rootEl, renderNutritionPage);
    } catch (error) {
      console.error('❌ Error en ruta /nutricion:', error);
      rootEl.innerHTML = `<div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid #ff9999; margin: 20px; border-radius: 8px;">
        <h2>❌ Error cargando nutrición</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Revisa la consola para más detalles.</p>
      </div>`;
    }
  });
  registerRoute('/dashboard', async (rootEl, params) => {
    try {
      const userStatus = await window.getUserStatus();
      if (userStatus.isGuest) showRegistrationRequiredPage(rootEl, 'dashboard');
      else showSPA(rootEl, renderDashboardPage);
    } catch (error) {
      console.error('❌ Error en ruta /dashboard:', error);
      rootEl.innerHTML = `<div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid #ff9999; margin: 20px; border-radius: 8px;">
        <h2>❌ Error cargando dashboard</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Revisa la consola para más detalles.</p>
      </div>`;
    }
  });
  registerRoute('/asistente', async (rootEl, params) => {
    try {
      const userStatus = await window.getUserStatus();
      if (userStatus.isGuest) showRegistrationRequiredPage(rootEl, 'asistente');
      else showSPA(rootEl, renderAssistantPage);
    } catch (error) {
      console.error('❌ Error en ruta /asistente:', error);
      rootEl.innerHTML = `<div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid #ff9999; margin: 20px; border-radius: 8px;">
        <h2>❌ Error cargando asistente</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Revisa la consola para más detalles.</p>
      </div>`;
    }
  });

  registerRoute('/suscripcion', async (rootEl, params) => {
    try {
      showSPA(rootEl, renderSubscriptionPage);
    } catch (error) {
      console.error('❌ Error en ruta /suscripcion:', error);
      rootEl.innerHTML = `<div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid #ff9999; margin: 20px; border-radius: 8px;">
        <h2>❌ Error cargando suscripción</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Revisa la consola para más detalles.</p>
      </div>`;
    }
  });

  registerRoute('/recetas', async (rootEl, params) => {
    try {
      const userStatus = await window.getUserStatus();
      if (userStatus.isGuest) showRegistrationRequiredPage(rootEl, 'recetas');
      else showSPA(rootEl, renderRecipesBlogPage);
    } catch (error) {
      console.error('❌ Error en ruta /recetas:', error);
      rootEl.innerHTML = `<div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid #ff9999; margin: 20px; border-radius: 8px;">
        <h2>❌ Error cargando recetas</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Revisa la consola para más detalles.</p>
      </div>`;
    }
  });
  registerRoute('/perfil', async (rootEl, params) => {
    try {
      const userStatus = await window.getUserStatus();
      if (userStatus.isGuest) showRegistrationRequiredPage(rootEl, 'perfil');
      else showSPA(rootEl, renderProfilePage);
    } catch (error) {
      console.error('❌ Error en ruta /perfil:', error);
      rootEl.innerHTML = `<div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid #ff9999; margin: 20px; border-radius: 8px;">
        <h2>❌ Error cargando perfil</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Revisa la consola para más detalles.</p>
      </div>`;
    }
  });
  registerRoute('/receta/:id', async (rootEl, params) => {
    try {
      const userStatus = await window.getUserStatus();
      if (userStatus.isGuest) showRegistrationRequiredPage(rootEl, 'receta');
      else showSPA(rootEl, renderRecipeDetailPage, params.id);
    } catch (error) {
      console.error('❌ Error en ruta /receta/:id:', error);
      rootEl.innerHTML = `<div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid #ff9999; margin: 20px; border-radius: 8px;">
        <h2>❌ Error cargando receta</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Revisa la consola para más detalles.</p>
      </div>`;
    }
  });
  registerRoute('/webhook/gumroad', async (rootEl, params) => {
    try {
      // Handle webhook from Gumroad
      const response = await handleGumroadWebhook(new Request(window.location.href, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
      }));
      rootEl.innerHTML = `<div style="padding: 20px; color: green; background: #e6ffe6; border: 1px solid #99ff99; margin: 20px; border-radius: 8px;">
        <h2>✅ Webhook procesado</h2>
        <p>Estado: ${response.status}</p>
      </div>`;
    } catch (error) {
      console.error('❌ Error procesando webhook:', error);
      rootEl.innerHTML = `<div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid #ff9999; margin: 20px; border-radius: 8px;">
        <h2>❌ Error en webhook</h2>
        <p><strong>Error:</strong> ${error.message}</p>
      </div>`;
    }
  });

  // Initialize router when DOM is ready
  function initializeRouter() {
    console.log('🚀 Inicializando router...');
    const appRoot = document.getElementById('app-root');
    console.log('📍 Elemento app-root encontrado:', !!appRoot);
    if (!appRoot) {
      console.error('❌ app-root not found, cannot initialize router');
      return;
    }
    startRouter(appRoot, (el, path) => {
      console.log('❌ Route not found for path:', path);
      el.innerHTML = `
        <section class="container" style="padding:80px 0;">
          <h2>Página no encontrada</h2>
          <p>La ruta <code>${path}</code> no existe.</p>
          <p><a href="#/">Volver al inicio</a>.</p>
        </section>
      `;
      highlightActiveLink();
    });

    setupMobileNav();
    initChatWidget();
    renderAuthNav();
    setupAccountDropdown();

    // Initialize checkout modals after DOM is ready
    window.checkoutModalStore = new CheckoutModalStore();
    window.checkoutModalBoxes = new CheckoutModalBoxes();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRouter);
  } else {
    initializeRouter();
  }

  window.addEventListener('hashchange', renderAuthNav);

  if (typeof supabase !== 'undefined' && supabase.auth) {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        renderAuthNav();
      }
    });
  }
})();

// --- Core Rendering Functions ---

function escapeHtml(s) { return (s || '').replace(/[&<>'"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

// Controlador global para el dropdown de cuenta
let accountDropdownInitialized = false;
function setupAccountDropdown() {
  if (accountDropdownInitialized) return;
  accountDropdownInitialized = true;
  // Toggle al click en el botón
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.account-btn');
    const openMenus = document.querySelectorAll('.account-menu.open');
    // Cerrar todos por defecto
    openMenus.forEach(m => {
      const b = document.getElementById(m.getAttribute('aria-labelledby'));
      if (b) b.setAttribute('aria-expanded', 'false');
      m.classList.remove('open');
    });
    if (btn) {
      const dd = btn.closest('.account-dropdown');
      const menu = dd?.querySelector('.account-menu');
      if (menu) {
        const willOpen = !menu.classList.contains('open');
        if (willOpen) {
          menu.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          // Evitar que cierre instantáneamente
          e.stopPropagation();
        }
      }
    }
  });
  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.account-menu.open').forEach(m => {
        const b = document.getElementById(m.getAttribute('aria-labelledby'));
        if (b) b.setAttribute('aria-expanded', 'false');
        m.classList.remove('open');
      });
    }
  });
}

function setupMobileNav() {
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  if (!mobileMenu || !navLinks) return;
  mobileMenu.addEventListener('click', () => {
    const isShown = getComputedStyle(navLinks).display !== 'none';
    navLinks.style.display = isShown ? 'none' : 'flex';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }
    });
  });
}

async function renderAuthNav() {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;
  
  console.log('🔄 Rendering auth navigation...');
  
  let user = null;
  try {
    user = await window.getUser();
  } catch (error) {
    console.warn('⚠️ Error getting user for nav:', error);
  }

  // Limpia elementos de cuenta previos (dropdown de cuenta y similares)
  nav.querySelectorAll('[data-auth-item]').forEach(el => el.remove());

  // Referencias a pestañas básicas y premium existentes en el DOM
  const basicTabs = nav.querySelectorAll('.basic-tab');
  const premiumTabs = nav.querySelectorAll('.premium-tab');

  console.log('👤 User for nav:', user ? 'authenticated' : 'guest');
  console.log('📊 Basic tabs found:', basicTabs.length);
  console.log('📊 Premium tabs found:', premiumTabs.length);

  if (user) {
    // Usuario autenticado: ocultar básicas (excepto inicio), mostrar premium
    basicTabs.forEach(el => {
      const link = el.querySelector('a');
      const href = link ? link.getAttribute('href') : '';
      if (href === '#/' || href === '#/inicio') {
        // Mantener "Inicio" visible pero cambiar texto a "Dashboard"
        if (link) link.textContent = 'Dashboard';
        el.classList.remove('hidden');
        el.style.display = '';
      } else {
        // Ocultar Login y Registro
        el.classList.add('hidden');
        el.style.display = 'none';
      }
    });
    premiumTabs.forEach(el => { 
      el.classList.remove('hidden'); 
      el.style.display = ''; 
    });

    // Agregar menú de cuenta (con ARIA) - usando utilidades de formato
    const userInfo = window.formatUserInfo ? window.formatUserInfo(user) : null;
    const display = userInfo ? userInfo.fullName : (user.user_metadata?.full_name || user.email || 'Mi Cuenta');
    const displayWithEmoji = userInfo ? `👤 ${userInfo.fullName}` : display;
    
    const li = document.createElement('li');
    li.dataset.authItem = 'account';
    const btnId = 'accbtn-' + Math.random().toString(36).slice(2, 8);
    li.innerHTML = `
      <div class="account-dropdown">
        <button class="account-btn" aria-haspopup="true" aria-expanded="false" id="${btnId}">
          ${escapeHtml(displayWithEmoji)} <i class="fas fa-chevron-down" aria-hidden="true"></i>
        </button>
        <div class="account-menu glass" role="menu" aria-labelledby="${btnId}">
          <a href="#/perfil" class="account-link" role="menuitem">Mi Perfil</a>
          <button id="navSignOut" class="account-link btn-linklike" role="menuitem">Cerrar Sesión</button>
        </div>
      </div>
    `;
    nav.appendChild(li);
    
    // Manejar sign-out con protección doble click
    const signOutBtn = li.querySelector('#navSignOut');
    signOutBtn.addEventListener('click', async () => {
      try {
        signOutBtn.disabled = true;
        if (typeof window.signOut === 'function') {
          await window.signOut();
        }
        // Limpiar datos locales
        localStorage.removeItem('fruvi_user');
        console.log('✅ User signed out');
      } catch (error) {
        console.error('❌ Error signing out:', error);
      } finally {
        location.hash = '#/';
        location.reload(); // Forzar recarga para limpiar estado
      }
    });
  } else {
    // Invitado: mostrar básicas, ocultar premium
    basicTabs.forEach(el => { 
      const link = el.querySelector('a');
      const href = link ? link.getAttribute('href') : '';
      if (href === '#/' || href === '#/inicio') {
        // Restaurar texto "Inicio" para invitados
        if (link) link.textContent = 'Inicio';
      }
      el.classList.remove('hidden'); 
      el.style.display = ''; 
    });
    premiumTabs.forEach(el => { 
      el.classList.add('hidden'); 
      el.style.display = 'none'; 
    });
  }

  // Inicializar controlador global del dropdown (una sola vez)
  setupAccountDropdown();
  
  console.log('✅ Auth navigation rendered');
}

// --- Global Initializers ---

window.refreshNavigation = renderAuthNav;

function highlightActiveLink() {
  const path = getCurrentPath();
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === `#${path}` || (path === '/' && href === '#/')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

function showSPA(rootEl, renderFn, ...args) {
  console.log('🎨 showSPA called with:', { rootEl: !!rootEl, renderFn: typeof renderFn, args });
  if (!rootEl) {
    console.error('❌ No rootEl found for rendering');
    return;
  }
  rootEl.innerHTML = '';
  console.log('📝 Cleared rootEl content');
  try {
    renderFn(rootEl, ...args);
    console.log('✅ Render function executed successfully');
  } catch (error) {
    console.error('❌ Error executing render function:', error);
  }
  highlightActiveLink();
  renderAuthNav();
}

function showRegistrationRequiredPage(rootEl, pageName) {
  if (!rootEl) return;
  const pageTitles = { 
    nutricion: 'Nutrición', 
    asistente: 'Asistente IA', 
    recetas: 'Recetas', 
    perfil: 'Perfil', 
    receta: 'Receta', 
    tienda: 'Tienda',
    cajas: 'Cajas',
    dashboard: 'Dashboard'
  };
  const pageTitle = pageTitles[pageName] || 'Esta página';
  const pageDescriptions = {
    tienda: 'comprar frutas premium',
    cajas: 'suscribirte a cajas de frutas',
    nutricion: 'obtener planes nutricionales personalizados',
    asistente: 'usar nuestro asistente de IA',
    recetas: 'acceder a recetas exclusivas',
    dashboard: 'ver tu panel de control personalizado'
  };
  const pageDesc = pageDescriptions[pageName] || 'acceder a esta función';
  
  rootEl.innerHTML = `
    <section class="registration-required-page">
      <div class="container">
        <div class="registration-required-content glass">
          <div class="required-icon"><i class="fas fa-user-lock"></i></div>
          <h2>¡Únete a Fruvi!</h2>
          <p class="required-message">Para ${pageDesc} necesitas crear una cuenta gratuita.</p>
          <div class="required-benefits">
            <div class="benefit-item">
              <i class="fas fa-check-circle"></i>
              <span>Acceso completo a la tienda premium</span>
            </div>
            <div class="benefit-item">
              <i class="fas fa-check-circle"></i>
              <span>Dashboard personalizado con estadísticas</span>
            </div>
            <div class="benefit-item">
              <i class="fas fa-check-circle"></i>
              <span>Asistente de IA y planes nutricionales</span>
            </div>
          </div>
          <div class="required-actions">
            <button class="btn-primary register-now" onclick="window.location.hash='#/registro'">
              <i class="fas fa-user-plus"></i> Crear Cuenta Gratis
            </button>
            <button class="btn-outline has-account" onclick="window.location.hash='#/login'">
              <i class="fas fa-sign-in-alt"></i> Ya tengo cuenta
            </button>
          </div>
          <p class="required-note">
            <i class="fas fa-info-circle"></i>
            El registro es 100% gratuito y toma menos de 1 minuto
          </p>
        </div>
      </div>
    </section>
  `;
  highlightActiveLink();
  renderAuthNav();
}
