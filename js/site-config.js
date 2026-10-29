/**
 * Site configuration — BVLLY
 * Matched to https://andrewjamesmartine7.wixsite.com/my-site-1
 */
(function () {
  const ASSET_V = '20261029a';

  const COLORWAYS = [
    { name: 'Pink', slug: 'pink', hex: '#e5b3c5' },
    { name: 'Black', slug: 'black', hex: '#111111' }
  ];

  function asset(path) {
    return `${path}?v=${ASSET_V}`;
  }

  function wixProduct(slug) {
    return asset(`images/wix-clone/products/${slug}.jpg`);
  }

  window.SITE_CONFIG = {
    brand: {
      name: 'BVLLY',
      shortName: 'BVLLY',
      logoText: 'BVLLY',
      logoImage: asset('images/wix-clone/logo/bvlly-logo-nav.jpg'),
      tagline: 'Streetwear drawn from the exotic bully.',
      email: 'hello@bvlly.com',
      phone: '',
      address: 'Online',
      siteUrl: 'https://jimmythegod100.github.io/bvlly',
      instagram: ''
    },
    hero: {
      kicker: '',
      headline: 'Be Bully',
      subhead: 'Oversized heavyweight streetwear. The exotic bully — compact, stubborn, unhurried — is the stance behind the cut, the gothic print, and the 1×1″ embroidered mark.',
      mascot: asset('images/wix-clone/hero/bully-mascot.png'),
      image: asset('images/wix-clone/hero/hero-video-poster.jpg'),
      video: asset('images/wix-clone/hero/hero-video.mp4'),
      fit: 'cover',
      ctaPrimary: { label: 'Shop the drop', href: 'shop.html' },
      ctaSecondary: { label: 'The mark', href: 'about.html' }
    },
    homeCollections: [
      {
        id: 'hoodies',
        name: 'Hoodies',
        href: 'shop.html',
        images: [
          asset('images/wix-clone/collections/hoodies-1.jpg'),
          asset('images/wix-clone/collections/hoodies-2.jpg'),
          wixProduct('beware-hood-pink'),
          wixProduct('mark-zip-black')
        ]
      },
      {
        id: 'shirts',
        name: 'Shirts',
        href: 'shop.html',
        images: [
          asset('images/wix-clone/collections/shirts-1.jpg'),
          asset('images/wix-clone/collections/shirts-2.png'),
          wixProduct('beware-tee-black'),
          wixProduct('mark-tee-black')
        ]
      },
      {
        id: 'sets',
        name: 'Sets',
        href: 'shop.html',
        images: [
          wixProduct('bb-sweatsuit-black'),
          wixProduct('mark-zip-black'),
          wixProduct('mark-zip-pink')
        ]
      },
      {
        id: 'shorts',
        name: 'Shorts',
        href: 'shop.html',
        images: [
          wixProduct('mark-shorts-black'),
          wixProduct('mark-shorts-graphite')
        ]
      }
    ],
    fitNotes: [
      {
        title: 'Oversized',
        body: 'The silhouette from the drop — not a slim fashion tee. Drop shoulder, boxy hood, and heavy cotton. Built for the unbothered stance.'
      },
      {
        title: 'Beware',
        body: "Old English type in distressed silver. Loud on the chest and louder on the back. The gothic print is a declaration of the breed's stance."
      },
      {
        title: 'The Ark',
        body: 'A micro ~1×1″ embroidered exotic bulldog. Left chest. No slogan. The quiet mark of the breed, worn with confidence and purpose.'
      }
    ],
    about: {
      headline: 'Two ways to wear it.',
      intro: 'BVLLY is a clothing label. The line takes its essence from the exotic bully: short, thick, unbothered. That stance shows up in the oversized cut, the silver gothic type, and a 1×1″ embroidered mark.',
      columns: [
        {
          title: 'Beware',
          body: "Loud and unapologetic. The gothic print is a declaration of the breed's stance. Distressed silver typography, heavy cotton, and a stance that refuses to be ignored."
        },
        {
          title: 'The Mark',
          body: 'Quiet and precise. The micro embroidered mark is the signature of the breed. A single ~1×1″ detail on the left chest, a silent reminder of the stance behind the cut.'
        }
      ],
      image: asset('images/wix-clone/about/about-hero.jpg'),
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
        id: 'mark-cap',
        name: 'Mark Cap',
        collection: 'accessories',
        price: 38,
        sizes: ['One size'],
        colors: [
          { name: 'Black', slug: 'black', hex: '#111111', image: wixProduct('mark-cap-black') },
          { name: 'Pink', slug: 'pink', hex: '#e5b3c5', image: wixProduct('mark-cap-pink') }
        ],
        description: 'Structured cap. Micro embroidered exotic bulldog centered on the front panel. Pink and black.',
        image: wixProduct('mark-cap-black'),
        fit: 'cover',
        featured: false,
        shopOrder: 1
      },
      {
        id: 'mark-shorts',
        name: 'Mark Shorts',
        collection: 'mark',
        price: 58,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Black', slug: 'black', hex: '#111111', image: wixProduct('mark-shorts-black') },
          { name: 'Graphite', slug: 'graphite', hex: '#4a4d52', image: wixProduct('mark-shorts-graphite') }
        ],
        description: 'Athletic mid-thigh shorts in matte jersey. Elastic waist with drawstring, side welt pockets. Micro ~1×1″ embroidered exotic bulldog above the left hem. Graphite and black.',
        image: wixProduct('mark-shorts-black'),
        fit: 'cover',
        featured: true,
        shopOrder: 2
      },
      {
        id: 'mark-hood',
        name: 'Mark Zip Set',
        collection: 'sets',
        price: 168,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Black', slug: 'black', hex: '#111111', image: wixProduct('mark-zip-black') },
          { name: 'Pink', slug: 'pink', hex: '#e5b3c5', image: wixProduct('mark-zip-pink') }
        ],
        description: 'Matching athletic zip set — long-sleeve full-zip hooded jacket + slim tapered jogger, one SKU. Micro ~1×1″ embroidered exotic bulldog on the left chest and matching micro Mark on the left upper thigh. No slogan. Pink and black.',
        image: wixProduct('mark-zip-black'),
        fit: 'cover',
        featured: true,
        shopOrder: 3
      },
      {
        id: 'mark-tee',
        name: 'Mark Tee',
        collection: 'mark',
        price: 54,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Black', slug: 'black', hex: '#111111', image: wixProduct('mark-tee-black') },
          { name: 'Pink', slug: 'pink', hex: '#e5b3c5', image: wixProduct('mark-tee-pink') }
        ],
        description: 'Heavyweight crew. Micro ~1×1″ embroidered exotic bulldog on the left chest — quiet, not a chest print. No slogan. Pink and black.',
        image: wixProduct('mark-tee-black'),
        fit: 'cover',
        featured: true,
        shopOrder: 4
      },
      {
        id: 'beware-tee',
        name: 'Beware Tee',
        collection: 'graphic',
        price: 54,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Black', slug: 'black', hex: '#111111', image: wixProduct('beware-tee-black') },
          { name: 'Pink', slug: 'pink', hex: '#e5b3c5', image: wixProduct('beware-tee-pink') }
        ],
        description: 'Heavyweight oversized tee with the chest print “Bully BEWARE!” in distressed gothic type. Pink and black.',
        image: wixProduct('beware-tee-black'),
        fit: 'cover',
        featured: true,
        shopOrder: 5
      },
      {
        id: 'beware-hood',
        name: 'Beware Hood',
        collection: 'graphic',
        price: 128,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Black', slug: 'black', hex: '#111111', image: wixProduct('beware-hood-black') },
          { name: 'Pink', slug: 'pink', hex: '#e5b3c5', image: wixProduct('beware-hood-pink') }
        ],
        description: 'Oversized heavyweight pullover. Front: “Bully BEWARE!” in distressed blackletter. Back: “Never-mind the dog, beware the owner.” Drop shoulder, thick hood, rib that holds. Pink and black.',
        image: wixProduct('beware-hood-black'),
        fit: 'cover',
        featured: true,
        shopOrder: 6
      },
      {
        id: 'bb-sweatsuit',
        name: 'BB Sweatsuit',
        collection: 'sets',
        price: 178,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Black', slug: 'black', hex: '#111111', image: wixProduct('bb-sweatsuit-black') }
        ],
        description: 'Matching black sweatsuit — oversized heavyweight crew + tapered pant, one set. Chest: large silver interlocking BB. Pant: matching BB on the upper thigh. Matte heavyweight fleece. Black.',
        image: wixProduct('bb-sweatsuit-black'),
        fit: 'cover',
        featured: true,
        shopOrder: 7
      }
    ],
    productAliases: {
      'mark-tee-bone': 'mark-tee',
      'mark-tee-ink': 'mark-tee',
      'mark-hood-bone': 'mark-hood',
      'mark-zip-set': 'mark-hood'
    },
    contact: {
      formAction: 'https://formsubmit.co/hello@bvlly.com',
      thanksPage: 'thanks.html',
      hours: 'Drop inquiries answered within two business days.'
    },
    seo: {
      description: 'BVLLY — clothing drawn from the exotic bully. Oversized streetwear in pink and black. Gothic Beware prints and embroidered marks.',
      ogImage: asset('images/og.jpg')
    },
    shopBanner: asset('images/wix-clone/products/shop-banner.jpg')
  };
})();

window.absoluteUrl = function (path) {
  if (!path) return window.SITE_CONFIG.brand.siteUrl || '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = (window.SITE_CONFIG.brand.siteUrl || '').replace(/\/$/, '');
  const rel = String(path).replace(/^\//, '');
  return base ? `${base}/${rel}` : rel;
};
