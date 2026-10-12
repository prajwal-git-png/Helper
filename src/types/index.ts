export type UserRole = 
  | 'platform_admin' 
  | 'org_admin' 
  | 'store_manager' 
  | 'promoter' 
  | 'content_editor';

export type LanguageCode = 'en' | 'kn' | 'hi';

export type AppTheme = 'cream' | 'obsidian-black';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  orgId: string;
  storeId?: string;
  authorizedBrands: string[];
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  logo: string;
  storesCount: number;
  brandsAllowed: string[];
  createdAt: string;
}

export interface Store {
  id: string;
  orgId: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  currency: string;
  activePromotersCount: number;
}

export interface Brand {
  id: string;
  name: string;
  code: string;
  logo: string;
  country: string;
  officialWebsite: string;
  description: string;
}

export interface ProductDimensions {
  widthMm: number;
  heightMm: number;
  depthMm: number;
}

export interface ProductPackaging {
  widthMm: number;
  heightMm: number;
  depthMm: number;
  weightKg: number;
}

export interface ClearanceGuideline {
  rearMm: number;
  sidesMm: number;
  topMm: number;
  notes: string;
}

export interface ProductSourceCitation {
  id: string;
  url: string;
  title: string;
  sourceType: 'official_manufacturer_page' | 'spec_sheet_pdf' | 'product_label' | 'distributor_doc' | 'retailer_secondary';
  dateRetrieved: string;
  notes: string;
  confidence: number; // 0 to 1
}

export interface SpecificationConflict {
  field: string;
  sourceA: string;
  valueA: string;
  sourceB: string;
  valueB: string;
  resolved: boolean;
}

export interface AccessoryItem {
  id: string;
  name: string;
  category: string;
  image: string;
  purpose: string;
  usageInstructions: string;
  cleaningInstructions: string;
  isIncludedInBox: boolean;
  optionalPrice?: number;
  verificationStatus: 'verified' | 'unverified';
}

export interface FeatureDemoStep {
  stepNumber: number;
  title: string;
  description: string;
  image?: string;
}

export interface FeatureDemo {
  id: string;
  title: string;
  category: 'dehydration' | 'air_frying' | 'rotisserie' | 'convection' | 'baking' | 'grilling';
  explanation: string;
  customerBenefit: string;
  operatingMode: string;
  recommendedSetting: string;
  steps: FeatureDemoStep[];
  safetyNotes: string;
  officialSource: string;
  demoImages: string[];
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
  image?: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  durationMins?: number;
  mode?: string;
  temperatureC?: number;
  image?: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  finishedImage: string;
  prepTimeMinutes: number;
  cookingTimeMinutes: number;
  temperatureCelsius: number;
  operatingMode: string;
  servings: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  compatibleModelNumbers: string[];
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  accessoriesNeeded: string[];
  proTips: string;
  safetyInstructions: string;
  isAiDraft: boolean;
  isVerified: boolean;
  translations?: {
    kn?: {
      title: string;
      proTips: string;
      steps: string[];
    };
    hi?: {
      title: string;
      proTips: string;
      steps: string[];
    };
  };
}

export interface StorePriceInfo {
  storeId: string;
  storeName: string;
  mrp: number;
  sellingPrice: number;
  offerTitle?: string;
  discountAmount?: number;
  offerValidTill?: string;
  lastUpdated: string;
}

export interface MultilingualProductContent {
  name: string;
  customerExplanation: string;
  keySellingPoints: string[];
  capacityExamples: string;
  commonObjections: { objection: string; answer: string }[];
}

export interface Product {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  modelNumber: string;
  variant?: string;
  sku: string;
  category: string;
  capacityLitres: number;
  wattage: number;
  colorFinish: string;
  availabilityStatus: 'in_stock' | 'low_stock' | 'order_only' | 'discontinued';
  searchAliases: string[];
  
  // Marketing & Sales Copy
  shortDescription: string;
  detailedDescription: string;
  customerExplanation: string;
  keySellingPoints: string[];
  useCases: string[];
  capacityPracticalExamples: string; // e.g. "Fits a 10-inch pizza, 1.5 kg whole roast chicken, or 12 standard cupcakes"

  // Technical Specifications
  voltage: string;
  temperatureRangeCelsius: string;
  timerLimitMinutes: number;
  operatingModes: string[];
  presetMenusCount: number;
  materialConstruction: string;
  warrantyYears: number;
  warrantyDetails: string;
  maintenanceInstructions: string;
  safetyNotes: string;
  countryOfOrigin: string;

  // Physical Dimensions
  externalDimensions: ProductDimensions;
  internalCavityDimensions?: ProductDimensions;
  productWeightKg: number;
  packagingDimensions: ProductPackaging;
  measurementSource: string;
  measurementConfidence: 'verified' | 'manufacturer_spec' | 'pending_confirmation' | 'unverified';
  clearanceGuide: ClearanceGuideline;

  // Pricing
  defaultMrp: number;
  defaultSellingPrice: number;
  storePrices: Record<string, StorePriceInfo>; // keyed by storeId

  // Accessories & Features
  accessories: AccessoryItem[];
  featureDemos: FeatureDemo[];
  
  // Verification & Source Tracking
  verificationStatus: 'verified' | 'Official listing — pending model-label confirmation' | 'unverified_draft';
  lastVerifiedDate: string;
  sources: ProductSourceCitation[];
  conflicts: SpecificationConflict[];

  // Media
  heroImage: string;
  galleryImages: { url: string; caption: string; isAuthenticPhoto: boolean; isAiGenerated: boolean }[];

  // Multilingual translations
  translations: {
    kn?: MultilingualProductContent;
    hi?: MultilingualProductContent;
  };

  isOfflineCached?: boolean;
}

export interface AiExtractionDraft {
  id: string;
  brand: string;
  name: string;
  modelNumber: string;
  category: string;
  capacityLitres: number;
  wattage: number;
  presetMenusCount: number;
  features: string[];
  warrantyYears: number;
  accessoriesExtracted: string[];
  externalDimensions?: {
    widthMm: number;
    heightMm: number;
    depthMm: number;
  };
  customerPitch: string;
  citations: string[];
  confidence: number;
  notes: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
}
