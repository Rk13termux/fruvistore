// App bootstrap
import { startRouter, registerRoute, getCurrentPath } from './router.js';
import { renderHomePage } from './pages/home.js';
import { renderStorePage } from './pages/store.js';
import { renderNutritionPage } from './pages/nutrition.js';
import { renderAssistantPage } from './pages/assistant.js';
import { renderRegistrationPage } from './pages/registration.js';
import { renderLoginPage } from './pages/login.js';
import { renderProfilePage } from './pages/profile.js';
import { renderRecipesBlogPage } from './pages/recipes.js';
import { renderRecipeDetailPage } from './pages/recipeDetail.js';
import { initChatWidget } from './components/chatWidget.js';
import { getUser, signOut, getUserStatus } from './services/supabaseService.js';
import { checkoutModal } from './components/checkoutModal.js';

function showSPA(renderFn) {
  const root = document.getElementById('app-root');
  if (!root) return;
  root.innerHTML = '';
  renderFn(root);
  highlightActiveLink();
  renderAuthNav();
}

// Función para mostrar página de registro requerido
function showRegistrationRequiredPage(pageName) {
  const root = document.getElementById('app-root');
  if (!root) return;

  const pageTitles = {
    nutricion: 'Nutrición',
    asistente: 'Asistente IA',
    recetas: 'Recetas',
    perfil: 'Perfil',
    receta: 'Receta'
  };

  const pageTitle = pageTitles[pageName] || 'Esta página';

  root.innerHTML = `
    <section class="registration-required-page">
      <div class="container">
        <div class="registration-required-content glass">
          <div class="required-icon">
            <i class="fas fa-user-lock"></i>
          </div>
          <h2>¡Esta función requiere registro!</h2>
          <p class="required-message">
            Para acceder a <strong>${pageTitle}</strong> necesitas crear una cuenta en Fruvi.
            El registro es completamente gratuito y te da acceso a funciones exclusivas.
          </p>

          <div class="required-benefits">
            <h3>Beneficios de registrarte:</h3>
            <div class="benefits-list">
              <div class="benefit-item">
                <i class="fas fa-shopping-cart"></i>
                <span>Compra frutas frescas</span>
              </div>
              <div class="benefit-item">
                <i class="fas fa-truck"></i>
                <span>Entrega a domicilio</span>
              </div>
              <div class="benefit-item">
                <i class="fas fa-star"></i>
                <span>Programa de fidelidad</span>
              </div>
              <div class="benefit-item">
                <i class="fas fa-bell"></i>
                <span>Notificaciones personalizadas</span>
              </div>
            </div>
          </div>

          <div class="required-actions">
            <button class="btn-primary register-now" onclick="window.location.hash='#/registro'">
              <i class="fas fa-user-plus"></i>
              Crear Cuenta Gratis
            </button>
            <button class="btn-outline back-to-store" onclick="window.location.hash='#/tienda'">
              <i class="fas fa-store"></i>
              Ver Tienda
            </button>
          </div>
        </div>
      </div>
    </section>
  `;

  highlightActiveLink();
  renderAuthNav();
}

// Register routes
registerRoute('/', () => showSPA(renderHomePage));
registerRoute('', () => showSPA(renderHomePage));
registerRoute('/tienda', async () => {
  const userStatus = await getUserStatus();
  if (userStatus.isGuest) {
    showSPA(renderStorePage);
  } else {
    showSPA(renderStorePage);
  }
});
registerRoute('/nutricion', async () => {
  const userStatus = await getUserStatus();
  if (userStatus.isGuest) {
    showRegistrationRequiredPage('nutricion');
  } else {
    showSPA(renderNutritionPage);
  }
});
registerRoute('/asistente', async () => {
  const userStatus = await getUserStatus();
  if (userStatus.isGuest) {
    showRegistrationRequiredPage('asistente');
  } else {
    showSPA(renderAssistantPage);
  }
});
registerRoute('/recetas', async () => {
  const userStatus = await getUserStatus();
  if (userStatus.isGuest) {
    showRegistrationRequiredPage('recetas');
  } else {
    showSPA(renderRecipesBlogPage);
  }
});
registerRoute('/registro', () => showSPA(renderRegistrationPage));
registerRoute('/login', () => showSPA(renderLoginPage));
registerRoute('/configuracion', () => showSPA(renderConfigPage));
registerRoute('/perfil', async () => {
  const userStatus = await getUserStatus();
  if (userStatus.isGuest) {
    showRegistrationRequiredPage('perfil');
  } else {
    showSPA(renderProfilePage);
  }
});

// Dynamic recipe routes (solo para usuarios registrados)
registerRoute('/receta/:id', async (params) => {
  const userStatus = await getUserStatus();
  if (userStatus.isGuest) {
    showRegistrationRequiredPage('receta');
  } else {
    const root = document.getElementById('app-root');
    if (!root) return;
    root.innerHTML = '';
    renderRecipeDetailPage(root, params.id);
    highlightActiveLink();
    renderAuthNav();
  }
});

// Ensure default route hash
if (!location.hash || location.hash === '#') {
  location.replace('#/');
}

// Start router
const root = document.getElementById('app-root');
startRouter(root, (el, path) => {
  // simple 404 inside SPA
  el.style.display = 'block';
  el.innerHTML = `
    <section class="container" style="padding:80px 0;">
      <h2>Página no encontrada</h2>
      <p>La ruta <code>${path}</code> no existe.</p>
      <p><a href="#/nutricion-ai">Ir a Nutrición AI</a> o <a href="#/">volver al inicio</a>.</p>
    </section>
  `;
  highlightActiveLink();
});

// Helpers
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

// Mobile menu toggle and auto-close on navigation
function setupMobileNav() {
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  if (!mobileMenu || !navLinks) return;
  if (!mobileMenu.__wired) {
    mobileMenu.__wired = true;
    mobileMenu.addEventListener('click', () => {
      const isShown = getComputedStyle(navLinks).display !== 'none';
      navLinks.style.display = isShown ? 'none' : 'flex';
      if (!isShown) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = '#27ae60';
        navLinks.style.padding = '1rem';
      }
    });
  }
  navLinks.querySelectorAll('a').forEach(a => {
    if (a.__wired) return;
    a.__wired = true;
    a.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }
    });
  });
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', setupMobileNav);
} else {
  setupMobileNav();
}

// Initial render handled by router; make sure active link highlights on load
requestAnimationFrame(highlightActiveLink);

// --- Auth-aware Navbar ---
async function renderAuthNav() {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;
  const user = await getUser();

  // Remove existing auth items
  nav.querySelectorAll('li[data-auth-item]')?.forEach(li => li.remove());
  // Also remove any static Login/Registro links to avoid duplicates
  nav.querySelectorAll('li > a[href="#/login"], li > a[href="#/registro"]').forEach(a => a.parentElement?.remove());

  // Show/hide premium tabs based on user status
  const premiumTabs = nav.querySelectorAll('.premium-tab');
  if (user) {
    // User is registered - show premium tabs
    premiumTabs.forEach(tab => {
      tab.classList.remove('hidden');
      tab.style.display = 'block';
      tab.style.opacity = '1';
      tab.style.visibility = 'visible';
    });
  } else {
    // User is not registered - hide premium tabs
    premiumTabs.forEach(tab => {
      tab.classList.add('hidden');
      tab.style.display = 'none';
      tab.style.opacity = '0';
      tab.style.visibility = 'hidden';
    });
  }

  if (user) {
    // Build account dropdown
    const display = user.user_metadata?.full_name || user.email || 'Mi Cuenta';
    const li = document.createElement('li');
    li.setAttribute('data-auth-item','account');
    li.innerHTML = `
      <div class="account-dropdown">
        <button class="account-btn">${escapeHtml(display)} <i class="fas fa-chevron-down"></i></button>
        <div class="account-menu glass">
          <a href="#/perfil" class="account-link">Mi Cuenta</a>
          <button id="navSignOut" class="account-link btn-linklike">Salir</button>
        </div>
      </div>
    `;
    nav.appendChild(li);

    // Wire dropdown
    const btn = li.querySelector('.account-btn');
    const menu = li.querySelector('.account-menu');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', () => menu.classList.remove('open'), { once: true });

    // Wire sign out
    li.querySelector('#navSignOut').addEventListener('click', async () => {
      await signOut();
      renderAuthNav();
      location.hash = '#/';
    });
  } else {
    // Show Login / Registro for non-registered users
    const loginLi = document.createElement('li');
    loginLi.setAttribute('data-auth-item','login');
    loginLi.innerHTML = '<a href="#/login">Login</a>';
    const regLi = document.createElement('li');
    regLi.setAttribute('data-auth-item','register');
    regLi.innerHTML = '<a href="#/registro">Registro</a>';
    nav.appendChild(loginLi);
    nav.appendChild(regLi);
  }
}

function escapeHtml(s){ return (s||'').replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }

// Refresh auth UI on load and on navigation
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    renderAuthNav();
  });
} else {
  // Execute immediately if DOM is already loaded
  renderAuthNav();
}
window.addEventListener('hashchange', () => renderAuthNav());

// Init floating chat widget
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initChatWidget);
} else {
  initChatWidget();
}

// Make checkout modal globally available
window.checkoutModal = checkoutModal;

// Make Supabase service functions globally available
import('./services/supabaseService.js').then(module => {
  window.supabaseService = module;

  // Make key functions available globally for console access
  if (typeof window !== 'undefined') {
    window.getSupabaseConfig = module.getSupabaseConfig;
    window.configureSupabase = module.configureSupabase;
    window.isSupabaseConfigured = module.isSupabaseConfigured;
    window.setupSupabase = function(url, anonKey) {
      if (module.configureSupabase) {
        module.configureSupabase(url, anonKey);
        console.log('✅ Supabase configurado exitosamente');
        console.log('🔄 Recarga la página para aplicar los cambios');
      }
    };
    window.checkSupabaseConfig = function() {
      const config = module.getSupabaseConfig ? module.getSupabaseConfig() : { url: 'No disponible', configured: false, initialized: false };
      console.log('🔍 Configuración actual de Supabase:', config);
      return config;
    };
    window.clearSupabaseConfig = function() {
      localStorage.removeItem('fruvi_supabase_url');
      localStorage.removeItem('fruvi_supabase_anon');
      console.log('🗑️ Configuración de Supabase eliminada');
      console.log('🔄 Recarga la página para aplicar los cambios');
    };
  }
}).catch(error => {
  console.error('Error loading Supabase service:', error);
});

// Página de configuración de Supabase para desarrollo
function renderConfigPage(root) {
  const { getSupabaseConfig, configureSupabase, isSupabaseConfigured } = window.supabaseService || {};

  const config = getSupabaseConfig ? getSupabaseConfig() : { url: 'No disponible', configured: false, initialized: false };

  root.innerHTML = `
    <section class="config-page">
      <div class="container">
        <div class="config-header">
          <h2><i class="fas fa-cog"></i> Configuración Rápida de Supabase</h2>
          <p>Configura tu proyecto de Supabase en menos de 2 minutos</p>
        </div>

        <div class="config-content glass">
          <div class="config-status">
            <h3>Estado Actual</h3>
            <div class="status-item ${config.configured ? 'success' : 'error'}">
              <i class="fas ${config.configured ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
              <span>Configuración: ${config.configured ? 'Completa' : 'Incompleta'}</span>
            </div>
            <div class="status-item ${config.initialized ? 'success' : 'error'}">
              <i class="fas ${config.initialized ? 'fa-check-circle' : 'fa-times-circle'}"></i>
              <span>Cliente inicializado: ${config.initialized ? 'Sí' : 'No'}</span>
            </div>
            <div class="status-item">
              <i class="fas fa-link"></i>
              <span>URL: ${config.url}</span>
            </div>
          </div>

          <div class="quick-setup">
            <h3>🚀 Configuración Rápida (Método 1)</h3>
            <p>Usa la consola del navegador para configurar Supabase instantáneamente:</p>

            <div class="console-commands">
              <div class="command-item">
                <div class="command-number">1</div>
                <div class="command-content">
                  <p><strong>Abre la consola del navegador (F12)</strong></p>
                </div>
              </div>

              <div class="command-item">
                <div class="command-number">2</div>
                <div class="command-content">
                  <p><strong>Copia y pega este comando:</strong></p>
                  <div class="code-snippet">
                    <code>setupSupabase("https://your-project.supabase.co", "eyJ...")</code>
                    <button class="copy-btn" onclick="navigator.clipboard.writeText('setupSupabase(\"https://your-project.supabase.co\", \"eyJ...\")')">
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="command-item">
                <div class="command-number">3</div>
                <div class="command-content">
                  <p><strong>Reemplaza con tus credenciales reales:</strong></p>
                  <ul>
                    <li><code>https://your-project.supabase.co</code> → Tu URL real</li>
                    <li><code>eyJ...</code> → Tu clave "anon public" real</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="config-form">
            <h3>📝 Configuración Manual (Método 2)</h3>
            <p>Si prefieres usar el formulario:</p>

            <form id="supabaseConfigForm">
              <div class="form-group">
                <label for="supabaseUrl">URL del proyecto:</label>
                <input type="url" id="supabaseUrl" placeholder="https://your-project.supabase.co" required>
              </div>

              <div class="form-group">
                <label for="supabaseKey">Clave anónima (anon key):</label>
                <input type="password" id="supabaseKey" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." required>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <i class="fas fa-save"></i>
                  Guardar Configuración
                </button>
                <button type="button" class="btn-outline" onclick="location.reload()">
                  <i class="fas fa-refresh"></i>
                  Recargar Página
                </button>
              </div>
            </form>
          </div>

          <div class="config-instructions">
            <h3>📋 Cómo obtener las credenciales:</h3>

            <div class="instructions-step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>Crear proyecto en Supabase</h4>
                <p>Ve a <a href="https://supabase.com/dashboard" target="_blank">supabase.com/dashboard</a></p>
                <p>➡️ Crea un proyecto nuevo o selecciona uno existente</p>
              </div>
            </div>

            <div class="instructions-step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>Copiar URL del proyecto</h4>
                <p>En tu dashboard, copia la "Project URL"</p>
                <p class="example">Ejemplo: <code>https://abcdefghijk.supabase.co</code></p>
              </div>
            </div>

            <div class="instructions-step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>Obtener clave API</h4>
                <p>Ve a <strong>Settings > API</strong></p>
                <p>Copia la clave <strong>"anon public"</strong></p>
                <p class="example">Empieza con: <code>eyJhbGciOiJIUzI1Ni...</code></p>
              </div>
            </div>
          </div>

          <div class="config-troubleshooting">
            <h3>🔧 Solución de problemas</h3>
            <div class="troubleshooting-item">
              <strong>¿No tienes proyecto de Supabase?</strong>
              <p>✅ Crea uno gratuito en <a href="https://supabase.com" target="_blank">supabase.com</a></p>
            </div>
            <div class="troubleshooting-item">
              <strong>¿Problemas con la clave API?</strong>
              <p>⚠️ Asegúrate de copiar la clave "anon public" y NO la "service_role"</p>
            </div>
            <div class="troubleshooting-item">
              <strong>¿Sigue sin funcionar?</strong>
              <p>🔍 Usa <code>checkSupabaseConfig()</code> en la consola para ver el estado</p>
            </div>
            <div class="troubleshooting-item">
              <strong>¿Quieres limpiar configuración?</strong>
              <p>🗑️ Usa <code>clearSupabaseConfig()</code> en la consola</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Setup form handler
  const form = document.getElementById('supabaseConfigForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const urlInput = document.getElementById('supabaseUrl');
      const keyInput = document.getElementById('supabaseKey');

      const url = urlInput.value.trim();
      const key = keyInput.value.trim();

      if (!url || !key) {
        showNotification('Por favor completa todos los campos', false);
        return;
      }

      try {
        if (configureSupabase) {
          configureSupabase(url, key);
          showNotification('✅ Configuración guardada correctamente. Recarga la página.', true);

          // Update status display
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          showNotification('❌ Función de configuración no disponible', false);
        }
      } catch (error) {
        showNotification(`❌ Error: ${error.message}`, false);
      }
    });
  }
}

// Global function to refresh navigation after login/signup
window.refreshNavigation = () => {
  renderAuthNav();
};

// Listen for auth state changes
if (typeof supabase !== 'undefined' && supabase.auth) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
      renderAuthNav();
    }
  });
}
