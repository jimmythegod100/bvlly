/**
 * Shared header, footer, SEO meta, and page chrome from SITE_CONFIG.
 */
(function () {
  const cfg = window.SITE_CONFIG;
  if (!cfg) return;

  const page = document.body.dataset.page || 'home';
  const brand = cfg.brand;

  const navLinks = [
    { href: 'index.html', label: 'Home', id: 'home' },
    { href: 'shop.html', label: 'Shop', id: 'shop' },
    { href: 'collections.html', label: 'Collections', id: 'collections' },
    { href: 'about.html', label: 'About', id: 'about' },
    { href: 'contact.html', label: 'Contact', id: 'contact' }
  ];

  function upsertMeta(attr, key, value) {
    if (!value) return;
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }

  function upsertLink(rel, href) {
    if (!href) return;
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.rel = rel;
      document.head.appendChild(el);
    }
    el.href = href;
  }

  function setMeta() {
    const desc = cfg.seo?.description || brand.tagline;
    const titleBase = document.title.replace(/\{\{BRAND\}\}/g, brand.name);
    document.title = titleBase;

    upsertMeta('name', 'description', desc);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', titleBase);
    upsertMeta('property', 'og:description', desc);
    if (brand.siteUrl) upsertMeta('property', 'og:url', brand.siteUrl);
    if (cfg.seo?.ogImage) upsertMeta('property', 'og:image', cfg.seo.ogImage);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', titleBase);
    upsertMeta('name', 'twitter:description', desc);

    if (brand.siteUrl) {
      const base = brand.siteUrl.replace(/\/$/, '');
      const path = page === 'home' || page === '404' ? '/' : `/${page}.html`;
      upsertLink('canonical', base + (path === '/' ? '/' : path));
    }

    upsertLink('icon', 'favicon.svg');

    const existing = document.getElementById('site-jsonld');
    if (existing) existing.remove();
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'ClothingStore',
      name: brand.name,
      description: desc,
      url: brand.siteUrl || undefined,
      email: brand.email,
      telephone: brand.phone || undefined,
      address: brand.address
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'site-jsonld';
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }

  function ensureSkipLink() {
    if (document.querySelector('.skip-link')) return;
    const a = document.createElement('a');
    a.className = 'skip-link';
    a.href = '#main';
    a.textContent = 'Skip to content';
    document.body.prepend(a);
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main';
  }

  function logoLabel() {
    return brand.logoText || brand.shortName || brand.name;
  }

  function renderHeader() {
    const header = document.querySelector('[data-site-header]');
    if (!header) return;

    header.innerHTML = `
      <div class="container header-inner">
        <a class="logo" href="index.html">${logoLabel()}</a>
        <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>☰</button>
        <nav id="site-nav" aria-label="Primary">
          <ul class="nav-links" data-nav-links>
            ${navLinks.map((l) => `<li><a href="${l.href}" class="${page === l.id ? 'active' : ''}" ${page === l.id ? 'aria-current="page"' : ''}>${l.label}</a></li>`).join('')}
            <li><a class="nav-cta" href="contact.html">Join the drop</a></li>
          </ul>
        </nav>
      </div>`;

    const toggle = header.querySelector('[data-nav-toggle]');
    const nav = header.querySelector('[data-nav-links]');
    toggle?.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  function renderFooter() {
    const footer = document.querySelector('[data-site-footer]');
    if (!footer) return;

    const year = new Date().getFullYear();
    const ig = brand.instagram
      ? `<li><a href="${brand.instagram}">Instagram</a></li>`
      : '';
    footer.innerHTML = `
      <div class="container footer-inner">
        <div class="footer-brand">${logoLabel()}</div>
        <ul class="footer-links">
          <li><a href="shop.html">Shop</a></li>
          <li><a href="collections.html">Collections</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="privacy.html">Privacy</a></li>
          ${ig}
        </ul>
        <p class="footer-copy">© ${year} ${brand.name}.</p>
      </div>`;
  }

  function fillHero() {
    const el = document.querySelector('[data-hero]');
    if (!el || !cfg.hero) return;
    const media = window.BVLLY?.mediaSlot({
      name: brand.name,
      kicker: 'Beware Hood',
      image: cfg.hero.image,
      fit: cfg.hero.fit || 'contain'
    }, 'hero-media');

    el.innerHTML = `
      <div class="container hero-grid">
        <div>
          ${cfg.hero.kicker ? `<p class="hero-kicker">${cfg.hero.kicker}</p>` : ''}
          <h1>${cfg.hero.headline}</h1>
          <p class="lead">${cfg.hero.subhead}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="${cfg.hero.ctaPrimary.href}">${cfg.hero.ctaPrimary.label}</a>
            <a class="btn btn-outline" href="${cfg.hero.ctaSecondary.href}">${cfg.hero.ctaSecondary.label}</a>
          </div>
        </div>
        ${media}
      </div>`;
  }

  function fillAbout() {
    const el = document.querySelector('[data-about-content]');
    if (!el || !cfg.about) return;
    const media = window.BVLLY?.mediaSlot({
      name: 'Mark Tee',
      kicker: 'The Mark',
      image: cfg.about.image,
      fit: cfg.about.fit || 'cover'
    }, 'about-media');

    el.innerHTML = `
      <div class="split">
        <div class="content-block">
          <p>${cfg.about.intro}</p>
          ${cfg.about.body.map((p) => `<p>${p}</p>`).join('')}
        </div>
        ${media}
      </div>`;
  }

  function fillContact() {
    const form = document.querySelector('[data-contact-form]');
    const info = document.querySelector('[data-contact-info]');
    if (!cfg.contact) return;

    if (info) {
      const phone = brand.phone
        ? `<p><strong>Phone:</strong> <a href="tel:${brand.phone.replace(/\D/g, '')}">${brand.phone}</a></p>`
        : '';
      info.innerHTML = `
        <h2>Reach the label</h2>
        <p><strong>Email:</strong> <a href="mailto:${brand.email}">${brand.email}</a></p>
        ${phone}
        <p><strong>Based:</strong> ${brand.address}</p>
        <p><strong>Hours:</strong> ${cfg.contact.hours}</p>
        <p>Use the form for drop waitlist, wholesale, or custom sizing questions. Checkout is not live on this draft.</p>`;
    }

    if (form) {
      form.action = cfg.contact.formAction;
      const nextInput = form.querySelector('[name="_next"]');
      if (nextInput && brand.siteUrl) {
        const base = brand.siteUrl.replace(/\/$/, '');
        nextInput.value = `${base}/${cfg.contact.thanksPage}`;
      } else if (nextInput) {
        nextInput.value = cfg.contact.thanksPage;
      }
      const subject = form.querySelector('[name="_subject"]');
      if (subject) subject.value = `BVLLY inquiry`;
    }
  }

  function fillPrivacy() {
    const el = document.querySelector('[data-privacy-body]');
    if (!el) return;
    el.innerHTML = `
      <p>${brand.name} (“we”) use the contact form to respond to drop waitlist, wholesale, and sizing questions. We do not sell your information.</p>
      <p>Form submissions are delivered by FormSubmit to <a href="mailto:${brand.email}">${brand.email}</a>.</p>
      <p>Questions: email us at the address above.</p>
      <p><em>Last updated: ${new Date().toISOString().slice(0, 10)}</em></p>`;
  }

  ensureSkipLink();
  setMeta();
  renderHeader();
  renderFooter();
  fillHero();
  fillAbout();
  fillContact();
  fillPrivacy();
  window.BVLLY?.bindPhotoSlots(document);
})();
