import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types/index';
import {
  Search,
  Eye,
  Flame,
  ArrowLeftRight,
  Package,
  PlusCircle,
} from 'lucide-react';

interface ProductCatalogScreenProps {
  onSelectProduct: (product: Product) => void;
  onOpenCreator: () => void;
}

export const ProductCatalogScreen: React.FC<ProductCatalogScreenProps> = ({
  onSelectProduct,
  onOpenCreator,
}) => {
  const {
    products,
    openPresentation,
    compareProductIds,
    toggleCompare,
    userRole,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const categories = [
    'all',
    'OTG / Digital Air Fryer OTG',
    'Air Fryer',
    'Microwave Ovens',
  ];

  const brands = ['all', 'Morphy Richards', 'Bajaj Electricals', 'Philips'];

  const filtered = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.modelNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.brandName.toLowerCase().includes(search.toLowerCase());

    const matchesCat =
      selectedCategory === 'all' || p.category === selectedCategory;

    const matchesBrand =
      selectedBrand === 'all' || p.brandName === selectedBrand;

    return matchesSearch && matchesCat && matchesBrand;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28">
      {/* Top Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-400" />
            Appliance Catalogue
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified models, specifications, and showroom demonstrations.
          </p>
        </div>

        {/* Action Button: AI Product Creator */}
        {userRole !== 'promoter' && (
          <button
            onClick={onOpenCreator}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-button-primary text-slate-950 text-xs font-bold shadow-md active:scale-95 transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>AI Onboarding</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by model, brand, or features..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl glass-panel text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition shadow-inner"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-2xl glass-panel text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-white">
                {c === 'all' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full px-3 py-2.5 rounded-2xl glass-panel text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            {brands.map((b) => (
              <option key={b} value={b} className="bg-slate-900 text-white">
                {b === 'all' ? 'All Brands' : b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((prod) => {
          const inCompare = compareProductIds.includes(prod.id);
          return (
            <div
              key={prod.id}
              className="rounded-3xl glass-panel overflow-hidden shadow-lg flex flex-col justify-between hover:border-white/20 transition group"
            >
              {/* Product Image Header */}
              <div className="h-48 bg-black/40 relative overflow-hidden">
                <img
                  src={prod.heroImage}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-xl bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-white/10">
                  {prod.brandName}
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-[11px] text-slate-300 flex items-center justify-between">
                  <span>{prod.capacityLitres}L · {prod.wattage}W</span>
                  <span className="text-amber-400 font-mono font-bold">
                    ₹{prod.defaultSellingPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {prod.customerExplanation}
                  </p>
                </div>

                {/* Unboxed Metadata (Zero-pill rule) */}
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <span>{prod.presetMenusCount} Presets</span>
                  <span aria-hidden="true">·</span>
                  <span>{prod.warrantyYears}Y Warranty</span>
                  <span aria-hidden="true">·</span>
                  <span>{prod.externalDimensions.widthMm / 10} cm W</span>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleCompare(prod.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 active:scale-95 transition ${
                      inCompare
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'glass-button-secondary text-slate-300'
                    }`}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>{inCompare ? 'Comparing' : 'Compare'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openPresentation(prod)}
                      className="px-3.5 py-1.5 rounded-xl glass-button-primary text-slate-950 text-xs font-bold active:scale-95 transition flex items-center gap-1"
                    >
                      <Flame className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Show</span>
                    </button>

                    <button
                      onClick={() => onSelectProduct(prod)}
                      className="p-1.5 rounded-xl glass-button-secondary text-slate-300 hover:text-white active:scale-95 transition"
                      title="Inspect Product Specifications"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
