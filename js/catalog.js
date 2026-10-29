/**
 * Catalog helpers — product grid, galleries, media slots, Wix-like shop/PDP.
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

  window.BVLLY = { mediaSlot, collectionName, bindPhotoSlots, findProduct, money };

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
          <span class="collection-meta">
            <span>${count} pieces</span>
            <span>Explore →</span>
          </span>
        </a>`;
    }).join('');
  }

  function activeCollection() {
    return new URLSearchParams(window.location.search).get('collection') || 'all';
  }

  function activeCategory() {
    return new URLSearchParams(window.location.search).get('category') || '';
  }

  function filterProducts() {
    const collection = activeCollection();
    const category = activeCategory();
    let list = cfg.products || [];
    if (collection !== 'all') list = list.filter((p) => p.collection === collection);
    if (category && cfg.categoryMap?.[category]) {
      const ids = new Set(cfg.categoryMap[category]);
      list = list.filter((p) => ids.has(p.id));
    }
    return list;
  }

  function fillShop() {
    const grid = document.querySelector('[data-product-grid]');
    if (!grid || !cfg.products) return;

    const banner = document.querySelector('[data-shop-banner]');
    if (banner && cfg.shop?.banner) {
      banner.innerHTML = `<img src="${cfg.shop.banner}" alt="" width="1200" height="480" decoding="async">`;
    }

    const side = document.querySelector('[data-shop-side]');
    const current = activeCollection();
    const category = activeCategory();
    if (side) {
      const chips = [{ id: 'all', name: 'All Products' }, ...(cfg.collections || [])];
      side.innerHTML = `
        <div class="side-block">
          <h3>Browse by</h3>
          ${chips.map((c) => {
            const href = c.id === 'all' ? 'shop.html' : `shop.html?collection=${encodeURIComponent(c.id)}`;
            const active = (!category && current === c.id) || (c.id === 'all' && current === 'all' && !category) ? 'is-active' : '';
            return `<a class="${active}" href="${href}">${c.name}</a>`;
          }).join('')}
        </div>
        <div class="side-block">
          <h3>Filter by</h3>
          <p class="price-range">Price<br>$38.00 — $178.00</p>
        </div>`;
    }

    const list = filterProducts();
    const heading = document.querySelector('[data-shop-heading]');
    if (heading) {
      if (category) heading.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      else if (current !== 'all') heading.textContent = collectionById(current)?.name || 'All Products';
      else heading.textContent = 'All Products';
    }

    const toolbar = document.querySelector('[data-shop-toolbar]');
    if (toolbar) {
      toolbar.innerHTML = `
        <span>${list.length} product${list.length === 1 ? '' : 's'}</span>
        <label>Sort by:
          <select class="sort-select" aria-label="Sort products">
            <option>Recommended</option>
            <option>Price: low to high</option>
            <option>Price: high to low</option>
          </select>
        </label>`;
      const select = toolbar.querySelector('select');
      select?.addEventListener('change', () => {
        let sorted = [...list];
        if (select.selectedIndex === 1) sorted.sort((a, b) => a.price - b.price);
        if (select.selectedIndex === 2) sorted.sort((a, b) => b.price - a.price);
        grid.innerHTML = sorted.map(productCard).join('');
        bindPhotoSlots(grid);
      });
    }

    if (!list.length) {
      grid.innerHTML = `<p class="empty-state">No pieces in this view yet.</p>`;
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

    document.title = `${product.name} | BVLLY`;
    const sizes = (product.sizes || []).map((s, i) =>
      `<button type="button" class="size-chip${i === 0 ? ' is-selected' : ''}" data-size="${s}" aria-pressed="${i === 0 ? 'true' : 'false'}">${s}</button>`
    ).join('');
    const colors = ways.map((c) => {
      const selected = c.slug === activeColor?.slug ? ' is-selected' : '';
      const bg = c.hex ? `style="--swatch:${c.hex}"` : '';
      return `<button type="button" class="size-chip color-chip${selected}" data-tone="${c.name}" data-color="${c.slug}" data-src="${c.image}" ${bg} aria-label="${c.name}" aria-pressed="${selected ? 'true' : 'false'}"></button>`;
    }).join('');
    const shots = gallery(product);
    const thumbs = shots.length
      ? `<div class="thumbs" data-thumbs>${shots.map((src) => {
          const way = ways.find((c) => c.image === src);
          const active = src === activeSrc ? 'is-active' : '';
          const label = way ? way.name : 'Photo';
          const color = way?.slug || ways[0]?.slug || '';
          return `
          <button type="button" class="thumb ${active}" data-src="${src}" data-color="${color}" aria-label="${label}">
            <img src="${src}" alt="${product.name} ${label}">
          </button>`;
        }).join('')}</div>`
      : '';

    const notifyHref = `contact.html?piece=${encodeURIComponent(product.id)}&size=${encodeURIComponent(product.sizes?.[0] || '')}&color=${encodeURIComponent(activeColor?.name || '')}`;

    el.innerHTML = `
      <div class="product-layout">
        <div class="product-gallery">
          ${thumbs}
          ${mediaSlot({ ...product, fit: 'cover' }, 'product-hero', activeSrc)}
        </div>
        <div class="product-copy">
          <h1>${product.name}</h1>
          <p class="price">${money(product.price)}</p>
          <p class="product-collection">Color</p>
          <div class="color-row" data-color-row>${colors}</div>
          <p class="product-collection">Size</p>
          <div class="size-row" data-size-row>${sizes}</div>
          <div class="qty-row" data-qty>
            <button type="button" data-qty-minus aria-label="Decrease quantity">−</button>
            <span data-qty-value>1</span>
            <button type="button" data-qty-plus aria-label="Increase quantity">+</button>
          </div>
          <div class="pdp-actions">
            <button class="btn btn-primary btn-block" type="button" data-add-cart>Add to cart</button>
            <a class="btn btn-light btn-block" data-buy-now href="${notifyHref}">Buy now</a>
          </div>
          <p>${product.description}</p>
          <p class="draft-note">Checkout is not live on this draft — Add to cart keeps a local bag; Buy now opens the waitlist.</p>
        </div>
      </div>`;
    bindPhotoSlots(el);

    const mainImg = el.querySelector('.product-hero img');
    const buy = el.querySelector('[data-buy-now]');
    let qty = 1;

    function selectedSize() {
      return el.querySelector('[data-size-row] .size-chip.is-selected')?.dataset.size || product.sizes?.[0] || '';
    }
    function selectedColor() {
      return el.querySelector('[data-color-row] .color-chip.is-selected');
    }

    function syncLinks() {
      const colorName = selectedColor()?.dataset.tone || '';
      const href = `contact.html?piece=${encodeURIComponent(product.id)}&size=${encodeURIComponent(selectedSize())}&color=${encodeURIComponent(colorName)}`;
      if (buy) buy.href = href;
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
      syncLinks();
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
        syncLinks();
      });
    });

    const qtyEl = el.querySelector('[data-qty-value]');
    el.querySelector('[data-qty-minus]')?.addEventListener('click', () => {
      qty = Math.max(1, qty - 1);
      if (qtyEl) qtyEl.textContent = String(qty);
    });
    el.querySelector('[data-qty-plus]')?.addEventListener('click', () => {
      qty += 1;
      if (qtyEl) qtyEl.textContent = String(qty);
    });

    el.querySelector('[data-add-cart]')?.addEventListener('click', () => {
      window.BVLLY_CART?.add({
        id: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize(),
        color: selectedColor()?.dataset.tone || '',
        qty
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
    const pieceRadios = document.querySelector('[data-piece-radios]');
    const select = document.querySelector('[name="piece"]');
    const params = new URLSearchParams(window.location.search);
    const current = params.get('piece') || '';
    const size = params.get('size') || '';
    const color = params.get('color') || '';
    const resolvedId = (cfg.productAliases && cfg.productAliases[current]) || current;
    const product = findProduct(resolvedId);

    if (pieceRadios) {
      const cols = cfg.collections || [];
      const selectedId = product?.collection || cols[0]?.id;
      const options = cols.map((c) => {
        const checked = c.id === selectedId ? 'checked' : '';
        return `<label><input type="radio" name="piece" value="${c.name}" ${checked} required> ${c.name}</label>`;
      }).join('');
      pieceRadios.innerHTML = options || '';
    } else if (select && cfg.products) {
      select.innerHTML = `<option value="">Just saying hello</option>` +
        cfg.products.map((p) => `<option value="${p.name}" ${p.id === resolvedId ? 'selected' : ''}>${p.name}</option>`).join('');
    }

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
      const seen = new Set();
      const colors = [''];
      (cfg.products || []).forEach((p) => {
        colorways(p).forEach((c) => {
          if (c.name && !seen.has(c.name)) {
            seen.add(c.name);
            colors.push(c.name);
          }
        });
      });
      colorSelect.innerHTML = colors.map((c) => {
        const label = c || 'Not sure yet';
        const selected = c && c.toLowerCase() === color.toLowerCase() ? 'selected' : '';
        return `<option value="${c}" ${selected}>${label}</option>`;
      }).join('');
    }

    const message = document.querySelector('[name="message"]');
    if (message && !message.value && (current || size || color)) {
      const parts = [];
      if (product) parts.push(`Interested in ${product.name}.`);
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
