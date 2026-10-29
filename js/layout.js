/**
 * Shared header, footer, SEO meta, and page chrome — Wix-matched structure.
 */
(function () {
  const cfg = window.SITE_CONFIG;
  if (!cfg) return;

  const page = document.body.dataset.page || 'home';
  const brand = cfg.brand;

  const navLinks = [
    { href: 'index.html', label: 'Home', id: 'home' },
    { href: 'about.html', label: 'About', id: 'about' },
    { href: 'contact.html', label: 'Contact', id: 'contact' },
    { href: 'privacy.html', label: 'Privacy', id: 'privacy' },
    { href: 'thanks.html', label: 'Thanks', id: 'thanks' },
    { href: 'shop.html', label: 'Shop', id: 'shop' }
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

  function upsertLink(rel, href, extra) {
    if (!href) return;
    let el = extra?.as
      ? document.querySelector(`link[rel="${rel}"][as="${extra.as}"]`)
      : document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.rel = rel;
      document.head.appendChild(el);
    }
    el.href = href;
    if (extra) Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
  }

  function pageHref() {
    if (page === 'home' || page === '404') return '';
    if (page === 'product') {
      const id = new URLSearchParams(location.search).get('id');
      return id ? `product.html?id=${encodeURIComponent(id)}` : 'product.html';
    }
    if (page === 'shop') {
      const params = new URLSearchParams(location.search);
      const qs = params.toString();
      return qs ? `shop.html?${qs}` : 'shop.html';
    }
    return `${page}.html`;
  }

  function setMeta() {
    const desc = cfg.seo?.description || brand.tagline;
    const titleBase = document.title.replace(/\{\{BRAND\}\}/g, brand.name);
    document.title = titleBase;

    upsertMeta('name', 'description', desc);
    upsertMeta('name', 'theme-color', '#000000');
    upsertMeta('property', 'og:type', page === 'product' ? 'product' : 'website');
    upsertMeta('property', 'og:title', titleBase);
    upsertMeta('property', 'og:description', desc);
    if (brand.siteUrl) upsertMeta('property', 'og:url', window.absoluteUrl(pageHref()));
    if (cfg.seo?.ogImage) {
      const og = window.absoluteUrl(cfg.seo.ogImage);
      upsertMeta('property', 'og:image', og);
      upsertMeta('property', 'og:image:width', '1200');
      upsertMeta('property', 'og:image:height', '630');
      upsertMeta('property', 'og:image:type', 'image/jpeg');
      upsertMeta('name', 'twitter:image', og);
    }
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', titleBase);
    upsertMeta('name', 'twitter:description', desc);

    if (brand.siteUrl) upsertLink('canonical', window.absoluteUrl(pageHref()));
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

  function iconUser() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.25"/><path d="M5.5 19.25c1.6-3.1 4-4.75 6.5-4.75s4.9 1.65 6.5 4.75"/></svg>`;
  }

  function iconBag() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8.5V7a5 5 0 0 1 10 0v1.5"/><path d="M6.5 8.5h11l.75 11.25H5.75L6.5 8.5Z"/></svg>`;
  }

  function cartCount() {
    try {
      const raw = localStorage.getItem('bvlly-cart');
      const items = raw ? JSON.parse(raw) : [];
      return Array.isArray(items) ? items.reduce((n, i) => n + (i.qty || 1), 0) : 0;
    } catch {
      return 0;
    }
  }

  function renderHeader() {
    const header = document.querySelector('[data-site-header]');
    if (!header) return;
    const count = cartCount();

    header.innerHTML = `
      <div class="container header-inner">
        <a class="logo" href="index.html">${logoLabel()}</a>
        <nav id="site-nav" aria-label="Primary">
          <ul class="nav-links" data-nav-links>
            ${navLinks.map((l) => `<li><a href="${l.href}" class="${page === l.id || (page === 'product' && l.id === 'shop') ? 'active' : ''}" ${page === l.id ? 'aria-current="page"' : ''}>${l.label}</a></li>`).join('')}
          </ul>
        </nav>
        <div class="header-tools">
          <a class="icon-btn" href="contact.html" aria-label="Account / join the drop">${iconUser()}</a>
          <button class="icon-btn" type="button" aria-label="Open cart" data-cart-open>
            ${iconBag()}
            <span class="cart-count" data-cart-count>${count}</span>
          </button>
          <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>☰</button>
        </div>
      </div>`;

    const toggle = header.querySelector('[data-nav-toggle]');
    const nav = header.querySelector('#site-nav');
    toggle?.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  function renderFooter() {
    const footer = document.querySelector('[data-site-footer]');
    if (!footer) return;

    const year = new Date().getFullYear();
    const formAction = cfg.contact?.formAction || '';
    const nextUrl = brand.siteUrl
      ? window.absoluteUrl(cfg.contact?.thanksPage || 'thanks.html')
      : (cfg.contact?.thanksPage || 'thanks.html');

    footer.innerHTML = `
      <div class="container footer-grid">
        <div class="footer-col">
          <div class="footer-brand">${logoLabel()}</div>
          <p class="footer-tagline">${brand.tagline}</p>
        </div>
        <div class="footer-col">
          <h4 class="footer-heading">Navigation</h4>
          <div class="footer-nav">
            <a href="index.html">Home</a>
            <a href="shop.html">Shop</a>
            <a href="collections.html">Collections</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
            <a href="privacy.html">Privacy</a>
          </div>
        </div>
        <div class="footer-col">
          <h4 class="footer-heading">Stay notified</h4>
          <p class="footer-blurb">Early access to the pink &amp; black drop. No checkout on this draft.</p>
          ${formAction ? `
          <form class="newsletter-form" method="POST" action="${formAction}">
            <input type="hidden" name="_subject" value="BVLLY drop waitlist">
            <input type="hidden" name="_next" value="${nextUrl}">
            <input type="hidden" name="_captcha" value="false">
            <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">
            <input type="hidden" name="message" value="Footer waitlist signup">
            <label class="visually-hidden" for="footer-email">Email</label>
            <input type="email" id="footer-email" name="email" placeholder="Email *" required autocomplete="email">
            <button class="btn btn-primary" type="submit">Join</button>
          </form>` : `<a class="btn btn-primary" href="contact.html">Join</a>`}
          <div class="footer-meta">
            <a href="mailto:${brand.email}">${brand.email}</a>
            <span>Based ${brand.address}</span>
          </div>
        </div>
      </div>
      <div class="container footer-bottom">
        <p class="footer-copy">© ${year} ${brand.name}. Draft catalog — checkout not live.</p>
        <p class="footer-stance">Oversized blanks. Two temperatures. Same stance.</p>
      </div>`;
  }

  function fillHero() {
    const el = document.querySelector('[data-hero]');
    if (!el || !cfg.hero) return;
    if (cfg.hero.image) upsertLink('preload', cfg.hero.image, { as: 'image' });
    if (cfg.hero.mascot) upsertLink('preload', cfg.hero.mascot, { as: 'image' });

    const mascot = cfg.hero.mascot
      ? `<img class="hero-mascot" src="${cfg.hero.mascot}" alt="" width="720" height="475" decoding="async">`
      : '';

    const media = cfg.hero.video
      ? `<div class="hero-media">
          <video autoplay muted loop playsinline poster="${cfg.hero.image || ''}">
            <source src="${cfg.hero.video}" type="video/mp4">
          </video>
        </div>`
      : window.BVLLY?.mediaSlot({
          name: brand.name,
          kicker: 'BVLLY',
          image: cfg.hero.image,
          fit: cfg.hero.fit || 'cover'
        }, 'hero-media');

    el.innerHTML = `
      <div class="container hero-grid">
        <div class="hero-copy">
          ${mascot ? `<div class="hero-mascot-wrap">${mascot}</div>` : ''}
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

  function fillHomeCategories() {
    const el = document.querySelector('[data-home-categories]');
    if (!el || !cfg.homeCategories) return;
    el.innerHTML = cfg.homeCategories.map((c) => `
      <a class="category-card" href="${c.href}">
        <img src="${c.image}" alt="${c.name}" loading="lazy" decoding="async">
        <div class="category-card-body">
          <h3>${c.name}</h3>
          <span class="explore">Explore</span>
        </div>
      </a>`).join('');
  }

  function fillFitNotes() {
    const el = document.querySelector('[data-fit-notes]');
    if (!el || !cfg.fitNotes) return;
    el.innerHTML = cfg.fitNotes.map((n) => `
      <article>
        <h3>${n.title}</h3>
        <p>${n.body}</p>
      </article>`).join('');
  }

  function fillLookbook() {
    const el = document.querySelector('[data-lookbook]');
    if (!el || !cfg.lookbook?.length) return;
    const slides = cfg.lookbook;
    el.innerHTML = `
      <div class="lookbook-frame" data-lookbook-frame>
        ${slides.map((src, i) => `<img src="${src}" alt="BVLLY lookbook ${i + 1}" class="${i === 0 ? 'is-active' : ''}" data-slide="${i}" ${i === 0 ? '' : 'loading="lazy"'}>`).join('')}
        <div class="lookbook-nav">
          <button type="button" aria-label="Previous" data-lookbook-prev>‹</button>
          <button type="button" aria-label="Next" data-lookbook-next>›</button>
        </div>
      </div>
      <div class="lookbook-dots" data-lookbook-dots>
        ${slides.map((_, i) => `<button type="button" class="${i === 0 ? 'is-active' : ''}" aria-label="Slide ${i + 1}" data-dot="${i}"></button>`).join('')}
      </div>`;

    let index = 0;
    const imgs = [...el.querySelectorAll('[data-slide]')];
    const dots = [...el.querySelectorAll('[data-dot]')];
    function show(i) {
      index = (i + imgs.length) % imgs.length;
      imgs.forEach((img, n) => img.classList.toggle('is-active', n === index));
      dots.forEach((d, n) => d.classList.toggle('is-active', n === index));
    }
    el.querySelector('[data-lookbook-prev]')?.addEventListener('click', () => show(index - 1));
    el.querySelector('[data-lookbook-next]')?.addEventListener('click', () => show(index + 1));
    dots.forEach((d) => d.addEventListener('click', () => show(Number(d.dataset.dot))));
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      setInterval(() => show(index + 1), 5200);
    }
  }

  function fillAbout() {
    const el = document.querySelector('[data-about-content]');
    if (!el || !cfg.about) return;
    el.innerHTML = `
      <div class="about-hero">
        <div>
          <h1 class="about-brush">${cfg.about.headline}</h1>
          <p>${cfg.about.intro}</p>
        </div>
        <div class="about-media">
          <img src="${cfg.about.image}" alt="BVLLY character" width="648" height="807" decoding="async">
        </div>
      </div>
      <div class="about-split">
        ${(cfg.about.pillars || []).map((p) => `
          <article>
            <h2>${p.title}</h2>
            <p>${p.body}</p>
          </article>`).join('')}
      </div>`;
  }

  function fillContact() {
    const form = document.querySelector('[data-contact-form]');
    const strip = document.querySelector('[data-contact-strip]');
    if (!cfg.contact) return;

    if (strip) {
      strip.innerHTML = `
        <div>
          <h3>Email</h3>
          <p><a href="mailto:${brand.email}">${brand.email}</a></p>
        </div>
        <div>
          <h3>Based</h3>
          <p>${brand.address}</p>
        </div>
        <div>
          <h3>Hours</h3>
          <p>${cfg.contact.hours}</p>
        </div>`;
    }

    if (form) {
      form.action = cfg.contact.formAction;
      const nextInput = form.querySelector('[name="_next"]');
      if (nextInput && brand.siteUrl) {
        nextInput.value = window.absoluteUrl(cfg.contact.thanksPage);
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
    const priv = cfg.privacy || {};
    el.innerHTML = `
      <h1>Data policy</h1>
      <p class="policy-intro">${priv.intro || ''}</p>
      ${(priv.sections || []).map((s) => `
        <h2>${s.title}</h2>
        <p>${s.body}</p>`).join('')}
      <hr class="policy-rule">
      <p class="footer-copy">© ${new Date().getFullYear()} ${brand.name}. Draft catalog — checkout not live.</p>`;
  }

  ensureSkipLink();
  setMeta();
  renderHeader();
  renderFooter();
  fillHero();
  fillHomeCategories();
  fillFitNotes();
  fillLookbook();
  fillAbout();
  fillContact();
  fillPrivacy();
  window.BVLLY?.bindPhotoSlots(document);
})();
