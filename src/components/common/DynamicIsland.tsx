import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  Globe,
  Store,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Ruler,
  Wifi,
  BatteryCharging,
  Maximize2,
  Smartphone,
  Sliders,
  Check,
} from 'lucide-react';

interface DynamicIslandProps {
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  onOpenStoreModal: () => void;
  onNavigateTab: (tab: any) => void;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  isPhoneFrame,
  onTogglePhoneFrame,
  onOpenStoreModal,
  onNavigateTab,
}) => {
  const {
    currentStore,
    currentUser,
    userRole,
    products,
    openPresentation,
    language,
    setLanguage,
    t,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);
  const seed29Rcad = products.find((p) => p.modelNumber.includes('29RCAD')) || products[0];

  return (
    <div className="w-full flex justify-center px-3 pt-2 pb-1 relative z-40 select-none">
      {/* Dynamic Island Capsule */}
      <div
        className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] glass-island rounded-[28px] overflow-hidden ${
          isExpanded
            ? 'w-full max-w-md p-4 shadow-2xl'
            : 'h-10 px-3.5 flex items-center justify-between gap-3 shadow-lg hover:border-white/25 cursor-pointer max-w-sm sm:max-w-md w-full'
        }`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {!isExpanded ? (
          /* Compact Dynamic Island Pill State */
          <>
            {/* Left: Store Floor Badge & Live Glow */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-white tracking-tight truncate max-w-[120px] sm:max-w-[150px]">
                {currentStore.name.split(',')[0]}
              </span>
            </div>

            {/* Center: Camera Notch aesthetic with subtle promoter cue */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.08] text-[10px] text-slate-300 font-mono">
              <span className="text-amber-400 font-bold">29RCAD</span>
              <span className="text-slate-400">·</span>
              <span>{t.roles[userRole]}</span>
            </div>

            {/* Right: Quick Launch & Expand Caret */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {seed29Rcad && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPresentation(seed29Rcad);
                  }}
                  className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10.5px] font-bold flex items-center gap-1 active:scale-95 transition shadow-sm"
                  title="Quick Launch Fullscreen Showroom"
                >
                  <Flame className="w-3 h-3 fill-slate-950" />
                  <span className="hidden sm:inline">Showroom</span>
                </button>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </>
        ) : (
          /* Expanded Dynamic Island Stage */
          <div className="space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header row with collapse handle */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white tracking-tight">
                  Floor Dynamic Island
                </span>
                <span className="text-[10px] text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 font-medium">
                  Live Showroom
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePhoneFrame();
                  }}
                  className={`px-2 py-1 rounded-xl text-[10px] font-semibold flex items-center gap-1 border transition ${
                    isPhoneFrame
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-white/[0.06] text-slate-300 border-white/10 hover:text-white'
                  }`}
                  title="Toggle iPhone Frame Frame Mode"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>{isPhoneFrame ? 'Frame: ON' : 'iPhone Frame'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                  title="Collapse"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Context Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStoreModal();
                  setIsExpanded(false);
                }}
                className="p-2.5 rounded-2xl glass-pill hover:bg-white/[0.1] cursor-pointer transition flex items-center gap-2.5"
              >
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold flex-shrink-0">
                  <Store className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400">Store Floor</div>
                  <div className="text-xs font-semibold text-white truncate">
                    {currentStore.name.split(',')[0]}
                  </div>
                </div>
              </div>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStoreModal();
                  setIsExpanded(false);
                }}
                className="p-2.5 rounded-2xl glass-pill hover:bg-white/[0.1] cursor-pointer transition flex items-center gap-2.5"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-xl object-cover border border-white/10 flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400">Promoter</div>
                  <div className="text-xs font-semibold text-white truncate">
                    {currentUser.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Language Segmented Bar */}
            <div className="flex items-center justify-between gap-2 p-1 glass-pill rounded-2xl">
              <span className="text-[11px] text-slate-400 pl-2 font-medium flex items-center gap-1">
                <Globe className="w-3 h-3 text-amber-400" />
                Language:
              </span>
              <div className="flex items-center gap-1">
                {(['en', 'kn', 'hi'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLanguage(lang);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition active:scale-95 ${
                      language === lang
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {lang === 'en' ? 'EN' : lang === 'kn' ? 'ಕನ್ನಡ' : 'हिन्दी'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {seed29Rcad && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                    openPresentation(seed29Rcad);
                  }}
                  className="py-2.5 px-3 rounded-2xl glass-button-primary text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                >
                  <Flame className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Launch Showroom</span>
                </button>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                  onNavigateTab('ai');
                }}
                className="py-2.5 px-3 rounded-2xl glass-button-secondary text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Sales Copilot</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
