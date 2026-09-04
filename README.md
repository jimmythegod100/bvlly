# BVLLY

Static catalog site for **BVLLY** (said “Bully”) — human streetwear. The miniature exotic bulldog is the bloodline, not the customer.

Two languages in the drop: gothic **Beware** prints (silver on black) and the quiet embroidered **Mark**. This draft uses your product photos plus studio mockups of the same pieces.

## Preview locally

```bash
npm run dev
```

Open [http://localhost:43191](http://localhost:43191).

Or:

```bash
python3 -m http.server 43191 --bind 0.0.0.0
```

## What’s in this draft

- Home with featured pieces, collections, and how the clothes sit
- Shop with collection filters
- Product pages (human sizes, color, notify-me)
- About, contact / waitlist, privacy
- Twelve intended SKUs in `js/site-config.js`

## Adding apparel photos later

See [`images/products/README.md`](images/products/README.md). File names match each product `id`. Missing files keep the “Photo coming” slot.

Edit copy, prices, and colors in:

- [`js/site-config.js`](js/site-config.js) — name, catalog, contact
- [`css/brand.css`](css/brand.css) — the five brand tokens

## Stack

Static HTML / CSS / JavaScript. FormSubmit for the waitlist form. No build step.

## Launch

When a domain and inbox are locked: set `brand.siteUrl` and `contact.formAction`, enable GitHub Pages from `main` / repository root, then work through [`CHECKLIST.md`](CHECKLIST.md). Same custom-domain path as the other HTML brand sites (Cloudflare DNS → GitHub Pages).
