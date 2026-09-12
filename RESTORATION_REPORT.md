# Jarmade storefront restoration — September 12, 2026

Compared both supplied static archives and the current Node app. The original
jarmade-landing-html-deploy.zip contains eight products; the September 3 static
archive contains only five. The Node app inherited that smaller catalog.

## Changes

- Home product cards now load the complete nine-product API catalog with current prices.
- Restored original Raspberry and Blueberry descriptions, flavor notes, and serving ideas.
- Retained all six landing-page sections, owner/company/contact details, and confirmed prices.
- Restored the legacy Dark Cherry URL as a redirect to Tart Red Cherry ($9), assuming the latest owner name replaces the old cherry listing. This mapping awaits owner clarification.
- Fresh empty databases populate on startup; populated databases are preserved.
- Static source folder and both static archives were not changed.

## Verification

- npm run db:update-catalog: passed for the local Node catalog.
- npm start / Tailwind production CSS build: passed.
- Playwright with local Chrome: 21 Node HTML routes rendered; 37 internal links resolved; referenced images loaded; no JavaScript errors or HTTP failures.
- Nine home and shop cards, product prices, mobile menu, FAQ, and no mobile horizontal overflow: passed.
- Added one of each product: cart and checkout subtotal $86.00. No payment submitted.
- Original static site checked in Chrome: eight home/shop products and Raspberry, Blueberry, Dark Cherry pages rendered.
- Isolated fresh-database startup populated all nine products without manual seeding.
- Static folder and archive SHA-256 hashes unchanged.

## Deployment

For an existing installation, stop the app, back up its database, run
npm run db:update-catalog, and restart with npm start. Actual inventory remains
operator-managed; new products retain the existing seed default of 100.
Apricot and Tart Red Cherry still use the brand logo pending matching product photos.
