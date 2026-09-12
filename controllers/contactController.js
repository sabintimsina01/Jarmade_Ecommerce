import { z } from 'zod';
import { createContactSubmission } from '../db/database.js';
import { logger } from '../server/logger.js';
import { cleanMultiline, cleanSingleLine, parseWithSchema } from '../server/validation.js';

const contactSchema = z.object({
  name: z.preprocess(cleanSingleLine, z.string().min(1, 'Name is required.').max(120)),
  email: z.preprocess(
    cleanSingleLine,
    z.string().email('Enter a valid email address.').max(254).transform((value) => value.toLowerCase())
  ),
  phone: z.preprocess(cleanSingleLine, z.string().max(40).default('')),
  product: z.preprocess(cleanSingleLine, z.string().max(160).default('')),
  message: z.preprocess(cleanMultiline, z.string().max(2000).default('')),
  website: z.preprocess(cleanSingleLine, z.string().max(200).default('')),
  _subject: z.preprocess(cleanSingleLine, z.string().max(160).default(''))
});

function wantsJson(req) {
  return req.accepts(['html', 'json']) === 'json' || req.is('application/json');
}

function getSafeRedirect(req) {
  const fallback = '/#contact';
  const referer = req.get('referer');

  if (!referer) return fallback;

  try {
    const requestOrigin = `${req.protocol}://${req.get('host')}`;
    const refererUrl = new URL(referer);

    if (refererUrl.origin !== requestOrigin) {
      return fallback;
    }

    return `${refererUrl.pathname}${refererUrl.search}#contact`;
  } catch {
    return fallback;
  }
}

function sendSuccess(req, res) {
  if (wantsJson(req)) {
    return res.status(201).json({ ok: true });
  }

  return res.redirect(303, getSafeRedirect(req));
}

export function submitContactForm(req, res) {
  const submission = parseWithSchema(contactSchema, req.body);

  if (submission.website) {
    logger.info('Honeypot contact submission ignored');
    return sendSuccess(req, res);
  }

  const saved = createContactSubmission({
    name: submission.name,
    email: submission.email,
    phone: submission.phone,
    product: submission.product,
    message: submission.message,
    subject: submission._subject
  });

  logger.info({ contactSubmissionId: saved.id }, 'Contact submission received');
  return sendSuccess(req, res);
}
