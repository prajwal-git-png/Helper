import fs from 'fs';
import path from 'path';
import {
  Organization,
  Store,
  UserProfile,
  Brand,
  Product,
  Recipe,
  FeatureDemo,
  AuditLogItem,
  AiExtractionDraft,
  StorePriceInfo
} from '../src/types/index';
import {
  SEED_ORGANIZATIONS,
  SEED_STORES,
  SEED_USERS,
  SEED_BRANDS,
  SEED_PRODUCT_29RCAD,
  SEED_PRODUCT_35RCAD,
  SEED_PRODUCT_PHILIPS_AF,
  SEED_RECIPES,
  SEED_FEATURE_DEMOS,
  INITIAL_AUDIT_LOGS
} from './seedData';

interface DatabaseStore {
  organizations: Organization[];
  stores: Store[];
  users: UserProfile[];
  brands: Brand[];
  products: Product[];
  categories: string[];
  recipes: Recipe[];
  featureDemos: FeatureDemo[];
  auditLogs: AuditLogItem[];
  aiDrafts: AiExtractionDraft[];
}

const DEFAULT_CATEGORIES = [
  'OTG / Digital Air Fryer OTG',
  'Air Fryer',
  'Microwave Ovens',
  'Mixer Grinders',
  'Induction Cooktops',
  'Coffee Makers',
  'Dishwashers',
];

const DATA_DIR = path.resolve('.', 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

class LocalDatabase {
  private data: DatabaseStore;

  constructor() {
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseStore {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.products && parsed.products.length > 0) {
          if (!parsed.categories || parsed.categories.length === 0) {
            parsed.categories = [...DEFAULT_CATEGORIES];
          }
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Error reading store.json, falling back to initial seed data:', err);
    }

    const initial: DatabaseStore = {
      organizations: SEED_ORGANIZATIONS,
      stores: SEED_STORES,
      users: SEED_USERS,
      brands: SEED_BRANDS,
      products: [SEED_PRODUCT_29RCAD, SEED_PRODUCT_35RCAD, SEED_PRODUCT_PHILIPS_AF],
      categories: [...DEFAULT_CATEGORIES],
      recipes: SEED_RECIPES,
      featureDemos: SEED_FEATURE_DEMOS,
      auditLogs: INITIAL_AUDIT_LOGS,
      aiDrafts: [],
    };

    this.persist(initial);
    return initial;
  }

  private persist(dataToSave = this.data) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  public getOrganizations(): Organization[] {
    return this.data.organizations;
  }

  public getStores(orgId?: string): Store[] {
    if (!orgId) return this.data.stores;
    return this.data.stores.filter((s) => s.orgId === orgId);
  }

  public getUsers(orgId?: string): UserProfile[] {
    if (!orgId) return this.data.users;
    return this.data.users.filter((u) => u.orgId === orgId || u.role === 'platform_admin');
  }

  public getUserById(id: string): UserProfile | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getBrands(): Brand[] {
    return this.data.brands;
  }

  public getCategories(): string[] {
    if (!this.data.categories) {
      this.data.categories = [...DEFAULT_CATEGORIES];
    }
    return this.data.categories;
  }

  public addCategory(cat: string): string[] {
    if (!this.data.categories) {
      this.data.categories = [...DEFAULT_CATEGORIES];
    }
    const trimmed = cat.trim();
    if (trimmed && !this.data.categories.includes(trimmed)) {
      this.data.categories.push(trimmed);
      this.persist();
    }
    return this.data.categories;
  }

  public deleteCategory(cat: string): string[] {
    if (!this.data.categories) return [];
    this.data.categories = this.data.categories.filter((c) => c !== cat);
    this.persist();
    return this.data.categories;
  }

  public getProducts(callerOrgId?: string): Product[] {
    // Return products accessible to organization
    return this.data.products;
  }

  public getProductById(id: string, callerOrgId?: string): Product | undefined {
    const product = this.data.products.find((p) => p.id === id);
    return product;
  }

  public saveProduct(product: Product, user?: UserProfile): { success: boolean; product: Product } {
    const idx = this.data.products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      this.data.products[idx] = { ...product };
      if (user) this.logAudit(user, 'UPDATE_PRODUCT', 'Product', product.id, `Updated product ${product.name}`);
    } else {
      this.data.products.unshift(product);
      if (user) this.logAudit(user, 'CREATE_PRODUCT', 'Product', product.id, `Created product ${product.name}`);
    }
    this.persist();
    return { success: true, product };
  }

  public deleteProduct(id: string): boolean {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx >= 0) {
      this.data.products.splice(idx, 1);
      this.persist();
      return true;
    }
    return false;
  }

  public updateProductDimensions(
    productId: string,
    dimensions: {
      widthMm: number;
      heightMm: number;
      depthMm: number;
      source?: string;
      confidence?: 'verified' | 'manufacturer_spec' | 'pending_confirmation' | 'unverified';
    },
    user?: UserProfile
  ): Product | null {
    const product = this.data.products.find((p) => p.id === productId);
    if (!product) return null;

    product.externalDimensions = {
      widthMm: dimensions.widthMm,
      heightMm: dimensions.heightMm,
      depthMm: dimensions.depthMm,
    };
    if (dimensions.source) {
      product.measurementSource = dimensions.source;
    }
    if (dimensions.confidence) {
      product.measurementConfidence = dimensions.confidence;
    }

    if (user) {
      this.logAudit(
        user,
        'UPDATE_DIMENSIONS',
        'Product',
        productId,
        `Updated dimensions to ${dimensions.widthMm}x${dimensions.heightMm}x${dimensions.depthMm} mm`
      );
    }
    this.persist();
    return product;
  }

  public updateStorePrice(
    productId: string,
    storeId: string,
    priceData: Partial<StorePriceInfo>,
    user?: UserProfile
  ): Product | null {
    const product = this.data.products.find((p) => p.id === productId);
    if (!product) return null;

    const store = this.data.stores.find((s) => s.id === storeId);
    if (!store) return null;

    const existing = product.storePrices[storeId] || {
      storeId,
      storeName: store.name,
      mrp: product.defaultMrp,
      sellingPrice: product.defaultSellingPrice,
      lastUpdated: new Date().toISOString(),
    };

    product.storePrices[storeId] = {
      ...existing,
      ...priceData,
      storeName: store.name,
      lastUpdated: new Date().toISOString(),
    };

    if (user) {
      this.logAudit(
        user,
        'UPDATE_STORE_PRICE',
        'StorePrice',
        `${productId}_${storeId}`,
        `Updated store price for ${store.name} to ₹${product.storePrices[storeId].sellingPrice}`
      );
    }
    this.persist();
    return product;
  }

  public addAccessoryToProduct(
    productId: string,
    accessory: any,
    user?: UserProfile
  ): Product | null {
    const product = this.data.products.find((p) => p.id === productId);
    if (!product) return null;

    product.accessories.push(accessory);
    if (user) {
      this.logAudit(user, 'ADD_ACCESSORY', 'ProductAccessory', accessory.id, `Added accessory ${accessory.name} to ${product.name}`);
    }
    this.persist();
    return product;
  }

  public getRecipes(): Recipe[] {
    return this.data.recipes;
  }

  public saveRecipe(recipe: Recipe, user?: UserProfile): Recipe {
    const idx = this.data.recipes.findIndex((r) => r.id === recipe.id);
    if (idx >= 0) {
      this.data.recipes[idx] = recipe;
      if (user) this.logAudit(user, 'UPDATE_RECIPE', 'Recipe', recipe.id, `Updated recipe ${recipe.title}`);
    } else {
      this.data.recipes.unshift(recipe);
      if (user) this.logAudit(user, 'CREATE_RECIPE', 'Recipe', recipe.id, `Created recipe ${recipe.title}`);
    }
    this.persist();
    return recipe;
  }

  public getFeatureDemos(): FeatureDemo[] {
    return this.data.featureDemos;
  }

  public getAuditLogs(): AuditLogItem[] {
    return this.data.auditLogs;
  }

  public logAudit(user: UserProfile, action: string, entityType: string, entityId: string, details: string) {
    const entry: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      action,
      entityType,
      entityId,
      details,
    };
    this.data.auditLogs.unshift(entry);
    // Keep max 200 logs
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 200);
    }
  }

  public saveAiDraft(draft: AiExtractionDraft): AiExtractionDraft {
    this.data.aiDrafts.unshift(draft);
    this.persist();
    return draft;
  }

  public getAiDrafts(): AiExtractionDraft[] {
    return this.data.aiDrafts;
  }
}

export const db = new LocalDatabase();
