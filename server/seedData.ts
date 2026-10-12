import { Organization, Store, UserProfile, Brand, Product, Recipe, FeatureDemo, AuditLogItem } from '../src/types/index';

export const SEED_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-reliance-south',
    name: 'Reliance Digital South',
    code: 'RDS-BLR',
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&auto=format&fit=crop&q=80',
    storesCount: 2,
    brandsAllowed: ['brand-morphy-richards', 'brand-bajaj', 'brand-philips'],
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'org-croma-west',
    name: 'Croma Retail West',
    code: 'CR-WEST',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80',
    storesCount: 1,
    brandsAllowed: ['brand-morphy-richards', 'brand-bajaj'],
    createdAt: '2026-02-01T10:00:00Z',
  },
];

export const SEED_STORES: Store[] = [
  {
    id: 'store-indiranagar',
    orgId: 'org-reliance-south',
    name: 'Indiranagar Flagship, Bengaluru',
    code: 'RDS-INDIRA-01',
    city: 'Bengaluru',
    address: '100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    phone: '+91 80 4125 8900',
    currency: 'INR',
    activePromotersCount: 4,
  },
  {
    id: 'store-koramangala',
    orgId: 'org-reliance-south',
    name: 'Koramangala Hub, Bengaluru',
    code: 'RDS-KORA-02',
    city: 'Bengaluru',
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    phone: '+91 80 4150 2233',
    currency: 'INR',
    activePromotersCount: 3,
  },
  {
    id: 'store-croma-mgroad',
    orgId: 'org-croma-west',
    name: 'MG Road Experience Store',
    code: 'CR-MGR-01',
    city: 'Bengaluru',
    address: 'MG Road, Ashok Nagar, Bengaluru, Karnataka 560001',
    phone: '+91 80 2558 7711',
    currency: 'INR',
    activePromotersCount: 2,
  },
];

export const SEED_USERS: UserProfile[] = [
  {
    id: 'user-rahul-promoter',
    name: 'Rahul Sharma',
    email: 'rahul.promoter@reliancedigital.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'promoter',
    orgId: 'org-reliance-south',
    storeId: 'store-indiranagar',
    authorizedBrands: ['brand-morphy-richards', 'brand-bajaj', 'brand-philips'],
  },
  {
    id: 'user-priya-manager',
    name: 'Priya Nair',
    email: 'priya.manager@reliancedigital.in',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'store_manager',
    orgId: 'org-reliance-south',
    storeId: 'store-indiranagar',
    authorizedBrands: ['brand-morphy-richards', 'brand-bajaj', 'brand-philips'],
  },
  {
    id: 'user-vikram-admin',
    name: 'Vikram Malhotra',
    email: 'vikram.admin@reliancedigital.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'org_admin',
    orgId: 'org-reliance-south',
    authorizedBrands: ['brand-morphy-richards', 'brand-bajaj', 'brand-philips'],
  },
  {
    id: 'user-ananya-editor',
    name: 'Ananya Rao',
    email: 'ananya.editor@reliancedigital.in',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'content_editor',
    orgId: 'org-reliance-south',
    authorizedBrands: ['brand-morphy-richards', 'brand-bajaj'],
  },
  {
    id: 'user-platform-admin',
    name: 'Chief Admin',
    email: 'platform.admin@smartsales.internal',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'platform_admin',
    orgId: 'org-reliance-south',
    authorizedBrands: ['brand-morphy-richards', 'brand-bajaj', 'brand-philips'],
  },
];

export const SEED_BRANDS: Brand[] = [
  {
    id: 'brand-morphy-richards',
    name: 'Morphy Richards',
    code: 'MR',
    logo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200&auto=format&fit=crop&q=80',
    country: 'United Kingdom (Marketed by Bajaj Electricals in India)',
    officialWebsite: 'https://www.bajajelectricals.com/brands/morphy-richards',
    description: 'British heritage premium kitchen appliance brand known for modern culinary engineering and design.',
  },
  {
    id: 'brand-bajaj',
    name: 'Bajaj Electricals',
    code: 'BAJAJ',
    logo: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=200&auto=format&fit=crop&q=80',
    country: 'India',
    officialWebsite: 'https://www.bajajelectricals.com',
    description: 'Pioneering Indian home appliances manufacturer with wide sales and service reach.',
  },
  {
    id: 'brand-philips',
    name: 'Philips',
    code: 'PHILIPS',
    logo: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80',
    country: 'Netherlands',
    officialWebsite: 'https://www.philips.co.in/c-m-ho/cooking',
    description: 'Global leader in health technology and home consumer appliances.',
  },
];

// Feature Demonstrations
export const SEED_FEATURE_DEMOS: FeatureDemo[] = [
  {
    id: 'demo-dehydration',
    title: 'Built-in Dehydrator Demonstration',
    category: 'dehydration',
    explanation: 'Low-temperature (45°C - 65°C) uniform convection airflow that gently extracts moisture from fruits, herbs, and vegetables without destroying vitamins.',
    customerBenefit: 'Create preservative-free healthy dried snacks (apple crisps, sun-dried tomatoes, dried herbs) at home for children and health-conscious families.',
    operatingMode: 'Dehydrate Mode (Low Temp + Continuous Convection Fan)',
    recommendedSetting: '55°C for 6 to 8 hours on Wire Grill',
    safetyNotes: 'Always allow dried foods to cool completely before packing in airtight glass containers to prevent condensation and mold growth.',
    officialSource: 'Bajaj Electricals Official 29RCAD Product Manual & Listing',
    demoImages: [
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&auto=format&fit=crop&q=80'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Ingredient Selection & Washing',
        description: 'Pick firm, ripe apples, oranges, or tomatoes. Wash thoroughly and pat completely dry with a clean kitchen towel.',
        image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&auto=format&fit=crop&q=80',
      },
      {
        stepNumber: 2,
        title: 'Uniform Slicing',
        description: 'Slice evenly into 3 mm to 4 mm thickness using a mandoline or sharp knife for even drying time.',
      },
      {
        stepNumber: 3,
        title: 'Arranging on Wire Grill',
        description: 'Place slices in a single layer without overlapping on the included Wire Grill. Keep crumb tray at bottom.',
      },
      {
        stepNumber: 4,
        title: 'Set Dehydrate Preset',
        description: 'Select Dehydrate preset (55°C, 6 hrs). The gentle motorized convection fan operates quietly to circulate dry warm air.',
      },
      {
        stepNumber: 5,
        title: 'Cooling & Crispness Inspection',
        description: 'Remove rack using tray tongs. Cool for 15 minutes. Slice should snap cleanly with zero stickiness.',
      },
      {
        stepNumber: 6,
        title: 'Airtight Storage',
        description: 'Store in airtight sterilized glass jars. Stays fresh and crisp for up to 6 months without chemical preservatives.',
      },
    ],
  },
  {
    id: 'demo-air-fryer',
    title: 'High-Speed Cyclone Air Fryer',
    category: 'air_frying',
    explanation: '2000W rapid top heating combined with high-velocity 360° convection spiral fan and specialized Air Fryer Basket.',
    customerBenefit: 'Gives french fries, samosas, and paneer tikka the crunch of deep frying using up to 90% less oil.',
    operatingMode: 'Air Fry (Top Element High + Max Speed Blower)',
    recommendedSetting: '200°C for 14-18 minutes',
    safetyNotes: 'Use the included tong when removing the hot air fry basket. Place on heat-resistant trivet.',
    officialSource: 'Morphy Richards 29RCAD Specification Sheet',
    demoImages: [
      'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&auto=format&fit=crop&q=80'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Preheat Cavity',
        description: 'Select Air Fry mode and preheat for 3 minutes at 200°C for optimal flash crisping.',
      },
      {
        stepNumber: 2,
        title: 'Load Basket',
        description: 'Arrange marinated paneer cubes or cut potatoes into the mesh Air Fryer basket in a single layer.',
      },
      {
        stepNumber: 3,
        title: 'Mid-Cycle Shake',
        description: 'Pull basket halfway through cooking and give a gentle shake for uniform all-around browning.',
      },
      {
        stepNumber: 4,
        title: 'Gold Finish Result',
        description: 'Enjoy crisp exterior with moist tender interior, with excess fat drained cleanly to the crumb tray.',
      },
    ],
  },
  {
    id: 'demo-rotisserie',
    title: 'Motorized 360° Rotisserie',
    category: 'rotisserie',
    explanation: 'Heavy-duty motorized spit rod turns automatically while top and bottom elements roast meat and whole birds uniformly.',
    customerBenefit: 'Juicy restaurant-style tandoori chicken and roasts where juices continuously self-baste the meat instead of drying out.',
    operatingMode: 'Rotisserie + Convection',
    recommendedSetting: '220°C for 35-45 minutes',
    safetyNotes: 'Secure meat tightly with rotisserie forks. Use special rotisserie tong to hook the rod when taking out.',
    officialSource: 'Morphy Richards 29RCAD Official Features',
    demoImages: [
      'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&auto=format&fit=crop&q=80'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Truss and Mount',
        description: 'Tie whole chicken tightly with kitchen twine and slide the rotisserie rod through the center.',
      },
      {
        stepNumber: 2,
        title: 'Lock Spit Forks',
        description: 'Slide sharp prong forks from both sides and tighten thumbscrews firmly to prevent slipping.',
      },
      {
        stepNumber: 3,
        title: 'Engage Motor Socket',
        description: 'Insert spit end into the motorized drive socket on the right cavity wall; rest other end on left bracket.',
      },
      {
        stepNumber: 4,
        title: 'Place Crumb / Drip Tray',
        description: 'Always slide the crumb tray at bottom level to catch sizzling drippings for easy cleaning.',
      },
    ],
  },
];

// Seed Product 1: The official Morphy Richards 29 RCAD Digital Air Fryer OTG
export const SEED_PRODUCT_29RCAD: Product = {
  id: 'prod-mr-29rcad',
  brandId: 'brand-morphy-richards',
  brandName: 'Morphy Richards',
  name: 'Morphy Richards 29RCAD Digital Air Fryer OTG',
  modelNumber: '29RCAD Digital Air Fryer OTG',
  variant: 'Digital Air Fryer Edition',
  sku: 'MR-29RCAD-2000W-BLK',
  category: 'OTG / Digital Air Fryer OTG',
  capacityLitres: 29,
  wattage: 2000,
  colorFinish: 'Matte Charcoal Black with Rose Gold Accents',
  availabilityStatus: 'in_stock',
  searchAliases: [
    '29rcad',
    'morphy 29 rcad',
    'morphy richards airfryer otg',
    '29 litre otg',
    'digital otg with dehydrator',
    '2000w otg'
  ],
  shortDescription: '29L Digital Air Fryer OTG featuring 2000W heating, 13 preset menus, built-in dehydrator, convection fan, and motorized rotisserie.',
  detailedDescription: 'The Morphy Richards 29RCAD is an all-in-one culinary workstation combining an Oven Toaster Griller, a high-velocity Air Fryer, and a gentle food Dehydrator into a compact 29-litre footprint. Powered by a potent 2000-Watt heating system, it reaches roasting temperatures rapidly and circulates uniform heat through its convection blower.',
  customerExplanation: 'Think of this as your oven, air fryer, tandoor, and fruit dehydrator all in one appliance. It bakes bakery-quality sourdough and cakes, makes french fries with 90% less oil, roasts whole chicken on a rotating rod, and even dries fruits into healthy snacks.',
  keySellingPoints: [
    '4-in-1 Versatility: Full OTG + Cyclone Air Fryer + Fruit Dehydrator + 360° Rotisserie',
    '2000W High-Heat Power: Up to 25% faster preheating compared to standard 1600W OTGs',
    '13 Smart Digital Presets: One-touch cooking for Pizza, Bake, Air Fry, Dehydrate, Rotisserie, Toast & more',
    'Full 7-Piece Accessory Bundle included inside the box with zero hidden costs',
    '2 Years Comprehensive Manufacturer Warranty backed by nationwide Bajaj service'
  ],
  useCases: [
    'Baking 8 to 10-inch party pizzas, artisanal sourdough bread, and celebration cakes',
    'Healthy everyday air-frying of samosas, french fries, and paneer tikka with minimal oil',
    'Dehydrating fresh apples, strawberries, ginger, and herbs for preservative-free pantry snacks',
    'Sunday family roasts with automatic self-basting 360° rotisserie spit'
  ],
  capacityPracticalExamples: 'Holds up to a 10-inch round pizza, a 1.5 kg whole roast chicken on rotisserie, 12 standard cupcake moulds, or 4 bread slices at once.',
  
  // Technical Specifications
  voltage: '220-240V, 50Hz AC',
  temperatureRangeCelsius: '45°C to 230°C (45°C min for Dehydration, 230°C max for Crisp Browning)',
  timerLimitMinutes: 120,
  operatingModes: [
    'Bake',
    'Broil / Grill',
    'Air Fry',
    'Dehydrate',
    'Convection Roast',
    'Rotisserie',
    'Toast',
    'Keep Warm',
    'Defrost',
    'Pizza',
    'Cookies',
    'Bagel',
    'Fermentation'
  ],
  presetMenusCount: 13,
  materialConstruction: 'Galvanized steel cavity with heat-reflective coating and double-glazed tempered glass door',
  warrantyYears: 2,
  warrantyDetails: '2 Years Comprehensive Warranty on Product provided by Bajaj Electricals Limited against manufacturing defects.',
  maintenanceInstructions: 'Slide out crumb tray and wipe with warm damp cloth after each use. Glass door easily cleans with mild detergent. Do not submerge heating elements in water.',
  safetyNotes: 'Exterior surfaces become hot during operation. Maintain minimum 10 cm (4 inches) clearance on sides and rear. Use supplied tongs to handle hot racks.',
  countryOfOrigin: 'China (According to official Bajaj listing)',

  // Dimensions
  externalDimensions: {
    widthMm: 485,
    heightMm: 365,
    depthMm: 410,
  },
  internalCavityDimensions: {
    widthMm: 352,
    heightMm: 260,
    depthMm: 320,
  },
  productWeightKg: 9.8,
  packagingDimensions: {
    widthMm: 540,
    heightMm: 420,
    depthMm: 460,
    weightKg: 11.5,
  },
  measurementSource: 'Official Bajaj Electricals product specification listing sheet & packaging label',
  measurementConfidence: 'manufacturer_spec',
  clearanceGuide: {
    rearMm: 100,
    sidesMm: 100,
    topMm: 150,
    notes: 'Manufacturer guidance requires 100mm (4 inches) rear and side clearance for optimal convection exhaust airflow.',
  },

  // Commercial Pricing
  defaultMrp: 16995,
  defaultSellingPrice: 12490,
  storePrices: {
    'store-indiranagar': {
      storeId: 'store-indiranagar',
      storeName: 'Indiranagar Flagship, Bengaluru',
      mrp: 16995,
      sellingPrice: 11990,
      offerTitle: 'Weekend Floor Fest — Extra ₹500 Instant Cashback',
      discountAmount: 500,
      offerValidTill: '2026-10-31',
      lastUpdated: '2026-10-10T08:30:00Z',
    },
    'store-koramangala': {
      storeId: 'store-koramangala',
      storeName: 'Koramangala Hub, Bengaluru',
      mrp: 16995,
      sellingPrice: 12490,
      offerTitle: 'Complimentary Baking Starter Kit included',
      discountAmount: 0,
      offerValidTill: '2026-10-25',
      lastUpdated: '2026-10-09T14:15:00Z',
    },
  },

  // Traceability & Sources
  verificationStatus: 'Official listing — pending model-label confirmation',
  lastVerifiedDate: '2026-10-10',
  sources: [
    {
      id: 'src-bajaj-official',
      url: 'https://www.bajajelectricals.com/products/29rcad-digital-air-fryer-otg',
      title: 'Official Bajaj Electricals Product Listing: 29RCAD Digital Air Fryer OTG',
      sourceType: 'official_manufacturer_page',
      dateRetrieved: '2026-10-10',
      notes: 'Verified: 29 Litres, 2000W wattage, 13 preset menus, built-in air fryer, dehydrator, rotisserie, China origin, 2yr warranty.',
      confidence: 0.98,
    },
    {
      id: 'src-spec-sheet',
      url: 'https://www.bajajelectricals.com/downloads/manuals/29rcad-user-manual.pdf',
      title: 'Morphy Richards 29RCAD Official User Manual & Dimensions Spec',
      sourceType: 'spec_sheet_pdf',
      dateRetrieved: '2026-10-10',
      notes: 'Cavity internal dimensions (352x260x320mm), clearance requirements (100mm rear/sides), and 7 included accessories confirmed.',
      confidence: 0.95,
    },
  ],
  conflicts: [
    {
      field: 'variant_label',
      sourceA: 'Bajaj Web Page: 29RCAD Digital Air Fryer OTG',
      valueA: '29RCAD Digital Air Fryer OTG',
      sourceB: 'Legacy Retail Box: 29RCAD Digi',
      valueB: '29RCAD Digi',
      resolved: false,
    },
  ],

  // Included Accessories
  accessories: [
    {
      id: 'acc-wire-grill',
      name: 'Wire Grill',
      category: 'Racks',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
      purpose: 'Holds baking tins, pizza pans, toast, and food during dehydration and grilling.',
      usageInstructions: 'Slide into middle slot for baking and grilling. Place crumb tray below.',
      cleaningInstructions: 'Wash with warm soapy water. Do not scrub with abrasive steel wool.',
      isIncludedInBox: true,
      verificationStatus: 'verified',
    },
    {
      id: 'acc-baking-tray',
      name: 'Enamelled Baking Tray',
      category: 'Pans',
      image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&auto=format&fit=crop&q=80',
      purpose: 'For cookies, sheet cakes, roasting vegetables, and catching drippings.',
      usageInstructions: 'Lightly grease or line with parchment paper for effortless release.',
      cleaningInstructions: 'Soak in warm water; non-stick enamel cleans with soft sponge.',
      isIncludedInBox: true,
      verificationStatus: 'verified',
    },
    {
      id: 'acc-air-fryer-basket',
      name: 'Fine Mesh Air Fryer Basket',
      category: 'Air Fryer',
      image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&auto=format&fit=crop&q=80',
      purpose: 'Allows 360-degree superheated airflow around samosas, fries, nuggets, and tikkas.',
      usageInstructions: 'Position in upper or middle cavity rack for maximum air turbulence.',
      cleaningInstructions: 'Dishwasher safe on gentle cycle or soak in warm soapy water.',
      isIncludedInBox: true,
      verificationStatus: 'verified',
    },
    {
      id: 'acc-crumb-tray',
      name: 'Slide-Out Crumb Tray',
      category: 'Maintenance',
      image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&auto=format&fit=crop&q=80',
      purpose: 'Catches bread crumbs and dripping fat from food cooking above.',
      usageInstructions: 'Must always be placed at the very base below the bottom heating tubes.',
      cleaningInstructions: 'Slide out after cooling and wipe down with damp microfiber cloth.',
      isIncludedInBox: true,
      verificationStatus: 'verified',
    },
    {
      id: 'acc-rotisserie-rod',
      name: 'Rotisserie Rod with Twin Forks',
      category: 'Rotisserie',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
      purpose: 'Spears and clamps whole chicken, paneer blocks, or vegetables for 360° rotating roast.',
      usageInstructions: 'Insert drive end into motorized right cavity wall chuck.',
      cleaningInstructions: 'Remove spit forks and wash thoroughly in warm soapy water.',
      isIncludedInBox: true,
      verificationStatus: 'verified',
    },
    {
      id: 'acc-tong-rotisserie',
      name: 'Rotisserie Rod Hook Tong',
      category: 'Tools',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
      purpose: 'Safely lifts and withdraws the scorching hot rotisserie rod from the oven without burns.',
      usageInstructions: 'Hook underneath both ends of the rotating rod simultaneously.',
      cleaningInstructions: 'Wipe clean with a damp cloth.',
      isIncludedInBox: true,
      verificationStatus: 'verified',
    },
    {
      id: 'acc-tong-tray',
      name: 'Tray / Wire Grill Tong',
      category: 'Tools',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
      purpose: 'Securely grips and slides out hot wire grill or baking tray without oven mitts.',
      usageInstructions: 'Clip over front lip of tray or wire rack and pull straight out.',
      cleaningInstructions: 'Wipe clean.',
      isIncludedInBox: true,
      verificationStatus: 'verified',
    },
    {
      id: 'acc-pizza-stone-optional',
      name: 'Cordierite Ceramic Pizza Stone (Optional Add-on)',
      category: 'Optional Accessories',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80',
      purpose: 'Absorbs moisture and gives wood-fired pizzeria blistered bottom crusts to pizzas and breads.',
      usageInstructions: 'Preheat stone on wire grill for 20 minutes before loading pizza.',
      cleaningInstructions: 'Never wash with soap. Scrape clean with spatula and rinse with warm water.',
      isIncludedInBox: false,
      optionalPrice: 1499,
      verificationStatus: 'verified',
    },
  ],

  // Feature Demonstrations
  featureDemos: SEED_FEATURE_DEMOS,

  // Media
  heroImage: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=1200&auto=format&fit=crop&q=80',
  galleryImages: [
    {
      url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=1000&auto=format&fit=crop&q=80',
      caption: 'Morphy Richards 29RCAD Front View with Digital LED Display & Rose Gold Knobs',
      isAuthenticPhoto: true,
      isAiGenerated: false,
    },
    {
      url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=1000&auto=format&fit=crop&q=80',
      caption: 'Spacious 29L Cavity showing Double Element Array & Air Fryer Rack Positioning',
      isAuthenticPhoto: true,
      isAiGenerated: false,
    },
    {
      url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1000&auto=format&fit=crop&q=80',
      caption: 'Crisp Air-Fried Paneer & Vegetables prepared inside the 29RCAD Mesh Basket',
      isAuthenticPhoto: true,
      isAiGenerated: false,
    },
    {
      url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=1000&auto=format&fit=crop&q=80',
      caption: 'Dehydrated Citrus and Apple slices prepared on the gentle 55°C dehydrate preset',
      isAuthenticPhoto: true,
      isAiGenerated: false,
    },
  ],

  // Multilingual translations
  translations: {
    kn: {
      name: 'ಮಾರ್ಫಿ ರಿಚರ್ಡ್ಸ್ 29RCAD ಡಿಜಿಟಲ್ ಏರ್ ಫ್ರೈಯರ್ OTG',
      customerExplanation: 'ಇದು ನಿಮ್ಮ ಅಡುಗೆಮನೆಗೆ ಬೇಕಾದ ಎಲ್ಲವನ್ನೂ ಒಂದೇ ಉಪಕರಣದಲ್ಲಿ ನೀಡುತ್ತದೆ: ಓವನ್, ಏರ್ ಫ್ರೈಯರ್, ತಂದೂರ್ ಮತ್ತು ಹಣ್ಣುಗಳನ್ನು ಒಣಗಿಸುವ ಡಿಹೈಡ್ರೇಟರ್. 2000 ವ್ಯಾಟ್ ಶಕ್ತಿಯೊಂದಿಗೆ ಕೇಕ್, ಪಿಜ್ಜಾ, ಸಮೋಸಾ ಮತ್ತು ರೋಸ್ಟೆಡ್ ಚಿಕನ್ ಅನ್ನು ಅಚ್ಚುಕಟ್ಟಾಗಿ ಸಿದ್ಧಪಡಿಸಬಹುದು.',
      keySellingPoints: [
        '4-ಇನ್-1 ಬಹುಮುಖತೆ: ಪೂರ್ಣ OTG + ಏರ್ ಫ್ರೈಯರ್ + ಡಿಹೈಡ್ರೇಟರ್ + ರೋಟಿಸೆರಿ',
        '2000W ಹೆಚ್ಚಿನ ತಾಪನ ಶಕ್ತಿ: ತ್ವರಿತ ಪ್ರಿಹೀಟಿಂಗ್ ಮತ್ತು ಸಮಾನವಾದ ಅಡುಗೆ',
        '13 ಸ್ಮಾರ್ಟ್ ಡಿಜಿಟಲ್ ಮೆನುಗಳು: ಒಂದೇ ಟ್ಯಾಪ್‌ನಲ್ಲಿ ಸುಲಭ ಬಳಕೆ',
        'ಬಾಕ್ಸ್‌ನಲ್ಲಿ 7 ಪ್ರಮುಖ ಪರಿಕರಗಳು ಉಚಿತವಾಗಿ ಲಭ್ಯ',
        'ಬಜಾಜ್ ಎಲೆಕ್ಟ್ರಿಕಲ್ಸ್ ವತಿಯಿಂದ 2 ವರ್ಷಗಳ ಅಧಿಕೃತ ವಾರಂಟಿ'
      ],
      capacityExamples: '10 ಇಂಚಿನ ಪಾರ್ಟಿ ಪಿಜ್ಜಾ, 1.5 ಕೆಜಿ ಪೂರ್ಣ ರೋಸ್ಟ್ ಚಿಕನ್, ಅಥವಾ 12 ಕಪ್‌ಕೇಕ್‌ಗಳನ್ನು ಸುಲಭವಾಗಿ ಇಡಬಹುದು.',
      commonObjections: [
        {
          objection: '29 ಲೀಟರ್ ಸಾಮರ್ಥ್ಯ ನಮ್ಮ 4 ಸದಸ್ಯರ ಕುಟುಂಬಕ್ಕೆ ಸಾಕಾ?',
          answer: 'ಖಂಡಿತ ಸಾಕು! 29 ಲೀಟರ್ ಒಳಭಾಗದಲ್ಲಿ 10 ಇಂಚಿನ ಪಿಜ್ಜಾ ಅಥವಾ 1.5 ಕೆಜಿ ತೂಕದ ಸಂಪೂರ್ಣ ಕೋಳಿಯನ್ನು ರೋಟಿಸೆರಿಯಲ್ಲಿ ಒಂದೇ ಬಾರಿಗೆ ತಯಾರಿಸಬಹುದು.'
        },
        {
          objection: '2000 ವ್ಯಾಟ್ ಕರೆಂಟ್ ಬಿಲ್ ಹೆಚ್ಚು ಬರುವುದಿಲ್ಲವೇ?',
          answer: '2000 ವ್ಯಾಟ್ ಇರುವುದರಿಂದ ಓವನ್ ಕೇವಲ 3 ನಿಮಿಷಗಳಲ್ಲಿ ಬಿಸಿಯಾಗುತ್ತದೆ. ಬೇಗ ಅಡುಗೆಯಾಗುವುದರಿಂದ ಒಟ್ಟಾರೆ ವಿದ್ಯುತ್ ಬಳಕೆ ಕಡಿಮೆ ಇರುತ್ತದೆ.'
        }
      ],
    },
    hi: {
      name: 'मॉर्फी रिचर्ड्स 29RCAD डिजिटल एयर फ्रायर OTG',
      customerExplanation: 'यह ऑल-इन-वन उपकरण आपके किचन के लिए ओवन, एयर फ्रायर, तंदूर और डिहाइड्रेटर चारों काम करता है। 2000W हाई पावर के साथ आप बिना ज्यादा तेल के क्रिस्पी स्नैक्स, रोस्ट चिकन, केक और पिज्जा आसानी से बना सकते हैं।',
      keySellingPoints: [
        '4-इन-1 तकनीक: OTG + साइक्लोन एयर फ्रायर + फ्रूट डिहाइड्रेटर + मोटराइज्ड रोटिसरी',
        '2000W पावर: पारंपरिक 1600W OTG से 25% तेज कुकिंग',
        '13 डिजिटल प्रीसेट मेनू: पिज्जा, बेक, एयर फ्राई के लिए वन-टच कंट्रोल',
        'बॉक्स के अंदर पूरे 7 जरूरी एक्सेसरीज शामिल',
        'बजाज द्वारा समर्थित 2 साल की भरोसेमंद वारंटी'
      ],
      capacityExamples: '10-इंच का पिज्जा, 1.5 किलो का पूरा चिकन, 12 मफिन या 4 ब्रेड स्लाइस एक साथ बेक कर सकते हैं।',
      commonObjections: [
        {
          objection: 'क्या 29 लीटर 4-5 सदस्यों के परिवार के लिए पर्याप्त है?',
          answer: 'जी हाँ, बिल्कुल! इसमें 10 इंच का बड़ा पिज्जा और 1.5 किलो का पूरा चिकन आसानी से फिट होता है, जो 4 से 6 सदस्यों के लिए उपयुक्त है।'
        },
        {
          objection: 'क्या डिहाइड्रेटर वास्तव में काम करता है?',
          answer: 'हाँ, इसमें 45°C से 65°C का विशेष लो-टेम्परेचर मोड है जो फल, टमाटर और जड़ी-बूटियों को बिना पोषक तत्व नष्ट किए कुरकुरा सुखाता है।'
        }
      ],
    },
  },
};

// Seed Product 2: Morphy Richards 35RCAD Digi OTG (Larger comparison model)
export const SEED_PRODUCT_35RCAD: Product = {
  id: 'prod-mr-35rcad',
  brandId: 'brand-morphy-richards',
  brandName: 'Morphy Richards',
  name: 'Morphy Richards 35RCAD Digi OTG',
  modelNumber: '35RCAD Digi',
  variant: 'Family Grande Digi Edition',
  sku: 'MR-35RCAD-2200W-BLK',
  category: 'OTG / Digital Air Fryer OTG',
  capacityLitres: 35,
  wattage: 2200,
  colorFinish: 'Brushed Slate Gray with Chrome Accents',
  availabilityStatus: 'in_stock',
  searchAliases: ['35rcad', 'morphy 35', '35 litre otg'],
  shortDescription: '35L Large-Capacity Digital Air Fryer OTG with 2200W power, dual-rack baking, and 16 digital preset cooking options.',
  detailedDescription: 'Designed for larger families and passionate bakers, the 35RCAD Digi provides an expansive 35-litre cavity accommodating 12-inch party pizzas and multi-tiered baking trays.',
  customerExplanation: 'Ideal if you regularly bake large cakes, prepare multi-rack meals, or host dinner parties of 6 to 8 people.',
  keySellingPoints: [
    '35L Spacious Capacity: Easily fits 12-inch pizza and 2kg whole roast chicken',
    '2200W Extra Heating Power for dual-tray simultaneous baking',
    'Dual-rack convection airflow with even browning across both tiers',
    '2 Years Comprehensive Warranty'
  ],
  useCases: ['Large batch baking', 'Multi-tier cookies and muffins', 'Large family gatherings'],
  capacityPracticalExamples: 'Fits up to a 12-inch party pizza, a 2.0 kg whole chicken, or 18 cupcakes across two wire racks.',
  voltage: '220-240V, 50Hz AC',
  temperatureRangeCelsius: '40°C to 230°C',
  timerLimitMinutes: 120,
  operatingModes: ['Bake', 'Air Fry', 'Dehydrate', 'Rotisserie', 'Convection', 'Toast', 'Grill', 'Dual-Rack'],
  presetMenusCount: 16,
  materialConstruction: 'Heavy gauge steel with non-stick internal coating',
  warrantyYears: 2,
  warrantyDetails: '2 Years Manufacturer Warranty by Bajaj Electricals',
  maintenanceInstructions: 'Slide out crumb tray and clean cavity with warm sponge.',
  safetyNotes: 'Allow 12 cm clearance on sides and rear.',
  countryOfOrigin: 'China',
  externalDimensions: { widthMm: 535, heightMm: 395, depthMm: 440 },
  internalCavityDimensions: { widthMm: 390, heightMm: 285, depthMm: 350 },
  productWeightKg: 11.4,
  packagingDimensions: { widthMm: 590, heightMm: 450, depthMm: 490, weightKg: 13.5 },
  measurementSource: 'Morphy Richards Official Catalogue',
  measurementConfidence: 'verified',
  clearanceGuide: { rearMm: 120, sidesMm: 120, topMm: 180, notes: 'Allow 120mm clearance on sides and rear.' },
  defaultMrp: 19995,
  defaultSellingPrice: 14990,
  storePrices: {
    'store-indiranagar': {
      storeId: 'store-indiranagar',
      storeName: 'Indiranagar Flagship, Bengaluru',
      mrp: 19995,
      sellingPrice: 14490,
      offerTitle: 'Upgrade Fest Special',
      discountAmount: 500,
      offerValidTill: '2026-10-31',
      lastUpdated: '2026-10-10T08:30:00Z',
    },
  },
  verificationStatus: 'verified',
  lastVerifiedDate: '2026-10-08',
  sources: [
    {
      id: 'src-mr-35-cat',
      url: 'https://www.bajajelectricals.com/products/35rcad-digi-otg',
      title: 'Morphy Richards 35RCAD Digi Catalogue Page',
      sourceType: 'official_manufacturer_page',
      dateRetrieved: '2026-10-08',
      notes: 'Verified 35L, 2200W, 16 presets, dimensions 535x395x440mm.',
      confidence: 0.95,
    },
  ],
  conflicts: [],
  accessories: [],
  featureDemos: [],
  heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
  galleryImages: [],
  translations: {},
};

// Seed Product 3: Philips NA230/00 Airfryer XXL (Comparison Pure Air Fryer)
export const SEED_PRODUCT_PHILIPS_AF: Product = {
  id: 'prod-philips-na230',
  brandId: 'brand-philips',
  brandName: 'Philips',
  name: 'Philips NA230/00 Airfryer XXL 6.2L',
  modelNumber: 'NA230/00',
  sku: 'PH-NA230-1700W',
  category: 'Air Fryer',
  capacityLitres: 6.2,
  wattage: 1700,
  colorFinish: 'Gloss Black with Copper Accents',
  availabilityStatus: 'in_stock',
  searchAliases: ['philips airfryer', 'na230', 'xxl airfryer'],
  shortDescription: '6.2-Litre dedicated Air Fryer with RapidAir technology and transparent cooking window.',
  detailedDescription: 'The Philips NA230/00 is a dedicated high-efficiency basket air fryer featuring a see-through glass window and RapidAir starfish bottom pan design.',
  customerExplanation: 'Great if you strictly want quick small-portion air frying and snacks, but lacks rotisserie spit, large baking tray space, and dehydration capacity.',
  keySellingPoints: [
    'See-through cooking window to monitor browning without opening basket',
    'RapidAir patented starfish design for fast crisping',
    'Dishwasher-safe single pan basket'
  ],
  useCases: ['Quick snacks for 2-3 people', 'Frozen fries', 'Chicken wings'],
  capacityPracticalExamples: 'Holds up to 800g of french fries or 4 chicken drumsticks. Cannot fit 10-inch pizza.',
  voltage: '220-240V, 50Hz AC',
  temperatureRangeCelsius: '80°C to 200°C',
  timerLimitMinutes: 60,
  operatingModes: ['Air Fry', 'Reheat', 'Defrost'],
  presetMenusCount: 12,
  materialConstruction: 'Heat-resistant plastic exterior with non-stick aluminium basket',
  warrantyYears: 2,
  warrantyDetails: '2 Years Philips Worldwide Guarantee',
  maintenanceInstructions: 'Basket is dishwasher safe. Wipe heating element with damp sponge.',
  safetyNotes: 'Keep back vents clear of walls by at least 10 cm.',
  countryOfOrigin: 'China',
  externalDimensions: { widthMm: 310, heightMm: 320, depthMm: 400 },
  productWeightKg: 5.3,
  packagingDimensions: { widthMm: 370, heightMm: 380, depthMm: 440, weightKg: 6.8 },
  measurementSource: 'Philips Official India Product Page',
  measurementConfidence: 'verified',
  clearanceGuide: { rearMm: 100, sidesMm: 100, topMm: 100, notes: 'Allow 100mm rear clearance for exhaust.' },
  defaultMrp: 12995,
  defaultSellingPrice: 9999,
  storePrices: {
    'store-indiranagar': {
      storeId: 'store-indiranagar',
      storeName: 'Indiranagar Flagship, Bengaluru',
      mrp: 12995,
      sellingPrice: 9499,
      offerTitle: 'Philips Festive Discount',
      discountAmount: 500,
      offerValidTill: '2026-10-31',
      lastUpdated: '2026-10-10T08:30:00Z',
    },
  },
  verificationStatus: 'verified',
  lastVerifiedDate: '2026-10-05',
  sources: [],
  conflicts: [],
  accessories: [],
  featureDemos: [],
  heroImage: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=1200&auto=format&fit=crop&q=80',
  galleryImages: [],
  translations: {},
};

// Seed Recipes linked to compatible models
export const SEED_RECIPES: Recipe[] = [
  {
    id: 'recipe-apple-crisps',
    title: 'Cinnamon Spiced Dehydrated Apple Crisps',
    category: 'Dehydrated Fruits',
    finishedImage: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
    prepTimeMinutes: 10,
    cookingTimeMinutes: 360, // 6 hours
    temperatureCelsius: 55,
    operatingMode: 'Dehydrate Mode',
    servings: '4 Pax (Pantry Snack)',
    difficulty: 'Easy',
    compatibleModelNumbers: ['29RCAD Digital Air Fryer OTG', '35RCAD Digi'],
    accessoriesNeeded: ['Wire Grill', 'Slide-Out Crumb Tray'],
    proTips: 'Soak apple slices in lemon water for 2 minutes before drying to prevent oxidation and keep vibrant golden color.',
    safetyInstructions: 'Ensure slices are completely cooled to room temperature before packing into airtight glass jars to prevent condensation.',
    isAiDraft: false,
    isVerified: true,
    ingredients: [
      { name: 'Crisp Red Apples (Fuji or Gala)', quantity: '4 large' },
      { name: 'Ground Ceylon Cinnamon', quantity: '1 tsp' },
      { name: 'Fresh Lemon Juice', quantity: '2 tbsp' },
      { name: 'Filtered Water (for lemon bath)', quantity: '500 ml' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Core the apples and slice uniformly to 3 mm thickness using a mandoline or sharp chef knife.',
        durationMins: 5,
      },
      {
        stepNumber: 2,
        instruction: 'Dip slices in the lemon-water bath for 2 minutes, then blot gently dry with clean paper towels.',
        durationMins: 3,
      },
      {
        stepNumber: 3,
        instruction: 'Arrange apple rings in a single layer on the Wire Grill. Dust very lightly with ground cinnamon.',
        durationMins: 2,
      },
      {
        stepNumber: 4,
        instruction: 'Insert the rack into the middle slot. Set OTG to Dehydrate mode at 55°C for 6 hours.',
        durationMins: 360,
        temperatureC: 55,
        mode: 'Dehydrate',
      },
      {
        stepNumber: 5,
        instruction: 'Check crispness. If slightly flexible, add 1 more hour. Allow to cool completely for 15 minutes to turn shatteringly crisp.',
        durationMins: 15,
      },
    ],
    translations: {
      kn: {
        title: 'ದಾಲ್ಚಿನ್ನಿ ಪರಿಮಳದ ಸೇಬು ಹಣ್ಣಿನ ಡ್ರೈ ಚಿಪ್ಸ್ (ಡಿಹೈಡ್ರೇಟ್)',
        proTips: 'ಸೇಬಿನ ತುಂಡುಗಳನ್ನು ಒಣಗಿಸುವ ಮೊದಲು 2 ನಿಮಿಷ ನಿಂಬೆ ರಸದ ನೀರಿನಲ್ಲಿ ಅದ್ದಿದರೆ ಬಣ್ಣ ಕಪ್ಪಾಗುವುದಿಲ್ಲ.',
        steps: [
          'ಸೇಬಿನ ಬೀಜಗಳನ್ನು ತೆಗೆದು 3 ಮಿ.ಮೀ ದಪ್ಪಕ್ಕೆ ಸಮನಾಗಿ ಕತ್ತರಿಸಿ.',
          'ನಿಂಬೆ ರಸದ ನೀರಿನಲ್ಲಿ ಅದ್ದಿ ಕಾಗದದ ಟವೆಲ್‌ನಿಂದ ಒರೆಸಿ ಒಣಗಿಸಿ.',
          'ವೈರ್ ಗ್ರಿಲ್ ಮೇಲೆ ಒಂದರ ಪಕ್ಕದಲ್ಲಿ ಒಂದನ್ನು ಜೋಡಿಸಿ ದಾಲ್ಚಿನ್ನಿ ಪುಡಿ ಉದುರಿಸಿ.',
          'ಡಿಹೈಡ್ರೇಟ್ ಮೋಡ್‌ನಲ್ಲಿ 55 ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್‌ನಲ್ಲಿ 6 ಗಂಟೆಗಳ ಕಾಲ ಇರಿಸಿ.',
          'ತಣ್ಣಗಾದ ನಂತರ ಗಾಜಿನ ಬಾಟಲಿಯಲ್ಲಿ ಸಂಗ್ರಹಿಸಿ.'
        ]
      },
      hi: {
        title: 'दालचीनी फ्लेवर डिहाइड्रेटेड सेब क्रिस्प्स',
        proTips: 'सेब के स्लाइस को सुखाने से पहले 2 मिनट नींबू पानी में भिगोएँ ताकि उनका रंग काला न पड़े।',
        steps: [
          'सेब को 3 मिमी मोटाई में समान रूप से स्लाइस करें।',
          'नींबू पानी में डुबोकर साफ कपड़े से सुखाएँ।',
          'वायर ग्रिल पर एक परत में बिछाएँ और दालचीनी छिड़कें।',
          'डिहाइड्रेट मोड में 55°C पर 6 घंटे के लिए सेट करें।',
          'पूरी तरह ठंडा होने पर एयरटाइट जार में रखें।'
        ]
      }
    }
  },
  {
    id: 'recipe-paneer-tikka',
    title: 'Restaurant Style Air-Fried Paneer Tikka',
    category: 'Air-Fried Snacks',
    finishedImage: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&auto=format&fit=crop&q=80',
    prepTimeMinutes: 20,
    cookingTimeMinutes: 14,
    temperatureCelsius: 200,
    operatingMode: 'Air Fry Mode',
    servings: '3-4 Pax',
    difficulty: 'Easy',
    compatibleModelNumbers: ['29RCAD Digital Air Fryer OTG', '35RCAD Digi'],
    accessoriesNeeded: ['Air Fryer Basket', 'Tray / Wire Grill Tong', 'Crumb Tray'],
    proTips: 'Lightly mist the paneer with oil spray right before air frying for maximum golden tandoori charring.',
    safetyInstructions: 'Basket handles get extremely hot; always use the provided tong to remove the air fryer basket.',
    isAiDraft: false,
    isVerified: true,
    ingredients: [
      { name: 'Fresh Malai Paneer Cubes', quantity: '350 g' },
      { name: 'Thick Hung Curd (Greek Yogurt)', quantity: '1/2 cup' },
      { name: 'Kashmiri Red Chilli Powder & Garam Masala', quantity: '1 tbsp' },
      { name: 'Ginger-Garlic Paste & Kasuri Methi', quantity: '1 tbsp' },
      { name: 'Bell Peppers & Red Onion Cubes', quantity: '1 cup' },
      { name: 'Mustard Oil (Smoked)', quantity: '1 tbsp' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Whisk hung curd, mustard oil, ginger-garlic paste, kasuri methi, and spices into a thick marinade.',
        durationMins: 5,
      },
      {
        stepNumber: 2,
        instruction: 'Gently coat paneer cubes, bell peppers, and onion petals. Marinate for 15 minutes.',
        durationMins: 15,
      },
      {
        stepNumber: 3,
        instruction: 'Preheat the 29RCAD on Air Fry mode at 200°C for 3 minutes.',
        durationMins: 3,
        temperatureC: 200,
        mode: 'Air Fry',
      },
      {
        stepNumber: 4,
        instruction: 'Arrange paneer and vegetables into the fine-mesh Air Fryer Basket in a single layer. Cook for 12-14 minutes, shaking once at minute 7.',
        durationMins: 14,
        temperatureC: 200,
        mode: 'Air Fry',
      },
      {
        stepNumber: 5,
        instruction: 'Sprinkle chaat masala, lemon juice, and serve hot with mint coriander chutney.',
        durationMins: 2,
      },
    ],
  },
  {
    id: 'recipe-sourdough-garlic-bread',
    title: 'Artisan Cheesy Herb Garlic Bread',
    category: 'Pizza & Bread',
    finishedImage: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800&auto=format&fit=crop&q=80',
    prepTimeMinutes: 10,
    cookingTimeMinutes: 12,
    temperatureCelsius: 190,
    operatingMode: 'Bake + Convection',
    servings: '4 Pax',
    difficulty: 'Easy',
    compatibleModelNumbers: ['29RCAD Digital Air Fryer OTG', '35RCAD Digi'],
    accessoriesNeeded: ['Baking Tray', 'Wire Grill'],
    proTips: 'Using a combination of salted butter and minced fresh garlic roasted together gives supreme aroma.',
    safetyInstructions: 'Baking tray will be hot; always use the tray tong.',
    isAiDraft: false,
    isVerified: true,
    ingredients: [
      { name: 'French Baguette or Sourdough Loaf', quantity: '1 loaf' },
      { name: 'Softened Salted Butter', quantity: '4 tbsp' },
      { name: 'Minced Fresh Garlic & Parsley', quantity: '2 tbsp' },
      { name: 'Grated Mozzarella & Cheddar Cheese', quantity: '1 cup' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Slice the bread into 1-inch diagonal slices, cutting almost through but keeping base intact.',
        durationMins: 3,
      },
      {
        stepNumber: 2,
        instruction: 'Mix softened butter, minced garlic, chili flakes, and fresh parsley. Slather generously between slices.',
        durationMins: 4,
      },
      {
        stepNumber: 3,
        instruction: 'Stuff generous shredded mozzarella between the pockets.',
        durationMins: 3,
      },
      {
        stepNumber: 4,
        instruction: 'Place onto the Enamelled Baking Tray. Bake at 190°C on Convection Bake mode for 10-12 minutes until bubbly and golden.',
        durationMins: 12,
        temperatureC: 190,
        mode: 'Bake + Convection',
      },
    ],
  },
  {
    id: 'recipe-rotisserie-chicken',
    title: 'Tandoori Spiced Whole Rotisserie Roast',
    category: 'Rotisserie Food',
    finishedImage: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&auto=format&fit=crop&q=80',
    prepTimeMinutes: 25,
    cookingTimeMinutes: 42,
    temperatureCelsius: 210,
    operatingMode: 'Rotisserie + Convection',
    servings: '4-5 Pax',
    difficulty: 'Medium',
    compatibleModelNumbers: ['29RCAD Digital Air Fryer OTG', '35RCAD Digi'],
    accessoriesNeeded: ['Rotisserie Rod with Twin Forks', 'Rotisserie Hook Tong', 'Crumb Tray'],
    proTips: 'Truss the chicken wings and legs tightly with kitchen string so they do not touch the heating elements while rotating.',
    safetyInstructions: 'Ensure the motorized spit fork is locked securely before turning on rotation.',
    isAiDraft: false,
    isVerified: true,
    ingredients: [
      { name: 'Whole Chicken (Cleaned & Patted Dry)', quantity: '1.2 kg to 1.4 kg' },
      { name: 'Deggi Mirch, Turmeric & Coriander Powder', quantity: '2 tbsp' },
      { name: 'Lemon Juice & Mustard Oil', quantity: '3 tbsp' },
      { name: 'Ginger-Garlic Paste & Rock Salt', quantity: '2 tbsp' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Score deep incisions across breast and thighs. Rub with lemon juice and salt for 10 minutes.',
        durationMins: 10,
      },
      {
        stepNumber: 2,
        instruction: 'Apply thick spice marinade inside cavity and all over skin. Truss wings and legs tightly with butcher twine.',
        durationMins: 15,
      },
      {
        stepNumber: 3,
        instruction: 'Slide rotisserie rod through center axis. Push sharp twin forks in from both ends and tighten thumb screws firmly.',
        durationMins: 5,
      },
      {
        stepNumber: 4,
        instruction: 'Insert rod into motorized socket. Place crumb tray at bottom. Roast at 210°C with Rotisserie + Convection for 40-45 minutes.',
        durationMins: 45,
        temperatureC: 210,
        mode: 'Rotisserie',
      },
      {
        stepNumber: 5,
        instruction: 'Use rotisserie tong to safely lift the sizzling golden chicken out. Rest 10 minutes before carving.',
        durationMins: 10,
      },
    ],
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-10T08:00:00Z',
    userId: 'user-vikram-admin',
    userName: 'Vikram Malhotra',
    action: 'SEED_PRODUCT_CATALOGUE',
    entityType: 'Product',
    entityId: 'prod-mr-29rcad',
    details: 'Seeded Morphy Richards 29RCAD Digital Air Fryer OTG from official Bajaj Electricals listing with pending confirmation flag.',
  },
  {
    id: 'log-2',
    timestamp: '2026-10-10T08:15:00Z',
    userId: 'user-priya-manager',
    userName: 'Priya Nair',
    action: 'STORE_PRICE_SET',
    entityType: 'StoreProductPrice',
    entityId: 'store-indiranagar',
    details: 'Configured special Indiranagar store discount of ₹500 on 29RCAD Digital Air Fryer OTG.',
  },
];
