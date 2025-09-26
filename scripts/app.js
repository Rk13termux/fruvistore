// App bootstrap
import { startRouter, registerRoute, getCurrentPath } from './router.js';
import { renderHomePage } from './pages/home.js';
import { renderStorePage } from './pages/store.js';
import { renderNutritionPage } from './pages/nutrition.js';
import { renderAssistantPage } from './pages/assistant.js';
import { renderRegistrationPage } from './pages/registration.js';
import { renderLoginPage } from './pages/login.js';
import { renderProfilePage } from './pages/profile.js';
import { initChatWidget } from './components/chatWidget.js';
import { getUser, signOut } from './services/supabaseService.js';
import { checkoutModal } from './components/checkoutModal.js';

function showSPA(renderFn) {
  const root = document.getElementById('app-root');
  if (!root) return;
  root.innerHTML = '';
  renderFn(root);
  highlightActiveLink();
  renderAuthNav();
}

// Register routes
registerRoute('/', () => showSPA(renderHomePage));
registerRoute('', () => showSPA(renderHomePage));
registerRoute('/tienda', () => showSPA(renderStorePage));
registerRoute('/nutricion', () => showSPA(renderNutritionPage));
registerRoute('/asistente', () => showSPA(renderAssistantPage));
registerRoute('/registro', () => showSPA(renderRegistrationPage));
registerRoute('/login', () => showSPA(renderLoginPage));
registerRoute('/perfil', () => showSPA(renderProfilePage));

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
      location.hash = '#/login';
    });
  } else {
    // Show Login / Registro
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
  window.addEventListener('DOMContentLoaded', renderAuthNav);
} else {
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
