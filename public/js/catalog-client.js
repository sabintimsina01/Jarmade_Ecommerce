(function () {
  let catalogPromise;
  async function load() {
    try {
      const response = await fetch('/api/products', { signal: AbortSignal.timeout(5000) });
      if (!response.ok) throw new Error('Catalog API unavailable');
      const products = await response.json();
      if (!Array.isArray(products) || !products.length) throw new Error('Catalog API empty');
      return products;
    } catch {
      const products = Object.entries(window.JARMADE_PRODUCTS || {}).map(([slug, product]) => ({
        ...product, slug, id: 0, servingIdeas: product.servingIdeas || []
      }));
      if (!products.length) throw new Error('Product catalog unavailable');
      return products;
    }
  }
  window.JarmadeCatalog = {
    list() { return catalogPromise ||= load(); },
    async get(slug) {
      const product = (await this.list()).find((item) => item.slug === slug);
      if (!product) throw new Error('Product not found');
      return product;
    }
  };
})();
