import { z } from 'zod';
import {
  MAX_CART_ITEM_QUANTITY,
  getCart,
  getCartItem,
  getProductById,
  removeCartItem,
  setCartItemQuantity,
  upsertCartItem
} from '../db/database.js';
import { parseWithSchema, productIdSchema, quantitySchema } from '../server/validation.js';

function touchCartSession(req) {
  req.session.cartActive = true;
  req.session.lastCartUpdate = Date.now();
}

function validateQuantity(quantity) {
  if (quantity > MAX_CART_ITEM_QUANTITY) {
    const error = new Error(`Quantity cannot exceed ${MAX_CART_ITEM_QUANTITY} per item.`);
    error.status = 400;
    throw error;
  }
}

function getProductOrThrow(productId) {
  const product = getProductById(productId);

  if (!product) {
    const error = new Error('Product not found.');
    error.status = 404;
    throw error;
  }

  return product;
}

function validateStock(product, quantity) {
  if (product.stockQuantity < quantity) {
    const error = new Error(`${product.name} has only ${product.stockQuantity} available.`);
    error.status = 400;
    throw error;
  }
}

export function showCart(req, res) {
  res.json(getCart(req.sessionID));
}

export function addCartItem(req, res) {
  const { productId, quantity } = parseWithSchema(
    z.object({
      productId: productIdSchema,
      quantity: quantitySchema
    }),
    req.body
  );
  const product = getProductOrThrow(productId);
  const existingItem = getCartItem(req.sessionID, productId);
  const newQuantity = (existingItem?.quantity || 0) + quantity;

  validateQuantity(newQuantity);
  validateStock(product, newQuantity);
  touchCartSession(req);

  res.status(201).json(upsertCartItem(req.sessionID, product, quantity));
}

export function updateCartItem(req, res) {
  const { productId } = parseWithSchema(z.object({ productId: productIdSchema }), req.params);
  const { quantity } = parseWithSchema(z.object({ quantity: quantitySchema }), req.body);
  const product = getProductOrThrow(productId);
  const existingItem = getCartItem(req.sessionID, productId);

  if (!existingItem) {
    const error = new Error('Cart item not found.');
    error.status = 404;
    throw error;
  }

  validateQuantity(quantity);
  validateStock(product, quantity);
  touchCartSession(req);

  res.json(setCartItemQuantity(req.sessionID, productId, quantity));
}

export function deleteCartItem(req, res) {
  const { productId } = parseWithSchema(z.object({ productId: productIdSchema }), req.params);

  touchCartSession(req);
  res.json(removeCartItem(req.sessionID, productId));
}
