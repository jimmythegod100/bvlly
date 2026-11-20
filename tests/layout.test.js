const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const rootDir = join(__dirname, '..');

function createPage(path, page, body, title = '{{BRAND}}') {
  return new JSDOM(`<!doctype html><html><head><title>${title}</title></head><body data-page="${page}">${body}</body></html>`, {
    runScripts: 'outside-only',
    url: `https://jimmythegod100.github.io/bvlly/${path}`
  });
}

function loadScript(dom, relativePath) {
  const source = readFileSync(join(rootDir, relativePath), 'utf8');
  dom.window.eval(source);
}

function loadLayoutPage(path, page, body, title) {
  const dom = createPage(path, page, body, title);
  loadScript(dom, 'js/site-config.js');
  loadScript(dom, 'js/layout.js');
  return dom;
}

function loadProductPage(path) {
  const dom = createPage(
    path,
    'product',
    '<header data-site-header></header><main><div data-product-page></div></main><footer data-site-footer></footer>',
    'Product | {{BRAND}}'
  );
  loadScript(dom, 'js/site-config.js');
  loadScript(dom, 'js/catalog.js');
  loadScript(dom, 'js/layout.js');
  return dom;
}

test('contact submission rolls selected product interests into FormSubmit fields', () => {
  const dom = loadLayoutPage(
    'contact.html',
    'contact',
    `
      <header data-site-header></header>
      <main>
        <form data-contact-form>
          <input type="hidden" name="_next">
          <input type="hidden" name="_subject">
          <label><input type="checkbox" name="piece_interest" value="Beware" checked> Beware</label>
          <label><input type="checkbox" name="piece_interest" value="Sets" checked> Sets</label>
          <label><input type="checkbox" name="size_interest" value="M" checked> M</label>
          <label><input type="checkbox" name="size_interest" value="XL" checked> XL</label>
        </form>
      </main>
      <footer data-site-footer></footer>
    `
  );
  const { document, Event } = dom.window;
  const form = document.querySelector('[data-contact-form]');

  assert.equal(form.getAttribute('action'), 'https://formsubmit.co/hello@bvlly.com');
  assert.equal(document.querySelector('input[name="_next"]').value, 'https://jimmythegod100.github.io/bvlly/thanks.html');
  assert.equal(document.querySelector('input[name="_subject"]').value, 'BVLLY Streetwear Waitlist');

  form.dispatchEvent(new Event('submit'));

  assert.equal(document.querySelector('input[name="piece"]').value, 'Beware, Sets');
  assert.equal(document.querySelector('input[name="size"]').value, 'M, XL');
});

test('footer waitlist form posts deterministic FormSubmit fields', () => {
  const dom = loadLayoutPage(
    'index.html',
    'home',
    '<header data-site-header></header><main></main><footer data-site-footer></footer>',
    'Home | {{BRAND}}'
  );
  const { document } = dom.window;
  const form = document.querySelector('.newsletter-form');

  assert.equal(form.getAttribute('method'), 'POST');
  assert.equal(form.getAttribute('action'), 'https://formsubmit.co/hello@bvlly.com');
  assert.equal(form.querySelector('input[name="_subject"]').value, 'BVLLY drop waitlist');
  assert.equal(form.querySelector('input[name="_next"]').value, 'https://jimmythegod100.github.io/bvlly/thanks.html');
  assert.equal(form.querySelector('input[name="_captcha"]').value, 'false');
  assert.equal(form.querySelector('input[name="message"]').value, 'Footer waitlist signup');
  assert.equal(form.querySelector('input[name="_honey"]').getAttribute('autocomplete'), 'off');
  assert.equal(form.querySelector('input[name="email"]').required, true);
  assert.equal(form.querySelector('input[name="email"]').getAttribute('autocomplete'), 'email');
});

test('mobile navigation toggle keeps menu state and labels in sync', () => {
  const dom = loadLayoutPage(
    'shop.html?collection=sets',
    'shop',
    '<header data-site-header></header><main></main><footer data-site-footer></footer>',
    'Shop | {{BRAND}}'
  );
  const { document } = dom.window;
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('#site-nav');

  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(toggle.getAttribute('aria-label'), 'Open menu');
  assert.equal(document.querySelector('.nav-links a.active')?.textContent, 'Shop');
  assert.equal(document.querySelector('.nav-links a.active')?.getAttribute('aria-current'), 'page');

  toggle.click();

  assert.equal(nav.classList.contains('is-open'), true);
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(toggle.getAttribute('aria-label'), 'Close menu');

  toggle.click();

  assert.equal(nav.classList.contains('is-open'), false);
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(toggle.getAttribute('aria-label'), 'Open menu');
});

test('shop SEO URLs preserve the active collection filter', () => {
  const dom = loadLayoutPage(
    'shop.html?collection=sets',
    'shop',
    '<header data-site-header></header><main></main><footer data-site-footer></footer>',
    'Shop | {{BRAND}}'
  );
  const { document } = dom.window;

  assert.equal(document.querySelector('link[rel="canonical"]')?.href, 'https://jimmythegod100.github.io/bvlly/shop.html?collection=sets');
  assert.equal(document.querySelector('meta[property="og:url"]')?.getAttribute('content'), 'https://jimmythegod100.github.io/bvlly/shop.html?collection=sets');

  const jsonLd = JSON.parse(document.getElementById('site-jsonld').textContent);
  assert.equal(jsonLd.url, 'https://jimmythegod100.github.io/bvlly');
});

test('product SEO uses rendered product title and canonical product URL', () => {
  const dom = loadProductPage('product.html?id=mark-zip-set&color=pink');
  const { document } = dom.window;

  assert.equal(document.querySelector('h1')?.textContent, 'Mark Zip Set');
  assert.equal(document.title, 'Mark Zip Set | BVLLY');
  assert.equal(document.querySelector('meta[property="og:type"]')?.getAttribute('content'), 'product');
  assert.equal(document.querySelector('meta[property="og:title"]')?.getAttribute('content'), 'Mark Zip Set | BVLLY');
  assert.equal(document.querySelector('link[rel="canonical"]')?.href, 'https://jimmythegod100.github.io/bvlly/product.html?id=mark-zip-set');
  assert.equal(document.querySelector('meta[property="og:url"]')?.getAttribute('content'), 'https://jimmythegod100.github.io/bvlly/product.html?id=mark-zip-set');
});
