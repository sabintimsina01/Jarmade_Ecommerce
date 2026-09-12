(function () {
  const form = document.getElementById('checkout-form');
  const summary = document.getElementById('checkout-summary');
  const errorBox = document.getElementById('checkout-error');
  const submitButton = document.getElementById('checkout-submit');

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

  async function requestJson(url, options = {}) {
    const method = String(options.method || 'GET').toUpperCase();
    const headers = {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    };

    if (isUnsafeMethod(method)) {
      const csrfToken = await window.JarmadeCart?.getCsrfToken?.();

      if (!csrfToken) {
        throw new Error('Unable to prepare secure checkout request.');
      }

      headers['x-csrf-token'] = csrfToken;
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

  function showError(message) {
    if (!errorBox) return;

    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
  }

  function hideError() {
    if (!errorBox) return;

    errorBox.textContent = '';
    errorBox.classList.add('hidden');
  }

  function renderSummary(cart) {
    if (!summary) return;

    if (!cart.items.length) {
      summary.innerHTML = `
        <div class="border border-brand-border bg-[#FFF8ED] p-5">
          <h2 class="font-display text-[24px] font-normal leading-tight text-[#3A241B]">Your cart is empty</h2>
          <p class="mt-3 font-sans text-[15px] font-normal leading-[1.75] text-[#6B5145]">Add a jar before starting checkout.</p>
          <a href="all-jars.html" class="mt-5 inline-block bg-[#7A3E4D] px-8 py-3.5 text-center font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[#60303C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">Browse Jars</a>
        </div>
      `;

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add('opacity-60');
      }
      return;
    }

    summary.innerHTML = `
      <div class="border border-brand-border bg-[#FFF8ED] p-5 shadow-sm sm:p-6">
        <h2 class="font-display text-[24px] font-normal leading-tight text-[#3A241B]">Order Summary</h2>
        <div class="mt-5 divide-y divide-brand-border border-y border-brand-border">
          ${cart.items.map((item) => {
            const imageUrl = escapeAttribute(item.imageUrl);
            const name = escapeHtml(item.name);
            const nameAttribute = escapeAttribute(item.name);
            return `
            <div class="grid grid-cols-[72px_1fr] gap-4 py-4">
              <div class="aspect-square border border-brand-border bg-[#FDF6EC] p-3">
                <img src="${imageUrl}" alt="${nameAttribute}" loading="lazy" class="h-full w-full object-contain object-center" />
              </div>
              <div>
                <p class="font-display text-[17px] font-normal leading-tight text-[#3A241B]">${name}</p>
                <p class="mt-1 font-sans text-[13px] font-normal text-[#6B5145]">Qty ${Number(item.quantity) || 0} x ${formatMoney(item.priceCents)}</p>
                <p class="mt-2 font-sans text-[14px] font-semibold text-[#3A241B]">${formatMoney(item.lineTotalCents)}</p>
              </div>
            </div>
          `;
          }).join('')}
        </div>
        <div class="mt-5 flex items-center justify-between font-sans text-[17px] font-semibold text-[#3A241B]">
          <span>Subtotal</span>
          <span>${formatMoney(cart.subtotalCents)}</span>
        </div>
        <p class="mt-4 font-sans text-[13px] font-normal leading-[1.6] text-[#6B5145]">Shipping and payment are completed securely through Stripe Checkout.</p>
      </div>
    `;

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.classList.remove('opacity-60');
    }
  }

  function formToPayload() {
    const formData = new FormData(form);

    return {
      email: formData.get('email'),
      shippingName: formData.get('shippingName'),
      addressLine1: formData.get('addressLine1'),
      addressLine2: formData.get('addressLine2'),
      city: formData.get('city'),
      state: formData.get('state'),
      postalCode: formData.get('postalCode'),
      country: formData.get('country') || 'US'
    };
  }

  async function initCheckout() {
    const cart = await requestJson('/api/cart');
    renderSummary(cart);
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideError();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Opening secure checkout...';
    }

    try {
      const checkout = await requestJson('/api/checkout/session', {
        method: 'POST',
        body: JSON.stringify(formToPayload())
      });

      window.location.assign(checkout.url);
    } catch (error) {
      showError(error.message);

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Continue to Stripe Checkout';
      }
    }
  });

  initCheckout().catch((error) => {
    showError(error.message);
  });
})();
