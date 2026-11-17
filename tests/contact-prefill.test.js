const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const rootDir = join(__dirname, '..');

function loadContactPage(query = '') {
  const html = readFileSync(join(rootDir, 'contact.html'), 'utf8');
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    url: `https://jimmythegod100.github.io/bvlly/contact.html${query}`
  });

  for (const script of ['js/site-config.js', 'js/catalog.js', 'js/layout.js']) {
    dom.window.eval(readFileSync(join(rootDir, script), 'utf8'));
  }

  return dom;
}

test('PDP waitlist links submit the specific product, size, and color', () => {
  const dom = loadContactPage('?piece=mark-zip-set&size=XL&color=Pink');
  const { document, Event } = dom.window;
  const form = document.querySelector('[data-contact-form]');

  assert.equal(document.querySelector('input[name="piece_interest"][value="Sets"]').checked, true);
  assert.equal(document.querySelector('input[name="size_interest"][value="XL"]').checked, true);
  assert.equal(document.querySelector('input[name="piece"]').value, 'Mark Zip Set');
  assert.equal(document.querySelector('input[name="color"]').value, 'Pink');

  form.dispatchEvent(new Event('submit'));

  assert.equal(document.querySelector('input[name="piece"]').value, 'Mark Zip Set');
  assert.equal(document.querySelector('input[name="size"]').value, 'XL');
  assert.equal(document.querySelector('input[name="color"]').value, 'Pink');
});

test('manual contact submissions still fall back to selected interest groups', () => {
  const dom = loadContactPage();
  const { document, Event } = dom.window;
  const form = document.querySelector('[data-contact-form]');

  document.querySelector('input[name="piece_interest"][value="Beware"]').checked = true;
  document.querySelector('input[name="size_interest"][value="M"]').checked = true;

  form.dispatchEvent(new Event('submit'));

  assert.equal(document.querySelector('input[name="piece"]').value, 'Beware');
  assert.equal(document.querySelector('input[name="size"]').value, 'M');
});
