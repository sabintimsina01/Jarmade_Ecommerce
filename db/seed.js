import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { DEFAULT_STOCK_QUANTITY, databasePath, getProductBySlug, initializeSchema, replaceProducts } from './database.js';
import { rootDir } from '../server/config.js';

const catalogPath = path.join(rootDir, 'public', 'products', 'catalog-data.js');

function loadCatalogData() {
  const source = fs.readFileSync(catalogPath, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: catalogPath });
  return sandbox.window.JARMADE_PRODUCTS || {};
}

initializeSchema();

const updateExisting = process.argv.includes('--update');
const catalog = loadCatalogData();
const products = Object.entries(catalog).map(([slug, product]) => ({
  slug,
  name: product.name,
  category: product.category,
  image: product.image || null,
  cardImage: product.cardImage || null,
  detailImage: product.detailImage || null,
  cardLabel: product.cardLabel || null,
  tagline: product.tagline || null,
  cardDescription: product.cardDescription || null,
  description: product.description || null,
  bestWith: product.bestWith || null,
  detailBestWith: product.detailBestWith || null,
  flavor: product.flavor || null,
  cookingNote: product.cookingNote || null,
  servingDescription: product.servingDescription || null,
  flavorFamily: product.flavorFamily || null,
  servingIdeasJson: JSON.stringify(product.servingIdeas || []),
  usesJson: JSON.stringify(product.uses || []),
  priceCents: product.priceCents,
  stockQuantity: updateExisting ? (getProductBySlug(slug)?.stockQuantity ?? DEFAULT_STOCK_QUANTITY) : DEFAULT_STOCK_QUANTITY
}));

replaceProducts(products, { preserveExisting: updateExisting });

console.log(`Seeded ${products.length} products into ${databasePath}`);
console.log('Owner-confirmed USD prices loaded from the catalog.');
console.log(`Placeholder stock is set to ${DEFAULT_STOCK_QUANTITY} per product. Update stock before going live.`);
