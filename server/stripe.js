import Stripe from 'stripe';

let stripeClient;

export function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    const error = new Error('Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.');
    error.status = 503;
    throw error;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}
