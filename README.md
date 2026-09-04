# BVLLY

Static catalog for **BVLLY** — a clothing label whose stance comes from the exotic bully.

Two languages in the drop: gothic **Beware** prints and the quiet embroidered **Mark**. Every piece has four colorways — beige, electric blue, black, army green — photographed on a person.

## Preview locally

```bash
npm run dev
```

Open [http://localhost:43211](http://localhost:43211).

Or:

```bash
python3 -m http.server 43211 --bind 0.0.0.0
```

## Share / GitHub Pages

Same HTML kit path as Valley Notary and Vincere Media Works.

1. Create a public GitHub repo (suggested name: `bvlly`).
2. Push `main` (or merge this branch into `main`).
3. In the repo: **Settings → Pages → Source: GitHub Actions**. The workflow in [`.github/workflows/pages.yml`](.github/workflows/pages.yml) publishes the repository root.
4. Site URL will be `https://<github-user>.github.io/<repo>/`.
5. Put that origin (no trailing slash) in `brand.siteUrl` inside [`js/site-config.js`](js/site-config.js), then update [`robots.txt`](robots.txt) and [`sitemap.xml`](sitemap.xml).

Relative asset paths work on a project site (`username.github.io/bvlly/`) and on a custom domain at the root.

Optional custom domain: Cloudflare DNS → GitHub Pages, then add a `CNAME` file at the repo root.

## What’s in this draft

- Home with featured pieces, collections, and how the clothes sit
- Shop with collection filters
- Product pages (size selection, color, notify-me)
- About, contact / waitlist, privacy
- Six SKUs in `js/site-config.js`

Checkout is not live. Waitlist uses FormSubmit to `hello@bvlly.com` (placeholder inbox).

## Adding apparel photos later

See [`images/products/README.md`](images/products/README.md). File names match each product `id`. Missing files keep the “Photo coming” slot.

Edit copy, prices, and colors in:

- [`js/site-config.js`](js/site-config.js) — name, catalog, contact, live `siteUrl`
- [`css/brand.css`](css/brand.css) — the five brand tokens

## Stack

Static HTML / CSS / JavaScript. FormSubmit for the waitlist form. No build step.
