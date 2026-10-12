import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  toCanonicalMm,
  fromCanonicalMm,
  convertAllUnits,
  formatValue,
  formatDimension3D,
  DimensionUnit,
  UNIT_LABELS,
  calculateCavityVolumeLitres,
} from '../../utils/dimensionConverter';
import {
  Ruler,
  Layers,
  Check,
  Copy,
  Info,
  ShieldCheck,
  Box,
} from 'lucide-react';

export const DimensionConverterScreen: React.FC = () => {
  const { products } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>('prod-mr-29rcad');
  const [activeInputUnit, setActiveInputUnit] = useState<DimensionUnit>('cm');

  // Input states (initialized from Morphy 29RCAD in cm)
  const [widthInput, setWidthInput] = useState<number>(48.5);
  const [heightInput, setHeightInput] = useState<number>(36.5);
  const [depthInput, setDepthInput] = useState<number>(41.0);

  // Cavity inputs (cm)
  const [cavityWidth, setCavityWidth] = useState<number>(35.2);
  const [cavityHeight, setCavityHeight] = useState<number>(26.0);
  const [cavityDepth, setCavityDepth] = useState<number>(32.0);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // When selecting a preset product, populate inputs
  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    const found = products.find((p) => p.id === id);
    if (found) {
      const fromMm = (valMm: number) =>
        Number(fromCanonicalMm(valMm, activeInputUnit).toFixed(1));

      setWidthInput(fromMm(found.externalDimensions.widthMm));
      setHeightInput(fromMm(found.externalDimensions.heightMm));
      setDepthInput(fromMm(found.externalDimensions.depthMm));

      if (found.internalCavityDimensions) {
        setCavityWidth(fromMm(found.internalCavityDimensions.widthMm));
        setCavityHeight(fromMm(found.internalCavityDimensions.heightMm));
        setCavityDepth(fromMm(found.internalCavityDimensions.depthMm));
      }
    }
  };

  // Convert current input values into canonical mm
  const canonicalExt = {
    width: toCanonicalMm(widthInput, activeInputUnit),
    height: toCanonicalMm(heightInput, activeInputUnit),
    depth: toCanonicalMm(depthInput, activeInputUnit),
  };

  const canonicalCavity = {
    width: toCanonicalMm(cavityWidth, activeInputUnit),
    height: toCanonicalMm(cavityHeight, activeInputUnit),
    depth: toCanonicalMm(cavityDepth, activeInputUnit),
  };

  const extAllUnits = convertAllUnits(canonicalExt, 'mm');
  const calculatedLitres = calculateCavityVolumeLitres(canonicalCavity);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Ruler className="w-6 h-6 text-amber-400" />
          Dimension Sizer Engine
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Exact mathematical conversion across millimetres, centimetres, metres, inches, and feet.
        </p>
      </div>

      {/* Preset Product Selector & Unit Toggle */}
      <div className="p-5 sm:p-6 rounded-3xl glass-panel space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Preset Model:</span>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-pill text-xs text-amber-400 font-semibold focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Unit:</span>
            <div className="flex items-center glass-pill p-0.5 rounded-2xl">
              {(['cm', 'in', 'mm', 'ft', 'm'] as DimensionUnit[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setActiveInputUnit(u)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition active:scale-95 ${
                    activeInputUnit === u
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* External Input Controls */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Box className="w-4 h-4 text-amber-400" />
            <span>External Dimensions ({activeInputUnit})</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-400">Width</label>
              <input
                type="number"
                step="any"
                value={widthInput}
                onChange={(e) => setWidthInput(Math.max(0, Number(e.target.value)))}
                className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400">Height</label>
              <input
                type="number"
                step="any"
                value={heightInput}
                onChange={(e) => setHeightInput(Math.max(0, Number(e.target.value)))}
                className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400">Depth</label>
              <input
                type="number"
                step="any"
                value={depthInput}
                onChange={(e) => setDepthInput(Math.max(0, Number(e.target.value)))}
                className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SIMULTANEOUS ALL-UNITS DISPLAY MATRIX */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            Simultaneous Conversion Matrix
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {Math.round(canonicalExt.width)} × {Math.round(canonicalExt.height)} × {Math.round(canonicalExt.depth)} mm base
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {(['cm', 'in', 'mm', 'ft', 'm'] as DimensionUnit[]).map((u) => {
            const dims = extAllUnits[u];
            const formatted = formatDimension3D(dims, u);
            const isCopied = copiedKey === u;

            return (
              <div
                key={u}
                className="p-4 rounded-3xl glass-panel flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase">
                      {UNIT_LABELS[u]}
                    </span>
                    <button
                      onClick={() => copyToClipboard(formatted, u)}
                      className="text-slate-400 hover:text-white transition active:scale-90"
                      title="Copy formatted dimension"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="text-base font-black text-white mt-1.5 font-mono tracking-tight">
                    {formatted}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono">
                  W: {formatValue(dims.width, u)} · H: {formatValue(dims.height, u)} · D: {formatValue(dims.depth, u)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CAVITY & VOLUME */}
      <div className="p-5 sm:p-6 rounded-3xl glass-panel space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Box className="w-4 h-4 text-sky-400" />
            Cavity Dimensions & Volume
          </h3>
          <span className="text-xs font-bold text-amber-400 font-mono">
            Gross Cavity: {calculatedLitres} Litres
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-slate-400">Cavity Width ({activeInputUnit})</label>
            <input
              type="number"
              step="any"
              value={cavityWidth}
              onChange={(e) => setCavityWidth(Math.max(0, Number(e.target.value)))}
              className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white font-mono focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400">Cavity Height ({activeInputUnit})</label>
            <input
              type="number"
              step="any"
              value={cavityHeight}
              onChange={(e) => setCavityHeight(Math.max(0, Number(e.target.value)))}
              className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white font-mono focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400">Cavity Depth ({activeInputUnit})</label>
            <input
              type="number"
              step="any"
              value={cavityDepth}
              onChange={(e) => setCavityDepth(Math.max(0, Number(e.target.value)))}
              className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white font-mono focus:outline-none"
            />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl glass-pill text-xs text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
          <span>
            Cavity capacity in litres indicates usable internal cooking cavity and tray clearance, distinct from external outer housing dimensions.
          </span>
        </div>
      </div>

      {/* VISUAL COUNTERTOP SCALE SIMULATION */}
      <div className="rounded-3xl glass-panel p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Ruler className="w-4 h-4 text-amber-400" />
            Kitchen Counter Fit Visualizer (60 cm Standard Depth)
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">
            Illustrative Reference
          </span>
        </div>

        <div className="relative h-48 w-full bg-black/40 rounded-2xl border border-white/[0.08] p-4 flex flex-col justify-end overflow-hidden">
          {/* 60cm Countertop Surface */}
          <div className="h-6 w-full bg-gradient-to-r from-stone-800 to-stone-700 rounded-md relative shadow-inner">
            <div className="absolute -top-5 left-2 text-[10px] font-mono text-stone-400">
              Kitchen Counter Slab (60 cm / 24 inch depth standard)
            </div>
          </div>

          {/* Scaled Appliance Box */}
          <div
            style={{ width: '60%', height: '70%' }}
            className="absolute bottom-6 left-6 rounded-2xl glass-panel-elevated border-2 border-amber-400 shadow-2xl flex flex-col items-center justify-center p-2 text-center"
          >
            <div className="text-xs font-bold text-white">
              Appliance Placement
            </div>
            <div className="text-xs font-mono text-amber-300 font-bold mt-0.5">
              {formatValue(extAllUnits.cm.width, 'cm')} × {formatValue(extAllUnits.cm.height, 'cm')} × {formatValue(extAllUnits.cm.depth, 'cm')} cm
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
              ✓ Remaining Front Space: ~{Math.max(0, 60 - extAllUnits.cm.depth).toFixed(1)} cm
            </div>
          </div>

          {/* Reference: 10-inch plate */}
          <div className="absolute bottom-6 right-8 w-20 h-20 rounded-full border border-dashed border-sky-400 bg-sky-400/10 flex items-center justify-center text-center p-1">
            <span className="text-[9px] font-bold text-sky-300 leading-tight">
              10&quot; Plate (25.4 cm)
            </span>
          </div>
        </div>

        {/* Clearance Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-center pt-2">
          <div className="p-3 rounded-2xl glass-pill text-slate-300">
            <strong className="text-amber-400">Rear Clearance:</strong> 10 cm (100 mm) for exhaust ventilation.
          </div>
          <div className="p-3 rounded-2xl glass-pill text-slate-300">
            <strong className="text-amber-400">Side Clearance:</strong> 10 cm (100 mm) on both left and right.
          </div>
          <div className="p-3 rounded-2xl glass-pill text-slate-300">
            <strong className="text-amber-400">Top Clearance:</strong> 15 cm (150 mm) vertical breathing space.
          </div>
        </div>
      </div>
    </div>
  );
};
