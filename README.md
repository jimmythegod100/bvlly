# BVLLY

Static catalog for **BVLLY** — a clothing label whose stance comes from the exotic bully.

Two languages in the drop: gothic **Beware** prints and the quiet embroidered **Mark**. Every piece has four colorways — beige, electric blue, black, army green — photographed on a person.

## Live site (GitHub Pages)

Same path as Vincere Media Works: a public repo, then GitHub Pages.

**URL:** [https://jimmythegod100.github.io/bvlly/](https://jimmythegod100.github.io/bvlly/)

`brand.siteUrl` in [`js/site-config.js`](js/site-config.js) is already set to that origin. After the `bvlly` repo exists on GitHub:

1. Push this branch to `main` on `jimmythegod100/bvlly`.
2. **Settings → Pages → Source: GitHub Actions** (workflow: [`.github/workflows/pages.yml`](.github/workflows/pages.yml)).

Optional custom domain later: Cloudflare DNS → GitHub Pages, then add a `CNAME` file at the repo root.

## Preview locally

```bash
npm run dev
```

Open [http://localhost:43211](http://localhost:43211).

Or:

```bash
python3 dev-server.py
```

## What’s in this draft

- Home with featured pieces, collections, and how the clothes sit
- Shop with collection filters
- Product pages (size selection, color, notify-me)
- About, contact / waitlist, privacy
- Five pieces in `js/site-config.js`, each in four colorways

Checkout is not live. Waitlist uses FormSubmit to `hello@bvlly.com` (placeholder inbox).

## Adding apparel photos later

See [`images/products/README.md`](images/products/README.md). File names match each product `id`. Missing files keep the “Photo coming” slot.

Edit copy, prices, and colors in:

- [`js/site-config.js`](js/site-config.js) — name, catalog, contact, live `siteUrl`
- [`css/brand.css`](css/brand.css) — the five brand tokens

## Stack

Static HTML / CSS / JavaScript. FormSubmit for the waitlist form. No build step.
