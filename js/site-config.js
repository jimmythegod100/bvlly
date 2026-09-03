/**
 * Site configuration — BVLLY draft.
 * Swap copy, prices, and image paths here. Drop photos into images/products/.
 */
window.SITE_CONFIG = {
  brand: {
    name: 'BVLLY',
    shortName: 'BVLLY',
    logoText: 'B V L L Y',
    tagline: 'Apparel for miniature exotic bulldogs.',
    email: 'hello@bvlly.com',
    phone: '',
    address: 'Online — ships from the Central Valley, CA',
    siteUrl: '',
    instagram: ''
  },
  hero: {
    kicker: 'Miniature exotic · chest-first cut',
    headline: 'Cut for the compact bully.',
    subhead: 'Heavyweight hoodies, walk tees, and outerwear sized for miniature exotic bulldogs — short back, wide chest, no costume fit.',
    image: '',
    ctaPrimary: { label: 'Shop the catalog', href: 'shop.html' },
    ctaSecondary: { label: 'The story', href: 'about.html' }
  },
  about: {
    headline: 'Built around the dog, not a costume.',
    intro: 'BVLLY — said “Bully” — is a clothing label for miniature exotic bulldogs. We start with the frame: compact, muscular, short-backed. Then we cut clothes that actually sit on it.',
    body: [
      'Generic pet apparel is graded from long-backed dogs. On a miniature exotic, that means extra length, a floating chest, and sleeves that do nothing. Our blocks are chest-first. Necks are wider. Back lengths are shorter. Hardware is sized so a walk harness can sit over a hoodie without fighting the fabric.',
      'This draft site is the frame for the brand. Product photos, lookbook stills, and final colorways land once apparel media is ready. Until then, every piece below is a real intended SKU — name, cut, and price — waiting on photography.',
      'We are not a costume shop. No capes, no cartoon prints as the main line. The clothes should look like a small streetwear label that happens to dress a bully.'
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
      tagline: 'Vests, bombers, and stadium layers for short walks and long sits.'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      tagline: 'Bandanas, collars, and harnesses that match the clothes.'
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
      price: 78,
      sizes: ['XXS', 'XS', 'S', 'M'],
      colors: ['Ink', 'Bone'],
      description: 'A cropped, square hoodie with a wide collar and short saddle. Cut to sit at the last rib on a compact bully, not mid-loin.',
      image: 'images/products/box-hood.jpg',
      featured: true
    },
    {
      id: 'muscle-tee',
      name: 'Muscle Tee',
      collection: 'essentials',
      price: 42,
      sizes: ['XXS', 'XS', 'S', 'M'],
      colors: ['Ink', 'Bone', 'Oxblood'],
      description: 'Sleeveless cotton jersey with a dropped armhole so the chest can actually fill the cloth. Hem hits above the tuck.',
      image: 'images/products/muscle-tee.jpg',
      featured: true
    },
    {
      id: 'everyday-walk-tee',
      name: 'Everyday Walk Tee',
      collection: 'essentials',
      price: 38,
      sizes: ['XXS', 'XS', 'S', 'M'],
      colors: ['Ink', 'Stone'],
      description: 'Short-sleeve tee with a harness gap at the withers. Meant to live under a lead, not just for photos.',
      image: 'images/products/everyday-walk-tee.jpg',
      featured: true
    },
    {
      id: 'sunday-sweat',
      name: 'Sunday Sweat',
      collection: 'essentials',
      price: 72,
      sizes: ['XXS', 'XS', 'S', 'M'],
      colors: ['Bone', 'Charcoal'],
      description: 'Brushed fleece crew. Raglan shoulder so it clears the neck roll. Rib that does not ride up on a deep chest.',
      image: 'images/products/sunday-sweat.jpg',
      featured: false
    },
    {
      id: 'practice-tank',
      name: 'Practice Tank',
      collection: 'essentials',
      price: 34,
      sizes: ['XXS', 'XS', 'S', 'M'],
      colors: ['Ink'],
      description: 'Lightweight tank for warm days and crate rest. Minimal seam bulk under a harness.',
      image: 'images/products/practice-tank.jpg',
      featured: false
    },
    {
      id: 'track-short',
      name: 'Track Short',
      collection: 'essentials',
      price: 48,
      sizes: ['XXS', 'XS', 'S', 'M'],
      colors: ['Ink', 'Bone'],
      description: 'Split-side short for dogs that still have a waist. Elastic that sits behind the rib, not on the belly.',
      image: 'images/products/track-short.jpg',
      featured: false
    },
    {
      id: 'crop-bomber',
      name: 'Crop Bomber',
      collection: 'outerwear',
      price: 128,
      sizes: ['XXS', 'XS', 'S', 'M'],
      colors: ['Ink'],
      description: 'Light bomber with a snap placket and elastic hem. Cropped so the tail set stays clear. Lined, not puffy.',
      image: 'images/products/crop-bomber.jpg',
      featured: true
    },
    {
      id: 'quilted-vest',
      name: 'Quilted Vest',
      collection: 'outerwear',
      price: 96,
      sizes: ['XXS', 'XS', 'S', 'M'],
      colors: ['Ink', 'Olive'],
      description: 'Sleeveless quilt with a high neck and belly panel that actually covers a wide chest. Walk-layer, not a snowsuit.',
      image: 'images/products/quilted-vest.jpg',
      featured: true
    },
    {
      id: 'stadium-jacket',
      name: 'Stadium Jacket',
      collection: 'the-drop',
      price: 148,
      sizes: ['XS', 'S', 'M'],
      colors: ['Ink / Gold'],
      description: 'Seasonal shell with contrast binding. Limited colorway — photography lands with the drop.',
      image: 'images/products/stadium-jacket.jpg',
      featured: true
    },
    {
      id: 'knit-bandana',
      name: 'Knit Bandana',
      collection: 'accessories',
      price: 24,
      sizes: ['One size'],
      colors: ['Bone', 'Oxblood'],
      description: 'Cotton knit triangle. Ties at the nape. Meant to sit with the Box Hood, not fight it.',
      image: 'images/products/knit-bandana.jpg',
      featured: false
    },
    {
      id: 'logo-harness',
      name: 'Logo Harness',
      collection: 'accessories',
      price: 64,
      sizes: ['XXS', 'XS', 'S', 'M'],
      colors: ['Ink'],
      description: 'Chest-plate harness with a wide front so it does not pinch a bully neck. Hardware sits off the throat.',
      image: 'images/products/logo-harness.jpg',
      featured: false
    },
    {
      id: 'night-collar',
      name: 'Night Collar',
      collection: 'accessories',
      price: 36,
      sizes: ['XXS', 'XS', 'S', 'M'],
      colors: ['Ink'],
      description: 'Short, wide collar for a thick neck. No dangling tags that bounce on a short gait.',
      image: 'images/products/night-collar.jpg',
      featured: false
    }
  ],
  contact: {
    formAction: 'https://formsubmit.co/hello@bvlly.com',
    thanksPage: 'thanks.html',
    hours: 'Drop inquiries answered within two business days.'
  },
  seo: {
    description: 'BVLLY — clothing for miniature exotic bulldogs. Chest-first hoodies, tees, outerwear, and accessories. Draft catalog; product photos coming.',
    ogImage: ''
  }
};
