import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppTheme } from '../../types/index';
import {
  User,
  Palette,
  Layers,
  HardDrive,
  LogOut,
  Sparkles,
  Check,
  Plus,
  Trash2,
  ShieldCheck,
  Download,
  Upload,
  Edit2,
  Store,
  Mail,
  Smartphone,
  Info,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    logout,
    theme,
    setTheme,
    categories,
    addCategory,
    deleteCategory,
    products,
    refreshData,
  } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [storeName, setStoreName] = useState(currentUser.storeId || 'Indiranagar Flagship, BLR');
  const [email, setEmail] = useState(currentUser.email || 'promoter@showroom.in');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');

  const [newCatInput, setNewCatInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      storeId: storeName.trim(),
      avatar: avatar.trim() || currentUser.avatar,
    });
    setIsEditingProfile(false);
    setFeedback('Profile updated successfully!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    await addCategory(newCatInput.trim());
    setFeedback(`Category "${newCatInput.trim()}" added to Showroom!`);
    setNewCatInput('');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleExportData = () => {
    const dataToExport = {
      products,
      categories,
      exportedAt: new Date().toISOString(),
      user: currentUser,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `showroom-catalog-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setFeedback('Catalog JSON exported successfully!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const themeOptions: {
    id: AppTheme;
    title: string;
    description: string;
    bgPreview: string;
    accentPreview: string;
  }[] = [
    {
      id: 'obsidian-black',
      title: 'Obsidian Black & Cream',
      description: 'True black backdrop, warm cream text and champagne specular accents.',
      bgPreview: 'bg-[#000000]',
      accentPreview: 'border-amber-400/80 text-[#F5EFEB]',
    },
    {
      id: 'cream-dark',
      title: 'Cream Charcoal Dark',
      description: 'Charcoal black base with soft ivory cream surfaces and warm glow.',
      bgPreview: 'bg-[#09090b]',
      accentPreview: 'border-[#F5EFEB]/40 text-[#FAF6EE]',
    },
    {
      id: 'pure-black',
      title: 'Pure OLED Black',
      description: '100% pitch black with frosted black glass and fine cream borders.',
      bgPreview: 'bg-black',
      accentPreview: 'border-[#F5EFEB]/30 text-[#D8CFBF]',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-6 pb-28 text-[#F5EFEB]">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black font-display text-[#FAF6EE] tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <span>Profile & Settings</span>
          </h1>
          <p className="text-xs text-[#D8CFBF] mt-0.5">
            Manage your promoter profile, themes, categories, and permanent storage.
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl glass-button-secondary text-xs font-semibold text-rose-300 hover:text-rose-200 transition active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. User Profile Card */}
      <div className="rounded-[28px] glass-panel-elevated p-5 sm:p-6 border border-[#F5EFEB]/15 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black/60 border border-[#F5EFEB]/20 flex items-center justify-center flex-shrink-0 shadow-md">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-amber-400" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black" />
            </div>

            <div>
              <h2 className="text-base font-bold font-display text-[#FAF6EE]">
                {currentUser.name}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-400 font-semibold border border-amber-400/30">
                  Floor Promoter
                </span>
                <span className="text-xs text-[#D8CFBF] truncate">
                  {currentUser.storeId || 'Showroom Store'}
                </span>
              </div>
              <div className="text-[11px] text-[#9E9484] mt-1 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>{currentUser.email}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="p-2 rounded-xl glass-button-secondary text-[#D8CFBF] hover:text-[#FAF6EE] transition"
            title="Edit Profile"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Inline Edit Profile Form */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="mt-5 pt-4 border-t border-[#F5EFEB]/10 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#D8CFBF] font-semibold">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#D8CFBF] font-semibold">Store / Showroom</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#D8CFBF] font-semibold">Avatar Image URL</label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3 py-1.5 rounded-xl glass-button-secondary text-xs text-[#D8CFBF]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl glass-button-primary text-xs font-bold text-black"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. Theme Changer Section */}
      <div className="rounded-[28px] glass-panel-elevated p-5 sm:p-6 border border-[#F5EFEB]/15 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold font-display text-[#FAF6EE] flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Theme & Aesthetic</span>
            </h2>
            <p className="text-xs text-[#D8CFBF] mt-0.5">
              Black theme with warm cream typography & liquid glass (no blue gradient).
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#F5EFEB]/10 text-amber-400">
            Active: {theme}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themeOptions.map((t) => {
            const isActive = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 active:scale-95 flex flex-col justify-between ${
                  isActive
                    ? 'border-amber-400 bg-black/80 shadow-lg shadow-amber-500/10'
                    : 'border-[#F5EFEB]/10 bg-black/40 hover:border-[#F5EFEB]/25'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-5 h-5 rounded-full bg-black border-2 border-amber-400 flex items-center justify-center">
                    {isActive && <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />}
                  </div>
                  {isActive && (
                    <span className="text-[10px] font-bold text-amber-400">Active</span>
                  )}
                </div>

                <div>
                  <div className="text-xs font-bold font-display text-[#FAF6EE]">{t.title}</div>
                  <div className="text-[10.5px] text-[#D8CFBF] mt-1 leading-snug">
                    {t.description}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#F5EFEB]/10 flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-black border border-[#F5EFEB]/30" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F5EFEB] border border-black/40" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Category Manager Section */}
      <div className="rounded-[28px] glass-panel-elevated p-5 sm:p-6 border border-[#F5EFEB]/15 shadow-xl space-y-4">
        <div>
          <h2 className="text-sm font-bold font-display text-[#FAF6EE] flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Manage Showroom Categories</span>
          </h2>
          <p className="text-xs text-[#D8CFBF] mt-0.5">
            Add any category you need. New categories immediately appear on the showroom floor filter and product builder.
          </p>
        </div>

        {/* Add Category Input */}
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <input
            type="text"
            value={newCatInput}
            onChange={(e) => setNewCatInput(e.target.value)}
            placeholder="Type any category (e.g. Dishwasher, Coffee Machine, Blender)..."
            className="flex-1 px-3.5 py-2.5 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] placeholder-[#9E9484] focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl glass-button-primary text-xs font-bold text-black active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </form>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <div
              key={cat}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE]"
            >
              <span>{cat}</span>
              <button
                type="button"
                onClick={() => deleteCategory(cat)}
                className="text-[#9E9484] hover:text-rose-400 transition"
                title={`Remove ${cat}`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Permanent Storage & Device Health */}
      <div className="rounded-[28px] glass-panel-elevated p-5 sm:p-6 border border-[#F5EFEB]/15 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold font-display text-[#FAF6EE] flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Permanent Storage & Restart Safety</span>
            </h2>
            <p className="text-xs text-[#D8CFBF] mt-0.5">
              All appliances, uploaded images, and custom specs are stored permanently on disk & browser storage.
            </p>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-black/40 border border-[#F5EFEB]/10">
            <div className="text-[10px] text-[#9E9484] font-semibold">Appliances Saved</div>
            <div className="text-lg font-black font-mono text-[#FAF6EE] mt-0.5">
              {products.length}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-[#F5EFEB]/10">
            <div className="text-[10px] text-[#9E9484] font-semibold">Categories</div>
            <div className="text-lg font-black font-mono text-[#FAF6EE] mt-0.5">
              {categories.length}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-[#F5EFEB]/10">
            <div className="text-[10px] text-[#9E9484] font-semibold">Restart Protection</div>
            <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Guaranteed</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-[#F5EFEB]/10">
            <div className="text-[10px] text-[#9E9484] font-semibold">Offline Status</div>
            <div className="text-xs font-bold text-amber-400 mt-1 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Offline Ready</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl glass-button-secondary text-xs font-semibold text-[#FAF6EE] hover:text-white transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Catalog Backup (JSON)</span>
          </button>

          <button
            type="button"
            onClick={refreshData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl glass-button-secondary text-xs font-semibold text-[#D8CFBF] hover:text-[#FAF6EE] transition active:scale-95"
          >
            <span>Verify & Resync Storage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
