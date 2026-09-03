# BVLLY

Static catalog site for **BVLLY** (said “Bully”) — a clothing label for miniature exotic bulldogs.

This draft follows the HTML client kit used for Valley Notary Services and Vincere Media Works: one `js/site-config.js`, brand tokens in `css/brand.css`, GitHub Pages-ready static files. The brochure kit is stretched into a clothing catalog (shop, collections, product pages). Checkout is not live. Product photos are labeled placeholders until apparel media is dropped in.

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

- Home with featured pieces, collections, and the fit story
- Shop with collection filters
- Product pages (size, color, notify-me)
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
