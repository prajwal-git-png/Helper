import React from 'react';
import {
  HelpCircle,
  Flame,
  PackagePlus,
  Ruler,
  ChefHat,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Clock,
} from 'lucide-react';

interface UserGuideScreenProps {
  onNavigateTab: (tab: any) => void;
}

export const UserGuideScreen: React.FC<UserGuideScreenProps> = ({ onNavigateTab }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-5 space-y-6 pb-28">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
          <HelpCircle className="w-6 h-6 text-amber-400" />
          Simple Showroom Guide
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          A quick, straightforward walkthrough of the 4 core floor tools.
        </p>
      </div>

      {/* 4 Step Cards */}
      <div className="space-y-4">
        {/* Step 1: Customer Showroom */}
        <div className="p-5 rounded-3xl glass-panel space-y-3.5 border border-white/10 hover:border-amber-400/30 transition shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl glass-button-primary flex items-center justify-center font-bold text-slate-950 text-xs shadow-sm">
                1
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                  Launch Customer Showroom Mode
                </h2>
                <div className="text-[11px] text-amber-400/90 font-medium">
                  Full-screen presentation designed for customers
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('home')}
              className="text-xs text-amber-400 hover:text-white font-semibold flex items-center gap-1 active:scale-95 transition"
            >
              <span>Try Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Tap <strong>Launch Showroom</strong> on any appliance to open a clean, full-screen customer presentation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span className="text-slate-300">Switch to <strong>ಕನ್ನಡ</strong> or <strong>हिन्दी</strong></span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-slate-300">Feature Demos (Dehydrator, Air Fry)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-300">Unboxed accessories checklist</span>
            </div>
          </div>
        </div>

        {/* Step 2: Add & Edit Products */}
        <div className="p-5 rounded-3xl glass-panel space-y-3.5 border border-white/10 hover:border-amber-400/30 transition shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl glass-button-primary flex items-center justify-center font-bold text-slate-950 text-xs shadow-sm">
                2
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <PackagePlus className="w-4 h-4 text-amber-400" />
                  Add or Edit Appliance Details
                </h2>
                <div className="text-[11px] text-amber-400/90 font-medium">
                  Direct control over photos, wattage, prices & features
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('edit')}
              className="text-xs text-amber-400 hover:text-white font-semibold flex items-center gap-1 active:scale-95 transition"
            >
              <span>Add / Edit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Need to update incorrect specifications or add a new brand model? Go to the <strong>Add / Edit</strong> tab:
          </p>

          <ul className="space-y-1.5 text-xs text-slate-300 pl-1">
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              <span><strong>Custom Images:</strong> Paste your own photo URLs to showcase appliances and accessories.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              <span><strong>Power & Dimensions:</strong> Set exact wattage (e.g. 2000W), capacity (29L), and dimensions in cm.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              <span><strong>Features & In-Box Items:</strong> Add or remove features and accessories with a single tap.</span>
            </li>
          </ul>
        </div>

        {/* Step 3: Dimension Sizer */}
        <div className="p-5 rounded-3xl glass-panel space-y-3.5 border border-white/10 hover:border-amber-400/30 transition shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl glass-button-primary flex items-center justify-center font-bold text-slate-950 text-xs shadow-sm">
                3
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-amber-400" />
                  Dimension Sizer Engine
                </h2>
                <div className="text-[11px] text-amber-400/90 font-medium">
                  Check customer countertop & cavity fit instantly
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('dimensions')}
              className="text-xs text-amber-400 hover:text-white font-semibold flex items-center gap-1 active:scale-95 transition"
            >
              <span>Open Sizer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Solve customer hesitation about kitchen counter space with mathematically exact conversions:
          </p>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs text-slate-300 space-y-1">
            <div className="text-amber-400 font-bold">Standard Conversion Standard:</div>
            <div>• 1 inch = 2.54 cm = 25.4 mm</div>
            <div>• Simultaneous matrix shows cm, inches, mm, feet, and metres side-by-side.</div>
            <div>• Countertop clearance indicator verifies 10cm rear and top heat ventilation.</div>
          </div>
        </div>

        {/* Step 4: Recipes & Timers */}
        <div className="p-5 rounded-3xl glass-panel space-y-3.5 border border-white/10 hover:border-amber-400/30 transition shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl glass-button-primary flex items-center justify-center font-bold text-slate-950 text-xs shadow-sm">
                4
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4 text-amber-400" />
                  Visual Recipes & Cooking Timers
                </h2>
                <div className="text-[11px] text-amber-400/90 font-medium">
                  Demonstrate cooking modes on the floor
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('recipes')}
              className="text-xs text-amber-400 hover:text-white font-semibold flex items-center gap-1 active:scale-95 transition"
            >
              <span>Recipes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Open any recipe (Tandoori Paneer, Dehydrated Kiwi, Rotisserie Chicken) to view step-by-step instructions, recommended accessories, and an <strong>interactive live cooking timer</strong> with a built-in alarm chime!
          </p>
        </div>
      </div>

      {/* Quick Summary Banner */}
      <div className="p-4 rounded-2xl glass-pill flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-slate-300">
            Single-user floor mode enabled: everything saves directly without role limits.
          </span>
        </div>
      </div>
    </div>
  );
};
