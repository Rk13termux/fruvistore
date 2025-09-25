// Supabase Service: auth + customers helpers (Fruvi)
// Config dinámica: establece en consola o en código
// localStorage.setItem('fruvi_supabase_url', 'https://<project>.supabase.co');
// localStorage.setItem('fruvi_supabase_anon', '<anon-key>');

// Environment variables for GitHub Pages
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://ipjkpgmptexkhilrjnsl.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwamtQZ21wdGV4a2hpbHJqbnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4NzY4MDAsImV4cCI6MjA0MjQ1MjgwMH0.placeholder';

function getAnon() { return localStorage.getItem('fruvi_supabase_anon') || SUPABASE_ANON_KEY; }

// Initialize Supabase client
let supabaseClient = null;

try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== 'https://your-project.supabase.co') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (error) {
  console.warn('Supabase not configured - using localStorage fallback');
}

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

function getAnon() { return localStorage.getItem('fruvi_supabase_anon') || SUPABASE_ANON_KEY; }

// Auth
export async function signUpWithEmail({ email, password, metadata = {} }) {
  if (!supabaseClient) throw new Error('Supabase no inicializado');
  const { data, error } = await supabaseClient.auth.signUp({ email, password, options: { data: metadata } });
  if (error) throw error;
  return data;
}

export async function signInWithEmail({ email, password }) {
  if (!supabaseClient) throw new Error('Supabase no inicializado');
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabaseClient) return;
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
