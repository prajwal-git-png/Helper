import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db';
import { extractProductSpecification, querySalesAssistant } from './server/gemini';
import { UserProfile, Product, Recipe } from './src/types/index';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable JSON body parsing up to 30mb for image uploads & document extracts
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Ensure upload directory exists
const uploadsDir = path.resolve('.', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multi-tenant Context Extraction Middleware
interface TenantRequest extends Request {
  user?: UserProfile;
  orgId?: string;
  storeId?: string;
}

app.use((req: TenantRequest, _res: Response, next: NextFunction) => {
  const userId = (req.headers['x-user-id'] as string) || 'user-rahul-promoter';
  const orgId = (req.headers['x-org-id'] as string) || 'org-reliance-south';
  const storeId = (req.headers['x-store-id'] as string) || 'store-indiranagar';

  const user = db.getUserById(userId) || db.getUsers()[0];
  req.user = user;
  req.orgId = orgId;
  req.storeId = storeId;
  next();
});

// API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    time: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Bootstrap full initial state for floor promoter
app.get('/api/bootstrap', (req: TenantRequest, res: Response) => {
  res.json({
    user: req.user,
    organizations: db.getOrganizations(),
    stores: db.getStores(req.orgId),
    users: db.getUsers(req.orgId),
    brands: db.getBrands(),
    products: db.getProducts(req.orgId),
    categories: db.getCategories(),
    recipes: db.getRecipes(),
    featureDemos: db.getFeatureDemos(),
    auditLogs: db.getAuditLogs(),
    aiDrafts: db.getAiDrafts(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Categories Endpoints
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json({ categories: db.getCategories() });
});

app.post('/api/categories', (req: Request, res: Response) => {
  const { category } = req.body;
  if (!category || typeof category !== 'string' || !category.trim()) {
    return res.status(400).json({ error: 'Valid category name is required' });
  }
  const updated = db.addCategory(category.trim());
  res.json({ success: true, categories: updated });
});

app.delete('/api/categories/:name', (req: Request, res: Response) => {
  const categoryName = decodeURIComponent(req.params.name);
  const updated = db.deleteCategory(categoryName);
  res.json({ success: true, categories: updated });
});

// Products List
app.get('/api/products', (req: TenantRequest, res: Response) => {
  const products = db.getProducts(req.orgId);
  res.json({ products });
});

// Product Details with Tenant Verification
app.get('/api/products/:id', (req: TenantRequest, res: Response) => {
  const product = db.getProductById(req.params.id, req.orgId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// Create or Update Product (Open to user to add/edit products, images, and features)
app.post('/api/products', (req: TenantRequest, res: Response) => {
  const user = req.user;
  const productData: Product = req.body;
  if (!productData || !productData.name) {
    return res.status(400).json({ error: 'Product name is required' });
  }
  const result = db.saveProduct(productData, user);
  res.json(result);
});

// Delete Product
app.delete('/api/products/:id', (req: TenantRequest, res: Response) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted' });
});

// Update Product Dimensions & Verification Source
app.put('/api/products/:id/dimensions', (req: TenantRequest, res: Response) => {
  const user = req.user;
  const { widthMm, heightMm, depthMm, source, confidence } = req.body;
  const updated = db.updateProductDimensions(
    req.params.id,
    { widthMm, heightMm, depthMm, source, confidence },
    user
  );

  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, product: updated });
});

// Update Store Price & Offer
app.put('/api/products/:id/store-price', (req: TenantRequest, res: Response) => {
  const user = req.user;
  const storeId = req.body.storeId || req.storeId || 'store-blrn-01';
  const updated = db.updateStorePrice(req.params.id, storeId, req.body, user);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, product: updated });
});

// Add Accessory to Product (Included or Optional)
app.post('/api/products/:id/accessories', (req: TenantRequest, res: Response) => {
  const user = req.user;
  const accessory = req.body;
  const updated = db.addAccessoryToProduct(req.params.id, accessory, user);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true, product: updated });
});

// Recipes List & Save
app.get('/api/recipes', (_req: Request, res: Response) => {
  res.json({ recipes: db.getRecipes() });
});

app.post('/api/recipes', (req: TenantRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthenticated' });

  const recipe: Recipe = req.body;
  const saved = db.saveRecipe(recipe, user);
  res.json({ success: true, recipe: saved });
});

// Feature Demos
app.get('/api/feature-demos', (_req: Request, res: Response) => {
  res.json({ featureDemos: db.getFeatureDemos() });
});

// Audit Logs
app.get('/api/audit-logs', (_req: Request, res: Response) => {
  res.json({ auditLogs: db.getAuditLogs() });
});

// File Upload Handler (Images & PDF spec documents)
app.post('/api/upload', (req: Request, res: Response) => {
  try {
    const { fileName, fileData, fileType } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: 'fileData base64 string is required' });
    }

    const safeName = `${Date.now()}-${(fileName || 'upload').replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, safeName);

    // Extract base64 payload if it includes data URL header
    const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const publicUrl = `/uploads/${safeName}`;
    res.json({
      success: true,
      url: publicUrl,
      fileName: safeName,
      fileType: fileType || 'image/jpeg',
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
});

// AI Endpoint: Extract Product Specifications from Image or Text Paste
app.post('/api/ai/extract-product', async (req: Request, res: Response) => {
  try {
    const { textInput, imageBase64, mimeType } = req.body;
    const draft = await extractProductSpecification(textInput || '', imageBase64, mimeType);
    db.saveAiDraft(draft);
    res.json({ success: true, draft });
  } catch (err: any) {
    console.error('AI specification extraction error:', err);
    res.status(500).json({ error: 'AI Extraction failed: ' + err.message });
  }
});

// AI Endpoint: Sales Floor Assistant
app.post('/api/ai/sales-assistant', async (req: TenantRequest, res: Response) => {
  try {
    const { query, productId, language = 'en' } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const allProducts = db.getProducts(req.orgId);
    const activeProduct = productId ? db.getProductById(productId, req.orgId) : allProducts[0];

    const result = await querySalesAssistant(query, activeProduct, allProducts, language);
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('AI Sales Assistant error:', err);
    res.status(500).json({ error: 'AI Assistant failed: ' + err.message });
  }
});

// Offline Sync Push Endpoint: Receives offline queues and syncs
app.post('/api/sync/offline-push', (req: TenantRequest, res: Response) => {
  const { actions } = req.body;
  const user = req.user || db.getUsers()[0];
  let processedCount = 0;

  if (Array.isArray(actions)) {
    for (const act of actions) {
      if (act.type === 'UPDATE_DIMENSIONS' && act.productId && act.dimensions) {
        db.updateProductDimensions(act.productId, act.dimensions, user);
        processedCount++;
      } else if (act.type === 'SAVE_RECIPE' && act.recipe) {
        db.saveRecipe(act.recipe, user);
        processedCount++;
      }
    }
  }

  res.json({
    success: true,
    processedCount,
    syncedAt: new Date().toISOString(),
  });
});

// Vite Middleware for Development / Static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('.', 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('.', 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Sales Promoter server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
