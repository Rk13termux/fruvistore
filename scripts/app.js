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
import { checkoutModal } from './components/checkoutModal.js';

// --- Core Rendering Functions ---

function showSPA(rootEl, renderFn, ...args) {
  if (!rootEl) return;
  rootEl.innerHTML = '';
  renderFn(rootEl, ...args);
  highlightActiveLink();
  renderAuthNav();
}

function showRegistrationRequiredPage(rootEl, pageName) {
  if (!rootEl) return;
  const pageTitles = { nutricion: 'Nutrición', asistente: 'Asistente IA', recetas: 'Recetas', perfil: 'Perfil', receta: 'Receta', tienda: 'Tienda' };
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

// --- Route Registration ---

registerRoute('/', (rootEl, params) => showSPA(rootEl, renderHomePage));
registerRoute('', (rootEl, params) => showSPA(rootEl, renderHomePage));
registerRoute('/tienda', async (rootEl, params) => {
  const userStatus = await window.getUserStatus();
  if (userStatus.isGuest) showRegistrationRequiredPage(rootEl, 'tienda');
  else showSPA(rootEl, renderStorePage);
});
registerRoute('/registro', async (rootEl, params) => {
  const user = await window.getUser();
  if (user) {
    location.hash = '#/';
    return;
  }
  showSPA(rootEl, renderRegistrationPage);
});
registerRoute('/login', async (rootEl, params) => {
  const user = await window.getUser();
  if (user) {
    location.hash = '#/';
    return;
  }
  showSPA(rootEl, renderLoginPage);
});

registerRoute('/nutricion', async (rootEl, params) => {
  const userStatus = await window.getUserStatus();
  if (userStatus.isGuest) showRegistrationRequiredPage(rootEl, 'nutricion');
  else showSPA(rootEl, renderNutritionPage);
});

registerRoute('/asistente', async (rootEl, params) => {
  const userStatus = await window.getUserStatus();
  if (userStatus.isGuest) showRegistrationRequiredPage(rootEl, 'asistente');
  else showSPA(rootEl, renderAssistantPage);
});

registerRoute('/recetas', async (rootEl, params) => {
  const userStatus = await window.getUserStatus();
  if (userStatus.isGuest) showRegistrationRequiredPage(rootEl, 'recetas');
  else showSPA(rootEl, renderRecipesBlogPage);
});

registerRoute('/perfil', async (rootEl, params) => {
  const userStatus = await window.getUserStatus();
  if (userStatus.isGuest) showRegistrationRequiredPage(rootEl, 'perfil');
  else showSPA(rootEl, renderProfilePage);
});

registerRoute('/receta/:id', async (rootEl, params) => {
  const userStatus = await window.getUserStatus();
  if (userStatus.isGuest) {
    showRegistrationRequiredPage(rootEl, 'receta');
    return;
  }
  showSPA(rootEl, renderRecipeDetailPage, params.id);
});

// --- Router & App Initialization ---

if (!location.hash || location.hash === '#') {
  location.replace('#/');
}

startRouter(document.getElementById('app-root'), (el, path) => {
  el.innerHTML = `
    <section class="container" style="padding:80px 0;">
      <h2>Página no encontrada</h2>
      <p>La ruta <code>${path}</code> no existe.</p>
      <p><a href="#/">Volver al inicio</a>.</p>
    </section>
  `;
  highlightActiveLink();
});

// --- UI Helpers & Event Listeners ---

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

    // Agregar menú de cuenta
    const display = user.user_metadata?.full_name || user.email || 'Mi Cuenta';
    const li = document.createElement('li');
    li.dataset.authItem = 'account';
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
    // Dropdown toggle/open/close behavior
    const btn = li.querySelector('.account-btn');
    const menu = li.querySelector('.account-menu');
    const closeMenu = () => menu.classList.remove('open');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!li.contains(e.target)) closeMenu();
    }, { once: true });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); }, { once: true });

    li.querySelector('#navSignOut').addEventListener('click', async () => {
      await window.signOut();
      location.hash = '#/';
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
}

function escapeHtml(s) { return (s || '').replace(/[&<>'"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

// --- Global Initializers ---

window.checkoutModal = checkoutModal;
window.refreshNavigation = renderAuthNav;

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  initChatWidget();
  renderAuthNav();
  // Observe nav changes and enforce visibility to avoid race conditions
  const nav = document.querySelector('.nav-links');
  if (nav) {
    const observer = new MutationObserver(() => { renderAuthNav(); });
    observer.observe(nav, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
  }
});

window.addEventListener('hashchange', renderAuthNav);

if (typeof supabase !== 'undefined' && supabase.auth) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
      renderAuthNav();
    }
  });
}
