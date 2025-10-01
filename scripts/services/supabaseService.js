// Supabase Service: auth + customers helpers (Fruvi)
// Config dinámica: establece en consola o en código
// localStorage.setItem('fruvi_supabase_url', 'https://<project>.supabase.co');
// localStorage.setItem('fruvi_supabase_anon', '<anon-key>');

// Environment variables for GitHub Pages and development
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || window.__ENV__?.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || window.__ENV__?.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Función para validar si una variable de entorno es válida (no es un placeholder de GitHub Actions)
function isValidEnvVar(value) {
  if (!value || typeof value !== 'string') return false;
  // Rechazar placeholders comunes de GitHub Actions
  if (value.includes('${{') || value.includes('secrets.') || value === 'your-anon-key' || value === 'your-project.supabase.co') {
    return false;
  }
  return true;
}

function getAnon() {
  return localStorage.getItem('fruvi_supabase_anon') || SUPABASE_ANON_KEY;
}

// Initialize Supabase client
let supabaseClient = null;

function initializeSupabaseClient() {
  try {
    const url = localStorage.getItem('fruvi_supabase_url') || SUPABASE_URL;
    const anonKey = getAnon();

    if (url && anonKey && isValidEnvVar(url) && isValidEnvVar(anonKey) && url !== 'https://your-project.supabase.co' && anonKey !== 'your-anon-key') {
      supabaseClient = supabase.createClient(url, anonKey);
      console.log('✅ Supabase inicializado correctamente');
      return true;
    } else {
      console.warn('⚠️ Supabase no configurado - usando modo localStorage');
      console.warn('🔍 Debug info:', {
        url: url,
        anonKey: anonKey ? '***' + anonKey.slice(-4) : 'undefined',
        isValidUrl: isValidEnvVar(url),
        isValidKey: isValidEnvVar(anonKey),
        urlNotDefault: url !== 'https://your-project.supabase.co',
        keyNotDefault: anonKey !== 'your-anon-key'
      });
      return false;
    }
  } catch (error) {
    console.error('❌ Error inicializando Supabase:', error);
    return false;
  }
}

// Función para obtener información de configuración (sin claves sensibles)
export function getSupabaseConfig() {
  const url = localStorage.getItem('fruvi_supabase_url') || SUPABASE_URL;
  const anonKey = getAnon();
  return {
    url: url,
    configured: isValidEnvVar(url) && isValidEnvVar(anonKey) && url !== 'https://your-project.supabase.co' && anonKey !== 'your-anon-key',
    initialized: supabaseClient !== null
  };
}

// Función para configurar Supabase manualmente (útil para desarrollo)
export function configureSupabase(url, anonKey) {
  if (url && anonKey && url !== 'https://your-project.supabase.co') {
    localStorage.setItem('fruvi_supabase_url', url);
    localStorage.setItem('fruvi_supabase_anon', anonKey);
    initializeSupabaseClient();
  }
}

// Hacer funciones disponibles globalmente para consola de desarrollo
if (typeof window !== 'undefined') {
  window.getSupabaseConfig = getSupabaseConfig;
  window.isSupabaseConfigured = () => supabaseClient !== null;
}

// Función para configuración rápida desde consola (para desarrollo)
window.setupSupabase = function(url, anonKey) {
  if (!url || !anonKey) {
    console.error('❌ Uso: setupSupabase("URL", "CLAVE")');
    console.error('Ejemplo: setupSupabase("https://your-project.supabase.co", "eyJ...")');
    return;
  }

  try {
    localStorage.setItem('fruvi_supabase_url', url);
    localStorage.setItem('fruvi_supabase_anon', anonKey);

    // Re-inicializar el cliente
    initializeSupabaseClient();

    const config = getSupabaseConfig();
    console.log('✅ Supabase configurado exitosamente:', config);
    console.log('🔄 Recarga la página para aplicar los cambios');

    return config;
  } catch (error) {
    console.error('❌ Error configurando Supabase:', error);
  }
};

// Función para verificar configuración actual
window.checkSupabaseConfig = function() {
  const config = getSupabaseConfig();
  console.log('🔍 Configuración actual de Supabase:', config);
  return config;
};

// Función para limpiar configuración (útil para desarrollo)
window.clearSupabaseConfig = function() {
  localStorage.removeItem('fruvi_supabase_url');
  localStorage.removeItem('fruvi_supabase_anon');
  console.log('🗑️ Configuración de Supabase eliminada');
  console.log('🔄 Recarga la página para aplicar los cambios');
};

// Upload avatar to Supabase Storage (bucket: 'avatars'). Returns public URL.
export async function uploadAvatar(file) {
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
export async function signUpWithEmail({ email, password, metadata = {} }) {
  if (!supabaseClient) {
    const config = getSupabaseConfig();
    throw new Error(`Supabase no inicializado. Configuración actual: ${JSON.stringify(config)}`);
  }
  const { data, error } = await supabaseClient.auth.signUp({ email, password, options: { data: metadata } });
  if (error) throw error;
  return data;
}

export async function signInWithEmail({ email, password }) {
  if (!supabaseClient) {
    const config = getSupabaseConfig();
    throw new Error(`Supabase no inicializado. Configuración actual: ${JSON.stringify(config)}`);
  }
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabaseClient) {
    console.warn('Supabase no inicializado - no se puede cerrar sesión');
    return;
  }
  await supabaseClient.auth.signOut();
}

export async function getUser() {
  if (!supabaseClient) return null;
  const { data } = await supabaseClient.auth.getUser();
  return data?.user || null;
}

// Data: customers table
export async function insertCustomer(userData) {
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

export async function upsertCustomer(match, patch) {
  if (!supabaseClient) throw new Error('Supabase no inicializado');
  const { data, error } = await supabaseClient
    .from('customers')
    .upsert({ ...match, ...patch }, { onConflict: 'user_id' })
    .select();
  if (error) throw error;
  return data?.[0] || null;
}

export async function getMyCustomer() {
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
export async function updateMyCustomer(patch) {
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
export async function ensureCustomerExists() {
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
export async function isUserRegistered() {
  try {
    const user = await getUser();
    return user !== null;
  } catch (error) {
    console.warn('Error checking user registration:', error);
    return false;
  }
}

// Función para obtener el estado del usuario (registrado/no registrado)
export async function getUserStatus() {
  const isRegistered = await isUserRegistered();
  return {
    isRegistered,
    isGuest: !isRegistered,
    canPurchase: isRegistered,
    showRegistrationPrompts: !isRegistered
  };
}

// Función para mostrar beneficios de registro
export function getRegistrationBenefits() {
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
