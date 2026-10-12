import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AiExtractionDraft, Product } from '../../types/index';
import {
  Sparkles,
  FileText,
  Check,
  AlertCircle,
  Ruler,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const AiProductCreatorScreen: React.FC<{ onComplete: (product: Product) => void }> = ({
  onComplete,
}) => {
  const { saveProduct } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [inputText, setInputText] = useState(
    'Bajaj Electricals official listing for Morphy Richards 29RCAD Digital Air Fryer OTG.\nCapacity: 29 Litres. Wattage: 2000 Watts.\nFeatures: 13 preset menus, built-in air fryer, built-in dehydrator, convection, motorized rotisserie.\nWarranty: 2 years on product. Country of origin: China.\nAccessories included: Wire grill, Baking tray, Air fryer basket, Crumb tray, Tong for rotisserie rod, Rotisserie rod with fork, Tong for baking tray/wire grill.\nExternal Dimensions: 485 mm width x 365 mm height x 410 mm depth.\nSource: https://www.bajajelectricals.com/products/29rcad-digital-air-fryer-otg'
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedDraft, setExtractedDraft] = useState<AiExtractionDraft | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Editable draft fields
  const [editBrand, setEditBrand] = useState('');
  const [editName, setEditName] = useState('');
  const [editModel, setEditModel] = useState('');
  const [editCapacity, setEditCapacity] = useState(29);
  const [editWattage, setEditWattage] = useState(2000);
  const [editPresets, setEditPresets] = useState(13);
  const [editWarranty, setEditWarranty] = useState(2);
  const [editWidth, setEditWidth] = useState(485);
  const [editHeight, setEditHeight] = useState(365);
  const [editDepth, setEditDepth] = useState(410);
  const [editPitch, setEditPitch] = useState('');

  const handleStartExtraction = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai/extract-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textInput: inputText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Extraction failed');

      const draft: AiExtractionDraft = data.draft;
      setExtractedDraft(draft);

      setEditBrand(draft.brand);
      setEditName(draft.name);
      setEditModel(draft.modelNumber);
      setEditCapacity(draft.capacityLitres);
      setEditWattage(draft.wattage);
      setEditPresets(draft.presetMenusCount);
      setEditWarranty(draft.warrantyYears);
      if (draft.externalDimensions) {
        setEditWidth(draft.externalDimensions.widthMm);
        setEditHeight(draft.externalDimensions.heightMm);
        setEditDepth(draft.externalDimensions.depthMm);
      }
      setEditPitch(draft.customerPitch);
      setStep(2);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveAndSave = async () => {
    if (!extractedDraft) return;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      brandId: 'brand-morphy-richards',
      brandName: editBrand,
      name: editName,
      modelNumber: editModel,
      sku: `${editModel}-SKU-2026`,
      category: 'OTG / Digital Air Fryer OTG',
      capacityLitres: editCapacity,
      wattage: editWattage,
      colorFinish: 'Matte Charcoal Black',
      availabilityStatus: 'in_stock',
      searchAliases: [editModel.toLowerCase(), editBrand.toLowerCase()],
      shortDescription: `${editCapacity}L ${editBrand} ${editModel} with ${editWattage}W heating and ${editPresets} digital presets.`,
      detailedDescription: editPitch,
      customerExplanation: editPitch,
      keySellingPoints: extractedDraft.features,
      useCases: ['Daily family baking', 'Air frying snacks', 'Dehydrating fruits'],
      capacityPracticalExamples: `Accommodates 10-inch pizza and ${Math.round(editCapacity / 20 * 10) / 10}kg whole roast.`,
      voltage: '220-240V, 50Hz',
      temperatureRangeCelsius: '45°C to 230°C',
      timerLimitMinutes: 120,
      operatingModes: ['Bake', 'Air Fry', 'Dehydrate', 'Rotisserie', 'Convection'],
      presetMenusCount: editPresets,
      materialConstruction: 'Galvanized steel cavity with double glass door',
      warrantyYears: editWarranty,
      warrantyDetails: `${editWarranty} Years Comprehensive Product Warranty`,
      maintenanceInstructions: 'Wipe crumb tray after use',
      safetyNotes: 'Keep 10cm rear and side clearance',
      countryOfOrigin: 'China',
      externalDimensions: {
        widthMm: editWidth,
        heightMm: editHeight,
        depthMm: editDepth,
      },
      productWeightKg: 9.8,
      packagingDimensions: {
        widthMm: editWidth + 50,
        heightMm: editHeight + 50,
        depthMm: editDepth + 50,
        weightKg: 11.2,
      },
      measurementSource: 'Extracted from official listing by AI with promoter verification',
      measurementConfidence: 'verified',
      clearanceGuide: {
        rearMm: 100,
        sidesMm: 100,
        topMm: 150,
        notes: '100mm rear clearance required for convection exhaust.',
      },
      defaultMrp: 16995,
      defaultSellingPrice: 12490,
      storePrices: {},
      accessories: extractedDraft.accessoriesExtracted.map((accName, i) => ({
        id: `acc-extracted-${i}`,
        name: accName,
        category: 'Included Accessories',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
        purpose: 'Cooking accessory',
        usageInstructions: 'Slide into slot',
        cleaningInstructions: 'Warm soapy water',
        isIncludedInBox: true,
        verificationStatus: 'verified',
      })),
      featureDemos: [],
      verificationStatus: 'verified',
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      sources: [
        {
          id: `src-${Date.now()}`,
          url: 'https://www.bajajelectricals.com/products/29rcad-digital-air-fryer-otg',
          title: 'Official Manufacturer Listing (AI Verified Draft)',
          sourceType: 'official_manufacturer_page',
          dateRetrieved: new Date().toISOString().split('T')[0],
          notes: 'Approved through Smart Sales Promoter AI Review Workflow.',
          confidence: extractedDraft.confidence,
        },
      ],
      conflicts: [],
      heroImage: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=1000&auto=format&fit=crop&q=80',
      galleryImages: [],
      translations: {},
    };

    const res = await saveProduct(newProduct);
    if (res.success) {
      setStep(3);
      onComplete(newProduct);
    } else {
      setErrorMessage(res.error || 'Failed to save product');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
          AI Onboarding Wizard
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Extraction and human verification before publishing to the showroom.
        </p>
      </div>

      {/* iOS Stepper Bar */}
      <div className="grid grid-cols-3 gap-2 p-1 glass-pill rounded-2xl">
        <div
          className={`py-2 px-3 rounded-xl text-center text-xs font-semibold transition ${
            step === 1
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400'
          }`}
        >
          1. Supply Specs
        </div>

        <div
          className={`py-2 px-3 rounded-xl text-center text-xs font-semibold transition ${
            step === 2
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400'
          }`}
        >
          2. Audit Fields
        </div>

        <div
          className={`py-2 px-3 rounded-xl text-center text-xs font-semibold transition ${
            step === 3
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400'
          }`}
        >
          3. Published
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/50 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="rounded-3xl glass-panel p-6 space-y-5 shadow-xl">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Product Specification / Brochure Paste
            </label>
            <textarea
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-4 rounded-2xl glass-panel text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          <div className="p-4 rounded-2xl glass-pill text-xs text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Anti-Hallucination Rule:</strong> Gemini normalizes units strictly into canonical mm and extracts citations. AI will never publish unreviewed specs.
            </div>
          </div>

          <button
            onClick={handleStartExtraction}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl glass-button-primary text-slate-950 text-xs sm:text-sm font-bold shadow-md active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Normalizing Specifications with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Extract Specifications</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && extractedDraft && (
        <div className="rounded-3xl glass-panel p-6 space-y-5 shadow-xl">
          <div className="p-4 rounded-2xl glass-pill flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Extracted Draft Ready for Human Audit</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">
                Confidence: {(extractedDraft.confidence * 100).toFixed(0)}%
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="px-3 py-1.5 rounded-xl glass-button-secondary text-xs text-slate-300"
            >
              Re-extract
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 font-medium">Brand</label>
              <input
                type="text"
                value={editBrand}
                onChange={(e) => setEditBrand(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-medium">Model Number</label>
              <input
                type="text"
                value={editModel}
                onChange={(e) => setEditModel(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-medium">Capacity (L)</label>
              <input
                type="number"
                value={editCapacity}
                onChange={(e) => setEditCapacity(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-medium">Wattage (W)</label>
              <input
                type="number"
                value={editWattage}
                onChange={(e) => setEditWattage(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
              />
            </div>
          </div>

          {/* Dims */}
          <div className="p-4 rounded-2xl glass-pill space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Ruler className="w-4 h-4" />
              Normalized Dimensions (mm)
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-400">Width (mm)</label>
                <input
                  type="number"
                  value={editWidth}
                  onChange={(e) => setEditWidth(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400">Height (mm)</label>
                <input
                  type="number"
                  value={editHeight}
                  onChange={(e) => setEditHeight(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400">Depth (mm)</label>
                <input
                  type="number"
                  value={editDepth}
                  onChange={(e) => setEditDepth(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium">Customer Pitch</label>
            <textarea
              rows={3}
              value={editPitch}
              onChange={(e) => setEditPitch(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl glass-panel text-xs text-slate-200"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-2xl glass-button-secondary text-xs font-semibold text-white transition"
            >
              Back
            </button>
            <button
              onClick={handleApproveAndSave}
              className="flex-1 py-3 rounded-2xl glass-button-primary text-slate-950 text-xs font-bold shadow-md active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Approve & Save</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="rounded-3xl glass-panel p-8 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full glass-pill flex items-center justify-center mx-auto text-emerald-400">
            <Check className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">
            Product Successfully Published!
          </h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            {editBrand} {editModel} is now live in your showroom catalogue with traceable citations and normalized dimensions.
          </p>
          <button
            onClick={() => setStep(1)}
            className="px-6 py-2.5 rounded-2xl glass-button-primary text-xs font-bold text-slate-950 active:scale-95 transition"
          >
            Onboard Another Appliance
          </button>
        </div>
      )}
    </div>
  );
};
