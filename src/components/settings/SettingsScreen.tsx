import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Store,
  HardDrive,
  RefreshCw,
  Globe,
  Trash2,
  Download,
  Clock,
  UserCheck,
} from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { LanguageCode } from '../../types/index';

export const SettingsScreen: React.FC = () => {
  const {
    currentOrg,
    currentStore,
    currentUser,
    userRole,
    users,
    switchUser,
    language,
    setLanguage,
    auditLogs,
    offlineStats,
    offlineQueue,
    triggerOfflineSync,
    clearOfflineStorage,
    downloadProductOffline,
    products,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'offline' | 'audit'>('profile');
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const handleManualSync = async () => {
    setSyncStatusMsg('Syncing offline queue with server...');
    await triggerOfflineSync();
    setSyncStatusMsg('All offline floor changes successfully synced with server!');
    setTimeout(() => setSyncStatusMsg(null), 3000);
  };

  const handleCacheAll = () => {
    products.forEach((p) => downloadProductOffline(p.id));
    setSyncStatusMsg('All catalogue items cached for offline floor presentation!');
    setTimeout(() => setSyncStatusMsg(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          Settings & Showroom Management
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Tenant isolation, role permissions, offline storage controls, and system audit trails.
        </p>
      </div>

      {syncStatusMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>{syncStatusMsg}</span>
        </div>
      )}

      {/* iOS Segmented Navigation Bar */}
      <div className="grid grid-cols-3 gap-1 p-1 glass-pill rounded-2xl">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-2 px-3 rounded-xl text-xs font-semibold transition active:scale-95 ${
            activeTab === 'profile'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          User & Roles
        </button>
        <button
          onClick={() => setActiveTab('offline')}
          className={`py-2 px-3 rounded-xl text-xs font-semibold transition active:scale-95 ${
            activeTab === 'offline'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Offline & PWA
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-2 px-3 rounded-xl text-xs font-semibold transition active:scale-95 ${
            activeTab === 'audit'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Audit History ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === 'profile' && (
        <div className="space-y-5">
          {/* Active Profile Card */}
          <div className="rounded-3xl glass-panel p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover border border-white/10"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{currentUser.name}</h3>
                  <span className="text-xs text-amber-400 font-semibold">
                    · {t.roles[userRole]}
                  </span>
                </div>
                <div className="text-xs text-slate-400">{currentUser.email}</div>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentStore.name} ({currentOrg.name})</span>
                </div>
              </div>
            </div>

            <PWAInstallButton />
          </div>

          {/* User Switcher */}
          <div className="rounded-3xl glass-panel p-6 space-y-4 shadow-xl">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                Multi-Tenant User & Role Switcher
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch between sales promoter, store manager, and org admin to test permissions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {users.map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => switchUser(u.id)}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between gap-3 active:scale-95 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 shadow-sm'
                        : 'glass-pill hover:bg-white/[0.08]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{u.name}</div>
                      <div className="text-[11px] text-amber-400 font-mono">
                        {t.roles[u.role]}
                      </div>
                      <div className="text-[10px] text-slate-400">{u.email}</div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Preference */}
          <div className="rounded-3xl glass-panel p-6 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              Showroom Language Preference
            </h3>
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {[
                { code: 'en' as LanguageCode, label: 'English' },
                { code: 'kn' as LanguageCode, label: 'ಕನ್ನಡ (Kannada)' },
                { code: 'hi' as LanguageCode, label: 'हिन्दी (Hindi)' },
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  className={`p-3 rounded-2xl text-xs font-bold transition text-center active:scale-95 ${
                    language === item.code
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'glass-pill text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OFFLINE & PWA */}
      {activeTab === 'offline' && (
        <div className="space-y-5">
          <div className="rounded-3xl glass-panel p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-amber-400" />
              Offline PWA Storage Status
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Essential product specifications and customer presentation mode are cached locally so sales promoters can demonstrate appliances on the sales floor even when cellular internet drops.
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl glass-pill text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Cached Models</span>
                <div className="text-2xl font-black text-amber-400 mt-1">
                  {offlineStats.cachedCount}
                </div>
              </div>
              <div className="p-4 rounded-2xl glass-pill text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Storage Size</span>
                <div className="text-2xl font-black text-white mt-1">
                  ~{offlineStats.sizeKb} KB
                </div>
              </div>
              <div className="p-4 rounded-2xl glass-pill text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Queue</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {offlineQueue.length}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={handleCacheAll}
                className="px-4 py-2.5 rounded-2xl glass-button-secondary text-xs font-semibold text-white active:scale-95 transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Cache All Products</span>
              </button>

              <button
                onClick={handleManualSync}
                disabled={offlineQueue.length === 0}
                className="px-4 py-2.5 rounded-2xl glass-button-primary text-slate-950 text-xs font-bold active:scale-95 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Sync Offline Queue ({offlineQueue.length})</span>
              </button>

              <button
                onClick={clearOfflineStorage}
                className="px-4 py-2.5 rounded-2xl glass-pill text-slate-400 hover:text-red-400 text-xs font-semibold active:scale-95 transition flex items-center gap-1.5 ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT HISTORY */}
      {activeTab === 'audit' && (
        <div className="rounded-3xl glass-panel p-6 space-y-4 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Catalogue Modification & Audit Log
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified specification edits, pricing overrides, and user approvals.
            </p>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl glass-pill space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 font-mono">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-slate-200">{log.details}</div>
                <div className="text-[10px] text-slate-500">
                  By: {log.userName} · Target: {log.entityType} ({log.entityId})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
