import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Lock,
  User,
  Store,
  CheckCircle2,
  X,
  ScanFace,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, currentUser } = useApp();

  const [name, setName] = useState(currentUser.name || 'Rahul Sharma');
  const [storeName, setStoreName] = useState('Indiranagar Showroom, BLR');
  const [pin, setPin] = useState('1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(name, storeName, 'promoter', pin);
    setIsSuccessAnim(true);
    setTimeout(() => {
      setIsSuccessAnim(false);
      onClose();
    }, 700);
  };

  const handleQuickDemo = () => {
    login('Rahul Sharma', 'Indiranagar Flagship, BLR', 'promoter', '1234');
    setIsSuccessAnim(true);
    setTimeout(() => {
      setIsSuccessAnim(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-[32px] glass-panel-elevated p-6 sm:p-7 border border-[#F5EFEB]/15 shadow-2xl relative overflow-hidden text-[#F5EFEB]">
        {/* Subtle top specular accent */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFEB]/30 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass-button-secondary text-[#D8CFBF] hover:text-[#FAF6EE] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Icon */}
        <div className="flex flex-col items-center text-center space-y-2 mt-1">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 p-[1px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full rounded-2xl bg-black/85 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold font-display text-[#FAF6EE] tracking-tight">
            Sales Promoter Sign In
          </h2>
          <p className="text-xs text-[#D8CFBF]">
            Manage products, customer showroom presentations, and offline recipes.
          </p>
        </div>

        {/* Success State Flash */}
        {isSuccessAnim ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
            <p className="text-sm font-bold text-[#FAF6EE]">Signed in successfully</p>
            <p className="text-xs text-[#D8CFBF]">Welcome back, {name}!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#D8CFBF] flex items-center gap-1.5">
                <User className="w-3 h-3 text-amber-400" />
                <span>Your Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] placeholder-[#9E9484] focus:outline-none focus:border-amber-400/80 transition"
              />
            </div>

            {/* Store Location */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#D8CFBF] flex items-center gap-1.5">
                <Store className="w-3 h-3 text-amber-400" />
                <span>Store / Showroom Location</span>
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Indiranagar Showroom"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] placeholder-[#9E9484] focus:outline-none focus:border-amber-400/80 transition"
              />
            </div>

            {/* Quick PIN */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#D8CFBF] flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Access PIN</span>
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                maxLength={8}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-black/60 border border-[#F5EFEB]/15 text-xs text-[#FAF6EE] placeholder-[#9E9484] tracking-widest focus:outline-none focus:border-amber-400/80 font-mono transition"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#D8CFBF]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-black/80 border-[#F5EFEB]/20 text-amber-500 focus:ring-0"
                />
                <span>Keep me signed in</span>
              </label>
              <span className="text-[10px] text-amber-400/80 font-medium">Permanent Save</span>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl glass-button-primary font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition text-black"
              >
                <span>Sign In to Showroom</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full py-2.5 rounded-2xl glass-button-secondary font-medium text-xs flex items-center justify-center gap-2 text-[#FAF6EE] hover:text-white active:scale-95 transition"
              >
                <ScanFace className="w-4 h-4 text-amber-400" />
                <span>Quick Face ID / 1-Tap Login</span>
              </button>
            </div>

            {/* Safety badge */}
            <div className="pt-2 text-center flex items-center justify-center gap-1 text-[10px] text-[#9E9484]">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Offline Ready · Stored Permanently on Device</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
