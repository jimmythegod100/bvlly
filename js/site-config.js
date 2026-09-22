/**
 * Site configuration — BVLLY
 * Clothing brand. Essence from the exotic bully: compact, stubborn, unhurried.
 *
 * Set brand.siteUrl to the live origin (no trailing slash) before sharing
 * so Open Graph, canonical, sitemap, and the waitlist redirect resolve.
 */
(function () {
  const COLORWAYS = [
    { name: 'Pink', slug: 'pink', hex: '#e5b3c5' },
    { name: 'Black', slug: 'black', hex: '#111111' }
  ];

  function wornColors(id) {
    return COLORWAYS.map((c) => ({
      ...c,
      image: `images/lookbook/${id}-${c.slug}.jpg`
    }));
  }

  function worn(id, slug) {
    return `images/lookbook/${id}-${slug}.jpg`;
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
      image: worn('beware-hood', 'black'),
      fit: 'cover',
      ctaPrimary: { label: 'Shop the drop', href: 'shop.html' },
      ctaSecondary: { label: 'The mark', href: 'about.html' }
    },
    about: {
      headline: 'Two ways to wear it.',
      intro: 'BVLLY is a clothing label. The line takes its essence from the exotic bully: short, thick, unbothered. That stance shows up in the oversized cut, the silver gothic type, and a 1×1″ embroidered mark.',
      body: [
        'The Beware line is loud on purpose: Old English type on the chest — “Bully BEWARE!” — and “Never-mind the dog, beware the owner” on the back of the hood.',
        'The Mark line is the other temperature: a 1×1″ embroidered exotic bulldog on the left chest, no slogan. Same stance. Quieter.',
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
        tagline: '1×1″ embroidered bully. Pink and black.'
      },
      {
        id: 'monogram',
        name: 'Monogram',
        tagline: 'Interlocking BB on the chest. Black.'
      },
      {
        id: 'accessories',
        name: 'Accessories',
        tagline: 'The 1×1″ mark, off the chest. Pink and black.'
      }
    ],
    products: [
      {
        id: 'bb-crew',
        name: 'BB Crew',
        collection: 'monogram',
        price: 98,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Black', slug: 'black', hex: '#111111', image: worn('bb-crew', 'black') }
        ],
        views: ['images/lookbook/bb-crew-black-back.jpg'],
        description: 'Oversized heavyweight crewneck. Front: a large silver interlocking BB. Back: a 1×1″ white embroidered bully mark on the upper back, below the collar. Black.',
        image: worn('bb-crew', 'black'),
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
        description: 'Heavyweight crew. 1×1″ embroidered exotic bulldog on the left chest. No slogan. The quiet half of the drop. Pink and black.',
        image: worn('mark-tee', 'black'),
        fit: 'cover',
        featured: true
      },
      {
        id: 'mark-hood',
        name: 'Mark Hood',
        collection: 'mark',
        price: 118,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: wornColors('mark-hood'),
        description: 'Oversized hoodie. No chest slogan — just the 1×1″ embroidered mark on the left chest. Pink and black.',
        image: worn('mark-hood', 'black'),
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
        description: 'Structured cap. 1×1″ embroidered exotic bulldog on the front panel. Pink and black.',
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
      ogImage: 'images/og.jpg'
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
