(function () {
  const root = document.getElementById('confirmation-root');

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

  async function getConfirmationOrder() {
    const stripeSessionId = new URLSearchParams(window.location.search).get('session_id');

    if (!stripeSessionId) {
      throw new Error('Missing checkout session. Please contact Jarmade if you need help with an order.');
    }

    const response = await fetch(`/api/orders/confirmation?session_id=${encodeURIComponent(stripeSessionId)}`, {
      credentials: 'same-origin'
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.error || 'Unable to load order confirmation.');
    }

    return payload;
  }

  function renderOrder(order) {
    if (!root) return;

    const isPaid = order.status === 'paid';
    const orderStatus = escapeHtml(order.status);
    const customerEmail = escapeHtml(order.email);

    root.innerHTML = `
      <div class="border border-brand-border bg-[#FFF8ED] p-6 shadow-sm sm:p-8">
        <p class="font-sans text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-[#7B5F4E]">Order ${isPaid ? 'confirmed' : 'received'}</p>
        <h1 class="mt-4 font-display text-[30px] font-normal leading-[1.08] tracking-[-0.02em] text-[#3A241B] sm:text-[38px] lg:text-[48px]">${isPaid ? 'Thank you for your order' : 'Your order is being confirmed'}</h1>
        <p class="mt-5 max-w-2xl font-sans text-[15px] font-normal leading-[1.75] text-[#6B5145]">A confirmation for order #${Number(order.id) || 0} will be sent to ${customerEmail}. Status: ${orderStatus}.</p>

        <div class="mt-8 divide-y divide-brand-border border-y border-brand-border">
          ${order.lineItems.map((item) => {
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

        <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="font-sans text-[18px] font-semibold text-[#3A241B]">Subtotal: ${formatMoney(order.subtotalCents)}</p>
          <a href="all-jars.html" class="inline-block bg-[#7A3E4D] px-8 py-3.5 text-center font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[#60303C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">Continue Shopping</a>
        </div>
      </div>
    `;
  }

  function renderError(message) {
    if (!root) return;

    root.innerHTML = `
      <div class="border border-brand-border bg-[#FFF8ED] p-6 shadow-sm sm:p-8">
        <h1 class="font-display text-[30px] font-normal leading-[1.08] tracking-[-0.02em] text-[#3A241B] sm:text-[38px] lg:text-[48px]">Order confirmation unavailable</h1>
        <p class="mt-5 max-w-2xl font-sans text-[15px] font-normal leading-[1.75] text-[#6B5145]">${escapeHtml(message)}</p>
        <a href="cart.html" class="mt-6 inline-block bg-[#7A3E4D] px-8 py-3.5 text-center font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[#60303C]">Return to Cart</a>
      </div>
    `;
  }

  getConfirmationOrder()
    .then(renderOrder)
    .catch((error) => renderError(error.message));
})();
