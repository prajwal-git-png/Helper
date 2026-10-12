import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Flame,
  Check,
  Plus,
  HelpCircle,
  Palette,
  User,
  Sparkles,
  Lock,
} from 'lucide-react';
import { AppTheme } from '../../types/index';

interface HeaderProps {
  onOpenAddProduct?: () => void;
  onOpenGuide?: () => void;
  onOpenProfile?: () => void;
  onOpenLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddProduct,
  onOpenGuide,
  onOpenProfile,
  onOpenLogin,
}) => {
  const {
    language,
    setLanguage,
    products,
    openPresentation,
    theme,
    setTheme,
    currentUser,
    isAuthenticated,
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const seed29Rcad = products.find((p) => p.modelNumber.includes('29RCAD')) || products[0];

  const themeList: { id: AppTheme; label: string; dot: string }[] = [
    { id: 'obsidian-black', label: 'Obsidian Black (Cream)', dot: 'bg-black border-amber-400' },
    { id: 'cream-dark', label: 'Cream Dark', dot: 'bg-[#09090b] border-[#F5EFEB]' },
    { id: 'pure-black', label: 'Pure OLED Black', dot: 'bg-black border-white/40' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-[#F5EFEB]/10 px-3.5 py-2.5 sm:px-6 transition-all backdrop-blur-2xl text-[#F5EFEB]">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* App Title & Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center font-black font-display text-black text-xs shadow-md shadow-amber-500/20 flex-shrink-0">
            SS
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold font-display text-[#FAF6EE] tracking-tight flex items-center gap-1.5 truncate">
              <span>Smart Sales Promoter</span>
            </h1>
            <div className="text-[10px] text-[#9E9484] truncate">
              Retail Appliance Showroom
            </div>
          </div>
        </div>

        {/* Minimalist Right Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Changer Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowLangMenu(false);
              }}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl glass-button-secondary text-xs font-semibold text-[#D8CFBF] hover:text-[#FAF6EE] active:scale-95 transition flex items-center gap-1.5"
              title="Change Theme"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[11px] capitalize">Theme</span>
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-panel-elevated p-1.5 z-50 animate-in fade-in zoom-in-95 shadow-2xl border border-[#F5EFEB]/15">
                <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-[#9E9484] tracking-wider">
                  Select Theme
                </div>
                {themeList.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full px-2.5 py-2 text-left text-xs font-medium rounded-xl flex items-center justify-between transition ${
                      theme === t.id
                        ? 'bg-amber-500 text-black font-bold'
                        : 'text-[#FAF6EE] hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-2.5 h-2.5 rounded-full border ${t.dot}`} />
                      <span className="truncate">{t.label}</span>
                    </div>
                    {theme === t.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Showroom Launch */}
          {seed29Rcad && (
            <button
              onClick={() => openPresentation(seed29Rcad)}
              className="flex items-center gap-1.5 rounded-2xl glass-button-primary px-3 py-1.5 text-xs font-bold text-black shadow-md active:scale-95 transition"
              title="Launch Fullscreen Customer Presentation"
            >
              <Flame className="w-3.5 h-3.5 fill-black" />
              <span className="hidden sm:inline">Showroom</span>
            </button>
          )}

          {/* Quick Add Product */}
          {onOpenAddProduct && (
            <button
              onClick={onOpenAddProduct}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl glass-button-secondary text-xs font-semibold text-[#D8CFBF] hover:text-[#FAF6EE] active:scale-95 transition"
              title="Add or Edit Products"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Add</span>
            </button>
          )}

          {/* User Guide Button */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl glass-button-secondary text-xs font-semibold text-[#D8CFBF] hover:text-[#FAF6EE] active:scale-95 transition flex items-center gap-1"
              title="How to Use Guide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Guide</span>
            </button>
          )}

          {/* Profile / Login Button */}
          {isAuthenticated ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-2xl glass-button-secondary text-xs font-medium text-[#FAF6EE] active:scale-95 transition"
              title="View Profile & Settings"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden bg-black/60 border border-amber-400/50 flex items-center justify-center">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3 h-3 text-amber-400" />
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold truncate max-w-[80px]">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl glass-button-primary text-xs font-bold text-black active:scale-95 transition"
              title="Sign In"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Minimalist Segmented Language Picker */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowThemeMenu(false);
              }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-2xl glass-button-secondary text-xs font-medium text-[#D8CFBF] active:scale-95 transition"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold uppercase tracking-wider text-[11px]">{language}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl glass-panel-elevated p-1.5 z-50 animate-in fade-in zoom-in-95 shadow-2xl border border-[#F5EFEB]/15">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLangMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-medium rounded-xl flex items-center justify-between transition ${
                    language === 'en'
                      ? 'bg-amber-500 text-black font-bold'
                      : 'text-[#FAF6EE] hover:bg-white/[0.08]'
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setLanguage('kn');
                    setShowLangMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-medium rounded-xl flex items-center justify-between transition ${
                    language === 'kn'
                      ? 'bg-amber-500 text-black font-bold'
                      : 'text-[#FAF6EE] hover:bg-white/[0.08]'
                  }`}
                >
                  <span>ಕನ್ನಡ</span>
                  {language === 'kn' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setLanguage('hi');
                    setShowLangMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-medium rounded-xl flex items-center justify-between transition ${
                    language === 'hi'
                      ? 'bg-amber-500 text-black font-bold'
                      : 'text-[#FAF6EE] hover:bg-white/[0.08]'
                  }`}
                >
                  <span>हिन्दी</span>
                  {language === 'hi' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
