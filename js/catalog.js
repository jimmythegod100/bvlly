/**
 * Catalog helpers — shop grid, PDP, contact prefills (Wix-matched).
 */
(function () {
  const cfg = window.SITE_CONFIG;
  if (!cfg) return;

  function collectionById(id) {
    return (cfg.collections || []).find((c) => c.id === id);
  }

  function collectionName(id) {
    return collectionById(id)?.name || id;
  }

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  function colorways(item) {
    const list = item.colors || [];
    if (!list.length) {
      return item.image ? [{ name: '', slug: '', hex: '', image: item.image }] : [];
    }
    if (typeof list[0] === 'string') {
      return list.map((name) => ({
        name,
        slug: String(name).toLowerCase().replace(/\s+/g, '-'),
        hex: '',
        image: item.image
      }));
    }
    return list;
  }

  function gallery(item) {
    const worn = colorways(item).map((c) => c.image).filter(Boolean);
    const extra = (item.views || []).filter((src) => src && !worn.includes(src));
    const shots = worn.concat(extra);
    if (shots.length) return shots;
    if (item.images && item.images.length) return item.images;
    return item.image ? [item.image] : [];
  }

  function findProduct(id) {
    const resolved = (cfg.productAliases && cfg.productAliases[id]) || id;
    return (cfg.products || []).find((p) => p.id === resolved);
  }

  function mediaSlot(item, extraClass, srcOverride) {
    const name = item.name || '';
    const kicker = item.kicker || collectionName(item.collection || '') || 'BVLLY';
    const src = srcOverride || item.image || '';
    const studio = (item.fit || '') === 'contain' ? ' is-studio' : '';
    const cls = `media-slot ${extraClass || ''}${studio}`.trim();
    const eager = (extraClass || '').includes('hero-media') || (extraClass || '').includes('product-hero');
    const img = src
      ? `<img src="${src}" alt="${name}" width="800" height="1000" ${eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async" data-try-photo>`
      : '';
    return `
      <div class="${cls}${src ? '' : ' is-empty'}">
        ${img}
        <div class="media-fallback">
          <span class="media-kicker">${kicker}</span>
          <span class="media-title">${name}</span>
          <span class="media-note">Photo coming</span>
        </div>
      </div>`;
  }

  function bindPhotoSlots(root) {
    (root || document).querySelectorAll('[data-try-photo]').forEach((img) => {
      const slot = img.closest('.media-slot');
      const mark = () => {
        img.remove();
        slot?.classList.add('is-empty');
      };
      img.addEventListener('error', mark);
      img.addEventListener('load', () => slot?.classList.add('has-photo'));
      if (img.complete && img.naturalWidth) slot?.classList.add('has-photo');
    });
  }

  window.BVLLY = { mediaSlot, collectionName, bindPhotoSlots };

  function shopCard(p) {
    return `
      <a class="shop-card" href="product.html?id=${encodeURIComponent(p.id)}">
        <div class="shop-card-media">
          <img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async">
        </div>
        <h3 class="shop-card-name">${p.name}</h3>
        <p class="shop-card-price">Price ${money(p.price)}</p>
      </a>`;
  }

  function fillCollections() {
    const el = document.querySelector('[data-collections]');
    if (!el || !cfg.collections) return;
    el.innerHTML = `
      <div class="collections-intro" style="text-align:left;margin-bottom:2rem;">
        <p style="letter-spacing:0.14em;">Hoodies. Shirts. Sets. Shorts</p>
        <a class="btn btn-outline" href="shop.html">Explore</a>
      </div>
      <div class="fit-notes" style="border:1px solid rgba(255,255,255,0.2);">
        ${cfg.collections.map((c) => {
          const count = (cfg.products || []).filter((p) => p.collection === c.id).length;
          return `
            <article>
              <h3>${c.name}</h3>
              <p>${c.tagline}</p>
              <p style="margin-top:1rem;"><a href="shop.html?collection=${encodeURIComponent(c.id)}">Explore → ${count} pieces</a></p>
            </article>`;
        }).join('')}
      </div>`;
  }

  function activeCollection() {
    const params = new URLSearchParams(window.location.search);
    return params.get('collection') || 'all';
  }

  function fillShop() {
    const root = document.querySelector('[data-shop-root]');
    if (!root || !cfg.products) return;

    const current = activeCollection();
    const list = [...cfg.products].sort((a, b) => (a.shopOrder || 99) - (b.shopOrder || 99))
      .filter((p) => current === 'all' || p.collection === current);

    const prices = cfg.products.map((p) => p.price);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);

    root.innerHTML = `
      ${cfg.shopBanner ? `<div class="shop-banner"><img src="${cfg.shopBanner}" alt="" width="1400" height="280"></div>` : ''}
      <div class="container">
        <p class="shop-crumbs"><a href="index.html">Home</a> &gt; All Products</p>
        <div class="shop-layout">
          <aside class="shop-sidebar">
            <h1 style="font-size:1.8rem;font-weight:600;margin:0 0 1.5rem;">All Products</h1>
            <h2>Browse by</h2>
            <a class="browse-link" href="shop.html">All Products</a>
            <h2>Filter by</h2>
            <div class="filter-block">
              <div class="filter-title">Price</div>
              <div class="price-range">$${minP} — $${maxP}</div>
            </div>
            <details class="filter-block">
              <summary>Color <span>+</span></summary>
              <div style="padding-top:0.5rem;font-size:0.85rem;color:rgba(255,255,255,0.7);">Pink · Black · Graphite</div>
            </details>
            <details class="filter-block">
              <summary>Size <span>+</span></summary>
              <div style="padding-top:0.5rem;font-size:0.85rem;color:rgba(255,255,255,0.7);">S · M · L · XL · XXL · One size</div>
            </details>
          </aside>
          <div>
            <div class="shop-toolbar">
              <span>${list.length} products</span>
              <span>Sort by: Recommended</span>
            </div>
            <div class="shop-grid" data-product-grid>
              ${list.map(shopCard).join('')}
            </div>
          </div>
        </div>
      </div>`;
  }

  function fillProductPage() {
    const el = document.querySelector('[data-product-page]');
    if (!el || !cfg.products) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const product = findProduct(id);
    if (!product) {
      el.innerHTML = `
        <div class="error-page">
          <p>That piece is not in the catalog.</p>
          <p><a class="btn btn-primary" href="shop.html">Back to shop</a></p>
        </div>`;
      return;
    }

    const ways = colorways(product);
    const colorParam = params.get('color');
    let activeColor = ways.find((c) => c.slug === colorParam) || ways.find((c) => c.image === product.image) || ways[0];
    let qty = 1;
    let activeSize = product.sizes?.[0] || '';
    const shots = gallery(product);

    document.title = `${product.name} | ${cfg.brand.name}`;

    function notifyHref() {
      return `contact.html?piece=${encodeURIComponent(product.id)}&size=${encodeURIComponent(activeSize)}&color=${encodeURIComponent(activeColor?.name || '')}`;
    }

    function render() {
      const activeSrc = activeColor?.image || product.image;
      el.innerHTML = `
        <div class="container pdp">
          <div class="pdp-gallery">
            <div class="pdp-thumbs">
              ${shots.map((src) => {
                const way = ways.find((c) => c.image === src);
                const active = src === activeSrc ? 'is-active' : '';
                return `<button type="button" class="${active}" data-src="${src}" data-color="${way?.slug || ''}">
                  <img src="${src}" alt="">
                </button>`;
              }).join('')}
            </div>
            <div class="pdp-main">
              <img src="${activeSrc}" alt="${product.name}" data-main-img>
            </div>
          </div>
          <div class="pdp-info">
            <h1>${product.name}</h1>
            <p class="pdp-price">${money(product.price)}</p>
            <div class="pdp-field">
              <span>Color *</span>
              <div class="swatch-row">
                ${ways.map((c) => `
                  <button type="button" class="swatch-btn ${c.slug === activeColor?.slug ? 'is-active' : ''}"
                    style="background:${c.hex || '#ccc'}" data-color="${c.slug}" data-src="${c.image}"
                    aria-label="${c.name}" title="${c.name}"></button>`).join('')}
              </div>
            </div>
            <div class="pdp-field">
              <span>Size *</span>
              <div class="size-row">
                ${(product.sizes || []).map((s) => `
                  <button type="button" class="size-btn ${s === activeSize ? 'is-active' : ''}" data-size="${s}">${s}</button>`).join('')}
              </div>
            </div>
            <div class="pdp-field">
              <span>Quantity *</span>
              <div class="qty-row">
                <button type="button" data-qty-dec aria-label="Decrease">−</button>
                <span data-qty>${qty}</span>
                <button type="button" data-qty-inc aria-label="Increase">+</button>
              </div>
            </div>
            <div class="pdp-actions">
              <a class="btn btn-primary btn-block" href="${notifyHref()}">Add to cart</a>
              <a class="btn btn-white btn-block" href="${notifyHref()}">Buy Now</a>
            </div>
            <p class="pdp-desc">${product.description}</p>
            <p class="pdp-note">Checkout is not live on this draft — Add to cart / Buy Now open the waitlist with this piece prefills.</p>
          </div>
        </div>`;

      el.querySelectorAll('.pdp-thumbs button').forEach((btn) => {
        btn.addEventListener('click', () => {
          const way = ways.find((c) => c.slug === btn.dataset.color) || ways.find((c) => c.image === btn.dataset.src);
          if (way) activeColor = way;
          render();
        });
      });
      el.querySelectorAll('.swatch-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          activeColor = ways.find((c) => c.slug === btn.dataset.color) || activeColor;
          render();
        });
      });
      el.querySelectorAll('.size-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          activeSize = btn.dataset.size || activeSize;
          render();
        });
      });
      el.querySelector('[data-qty-dec]')?.addEventListener('click', () => {
        qty = Math.max(1, qty - 1);
        const n = el.querySelector('[data-qty]');
        if (n) n.textContent = String(qty);
      });
      el.querySelector('[data-qty-inc]')?.addEventListener('click', () => {
        qty += 1;
        const n = el.querySelector('[data-qty]');
        if (n) n.textContent = String(qty);
      });
    }

    render();

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.id = 'product-jsonld';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: shots.map((src) => window.absoluteUrl(src)),
      brand: { '@type': 'Brand', name: cfg.brand.name },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/PreOrder',
        url: window.absoluteUrl(`product.html?id=${encodeURIComponent(product.id)}`)
      }
    });
    document.getElementById('product-jsonld')?.remove();
    document.head.appendChild(ld);
  }

  function prefillContactPiece() {
    const params = new URLSearchParams(window.location.search);
    const current = params.get('piece') || '';
    const size = params.get('size') || '';
    const color = params.get('color') || '';
    const resolvedId = (cfg.productAliases && cfg.productAliases[current]) || current;
    const piece = findProduct(resolvedId);

    // Checkbox-style piece interest (Wix form)
    const pieceBox = document.querySelector('[data-piece-checks]');
    if (pieceBox) {
      const groups = ['Beware', 'The Mark', 'Sets', 'Accessories'];
      pieceBox.innerHTML = groups.map((g) => {
        const checked = piece && collectionName(piece.collection) === g ? 'checked' : '';
        return `<label><input type="checkbox" name="piece_interest" value="${g}" ${checked}> ${g}</label>`;
      }).join('');
    }

    const sizeBox = document.querySelector('[data-size-checks]');
    if (sizeBox) {
      const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
      sizeBox.innerHTML = sizes.map((s) => {
        const checked = s === size ? 'checked' : '';
        return `<label><input type="checkbox" name="size_interest" value="${s}" ${checked}> ${s}</label>`;
      }).join('');
    }

    // Hidden selects for FormSubmit compatibility if present
    const select = document.querySelector('[name="piece"]');
    if (select && cfg.products) {
      select.innerHTML = `<option value="">Just saying hello</option>` +
        cfg.products.map((p) => `<option value="${p.name}" ${p.id === resolvedId ? 'selected' : ''}>${p.name}</option>`).join('');
    }

    const message = document.querySelector('[name="message"]');
    if (message && !message.value && (current || size || color)) {
      const parts = [];
      if (piece) parts.push(`Interested in ${piece.name}.`);
      if (color) parts.push(`${color}.`);
      if (size) parts.push(`Size ${size}.`);
      if (parts.length) message.placeholder = `${parts.join(' ')} Any sizing requests or additional notes...`;
    }
  }

  fillCollections();
  fillShop();
  fillProductPage();
  prefillContactPiece();
})();
