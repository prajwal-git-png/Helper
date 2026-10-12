import { describe, it, expect } from 'vitest';
import {
  convertLength,
  convertAllUnits,
  formatValue,
  formatDimension3D,
  calculateCavityVolumeLitres
} from '../src/utils/dimensionConverter';

describe('Dimension Conversion Engine', () => {
  it('converts 45 cm to inches accurately (acceptance test)', () => {
    const inches = convertLength(45, 'cm', 'in');
    // 45 / 2.54 = 17.716535...
    expect(inches).toBeCloseTo(17.7165, 4);
    expect(formatValue(inches, 'in')).toBe('17.7');
  });

  it('converts 45 cm to feet accurately (acceptance test)', () => {
    const feet = convertLength(45, 'cm', 'ft');
    // (45 / 2.54) / 12 = 1.476377...
    expect(feet).toBeCloseTo(1.4764, 4);
    expect(formatValue(feet, 'ft')).toBe('1.48');
  });

  it('converts 1 inch to exact 2.54 cm', () => {
    const cm = convertLength(1, 'in', 'cm');
    expect(cm).toBe(2.54);
  });

  it('converts 1 foot to exact 12 inches and 30.48 cm', () => {
    const inches = convertLength(1, 'ft', 'in');
    expect(inches).toBe(12);

    const cm = convertLength(1, 'ft', 'cm');
    expect(cm).toBe(30.48);
  });

  it('converts 1 metre to 100 cm and 1000 mm', () => {
    expect(convertLength(1, 'm', 'cm')).toBe(100);
    expect(convertLength(1, 'm', 'mm')).toBe(1000);
  });

  it('calculates cavity volume in litres accurately', () => {
    // 350mm x 250mm x 330mm = 28,875,000 mm³ = 28.875 Litres (~28.9 L)
    const volume = calculateCavityVolumeLitres({ width: 350, height: 250, depth: 330 });
    expect(volume).toBe(28.9);
  });

  it('formats dimensions with clean unit strings', () => {
    const formatted = formatDimension3D({ width: 450, height: 350, depth: 380 }, 'mm');
    expect(formatted).toBe('450 × 350 × 380 mm');
  });
});
