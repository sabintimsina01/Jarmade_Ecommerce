import crypto from 'node:crypto';

const CSRF_TOKEN_BYTES = 32;
const CSRF_COOKIE_NAME = 'jarmade.csrf';
const isProduction = process.env.NODE_ENV === 'production';

function createToken() {
  return crypto.randomBytes(CSRF_TOKEN_BYTES).toString('hex');
}

function ensureCsrfToken(req, res) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = createToken();
  }

  res.cookie(CSRF_COOKIE_NAME, req.session.csrfToken, {
    httpOnly: false,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24
  });

  return req.session.csrfToken;
}

function isSafeMethod(method) {
  return method === 'GET' || method === 'HEAD' || method === 'OPTIONS';
}

function getCookie(req, cookieName) {
  const cookies = String(req.get('cookie') || '').split(';');
  const encodedName = `${cookieName}=`;
  const cookie = cookies.map((item) => item.trim()).find((item) => item.startsWith(encodedName));

  if (!cookie) return '';

  try {
    return decodeURIComponent(cookie.slice(encodedName.length));
  } catch {
    return '';
  }
}

function csrfError() {
  const error = new Error('Invalid CSRF token.');
  error.status = 403;
  return error;
}

export function sendCsrfToken(req, res) {
  res.json({ csrfToken: ensureCsrfToken(req, res) });
}

export function csrfProtection(req, res, next) {
  if (isSafeMethod(req.method) || req.path.startsWith('/api/webhooks/stripe')) {
    return next();
  }

  const expectedToken = req.session?.csrfToken;
  const requestToken = req.get('x-csrf-token') || req.body?._csrf;
  const cookieToken = getCookie(req, CSRF_COOKIE_NAME);

  if (
    !expectedToken ||
    !requestToken ||
    !cookieToken ||
    requestToken !== expectedToken ||
    cookieToken !== expectedToken
  ) {
    return next(csrfError());
  }

  ensureCsrfToken(req, res);
  return next();
}
