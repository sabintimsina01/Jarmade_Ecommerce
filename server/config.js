import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const publicDir = path.join(rootDir, 'public');
export const port = Number.parseInt(process.env.PORT || '3000', 10);
export const isProduction = process.env.NODE_ENV === 'production';

export function resolveDatabasePath(databaseUrl = process.env.DATABASE_URL || 'file:./db/jarmade.db') {
  const rawPath = databaseUrl.startsWith('file:') ? databaseUrl.slice('file:'.length) : databaseUrl;
  return path.isAbsolute(rawPath) ? rawPath : path.resolve(rootDir, rawPath);
}

export function validateProductionConfig() {
  if (!isProduction) {
    return;
  }

  const requiredKeys = [
    'DATABASE_URL',
    'SESSION_SECRET',
    'SITE_URL',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PUBLISHABLE_KEY'
  ];
  const missing = requiredKeys.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
  }

  if (process.env.SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters in production.');
  }

  if (!process.env.SITE_URL.startsWith('https://')) {
    throw new Error('SITE_URL must start with https:// in production.');
  }
}
