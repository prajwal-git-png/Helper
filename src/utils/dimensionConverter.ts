/**
 * Dimension Conversion Engine
 * 
 * Exact constants defined by product specifications:
 * - 1 inch = 2.54 cm (25.4 mm)
 * - 1 foot = 12 inches (304.8 mm)
 * - 1 metre = 100 cm (1000 mm)
 * - 1 cm = 10 mm
 * 
 * Canonical internal unit: Millimetres (mm) to prevent cumulative rounding errors.
 */

export type DimensionUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';

export const UNIT_LABELS: Record<DimensionUnit, string> = {
  mm: 'Millimetres (mm)',
  cm: 'Centimetres (cm)',
  m: 'Metres (m)',
  in: 'Inches (in)',
  ft: 'Feet (ft)',
};

export const UNIT_SHORT_LABELS: Record<DimensionUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  m: 'm',
  in: 'in',
  ft: 'ft',
};

// Exact conversion rates relative to canonical base unit: 1 mm
const MM_PER_UNIT: Record<DimensionUnit, number> = {
  mm: 1,
  cm: 10,
  m: 1000,
  in: 25.4, // 2.54 cm * 10 mm/cm = 25.4 mm
  ft: 304.8, // 12 in * 25.4 mm/in = 304.8 mm
};

/**
 * Converts a value from any supported unit to canonical millimetres (mm).
 */
export function toCanonicalMm(value: number, fromUnit: DimensionUnit): number {
  if (isNaN(value) || value < 0) return 0;
  return value * MM_PER_UNIT[fromUnit];
}

/**
 * Converts canonical millimetres (mm) to any target unit.
 */
export function fromCanonicalMm(mmValue: number, toUnit: DimensionUnit): number {
  if (isNaN(mmValue) || mmValue < 0) return 0;
  return mmValue / MM_PER_UNIT[toUnit];
}

/**
 * Converts a linear measurement from one unit directly to another without rounding drift.
 */
export function convertLength(value: number, fromUnit: DimensionUnit, toUnit: DimensionUnit): number {
  if (fromUnit === toUnit) return value;
  const canonicalMm = toCanonicalMm(value, fromUnit);
  const raw = fromCanonicalMm(canonicalMm, toUnit);
  // Normalize IEEE-754 floating point arithmetic precision
  return Math.round(raw * 100000000) / 100000000;
}

export interface Dimension3D {
  width: number;
  height: number;
  depth: number;
}

/**
 * Converts a 3D dimension object into all 5 units simultaneously.
 */
export function convertAllUnits(dims: Dimension3D, fromUnit: DimensionUnit): Record<DimensionUnit, Dimension3D> {
  const canonical: Dimension3D = {
    width: toCanonicalMm(dims.width, fromUnit),
    height: toCanonicalMm(dims.height, fromUnit),
    depth: toCanonicalMm(dims.depth, fromUnit),
  };

  const units: DimensionUnit[] = ['mm', 'cm', 'm', 'in', 'ft'];
  const result = {} as Record<DimensionUnit, Dimension3D>;

  for (const unit of units) {
    result[unit] = {
      width: fromCanonicalMm(canonical.width, unit),
      height: fromCanonicalMm(canonical.height, unit),
      depth: fromCanonicalMm(canonical.depth, unit),
    };
  }

  return result;
}

/**
 * Format a measurement with sensible decimal precision per unit.
 */
export function formatValue(value: number, unit: DimensionUnit): string {
  switch (unit) {
    case 'mm':
      return Math.round(value).toString();
    case 'cm':
      return value.toFixed(1);
    case 'm':
      return value.toFixed(2);
    case 'in':
      return value.toFixed(1);
    case 'ft':
      return value.toFixed(2);
    default:
      return value.toFixed(1);
  }
}

/**
 * Format 3D dimensions as a clean readable label: e.g. "45.0 × 38.5 × 35.0 cm"
 */
export function formatDimension3D(dims: Dimension3D, unit: DimensionUnit): string {
  const w = formatValue(dims.width, unit);
  const h = formatValue(dims.height, unit);
  const d = formatValue(dims.depth, unit);
  const u = UNIT_SHORT_LABELS[unit];
  return `${w} × ${h} × ${d} ${u}`;
}

/**
 * Calculates theoretical volume in Litres from cavity dimensions in millimetres.
 * 1 Litre = 1,000,000 mm³
 */
export function calculateCavityVolumeLitres(cavityMm: Dimension3D): number {
  if (cavityMm.width <= 0 || cavityMm.height <= 0 || cavityMm.depth <= 0) return 0;
  const volumeMm3 = cavityMm.width * cavityMm.height * cavityMm.depth;
  return Number((volumeMm3 / 1_000_000).toFixed(1));
}
