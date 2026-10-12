import React from 'react';
import {
  Flame,
  PackagePlus,
  Ruler,
  ChefHat,
  User,
  HelpCircle,
  ArrowLeftRight,
} from 'lucide-react';

export type TabKey =
  | 'home'
  | 'edit'
  | 'dimensions'
  | 'recipes'
  | 'profile'
  | 'guide'
  | 'compare';

interface BottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { key: 'home' as TabKey, label: 'Showroom', icon: Flame },
    { key: 'edit' as TabKey, label: 'Add / Edit', icon: PackagePlus },
    { key: 'dimensions' as TabKey, label: 'Sizer', icon: Ruler },
    { key: 'recipes' as TabKey, label: 'Recipes', icon: ChefHat },
    { key: 'profile' as TabKey, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-2.5 sm:bottom-4 inset-x-3 sm:inset-x-0 max-w-md mx-auto z-40 select-none">
      <nav className="glass-tab-bar rounded-[26px] p-1.5 px-2 shadow-2xl flex items-center justify-around border border-[#F5EFEB]/15 backdrop-blur-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onTabChange(item.key)}
              className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl min-h-[44px] transition-all duration-200 active:scale-[0.92] ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-[#D8CFBF] hover:text-[#FAF6EE]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform duration-200 ${
                    isActive ? 'scale-110 text-amber-400 fill-amber-400/20' : ''
                  }`}
                />
              </div>
              <span
                className={`text-[9.5px] sm:text-[10px] tracking-tight mt-1 truncate max-w-[55px] text-center select-none font-medium leading-none ${
                  isActive ? 'text-amber-400 font-bold' : 'text-[#D8CFBF]'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-amber-400 mt-1 shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
