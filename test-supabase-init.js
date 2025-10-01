#!/usr/bin/env node

// Script de prueba para verificar inicialización de Supabase
console.log('🚀 === PRUEBA DE INICIALIZACIÓN DE SUPABASE ===\n');

// Simular ambiente del navegador
global.window = {
  __ENV__: {
    VITE_SUPABASE_URL: 'https://your-project.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'your-anon-key',
    VITE_GROQ_API_KEY: 'placeholder-key-for-github-pages'
  },
  localStorage: {
    store: {},
    getItem: function(key) { return this.store[key] || null; },
    setItem: function(key, value) { this.store[key] = value; console.log('💾 Guardado en localStorage:', key); },
    removeItem: function(key) { delete this.store[key]; console.log('🗑️ Eliminado de localStorage:', key); }
  }
};

// Función de validación
function isValidEnvVar(value) {
  if (!value || typeof value !== 'string') return false;
  if (value.includes('${{') || value.includes('secrets.') || value === 'your-anon-key' || value === 'your-project.supabase.co') {
    return false;
  }
  return true;
}

// Simular el servicio de Supabase
function initializeSupabase() {
  try {
    const url = global.window.__ENV__?.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
    const anonKey = global.window.__ENV__?.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

    console.log('🔄 Intentando inicializar Supabase...');
    console.log('📋 Variables recibidas:');
    console.log('   URL:', url);
    console.log('   KEY:', anonKey ? '***' + anonKey.slice(-4) : 'undefined');

    if (isValidEnvVar(url) && isValidEnvVar(anonKey)) {
      console.log('✅ Variables válidas - Supabase se inicializaría correctamente');
      return { success: true, url, key: '***configured***' };
    } else {
      console.log('❌ Variables NO válidas - Supabase NO se inicializaría');
      console.log('🔍 Debug info:');
      console.log('   URL válida:', isValidEnvVar(url));
      console.log('   KEY válida:', isValidEnvVar(anonKey));
      console.log('   URL es placeholder:', url.includes('your-project'));
      console.log('   KEY es placeholder:', anonKey === 'your-anon-key');
      return { success: false, reason: 'Variables no válidas' };
    }
  } catch (error) {
    console.error('❌ Error inicializando Supabase:', error);
    return { success: false, reason: error.message };
  }
}

// Ejecutar prueba
const result = initializeSupabase();

console.log('\n📊 === RESULTADO DE LA PRUEBA ===');
console.log('Estado:', result.success ? '✅ ÉXITO' : '❌ FALLIDO');
console.log('Razón:', result.reason || 'N/A');

if (result.success) {
  console.log('\n🎉 ¡Supabase se inicializaría correctamente!');
  console.log('✅ Tu aplicación debería funcionar sin problemas');
} else {
  console.log('\n⚠️ Supabase NO se inicializaría automáticamente');
  console.log('💡 Soluciones:');
  console.log('   1. Configurar archivo .env con credenciales reales');
  console.log('   2. Usar funciones de consola: setupSupabase(url, key)');
  console.log('   3. Configurar GitHub secrets para producción');
}
