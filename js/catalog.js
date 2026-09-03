/**
 * Catalog helpers — product grid, collections, product page, media slots.
 * Photos are optional. Missing files fall back to a labeled placeholder.
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

  function mediaSlot(item, extraClass) {
    const name = item.name || '';
    const kicker = item.kicker || collectionName(item.collection || '') || 'BVLLY';
    const src = item.image || '';
    const cls = `media-slot ${extraClass || ''}`.trim();
    const img = src
      ? `<img src="${src}" alt="${name}" width="800" height="1000" loading="lazy" decoding="async" data-try-photo>`
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
    });
  }

  window.BVLLY = { mediaSlot, collectionName, bindPhotoSlots };

  function productCard(p) {
    return `
      <a class="product-card" href="product.html?id=${encodeURIComponent(p.id)}">
        ${mediaSlot(p)}
        <div class="product-meta">
          <span class="product-collection">${collectionName(p.collection)}</span>
          <h3>${p.name}</h3>
          <span class="price">${money(p.price)} · <span class="badge">Coming soon</span></span>
        </div>
      </a>`;
  }

  function fillFeatured() {
    const el = document.querySelector('[data-featured-products]');
    if (!el || !cfg.products) return;
    const list = cfg.products.filter((p) => p.featured).slice(0, 6);
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
          <span class="product-collection">${count} pieces</span>
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

    const id = new URLSearchParams(window.location.search).get('id');
    const product = cfg.products.find((p) => p.id === id);
    if (!product) {
      el.innerHTML = `
        <div class="empty-state">
          <p>That piece is not in the catalog.</p>
          <p><a class="btn btn-primary" href="shop.html">Back to shop</a></p>
        </div>`;
      return;
    }

    document.title = `${product.name} — ${cfg.brand.name}`;
    const sizes = (product.sizes || []).map((s) => `<span class="size-chip">${s}</span>`).join('');
    const colors = (product.colors || []).map((c) => `<span class="size-chip">${c}</span>`).join('');

    el.innerHTML = `
      <div class="product-layout">
        ${mediaSlot(product, 'product-hero')}
        <div class="product-copy">
          <p class="product-collection">${collectionName(product.collection)}</p>
          <h1>${product.name}</h1>
          <p class="price">${money(product.price)}</p>
          <p>${product.description}</p>
          <p class="product-collection">Size</p>
          <div class="size-row">${sizes}</div>
          <p class="product-collection">Color</p>
          <div class="color-row">${colors}</div>
          <p><span class="badge">Photo pending</span> Checkout is not live on this draft.</p>
          <p style="margin-top:1.25rem;">
            <a class="btn btn-primary" href="contact.html?piece=${encodeURIComponent(product.id)}">Notify me</a>
            <a class="btn btn-outline" href="shop.html">All pieces</a>
          </p>
        </div>
      </div>`;
    bindPhotoSlots(el);
  }

  function prefillContactPiece() {
    const select = document.querySelector('[name="piece"]');
    if (!select || !cfg.products) return;
    const current = new URLSearchParams(window.location.search).get('piece') || '';
    select.innerHTML = `<option value="">Just saying hello</option>` +
      cfg.products.map((p) => `<option value="${p.name}" ${p.id === current ? 'selected' : ''}>${p.name}</option>`).join('');
  }

  fillFeatured();
  fillCollections();
  fillShop();
  fillProductPage();
  prefillContactPiece();
})();
