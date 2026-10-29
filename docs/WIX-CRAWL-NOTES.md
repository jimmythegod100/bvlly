# Wix crawl notes — BVLLY

Source: https://andrewjamesmartine7.wixsite.com/my-site-1  
Crawled: 2026-10-29 (HTML + headless screenshots + DOM text/fonts)

## Sitemap / nav

Primary header (all pages): **HOME · ABOUT · CONTACT · PRIVACY · THANKS · SHOP**  
Right chrome: account (member) icon + shopping bag with cart count.  
Mobile: hamburger + bag + account (no logo in compact header chrome on small viewports).

Footer nav: **HOME · SHOP · COLLECTIONS · ABOUT · CONTACT · PRIVACY**  
(COLLECTIONS is footer-only; Wix has no dedicated `/collections` route — category shop is `/category/all-products`.)

Other Wix routes:
| Path | Role |
|------|------|
| `/` | Home |
| `/about` | About |
| `/contact` | Contact / waitlist form |
| `/privacy` | Data policy |
| `/thanks` | Form thank-you |
| `/category/all-products` | Shop / All Products (Wix Stores) |
| `/product-page/{slug}` | PDP (bb-sweatsuit, beware-hood, beware-tee, mark-tee, mark-zip-set, mark-shorts, mark-cap) |
| `/search` | Store search (Wix Stores) |

## Visual system

- **Ground:** pure black / near-black (`#000`–`#070707`)
- **Text:** cream/white `#F8F3EA` / `#FFFFFF`
- **Muted:** `#9a9388`
- **Chrome / outline CTA:** `#cfc6b8`
- **Primary button fill:** tan/sand ≈ `#cfc6b8` → text `#070707`
- **Accent (email link):** `#b8956a`
- **Borders:** thin white / `#2a2a2a` feature boxes
- **Radius:** 0; no soft cards/shadows
- **Fonts (computed on live Wix):**
  - Display / H1 / section titles: `old-english` → map to **UnifrakturMaguntia**
  - UI / body / nav: **Space Grotesk**
  - About hero title: `makise` (brush/graffiti) → map to **Rock Salt**

Logo lockup in header: **BVLLY** in a bordered box (bold sans, tight tracking). Not letterspaced “B V L L Y” in the Wix header.

## Home

1. Sticky header (logo · nav · account · bag)
2. Hero split: left gold bully mascot + gothic **“Be Bully”** + subhead + **SHOP THE DROP** / **THE MARK**; right portrait / lookbook media (also video reel assets on Wix)
3. **Collections** (gothic H2) + “HOODIES. SHIRTS. SETS. SHORTS” + 4 full-bleed cards (HOODIES / SHIRTS / SETS / SHORTS) each with **EXPLORE**
4. Image carousel / lookbook strip (Wix slider with chevrons)
5. Three bordered notes: **OVERSIZED** · **BEWARE** · **THE ARK**
6. Footer: brand + NAVIGATION + STAY NOTIFIED (email + Join) + `hello@bvlly.com` / BASED ONLINE + draft copyright

No announcement bar on live Wix. No “Featured pieces” product grid on home (shop is separate).

## About

- Hero: brush title **TWO WAYS TO WEAR IT.** + intro paragraph | anthropomorphic bully gym render
- Two bordered columns: gothic **Beware** / **The Mark** with Wix-specific copy
- Shared footer

## Contact

- Info strip: **EMAIL** (gold `hello@bvlly.com`) · **BASED** Online · **HOURS** …
- Gothic **JOIN THE DROP** + waitlist blurb
- Form: Full name, Email, Piece of interest (collection radios: Beware / The Mark / Sets / Accessories), Size, Message

## Privacy

- Gothic **DATA POLICY** + intro
- **INQUIRIES & WAITLIST** / **WHOLESALE & SIZING** sections
- Draft copyright under content

## Thanks

- Centered gothic **YOU'RE ON THE LIST**
- Confirmation sentence
- Tan button **BACK TO THE CATALOG** → shop

## Shop (Wix Stores UI)

- Breadcrumb Home > All Products
- Wide lifestyle banner
- Title **All Products**
- Sidebar: Browse by / ALL PRODUCTS · Filter by / Price range $38–$178
- Grid: 7 products, Sort by Recommended, ADD TO CART affordances on hover/PDP

## Product (Wix Stores UI)

- Thumbnails + large image
- Title, price, color swatches, size boxes, qty
- **ADD TO CART** + **Buy Now** (tan/cream)
- Description + share icons
- Static GitHub Pages cannot run Wix payments — replicate UI; wire actions to waitlist / notify (contact)

## Catalog parity

Same 7 SKUs and prices as GitHub Pages config: BB Sweatsuit $178, Beware Hood $128, Beware Tee $54, Mark Tee $54, Mark Zip Set $168, Mark Shorts $58, Mark Cap $38.

## Gaps vs pixel-perfect Wix

- Wix freemium banners / Harmony chrome omitted
- Wix member login / real cart / checkout / payment not wired
- Wix `makise` / `old-english` proprietary fonts approximated
- Store search, wishlist, side-cart animations approximated
- Hero video autoplay optional; prefer static hero + optional muted reel
