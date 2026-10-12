import React, { useState } from 'react';
import { Product } from '../../types/index';
import { useApp } from '../../context/AppContext';
import {
  formatDimension3D,
  convertAllUnits,
  DimensionUnit,
} from '../../utils/dimensionConverter';
import {
  ArrowLeft,
  Flame,
  ShieldCheck,
  Package,
  Ruler,
  Check,
  Tag,
  Edit3,
  ExternalLink,
  PlusCircle,
  X,
  AlertTriangle,
} from 'lucide-react';

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
  onEdit?: (product: Product) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onBack,
  onEdit,
}) => {
  const {
    openPresentation,
    currentStore,
    currentUser,
    userRole,
    updateProductDimensions,
    updateStorePrice,
    addAccessory,
    downloadProductOffline,
  } = useApp();

  const [activeUnit, setActiveUnit] = useState<DimensionUnit>('cm');

  // Modal states
  const [showDimensionModal, setShowDimensionModal] = useState(false);
  const [editWidth, setEditWidth] = useState(product.externalDimensions.widthMm);
  const [editHeight, setEditHeight] = useState(product.externalDimensions.heightMm);
  const [editDepth, setEditDepth] = useState(product.externalDimensions.depthMm);
  const [dimError, setDimError] = useState<string | null>(null);

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [editPrice, setEditPrice] = useState(
    product.storePrices[currentStore.id]?.sellingPrice || product.defaultSellingPrice
  );
  const [editOfferTitle, setEditOfferTitle] = useState(
    product.storePrices[currentStore.id]?.offerTitle || ''
  );
  const [priceError, setPriceError] = useState<string | null>(null);

  const [showAccessoryModal, setShowAccessoryModal] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccPurpose, setNewAccPurpose] = useState('');
  const [newAccIsIncluded, setNewAccIsIncluded] = useState(true);
  const [accError, setAccError] = useState<string | null>(null);

  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const allUnitDims = convertAllUnits(
    {
      width: product.externalDimensions.widthMm,
      height: product.externalDimensions.heightMm,
      depth: product.externalDimensions.depthMm,
    },
    'mm'
  );

  const handleSaveDimensions = async (e: React.FormEvent) => {
    e.preventDefault();
    setDimError(null);

    const res = await updateProductDimensions(product.id, {
      widthMm: Number(editWidth),
      heightMm: Number(editHeight),
      depthMm: Number(editDepth),
      source: 'Verified by ' + currentUser.name + ' (' + userRole + ')',
      confidence: 'verified',
    });

    if (!res.success) {
      setDimError(res.error || 'Failed to update dimensions');
    } else {
      setShowDimensionModal(false);
      setActionSuccessMsg('Dimensions updated and logged to audit trail!');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    setPriceError(null);

    const res = await updateStorePrice(product.id, currentStore.id, {
      mrp: product.defaultMrp,
      sellingPrice: Number(editPrice),
      offerTitle: editOfferTitle,
      discountAmount: Math.max(0, product.defaultMrp - Number(editPrice)),
    });

    if (!res.success) {
      setPriceError(res.error || 'Failed to update price');
    } else {
      setShowPriceModal(false);
      setActionSuccessMsg(`Store price for ${currentStore.name} updated to ₹${editPrice}`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  const handleAddAccessory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) return;

    const res = await addAccessory(product.id, {
      id: `acc-${Date.now()}`,
      name: newAccName,
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
      purpose: newAccPurpose || 'Cooking accessory',
      usageInstructions: 'Use as directed in manual',
      cleaningInstructions: 'Wash with soapy water',
      isIncludedInBox: newAccIsIncluded,
      verificationStatus: 'verified',
    });

    if (!res.success) {
      setAccError(res.error || 'Failed to add accessory');
    } else {
      setShowAccessoryModal(false);
      setNewAccName('');
      setNewAccPurpose('');
      setActionSuccessMsg('Accessory added successfully!');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  const currentStorePrice =
    product.storePrices[currentStore.id] || {
      sellingPrice: product.defaultSellingPrice,
      mrp: product.defaultMrp,
      offerTitle: 'Store standard price',
    };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28">
      {/* Top Back & Header Action */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl glass-button-secondary text-xs font-semibold text-slate-300 active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadProductOffline(product.id)}
            className="px-3 py-1.5 rounded-2xl glass-button-secondary text-xs font-medium text-slate-300 active:scale-95 transition"
            title="Download full specifications for offline floor presentation"
          >
            {product.isOfflineCached ? '✓ Cached Offline' : 'Save for Offline'}
          </button>

          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="px-3 py-1.5 rounded-2xl glass-button-secondary text-xs font-semibold text-amber-400 hover:text-white active:scale-95 transition flex items-center gap-1"
              title="Edit appliance details, specs, images, or features"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          )}

          <button
            onClick={() => openPresentation(product)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl glass-button-primary text-slate-950 text-xs font-bold shadow-md active:scale-95 transition"
          >
            <Flame className="w-4 h-4 fill-slate-950" />
            <span>Launch Presentation</span>
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Main Product Header Card */}
      <div className="rounded-3xl glass-panel p-6 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 flex justify-center">
          <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-black/40 border border-white/[0.08]">
            <img
              src={product.heroImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-7 space-y-3.5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-amber-400">
                {product.brandName}
              </span>
              <span aria-hidden="true">·</span>
              <span>SKU: {product.sku}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-semibold">{product.verificationStatus}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {product.name}
            </h1>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              Model: {product.modelNumber}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {product.detailedDescription}
          </p>

          {/* Pricing & Store Offer */}
          <div className="p-4 rounded-2xl glass-pill flex items-center justify-between gap-4">
            <div>
              <div className="text-[10.5px] text-slate-400">
                {currentStore.name}
              </div>
              <div className="text-2xl font-black text-amber-400 tracking-tight">
                ₹{currentStorePrice.sellingPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-400 line-through">
                MRP ₹{product.defaultMrp.toLocaleString('en-IN')}
              </div>
              {currentStorePrice.offerTitle && (
                <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                  🏷️ {currentStorePrice.offerTitle}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowPriceModal(true)}
              className="px-3.5 py-2 rounded-xl glass-button-secondary text-xs font-semibold text-white active:scale-95 transition flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit Store Price</span>
            </button>
          </div>
        </div>
      </div>

      {/* DIMENSIONS & CONVERSIONS SECTION */}
      <div className="rounded-3xl glass-panel p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Ruler className="w-4 h-4 text-amber-400" />
              Physical Dimensions & Sizing
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Source: {product.measurementSource} ({product.measurementConfidence})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center glass-pill p-0.5 rounded-2xl">
              {(['cm', 'in', 'mm', 'ft'] as DimensionUnit[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setActiveUnit(u)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold uppercase transition active:scale-95 ${
                    activeUnit === u
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowDimensionModal(true)}
              className="px-3 py-1.5 rounded-xl glass-button-secondary text-xs font-semibold text-slate-200 active:scale-95 transition flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit Dims</span>
            </button>
          </div>
        </div>

        {/* 3D Dims Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl glass-pill">
            <span className="text-[11px] text-slate-400 uppercase font-mono">External Dimensions</span>
            <div className="text-base font-bold text-white mt-1">
              {formatDimension3D(allUnitDims[activeUnit], activeUnit)}
            </div>
            <div className="text-[10.5px] text-slate-400 mt-1">Weight: {product.productWeightKg} kg</div>
          </div>

          <div className="p-4 rounded-2xl glass-pill">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Cavity Capacity</span>
            <div className="text-base font-bold text-amber-400 mt-1">
              {product.capacityLitres} Litres (Gross)
            </div>
            <div className="text-[10.5px] text-slate-400 mt-1">Internal: 352 × 260 × 320 mm</div>
          </div>

          <div className="p-4 rounded-2xl glass-pill">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Packaging Dimensions</span>
            <div className="text-base font-bold text-white mt-1">
              {product.packagingDimensions.widthMm} × {product.packagingDimensions.heightMm} × {product.packagingDimensions.depthMm} mm
            </div>
            <div className="text-[10.5px] text-slate-400 mt-1">Gross Weight: {product.packagingDimensions.weightKg} kg</div>
          </div>
        </div>
      </div>

      {/* ACCESSORIES SECTION */}
      <div className="rounded-3xl glass-panel p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              Accessories ({product.accessories.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified list of package contents.
            </p>
          </div>

          <button
            onClick={() => setShowAccessoryModal(true)}
            className="px-3 py-1.5 rounded-xl glass-button-secondary text-xs font-semibold text-slate-200 active:scale-95 transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {product.accessories.map((acc) => (
            <div
              key={acc.id}
              className="p-3 rounded-2xl glass-pill flex items-center gap-3"
            >
              <img
                src={acc.image}
                alt={acc.name}
                className="w-14 h-14 rounded-xl object-cover border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white truncate">{acc.name}</h4>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      acc.isIncludedInBox
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {acc.isIncludedInBox ? 'Included' : 'Optional'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{acc.purpose}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRACEABLE SOURCES */}
      <div className="rounded-3xl glass-panel p-6 space-y-4 shadow-xl">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Traceable Sources & Audit Documentation
        </h2>
        <div className="space-y-2">
          {product.sources.map((src) => (
            <div
              key={src.id}
              className="p-3.5 rounded-2xl glass-pill space-y-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{src.title}</span>
                <span className="text-[10px] font-mono text-amber-400">
                  {(src.confidence * 100).toFixed(0)}% Confidence
                </span>
              </div>
              <a
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-amber-400 text-[11px] font-mono flex items-center gap-1 break-all"
              >
                <span>{src.url}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
              <div className="text-[10px] text-slate-500 pt-0.5">
                Retrieved: {src.dateRetrieved} · Type: {src.sourceType}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: EDIT DIMENSIONS */}
      {showDimensionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in">
          <form
            onSubmit={handleSaveDimensions}
            className="w-full max-w-md rounded-3xl glass-panel-elevated p-6 shadow-2xl text-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Ruler className="w-4 h-4 text-amber-400" />
                Edit Physical Dimensions (mm)
              </h3>
              <button
                type="button"
                onClick={() => setShowDimensionModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {dimError && (
              <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/40 text-xs text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{dimError}</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Width (mm)</label>
                <input
                  type="number"
                  value={editWidth}
                  onChange={(e) => setEditWidth(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">Height (mm)</label>
                <input
                  type="number"
                  value={editHeight}
                  onChange={(e) => setEditHeight(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium">Depth (mm)</label>
                <input
                  type="number"
                  value={editDepth}
                  onChange={(e) => setEditDepth(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDimensionModal(false)}
                className="flex-1 py-2.5 rounded-2xl glass-button-secondary text-xs font-semibold text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl glass-button-primary text-xs font-bold text-slate-950 shadow-md transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: EDIT STORE PRICE */}
      {showPriceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in">
          <form
            onSubmit={handleSavePrice}
            className="w-full max-w-md rounded-3xl glass-panel-elevated p-6 shadow-2xl text-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                Store Price: {currentStore.name.split(',')[0]}
              </h3>
              <button
                type="button"
                onClick={() => setShowPriceModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {priceError && (
              <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/40 text-xs text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{priceError}</span>
              </div>
            )}

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Selling Price (₹)</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Floor Promotion Title</label>
              <input
                type="text"
                value={editOfferTitle}
                onChange={(e) => setEditOfferTitle(e.target.value)}
                placeholder="e.g. Weekend Special ₹500 Instant Discount"
                className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPriceModal(false)}
                className="flex-1 py-2.5 rounded-2xl glass-button-secondary text-xs font-semibold text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl glass-button-primary text-xs font-bold text-slate-950 shadow-md transition"
              >
                Update Price
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: ADD ACCESSORY */}
      {showAccessoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in">
          <form
            onSubmit={handleAddAccessory}
            className="w-full max-w-md rounded-3xl glass-panel-elevated p-6 shadow-2xl text-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-400" />
                Add Accessory to Bundle
              </h3>
              <button
                type="button"
                onClick={() => setShowAccessoryModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {accError && (
              <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/40 text-xs text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{accError}</span>
              </div>
            )}

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Accessory Name</label>
              <input
                type="text"
                value={newAccName}
                onChange={(e) => setNewAccName(e.target.value)}
                placeholder="e.g. Non-stick Baking Mat"
                className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Purpose</label>
              <textarea
                value={newAccPurpose}
                onChange={(e) => setNewAccPurpose(e.target.value)}
                rows={2}
                className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAccIsIncluded}
                  onChange={(e) => setNewAccIsIncluded(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-0"
                />
                <span>Included in original box</span>
              </label>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAccessoryModal(false)}
                className="flex-1 py-2.5 rounded-2xl glass-button-secondary text-xs font-semibold text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl glass-button-primary text-xs font-bold text-slate-950 shadow-md transition"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
