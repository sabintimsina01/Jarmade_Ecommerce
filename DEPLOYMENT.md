# Jarmade Deployment Checklist

## Required Environment Variables

Set these in the production host dashboard. Do not commit real values.

```text
NODE_ENV=production
PORT=3000
DATABASE_URL=file:/data/jarmade.db
SESSION_SECRET=
SITE_URL=https://your-production-domain.com
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PUBLISHABLE_KEY=
LOG_LEVEL=info
```

`SESSION_SECRET` must be a long random string of at least 32 characters. `SITE_URL` must use `https://` in production.

## Install And Seed

```bash
npm install
npm run db:seed
npm start
```

Run `npm run db:seed` before the first production start so the products table exists and is populated. `npm start` runs the local Tailwind build first and writes `public/css/styles.css`. After real stock values are entered, do not re-run the seed script unless you intend to reset placeholder stock and catalog values from `public/products/catalog-data.js`.

## Recommended Host

For this small Node + SQLite store, Fly.io with a persistent volume is a good first production target. It supports a long-running Node process and can mount durable storage for the SQLite database.

Render, Railway, or similar hosts can also work only if the service includes persistent disk storage. If the app needs multiple server instances, admin inventory workflows, or larger order volume, move the database to managed Postgres before scaling horizontally.

## Stripe Setup

Use Stripe Checkout redirect flow. The app never receives card numbers.

Configure a webhook endpoint for each environment:

```text
https://your-production-domain.com/api/webhooks/stripe
```

Subscribe to checkout session events, then copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`. Use separate test and live Stripe keys per environment.

## Security Controls

- Helmet sets security headers and a Content-Security-Policy.
- Production HTTP traffic redirects to HTTPS.
- Strict-Transport-Security is enabled in production.
- Session cookies are `httpOnly`, `sameSite=lax`, and `Secure` in production.
- State-changing browser API routes require CSRF tokens.
- Cart mutations, checkout creation, and contact submissions are rate-limited.
- Public contact forms include a honeypot field.
- Server inputs are validated with zod.
- Production error responses hide stack traces and internal paths.
- Structured pino logs record key events without card data, session cookies, CSRF tokens, or full shipping addresses.

## CSP Allowlist

The policy allows only the origins the current site needs:

- `self` for local pages, scripts, API calls, and images
- `https://js.stripe.com` and `https://checkout.stripe.com` for Stripe Checkout support

Tailwind is compiled locally into `public/css/styles.css`, and fonts are self-hosted from `public/fonts/`, so the CSP does not allowlist Tailwind CDN or Google Fonts. The current static site still uses inline scripts and one inline texture style, so the CSP includes `'unsafe-inline'` for scripts/styles. Before a fully mature production launch, move inline scripts/styles into static files so the CSP can be tightened with nonces or hashes.

## Before Fully Live

- Replace placeholder product prices and stock quantities with real values.
- Add email notification or admin review for contact submissions if the team needs inbox delivery.
- Put the site behind the host's DDoS/WAF protection if available.
- Keep Stripe Checkout for PCI scope reduction; do not add custom card inputs unless the app is ready for Stripe Elements requirements.
- Add account/login security only if customer accounts or admin tools are introduced.

## September 12 catalog update

For an existing installation, back up the database and stop the app, then run
`npm run db:update-catalog` and restart with `npm start`. This applies the confirmed
prices, adds the four new listings, and updates open cart prices. Existing stock,
other catalog products, and historical orders are preserved. Newly added products
use the existing seed stock default of 100; enter actual inventory before selling.
For a fresh installation, continue to use `npm run db:seed`.

Apricot and Tart Red Cherry use the Jarmade logo until matching product photos are supplied.
