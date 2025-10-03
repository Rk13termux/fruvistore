// Solución integral para funciones y control de pestañas
console.log('🚀 === SOLUCIÓN INTEGRAL PARA FUNCIONES Y PESTAÑAS ===\n');

// 1. Verificar funciones críticas
function checkCriticalFunctions() {
  const functions = ['signInWithEmail', 'getUserStatus', 'setupSupabase'];
  let allAvailable = true;
  
  functions.forEach(func => {
    if (typeof window[func] === 'function') {
      console.log(`✅ ${func}: Disponible`);
    } else {
      console.error(`❌ ${func}: NO DISPONIBLE`);
      allAvailable = false;
    }
  });
  
  return allAvailable;
}

// 2. Función para controlar visibilidad de pestañas
function updateTabVisibility() {
  console.log('🔧 Actualizando visibilidad de pestañas...');
  
  if (typeof window.getUserStatus === 'function') {
    try {
      // Obtener estado del usuario
      window.getUserStatus().then(status => {
        console.log('📊 Estado del usuario:', status);
        
        // Controlar visibilidad basado en el estado
        const registeredTabs = document.querySelectorAll('.registered-only');
        const guestTabs = document.querySelectorAll('.guest-only');
        
        if (status.isRegistered) {
          console.log('✅ Usuario registrado - mostrando pestañas para registrados');
          registeredTabs.forEach(tab => tab.style.display = 'block');
          guestTabs.forEach(tab => tab.style.display = 'none');
        } else {
          console.log('❌ Usuario no registrado - mostrando pestañas para invitados');
          registeredTabs.forEach(tab => tab.style.display = 'none');
          guestTabs.forEach(tab => tab.style.display = 'block');
        }
      }).catch(error => {
        console.error('❌ Error obteniendo estado del usuario:', error);
      });
    } catch (error) {
      console.error('❌ Error ejecutando getUserStatus:', error);
    }
  } else {
    console.error('❌ getUserStatus no disponible');
  }
}

// 3. Configurar funciones críticas si no están disponibles
function setupFallbackFunctions() {
  if (typeof window.signInWithEmail !== 'function') {
    console.warn('⚠️ signInWithEmail no disponible, creando función de respaldo');
    
    window.signInWithEmail = async function({ email, password }) {
      console.log('🔄 Usando función de respaldo para signInWithEmail');
      // Aquí puedes implementar lógica alternativa o mostrar mensaje de error
      throw new Error('Función signInWithEmail no disponible. Recarga la página.');
    };
  }
}

// 4. Inicialización automática
function initializeSystem() {
  console.log('🚀 Inicializando sistema...');
  
  // Verificar funciones
  const functionsOk = checkCriticalFunctions();
  
  if (!functionsOk) {
    console.log('💡 Configurando funciones de respaldo...');
    setupFallbackFunctions();
  }
  
  // Actualizar visibilidad de pestañas
  setTimeout(() => {
    updateTabVisibility();
  }, 2000); // Delay para asegurar que todo se cargue
  
  console.log('✅ Sistema inicializado');
}

// Ejecutar inicialización
if (typeof window !== 'undefined') {
  // Si ya hay funciones disponibles, inicializar inmediatamente
  if (typeof window.getUserStatus === 'function') {
    initializeSystem();
  } else {
    // Si no, esperar a que se carguen
    setTimeout(() => {
      initializeSystem();
    }, 3000);
  }
}

// Hacer funciones disponibles globalmente
window.checkCriticalFunctions = checkCriticalFunctions;
window.updateTabVisibility = updateTabVisibility;
window.initializeSystem = initializeSystem;

console.log('💡 Funciones disponibles:');
console.log('- checkCriticalFunctions()');
console.log('- updateTabVisibility()');  
console.log('- initializeSystem()');
