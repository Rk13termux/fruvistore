// Webhook Handler for Gumroad Integration
// Processes payment events and updates subscriptions automatically

import { processWebhook } from '../services/gumroadService.js';

// Handle incoming webhooks from Gumroad
export async function handleGumroadWebhook(request) {
  try {
    // Get webhook data
    const webhookData = await request.json();
    const signature = request.headers.get('X-Gumroad-Signature');

    console.log('Received Gumroad webhook:', webhookData.event_type);

    // Process webhook
    const result = await processWebhook(webhookData, signature);

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      message: result.message,
      event: webhookData.event_type
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Webhook processing error:', error);

    // Return error response
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Webhook endpoint for Netlify Functions or similar
export async function webhookHandler(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Gumroad-Signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const webhookData = JSON.parse(event.body);
    const signature = event.headers['x-gumroad-signature'] || event.headers['X-Gumroad-Signature'];

    console.log('Processing Gumroad webhook:', webhookData.event_type);

    const result = await processWebhook(webhookData, signature);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: result.message,
        event: webhookData.event_type
      })
    };

  } catch (error) {
    console.error('Webhook error:', error);

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}

// Test webhook endpoint
export async function testWebhook() {
  const testData = {
    event_type: 'purchase',
    resource: {
      id: 'test-purchase-id',
      email: 'test@example.com',
      product_id: 'test-product-id',
      license_key: 'test-license-key',
      created_at: new Date().toISOString()
    }
  };

  try {
    const result = await processWebhook(testData, null);
    console.log('Test webhook result:', result);
    return result;
  } catch (error) {
    console.error('Test webhook error:', error);
    throw error;
  }
}

// Export for use in different environments
if (typeof window !== 'undefined') {
  // Browser environment
  window.handleGumroadWebhook = handleGumroadWebhook;
  window.testWebhook = testWebhook;
}