# Jarmade Node Site

This project serves the existing Jarmade static website with Node.js and Express while moving product catalog data into a local SQLite database.

The visual site remains static HTML, compiled Tailwind utility classes, local JavaScript, and image assets inside `public/`. Product data is exposed through JSON API routes.

## Tech

- Node.js + Express
- SQLite with Node's built-in `node:sqlite` module
- `dotenv` for environment variables
- Tailwind CLI compiled to `public/css/styles.css`
- Self-hosted DM Serif Display and Instrument Sans font files in `public/fonts/`
- `helmet` for HTTP security headers and Content-Security-Policy
- `zod` for server-side input validation
- `express-rate-limit` for abuse throttling
- `pino` and `pino-http` for structured request/error logging
- `express-session` with a SQLite-backed session store for guest carts
- Stripe Checkout redirect flow for payment

SQLite is used for this batch because it keeps local development simple, fast, and self-contained. The app uses Node's built-in SQLite module, so there is no native `better-sqlite3` binary to rebuild when Node versions change. A hosted database can be added later when checkout, admin tools, or production data management require it.

Requires Node.js 22 or newer.

## Setup

```bash
npm install
cp .env.example .env
npm run db:seed
npm run build:css
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production

```bash
npm install
npm run db:seed
npm start
```

Set environment variables in `.env` or in the hosting dashboard.

For checkout, set these Stripe test or live values before taking payments:

```text
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PUBLISHABLE_KEY=
SITE_URL=
SESSION_SECRET=
LOG_LEVEL=info
```

`SESSION_SECRET` is required in production. Use a long random value and do not commit it.

## API

```text
GET /api/health
GET /api/products
GET /api/products/:slug
GET /api/cart
GET /api/csrf-token
POST /api/cart/items
PATCH /api/cart/items/:productId
DELETE /api/cart/items/:productId
POST /api/checkout/session
POST /api/contact
POST /api/webhooks/stripe
GET /api/orders/confirmation
```

## Cart and Checkout

Guest carts are tied to an `express-session` cookie named `jarmade.sid`. Session data is stored in the same SQLite database, so carts survive page reloads and server restarts while the session cookie remains valid.

Checkout uses Stripe Checkout redirect instead of custom card inputs. This keeps payment handling on Stripe's secure hosted page and avoids storing card details in this app.

Browser state-changing requests use a CSRF token from `GET /api/csrf-token`. The shared cart script attaches this token automatically for cart and checkout requests and populates hidden CSRF fields on contact forms.

## CSS And Fonts

Tailwind is compiled ahead of time instead of running in the browser. The source file is `src/styles.css`, the config is `tailwind.config.js`, and the generated production stylesheet is `public/css/styles.css`.

```bash
npm run build:css
npm run watch:css
```

The display and body fonts are self-hosted from `public/fonts/`, so the live site does not request Google Fonts at runtime.

For local Stripe webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## Product Data

The seed script reads `public/products/catalog-data.js` and writes all catalog fields into SQLite. That original file is now deprecated and kept only as a migration/reference source.

Owner-confirmed USD prices are stored in `public/products/catalog-data.js`: Strawberry $9, Blackberry $9, both Peach varieties $10, Green Tomato $10, Raspberry $10, Apricot $9, Blueberry $10, and Tart Red Cherry $9.

Placeholder stock is set to `100` per product during seeding. Update real inventory before launch, and avoid running the seed script in production after live inventory starts changing unless you intend to reset those placeholder stock values.

## Security Notes

Production startup fails fast if required environment variables are missing, `SESSION_SECRET` is too short, or `SITE_URL` is not HTTPS. Contact submissions are validated server-side and stored in SQLite in the `contact_submissions` table.

See `DEPLOYMENT.md` for the production checklist, CSP allowlist, hosting recommendation, and launch notes.
