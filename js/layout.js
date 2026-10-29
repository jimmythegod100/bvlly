/**
 * Shared header, footer, SEO meta, and page chrome — Wix-matched BVLLY.
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
      const col = new URLSearchParams(location.search).get('collection');
      return col ? `shop.html?collection=${encodeURIComponent(col)}` : 'shop.html';
    }
    return `${page}.html`;
  }

  function setMeta() {
    const desc = cfg.seo?.description || brand.tagline;
    const titleBase = document.title.replace(/\{\{BRAND\}\}/g, brand.name);
    document.title = titleBase;

    upsertMeta('name', 'description', desc);
    upsertMeta('name', 'theme-color', '#070707');
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
    a.textContent = 'Skip to Main Content';
    document.body.prepend(a);
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main';
  }

  function logoMarkup(className) {
    if (brand.logoImage) {
      return `<img src="${brand.logoImage}" alt="${brand.name}" width="139" height="61" decoding="async">`;
    }
    return brand.logoText || brand.name;
  }

  function iconUser() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.25"/><path d="M5.5 19.5c1.8-3.2 4-4.75 6.5-4.75s4.7 1.55 6.5 4.75"/></svg>`;
  }

  function iconBag() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5h11l-.7 10.2a1.5 1.5 0 0 1-1.5 1.4H8.7a1.5 1.5 0 0 1-1.5-1.4L6.5 8.5Z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/></svg><span class="cart-count">0</span>`;
  }

  function renderHeader() {
    const header = document.querySelector('[data-site-header]');
    if (!header) return;

    header.innerHTML = `
      <div class="container header-inner">
        <a class="logo" href="index.html">${logoMarkup()}</a>
        <div class="header-right">
          <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>☰</button>
          <nav id="site-nav" aria-label="Primary">
            <ul class="nav-links" data-nav-links>
              ${navLinks.map((l) => `<li><a href="${l.href}" class="${page === l.id ? 'active' : ''}" ${page === l.id ? 'aria-current="page"' : ''}>${l.label}</a></li>`).join('')}
            </ul>
          </nav>
          <div class="header-icons">
            <a href="contact.html" aria-label="Account">${iconUser()}</a>
            <a href="shop.html" aria-label="Cart">${iconBag()}</a>
          </div>
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
          <a class="footer-logo logo" href="index.html">${logoMarkup()}</a>
          <p class="footer-tagline">Streetwear drawn from the exotic bully.</p>
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
            <label for="footer-email">Email *</label>
            <input type="email" id="footer-email" name="email" placeholder="Enter your email" required autocomplete="email">
            <button class="btn btn-primary" type="submit">Join</button>
          </form>` : `<a class="btn btn-primary" href="contact.html">Join</a>`}
          <div class="footer-contact">
            <a href="mailto:${brand.email}">${brand.email}</a><br>
            Based ${brand.address}
          </div>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>© ${year} ${brand.name}. Draft catalog — checkout not live.</p>
        <p>Oversized blanks. Two temperatures. Same stance.</p>
      </div>`;
  }

  function fillHero() {
    const el = document.querySelector('[data-hero]');
    if (!el || !cfg.hero) return;
    if (cfg.hero.mascot) upsertLink('preload', cfg.hero.mascot, { as: 'image' });

    const media = cfg.hero.video
      ? `<div class="hero-media">
           <video autoplay muted loop playsinline poster="${cfg.hero.image || ''}">
             <source src="${cfg.hero.video}" type="video/mp4">
           </video>
         </div>`
      : `<div class="hero-media"><img src="${cfg.hero.image}" alt="" width="486" height="648" fetchpriority="high"></div>`;

    const mascot = cfg.hero.mascot
      ? `<div class="hero-mascot-wrap"><img class="hero-mascot" src="${cfg.hero.mascot}" alt="" width="484" height="319" decoding="async"></div>`
      : '';

    el.innerHTML = `
      <div class="container hero-grid">
        <div class="hero-copy">
          ${mascot}
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

  function initCarousels(root) {
    (root || document).querySelectorAll('[data-carousel]').forEach((carousel) => {
      const track = carousel.querySelector('[data-carousel-track]');
      const prev = carousel.querySelector('[data-carousel-prev]');
      const next = carousel.querySelector('[data-carousel-next]');
      const dots = carousel.querySelector('[data-carousel-dots]');
      if (!track) return;

      const slides = [...track.children];
      const updateDots = () => {
        if (!dots) return;
        const idx = Math.round(track.scrollLeft / Math.max(slides[0]?.offsetWidth || 1, 1));
        [...dots.children].forEach((d, i) => d.classList.toggle('is-active', i === idx));
      };

      if (dots) {
        dots.innerHTML = slides.map((_, i) => `<span class="${i === 0 ? 'is-active' : ''}"></span>`).join('');
      }

      const step = () => (slides[0]?.getBoundingClientRect().width || 280) + 12;
      prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
      next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
      track.addEventListener('scroll', () => updateDots(), { passive: true });
    });
  }

  function fillHomeCollections() {
    const el = document.querySelector('[data-home-collections]');
    if (!el || !cfg.homeCollections) return;

    el.innerHTML = `
      <div class="container">
        <h2 class="section-title-gothic">Collections</h2>
        <div class="collections-intro">
          <p>Hoodies. Shirts. Sets. Shorts</p>
          <a class="btn btn-outline" href="shop.html">Explore</a>
        </div>
        ${cfg.homeCollections.map((col) => `
          <div class="collection-row">
            <div class="collection-row-label">
              <h3>${col.name}</h3>
              <a class="btn btn-outline" href="${col.href}">Explore</a>
            </div>
            <div class="carousel" data-carousel>
              <div class="carousel-track" data-carousel-track>
                ${col.images.map((src, i) => `
                  <a class="carousel-slide" href="${col.href}">
                    <img src="${src}" alt="${col.name} look ${i + 1}" loading="eager" decoding="async">
                  </a>`).join('')}
              </div>
              <div class="carousel-nav">
                <button class="carousel-btn" type="button" data-carousel-prev aria-label="Previous">‹</button>
                <button class="carousel-btn" type="button" data-carousel-next aria-label="Next">›</button>
                <div class="carousel-dots" data-carousel-dots></div>
              </div>
            </div>
          </div>`).join('')}
      </div>`;

    initCarousels(el);
  }

  function fillFitNotes() {
    const el = document.querySelector('[data-fit-notes]');
    if (!el || !cfg.fitNotes) return;
    el.innerHTML = `
      <div class="container">
        <div class="fit-notes">
          ${cfg.fitNotes.map((n) => `
            <article>
              <h3>${n.title}</h3>
              <p>${n.body}</p>
            </article>`).join('')}
        </div>
      </div>`;
  }

  function fillAbout() {
    const el = document.querySelector('[data-about-content]');
    if (!el || !cfg.about) return;

    el.innerHTML = `
      <section class="about-hero">
        <div class="container about-hero-grid">
          <div>
            <h1>${cfg.about.headline}</h1>
            <p class="lead">${cfg.about.intro}</p>
          </div>
          <div class="about-media">
            <img src="${cfg.about.image}" alt="BVLLY" width="506" height="630" loading="eager" decoding="async">
          </div>
        </div>
      </section>
      <div class="container">
        <div class="about-columns">
          ${(cfg.about.columns || []).map((c) => `
            <article>
              <h2>${c.title}</h2>
              <p>${c.body}</p>
            </article>`).join('')}
        </div>
      </div>`;
  }

  function fillContact() {
    const form = document.querySelector('[data-contact-form]');
    const info = document.querySelector('[data-contact-info]');
    if (!cfg.contact) return;

    if (info) {
      info.innerHTML = `
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
      if (subject) subject.value = 'BVLLY Streetwear Waitlist';

      form.addEventListener('submit', () => {
        const pieces = [...form.querySelectorAll('[name="piece_interest"]:checked')].map((el) => el.value);
        const sizes = [...form.querySelectorAll('[name="size_interest"]:checked')].map((el) => el.value);
        let pieceHidden = form.querySelector('input[name="piece"]');
        if (!pieceHidden) {
          pieceHidden = document.createElement('input');
          pieceHidden.type = 'hidden';
          pieceHidden.name = 'piece';
          form.appendChild(pieceHidden);
        }
        pieceHidden.value = pieces.join(', ') || '';
        let sizeHidden = form.querySelector('input[name="size"]');
        if (!sizeHidden) {
          sizeHidden = document.createElement('input');
          sizeHidden.type = 'hidden';
          sizeHidden.name = 'size';
          form.appendChild(sizeHidden);
        }
        sizeHidden.value = sizes.join(', ') || '';
      });
    }
  }

  function fillPrivacy() {
    const el = document.querySelector('[data-privacy-body]');
    if (!el) return;
    el.innerHTML = `
      <h1>Data Policy</h1>
      <p class="lead">We collect and process personal data to facilitate your waitlist inquiries and wholesale orders. Your information is treated with the same stubborn integrity as the breed we draw from.</p>
      <div class="policy-block">
        <h2>Inquiries &amp; Waitlist</h2>
        <p>When you join the waitlist or send a sizing inquiry, we collect your name, email address, and the specific piece you're interested in. This data is used solely to confirm your entry and provide wholesale details.</p>
      </div>
      <div class="policy-block">
        <h2>Wholesale &amp; Sizing</h2>
        <p>For wholesale inquiries and sizing requests, we collect your business name, email, and the specific product line you're interested in. This information is processed to provide wholesale pricing and sizing charts.</p>
      </div>
      <p style="text-align:center;color:rgba(255,255,255,0.65);font-size:0.85rem;margin-top:2rem;">© ${new Date().getFullYear()} BVLLY. Draft catalog — checkout not live.</p>`;
  }

  ensureSkipLink();
  setMeta();
  renderHeader();
  renderFooter();
  fillHero();
  fillHomeCollections();
  fillFitNotes();
  fillAbout();
  fillContact();
  fillPrivacy();
  window.BVLLY?.bindPhotoSlots(document);
})();
