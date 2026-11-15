const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const rootDir = join(__dirname, '..');

function createPage(path, body) {
  return new JSDOM(`<!doctype html><html><head><title>BVLLY</title></head><body>${body}</body></html>`, {
    runScripts: 'outside-only',
    url: `https://jimmythegod100.github.io/bvlly/${path}`
  });
}

function loadScript(dom, relativePath) {
  const source = readFileSync(join(rootDir, relativePath), 'utf8');
  dom.window.eval(source);
}

function loadCatalogPage(path, body) {
  const dom = createPage(path, body);
  loadScript(dom, 'js/site-config.js');
  loadScript(dom, 'js/catalog.js');
  return dom;
}

test('shop collection filter renders only matching products in configured order', () => {
  const dom = loadCatalogPage(
    'shop.html?collection=sets',
    '<div data-shop-root></div>'
  );

  const names = [...dom.window.document.querySelectorAll('.shop-card-name')].map((el) => el.textContent);
  assert.deepEqual(names, ['Mark Zip Set', 'BB Sweatsuit']);
  assert.equal(dom.window.document.querySelector('.shop-toolbar span')?.textContent, '2 products');

  const hrefs = [...dom.window.document.querySelectorAll('.shop-card')].map((el) => el.getAttribute('href'));
  assert.deepEqual(hrefs, ['product.html?id=mark-hood', 'product.html?id=bb-sweatsuit']);
});

test('product aliases and selections keep add-to-cart pointed at the waitlist prefill', () => {
  const dom = loadCatalogPage(
    'product.html?id=mark-zip-set&color=pink',
    '<div data-product-page></div>'
  );
  const { document } = dom.window;

  assert.equal(document.querySelector('h1')?.textContent, 'Mark Zip Set');
  assert.equal(document.querySelector('[data-main-img]')?.getAttribute('src'), 'images/wix-clone/products/mark-zip-pink.jpg?v=20261029a');
  assert.equal(
    document.querySelector('.pdp-actions .btn-primary')?.getAttribute('href'),
    'contact.html?piece=mark-hood&size=S&color=Pink'
  );

  document.querySelector('.size-btn[data-size="XL"]')?.click();
  document.querySelector('.swatch-btn[data-color="black"]')?.click();

  assert.equal(document.querySelector('[data-main-img]')?.getAttribute('src'), 'images/wix-clone/products/mark-zip-black.jpg?v=20261029a');
  assert.equal(
    document.querySelector('.pdp-actions .btn-primary')?.getAttribute('href'),
    'contact.html?piece=mark-hood&size=XL&color=Black'
  );
});

test('quantity controls never decrement below one', () => {
  const dom = loadCatalogPage(
    'product.html?id=mark-tee',
    '<div data-product-page></div>'
  );
  const { document } = dom.window;

  document.querySelector('[data-qty-dec]')?.click();
  assert.equal(document.querySelector('[data-qty]')?.textContent, '1');

  document.querySelector('[data-qty-inc]')?.click();
  document.querySelector('[data-qty-inc]')?.click();
  document.querySelector('[data-qty-dec]')?.click();

  assert.equal(document.querySelector('[data-qty]')?.textContent, '2');
});

test('contact form prefills aliased products, color, and size from PDP links', () => {
  const dom = loadCatalogPage(
    'contact.html?piece=mark-zip-set&size=XL&color=Pink',
    `
      <div data-piece-checks></div>
      <div data-size-checks></div>
      <select name="piece"></select>
      <textarea name="message"></textarea>
    `
  );
  const { document } = dom.window;

  assert.equal(document.querySelector('input[name="piece_interest"][value="Sets"]')?.checked, true);
  assert.equal(document.querySelector('input[name="size_interest"][value="XL"]')?.checked, true);
  assert.equal(document.querySelector('select[name="piece"]')?.value, 'Mark Zip Set');
  assert.equal(
    document.querySelector('textarea[name="message"]')?.getAttribute('placeholder'),
    'Interested in Mark Zip Set. Pink. Size XL. Any sizing requests or additional notes...'
  );
});
