// Solución robusta para asegurar funciones disponibles
console.log('🔧 === SOLUCIÓN ROBUSTA PARA FUNCIONES ===\n');

// Función para verificar y asegurar funciones críticas
function ensureCriticalFunctions() {
  const criticalFunctions = [
    'signInWithEmail',
    'signUpWithEmail',
    'getUser',
    'getUserStatus',
    'setupSupabase',
    'checkSupabaseConfig',
    'testSupabaseConnection'
  ];

  console.log('📋 Verificando funciones críticas...');
  
  let missingFunctions = [];
  criticalFunctions.forEach(func => {
    if (typeof window[func] !== 'function') {
      missingFunctions.push(func);
      console.error(`❌ ${func}: NO DISPONIBLE`);
    } else {
      console.log(`✅ ${func}: Disponible`);
    }
  });

  if (missingFunctions.length > 0) {
    console.error(`🚨 Funciones faltantes: ${missingFunctions.join(', ')}`);
    console.log('💡 Posibles soluciones:');
    console.log('1. Recarga la página');
    console.log('2. Verifica que supabaseService.js se cargue correctamente');
    console.log('3. Ejecuta: setupSupabase(url, clave) con tus credenciales reales');
    return false;
  }

  console.log('✅ Todas las funciones críticas disponibles');
  return true;
}

// Ejecutar verificación automática
if (typeof window !== 'undefined') {
  // Pequeño delay para asegurar que todos los scripts se carguen
  setTimeout(() => {
    ensureCriticalFunctions();
  }, 1000);
}

// Hacer la función disponible globalmente
window.ensureCriticalFunctions = ensureCriticalFunctions;

console.log('🚀 Función ensureCriticalFunctions disponible');
console.log('💡 Usa: ensureCriticalFunctions() para verificar manualmente');
