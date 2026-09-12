(function () {
  const MAX_CART_QUANTITY = 20;
  const buttonDefaultText = new WeakMap();
  let currentCart = null;
  let csrfTokenPromise = null;

  function formatMoney(cents) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format((Number(cents) || 0) / 100);
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

  function isUnsafeMethod(method) {
    return !['GET', 'HEAD', 'OPTIONS'].includes(String(method || 'GET').toUpperCase());
  }

  function populateCsrfFields(token) {
    document.querySelectorAll('[data-csrf-field]').forEach((field) => {
      field.value = token;
    });
  }

  async function getCsrfToken() {
    if (!csrfTokenPromise) {
      csrfTokenPromise = fetch('/api/csrf-token', {
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json'
        }
      })
        .then(async (response) => {
          const payload = await response.json();

          if (!response.ok || !payload?.csrfToken) {
            throw new Error(payload?.error || 'Unable to prepare secure request.');
          }

          populateCsrfFields(payload.csrfToken);
          return payload.csrfToken;
        })
        .catch((error) => {
          csrfTokenPromise = null;
          throw error;
        });
    }

    return csrfTokenPromise;
  }

  async function requestJson(url, options = {}) {
    const method = String(options.method || 'GET').toUpperCase();
    const headers = {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    };

    if (isUnsafeMethod(method)) {
      headers['x-csrf-token'] = await getCsrfToken();
    }

    const response = await fetch(url, {
      ...options,
      method,
      credentials: 'same-origin',
      headers
    });

    let payload = null;

    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      throw new Error(payload?.error || 'Something went wrong. Please try again.');
    }

    return payload;
  }

  function announce(message) {
    const liveRegion = document.querySelector('[data-cart-status]');

    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }

  function setButtonBusy(button, isBusy) {
    if (!button) return;

    if (!buttonDefaultText.has(button)) {
      buttonDefaultText.set(button, button.textContent.trim());
    }

    button.disabled = isBusy;
    button.setAttribute('aria-busy', String(isBusy));

    if (isBusy) {
      button.textContent = 'Adding...';
    }
  }

  function flashButton(button, message) {
    if (!button) return;

    const defaultText = buttonDefaultText.get(button) || 'Add to cart';
    button.textContent = message;

    window.setTimeout(() => {
      button.textContent = defaultText;
      button.removeAttribute('aria-busy');
      button.disabled = false;
    }, 1200);
  }

  function updateBadges(cart) {
    document.querySelectorAll('[data-cart-count]').forEach((badge) => {
      const count = String(cart?.itemCount || 0);
      if (badge.textContent !== count) {
        badge.textContent = count;
      }
      badge.setAttribute('aria-label', `${cart?.itemCount || 0} items in cart`);
    });
  }

  function renderCartPage(cart) {
    const root = document.getElementById('cart-root');

    if (!root) return;

    if (!cart.items.length) {
      root.innerHTML = `
        <div class="border border-brand-border bg-[#FFF8ED] p-6 text-center shadow-sm sm:p-8">
          <h2 class="font-display text-[24px] font-normal leading-tight text-[#3A241B]">Your cart is empty</h2>
          <p class="mx-auto mt-3 max-w-lg font-sans text-[15px] font-normal leading-[1.75] text-[#6B5145]">Add a jar from the collection, then come back here to review your order.</p>
          <a href="all-jars.html" class="mt-6 inline-block bg-[#7A3E4D] px-8 py-3.5 text-center font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[#60303C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">Browse Jars</a>
        </div>
      `;
      return;
    }

    root.innerHTML = `
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div class="divide-y divide-brand-border border border-brand-border bg-[#FFF8ED]">
          ${cart.items.map((item) => {
            const imageUrl = escapeAttribute(item.imageUrl);
            const name = escapeHtml(item.name);
            const nameAttribute = escapeAttribute(item.name);
            const category = escapeHtml(item.category);
            const productId = Number(item.productId) || 0;
            const quantity = Number(item.quantity) || 0;
            const stockQuantity = Number(item.stockQuantity) || 0;
            return `
            <article class="grid grid-cols-[96px_1fr] gap-4 p-4 sm:grid-cols-[120px_1fr] sm:gap-5 sm:p-5">
              <div class="aspect-square border border-brand-border bg-[#FDF6EC] p-4">
                <img src="${imageUrl}" alt="${nameAttribute}" loading="lazy" class="h-full w-full object-contain object-center" />
              </div>
              <div class="min-w-0">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p class="font-sans text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-[#7B5F4E]">${category}</p>
                    <h2 class="mt-2 font-display text-[20px] font-normal leading-tight text-[#3A241B]">${name}</h2>
                    <p class="mt-1 font-sans text-[13px] font-normal text-[#6B5145]">${formatMoney(item.priceCents)} each</p>
                  </div>
                  <p class="font-sans text-[15px] font-semibold text-[#3A241B]">${formatMoney(item.lineTotalCents)}</p>
                </div>
                <div class="mt-5 flex flex-wrap items-center gap-3">
                  <div class="inline-flex items-center border border-brand-border bg-brand-cream">
                    <button type="button" data-cart-decrease data-product-id="${productId}" data-current-quantity="${quantity}" class="flex h-10 w-10 items-center justify-center font-sans text-[18px] text-[#3A241B] transition-colors hover:bg-[#E9DADF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A76A7A]" aria-label="Decrease ${nameAttribute} quantity">-</button>
                    <span class="min-w-10 text-center font-sans text-[14px] font-semibold text-[#3A241B]">${quantity}</span>
                    <button type="button" data-cart-increase data-product-id="${productId}" data-current-quantity="${quantity}" class="flex h-10 w-10 items-center justify-center font-sans text-[18px] text-[#3A241B] transition-colors hover:bg-[#E9DADF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A76A7A]" aria-label="Increase ${nameAttribute} quantity" ${quantity >= Math.min(MAX_CART_QUANTITY, stockQuantity) ? 'disabled' : ''}>+</button>
                  </div>
                  <button type="button" data-cart-remove data-product-id="${productId}" class="font-sans text-[13px] font-semibold text-[#7A3E4D] transition-colors hover:text-[#60303C] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">Remove</button>
                </div>
              </div>
            </article>
          `;
          }).join('')}
        </div>

        <aside class="border border-brand-border bg-[#FFF8ED] p-5 shadow-sm sm:p-6">
          <h2 class="font-display text-[24px] font-normal leading-tight text-[#3A241B]">Order Summary</h2>
          <div class="mt-5 space-y-3 border-y border-brand-border py-5">
            <div class="flex items-center justify-between font-sans text-[15px] font-normal text-[#6B5145]">
              <span>Items</span>
              <span>${Number(cart.itemCount) || 0}</span>
            </div>
            <div class="flex items-center justify-between font-sans text-[15px] font-normal text-[#6B5145]">
              <span>Subtotal</span>
              <span>${formatMoney(cart.subtotalCents)}</span>
            </div>
          </div>
          <div class="mt-5 flex items-center justify-between font-sans text-[17px] font-semibold text-[#3A241B]">
            <span>Total</span>
            <span>${formatMoney(cart.subtotalCents)}</span>
          </div>
          <a href="checkout.html" class="mt-6 block w-full bg-[#7A3E4D] px-8 py-4 text-center font-sans text-[14px] font-semibold text-white transition-colors hover:bg-[#60303C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">Checkout</a>
          <a href="all-jars.html" class="mt-3 block w-full border border-brand-brown px-8 py-3.5 text-center font-sans text-[13px] font-medium text-brand-brown transition-colors hover:bg-brand-brown hover:text-brand-cream">Continue Shopping</a>
        </aside>
      </div>
    `;
  }

  async function refreshCart() {
    currentCart = await requestJson('/api/cart');
    updateBadges(currentCart);
    renderCartPage(currentCart);
    return currentCart;
  }

  async function addItem(button) {
    const productId = Number(button.dataset.productId);

    if (!Number.isInteger(productId) || productId < 1) {
      announce('This product could not be added.');
      return;
    }

    try {
      setButtonBusy(button, true);
      currentCart = await requestJson('/api/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity: 1 })
      });
      updateBadges(currentCart);
      renderCartPage(currentCart);
      announce('Added to cart.');
      flashButton(button, 'Added');
    } catch (error) {
      announce(error.message);
      flashButton(button, 'Try again');
    }
  }

  async function setQuantity(productId, quantity) {
    currentCart = await requestJson(`/api/cart/items/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity })
    });
    updateBadges(currentCart);
    renderCartPage(currentCart);
    announce('Cart updated.');
  }

  async function removeItem(productId) {
    currentCart = await requestJson(`/api/cart/items/${productId}`, {
      method: 'DELETE'
    });
    updateBadges(currentCart);
    renderCartPage(currentCart);
    announce('Removed from cart.');
  }

  document.addEventListener('click', async (event) => {
    const addButton = event.target.closest('[data-add-to-cart]');
    const increaseButton = event.target.closest('[data-cart-increase]');
    const decreaseButton = event.target.closest('[data-cart-decrease]');
    const removeButton = event.target.closest('[data-cart-remove]');

    try {
      if (addButton) {
        event.preventDefault();
        await addItem(addButton);
      } else if (increaseButton) {
        event.preventDefault();
        const nextQuantity = Number(increaseButton.dataset.currentQuantity) + 1;
        await setQuantity(Number(increaseButton.dataset.productId), nextQuantity);
      } else if (decreaseButton) {
        event.preventDefault();
        const productId = Number(decreaseButton.dataset.productId);
        const nextQuantity = Number(decreaseButton.dataset.currentQuantity) - 1;
        if (nextQuantity < 1) {
          await removeItem(productId);
        } else {
          await setQuantity(productId, nextQuantity);
        }
      } else if (removeButton) {
        event.preventDefault();
        await removeItem(Number(removeButton.dataset.productId));
      }
    } catch (error) {
      announce(error.message);
    }
  });

  const observer = new MutationObserver(() => {
    if (currentCart) {
      updateBadges(currentCart);
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.JarmadeCart = {
    formatMoney,
    getCart: () => currentCart,
    getCsrfToken,
    refresh: refreshCart,
    requestJson
  };

  if (document.querySelector('[data-csrf-field]')) {
    getCsrfToken().catch((error) => {
      console.error('Unable to prepare secure forms', error);
    });
  }

  refreshCart().catch((error) => {
    console.error('Unable to load cart', error);
  });
})();
