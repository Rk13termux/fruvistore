// Supabase Service: auth + customers helpers (Fruvi)
// Config dinámica: establece en consola o en código
// localStorage.setItem('fruvi_supabase_url', 'https://<project>.supabase.co');
// localStorage.setItem('fruvi_supabase_anon', '<anon-key>');

// Environment variables for GitHub Pages and development
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || window.__ENV__?.VITE_SUPABASE_URL || 'https://ipjkpgmptexkhilrjnsl.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || window.__ENV__?.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Función para validar si una variable de entorno es válida (más tolerante para desarrollo)
function isValidEnvVar(value) {
  if (!value || typeof value !== 'string') return false;

  // Rechazar solo placeholders reales de GitHub Actions
  if (value.includes('${{') || value.includes('secrets.')) {
    return false;
  }

  // En desarrollo local, aceptar placeholders del .env
  // Solo rechazar si NO hay otras fuentes disponibles
  return true;
}

// Utility function to format dates
function formatDate(dateString) {
  return new Date(dateString).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Función para inicializar Supabase manualmente (para desarrollo)
window.initializeSupabase = function initializeSupabase() {
  try {
    // CORRECT: Use the helper function that properly checks localStorage and env vars.
    const { url, anonKey } = getEnvironmentVariables();

    console.log('🔄 initializeSupabase - Variables recibidas:', {
      url: url,
      hasKey: !!anonKey,
      urlType: typeof url,
      keyType: typeof anonKey,
      urlValid: isValidEnvVar(url),
      keyValid: isValidEnvVar(anonKey)
    });

    if (url && anonKey && isValidEnvVar(url) && isValidEnvVar(anonKey)) {
      try {
        console.log('🚀 Creando cliente Supabase con URL:', url);
        supabaseClient = supabase.createClient(url, anonKey);
        console.log('✅ Cliente Supabase creado exitosamente');
        return true;
      } catch (createError) {
        console.error('❌ Error creando cliente Supabase:', createError.message);
        console.error('🔍 Detalles del error:', createError);
        return false;
      }
    } else {
      console.warn('⚠️ Variables no válidas para inicialización automática');
      console.warn('🔧 Estado actual:', {
        url: url,
        hasUrl: !!url,
        hasKey: !!anonKey,
        urlValid: isValidEnvVar(url),
        keyValid: isValidEnvVar(anonKey)
      });
      return false;
    }
  } catch (error) {
    console.error('❌ Error general en initializeSupabase:', error);
    return false;
  }
}

function getEnvironmentVariables() {
  // First priority: window.__ENV__ (injected by build process - either from secrets or .env)
  const envUrl = window.__ENV__?.VITE_SUPABASE_URL;
  const envKey = window.__ENV__?.VITE_SUPABASE_ANON_KEY;

  // Second priority: localStorage (for manual configuration/testing)
  const localUrl = localStorage.getItem('fruvi_supabase_url');
  const localKey = localStorage.getItem('fruvi_supabase_anon');

  // Third priority: import.meta.env (Vite development)
  const viteUrl = import.meta.env?.VITE_SUPABASE_URL;
  const viteKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

  // Use the first valid source found
  const url = envUrl || localUrl || viteUrl || 'https://ipjkpgmptexkhilrjnsl.supabase.co';
  const anonKey = envKey || localKey || viteKey || 'your-anon-key';

  console.log('🔍 Fuentes de variables de entorno:', {
    envUrl: !!envUrl,
    localUrl: !!localUrl,
    viteUrl: !!viteUrl,
    finalUrl: url,
    finalKeyValid: isValidEnvVar(anonKey)
  });

  return { url, anonKey };
}

// Initialize Supabase client
let supabaseClient = null;

// Auto-initialize when service loads and DOM is ready
function initializeSupabaseIfReady() {
  if (typeof window !== 'undefined' && window.__ENV__) {
    console.log('🔄 Inicializando Supabase automáticamente...');
    initializeSupabase();
  } else {
    // Retry after a short delay if __ENV__ is not ready yet
    setTimeout(initializeSupabaseIfReady, 100);
  }
}

// Start initialization process
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSupabaseIfReady);
  } else {
    initializeSupabaseIfReady();
  }
}

// Función para obtener información de configuración (sin claves sensibles)
window.getSupabaseConfig = function getSupabaseConfig() {
  const { url, anonKey } = getEnvironmentVariables();
  return {
    url: url,
    configured: isValidEnvVar(url) && isValidEnvVar(anonKey),
    initialized: supabaseClient !== null
  };
};

// Función para verificar configuración de Supabase
window.checkSupabaseConfig = function checkSupabaseConfig() {
  const config = getSupabaseConfig();
  const result = {
    valid: config.configured && config.initialized,
    url: config.url,
    configured: config.configured,
    initialized: config.initialized
  };

  console.log('🔍 Verificación de configuración Supabase:', result);
  return result;
};

// Función para configurar Supabase con credenciales reales
window.configureSupabase = function configureSupabase(url, anonKey) {
  if (!url || !anonKey) {
    console.error('❌ Uso: configureSupabase("URL_SUPABASE", "CLAVE_ANONIMA")');
    console.error('Ejemplo: configureSupabase("https://tu-proyecto.supabase.co", "eyJ...")');
    return false;
  }

  // Guardar configuración
  localStorage.setItem('fruvi_supabase_url', url);
  localStorage.setItem('fruvi_supabase_anon', anonKey);

  // Reinicializar cliente
  const success = window.initializeSupabase();
  return success;
};

// Hacer funciones disponibles globalmente para consola de desarrollo
if (typeof window !== 'undefined') {
window.getSupabaseConfig = getSupabaseConfig;
window.isSupabaseConfigured = () => supabaseClient !== null;
}

// Función para configuración rápida desde consola (para desarrollo)
window.setupSupabase = function setupSupabase(url, anonKey) {
  if (!url || !anonKey) {
    console.error('❌ Uso: setupSupabase("URL_SUPABASE", "CLAVE_ANONIMA")');
    console.error('Ejemplo: setupSupabase("https://tu-proyecto.supabase.co", "eyJhbGciOiJIUzI1NiIs...")');
    console.log('💡 Pasos para obtener tus credenciales:');
    console.log('1. Ve a https://supabase.com/dashboard');
    console.log('2. Selecciona tu proyecto');
    console.log('3. Ve a Settings > API');
    console.log('4. Copia la URL del proyecto y la clave "anon public"');
    return;
  }

  try {
    console.log('🔧 Configurando Supabase con tus credenciales...');

    // Guardar en localStorage para persistencia
    localStorage.setItem('fruvi_supabase_url', url);
    localStorage.setItem('fruvi_supabase_anon', anonKey);

    // Inicializar cliente
    const success = window.initializeSupabase();

    if (success) {
      console.log('✅ Supabase configurado exitosamente');
      console.log('🎉 Puedes usar todas las funciones de autenticación ahora');
      return true;
    } else {
      console.error('❌ Error al inicializar Supabase');
      return false;
    }
  } catch (error) {
    console.error('❌ Error configurando Supabase:', error);
    return false;
  }
};

// Función para probar conexión con Supabase y diagnosticar problemas
window.testSupabaseConnection = async function testSupabaseConnection() {
  try {
console.log('🔍 Probando conexión con Supabase...');

if (!url || !anonKey) {
console.error('❌ Uso: testSupabaseConnection("URL", "CLAVE")');
console.log('💡 Tu configuración actual requiere:');
console.log('   URL: https://ipjkpgmptexkhilrjnsl.supabase.co');
console.log('   Clave: clave anónima real de tu proyecto');
return false;
}

// Crear cliente temporal para probar
const testClient = supabase.createClient(url, anonKey);

console.log('📋 Probando consulta simple...');

// Probar una consulta básica
const { data, error } = await testClient
.from('customers')
.select('count', { count: 'exact', head: true });

if (error) {
console.error('❌ Error de conexión:', error.message);
console.error('🔍 Código de error:', error.code);

if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
console.error('🚨 Error típico de red o configuración:');
console.error('   - Verifica que la URL sea correcta');
console.error('   - Verifica que la clave anónima sea válida');
console.error('   - Verifica tu conexión a internet');
console.error('   - Verifica que el proyecto Supabase esté activo');
}

return false;
} else {
console.log('✅ Conexión exitosa con Supabase');
console.log('📊 Proyecto Supabase operativo');
return true;
}
} catch (error) {
console.error('❌ Error general:', error.message);
return false;
}
};

// Función específica para solucionar problemas de login
window.fixLoginConnection = async function fixLoginConnection() {
  try {
console.log('🔧 Solucionando problemas de conexión para login...');

// Verificar configuración actual
const config = getSupabaseConfig();
console.log('📋 Configuración actual:', config);

if (!config.configured) {
console.error('❌ Variables de entorno no configuradas correctamente');
console.log('💡 Solución: Usa setupSupabase() con tu clave real');
return false;
}

if (!config.initialized) {
console.log('🔄 Inicializando cliente de Supabase...');

const url = window.__ENV__?.VITE_SUPABASE_URL || 'https://ipjkpgmptexkhilrjnsl.supabase.co';
const anonKey = window.__ENV__?.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Solo proceder si tenemos variables reales
if (url.includes('ipjkpgmptexkhilrjnsl.supabase.co') && anonKey !== 'your-anon-key') {
supabaseClient = supabase.createClient(url, anonKey);
console.log('✅ Cliente inicializado exitosamente');

// Probar conexión inmediatamente
const { error } = await supabaseClient.from('customers').select('count', { count: 'exact', head: true });

if (error) {
console.error('❌ Error en prueba de conexión:', error.message);
return false;
} else {
console.log('✅ Conexión verificada correctamente');
return true;
}
} else {
console.error('❌ Clave de API no válida detectada');
console.log('💡 Necesitas configurar tu clave anónima real');
return false;
}
} else {
console.log('✅ Cliente ya está inicializado');
return true;
}
} catch (error) {
console.error('❌ Error solucionando conexión:', error);
return false;
}
};

// Upload avatar to Supabase Storage (bucket: 'avatars'). Returns public URL.
window.uploadAvatar = async function uploadAvatar() {
  if (!supabaseClient) throw new Error('Supabase no inicializado');
const { data: authData } = await supabaseClient.auth.getUser();
const user = authData?.user;
if (!user) throw new Error('No hay usuario autenticado');

// Validar archivo
if (!file || !file.type.startsWith('image/')) {
throw new Error('Por favor selecciona un archivo de imagen válido');
}
if (file.size > 5 * 1024 * 1024) { // 5MB max
throw new Error('La imagen es demasiado grande. Máximo 5MB');
}

const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
const path = `avatars/${user.id}-${Date.now()}.${ext}`;

try {
const { data, error } = await supabaseClient.storage.from('avatars').upload(path, file, {
upsert: true,
contentType: file.type || 'image/jpeg'
});

if (error) {
console.error('Error uploading avatar:', error);
throw new Error(`Error al subir imagen: ${error.message}`);
}

const { data: pub } = supabaseClient.storage.from('avatars').getPublicUrl(data.path);
const url = pub?.publicUrl;

if (!url) {
throw new Error('No se pudo obtener la URL pública de la imagen');
}

// Try to persist into customers.avatar_url if column exists (ignore error if not)
try { await updateMyCustomer({ avatar_url: url }); } catch (_) {}

return url;
} catch (error) {
console.error('Upload avatar error:', error);
throw error;
}
}

// Auth
window.signUpWithEmail = async function signUpWithEmail(email, password, metadata = {}) {
  if (!supabaseClient) {
const config = getSupabaseConfig();
throw new Error(`Supabase no inicializado. Configuración actual: ${JSON.stringify(config)}`);
}
const { data, error } = await supabaseClient.auth.signUp({ email, password, options: { data: metadata } });
if (error) throw error;
return data;
}

window.signInWithEmail = async function signInWithEmail(email, password) {
  try {
    if (!supabaseClient) {
      const config = getSupabaseConfig();
      throw new Error(`Supabase no inicializado. Configuración actual: ${JSON.stringify(config)}`);
    }

    console.log('🔐 Intentando login...');
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('❌ Error en login:', error.message);
      throw error;
    }

    console.log('✅ Login exitoso');
    return data;
  } catch (error) {
    console.error('❌ Error en signInWithEmail:', error);
    throw error;
  }
}

window.signOut = async function signOut() {
  if (!supabaseClient) {
console.warn('Supabase no inicializado - no se puede cerrar sesión');
return;
}
await supabaseClient.auth.signOut();
}

window.getUser = async function getUser() {
  // CRITICAL FIX: Prevent crash if supabase client failed to initialize.
  if (!supabaseClient) return null;
  const { data } = await supabaseClient.auth.getUser();
  return data?.user || null;
}

// Data: customers table
window.insertCustomer = async function insertCustomer() {
  if (supabaseClient) {
const { error } = await supabaseClient.from('customers').insert([userData]);
if (!error) return { ok: true };
console.error('Error Supabase:', error);
}
// Fallback localStorage
const customers = JSON.parse(localStorage.getItem('fruvi_customers') || '[]');
customers.push(userData);
localStorage.setItem('fruvi_customers', JSON.stringify(customers));
return { ok: true, local: true };
}

window.upsertCustomer = async function upsertCustomer() {
  if (!supabaseClient) throw new Error('Supabase no inicializado');
const { data, error } = await supabaseClient
.from('customers')
.upsert({ ...match, ...patch }, { onConflict: 'user_id' })
.select();
if (error) throw error;
return data?.[0] || null;
}

window.getMyCustomer = async function getMyCustomer() {
  if (!supabaseClient) throw new Error('Supabase no inicializado');
const { data: authData } = await supabaseClient.auth.getUser();
const uid = authData?.user?.id;
if (!uid) return null;
const { data, error } = await supabaseClient
.from('customers')
.select('*')
.eq('user_id', uid)
.limit(1)
.maybeSingle();
if (error && error.code !== 'PGRST116') throw error;
return data || null;
}

// Update current user's customer row; if not exists, insert. Prevents duplicate key errors.
window.updateMyCustomer = async function updateMyCustomer() {
  if (!supabaseClient) throw new Error('Supabase no inicializado');
const { data: authData } = await supabaseClient.auth.getUser();
const user = authData?.user;
if (!user) throw new Error('No hay usuario autenticado');
// Try update first
let { data, error } = await supabaseClient
.from('customers')
.update({ ...patch })
.eq('user_id', user.id)
.select();
if (error && error.code !== 'PGRST116') throw error;
if (!data || data.length === 0) {
// Insert if missing
const { data: ins, error: err2 } = await supabaseClient
.from('customers')
.insert([{ ...patch, user_id: user.id }])
.select();
if (err2) throw err2;
return ins?.[0] || null;
}
return data?.[0] || null;
}

// Crea un perfil mínimo si no existe (tras login)
window.ensureCustomerExists = async function ensureCustomerExists() {
  if (!supabaseClient) throw new Error('Supabase no inicializado');
const { data: authData } = await supabaseClient.auth.getUser();
const user = authData?.user;
if (!user) return null;
const current = await getMyCustomer();
if (current) return current;
const minimal = {
user_id: user.id,
email: user.email,
full_name: user.user_metadata?.full_name || '',
phone: user.user_metadata?.phone || '',
frequency: 'ocasional',
favorite_fruits: [],
created_at: new Date().toISOString()
};
// Use updateMyCustomer to avoid conflicts
return await updateMyCustomer(minimal);
}

// Función para detectar si el usuario está registrado
window.isUserRegistered = async function isUserRegistered() {
  try {
const user = await getUser();
return user !== null;
} catch (error) {
console.warn('Error checking user registration:', error);
return false;
}
}

// Función para obtener el estado del usuario (registrado/no registrado)
window.getUserStatus = async function getUserStatus() {
  const isRegistered = await isUserRegistered();
  return {
    isRegistered: isRegistered,
    isGuest: !isRegistered,
    canPurchase: isRegistered,
    showRegistrationPrompts: !isRegistered
  };
}

// Función para mostrar beneficios de registro
window.getRegistrationBenefits = function getRegistrationBenefits() {
  return [
{
icon: 'fas fa-shopping-cart',
title: 'Compra productos frescos',
description: 'Accede a nuestro catálogo completo de frutas premium'
},
{
icon: 'fas fa-truck',
title: 'Entrega a domicilio',
description: 'Recibe tus frutas frescas directamente en tu puerta'
},
{
icon: 'fas fa-gift',
title: 'Ofertas exclusivas',
description: 'Descuentos especiales solo para miembros registrados'
},
{
icon: 'fas fa-star',
title: 'Programa de fidelidad',
description: 'Acumula puntos y obtén frutas gratis'
},
{
icon: 'fas fa-bell',
title: 'Notificaciones personalizadas',
description: 'Recibe alertas sobre frutas de temporada'
},
{
icon: 'fas fa-heart',
title: 'Lista de favoritos',
description: 'Guarda tus frutas preferidas para comprar después'
}
];
}
function ensureSupabaseFunctions() {
  console.log('🔧 Verificando funciones de Supabase...');
  
  const criticalFunctions = [
    'signInWithEmail',
    'signUpWithEmail', 
    'getUser',
    'getUserStatus',
    'setupSupabase',
    'checkSupabaseConfig',
    'testSupabaseConnection',
    'fixLoginConnection'
  ];

  let missingFunctions = [];
  
  criticalFunctions.forEach(funcName => {
    // Verificar si la función existe
    if (typeof window[funcName] !== 'function') {
      console.warn(`❌ Función faltante: ${funcName}`);
      missingFunctions.push(funcName);
    } else {
      console.log(`✅ ${funcName}`);
    }
  });

  if (missingFunctions.length > 0) {
    console.warn();
    console.log('💡 Posibles soluciones:');
    console.log('1. Recarga la página (F5)');
    console.log('2. Abre DevTools → Network → busca supabaseService.js');
    console.log('3. Verifica que el archivo se cargue correctamente');
    return false;
  }

  console.log('✅ Todas las funciones críticas disponibles');
  return true;
}

// Ejecutar verificación automática después de un breve delay
setTimeout(() => {
  ensureSupabaseFunctions();
}, 2000);

// Hacer la función disponible globalmente
window.ensureSupabaseFunctions = ensureSupabaseFunctions;

console.log('🚀 Sistema de verificación de funciones iniciado');
console.log('💡 Usa ensureSupabaseFunctions() en consola para verificar manualmente');

// ===== DASHBOARD FUNCTIONS =====

// Get current user data
window.getCurrentUser = async function getCurrentUser() {
  try {
    if (!supabaseClient) {
      // Development fallback: return user stored in localStorage (if any)
      try {
        const local = JSON.parse(localStorage.getItem('fruvi_user') || 'null');
        if (local) return local;
      } catch (e) {
        // ignore parse errors
      }
      return null;
    }

    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Get user orders
window.getUserOrders = async function getUserOrders(userId) {
  try {
    if (!supabaseClient) {
      // Fallback to localStorage orders for development
      try {
        const orders = JSON.parse(localStorage.getItem('fruvi_user_orders') || '[]');
        return userId ? orders.filter(o => String(o.user_id) === String(userId)) : orders;
      } catch (e) {
        return [];
      }
    }

    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting user orders:', error);
    return [];
  }
};

// Get user statistics
window.getUserStats = async function getUserStats(userId) {
  try {
    // If supabase client is not initialized, return sensible fallback/demo data
    if (!supabaseClient) {
      try {
        const orders = JSON.parse(localStorage.getItem('fruvi_user_orders') || '[]')
          .filter(o => String(o.user_id) === String(userId));

        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;

        // Simple aggregation for monthly data from orders (group by month)
        const monthlyMap = {};
        orders.forEach(o => {
          const d = new Date(o.created_at);
          const label = d.toLocaleString('es-ES', { month: 'short' });
          monthlyMap[label] = (monthlyMap[label] || 0) + (o.total || 0);
        });
        const monthlyLabels = Object.keys(monthlyMap).slice(-6);
        const monthlyData = monthlyLabels.map(l => monthlyMap[l]);

        const topCategories = JSON.parse(localStorage.getItem('fruvi_top_categories') || '[]');
        const categoryLabels = topCategories.map(c => c.name).slice(0,5);
        const categoryData = topCategories.map(c => c.spent).slice(0,5);

        const recentActivity = orders.slice(0,5).map(o => ({ icon: 'fa-shopping-cart', description: `Pedido #${o.id} - $${o.total.toFixed(2)}`, time: formatDate(o.created_at) }));

        return {
          totalOrders,
          totalSpent,
          pendingOrders,
          favoriteProducts: JSON.parse(localStorage.getItem('fruvi_favorite_count') || '5'),
          monthlyLabels: monthlyLabels.length ? monthlyLabels : ['Ene','Feb','Mar','Abr','May','Jun'],
          monthlyData: monthlyData.length ? monthlyData : [120,150,180,200,170,190],
          categoryLabels: categoryLabels.length ? categoryLabels : ['Cítricas','Tropicales','Bayas','Manzanas','Exóticas'],
          categoryData: categoryData.length ? categoryData : [30,25,20,15,10],
          recentActivity
        };
      } catch (e) {
        // Return demo values on any failure
        return {
          totalOrders: 0,
          totalSpent: 0,
          pendingOrders: 0,
          favoriteProducts: 0,
          monthlyLabels: ['Ene','Feb','Mar','Abr','May','Jun'],
          monthlyData: [120,150,180,200,170,190],
          categoryLabels: ['Cítricas','Tropicales','Bayas','Manzanas','Exóticas'],
          categoryData: [30,25,20,15,10],
          recentActivity: []
        };
      }
    }

    // Get orders count and total spent from Supabase
    const { data: orders, error: ordersError } = await supabaseClient
      .from('orders')
      .select('total, status, created_at')
      .eq('customer_id', userId);

    if (ordersError) throw ordersError;

    const totalOrders = orders?.length || 0;
    const totalSpent = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;

    // Mock data for charts (in a real app, this would come from analytics)
    const monthlyLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const monthlyData = [120, 150, 180, 200, 170, 190];
    const categoryLabels = ['Cítricas', 'Tropicales', 'Bayas', 'Manzanas', 'Exóticas'];
    const categoryData = [30, 25, 20, 15, 10];

    // Mock recent activity
    const recentActivity = [
      { icon: 'fa-shopping-cart', description: 'Compra realizada: Naranja Valencia', time: '2 horas atrás' },
      { icon: 'fa-truck', description: 'Pedido #123 entregado', time: '1 día atrás' },
      { icon: 'fa-star', description: 'Producto favorito agregado', time: '3 días atrás' }
    ];

    return {
      totalOrders,
      totalSpent,
      pendingOrders,
      favoriteProducts: 5, // Mock data
      monthlyLabels,
      monthlyData,
      categoryLabels,
      categoryData,
      recentActivity
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalOrders: 0,
      totalSpent: 0,
      pendingOrders: 0,
      favoriteProducts: 0,
      monthlyLabels: [],
      monthlyData: [],
      categoryLabels: [],
      categoryData: [],
      recentActivity: []
    };
  }
};

// Logout function
window.logout = async function logout() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;

    // Clear local storage
    localStorage.removeItem('fruvi_cart_store');

    // Redirect to home
    window.location.hash = '#/';
    window.location.reload();
  } catch (error) {
    console.error('Error logging out:', error);
    showNotification('Error al cerrar sesión', false);
  }
};

