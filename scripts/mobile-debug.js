// Mobile Debug Script - Auto-diagnóstico
(function() {
  'use strict';
  
  console.log('%c🔍 MOBILE DEBUG INICIADO', 'background: #222; color: #0f0; font-size: 16px; padding: 10px;');
  
  function checkMobileIssues() {
    const width = window.innerWidth;
    const isMobile = width <= 768;
    
    console.log(`📱 Viewport: ${width}px ${isMobile ? '(MÓVIL)' : '(DESKTOP)'}`);
    
    // Verificar botón del menú hamburguesa (nuevo selector)
    const btn = document.getElementById('hamburgerBtn') || document.querySelector('.hamburger');
    if (btn) {
      const styles = window.getComputedStyle(btn);
      console.log('%c✅ Botón hamburguesa encontrado:', 'color: #0f0', {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        width: styles.width,
        height: styles.height,
        position: btn.getBoundingClientRect()
      });
      
      if (isMobile && styles.display === 'none') {
        console.error('❌ ERROR: Botón oculto en móvil!');
        // FORZAR visibilidad
        btn.style.display = 'flex';
        btn.style.visibility = 'visible';
        btn.style.opacity = '1';
        console.log('🔧 Aplicado fix de emergencia al botón');
      }
    } else {
      console.warn('⚠️ Botón hamburguesa no encontrado (probablemente estás en desktop)');
    }
    
    // Verificar scroll horizontal
    const body = document.body;
    const hasHScroll = body.scrollWidth > body.clientWidth;
    
    if (hasHScroll) {
      console.error(`❌ SCROLL HORIZONTAL DETECTADO: ${body.scrollWidth}px > ${body.clientWidth}px`);
      
      // Encontrar elemento que causa scroll
      const allElements = document.querySelectorAll('*');
      const culprits = [];
      allElements.forEach(el => {
        if (el.scrollWidth > window.innerWidth) {
          culprits.push({
            element: el.tagName + (el.className ? `.${el.className.split(' ').join('.')}` : ''),
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth
          });
        }
      });
      
      if (culprits.length > 0) {
        console.table(culprits.slice(0, 10));
      }
      
      // Aplicar fix de emergencia
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';
      console.log('🔧 Aplicado fix de emergencia para scroll horizontal');
    } else {
      console.log('✅ Sin scroll horizontal');
    }
    
    // Verificar header
    const header = document.querySelector('.header');
    if (header) {
      const headerStyles = window.getComputedStyle(header);
      console.log('📋 Header:', {
        position: headerStyles.position,
        width: headerStyles.width,
        maxWidth: headerStyles.maxWidth,
        overflowX: headerStyles.overflowX
      });
    }
  }
  
  // Ejecutar al cargar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkMobileIssues);
  } else {
    checkMobileIssues();
  }
  
  // Ejecutar al redimensionar
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(checkMobileIssues, 500);
  });
  
  console.log('%c💡 Abre DevTools en móvil para ver diagnóstico completo', 'color: #ff9b40; font-weight: bold;');
})();
