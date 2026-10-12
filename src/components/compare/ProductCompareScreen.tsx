import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types/index';
import {
  ArrowLeftRight,
  Flame,
  Check,
  Trash2,
  Package,
} from 'lucide-react';

export const ProductCompareScreen: React.FC = () => {
  const {
    products,
    compareProductIds,
    toggleCompare,
    clearCompare,
    openPresentation,
    currentStore,
  } = useApp();

  const [compareMode, setCompareMode] = useState<'customer' | 'technical'>('customer');

  const comparedProducts = compareProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const availableToAdd = products.filter(
    (p) => !compareProductIds.includes(p.id)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-amber-400" />
            Product Comparison
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side comparison without unverified claims or skewed values.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* iOS Segmented Mode Switcher */}
          <div className="flex items-center glass-pill p-1 rounded-2xl">
            <button
              onClick={() => setCompareMode('customer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                compareMode === 'customer'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Customer Benefits
            </button>
            <button
              onClick={() => setCompareMode('technical')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                compareMode === 'technical'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Technical Specs
            </button>
          </div>

          {comparedProducts.length > 0 && (
            <button
              onClick={clearCompare}
              className="p-2 rounded-2xl glass-button-secondary text-slate-400 hover:text-red-400 active:scale-95 transition"
              title="Clear comparison list"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {comparedProducts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel space-y-3 shadow-xl">
          <Package className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No models selected for comparison</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Select 2 or more products below to show customers how models compare in capacity, wattage, and cooking options.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {products.slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => toggleCompare(p.id)}
                className="px-3.5 py-1.5 rounded-xl glass-button-secondary text-xs font-semibold text-white active:scale-95 transition"
              >
                + Add {p.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Add more button if < 3 */}
          {comparedProducts.length < 3 && availableToAdd.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Add to compare:</span>
              {availableToAdd.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggleCompare(p.id)}
                  className="px-3 py-1 rounded-xl glass-pill text-amber-400 text-xs font-semibold whitespace-nowrap active:scale-95 transition"
                >
                  + {p.modelNumber}
                </button>
              ))}
            </div>
          )}

          {/* Comparison Cards / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparedProducts.map((p) => {
              const storePrice =
                p.storePrices[currentStore.id] || {
                  sellingPrice: p.defaultSellingPrice,
                  mrp: p.defaultMrp,
                };

              return (
                <div
                  key={p.id}
                  className="rounded-3xl glass-panel overflow-hidden shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 bg-black/40 relative overflow-hidden">
                      <img
                        src={p.heroImage}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => toggleCompare(p.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-slate-400 hover:text-red-400 active:scale-90"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-xl bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400">
                        {p.brandName}
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-white leading-tight">
                          {p.name}
                        </h3>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {p.modelNumber}
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="p-3.5 rounded-2xl glass-pill flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 line-through">
                            MRP ₹{storePrice.mrp.toLocaleString('en-IN')}
                          </div>
                          <div className="text-xl font-black text-amber-400 tracking-tight">
                            ₹{storePrice.sellingPrice.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          {currentStore.name.split(',')[0]}
                        </span>
                      </div>

                      {/* Comparison Details */}
                      {compareMode === 'customer' ? (
                        <div className="space-y-3 text-xs">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-amber-400 uppercase">
                              Best For
                            </span>
                            <p className="text-slate-300 leading-relaxed">
                              {p.customerExplanation}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase">
                              Capacity Examples
                            </span>
                            <p className="text-slate-300">
                              {p.capacityPracticalExamples}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase">
                              Key Selling Points
                            </span>
                            <ul className="space-y-1 text-slate-300">
                              {p.keySellingPoints.slice(0, 2).map((pt, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 text-xs divide-y divide-white/[0.08]">
                          <div className="flex justify-between py-1.5">
                            <span className="text-slate-400">Power Rating</span>
                            <span className="font-bold text-white font-mono">{p.wattage} W</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="text-slate-400">Capacity</span>
                            <span className="font-bold text-amber-400 font-mono">{p.capacityLitres} Litres</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="text-slate-400">Digital Presets</span>
                            <span className="font-bold text-white font-mono">{p.presetMenusCount}</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="text-slate-400">Dimensions</span>
                            <span className="font-bold text-white font-mono">
                              {(p.externalDimensions.widthMm / 10).toFixed(1)} × {(p.externalDimensions.heightMm / 10).toFixed(1)} cm
                            </span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="text-slate-400">Warranty</span>
                            <span className="font-bold text-emerald-400 font-mono">{p.warrantyYears} Years</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Present CTA */}
                  <div className="p-4 border-t border-white/[0.08]">
                    <button
                      onClick={() => openPresentation(p)}
                      className="w-full py-2.5 rounded-2xl glass-button-primary text-slate-950 text-xs font-bold shadow-md active:scale-95 transition flex items-center justify-center gap-1.5"
                    >
                      <Flame className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Present {p.modelNumber}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
