import { LanguageCode } from '../types/index';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  tagline: string;
  nav: {
    home: string;
    products: string;
    recipes: string;
    compare: string;
    aiAssistant: string;
    catalogue: string;
    settings: string;
  };
  roles: {
    platform_admin: string;
    org_admin: string;
    store_manager: string;
    promoter: string;
    content_editor: string;
  };
  presentation: {
    enterShowroom: string;
    exitShowroom: string;
    customerMode: string;
    whatsInTheBox: string;
    includedInBox: string;
    optionalAddon: string;
    visualDemos: string;
    recipesTitle: string;
    capacityGuide: string;
    dimensionsFit: string;
    clearanceNotes: string;
    warrantyBadge: string;
    powerBadge: string;
    presetsBadge: string;
    switchLanguage: string;
    fitCounterCheck: string;
  };
  common: {
    search: string;
    filter: string;
    all: string;
    save: string;
    cancel: string;
    edit: string;
    view: string;
    compare: string;
    verified: string;
    pendingConfirmation: string;
    unverified: string;
    dimensions: string;
    mrp: string;
    ourPrice: string;
    saveOffer: string;
    offlineMode: string;
    synced: string;
    installApp: string;
    switchUser: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    quickPrompts: string;
    askPlaceholder: string;
    send: string;
    disclaimer: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: 'Smart Sales Promoter',
    appSubtitle: 'Retail Appliance Showroom & AI Platform',
    tagline: 'Show customers instead of merely telling them.',
    nav: {
      home: 'Home',
      products: 'Products',
      recipes: 'Recipes',
      compare: 'Compare',
      aiAssistant: 'AI Floor Assistant',
      catalogue: 'Catalogue',
      settings: 'Settings',
    },
    roles: {
      platform_admin: 'Platform Admin',
      org_admin: 'Organization Admin',
      store_manager: 'Store Manager',
      promoter: 'Sales Promoter',
      content_editor: 'Content Editor',
    },
    presentation: {
      enterShowroom: 'Customer Presentation Mode',
      exitShowroom: 'Exit Presentation Mode',
      customerMode: 'Customer Showroom Mode',
      whatsInTheBox: "What's in the Box?",
      includedInBox: 'Included in Box',
      optionalAddon: 'Optional Accessory',
      visualDemos: 'Live Capability Demonstrations',
      recipesTitle: 'Delicious Possibilities in this Appliance',
      capacityGuide: 'Practical Capacity Guide',
      dimensionsFit: 'External Dimensions & Counter Fit',
      clearanceNotes: 'Manufacturer Clearance Guidelines',
      warrantyBadge: '2 Years Comprehensive Warranty',
      powerBadge: '2000W High-Heat Power',
      presetsBadge: '13 Smart Presets',
      switchLanguage: 'Language',
      fitCounterCheck: 'Standard Kitchen Counter Fit (60 cm depth)',
    },
    common: {
      search: 'Search models, capacities, brands...',
      filter: 'Filter',
      all: 'All Categories',
      save: 'Save Changes',
      cancel: 'Cancel',
      edit: 'Edit',
      view: 'View Details',
      compare: 'Compare',
      verified: 'Verified Spec',
      pendingConfirmation: 'Official Listing — Pending Label Check',
      unverified: 'Unverified Draft',
      dimensions: 'Dimensions',
      mrp: 'MRP',
      ourPrice: 'Offer Price',
      saveOffer: 'Save Special Offer',
      offlineMode: 'Offline Mode (Cached)',
      synced: 'Cloud Synced',
      installApp: 'Install Floor App',
      switchUser: 'Switch User / Store',
    },
    assistant: {
      title: 'AI Sales Floor Assistant',
      subtitle: 'Instant technical pitches, objection handling, and regional language translations grounded in verified specs.',
      quickPrompts: 'Floor Prompt Shortcuts',
      askPlaceholder: 'Ask about capacity, pitch script, comparison, or objection...',
      send: 'Ask Assistant',
      disclaimer: 'Grounded strictly on authorized catalogue specifications. No fabricated warranty or power claims.',
    },
  },
  kn: {
    appName: 'ಸ್ಮಾರ್ಟ್ ಸೇಲ್ಸ್ ಪ್ರವರ್ತಕ',
    appSubtitle: 'ಉಪಕರಣಗಳ ಶೋರೂಮ್ ಮತ್ತು AI ವೇದಿಕೆ',
    tagline: 'ಗ್ರಾಹಕರಿಗೆ ಹೇಳುವ ಬದಲು ನೇರವಾಗಿ ತೋರಿಸಿ.',
    nav: {
      home: 'ಮುಖಪುಟ',
      products: 'ಉತ್ಪನ್ನಗಳು',
      recipes: 'ಅಡುಗೆಗಳು',
      compare: 'ಹೋಲಿಕೆ',
      aiAssistant: 'AI ಸಹಾಯಕ',
      catalogue: 'ಕ್ಯಾಟಲಾಗ್',
      settings: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
    },
    roles: {
      platform_admin: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ನಿರ್ವಾಹಕ',
      org_admin: 'ಸಂಸ್ಥೆಯ ನಿರ್ವಾಹಕ',
      store_manager: 'ಸ್ಟೋರ್ ಮ್ಯಾನೇಜರ್',
      promoter: 'ಸೇಲ್ಸ್ ಪ್ರವರ್ತಕ',
      content_editor: 'ವಿಷಯ ಸಂಪಾದಕ',
    },
    presentation: {
      enterShowroom: 'ಗ್ರಾಹಕರ ಪ್ರಸ್ತುತಿ ಮೋಡ್',
      exitShowroom: 'ಪ್ರಸ್ತುತಿಯಿಂದ ನಿರ್ಗಮಿಸಿ',
      customerMode: 'ಗ್ರಾಹಕರ ಶೋರೂಮ್ ಮೋಡ್',
      whatsInTheBox: 'ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಏನಿದೆ?',
      includedInBox: 'ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಲಭ್ಯ',
      optionalAddon: 'ಐಚ್ಛಿಕ ಪರಿಕರ',
      visualDemos: 'ನೇರ ಸಾಮರ್ಥ್ಯ ಪ್ರಾತ್ಯಕ್ಷಿಕೆಗಳು',
      recipesTitle: 'ಈ ಉಪಕರಣದಲ್ಲಿ ತಯಾರಿಸಬಹುದಾದ ತಿನಿಸುಗಳು',
      capacityGuide: 'ಪ್ರಾಯೋಗಿಕ ಸಾಮರ್ಥ್ಯ ಮಾರ್ಗದರ್ಶಿ',
      dimensionsFit: 'ಅಳತೆಗಳು ಮತ್ತು ಅಡುಗೆಮನೆ ಸ್ಥಳ',
      clearanceNotes: 'ತಯಾರಕರ ಸುರಕ್ಷತಾ ಅಂತರ ನಿಯಮಗಳು',
      warrantyBadge: '2 ವರ್ಷಗಳ ಸಂಪೂರ್ಣ ವಾರಂಟಿ',
      powerBadge: '2000W ಹೆಚ್ಚಿನ ತಾಪನ ಶಕ್ತಿ',
      presetsBadge: '13 ಸ್ಮಾರ್ಟ್ ಮೆನುಗಳು',
      switchLanguage: 'ಭಾಷೆ',
      fitCounterCheck: 'ಪ್ರಮಾಣಿತ ಅಡುಗೆಮನೆ ಸ್ಲ್ಯಾಬ್ ಹೊಂದಾಣಿಕೆ (60 ಸೆಂ.ಮೀ)',
    },
    common: {
      search: 'ಮಾದರಿಗಳು, ಬ್ರ್ಯಾಂಡ್‌ಗಳನ್ನು ಹುಡುಕಿ...',
      filter: 'ಫಿಲ್ಟರ್',
      all: 'ಎಲ್ಲಾ ವಿಭಾಗಗಳು',
      save: 'ಉಳಿಸಿ',
      cancel: 'ರದ್ದುಮಾಡಿ',
      edit: 'ತಿದ್ದು',
      view: 'ವಿವರಗಳನ್ನು ನೋಡಿ',
      compare: 'ಹೋಲಿಕೆ ಮಾಡಿ',
      verified: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ',
      pendingConfirmation: 'ಅಧಿಕೃತ ಪಟ್ಟಿ — ದೃಢೀಕರಣ ಬಾಕಿ ಇದೆ',
      unverified: 'ಅಪೂರ್ಣ ಕರಡು',
      dimensions: 'ಅಳತೆಗಳು',
      mrp: 'ಗರಿಷ್ಠ ಬೆಲೆ (MRP)',
      ourPrice: 'ಆಫರ್ ಬೆಲೆ',
      saveOffer: 'ಆಫರ್ ಉಳಿಸಿ',
      offlineMode: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ (ಕ್ಯಾಶ್ ಮಾಡಲಾಗಿದೆ)',
      synced: 'ಕ್ಲೌಡ್ ಸಿಂಕ್ ಆಗಿದೆ',
      installApp: 'ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ',
      switchUser: 'ಬಳಕೆದಾರ / ಅಂಗಡಿ ಬದಲಾಯಿಸಿ',
    },
    assistant: {
      title: 'AI ಸೇಲ್ಸ್ ಫ್ಲೋರ್ ಸಹಾಯಕ',
      subtitle: 'ತಾಂತ್ರಿಕ ವಿವರಣೆಗಳು, ಗ್ರಾಹಕರ ಅನುಮಾನ ಪರಿಹಾರ ಮತ್ತು ಕನ್ನಡದಲ್ಲಿ ತ್ವರಿತ ಸೇಲ್ಸ್ ಪಿಚ್.',
      quickPrompts: 'ಪ್ರಮುಖ ಪ್ರಶ್ನೆಗಳು',
      askPlaceholder: 'ಸಾಮರ್ಥ್ಯ, ಆಕ್ಷೇಪಣೆ ಅಥವಾ ಹೋಲಿಕೆ ಬಗ್ಗೆ ಕೇಳಿ...',
      send: 'ಕೇಳಿ',
      disclaimer: 'ದೃಢೀಕರಿಸಿದ ಕ್ಯಾಟಲಾಗ್ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ ಮಾತ್ರ ಉತ್ತರಿಸಲಾಗುತ್ತದೆ.',
    },
  },
  hi: {
    appName: 'स्मार्ट सेल्स प्रमोटर',
    appSubtitle: 'अप्लायंस शोरूम एवं AI प्लेटफॉर्म',
    tagline: 'ग्राहकों को केवल बताने के बजाय सीधे दिखाएं।',
    nav: {
      home: 'होम',
      products: 'उत्पाद',
      recipes: 'रेसिपीज',
      compare: 'तुलना करें',
      aiAssistant: 'AI असिस्टेंट',
      catalogue: 'कैटलॉग',
      settings: 'सेटिंग्स',
    },
    roles: {
      platform_admin: 'प्लेटफ़ॉर्म एडमिन',
      org_admin: 'संस्था एडमिन',
      store_manager: 'स्टोर मैनेजर',
      promoter: 'सेल्स प्रमोटर',
      content_editor: 'कंटेंट एडिटर',
    },
    presentation: {
      enterShowroom: 'ग्राहक प्रेजेंटेशन मोड',
      exitShowroom: 'प्रेजेंटेशन से बाहर निकलें',
      customerMode: 'कस्टमर शोरूम मोड',
      whatsInTheBox: 'बॉक्स में क्या मिलेगा?',
      includedInBox: 'बॉक्स में शामिल',
      optionalAddon: 'अतिरिक्त एक्सेसरी',
      visualDemos: 'लाइव कुकिंग क्षमता का प्रदर्शन',
      recipesTitle: 'इस अप्लायंस में बनने वाली स्वादिष्ट डिशेज',
      capacityGuide: 'प्रैक्टिकल कैपेसिटी गाइड',
      dimensionsFit: 'साइज और किचन काउंटर फिट',
      clearanceNotes: 'निर्माता द्वारा निर्धारित सुरक्षा दूरी',
      warrantyBadge: '2 साल की व्यापक वारंटी',
      powerBadge: '2000W हाई-हीट पावर',
      presetsBadge: '13 डिजिटल प्रीसेट',
      switchLanguage: 'भाषा',
      fitCounterCheck: 'मानक किचन स्लैब फिट (60 सेमी गहराई)',
    },
    common: {
      search: 'मॉडल, क्षमता या ब्रांड खोजें...',
      filter: 'फ़िल्टर',
      all: 'सभी श्रेणियां',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      edit: 'संपादित करें',
      view: 'विवरण देखें',
      compare: 'तुलना करें',
      verified: 'सत्यापित विवरण',
      pendingConfirmation: 'आधिकारिक लिस्टिंग — पुष्टि लंबित',
      unverified: 'असत्यापित ड्राफ्ट',
      dimensions: 'आयाम (साइज)',
      mrp: 'MRP',
      ourPrice: 'ऑफर मूल्य',
      saveOffer: 'ऑफर सहेजें',
      offlineMode: 'ऑफ़लाइन मोड (कैश्ड)',
      synced: 'क्लाउड सिंक',
      installApp: 'ऐप इंस्टॉल करें',
      switchUser: 'यूजर / स्टोर बदलें',
    },
    assistant: {
      title: 'AI सेल्स फ्लोर असिस्टेंट',
      subtitle: 'तकनीकी जानकारी, ग्राहक आपत्तियों का समाधान और हिंदी में तुरंत सेल्स पिच।',
      quickPrompts: 'शॉर्टकट सवाल',
      askPlaceholder: 'कैपेसिटी, फीचर, तुलना या वारंटी के बारे में पूछें...',
      send: 'पूछें',
      disclaimer: 'केवल सत्यापित और आधिकारिक उत्पाद जानकारी पर आधारित।',
    },
  },
};
