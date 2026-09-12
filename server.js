import 'dotenv/config';
import express from 'express';
import pinoHttp from 'pino-http';
import { getAllProducts, initializeSchema } from './db/database.js';
import { apiNotFound, errorHandler } from './middleware/errorHandler.js';
import { csrfProtection, sendCsrfToken } from './middleware/csrf.js';
import { generalApiLimiter } from './middleware/rateLimiters.js';
import { enforceHttps, securityHeaders } from './middleware/security.js';
import { createSessionMiddleware } from './middleware/session.js';
import cartRouter from './routes/cart.js';
import checkoutRouter from './routes/checkout.js';
import contactRouter from './routes/contact.js';
import healthRouter from './routes/health.js';
import ordersRouter from './routes/orders.js';
import productsRouter from './routes/products.js';
import { handleStripeWebhook } from './controllers/stripeWebhookController.js';
import { port, publicDir, validateProductionConfig } from './server/config.js';
import { logger } from './server/logger.js';

validateProductionConfig();
initializeSchema();
if (getAllProducts().length === 0) {
  await import('./db/seed.js');
}

const app = express();
const staticAssetPattern = /\.(?:css|js|png|jpe?g|webp|svg|ico|woff2)$/i;

app.set('trust proxy', 1);

app.use(enforceHttps);
app.use(securityHeaders());
app.use(pinoHttp({ logger }));

app.get('/products/dark-cherry-conserve.html', (_req, res) => {
  res.redirect(302, '/products/tart-red-cherry-conserve.html');
});

app.post('/api/webhooks/stripe', express.raw({ type: 'application/json', limit: '2mb' }), handleStripeWebhook);
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(createSessionMiddleware());

app.use('/api', generalApiLimiter);
app.get('/api/csrf-token', sendCsrfToken);
app.use('/api', csrfProtection);
app.use('/api/health', healthRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/contact', contactRouter);
app.use('/api/orders', ordersRouter);
app.use('/api', apiNotFound);

app.use(
  express.static(publicDir, {
    setHeaders(res, filePath) {
      if (staticAssetPattern.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    }
  })
);

app.use(errorHandler);

app.listen(port, () => {
  logger.info({ port }, `Jarmade server listening at http://localhost:${port}`);
});
