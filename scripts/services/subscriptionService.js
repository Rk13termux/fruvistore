// Subscription Service for AI Doctor Premium Features
// Handles user subscriptions, usage limits, and premium feature access

import { supabaseClient } from './supabaseService.js';

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

// Initialize user credits with 25 credits on first access
export async function initializeUserCredits(userId) {
  try {
    if (!supabaseClient) throw new Error('Supabase no inicializado');

    // Check if user already has credits
    const { data: existingCredits } = await supabaseClient
      .from('user_ai_credits')
      .select('credits_balance')
      .eq('user_id', userId)
      .single();

    if (existingCredits) {
      return existingCredits; // User already has credits
    }

    // Get user name from customers table
    const { data: customer } = await supabaseClient
      .from('customers')
      .select('full_name')
      .eq('user_id', userId)
      .single();

    const userName = customer?.full_name || 'Usuario';

    // Initialize with 25 credits
    const { data, error } = await supabaseClient
      .from('user_ai_credits')
      .upsert({
        user_id: userId,
        credits_balance: 25,
        total_credits_earned: 25,
        total_credits_spent: 0,
        last_credit_update: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select();

    if (error) throw error;

    // Record initial credit transaction
    await supabaseClient
      .from('credit_transactions')
      .insert({
        user_id: userId,
        transaction_type: 'initial_credits',
        amount: 25,
        description: `Créditos iniciales asignados a ${userName}`,
        balance_before: 0,
        balance_after: 25
      });

    return data[0];
  } catch (error) {
    console.error('Error initializing user credits:', error);
    throw error;
  }
}

// Check if user has active premium subscription
export async function checkPremiumAccess(userId) {
  try {
    if (!supabaseClient) {
      console.log('No supabaseClient available, returning free access');
      return { hasAccess: false, plan: 'free', reason: 'no_supabase' };
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

    try {
      const { data, error } = await supabaseClient
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      console.log('Supabase response:', { data, error });

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
    } catch (subscriptionError) {
      console.log('Subscription query failed, assuming no subscription:', subscriptionError.message);
      return { hasAccess: false, plan: 'free', reason: 'table_not_exists' };
    }

    if (!data) {
      console.log('No subscription data returned');
      return { hasAccess: false, plan: 'free', reason: 'no_subscription' };
    }

    // Check if subscription is still valid
    const now = new Date();
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if (endDate && now > endDate) {
      console.log('Subscription expired, updating status');
      // Mark as expired
      await supabaseClient
        .from('user_subscriptions')
        .update({ status: 'expired' })
        .eq('user_id', userId);

      return { hasAccess: false, plan: 'free', reason: 'expired' };
    }

    console.log('User has active premium subscription:', data.subscription_type);
    return {
      hasAccess: true,
      plan: data.subscription_type,
      subscription: data,
      limits: SUBSCRIPTION_PLANS[data.subscription_type] || SUBSCRIPTION_PLANS.free
    };
  } catch (error) {
    console.error('Error in checkPremiumAccess:', error);
    return { hasAccess: false, plan: 'free', reason: 'error' };
  }
}

// Check if user can make AI query based on daily/monthly limits
export async function canMakeAIQuery(userId, feature = 'chat_assistant') {
  try {
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
    if (!supabaseClient) return 0;
    if (!userId || userId === 'undefined') {
      console.warn('getCreditBalance called with invalid userId:', userId);
      return 0;
    }

    const { data, error } = await supabaseClient
      .from('user_ai_credits')
      .select('credits_balance')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No credits record, initialize
        console.log('No credits record found, initializing for user:', userId);
        await initializeUserCredits(userId);
        return 25; // Return initial credits
      }
      console.error('Error getting credit balance:', error);
      return 0;
    }

    return data?.credits_balance || 0;
  } catch (error) {
    console.error('Error getting credit balance:', error);
    return 0;
  }
}

// Add credits to user account (admin function)
export async function addCredits(userId, amount, description = 'Admin credit addition', adminUserId = null) {
  try {
    if (!supabaseClient) {
      console.warn('Supabase client not initialized, attempting to initialize...');
      // Try to initialize if not ready
      if (window.initializeSupabase) {
        window.initializeSupabase();
        // Wait a bit for initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      if (!supabaseClient) throw new Error('Supabase no inicializado');
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
    if (!supabaseClient) throw new Error('Supabase no inicializado');
    if (amount <= 0) throw new Error('Amount must be positive');

    // Get current balance
    const currentBalance = await getCreditBalance(userId);

    if (currentBalance < amount) {
      throw new Error('Insufficient credits');
    }

    // Update balance
    const newBalance = currentBalance - amount;
    const { data: updateData, error: updateError } = await supabaseClient
      .from('user_ai_credits')
      .upsert({
        user_id: userId,
        credits_balance: newBalance,
        total_credits_spent: (await getCreditStats(userId)).total_credits_spent + amount,
        last_credit_update: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select();

    if (updateError) throw updateError;

    // Record transaction
    await supabaseClient
      .from('credit_transactions')
      .insert({
        user_id: userId,
        transaction_type: 'usage',
        amount: -amount, // Negative for deductions
        description: description,
        balance_before: currentBalance,
        balance_after: newBalance
      });

    return updateData[0];
  } catch (error) {
    console.error('Error deducting credits:', error);
    throw error;
  }
}

// Get credit transaction history
export async function getCreditHistory(userId, limit = 50) {
  try {
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
    if (!supabaseClient) {
      console.warn('Supabase client not initialized, attempting to initialize...');
      // Try to initialize if not ready
      if (window.initializeSupabase) {
        window.initializeSupabase();
        // Wait a bit for initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      if (!supabaseClient) return [];
    }

    // Get all users from auth.users table first
    const { data: authUsers, error: authError } = await supabaseClient.auth.admin.listUsers();
    if (authError) {
      console.warn('Could not get auth users, falling back to credits table only:', authError);
    }

    // Get all credit records
    const { data: creditData, error: creditError } = await supabaseClient
      .from('user_ai_credits')
      .select('*')
      .order('updated_at', { ascending: false });

    if (creditError) throw creditError;

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

    // Create a map of user_id to auth user info
    const authUserMap = new Map();
    (authUsers?.users || []).forEach(user => {
      authUserMap.set(user.id, user);
    });

    // Combine all data
    const enrichedData = (creditData || []).map(credit => {
      const customer = customerMap.get(credit.user_id);
      const authUser = authUserMap.get(credit.user_id);

      return {
        ...credit,
        user_name: customer?.full_name || authUser?.user_metadata?.full_name || 'Sin nombre',
        user_email: customer?.email || authUser?.email || 'Sin email',
        user_phone: customer?.phone || authUser?.phone || null,
        user_created_at: authUser?.created_at || customer?.created_at || null,
        user_last_sign_in: authUser?.last_sign_in_at || null,
        user_status: authUser?.email_confirmed_at ? 'Verificado' : 'No verificado'
      };
    });

    // Also include users who have customer records but no credits yet
    const usersWithoutCredits = (customerData || []).filter(customer =>
      !(creditData || []).some(credit => credit.user_id === customer.user_id)
    );

    usersWithoutCredits.forEach(customer => {
      const authUser = authUserMap.get(customer.user_id);
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
        user_created_at: authUser?.created_at || customer.created_at,
        user_last_sign_in: authUser?.last_sign_in_at || null,
        user_status: authUser?.email_confirmed_at ? 'Verificado' : 'No verificado'
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
    if (!supabaseClient) {
      console.warn('Supabase client not initialized, attempting to initialize...');
      // Try to initialize if not ready
      if (window.initializeSupabase) {
        window.initializeSupabase();
        // Wait a bit for initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      if (!supabaseClient) return userId ? { total_credits_earned: 0, total_credits_spent: 0 } : {};
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

// ===== EXPOSE FUNCTIONS GLOBALLY FOR ADMIN PANEL =====

// Credit management functions
window.getCreditBalance = getCreditBalance;
window.addCredits = addCredits;
window.deductCredits = deductCredits;
window.getCreditHistory = getCreditHistory;
window.getAllUsersCredits = getAllUsersCredits;
window.getCreditStats = getCreditStats;
window.getAllCreditTransactions = getAllCreditTransactions;

// Subscription functions
window.checkPremiumAccess = checkPremiumAccess;
window.getSubscriptionStatus = getSubscriptionStatus;
window.createSubscription = createSubscription;
window.cancelSubscription = cancelSubscription;
window.getAvailablePlans = getAvailablePlans;
window.hasFeatureAccess = hasFeatureAccess;
window.canMakeAIQuery = canMakeAIQuery;
window.trackAIUsage = trackAIUsage;
window.initializeUserCredits = initializeUserCredits;