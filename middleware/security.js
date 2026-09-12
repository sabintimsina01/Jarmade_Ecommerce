import helmet from 'helmet';

const isProduction = process.env.NODE_ENV === 'production';

const stripeOrigins = ['https://js.stripe.com', 'https://checkout.stripe.com'];

export function enforceHttps(req, res, next) {
  if (!isProduction) {
    return next();
  }

  const forwardedProto = req.get('x-forwarded-proto');
  const isSecure = req.secure || forwardedProto === 'https';

  if (isSecure) {
    return next();
  }

  return res.redirect(308, `https://${req.get('host')}${req.originalUrl}`);
}

export function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", ...stripeOrigins],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", 'data:'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", ...stripeOrigins],
        frameSrc: stripeOrigins,
        formAction: ["'self'", 'https://checkout.stripe.com'],
        upgradeInsecureRequests: isProduction ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false,
    hsts: isProduction
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: false
        }
      : false,
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    }
  });
}
