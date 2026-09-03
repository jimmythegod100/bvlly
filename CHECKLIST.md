# Launch Checklist — BVLLY

Draft site. Revisit this when apparel media lands.

## Content & design

- [x] Brand name BVLLY in header, footer, titles
- [x] Catalog SKUs and prices in `js/site-config.js`
- [ ] Client photos replace “Photo coming” slots
- [ ] Logo file if a mark exists beyond the letterspaced wordmark
- [ ] Confirm `hello@bvlly.com` is the real inbox
- [ ] Instagram URL

## Pages & links

- [x] Home
- [x] Shop + collection filters
- [x] Product detail (`product.html?id=…`)
- [x] Collections
- [x] About
- [x] Contact + thank-you
- [x] Privacy
- [ ] Custom domain + `siteUrl` in config
- [ ] `robots.txt` / `sitemap.xml` with live base URL

## Contact form

- [ ] FormSubmit email is the real label inbox
- [ ] First production submit activates FormSubmit
- [ ] Redirect lands on `thanks.html`

## Mobile

- [ ] Header menu on a phone
- [ ] Catalog grid readable
- [ ] Product page stacks

## After photos

1. Drop files into `images/products/` using names in that folder’s README
2. Optional: set `hero.image`, `about.image`, `seo.ogImage` in `js/site-config.js`
3. Refresh — slots swap to photos automatically
