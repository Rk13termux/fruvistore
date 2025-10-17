// App bootstrap
console.log('🚀 Starting app bootstrap...');

// Dynamic imports with error handling
let startRouter, registerRoute, getCurrentPath;
let renderHomePage, renderStorePage, renderBoxesPage;
let renderNutritionPage, renderAssistantPage, renderRegistrationPage, renderLoginPage;
let renderProfilePage, renderRecipesBlogPage, renderRecipeDetailPage;
let initChatWidget, CheckoutModalStore, CheckoutModalBoxes;

async function loadModules() {
  try {
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
  console.log('renderRegistrationPage:', typeof renderRegistrationPage);
  console.log('renderLoginPage:', typeof renderLoginPage);
  console.log('renderProfilePage:', typeof renderProfilePage);
  console.log('renderRecipesBlogPage:', typeof renderRecipesBlogPage);
  console.log('renderRecipeDetailPage:', typeof renderRecipeDetailPage);
  console.log('CheckoutModalStore:', typeof CheckoutModalStore);
  console.log('CheckoutModalBoxes:', typeof CheckoutModalBoxes);

  // --- Route Registration ---

  console.log('📋 Registrando rutas...');
  registerRoute('/', (rootEl, params) => {
    console.log('🏠 Routing to home page');
    try {
      console.log('🔍 Verificando renderHomePage:', typeof renderHomePage);
      showSPA(rootEl, renderHomePage);
    } catch (error) {
      console.error('❌ Error rendering home page:', error);
      rootEl.innerHTML = `<div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid #ff9999; margin: 20px; border-radius: 8px;">
        <h2>❌ Error cargando página de inicio</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p><strong>Stack:</strong> ${error.stack}</p>
        <p>Revisa la consola para más detalles.</p>
      </div>`;
    }
  });
  registerRoute('', (rootEl, params) => {
    console.log('🏠 Routing to empty path (home)');
    try {
      console.log('🔍 Verificando renderHomePage:', typeof renderHomePage);
      showSPA(rootEl, renderHomePage);
    } catch (error) {
      console.error('❌ Error rendering home page:', error);
      rootEl.innerHTML = `<div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid #ff9999; margin: 20px; border-radius: 8px;">
        <h2>❌ Error cargando página de inicio</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p><strong>Stack:</strong> ${error.stack}</p>
        <p>Revisa la consola para más detalles.</p>
      </div>`;
    }
  });
  registerRoute('/tienda', async (rootEl, params) => {
    try {
      const userStatus = await window.getUserStatus();
      if (userStatus.isGuest) showRegistrationRequiredPage(rootEl, 'tienda');
      else showSPA(rootEl, renderStorePage);
    } catch (error) {
      console.error('❌ Error en ruta /tienda:', error);
      rootEl.innerHTML = `<div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid #ff9999; margin: 20px; border-radius: 8px;">
        <h2>❌ Error cargando tienda</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Revisa la consola para más detalles.</p>
      </div>`;
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
      const userStatus = await window.getUserStatus();
      if (userStatus.isGuest) showRegistrationRequiredPage(rootEl, 'nutricion');
      else showSPA(rootEl, renderNutritionPage);
    } catch (error) {
      console.error('❌ Error en ruta /nutricion:', error);
      rootEl.innerHTML = `<div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid #ff9999; margin: 20px; border-radius: 8px;">
        <h2>❌ Error cargando nutrición</h2>
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
  const user = await window.getUser();

  // Limpia elementos de cuenta previos (dropdown de cuenta y similares)
  nav.querySelectorAll('[data-auth-item]').forEach(el => el.remove());

  // Referencias a pestañas básicas y premium existentes en el DOM
  const basicTabs = nav.querySelectorAll('.basic-tab');
  const premiumTabs = nav.querySelectorAll('.premium-tab');

  if (user) {
    // Usuario autenticado: ocultar básicas, mostrar premium
    basicTabs.forEach(el => { el.classList.add('hidden'); el.style.display = 'none'; });
    premiumTabs.forEach(el => { el.classList.remove('hidden'); el.style.display = 'list-item'; });

    // Agregar menú de cuenta (con ARIA)
    const display = user.user_metadata?.full_name || user.email || 'Mi Cuenta';
    const li = document.createElement('li');
    li.dataset.authItem = 'account';
    const btnId = 'accbtn-' + Math.random().toString(36).slice(2, 8);
    li.innerHTML = `
      <div class="account-dropdown">
        <button class="account-btn" aria-haspopup="true" aria-expanded="false" id="${btnId}">
          ${escapeHtml(display)} <i class="fas fa-chevron-down" aria-hidden="true"></i>
        </button>
        <div class="account-menu glass" role="menu" aria-labelledby="${btnId}">
          <a href="#/perfil" class="account-link" role="menuitem">Mi Cuenta</a>
          <button id="navSignOut" class="account-link btn-linklike" role="menuitem">Salir</button>
        </div>
      </div>
    `;
    nav.appendChild(li);
    // Manejar sign-out con protección doble click
    const signOutBtn = li.querySelector('#navSignOut');
    signOutBtn.addEventListener('click', async () => {
      try {
        signOutBtn.disabled = true;
        await window.signOut();
      } finally {
        location.hash = '#/';
        signOutBtn.disabled = false;
      }
    });
  } else {
    // Invitado: mostrar básicas, ocultar premium
    basicTabs.forEach(el => { el.classList.remove('hidden'); el.style.display = ''; });
    premiumTabs.forEach(el => { el.classList.add('hidden'); el.style.display = 'none'; });
    // No agregamos Login/Registro aquí para evitar duplicados; ya existen como .basic-tab en index.html
  }

  // Fallback: explicitly toggle Login/Registro by href in case classes are missing or overridden
  const loginA = nav.querySelector('a[href="#/login"]');
  const registroA = nav.querySelector('a[href="#/registro"]');
  const loginLi = loginA ? loginA.closest('li') : null;
  const registroLi = registroA ? registroA.closest('li') : null;
  if (loginLi && registroLi) {
    if (user) {
      loginLi.style.display = 'none';
      registroLi.style.display = 'none';
    } else {
      loginLi.style.display = '';
      registroLi.style.display = '';
    }
  }

  // Inicializar controlador global del dropdown (una sola vez)
  setupAccountDropdown();
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
    cajas: 'Cajas'
  };
  const pageTitle = pageTitles[pageName] || 'Esta página';
  rootEl.innerHTML = `
    <section class="registration-required-page">
      <div class="container">
        <div class="registration-required-content glass">
          <div class="required-icon"><i class="fas fa-user-lock"></i></div>
          <h2>¡Esta función requiere registro!</h2>
          <p class="required-message">Para acceder a <strong>${pageTitle}</strong> necesitas crear una cuenta en Fruvi.</p>
          <div class="required-actions">
            <button class="btn-primary register-now" onclick="window.location.hash='#/registro'"><i class="fas fa-user-plus"></i> Crear Cuenta Gratis</button>
            <button class="btn-outline back-to-store" onclick="window.location.hash='#/tienda'"><i class="fas fa-store"></i> Ver Tienda</button>
          </div>
        </div>
      </div>
    </section>
  `;
  highlightActiveLink();
  renderAuthNav();
}
