import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

const siteConfig = readFileSync(new URL('../js/site-config.js', import.meta.url), 'utf8');
const catalog = readFileSync(new URL('../js/catalog.js', import.meta.url), 'utf8');

function loadCatalog({ url, body }) {
  const dom = new JSDOM(`<!doctype html><html><head><title>BVLLY</title></head><body>${body}</body></html>`, {
    url,
    runScripts: 'outside-only'
  });

  dom.window.eval(siteConfig);
  dom.window.eval(catalog);
  return dom;
}

test('product page resolves aliases and carries selected options into waitlist links', () => {
  const dom = loadCatalog({
    url: 'https://example.test/product.html?id=mark-zip-set&color=pink',
    body: '<div data-product-page></div>'
  });
  const { document } = dom.window;
  const page = document.querySelector('[data-product-page]');

  assert.equal(page.querySelector('h1').textContent, 'Mark Zip Set');
  assert.equal(page.querySelector('.swatch-btn.is-active').getAttribute('aria-label'), 'Pink');

  page.querySelector('[data-size="XL"]').click();

  const href = page.querySelector('.pdp-actions .btn-primary').getAttribute('href');
  const waitlist = new URL(href, dom.window.location.href);
  assert.equal(waitlist.pathname, '/contact.html');
  assert.equal(waitlist.searchParams.get('piece'), 'mark-hood');
  assert.equal(waitlist.searchParams.get('size'), 'XL');
  assert.equal(waitlist.searchParams.get('color'), 'Pink');
});

test('product quantity controls never decrement below one', () => {
  const dom = loadCatalog({
    url: 'https://example.test/product.html?id=mark-tee',
    body: '<div data-product-page></div>'
  });
  const { document } = dom.window;

  assert.equal(document.querySelector('[data-qty]').textContent, '1');
  document.querySelector('[data-qty-dec]').click();
  assert.equal(document.querySelector('[data-qty]').textContent, '1');
  document.querySelector('[data-qty-inc]').click();
  document.querySelector('[data-qty-inc]').click();
  assert.equal(document.querySelector('[data-qty]').textContent, '3');
});

test('contact prefill checks the aliased product collection and requested size', () => {
  const dom = loadCatalog({
    url: 'https://example.test/contact.html?piece=mark-zip-set&size=XL&color=Pink',
    body: `
      <div data-piece-checks></div>
      <div data-size-checks></div>
      <textarea name="message"></textarea>
    `
  });
  const { document } = dom.window;

  const checkedPieces = [...document.querySelectorAll('[name="piece_interest"]:checked')].map((el) => el.value);
  const checkedSizes = [...document.querySelectorAll('[name="size_interest"]:checked')].map((el) => el.value);

  assert.deepEqual(checkedPieces, ['Sets']);
  assert.deepEqual(checkedSizes, ['XL']);
  assert.equal(
    document.querySelector('[name="message"]').placeholder,
    'Interested in Mark Zip Set. Pink. Size XL. Any sizing requests or additional notes...'
  );
});
