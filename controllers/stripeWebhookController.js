import { finalizePaidOrder, getOrderById, getOrderByStripeSessionId } from '../db/database.js';
import { logger } from '../server/logger.js';
import { getStripeClient } from '../server/stripe.js';

async function finalizeCheckoutSession(checkoutSession) {
  const orderId = Number(checkoutSession.metadata?.orderId);
  const order = Number.isInteger(orderId) && orderId > 0
    ? getOrderById(orderId)
    : getOrderByStripeSessionId(checkoutSession.id);

  if (!order) {
    logger.warn({ stripeSessionId: checkoutSession.id }, 'Stripe checkout session has no matching order');
    return null;
  }

  if (checkoutSession.payment_status !== 'paid') {
    logger.warn({ orderId: order.id, stripeSessionId: checkoutSession.id }, 'Stripe checkout session completed without paid status');
    return order;
  }

  const paidOrder = finalizePaidOrder(order.id);
  logger.info({ orderId: paidOrder.id, subtotalCents: paidOrder.subtotalCents }, 'Payment succeeded');
  return paidOrder;
}

export async function handleStripeWebhook(req, res) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    const error = new Error('Stripe webhook secret is not configured.');
    error.status = 503;
    throw error;
  }

  const stripe = getStripeClient();
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    logger.warn(
      {
        stripeError: {
          type: error.type,
          message: error.message
        }
      },
      'Stripe webhook signature verification failed'
    );
    return res.status(400).json({ error: 'Webhook signature verification failed.' });
  }

  if (event.type === 'checkout.session.completed') {
    await finalizeCheckoutSession(event.data.object);
  } else if (event.type === 'checkout.session.async_payment_failed') {
    logger.warn({ stripeSessionId: event.data.object.id }, 'Stripe payment failed');
  }

  res.json({ received: true });
}

export { finalizeCheckoutSession };
