import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, Check } from 'lucide-react';
import { InstallGuideModal } from './SmartInstallBanner';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running as an installed PWA
  if (isInstalled) {
    if (compact) return null;
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
        <Check className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Installed PWA</span>
      </div>
    );
  }

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome === 'accepted') return;
    }
    setShowGuide(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={
          compact
            ? 'p-1.5 rounded-xl text-[var(--accent-primary)] hover:bg-[var(--bg-subtle)] transition flex items-center gap-1 text-xs font-semibold'
            : 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-button-primary text-xs font-bold shadow-sm active:scale-95 transition'
        }
        title="Install Smart Sales Promoter on your phone or device"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>

      {showGuide && (
        <InstallGuideModal
          isIOS={isIOS}
          isAndroid={isAndroid}
          onClose={() => setShowGuide(false)}
        />
      )}
    </>
  );
};
