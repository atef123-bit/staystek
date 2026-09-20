import { Product, Category, StoreSettings, DynamicContent } from '../types';

export const initialSettings: StoreSettings = {
  storeName: "AMIS ATELIER",
  logoText: "AMIS",
  currency: "USD",
  currencySymbol: "$",
  contactEmail: "concierge@amis-atelier.com",
  contactPhone: "+1 (800) 782-9901",
  address: "740 Madison Avenue, New York, NY 10065",
  freeShippingThreshold: 350,
  standardShippingFee: 25,
  expressShippingFee: 65,
  socialLinks: {
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    facebook: "https://facebook.com"
  }
};

export const initialContent: DynamicContent = {
  homepage: {
    announcement: "COMPLIMENTARY GLOBAL EXPRESS SHIPPING ON ORDERS OVER $350 • AUTUMN/WINTER 2026",
    heroTitle: "ARCHITECTURAL MINIMALISM",
    heroSubtitle: "AUTUMN / WINTER 2026 COLLECTION",
    heroDescription: "Rigorous sculptural tailoring, pure monolithic silhouettes, and untreated Italian cashmere engineered for modern elegance.",
    heroButtonText: "DISCOVER COLLECTION",
    heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85",
    heroSecondaryImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=85",
    featuredTitle: "CURATED SELECTION",
    newArrivalsTitle: "NEW ACQUISITIONS",
    offersTitle: "EXCLUSIVES & LIMITED RUNS"
  },
  footer: {
    description: "AMIS is an independent luxury fashion house dedicated to timeless minimalism, architectural silhouettes, and impeccable craftsmanship.",
    shippingText: "Dispatched worldwide via carbon-neutral express courier within 24 hours.",
    returnsText: "Complimentary 30-day global returns with doorstep collection."
  },
  pages: {
    about: "Founded on the principles of modernist architecture and uncompromised craftsmanship, AMIS ATELIER creates enduring garments and leathergoods stripped of superfluous ornamentation. Every seam, edge, and textile is sourced from historic family-owned mills across Biella, Italy and Okayama, Japan.",
    contact: "Our private client concierge is available Monday through Saturday, 9am - 8pm EST to assist with styling inquiries, custom sizing, order dispatch, and private appointments.",
    shipping: "We provide insured express white-glove delivery across over 120 countries worldwide. Orders placed before 2:00 PM EST ship the same business day in signature bespoke recycled matte packaging.",
    returns: "AMIS items may be returned within 30 days of delivery in pristine, unworn condition with all security tags intact. We provide pre-printed return labels and coordinate complimentary courier pickup directly from your address.",
    privacy: "We uphold the strictest data privacy standards. Your personal details, payment tokens, and browsing activities are strictly confidential, encrypted with enterprise-grade SSL, and never traded.",
    terms: "By placing an order with AMIS ATELIER, you enter into a binding purchase agreement governed by international commercial trade law. All product descriptions and pricing are verified in real time.",
    faq: [
      {
        q: "Where are AMIS garments manufactured?",
        a: "All tailoring and knitwear are produced in historic artisanal workshops in Northern Italy, while our structural denim is woven on vintage shuttle looms in Japan."
      },
      {
        q: "How do I choose the correct size?",
        a: "Our silhouettes lean towards relaxed modernist proportions. We suggest selecting your regular size for an architectural drape, or sizing down for a tailored profile. Consult our interactive measurement chart on any product page."
      },
      {
        q: "Are import duties and taxes included at checkout?",
        a: "Yes. All taxes, customs duties, and local clearance fees are fully calculated and included in the final checkout price with zero unexpected delivery fees."
      },
      {
        q: "Can I cancel or amend an order once placed?",
        a: "Orders begin dispatch processing immediately. Please contact our Concierge team within 60 minutes of confirmation if urgent modifications are required."
      }
    ]
  }
};

export const initialCategories: Record<string, Category> = {
  "womenswear": {
    categoryId: "womenswear",
    name: "Womenswear",
    description: "Sculptural outerwear, precision knitwear, and fluid evening tailoring.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    slug: "womenswear",
    isActive: true,
    sortOrder: 1
  },
  "menswear": {
    categoryId: "menswear",
    name: "Menswear",
    description: "Deconstructed wool blazers, relaxed pleated trousers, and pure cashmere overcoats.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    slug: "menswear",
    isActive: true,
    sortOrder: 2
  },
  "leather-goods": {
    categoryId: "leather-goods",
    name: "Leather Goods",
    description: "Saddle-stitched calfskin totes, structured crossbodies, and minimal card wallets.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
    slug: "leather-goods",
    isActive: true,
    sortOrder: 3
  },
  "footwear": {
    categoryId: "footwear",
    name: "Footwear",
    description: "Hand-lasted Chelsea boots, sculptural mules, and refined Goodyear-welted loafers.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
    slug: "footwear",
    isActive: true,
    sortOrder: 4
  },
  "jewelry-timepieces": {
    categoryId: "jewelry-timepieces",
    name: "Jewelry & Objects",
    description: "Brutalist sterling silver cuffs, 18k vermeil rings, and minimal ceramic home objects.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
    slug: "jewelry-timepieces",
    isActive: true,
    sortOrder: 5
  }
};

export const initialProducts: Record<string, Product> = {
  "prod-01": {
    productId: "prod-01",
    name: "Monolithic Double-Breasted Cashmere Coat",
    description: "Sculpted from unblended 680gsm double-faced Italian cashmere, this statement overcoat features dropped raglan shoulders, sharp notch lapels, horn button closures, and hand-finished pick stitching.",
    shortDescription: "Double-faced Italian cashmere overcoat with dropped shoulders.",
    price: 1850,
    oldPrice: 2200,
    discount: 16,
    category: "womenswear",
    categorySlug: "womenswear",
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Obsidian Black", hex: "#111111" },
      { name: "Raw Camel", hex: "#9b7855" },
      { name: "Charcoal Heather", hex: "#2b2b2b" }
    ],
    stock: 8,
    featured: true,
    newArrival: true,
    tags: ["Outerwear", "Cashmere", "Runway", "Winter"],
    rating: 4.9,
    reviewsCount: 38,
    specifications: {
      "Origin": "Florence, Italy",
      "Composition": "100% Italian Double-Faced Cashmere",
      "Lining": "100% Cupro jacquard",
      "Care": "Specialist dry clean only",
      "Fit": "True to size architectural drape"
    },
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12
  },
  "prod-02": {
    productId: "prod-02",
    name: "Brutalist Structured Calfskin Shopper",
    description: "Engineered from full-grain Tuscan vegetable-tanned calfskin with hand-burnished edges. Features an unlined raw suede interior, magnetic gusset closure, and detachable interior zippered pouch.",
    shortDescription: "Tuscan vegetable-tanned calf leather architectural tote.",
    price: 980,
    category: "leather-goods",
    categorySlug: "leather-goods",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Black Noir", hex: "#0a0a0a" },
      { name: "Espresso", hex: "#3b2a24" },
      { name: "Chalk Blanc", hex: "#e5e5e0" }
    ],
    stock: 14,
    featured: true,
    newArrival: false,
    tags: ["Bags", "Leather", "Essentials"],
    rating: 4.8,
    reviewsCount: 42,
    specifications: {
      "Origin": "Scandicci, Italy",
      "Dimensions": "42cm x 34cm x 14cm",
      "Leather": "Grade-A Full Grain Tuscan Calfskin",
      "Hardware": "Brushed Palladium Finish"
    },
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20
  },
  "prod-03": {
    productId: "prod-03",
    name: "Architectural Wool Flannel Blazer",
    description: "Single-breasted relaxed blazer woven from 320gsm Super 130s virgin wool flannel. Features soft canvassed floating construction, notch lapels, horn buttons, and functional sleeve surgeon cuffs.",
    shortDescription: "Super 130s Italian wool flannel single-breasted jacket.",
    price: 1150,
    oldPrice: 1350,
    discount: 15,
    category: "menswear",
    categorySlug: "menswear",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: ["46 / S", "48 / M", "50 / L", "52 / XL"],
    colors: [
      { name: "Midnight Navy", hex: "#151d28" },
      { name: "Anthracite", hex: "#26282b" }
    ],
    stock: 9,
    featured: true,
    newArrival: true,
    tags: ["Tailoring", "Wool", "Suiting"],
    rating: 4.95,
    reviewsCount: 29,
    specifications: {
      "Origin": "Biella, Italy",
      "Cloth": "100% Super 130s Virgin Wool",
      "Canvassing": "Half-canvas horsehair internal structure",
      "Buttons": "Natural Matte Buffalo Horn"
    },
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5
  },
  "prod-04": {
    productId: "prod-04",
    name: "Sculpted Square-Toe Chelsea Boot",
    description: "Constructed with a contemporary chiselled square toe on a stacked leather heel. Crafted from box-calf leather with tonal elasticated side gussets and reinforced nylon pull tabs.",
    shortDescription: "Handmade Italian box-calf square toe Chelsea boot.",
    price: 790,
    category: "footwear",
    categorySlug: "footwear",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: ["40 EU", "41 EU", "42 EU", "43 EU", "44 EU", "45 EU"],
    colors: [
      { name: "Polished Black", hex: "#0c0c0c" },
      { name: "Dark Cordovan", hex: "#2e1a1a" }
    ],
    stock: 12,
    featured: false,
    newArrival: true,
    tags: ["Boots", "Leather", "Footwear"],
    rating: 4.7,
    reviewsCount: 19,
    specifications: {
      "Origin": "Civitanova Marche, Italy",
      "Upper": "100% French Calfskin Box-Leather",
      "Sole": "Goodyear welted leather sole with rubber injected insert",
      "Heel Height": "38mm"
    },
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18
  },
  "prod-05": {
    productId: "prod-05",
    name: "Brutalist Cast Sterling Silver Cuff",
    description: "Individually hand-carved and cast in heavy 925 sterling silver with a dual polished and micro-textured matte finish. Substantial yet ergonomically contoured to sit comfortably on the wrist.",
    shortDescription: "Hand-cast heavy 925 sterling silver structural cuff.",
    price: 520,
    category: "jewelry-timepieces",
    categorySlug: "jewelry-timepieces",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1611591475836-8a0335e9f899?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: ["Small (16cm)", "Medium (18cm)", "Large (20cm)"],
    colors: [
      { name: "Raw Sterling Silver", hex: "#d1d5db" }
    ],
    stock: 7,
    featured: true,
    newArrival: false,
    tags: ["Jewelry", "Silver", "Objects"],
    rating: 5.0,
    reviewsCount: 15,
    specifications: {
      "Material": "Solid 925 Sterling Silver (Weight: 68g)",
      "Finish": "Dual oxidized and brushed matte",
      "Hallmark": "Engraved AMIS 925 atelier seal",
      "Origin": "Arezzo, Italy"
    },
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 35
  },
  "prod-06": {
    productId: "prod-06",
    name: "Fluid Silk-Satin Column Maxi Dress",
    description: "Cut on the bias from 28-momme heavy mulberry silk-satin. Features a low cowl back, high neck with draped scarf collar, and delicate hand-rolled hems that drape effortlessly to the floor.",
    shortDescription: "28-momme heavy silk satin cowl neck column dress.",
    price: 1290,
    category: "womenswear",
    categorySlug: "womenswear",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: ["34 FR", "36 FR", "38 FR", "40 FR"],
    colors: [
      { name: "Onyx Silk", hex: "#0d0d0f" },
      { name: "Pale Oyster", hex: "#e6e4df" },
      { name: "Bronze Olive", hex: "#524b3b" }
    ],
    stock: 5,
    featured: false,
    newArrival: true,
    tags: ["Eveningwear", "Silk", "Dresses"],
    rating: 4.85,
    reviewsCount: 22,
    specifications: {
      "Origin": "Lyon, France",
      "Fabric": "100% Heavy Mulberry Silk Charmeuse (28 momme)",
      "Closure": "Invisible side zipper with hook and eye",
      "Care": "Professional dry clean"
    },
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9
  },
  "prod-07": {
    productId: "prod-07",
    name: "Relaxed Double-Pleat Wide Leg Trouser",
    description: "Tailored with deep architectural front pleats, high-rise waistband with side tab adjusters, and full break hemline. Woven from breathable high-twist tropical wool.",
    shortDescription: "High-twist tropical wool wide leg tailored trousers.",
    price: 640,
    category: "menswear",
    categorySlug: "menswear",
    images: [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: ["46 / S", "48 / M", "50 / L", "52 / XL"],
    colors: [
      { name: "Carbon Grey", hex: "#1f2124" },
      { name: "Taupe Sand", hex: "#8a8074" }
    ],
    stock: 11,
    featured: false,
    newArrival: false,
    tags: ["Trousers", "Tailoring", "Wool"],
    rating: 4.75,
    reviewsCount: 31,
    specifications: {
      "Origin": "Porto, Portugal",
      "Material": "100% High-Twist Tropical Virgin Wool",
      "Waist": "Extended tab with concealed horn button and side adjusters"
    },
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25
  },
  "prod-08": {
    productId: "prod-08",
    name: "Minimalist Boxy Padded Shoulder Bag",
    description: "Sculptural pillow-silhouette crossbody crafted from semi-aniline Nappa lambskin. Accented with custom brushed silver hardware, concealed dual magnetic closure, and microfiber lining.",
    shortDescription: "Semi-aniline Italian Nappa lambskin padded shoulder bag.",
    price: 860,
    oldPrice: 1050,
    discount: 18,
    category: "leather-goods",
    categorySlug: "leather-goods",
    images: [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Jet Black", hex: "#0b0b0c" },
      { name: "Bone White", hex: "#edece8" }
    ],
    stock: 16,
    featured: true,
    newArrival: true,
    tags: ["Bags", "Leather", "Crossbody"],
    rating: 4.9,
    reviewsCount: 27,
    specifications: {
      "Origin": "Bologna, Italy",
      "Leather": "Supple Aniline Italian Lambskin Nappa",
      "Strap": "Adjustable leather shoulder strap (48cm - 58cm drop)"
    },
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3
  }
};
