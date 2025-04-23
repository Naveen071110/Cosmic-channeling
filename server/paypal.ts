import paypal from '@paypal/checkout-server-sdk';

// Configure the PayPal client
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET_KEY;

  if (!clientId || !clientSecret) {
    throw new Error('Missing required environment variables: PAYPAL_CLIENT_ID or PAYPAL_SECRET_KEY');
  }

  // This environment is for sandbox (testing)
  // For production, use LiveEnvironment instead
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

// Create PayPal client
const client = () => {
  return new paypal.core.PayPalHttpClient(environment());
}

// Create an order
export async function createOrder(amount: number, description: string) {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: amount.toFixed(2)
        },
        description
      }
    ],
    application_context: {
      brand_name: 'Cosmic Channeling',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
    }
  });

  try {
    const response = await client().execute(request);
    return {
      id: response.result.id,
      status: response.result.status,
      links: response.result.links
    };
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
}

// Capture an order payment (finalize the transaction)
export async function captureOrder(orderId: string) {
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const response = await client().execute(request);
    return {
      id: response.result.id,
      status: response.result.status,
      payer: response.result.payer,
      purchase_units: response.result.purchase_units
    };
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    throw error;
  }
}

// Get order details
export async function getOrderDetails(orderId: string) {
  const request = new paypal.orders.OrdersGetRequest(orderId);

  try {
    const response = await client().execute(request);
    return response.result;
  } catch (error) {
    console.error('Error getting PayPal order details:', error);
    throw error;
  }
}

// Create a subscription
export async function createSubscription() {
  // In a production environment, this would create a subscription plan using PayPal Billing Plans API
  // For this demo, we'll simulate the subscription logic with a one-time payment
  // A real implementation would use PayPal's subscription APIs

  // Example of creating a $9 subscription order
  return createOrder(9.00, 'Cosmic Channeling Premium Monthly Subscription');
}