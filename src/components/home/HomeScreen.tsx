import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types/index';
import {
  Flame,
  Search,
  Plus,
  Edit3,
  Eye,
  ArrowRight,
  Ruler,
  ChefHat,
  Package,
  HelpCircle,
  Tag,
  Check,
  Layers,
} from 'lucide-react';
import { TabKey } from '../common/BottomNav';

interface HomeScreenProps {
  onNavigateTab: (tab: TabKey) => void;
  onSelectProduct: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onSelectProduct,
  onEditProduct,
}) => {
  const {
    products,
    openPresentation,
    categories,
    addCategory,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const seed29Rcad = products.find((p) => p.modelNumber.includes('29RCAD')) || products[0];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.modelNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brandName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      selectedCategory === 'all' || p.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleQuickAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await addCategory(newCatName.trim());
    setSelectedCategory(newCatName.trim());
    setNewCatName('');
    setIsAddingCategory(false);
  };

  return (
    <div className="space-y-5 pb-28 max-w-4xl mx-auto px-4 sm:px-6 pt-2 text-[#F5EFEB]">
      {/* Sleek Minimalist Showroom Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black font-display text-[#FAF6EE] tracking-tight flex items-center gap-2">
            <span>Showroom Appliances</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F5EFEB]/10 text-amber-400 font-mono font-bold">
              {products.length}
            </span>
          </h1>
          <p className="text-xs text-[#D8CFBF] mt-0.5">
            Tap any appliance to present full-screen to customers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('edit')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl glass-button-primary text-xs font-bold text-black shadow-md active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Appliance</span>
          </button>
        </div>
      </div>

      {/* iOS Minimalist Search & Dynamic Categories */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9E9484] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search appliances by brand, model or wattage..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-panel text-xs text-[#FAF6EE] placeholder-[#9E9484] focus:outline-none focus:border-amber-400 transition"
          />
        </div>

        {/* Category Pills with Dynamic Addition */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-black font-bold shadow-sm'
                : 'glass-panel text-[#D8CFBF] hover:text-[#FAF6EE]'
            }`}
          >
            All Appliances
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black font-bold shadow-sm'
                  : 'glass-panel text-[#D8CFBF] hover:text-[#FAF6EE]'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Quick Category Adder Pill */}
          {isAddingCategory ? (
            <form onSubmit={handleQuickAddCategory} className="flex items-center gap-1">
              <input
                type="text"
                autoFocus
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name..."
                className="px-2.5 py-1 rounded-xl bg-black/80 border border-amber-400 text-xs text-[#FAF6EE] focus:outline-none w-32"
              />
              <button
                type="submit"
                className="p-1 rounded-lg bg-amber-500 text-black font-bold text-xs"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="p-1 rounded-lg glass-button-secondary text-xs text-[#9E9484]"
              >
                ×
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingCategory(true)}
              className="px-2.5 py-1.5 rounded-xl glass-button-secondary text-xs text-amber-400 font-semibold whitespace-nowrap flex items-center gap-1 hover:text-white"
            >
              <Plus className="w-3 h-3" />
              <span>Category</span>
            </button>
          )}
        </div>
      </div>

      {/* FEATURED SPOTLIGHT CARD */}
      {seed29Rcad && (
        <div className="rounded-[30px] overflow-hidden glass-panel-elevated p-5 sm:p-6 shadow-2xl border border-[#F5EFEB]/15">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Image */}
            <div className="md:col-span-5 h-48 sm:h-52 rounded-2xl overflow-hidden bg-black/60 border border-[#F5EFEB]/15 relative group shadow-md">
              <img
                src={seed29Rcad.heroImage}
                alt={seed29Rcad.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-xl bg-black/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-[#F5EFEB]/10">
                {seed29Rcad.brandName}
              </div>
              <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md text-[10px] text-[#FAF6EE] flex items-center justify-between border border-[#F5EFEB]/10">
                <span>{seed29Rcad.capacityLitres}L · {seed29Rcad.wattage}W</span>
                <span className="text-emerald-400 font-bold">{seed29Rcad.warrantyYears}Y Warranty</span>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-7 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                  Featured Floor Appliance
                </span>
                <h2 className="text-base sm:text-lg font-bold font-display text-[#FAF6EE] mt-0.5 leading-snug">
                  {seed29Rcad.name}
                </h2>
                <p className="text-xs text-[#D8CFBF] mt-1 line-clamp-2 leading-relaxed">
                  {seed29Rcad.customerExplanation}
                </p>
              </div>

              {/* Specs Metadata Line */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#D8CFBF]">
                <span>{seed29Rcad.presetMenusCount} Presets</span>
                <span>·</span>
                <span>Air Fry + Dehydrate</span>
                <span>·</span>
                <span>Motorized Rotisserie</span>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-[#F5EFEB]/10">
                <div>
                  <div className="text-[10px] text-[#9E9484] line-through">
                    MRP ₹{seed29Rcad.defaultMrp.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight font-mono">
                    ₹{seed29Rcad.defaultSellingPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openPresentation(seed29Rcad)}
                    className="flex items-center gap-1.5 rounded-2xl glass-button-primary px-4 py-2.5 text-xs font-bold text-black shadow-md active:scale-95 transition"
                  >
                    <Flame className="w-3.5 h-3.5 fill-black" />
                    <span>Launch Showroom</span>
                  </button>

                  <button
                    onClick={() => onNavigateTab('edit')}
                    className="p-2.5 rounded-2xl glass-button-secondary text-[#D8CFBF] hover:text-[#FAF6EE] active:scale-95 transition"
                    title="Edit Appliance Details"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK FLOOR TOOLS PILLS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <button
          onClick={() => onNavigateTab('dimensions')}
          className="p-3.5 rounded-2xl glass-panel hover:border-amber-400/30 text-left transition active:scale-95 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl glass-button-secondary flex items-center justify-center text-amber-400 flex-shrink-0">
            <Ruler className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold font-display text-[#FAF6EE]">Dimension Sizer</div>
            <div className="text-[10px] text-[#9E9484] truncate">Check kitchen counter fit</div>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('recipes')}
          className="p-3.5 rounded-2xl glass-panel hover:border-amber-400/30 text-left transition active:scale-95 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl glass-button-secondary flex items-center justify-center text-amber-400 flex-shrink-0">
            <ChefHat className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold font-display text-[#FAF6EE]">Visual Recipes</div>
            <div className="text-[10px] text-[#9E9484] truncate">With live cooking timers</div>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('guide')}
          className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl glass-panel hover:border-amber-400/30 text-left transition active:scale-95 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl glass-button-secondary flex items-center justify-center text-amber-400 flex-shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold font-display text-[#FAF6EE]">User Guide</div>
            <div className="text-[10px] text-[#9E9484] truncate">Clear 4-step instructions</div>
          </div>
        </button>
      </div>

      {/* APPLIANCES CATALOG GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold font-display text-[#FAF6EE]">
            Available Appliances ({filteredProducts.length})
          </h2>
          <button
            onClick={() => onNavigateTab('edit')}
            className="text-xs text-amber-400 hover:text-white font-semibold flex items-center gap-1"
          >
            <span>+ Add New Appliance</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="rounded-3xl glass-panel overflow-hidden shadow-lg flex flex-col justify-between hover:border-[#F5EFEB]/25 transition group border border-[#F5EFEB]/10"
            >
              {/* Image */}
              <div className="h-40 bg-black/60 relative overflow-hidden">
                <img
                  src={prod.heroImage}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-xl bg-black/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-[#F5EFEB]/10">
                  {prod.brandName}
                </div>
                <div className="absolute bottom-2 left-2.5 right-2.5 px-2.5 py-0.5 rounded-xl bg-black/80 backdrop-blur-md text-[10px] text-[#FAF6EE] flex items-center justify-between border border-[#F5EFEB]/10">
                  <span>{prod.capacityLitres}L · {prod.wattage}W</span>
                  <span className="text-amber-400 font-mono font-bold">
                    ₹{prod.defaultSellingPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold font-display text-[#FAF6EE] leading-snug line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-[11px] text-[#D8CFBF] mt-0.5 line-clamp-2 leading-relaxed">
                    {prod.customerExplanation}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F5EFEB]/10 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => openPresentation(prod)}
                    className="flex-1 py-2 rounded-xl glass-button-primary text-black text-xs font-bold active:scale-95 transition flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Flame className="w-3.5 h-3.5 fill-black" />
                    <span>Showroom</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onEditProduct) onEditProduct(prod);
                      else onNavigateTab('edit');
                    }}
                    className="p-2 rounded-xl glass-button-secondary text-[#D8CFBF] hover:text-[#FAF6EE] active:scale-95 transition"
                    title="Edit product details"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <button
                    onClick={() => onSelectProduct(prod)}
                    className="p-2 rounded-xl glass-button-secondary text-[#D8CFBF] hover:text-[#FAF6EE] active:scale-95 transition"
                    title="View Technical Specifications"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
