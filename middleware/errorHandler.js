import { logger } from '../server/logger.js';

export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';
  const message = isProduction && status >= 500 ? 'Internal server error' : err.message || 'Internal server error';

  logger.error(
    {
      err,
      status
    },
    'Request failed'
  );

  res.status(status).json({ error: message });
}

export function apiNotFound(_req, res) {
  res.status(404).json({ error: 'Not found' });
}
