// Script de diagnóstico para verificar funciones disponibles
console.log('🔍 === DIAGNÓSTICO DE FUNCIONES DISPONIBLES ===\n');

// Verificar funciones críticas
const criticalFunctions = [
  'signInWithEmail',
  'signUpWithEmail', 
  'getUser',
  'getUserStatus',
  'setupSupabase',
  'checkSupabaseConfig'
];

console.log('📋 Funciones críticas:');
criticalFunctions.forEach(func => {
  const available = typeof window[func] === 'function';
  console.log(`${available ? '✅' : '❌'} ${func}: ${available ? 'Disponible' : 'NO DISPONIBLE'}`);
});

console.log('\n🔧 Funciones disponibles en window (primeras 20):');
const windowFunctions = Object.keys(window)
  .filter(key => typeof window[key] === 'function' && key.includes('Supabase'))
  .sort();

windowFunctions.slice(0, 20).forEach(func => {
  console.log(`✅ ${func}`);
});

if (windowFunctions.length > 20) {
  console.log(`... y ${windowFunctions.length - 20} funciones más`);
}

console.log('\n💡 === INSTRUCCIONES ===');
console.log('1. Abre consola del navegador (F12)');
console.log('2. Ejecuta: window.signInWithEmail');
console.log('3. Si dice "is not a function", significa que el archivo no se cargó correctamente');
console.log('4. Si aparece la función, entonces hay un problema de inicialización');

console.log('\n🚀 === COMANDO RÁPIDO ===');
console.log('Para verificar manualmente, ejecuta en consola:');
console.log('typeof window.signInWithEmail');
