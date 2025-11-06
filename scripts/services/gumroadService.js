// Gumroad Payment Integration Service
// Handles subscription payments, webhooks, and license management

import { getUsersClient } from './supabaseService.js';

const GUMROAD_CONFIG = {
  baseUrl: 'https://api.gumroad.com/v2',
  // Environment variables for Gumroad
  accessToken: import.meta.env?.VITE_GUMROAD_ACCESS_TOKEN || 'your-gumroad-access-token',
  productId: import.meta.env?.VITE_GUMROAD_PRODUCT_ID || 'your-product-id',
  webhookSecret: import.meta.env?.VITE_GUMROAD_WEBHOOK_SECRET || 'your-webhook-secret'
};

// Subscription plans mapping to Gumroad products
const SUBSCRIPTION_PLANS = {
  premium_monthly: {
    gumroadId: import.meta.env?.VITE_GUMROAD_MONTHLY_ID || 'monthly-plan-id',
    name: 'Premium Mensual',
    price: 99000, // COP
    duration: 'monthly',
    features: ['ai_doctor', 'nutrition_plans', 'unlimited_queries']
  },
  premium_yearly: {
    gumroadId: import.meta.env?.VITE_GUMROAD_YEARLY_ID || 'yearly-plan-id',
    name: 'Premium Anual',
    price: 999000, // COP
    duration: 'yearly',
    features: ['ai_doctor', 'nutrition_plans', 'unlimited_queries', 'priority_support']
  }
};

// Generate Gumroad checkout URL
export function generateCheckoutUrl(planType, userEmail = null) {
  const plan = SUBSCRIPTION_PLANS[planType];
  if (!plan) throw new Error('Plan de suscripción no válido');

  const baseUrl = 'https://fruvi.gumroad.com/l/';
  const params = new URLSearchParams({
    wanted: 'true',
    email: userEmail || '',
    locale: 'es'
  });

  return `${baseUrl}${plan.gumroadId}?${params.toString()}`;
}

// Verify Gumroad license
export async function verifyLicense(licenseKey, productId = null) {
  try {
    const response = await fetch(`${GUMROAD_CONFIG.baseUrl}/licenses/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId || GUMROAD_CONFIG.productId,
        license_key: licenseKey,
        increment_uses_count: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error verificando licencia');
    }

    return {
      valid: data.success,
      uses: data.uses,
      purchase: data.purchase,
      subscription: data.subscription || null
    };
  } catch (error) {
    console.error('Error verifying Gumroad license:', error);
    return { valid: false, error: error.message };
  }
}

// Get subscription details from Gumroad
export async function getSubscriptionDetails(subscriptionId) {
  try {
    const response = await fetch(`${GUMROAD_CONFIG.baseUrl}/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GUMROAD_CONFIG.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error obteniendo detalles de suscripción');
    }

    return data.subscription;
  } catch (error) {
    console.error('Error getting subscription details:', error);
    return null;
  }
}

// Cancel subscription via Gumroad
export async function cancelSubscription(subscriptionId) {
  try {
    const response = await fetch(`${GUMROAD_CONFIG.baseUrl}/subscriptions/${subscriptionId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GUMROAD_CONFIG.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error cancelando suscripción');
    }

    return data.subscription;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
}

// Process Gumroad webhook
export async function processWebhook(webhookData, signature) {
  try {
    // Verify webhook signature
    const isValidSignature = verifyWebhookSignature(webhookData, signature);
    if (!isValidSignature) {
      throw new Error('Invalid webhook signature');
    }

    const { event_type, resource } = webhookData;

    switch (event_type) {
      case 'purchase':
        return await handlePurchaseEvent(resource);
      case 'subscription_created':
        return await handleSubscriptionCreated(resource);
      case 'subscription_updated':
        return await handleSubscriptionUpdated(resource);
      case 'subscription_cancelled':
        return await handleSubscriptionCancelled(resource);
      case 'subscription_expired':
        return await handleSubscriptionExpired(resource);
      default:
        console.log('Unhandled webhook event:', event_type);
        return { success: true, message: 'Event not handled' };
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    throw error;
  }
}

// Handle purchase event
async function handlePurchaseEvent(purchase) {
  try {
    // Find user by email
    const userEmail = purchase.email;
    const licenseKey = purchase.license_key;

    // Update or create subscription in our database
    const subscriptionData = {
      gumroad_purchase_id: purchase.id,
      gumroad_license_key: licenseKey,
      subscription_type: mapGumroadProductToPlan(purchase.product_id),
      status: 'active',
      start_date: new Date(purchase.created_at).toISOString(),
      payment_method: 'gumroad',
      gumroad_data: purchase
    };

    // If it's a subscription product, set end date
    if (purchase.subscription_id) {
      subscriptionData.end_date = calculateSubscriptionEndDate(purchase);
    }

    // Update user subscription in database
    await updateUserSubscriptionFromGumroad(userEmail, subscriptionData);

    return { success: true, message: 'Purchase processed successfully' };
  } catch (error) {
    console.error('Error handling purchase event:', error);
    throw error;
  }
}

// Handle subscription created
async function handleSubscriptionCreated(subscription) {
  try {
    const userEmail = subscription.email;

    const subscriptionData = {
      gumroad_subscription_id: subscription.id,
      subscription_type: mapGumroadProductToPlan(subscription.product_id),
      status: 'active',
      start_date: new Date(subscription.created_at).toISOString(),
      end_date: new Date(subscription.renewed_at || subscription.created_at).toISOString(),
      payment_method: 'gumroad',
      gumroad_data: subscription
    };

    await updateUserSubscriptionFromGumroad(userEmail, subscriptionData);

    return { success: true, message: 'Subscription created successfully' };
  } catch (error) {
    console.error('Error handling subscription created:', error);
    throw error;
  }
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription) {
  try {
    const userEmail = subscription.email;

    const subscriptionData = {
      status: subscription.status === 'active' ? 'active' : 'cancelled',
      end_date: new Date(subscription.renewed_at).toISOString(),
      gumroad_data: subscription
    };

    await updateUserSubscriptionFromGumroad(userEmail, subscriptionData);

    return { success: true, message: 'Subscription updated successfully' };
  } catch (error) {
    console.error('Error handling subscription updated:', error);
    throw error;
  }
}

// Handle subscription cancelled
async function handleSubscriptionCancelled(subscription) {
  try {
    const userEmail = subscription.email;

    const subscriptionData = {
      status: 'cancelled',
      end_date: new Date().toISOString(),
      gumroad_data: subscription
    };

    await updateUserSubscriptionFromGumroad(userEmail, subscriptionData);

    return { success: true, message: 'Subscription cancelled successfully' };
  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
    throw error;
  }
}

// Handle subscription expired
async function handleSubscriptionExpired(subscription) {
  try {
    const userEmail = subscription.email;

    const subscriptionData = {
      status: 'expired',
      gumroad_data: subscription
    };

    await updateUserSubscriptionFromGumroad(userEmail, subscriptionData);

    return { success: true, message: 'Subscription expired successfully' };
  } catch (error) {
    console.error('Error handling subscription expired:', error);
    throw error;
  }
}

// Update user subscription from Gumroad data
async function updateUserSubscriptionFromGumroad(userEmail, subscriptionData) {
  try {
    const supabaseClient = getUsersClient();

    // Find user by email
    const { data: userData, error: userError } = await supabaseClient
      .from('customers')
      .select('user_id')
      .eq('email', userEmail)
      .single();

    if (userError || !userData) {
      console.warn('User not found for email:', userEmail);
      return;
    }

    const userId = userData.user_id;

    // Update subscription
    const { data, error } = await supabaseClient
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        ...subscriptionData
      }, { onConflict: 'user_id' })
      .select();

    if (error) throw error;

    console.log('Subscription updated for user:', userId, subscriptionData);
    return data[0];
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
}

// Map Gumroad product ID to our plan type
function mapGumroadProductToPlan(gumroadProductId) {
  for (const [planType, planData] of Object.entries(SUBSCRIPTION_PLANS)) {
    if (planData.gumroadId === gumroadProductId) {
      return planType;
    }
  }
  return 'premium_monthly'; // Default fallback
}

// Calculate subscription end date
function calculateSubscriptionEndDate(purchase) {
  const startDate = new Date(purchase.created_at);
  const plan = SUBSCRIPTION_PLANS[mapGumroadProductToPlan(purchase.product_id)];

  if (plan.duration === 'yearly') {
    startDate.setFullYear(startDate.getFullYear() + 1);
  } else {
    startDate.setMonth(startDate.getMonth() + 1);
  }

  return startDate.toISOString();
}

// Verify webhook signature
function verifyWebhookSignature(webhookData, signature) {
  // Implement HMAC SHA256 verification
  // This is a simplified version - in production use proper crypto verification
  return true; // For now, accept all webhooks (implement proper verification)
}

// Get available plans
export function getAvailablePlans() {
  return SUBSCRIPTION_PLANS;
}

// Check if user has active Gumroad subscription
export async function checkGumroadSubscription(userId) {
  try {
    const supabaseClient = getUsersClient();

    const { data, error } = await supabaseClient
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return data || null;
  } catch (error) {
    console.error('Error checking Gumroad subscription:', error);
    return null;
  }
}