/**
 * Catalog helpers — product grid, galleries, media slots.
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
    return `$${Number(n).toFixed(0)}`;
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
    if (worn.length) return worn;
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

  function swatches(p) {
    const dots = colorways(p).map((c) => {
      const bg = c.hex ? `style="background:${c.hex}"` : '';
      return `<span class="swatch" ${bg} title="${c.name}"></span>`;
    }).join('');
    return dots ? `<div class="card-swatches" aria-hidden="true">${dots}</div>` : '';
  }

  function productCard(p) {
    const preview = { ...p, fit: 'cover' };
    return `
      <a class="product-card" href="product.html?id=${encodeURIComponent(p.id)}">
        ${mediaSlot(preview)}
        <div class="product-meta">
          <span class="product-collection">${collectionName(p.collection)}</span>
          <h3>${p.name}</h3>
          <span class="price">${money(p.price)}</span>
          ${swatches(p)}
        </div>
      </a>`;
  }

  function fillFeatured() {
    const el = document.querySelector('[data-featured-products]');
    if (!el || !cfg.products) return;
    const list = cfg.products.filter((p) => p.featured);
    el.innerHTML = list.map(productCard).join('');
    bindPhotoSlots(el);
  }

  function fillCollections() {
    const el = document.querySelector('[data-collections]');
    if (!el || !cfg.collections) return;
    el.innerHTML = cfg.collections.map((c) => {
      const count = (cfg.products || []).filter((p) => p.collection === c.id).length;
      return `
        <a class="collection-card" href="shop.html?collection=${encodeURIComponent(c.id)}">
          <div>
            <h3>${c.name}</h3>
            <p>${c.tagline}</p>
          </div>
          <span class="product-collection">${count} pieces · 5 colors</span>
        </a>`;
    }).join('');
  }

  function activeCollection() {
    const params = new URLSearchParams(window.location.search);
    return params.get('collection') || 'all';
  }

  function fillShop() {
    const grid = document.querySelector('[data-product-grid]');
    const filters = document.querySelector('[data-shop-filters]');
    if (!grid || !cfg.products) return;

    const current = activeCollection();
    const chips = [{ id: 'all', name: 'All' }, ...(cfg.collections || [])];
    if (filters) {
      filters.innerHTML = chips.map((c) => {
        const href = c.id === 'all' ? 'shop.html' : `shop.html?collection=${encodeURIComponent(c.id)}`;
        const active = current === c.id ? 'is-active' : '';
        return `<a class="filter-chip ${active}" href="${href}">${c.name}</a>`;
      }).join('');
    }

    const list = current === 'all'
      ? cfg.products
      : cfg.products.filter((p) => p.collection === current);

    const heading = document.querySelector('[data-shop-heading]');
    if (heading && current !== 'all') {
      const col = collectionById(current);
      heading.textContent = col ? col.name : 'Shop';
    }

    if (!list.length) {
      grid.innerHTML = `<p class="empty-state">No pieces in this collection yet.</p>`;
      return;
    }
    grid.innerHTML = list.map(productCard).join('');
    bindPhotoSlots(grid);
  }

  function fillProductPage() {
    const el = document.querySelector('[data-product-page]');
    if (!el || !cfg.products) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const product = findProduct(id);
    if (!product) {
      el.innerHTML = `
        <div class="empty-state">
          <p>That piece is not in the catalog.</p>
          <p><a class="btn btn-primary" href="shop.html">Back to shop</a></p>
        </div>`;
      return;
    }

    const ways = colorways(product);
    const colorParam = params.get('color');
    const activeColor = ways.find((c) => c.slug === colorParam) || ways.find((c) => c.image === product.image) || ways[0];
    const activeSrc = activeColor?.image || product.image;

    document.title = `${product.name} — ${cfg.brand.name}`;
    const sizes = (product.sizes || []).map((s, i) =>
      `<button type="button" class="size-chip${i === 0 ? ' is-selected' : ''}" data-size="${s}" aria-pressed="${i === 0 ? 'true' : 'false'}">${s}</button>`
    ).join('');
    const colors = ways.map((c) => {
      const selected = c.slug === activeColor?.slug ? ' is-selected' : '';
      const tone = c.name.replace(/"/g, '');
      const bg = c.hex ? `style="--swatch:${c.hex}"` : '';
      return `<button type="button" class="size-chip color-chip${selected}" data-tone="${tone}" data-color="${c.slug}" data-src="${c.image}" ${bg} aria-pressed="${selected ? 'true' : 'false'}">${c.name}</button>`;
    }).join('');
    const shots = gallery(product);
    const thumbs = shots.length > 1
      ? `<div class="thumbs" data-thumbs>${shots.map((src) => {
          const way = ways.find((c) => c.image === src);
          const active = src === activeSrc ? 'is-active' : '';
          const label = way ? way.name : 'Photo';
          return `
          <button type="button" class="thumb ${active}" data-src="${src}" data-color="${way?.slug || ''}" aria-label="${label}">
            <img src="${src}" alt="${product.name} ${label}">
          </button>`;
        }).join('')}</div>`
      : '';

    const notifyHref = `contact.html?piece=${encodeURIComponent(product.id)}&size=${encodeURIComponent(product.sizes?.[0] || '')}&color=${encodeURIComponent(activeColor?.name || '')}`;

    el.innerHTML = `
      <div class="product-layout">
        <div class="product-gallery">
          ${mediaSlot({ ...product, fit: 'cover' }, 'product-hero', activeSrc)}
          ${thumbs}
        </div>
        <div class="product-copy">
          <p class="product-collection">${collectionName(product.collection)}</p>
          <h1>${product.name}</h1>
          <p class="price">${money(product.price)}</p>
          <p>${product.description}</p>
          <p class="product-collection">Size</p>
          <div class="size-row" data-size-row>${sizes}</div>
          <p class="product-collection">Color</p>
          <div class="color-row" data-color-row>${colors}</div>
          <p>Checkout is not live on this draft — request a size below.</p>
          <p style="margin-top:1.25rem;">
            <a class="btn btn-primary" data-notify-link href="${notifyHref}">Notify me</a>
            <a class="btn btn-outline" href="shop.html">All pieces</a>
          </p>
        </div>
      </div>`;
    bindPhotoSlots(el);

    const mainImg = el.querySelector('.product-hero img');
    const notify = el.querySelector('[data-notify-link]');

    function selectedSize() {
      return el.querySelector('[data-size-row] .size-chip.is-selected')?.dataset.size || product.sizes?.[0] || '';
    }

    function setColor(src, slug) {
      if (mainImg && src) {
        mainImg.src = src;
        mainImg.closest('.media-slot')?.classList.add('has-photo');
      }
      el.querySelectorAll('.thumb').forEach((t) => t.classList.toggle('is-active', t.dataset.src === src));
      el.querySelectorAll('[data-color-row] .color-chip').forEach((chip) => {
        const on = chip.dataset.color === slug;
        chip.classList.toggle('is-selected', on);
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      const colorName = ways.find((c) => c.slug === slug)?.name || '';
      if (notify) {
        notify.href = `contact.html?piece=${encodeURIComponent(product.id)}&size=${encodeURIComponent(selectedSize())}&color=${encodeURIComponent(colorName)}`;
      }
    }

    el.querySelectorAll('[data-thumbs] .thumb').forEach((btn) => {
      btn.addEventListener('click', () => setColor(btn.dataset.src, btn.dataset.color));
    });

    el.querySelectorAll('[data-color-row] .color-chip').forEach((btn) => {
      btn.addEventListener('click', () => setColor(btn.dataset.src, btn.dataset.color));
    });

    el.querySelectorAll('[data-size-row] .size-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('[data-size-row] .size-chip').forEach((chip) => {
          chip.classList.remove('is-selected');
          chip.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-selected');
        btn.setAttribute('aria-pressed', 'true');
        const colorName = el.querySelector('[data-color-row] .color-chip.is-selected')?.textContent.trim() || '';
        if (notify) {
          notify.href = `contact.html?piece=${encodeURIComponent(product.id)}&size=${encodeURIComponent(btn.dataset.size || '')}&color=${encodeURIComponent(colorName)}`;
        }
      });
    });

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
      color: ways.map((c) => c.name).join(', '),
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
    const select = document.querySelector('[name="piece"]');
    if (!select || !cfg.products) return;
    const params = new URLSearchParams(window.location.search);
    const current = params.get('piece') || '';
    const size = params.get('size') || '';
    const color = params.get('color') || '';
    const resolvedId = (cfg.productAliases && cfg.productAliases[current]) || current;
    select.innerHTML = `<option value="">Just saying hello</option>` +
      cfg.products.map((p) => `<option value="${p.name}" ${p.id === resolvedId ? 'selected' : ''}>${p.name}</option>`).join('');

    const sizeSelect = document.querySelector('[name="size"]');
    if (sizeSelect) {
      const sizes = ['', 'S', 'M', 'L', 'XL', 'XXL', 'One size'];
      sizeSelect.innerHTML = sizes.map((s) => {
        const label = s || 'Not sure yet';
        const selected = s && s === size ? 'selected' : '';
        return `<option value="${s}" ${selected}>${label}</option>`;
      }).join('');
    }

    const colorSelect = document.querySelector('[name="color"]');
    if (colorSelect) {
      const colors = ['', 'Beige', 'Dust Blue', 'Pink', 'Black', 'Army Green'];
      colorSelect.innerHTML = colors.map((c) => {
        const label = c || 'Not sure yet';
        const selected = c && c.toLowerCase() === color.toLowerCase() ? 'selected' : '';
        return `<option value="${c}" ${selected}>${label}</option>`;
      }).join('');
    }

    const message = document.querySelector('[name="message"]');
    if (message && !message.value && (current || size || color)) {
      const piece = findProduct(current);
      const parts = [];
      if (piece) parts.push(`Interested in ${piece.name}.`);
      if (color) parts.push(`${color}.`);
      if (size) parts.push(`Size ${size}.`);
      message.placeholder = parts.length
        ? `${parts.join(' ')} City and anything else we should know.`
        : message.placeholder;
    }
  }

  fillFeatured();
  fillCollections();
  fillShop();
  fillProductPage();
  prefillContactPiece();
})();
