const pages = {
  'return-policy': {
    title: 'Return Policy',
    eyebrow: 'Cancellations & Returns',
    intro:
      'Jarmade is a small-batch, home-based farmers market and online food brand operated from Charlotte, North Carolina by Irresistible Foods LLC. Because the products are food items, returns and refunds are handled with food safety and order accuracy in mind.',
    sections: [
      {
        heading: 'Food Product Returns',
        body:
          'Opened food products generally cannot be returned. If there is a problem with a jar, label, seal, damaged shipment, or incorrect order detail, please contact Jarmade as soon as possible so the issue can be reviewed.'
      },
      {
        heading: 'Refunds And Replacements',
        body:
          'Refund or replacement requests should include your name, order number or purchase location, purchase date, product name, photos if the item arrived damaged, and a short description of the issue. Requests are reviewed case by case and may depend on the condition of the product and where it was purchased.'
      },
      {
        heading: 'Market Purchases',
        body:
          'For purchases made at farmers markets, Springs Farm, or local events, please contact Jarmade directly. Market availability, replacement options, and refund handling may vary by event or retail location.'
      },
      {
        heading: 'Shipping Issues',
        body:
          'If shipping is available for your order, Jarmade will work to ship within the timeframe shown at checkout or otherwise communicated. If an order cannot ship on time, Jarmade will contact you about the delay or refund options.'
      },
      {
        heading: 'Cancellations',
        body:
          'If you need to cancel or change an order, pickup request, gift basket, or market availability request, contact Jarmade as early as possible at michaelstewartballard@gmail.com.'
      }
    ]
  },
  'terms-of-use': {
    title: 'Terms of Use',
    eyebrow: 'Site Terms',
    intro:
      'By using this website, you agree to the general terms below. Jarmade is the brand name used by Irresistible Foods LLC, owned by Michael Ballard, for small-batch, home-based conserves, relish, and related food products.',
    sections: [
      {
        heading: 'Product And Availability Information',
        body:
          'The information on this website is provided for product, brand, market, and availability purposes. Product availability may change by season, batch, farmers market, retail location, and online inventory.'
      },
      {
        heading: 'Orders And Payment',
        body:
          'When online checkout is available, payment is processed through Stripe Checkout. An order is not final until payment is completed and the order is accepted. Jarmade may cancel or refund an order if inventory is unavailable, shipping is not available to the requested destination, or an order cannot be fulfilled safely.'
      },
      {
        heading: 'Food And Allergen Information',
        body:
          'Product descriptions are provided for general information. Always review the jar label before eating or serving a product. If you have a food allergy, dietary restriction, or ingredient question, contact Jarmade before purchasing or consuming a product.'
      },
      {
        heading: 'Content Ownership',
        body:
          'Text, images, product names, and brand content on this website belong to Jarmade or Irresistible Foods LLC unless otherwise stated. Please do not copy or reuse content without permission.'
      },
      {
        heading: 'Changes to the Site',
        body:
          'Jarmade may update product information, prices, availability, page content, policies, and these terms at any time.'
      }
    ]
  },
  security: {
    title: 'Security',
    eyebrow: 'Security',
    intro:
      'Jarmade uses secure checkout and basic website protections to help keep customer information safer while keeping the shopping experience simple.',
    sections: [
      {
        heading: 'Secure Payment Processing',
        body:
          'Payment is handled through Stripe Checkout. Jarmade does not build or store custom credit card forms and does not store full card numbers on this website.'
      },
      {
        heading: 'Contact Form',
        body:
          'The contact form may collect basic information such as name, email, phone, product interest, and message details so Jarmade can respond to availability, pickup, gift basket, or order questions.'
      },
      {
        heading: 'Website Protections',
        body:
          'The website uses secure cookies, CSRF protection for browser actions, rate limiting, server-side validation, and security headers. These controls help reduce common risks such as automated abuse, cross-site request forgery, and unsafe form submissions.'
      },
      {
        heading: 'Safe Browsing',
        body:
          'Visitors should access the site through the official Jarmade domain or approved landing page URL. If something looks unusual, contact Jarmade before sharing personal information.'
      },
      {
        heading: 'Security Updates',
        body:
          'Security practices may be updated as the website adds new features, accounts, admin tools, analytics, advertising, or other services.'
      }
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    eyebrow: 'Privacy',
    intro:
      'This privacy page explains the information Jarmade and Irresistible Foods LLC may collect through the website, online checkout, contact forms, email marketing, analytics, and advertising tools.',
    sections: [
      {
        heading: 'Information We Collect',
        body:
          'Jarmade may collect information you provide, including your name, email address, phone number, product interest, message, order details, shipping name and address, and email marketing signup preferences. The website may also collect technical information such as browser, device, pages visited, referring source, and approximate location through analytics or advertising tools.'
      },
      {
        heading: 'How Information Is Used',
        body:
          'Information may be used to respond to questions, process orders, arrange pickup or shipping, manage local availability, provide customer support, send order updates, send marketing emails if you opt in, improve the website, measure advertising performance, and prevent fraud or abuse.'
      },
      {
        heading: 'Payments',
        body:
          'Payments are processed by Stripe. Jarmade receives order and payment status information from Stripe, but does not store full credit card numbers. Please do not send card numbers or other sensitive payment details through the contact form.'
      },
      {
        heading: 'Cookies, Analytics, And Advertising',
        body:
          'Jarmade may use cookies, pixels, analytics services, and advertising platforms such as Google or Meta to understand website activity, improve the site, measure campaigns, and show relevant ads. You can control cookies through your browser settings and any consent or privacy controls provided on the website.'
      },
      {
        heading: 'Email Marketing',
        body:
          'If you sign up for marketing emails, Jarmade may use your email address to send product updates, market news, promotions, and availability announcements. You can unsubscribe from marketing emails using the unsubscribe link in the email or by contacting Jarmade.'
      },
      {
        heading: 'Information Sharing',
        body:
          'Jarmade does not sell customer lists. Information may be shared with service providers that help operate the website, process payments, host the store, send emails, measure analytics, run advertising, fulfill orders, or comply with legal requirements. Some analytics or advertising activity may be considered targeted advertising or sharing under certain privacy laws.'
      },
      {
        heading: 'Contact',
        body:
          'For privacy questions, contact Michael Ballard, owner of Irresistible Foods LLC, at michaelstewartballard@gmail.com or 774-437-2055. The public business location listed on this website is Charlotte, North Carolina, United States, with current retail availability shown on the Locations page.'
      }
    ]
  },
  sitemap: {
    title: 'Sitemap',
    eyebrow: 'Site Links',
    intro: 'Use this page to quickly find the main Jarmade landing page sections, product pages, and policy pages.',
    html: `
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div class="border border-brand-border bg-brand-cream p-6">
          <h2 class="font-display text-[26px] font-normal text-brand-brown">Main Pages</h2>
          <ul class="mt-4 space-y-2 font-sans text-[14px] text-[#5f4636]">
            <li><a class="text-[#7A3E4D] hover:underline" href="../index.html">Home</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="../all-jars.html">All Products</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="../location.html">Locations</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="../index.html#story">Our Story</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="../index.html#how-to-use">How to Use</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="../index.html#faq">FAQ</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="../index.html#contact">Contact</a></li>
          </ul>
        </div>
        <div class="border border-brand-border bg-brand-cream p-6">
          <h2 class="font-display text-[26px] font-normal text-brand-brown">Products</h2>
          <ul class="mt-4 space-y-2 font-sans text-[14px] text-[#5f4636]">
            <li><a class="text-[#7A3E4D] hover:underline" href="../products/strawberry-smash-conserve.html">Strawberry Smash Conserve</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="../products/blackberry-blast-conserve.html">Blackberry Blast Conserve</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="../products/big-red-peach-conserve.html">Big Red Peach Conserve</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="../products/o-henry-peach-conserve.html">O Henry Peach Conserve</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="../products/green-tomato-relish.html">Green Tomato Relish</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="../products/raspberry-conserve.html">Raspberry Conserve</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="../products/apricot-conserve.html">Apricot Conserve</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="../products/blueberry-conserve.html">Blueberry Conserve</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="../products/tart-red-cherry-conserve.html">Tart Red Cherry Conserve</a></li>
          </ul>
        </div>
        <div class="border border-brand-border bg-brand-cream p-6">
          <h2 class="font-display text-[26px] font-normal text-brand-brown">Policies</h2>
          <ul class="mt-4 space-y-2 font-sans text-[14px] text-[#5f4636]">
            <li><a class="text-[#7A3E4D] hover:underline" href="return-policy.html">Return Policy</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="terms-of-use.html">Terms of Use</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="security.html">Security</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="privacy.html">Privacy</a></li>
            <li><a class="text-[#7A3E4D] hover:underline" href="sitemap.html">Sitemap</a></li>
          </ul>
        </div>
      </div>
    `
  }
};

const slug = document.body.dataset.pageSlug;
const page = pages[slug] || pages.sitemap;
document.title = `${page.title} | Jarmade`;

const sectionHtml = page.html || page.sections.map((section) => `
  <div class="border border-brand-border bg-brand-cream p-6 lg:p-8">
    <h2 class="font-display text-[28px] font-normal text-brand-brown">${section.heading}</h2>
    <p class="mt-3 font-sans text-[15px] font-normal leading-[1.85] text-[#5f4636]">${section.body}</p>
  </div>
`).join('');

document.getElementById('info-page').innerHTML = `
  <header class="z-50 border-b border-brand-border bg-[#F8F0E4] text-[#3A241B] shadow-sm">
      <div class="mx-auto flex h-[68px] max-w-[1500px] items-center justify-between gap-6 px-4 lg:px-6">
        <a href="../index.html" class="flex flex-shrink-0 items-center border border-transparent px-2 py-1 transition-colors hover:border-[#657A58] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]" aria-label="Jarmade home">
          <img src="../images/brand-assets/jarmade-logo.png" alt="Jarmade handcrafted small batch" class="h-11 w-auto object-contain sm:h-12" />
        </a>

        <nav class="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          <a href="../index.html" class="border border-transparent px-3 py-2 font-sans text-[13px] font-medium text-[#3A241B] transition-colors hover:border-[#657A58]/35 hover:bg-[#657A58]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">Home</a>
          <a href="../all-jars.html" class="border border-transparent px-3 py-2 font-sans text-[13px] font-medium text-[#3A241B] transition-colors hover:border-[#657A58]/35 hover:bg-[#657A58]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A76A7A]">Products</a>
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
          <a href="../all-jars.html" class="border-b border-[#FFF8EC]/20 px-4 py-3.5 font-sans text-[15px] font-normal text-[#FFF8EC] transition-colors hover:bg-[#526847] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A76A7A] active:bg-[#60303C]">Products</a>
          <a href="../location.html" class="border-b border-[#FFF8EC]/20 px-4 py-3.5 font-sans text-[15px] font-normal text-[#FFF8EC] transition-colors hover:bg-[#526847] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A76A7A] active:bg-[#60303C]">Locations</a>
          <a href="../index.html#story" class="border-b border-[#FFF8EC]/20 px-4 py-3.5 font-sans text-[15px] font-normal text-[#FFF8EC] transition-colors hover:bg-[#526847] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A76A7A] active:bg-[#60303C]">Our Story</a>
          <a href="../index.html#faq" class="border-b border-[#FFF8EC]/20 px-4 py-3.5 font-sans text-[15px] font-normal text-[#FFF8EC] transition-colors hover:bg-[#526847] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A76A7A] active:bg-[#60303C]">FAQ</a>
          <a href="../index.html#contact" class="border-b border-[#FFF8EC]/20 px-4 py-3.5 font-sans text-[15px] font-normal text-[#FFF8EC] transition-colors hover:bg-[#526847] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A76A7A] active:bg-[#60303C]">Contact</a>
          <a href="../cart.html" class="flex items-center justify-between border-b border-[#FFF8EC]/20 px-4 py-3.5 font-sans text-[15px] font-normal text-[#FFF8EC] transition-colors hover:bg-[#526847] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A76A7A] active:bg-[#60303C]"><span>Cart</span><span data-cart-count class="inline-flex min-w-[1.35rem] items-center justify-center bg-[#7A3E4D] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">0</span></a>
        </div>
      </div>
    </header>

  <main class="bg-brand-cream">
    <section class="mx-auto max-w-5xl px-6 py-14 lg:px-12 lg:py-20">
      <h1 class="font-display text-[30px] font-normal leading-[1.08] tracking-[-0.02em] text-brand-brown sm:text-[38px] lg:text-[48px]">${page.title}</h1>
      <p class="mt-5 max-w-3xl font-sans text-[15px] font-normal leading-[1.75] text-[#5f4636]">${page.intro}</p>
      <p class="mt-3 font-sans text-[10px] uppercase tracking-[0.16em] text-brand-lightbrown">Last updated: September 2, 2026</p>
      <div class="mt-10 grid grid-cols-1 gap-5">
        ${sectionHtml}
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
            <li><a href="return-policy.html" class="hover:text-[#E9DADF]">Cancellations & Returns</a></li>
            <li><a href="../index.html#faq" class="hover:text-[#E9DADF]">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h3 class="mb-4 font-sans text-[11px] font-semibold uppercase tracking-widest text-[#E9DADF]">Consumer Policy</h3>
          <ul class="space-y-2.5 font-sans text-[13px] font-normal text-brand-cream/75">
            <li><a href="return-policy.html" class="hover:text-[#E9DADF]">Return Policy</a></li>
            <li><a href="terms-of-use.html" class="hover:text-[#E9DADF]">Terms of Use</a></li>
            <li><a href="security.html" class="hover:text-[#E9DADF]">Security</a></li>
            <li><a href="privacy.html" class="hover:text-[#E9DADF]">Privacy</a></li>
            <li><a href="sitemap.html" class="hover:text-[#E9DADF]">Sitemap</a></li>
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

function setMobileMenuOpen(isOpen) {
  mobileMenu?.classList.toggle('hidden', !isOpen);
  openIcon?.classList.toggle('hidden', isOpen);
  closeIcon?.classList.toggle('hidden', !isOpen);
  menuToggle?.setAttribute('aria-expanded', String(isOpen));
}

menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  setMobileMenuOpen(!expanded);
});

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
