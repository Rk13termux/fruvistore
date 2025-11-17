/**
 * =====================================================
 * PROFESSIONAL NAVIGATION MENU - FRUVI
 * Mobile, Tablet & Desktop Responsive System
 * =====================================================
 */

(function() {
  'use strict';

  // Elementos del DOM
  let hamburgerBtn, mobileMenu, mobileMenuOverlay, mobileMenuClose, mobileMenuNav;
  let navLinks, isMenuOpen = false;

  /**
   * Inicializar elementos del DOM
   */
  function initializeElements() {
    hamburgerBtn = document.getElementById('hamburgerBtn');
    mobileMenu = document.getElementById('mobileMenu');
    mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    mobileMenuClose = document.getElementById('mobileMenuClose');
    mobileMenuNav = document.querySelector('.mobile-menu-nav');
    navLinks = document.querySelector('.nav-links');

    if (!hamburgerBtn || !mobileMenu || !mobileMenuOverlay) {
      console.warn('⚠️ Elementos del menú no encontrados');
      return false;
    }
    return true;
  }

  /**
   * Abrir menú móvil con animación
   */
  function openMenu() {
    if (isMenuOpen) return;
    
    isMenuOpen = true;
    hamburgerBtn.classList.add('active');
    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    
    // Animar items del menú
    animateMenuItems();
    
    console.log('📱 Menú móvil abierto');
  }

  /**
   * Cerrar menú móvil con animación
   */
  function closeMenu() {
    if (!isMenuOpen) return;
    
    isMenuOpen = false;
    hamburgerBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
    
    console.log('❌ Menú móvil cerrado');
  }

  /**
   * Toggle menú (abrir/cerrar)
   */
  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /**
   * Animar items del menú cuando se abre
   */
  function animateMenuItems() {
    const menuItems = mobileMenuNav?.querySelectorAll('a');
    if (!menuItems) return;

    menuItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(30px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, 100 + (index * 50));
    });
  }

  /**
   * Sincronizar items del menú móvil desde desktop
   */
  function syncMobileMenu() {
    if (!navLinks || !mobileMenuNav) {
      console.warn('⚠️ No se pueden sincronizar menus: elementos no encontrados');
      return;
    }

    // Limpiar menú móvil
    mobileMenuNav.innerHTML = '';

    // Copiar items del menú desktop al móvil (incluyendo tabs premium/basic)
    const allNavItems = document.querySelectorAll('.nav-links .nav-item');
    let visibleCount = 0;
    
    allNavItems.forEach(item => {
      // Solo copiar items visibles (no hidden y display no es none)
      const isHidden = item.classList.contains('hidden');
      const isDisplayNone = item.style.display === 'none';
      
      if (isHidden || isDisplayNone) {
        console.log('⏭️ Skipping hidden item:', item.dataset.tab || item.querySelector('a')?.textContent);
        return; // Skip hidden items
      }

      const link = item.querySelector('.nav-link');
      if (!link) return;

      visibleCount++;
      const mobileLink = document.createElement('a');
      mobileLink.href = link.getAttribute('href');
      mobileLink.innerHTML = link.innerHTML;
      
      // Copiar clases si es necesario
      if (link.classList.contains('active')) {
        mobileLink.classList.add('active');
      }

      // Cerrar menú al hacer click en un item
      mobileLink.addEventListener('click', () => {
        closeMenu();
      });

      mobileMenuNav.appendChild(mobileLink);
      console.log('✅ Item agregado al menú móvil:', link.textContent?.trim());
    });

    // También copiar el menú de cuenta si existe
    const accountDropdown = document.querySelector('.nav-links .account-dropdown');
    if (accountDropdown) {
      const accountLinks = accountDropdown.querySelectorAll('.account-link');
      
      // Agregar separador
      if (mobileMenuNav.children.length > 0) {
        const separator = document.createElement('div');
        separator.style.cssText = 'height: 1px; background: rgba(255,155,64,0.2); margin: 1rem 0;';
        mobileMenuNav.appendChild(separator);
      }

      // Agregar links de cuenta
      accountLinks.forEach(accountLink => {
        const mobileAccountLink = document.createElement('a');
        
        if (accountLink.tagName === 'A') {
          mobileAccountLink.href = accountLink.getAttribute('href');
          mobileAccountLink.innerHTML = accountLink.innerHTML;
        } else if (accountLink.tagName === 'BUTTON') {
          mobileAccountLink.href = '#';
          mobileAccountLink.innerHTML = accountLink.innerHTML;
          mobileAccountLink.addEventListener('click', (e) => {
            e.preventDefault();
            accountLink.click(); // Trigger original button click
            closeMenu();
          });
        }

        mobileAccountLink.addEventListener('click', () => {
          if (mobileAccountLink.href !== '#') {
            closeMenu();
          }
        });

        mobileMenuNav.appendChild(mobileAccountLink);
      });
      
      console.log('👤 Menú de cuenta agregado al móvil');
    }

    console.log(`🔄 Menú móvil sincronizado - ${visibleCount} items visibles, ${mobileMenuNav.children.length} items totales en mobile`);
  }

  /**
   * Manejar cambio de tamaño de ventana
   */
  let resizeTimer;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Cerrar menú si se cambia a desktop
      if (window.innerWidth > 640 && isMenuOpen) {
        closeMenu();
      }
    }, 250);
  }

  /**
   * Marcar link activo según la URL
   */
  function updateActiveLink() {
    const currentHash = window.location.hash || '#/';
    
    // Desktop nav
    const desktopLinks = navLinks?.querySelectorAll('.nav-link');
    desktopLinks?.forEach(link => {
      if (link.getAttribute('href') === currentHash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Mobile nav
    const mobileLinks = mobileMenuNav?.querySelectorAll('a');
    mobileLinks?.forEach(link => {
      if (link.getAttribute('href') === currentHash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Cerrar menú con tecla Escape
   */
  function handleKeydown(e) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  }

  /**
   * Manejar clicks en overlay
   */
  function handleOverlayClick() {
    if (isMenuOpen) {
      closeMenu();
    }
  }

  /**
   * Actualizar visibilidad de tabs según usuario
   */
  function updateTabsVisibility() {
    // Esta función será llamada desde app.js cuando cambie el estado del usuario
    syncMobileMenu();
  }

  /**
   * Agregar efecto de scroll al header
   */
  let lastScroll = 0;
  function handleScroll() {
    const header = document.querySelector('.header');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }

  /**
   * Observar cambios en el menú desktop para auto-sincronizar mobile
   */
  function setupNavObserver() {
    if (!navLinks) return;

    const observer = new MutationObserver((mutations) => {
      let shouldSync = false;

      mutations.forEach(mutation => {
        // Detectar cambios en clases (hidden/visible)
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          shouldSync = true;
        }
        // Detectar cambios en display style
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          shouldSync = true;
        }
        // Detectar adición/eliminación de nodos
        if (mutation.type === 'childList') {
          shouldSync = true;
        }
      });

      if (shouldSync) {
        console.log('🔍 Cambios detectados en navegación, sincronizando...');
        setTimeout(syncMobileMenu, 50);
      }
    });

    // Observar el nav-links y sus hijos
    observer.observe(navLinks, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    console.log('👀 Observer de navegación activado');
  }

  /**
   * Inicializar todo
   */
  function init() {
    console.log('🚀 Inicializando menú de navegación profesional...');

    if (!initializeElements()) {
      return;
    }

    // Sincronizar menú móvil inicialmente
    syncMobileMenu();

    // Setup observer para auto-sync
    setupNavObserver();

    // Event Listeners
    hamburgerBtn?.addEventListener('click', toggleMenu);
    mobileMenuClose?.addEventListener('click', closeMenu);
    mobileMenuOverlay?.addEventListener('click', handleOverlayClick);
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hashchange', updateActiveLink);

    // Marcar link activo inicial
    updateActiveLink();

    console.log('✅ Menú de navegación inicializado correctamente');
  }

  // Exponer funciones globales para uso externo
  window.MenuNavigation = {
    open: openMenu,
    close: closeMenu,
    toggle: toggleMenu,
    updateTabs: updateTabsVisibility,
    syncMenu: syncMobileMenu,
    updateActive: updateActiveLink
  };

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
