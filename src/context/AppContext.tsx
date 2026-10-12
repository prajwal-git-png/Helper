import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Organization,
  Store,
  Brand,
  Product,
  Recipe,
  FeatureDemo,
  AuditLogItem,
  LanguageCode,
  UserRole,
  AppTheme,
} from '../types/index';
import { TRANSLATIONS } from '../i18n/translations';

interface AppContextType {
  // Theme
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;

  // Authentication & Profile
  isAuthenticated: boolean;
  currentUser: UserProfile;
  login: (name: string, storeName?: string, role?: UserRole, pin?: string) => void;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Multitenancy
  organizations: Organization[];
  stores: Store[];
  users: UserProfile[];
  brands: Brand[];
  currentOrg: Organization;
  currentStore: Store;
  switchUser: (userId: string) => void;
  switchOrg: (orgId: string) => void;
  switchStore: (storeId: string) => void;
  userRole: UserRole;

  // Language & i18n
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: typeof TRANSLATIONS['en'];

  // Categories (Dynamic & User-addable)
  categories: string[];
  addCategory: (cat: string) => Promise<boolean>;
  deleteCategory: (cat: string) => Promise<boolean>;

  // Products & Data
  products: Product[];
  recipes: Recipe[];
  featureDemos: FeatureDemo[];
  auditLogs: AuditLogItem[];
  loading: boolean;
  refreshData: () => Promise<void>;

  // Customer Showroom Presentation Mode
  presentationProduct: Product | null;
  isPresentationMode: boolean;
  openPresentation: (product: Product) => void;
  exitPresentation: () => void;

  // Floor Promoters Tools
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  recentlyViewed: string[];
  recordViewed: (productId: string) => void;
  compareProductIds: string[];
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;

  // Actions
  updateProductDimensions: (
    productId: string,
    dimensions: { widthMm: number; heightMm: number; depthMm: number; source?: string; confidence?: any }
  ) => Promise<{ success: boolean; error?: string }>;
  updateStorePrice: (
    productId: string,
    storeId: string,
    priceData: { mrp: number; sellingPrice: number; offerTitle?: string; discountAmount?: number }
  ) => Promise<{ success: boolean; error?: string }>;
  addAccessory: (productId: string, accessory: any) => Promise<{ success: boolean; error?: string }>;
  saveRecipe: (recipe: Recipe) => Promise<{ success: boolean; error?: string }>;
  saveProduct: (product: Product) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (productId: string) => Promise<{ success: boolean; error?: string }>;

  // Offline Management
  offlineQueue: any[];
  triggerOfflineSync: () => Promise<void>;
  downloadProductOffline: (productId: string) => void;
  clearOfflineStorage: () => void;
  offlineStats: { cachedCount: number; sizeKb: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_CACHE_KEY = 'ssp_cached_store_data';
const LOCAL_STORAGE_PRODUCTS_KEY = 'ssp_all_products';
const LOCAL_STORAGE_CATEGORIES_KEY = 'ssp_user_categories';
const LOCAL_STORAGE_THEME_KEY = 'ssp_app_theme';
const LOCAL_STORAGE_AUTH_KEY = 'ssp_auth_user';
const LOCAL_STORAGE_QUEUE_KEY = 'ssp_offline_sync_queue';
const LOCAL_STORAGE_FAVS_KEY = 'ssp_user_favorites';
const LOCAL_STORAGE_RECENTS_KEY = 'ssp_user_recents';
const LOCAL_STORAGE_LANG_KEY = 'ssp_user_language';

const DEFAULT_CATEGORIES = [
  'OTG / Digital Air Fryer OTG',
  'Air Fryer',
  'Microwave Ovens',
  'Mixer Grinders',
  'Induction Cooktops',
  'Coffee Makers',
  'Dishwashers',
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  // Theme Management (Cream 🤍 and Obsidian Black 🖤)
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    if (saved === 'cream' || saved === 'cream-light' || saved === 'cream-dark') {
      return 'cream';
    }
    if (saved === 'obsidian-black' || saved === 'pure-black') {
      return 'obsidian-black';
    }
    return 'cream'; // Default to pristine cream showroom theme
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('theme-cream', 'theme-obsidian-black', 'theme-cream-dark', 'theme-pure-black');
      document.documentElement.classList.add(`theme-${newTheme}`);
      document.documentElement.setAttribute('data-theme', newTheme);
      
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', newTheme === 'cream' ? '#F7F4EE' : '#08090C');
      }
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('theme-cream', 'theme-obsidian-black', 'theme-cream-dark', 'theme-pure-black');
      document.documentElement.classList.add(`theme-${theme}`);
      document.documentElement.setAttribute('data-theme', theme);

      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', theme === 'cream' ? '#F7F4EE' : '#08090C');
      }
    }
  }, [theme]);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_AUTH_KEY) !== null;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      id: 'user-floor-promoter-01',
      name: 'Rahul Sharma',
      email: 'rahul.promoter@showroom.in',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'promoter',
      orgId: 'org-reliance-south',
      storeId: 'store-indiranagar',
      authorizedBrands: ['Morphy Richards', 'Philips', 'Bajaj'],
    };
  });

  const login = (name: string, storeName?: string, role: UserRole = 'promoter', _pin?: string) => {
    const profile: UserProfile = {
      ...currentUser,
      name: name.trim() || 'Floor Specialist',
      role,
      storeId: storeName || currentUser.storeId,
    };
    setCurrentUser(profile);
    setIsAuthenticated(true);
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(profile));
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
  };

  const updateUserProfile = (partial: Partial<UserProfile>) => {
    const updated = { ...currentUser, ...partial };
    setCurrentUser(updated);
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(updated));
  };

  // Organizations & Stores
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Categories (Persistent)
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_CATEGORIES;
  });

  // Products (Instant Permanent Local Restore)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [featureDemos, setFeatureDemos] = useState<FeatureDemo[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  // Active Context
  const [currentOrgId, setCurrentOrgId] = useState<string>('org-reliance-south');
  const [currentStoreId, setCurrentStoreId] = useState<string>('store-indiranagar');
  const [currentUserId, setCurrentUserId] = useState<string>('user-rahul-promoter');

  // Language
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem(LOCAL_STORAGE_LANG_KEY) as LanguageCode) || 'en';
  });

  // Presentation Mode
  const [presentationProduct, setPresentationProduct] = useState<Product | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  // Quick Picks
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVS_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_RECENTS_KEY) || '["prod-mr-29rcad"]');
    } catch {
      return ['prod-mr-29rcad'];
    }
  });

  const [compareProductIds, setCompareProductIds] = useState<string[]>([
    'prod-mr-29rcad',
    'prod-mr-35rcad',
  ]);

  // Offline Sync Queue
  const [offlineQueue, setOfflineQueue] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUEUE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem(LOCAL_STORAGE_LANG_KEY, lang);
  };

  // Add Category with permanent local + server sync
  const addCategory = async (cat: string): Promise<boolean> => {
    const trimmed = cat.trim();
    if (!trimmed) return false;
    if (categories.includes(trimmed)) return true;

    const nextCats = [...categories, trimmed];
    setCategories(nextCats);
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(nextCats));

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: trimmed }),
      });
    } catch (e) {
      console.warn('Saved category locally:', e);
    }
    return true;
  };

  const deleteCategory = async (cat: string): Promise<boolean> => {
    const nextCats = categories.filter((c) => c !== cat);
    setCategories(nextCats);
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(nextCats));

    try {
      await fetch(`/api/categories/${encodeURIComponent(cat)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Deleted category locally:', e);
    }
    return true;
  };

  // Fetch initial data from server and merge with local permanent data
  const refreshData = async () => {
    try {
      const res = await fetch('/api/bootstrap', {
        headers: {
          'x-org-id': currentOrgId,
          'x-store-id': currentStoreId,
          'x-user-id': currentUserId,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setOrganizations(data.organizations || []);
      setStores(data.stores || []);
      setUsers(data.users || []);
      setBrands(data.brands || []);

      // Merge server products with any local additions
      const serverProducts: Product[] = data.products || [];
      const localProductsStr = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      let mergedProducts = serverProducts;

      if (localProductsStr) {
        try {
          const localProds: Product[] = JSON.parse(localProductsStr);
          const serverIds = new Set(serverProducts.map((p) => p.id));
          const localOnly = localProds.filter((p) => !serverIds.has(p.id));
          mergedProducts = [...serverProducts, ...localOnly];
        } catch {
          // ignore
        }
      }

      setProducts(mergedProducts);
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(mergedProducts));

      // Merge categories
      if (data.categories && Array.isArray(data.categories)) {
        const combined = Array.from(new Set([...categories, ...data.categories]));
        setCategories(combined);
        localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(combined));
      }

      setRecipes(data.recipes || []);
      setFeatureDemos(data.featureDemos || []);
      setAuditLogs(data.auditLogs || []);

      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(data));
      setLoading(false);
    } catch (err) {
      console.warn('Network offline or error, restoring from permanent local cache:', err);
      const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          setOrganizations(data.organizations || []);
          setStores(data.stores || []);
          setUsers(data.users || []);
          setBrands(data.brands || []);
          if (products.length === 0) setProducts(data.products || []);
          setRecipes(data.recipes || []);
          setFeatureDemos(data.featureDemos || []);
          setAuditLogs(data.auditLogs || []);
        } catch (e) {
          console.error('Failed to parse cached data:', e);
        }
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentOrgId, currentStoreId, currentUserId]);

  // Active Entities
  const currentOrg = organizations.find((o) => o.id === currentOrgId) || organizations[0] || {
    id: currentOrgId,
    name: 'Reliance Digital South',
    code: 'RDS-BLR',
    logo: '',
    storesCount: 2,
    brandsAllowed: [],
    createdAt: '',
  };

  const currentStore = stores.find((s) => s.id === currentStoreId) || stores[0] || {
    id: currentStoreId,
    orgId: currentOrgId,
    name: 'Indiranagar Flagship, Bengaluru',
    code: 'RDS-INDIRA-01',
    city: 'Bengaluru',
    address: 'Indiranagar, Bengaluru',
    phone: '',
    currency: 'INR',
    activePromotersCount: 4,
  };

  const userRole = currentUser.role;

  const switchUser = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      setCurrentUserId(userId);
      setCurrentOrgId(targetUser.orgId);
      if (targetUser.storeId) {
        setCurrentStoreId(targetUser.storeId);
      }
    }
  };

  const switchOrg = (orgId: string) => {
    setCurrentOrgId(orgId);
  };

  const switchStore = (storeId: string) => {
    setCurrentStoreId(storeId);
  };

  // Presentation Mode Controls
  const openPresentation = (product: Product) => {
    setPresentationProduct(product);
    setIsPresentationMode(true);
    recordViewed(product.id);
  };

  const exitPresentation = () => {
    setIsPresentationMode(false);
  };

  // Favorites & Recents
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      localStorage.setItem(LOCAL_STORAGE_FAVS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const recordViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const next = [productId, ...filtered].slice(0, 10);
      localStorage.setItem(LOCAL_STORAGE_RECENTS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleCompare = (productId: string) => {
    setCompareProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], productId];
      }
      return [...prev, productId];
    });
  };

  const clearCompare = () => {
    setCompareProductIds([]);
  };

  // Dimensions
  const updateProductDimensions = async (
    productId: string,
    dimensions: { widthMm: number; heightMm: number; depthMm: number; source?: string; confidence?: any }
  ) => {
    try {
      const res = await fetch(`/api/products/${productId}/dimensions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-org-id': currentOrgId,
          'x-store-id': currentStoreId,
          'x-user-id': currentUserId,
        },
        body: JSON.stringify(dimensions),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update dimensions');

      setProducts((prev) => {
        const next = prev.map((p) => (p.id === productId ? data.product : p));
        localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(next));
        return next;
      });
      return { success: true };
    } catch {
      // Optimistic local update
      setProducts((prev) => {
        const next = prev.map((p) => {
          if (p.id === productId) {
            return {
              ...p,
              externalDimensions: {
                widthMm: dimensions.widthMm,
                heightMm: dimensions.heightMm,
                depthMm: dimensions.depthMm,
              },
            };
          }
          return p;
        });
        localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(next));
        return next;
      });
      return { success: true };
    }
  };

  // Store Pricing
  const updateStorePrice = async (
    productId: string,
    storeId: string,
    priceData: { mrp: number; sellingPrice: number; offerTitle?: string; discountAmount?: number }
  ) => {
    try {
      const res = await fetch(`/api/products/${productId}/store-price`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-org-id': currentOrgId,
          'x-store-id': currentStoreId,
          'x-user-id': currentUserId,
        },
        body: JSON.stringify({ ...priceData, storeId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update price');

      setProducts((prev) => {
        const next = prev.map((p) => (p.id === productId ? data.product : p));
        localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(next));
        return next;
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const addAccessory = async (productId: string, accessory: any) => {
    try {
      const res = await fetch(`/api/products/${productId}/accessories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-org-id': currentOrgId,
          'x-store-id': currentStoreId,
          'x-user-id': currentUserId,
        },
        body: JSON.stringify(accessory),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add accessory');

      setProducts((prev) => {
        const next = prev.map((p) => (p.id === productId ? data.product : p));
        localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(next));
        return next;
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const saveRecipe = async (recipe: Recipe) => {
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-org-id': currentOrgId,
          'x-store-id': currentStoreId,
          'x-user-id': currentUserId,
        },
        body: JSON.stringify(recipe),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save recipe');

      setRecipes((prev) => {
        const idx = prev.findIndex((r) => r.id === recipe.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = data.recipe;
          return next;
        }
        return [data.recipe, ...prev];
      });
      return { success: true };
    } catch {
      setRecipes((prev) => [recipe, ...prev]);
      return { success: true };
    }
  };

  // Action: Save Product (Permanently written to LocalStorage AND Server disk store.json)
  const saveProduct = async (product: Product) => {
    // 1. Immediately persist to state & localStorage for 100% offline & restart safety
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      let updated: Product[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = product;
      } else {
        updated = [product, ...prev];
      }
      try {
        localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save error (likely quota):', e);
      }
      return updated;
    });

    if (product.category && !categories.includes(product.category)) {
      addCategory(product.category);
    }

    // 2. Persist to server disk store.json
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-org-id': currentOrgId,
          'x-store-id': currentStoreId,
          'x-user-id': currentUserId,
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      // Update with server timestamp/format if returned
      if (data.product) {
        setProducts((prev) => {
          const idx = prev.findIndex((p) => p.id === product.id);
          const next = [...prev];
          if (idx >= 0) next[idx] = data.product;
          else next.unshift(data.product);
          localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(next));
          return next;
        });
      }
      return { success: true };
    } catch (err: any) {
      console.warn('Server offline, product persisted permanently to device storage:', err);
      return { success: true };
    }
  };

  // Action: Delete Product
  const deleteProduct = async (productId: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(next));
      return next;
    });

    try {
      await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'x-org-id': currentOrgId,
          'x-store-id': currentStoreId,
          'x-user-id': currentUserId,
        },
      });
      return { success: true };
    } catch {
      return { success: true };
    }
  };

  // Offline Synchronization Trigger
  const triggerOfflineSync = async () => {
    if (offlineQueue.length === 0) return;

    try {
      const res = await fetch('/api/sync/offline-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-org-id': currentOrgId,
          'x-store-id': currentStoreId,
          'x-user-id': currentUserId,
        },
        body: JSON.stringify({ actions: offlineQueue }),
      });

      if (res.ok) {
        setOfflineQueue([]);
        localStorage.removeItem(LOCAL_STORAGE_QUEUE_KEY);
        await refreshData();
      }
    } catch (err) {
      console.error('Offline sync failed:', err);
    }
  };

  const downloadProductOffline = (productId: string) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === productId ? { ...p, isOfflineCached: true } : p));
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearOfflineStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_CACHE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_QUEUE_KEY);
    setOfflineQueue([]);
  };

  const cachedDataStr = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY) || '';
  const offlineStats = {
    cachedCount: products.length,
    sizeKb: Math.round(cachedDataStr.length / 1024),
  };

  const value: AppContextType = {
    theme,
    setTheme,
    isAuthenticated,
    currentUser,
    login,
    logout,
    updateUserProfile,
    organizations,
    stores,
    users,
    brands,
    currentOrg,
    currentStore,
    switchUser,
    switchOrg,
    switchStore,
    userRole,
    language,
    setLanguage,
    t: TRANSLATIONS[language],
    categories,
    addCategory,
    deleteCategory,
    products,
    recipes,
    featureDemos,
    auditLogs,
    loading,
    refreshData,
    presentationProduct,
    isPresentationMode,
    openPresentation,
    exitPresentation,
    favorites,
    toggleFavorite,
    recentlyViewed,
    recordViewed,
    compareProductIds,
    toggleCompare,
    clearCompare,
    updateProductDimensions,
    updateStorePrice,
    addAccessory,
    saveRecipe,
    saveProduct,
    deleteProduct,
    offlineQueue,
    triggerOfflineSync,
    downloadProductOffline,
    clearOfflineStorage,
    offlineStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
