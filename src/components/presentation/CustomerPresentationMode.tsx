import React, { useState } from 'react';
import { Product, FeatureDemo } from '../../types/index';
import { useApp } from '../../context/AppContext';
import {
  formatValue,
  convertLength,
  DimensionUnit,
} from '../../utils/dimensionConverter';
import {
  X,
  ShieldCheck,
  Zap,
  Sparkles,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
  Info,
  Package,
  ChefHat,
  Ruler,
  HelpCircle,
  PlusCircle,
  Flame,
} from 'lucide-react';

interface PresentationModeProps {
  product: Product;
  onExit: () => void;
}

export const CustomerPresentationMode: React.FC<PresentationModeProps> = ({
  product,
  onExit,
}) => {
  const { language, setLanguage, t, recipes } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'demos' | 'accessories' | 'dimensions' | 'recipes' | 'specs'
  >('overview');

  const [dimensionUnit, setDimensionUnit] = useState<DimensionUnit>('cm');
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  // Multilingual translations fallback
  const translation = product.translations[language as 'kn' | 'hi'];
  const displayName = translation?.name || product.name;
  const customerPitch =
    translation?.customerExplanation || product.customerExplanation;
  const keyPoints =
    translation?.keySellingPoints || product.keySellingPoints;
  const capacityExamples =
    translation?.capacityExamples || product.capacityPracticalExamples;
  const commonObjections = translation?.commonObjections || [];

  // Dimensions formatted in current unit
  const w = formatValue(
    convertLength(product.externalDimensions.widthMm, 'mm', dimensionUnit),
    dimensionUnit
  );
  const h = formatValue(
    convertLength(product.externalDimensions.heightMm, 'mm', dimensionUnit),
    dimensionUnit
  );
  const d = formatValue(
    convertLength(product.externalDimensions.depthMm, 'mm', dimensionUnit),
    dimensionUnit
  );

  // Gallery images
  const allImages = [
    product.heroImage,
    ...product.galleryImages.map((g) => g.url),
  ];

  // Compatible recipes
  const compatibleRecipes = recipes.filter(
    (r) =>
      r.compatibleModelNumbers.includes(product.modelNumber) ||
      r.compatibleModelNumbers.some((m) => product.modelNumber.includes(m))
  );

  const activeDemo: FeatureDemo | undefined = product.featureDemos[selectedDemoIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black text-[#F5EFEB] flex flex-col overflow-y-auto selection:bg-amber-500 selection:text-black font-sans">
      {/* Ambient iOS Background Glow (Warm Champagne & Gold on Black) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-amber-500/15 via-orange-600/8 to-transparent rounded-full blur-3xl opacity-70" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl" />
      </div>

      {/* iOS Floating Frosted Glass Header */}
      <header className="sticky top-0 z-30 glass-panel border-b border-white/[0.08] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl glass-button-primary flex items-center justify-center shadow-md flex-shrink-0">
            <Flame className="w-4 h-4 fill-slate-950 text-slate-950" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-amber-400">
                {product.brandName}
              </span>
              <span aria-hidden="true">·</span>
              <span>2 Year Bajaj Warranty</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {displayName}
            </h1>
          </div>
        </div>

        {/* Minimalist Header Controls */}
        <div className="flex items-center gap-2">
          {/* iOS Segmented Language Picker */}
          <div className="flex items-center glass-pill p-0.5 rounded-2xl">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition ${
                language === 'en'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('kn')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition ${
                language === 'kn'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ಕನ್ನಡ
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition ${
                language === 'hi'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Close / Return Button */}
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl glass-button-secondary text-slate-300 hover:text-white text-xs font-semibold active:scale-95 transition"
            title="Exit Customer Presentation Mode"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      {/* iOS Segmented Navigation Bar */}
      <div className="sticky top-[57px] z-20 glass-panel border-b border-white/[0.08] px-3 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-3xl mx-auto flex items-center justify-between sm:justify-center gap-1 p-1 glass-pill rounded-2xl">
          {[
            { key: 'overview', label: 'Overview', icon: Sparkles },
            { key: 'demos', label: 'Features', icon: Flame },
            { key: 'accessories', label: 'In The Box', icon: Package },
            { key: 'dimensions', label: 'Size & Fit', icon: Ruler },
            { key: 'recipes', label: 'Recipes', icon: ChefHat },
            { key: 'specs', label: 'Specs', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'fill-slate-950' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Presentation Viewport */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-24 space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Hero Glass Card & Stage */}
            <div className="relative rounded-3xl overflow-hidden glass-panel-elevated shadow-2xl">
              <div className="relative h-64 sm:h-96 w-full bg-black/40 flex items-center justify-center">
                <img
                  src={allImages[activeImageIndex]}
                  alt={displayName}
                  className="w-full h-full object-cover sm:object-contain transition-all duration-300"
                />
                <button
                  onClick={() => setIsFullscreenImage(true)}
                  className="absolute bottom-3 right-3 p-2 rounded-2xl glass-button-secondary text-white transition active:scale-90"
                  title="Fullscreen preview"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex(
                          (prev) => (prev - 1 + allImages.length) % allImages.length
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass-button-secondary text-white transition active:scale-90"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) => (prev + 1) % allImages.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass-button-secondary text-white transition active:scale-90"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Row */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 p-3 bg-black/40 border-t border-white/[0.08] overflow-x-auto no-scrollbar">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition active:scale-95 ${
                        activeImageIndex === idx
                          ? 'border-amber-400 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Primary Metadata */}
            <div className="rounded-3xl glass-panel p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  {product.category}
                </div>
                <div className="text-2xl font-black text-white mt-0.5">
                  {product.modelNumber}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  2000W High Heat · 29 Litres · 13 Presets
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 line-through">
                  MRP ₹{product.defaultMrp.toLocaleString('en-IN')}
                </div>
                <div className="text-3xl font-black text-amber-400 tracking-tight">
                  ₹{product.defaultSellingPrice.toLocaleString('en-IN')}
                </div>
                <div className="text-xs font-semibold text-emerald-400 mt-0.5">
                  Save ₹{(product.defaultMrp - product.defaultSellingPrice).toLocaleString('en-IN')} Today
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl glass-panel text-center">
                <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <div className="text-[11px] text-slate-400">Wattage</div>
                <div className="text-sm font-bold text-white mt-0.5">{product.wattage} W</div>
              </div>

              <div className="p-4 rounded-2xl glass-panel text-center">
                <Package className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                <div className="text-[11px] text-slate-400">Capacity</div>
                <div className="text-sm font-bold text-white mt-0.5">{product.capacityLitres} Litres</div>
              </div>

              <div className="p-4 rounded-2xl glass-panel text-center">
                <Sparkles className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <div className="text-[11px] text-slate-400">Preset Menus</div>
                <div className="text-sm font-bold text-white mt-0.5">{product.presetMenusCount} Presets</div>
              </div>

              <div className="p-4 rounded-2xl glass-panel text-center">
                <ShieldCheck className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-[11px] text-slate-400">Warranty</div>
                <div className="text-sm font-bold text-white mt-0.5">{product.warrantyYears} Years Total</div>
              </div>
            </div>

            {/* Customer Pitch Card */}
            <div className="rounded-3xl glass-panel p-6 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Customer Introduction
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                {customerPitch}
              </p>
            </div>

            {/* Practical Capacity Guide */}
            <div className="rounded-3xl glass-panel p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                  Practical Capacity Guide
                </h2>
                <span className="text-xs text-slate-400">Gross: 29 Litres</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {capacityExamples}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="p-3 rounded-2xl glass-pill text-center">
                  <div className="text-sm font-bold text-amber-400">10-Inch</div>
                  <div className="text-[10.5px] text-slate-400 mt-0.5">Round Pizza</div>
                </div>
                <div className="p-3 rounded-2xl glass-pill text-center">
                  <div className="text-sm font-bold text-amber-400">1.5 kg</div>
                  <div className="text-[10.5px] text-slate-400 mt-0.5">Whole Chicken</div>
                </div>
                <div className="p-3 rounded-2xl glass-pill text-center">
                  <div className="text-sm font-bold text-amber-400">12 Muffins</div>
                  <div className="text-[10.5px] text-slate-400 mt-0.5">Cupcake Tray</div>
                </div>
                <div className="p-3 rounded-2xl glass-pill text-center">
                  <div className="text-sm font-bold text-amber-400">4 Slices</div>
                  <div className="text-[10.5px] text-slate-400 mt-0.5">Crisp Toast</div>
                </div>
              </div>
            </div>

            {/* Key Customer Benefits */}
            <div className="rounded-3xl glass-panel p-6 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Key Customer Benefits
              </h2>
              <div className="space-y-2">
                {keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Objections & Clarifications */}
            {commonObjections.length > 0 && (
              <div className="rounded-3xl glass-panel p-6 space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  Common Questions
                </h2>
                <div className="space-y-2.5">
                  {commonObjections.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl glass-pill space-y-1">
                      <div className="text-xs font-semibold text-amber-300">
                        {item.objection}
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed">
                        {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CAPABILITY DEMONSTRATIONS */}
        {activeTab === 'demos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Demo Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {product.featureDemos.map((demo, idx) => (
                <button
                  key={demo.id}
                  onClick={() => setSelectedDemoIndex(idx)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                    selectedDemoIndex === idx
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'glass-pill text-slate-300 hover:text-white'
                  }`}
                >
                  {demo.title}
                </button>
              ))}
            </div>

            {activeDemo && (
              <div className="rounded-3xl glass-panel overflow-hidden shadow-2xl space-y-6">
                <div className="relative h-56 sm:h-72 w-full bg-black/40">
                  <img
                    src={activeDemo.demoImages[0] || product.heroImage}
                    alt={activeDemo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-black/40 to-transparent flex flex-col justify-end p-6">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      Verified Demonstration
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                      {activeDemo.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-6 -mt-4">
                  {/* Two column explanation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl glass-pill space-y-1">
                      <div className="text-xs font-bold text-amber-400 uppercase">
                        Operating Principle
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activeDemo.explanation}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl glass-pill space-y-1">
                      <div className="text-xs font-bold text-emerald-400 uppercase">
                        Customer Value
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activeDemo.customerBenefit}
                      </p>
                    </div>
                  </div>

                  {/* Settings card */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] text-amber-300 font-semibold uppercase">
                        Recommended Preset
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {activeDemo.recommendedSetting}
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black shadow-sm">
                      {activeDemo.operatingMode}
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Step-by-Step Floor Demonstration Guide
                    </h4>
                    <div className="space-y-2">
                      {activeDemo.steps.map((st, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3.5 rounded-2xl glass-pill flex items-start gap-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {st.stepNumber}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{st.title}</div>
                            <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                              {st.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl glass-pill text-xs text-slate-400 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Safety & Hygiene Note:</strong> {activeDemo.safetyNotes}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: IN THE BOX */}
        {activeTab === 'accessories' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                What&apos;s Included in the Box
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every listed accessory is supplied inside the original package with zero hidden charges.
              </p>
            </div>

            {/* Included Accessories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.accessories
                .filter((a) => a.isIncludedInBox)
                .map((acc) => (
                  <div
                    key={acc.id}
                    className="rounded-3xl glass-panel overflow-hidden shadow-md flex flex-col justify-between"
                  >
                    <div className="h-40 bg-black/40 relative overflow-hidden">
                      <img
                        src={acc.image}
                        alt={acc.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-slate-950 text-[10px] font-bold uppercase shadow-sm">
                        Included
                      </span>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h3 className="text-sm font-bold text-white">{acc.name}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {acc.purpose}
                      </p>
                      <div className="text-[11px] text-amber-400/90 font-mono pt-1">
                        Usage: {acc.usageInstructions}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Optional Accessories */}
            {product.accessories.some((a) => !a.isIncludedInBox) && (
              <div className="pt-4 space-y-3">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4" />
                  Optional Upgrades & Add-ons (Sold Separately)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.accessories
                    .filter((a) => !a.isIncludedInBox)
                    .map((acc) => (
                      <div
                        key={acc.id}
                        className="rounded-3xl glass-panel p-4 flex gap-3.5"
                      >
                        <img
                          src={acc.image}
                          alt={acc.name}
                          className="w-20 h-20 rounded-2xl object-cover border border-white/10"
                        />
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] text-amber-400 font-bold uppercase">
                            Optional Add-on
                          </span>
                          <h4 className="text-xs font-bold text-white">{acc.name}</h4>
                          <p className="text-[11px] text-slate-300">{acc.purpose}</p>
                          {acc.optionalPrice && (
                            <div className="text-xs font-black text-amber-400 pt-0.5">
                              ₹{acc.optionalPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DIMENSIONS & KITCHEN FIT */}
        {activeTab === 'dimensions' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Unit Switcher */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Physical Dimensions
                </h2>
                <p className="text-xs text-slate-400">
                  Switch units instantly to verify customer kitchen measurements.
                </p>
              </div>

              <div className="flex items-center glass-pill p-1 rounded-2xl">
                {(['cm', 'in', 'mm', 'ft'] as DimensionUnit[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => setDimensionUnit(u)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition active:scale-95 ${
                      dimensionUnit === u
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-3xl glass-panel text-center">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Width</span>
                <div className="text-xl sm:text-2xl font-black text-white mt-1">
                  {w} {dimensionUnit}
                </div>
              </div>

              <div className="p-4 rounded-3xl glass-panel text-center">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Height</span>
                <div className="text-xl sm:text-2xl font-black text-white mt-1">
                  {h} {dimensionUnit}
                </div>
              </div>

              <div className="p-4 rounded-3xl glass-panel text-center">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Depth</span>
                <div className="text-xl sm:text-2xl font-black text-white mt-1">
                  {d} {dimensionUnit}
                </div>
              </div>
            </div>

            {/* Visual Counter Fit Simulator */}
            <div className="rounded-3xl glass-panel p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-amber-400" />
                  Kitchen Countertop Fit Visualizer
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  Illustrative Reference Only
                </span>
              </div>

              <div className="relative h-48 w-full bg-black/40 rounded-2xl border border-white/[0.08] p-4 flex flex-col justify-end overflow-hidden">
                {/* 60cm Countertop Surface */}
                <div className="h-6 w-full bg-gradient-to-r from-stone-800 to-stone-700 rounded-lg relative shadow-inner">
                  <div className="absolute -top-5 left-2 text-[10px] font-mono text-stone-400">
                    Standard Kitchen Countertop (60 cm / 24 inch depth)
                  </div>
                </div>

                {/* Scaled Appliance Box */}
                <div
                  style={{ width: '60%', height: '70%' }}
                  className="absolute bottom-6 left-6 rounded-2xl glass-panel-elevated border-2 border-amber-400/80 shadow-2xl flex flex-col items-center justify-center p-2 text-center"
                >
                  <span className="text-xs font-bold text-white">
                    {product.name}
                  </span>
                  <span className="text-[11px] font-mono text-amber-300 mt-0.5">
                    {w} × {h} × {d} {dimensionUnit}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-semibold mt-1">
                    ✓ Fits standard 60cm kitchen slab comfortably
                  </span>
                </div>

                {/* 10-inch plate reference */}
                <div className="absolute bottom-6 right-8 w-20 h-20 rounded-full border border-dashed border-sky-400/80 bg-sky-400/10 flex items-center justify-center text-center p-1">
                  <span className="text-[9px] font-bold text-sky-300 leading-tight">
                    10-inch Plate
                  </span>
                </div>
              </div>

              {/* Clearance guidance */}
              <div className="grid grid-cols-3 gap-2.5 text-center pt-2">
                <div className="p-3 rounded-2xl glass-pill">
                  <div className="text-[10.5px] text-slate-400">Rear Clearance</div>
                  <div className="text-xs font-bold text-amber-400 mt-0.5">10 cm (100 mm)</div>
                </div>
                <div className="p-3 rounded-2xl glass-pill">
                  <div className="text-[10.5px] text-slate-400">Side Clearance</div>
                  <div className="text-xs font-bold text-amber-400 mt-0.5">10 cm (100 mm)</div>
                </div>
                <div className="p-3 rounded-2xl glass-pill">
                  <div className="text-[10.5px] text-slate-400">Top Clearance</div>
                  <div className="text-xs font-bold text-amber-400 mt-0.5">15 cm (150 mm)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: RECIPES */}
        {activeTab === 'recipes' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-400" />
                Tested Recipes for this Model
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Demonstrated recipes verified for optimal results on the {product.modelNumber}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {compatibleRecipes.map((rcp) => (
                <div
                  key={rcp.id}
                  className="rounded-3xl glass-panel overflow-hidden shadow-lg flex flex-col justify-between"
                >
                  <div className="h-44 bg-black/40 relative overflow-hidden">
                    <img
                      src={rcp.finishedImage}
                      alt={rcp.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-bold">
                      {rcp.category}
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-mono">
                      {rcp.cookingTimeMinutes} mins · {rcp.temperatureCelsius}°C
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {rcp.title}
                    </h3>
                    <div className="text-xs text-slate-300">
                      Accessories: {rcp.accessoriesNeeded.join(', ')}
                    </div>
                    <div className="p-2.5 rounded-xl glass-pill text-[11px] text-amber-300/90 italic">
                      💡 {rcp.proTips}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SPECS & AUDIT */}
        {activeTab === 'specs' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Verified Technical Specifications
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every specification is audited and traceable to official manufacturer listings.
              </p>
            </div>

            <div className="rounded-3xl glass-panel overflow-hidden divide-y divide-white/[0.08] text-xs">
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-400">Brand</span>
                <span className="font-bold text-white">{product.brandName}</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-400">Model Number</span>
                <span className="font-bold text-white font-mono">{product.modelNumber}</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-400">Wattage</span>
                <span className="font-bold text-white font-mono">{product.wattage} W</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-400">Gross Capacity</span>
                <span className="font-bold text-white font-mono">{product.capacityLitres} Litres</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-400">Temperature Range</span>
                <span className="font-bold text-white font-mono">{product.temperatureRangeCelsius}</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-400">Warranty</span>
                <span className="font-bold text-emerald-400">{product.warrantyDetails}</span>
              </div>
            </div>

            <div className="rounded-3xl glass-panel p-6 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Official Traceable Documentation
              </h3>
              <div className="space-y-2">
                {product.sources.map((src) => (
                  <div
                    key={src.id}
                    className="p-3 rounded-2xl glass-pill space-y-1 text-xs"
                  >
                    <div className="font-bold text-amber-400">{src.title}</div>
                    <div className="text-slate-400 text-[11px] font-mono break-all">
                      {src.url}
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      Retrieved on {src.dateRetrieved} · Confidence: {(src.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Fullscreen Image Overlay */}
      {isFullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-center items-center p-4">
          <button
            onClick={() => setIsFullscreenImage(false)}
            className="absolute top-4 right-4 p-2 rounded-full glass-button-secondary text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={allImages[activeImageIndex]}
            alt={displayName}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl"
          />
        </div>
      )}
    </div>
  );
};
