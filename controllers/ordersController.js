import { z } from 'zod';
import { getOrderByStripeSessionId } from '../db/database.js';
import { finalizeCheckoutSession } from './stripeWebhookController.js';
import { getStripeClient } from '../server/stripe.js';
import { cleanSingleLine, parseWithSchema } from '../server/validation.js';

const confirmationQuerySchema = z.object({
  session_id: z.preprocess(
    cleanSingleLine,
    z.string().min(1, 'Missing Stripe session id.').max(255)
  )
});

export async function showConfirmationOrder(req, res) {
  const { session_id: stripeSessionId } = parseWithSchema(confirmationQuerySchema, req.query);

  let order = getOrderByStripeSessionId(stripeSessionId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  if (order.status === 'pending' && process.env.STRIPE_SECRET_KEY) {
    const stripe = getStripeClient();
    const checkoutSession = await stripe.checkout.sessions.retrieve(stripeSessionId);
    order = await finalizeCheckoutSession(checkoutSession);
  }

  res.json(order);
}
