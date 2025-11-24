// ================== FUNCIONES PARA BASE DE DATOS AI DR.LARA ==================
// Consulta tabla company_knowledge
export async function getCompanyKnowledge() {
  if (!usersClient) await initializeDatabases();
  const { data, error } = await usersClient
    .from('company_knowledge')
    .select('*');
  if (error) throw error;
  return data;
}

// Consulta tabla ai_knowledge_base
export async function getAIKnowledgeBase() {
  if (!usersClient) await initializeDatabases();
  const { data, error } = await usersClient
    .from('ai_knowledge_base')
    .select('*');
  if (error) throw error;
  return data;
}

// Consulta tabla ai_forbidden_responses
export async function getForbiddenResponses() {
  if (!usersClient) await initializeDatabases();
  const { data, error } = await usersClient
    .from('ai_forbidden_responses')
    .select('*');
  if (error) throw error;
  return data;
}
// Supabase Service: Database Distributor and API Manager
// ============================================================================
// Este servicio centraliza el acceso a todas las bases de datos de Supabase
// - Base de datos de usuarios (autenticación, perfiles, créditos)
// - Base de datos de productos (inventario, cajas, precios)
// ============================================================================

// Environment variables from .env file
// Environment variables for GitHub Pages and development
function isValidEnvVar(value) {
  return value && typeof value === 'string' && value.length > 10 && !value.includes('your-');
}

function getEnvironmentVariables() {
  // Use Vite environment variables (available in modules)
  const url = import.meta.env?.VITE_SUPABASE_URL || 'https://ipjkpgmptexkhilrjnsl.supabase.co';
  const anonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwamtwZ21wdGV4a2hpbHJqbnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzQxOTQsImV4cCI6MjA3NDMxMDE5NH0.IxY5mC4SxyTzj1Vnns5kDu14wqkcVDksi3FvNEJ1F1o';

  console.log('🔍 Variables de entorno cargadas desde Vite:', {
    url: url,
    hasKey: !!anonKey,
    urlValid: isValidEnvVar(url),
    keyValid: isValidEnvVar(anonKey)
  });

  return { url, anonKey };
}

// Get environment variables
const env = getEnvironmentVariables();
const SUPABASE_USERS_URL = env.url;
const SUPABASE_USERS_ANON_KEY = env.anonKey;
const SUPABASE_PRODUCTS_URL = 'https://xujenwuefrgxfsiqjqhl.supabase.co';
const SUPABASE_PRODUCTS_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1amVud3VlZnJneGZzaXFqcWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTExNTYsImV4cCI6MjA3NjU2NzE1Nn0.89UAEW8CVBkz8lEAdnJzt0XJNo0C4lCrZMBBcRYKmMs';

console.log('🚀 Inicializando distribuidor de bases de datos Supabase...');

// Database clients
let usersClient = null;      // For user authentication, profiles, credits
let productsClient = null;   // For products, inventory, boxes
let initialized = false;

// Initialize database clients
async function initializeDatabases() {
  if (initialized) {
    console.log('📋 Databases already initialized, returning existing clients');
    return { usersClient, productsClient };
  }

  try {
    console.log('🔄 Inicializando clientes de base de datos...');

    // Wait for Supabase to be available
    if (typeof supabase === 'undefined' || typeof supabase.createClient === 'undefined') {
      // Check if window.supabase.createClient is available (from HTML CDN load)
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        console.log('✅ Using Supabase createClient from window object');
        supabase = window.supabase; // Use the CDN's supabase object
      } else {
        throw new Error('Supabase library not loaded. Make sure to include the Supabase CDN script.');
      }
    }

    // Initialize users database client
    if (!usersClient) {
      usersClient = supabase.createClient(SUPABASE_USERS_URL, SUPABASE_USERS_ANON_KEY, {
        auth: {
          storageKey: 'fruvi-users-auth',
          autoRefreshToken: true,
          persistSession: true
        }
      });
      console.log('✅ Cliente de base de datos de usuarios inicializado');
    }

    // Initialize products database client
    if (!productsClient) {
      productsClient = supabase.createClient(SUPABASE_PRODUCTS_URL, SUPABASE_PRODUCTS_ANON_KEY, {
        auth: {
          storageKey: 'fruvi-products-auth',
          autoRefreshToken: false,
          persistSession: false
        }
      });
      console.log('✅ Cliente de base de datos de productos inicializado');
    }

    initialized = true;
    console.log('🎉 Distribuidor de bases de datos inicializado correctamente');

    return { usersClient, productsClient };
  } catch (error) {
    console.error('❌ Error inicializando bases de datos:', error);
    throw error;
  }
}

// Get database clients
function getUsersClient() {
  if (!initialized) {
    throw new Error('Bases de datos no inicializadas. Llama a initializeDatabases() primero.');
  }
  return usersClient;
}

function getProductsClient() {
  if (!initialized) {
    throw new Error('Bases de datos no inicializadas. Llama a initializeDatabases() primero.');
  }
  return productsClient;
}

// Test database connections
async function testConnections() {
  try {
    console.log('🧪 Probando conexiones de base de datos...');

    // Test users database
    const { error: usersError } = await usersClient
      .from('customers')
      .select('count', { count: 'exact', head: true });

    if (usersError) {
      console.error('❌ Error en base de datos de usuarios:', usersError.message);
    } else {
      console.log('✅ Base de datos de usuarios conectada');
    }

    // Test products database
    const { error: productsError } = await productsClient
      .from('current_products')
      .select('count', { count: 'exact', head: true });

    if (productsError) {
      console.error('❌ Error en base de datos de productos:', productsError.message);
    } else {
      console.log('✅ Base de datos de productos conectada');
    }

    return !usersError && !productsError;
  } catch (error) {
    console.error('❌ Error probando conexiones:', error);
    return false;
  }
}

// Auto-initialize on load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initializeDatabases();
    await testConnections();
    
    // Ensure auth functions are available globally after initialization
    window.signInWithEmail = signInWithEmail;
    window.signUpWithEmail = signUpWithEmail;
    window.getUser = getUser;
    window.getCurrentUser = getCurrentUser;
    window.getUserStats = getUserStats;
    window.getUserStatus = getUserStatus;
    window.signOut = signOut;
    window.onAuthStateChange = onAuthStateChange;
    
    console.log('🔑 Authentication functions made available globally');
  } catch (error) {
    console.error('❌ Error en inicialización automática:', error);
  }
});

// Authentication functions
async function signInWithEmail(email, password) {
  try {
    if (!usersClient) throw new Error('Users client not initialized');
    
    const { data, error } = await usersClient.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

async function signUpWithEmail(email, password, userData = {}) {
  try {
    if (!usersClient) throw new Error('Users client not initialized');
    
    const { data, error } = await usersClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

async function getUser() {
  try {
    if (!usersClient) {
      console.warn('Users client not initialized');
      return null;
    }
    
    const { data: { user }, error } = await usersClient.auth.getUser();
    
    if (error) {
      // Don't throw error for missing session - it's normal for guests
      if (error.message?.includes('Auth session missing')) {
        return null;
      }
      throw error;
    }
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null; // Return null instead of throwing
  }
}

// Alias for backward compatibility
async function getCurrentUser() {
  return await getUser();
}

// Get user statistics from database
async function getUserStats(userId) {
  try {
    if (!usersClient || !userId) {
      console.warn('Cannot get user stats: client not initialized or no userId');
      return null;
    }

    // Get user's credits from user_ai_credits table
    const { data: creditsData, error: creditsError } = await usersClient
      .from('user_ai_credits')
      .select('credits_balance, total_credits_earned, total_credits_spent')
      .eq('user_id', userId)
      .single();

    if (creditsError && creditsError.code !== 'PGRST116') {
      console.warn('Error fetching credits:', creditsError);
    }

    const totalCredits = creditsData?.credits_balance || 0;

    // Get user's subscription status - simplified query
    const { data: subscriptions, error: subError } = await usersClient
      .from('user_subscriptions')
      .select('subscription_type, status, start_date, end_date')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (subError) {
      console.warn('Error fetching subscription:', subError);
    }

    const subscription = subscriptions?.[0] || null;

    return {
      totalCredits,
      totalCreditsEarned: creditsData?.total_credits_earned || 0,
      totalCreditsSpent: creditsData?.total_credits_spent || 0,
      subscription: subscription,
      hasActiveSubscription: !!subscription,
      subscriptionType: subscription?.subscription_type || 'free'
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalCredits: 0,
      totalCreditsEarned: 0,
      totalCreditsSpent: 0,
      subscription: null,
      hasActiveSubscription: false,
      subscriptionType: 'free'
    };
  }
}

// Check user authentication status
async function getUserStatus() {
  try {
    const user = await getUser();
    
    if (!user) {
      return {
        isGuest: true,
        isAuthenticated: false,
        user: null
      };
    }

    return {
      isGuest: false,
      isAuthenticated: true,
      user: user
    };
  } catch (error) {
    console.error('Error checking user status:', error);
    return {
      isGuest: true,
      isAuthenticated: false,
      user: null
    };
  }
}

async function signOut() {
  try {
    if (!usersClient) throw new Error('Users client not initialized');
    
    const { error } = await usersClient.auth.signOut();
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Get auth state
function onAuthStateChange(callback) {
  if (!usersClient) {
    console.warn('Users client not initialized for auth state change');
    return () => {}; // Return empty unsubscribe function
  }
  
  return usersClient.auth.onAuthStateChange(callback);
}

// Export database clients and functions
export {
  initializeDatabases,
  getUsersClient,
  getProductsClient,
  testConnections,
  usersClient,
  productsClient,
  signInWithEmail,
  signUpWithEmail,
  getUser,
  getCurrentUser,
  getUserStats,
  getUserStatus,
  signOut,
  onAuthStateChange
};

// Legacy global exports for backward compatibility
window.initializeDatabases = initializeDatabases;
window.getUsersClient = getUsersClient;
window.getProductsClient = getProductsClient;
window.testConnections = testConnections;
window.usersClient = usersClient;
window.productsClient = productsClient;
window.signInWithEmail = signInWithEmail;
window.signUpWithEmail = signUpWithEmail;
window.getUser = getUser;
window.getCurrentUser = getCurrentUser;
window.getUserStats = getUserStats;
window.getUserStatus = getUserStatus;
window.signOut = signOut;
window.onAuthStateChange = onAuthStateChange;

