async function getJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load ${url}`);
  }

  return response.json();
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

async function initProductPage() {
  const slug = document.body.dataset.productSlug;
  const [product, productList] = await Promise.all([
    window.JarmadeCatalog.get(slug),
    window.JarmadeCatalog.list()
  ]);
  const related = productList
  .filter((item) => item.slug !== slug)
  .map((item, index) => {
    const key = item.slug;
    let score = 0;
    if (item.category === product.category) score += 4;
    if (item.flavorFamily === product.flavorFamily) score += 3;
    if (product.flavorFamily === 'berry' && item.flavorFamily === 'peach') score += 1;
    if (product.flavorFamily === 'peach' && item.flavorFamily === 'berry') score += 1;
    if (product.flavorFamily !== 'savory' && item.flavorFamily === 'savory') score += 0.5;
    return { key, item, score, index };
  })
  .sort((a, b) => b.score - a.score || a.index - b.index)
  .slice(0, 5)
  .map(({ key, item }) => [key, item]);

  document.title = `${product.name} | Jarmade`;

const productHeroName = product.name.replace(/\s+Conserve$/, '');
const productHeroSize = product.size || '8 oz';
const productHeroDescriptor =
  product.heroDescriptor || (product.category === 'Relish' ? 'Savory Relish' : 'Reduced Sugar');
const productHeroLabels =
  product.heroLabels || (product.category === 'Relish' ? ['Small Batch', 'Real Ingredients'] : ['Small Batch', 'Real Fruit']);
const productHeroImage = product.detailImage || product.cardImage || product.image;
const safeSlug = escapeAttribute(slug);
const safeProductId = Number(product.id) || 0;
const safeProduct = {
  name: escapeHtml(product.name),
  nameAttribute: escapeAttribute(product.name),
  category: escapeHtml(product.category),
  tagline: escapeHtml(product.tagline),
  description: escapeHtml(product.description),
  flavor: escapeHtml(product.flavor),
  bestWith: escapeHtml(product.detailBestWith || product.bestWith),
  cookingNote: escapeHtml(product.cookingNote),
  servingDescription: escapeHtml(product.servingDescription)
};
const safeHero = {
  name: escapeHtml(productHeroName),
  size: escapeHtml(productHeroSize),
  descriptor: escapeHtml(productHeroDescriptor),
  image: escapeAttribute(productHeroImage),
  labels: productHeroLabels.map((label) => escapeHtml(label))
};

document.getElementById('product-page').innerHTML = `
  <header class="z-50 border-b border-brand-border bg-[#F8F0E4] text-[#3A241B] shadow-sm">
      <div class="mx-auto flex h-[68px] max-w-[1500px] items-center justify-between gap-6 px-4 lg:px-6">
        <a href="../index.html" class="flex flex-shrink-0 items-center border border-transparent px-2 py-1 transition-colors hover:border-[#657A58] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]" aria-label="Jarmade home">
          <img src="../images/brand-assets/jarmade-logo.png" alt="Jarmade handcrafted small batch" class="h-11 w-auto object-contain sm:h-12" />
        </a>

        <nav class="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          <a href="../index.html" class="border border-transparent px-3 py-2 font-sans text-[13px] font-medium text-[#3A241B] transition-colors hover:border-[#657A58]/35 hover:bg-[#657A58]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">Home</a>
          <a href="../all-jars.html" aria-current="page" class="border border-[#657A58]/35 bg-[#657A58]/10 px-3 py-2 font-sans text-[13px] font-medium text-[#3A241B] transition-colors hover:border-[#657A58]/45 hover:bg-[#657A58]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">Products</a>
          <a href="../location.html" class="border border-transparent px-3 py-2 font-sans text-[13px] font-medium text-[#3A241B] transition-colors hover:border-[#657A58]/35 hover:bg-[#657A58]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">Locations</a>
          <a href="../index.html#story" class="border border-transparent px-3 py-2 font-sans text-[13px] font-medium text-[#3A241B] transition-colors hover:border-[#657A58]/35 hover:bg-[#657A58]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">Our Story</a>
          <a href="../index.html#faq" class="border border-transparent px-3 py-2 font-sans text-[13px] font-medium text-[#3A241B] transition-colors hover:border-[#657A58]/35 hover:bg-[#657A58]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">FAQ</a>
          <a href="../index.html#contact" class="border border-transparent px-3 py-2 font-sans text-[13px] font-medium text-[#3A241B] transition-colors hover:border-[#657A58]/35 hover:bg-[#657A58]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">Contact</a>
          <a href="../cart.html" class="inline-flex items-center gap-2 border border-transparent px-3 py-2 font-sans text-[13px] font-medium text-[#3A241B] transition-colors hover:border-[#657A58]/35 hover:bg-[#657A58]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]" aria-label="Cart">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 7h15l-2 8H8L6 7ZM6 7 5 3H3"></path><path stroke-linecap="round" d="M9 20h.01M18 20h.01"></path></svg>
            <span>Cart</span>
            <span data-cart-count class="inline-flex min-w-[1.35rem] items-center justify-center bg-[#7A3E4D] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">0</span>
          </a>
        </nav>

        <a href="../cart.html" class="relative ml-auto flex h-10 w-10 flex-shrink-0 items-center justify-center text-[#3A241B] transition-colors hover:text-[#60303C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A] md:hidden" aria-label="Cart">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 7h15l-2 8H8L6 7ZM6 7 5 3H3"></path><path stroke-linecap="round" d="M9 20h.01M18 20h.01"></path></svg>
          <span data-cart-count class="absolute right-0 top-0 inline-flex min-w-[1.1rem] items-center justify-center bg-[#7A3E4D] px-1 py-0.5 text-[9px] font-semibold leading-none text-white">0</span>
        </a>

        <button id="menu-toggle" class="flex h-10 w-10 flex-shrink-0 items-center justify-center text-[#3A241B] transition-colors hover:text-[#60303C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A] md:hidden" aria-label="Menu" aria-controls="mobile-menu" aria-expanded="false" type="button">
          <svg id="menu-open-icon" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"></path>
          </svg>
          <svg id="menu-close-icon" class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" d="M6 6l12 12M18 6 6 18"></path>
          </svg>
        </button>
      </div>

      <div id="mobile-menu" class="hidden border-t border-[#526847] bg-[#657A58] text-[#FFF8EC] md:hidden">
        <div class="flex flex-col">
          <a href="../index.html" class="border-b border-[#FFF8EC]/20 px-4 py-3.5 font-sans text-[15px] font-normal text-[#FFF8EC] transition-colors hover:bg-[#526847] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A76A7A] active:bg-[#60303C]">Home</a>
          <a href="../all-jars.html" aria-current="page" class="border-b border-[#FFF8EC]/20 bg-[#526847] px-4 py-3.5 font-sans text-[15px] font-normal text-[#FFF8EC] transition-colors hover:bg-[#526847] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A76A7A] active:bg-[#60303C]">Products</a>
          <a href="../location.html" class="border-b border-[#FFF8EC]/20 px-4 py-3.5 font-sans text-[15px] font-normal text-[#FFF8EC] transition-colors hover:bg-[#526847] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A76A7A] active:bg-[#60303C]">Locations</a>
          <a href="../index.html#story" class="border-b border-[#FFF8EC]/20 px-4 py-3.5 font-sans text-[15px] font-normal text-[#FFF8EC] transition-colors hover:bg-[#526847] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A76A7A] active:bg-[#60303C]">Our Story</a>
          <a href="../index.html#faq" class="border-b border-[#FFF8EC]/20 px-4 py-3.5 font-sans text-[15px] font-normal text-[#FFF8EC] transition-colors hover:bg-[#526847] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A76A7A] active:bg-[#60303C]">FAQ</a>
          <a href="../index.html#contact" class="border-b border-[#FFF8EC]/20 px-4 py-3.5 font-sans text-[15px] font-normal text-[#FFF8EC] transition-colors hover:bg-[#526847] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A76A7A] active:bg-[#60303C]">Contact</a>
          <a href="../cart.html" class="flex items-center justify-between border-b border-[#FFF8EC]/20 px-4 py-3.5 font-sans text-[15px] font-normal text-[#FFF8EC] transition-colors hover:bg-[#526847] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A76A7A] active:bg-[#60303C]"><span>Cart</span><span data-cart-count class="inline-flex min-w-[1.35rem] items-center justify-center bg-[#7A3E4D] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">0</span></a>
        </div>
      </div>
    </header>

  <main class="bg-brand-cream">
    <section class="bg-brand-cream py-10 lg:py-16">
      <div class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-12 lg:px-12">
        <div class="product-hero-card relative overflow-hidden border border-brand-border">
          <div class="flex aspect-square w-full items-center justify-center p-6 sm:p-10 lg:aspect-auto lg:h-[560px]">
            <img src="../${safeHero.image}" alt="${safeHero.image.includes('brand-assets/') ? 'Jarmade logo' : safeProduct.nameAttribute}" class="h-full w-full object-contain object-center drop-shadow-md" />
          </div>
          <div class="product-hero-overlay absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-4 sm:p-5">
            <div class="max-w-[68%] border border-brand-border bg-brand-cream/90 px-3.5 py-2.5 backdrop-blur-sm">
              <p class="font-sans text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-brand-lightbrown">Charlotte, NC</p>
              <p class="mt-1.5 font-display text-[15px] font-normal leading-tight text-brand-brown">${safeHero.name}</p>
              <p class="mt-0.5 font-sans text-[11px] font-normal text-brand-lightbrown">${safeHero.size} · ${safeHero.descriptor}</p>
            </div>
            <div class="flex flex-col items-end gap-1.5">
              <span class="bg-brand-sage px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-white">${safeHero.labels[0]}</span>
              <span class="bg-[#7A3E4D] px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-white">${safeHero.labels[1]}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-center">
          <p class="font-sans text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-brand-lightbrown">${safeProduct.category}</p>
          <h1 class="mt-4 font-display text-[26px] font-normal leading-[1.1] tracking-[-0.01em] text-brand-brown sm:text-[32px] lg:text-[38px]">${safeProduct.name}</h1>
          <p data-product-price class="mt-4 font-sans text-[19px] font-semibold text-brand-brown">${new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(product.priceCents / 100)}</p>
          <p class="mt-4 max-w-xl font-display text-[15px] font-normal italic leading-snug text-brand-lightbrown">${safeProduct.tagline}</p>
          <p class="mt-5 max-w-xl font-sans text-[15px] font-normal leading-[1.75] text-[#5f4636]">${safeProduct.description}</p>
          <div class="mt-7 grid gap-4 border-y border-brand-border py-6 sm:grid-cols-2">
            <div>
              <p class="font-sans text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-brand-lightbrown">Flavor</p>
              <p class="mt-2 font-sans text-[14px] font-normal leading-[1.7] text-brand-brown">${safeProduct.flavor}</p>
            </div>
            <div>
              <p class="font-sans text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-brand-lightbrown">Best with</p>
              <p class="mt-2 font-sans text-[14px] font-normal leading-[1.7] text-brand-brown">${safeProduct.bestWith}</p>
            </div>
          </div>
          <div class="mt-7 flex flex-col gap-3 sm:flex-row">
            ${safeProductId ? `<button type="button" data-add-to-cart data-product-id="${safeProductId}" class="bg-[#7A3E4D] px-8 py-3.5 text-center font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[#60303C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">Add to cart</button>` : `<a href="mailto:michaelstewartballard@gmail.com" class="mt-4 inline-block bg-[#7A3E4D] px-6 py-3 text-center font-sans text-[13px] font-semibold text-white">Contact to order</a>`}
            <a href="../all-jars.html?product=${safeSlug}#contact" class="bg-[#7A3E4D] px-8 py-3.5 text-center font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[#60303C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">Find a Location Near You</a>
            <a href="../all-jars.html" class="border border-brand-brown px-8 py-3.5 text-center font-sans text-[13px] font-medium text-brand-brown transition-colors hover:bg-brand-brown hover:text-brand-cream">Back to Products</a>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-[#DDE5D7] py-14 lg:py-20">
      <div class="mx-auto max-w-7xl px-6 lg:px-12">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-12">
          <div class="flex flex-col justify-center">
            <h2 class="font-display text-[20px] font-normal leading-[1.1] tracking-[-0.02em] text-brand-brown lg:text-[28px]">More ways to enjoy ${safeProduct.name}</h2>
            <p class="mt-5 max-w-3xl font-sans text-[15px] font-normal leading-[1.75] text-[#5f4636]">${safeProduct.cookingNote}</p>
            <p class="mt-4 max-w-3xl font-sans text-[15px] font-normal leading-[1.75] text-[#5f4636]">${safeProduct.servingDescription}</p>
          </div>

          <div class="relative border border-brand-border bg-[#FFF8ED] p-6 shadow-sm lg:p-8">
            <div class="absolute right-6 top-6 h-16 w-16 border border-[#7A3E4D]/25 opacity-40" aria-hidden="true"></div>
            <div class="absolute right-10 top-10 h-8 w-8 border-l border-t border-[#657A58]/35 opacity-50" aria-hidden="true"></div>
            <div class="divide-y divide-brand-border">
              ${product.servingIdeas.map((idea, index) => `
                <div class="grid grid-cols-[2.5rem_1fr] gap-4 py-3">
                  <p class="font-sans text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-[#7A3E4D]">${String(index + 1).padStart(2, '0')}</p>
                  <p class="font-sans text-[14px] font-normal leading-[1.7] text-brand-brown">${escapeHtml(idea)}</p>
                </div>
              `).join('')}
            </div>
        </div>
        </div>
      </div>
    </section>

    <section class="bg-brand-cream py-12 lg:py-16">
      <div class="mx-auto max-w-7xl px-6 lg:px-12">
        <h2 class="font-display text-[20px] font-normal leading-[1.1] tracking-[-0.02em] text-brand-brown lg:text-[28px]">Explore other jars</h2>
        <div class="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5">
          ${related.map(([key, item]) => {
            const relatedSlug = escapeAttribute(key);
            const relatedImage = escapeAttribute(item.cardImage);
            const relatedName = escapeHtml(item.name);
            const relatedNameAttribute = escapeAttribute(item.name);
            const relatedCategory = escapeHtml(item.category);
            const relatedTagline = escapeHtml(item.tagline);
            return `
            <a href="${relatedSlug}.html" class="group flex h-full flex-col border border-brand-border bg-brand-cream transition-colors duration-200 hover:border-[#60303C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">
              <div class="aspect-square bg-[#FDF6EC] p-6"><img src="../${relatedImage}" alt="${relatedNameAttribute}" loading="lazy" class="h-full w-full object-contain object-center" /></div>
              <div class="flex flex-1 flex-col border-t border-brand-border px-4 py-4">
                <p class="mb-2 font-sans text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-brand-lightbrown">${relatedCategory}</p>
                <h3 class="mb-2 font-display text-[19px] font-normal leading-[1.2] tracking-[-0.01em] text-brand-brown">${relatedName}</h3>
                <p class="font-sans text-[14px] font-normal leading-[1.7] text-[#5f4636]">${relatedTagline}</p>
                <p class="mt-4 font-sans text-[13px] font-semibold text-[#7A3E4D] group-hover:text-[#60303C]">View jar <span aria-hidden="true">→</span></p>
              </div>
            </a>
          `;
          }).join('')}
        </div>
      </div>
    </section>
  </main>

  <footer class="bg-brand-brown text-brand-cream">
    <div class="mx-auto max-w-[1500px] px-6 py-6 lg:px-8 lg:py-8">
      <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        <div>
          <h3 class="mb-4 font-sans text-[11px] font-semibold uppercase tracking-widest text-[#E9DADF]">About</h3>
          <ul class="space-y-2.5 font-sans text-[13px] font-normal text-brand-cream/75">
            <li><a href="mailto:michaelstewartballard@gmail.com" class="hover:text-[#E9DADF]">Contact Us</a></li>
            <li><a href="../index.html#story" class="hover:text-[#E9DADF]">About Us</a></li>
            <li><a href="../location.html" class="hover:text-[#E9DADF]">Locations</a></li>
          </ul>
        </div>
        <div>
          <h3 class="mb-4 font-sans text-[11px] font-semibold uppercase tracking-widest text-[#E9DADF]">Shop</h3>
          <ul class="space-y-2.5 font-sans text-[13px] font-normal text-brand-cream/75">
            <li><a href="../all-jars.html" class="hover:text-[#E9DADF]">All Products</a></li>
            <li><a href="../all-jars.html" class="hover:text-[#E9DADF]">Bestsellers</a></li>
          </ul>
        </div>
        <div>
          <h3 class="mb-4 font-sans text-[11px] font-semibold uppercase tracking-widest text-[#E9DADF]">Help</h3>
          <ul class="space-y-2.5 font-sans text-[13px] font-normal text-brand-cream/75">
            <li><a href="../pages/return-policy.html" class="hover:text-[#E9DADF]">Cancellations & Returns</a></li>
            <li><a href="../index.html#faq" class="hover:text-[#E9DADF]">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h3 class="mb-4 font-sans text-[11px] font-semibold uppercase tracking-widest text-[#E9DADF]">Consumer Policy</h3>
          <ul class="space-y-2.5 font-sans text-[13px] font-normal text-brand-cream/75">
            <li><a href="../pages/return-policy.html" class="hover:text-[#E9DADF]">Return Policy</a></li>
            <li><a href="../pages/terms-of-use.html" class="hover:text-[#E9DADF]">Terms of Use</a></li>
            <li><a href="../pages/security.html" class="hover:text-[#E9DADF]">Security</a></li>
            <li><a href="../pages/privacy.html" class="hover:text-[#E9DADF]">Privacy</a></li>
            <li><a href="../pages/sitemap.html" class="hover:text-[#E9DADF]">Sitemap</a></li>
          </ul>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <h3 class="mb-4 font-sans text-[11px] font-semibold uppercase tracking-widest text-[#E9DADF]">Contact Us</h3>
          <p class="font-sans text-[13px] font-normal leading-[1.8] text-brand-cream/75">
            Irresistible Foods LLC<br />Owner: Michael Ballard<br /><a href="tel:+17744372055" class="text-[#E9DADF] hover:underline">774-437-2055</a><br />Charlotte, NC<br />United States<br /><br />
            <a href="mailto:michaelstewartballard@gmail.com" class="text-[#E9DADF] hover:underline">michaelstewartballard@gmail.com</a>
          </p>
        </div>
        <div>
          <h3 class="mb-4 font-sans text-[11px] font-semibold uppercase tracking-widest text-[#E9DADF]">Social</h3>
          <div class="flex gap-3">
            <a href="#" aria-label="Facebook" class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-sage text-white">f</a>
            <a href="#" aria-label="Instagram" class="flex h-8 w-8 items-center justify-center rounded-full bg-[#7A3E4D] text-white">ig</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
`;

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const openIcon = document.getElementById('menu-open-icon');
const closeIcon = document.getElementById('menu-close-icon');

menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  setMobileMenuOpen(!expanded);
});

function setMobileMenuOpen(isOpen) {
  mobileMenu?.classList.toggle('hidden', !isOpen);
  openIcon?.classList.toggle('hidden', isOpen);
  closeIcon?.classList.toggle('hidden', !isOpen);
  menuToggle?.setAttribute('aria-expanded', String(isOpen));
}

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMobileMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMobileMenuOpen(false);
  }
});

const desktopMediaQuery = window.matchMedia('(min-width: 768px)');

function resetMobileMenuOnDesktop(event) {
  if (event.matches) {
    setMobileMenuOpen(false);
  }
}

desktopMediaQuery.addEventListener('change', resetMobileMenuOnDesktop);
resetMobileMenuOnDesktop(desktopMediaQuery);
}

initProductPage().catch((error) => {
  console.error('Unable to load product page', error);
  const productPage = document.getElementById('product-page');

  if (productPage) {
    productPage.innerHTML = `
      <main class="bg-brand-cream">
        <section class="mx-auto max-w-5xl px-6 py-14 lg:px-12 lg:py-20">
          <h1 class="font-display text-[30px] font-normal leading-[1.08] tracking-[-0.02em] text-brand-brown sm:text-[38px] lg:text-[48px]">Product unavailable</h1>
          <p class="mt-5 max-w-3xl font-sans text-[15px] font-normal leading-[1.75] text-[#5f4636]">This product could not be loaded. Please return to the products page and try again.</p>
          <a href="../all-jars.html" class="mt-6 inline-block bg-[#7A3E4D] px-8 py-3.5 text-center font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[#60303C]">Back to Products</a>
        </section>
      </main>
    `;
  }
});
