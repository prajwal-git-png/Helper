import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types/index';
import {
  PackagePlus,
  Image as ImageIcon,
  Check,
  Trash2,
  Plus,
  Sparkles,
  Ruler,
  Tag,
  Zap,
  Info,
  ArrowLeft,
  Upload,
  Camera,
  Layers,
  ShieldCheck,
  Eye,
} from 'lucide-react';

interface ProductEditScreenProps {
  initialProductId?: string;
  onSaved?: (product: Product) => void;
  onCancel?: () => void;
}

export const ProductEditScreen: React.FC<ProductEditScreenProps> = ({
  initialProductId,
  onSaved,
  onCancel,
}) => {
  const {
    products,
    saveProduct,
    deleteProduct,
    openPresentation,
    categories,
    addCategory,
  } = useApp();

  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Mode: creating new vs editing existing
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || (products.length > 0 ? products[0].id : 'new')
  );

  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('Morphy Richards');
  const [modelNumber, setModelNumber] = useState('');
  const [category, setCategory] = useState(categories[0] || 'OTG / Digital Air Fryer OTG');
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const [sellingPrice, setSellingPrice] = useState<number>(14999);
  const [mrp, setMrp] = useState<number>(19995);
  const [capacityLitres, setCapacityLitres] = useState<number>(29);
  const [wattage, setWattage] = useState<number>(2000);
  const [warrantyYears, setWarrantyYears] = useState<number>(2);
  const [presetMenusCount, setPresetMenusCount] = useState<number>(13);
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=800&auto=format&fit=crop&q=80'
  );
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
  ]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [customerPitch, setCustomerPitch] = useState('');
  const [features, setFeatures] = useState<string[]>([
    '4-in-1: OTG, Air Fryer, Dehydrator & Convection',
    'Motorized 360° Rotisserie with skewers',
    'Built-in fresh fruit dehydrator mode',
    'Even dual-element heating up to 230°C',
  ]);
  const [newFeatureText, setNewFeatureText] = useState('');

  // Dimensions in cm for easy user input
  const [widthCm, setWidthCm] = useState<number>(48.5);
  const [heightCm, setHeightCm] = useState<number>(36.5);
  const [depthCm, setDepthCm] = useState<number>(41.0);

  // Accessories in box
  const [accessories, setAccessories] = useState<string[]>([
    'Wire Grill',
    'Baking Tray',
    'Air Fryer Mesh Basket',
    'Crumb Tray',
    'Rotisserie Rod & Forks',
    'Tray Removal Tong',
  ]);
  const [newAccessoryText, setNewAccessoryText] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Load product data when selectedProductId changes
  useEffect(() => {
    if (selectedProductId === 'new') {
      setName('');
      setModelNumber('');
      setSellingPrice(14999);
      setMrp(19995);
      setCapacityLitres(29);
      setWattage(2000);
      setShortDescription('');
      setCustomerPitch('');
      return;
    }

    const prod = products.find((p) => p.id === selectedProductId);
    if (prod) {
      setName(prod.name);
      setBrandName(prod.brandName);
      setModelNumber(prod.modelNumber);
      setCategory(prod.category || categories[0] || 'OTG / Digital Air Fryer OTG');
      setSellingPrice(prod.defaultSellingPrice);
      setMrp(prod.defaultMrp);
      setCapacityLitres(prod.capacityLitres);
      setWattage(prod.wattage);
      setWarrantyYears(prod.warrantyYears);
      setPresetMenusCount(prod.presetMenusCount);
      setHeroImage(prod.heroImage);
      setGalleryImages(prod.galleryImages.map((g) => g.url));
      setShortDescription(prod.shortDescription);
      setCustomerPitch(prod.customerExplanation);
      setFeatures(prod.keySellingPoints);
      setWidthCm(Number((prod.externalDimensions.widthMm / 10).toFixed(1)));
      setHeightCm(Number((prod.externalDimensions.heightMm / 10).toFixed(1)));
      setDepthCm(Number((prod.externalDimensions.depthMm / 10).toFixed(1)));
      setAccessories(prod.accessories.map((a) => a.name));
    }
  }, [selectedProductId, products, categories]);

  // Compress & convert file to data URL for permanent storage
  const handleFileUpload = (
    file: File,
    onSuccess: (dataUrl: string) => void
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        // Offscreen canvas compression
        const canvas = document.createElement('canvas');
        const maxDimension = 900;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          onSuccess(compressedDataUrl);
        } else {
          onSuccess(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, (dataUrl) => {
        setHeroImage(dataUrl);
        setFeedbackMsg({
          type: 'success',
          text: 'Hero image loaded & ready for permanent save!',
        });
        setTimeout(() => setFeedbackMsg(null), 3000);
      });
    }
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, (dataUrl) => {
        setGalleryImages([...galleryImages, dataUrl]);
        setFeedbackMsg({
          type: 'success',
          text: 'Gallery image added to appliance!',
        });
        setTimeout(() => setFeedbackMsg(null), 3000);
      });
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await addCategory(newCatName.trim());
    setCategory(newCatName.trim());
    setNewCatName('');
    setIsAddingNewCat(false);
    setFeedbackMsg({
      type: 'success',
      text: `Category "${newCatName.trim()}" created!`,
    });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddAccessory = () => {
    if (!newAccessoryText.trim()) return;
    setAccessories([...accessories, newAccessoryText.trim()]);
    setNewAccessoryText('');
  };

  const handleRemoveAccessory = (idx: number) => {
    setAccessories(accessories.filter((_, i) => i !== idx));
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setGalleryImages([...galleryImages, newGalleryUrl.trim()]);
    setNewGalleryUrl('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Please enter a product name.' });
      return;
    }

    const productId = selectedProductId === 'new' ? `prod-${Date.now()}` : selectedProductId;

    const updatedProduct: Product = {
      id: productId,
      brandId: `brand-${brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      brandName: brandName.trim(),
      name: name.trim(),
      modelNumber:
        modelNumber.trim() ||
        `${brandName.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      sku: `${modelNumber || 'SKU'}-${Date.now().toString().slice(-4)}`,
      category: category.trim(),
      capacityLitres: Number(capacityLitres) || 29,
      wattage: Number(wattage) || 2000,
      colorFinish: 'Matte Charcoal Black',
      availabilityStatus: 'in_stock',
      searchAliases: [name.toLowerCase(), brandName.toLowerCase(), modelNumber.toLowerCase()],
      shortDescription:
        shortDescription.trim() ||
        `${capacityLitres}L ${brandName} ${modelNumber} with ${wattage}W power and ${presetMenusCount} digital presets.`,
      detailedDescription: customerPitch.trim() || shortDescription.trim() || name.trim(),
      customerExplanation:
        customerPitch.trim() ||
        `High-power ${capacityLitres}L ${brandName} appliance with ${wattage}W rapid heating, ideal for modern kitchen baking and healthy air frying.`,
      keySellingPoints: features.length > 0 ? features : ['Multi-functional heating', 'Energy efficient'],
      capacityPracticalExamples: `Fits standard 10-inch pizza, whole 1.5kg chicken, or 12 muffins.`,
      defaultMrp: Number(mrp) || 19995,
      defaultSellingPrice: Number(sellingPrice) || 14999,
      storePrices: {
        'store-blrn-01': {
          storeId: 'store-blrn-01',
          storeName: 'Indiranagar Flagship, Bengaluru',
          sellingPrice: Number(sellingPrice) || 14999,
          mrp: Number(mrp) || 19995,
          offerTitle: 'Store Floor Special',
          discountAmount: (Number(mrp) || 19995) - (Number(sellingPrice) || 14999),
          lastUpdated: new Date().toISOString(),
        },
      },
      warrantyYears: Number(warrantyYears) || 2,
      presetMenusCount: Number(presetMenusCount) || 13,
      externalDimensions: {
        widthMm: Math.round(Number(widthCm) * 10),
        heightMm: Math.round(Number(heightCm) * 10),
        depthMm: Math.round(Number(depthCm) * 10),
      },
      internalCavityDimensions: {
        widthMm: Math.round((Number(widthCm) - 13) * 10),
        heightMm: Math.round((Number(heightCm) - 10) * 10),
        depthMm: Math.round((Number(depthCm) - 9) * 10),
      },
      packagingDimensions: {
        widthMm: Math.round((Number(widthCm) + 10) * 10),
        heightMm: Math.round((Number(heightCm) + 10) * 10),
        depthMm: Math.round((Number(depthCm) + 10) * 10),
        weightKg: 10.5,
      },
      productWeightKg: 8.5,
      clearanceGuide: {
        rearMm: 100,
        sidesMm: 50,
        topMm: 100,
        notes: 'Provide 10cm top and rear clearance for ventilation.',
      },
      voltage: '220-240V, 50Hz',
      temperatureRangeCelsius: '45°C to 230°C',
      timerLimitMinutes: 120,
      operatingModes: ['Air Fry', 'Bake', 'Grill', 'Toast', 'Dehydrate'],
      materialConstruction: 'Galvanized Steel & Tempered Glass',
      warrantyDetails: `${warrantyYears} Years Comprehensive Warranty`,
      maintenanceInstructions: 'Wipe crumb tray with damp cloth.',
      safetyNotes: 'Maintain 10cm rear clearance.',
      countryOfOrigin: 'India',
      measurementSource: 'User Specification',
      measurementConfidence: 'verified',
      verificationStatus: 'verified',
      lastVerifiedDate: new Date().toISOString(),
      conflicts: [],
      useCases: ['Everyday baking', 'Oil-free air frying', 'Toasting'],
      heroImage:
        heroImage.trim() ||
        'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=800&auto=format&fit=crop&q=80',
      galleryImages: galleryImages.map((url, i) => ({
        url,
        caption: `${name} view ${i + 1}`,
        isAuthenticPhoto: true,
        isAiGenerated: false,
      })),
      accessories: accessories.map((acc, i) => ({
        id: `acc-${i}`,
        name: acc,
        category: 'Included',
        image:
          'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=300&auto=format&fit=crop&q=80',
        purpose: 'Food preparation accessory',
        usageInstructions: 'Slide into shelf slots.',
        cleaningInstructions: 'Hand wash with sponge.',
        isIncludedInBox: true,
        verificationStatus: 'verified',
      })),
      featureDemos: [
        {
          id: 'demo-airfry',
          title: 'Rapid Air Frying',
          category: 'air_frying',
          explanation: 'High-speed convection fan circulates superheated air for golden crunch.',
          customerBenefit: 'Up to 90% less oil for crispy snacks',
          operatingMode: 'Air Fry',
          recommendedSetting: '200°C for 15 mins',
          steps: [
            { stepNumber: 1, title: 'Insert Mesh Basket', description: 'Place food in single layer.' },
            { stepNumber: 2, title: 'Select Air Fry Mode', description: 'Set to 200°C for 15 mins.' },
          ],
          safetyNotes: 'Use oven mitts when removing hot basket.',
          officialSource: 'Manufacturer manual',
          demoImages: [heroImage],
        },
      ],
      sources: [
        {
          id: 'src-user',
          url: 'https://user-input-source.local',
          title: 'Floor User Specification Input',
          sourceType: 'official_manufacturer_page',
          dateRetrieved: new Date().toISOString(),
          notes: 'User customized details directly.',
          confidence: 1.0,
        },
      ],
      translations: {
        kn: {
          name,
          customerExplanation: `${name} - ತ್ವರಿತ ಅಡುಗೆ ಮತ್ತು ಬೇಕಿಂಗ್‌ಗಾಗಿ ಅತ್ಯುತ್ತಮ ಆಯ್ಕೆ.`,
          keySellingPoints: features,
          capacityExamples: '10 ಇಂಚಿನ ಪಿಜ್ಜಾ ಅಥವಾ ಪೂರ್ಣ ಚಿಕನ್ ಸರಿಹೊಂದುತ್ತದೆ.',
          commonObjections: [],
        },
        hi: {
          name,
          customerExplanation: `${name} - बेकिंग और एयर फ्राइंग के लिए सर्वश्रेष्ठ डिजिटल उपकरण।`,
          keySellingPoints: features,
          capacityExamples: '10 इंच का पिज्जा या 1.5 किलो चिकन आसानी से आता है।',
          commonObjections: [],
        },
      },
    };

    const res = await saveProduct(updatedProduct);
    if (res.success) {
      setFeedbackMsg({
        type: 'success',
        text: `Product "${name}" saved permanently! Survives device restart.`,
      });
      setSelectedProductId(updatedProduct.id);
      if (onSaved) onSaved(updatedProduct);
      setTimeout(() => setFeedbackMsg(null), 3500);
    } else {
      setFeedbackMsg({ type: 'error', text: res.error || 'Failed to save product.' });
    }
  };

  const handleDelete = async () => {
    if (selectedProductId === 'new') return;
    if (window.confirm(`Are you sure you want to delete "${name}" from the catalog?`)) {
      await deleteProduct(selectedProductId);
      setSelectedProductId(products[0]?.id || 'new');
      setFeedbackMsg({ type: 'success', text: 'Product removed from showroom.' });
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  // Image Presets for quick selection
  const imagePresets = [
    {
      title: 'Digital OTG 29L',
      url: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Rapid Air Fryer',
      url: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Smart Microwave',
      url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Induction Cooktop',
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Food Processor / Mixer',
      url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-5 space-y-6 pb-28 text-[#F5EFEB]">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 rounded-xl glass-button-secondary text-[#D8CFBF] hover:text-[#FAF6EE]"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-black font-display text-[#FAF6EE] flex items-center gap-2 tracking-tight">
              <PackagePlus className="w-5 h-5 text-amber-400" />
              Manage & Add Appliances
            </h1>
            <p className="text-xs text-[#D8CFBF] mt-0.5">
              Add your own appliances, upload photos, set custom categories, and save permanently.
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {selectedProductId !== 'new' && (
            <button
              type="button"
              onClick={handleDelete}
              className="p-2 rounded-xl glass-button-secondary text-rose-400 hover:text-rose-300 transition"
              title="Delete Product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setSelectedProductId('new')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedProductId === 'new'
                ? 'bg-amber-500 text-black shadow-md'
                : 'glass-button-secondary text-[#D8CFBF] hover:text-[#FAF6EE]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Appliance</span>
          </button>
        </div>
      </div>

      {/* Select existing product picker pill */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => setSelectedProductId('new')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition active:scale-95 flex items-center gap-1 ${
            selectedProductId === 'new'
              ? 'bg-amber-500 text-black font-bold'
              : 'glass-panel text-[#D8CFBF]'
          }`}
        >
          <Plus className="w-3 h-3" />
          <span>+ Add New</span>
        </button>
        {products.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedProductId(p.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
              selectedProductId === p.id
                ? 'bg-amber-500 text-black font-bold'
                : 'glass-panel text-[#D8CFBF] hover:text-[#FAF6EE]'
            }`}
          >
            {p.name.slice(0, 24)}...
          </button>
        ))}
      </div>

      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
          }`}
        >
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Main Edit Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Basic Identifiers */}
        <div className="rounded-[28px] glass-panel-elevated p-5 sm:p-6 border border-[#F5EFEB]/15 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-display">
            <Tag className="w-3.5 h-3.5" />
            Basic Details & Category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] text-[#D8CFBF] font-semibold">
                Product Title / Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Morphy Richards 29RCAD Digital Air Fryer OTG"
                className="w-full mt-1 px-3.5 py-2.5 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] placeholder-[#9E9484] focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-[#D8CFBF] font-semibold">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Morphy Richards, Philips, Bajaj"
                className="w-full mt-1 px-3.5 py-2.5 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] placeholder-[#9E9484] focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#D8CFBF] font-semibold">Model Number</label>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                placeholder="e.g. 29RCAD"
                className="w-full mt-1 px-3.5 py-2.5 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] placeholder-[#9E9484] focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            {/* Dynamic Category Selector with Add Category */}
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-[#D8CFBF] font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Category</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingNewCat(!isAddingNewCat)}
                  className="text-[11px] text-amber-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isAddingNewCat ? 'Choose Existing' : '+ Add Any Category'}</span>
                </button>
              </div>

              {isAddingNewCat ? (
                <div className="flex gap-2 animate-in fade-in">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Enter custom category name (e.g. Espresso Machine)..."
                    className="flex-1 px-3.5 py-2.5 rounded-2xl bg-black/60 border border-amber-400/40 text-xs text-[#FAF6EE] placeholder-[#9E9484] focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-4 py-2.5 rounded-2xl glass-button-primary text-xs font-bold text-black flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply</span>
                  </button>
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === '__add_new__') {
                      setIsAddingNewCat(true);
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] focus:outline-none focus:border-amber-400"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-black text-[#FAF6EE]">
                      {c}
                    </option>
                  ))}
                  <option value="__add_new__" className="bg-black text-amber-400 font-bold">
                    + Add New Category...
                  </option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Pricing, Power & Capacity */}
        <div className="rounded-[28px] glass-panel-elevated p-5 sm:p-6 border border-[#F5EFEB]/15 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-display">
            <Zap className="w-3.5 h-3.5" />
            Pricing, Power & Capacity
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] text-[#D8CFBF] font-semibold">Selling Price (₹)</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-amber-400 font-bold font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#D8CFBF] font-semibold">MRP (₹)</label>
              <input
                type="number"
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#D8CFBF] font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#D8CFBF] font-semibold">Capacity (Litre)</label>
              <input
                type="number"
                value={capacityLitres}
                onChange={(e) => setCapacityLitres(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#D8CFBF] font-semibold">Wattage (Watts)</label>
              <input
                type="number"
                value={wattage}
                onChange={(e) => setWattage(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#D8CFBF] font-semibold">Presets Count</label>
              <input
                type="number"
                value={presetMenusCount}
                onChange={(e) => setPresetMenusCount(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#D8CFBF] font-semibold">Warranty (Years)</label>
              <input
                type="number"
                value={warrantyYears}
                onChange={(e) => setWarrantyYears(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Physical Dimensions */}
        <div className="rounded-[28px] glass-panel-elevated p-5 sm:p-6 border border-[#F5EFEB]/15 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-display">
              <Ruler className="w-3.5 h-3.5" />
              Dimensions in cm
            </h2>
            <span className="text-[10px] text-[#9E9484]">
              Equals {Math.round(widthCm * 10)} × {Math.round(heightCm * 10)} × {Math.round(depthCm * 10)} mm
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-[#D8CFBF] font-semibold">Width (cm)</label>
              <input
                type="number"
                step="0.1"
                value={widthCm}
                onChange={(e) => setWidthCm(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#D8CFBF] font-semibold">Height (cm)</label>
              <input
                type="number"
                step="0.1"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#D8CFBF] font-semibold">Depth (cm)</label>
              <input
                type="number"
                step="0.1"
                value={depthCm}
                onChange={(e) => setDepthCm(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Images & Direct Photo Upload */}
        <div className="rounded-[28px] glass-panel-elevated p-5 sm:p-6 border border-[#F5EFEB]/15 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-display">
              <ImageIcon className="w-3.5 h-3.5" />
              Appliance Photos & Direct Upload
            </h2>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Saved permanently</span>
            </span>
          </div>

          {/* Hidden File Input for Hero */}
          <input
            type="file"
            ref={heroFileInputRef}
            onChange={handleHeroFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Hidden File Input for Gallery */}
          <input
            type="file"
            ref={galleryFileInputRef}
            onChange={handleGalleryFileChange}
            accept="image/*"
            className="hidden"
          />

          <div>
            <label className="text-[11px] text-[#D8CFBF] font-semibold">Main Hero Image</label>
            <div className="mt-1 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-2">
                <input
                  type="url"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="Paste image URL..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] placeholder-[#9E9484] focus:outline-none focus:border-amber-400"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => heroFileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-2xl glass-button-primary text-xs font-bold text-black flex items-center justify-center gap-1.5 active:scale-95 transition"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload from Device / Camera</span>
                  </button>
                </div>
              </div>

              {heroImage && (
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl overflow-hidden border border-[#F5EFEB]/15 bg-black/60 flex-shrink-0 shadow-md">
                  <img
                    src={heroImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src =
                        'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Quick Preset Selector */}
            <div className="mt-3">
              <div className="text-[10px] text-[#9E9484] font-semibold mb-1.5">
                Or pick from high-definition appliance presets:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {imagePresets.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => setHeroImage(preset.url)}
                    className="px-2.5 py-1 rounded-xl bg-black/50 border border-[#F5EFEB]/10 text-[10px] text-[#D8CFBF] hover:text-[#FAF6EE] hover:border-amber-400/50 transition active:scale-95"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="pt-3 border-t border-[#F5EFEB]/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-[#D8CFBF] font-semibold">
                Additional Gallery Views ({galleryImages.length})
              </label>
              <button
                type="button"
                onClick={() => galleryFileInputRef.current?.click()}
                className="text-xs text-amber-400 font-semibold flex items-center gap-1 hover:underline"
              >
                <Upload className="w-3 h-3" />
                <span>Upload Gallery Photo</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="Or paste additional photo URL..."
                className="flex-1 px-3 py-2 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] placeholder-[#9E9484] focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                className="px-3.5 py-2 rounded-2xl glass-button-secondary text-xs font-semibold text-[#FAF6EE]"
              >
                Add URL
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
              {galleryImages.map((imgUrl, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl overflow-hidden border border-[#F5EFEB]/15 relative group bg-black/60 shadow"
                >
                  <img src={imgUrl} alt={`gallery ${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setGalleryImages(galleryImages.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 p-1 rounded-md bg-black/80 text-rose-400 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Key Features & Accessories */}
        <div className="rounded-[28px] glass-panel-elevated p-5 sm:p-6 border border-[#F5EFEB]/15 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-display">
            <Sparkles className="w-3.5 h-3.5" />
            Key Selling Features & In-Box Accessories
          </h2>

          {/* Features */}
          <div className="space-y-2">
            <label className="text-[11px] text-[#D8CFBF] font-semibold">
              Appliance Features / Highlights
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                placeholder="e.g. 360° Motorized Rotisserie, Dual-Element Baking..."
                className="flex-1 px-3 py-2 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] placeholder-[#9E9484] focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3.5 py-2 rounded-2xl glass-button-secondary text-xs font-semibold text-[#FAF6EE]"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              {features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/40 border border-[#F5EFEB]/10 text-xs text-[#FAF6EE]"
                >
                  <span className="truncate pr-2">✓ {feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="text-[#9E9484] hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div className="pt-3 border-t border-[#F5EFEB]/10 space-y-2">
            <label className="text-[11px] text-[#D8CFBF] font-semibold">
              Accessories Included in Box
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAccessoryText}
                onChange={(e) => setNewAccessoryText(e.target.value)}
                placeholder="e.g. Baking Tray, Rotisserie Rod, Crumb Tray..."
                className="flex-1 px-3 py-2 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] placeholder-[#9E9484] focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddAccessory}
                className="px-3.5 py-2 rounded-2xl glass-button-secondary text-xs font-semibold text-[#FAF6EE]"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {accessories.map((acc, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/50 border border-[#F5EFEB]/10 text-xs text-[#FAF6EE]"
                >
                  <span>{acc}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAccessory(i)}
                    className="text-[#9E9484] hover:text-rose-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 6: Customer Pitch */}
        <div className="rounded-[28px] glass-panel-elevated p-5 sm:p-6 border border-[#F5EFEB]/15 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-display">
            <Info className="w-3.5 h-3.5" />
            Showroom Pitch & Description
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-[#D8CFBF] font-semibold">
                Customer Showroom Pitch
              </label>
              <textarea
                rows={2}
                value={customerPitch}
                onChange={(e) => setCustomerPitch(e.target.value)}
                placeholder="Key 2-sentence sales pitch to tell customers on the showroom floor..."
                className="w-full mt-1 px-3.5 py-2.5 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] placeholder-[#9E9484] focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-20 z-20 p-2.5 rounded-[26px] glass-panel-elevated border border-[#F5EFEB]/20 shadow-2xl flex items-center justify-between gap-3">
          <div className="text-xs text-[#D8CFBF] pl-2 hidden sm:block">
            Permanent disk & device storage active.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-2xl glass-button-secondary text-xs font-semibold text-[#D8CFBF]"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-2xl glass-button-primary text-xs font-bold text-black flex items-center justify-center gap-2 active:scale-95 transition shadow-lg shadow-amber-500/20"
            >
              <Check className="w-4 h-4" />
              <span>Save Appliance Permanently</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
