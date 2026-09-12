import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["x-csrf-token"]',
      'req.headers["stripe-signature"]',
      'res.headers["set-cookie"]',
      'sessionId',
      '*.sessionId',
      '*.stripeSignature'
    ],
    remove: true
  }
});

export function publicErrorMessage(error) {
  return error?.message || 'Internal server error';
}
