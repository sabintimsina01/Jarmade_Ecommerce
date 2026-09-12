import { z } from 'zod';
import { getAllProducts, getProductBySlug } from '../db/database.js';
import { parseWithSchema, slugSchema } from '../server/validation.js';

export function listProducts(_req, res) {
  res.json(getAllProducts());
}

export function showProduct(req, res) {
  const { slug } = parseWithSchema(z.object({ slug: slugSchema }), req.params);
  const product = getProductBySlug(slug);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  return res.json(product);
}
