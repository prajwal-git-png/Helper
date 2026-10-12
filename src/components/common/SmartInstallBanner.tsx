import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Smartphone, Download, X, Share, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';

export const SmartInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    try {
      const dismissed = sessionStorage.getItem('ssp_install_banner_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    } catch {
      // sessionStorage unavailable
    }

    // Delay prompt appearance slightly for a smooth entrance
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('ssp_install_banner_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome === 'accepted') {
        setIsDismissed(true);
        return;
      }
    }
    // If iOS Safari or browser requires manual step
    setShowGuideModal(true);
  };

  // If already installed or dismissed or initial delay hasn't finished
  if (isInstalled || isDismissed || !hasPrompted) {
    return (
      <>
        {showGuideModal && (
          <InstallGuideModal
            isIOS={isIOS}
            isAndroid={isAndroid}
            onClose={() => setShowGuideModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      {/* Floating Smart Install Invite Card (Mobile-First) */}
      <aside
        aria-label="App installation banner"
        className="fixed top-14 sm:top-16 inset-x-3 sm:inset-x-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-top-4 fade-in duration-300"
      >
        <div className="rounded-2xl p-3 sm:p-3.5 glass-panel-elevated border border-[var(--border-highlight)] shadow-2xl backdrop-blur-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent-primary)] flex-shrink-0 shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold font-display text-[var(--text-primary)] truncate">
                  Install Showroom App
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold bg-[var(--accent-subtle)] text-[var(--accent-primary)]">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                Fast 1-tap launch & offline catalog on phone
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl glass-button-primary text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition"
              title="Install application"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {showGuideModal && (
        <InstallGuideModal
          isIOS={isIOS}
          isAndroid={isAndroid}
          onClose={() => setShowGuideModal(false)}
        />
      )}
    </>
  );
};

export const InstallGuideModal: React.FC<{
  isIOS: boolean;
  isAndroid: boolean;
  onClose: () => void;
}> = ({ isIOS, isAndroid, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-[28px] glass-panel-elevated p-6 border border-[var(--border-color)] shadow-2xl relative text-[var(--text-primary)]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent-primary)] flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display text-[var(--text-primary)]">
                {isIOS ? 'Install on iPhone / iPad' : 'Install on Android / Phone'}
              </h3>
              <p className="text-[10px] text-[var(--text-muted)]">
                Add to Home Screen as a native showroom app
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3.5 text-xs text-[var(--text-secondary)]">
          {isIOS ? (
            <>
              <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <p className="leading-snug">
                  In Safari toolbar at the bottom, tap the <strong className="text-[var(--text-primary)] font-semibold">Share</strong> button (box with upward arrow <Share className="w-3.5 h-3.5 inline mx-0.5 text-[var(--accent-primary)]" />).
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <p className="leading-snug">
                  Scroll down the share sheet and tap <strong className="text-[var(--text-primary)] font-semibold">Add to Home Screen</strong>.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <p className="leading-snug">
                  Tap <strong className="text-[var(--text-primary)] font-semibold">Add</strong> in the top right. The app will launch with full-screen customer showroom mode!
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <p className="leading-snug">
                  Tap the browser menu (<strong className="text-[var(--text-primary)] font-semibold">⋮</strong> three vertical dots) in Chrome / Samsung Internet.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <p className="leading-snug">
                  Select <strong className="text-[var(--text-primary)] font-semibold">Install App</strong> or <strong className="text-[var(--text-primary)] font-semibold">Add to Home screen</strong>.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <p className="leading-snug">
                  Confirm to install. Smart Sales Promoter will appear as an app on your phone with full offline capability!
                </p>
              </div>
            </>
          )}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl glass-button-primary text-xs font-bold shadow-md active:scale-95 transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
