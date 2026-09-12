import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { resolveDatabasePath } from '../server/config.js';

export const databasePath = resolveDatabasePath();

fs.mkdirSync(path.dirname(databasePath), { recursive: true });

export const db = new DatabaseSync(databasePath);
db.exec('PRAGMA journal_mode = WAL');

export const MAX_CART_ITEM_QUANTITY = 20;
export const DEFAULT_STOCK_QUANTITY = 100;

function ensureProductsStockColumn() {
  const columns = db.prepare("PRAGMA table_info('products')").all();
  const exists = columns.some((column) => column.name === 'stock_quantity');

  if (!exists) {
    db.exec('ALTER TABLE products ADD COLUMN stock_quantity INTEGER NOT NULL DEFAULT 100');
  }
}

export function initializeSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT,
      card_image TEXT,
      detail_image TEXT,
      card_label TEXT,
      tagline TEXT,
      card_description TEXT,
      description TEXT,
      best_with TEXT,
      detail_best_with TEXT,
      flavor TEXT,
      cooking_note TEXT,
      serving_description TEXT,
      flavor_family TEXT,
      serving_ideas_json TEXT NOT NULL DEFAULT '[]',
      uses_json TEXT NOT NULL DEFAULT '[]',
      price_cents INTEGER NOT NULL,
      stock_quantity INTEGER NOT NULL DEFAULT 100,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      sess TEXT NOT NULL,
      expired INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_expired ON sessions(expired);

    CREATE TABLE IF NOT EXISTS cart_items (
      session_id TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price_cents INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (session_id, product_id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      email TEXT NOT NULL,
      shipping_name TEXT NOT NULL,
      shipping_address_line1 TEXT NOT NULL,
      shipping_address_line2 TEXT,
      shipping_city TEXT NOT NULL,
      shipping_state TEXT NOT NULL,
      shipping_postal_code TEXT NOT NULL,
      shipping_country TEXT NOT NULL DEFAULT 'US',
      line_items_json TEXT NOT NULL,
      subtotal_cents INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      stripe_session_id TEXT UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_orders_session_id ON orders(session_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      product TEXT,
      message TEXT,
      subject TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);
  `);

  ensureProductsStockColumn();
}

function parseJsonArray(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function serializeProduct(row) {
  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    image: row.image,
    cardImage: row.card_image,
    detailImage: row.detail_image,
    cardLabel: row.card_label,
    tagline: row.tagline,
    cardDescription: row.card_description,
    description: row.description,
    bestWith: row.best_with,
    detailBestWith: row.detail_best_with,
    flavor: row.flavor,
    cookingNote: row.cooking_note,
    servingDescription: row.serving_description,
    flavorFamily: row.flavor_family,
    servingIdeas: parseJsonArray(row.serving_ideas_json),
    uses: parseJsonArray(row.uses_json),
    priceCents: row.price_cents,
    stockQuantity: row.stock_quantity,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function getAllProducts() {
  return db
    .prepare('SELECT * FROM products ORDER BY id ASC')
    .all()
    .map(serializeProduct);
}

export function getProductBySlug(slug) {
  return serializeProduct(db.prepare('SELECT * FROM products WHERE slug = ?').get(slug));
}

export function getProductById(productId) {
  return serializeProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(productId));
}

export function replaceProducts(products, { preserveExisting = false } = {}) {
  const insertProduct = db.prepare(`
    INSERT INTO products (
      slug,
      name,
      category,
      image,
      card_image,
      detail_image,
      card_label,
      tagline,
      card_description,
      description,
      best_with,
      detail_best_with,
      flavor,
      cooking_note,
      serving_description,
      flavor_family,
      serving_ideas_json,
      uses_json,
      price_cents,
      stock_quantity
    )
    VALUES (
      @slug,
      @name,
      @category,
      @image,
      @cardImage,
      @detailImage,
      @cardLabel,
      @tagline,
      @cardDescription,
      @description,
      @bestWith,
      @detailBestWith,
      @flavor,
      @cookingNote,
      @servingDescription,
      @flavorFamily,
      @servingIdeasJson,
      @usesJson,
      @priceCents,
      @stockQuantity
    )
    ON CONFLICT(slug) DO UPDATE SET
      name = excluded.name,
      category = excluded.category,
      image = excluded.image,
      card_image = excluded.card_image,
      detail_image = excluded.detail_image,
      card_label = excluded.card_label,
      tagline = excluded.tagline,
      card_description = excluded.card_description,
      description = excluded.description,
      best_with = excluded.best_with,
      detail_best_with = excluded.detail_best_with,
      flavor = excluded.flavor,
      cooking_note = excluded.cooking_note,
      serving_description = excluded.serving_description,
      flavor_family = excluded.flavor_family,
      serving_ideas_json = excluded.serving_ideas_json,
      uses_json = excluded.uses_json,
      price_cents = excluded.price_cents,
      stock_quantity = excluded.stock_quantity,
      updated_at = CURRENT_TIMESTAMP
  `);

  db.exec('BEGIN');

  try {
    products.forEach((product) => insertProduct.run(product));

    const incomingSlugs = new Set(products.map((product) => product.slug));
    const deleteProduct = db.prepare('DELETE FROM products WHERE slug = ?');

    db.prepare('SELECT slug FROM products').all().forEach((row) => {
      if (!preserveExisting && !incomingSlugs.has(row.slug)) {
        deleteProduct.run(row.slug);
      }
    });

    if (preserveExisting) {
      const updateCartPrice = db.prepare(`
        UPDATE cart_items SET price_cents = ?, updated_at = CURRENT_TIMESTAMP
        WHERE product_id = (SELECT id FROM products WHERE slug = ?)
      `);
      products.forEach((product) => updateCartPrice.run(product.priceCents, product.slug));
    }

    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

function serializeCartLine(row) {
  return {
    productId: row.product_id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    imageUrl: row.card_image || row.image,
    quantity: row.quantity,
    priceCents: row.price_cents,
    currentPriceCents: row.current_price_cents,
    stockQuantity: row.stock_quantity,
    lineTotalCents: row.quantity * row.price_cents
  };
}

function serializeCart(items) {
  return {
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotalCents: items.reduce((total, item) => total + item.lineTotalCents, 0)
  };
}

export function getCart(sessionId) {
  const items = db.prepare(`
    SELECT
      cart_items.product_id,
      cart_items.quantity,
      cart_items.price_cents,
      products.slug,
      products.name,
      products.category,
      products.image,
      products.card_image,
      products.price_cents AS current_price_cents,
      products.stock_quantity
    FROM cart_items
    JOIN products ON products.id = cart_items.product_id
    WHERE cart_items.session_id = ?
    ORDER BY cart_items.created_at ASC
  `).all(sessionId).map(serializeCartLine);

  return serializeCart(items);
}

export function getCartItem(sessionId, productId) {
  return db.prepare('SELECT * FROM cart_items WHERE session_id = ? AND product_id = ?').get(sessionId, productId);
}

export function upsertCartItem(sessionId, product, quantityToAdd) {
  const existing = getCartItem(sessionId, product.id);
  const quantity = (existing?.quantity || 0) + quantityToAdd;
  const priceCents = existing?.price_cents || product.priceCents;

  db.prepare(`
    INSERT INTO cart_items (session_id, product_id, quantity, price_cents)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(session_id, product_id) DO UPDATE SET
      quantity = excluded.quantity,
      updated_at = CURRENT_TIMESTAMP
  `).run(sessionId, product.id, quantity, priceCents);

  return getCart(sessionId);
}

export function setCartItemQuantity(sessionId, productId, quantity) {
  db.prepare(`
    UPDATE cart_items
    SET quantity = ?, updated_at = CURRENT_TIMESTAMP
    WHERE session_id = ? AND product_id = ?
  `).run(quantity, sessionId, productId);

  return getCart(sessionId);
}

export function removeCartItem(sessionId, productId) {
  db.prepare('DELETE FROM cart_items WHERE session_id = ? AND product_id = ?').run(sessionId, productId);
  return getCart(sessionId);
}

export function clearCart(sessionId) {
  db.prepare('DELETE FROM cart_items WHERE session_id = ?').run(sessionId);
}

function serializeOrder(row) {
  if (!row) return null;

  return {
    id: row.id,
    sessionId: row.session_id,
    email: row.email,
    shippingName: row.shipping_name,
    shippingAddressLine1: row.shipping_address_line1,
    shippingAddressLine2: row.shipping_address_line2,
    shippingCity: row.shipping_city,
    shippingState: row.shipping_state,
    shippingPostalCode: row.shipping_postal_code,
    shippingCountry: row.shipping_country,
    lineItems: parseJsonArray(row.line_items_json),
    subtotalCents: row.subtotal_cents,
    status: row.status,
    stripeSessionId: row.stripe_session_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createPendingOrder(sessionId, customerInfo, cart) {
  const lineItems = cart.items.map((item) => ({
    productId: item.productId,
    slug: item.slug,
    name: item.name,
    imageUrl: item.imageUrl,
    quantity: item.quantity,
    priceCents: item.priceCents,
    lineTotalCents: item.lineTotalCents
  }));

  const result = db.prepare(`
    INSERT INTO orders (
      session_id,
      email,
      shipping_name,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_state,
      shipping_postal_code,
      shipping_country,
      line_items_json,
      subtotal_cents,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `).run(
    sessionId,
    customerInfo.email,
    customerInfo.shippingName,
    customerInfo.addressLine1,
    customerInfo.addressLine2 || null,
    customerInfo.city,
    customerInfo.state,
    customerInfo.postalCode,
    customerInfo.country || 'US',
    JSON.stringify(lineItems),
    cart.subtotalCents
  );

  return getOrderById(Number(result.lastInsertRowid));
}

export function getOrderById(orderId) {
  return serializeOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId));
}

export function getOrderByStripeSessionId(stripeSessionId) {
  return serializeOrder(db.prepare('SELECT * FROM orders WHERE stripe_session_id = ?').get(stripeSessionId));
}

export function attachStripeSessionToOrder(orderId, stripeSessionId) {
  db.prepare(`
    UPDATE orders
    SET stripe_session_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(stripeSessionId, orderId);

  return getOrderById(orderId);
}

export function markOrderFailed(orderId) {
  db.prepare(`
    UPDATE orders
    SET status = 'failed', updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND status = 'pending'
  `).run(orderId);

  return getOrderById(orderId);
}

export function finalizePaidOrder(orderId) {
  db.exec('BEGIN IMMEDIATE');

  try {
    const orderRow = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

    if (!orderRow) {
      throw new Error('Order not found');
    }

    if (orderRow.status === 'paid') {
      db.exec('COMMIT');
      return serializeOrder(orderRow);
    }

    const lineItems = parseJsonArray(orderRow.line_items_json);

    for (const item of lineItems) {
      const result = db.prepare(`
        UPDATE products
        SET stock_quantity = stock_quantity - ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND stock_quantity >= ?
      `).run(item.quantity, item.productId, item.quantity);

      if (result.changes !== 1) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }
    }

    db.prepare(`
      UPDATE orders
      SET status = 'paid', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(orderId);

    db.prepare('DELETE FROM cart_items WHERE session_id = ?').run(orderRow.session_id);

    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    db.exec('COMMIT');
    return serializeOrder(updatedOrder);
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export function createContactSubmission(submission) {
  const result = db.prepare(`
    INSERT INTO contact_submissions (
      name,
      email,
      phone,
      product,
      message,
      subject
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    submission.name,
    submission.email,
    submission.phone || null,
    submission.product || null,
    submission.message || null,
    submission.subject || null
  );

  return {
    id: Number(result.lastInsertRowid),
    createdAt: new Date().toISOString()
  };
}
