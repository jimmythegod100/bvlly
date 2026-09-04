/**
 * Site configuration — BVLLY
 * Clothing brand. Essence from the exotic bully: compact, stubborn, unhurried.
 */
window.SITE_CONFIG = {
  brand: {
    name: 'BVLLY',
    shortName: 'BVLLY',
    logoText: 'B V L L Y',
    tagline: 'Streetwear drawn from the exotic bully.',
    email: 'hello@bvlly.com',
    phone: '',
    address: 'Online',
    siteUrl: '',
    instagram: ''
  },
  hero: {
    kicker: '',
    headline: 'Built from the breed.',
    subhead: 'Oversized heavyweight streetwear. The exotic bully — compact, stubborn, unhurried — is the stance behind the cut, the gothic print, and the small embroidered mark.',
    image: 'images/products/beware-hood-front.png',
    fit: 'contain',
    ctaPrimary: { label: 'Shop the drop', href: 'shop.html' },
    ctaSecondary: { label: 'The mark', href: 'about.html' }
  },
  about: {
    headline: 'Two ways to wear it.',
    intro: 'BVLLY is a clothing label. The line takes its essence from the exotic bully: short, thick, unbothered. That stance shows up in the oversized cut, the silver gothic type, and a small embroidered mark.',
    body: [
      'The Beware line is loud on purpose: Old English type, metallic silver on black, “Bully BEWARE!” on the chest and “Never-mind the dog, beware the owner” on the back.',
      'The Mark line is the other temperature: cream and ink blanks, left-chest embroidery of an exotic bulldog, no slogan. Same stance. Quieter.',
      'Everything is cut oversized — drop shoulder, heavy cotton. This catalog uses the real pieces plus studio mockups of the same drop. Checkout is not live yet; join the list if you want a size.'
    ],
    image: 'images/lookbook/mark-tee-lifestyle.png',
    fit: 'cover'
  },
  collections: [
    {
      id: 'graphic',
      name: 'Beware',
      tagline: 'Gothic print. Metallic silver on black.'
    },
    {
      id: 'mark',
      name: 'The Mark',
      tagline: 'Small embroidered bully. Cream and ink.'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      tagline: 'The mark, off the chest.'
    }
  ],
  products: [
    {
      id: 'beware-hood',
      name: 'Beware Hood',
      collection: 'graphic',
      price: 128,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Ink'],
      description: 'Oversized heavyweight pullover. Front: “Bully BEWARE!” in distressed silver blackletter. Back: “Never-mind the dog, beware the owner.” Drop shoulder, thick hood, rib that holds.',
      image: 'images/products/beware-hood-front.png',
      images: [
        'images/products/beware-hood-front.png',
        'images/products/beware-hood-back.png',
        'images/products/beware-hood-front-mock.png',
        'images/products/beware-hood-back-mock.png'
      ],
      fit: 'contain',
      featured: true
    },
    {
      id: 'beware-tee',
      name: 'Beware Tee',
      collection: 'graphic',
      price: 54,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Ink'],
      description: 'Heavyweight black tee with the same chest print as the hood — “Bully BEWARE!” in distressed silver gothic type. Studio mockup of the graphic line.',
      image: 'images/products/beware-tee-mock.png',
      images: ['images/products/beware-tee-mock.png'],
      fit: 'contain',
      featured: true
    },
    {
      id: 'mark-tee-bone',
      name: 'Mark Tee — Bone',
      collection: 'mark',
      price: 54,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Bone'],
      description: 'Cream heavyweight crew. Small embroidered exotic bulldog on the left chest. No slogan. The quiet half of the drop.',
      image: 'images/lookbook/mark-tee-lifestyle.png',
      images: [
        'images/lookbook/mark-tee-lifestyle.png',
        'images/products/mark-tee-embroidery.png',
        'images/products/mark-tee-bone-mock.png'
      ],
      fit: 'cover',
      featured: true
    },
    {
      id: 'mark-tee-ink',
      name: 'Mark Tee — Ink',
      collection: 'mark',
      price: 54,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Ink'],
      description: 'Black heavyweight crew with the same left-chest bully embroidery in tan and dark thread. Studio mockup of the Mark line.',
      image: 'images/products/mark-tee-ink-mock.png',
      images: ['images/products/mark-tee-ink-mock.png'],
      fit: 'contain',
      featured: true
    },
    {
      id: 'mark-hood-bone',
      name: 'Mark Hood — Bone',
      collection: 'mark',
      price: 118,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Bone'],
      description: 'Oversized cream hoodie. No chest slogan — just the embroidered mark on the left. Studio mockup from the same embroidery.',
      image: 'images/products/mark-hood-bone-mock.png',
      images: ['images/products/mark-hood-bone-mock.png'],
      fit: 'contain',
      featured: true
    },
    {
      id: 'mark-cap',
      name: 'Mark Cap',
      collection: 'accessories',
      price: 38,
      sizes: ['One size'],
      colors: ['Ink'],
      description: 'Structured black cap. Embroidered exotic bulldog on the front panel. Studio mockup of the mark off the chest.',
      image: 'images/products/mark-cap-mock.png',
      images: ['images/products/mark-cap-mock.png'],
      fit: 'contain',
      featured: false
    }
  ],
  contact: {
    formAction: 'https://formsubmit.co/hello@bvlly.com',
    thanksPage: 'thanks.html',
    hours: 'Drop inquiries answered within two business days.'
  },
  seo: {
    description: 'BVLLY — clothing drawn from the exotic bully. Oversized streetwear, gothic Beware prints, and embroidered marks.',
    ogImage: 'images/products/beware-hood-front.png'
  }
};
