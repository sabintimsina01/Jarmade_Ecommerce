(async function () {
  const grid = document.getElementById('home-product-grid');
  if (!grid) return;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  try {
    const products = await window.JarmadeCatalog.list();
    if (!products.length) throw new Error('The catalog is empty');
    grid.innerHTML = products.map((product) => {
      const image = product.cardImage || product.image;
      const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.priceCents / 100);
      return `
        <a href="products/${encodeURIComponent(product.slug)}.html" class="group flex h-full flex-col border border-brand-border bg-brand-cream transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div class="aspect-square bg-[#FDF6EC] p-8"><img src="${escapeHtml(image)}" alt="${escapeHtml(image?.includes('brand-assets/') ? 'Jarmade logo' : product.name + ' jar')}" loading="lazy" class="h-full w-full object-contain object-center" /></div>
          <div class="flex flex-1 flex-col border-t border-brand-border px-5 py-5">
            <p class="mb-2 font-sans text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-[#7B5F4E]">${escapeHtml(product.cardLabel || product.category)}</p>
            <h3 class="mb-2 font-display text-[19px] font-normal leading-[1.2] tracking-[-0.01em] text-[#3A241B]">${escapeHtml(product.name)}</h3>
            <p data-product-price class="mb-3 font-sans text-[19px] font-semibold text-brand-brown">${price}</p>
            <p class="mb-3 font-sans text-[14px] font-normal leading-[1.7] text-[#5f4636]">${escapeHtml(product.cardDescription || product.description)}</p>
            <p class="mt-auto border-t border-brand-border pt-4 font-sans text-[13px] font-normal leading-[1.6] text-[#7B5F4E]"><span class="font-medium">Best with:</span> ${escapeHtml(product.bestWith)}</p>
          </div>
        </a>`;
    }).join('');
  } catch (error) {
    grid.innerHTML = '<p>We could not load the collection. Please reload this page or <a href="all-jars.html" class="underline">visit all products</a>.</p>';
    console.error('Unable to load home products', error);
  }
})();
