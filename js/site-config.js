/**
 * Site configuration — BVLLY draft.
 * Human streetwear. The miniature exotic bulldog is the mark, not the customer.
 * Drop photos into images/products/.
 */
window.SITE_CONFIG = {
  brand: {
    name: 'BVLLY',
    shortName: 'BVLLY',
    logoText: 'B V L L Y',
    tagline: 'Streetwear marked by the miniature exotic bulldog.',
    email: 'hello@bvlly.com',
    phone: '',
    address: 'Online — ships from the Central Valley, CA',
    siteUrl: '',
    instagram: ''
  },
  hero: {
    kicker: 'Said Bully · Central Valley',
    headline: 'Human clothes. Bully bloodline.',
    subhead: 'Heavyweight hoodies, tees, and outerwear for people. The miniature exotic bulldog is the mark — compact, stubborn, unbothered — not who we dress.',
    image: '',
    ctaPrimary: { label: 'Shop the catalog', href: 'shop.html' },
    ctaSecondary: { label: 'The story', href: 'about.html' }
  },
  about: {
    headline: 'The dog is the mark. You wear the clothes.',
    intro: 'BVLLY — said “Bully” — is a human clothing label. The miniature exotic bulldog sits on the chest, the hood, and the hangtag. The garments are cut for people.',
    body: [
      'The breed is the identity: short, thick, unhurried. We borrow that stance for boxy hoods, heavy cotton, and a small mark that does not need to shout. No costumes. No pet line. If it is in the catalog, a person puts it on.',
      'This draft is the frame for the brand. Product photos, lookbook stills, and final colorways land once apparel media is ready. Until then every piece below is an intended SKU — name, cut, and price — waiting on photography.',
      'First drop is built like a small streetwear house: essentials you live in, outerwear for night, a seasonal jacket, and a few mark accessories.'
    ],
    image: ''
  },
  collections: [
    {
      id: 'essentials',
      name: 'Essentials',
      tagline: 'Daily hoods, tees, and sweats in heavy cotton.'
    },
    {
      id: 'outerwear',
      name: 'Outerwear',
      tagline: 'Bombers, vests, and stadium layers.'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      tagline: 'Caps, totes, and small goods with the mark.'
    },
    {
      id: 'the-drop',
      name: 'The Drop',
      tagline: 'Limited seasonal colorways. Photographed last.'
    }
  ],
  products: [
    {
      id: 'box-hood',
      name: 'Box Hood',
      collection: 'essentials',
      price: 88,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Ink', 'Bone'],
      description: 'Heavyweight fleece hoodie with a square, dropped shoulder. Rib that holds. The BVLLY mark hits small on the chest.',
      image: 'images/products/box-hood.jpg',
      featured: true
    },
    {
      id: 'muscle-tee',
      name: 'Muscle Tee',
      collection: 'essentials',
      price: 42,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Ink', 'Bone', 'Oxblood'],
      description: 'Sleeveless jersey with a dropped armhole. Cut to sit on the body, not cling. Mark at the hem.',
      image: 'images/products/muscle-tee.jpg',
      featured: true
    },
    {
      id: 'mark-tee',
      name: 'Mark Tee',
      collection: 'essentials',
      price: 48,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Ink', 'Stone'],
      description: 'Short-sleeve heavy cotton. Front mark, nothing else. The tee you wear until it looks older than the brand.',
      image: 'images/products/mark-tee.jpg',
      featured: true
    },
    {
      id: 'sunday-sweat',
      name: 'Sunday Sweat',
      collection: 'essentials',
      price: 78,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Bone', 'Charcoal'],
      description: 'Brushed fleece crew. Raglan shoulder, clean neck. No giant print — just weight and the wordmark at the hem.',
      image: 'images/products/sunday-sweat.jpg',
      featured: false
    },
    {
      id: 'practice-tank',
      name: 'Practice Tank',
      collection: 'essentials',
      price: 36,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Ink'],
      description: 'Lightweight tank. Gym, heat, under a bomber. Minimal seam bulk.',
      image: 'images/products/practice-tank.jpg',
      featured: false
    },
    {
      id: 'track-short',
      name: 'Track Short',
      collection: 'essentials',
      price: 54,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Ink', 'Bone'],
      description: 'Split-side short with an elastic waist. Lined. Meant for movement, not a costume silhouette.',
      image: 'images/products/track-short.jpg',
      featured: false
    },
    {
      id: 'crop-bomber',
      name: 'Crop Bomber',
      collection: 'outerwear',
      price: 168,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Ink'],
      description: 'Light bomber, snap placket, elastic hem. Cropped enough to sit over a Box Hood without swallowing it. Lined, not puffy.',
      image: 'images/products/crop-bomber.jpg',
      featured: true
    },
    {
      id: 'quilted-vest',
      name: 'Quilted Vest',
      collection: 'outerwear',
      price: 128,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Ink', 'Olive'],
      description: 'Sleeveless quilt with a high neck. Walk-layer for cold mornings. Mark on the left chest.',
      image: 'images/products/quilted-vest.jpg',
      featured: true
    },
    {
      id: 'stadium-jacket',
      name: 'Stadium Jacket',
      collection: 'the-drop',
      price: 198,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Ink / Gold'],
      description: 'Seasonal shell with contrast binding. Limited colorway — photography lands with the drop.',
      image: 'images/products/stadium-jacket.jpg',
      featured: true
    },
    {
      id: 'logo-cap',
      name: 'Logo Cap',
      collection: 'accessories',
      price: 38,
      sizes: ['One size'],
      colors: ['Ink'],
      description: 'Structured six-panel. Gold mark on black. Adjustable.',
      image: 'images/products/logo-cap.jpg',
      featured: false
    },
    {
      id: 'mark-tote',
      name: 'Mark Tote',
      collection: 'accessories',
      price: 44,
      sizes: ['One size'],
      colors: ['Bone', 'Ink'],
      description: 'Heavy canvas tote. The wordmark on one face. Built to carry a hoodie, not look like merch-table leftover.',
      image: 'images/products/mark-tote.jpg',
      featured: false
    },
    {
      id: 'knit-beanie',
      name: 'Knit Beanie',
      collection: 'accessories',
      price: 32,
      sizes: ['One size'],
      colors: ['Ink', 'Oxblood'],
      description: 'Rib knit beanie. Small embroidered mark. Winter drop staple.',
      image: 'images/products/knit-beanie.jpg',
      featured: false
    }
  ],
  contact: {
    formAction: 'https://formsubmit.co/hello@bvlly.com',
    thanksPage: 'thanks.html',
    hours: 'Drop inquiries answered within two business days.'
  },
  seo: {
    description: 'BVLLY — human streetwear marked by the miniature exotic bulldog. Hoodies, tees, outerwear, and accessories. Draft catalog; product photos coming.',
    ogImage: ''
  }
};
