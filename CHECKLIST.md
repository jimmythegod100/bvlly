# Launch Checklist — BVLLY

Draft catalog. Revisit when a domain and inbox are locked.

## Content & design

- [x] Brand name BVLLY in header, footer, titles
- [x] Catalog SKUs and prices in `js/site-config.js`
- [x] On-body lookbook photos in five colorways
- [ ] Logo file if a mark exists beyond the letterspaced wordmark
- [ ] Confirm `hello@bvlly.com` is the real inbox
- [ ] Instagram URL

## Pages & links

- [x] Home
- [x] Shop + collection filters
- [x] Product detail (`product.html?id=…`) with selectable size
- [x] Collections
- [x] About
- [x] Contact + thank-you
- [x] Privacy
- [ ] Custom domain + `siteUrl` in config (set to the public origin before sharing unfurls)
- [x] `robots.txt` / `sitemap.xml` (update locs when the live origin changes)

## Contact form

- [ ] FormSubmit email is the real label inbox
- [ ] First production submit activates FormSubmit
- [ ] Redirect lands on `thanks.html` (needs `brand.siteUrl`)

## Mobile

- [x] Header menu on a phone
- [x] Catalog grid readable
- [x] Product page stacks

## After more photos

1. Drop JPEGs into `images/products/` using names in that folder’s README
2. Optional: set `hero.image`, `about.image`, `seo.ogImage` in `js/site-config.js`
3. Refresh — slots swap to photos automatically
