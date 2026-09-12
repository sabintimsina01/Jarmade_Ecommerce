import { z } from 'zod';

export const slugSchema = z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/);
export const productIdSchema = z.coerce.number().int().positive();
export const quantitySchema = z.coerce.number().int().min(1).max(20);

export function cleanSingleLine(value) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function cleanMultiline(value) {
  return String(value ?? '')
    .replace(/[^\S\r\n]+/g, ' ')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim();
}

export function validationError(message = 'Invalid request data.') {
  const error = new Error(message);
  error.status = 400;
  return error;
}

export function parseWithSchema(schema, data) {
  const result = schema.safeParse(data);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    throw validationError(firstIssue?.message || 'Invalid request data.');
  }

  return result.data;
}
