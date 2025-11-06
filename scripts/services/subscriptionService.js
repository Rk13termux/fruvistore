// Subscription Service for AI Doctor Premium Features
// Handles user subscriptions, usage limits, and premium feature access

// Get Supabase client dynamically
function getSupabaseClient() {
  // Try to get from window first
  if (window.usersClient) {
    return window.usersClient;
  }
  
  // Try to get using the function
  if (typeof window.getUsersClient === 'function') {
    try {
      return window.getUsersClient();
    } catch (e) {
      console.warn('Could not get users client:', e);
    }
  }
  
  return null;
}

const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Gratuito',
    aiQueriesPerDay: 5,
    conversationsPerMonth: 10,
    features: ['chat_basico', 'analisis_basico_frutas'],
    price: 0
  },
  premium_monthly: {
    name: 'Premium Mensual',
    aiQueriesPerDay: 50,
    conversationsPerMonth: 100,
    features: ['chat_ilimitado', 'analisis_completo', 'planes_nutricion', 'seguimiento_progreso', 'consultas_personales'],
    price: 9900 // COP
  },
  premium_yearly: {
    name: 'Premium Anual',
    aiQueriesPerDay: 100,
    conversationsPerMonth: 500,
    features: ['chat_ilimitado', 'analisis_completo', 'planes_nutricion', 'seguimiento_progreso', 'consultas_personales', 'descuentos_exclusivos'],
    price: 99000 // COP
  }
};

// Initialize user credits with 25 credits on first access - AUTOMATIC
export async function initializeUserCredits(userId) {
  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) throw new Error('Supabase no inicializado');

    console.log(`🔍 Verificando créditos para usuario: ${userId}`);

    // Check if user already exists in user_ai_credits table
    const { data: existingCredits, error: checkError } = await supabaseClient
      .from('user_ai_credits')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle to avoid error if not found

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking credits:', checkError);
      throw checkError;
    }

    if (existingCredits) {
      console.log(`✅ Usuario ya tiene créditos: ${existingCredits.credits_balance}`);
      return existingCredits; // User already has credits
    }

    // User doesn't exist - create with 25 initial credits
    console.log(`🆕 Nuevo usuario detectado - creando registro con 25 créditos iniciales`);

    // Get user name from customers table
    const { data: customer } = await supabaseClient
      .from('customers')
      .select('full_name')
      .eq('user_id', userId)
      .maybeSingle();

    const userName = customer?.full_name || 'Usuario';

    // Insert new user with 25 credits (use INSERT not UPSERT to ensure it's new)
    const { data, error } = await supabaseClient
      .from('user_ai_credits')
      .insert({
        user_id: userId,
        credits_balance: 25,
        total_credits_earned: 25,
        total_credits_spent: 0,
        last_credit_update: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting initial credits:', error);
      throw error;
    }

    // Record initial credit transaction
    try {
      await supabaseClient
        .from('credit_transactions')
        .insert({
          user_id: userId,
          transaction_type: 'initial_credits',
          amount: 25,
          description: `🎁 Créditos iniciales bienvenida para ${userName}`,
          balance_before: 0,
          balance_after: 25,
          created_at: new Date().toISOString()
        });
    } catch (txError) {
      console.warn('No se pudo registrar transacción inicial:', txError);
      // No fallar si la tabla de transacciones no existe
    }

    console.log(`🎉 ¡Créditos inicializados! Usuario ${userName} recibió 25 créditos de bienvenida`);
    return data;
  } catch (error) {
    console.error('❌ Error initializing user credits:', error);
    throw error;
  }
}

// Check if user has active premium subscription
export async function checkPremiumAccess(userId) {
  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      console.log('No supabaseClient available, returning free access');
      return { hasAccess: false, plan: 'free', reason: 'no_supabase' };
    }

    if (!userId) {
      console.log('No userId provided, returning free access');
      return { hasAccess: false, plan: 'free', reason: 'no_user_id' };
    }

    console.log('Checking premium access for user:', userId);

    // First check if user_subscriptions table exists
    try {
      const { data: tableCheck, error: tableError } = await supabaseClient
        .from('user_subscriptions')
        .select('count', { count: 'exact', head: true });

      if (tableError) {
        console.log('user_subscriptions table does not exist, returning free access');
        return { hasAccess: false, plan: 'free', reason: 'table_not_exists' };
      }
    } catch (tableCheckError) {
      console.log('user_subscriptions table check failed, returning free access:', tableCheckError.message);
      return { hasAccess: false, plan: 'free', reason: 'table_not_exists' };
    }

    // Declare data variable outside try-catch to avoid scope issues
    let subscriptionData = null;

    try {
      const { data, error } = await supabaseClient
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');

      console.log('Supabase subscription response:', { data: !!data, error: error?.message });

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found - user has no active subscription
          console.log('No active subscription found for user');
          return { hasAccess: false, plan: 'free', reason: 'no_subscription' };
        } else {
          console.error('Error checking subscription:', error);
          return { hasAccess: false, plan: 'free', reason: 'error' };
        }
      }

      // Handle the case where data is returned but not an array
      if (!data) {
        console.log('No subscription data returned');
        return { hasAccess: false, plan: 'free', reason: 'no_subscription' };
      }

      // Store data in outer scope variable
      subscriptionData = data;

    } catch (subscriptionError) {
      console.log('Subscription query failed, assuming no subscription:', subscriptionError.message);
      return { hasAccess: false, plan: 'free', reason: 'table_not_exists' };
    }

    // At this point, if we reach here, the query was successful
    if (!subscriptionData || subscriptionData.length === 0) {
      console.log('No subscription data returned');
      return { hasAccess: false, plan: 'free', reason: 'no_subscription' };
    }

    // Get the first active subscription (should only be one)
    const subscription = subscriptionData[0];

    // Check if subscription is still valid
    const now = new Date();
    const endDate = subscription.end_date ? new Date(subscription.end_date) : null;

    if (endDate && now > endDate) {
      console.log('Subscription expired, updating status');
      // Mark as expired
      await supabaseClient
        .from('user_subscriptions')
        .update({ status: 'expired' })
        .eq('user_id', userId);

      return { hasAccess: false, plan: 'free', reason: 'expired' };
    }

    console.log('User has active premium subscription:', subscription.subscription_type);
    return {
      hasAccess: true,
      plan: subscription.subscription_type,
      subscription: subscription,
      limits: SUBSCRIPTION_PLANS[subscription.subscription_type] || SUBSCRIPTION_PLANS.free
    };
  } catch (error) {
    console.error('Error in checkPremiumAccess:', error);
    return { hasAccess: false, plan: 'free', reason: 'error' };
  }
}

// Force initialize credits for a user (admin function)
export async function forceInitializeCredits(userId) {
  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) throw new Error('Supabase no inicializado');

    console.log('Forzando inicialización de créditos para usuario:', userId);

    // Delete existing credits if any
    await supabaseClient
      .from('user_ai_credits')
      .delete()
      .eq('user_id', userId);

    // Initialize fresh
    const result = await initializeUserCredits(userId);
    console.log('✅ Créditos forzados inicializados correctamente');
    return result;
  } catch (error) {
    console.error('Error forcing credit initialization:', error);
    throw error;
  }
}

// Check if user can make AI query based on daily/monthly limits
export async function canMakeAIQuery(userId, feature = 'chat_assistant') {
  try {
    const supabaseClient = getSupabaseClient();
    const access = await checkPremiumAccess(userId);

    if (!access.hasAccess) {
      // Check free tier usage
      const today = new Date().toISOString().split('T')[0];
      const { data: usage, error } = await supabaseClient
        .from('ai_usage_tracking')
        .select('query_count')
        .eq('user_id', userId)
        .eq('usage_date', today)
        .eq('feature_used', feature);

      if (error) {
        console.error('Error checking usage:', error);
        return { allowed: false, reason: 'error' };
      }

      const totalQueries = usage?.reduce((sum, u) => sum + u.query_count, 0) || 0;
      const limit = SUBSCRIPTION_PLANS.free.aiQueriesPerDay;

      if (totalQueries >= limit) {
        return {
          allowed: false,
          reason: 'limit_exceeded',
          current: totalQueries,
          limit: limit,
          upgradeMessage: 'Has alcanzado el límite diario gratuito. Actualiza a Premium para consultas ilimitadas.'
        };
      }

      return { allowed: true, current: totalQueries, limit: limit };
    }

    // Premium user - check limits
    const limits = access.limits;
    const today = new Date().toISOString().split('T')[0];
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const monthStart = startOfMonth.toISOString().split('T')[0];

    // Daily limit check
    const { data: dailyUsage, error: dailyError } = await supabaseClient
      .from('ai_usage_tracking')
      .select('query_count')
      .eq('user_id', userId)
      .eq('usage_date', today)
      .eq('feature_used', feature);

    if (dailyError) {
      console.error('Error checking daily usage:', dailyError);
      return { allowed: true, reason: 'error_but_allow' }; // Allow on error
    }

    const dailyQueries = dailyUsage?.reduce((sum, u) => sum + u.query_count, 0) || 0;

    // Monthly limit check
    const { data: monthlyUsage, error: monthlyError } = await supabaseClient
      .from('ai_usage_tracking')
      .select('query_count')
      .eq('user_id', userId)
      .gte('usage_date', monthStart)
      .eq('feature_used', feature);

    if (monthlyError) {
      console.error('Error checking monthly usage:', monthlyError);
      return { allowed: true, reason: 'error_but_allow' };
    }

    const monthlyQueries = monthlyUsage?.reduce((sum, u) => sum + u.query_count, 0) || 0;

    if (dailyQueries >= limits.aiQueriesPerDay) {
      return {
        allowed: false,
        reason: 'daily_limit_exceeded',
        current: dailyQueries,
        limit: limits.aiQueriesPerDay
      };
    }

    if (monthlyQueries >= limits.conversationsPerMonth) {
      return {
        allowed: false,
        reason: 'monthly_limit_exceeded',
        current: monthlyQueries,
        limit: limits.conversationsPerMonth
      };
    }

    return {
      allowed: true,
      current: dailyQueries,
      limit: limits.aiQueriesPerDay,
      monthlyCurrent: monthlyQueries,
      monthlyLimit: limits.conversationsPerMonth
    };

  } catch (error) {
    console.error('Error in canMakeAIQuery:', error);
    return { allowed: false, reason: 'error' };
  }
}

// Track AI usage
export async function trackAIUsage(userId, feature, tokensUsed = 0) {
  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) return;

    const today = new Date().toISOString().split('T')[0];

    await supabaseClient
      .from('ai_usage_tracking')
      .insert({
        user_id: userId,
        feature_used: feature,
        tokens_used: tokensUsed,
        usage_date: today
      });

  } catch (error) {
    console.error('Error tracking AI usage:', error);
  }
}

// Create or update subscription
export async function createSubscription(userId, planType, paymentMethod = null) {
  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) throw new Error('Supabase no inicializado');

    const plan = SUBSCRIPTION_PLANS[planType];
    if (!plan) throw new Error('Plan no válido');

    const now = new Date();
    let endDate;

    if (planType === 'premium_monthly') {
      endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (planType === 'premium_yearly') {
      endDate = new Date(now);
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscriptionData = {
      user_id: userId,
      subscription_type: planType,
      status: 'active',
      start_date: now.toISOString(),
      end_date: endDate?.toISOString(),
      payment_method: paymentMethod,
      usage_limits: {
        ai_queries_per_day: plan.aiQueriesPerDay,
        conversations_per_month: plan.conversationsPerMonth
      }
    };

    const { data, error } = await supabaseClient
      .from('user_subscriptions')
      .upsert(subscriptionData, { onConflict: 'user_id' })
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

// Get subscription status and usage
export async function getSubscriptionStatus(userId) {
  try {
    const access = await checkPremiumAccess(userId);

    if (!access.hasAccess) {
      return {
        plan: 'free',
        status: 'active',
        limits: SUBSCRIPTION_PLANS.free,
        usage: await getUsageStats(userId, 'free')
      };
    }

    const usage = await getUsageStats(userId, access.plan);

    return {
      plan: access.plan,
      status: access.subscription.status,
      startDate: access.subscription.start_date,
      endDate: access.subscription.end_date,
      limits: access.limits,
      usage: usage
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return null;
  }
}

// Get usage statistics
async function getUsageStats(userId, plan) {
  try {
    const supabaseClient = getSupabaseClient();
    const today = new Date().toISOString().split('T')[0];
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const monthStart = startOfMonth.toISOString().split('T')[0];

    // Daily usage
    const { data: dailyUsage } = await supabaseClient
      .from('ai_usage_tracking')
      .select('query_count, feature_used')
      .eq('user_id', userId)
      .eq('usage_date', today);

    // Monthly usage
    const { data: monthlyUsage } = await supabaseClient
      .from('ai_usage_tracking')
      .select('query_count, feature_used')
      .eq('user_id', userId)
      .gte('usage_date', monthStart);

    const dailyTotal = dailyUsage?.reduce((sum, u) => sum + u.query_count, 0) || 0;
    const monthlyTotal = monthlyUsage?.reduce((sum, u) => sum + u.query_count, 0) || 0;

    const limits = SUBSCRIPTION_PLANS[plan];

    return {
      daily: {
        used: dailyTotal,
        limit: limits.aiQueriesPerDay,
        remaining: Math.max(0, limits.aiQueriesPerDay - dailyTotal)
      },
      monthly: {
        used: monthlyTotal,
        limit: limits.conversationsPerMonth,
        remaining: Math.max(0, limits.conversationsPerMonth - monthlyTotal)
      }
    };
  } catch (error) {
    console.error('Error getting usage stats:', error);
    return { daily: { used: 0, limit: 0, remaining: 0 }, monthly: { used: 0, limit: 0, remaining: 0 } };
  }
}

// Cancel subscription
export async function cancelSubscription(userId) {
  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) throw new Error('Supabase no inicializado');

    const { data, error } = await supabaseClient
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        auto_renew: false
      })
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
}

// Get available plans
export function getAvailablePlans() {
  return SUBSCRIPTION_PLANS;
}

// Check if feature is available for user's plan
export function hasFeatureAccess(plan, feature) {
  const planData = SUBSCRIPTION_PLANS[plan];
  return planData && planData.features.includes(feature);
}

// ===== AI CREDITS SYSTEM =====

// Get user credit balance
export async function getCreditBalance(userId) {
  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      console.warn('getCreditBalance: Supabase client not initialized');
      return 0;
    }
    if (!userId || userId === 'undefined' || userId === null) {
      console.warn('getCreditBalance called with invalid userId:', userId);
      return 0;
    }

    console.log('🔍 getCreditBalance: Fetching credits for user:', userId);

    const { data, error } = await supabaseClient
      .from('user_ai_credits')
      .select('credits_balance')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No credits record, initialize
        console.log('📝 No credits record found, initializing for user:', userId);
        try {
          await initializeUserCredits(userId);
          return 25; // Return initial credits
        } catch (initError) {
          console.error('❌ Failed to initialize credits:', initError);
          return 0;
        }
      }
      console.error('❌ Error getting credit balance:', error);
      return 0;
    }

    const balance = data?.credits_balance || 0;
    console.log('✅ getCreditBalance: User', userId, 'has', balance, 'credits');
    return balance;
  } catch (error) {
    console.error('❌ Error getting credit balance:', error);
    return 0;
  }
}

// Add credits to user account (admin function)
export async function addCredits(userId, amount, description = 'Admin credit addition', adminUserId = null) {
  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      console.warn('Supabase client not initialized, attempting to initialize...');
      // Wait a bit for initialization
      await new Promise(resolve => setTimeout(resolve, 500));
      const retryClient = getSupabaseClient();
      if (!retryClient) throw new Error('Supabase no inicializado');
    }

    if (amount <= 0) throw new Error('Amount must be positive');

    // Get current balance
    const currentBalance = await getCreditBalance(userId);

    // Update balance
    const newBalance = currentBalance + amount;
    const { data: updateData, error: updateError } = await supabaseClient
      .from('user_ai_credits')
      .upsert({
        user_id: userId,
        credits_balance: newBalance,
        total_credits_earned: (await getCreditStats(userId)).total_credits_earned + amount,
        last_credit_update: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select();

    if (updateError) throw updateError;

    // Record transaction
    await supabaseClient
      .from('credit_transactions')
      .insert({
        user_id: userId,
        transaction_type: 'admin_add',
        amount: amount,
        description: description,
        balance_before: currentBalance,
        balance_after: newBalance,
        admin_user_id: adminUserId
      });

    return updateData[0];
  } catch (error) {
    console.error('Error adding credits:', error);
    throw error;
  }
}

// Deduct credits from user account
export async function deductCredits(userId, amount, description = 'AI query usage') {
  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) throw new Error('Supabase no inicializado');
    if (amount <= 0) throw new Error('Amount must be positive');

    console.log(`💳 Deduciendo ${amount} créditos para usuario ${userId}`);

    // Get current balance
    const currentBalance = await getCreditBalance(userId);
    console.log(`📊 Balance actual: ${currentBalance}`);

    if (currentBalance < amount) {
      console.error(`❌ Créditos insuficientes: tiene ${currentBalance}, necesita ${amount}`);
      throw new Error(`Créditos insuficientes. Tienes ${currentBalance}, necesitas ${amount}`);
    }

    // Calculate new balance
    const newBalance = currentBalance - amount;

    // Get current stats for total_credits_spent
    const stats = await getCreditStats(userId);
    const newTotalSpent = (stats.total_credits_spent || 0) + amount;

    // Update balance using UPDATE not UPSERT (record should exist)
    const { data: updateData, error: updateError } = await supabaseClient
      .from('user_ai_credits')
      .update({
        credits_balance: newBalance,
        total_credits_spent: newTotalSpent,
        last_credit_update: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error actualizando créditos:', updateError);
      throw updateError;
    }

    // Record transaction
    try {
      await supabaseClient
        .from('credit_transactions')
        .insert({
          user_id: userId,
          transaction_type: 'usage',
          amount: -amount, // Negative for deductions
          description: description,
          balance_before: currentBalance,
          balance_after: newBalance,
          created_at: new Date().toISOString()
        });
    } catch (txError) {
      console.warn('⚠️ No se pudo registrar transacción:', txError);
      // No fallar si la transacción no se registra
    }

    console.log(`✅ Créditos deducidos: ${currentBalance} → ${newBalance}`);

    // Return data with newBalance property for compatibility
    return {
      ...updateData,
      newBalance: newBalance,
      oldBalance: currentBalance,
      amountDeducted: amount
    };
  } catch (error) {
    console.error('❌ Error deducting credits:', error);
    throw error;
  }
}

// Get credit transaction history
export async function getCreditHistory(userId, limit = 50) {
  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) return [];

    const { data, error } = await supabaseClient
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting credit history:', error);
    return [];
  }
}

// Get all users with their credit balances (admin function)
export async function getAllUsersCredits() {
  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      console.warn('Supabase client not initialized');
      return [];
    }

    // Skip auth.users query that requires admin privileges - use only customer and credit data
    console.log('Getting users from customers and credits tables only (avoiding admin auth query)');

    // Get all credit records
    const { data: creditData, error: creditError } = await supabaseClient
      .from('user_ai_credits')
      .select('*')
      .order('updated_at', { ascending: false });

    if (creditError) {
      console.warn('Could not get credit data, trying fallback:', creditError);
      // Return empty array instead of throwing to allow graceful degradation
      return [];
    }

    // Get all customer records for user info
    const { data: customerData, error: customerError } = await supabaseClient
      .from('customers')
      .select('*');

    if (customerError) {
      console.warn('Could not get customer data:', customerError);
    }

    // Create a map of user_id to customer info
    const customerMap = new Map();
    (customerData || []).forEach(customer => {
      customerMap.set(customer.user_id, customer);
    });

    // Combine credit data with customer data
    const enrichedData = (creditData || []).map(credit => {
      const customer = customerMap.get(credit.user_id);

      return {
        ...credit,
        user_name: customer?.full_name || 'Sin nombre',
        user_email: customer?.email || 'Sin email',
        user_phone: customer?.phone || null,
        user_created_at: customer?.created_at || credit.created_at,
        user_last_sign_in: null, // Not available without admin auth
        user_status: customer ? 'Registrado' : 'Sin verificar'
      };
    });

    // Also include users who have customer records but no credits yet
    const usersWithoutCredits = (customerData || []).filter(customer =>
      !(creditData || []).some(credit => credit.user_id === customer.user_id)
    );

    usersWithoutCredits.forEach(customer => {
      enrichedData.push({
        user_id: customer.user_id,
        credits_balance: 0,
        total_credits_earned: 0,
        total_credits_spent: 0,
        last_credit_update: null,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        user_name: customer.full_name || 'Sin nombre',
        user_email: customer.email || 'Sin email',
        user_phone: customer.phone || null,
        user_created_at: customer.created_at,
        user_last_sign_in: null,
        user_status: 'Registrado'
      });
    });

    // Sort by last update, then by creation date
    enrichedData.sort((a, b) => {
      const aDate = new Date(a.last_credit_update || a.user_created_at || '2020-01-01');
      const bDate = new Date(b.last_credit_update || b.user_created_at || '2020-01-01');
      return bDate - aDate;
    });

    return enrichedData;
  } catch (error) {
    console.error('Error getting all users credits:', error);
    return [];
  }
}

// Get credit statistics (admin function)
export async function getCreditStats(userId = null) {
  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      console.warn('Supabase client not initialized');
      return userId ? { total_credits_earned: 0, total_credits_spent: 0 } : {};
    }

    let query = supabaseClient
      .from('user_ai_credits')
      .select('credits_balance, total_credits_earned, total_credits_spent');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: stats, error } = await query;

    if (error) throw error;

    if (userId) {
      // Return stats for specific user
      return stats?.[0] || { total_credits_earned: 0, total_credits_spent: 0 };
    }

    // Return global stats
    const totalCredits = stats?.reduce((sum, user) => sum + user.credits_balance, 0) || 0;
    const totalEarned = stats?.reduce((sum, user) => sum + user.total_credits_earned, 0) || 0;
    const totalSpent = stats?.reduce((sum, user) => sum + user.total_credits_spent, 0) || 0;

    return {
      totalUsers: stats?.length || 0,
      totalCredits: totalCredits,
      totalCreditsEarned: totalEarned,
      totalCreditsSpent: totalSpent
    };
  } catch (error) {
    console.error('Error getting credit stats:', error);
    return userId ? { total_credits_earned: 0, total_credits_spent: 0 } : {};
  }
}

// Get all credit transactions (admin function)
export async function getAllCreditTransactions(limit = 100) {
  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) return [];

    // Get all transactions
    const { data: transactionData, error: transactionError } = await supabaseClient
      .from('credit_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (transactionError) throw transactionError;

    // Get all customer records for user info
    const { data: customerData, error: customerError } = await supabaseClient
      .from('customers')
      .select('*');

    if (customerError) {
      console.warn('Could not get customer data:', customerError);
    }

    // Get auth users for additional info
    const { data: authUsers, error: authError } = await supabaseClient.auth.admin.listUsers();
    if (authError) {
      console.warn('Could not get auth users:', authError);
    }

    // Create maps for quick lookup
    const customerMap = new Map();
    (customerData || []).forEach(customer => {
      customerMap.set(customer.user_id, customer);
    });

    const authUserMap = new Map();
    (authUsers?.users || []).forEach(user => {
      authUserMap.set(user.id, user);
    });

    // Enrich transaction data
    const enrichedData = (transactionData || []).map(transaction => {
      const customer = customerMap.get(transaction.user_id);
      const authUser = authUserMap.get(transaction.user_id);

      return {
        ...transaction,
        user_name: customer?.full_name || authUser?.user_metadata?.full_name || 'Sin nombre',
        user_email: customer?.email || authUser?.email || 'Sin email',
        user_phone: customer?.phone || authUser?.phone || null,
        admin_name: transaction.admin_user_id ? (
          customerMap.get(transaction.admin_user_id)?.full_name ||
          authUserMap.get(transaction.admin_user_id)?.user_metadata?.full_name ||
          'Admin'
        ) : null
      };
    });

    return enrichedData;
  } catch (error) {
    console.error('Error getting all credit transactions:', error);
    return [];
  }
}

// ===== ADMIN DATABASE SERVICE INTEGRATION =====
// Centralized database service for all admin operations
// Provides unified access to products, boxes, credits, and analytics

class AdminDatabaseService {
    constructor() {
        this.productsClient = null;
        this.supabaseClient = null;
        this.productManager = null;
        this.boxManager = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return true;

        try {
            // Wait for Supabase clients to be available
            await this.waitForClients();

            // Initialize product manager
            if (typeof window.initProductManager === 'function') {
                this.productManager = window.initProductManager();
            }

            // Initialize box manager
            this.boxManager = this.createBoxManager();

            this.initialized = true;
            console.log('✅ Admin Database Service initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Admin Database Service:', error);
            throw error;
        }
    }

    async waitForClients() {
        let attempts = 0;
        const maxAttempts = 50;

        while (attempts < maxAttempts) {
            if (window.productsClient && window.supabaseClient) {
                this.productsClient = window.productsClient;
                this.supabaseClient = window.supabaseClient;
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        throw new Error('Database clients not available after maximum attempts');
    }

    // ===== PRODUCTS MANAGEMENT =====

    async getAllProducts() {
        await this.ensureInitialized();
        if (this.productManager?.getAllProducts) {
            return await this.productManager.getAllProducts();
        }
        return [];
    }

    async updateProductPrice(productId, newPrice, reason, updatedBy = 'admin') {
        await this.ensureInitialized();
        if (this.productManager?.updateProductPrice) {
            return await this.productManager.updateProductPrice(productId, newPrice, reason, updatedBy);
        }
        throw new Error('Product manager not available');
    }

    async updateStock(productId, quantityChange, reason) {
        await this.ensureInitialized();
        if (this.productManager?.updateStock) {
            return await this.productManager.updateStock(productId, quantityChange, reason);
        }
        throw new Error('Product manager not available');
    }

    async createProduct(productData) {
        await this.ensureInitialized();
        if (typeof window.createProduct === 'function') {
            return await window.createProduct(productData);
        }
        throw new Error('Create product function not available');
    }

    async updateCompleteProduct(productId, updates) {
        await this.ensureInitialized();
        if (typeof window.updateCompleteProduct === 'function') {
            return await window.updateCompleteProduct(productId, updates);
        }
        throw new Error('Update product function not available');
    }

    async deleteProduct(productId) {
        await this.ensureInitialized();
        if (typeof window.deleteProduct === 'function') {
            return await window.deleteProduct(productId);
        }
        throw new Error('Delete product function not available');
    }

    // ===== BOXES MANAGEMENT =====

    async getAllBoxes() {
        await this.ensureInitialized();
        if (this.boxManager?.getAllBoxes) {
            return await this.boxManager.getAllBoxes();
        }
        return [];
    }

    async getBoxWithContents(boxId) {
        await this.ensureInitialized();
        if (this.boxManager?.getBoxWithContents) {
            return await this.boxManager.getBoxWithContents(boxId);
        }
        throw new Error('Box manager not available');
    }

    async createBox(boxData) {
        await this.ensureInitialized();
        if (this.boxManager?.addBox) {
            return await this.boxManager.addBox(boxData);
        }
        throw new Error('Box creation not available');
    }

    async updateBox(boxId, updates) {
        await this.ensureInitialized();
        if (this.boxManager?.updateBox) {
            return await this.boxManager.updateBox(boxId, updates);
        }
        throw new Error('Box update not available');
    }

    async deleteBox(boxId) {
        await this.ensureInitialized();
        if (this.boxManager?.deleteBox) {
            return await this.boxManager.deleteBox(boxId);
        }
        throw new Error('Box deletion not available');
    }

    async updateBoxPrice(boxId, newPriceCOP, newPriceUSD, reason) {
        await this.ensureInitialized();
        if (this.boxManager?.updateBoxPrice) {
            return await this.boxManager.updateBoxPrice(boxId, newPriceCOP, newPriceUSD, reason);
        }
        throw new Error('Box price update not available');
    }

    async updateBoxStock(boxId, change) {
        await this.ensureInitialized();
        if (this.boxManager?.adjustBoxStock) {
            return await this.boxManager.adjustBoxStock(boxId, change);
        }
        throw new Error('Box stock adjustment not available');
    }

    async updateBoxStatus(boxId, status) {
        await this.ensureInitialized();
        if (this.boxManager?.updateBoxStatus) {
            return await this.boxManager.updateBoxStatus(boxId, status);
        }
        throw new Error('Box status update not available');
    }

    async updateBoxContents(boxId, items) {
        await this.ensureInitialized();
        if (this.boxManager?.updateBoxContents) {
            return await this.boxManager.updateBoxContents(boxId, items);
        }
        throw new Error('Box contents update not available');
    }

    // ===== CREDITS MANAGEMENT =====

    async getUsersCredits() {
        await this.ensureInitialized();
        try {
            const { data, error } = await this.supabaseClient
                .from('user_credits')
                .select(`
                    *,
                    user_profiles:user_id (
                        id,
                        email,
                        full_name,
                        phone
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching users credits:', error);
            throw error;
        }
    }

    async addCredits(userId, amount, reason, addedBy = 'admin') {
        await this.ensureInitialized();
        try {
            const { data, error } = await this.supabaseClient
                .from('user_credits')
                .insert([{
                    user_id: userId,
                    amount: amount,
                    reason: reason,
                    added_by: addedBy
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error adding credits:', error);
            throw error;
        }
    }

    async updateCredits(creditId, updates) {
        await this.ensureInitialized();
        try {
            const { data, error } = await this.supabaseClient
                .from('user_credits')
                .update(updates)
                .eq('id', creditId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating credits:', error);
            throw error;
        }
    }

    async deleteCredits(creditId) {
        await this.ensureInitialized();
        try {
            const { error } = await this.supabaseClient
                .from('user_credits')
                .delete()
                .eq('id', creditId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting credits:', error);
            throw error;
        }
    }

    // ===== ANALYTICS & REPORTS =====

    async getInventoryReport() {
        await this.ensureInitialized();
        if (this.productManager?.getInventoryReport) {
            return await this.productManager.getInventoryReport();
        }
        return { report: null, products: [] };
    }

    async getLowStockProducts() {
        await this.ensureInitialized();
        if (this.productManager?.getLowStockProducts) {
            return await this.productManager.getLowStockProducts();
        }
        return [];
    }

    async getDailyPriceReport() {
        await this.ensureInitialized();
        if (this.productManager?.getDailyPriceReport) {
            return await this.productManager.getDailyPriceReport();
        }
        return [];
    }

    async getBoxAnalytics() {
        await this.ensureInitialized();
        if (this.boxManager?.getBoxAnalytics) {
            return await this.boxManager.getBoxAnalytics();
        }
        return [];
    }

    // ===== UTILITY METHODS =====

    async ensureInitialized() {
        if (!this.initialized) {
            await this.initialize();
        }
    }

    createBoxManager() {
        return {
            getAllBoxes: async () => {
                try {
                    const { data: boxes, error } = await this.productsClient
                        .from('current_boxes')
                        .select('*')
                        .order('featured', { ascending: false })
                        .order('name');

                    if (error) throw error;
                    return boxes || [];
                } catch (error) {
                    console.error('Error fetching boxes:', error);
                    throw error;
                }
            },

            getBoxWithContents: async (boxId) => {
                try {
                    const { data: box, error: boxError } = await this.productsClient
                        .from('current_boxes')
                        .select('*')
                        .eq('id', boxId)
                        .single();

                    if (boxError) throw boxError;

                    const { data: contents, error: contentsError } = await this.productsClient
                        .from('box_contents')
                        .select('*')
                        .eq('box_id', boxId)
                        .order('display_order');

                    if (contentsError) throw contentsError;

                    return { ...box, contents: contents || [] };
                } catch (error) {
                    console.error('Error fetching box with contents:', error);
                    throw error;
                }
            },

            addBox: async (boxData) => {
                try {
                    const { data, error } = await this.productsClient
                        .from('current_boxes')
                        .insert([boxData])
                        .select()
                        .single();

                    if (error) throw error;
                    return data;
                } catch (error) {
                    console.error('Error creating box:', error);
                    throw error;
                }
            },

            updateBox: async (boxId, updates) => {
                try {
                    const { data, error } = await this.productsClient
                        .from('current_boxes')
                        .update(updates)
                        .eq('id', boxId)
                        .select()
                        .single();

                    if (error) throw error;
                    return data;
                } catch (error) {
                    console.error('Error updating box:', error);
                    throw error;
                }
            },

            deleteBox: async (boxId) => {
                try {
                    const { error } = await this.productsClient
                        .from('current_boxes')
                        .delete()
                        .eq('id', boxId);

                    if (error) throw error;
                    return true;
                } catch (error) {
                    console.error('Error deleting box:', error);
                    throw error;
                }
            },

            updateBoxPrice: async (boxId, newPriceCOP, newPriceUSD, reason) => {
                try {
                    const { data: currentBox } = await this.productsClient
                        .from('current_boxes')
                        .select('price_cop, price_usd')
                        .eq('id', boxId)
                        .single();

                    await this.productsClient
                        .from('box_price_history')
                        .insert([{
                            box_id: boxId,
                            old_price_cop: currentBox.price_cop,
                            new_price_cop: newPriceCOP,
                            old_price_usd: currentBox.price_usd,
                            new_price_usd: newPriceUSD,
                            change_reason: reason,
                            updated_by: 'admin'
                        }]);

                    const { data, error } = await this.productsClient
                        .from('current_boxes')
                        .update({
                            price_cop: newPriceCOP,
                            price_usd: newPriceUSD,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', boxId)
                        .select()
                        .single();

                    if (error) throw error;
                    return data;
                } catch (error) {
                    console.error('Error updating box price:', error);
                    throw error;
                }
            },

            adjustBoxStock: async (boxId, change) => {
                try {
                    const { data: current, error: fetchError } = await this.productsClient
                        .from('current_boxes')
                        .select('stock_quantity, available')
                        .eq('id', boxId)
                        .single();

                    if (fetchError) throw fetchError;

                    const delta = Number(change || 0);
                    const previousStock = Number(current?.stock_quantity || 0);
                    const newStock = Math.max(0, previousStock + delta);

                    const updates = {
                        stock_quantity: newStock,
                        in_stock: newStock > 0,
                        updated_at: new Date().toISOString()
                    };

                    if (newStock <= 0) {
                        updates.available = false;
                      }

                    const { data, error } = await this.productsClient
                        .from('current_boxes')
                        .update(updates)
                        .eq('id', boxId)
                        .select('id, name, category, stock_quantity, available')
                        .single();

                    if (error) throw error;

                    return {
                        box: data,
                        previousStock,
                        newStock,
                        change: delta
                    };
                } catch (error) {
                    console.error('Error adjusting box stock:', error);
                    throw error;
                }
            },

            updateBoxStatus: async (boxId, status) => {
                try {
                    let updates = {};

                    switch(status) {
                        case 'active':
                            updates = { available: true, in_stock: true };
                            break;
                        case 'inactive':
                            updates = { available: false };
                            break;
                        case 'featured':
                            updates = { featured: true };
                            break;
                        case 'unfeatured':
                            updates = { featured: false };
                            break;
                    }

                    const { data, error } = await this.productsClient
                        .from('current_boxes')
                        .update(updates)
                        .eq('id', boxId)
                        .select()
                        .single();

                    if (error) throw error;
                    return data;
                } catch (error) {
                    console.error('Error updating box status:', error);
                    throw error;
                }
            },

            updateBoxContents: async (boxId, items) => {
                try {
                    const entries = Array.isArray(items) ? items : [];
                    const sanitized = entries
                        .map((item, index) => {
                            const name = typeof item === 'string'
                                ? item.trim()
                                : (item && item.product_name ? String(item.product_name).trim() : '');
                            if (!name) {
                                return null;
                            }
                            return {
                                box_id: boxId,
                                product_name: name,
                                display_order: index + 1
                            };
                        })
                        .filter(Boolean);

                    await this.productsClient
                        .from('box_contents')
                        .delete()
                        .eq('box_id', boxId);

                    if (!sanitized.length) {
                        return [];
                    }

                    const { data, error } = await this.productsClient
                        .from('box_contents')
                        .insert(sanitized)
                        .select();

                    if (error) throw error;
                    return data || [];
                } catch (error) {
                    console.error('Error updating box contents:', error);
                    throw error;
                }
            },

            getBoxAnalytics: async () => {
                try {
                    const { data, error } = await this.productsClient
                        .from('box_analytics')
                        .select(`
                            *,
                            current_boxes!inner(name, category)
                        `)
                        .order('revenue_cop', { ascending: false });

                    if (error) throw error;
                    return data || [];
                } catch (error) {
                    console.error('Error fetching box analytics:', error);
                    return [];
                }
            }
        };
    }
}

// Create singleton instance
const adminDatabaseService = new AdminDatabaseService();

// ===== EXPOSE ADMIN DATABASE FUNCTIONS GLOBALLY =====

// Products management
window.getAllProducts = async () => await adminDatabaseService.getAllProducts();
window.updateProductPrice = async (productId, newPrice, reason, updatedBy) =>
    await adminDatabaseService.updateProductPrice(productId, newPrice, reason, updatedBy);
window.updateStock = async (productId, quantityChange, reason) =>
    await adminDatabaseService.updateStock(productId, quantityChange, reason);
window.createProduct = async (productData) => await adminDatabaseService.createProduct(productData);
window.updateCompleteProduct = async (productId, updates) =>
    await adminDatabaseService.updateCompleteProduct(productId, updates);
window.deleteProduct = async (productId) => await adminDatabaseService.deleteProduct(productId);

// Boxes management
window.getAllBoxes = async () => await adminDatabaseService.getAllBoxes();
window.getBoxWithContents = async (boxId) => await adminDatabaseService.getBoxWithContents(boxId);
window.createBox = async (boxData) => await adminDatabaseService.createBox(boxData);
window.updateBox = async (boxId, updates) => await adminDatabaseService.updateBox(boxId, updates);
window.deleteBox = async (boxId) => await adminDatabaseService.deleteBox(boxId);
window.updateBoxPrice = async (boxId, newPriceCOP, newPriceUSD, reason) =>
    await adminDatabaseService.updateBoxPrice(boxId, newPriceCOP, newPriceUSD, reason);
window.updateBoxStock = async (boxId, change) => await adminDatabaseService.updateBoxStock(boxId, change);
window.updateBoxStatus = async (boxId, status) => await adminDatabaseService.updateBoxStatus(boxId, status);
window.updateBoxContents = async (boxId, items) => await adminDatabaseService.updateBoxContents(boxId, items);

// Credits management (legacy system)
window.getUsersCreditsLegacy = async () => await adminDatabaseService.getUsersCredits();
window.addCreditsLegacy = async (userId, amount, reason, addedBy) =>
    await adminDatabaseService.addCredits(userId, amount, reason, addedBy);
window.updateCreditsLegacy = async (creditId, updates) => await adminDatabaseService.updateCredits(creditId, updates);
window.deleteCreditsLegacy = async (creditId) => await adminDatabaseService.deleteCredits(creditId);

// Analytics & reports
window.getInventoryReport = async () => await adminDatabaseService.getInventoryReport();
window.getLowStockProducts = async () => await adminDatabaseService.getLowStockProducts();
window.getDailyPriceReport = async () => await adminDatabaseService.getDailyPriceReport();
window.getBoxAnalytics = async () => await adminDatabaseService.getBoxAnalytics();

// Initialize admin database service
window.adminDatabaseService = adminDatabaseService;