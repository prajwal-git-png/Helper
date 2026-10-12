import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, RefreshCw } from 'lucide-react';

interface OfflineIndicatorProps {
  pendingSyncCount?: number;
  onSyncNow?: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  pendingSyncCount = 0,
  onSyncNow,
}) => {
  const isOnline = useOnlineStatus();

  if (isOnline && pendingSyncCount === 0) return null;

  if (!isOnline) {
    return (
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 max-w-md w-[92%] flex items-center justify-between gap-2 rounded-xl bg-amber-600/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-amber-400/40 animate-pulse">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-white" />
          <span>Offline Floor Mode — Cached showroom specs active</span>
        </div>
        {pendingSyncCount > 0 && (
          <span className="bg-amber-950/60 px-2 py-0.5 rounded-full text-[11px] font-mono">
            {pendingSyncCount} queued
          </span>
        )}
      </div>
    );
  }

  // Back online with pending items
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 max-w-md w-[92%] flex items-center justify-between gap-2 rounded-xl bg-emerald-600/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-emerald-400/40">
      <div className="flex items-center gap-2">
        <RefreshCw className="w-4 h-4 text-white animate-spin" />
        <span>Back online — {pendingSyncCount} pending change{pendingSyncCount > 1 ? 's' : ''} to sync</span>
      </div>
      {onSyncNow && (
        <button
          onClick={onSyncNow}
          className="bg-emerald-950/60 hover:bg-emerald-950 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white transition"
        >
          Sync Now
        </button>
      )}
    </div>
  );
};
