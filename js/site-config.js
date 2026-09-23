/**
 * Site configuration — BVLLY
 * Clothing brand. Essence from the exotic bully: compact, stubborn, unhurried.
 *
 * Set brand.siteUrl to the live origin (no trailing slash) before sharing
 * so Open Graph, canonical, sitemap, and the waitlist redirect resolve.
 */
(function () {
  // Bump when lookbook JPGs change so browsers skip stale CDN/disk cache.
  const ASSET_V = '20260923g';

  const COLORWAYS = [
    { name: 'Pink', slug: 'pink', hex: '#e5b3c5' },
    { name: 'Black', slug: 'black', hex: '#111111' }
  ];

  function asset(path) {
    return `${path}?v=${ASSET_V}`;
  }

  function wornColors(id) {
    return COLORWAYS.map((c) => ({
      ...c,
      image: asset(`images/lookbook/${id}-${c.slug}.jpg`)
    }));
  }

  function worn(id, slug) {
    return asset(`images/lookbook/${id}-${slug}.jpg`);
  }

  window.SITE_CONFIG = {
    brand: {
      name: 'BVLLY',
      shortName: 'BVLLY',
      logoText: 'B V L L Y',
      tagline: 'Streetwear drawn from the exotic bully.',
      email: 'hello@bvlly.com',
      phone: '',
      address: 'Online',
      siteUrl: 'https://jimmythegod100.github.io/bvlly',
      instagram: ''
    },
    hero: {
      kicker: '',
      headline: 'Built from the breed.',
      subhead: 'Oversized heavyweight streetwear. The exotic bully — compact, stubborn, unhurried — is the stance behind the cut, the gothic print, and the 1×1″ embroidered mark.',
      mascot: asset('images/brand/bully-mascot.png'),
      image: asset('images/lookbook/hero-mark-hood.jpg'),
      fit: 'cover',
      ctaPrimary: { label: 'Shop the drop', href: 'shop.html' },
      ctaSecondary: { label: 'The mark', href: 'about.html' }
    },
    about: {
      headline: 'Two ways to wear it.',
      intro: 'BVLLY is a clothing label. The line takes its essence from the exotic bully: short, thick, unbothered. That stance shows up in the oversized cut, the silver gothic type, and a 1×1″ embroidered mark.',
      body: [
        'The Beware line is loud on purpose: Old English type on the chest — “Bully BEWARE!” — and “Never-mind the dog, beware the owner” on the back of the hood.',
        'The Mark line is the other temperature: a micro ~1×1″ embroidered exotic bulldog on the left chest (halfway to the underarm, a few inches below the collar), no slogan. Same stance. Quieter.',
        'Every piece runs in pink and black — cut oversized. Checkout is not live yet; join the list if you want a size.'
      ],
      image: worn('mark-tee', 'black'),
      fit: 'cover'
    },
    collections: [
      {
        id: 'graphic',
        name: 'Beware',
        tagline: 'Gothic print. Pink and black.'
      },
      {
        id: 'mark',
        name: 'The Mark',
        tagline: 'Micro ~1×1″ embroidered bully. Left chest. Pink and black.'
      },
      {
        id: 'sets',
        name: 'Sets',
        tagline: 'Matching tops + pants. One SKU.'
      },
      {
        id: 'accessories',
        name: 'Accessories',
        tagline: 'The micro ~1×1″ mark, off the chest. Pink and black.'
      }
    ],
    products: [
      {
        id: 'bb-sweatsuit',
        name: 'BB Sweatsuit',
        collection: 'sets',
        price: 178,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Black', slug: 'black', hex: '#111111', image: worn('bb-sweatsuit', 'black') }
        ],
        views: [
          asset('images/lookbook/bb-sweatsuit-black-thigh.jpg'),
          asset('images/lookbook/bb-sweatsuit-black-ankle.jpg')
        ],
        description: 'Matching black sweatsuit — oversized heavyweight crew + tapered pant, one set. Chest: large silver interlocking BB. Pant: matching BB on the upper thigh, thick rib waistband with black cords and polished silver aglets, outer ankle zip that flares over sneakers. Matte heavyweight fleece. Black.',
        image: worn('bb-sweatsuit', 'black'),
        fit: 'cover',
        featured: true
      },
      {
        id: 'beware-hood',
        name: 'Beware Hood',
        collection: 'graphic',
        price: 128,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Pink', slug: 'pink', hex: '#e5b3c5', image: worn('beware-hood', 'pink') },
          { name: 'Black', slug: 'black', hex: '#111111', image: worn('beware-hood', 'black') }
        ],
        description: 'Oversized heavyweight pullover. Front: “Bully BEWARE!” in distressed blackletter. Back: “Never-mind the dog, beware the owner.” Drop shoulder, thick hood, rib that holds. Pink and black.',
        image: worn('beware-hood', 'black'),
        fit: 'cover',
        featured: true
      },
      {
        id: 'beware-tee',
        name: 'Beware Tee',
        collection: 'graphic',
        price: 54,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: wornColors('beware-tee'),
        description: 'Heavyweight oversized tee with the same chest print as the hood — “Bully BEWARE!” in distressed gothic type. Pink and black.',
        image: worn('beware-tee', 'black'),
        fit: 'cover',
        featured: true
      },
      {
        id: 'mark-tee',
        name: 'Mark Tee',
        collection: 'mark',
        price: 54,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: wornColors('mark-tee'),
        description: 'Heavyweight crew. Micro ~1×1″ embroidered exotic bulldog on the left chest — quiet, not a chest print. No slogan. Pink and black.',
        image: worn('mark-tee', 'black'),
        fit: 'cover',
        featured: true
      },
      {
        id: 'mark-hood',
        name: 'Mark Zip Set',
        collection: 'sets',
        price: 168,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: wornColors('mark-hood'),
        description: 'Matching athletic zip set — long-sleeve full-zip hooded jacket + slim tapered jogger, one SKU. High zip neck, angled zippered hand pockets, technical matte fleece. Quiet Mark: micro ~1×1″ embroidered exotic bulldog on the left chest and matching micro Mark on the left upper thigh. No slogan. Pink and black.',
        image: worn('mark-hood', 'black'),
        fit: 'cover',
        featured: true
      },
      {
        id: 'mark-shorts',
        name: 'Mark Shorts',
        collection: 'mark',
        price: 58,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Graphite', slug: 'graphite', hex: '#4a4d52', image: worn('mark-shorts', 'graphite') },
          { name: 'Black', slug: 'black', hex: '#111111', image: worn('mark-shorts', 'black') }
        ],
        description: 'Athletic mid-thigh shorts in matte jersey. Elastic waist with drawstring, side welt pockets. Micro ~1×1″ embroidered exotic bulldog above the left hem — quiet Mark placement, not a thigh print. Graphite and black.',
        image: worn('mark-shorts', 'graphite'),
        fit: 'cover',
        featured: true
      },
      {
        id: 'mark-cap',
        name: 'Mark Cap',
        collection: 'accessories',
        price: 38,
        sizes: ['One size'],
        colors: wornColors('mark-cap'),
        description: 'Structured cap. Micro ~1×1″ embroidered exotic bulldog centered on the front panel. Pink and black.',
        image: worn('mark-cap', 'black'),
        fit: 'cover',
        featured: false
      }
    ],
    productAliases: {
      'mark-tee-bone': 'mark-tee',
      'mark-tee-ink': 'mark-tee',
      'mark-hood-bone': 'mark-hood'
    },
    contact: {
      formAction: 'https://formsubmit.co/hello@bvlly.com',
      thanksPage: 'thanks.html',
      hours: 'Drop inquiries answered within two business days.'
    },
    seo: {
      description: 'BVLLY — clothing drawn from the exotic bully. Oversized streetwear in pink and black. Gothic Beware prints and embroidered marks.',
      ogImage: asset('images/og.jpg')
    }
  };
})();

window.absoluteUrl = function (path) {
  if (!path) return window.SITE_CONFIG.brand.siteUrl || '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = (window.SITE_CONFIG.brand.siteUrl || '').replace(/\/$/, '');
  const rel = String(path).replace(/^\//, '');
  return base ? `${base}/${rel}` : rel;
};
