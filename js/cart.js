/**
 * Cart UI — visual match for Wix bag/side-cart.
 * No payment backend: lines are local-only; checkout CTA routes to waitlist/contact.
 */
(function () {
  const KEY = 'bvlly-cart';

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      const items = raw ? JSON.parse(raw) : [];
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = String(items.reduce((n, i) => n + (i.qty || 1), 0));
    });
    renderPanel();
  }

  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  function ensureDrawer() {
    if (document.querySelector('[data-cart-drawer]')) return;
    const el = document.createElement('div');
    el.className = 'cart-drawer';
    el.dataset.cartDrawer = '';
    el.innerHTML = `
      <div class="cart-backdrop" data-cart-close></div>
      <aside class="cart-panel" role="dialog" aria-label="Cart">
        <button class="cart-close" type="button" aria-label="Close cart" data-cart-close>×</button>
        <h2>Cart</h2>
        <div class="cart-body" data-cart-body></div>
        <div data-cart-footer></div>
      </aside>`;
    document.body.appendChild(el);
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-cart-close]')) close();
    });
  }

  function renderPanel() {
    const body = document.querySelector('[data-cart-body]');
    const footer = document.querySelector('[data-cart-footer]');
    if (!body || !footer) return;
    const items = read();
    if (!items.length) {
      body.innerHTML = `
        <p>Your bag is empty.</p>
        <p>Checkout is not live on this draft. Join the drop to request a size.</p>
        <p><a class="btn btn-primary" href="shop.html">Browse products</a></p>`;
      footer.innerHTML = '';
      return;
    }
    body.innerHTML = `<ul class="cart-lines">${items.map((i) => `
      <li>
        <span>${i.name}${i.size ? ` / ${i.size}` : ''}${i.color ? ` / ${i.color}` : ''} × ${i.qty || 1}</span>
        <span>${money((i.price || 0) * (i.qty || 1))}</span>
      </li>`).join('')}</ul>
      <p class="draft-note">Draft catalog — payment is not connected. Use Buy Now / Notify to join the waitlist.</p>`;
    footer.innerHTML = `
      <a class="btn btn-primary btn-block" href="contact.html">Notify / join waitlist</a>
      <button class="btn btn-outline btn-block" type="button" data-cart-clear style="margin-top:0.65rem">Clear bag</button>`;
    footer.querySelector('[data-cart-clear]')?.addEventListener('click', () => write([]));
  }

  function open() {
    ensureDrawer();
    renderPanel();
    document.querySelector('[data-cart-drawer]')?.classList.add('is-open');
  }

  function close() {
    document.querySelector('[data-cart-drawer]')?.classList.remove('is-open');
  }

  function add(item) {
    const items = read();
    const key = `${item.id}|${item.size || ''}|${item.color || ''}`;
    const existing = items.find((i) => `${i.id}|${i.size || ''}|${i.color || ''}` === key);
    if (existing) existing.qty = (existing.qty || 1) + (item.qty || 1);
    else items.push({ ...item, qty: item.qty || 1 });
    write(items);
    open();
  }

  window.BVLLY_CART = { add, open, close, read };

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-cart-open]')) {
      e.preventDefault();
      open();
    }
  });

  ensureDrawer();
  renderPanel();
})();
