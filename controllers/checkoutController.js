import { z } from 'zod';
import { attachStripeSessionToOrder, createPendingOrder, getCart, markOrderFailed } from '../db/database.js';
import { logger } from '../server/logger.js';
import { getStripeClient } from '../server/stripe.js';
import { cleanSingleLine, parseWithSchema } from '../server/validation.js';

function touchCheckoutSession(req) {
  req.session.cartActive = true;
  req.session.lastCheckoutUpdate = Date.now();
}

const customerInfoSchema = z.object({
  email: z.preprocess(
    cleanSingleLine,
    z.string().email('Enter a valid email address.').max(254)
  ),
  shippingName: z.preprocess(
    cleanSingleLine,
    z.string().min(1, 'Shipping name is required.').max(120)
  ),
  addressLine1: z.preprocess(
    cleanSingleLine,
    z.string().min(1, 'Address line 1 is required.').max(160)
  ),
  addressLine2: z.preprocess(cleanSingleLine, z.string().max(160).optional().default('')),
  city: z.preprocess(cleanSingleLine, z.string().min(1, 'City is required.').max(80)),
  state: z.preprocess(cleanSingleLine, z.string().min(1, 'State is required.').max(80)),
  postalCode: z.preprocess(cleanSingleLine, z.string().min(1, 'ZIP code is required.').max(20)),
  country: z.preprocess(
    (value) => cleanSingleLine(value).toUpperCase() || 'US',
    z.string().length(2).default('US')
  )
});

function getCustomerInfo(body) {
  return parseWithSchema(customerInfoSchema, body);
}

function validateCheckoutStock(cart) {
  const issue = cart.items.find((item) => item.quantity > item.stockQuantity);

  if (issue) {
    const error = new Error(`${issue.name} has only ${issue.stockQuantity} available.`);
    error.status = 400;
    throw error;
  }
}

function getBaseUrl(req) {
  return process.env.SITE_URL || `${req.protocol}://${req.get('host')}`;
}

export async function createCheckoutSession(req, res) {
  const cart = getCart(req.sessionID);

  if (cart.items.length === 0) {
    const error = new Error('Your cart is empty.');
    error.status = 400;
    throw error;
  }

  validateCheckoutStock(cart);

  const customerInfo = getCustomerInfo(req.body);
  const stripe = getStripeClient();
  const order = createPendingOrder(req.sessionID, customerInfo, cart);
  const baseUrl = getBaseUrl(req);

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerInfo.email,
      line_items: cart.items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.category
          },
          unit_amount: item.priceCents
        },
        quantity: item.quantity
      })),
      metadata: {
        orderId: String(order.id),
        sessionId: req.sessionID
      },
      success_url: `${baseUrl}/order-confirmation.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout.html`
    });

    attachStripeSessionToOrder(order.id, checkoutSession.id);
    touchCheckoutSession(req);
    logger.info({ orderId: order.id, itemCount: cart.itemCount, subtotalCents: cart.subtotalCents }, 'Order created');

    res.json({
      orderId: order.id,
      url: checkoutSession.url
    });
  } catch (error) {
    markOrderFailed(order.id);
    logger.warn({ orderId: order.id, err: error }, 'Checkout session creation failed');
    throw error;
  }
}
